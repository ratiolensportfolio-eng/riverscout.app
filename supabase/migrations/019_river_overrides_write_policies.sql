-- Add write policies to the override tables from migration 018.
--
-- Background: 018 enabled RLS on river_field_overrides and
-- river_cleared_verification_tags but only added a SELECT policy.
-- Postgres RLS denies by default — without explicit INSERT/UPDATE/
-- DELETE policies, the suggestions PATCH approve handler couldn't
-- write override rows even though it runs after isAdmin() succeeds.
--
-- This migration adds permissive write policies that match the
-- pattern used by river_hazards, outfitters, flow_alerts, and
-- suggestions itself: the API route layer is the gate (isAdmin
-- check), RLS just doesn't deny.
--
-- This is intentionally NOT auth.uid()-based — the suggestions
-- route uses the anon client (createSupabaseClient) which has no
-- auth context server-side. Switching to a service-role client
-- would also work but adds a new env var dependency for a single
-- feature, and would be inconsistent with the rest of the
-- codebase's security model.

create policy "Field overrides writable via route layer"
  on public.river_field_overrides for insert with check (true);

create policy "Field overrides updatable via route layer"
  on public.river_field_overrides for update using (true);

create policy "Field overrides deletable via route layer"
  on public.river_field_overrides for delete using (true);

create policy "Cleared verification tags writable via route layer"
  on public.river_cleared_verification_tags for insert with check (true);

create policy "Cleared verification tags deletable via route layer"
  on public.river_cleared_verification_tags for delete using (true);
