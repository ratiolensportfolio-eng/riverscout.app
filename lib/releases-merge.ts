// Merges hand-curated releases (data/dam-releases.ts) with
// scraped releases (scraped_releases table) into a single
// flat array. Used by the /releases page and the next-release
// callout on river detail pages.
//
// Why merging happens at read time, not at write time:
//
//   - Hand-curated entries are append-only and trusted. We
//     never want a scraper to overwrite or delete one.
//   - Scraped entries can be wrong, can change format, can
//     stop arriving entirely. Treating them as ephemeral
//     read-time augmentation means we can disable a flaky
//     adapter without losing data.
//   - When the same release appears in both sources (rare,
//     but possible if the user manually curates a release
//     and a scraper later picks it up), the curated one
//     wins. The merge dedupes by (river_id, date) preferring
//     the curated source.

import { createClient } from '@supabase/supabase-js'
import { DAM_RELEASES } from '@/data/dam-releases'
import type { DamRelease } from '@/types'

interface ScrapedReleaseRow {
  id: string
  source_id: string
  source_record_id: string
  river_id: string
  release_date: string
  start_time: string | null
  end_time: string | null
  expected_cfs: number | null
  release_name: string | null
  agency: string
  notes: string | null
}

// Read the scraped_releases table and convert each row to the
// same DamRelease shape used by the rest of the codebase.
// Failures (table doesn't exist yet, network glitch, RLS
// rejection) return an empty array — the caller still gets
// the hand-curated data.
async function fetchScrapedReleases(): Promise<DamRelease[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) return []

  try {
    const supabase = createClient(url, anonKey, { auth: { persistSession: false } })
    const { data, error } = await supabase
      .from('scraped_releases')
      .select('id, source_id, source_record_id, river_id, release_date, start_time, end_time, expected_cfs, release_name, agency, notes')
      .gte('release_date', new Date().toISOString().slice(0, 10))
      .order('release_date', { ascending: true })
      .limit(1000)
    if (error) {
      // Migration 030 may not be applied yet — that's fine,
      // just return nothing and let the curated data carry
      // the page.
      return []
    }
    return (data ?? []).map((r: ScrapedReleaseRow): DamRelease => ({
      id: `scraped::${r.source_id}::${r.source_record_id}`,
      riverId: r.river_id,
      name: r.release_name || `${r.agency} Release`,
      date: r.release_date,
      startTime: r.start_time ?? undefined,
      endTime: r.end_time ?? undefined,
      expectedCfs: r.expected_cfs ?? undefined,
      agency: r.agency,
      // No source URL on the scraped row — point at the
      // generic /releases page so the user can verify via
      // the calendar.
      sourceUrl: 'https://riverscout.app/releases',
      notes: r.notes ?? undefined,
    }))
  } catch {
    return []
  }
}

// Public entry point. Returns the union of hand-curated and
// scraped releases, with curated entries winning on collision.
// Cached briefly so a single page render with multiple callers
// only hits the database once. (Not implemented yet — for now,
// each call hits the DB. Page-level memoization can come later
// if it shows up in a Vercel function-time profile.)
export async function getAllReleases(): Promise<DamRelease[]> {
  const scraped = await fetchScrapedReleases()

  // Build a (river_id, date) key for the curated entries so
  // we can dedupe scraped collisions.
  const curatedKeys = new Set<string>()
  for (const r of DAM_RELEASES) {
    curatedKeys.add(`${r.riverId}::${r.date}`)
  }

  const dedupedScraped = scraped.filter(s => !curatedKeys.has(`${s.riverId}::${s.date}`))

  return [...DAM_RELEASES, ...dedupedScraped].sort((a, b) => a.date.localeCompare(b.date))
}

// Same as getNextReleaseForRiver in data/dam-releases.ts but
// also reads scraped data. Used by the river-detail-page
// "Next release" callout so scraper-pulled releases show up
// the same as hand-curated ones.
export async function getNextReleaseForRiverMerged(riverId: string, now?: Date): Promise<DamRelease | null> {
  const all = await getAllReleases()
  const today = (now ?? new Date()).toISOString().slice(0, 10)
  return all
    .filter(r => r.riverId === riverId && r.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))[0] ?? null
}
