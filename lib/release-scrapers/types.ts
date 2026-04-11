// Shared types for the dam release scraper framework.
//
// Each scraper adapter implements ReleaseScraper. The orchestrator
// in lib/release-scrapers/index.ts walks every registered adapter,
// calls fetch() on each, normalizes the results, and writes them
// to the scraped_releases table. Hand-curated data in
// data/dam-releases.ts stays separate so we never lose track of
// what's a verified human entry vs what's machine-pulled.
//
// Why a framework instead of inlining: every state agency / dam
// operator publishes data differently. Some use ArcGIS REST
// (Michigan DNR — see lib/dnr-stocking.ts for the working
// reference impl). Some use undocumented JSON endpoints.
// Some only publish PDFs we'd have to OCR. Each one is its own
// adapter. The framework gives them a shared interface so the
// orchestrator and the cron stay simple.

// What every adapter must produce. River matching + writing to
// the database is handled by the orchestrator, not the adapter,
// so adapters only need to fetch + normalize.
export interface RawReleaseEvent {
  // Stable per-record ID from the source. Used as the dedupe
  // key in scraped_releases (alongside source_id). Must be
  // stable across runs — if the source doesn't have one, the
  // adapter should construct one from (river_name + date).
  sourceRecordId: string

  // Free-text water body name from the source. The orchestrator
  // matches this against our river database via the same fuzzy
  // logic as the DNR stocking scraper.
  waterBodyName: string

  // ISO date YYYY-MM-DD. Required.
  date: string

  // Optional times — most release sources include a window.
  startTime?: string
  endTime?: string

  // Expected CFS at the release. Optional but should be
  // populated whenever the source publishes it.
  expectedCfs?: number

  // Free-text release name (e.g. "Recreational Release",
  // "Whitewater Release Day 1"). Used in emails and the UI.
  releaseName?: string

  // Free-text notes — section info, level qualifications, etc.
  notes?: string
}

// What an adapter implements. The whole interface is one method
// + some metadata so the framework can introspect it.
export interface ReleaseScraper {
  // Stable identifier — used as the source_id column in
  // scraped_releases. Must be unique across all adapters.
  // e.g. "usace-fe-walter-lehigh", "wi-dnr-arcgis-releases".
  id: string

  // Human-readable name for logs and admin reports.
  name: string

  // Operating agency, used in the UI taxonomy.
  agency: string

  // Whether this adapter is currently functional. Adapters that
  // hit dead endpoints, blocked APIs, or unreleased schedules
  // should set this to false so the orchestrator skips them
  // without erroring. The cron will report skipped adapters
  // separately from failed ones.
  enabled: boolean

  // The actual fetch. Returns normalized events; throws on
  // hard errors (network, parse failure). The orchestrator
  // catches the throw and reports it per-adapter.
  fetch(): Promise<RawReleaseEvent[]>
}

// Per-adapter result that the orchestrator collects and returns
// to the cron.
export interface AdapterResult {
  id: string
  name: string
  enabled: boolean
  ok: boolean
  fetched: number
  matched: number
  inserted: number
  skippedDuplicate: number
  skippedUnmatched: number
  unmatchedSamples: Array<{ name: string; date: string }>
  error?: string
}

export interface OrchestratorReport {
  ok: boolean
  fetchedAt: string
  adapters: AdapterResult[]
  totalFetched: number
  totalInserted: number
}
