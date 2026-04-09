-- Self-populating NWS gauge LID discovery cache
-- Maps USGS site IDs to NWS AHPS LIDs for flow forecast lookups

create table if not exists public.gauge_mappings (
  usgs_site_id text primary key,
  nws_lid text,
  river_name text,
  discovered_at timestamptz default now(),
  last_verified timestamptz default now(),
  has_forecast boolean default false,
  forecast_url text,
  status text default 'pending'
    check (status in ('pending','found','not_found','error'))
);

create index if not exists idx_gauge_mappings_status on public.gauge_mappings(status);

alter table public.gauge_mappings enable row level security;

create policy "Gauge mappings are publicly readable"
  on public.gauge_mappings for select
  using (true);

create policy "System can write gauge mappings"
  on public.gauge_mappings for all
  using (true);

-- Seed with the 16 verified mappings from app/api/pro/forecast/route.ts
insert into public.gauge_mappings
  (usgs_site_id, nws_lid, river_name, has_forecast, status)
values
  -- Au Sable chain (Michigan)
  ('04136000', 'RDOM4', 'Au Sable River near Red Oak', true, 'found'),
  ('04136500', 'MIOM4', 'Au Sable River at Mio (Mio Dam)', true, 'found'),
  ('04136900', 'MCKM4', 'Au Sable River near McKinley', true, 'found'),
  ('04137005', 'CSVM4', 'Au Sable River at Curtisville (Alcona Dam)', true, 'found'),
  ('04137500', 'ASBM4', 'Au Sable River near Au Sable', true, 'found'),
  -- Manistee chain (Michigan)
  ('04123500', 'GYMM4', 'Manistee River near Grayling', true, 'found'),
  ('04124000', 'SHRM4', 'Manistee River near Sherman', true, 'found'),
  ('04124200', 'MSKM4', 'Manistee River near Mesick (Hodenpyl Dam)', true, 'found'),
  ('04125550', 'WLSM4', 'Manistee River at Wellston (Tippy Dam)', true, 'found'),
  -- Muskegon (Michigan)
  ('04121970', 'CROM4', 'Muskegon River near Croton (Croton Dam)', true, 'found'),
  -- Grand / Saginaw / Tittabawassee (Michigan)
  ('04116000', 'IONM4', 'Grand River at Ionia', true, 'found'),
  ('04157005', 'SAGM4', 'Saginaw River at Saginaw', true, 'found'),
  ('04156000', 'MIDM4', 'Tittabawassee River at Midland', true, 'found'),
  -- Montana
  ('06043500', 'GLGM8', 'Gallatin River near Gallatin Gateway', true, 'found'),
  ('06192500', 'LIVM8', 'Yellowstone River at Livingston', true, 'found'),
  -- West Virginia
  ('03189600', 'SUMW2', 'Gauley River below Summersville Lake', true, 'found')
on conflict (usgs_site_id) do nothing;
