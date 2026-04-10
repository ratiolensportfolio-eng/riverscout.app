-- River field overrides + cleared verification tags.
--
-- Background: the canonical river data lives in data/rivers.ts (a
-- static TypeScript file). The original "Improve This River" approve
-- handler wrote to public.rivers, but the river page reads from the
-- static file via @/data/rivers — so approved improvements were never
-- visible on the live site, and verification tags from
-- scripts/audit-safety.js could never be cleared.
--
-- This migration introduces a thin override layer:
--
--   river_field_overrides — one row per (river_id, field) holding
--     a string value that takes precedence over the static value.
--     The river page server prefetch reads matching rows and the
--     UI merges them on top of the static record.
--
--   river_cleared_verification_tags — one row per (river_id, tag)
--     marking that the corresponding entry in the static
--     needsVerification array has been cleared by an admin
--     approval. The river page subtracts these from the merged
--     needsVerification list before passing to DataConfidenceBanner.
--
-- Why two tables instead of a single JSON column on a future
-- river_overrides table: different access patterns. Field overrides
-- are key/value lookups; cleared tags are an unordered set with a
-- distinct lifecycle (the audit script may re-flag a tag if the
-- underlying issue resurfaces, in which case the cleared row should
-- get deleted via a separate admin action — that's a separate row,
-- not a JSON edit).

create table if not exists public.river_field_overrides (
  id uuid primary key default gen_random_uuid(),
  river_id text not null,
  -- Field key matches the suggestions.field column for direct
  -- mapping from the approve handler. Examples: cls, opt, len,
  -- desc, desig, gauge, sections, safe_cfs.
  field text not null,
  value text not null,
  -- Provenance
  source_suggestion_id uuid references public.suggestions(id) on delete set null,
  applied_at timestamptz not null default now(),
  applied_by uuid references auth.users(id) on delete set null,
  -- One override per (river_id, field). A new approval for the same
  -- field replaces the previous override via upsert with this
  -- conflict target.
  unique(river_id, field)
);

create index if not exists idx_river_field_overrides_river
  on public.river_field_overrides(river_id);

alter table public.river_field_overrides enable row level security;

-- Public read so the unauthenticated river page can fetch overrides
-- via the server prefetch (which uses the anon key).
create policy "Field overrides are publicly readable"
  on public.river_field_overrides for select using (true);

-- Writes go through /api/suggestions PATCH using the anon client,
-- gated by isAdmin() at the route layer. This file originally
-- omitted write policies on the assumption that the route gate was
-- sufficient, but Postgres RLS denies by default — see migration
-- 019_river_overrides_write_policies.sql which adds the missing
-- INSERT/UPDATE/DELETE policies.

create table if not exists public.river_cleared_verification_tags (
  id uuid primary key default gen_random_uuid(),
  river_id text not null,
  tag text not null,
  source_suggestion_id uuid references public.suggestions(id) on delete set null,
  cleared_at timestamptz not null default now(),
  cleared_by uuid references auth.users(id) on delete set null,
  unique(river_id, tag)
);

create index if not exists idx_river_cleared_tags_river
  on public.river_cleared_verification_tags(river_id);

alter table public.river_cleared_verification_tags enable row level security;

create policy "Cleared verification tags are publicly readable"
  on public.river_cleared_verification_tags for select using (true);

-- See note on river_field_overrides RLS above. Write policies live
-- in migration 019_river_overrides_write_policies.sql.
