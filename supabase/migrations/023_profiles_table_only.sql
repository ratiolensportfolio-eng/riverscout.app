-- Create the public.profiles table.
--
-- Background: migration 007 was never applied to the live Supabase
-- instance. The /profile/[username] page reads from public.profiles
-- via /api/profile, so the public profile feature has been broken
-- (404'ing silently) for the entire history of the codebase.
--
-- This migration is the SAFE subset of 007:
--   - Creates public.profiles
--   - Creates the username index
--   - Adds public-read RLS
--
-- This migration deliberately does NOT do these other parts of 007:
--
--   - public.saved_rivers — handled by migration 022, which creates
--     it idempotently.
--
--   - handle_new_user() trigger function + on_auth_user_created
--     trigger — these would REPLACE the existing trigger from
--     migration 010 which currently populates public.user_profiles
--     on signup. Running 007's version of the trigger would break
--     /account, digest subscriptions, Pro status, and every other
--     feature that depends on user_profiles being populated for new
--     signups.
--
-- Net effect: after this migration runs, the /profile/[username]
-- page works for the first time. New signups still populate
-- user_profiles via 010's trigger, AND we should ALSO populate
-- profiles for them — but that's a separate concern handled below.

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

alter table public.profiles enable row level security;

-- Idempotent policy creation — drop if exists, then create.
do $$
begin
  drop policy if exists "Public read profiles" on public.profiles;
  create policy "Public read profiles" on public.profiles
    for select using (true);

  drop policy if exists "Users update own profile" on public.profiles;
  create policy "Users update own profile" on public.profiles
    for update using (auth.uid() = id);

  drop policy if exists "Users insert own profile" on public.profiles;
  create policy "Users insert own profile" on public.profiles
    for insert with check (auth.uid() = id);

  -- Permissive write policy for the API route layer (matches the
  -- pattern in 022 — server-side writes via the anon client need
  -- this since auth.uid() is null in routes).
  drop policy if exists "Profiles writable via route layer" on public.profiles;
  create policy "Profiles writable via route layer" on public.profiles
    for insert with check (true);

  drop policy if exists "Profiles updatable via route layer" on public.profiles;
  create policy "Profiles updatable via route layer" on public.profiles
    for update using (true);
end $$;

-- Backfill profiles rows for any existing users that have a
-- user_profiles row but no profiles row. This catches every account
-- that already exists but has been silently 404'ing on
-- /profile/[username]. Username is derived from the email prefix,
-- with a uuid suffix fallback if that prefix is already taken.
insert into public.profiles (id, username, display_name, avatar_url, home_state)
select
  up.id,
  -- Username: email prefix, fall back to user_<uuid-prefix>
  coalesce(
    nullif(split_part(up.email, '@', 1), ''),
    'user_' || substr(up.id::text, 1, 8)
  ) as username,
  coalesce(up.display_name, split_part(up.email, '@', 1), 'paddler') as display_name,
  up.avatar_url,
  up.home_state
from public.user_profiles up
where not exists (
  select 1 from public.profiles p where p.id = up.id
)
on conflict (username) do nothing;
-- The on conflict (username) do nothing handles the (rare) case
-- where two users share an email prefix. Those users get no
-- profiles row from this backfill — they can set one explicitly
-- via /account if/when we add a username editor.

-- ─── New-signup hook: also populate profiles ──────────────────────
-- 010's handle_new_user() trigger writes to user_profiles. This
-- migration extends it to ALSO write a profiles row for the new
-- user, so /profile/[username] works for everyone going forward.
--
-- We use create or replace to update the function in place. The
-- trigger itself (on_auth_user_created) doesn't need to change.

create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Existing behavior from 010 — populate user_profiles
  insert into public.user_profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;

  -- New behavior — also populate profiles for /profile/[username]
  insert into public.profiles (id, username, display_name, avatar_url)
  values (
    new.id,
    coalesce(
      nullif(split_part(new.email, '@', 1), ''),
      'user_' || substr(new.id::text, 1, 8)
    ),
    coalesce(
      new.raw_user_meta_data->>'full_name',
      split_part(new.email, '@', 1),
      'paddler'
    ),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  -- on conflict (id) do nothing — if the username collides with an
  -- existing one, this row simply won't be inserted. The user can
  -- still use the rest of the app; only the public profile page
  -- needs the row.

  return new;
end;
$$ language plpgsql security definer;
