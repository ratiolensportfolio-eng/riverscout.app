# Session Handoff — April 14, 2026

## State of the project

Major data-pipeline session. Pulled NRP + ADFG AWC + USGS into the
catalog. Database now has 1,109 rivers (was 541), most newly added
ones are tagged `dataSource: 'nrp'` and need curation.

### What landed today (commits, newest → oldest)

- `3b8d74b` Auto-attach 341 USGS gauges + flag 17 no_gauge_available
- `25db67e` Backfill 196 missing entries in river-coordinates.ts
- `4bd696a` 20 Alaska rivers' fisheries from ADFG AWC
- `92b533e` flow_alerts.user_id migration
- `7...`     567 NRP river-map files (Maps & Guides tab now lit for them)
- `6aef7a5` 567 NRP river coords for state map pins
- `acc11f6` Re-seed NRP access points against expanded catalog (8493 sites)
- `6786f80` Add 569 NRP-sourced rivers (whitewater / W&S / 20+ mi filter)
- `73fdf46` Fix unterminated strings in san_juan river map
- `ad4dfe7` Split NRP access SQL into SQL-Editor-sized chunks

### Key numbers right now

- Rivers: 1,109 (541 curated + 569 NRP, mostly stubs)
- Rivers with USGS gauge: 864 (523 + 341 newly attached)
- Rivers without gauge: 245 (was 586 before today; 17 flagged
  `noGaugeAvailable: true`, rest are review/low-confidence
  candidates)
- Rivers in `RIVER_COORDS`: 1,103 (203 backfilled today, 7 still
  missing — boyne_mi, hatchery_creek_ky, san_antonio, rapid_me,
  bowie, battenkill, bantam)
- Map files in data/river-maps/: 849 (567 generated for NRP rivers)
- Verified fisheries entries: 25-ish (5 hand-curated + 20 from ADFG AWC)
- Access points: 8,493 across 523 rivers

## Open work queue (carry forward)

### Pending YOUR action in Supabase

1. **Run migration 033** (`supabase/migrations/033_flow_alerts_user_id.sql`) —
   adds `user_id` column to flow_alerts so the account page stops
   erroring "column flow_alerts.user_id does not exist".

### Code work I can do next session

2. **115 review-band gauge candidates** — same approach as today's
   discovery but with looser distance cap (35-40mi) for big rivers.
   Examples surfaced: green_ut, allagash_me, embarras_il,
   mississippi_mo, presque_isle_mi. Re-run dry-run with new threshold,
   spot-check, apply.

3. **Fisheries data for more states** beyond Alaska:
   - Oregon (~20 rivers): ODFW Fish Habitat Distribution feature
     service at https://nrimp.dfw.state.or.us/arcgis/rest/services/FHD/OregonFishHabitatDistribution2/FeatureServer
     — but per-species layers (140 of them), more script work.
   - Washington WDFW SalmonScape — similar shape.
   - Michigan DNR trout streams — published as PDF + GIS layer,
     less convenient.
   - Same template: pull species per stream, dedupe, map to FishSpecies.

4. **NHDPlus river map extraction** — `scripts/extract_phase2.py` is
   ready, needs you to: install geopandas, download HUC4 GDB
   archives, run the script. Replaces the 567 stitched NRP polylines
   with proper single-line USGS geometry. Would also fix Manistee's
   hand-placed approximation.

5. **Access points contributor count wiring** (+2 per verified
   submit, floor(confirmations/2) for confirmation credit). Files:
   lib/contributor-counts.ts, app/account/page.tsx,
   app/api/profile/route.ts.

6. **CFS loading diagnosis** — never got the symptom. If a river
   page shows "Loading..." forever for the live CFS, that's the
   pipeline issue we should investigate.

7. **Personalized landing** — needs spec.

8. **Trip reports user_id column** — known issue from prior handoff.
   Migration needed before trip-report authors can get contributor
   badges.

9. **Curation backlog**: 569 NRP rivers have empty cls/opt/co/avg/
   histFlow/desc/history/docs/outs. They show up in search and on
   maps but their detail pages are mostly empty. Filter/hide them
   in some UIs until curated, or build an admin UI to fill in the
   gaps a few at a time. Each entry is flagged
   `needsVerification: ['class-rating-nrp', 'map-position-missing']`.

## Decisions made this session (so future-you doesn't relitigate)

- **NRP `Difficulty` is NOT whitewater class I-VI.** It's a
  proprietary 0-10 commitment index that blends class, remoteness,
  and wilderness factor. Sandusky Class III shows code 8; Klamath
  Class III shows code 8 too — same class, different "commitment".
  Decoder: leave `cls` empty for NRP rivers, preserve raw NRP code
  in `nrpDifficulty: [min, max]` tuple. Flag
  `needsVerification: ['class-rating-nrp']` for human rating.

- **Filter for the bulk NRP import**: WW=1 OR WSR=1 OR ≥20 mi,
  EXCLUDING coastal/bay/sound/intracoastal/blueway/lagoon/waterway
  names. Got 569 from 1,025 raw candidates — trims FL/SC coastal
  trails (Gulf of Mexico, Charlotte Harbor, Intracoastal Waterway).

- **Name-matcher for NRP → rivers.ts** must be **state-aware**.
  Without state context, "Salmon River AK" merged with "salmon_ct".
  Strict (state, normalizedName) key only, no un-stated fallback.

- **Fisheries from ambiguous AWC matches → drop, don't merge.**
  When AWC has multiple "Beaver Creek"s in different watersheds
  (different first AWC_CODE prefix), we cannot trust merging their
  species lists. Drop those rivers from the verified set rather
  than risk wrong data. 4 of 31 AK candidates dropped this way.

- **CRLF line endings** matter on this Windows checkout. Match the
  file's existing endings when scripting writes; use `\r?\n` in
  parsing regexes. Several scripts failed silently when assuming
  LF until corrected.

- **NRP fields with embedded newlines** (Site_Name, GNIS_River_Name,
  Description_New, Access_Site_Management2) must be `clean()`-ed
  before being written into TS string literals — otherwise they
  break Vercel build (san_juan unterminated string). Fixed at the
  source in scripts/import-nrp-access-points.js.

- **Map view = real lat/lng, not SVG pixels.** `mx`/`my` in
  rivers.ts are SVG coords used by older API routes only. The live
  StateRiverMap (Mapbox) reads from `data/river-coordinates.ts`
  which is real `[lat, lng]`.

## Long files / artifacts to know about

| Path | What |
|---|---|
| `c:/tmp/nrp-floatable-reaches-raw.json` | Cached NRP polyline fetch, ~12 MB |
| `c:/tmp/nrp-river-import-preview.json` | Initial diff preview |
| `c:/tmp/nrp-river-additions.json` | What got added to rivers.ts |
| `c:/tmp/awc-fisheries.json` | ADFG AWC species per river |
| `c:/tmp/gauge-discovery-preview.json` | Full 586-river dry-run, 446 KB |

## Scripts written today

| Script | Purpose |
|---|---|
| `scripts/preview-nrp-new-rivers.js` | Initial diff: NRP vs rivers.ts |
| `scripts/generate-nrp-river-additions.js` | Build TS entries for 569 new rivers |
| `scripts/apply-nrp-river-additions.js` | Splice into rivers.ts state blocks |
| `scripts/generate-nrp-map-files.js` | Polyline .ts files + register in index.ts |
| `scripts/add-nrp-river-coords.js` | Centroids → river-coordinates.ts |
| `scripts/backfill-river-coords.js` | Backfill ~200 missing curated coords |
| `scripts/fetch-awc-fisheries.js` | Pull species from ADFG AWC |
| `scripts/merge-awc-into-fisheries.js` | Insert AWC results into fisheries.ts |
| `scripts/discover-usgs-gauges.js` | Bbox query + score USGS candidates |
| `scripts/apply-usgs-gauges.js` | Set g + noGaugeAvailable on rivers.ts |
| `scripts/split-nrp-sql.js` | Chunk 3.3 MB access SQL for SQL Editor |
| `scripts/fix-nrp-newlines.js` | (deleted) Was too aggressive on `'`-rich files |
