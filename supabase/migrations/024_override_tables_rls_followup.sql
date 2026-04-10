-- Idempotent re-run of migration 019 (override table write policies).
--
-- Why this exists: migration 019 was the first RLS write-policy fix
-- and only covered river_field_overrides + river_cleared_verification_tags.
-- Migration 022 was the comprehensive audit but I (incorrectly)
-- excluded these two tables from it on the assumption that 019 had
-- already been applied to the live instance. Some Supabase instances
-- skipped 019 — running 022 alone leaves the override tables broken
-- and the suggestions PATCH approve handler returns "Failed to write
-- override: new row violates row-level security policy" the next
-- time an admin clicks Approve on a river improvement.
--
-- This migration is purely a backfill of 019 with idempotent
-- semantics (drop-if-exists, then create). Safe to run regardless
-- of whether 019 was applied earlier — re-running just no-ops.

do $$
begin
  -- river_field_overrides
  drop policy if exists "Field overrides writable via route layer" on public.river_field_overrides;
  create policy "Field overrides writable via route layer"
    on public.river_field_overrides for insert with check (true);

  drop policy if exists "Field overrides updatable via route layer" on public.river_field_overrides;
  create policy "Field overrides updatable via route layer"
    on public.river_field_overrides for update using (true);

  drop policy if exists "Field overrides deletable via route layer" on public.river_field_overrides;
  create policy "Field overrides deletable via route layer"
    on public.river_field_overrides for delete using (true);

  -- river_cleared_verification_tags
  drop policy if exists "Cleared verification tags writable via route layer" on public.river_cleared_verification_tags;
  create policy "Cleared verification tags writable via route layer"
    on public.river_cleared_verification_tags for insert with check (true);

  drop policy if exists "Cleared verification tags deletable via route layer" on public.river_cleared_verification_tags;
  create policy "Cleared verification tags deletable via route layer"
    on public.river_cleared_verification_tags for delete using (true);
end $$;
