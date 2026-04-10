-- Add permissive SELECT policies + grants where the route layer
-- needs to read its own writes.
--
-- Background: Supabase's REST API (PostgREST) implicitly appends
-- RETURNING * to every INSERT/UPDATE so it can return the affected
-- row to the client. The RETURNING clause has to pass the table's
-- SELECT policy in addition to the INSERT/UPDATE policy. Tables
-- with auth.uid()-gated SELECT policies (e.g. "Owner read saved
-- rivers") block the RETURNING for the anon client even when the
-- INSERT itself would succeed — and Supabase reports the failure
-- as "new row violates row-level security policy" which falsely
-- implicates the INSERT policy.
--
-- This migration adds permissive SELECT policies for the route
-- layer (matching the pattern from 019/020/022) on every table
-- where the API route writes via .insert(...).select() or
-- .upsert(...).select() and currently has only an owner-read
-- SELECT policy. Without this fix, every server-side write that
-- uses the .select() pattern silently fails with the misleading
-- RLS error.
--
-- Also includes the original GRANT backfill — table-level
-- privileges to anon and authenticated for every table created
-- via raw CREATE TABLE — though most of those grants turned out
-- to already be in place (Supabase auto-grants on table creation).
-- The grants block stays as a defensive no-op.
--
-- This is the fifth class of RLS-related fix (after 019, 020,
-- 022, 024). The previous four added INSERT/UPDATE/DELETE policies;
-- this one adds SELECT policies. Without both, .select() chained
-- after a write call still fails for the anon role.
--
-- Idempotent. Safe to run multiple times.

-- ─── 1. Permissive SELECT policies for route-layer reads ─────────
-- The actual fix for the "violates row-level security" error on
-- saved_rivers and similar tables. PostgREST chains an implicit
-- RETURNING * onto every write, and that has to pass SELECT RLS.
--
-- saved_rivers — owner-read policy gates on auth.uid() = user_id
-- which fails for the anon client. Add a permissive SELECT so the
-- route layer can read its own writes back.
do $$
begin
  if to_regclass('public.saved_rivers') is not null then
    drop policy if exists "Saved rivers readable via route layer" on public.saved_rivers;
    create policy "Saved rivers readable via route layer"
      on public.saved_rivers for select using (true);
  end if;
end $$;

-- The other tables that have owner-read SELECT policies AND are
-- written from API routes need the same fix. Audit list:
do $$
begin
  -- custom_cfs_ranges — /api/pro/cfs-range POST .select()
  if to_regclass('public.custom_cfs_ranges') is not null then
    drop policy if exists "CFS ranges readable via route layer" on public.custom_cfs_ranges;
    create policy "CFS ranges readable via route layer"
      on public.custom_cfs_ranges for select using (true);
  end if;

  -- hatch_alerts — /api/hatch-alerts POST .select()
  if to_regclass('public.hatch_alerts') is not null then
    drop policy if exists "Hatch alerts readable via route layer" on public.hatch_alerts;
    create policy "Hatch alerts readable via route layer"
      on public.hatch_alerts for select using (true);
  end if;

  -- stocking_alerts — /api/stocking/alerts POST .select()
  if to_regclass('public.stocking_alerts') is not null then
    drop policy if exists "Stocking alerts readable via route layer" on public.stocking_alerts;
    create policy "Stocking alerts readable via route layer"
      on public.stocking_alerts for select using (true);
  end if;

  -- digest_log — only inserted, never read by routes; skipped
  -- intentionally so users can't read each others' send history
  -- via the anon client.
end $$;

-- ─── 2. Tables created in custom migrations (need explicit grants) ───

-- saved_rivers (022, recreated from missing 007)
do $$
begin
  if to_regclass('public.saved_rivers') is not null then
    grant select, insert, update, delete on public.saved_rivers to anon, authenticated;
  end if;
end $$;

-- profiles (023, recreated from missing 007)
do $$
begin
  if to_regclass('public.profiles') is not null then
    grant select, insert, update, delete on public.profiles to anon, authenticated;
  end if;
end $$;

-- river_field_overrides (018)
do $$
begin
  if to_regclass('public.river_field_overrides') is not null then
    grant select, insert, update, delete on public.river_field_overrides to anon, authenticated;
  end if;
end $$;

-- river_cleared_verification_tags (018)
do $$
begin
  if to_regclass('public.river_cleared_verification_tags') is not null then
    grant select, insert, update, delete on public.river_cleared_verification_tags to anon, authenticated;
  end if;
end $$;

-- river_hazards (015)
do $$
begin
  if to_regclass('public.river_hazards') is not null then
    grant select, insert, update, delete on public.river_hazards to anon, authenticated;
  end if;
end $$;

-- river_hazard_confirmations (015)
do $$
begin
  if to_regclass('public.river_hazard_confirmations') is not null then
    grant select, insert, update, delete on public.river_hazard_confirmations to anon, authenticated;
  end if;
end $$;

-- river_permits (016)
do $$
begin
  if to_regclass('public.river_permits') is not null then
    grant select, insert, update, delete on public.river_permits to anon, authenticated;
  end if;
end $$;

-- digest_log (017)
do $$
begin
  if to_regclass('public.digest_log') is not null then
    grant select, insert, update, delete on public.digest_log to anon, authenticated;
  end if;
end $$;

-- ─── Tables that may also be missing grants (defensive) ───────────
-- These tables existed before the override/audit work and were
-- probably created via the Supabase dashboard UI (which auto-grants),
-- but if any of them were created via raw CREATE TABLE they need
-- the same fix. The grant is a no-op if already held, so this
-- block is safe regardless.

do $$
declare
  t text;
begin
  for t in
    select unnest(array[
      'flow_alerts',
      'trip_reports',
      'outfitters',
      'outfitter_clicks',
      'suggestions',
      'river_stocking',
      'stocking_alerts',
      'user_profiles',
      'custom_cfs_ranges',
      'hatch_alerts',
      'hatch_conditions_log',
      'forecast_cache',
      'gauge_mappings'
    ])
  loop
    if to_regclass('public.' || t) is not null then
      execute format('grant select, insert, update, delete on public.%I to anon, authenticated', t);
    end if;
  end loop;
end $$;
