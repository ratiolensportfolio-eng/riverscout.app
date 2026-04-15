# Morning Brief — 2026-04-15

Prioritized action plan synthesizing all overnight reports.
Items ordered by user-impact × effort.

## 🔴 High user-impact, ready to action

### 1. Apply 340 confident USGS gauge attaches (Task 1)
Re-run `node scripts/apply-usgs-gauges.js` against the existing `c:/tmp/gauge-discovery-preview.json`. This is what we did before — same script, no schema changes. Adds live CFS to 340 currently-blank rivers.

### 2. Fix 51 unfiltered Supabase queries (Task 12)
See `12-db-query-performance-2026-04-15.md` for the call-site list. Each unfiltered `.from('table')` either needs an `.eq()` filter, an index, or a `.limit(N)`. These are real perf liabilities at scale.

### 3. Run migration 037 + multi-gauge seed in Supabase
Migration 037 enables per-gauge avg flow caching (already coded, just needs to run). Then re-run `supabase/seeds/river_gauges_seed.sql` so the multi-gauge demos populate.

## 🟡 Medium-impact, scoped follow-ups

### 4. Outfitter link cleanup (FULL sweep complete: 142 dead of 335)
See `10b-outfitter-dead-links-FULL-2026-04-15.md`. Recommend: don't auto-remove (transient downtime exists), but flag the per-river top offenders to revisit URLs / contact outfitters.

### 5. Broken-gauge triage (121 no-series, categorized)
See `11b-broken-gauges-categorized-2026-04-15.md`. Most "broken" gauges likely fall into:
  - **dam-released**: expected silent (Gauley dam release, Hawks Nest, etc.) → flag noGaugeAvailable=true ONLY if the river paddles only on releases
  - **reservoir-related**: keep the gauge, just expect intermittent data
  - **small-creek-likely-seasonal**: probably correct gauge, low summer flow
  - **unknown**: actual review candidates — investigate first

### 6. NHDPlus polylines for the 109 remaining rivers (Task 6)
90% coverage today. The remaining 10% includes the new Ontario rivers and a handful of OH stragglers (incl. `black_fork_oh`). Update `scripts/river_extraction_map.csv` to include them, then rerun `python scripts/extract_phase2.py` in the `riverscout-gis` conda env.

## 🟢 Low-impact backlog

### 7. Description quality (125 short, 35 NRP-boilerplate) (Task 7)
Manual rewrite or LLM-assist needed. NOT auto-fixable.

### 8. Q&A seed (1,123 rivers with zero Q&A) (Task 8)
Templates queued; need to actually generate quality questions per river.

### 9. Fisheries data for 81 MI/MT/OR/CO/PA rivers (Task 9)
Same approach as Alaska AWC: find a per-state authoritative source (MI DNR trout-stream list, MT FWP, ODFW Fish Habitat Distribution, CDFW, PFBC) and write per-state import scripts.

### 10. NRP 1,025 candidates (Task 4)
CSV preview ready. Re-applying same opt2c filter would import another wave. Don't do without explicit decision.

## ✅ No action needed

- Sitemap: dynamic `app/sitemap.ts` is in place (Task 5).
- Historical avg flow population: lazy-fill is wired (Task 3).
- WSC matching: 12/13 Canadian rivers gauged; only Kananaskis is correctly flagged (Task 2).