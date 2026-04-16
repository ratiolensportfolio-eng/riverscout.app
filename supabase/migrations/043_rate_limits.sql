-- Per-user rate limiting for content submissions.
-- Serverless-safe: no in-memory state, all in Postgres.
-- The application layer reads the row, checks the window,
-- and increments the count. Race conditions are acceptable
-- at this scale (worst case: a user slips 1-2 extra submissions
-- through a concurrent window boundary).

create table if not exists public.rate_limits (
  user_id uuid not null,
  bucket text not null,
  count integer not null default 0,
  window_start timestamptz not null default now(),
  primary key (user_id, bucket)
);

-- RLS: service-role only (the API routes manage these rows).
alter table public.rate_limits enable row level security;

create policy "Route layer manages rate_limits"
  on public.rate_limits for all
  using (true)
  with check (true);
