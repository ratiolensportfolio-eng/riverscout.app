-- Outfitters: add a permissive SELECT policy for the route layer
-- so .insert(...).select() can read its own writes back.
--
-- Background: the original outfitters table from migration 003 has
-- only two SELECT policies:
--   1. "Active listings are public" — for select using (active = true)
--   2. "Outfitters manage own listing" — for all using (auth.uid() = user_id)
--
-- The /api/outfitters POST handler inserts free listings with
-- active = false (they go inactive until reviewed) and then chains
-- .select() to return the inserted row to the client. PostgREST
-- implicitly appends RETURNING * to the insert, and the RETURNING
-- has to pass the SELECT policy — neither of the existing policies
-- cover the case where the row is inactive AND the request is
-- coming from the anon client (no auth.uid()).
--
-- Result: the insert itself succeeds at the row level, but the
-- implicit RETURNING fails to read the row back, and Supabase
-- reports the failure as "violates row-level security policy" or
-- as a generic "Failed to create listing" error in the route.
--
-- This was missed in migration 025's SELECT-policy audit because
-- I assumed the existing outfitters policies covered the route
-- layer. They don't — the active=true filter excludes brand-new
-- free listings.
--
-- Fix: add a permissive SELECT policy. The same security argument
-- as the rest of the codebase applies — the route layer is the
-- gate, RLS is permissive on writes that originate from server-
-- side routes.

drop policy if exists "Outfitters readable via route layer" on public.outfitters;
create policy "Outfitters readable via route layer"
  on public.outfitters for select using (true);
