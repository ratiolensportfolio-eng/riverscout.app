-- Migration 032: River access points
--
-- User-editable access points (put-ins, takeouts) per river,
-- with confirmation tracking for crowdsourced verification, a
-- separate change-reports table for admin triage, and a Q&A-style
-- helpful counter for marking individual points as useful.
--
-- This is the third user-editable layer in RiverScout (after
-- suggestions and Q&A). It uses its own tables rather than
-- piggybacking on suggestions because access points have a rich
-- structured shape (lat/lng, parking capacity, facilities array)
-- that doesn't fit the suggestions table's flat key/value model.

create table public.river_access_points (
  id                              uuid primary key default gen_random_uuid(),
  river_id                        text not null,
  name                            text not null,
  description                     text check (length(description) <= 280),
  access_type                     text check (access_type in (
    'boat_ramp', 'carry_in', 'beach_launch', 'dock', 'steps', 'primitive'
  )),
  ramp_surface                    text check (ramp_surface in (
    'paved', 'gravel', 'dirt', 'concrete', 'sand', 'none'
  )),
  trailer_access                  boolean default false,
  max_trailer_length_ft           integer,
  parking_capacity                text check (parking_capacity in (
    'limited_under_5', 'small_5_to_15', 'medium_15_to_30', 'large_over_30'
  )),
  parking_fee                     boolean default false,
  fee_amount                      text,
  facilities                      text[] default '{}',
  lat                             numeric,
  lng                             numeric,
  river_mile                      numeric,
  distance_to_next_access_miles   numeric,
  next_access_name                text,
  float_time_to_next              text,
  seasonal_notes                  text,
  submitted_by                    uuid references auth.users on delete set null,
  submitted_by_name               text,
  verified                        boolean default false,
  verification_status             text default 'pending'
    check (verification_status in ('pending', 'verified', 'needs_review', 'rejected')),
  helpful_count                   integer default 0,
  last_verified_at                timestamptz,
  last_verified_by                text,
  -- AI pre-evaluation, mirrored from public.suggestions so the
  -- admin queue can render confidence + reasoning consistently.
  ai_confidence                   text check (ai_confidence in ('high', 'medium', 'low')),
  ai_reasoning                    text,
  admin_notes                     text,
  created_at                      timestamptz default now(),
  updated_at                      timestamptz default now()
);

create index idx_access_points_river
  on public.river_access_points (river_id, river_mile asc nulls last);

create index idx_access_points_status
  on public.river_access_points (verification_status, created_at desc);

-- ── Confirmations table ──────────────────────────────────
create table public.river_access_point_confirmations (
  id              uuid primary key default gen_random_uuid(),
  access_point_id uuid not null references public.river_access_points on delete cascade,
  user_id         uuid not null references auth.users on delete cascade,
  created_at      timestamptz default now(),
  unique (access_point_id, user_id)
);

create index idx_access_point_confirmations_ap
  on public.river_access_point_confirmations (access_point_id);
create index idx_access_point_confirmations_user
  on public.river_access_point_confirmations (user_id);

-- ── Change reports table ─────────────────────────────────
create table public.river_access_point_change_reports (
  id              uuid primary key default gen_random_uuid(),
  access_point_id uuid not null references public.river_access_points on delete cascade,
  user_id         uuid references auth.users on delete set null,
  change_type     text not null check (change_type in (
    'ramp_damaged', 'parking_reduced', 'access_closed',
    'facilities_changed', 'other'
  )),
  notes           text,
  status          text default 'open' check (status in ('open', 'resolved', 'dismissed')),
  created_at      timestamptz default now()
);

create index idx_access_point_change_reports_status
  on public.river_access_point_change_reports (status, created_at desc);

-- ── RLS ───────────────────────────────────────────────────

alter table public.river_access_points enable row level security;
alter table public.river_access_point_confirmations enable row level security;
alter table public.river_access_point_change_reports enable row level security;

-- Public reads see everything except rejected. Per the user's
-- decision: pending submissions are visible immediately so a
-- freshly-submitted access point shows up with a gray "pending"
-- dot rather than waiting for admin approval.
create policy "Access points publicly readable"
  on public.river_access_points for select
  using (verification_status != 'rejected');

create policy "Logged in users can submit"
  on public.river_access_points for insert
  with check (auth.uid() = submitted_by);

-- Submitter can fix typos while still pending. Locked once
-- verified — admin tools handle later edits via service role.
create policy "Owners can edit own pending submissions"
  on public.river_access_points for update
  using (auth.uid() = submitted_by and verification_status = 'pending')
  with check (auth.uid() = submitted_by and verification_status = 'pending');

create policy "Confirmations publicly readable"
  on public.river_access_point_confirmations for select
  using (true);

create policy "Logged in users can confirm"
  on public.river_access_point_confirmations for insert
  with check (auth.uid() = user_id);

create policy "Change reports publicly readable"
  on public.river_access_point_change_reports for select
  using (true);

create policy "Logged in users can report changes"
  on public.river_access_point_change_reports for insert
  with check (auth.uid() = user_id);

-- ── Helpful bump function ─────────────────────────────────
-- Q&A-style helpful click on individual access points. Anon
-- users can call it (matches how Q&A helpful works); admins can
-- prune obvious abuse from /admin. SECURITY DEFINER so we don't
-- need a blanket UPDATE policy on the parent row.
create or replace function public.bump_access_point_helpful(
  target_id uuid
) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.river_access_points
     set helpful_count = helpful_count + 1
   where id = target_id
     and verification_status != 'rejected';
end;
$$;

grant execute on function public.bump_access_point_helpful(uuid) to anon, authenticated;

-- ── Triggers ──────────────────────────────────────────────

-- Touch updated_at on every UPDATE so the freshness indicator
-- reflects edits, not just the original create timestamp.
create or replace function public.touch_river_access_points_updated_at()
returns trigger
language plpgsql
as $$
begin
  NEW.updated_at = now();
  return NEW;
end;
$$;

create trigger trg_touch_river_access_points
  before update on public.river_access_points
  for each row execute function public.touch_river_access_points_updated_at();

-- Auto-verify when distinct confirmations hit 3.
create or replace function public.maybe_auto_verify_access_point()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  total integer;
begin
  select count(*) into total
    from public.river_access_point_confirmations
   where access_point_id = NEW.access_point_id;

  if total >= 3 then
    update public.river_access_points
       set verification_status = 'verified',
           verified = true,
           last_verified_at = now(),
           last_verified_by = 'community (3+ confirmations)'
     where id = NEW.access_point_id
       and verification_status != 'verified';
  end if;
  return NEW;
end;
$$;

create trigger trg_maybe_auto_verify_access_point
  after insert on public.river_access_point_confirmations
  for each row execute function public.maybe_auto_verify_access_point();

-- When a change report comes in, flip a verified parent to
-- needs_review (amber state in the UI).
create or replace function public.flag_access_point_needs_review()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.river_access_points
     set verification_status = 'needs_review'
   where id = NEW.access_point_id
     and verification_status = 'verified';
  return NEW;
end;
$$;

create trigger trg_flag_access_point_needs_review
  after insert on public.river_access_point_change_reports
  for each row execute function public.flag_access_point_needs_review();
