-- River hazard alerts
-- Time-sensitive safety warnings distinct from trip_reports. A hazard
-- auto-expires after 72 hours unless a logged-in user confirms it's still
-- present. Critical-severity hazards trigger an email blast to everyone
-- currently subscribed to flow alerts for the same river.

create table if not exists public.river_hazards (
  id uuid primary key default gen_random_uuid(),

  -- River reference. The canonical river data lives in data/rivers.ts, not
  -- in Supabase, so we keep river_id as plain text with no FK — matches the
  -- pattern used by trip_reports, flow_alerts, outfitters, etc.
  river_id text not null,
  river_name text not null,
  state_key text,

  -- Classification
  hazard_type text not null check (hazard_type in (
    'strainer',       -- downed tree / woody debris in the water
    'hydraulic',      -- sticky hole, low-head dam, pour-over
    'access_closure', -- boat ramp / parking / landowner closure
    'debris',         -- ice, trash rafts, construction debris, etc.
    'flood',          -- unsafe high water beyond normal flood alerts
    'other'
  )),
  severity text not null default 'warning' check (severity in (
    'info',     -- heads-up, non-blocking
    'warning',  -- paddlers should know, not necessarily life-threatening
    'critical'  -- life-threatening; sends email blast
  )),

  -- Content (all user-authored)
  title text not null,
  description text not null,
  location_description text, -- free-text: "river left above Tippy Dam", "mile 3 put-in"
  mile_marker numeric,       -- optional if the reporter knows it

  -- Reporter
  reported_by uuid references auth.users(id) on delete set null,
  reporter_name text,  -- display name cached at submission time
  reporter_email text, -- cached so we can contact the reporter without re-query

  -- Lifecycle
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '72 hours'),
  active boolean not null default true,

  -- Community confirmation: incremented when any logged-in user taps
  -- "still present" on the banner. Each confirmation also extends
  -- expires_at by another 72 hours (handled in the confirm API route).
  confirmations integer not null default 0,
  last_confirmed_at timestamptz,

  -- Resolution
  resolved_at timestamptz,
  resolved_by uuid references auth.users(id) on delete set null,
  resolved_note text, -- optional: "cleared by MDNR crew 4/12", "water dropped below danger"

  -- Email blast bookkeeping — so we don't double-send if the same hazard
  -- is touched multiple times via confirm/resolve.
  email_sent_at timestamptz,
  email_recipients_count integer default 0,

  -- Admin moderation
  admin_hidden boolean not null default false,
  admin_notes text
);

-- Confirmation ledger — one row per (hazard, user) pair. Prevents the
-- same user from ratcheting expires_at indefinitely by tapping confirm
-- in a loop; the unique constraint + upsert gives us idempotent
-- "still present" semantics.
create table if not exists public.river_hazard_confirmations (
  id uuid primary key default gen_random_uuid(),
  hazard_id uuid not null references public.river_hazards(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  confirmed_at timestamptz not null default now(),
  unique(hazard_id, user_id)
);

-- Indexes — the hot path is "give me active hazards for river X", which
-- is called on every river page load via server prefetch.
create index if not exists idx_river_hazards_river_active
  on public.river_hazards(river_id, active, expires_at desc)
  where active = true and admin_hidden = false;

create index if not exists idx_river_hazards_created
  on public.river_hazards(created_at desc);

create index if not exists idx_river_hazards_state
  on public.river_hazards(state_key);

create index if not exists idx_river_hazard_confirmations_hazard
  on public.river_hazard_confirmations(hazard_id);

-- RLS — hazards are public read, auth write, admin moderate.
alter table public.river_hazards enable row level security;
alter table public.river_hazard_confirmations enable row level security;

-- Anyone can read non-hidden hazards. We don't filter by active/expires_at
-- at the RLS layer because the admin page needs to see expired/inactive
-- rows too; filtering happens in the API layer.
create policy "Hazards are publicly readable"
  on public.river_hazards for select
  using (admin_hidden = false or auth.uid() is not null);

-- Any logged-in user can report a hazard. The row is attributed to them
-- via reported_by.
create policy "Authenticated users can report hazards"
  on public.river_hazards for insert
  with check (auth.uid() is not null and auth.uid() = reported_by);

-- Reporters can update their own hazards (for fixing typos right after
-- submission). Admin updates happen via the service role key from the
-- API layer, which bypasses RLS.
create policy "Users can update own hazards"
  on public.river_hazards for update
  using (auth.uid() = reported_by);

-- Confirmations: any logged-in user can write their own confirmation row,
-- and confirmations are publicly readable for transparency ("this hazard
-- has been confirmed by 3 paddlers in the last 24 hours").
create policy "Confirmations are publicly readable"
  on public.river_hazard_confirmations for select
  using (true);

create policy "Authenticated users can confirm hazards"
  on public.river_hazard_confirmations for insert
  with check (auth.uid() is not null and auth.uid() = user_id);
