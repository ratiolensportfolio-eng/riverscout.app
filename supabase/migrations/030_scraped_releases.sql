-- Migration 030: scraped_releases table
--
-- Output target for the release scraper framework. Scraped data
-- lives in its own table — separate from the hand-curated
-- DAM_RELEASES in data/dam-releases.ts — so the two sources
-- can never contaminate each other. The /releases page reads
-- from BOTH at render time and merges them for display.
--
-- One row per (source_id, source_record_id) pair after fuzzy-
-- matching the upstream water body name to a river_id we track.
-- Adapters that produce no matchable rivers don't write anything.
--
-- Idempotency: scraper re-runs check existing rows in this
-- table by (source_id, source_record_id) and skip duplicates
-- in application code (the proven pattern from the DNR stocking
-- pipeline).

create table if not exists public.scraped_releases (
  id uuid primary key default gen_random_uuid(),
  -- Stable adapter ID from lib/release-scrapers/types.ts
  -- (e.g. 'wi-dnr-releases', 'usace-water-mgmt-api')
  source_id text not null,
  -- Stable per-record ID from the upstream source. Curly
  -- braces stripped, lowercased, normalized at adapter time.
  source_record_id text not null,
  -- Matched river_id from data/rivers.ts
  river_id text not null,
  release_date date not null,
  start_time text,
  end_time text,
  expected_cfs integer,
  release_name text,
  agency text not null,
  notes text,
  fetched_at timestamptz not null default now(),
  unique(source_id, source_record_id)
);

create index if not exists idx_scraped_releases_river on public.scraped_releases(river_id);
create index if not exists idx_scraped_releases_date on public.scraped_releases(release_date);
create index if not exists idx_scraped_releases_source on public.scraped_releases(source_id);

alter table public.scraped_releases enable row level security;

-- Public read so the /releases page can render scraped entries
-- alongside the hand-curated ones without auth.
create policy "Scraped releases are publicly readable"
  on public.scraped_releases for select
  using (true);

-- Writes only via the cron, which uses the service role and
-- bypasses RLS. No insert/update policy is needed.

comment on table public.scraped_releases is
  'Output of the release scraper orchestrator. Each row is a single dam release event scraped from an upstream agency source and matched to a river_id in our database. Separate from the hand-curated DAM_RELEASES in data/dam-releases.ts.';
comment on column public.scraped_releases.source_id is
  'Adapter ID from lib/release-scrapers — e.g. "wi-dnr-releases", "usace-water-mgmt-api".';
