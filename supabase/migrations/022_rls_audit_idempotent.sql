-- Idempotent re-run of the RLS write-policy audit (021).
--
-- Why this exists: migration 021 hit "relation public.saved_rivers
-- does not exist" and aborted partway through. The user's Supabase
-- instance was set up by running migration 010 (user_profiles) but
-- never 007 (which creates profiles + saved_rivers + the
-- handle_new_user trigger), so saved_rivers doesn't exist. 021
-- assumed every table from every migration was present.
--
-- This migration:
--   1. Creates saved_rivers if it's missing (so the SaveRiver
--      button + digest generator have somewhere to write).
--   2. Re-runs every policy from 021, but each policy is wrapped
--      in a DO block that checks the table exists first via
--      to_regclass. Missing tables get skipped silently. Existing
--      policies are dropped-and-recreated so the migration is
--      fully idempotent — re-running it is always safe.
--
-- Run this migration AFTER 021 (which may have partially applied
-- before failing). Anything 021 already created stays in place.

-- ─── 1. Create saved_rivers if missing ────────────────────────────
-- The original migration 007 was never applied, so saved_rivers
-- doesn't exist. Recreate just that table here. We don't recreate
-- the rest of 007 (profiles + handle_new_user trigger) because
-- 010's trigger is the one currently in place and it points at
-- user_profiles.
create table if not exists public.saved_rivers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  river_id text not null,
  created_at timestamptz not null default now(),
  unique(user_id, river_id)
);

create index if not exists idx_saved_rivers_user on public.saved_rivers(user_id);

alter table public.saved_rivers enable row level security;

-- Owner-read policy so users can list their own saved rivers via
-- the supabase client (e.g. the SaveRiver component checks if the
-- river is already saved on mount).
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'saved_rivers'
      and policyname = 'Owner read saved rivers'
  ) then
    create policy "Owner read saved rivers" on public.saved_rivers
      for select using (auth.uid() = user_id);
  end if;
end $$;

-- ─── 2. Helper to apply permissive write policies idempotently ────
-- Each table gets a DO block that:
--   a) Checks the table exists (to_regclass returns null if not)
--   b) Drops the policy if it exists (so re-runs are safe)
--   c) Creates the permissive policy
-- to_regclass + EXECUTE + format() gives us safe dynamic SQL
-- without needing per-table boilerplate elsewhere.

create or replace function public.__riverscout_apply_write_policy(
  table_name text,
  policy_name text,
  operation text  -- 'INSERT' | 'UPDATE' | 'DELETE'
) returns void as $$
begin
  -- Skip if table doesn't exist
  if to_regclass('public.' || table_name) is null then
    raise notice 'Skipping % policy on missing table public.%', operation, table_name;
    return;
  end if;

  -- Drop if exists, then create
  execute format('drop policy if exists %I on public.%I', policy_name, table_name);

  if operation = 'INSERT' then
    execute format(
      'create policy %I on public.%I for insert with check (true)',
      policy_name, table_name
    );
  elsif operation = 'UPDATE' then
    execute format(
      'create policy %I on public.%I for update using (true)',
      policy_name, table_name
    );
  elsif operation = 'DELETE' then
    execute format(
      'create policy %I on public.%I for delete using (true)',
      policy_name, table_name
    );
  end if;
end;
$$ language plpgsql;

-- ─── 3. Apply policies to every write-from-route table ────────────

-- saved_rivers (created above if missing)
select public.__riverscout_apply_write_policy('saved_rivers', 'Saved rivers writable via route layer', 'INSERT');
select public.__riverscout_apply_write_policy('saved_rivers', 'Saved rivers updatable via route layer', 'UPDATE');
select public.__riverscout_apply_write_policy('saved_rivers', 'Saved rivers deletable via route layer', 'DELETE');

-- river_stocking (009)
select public.__riverscout_apply_write_policy('river_stocking', 'Stocking writable via route layer', 'INSERT');
select public.__riverscout_apply_write_policy('river_stocking', 'Stocking updatable via route layer', 'UPDATE');
select public.__riverscout_apply_write_policy('river_stocking', 'Stocking deletable via route layer', 'DELETE');

-- stocking_alerts (009)
select public.__riverscout_apply_write_policy('stocking_alerts', 'Stocking alerts writable via route layer', 'INSERT');
select public.__riverscout_apply_write_policy('stocking_alerts', 'Stocking alerts updatable via route layer', 'UPDATE');
select public.__riverscout_apply_write_policy('stocking_alerts', 'Stocking alerts deletable via route layer', 'DELETE');

-- user_profiles (010)
select public.__riverscout_apply_write_policy('user_profiles', 'User profiles updatable via route layer', 'UPDATE');

-- custom_cfs_ranges (011)
select public.__riverscout_apply_write_policy('custom_cfs_ranges', 'CFS ranges writable via route layer', 'INSERT');
select public.__riverscout_apply_write_policy('custom_cfs_ranges', 'CFS ranges updatable via route layer', 'UPDATE');
select public.__riverscout_apply_write_policy('custom_cfs_ranges', 'CFS ranges deletable via route layer', 'DELETE');

-- hatch_alerts (012)
select public.__riverscout_apply_write_policy('hatch_alerts', 'Hatch alerts writable via route layer', 'INSERT');
select public.__riverscout_apply_write_policy('hatch_alerts', 'Hatch alerts updatable via route layer', 'UPDATE');
select public.__riverscout_apply_write_policy('hatch_alerts', 'Hatch alerts deletable via route layer', 'DELETE');

-- river_hazards (015)
select public.__riverscout_apply_write_policy('river_hazards', 'Hazards writable via route layer', 'INSERT');
select public.__riverscout_apply_write_policy('river_hazards', 'Hazards updatable via route layer', 'UPDATE');
select public.__riverscout_apply_write_policy('river_hazards', 'Hazards deletable via route layer', 'DELETE');

-- river_hazard_confirmations (015)
select public.__riverscout_apply_write_policy('river_hazard_confirmations', 'Hazard confirmations writable via route layer', 'INSERT');
select public.__riverscout_apply_write_policy('river_hazard_confirmations', 'Hazard confirmations updatable via route layer', 'UPDATE');
select public.__riverscout_apply_write_policy('river_hazard_confirmations', 'Hazard confirmations deletable via route layer', 'DELETE');

-- digest_log (017)
select public.__riverscout_apply_write_policy('digest_log', 'Digest log writable via route layer', 'INSERT');

-- river_permits (016)
select public.__riverscout_apply_write_policy('river_permits', 'Permits updatable via route layer', 'UPDATE');

-- ─── 4. Drop the helper function ──────────────────────────────────
-- Keeps the schema clean — this function only exists during
-- migration runtime.
drop function if exists public.__riverscout_apply_write_policy(text, text, text);
