-- Migration 028: add source_record_id column to river_stocking
-- and a unique index that makes the DNR scraper idempotent.
--
-- Background: the DNR stocking scraper at lib/dnr-stocking.ts
-- pulls events from the official Michigan DNR ArcGIS FeatureServer
-- on a daily cron. Each DNR record has a stable GUID column we
-- store in source_record_id (with curly braces stripped and
-- lowercased). We need a unique index on the combination
-- (stocking_authority, source_record_id) so re-running the cron
-- within its overlap window can safely upsert with
-- onConflict + ignoreDuplicates instead of duplicating rows.
--
-- The (authority, record_id) pair (not just record_id) is the
-- unique key because future scrapers (e.g. Wisconsin DNR, NY
-- DEC) will have their own ID namespaces. Two different
-- agencies could in theory issue the same opaque ID; the
-- authority disambiguates.
--
-- Idempotent: every change is wrapped in IF NOT EXISTS so this
-- migration is safe to run twice.

alter table public.river_stocking
  add column if not exists source_record_id text;

create unique index if not exists
  uniq_river_stocking_source
  on public.river_stocking (stocking_authority, source_record_id)
  where source_record_id is not null;

-- The partial index (WHERE source_record_id IS NOT NULL) means
-- existing manually-submitted rows with NULL source_record_id
-- don't violate uniqueness — those rows continue to live alongside
-- DNR-imported rows without conflict. Only scraper-inserted rows
-- (which always set source_record_id) participate in the dedupe.

comment on column public.river_stocking.source_record_id is
  'Stable per-record ID from the originating data source. For DNR ArcGIS imports this is the GUID column with curly braces stripped and lowercased. NULL for manually-submitted reports.';
