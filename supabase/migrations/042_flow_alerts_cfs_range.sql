-- flow_alerts: add explicit min_cfs / max_cfs range columns so users
-- can subscribe to a numeric band ("notify me between 800 and 1600
-- cfs") instead of only the fixed 'optimal/high/flood/any' buckets.
--
-- Both columns are nullable and backward-compatible with the
-- existing threshold enum — rows with NULL min/max keep using
-- threshold semantics, rows with min/max set override it. The cron
-- checker will prefer min/max when present.

alter table public.flow_alerts
  add column if not exists min_cfs integer,
  add column if not exists max_cfs integer;

-- Defensive: if both are set, min must be <= max. Enforced at the
-- DB level so a buggy client can't create nonsense bands.
alter table public.flow_alerts
  drop constraint if exists flow_alerts_min_max_sane;
alter table public.flow_alerts
  add constraint flow_alerts_min_max_sane
  check (min_cfs is null or max_cfs is null or min_cfs <= max_cfs);
