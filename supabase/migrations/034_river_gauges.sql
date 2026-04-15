-- Migration 034: Multi-gauge support
--
-- Many real rivers have multiple USGS/WSC gauges along their length
-- — different sections (above/below a dam, main stem vs branches).
-- This table lets us attach an arbitrary number of gauges per river
-- and pick a primary, while the river page UI lets paddlers switch
-- between gauges to see the section they're putting in on.
--
-- river_id is the same string key used in data/rivers.ts. We don't
-- have a real `rivers` table, so the FK is informational only — there
-- is no rivers table to reference. We rely on the application code
-- to validate.
--
-- Idempotent. Safe to re-run.

create table if not exists public.river_gauges (
  id uuid primary key default gen_random_uuid(),
  river_id text not null,
  gauge_id text not null,
  gauge_name text not null,
  gauge_source text not null default 'usgs'
    check (gauge_source in ('usgs', 'wsc', 'manual')),
  river_section text,
  river_mile numeric,
  is_primary boolean not null default false,
  lat numeric,
  lng numeric,
  notes text,
  created_at timestamptz not null default now(),
  -- One row per (river, gauge) combo — re-seeding never duplicates.
  unique (river_id, gauge_id)
);

create index if not exists idx_river_gauges_river
  on public.river_gauges (river_id, is_primary desc, river_mile asc nulls last);

create index if not exists idx_river_gauges_gauge
  on public.river_gauges (gauge_id);

-- ── RLS — public read, no public write ────────────────────────
alter table public.river_gauges enable row level security;

drop policy if exists "Gauges publicly readable" on public.river_gauges;
create policy "Gauges publicly readable"
  on public.river_gauges for select
  using (true);
-- Insert/update/delete go through service-role admin endpoints —
-- no RLS policy means no anon access.
