-- Add ai_category column to suggestions for safety-critical tagging
-- Also allow 'rolled_back' status
alter table public.suggestions
  drop constraint if exists suggestions_status_check;

alter table public.suggestions
  add constraint suggestions_status_check
  check (status in ('pending', 'approved', 'rejected', 'rolled_back'));

alter table public.suggestions
  add column if not exists ai_category text;

-- Index for fast safety-critical lookups
create index if not exists idx_suggestions_category on public.suggestions(ai_category);
