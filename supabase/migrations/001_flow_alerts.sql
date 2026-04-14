-- Flow alerts subscription table
create table if not exists flow_alerts (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  river_id text not null,
  river_name text not null,
  state_key text,
  threshold text not null default 'optimal',  -- 'optimal', 'high', 'flood', 'any'
  active boolean not null default true,
  last_notified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- One alert per email+river combo
  unique(email, river_id)
);

-- Index for cron job lookups
create index if not exists idx_flow_alerts_active on flow_alerts(active) where active = true;
create index if not exists idx_flow_alerts_email on flow_alerts(email);

-- Enable RLS
alter table flow_alerts enable row level security;

-- Drop + recreate so re-runs don't fail on "already exists"
drop policy if exists "Anyone can create alerts" on flow_alerts;
drop policy if exists "Anyone can read alerts by email" on flow_alerts;
drop policy if exists "Anyone can delete alerts" on flow_alerts;
drop policy if exists "Anyone can update alerts" on flow_alerts;

-- Allow anonymous inserts (no auth required for MVP)
create policy "Anyone can create alerts" on flow_alerts
  for insert with check (true);

-- Allow reading own alerts by email
create policy "Anyone can read alerts by email" on flow_alerts
  for select using (true);

-- Allow deleting own alerts
create policy "Anyone can delete alerts" on flow_alerts
  for delete using (true);

-- Allow updating own alerts
create policy "Anyone can update alerts" on flow_alerts
  for update using (true);
