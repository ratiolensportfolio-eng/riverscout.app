-- Custom optimal CFS ranges per user per river (Pro feature)
create table if not exists public.custom_cfs_ranges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  river_id text not null,
  min_cfs integer not null,
  max_cfs integer not null,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, river_id)
);

create index if not exists idx_custom_cfs_user on public.custom_cfs_ranges(user_id);
create index if not exists idx_custom_cfs_river on public.custom_cfs_ranges(river_id);

alter table public.custom_cfs_ranges enable row level security;

create policy "Users manage own CFS ranges"
  on public.custom_cfs_ranges for all
  using (auth.uid() = user_id);
