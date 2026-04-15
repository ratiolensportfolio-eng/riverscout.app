# DB Query Audit — REFINED — 2026-04-15

Accurate walk: 🔴 CRITICAL=0, 🟠 HIGH=8, 🟡 MEDIUM=47.

## 🔴 CRITICAL — unfiltered DELETE / UPDATE
(none)

## 🟠 HIGH — unfiltered + unlimited SELECT (potential full scan)

- `app\admin\qa\page.tsx`  table=`river_questions`
  > .from('river_questions').select('id, river_id, display_name, question, created_at, answered, helpful_count, status') 
- `app\api\cron\release-alerts\route.ts`  table=`release_alert_log`
  > .from('release_alert_log') .select('alert_id, release_id') 
- `app\api\debug\outfitters\route.ts`  table=`outfitters`
  > .from('outfitters') .select('id, business_name, tier, active, river_ids, created_at') 
- `app\api\permits\route.ts`  table=`river_permits`
  > .from('river_permits') .select('*') .order('state_key', { ascending: true }) .order('river_name', { ascending: true }) 
- `lib\permits.ts`  table=`river_permits`
  > .from('river_permits') .select('river_id') 
- `lib\rivers-db.ts`  table=`rivers`
  > .from('rivers') .select('*') .order('state_key, name') 
- `lib\rivers-db.ts`  table=`river_history`
  > .from('river_history') .select('*') .order('river_id, sort_order') 
- `lib\rivers-db.ts`  table=`river_documents`
  > .from('river_documents') .select('*') 

## 🟡 MEDIUM — filtered but unlimited (size assumption check)
47 occurrences across these files:
- `lib\river-page-data.ts` — 6 call sites
- `app\api\test-db\route.ts` — 5 call sites
- `app\api\alerts\check\route.ts` — 3 call sites
- `app\api\hazards\route.ts` — 2 call sites
- `app\api\outfitters\analytics\route.ts` — 2 call sites
- `app\dashboard\page.tsx` — 2 call sites
- `lib\contributor-counts.ts` — 2 call sites
- `lib\rivers-db.ts` — 2 call sites
- `app\about\improvements\page.tsx` — 1 call sites
- `app\account\page.tsx` — 1 call sites
- `app\admin\qa\page.tsx` — 1 call sites
- `app\api\access-points\list\route.ts` — 1 call sites
- `app\api\admin\stocking\route.ts` — 1 call sites
- `app\api\alerts\route.ts` — 1 call sites
- `app\api\cron\release-alerts\route.ts` — 1 call sites
- `app\api\debug\outfitters\route.ts` — 1 call sites
- `app\api\debug\seed-outfitter\route.ts` — 1 call sites
- `app\api\digest\route.ts` — 1 call sites
- `app\api\hatch-alerts\route.ts` — 1 call sites
- `app\api\outfitters\route.ts` — 1 call sites
- `app\api\permits\verify-reminder\route.ts` — 1 call sites
- `app\api\profile\route.ts` — 1 call sites
- `app\api\qa\list\route.ts` — 1 call sites
- `app\api\rivers\[id]\gauges\route.ts` — 1 call sites
- `app\api\stocking\alerts\route.ts` — 1 call sites
- `app\api\stocking\route.ts` — 1 call sites
- `app\api\suggestions\route.ts` — 1 call sites
- `app\outfitters\dashboard\page.tsx` — 1 call sites
- `lib\digest.ts` — 1 call sites
- `lib\dnr-stocking.ts` — 1 call sites
- `lib\release-scrapers\index.ts` — 1 call sites