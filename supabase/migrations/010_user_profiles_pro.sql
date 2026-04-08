-- User profiles with Pro subscription support
-- Auto-created on signup via trigger

create table if not exists public.user_profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  email text,
  avatar_url text,
  home_state text,
  is_pro boolean default false,
  pro_tier text check (pro_tier in ('monthly','yearly')),
  stripe_customer_id text,
  stripe_subscription_id text,
  pro_started_at timestamptz,
  pro_expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.user_profiles enable row level security;

create policy "Users read own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "Users update own profile"
  on public.user_profiles for update
  using (auth.uid() = id);

-- Public read for profile pages
create policy "Public read profiles"
  on public.user_profiles for select
  using (true);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists then recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
