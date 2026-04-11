# Dam Releases Runbook

How the dam release feature works, who maintains what, and what
to do at the start of each new year.

---

## What's in the system

### 1. Hand-curated releases — `data/dam-releases.ts`

A flat array of `DamRelease` entries, one per release day per
river, manually entered by the maintainer against the operating
agency's published 2026 schedules. This is the **trusted source
of truth** — entries here have been verified against the source
URL at curation time.

Currently covers ~44 release dates across 12 rivers:
- **Gauley Fall Season** (22 days, Sep 11 → Oct 17, 2026)
- **Lehigh** (6 USACE recreational releases)
- **Russell Fork Flannagan** (8 October release dates)
- **West River VT** (4 Ball Mountain release dates)
- **Tallulah Gorge** (4 Georgia Power November dates)
- **Ocoee** (3 marquee TVA release dates)
- **Deerfield** (3 marquee FERC dates)
- **Tygart Valley Falls** (2 USACE dates)
- **Cheat River Festival** (May 1-3, event not release)
- Single sample dates for **Kennebec Gorge**, **Dead River**,
  **Pigeon TN**

### 2. Scraped releases — `scraped_releases` Postgres table

Output of the release scraper framework. Adapters in
`lib/release-scrapers/` fetch from upstream agency APIs (when
they exist), normalize the events, fuzzy-match the water body
names to our river_ids, and write to `scraped_releases`. The
orchestrator runs daily via `/api/cron/release-scrapers`.

**Currently no live adapters.** All registered scrapers in
`lib/release-scrapers/index.ts` are stubs with `enabled: false`.
The framework is in place but no upstream agency publishes
release schedules in a scrape-friendly format that we've found.

### 3. Merge layer — `lib/releases-merge.ts`

`getAllReleases()` returns the union of curated + scraped
entries, with curated winning on `(river_id, date)` collision.
This is what the `/releases` page reads, so when an adapter
finally goes live the data shows up automatically.

### 4. Subscription layer — `release_alerts` Postgres table

Users can subscribe to a river (and optionally a specific
season label) and get an email N days before each upcoming
release. The daily cron at `/api/cron/release-alerts` walks
subscribers and emails them, deduping via `release_alert_log`.

---

## Annual roll-forward (run every January)

Each year the operating agencies publish new release schedules
in late winter / early spring. The hand-curated entries in
`data/dam-releases.ts` need to be re-entered for the new year.
Plan on 1-2 hours of work in mid-January.

### Step 1 — verify the previous year's sources still work

Walk every entry in `data/dam-releases.ts` and click its
`sourceUrl`. If the page has moved or 404'd:

- USACE pages move when they reorganize their CMS. Find the
  new lake-recreation page via Google: `site:usace.army.mil
  Summersville Lake recreation` (or whatever lake).
- TVA pages move less but their PDFs get re-pathed every year.
  Check `tva.com/environment/lake-levels/` and follow links
  from there.
- Brookfield Renewable (Deerfield, Kennebec, Dead River) keeps
  the same URL pattern but updates the year's PDF behind it.
- Georgia Power (Tallulah) publishes via `georgiapower.com/
  about/lakes-recreation/`.

Update any broken `sourceUrl` values in place.

### Step 2 — update the Gauley Fall Season dates

This is the most important one. The Gauley releases on the
22 days following Labor Day, in a fixed Friday-Monday weekend
pattern (6 weekends + Columbus Day Monday = 22 days).

In `data/dam-releases.ts`, find `buildGauleyFallSeason2026()`.
Either:

1. **Quick path:** rename the function to the new year, replace
   the hardcoded date strings with the new year's Friday-after-
   Labor-Day sequence.
2. **Better path:** turn the function into a parameterized
   helper that computes the dates from `Date.UTC(year, 8, 1)`
   forward to the first Friday after Labor Day, then walks
   forward 6 Fri-Mon clusters + Columbus Day Mon. This was
   deferred in the 2026 commit because hand-coding the dates
   was faster than getting the date math right under DST.

### Step 3 — update every other release entry

Go through each river's batch and update the year in the
`date` field. Most schedules are stable patterns (Memorial
Day weekend, July 4, Labor Day, first weekend of November,
etc.) so the date math is the only thing changing.

Don't forget the `id` field — it has the year baked in
(`gauley_2026_09_11` → `gauley_2027_09_10`). The id is the
unique key, so getting it right is what makes the cron not
re-fire alerts on already-shipped entries.

### Step 4 — verify against the source

Every entry's `sourceUrl` should be checked at least once
during the roll-forward. The release dates in our file are
authoritative for our users; if they don't match the agency's
schedule, paddlers will drive 4 hours and find no water.

### Step 5 — typecheck and commit

```bash
npx tsc --noEmit
git add data/dam-releases.ts
git commit -m "Roll forward dam releases to 2027"
git push
```

The `/releases` page picks up the new data on next render.
No migration, no cron change, no alert reset — the dedupe key
is `(alert_id, release_id)`, and since the new year's release
ids are new, subscribers automatically get fresh alerts on the
new dates.

### Step 6 — purge the previous year's release_alert_log entries

Optional but recommended once a year (June or so). The log
table grows by ~1 row per (subscriber × release) tuple. After
2-3 years it'll have a few thousand rows. Run:

```sql
delete from release_alert_log
where release_id like '%_202%_%'
  and notified_at < now() - interval '6 months';
```

(Adjust the year filter to match the dates you want to clear.)

---

## Adding a new release to the calendar mid-year

Sometimes an agency adds an extra release weekend after the
original schedule was published (e.g. extra USACE releases in
a wet year). To add one:

1. Open `data/dam-releases.ts`
2. Find the right river's batch
3. Add a new entry with a stable id (`{river}_{YYYY}_{MM}_{DD}`)
4. Make sure `riverId` matches an existing river in
   `data/rivers.ts`
5. Set the `expectedCfs`, `startTime`, `endTime`, `agency`,
   `sourceUrl`, and a `notes` field with the reason this
   release was added late
6. If it's part of a recurring season group, set `seasonLabel`
   to match the existing entries
7. Commit + push. No migration needed.

The next daily release-alerts cron run will fire emails to
anyone subscribed to that river within their lookahead window.

---

## Adding a new river with releases

When you add a new river to `data/rivers.ts` that has scheduled
dam releases:

1. Add the river entry as usual
2. Add release dates for the river in `data/dam-releases.ts`,
   making sure `riverId` matches the new river's `id`
3. The "Next release" callout on the river page renders
   automatically — no extra wiring needed
4. The river will appear in `/releases` automatically
5. Users can subscribe to releases on the new river immediately

---

## Building a new scraper adapter

When an upstream agency starts publishing release data in a
machine-readable format:

1. Copy `lib/release-scrapers/example-stub.ts` to a new file
   named after the source (e.g. `wi-dnr-releases.ts`)
2. Implement the `fetch()` method to hit the upstream API
   and return `RawReleaseEvent[]`
3. Set `enabled: true` once you've verified the fetch works
4. Register the adapter in `lib/release-scrapers/index.ts` by
   importing it and adding it to the `SCRAPERS` array
5. Trigger the cron manually to test:
   ```bash
   curl 'https://riverscout.app/api/cron/release-scrapers?key=$CRON_SECRET'
   ```
6. Read the per-adapter result in the response. Pay special
   attention to `unmatchedSamples` — those are upstream water
   bodies whose names didn't fuzzy-match to a river_id we
   track. Either add the missing rivers to `data/rivers.ts` or
   add explicit name aliases to the matcher.

For ArcGIS-based sources (any state DNR using Esri), use
`createArcgisAdapter()` from `lib/release-scrapers/arcgis-template.ts`
instead of writing the fetch logic from scratch. That's the
proven pattern from the Michigan DNR stocking pipeline.

---

## Known sources that DON'T work as scrapers

Documented here so future maintainers don't waste time on the
same dead ends:

| Source | Problem |
|--------|---------|
| USACE public pages (usace.army.mil) | Returns 403 to non-browser User-Agents. No way around this. |
| USACE Water Management API | Beta as of 2026, undocumented, mostly returns gauge readings not release schedules. Re-evaluate annually. |
| TVA recreational release schedules | Hosted as PDFs at variable URLs that change every season. No structured data. |
| Brookfield Renewable schedules | Per-dam HTML pages with no consistent format. PDFs behind login walls. |
| Georgia Power Tallulah | Static HTML release table on a corporate page that gets reorganized regularly. |
| American Whitewater calendar | Public site, no public API. The river-detail pages have flow gauge widgets but no scrape-friendly release endpoints. |

**Sources that DO work** (or have a high probability of working):

| Source | Status |
|--------|--------|
| Michigan DNR ArcGIS dashboards | ✓ Working (stocking, see lib/dnr-stocking.ts) |
| Wisconsin DNR ArcGIS | Untested but uses the same Esri platform — should work with createArcgisAdapter() |
| Minnesota DNR ArcGIS | Same pattern as Michigan/Wisconsin |
| Some USFS regional offices | Some publish recreation data on Esri Open Data; check region by region |

---

## File map

| File | Purpose |
|------|---------|
| `types/index.ts` | `DamRelease` interface |
| `data/dam-releases.ts` | Hand-curated releases + helpers (`getUpcomingReleases`, `getNextReleaseForRiver`, `groupBySeason`, `hasReleases`) |
| `lib/releases-merge.ts` | Merges hand-curated + scraped at read time |
| `lib/release-scrapers/types.ts` | `ReleaseScraper` interface and result types |
| `lib/release-scrapers/index.ts` | Orchestrator, river matcher, adapter registry |
| `lib/release-scrapers/arcgis-template.ts` | Generic ArcGIS REST FeatureServer adapter factory |
| `lib/release-scrapers/example-stub.ts` | Documented starter template |
| `app/releases/page.tsx` | The `/releases` index page |
| `app/releases/ReleasesGrid.tsx` | Calendar grid view client component |
| `app/api/releases/subscribe/route.ts` | POST/DELETE subscribe endpoint |
| `app/api/cron/release-alerts/route.ts` | Daily alert cron |
| `app/api/cron/release-scrapers/route.ts` | Daily scraper cron |
| `components/rivers/SubscribeReleaseAlert.tsx` | Inline subscribe button on river pages |
| `lib/email.ts` | `releaseAlertEmail()` template |
| `supabase/migrations/029_release_alerts.sql` | `release_alerts` + `release_alert_log` tables |
| `supabase/migrations/030_scraped_releases.sql` | `scraped_releases` table |
| `vercel.json` | Cron schedules |
