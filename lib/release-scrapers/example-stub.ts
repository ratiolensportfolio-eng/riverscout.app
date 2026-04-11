// Example stub adapter — copy this file to start a new
// release scraper. Documents the shape and the typical
// pitfalls so future maintainers don't have to re-derive
// the patterns from scratch.
//
// The stub itself is enabled: false so the orchestrator
// skips it. Don't enable it without replacing the fake
// fetch() body with a real one.

import type { ReleaseScraper, RawReleaseEvent } from './types'

export const exampleStubScraper: ReleaseScraper = {
  id: 'example-stub',
  name: 'Example Stub Scraper',
  agency: 'EXAMPLE',
  enabled: false,
  async fetch(): Promise<RawReleaseEvent[]> {
    // Step 1: hit the upstream endpoint with a 30-second
    // timeout via AbortSignal so a slow source can't hang
    // the whole orchestrator.
    //
    //   const res = await fetch('https://example.com/...', {
    //     signal: AbortSignal.timeout(30000),
    //     headers: { 'User-Agent': 'RiverScout/1.0' },
    //   })
    //
    // USACE caveat: their public sites send 403 to non-browser
    // User-Agents. If you're targeting a usace.army.mil URL
    // and getting 403, the site doesn't have a public API and
    // there's no scrape path that won't get banned. Use a
    // different source.
    //
    // Step 2: parse the response. JSON is easy. HTML scraping
    // requires careful handling of layout changes — prefer
    // querySelector chains over indexed positional parsing.
    //
    //   const data = await res.json()
    //
    // Step 3: normalize each record into a RawReleaseEvent.
    // The orchestrator handles river matching + database
    // writes — your job is just to produce clean events.
    //
    //   return data.records.map(r => ({
    //     sourceRecordId: r.id,
    //     waterBodyName: r.river,
    //     date: r.date.slice(0, 10),
    //     startTime: r.start_time,
    //     endTime: r.end_time,
    //     expectedCfs: r.flow_cfs,
    //     releaseName: r.event_name,
    //     notes: r.description,
    //   }))
    //
    // The framework guarantees:
    //   - sourceRecordId uniqueness is enforced via the
    //     unique index on (source_id, source_record_id)
    //   - water body name fuzzy-matching to a river_id
    //   - duplicate skip on re-runs
    //   - per-adapter error isolation (throwing here stops
    //     this adapter but doesn't kill the orchestrator)

    return []
  },
}
