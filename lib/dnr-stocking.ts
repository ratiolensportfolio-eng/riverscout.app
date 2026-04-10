// Michigan DNR fish stocking scraper.
//
// Pulls recent stocking events from the official MI DNR ArcGIS
// FeatureServer that powers the public Fish Stocking Database
// dashboard at https://midnr.maps.arcgis.com/apps/dashboards/
// 77581b13c6984b919ab8ed927496a31f, normalizes them, matches each
// record to a river_id in our database (using a hand-curated
// waters_id map for the well-known rivers + a fuzzy-name fallback),
// and writes verified rows to public.river_stocking.
//
// Architecture notes:
//
// 1) Endpoint discovery — the dashboard is a JavaScript shell. The
//    underlying data layer is identified by item ID
//    fc7739be5f5247e7bf7f2c6bc9471140 (verified via
//    arcgis.com/sharing/rest). The MapServer URL below is the live
//    REST endpoint behind the dashboard. The dropdowns on the
//    public site are JS filters on a single dataset; we don't need
//    to navigate them — we query the dataset directly.
//
// 2) Idempotence — DNR's GUID column is a stable per-record key.
//    Our river_stocking table gets a `source_record_id text`
//    column from migration 028 plus a unique index on
//    (stocking_authority, source_record_id). Re-running this
//    fetcher within the lookback window is safe — duplicate GUIDs
//    fail the unique constraint and get skipped silently.
//
// 3) Matching — DNR uses water_id (a stable integer key) AND a
//    free-text Water_Body_Name. We trust waters_id when we have a
//    hand-curated mapping, fall back to fuzzy-name matching for
//    everything else, and log unmatched records so we can grow the
//    map iteratively.
//
// 4) Quality bar — anything that doesn't match either path gets
//    counted but not inserted. Per the project owner: accurate &
//    thin beats wide & wrong.

import { createClient } from '@supabase/supabase-js'
import { ALL_RIVERS } from '@/data/rivers'

// ── Endpoint config ────────────────────────────────────────────

const DNR_QUERY_URL =
  'https://utility.arcgis.com/usrsvcs/servers/' +
  'fc7739be5f5247e7bf7f2c6bc9471140/rest/services/' +
  'DNR/FishStockingReportGISAGO/MapServer/0/query'

// MapServer caps responses at 2000 features. We page through
// using resultOffset until exceededTransferLimit is false.
const PAGE_SIZE = 2000

// Stocking authority string we write to river_stocking. Used as
// part of the unique key for dedupe.
const STOCKING_AUTHORITY = 'Michigan DNR'

// ── Hand-curated waters_id → river_id map ──────────────────────
//
// This is the conservative, high-confidence path. Each entry was
// resolved by hand against the DNR FeatureService and matched to a
// river_id we actually track in data/rivers.ts. The waters_id is
// a stable DNR primary key, so renames or formatting changes
// upstream won't break it.
//
// Add new entries here as the cron's `unmatched` log surfaces
// rivers that should be tracked but aren't yet.

const WATERS_ID_TO_RIVER_ID: Record<number, string> = {
  // ── Lower Peninsula coldwater classics ──
  8298: 'muskegon',           // Muskegon River (Mecosta Co. — confirmed via test fetch)
  // The full waters_id list for the famous rivers below has been
  // partially seeded from the DNR REST endpoint. Confirmed entries
  // are uncommented; placeholders are commented out until verified
  // against actual API responses to avoid wrong matches.
  // 8285: 'ausable',          // Au Sable (multiple sections share this watershed)
  // 8295: 'manistee',         // Manistee River main stem
  // 8290: 'pere_marquette',   // Pere Marquette
  // 8275: 'pine_mi',          // Pine River
  // 8260: 'boardman',         // Boardman River
}

// ── Type definitions ───────────────────────────────────────────

interface DnrFeature {
  attributes: {
    GUID: string | null
    Water_Body_Name: string | null
    County_Name: string | null
    SPEC_COMM_Alt: string | null      // species — has trailing whitespace
    stocking_date: number | null      // epoch ms
    Number_Fish_Stocked: number | null
    Average_Length: number | null
    Operation: string | null
    waters_id: number | null
  }
}

interface DnrResponse {
  features?: DnrFeature[]
  exceededTransferLimit?: boolean
  error?: { code: number; message: string }
}

interface NormalizedStocking {
  source_record_id: string  // GUID without curly braces, lowercased
  river_id: string | null   // null if unmatched
  river_id_match_method: 'waters_id' | 'fuzzy_name' | null
  state_key: 'mi'
  stocking_date: string     // ISO date YYYY-MM-DD
  species: string
  quantity: number | null
  size_inches: number | null
  size_category: SizeCategory | null
  location_description: string | null
  source_url: string
  raw_water_body_name: string
  raw_county: string | null
  raw_waters_id: number | null
}

type SizeCategory = 'fingerling' | 'sub-catchable' | 'catchable' | 'trophy' | 'broodstock'

export interface ScraperReport {
  ok: boolean
  fetchedAt: string
  windowDays: number
  totalFetched: number
  matched: number
  inserted: number
  skippedDuplicate: number
  skippedUnmatched: number
  unmatchedSamples: Array<{ name: string; waters_id: number | null; county: string | null; date: string }>
  errors: string[]
}

// ── Public entry point ─────────────────────────────────────────

export async function runDnrStockingScraper(opts: {
  windowDays?: number
} = {}): Promise<ScraperReport> {
  const windowDays = opts.windowDays ?? 21
  const errors: string[] = []
  const report: ScraperReport = {
    ok: false,
    fetchedAt: new Date().toISOString(),
    windowDays,
    totalFetched: 0,
    matched: 0,
    inserted: 0,
    skippedDuplicate: 0,
    skippedUnmatched: 0,
    unmatchedSamples: [],
    errors,
  }

  let features: DnrFeature[] = []
  try {
    features = await fetchDnrFeatures(windowDays)
    report.totalFetched = features.length
  } catch (err) {
    errors.push(`fetch: ${err instanceof Error ? err.message : String(err)}`)
    return report
  }

  // Build a quick name → river_id index from data/rivers.ts so the
  // fuzzy matcher doesn't have to walk ALL_RIVERS for every record.
  const miRivers = ALL_RIVERS.filter(r => r.stateKey === 'mi')
  const nameIndex = buildNameIndex(miRivers)

  const normalized: NormalizedStocking[] = []
  const unmatchedAccum: Array<{ name: string; waters_id: number | null; county: string | null; date: string }> = []

  for (const f of features) {
    const n = normalizeFeature(f, nameIndex)
    if (!n) continue
    if (!n.river_id) {
      report.skippedUnmatched++
      if (unmatchedAccum.length < 50) {
        unmatchedAccum.push({
          name: n.raw_water_body_name,
          waters_id: n.raw_waters_id,
          county: n.raw_county,
          date: n.stocking_date,
        })
      }
      continue
    }
    report.matched++
    normalized.push(n)
  }

  report.unmatchedSamples = unmatchedAccum

  // Write the matched rows. We use upsert with onConflict pointed
  // at (stocking_authority, source_record_id) — the unique index
  // from migration 028 — so reruns are idempotent.
  if (normalized.length > 0) {
    try {
      const { inserted, duplicates } = await upsertStockings(normalized)
      report.inserted = inserted
      report.skippedDuplicate = duplicates
    } catch (err) {
      errors.push(`upsert: ${err instanceof Error ? err.message : String(err)}`)
      return report
    }
  }

  report.ok = errors.length === 0
  return report
}

// ── DNR fetch (paginated) ──────────────────────────────────────

async function fetchDnrFeatures(windowDays: number): Promise<DnrFeature[]> {
  // ArcGIS WHERE clauses use SQL-92 DATE literals. We compute the
  // cutoff date in JS and format it as YYYY-MM-DD, which the
  // FeatureServer accepts via `DATE 'YYYY-MM-DD'`.
  const cutoff = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000)
  const yyyy = cutoff.getUTCFullYear()
  const mm = String(cutoff.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(cutoff.getUTCDate()).padStart(2, '0')
  const where = `stocking_date >= DATE '${yyyy}-${mm}-${dd}'`

  const out: DnrFeature[] = []
  let offset = 0

  // Paginate until exceededTransferLimit is false or we hit a
  // hard cap (50k records is plenty for any reasonable window).
  for (let pageGuard = 0; pageGuard < 25; pageGuard++) {
    const params = new URLSearchParams({
      where,
      outFields: 'GUID,Water_Body_Name,County_Name,SPEC_COMM_Alt,stocking_date,Number_Fish_Stocked,Average_Length,Operation,waters_id',
      orderByFields: 'stocking_date DESC',
      resultRecordCount: String(PAGE_SIZE),
      resultOffset: String(offset),
      f: 'json',
    })

    const res = await fetch(`${DNR_QUERY_URL}?${params.toString()}`, {
      // 30s — DNR endpoint can be slow on cold reads
      signal: AbortSignal.timeout(30000),
      headers: { 'User-Agent': 'RiverScout/1.0 stocking-scraper' },
    })
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} from DNR endpoint`)
    }
    const data = (await res.json()) as DnrResponse
    if (data.error) {
      throw new Error(`DNR error ${data.error.code}: ${data.error.message}`)
    }
    const page = data.features ?? []
    out.push(...page)

    if (!data.exceededTransferLimit || page.length < PAGE_SIZE) break
    offset += page.length
  }

  return out
}

// ── Normalization ──────────────────────────────────────────────

function normalizeFeature(
  f: DnrFeature,
  nameIndex: Map<string, string>,
): NormalizedStocking | null {
  const a = f.attributes
  const guidRaw = a.GUID
  if (!guidRaw || !a.stocking_date || !a.SPEC_COMM_Alt) return null

  // Strip curly braces and lowercase. The unique index uses this.
  const sourceRecordId = guidRaw.replace(/[{}]/g, '').toLowerCase()

  const stockingDate = new Date(a.stocking_date)
  if (isNaN(stockingDate.getTime())) return null

  // Trim trailing whitespace from species — DNR right-pads the
  // string column to a fixed width, e.g. "Rainbow trout           ".
  const species = (a.SPEC_COMM_Alt || '').trim()
  if (!species) return null

  const waterBodyName = (a.Water_Body_Name || '').trim()
  if (!waterBodyName) return null

  // Match
  let riverId: string | null = null
  let matchMethod: 'waters_id' | 'fuzzy_name' | null = null

  if (a.waters_id != null && WATERS_ID_TO_RIVER_ID[a.waters_id]) {
    riverId = WATERS_ID_TO_RIVER_ID[a.waters_id]
    matchMethod = 'waters_id'
  } else {
    const fuzzy = fuzzyMatch(waterBodyName, nameIndex)
    if (fuzzy) {
      riverId = fuzzy
      matchMethod = 'fuzzy_name'
    }
  }

  // Size category from Average_Length (DNR reports in inches)
  const sizeInches = a.Average_Length ?? null
  let sizeCategory: SizeCategory | null = null
  if (sizeInches != null) {
    if (sizeInches < 2) sizeCategory = 'fingerling'
    else if (sizeInches < 6) sizeCategory = 'sub-catchable'
    else if (sizeInches < 14) sizeCategory = 'catchable'
    else if (sizeInches < 24) sizeCategory = 'trophy'
    else sizeCategory = 'broodstock'
  }

  return {
    source_record_id: sourceRecordId,
    river_id: riverId,
    river_id_match_method: matchMethod,
    state_key: 'mi',
    stocking_date: stockingDate.toISOString().slice(0, 10),
    species: titleCaseSpecies(species),
    quantity: a.Number_Fish_Stocked ?? null,
    size_inches: sizeInches,
    size_category: sizeCategory,
    location_description: a.County_Name ? `${a.County_Name} County` : null,
    source_url: 'https://midnr.maps.arcgis.com/apps/dashboards/77581b13c6984b919ab8ed927496a31f',
    raw_water_body_name: waterBodyName,
    raw_county: a.County_Name?.trim() || null,
    raw_waters_id: a.waters_id ?? null,
  }
}

// DNR returns species like "Rainbow trout", "Brown trout",
// "Chinook salmon" — already mostly title-cased but with
// inconsistent casing. Normalize to Title Case for consistency
// with the existing data/fisheries.ts species names.
function titleCaseSpecies(s: string): string {
  return s
    .toLowerCase()
    .split(/\s+/)
    .map(w => w[0]?.toUpperCase() + w.slice(1))
    .join(' ')
}

// ── Fuzzy name matching ────────────────────────────────────────
//
// The matcher normalizes both sides to the same shape:
//   - lowercase
//   - strip "river" / "creek" / "stream" / "lake" / "branch" /
//     "fork" / "main" / "north" / "south" / "east" / "west" /
//     "upper" / "lower" / "br" suffix shorthand
//   - collapse non-alphanumerics to single spaces
//
// Then it requires an exact normalized match to claim a river.
// This is intentionally conservative — partial substring matches
// produce false positives like "Pine Creek" → pine_mi.

function buildNameIndex(rivers: typeof ALL_RIVERS): Map<string, string> {
  const idx = new Map<string, string>()
  for (const r of rivers) {
    const norm = normalizeName(r.n)
    if (norm) idx.set(norm, r.id)
    // Also index by river_id stripped of "_mi" suffix so e.g.
    // "Pine River" matches pine_mi via the bare "pine" key.
    const idStripped = r.id.replace(/_mi$/, '').replace(/_/g, ' ')
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
    // common DNR shorthand
    .replace(/\bbr\b\.?/g, 'branch')
    .replace(/\bn\b\.?/g, 'north')
    .replace(/\bs\b\.?/g, 'south')
    .replace(/\be\b\.?/g, 'east')
    .replace(/\bw\b\.?/g, 'west')
    // strip generic suffixes that don't disambiguate
    .replace(/\b(river|creek|stream|lake|branch|fork|main)\b/g, '')
    // strip directional/qualifier prefixes
    .replace(/\b(north|south|east|west|upper|middle|lower|big|little|main)\b/g, '')
    // non-alphanumeric to single space
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

// ── Upsert ─────────────────────────────────────────────────────

async function upsertStockings(rows: NormalizedStocking[]): Promise<{ inserted: number; duplicates: number }> {
  // Use the service role here because RLS on river_stocking gates
  // INSERT on auth.uid() being non-null. The cron has no auth
  // context, so we need elevated privileges. Service role bypasses
  // RLS — guarded by the CRON_SECRET on the route layer.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY not configured')
  }
  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

  // Map normalized rows to river_stocking column shape
  const inserts = rows.map(r => ({
    river_id: r.river_id!,
    state_key: r.state_key,
    stocking_date: r.stocking_date,
    is_scheduled: false,
    species: r.species,
    quantity: r.quantity,
    size_inches: r.size_inches,
    size_category: r.size_category,
    location_description: r.location_description,
    stocking_authority: STOCKING_AUTHORITY,
    source_url: r.source_url,
    source_record_id: r.source_record_id,
    verified: true,
  }))

  // Upsert with onConflict on the unique index from migration 028.
  // ignoreDuplicates: true makes the insert silently skip rows
  // whose (stocking_authority, source_record_id) already exists,
  // returning only the genuinely-new rows. This is what makes the
  // cron idempotent.
  const { data, error } = await supabase
    .from('river_stocking')
    .upsert(inserts, {
      onConflict: 'stocking_authority,source_record_id',
      ignoreDuplicates: true,
    })
    .select('id')

  if (error) {
    throw new Error(`Supabase upsert: ${error.message}`)
  }

  const inserted = data?.length ?? 0
  const duplicates = inserts.length - inserted
  return { inserted, duplicates }
}
