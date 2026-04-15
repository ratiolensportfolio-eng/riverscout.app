-- Migration 039: Personal paddling log (Pro feature)
--
-- Per-user, private river journal — distinct from public trip_reports
-- (which are reviews other users see). The log captures personal trip
-- history with optional miles, hours, conditions, notes — feeds the
-- /journal page's stats: total trips, miles, hours, top rivers, etc.
--
-- Idempotent.

create table if not exists public.paddling_log (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null,
  river_id     text not null,
  river_name   text not null,
  trip_date    date not null,
  miles        numeric,
  hours        numeric,
  flow_cfs     integer,
  conditions   text,         -- short tag: "perfect", "high water", "cold start"
  notes        text,         -- long-form
  photo_url    text,         -- single photo, optional (uses trip-photos bucket)
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists idx_paddling_log_user_date
  on public.paddling_log (user_id, trip_date desc);
create index if not exists idx_paddling_log_user_river
  on public.paddling_log (user_id, river_id);

alter table public.paddling_log enable row level security;

drop policy if exists "Owner read paddling log" on public.paddling_log;
create policy "Owner read paddling log"
  on public.paddling_log for select
  using (auth.uid() = user_id);

-- Writes go through service-role API routes (matches saved_rivers /
-- gauge-prefs pattern). No anon write policy.
