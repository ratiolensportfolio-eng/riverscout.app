-- Community leaderboard + personal journal system
--
-- Replaces the anonymous trip_reports table (migration 002) with an
-- auth-required, AI-verified shape. Adds fish_catches (new) and
-- extends user_profiles with leaderboard counters.
--
-- Scope decisions (pre-aligned with product):
--   - paddling_log (mig 039) stays as a PRIVATE journal surface.
--     trip_reports is the PUBLIC leaderboard-eligible feed.
--   - user_profiles counters are cached aggregates, refreshed by the
--     AI verification path (not triggers — we want the verifier to
--     be the single source of truth for what "counts").
--   - river_id is text with an index only — no FK to rivers(id), to
--     match the existing pattern and avoid drift with data/rivers.ts.
--   - Storage: new 'fish-photos' bucket (public read for leaderboard
--     thumbnails). 'trip-photos' from mig 002 stays as-is.

-- ── trip_reports: DROP + CREATE (no data to preserve) ─────────────
drop table if exists public.trip_reports cascade;

create table public.trip_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  river_id text not null,
  trip_date date not null,
  cfs_at_time integer,
  water_temp numeric,
  duration_hours numeric,
  party_size integer,
  watercraft text,
  report_text text not null,
  conditions_rating integer check (conditions_rating between 1 and 5),
  ai_verified boolean default false,
  ai_confidence numeric,
  ai_verification_notes text,
  verified_at timestamptz,
  status text default 'pending' check (status in ('pending','verified','flagged','rejected')),
  created_at timestamptz default now()
);

create index idx_trip_reports_river on public.trip_reports(river_id);
create index idx_trip_reports_user on public.trip_reports(user_id);
create index idx_trip_reports_status on public.trip_reports(status);
create index idx_trip_reports_created on public.trip_reports(created_at desc);

alter table public.trip_reports enable row level security;

-- Public reads: verified reports only. Authed users also see their
-- own pending/flagged/rejected rows so they can see submission state.
create policy "Public reads verified trip reports"
  on public.trip_reports for select
  using (status = 'verified');

create policy "Users read own trip reports any status"
  on public.trip_reports for select
  using (auth.uid() = user_id);

-- Server routes (service role) do the writes. This permissive policy
-- matches the rest of the codebase where /api routes are the write
-- layer. The API route validates auth before inserting.
create policy "Route layer inserts trip reports"
  on public.trip_reports for insert
  with check (true);

create policy "Route layer updates trip reports"
  on public.trip_reports for update
  using (true);

-- ── fish_catches (new) ────────────────────────────────────────────
create table public.fish_catches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  river_id text not null,
  catch_date date not null,
  species text not null,
  weight_lbs numeric,
  length_inches numeric,
  photo_url text,
  photo_exif_lat numeric,
  photo_exif_lng numeric,
  photo_exif_timestamp timestamptz,
  river_proximity_verified boolean default false,
  ai_species_confirmed boolean default false,
  ai_weight_plausible boolean default false,
  verification_status text default 'pending' check (verification_status in ('pending','verified','flagged','rejected')),
  catch_and_release boolean default true,
  notes text,
  created_at timestamptz default now()
);

create index idx_fish_catches_river on public.fish_catches(river_id);
create index idx_fish_catches_user on public.fish_catches(user_id);
create index idx_fish_catches_status on public.fish_catches(verification_status);
create index idx_fish_catches_species on public.fish_catches(species);
-- Leaderboard queries sort verified catches per species by weight:
create index idx_fish_catches_species_weight
  on public.fish_catches(species, weight_lbs desc)
  where verification_status = 'verified';

alter table public.fish_catches enable row level security;

create policy "Public reads verified catches"
  on public.fish_catches for select
  using (verification_status = 'verified');

create policy "Users read own catches any status"
  on public.fish_catches for select
  using (auth.uid() = user_id);

create policy "Route layer inserts catches"
  on public.fish_catches for insert
  with check (true);

create policy "Route layer updates catches"
  on public.fish_catches for update
  using (true);

-- ── user_profiles: ALTER to add leaderboard counters ──────────────
-- The counters are cached aggregates. The AI verifier bumps them
-- when it flips a submission to 'verified'. If they drift they can
-- always be rebuilt from trip_reports + fish_catches counts.
alter table public.user_profiles
  add column if not exists total_verified_trips integer default 0,
  add column if not exists total_verified_catches integer default 0,
  add column if not exists contribution_score integer default 0;

-- ── Storage: fish-photos bucket ───────────────────────────────────
-- Public read so leaderboard thumbnails work for anon visitors.
-- Auth-required write (enforced by the submission API, which checks
-- the session before issuing the signed upload URL).
insert into storage.buckets (id, name, public)
values ('fish-photos', 'fish-photos', true)
on conflict (id) do nothing;

create policy "Public reads fish-photos"
  on storage.objects for select
  using (bucket_id = 'fish-photos');

create policy "Authed uploads fish-photos"
  on storage.objects for insert
  with check (bucket_id = 'fish-photos' and auth.uid() is not null);
