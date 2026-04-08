-- Stocking events (historical and scheduled)
create table if not exists public.river_stocking (
  id uuid primary key default gen_random_uuid(),
  river_id text not null,
  state_key text not null,
  stocking_date date not null,
  is_scheduled boolean default false,
  species text not null,
  quantity integer,
  size_inches numeric,
  size_category text check (size_category in
    ('fingerling','sub-catchable','catchable',
     'trophy','broodstock')),
  location_description text,
  location_miles_marker numeric,
  stocking_authority text,
  source_url text,
  verified boolean default false,
  submitted_by uuid references auth.users,
  created_at timestamptz default now()
);

-- User stocking alert subscriptions
create table if not exists public.stocking_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  email text not null,
  river_id text not null,
  state_key text not null,
  species_filter text[],
  notify_historical boolean default true,
  notify_scheduled boolean default true,
  active boolean default true,
  created_at timestamptz default now(),
  unique(email, river_id)
);

-- Indexes
create index if not exists idx_stocking_river on public.river_stocking(river_id);
create index if not exists idx_stocking_date on public.river_stocking(stocking_date);
create index if not exists idx_stocking_state on public.river_stocking(state_key);
create index if not exists idx_stocking_alerts_user on public.stocking_alerts(user_id);
create index if not exists idx_stocking_alerts_river on public.stocking_alerts(river_id);

-- RLS
alter table public.river_stocking enable row level security;
alter table public.stocking_alerts enable row level security;

create policy "Stocking data is publicly readable"
  on public.river_stocking for select
  using (true);

create policy "Authenticated users can submit stocking reports"
  on public.river_stocking for insert
  with check (auth.uid() is not null);

create policy "Users manage own stocking alerts"
  on public.stocking_alerts for all
  using (auth.uid() = user_id);
