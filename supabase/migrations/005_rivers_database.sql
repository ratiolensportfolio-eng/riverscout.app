-- ══════════════════════════════════════════════════════════════════
-- RiverScout River Database Migration
-- Migrates all river data from hardcoded rivers.ts to Supabase
-- ══════════════════════════════════════════════════════════════════

-- ── States ───────────────────────────────────────────────────────
create table if not exists public.states (
  key text primary key,              -- 'mi', 'wv', 'co', etc.
  name text not null,                -- 'Michigan'
  abbr text not null,                -- 'MI'
  label text not null,               -- 'Michigan Rivers'
  filters text[] default '{}',       -- ['all', 'lp', 'up', 'wild', 'nat', 'ww']
  filter_labels jsonb default '{}',  -- { all: 'All', lp: 'Lower Peninsula', ... }
  created_at timestamptz default now()
);

-- ── Rivers ───────────────────────────────────────────────────────
create table if not exists public.rivers (
  id text primary key,               -- 'pine_mi', 'gauley', etc.
  state_key text not null references public.states(key),
  name text not null,                -- 'Pine River'
  county text not null,              -- 'Lake / Osceola Co.'
  length text not null,              -- '60 mi'
  class text not null,               -- 'I', 'Riffles', 'III-IV'
  optimal_cfs text not null,         -- '150-350'
  usgs_gauge text not null,          -- '04125460'
  avg_cfs integer not null,
  hist_flow integer not null,
  map_x integer default 0,
  map_y integer default 0,
  description text not null default '',
  designations text not null default '',
  sections text[] default '{}',      -- array of section descriptions
  filter_flags jsonb default '{}',   -- { lp: true, up: false, wild: true, ... }
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_rivers_state on public.rivers(state_key);

-- ── River History ────────────────────────────────────────────────
create table if not exists public.river_history (
  id uuid primary key default gen_random_uuid(),
  river_id text not null references public.rivers(id) on delete cascade,
  era text not null,                 -- 'native', 'logging', 'survey', 'modern'
  year text not null,
  title text not null,
  body text not null,
  source text not null,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create index if not exists idx_history_river on public.river_history(river_id);

-- ── River Documents ──────────────────────────────────────────────
create table if not exists public.river_documents (
  id uuid primary key default gen_random_uuid(),
  river_id text not null references public.rivers(id) on delete cascade,
  title text not null,
  source text not null,
  year integer not null,
  doc_type text not null,            -- 'Federal', 'Survey', 'Ecology', etc.
  pages integer default 0,
  url text,
  created_at timestamptz default now()
);

create index if not exists idx_docs_river on public.river_documents(river_id);

-- ── River Reviews (hardcoded seed data) ──────────────────────────
create table if not exists public.river_reviews (
  id uuid primary key default gen_random_uuid(),
  river_id text not null references public.rivers(id) on delete cascade,
  username text not null,
  review_date text not null,
  stars integer not null check (stars >= 1 and stars <= 5),
  body text not null,
  is_seed boolean default false,     -- true for migrated hardcoded reviews
  created_at timestamptz default now()
);

create index if not exists idx_reviews_river on public.river_reviews(river_id);

-- ── River Outfitters (hardcoded seed data) ───────────────────────
create table if not exists public.river_outfitters (
  id uuid primary key default gen_random_uuid(),
  river_id text not null references public.rivers(id) on delete cascade,
  name text not null,
  description text not null default '',
  link text default '',
  is_seed boolean default false,
  created_at timestamptz default now()
);

create index if not exists idx_outfitters_seed_river on public.river_outfitters(river_id);

-- ── Fisheries ────────────────────────────────────────────────────
create table if not exists public.river_species (
  id uuid primary key default gen_random_uuid(),
  river_id text not null references public.rivers(id) on delete cascade,
  name text not null,                -- 'Brown Trout'
  species_type text not null,        -- 'resident', 'anadromous', 'warmwater'
  is_primary boolean default false,
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.river_designations_fish (
  id uuid primary key default gen_random_uuid(),
  river_id text not null references public.rivers(id) on delete cascade,
  designation text not null,         -- 'Blue-Ribbon Trout Stream'
  created_at timestamptz default now()
);

create table if not exists public.river_spawning (
  id uuid primary key default gen_random_uuid(),
  river_id text not null references public.rivers(id) on delete cascade,
  species text not null,
  season text not null,
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.river_hatches (
  id uuid primary key default gen_random_uuid(),
  river_id text not null references public.rivers(id) on delete cascade,
  name text not null,                -- 'Hex (Hexagenia limbata)'
  timing text not null,              -- 'Late June - Early July'
  notes text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create table if not exists public.river_runs (
  id uuid primary key default gen_random_uuid(),
  river_id text not null references public.rivers(id) on delete cascade,
  species text not null,             -- 'Chinook Salmon'
  timing text not null,              -- 'September - November'
  peak text,                         -- 'Late September'
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.river_guides (
  id uuid primary key default gen_random_uuid(),
  river_id text not null references public.rivers(id) on delete cascade,
  name text not null,
  created_at timestamptz default now()
);

-- ── Named Rapids ─────────────────────────────────────────────────
create table if not exists public.river_rapids (
  id uuid primary key default gen_random_uuid(),
  river_id text not null references public.rivers(id) on delete cascade,
  name text not null,                -- 'Lava Falls'
  class text not null,               -- 'V'
  lat double precision not null,
  lng double precision not null,
  description text not null,
  mile double precision,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create index if not exists idx_rapids_river on public.river_rapids(river_id);

-- ── RLS Policies ─────────────────────────────────────────────────
-- All river data is publicly readable
alter table public.states enable row level security;
alter table public.rivers enable row level security;
alter table public.river_history enable row level security;
alter table public.river_documents enable row level security;
alter table public.river_reviews enable row level security;
alter table public.river_outfitters enable row level security;
alter table public.river_species enable row level security;
alter table public.river_designations_fish enable row level security;
alter table public.river_spawning enable row level security;
alter table public.river_hatches enable row level security;
alter table public.river_runs enable row level security;
alter table public.river_guides enable row level security;
alter table public.river_rapids enable row level security;

create policy "Public read states" on public.states for select using (true);
create policy "Public read rivers" on public.rivers for select using (true);
create policy "Public read history" on public.river_history for select using (true);
create policy "Public read documents" on public.river_documents for select using (true);
create policy "Public read reviews" on public.river_reviews for select using (true);
create policy "Public read outfitters_seed" on public.river_outfitters for select using (true);
create policy "Public read species" on public.river_species for select using (true);
create policy "Public read fish_desig" on public.river_designations_fish for select using (true);
create policy "Public read spawning" on public.river_spawning for select using (true);
create policy "Public read hatches" on public.river_hatches for select using (true);
create policy "Public read runs" on public.river_runs for select using (true);
create policy "Public read guides" on public.river_guides for select using (true);
create policy "Public read rapids" on public.river_rapids for select using (true);

-- Admin can insert/update/delete all tables
create policy "Admin manage states" on public.states for all using (true);
create policy "Admin manage rivers" on public.rivers for all using (true);
create policy "Admin manage history" on public.river_history for all using (true);
create policy "Admin manage documents" on public.river_documents for all using (true);
create policy "Admin manage reviews_seed" on public.river_reviews for all using (true);
create policy "Admin manage outfitters_seed" on public.river_outfitters for all using (true);
create policy "Admin manage species" on public.river_species for all using (true);
create policy "Admin manage fish_desig" on public.river_designations_fish for all using (true);
create policy "Admin manage spawning" on public.river_spawning for all using (true);
create policy "Admin manage hatches" on public.river_hatches for all using (true);
create policy "Admin manage runs" on public.river_runs for all using (true);
create policy "Admin manage guides" on public.river_guides for all using (true);
create policy "Admin manage rapids" on public.river_rapids for all using (true);
