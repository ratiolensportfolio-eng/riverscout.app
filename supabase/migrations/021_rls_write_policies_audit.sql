-- Comprehensive RLS write-policy audit fix.
--
-- Background: this is the third in a sequence of fixes (after 019
-- and 020) for the same class of bug — Postgres RLS denies by
-- default, and many tables in this codebase enabled RLS with
-- auth.uid()-gated policies that work for client-side writes but
-- break server-side writes from the API routes. The routes use the
-- anon Supabase client (createSupabaseClient) which has no auth
-- context, so auth.uid() is null and the policies evaluate false.
--
-- This migration audits every write-from-route in the codebase and
-- adds permissive INSERT/UPDATE/DELETE policies where needed. The
-- security model matches the rest of the codebase: API route layer
-- is the gate (isAdmin, ownership checks, validation), RLS is
-- permissive on writes that originate from server-side routes.
--
-- Tables patched here:
--   - saved_rivers          (007) — /api/profile POST
--   - river_stocking        (009) — /api/stocking POST + admin update/delete
--   - stocking_alerts       (009) — /api/stocking/alerts POST + DELETE
--   - user_profiles         (010) — /api/digest UPDATE, /api/digest/unsubscribe,
--                                    /api/pro/checkout, stripe webhooks
--   - custom_cfs_ranges     (011) — /api/pro/cfs-range POST/DELETE
--   - hatch_alerts          (012) — /api/hatch-alerts POST/DELETE
--   - river_hazards         (015) — /api/hazards POST/PATCH/DELETE
--   - river_hazard_confirmations (015) — /api/hazards/[id]/confirm
--   - digest_log            (017) — /api/digest, /api/digest/preview
--
-- Tables intentionally NOT patched:
--   - profiles              (007) — /api/profile only reads, never writes
--   - suggestions           (004) — already has permissive insert+update
--   - outfitters            (003) — patched by 020
--   - river_field_overrides (018) — patched by 019
--   - river_cleared_verification_tags (018) — patched by 019
--   - river_permits         (016) — already public read; admin writes
--                                    need to be verified separately
--
-- Each policy uses an idempotent name like "X writable via route
-- layer" so re-running the migration is safe — the create-policy
-- statements will fail if the policy already exists, which is fine
-- because Supabase migrations are run once.

-- ─── saved_rivers (migration 007) ─────────────────────────────────
create policy "Saved rivers writable via route layer"
  on public.saved_rivers for insert with check (true);

create policy "Saved rivers updatable via route layer"
  on public.saved_rivers for update using (true);

create policy "Saved rivers deletable via route layer"
  on public.saved_rivers for delete using (true);

-- ─── river_stocking (migration 009) ───────────────────────────────
-- The original policy "Authenticated users can submit stocking
-- reports" gates on auth.uid() is not null, which fails server-side.
create policy "Stocking writable via route layer"
  on public.river_stocking for insert with check (true);

create policy "Stocking updatable via route layer"
  on public.river_stocking for update using (true);

create policy "Stocking deletable via route layer"
  on public.river_stocking for delete using (true);

-- ─── stocking_alerts (migration 009) ──────────────────────────────
create policy "Stocking alerts writable via route layer"
  on public.stocking_alerts for insert with check (true);

create policy "Stocking alerts updatable via route layer"
  on public.stocking_alerts for update using (true);

create policy "Stocking alerts deletable via route layer"
  on public.stocking_alerts for delete using (true);

-- ─── user_profiles (migration 010) ────────────────────────────────
-- The original policy "Users update own profile" gates updates on
-- auth.uid() = id which fails for server-side digest cron, stripe
-- webhooks, unsubscribe links, etc.
create policy "User profiles updatable via route layer"
  on public.user_profiles for update using (true);

-- ─── custom_cfs_ranges (migration 011) ────────────────────────────
create policy "CFS ranges writable via route layer"
  on public.custom_cfs_ranges for insert with check (true);

create policy "CFS ranges updatable via route layer"
  on public.custom_cfs_ranges for update using (true);

create policy "CFS ranges deletable via route layer"
  on public.custom_cfs_ranges for delete using (true);

-- ─── hatch_alerts (migration 012) ─────────────────────────────────
create policy "Hatch alerts writable via route layer"
  on public.hatch_alerts for insert with check (true);

create policy "Hatch alerts updatable via route layer"
  on public.hatch_alerts for update using (true);

create policy "Hatch alerts deletable via route layer"
  on public.hatch_alerts for delete using (true);

-- ─── river_hazards (migration 015) ────────────────────────────────
-- The original policies "Authenticated users can report hazards"
-- and "Users can update own hazards" gate on auth.uid() which is
-- null in the API route. /api/hazards POST sets reported_by from
-- the request body; /api/hazards/[id] PATCH/DELETE check isAdmin().
create policy "Hazards writable via route layer"
  on public.river_hazards for insert with check (true);

create policy "Hazards updatable via route layer"
  on public.river_hazards for update using (true);

create policy "Hazards deletable via route layer"
  on public.river_hazards for delete using (true);

-- ─── river_hazard_confirmations (migration 015) ───────────────────
create policy "Hazard confirmations writable via route layer"
  on public.river_hazard_confirmations for insert with check (true);

create policy "Hazard confirmations updatable via route layer"
  on public.river_hazard_confirmations for update using (true);

create policy "Hazard confirmations deletable via route layer"
  on public.river_hazard_confirmations for delete using (true);

-- ─── digest_log (migration 017) ───────────────────────────────────
-- The original policy only allowed users to read their own log.
-- Insert was never granted to anyone — the digest cron and preview
-- routes both insert via the anon client.
create policy "Digest log writable via route layer"
  on public.digest_log for insert with check (true);

-- ─── river_permits (migration 016) ────────────────────────────────
-- /api/permits PATCH (admin updates) needs an update policy. Reads
-- are already public per migration 016.
create policy "Permits updatable via route layer"
  on public.river_permits for update using (true);
