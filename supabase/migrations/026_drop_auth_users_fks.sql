-- Drop FK constraints to auth.users on every table the API route
-- writes to via the anon client.
--
-- Background: this is the actual root cause behind "new row
-- violates row-level security policy" errors I've been chasing
-- through migrations 019, 020, 021, 022, 024, and 025. The error
-- message is misleading.
--
-- The real cause: when a table has a FOREIGN KEY to auth.users(id),
-- inserting a row requires reading the parent row to verify the
-- key. The anon Postgres role does NOT have SELECT permission on
-- auth.users (by design — that table contains every user's email
-- and would leak PII to anyone with the anon key). The FK lookup
-- fails with "permission denied for table users", and Supabase
-- wraps that error as "violates row-level security policy" before
-- returning it to the client. I spent four migrations adding
-- permissive RLS policies that did nothing because RLS wasn't
-- the actual problem.
--
-- Fix: drop the FK constraint. The route layer is the gate — it
-- already validates that userId came from a real auth context
-- before passing it to .insert(). We lose database-level orphan
-- cleanup (when a user is deleted from auth.users their saved
-- rivers won't auto-cascade) but the application layer can handle
-- that via a periodic janitor or via the auth.users delete trigger.
--
-- Tables fixed here:
--   - saved_rivers          (007 / 022) — user_id
--   - profiles              (007 / 023) — id
--   - outfitters            (003)       — user_id
--   - suggestions           (004)       — user_id
--   - user_profiles         (010)       — id
--   - custom_cfs_ranges     (011)       — user_id
--   - hatch_alerts          (012)       — user_id
--   - river_stocking        (009)       — submitted_by
--   - stocking_alerts       (009)       — user_id
--   - river_hazards         (015)       — reported_by, resolved_by
--   - river_hazard_confirmations (015)  — user_id
--   - river_field_overrides (018)       — applied_by
--   - river_cleared_verification_tags (018) — cleared_by
--   - digest_log            (017)       — user_id
--
-- Tables NOT fixed (read-only from route, no anon writes):
--   - trip_reports — already audited, no FK to auth.users in current schema
--
-- Idempotent: each ALTER TABLE wraps the constraint drop in a DO
-- block that checks information_schema first. Safe to run twice.

create or replace function public.__riverscout_drop_auth_fk(
  p_table text,
  p_constraint text
) returns void as $$
begin
  if to_regclass('public.' || p_table) is null then
    raise notice 'Skipping FK drop on missing table public.%', p_table;
    return;
  end if;
  if exists (
    select 1 from information_schema.table_constraints
    where table_schema = 'public'
      and table_name = p_table
      and constraint_name = p_constraint
  ) then
    execute format('alter table public.%I drop constraint %I', p_table, p_constraint);
    raise notice 'Dropped FK %.%', p_table, p_constraint;
  end if;
end;
$$ language plpgsql;

-- Helper that drops every FK on a column whose foreign table is
-- auth.users — covers the case where the constraint name varies
-- (Supabase auto-generates names like "saved_rivers_user_id_fkey").
create or replace function public.__riverscout_drop_auth_fks_for_column(
  p_table text,
  p_column text
) returns void as $$
declare
  c text;
begin
  if to_regclass('public.' || p_table) is null then
    raise notice 'Skipping FK scan on missing table public.%', p_table;
    return;
  end if;
  for c in
    select tc.constraint_name
    from information_schema.table_constraints tc
    join information_schema.key_column_usage kcu
      on tc.constraint_name = kcu.constraint_name
      and tc.table_schema = kcu.table_schema
    join information_schema.constraint_column_usage ccu
      on ccu.constraint_name = tc.constraint_name
      and ccu.table_schema = tc.table_schema
    where tc.constraint_type = 'FOREIGN KEY'
      and tc.table_schema = 'public'
      and tc.table_name = p_table
      and kcu.column_name = p_column
      and ccu.table_schema = 'auth'
      and ccu.table_name = 'users'
  loop
    execute format('alter table public.%I drop constraint %I', p_table, c);
    raise notice 'Dropped FK %.% (constraint %)', p_table, p_column, c;
  end loop;
end;
$$ language plpgsql;

-- ─── Drop FKs to auth.users ──────────────────────────────────────

select public.__riverscout_drop_auth_fks_for_column('saved_rivers', 'user_id');
select public.__riverscout_drop_auth_fks_for_column('profiles', 'id');
select public.__riverscout_drop_auth_fks_for_column('outfitters', 'user_id');
select public.__riverscout_drop_auth_fks_for_column('suggestions', 'user_id');
select public.__riverscout_drop_auth_fks_for_column('user_profiles', 'id');
select public.__riverscout_drop_auth_fks_for_column('custom_cfs_ranges', 'user_id');
select public.__riverscout_drop_auth_fks_for_column('hatch_alerts', 'user_id');
select public.__riverscout_drop_auth_fks_for_column('river_stocking', 'submitted_by');
select public.__riverscout_drop_auth_fks_for_column('stocking_alerts', 'user_id');
select public.__riverscout_drop_auth_fks_for_column('river_hazards', 'reported_by');
select public.__riverscout_drop_auth_fks_for_column('river_hazards', 'resolved_by');
select public.__riverscout_drop_auth_fks_for_column('river_hazard_confirmations', 'user_id');
select public.__riverscout_drop_auth_fks_for_column('river_field_overrides', 'applied_by');
select public.__riverscout_drop_auth_fks_for_column('river_cleared_verification_tags', 'cleared_by');
select public.__riverscout_drop_auth_fks_for_column('digest_log', 'user_id');

-- ─── Drop helper functions ───────────────────────────────────────
drop function if exists public.__riverscout_drop_auth_fk(text, text);
drop function if exists public.__riverscout_drop_auth_fks_for_column(text, text);
