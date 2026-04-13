# Gauge audit — final report (2026-04-13)

## Summary

| Status | Count |
|---|---|
| Verified — gauge ID matches the river name | 493 |
| Same river, different spelling (e.g. Beaver Kill vs Beaverkill) | 19 |
| Intentional cross-watershed proxy (no own gauge exists) | 2 |
| Blanked — no USGS gauge exists for this river, set `g: ''` | 17 |
| **Total rivers** | **531** |

Started at 144 mismatches, ended at 0 wrong-data risks. Every river either has a verified-correct USGS gauge for its watershed, or no gauge (UI shows "no live data") rather than displaying flow from an unrelated river.

## Process

1. `scripts/verify-gauges.js` — fetches USGS site metadata for all 528 gauge IDs in `data/rivers.ts`; flags missing or name-mismatched.
2. `scripts/classify-mismatches.js` — separates spelling-variant false positives from genuine mismatches.
3. `scripts/suggest-correct-gauges.js` — pulls all in-state stream-discharge gauges from USGS, ranks candidates by name similarity to the river.
4. `scripts/apply-gauge-fixes.js` — auto-applies the highest-confidence candidate (river name appears as the lead noun in the station name; tiebreakers: county/city match, median site number when all candidates are clearly on the same river).
5. `scripts/manual-gauge-fixes.js` + `scripts/manual-gauge-fixes-2.js` — applies the rivers I researched individually via web search.
6. `scripts/blank-orphan-gauges.js` — sets `g: ''` for the 14 rivers where no real USGS gauge exists; documents intentional proxies.

Re-run any time after adding rivers: `node scripts/verify-gauges.js && node scripts/classify-mismatches.js && node scripts/apply-gauge-fixes.js`.

## Intentional proxies (no own gauge — flow is approximate)

- **`alagnak_ak`** uses `15300500` (Kvichak R at Igiugig). The Alagnak drains into the Kvichak system; nearest available proxy.
- **`little_sc`** uses `02162500` (Saluda R near Greenville). Little River SC is a Saluda tributary; nearest available proxy.

## Blanked (g: '') — no USGS gauge exists

`anahulu_hi`, `bantam`, `betsie`, `bowie`, `boyne_mi`, `broadkill`, `brooks_ak`, `flint_hills`, `goodnews_ak`, `hatchery_creek_ky`, `lacombe`, `rapid_me`, `san_antonio`, `wharton`

The river page for these will show "no live flow data" until either (a) a USGS gauge gets installed or (b) someone identifies a defensible proxy and re-enables.

## Notable corrections applied

A sampling of the 100+ fixes:

- `naknek_ak`: `15301500` (Allen R nr Aleknagik) → `15297890` (Naknek R at Lake Outlet nr King Salmon)
- `russian_ak`: `15258000` (Kenai at Cooper Landing) → `15264000` (Russian R nr Cooper Landing)
- `klutina_ak`: `15212000` (Copper R nr Chitina) → `15206000` (Klutina R at Copper Center)
- `chilkat_ak`: `15056210` → `15056500` (Chilkat R nr Klukwan)
- `nenana_ak`: `15518000` → `15518040` (Nenana R at Healy)
- `newriver`: `03189100` (Gauley R nr Craigsville) → `03185400` (New R at Thurmond — gorge gauge)
- `lehigh`: `01451420` (Little Lehigh Creek) → `01451000` (Lehigh R at Walnutport)
- `little_muskegon`: `04122000` (Muskegon at Newaygo) → `04121944` (Little Muskegon nr Oak Grove)
- `tuckasegee`: `03510000` (didn't exist) → `03513000` (Tuckasegee R at Bryson City)
- `sturgeon_lp`: `04131980` (didn't exist) → `04127997` (Sturgeon R at Wolverine)
- `tchefuncte`: `07375330` (didn't exist) → `07375000` (Tchefuncte R near Folsom)
- `south_branch` (S. Branch Potomac): `01646580` (Potomac at Chain Bridge DC) → `01608500` (S. Branch Potomac nr Springfield WV)

Full diff in git history.
