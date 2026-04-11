# Access Points Feature — Build Log

User-editable access points per river page, integrated into the
existing Maps & Guides tab. Crowdsourced verification, AI plausibility
check, contributor-tier integration, and an automatic float-segment
summary card between consecutive access points.

## Plan overview

| Phase | Deliverable | Status |
|---|---|---|
| 0 | SQL migration 032 + confirmations + change reports + triggers | drafted, **awaiting approval** |
| 1 | Display component on Maps & Guides tab (vertical timeline) | pending |
| 2 | Float segment summary card between access points | pending |
| 3 | "Add access point" modal (6 sections) | pending |
| 4 | "Mark still accurate" + "Report change" actions | pending |
| 5 | `/api/access-points/*` routes (submit, confirm, report) | pending |
| 6 | AI plausibility eval (Claude Haiku, mirrors suggestions) | pending |
| 7 | Admin queue: new tab in `/admin/suggestions` | pending |
| 8 | Contributor count: +2 per verified, +0.5 per confirmation | pending |
| 9 | Seed data for Pine, Au Sable, Gauley, Nantahala | pending |
| 10 | SSR prefetch into `lib/river-page-data.ts` for Google indexing | pending |

## Phase 0 — SQL draft (awaiting approval)

**File when approved:** `supabase/migrations/032_river_access_points.sql`

### Notes vs the original spec

1. **Added `ai_confidence` + `ai_reasoning` columns** mirroring
   `public.suggestions` — Claude Haiku evaluates plausibility on
   submit and the admin queue renders the assessment the same way it
   does for normal suggestions.

2. **Added `admin_notes`** so admin review can leave a note alongside
   the row without touching another table.

3. **Added an `updated_at` trigger** so the freshness indicator
   ("Verified 3 weeks ago" / amber / red) reflects edits, not just
   the original creation timestamp.

4. **Split confirmations into their own table**
   (`river_access_point_confirmations`) with `UNIQUE(access_point_id,
   user_id)` so a single user can only confirm once. The auto-verify
   trigger fires when distinct confirmations hit 3.

5. **Split change reports into their own table**
   (`river_access_point_change_reports`) so admins see them as a
   first-class queue rather than a JSON blob on the parent row. A
   trigger flips the parent to `needs_review` (amber) when a report
   lands.

6. **Added a SELECT policy that hides `rejected` rows** from public
   reads. The original spec had `using (true)` which would let
   rejected submissions stay visible.

7. **Added an UPDATE policy** for the submitter while the row is
   still pending — so they can fix a typo without bothering an
   admin. Locked once verified.

8. **`description` length-capped at 280 chars** to match the modal
   spec.

## Resolved

1. **`helpful_count`** — keeping the column AND adding a Q&A-style
   helpful click via `bump_access_point_helpful()`. SECURITY DEFINER
   so anon can call it without an UPDATE policy on the row.

2. **Contributor weighting** — integer rounding:
   - **+2** per verified access point the user submitted
   - **floor(confirmations / 2)** so two confirmations = +1 point.
   The float weighting (true 0.5 each) would have required changing
   the contributor count to a numeric type — wasn't worth the
   blast radius.

3. **Pending visibility** — instant. Public read policy is
   `verification_status != 'rejected'` so a fresh submission shows
   up immediately on the river page with a gray "pending" dot.

## Build progress

| Phase | Deliverable | Status |
|---|---|---|
| 0 | Migration 032 | drafted, ready to run |
| 1 | SSR prefetch into lib/river-page-data.ts | in progress |
| 2 | Display component on Maps & Guides tab | pending |
| 3 | Float segment summary card | pending |
| 4 | Submit modal (6 sections) | pending |
| 5 | Mark accurate / Report change / Helpful actions | pending |
| 6 | API routes (submit, confirm, report, helpful) + AI eval | pending |
| 7 | Admin queue page | pending |
| 8 | Contributor count: +2/verified, +1/2 confirmations | pending |
| 9 | Seed data (Pine, Au Sable, Gauley, Nantahala) | pending |
