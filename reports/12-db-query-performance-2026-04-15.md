# DB Query Performance Analysis — 2026-04-15

Static analysis only (no live DB EXPLAIN access from this run).

Total `.from('...')` calls: **221** across 66 files
Unfiltered (no .eq/.in/.gt/.match/.or): **51** — these scan whole tables and may need an index or .limit()

## Most queried tables
- `user_profiles`: 21 call sites
- `outfitters`: 21 call sites
- `suggestions`: 18 call sites
- `river_hazards`: 12 call sites
- `saved_rivers`: 9 call sites
- `river_answers`: 9 call sites
- `river_access_points`: 9 call sites
- `river_stocking`: 9 call sites
- `flow_alerts`: 7 call sites
- `release_alerts`: 6 call sites
- `river_permits`: 6 call sites
- `states`: 6 call sites
- `river_questions`: 5 call sites
- `stocking_alerts`: 5 call sites
- `outfitter_clicks`: 4 call sites

## Unfiltered queries (potential full-table scans)
- `river_access_points` in `app\admin\access-points\page.tsx` ⚠️  no .limit
- `river_access_point_confirmations` in `app\api\access-points\confirm\route.ts` ⚠️  no .limit
- `river_access_point_change_reports` in `app\api\access-points\report-change\route.ts` ⚠️  no .limit
- `river_access_points` in `app\api\access-points\submit\route.ts` ⚠️  no .limit
- `flow_alerts` in `app\api\alerts\route.ts` ⚠️  no .limit
- `release_alert_log` in `app\api\cron\release-alerts\route.ts` ⚠️  no .limit
- `release_alert_log` in `app\api\cron\release-alerts\route.ts` ⚠️  no .limit
- `outfitters` in `app\api\debug\outfitters\route.ts` ⚠️  no .limit
- `outfitters` in `app\api\debug\outfitters\route.ts` ⚠️  no .limit
- `outfitter_clicks` in `app\api\debug\outfitters\route.ts` ⚠️  no .limit
- `outfitters` in `app\api\debug\seed-outfitter\route.ts` ⚠️  no .limit
- `outfitters` in `app\api\debug\seed-outfitter\route.ts` ⚠️  no .limit
- `digest_log` in `app\api\digest\preview\route.ts` ⚠️  no .limit
- `hatch_alerts` in `app\api\hatch-alerts\route.ts` ⚠️  no .limit
- `river_hazards` in `app\api\hazards\route.ts` ⚠️  no .limit
- `river_hazard_confirmations` in `app\api\hazards\[id]\confirm\route.ts` ⚠️  no .limit
- `outfitter_clicks` in `app\api\outfitters\click\route.ts` ⚠️  no .limit
- `outfitters` in `app\api\outfitters\route.ts` ⚠️  no .limit
- `river_permits` in `app\api\permits\route.ts` ⚠️  no .limit
- `custom_cfs_ranges` in `app\api\pro\cfs-range\route.ts` ⚠️  no .limit
- `gauge_mappings` in `app\api\pro\forecast\route.ts` ⚠️  no .limit
- `forecast_cache` in `app\api\pro\forecast\route.ts` ⚠️  no .limit
- `river_answers` in `app\api\qa\answer\route.ts` ⚠️  no .limit
- `river_questions` in `app\api\qa\ask\route.ts` ⚠️  no .limit
- `release_alerts` in `app\api\releases\subscribe\route.ts` ⚠️  no .limit
- `states` in `app\api\seed\route.ts` ⚠️  no .limit
- `states` in `app\api\seed\route.ts` ⚠️  no .limit
- `rivers` in `app\api\seed\route.ts` ⚠️  no .limit
- `states` in `app\api\seed\route.ts` ⚠️  no .limit
- `rivers` in `app\api\seed\route.ts` ⚠️  no .limit