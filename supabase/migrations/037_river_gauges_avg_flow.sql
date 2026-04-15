-- Migration 037: per-gauge historical mean cache
--
-- Stores each gauge's long-term daily mean discharge so the
-- sparkline reference line and the "Avg flow:" stat can update
-- when the user switches gauges, without hitting the USGS
-- statistics service on every page load.
--
-- Populated lazily by /api/rivers/[id]/gauges (and, eventually,
-- a nightly refresh job).
--
-- Idempotent.

alter table public.river_gauges
  add column if not exists avg_flow_cfs numeric,
  add column if not exists avg_flow_fetched_at timestamptz;
