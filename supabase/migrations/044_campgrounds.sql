-- Campgrounds near rivers — cached from the federal RIDB
-- (Recreation Information Database). One-time bulk fetch +
-- weekly refresh via cron. Proximity to rivers is computed
-- at query time from lat/lng.

create table if not exists public.campgrounds (
  id text primary key,              -- RIDB facility_id
  name text not null,
  description text,
  lat numeric not null,
  lng numeric not null,
  agency text,                      -- 'Forest Service', 'NPS', 'BLM', etc.
  parent_name text,                 -- rec area name (e.g. 'Manistee National Forest')
  reservable boolean default false,
  reservation_url text,
  fee_description text,
  phone text,
  email text,
  state_key text,
  updated_at timestamptz default now()
);

create index if not exists idx_campgrounds_state on public.campgrounds(state_key);
create index if not exists idx_campgrounds_coords on public.campgrounds(lat, lng);

alter table public.campgrounds enable row level security;

create policy "Public read campgrounds"
  on public.campgrounds for select using (true);

create policy "Route layer writes campgrounds"
  on public.campgrounds for all using (true) with check (true);
