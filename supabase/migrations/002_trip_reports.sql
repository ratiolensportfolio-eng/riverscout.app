-- Trip reports table
create table if not exists trip_reports (
  id uuid primary key default gen_random_uuid(),
  river_id text not null,
  river_name text not null,
  author_name text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  flow_cfs integer,
  trip_date date,
  body text not null,
  photos text[] default '{}',  -- array of Supabase Storage URLs
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_trip_reports_river on trip_reports(river_id);
create index if not exists idx_trip_reports_created on trip_reports(created_at desc);

-- Enable RLS
alter table trip_reports enable row level security;

-- Anyone can read reports
create policy "Public read access" on trip_reports
  for select using (true);

-- Anyone can create reports (no auth for MVP)
create policy "Public insert access" on trip_reports
  for insert with check (true);

-- Set up storage bucket for trip report photos
insert into storage.buckets (id, name, public)
values ('trip-photos', 'trip-photos', true)
on conflict (id) do nothing;

-- Anyone can upload to trip-photos bucket
create policy "Public upload to trip-photos" on storage.objects
  for insert with check (bucket_id = 'trip-photos');

-- Anyone can read trip-photos
create policy "Public read trip-photos" on storage.objects
  for select using (bucket_id = 'trip-photos');
