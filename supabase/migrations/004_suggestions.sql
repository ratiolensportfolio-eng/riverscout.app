-- River data correction suggestions
create table if not exists public.suggestions (
  id uuid primary key default gen_random_uuid(),
  river_id text not null,
  river_name text not null,
  state_key text not null,
  user_id uuid references auth.users on delete set null,
  user_email text,
  field text not null,        -- which data field: cls, opt, species, access_points, etc.
  current_value text not null,
  suggested_value text not null,
  reason text not null,
  source_url text,            -- optional reference link
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  admin_notes text,
  ai_confidence text check (ai_confidence in ('high', 'medium', 'low')),
  ai_reasoning text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create index if not exists idx_suggestions_status on public.suggestions(status);
create index if not exists idx_suggestions_river on public.suggestions(river_id);

alter table public.suggestions enable row level security;

-- Anyone can read their own suggestions
create policy "Users read own suggestions" on public.suggestions
  for select using (auth.uid() = user_id or user_id is null);

-- Anyone can submit suggestions
create policy "Public insert suggestions" on public.suggestions
  for insert with check (true);

-- Admin can read all
create policy "Admin read all suggestions" on public.suggestions
  for select using (true);

-- Admin can update status
create policy "Admin update suggestions" on public.suggestions
  for update using (true);
