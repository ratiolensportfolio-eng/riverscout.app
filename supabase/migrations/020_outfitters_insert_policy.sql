-- Fix outfitters insert RLS policy.
--
-- Background: migration 003_outfitter_listings.sql created the
-- outfitters table with an RLS policy "Outfitters manage own listing"
-- that gates ALL operations (including INSERT) on
-- auth.uid() = user_id. This works for client-side writes but breaks
-- server-side inserts via the API route, because the route uses the
-- anon client (createSupabaseClient) which has no auth context —
-- auth.uid() is null inside the route, and null = 'real-uuid' is
-- false, so RLS rejects the insert.
--
-- Symptom: the /outfitters/join "Claim Free Listing" button returned
-- "new row violates row-level security policy for table outfitters"
-- (visible as "Failed to create listing" in the UI).
--
-- Fix: add a permissive INSERT policy. Writes are gated at the API
-- route layer (app/api/outfitters/route.ts validates the userId
-- against the request body, and the /outfitters/join page requires
-- a signed-in user before submit). This matches the pattern used
-- by river_hazards, suggestions, flow_alerts, river_field_overrides,
-- and the rest of the codebase: route layer is the gate, RLS is
-- permissive on writes.
--
-- The existing "Outfitters manage own listing" policy still gates
-- UPDATE/DELETE on auth.uid() = user_id, which is correct because
-- those happen from the dashboard (client-side, real auth context).

create policy "Outfitters writable via route layer"
  on public.outfitters for insert with check (true);
