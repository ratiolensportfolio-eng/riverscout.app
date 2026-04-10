-- River permit information
-- Permit requirements for overnight / multi-day private trips on rivers
-- where they apply. The display layer treats absence of a row as
-- "no permit required" — we deliberately do NOT seed empty rows for
-- permit-free rivers, both to keep the table small and to avoid having
-- to maintain "no permit needed" rows for hundreds of rivers.

create table if not exists public.river_permits (
  id uuid primary key default gen_random_uuid(),

  -- River reference. Plain text id matching data/rivers.ts, no FK,
  -- same pattern as trip_reports / flow_alerts / hazards.
  river_id text not null,
  river_name text not null,
  state_key text not null,

  -- Permit identity
  permit_name text not null,
  managing_agency text not null,
  permit_type text check (permit_type in (
    'lottery_weighted',         -- Grand Canyon: weighted lottery
    'lottery_standard',         -- MFS, Rogue, Selway, Yampa, Lodore: even-odds
    'first_come_first_served',  -- some BLM and state programs
    'reservation',              -- Cataract, Westwater, BWCA: book a date
    'self_issue',               -- Illinois, Chattooga IV: free kiosk permit
    'no_permit_required'        -- defensive — almost never used; absence of row is the canonical signal
  )),
  required_for text check (required_for in (
    'overnight',
    'day_use',
    'all_launches',
    'commercial_only'
  )),

  -- Timing — text fields rather than dates because some agencies use
  -- "second Tuesday of February" rather than a fixed calendar date,
  -- and we want to surface the exact agency wording to users.
  application_opens text,
  application_closes text,
  results_date text,
  permit_season_start text,
  permit_season_end text,

  -- Trip parameters
  group_size_min integer default 1,
  group_size_max integer,
  cost_per_person numeric,
  cost_per_group numeric,

  -- Links
  apply_url text,
  info_url text,
  phone text,

  -- Free-form caveats. Used by the display component to surface tips
  -- like "Cancellations available year-round" or "Three-trip-per-year
  -- limit per leader".
  notes text,

  -- Commercial alternative — for users who didn't win the lottery,
  -- the display nudges them toward outfitters listed below.
  commercial_available boolean default false,
  commercial_notes text,

  -- Provenance — permit rules change yearly. last_verified_year drives
  -- the "verified 2025" footer on the display so users know how stale
  -- the data might be.
  verified boolean default true,
  last_verified_year integer,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.river_permits enable row level security;

create policy "Permit data is publicly readable"
  on public.river_permits for select using (true);

-- Hot path: "give me the permit row for this river_id" — fired on every
-- river page load via server prefetch.
create index if not exists idx_river_permits_river_id
  on public.river_permits(river_id);
