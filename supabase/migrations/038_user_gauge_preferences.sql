-- Migration 038: per-user gauge preference per river
--
-- When a user picks a non-primary gauge from the river-page
-- popover, that choice currently lives only in browser localStorage.
-- The dashboard ignores it and shows the river's primary gauge.
--
-- This table persists the choice server-side so it survives across
-- devices and drives the dashboard's per-card gauge selection.
--
-- Idempotent.

create table if not exists public.user_gauge_preferences (
  user_id    uuid not null,
  river_id   text not null,
  gauge_id   text not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, river_id)
);

create index if not exists idx_user_gauge_pref_user
  on public.user_gauge_preferences (user_id);

alter table public.user_gauge_preferences enable row level security;

drop policy if exists "Owner read gauge prefs" on public.user_gauge_preferences;
create policy "Owner read gauge prefs"
  on public.user_gauge_preferences for select
  using (auth.uid() = user_id);

-- Writes go through service-role API routes (matches saved_rivers
-- pattern). No anon write policy.
