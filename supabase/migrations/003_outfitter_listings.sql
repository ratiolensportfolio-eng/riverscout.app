-- Outfitter listings with tiered subscriptions
-- NOTE: This schema has been created directly in Supabase.
-- This file is kept as reference only.

create table public.outfitters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  business_name text not null,
  description text,
  website text,
  phone text,
  logo_url text,
  cover_photo_url text,
  tier text default 'listed' check (tier in ('listed','featured','sponsored','guide','destination')),
  river_ids text[] default '{}',
  state_keys text[] default '{}',
  specialty_tags text[] default '{}',
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_price_id text,
  active boolean default false,
  founding_member boolean default false,
  clicks integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.outfitter_clicks (
  id uuid primary key default gen_random_uuid(),
  outfitter_id uuid references public.outfitters on delete cascade,
  river_id text,
  source text check (source in ('overview','outfitters_tab','flow_alert','search','guide_tab')),
  clicked_at timestamptz default now()
);

-- Index for analytics queries
create index if not exists idx_clicks_outfitter_date on public.outfitter_clicks(outfitter_id, clicked_at desc);
create index if not exists idx_clicks_source on public.outfitter_clicks(source);

alter table public.outfitters enable row level security;
alter table public.outfitter_clicks enable row level security;

-- Outfitters can read and update their own listing
create policy "Outfitters manage own listing"
  on public.outfitters for all
  using (auth.uid() = user_id);

-- Listings are publicly readable when active
create policy "Active listings are public"
  on public.outfitters for select
  using (active = true);

-- RPC function to increment clicks atomically
create or replace function increment_outfitter_clicks(outfitter_uuid uuid)
returns void as $$
begin
  update public.outfitters
  set clicks = clicks + 1, updated_at = now()
  where id = outfitter_uuid;
end;
$$ language plpgsql security definer;
