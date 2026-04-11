// Release scraper orchestrator.
//
// Walks every registered adapter, calls fetch(), normalizes
// the events, matches each one to a river_id in our database,
// writes new rows to scraped_releases, and returns a structured
// per-adapter report.
//
// Adapters live in this directory and self-register by being
// imported into the SCRAPERS array below. To add one: write a
// new file that exports a ReleaseScraper, import it here, add
// it to the array. The cron at /api/cron/release-scrapers
// picks it up automatically.
//
// Why a separate scraped_releases table (not the same store as
// data/dam-releases.ts):
//   - Hand-curated data has known provenance and we can stand
//     behind it. Scraped data has unknown reliability until
//     we've seen the source's update cadence.
//   - Adapters can be wrong. Letting bad scraped data overwrite
//     hand-verified entries would be destructive.
//   - The /releases page reads from BOTH sources at render time
//     and merges them, so users see scraped data alongside
//     curated data without either contaminating the other.

import { createClient } from '@supabase/supabase-js'
import { ALL_RIVERS } from '@/data/rivers'
import type { ReleaseScraper, RawReleaseEvent, AdapterResult, OrchestratorReport } from './types'
import { exampleStubScraper } from './example-stub'

// scraped_releases isn't in the live database schema until
// migration 030 is applied, so the supabase client's generated
// types don't know about it. We use ts-expect-error casts on
// the table writes below — the runtime calls are correct, only
// the type checker is missing context.

// Add new adapters here. Order doesn't matter — the orchestrator
// runs each one independently and reports per-adapter results.
const SCRAPERS: ReleaseScraper[] = [
  exampleStubScraper,
  // When a real source becomes available, instantiate its
  // adapter and add it here. e.g.
  //   import { wiDnrReleases } from './arcgis-template'
  //   wiDnrReleases,
]

export async function runReleaseScrapers(): Promise<OrchestratorReport> {
  const startedAt = new Date()
  const adapters: AdapterResult[] = []
  let totalFetched = 0
  let totalInserted = 0

  // Build the river name index ONCE for fuzzy matching, shared
  // across all adapters.
  const nameIndex = buildNameIndex()

  // Lazy-init the supabase client only if at least one adapter
  // is enabled. Saves a round-trip in the common "all stubs"
  // case.
  const enabledAdapters = SCRAPERS.filter(s => s.enabled)
  let supabase: ReturnType<typeof createClient> | null = null
  if (enabledAdapters.length > 0) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !serviceKey) {
      // Fail loudly — running an enabled adapter without service
      // role would just produce empty inserts.
      return {
        ok: false,
        fetchedAt: startedAt.toISOString(),
        adapters: SCRAPERS.map(s => ({
          id: s.id,
          name: s.name,
          enabled: s.enabled,
          ok: false,
          fetched: 0,
          matched: 0,
          inserted: 0,
          skippedDuplicate: 0,
          skippedUnmatched: 0,
          unmatchedSamples: [],
          error: 'SUPABASE_SERVICE_ROLE_KEY not configured',
        })),
        totalFetched: 0,
        totalInserted: 0,
      }
    }
    supabase = createClient(url, serviceKey, { auth: { persistSession: false } })
  }

  for (const scraper of SCRAPERS) {
    const result: AdapterResult = {
      id: scraper.id,
      name: scraper.name,
      enabled: scraper.enabled,
      ok: true,
      fetched: 0,
      matched: 0,
      inserted: 0,
      skippedDuplicate: 0,
      skippedUnmatched: 0,
      unmatchedSamples: [],
    }

    // Skip disabled adapters cleanly. They show up in the report
    // but don't count as failures.
    if (!scraper.enabled) {
      adapters.push(result)
      continue
    }

    try {
      const events = await scraper.fetch()
      result.fetched = events.length
      totalFetched += events.length

      const matched: Array<{ event: RawReleaseEvent; riverId: string }> = []
      const unmatched: Array<{ name: string; date: string }> = []

      for (const event of events) {
        const riverId = fuzzyMatch(event.waterBodyName, nameIndex)
        if (riverId) {
          matched.push({ event, riverId })
        } else if (unmatched.length < 50) {
          unmatched.push({ name: event.waterBodyName, date: event.date })
        }
      }

      result.matched = matched.length
      result.skippedUnmatched = events.length - matched.length
      result.unmatchedSamples = unmatched

      if (matched.length > 0 && supabase) {
        const inserts = matched.map(({ event, riverId }) => ({
          source_id: scraper.id,
          source_record_id: event.sourceRecordId,
          river_id: riverId,
          release_date: event.date,
          start_time: event.startTime || null,
          end_time: event.endTime || null,
          expected_cfs: event.expectedCfs ?? null,
          release_name: event.releaseName || null,
          agency: scraper.agency,
          notes: event.notes || null,
          fetched_at: new Date().toISOString(),
        }))

        // Application-level dedupe — same trick as the DNR
        // stocking pipeline. Read existing source_record_ids
        // for this source, filter out the duplicates, plain
        // INSERT the rest. Avoids the PostgREST upsert /
        // partial-index footgun from the DNR refactor.
        const sourceIds = inserts.map(i => i.source_record_id)
        const { data: existing, error: existingErr } = await supabase
          .from('scraped_releases')
          .select('source_record_id')
          .eq('source_id', scraper.id)
          .in('source_record_id', sourceIds)

        if (existingErr) throw new Error(`select existing: ${existingErr.message}`)

        const existingSet = new Set((existing || []).map((r: { source_record_id: string }) => r.source_record_id))
        const newRows = inserts.filter(i => !existingSet.has(i.source_record_id))

        result.skippedDuplicate = inserts.length - newRows.length

        if (newRows.length > 0) {
          // The supabase generated types don't include
          // scraped_releases yet (migration 030 isn't reflected
          // in the type generation), so the insert payload
          // resolves to `never`. Cast the client to bypass —
          // the runtime call is correct, only the type system
          // is missing context.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const sb = supabase as any
          const { data: insertedRows, error: insertErr } = await sb
            .from('scraped_releases')
            .insert(newRows)
            .select('id')
          if (insertErr) throw new Error(`insert: ${insertErr.message}`)
          result.inserted = insertedRows?.length ?? 0
          totalInserted += result.inserted
        }
      }
    } catch (err) {
      result.ok = false
      result.error = err instanceof Error ? err.message : String(err)
    }

    adapters.push(result)
  }

  return {
    ok: adapters.every(a => a.ok),
    fetchedAt: startedAt.toISOString(),
    adapters,
    totalFetched,
    totalInserted,
  }
}

// ── Fuzzy name matching (mirrors the DNR stocking matcher) ──

function buildNameIndex(): Map<string, string> {
  const idx = new Map<string, string>()
  for (const r of ALL_RIVERS) {
    const norm = normalizeName(r.n)
    if (norm) idx.set(norm, r.id)
    const idStripped = r.id.replace(/_(?:mi|wi|mn|in|il|wv|tn|va|ny|ga|ks|ne|nc|sc|al|ms|ar|mo|ia|me|ma|nh|vt|ct|ri|nj|de|md|pa|oh|ok|tx|nv|az|ut|nm|wy|mt|id|or|wa|ca|co|ak|hi|sd|nd|fl|ky|la)$/, '').replace(/_/g, ' ')
    if (idStripped !== norm) idx.set(idStripped, r.id)
  }
  return idx
}

function fuzzyMatch(waterBodyName: string, nameIndex: Map<string, string>): string | null {
  const norm = normalizeName(waterBodyName)
  if (!norm) return null
  return nameIndex.get(norm) ?? null
}

function normalizeName(s: string): string {
  return s
    .toLowerCase()
    .replace(/\bbr\b\.?/g, 'branch')
    .replace(/\bn\b\.?/g, 'north')
    .replace(/\bs\b\.?/g, 'south')
    .replace(/\be\b\.?/g, 'east')
    .replace(/\bw\b\.?/g, 'west')
    .replace(/\b(river|creek|stream|lake|branch|fork|main)\b/g, '')
    .replace(/\b(north|south|east|west|upper|middle|lower|big|little|main)\b/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}
