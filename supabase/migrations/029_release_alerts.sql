-- Migration 029: release_alerts table
--
-- Subscriptions for upcoming dam release notifications. A user
-- can subscribe to a specific river (and optionally a specific
-- season label) and get an email N days before each upcoming
-- release event. Same general shape as hatch_alerts and
-- stocking_alerts from migrations 009/012.
--
-- The cron at /api/cron/release-alerts walks DAM_RELEASES from
-- data/dam-releases.ts each morning, finds releases that fall
-- within each subscription's lookahead window, and emails the
-- subscriber if we haven't already notified them about that
-- specific release. Idempotency is enforced with the
-- (alert_id, release_id) tracker in release_alert_log.

create table if not exists public.release_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,                              -- nullable so anonymous email-only subs work
  email text not null,
  river_id text not null,                    -- matches data/rivers.ts id
  river_name text not null,                  -- denormalized for the email body
  -- Optional season filter — null means "all releases on this
  -- river". When set, only releases whose season_label exactly
  -- matches this value will trigger an alert. Lets a user
  -- subscribe to "Gauley Fall Season 2026" without getting
  -- noise from one-off summer releases.
  season_label text,
  -- How many days before the release to send the email.
  -- Default 3 = send Wed for a Saturday release. Capped at 30
  -- by the route handler.
  notify_days_before integer default 3 check (notify_days_before between 1 and 30),
  active boolean default true,
  last_notified_at timestamptz,
  created_at timestamptz default now(),
  -- Don't allow the same email to subscribe to the same river +
  -- season combo twice. NULL season means "all releases" and
  -- there should only be one of those per email per river.
  -- The COALESCE in the unique constraint handles the NULL.
  unique(email, river_id, season_label)
);

-- Per-release notification tracker. One row per (alert_id,
-- release_id) tuple after we've sent that user an email about
-- that specific release. Without this we'd re-email every cron
-- run during the lookahead window.
create table if not exists public.release_alert_log (
  id uuid primary key default gen_random_uuid(),
  alert_id uuid references public.release_alerts(id) on delete cascade,
  -- The DamRelease.id from data/dam-releases.ts. NOT a foreign
  -- key because release data lives in a static TS file, not in
  -- Supabase. We just need string equality for dedupe.
  release_id text not null,
  notified_at timestamptz default now(),
  unique(alert_id, release_id)
);

create index if not exists idx_release_alerts_user on public.release_alerts(user_id);
create index if not exists idx_release_alerts_river on public.release_alerts(river_id);
create index if not exists idx_release_alerts_email on public.release_alerts(email);
create index if not exists idx_release_alerts_active on public.release_alerts(active) where active = true;
create index if not exists idx_release_alert_log_alert on public.release_alert_log(alert_id);

alter table public.release_alerts enable row level security;
alter table public.release_alert_log enable row level security;

-- Anyone can insert (route layer is the gate, same pattern as
-- the rest of the codebase per the migration 026 audit).
create policy "Release alerts insertable via route layer"
  on public.release_alerts for insert
  with check (true);

-- Authenticated users can read their own subscriptions; the
-- cron uses service_role and bypasses RLS entirely.
create policy "Users read own release alerts"
  on public.release_alerts for select
  using (auth.uid() = user_id or user_id is null);

-- Authenticated users can deactivate their own subscriptions
-- (or anyone with the right HMAC unsubscribe token via the
-- service-role unsubscribe handler).
create policy "Users update own release alerts"
  on public.release_alerts for update
  using (auth.uid() = user_id);

-- Log table is service-role only — readable by route layer for
-- dedupe, never user-facing.
create policy "Release alert log readable via route layer"
  on public.release_alert_log for select
  using (true);
create policy "Release alert log insertable via route layer"
  on public.release_alert_log for insert
  with check (true);

comment on table public.release_alerts is
  'User subscriptions to upcoming dam release notifications. Emails go out N days before each matching release via the daily release-alerts cron.';
comment on column public.release_alerts.season_label is
  'Optional filter — when set, only fires for releases whose seasonLabel matches exactly. Lets users subscribe to "Gauley Fall Season 2026" without getting one-off summer release noise.';
