-- Weekly River Conditions Digest
--
-- Adds digest preferences to user_profiles + a digest_log send-history
-- table for deduplication. Free for all users — this is the
-- habit-forming Thursday-morning email, not a Pro feature.
--
-- Notes on defaults:
--   digest_subscribed defaults to FALSE — opt-in only, no bulk
--   subscribe. Users opt in at three moments of intent:
--     1. After saving their first river (inline "send me the digest"
--        prompt in the save-river UI)
--     2. From the welcome email CTA
--     3. From the /account page toggle
--
--   digest_day / digest_hour / digest_timezone are stored but not yet
--   honored by the v1 cron — the cron fires once at 13:00 UTC every
--   Thursday, which is roughly 8am Eastern. Per-user timezone routing
--   can layer in later without a schema change.

alter table public.user_profiles
  add column if not exists digest_subscribed boolean default false,
  add column if not exists digest_day integer default 4,           -- 0=Sun, 4=Thu
  add column if not exists digest_hour integer default 8,
  add column if not exists digest_last_sent timestamptz,
  add column if not exists digest_timezone text default 'America/New_York';

-- Send history for deduplication and analytics. RLS allows users to
-- read their own log only.
create table if not exists public.digest_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  sent_at timestamptz default now(),
  rivers_included integer,
  open_count integer default 0
);

alter table public.digest_log enable row level security;

create policy "Users read own digest log"
  on public.digest_log for select
  using (auth.uid() = user_id);

create index if not exists idx_digest_log_user_sent
  on public.digest_log(user_id, sent_at desc);
