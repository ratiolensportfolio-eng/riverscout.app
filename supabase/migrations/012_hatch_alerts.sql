-- Hatch alert subscriptions
create table if not exists public.hatch_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  email text not null,
  river_id text not null,
  river_name text not null,
  state_key text not null,
  hatch_id uuid references river_hatches(id),
  hatch_name text not null,
  species text not null,
  notify_days_before integer default 7,
  notify_on_temp_trigger boolean default true,
  notify_on_calendar boolean default true,
  last_notified_at timestamptz,
  active boolean default true,
  created_at timestamptz default now(),
  unique(email, river_id, hatch_name)
);

-- Hatch conditions log — tracks when conditions are met
create table if not exists public.hatch_conditions_log (
  id uuid primary key default gen_random_uuid(),
  river_id text not null,
  hatch_name text not null,
  condition_type text check (condition_type in
    ('temp_trigger', 'calendar_window', 'peak_conditions')),
  water_temp_f numeric,
  condition_met_at timestamptz default now(),
  alert_sent boolean default false,
  recipients_count integer default 0
);

-- Indexes
create index if not exists idx_hatch_alerts_user on public.hatch_alerts(user_id);
create index if not exists idx_hatch_alerts_river on public.hatch_alerts(river_id);
create index if not exists idx_hatch_alerts_email on public.hatch_alerts(email);
create index if not exists idx_hatch_conditions_river on public.hatch_conditions_log(river_id);

-- RLS
alter table public.hatch_alerts enable row level security;
alter table public.hatch_conditions_log enable row level security;

create policy "Users manage own hatch alerts"
  on public.hatch_alerts for all
  using (auth.uid() = user_id);

create policy "Hatch conditions log is publicly readable"
  on public.hatch_conditions_log for select
  using (true);

-- Allow the cron/API to insert condition logs
create policy "System can insert hatch conditions"
  on public.hatch_conditions_log for insert
  with check (true);

create policy "System can update hatch conditions"
  on public.hatch_conditions_log for update
  using (true);
