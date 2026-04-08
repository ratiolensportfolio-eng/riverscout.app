-- User profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  username text unique not null,
  display_name text not null,
  avatar_url text,
  bio text,
  home_state text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_profiles_username on public.profiles(username);

-- Saved rivers (private to owner)
create table if not exists public.saved_rivers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  river_id text not null,
  created_at timestamptz not null default now(),
  unique(user_id, river_id)
);

create index if not exists idx_saved_rivers_user on public.saved_rivers(user_id);

-- RLS
alter table public.profiles enable row level security;
alter table public.saved_rivers enable row level security;

-- Profiles are publicly readable
create policy "Public read profiles" on public.profiles
  for select using (true);

-- Users can update their own profile
create policy "Users update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Users can insert their own profile
create policy "Users insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Saved rivers: only owner can read/write
create policy "Owner read saved rivers" on public.saved_rivers
  for select using (auth.uid() = user_id);

create policy "Owner insert saved rivers" on public.saved_rivers
  for insert with check (auth.uid() = user_id);

create policy "Owner delete saved rivers" on public.saved_rivers
  for delete using (auth.uid() = user_id);

-- Auto-create profile on first sign-in via trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name, avatar_url)
  values (
    new.id,
    coalesce(split_part(new.email, '@', 1), 'user_' || substr(new.id::text, 1, 8)),
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update set
    display_name = coalesce(excluded.display_name, profiles.display_name),
    avatar_url = coalesce(excluded.avatar_url, profiles.avatar_url),
    updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

-- Drop existing trigger if any, then create
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
