-- Migration 040: backfill digest_subscribed from weekly_digest_opted_in
--
-- The weekly-digest cron reads user_profiles.digest_subscribed, but
-- the onboarding flow wrote to profiles.weekly_digest_opted_in.
-- Anyone who opted in through the onboarding modal between its
-- launch and commit `<next>` was silently dropped from the Thursday
-- recipient list.
--
-- This migration mirrors every opt-in from profiles into
-- user_profiles so the next Thursday cron picks them up.
--
-- Idempotent: the update is a no-op when digest_subscribed already
-- matches, and we only flip FROM null/false TO true (never the other
-- direction, so users who explicitly unsubscribed in user_profiles
-- don't get re-subscribed).

update public.user_profiles up
   set digest_subscribed = true
  from public.profiles p
 where p.id = up.id
   and p.weekly_digest_opted_in = true
   and (up.digest_subscribed is null or up.digest_subscribed = false);
