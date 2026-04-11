-- Migration 031: River Q&A (river_questions + river_answers)
--
-- Per-river community Q&A surfaced as a tab on every river detail
-- page. Questions and answers render server-side so Google indexes
-- them. Tables are intentionally simple — no threading, no votes
-- beyond per-row helpful_count counters.
--
-- Notes vs the original spec:
--   1. Anonymous askers (user_id = null) can opt-in to "email me
--      when answered" via notify_email + notify_token. The token is
--      a random unsub-style key so the notification email can carry
--      a one-click "stop notifying me" link without requiring login.
--   2. helpful_count bumps go through the SECURITY DEFINER function
--      bump_qa_helpful() so anon users can mark helpful without us
--      opening a blanket UPDATE policy that would let anyone rewrite
--      the actual question/answer text.
--   3. A trigger on river_answers flips the parent question's
--      `answered=true` and stamps `answered_at` so the SSR sort
--      ("answered first, unanswered after") doesn't need a join.
--   4. Owners can update their own rows (auth.uid() = user_id) so an
--      asker can fix a typo without involving an admin.

create table public.river_questions (
  id              uuid primary key default gen_random_uuid(),
  river_id        text not null,
  user_id         uuid references auth.users on delete set null,
  display_name    text not null,
  question        text not null check (length(question) between 1 and 280),
  created_at      timestamptz default now(),
  answered        boolean default false,
  answered_at     timestamptz,
  helpful_count   integer default 0,
  status          text default 'active' check (status in ('active','removed')),
  flagged_at      timestamptz,
  notify_email    text,
  notify_token    text unique,
  notified_at     timestamptz
);

create table public.river_answers (
  id              uuid primary key default gen_random_uuid(),
  question_id     uuid references public.river_questions on delete cascade,
  river_id        text not null,
  user_id         uuid references auth.users on delete set null,
  display_name    text not null,
  answer          text not null check (length(answer) between 1 and 2000),
  created_at      timestamptz default now(),
  helpful_count   integer default 0,
  is_best_answer  boolean default false,
  status          text default 'active' check (status in ('active','removed'))
);

-- Indexes
create index idx_river_questions_river
  on public.river_questions (river_id, created_at desc);

create index idx_river_questions_river_answered
  on public.river_questions (river_id, answered, created_at desc)
  where status = 'active';

create index idx_river_answers_question
  on public.river_answers (question_id, helpful_count desc)
  where status = 'active';

-- Stale-question flag for /admin
create index idx_river_questions_unanswered_age
  on public.river_questions (created_at)
  where answered = false and status = 'active';

-- RLS
alter table public.river_questions enable row level security;
alter table public.river_answers   enable row level security;

create policy "Questions are publicly readable"
  on public.river_questions for select
  using (status = 'active');

create policy "Answers are publicly readable"
  on public.river_answers for select
  using (status = 'active');

-- Anonymous OR logged-in users can ask. Server route enforces rate
-- limits + spam guards before insert.
create policy "Anyone can ask a question"
  on public.river_questions for insert
  with check (
    (user_id is null) or (auth.uid() = user_id)
  );

-- Only logged-in users can answer.
create policy "Logged-in users can answer"
  on public.river_answers for insert
  with check (auth.uid() = user_id);

-- Owners can edit/withdraw their own content. Admins use service role.
create policy "Owners can update own question"
  on public.river_questions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Owners can update own answer"
  on public.river_answers for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Helpful-count bump as a definer function so anon can call it
-- without opening a blanket UPDATE policy on the row.
create or replace function public.bump_qa_helpful(
  target_kind text,
  target_id uuid
) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if target_kind = 'question' then
    update public.river_questions
       set helpful_count = helpful_count + 1
     where id = target_id and status = 'active';
  elsif target_kind = 'answer' then
    update public.river_answers
       set helpful_count = helpful_count + 1
     where id = target_id and status = 'active';
  else
    raise exception 'invalid target_kind: %', target_kind;
  end if;
end;
$$;

grant execute on function public.bump_qa_helpful(text, uuid) to anon, authenticated;

-- When an answer lands, flip the parent question's `answered` flag
-- and stamp answered_at. Drives the SSR sort (answered first).
create or replace function public.mark_question_answered()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.river_questions
     set answered = true,
         answered_at = coalesce(answered_at, now())
   where id = NEW.question_id;
  return NEW;
end;
$$;

create trigger trg_mark_question_answered
  after insert on public.river_answers
  for each row execute function public.mark_question_answered();
