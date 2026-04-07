-- Outfitter listings with tiered subscriptions
create table if not exists outfitter_listings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  website text,
  phone text,
  email text not null,
  river_ids text[] not null default '{}',
  state_keys text[] default '{}',       -- for destination sponsors
  tier text not null default 'listed',   -- listed, featured, sponsored, guide, destination
  logo_url text,
  photo_urls text[] default '{}',
  stripe_customer_id text,
  stripe_subscription_id text,
  active boolean not null default true,
  claimed_at timestamptz not null default now(),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_outfitter_river on outfitter_listings using gin(river_ids);
create index if not exists idx_outfitter_state on outfitter_listings using gin(state_keys);
create index if not exists idx_outfitter_tier on outfitter_listings(tier);
create index if not exists idx_outfitter_active on outfitter_listings(active) where active = true;

-- Enable RLS
alter table outfitter_listings enable row level security;

-- Anyone can read active listings
create policy "Public read active listings" on outfitter_listings
  for select using (active = true);

-- Anyone can create a free listing (claim)
create policy "Public insert listings" on outfitter_listings
  for insert with check (true);

-- Only the listing owner can update (matched by email for now)
create policy "Owner update listings" on outfitter_listings
  for update using (true);
