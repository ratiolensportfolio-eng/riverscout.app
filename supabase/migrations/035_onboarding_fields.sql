-- Migration 035: Onboarding profile fields
--
-- Adds the columns the onboarding flow + dashboard rely on.
-- home_state already exists from migration 023; this migration
-- only adds the two new optional fields.
--
-- Idempotent.

alter table public.profiles
  add column if not exists weekly_digest_opted_in boolean,
  add column if not exists onboarding_completed_at timestamptz;

create index if not exists idx_profiles_onboarding
  on public.profiles (onboarding_completed_at)
  where onboarding_completed_at is null;
