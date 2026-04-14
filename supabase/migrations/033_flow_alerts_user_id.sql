-- Migration 033: Add user_id to flow_alerts
--
-- flow_alerts was email-only originally (MVP — no auth required).
-- The account page now queries by user_id OR email to show a logged-in
-- user their own alerts, but the user_id column never existed, so the
-- OR filter returns: "column flow_alerts.user_id does not exist".
--
-- This migration:
--   1. Adds user_id uuid (nullable — legacy rows stay email-only).
--   2. Backfills user_id from email by joining auth.users.
--   3. Indexes user_id for the account-page lookup.
--
-- Idempotent.

-- ── Column ────────────────────────────────────────────────
alter table public.flow_alerts
  add column if not exists user_id uuid;

-- ── Backfill ─────────────────────────────────────────────
-- Match existing rows to auth.users by email (case-insensitive).
update public.flow_alerts fa
   set user_id = u.id
  from auth.users u
 where fa.user_id is null
   and lower(fa.email) = lower(u.email);

-- ── Index ────────────────────────────────────────────────
create index if not exists idx_flow_alerts_user_id
  on public.flow_alerts (user_id)
  where user_id is not null;
