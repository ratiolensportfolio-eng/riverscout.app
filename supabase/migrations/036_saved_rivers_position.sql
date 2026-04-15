-- Migration 036: Drag-reorder support for saved_rivers
--
-- Adds a numeric `position` column so users can reorder their
-- dashboard cards. NULL position means "fall back to created_at"
-- — the dashboard already handles missing rows that way, so the
-- migration is non-destructive.
--
-- Idempotent.

alter table public.saved_rivers
  add column if not exists position integer;

create index if not exists idx_saved_rivers_user_position
  on public.saved_rivers (user_id, position asc nulls last, created_at desc);
