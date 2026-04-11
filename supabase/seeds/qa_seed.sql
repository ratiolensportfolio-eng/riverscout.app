-- River Q&A seed data for launch.
--
-- Two to three local-knowledge questions per launch river, with
-- one answer each, written in the voice of a regular paddler. The
-- goal is to set the tone for what good Q&A on RiverScout looks
-- like before any organic content lands.
--
-- Run AFTER migration 031_river_qa.sql is applied. Idempotent on
-- (river_id, question) — re-running won't dupe.
--
-- River ids referenced (verified against data/rivers.ts):
--   pine_mi, ausable, manistee, pere_marquette, gauley

begin;

-- Helper CTE pattern: insert each question, then insert its
-- answer using the question's id by re-selecting it. Doing this
-- per row keeps the seed readable and means a single failed row
-- doesn't roll back the whole batch (though we wrap in a tx for
-- atomicity since this is the seed step).

-- Skip rows that already exist so the file is safe to re-run.
-- We dedupe on (river_id, question) since there's no UNIQUE
-- constraint on the table itself.

-- ─── Pine River (pine_mi) ─────────────────────────────────

insert into public.river_questions (river_id, display_name, question, answered, answered_at)
select 'pine_mi', 'NoMiPaddler', 'Is the Elm Flats access paved?', true, now()
where not exists (
  select 1 from public.river_questions
  where river_id = 'pine_mi' and question = 'Is the Elm Flats access paved?'
);

insert into public.river_answers (question_id, river_id, display_name, answer, helpful_count)
select id, 'pine_mi', 'WexfordCountyLocal',
       'Yes, paved and wide enough for trailers. Port-a-john on site. No overnight parking.',
       3
from public.river_questions
where river_id = 'pine_mi' and question = 'Is the Elm Flats access paved?'
  and not exists (
    select 1 from public.river_answers a
    where a.question_id = public.river_questions.id
  );

insert into public.river_questions (river_id, display_name, question, answered, answered_at)
select 'pine_mi', 'FirstTimerMI', 'What''s the best section for beginners?', true, now()
where not exists (
  select 1 from public.river_questions
  where river_id = 'pine_mi' and question = 'What''s the best section for beginners?'
);

insert into public.river_answers (question_id, river_id, display_name, answer, helpful_count, is_best_answer)
select id, 'pine_mi', 'PineRiverDan',
       'Peterson Bridge to Low Bridge is the classic float — Class I with some fun riffles. About 3 hours at normal flows. Don''t do Lincoln Bridge to Low Bridge as your first trip, it''s a 12-mile day and the current isn''t as forgiving as people think.',
       7, true
from public.river_questions
where river_id = 'pine_mi' and question = 'What''s the best section for beginners?'
  and not exists (
    select 1 from public.river_answers a
    where a.question_id = public.river_questions.id
  );

insert into public.river_questions (river_id, display_name, question, answered, answered_at)
select 'pine_mi', 'TripPlanner', 'How crowded does it get on summer weekends?', true, now()
where not exists (
  select 1 from public.river_questions
  where river_id = 'pine_mi' and question = 'How crowded does it get on summer weekends?'
);

insert into public.river_answers (question_id, river_id, display_name, answer, helpful_count)
select id, 'pine_mi', 'WexfordCountyLocal',
       'July and August Saturdays are packed — get on the water by 9am if you want any solitude. Sunday mornings and weekdays are way calmer. Late September is gorgeous and almost empty.',
       4
from public.river_questions
where river_id = 'pine_mi' and question = 'How crowded does it get on summer weekends?'
  and not exists (
    select 1 from public.river_answers a
    where a.question_id = public.river_questions.id
  );

-- ─── Au Sable (ausable) ───────────────────────────────────

insert into public.river_questions (river_id, display_name, question, answered, answered_at)
select 'ausable', 'HexHunter', 'When does the hex hatch usually start?', true, now()
where not exists (
  select 1 from public.river_questions
  where river_id = 'ausable' and question = 'When does the hex hatch usually start?'
);

insert into public.river_answers (question_id, river_id, display_name, answer, helpful_count, is_best_answer)
select id, 'ausable', 'GraylingGuide',
       'Watch the water temp — once it hits 60°F consistently the hatch is close, usually late June. The evening spinnerfall is the main event, starts around 10pm. Bring a headlamp and don''t plan on being off the water before midnight.',
       12, true
from public.river_questions
where river_id = 'ausable' and question = 'When does the hex hatch usually start?'
  and not exists (
    select 1 from public.river_answers a
    where a.question_id = public.river_questions.id
  );

insert into public.river_questions (river_id, display_name, question, answered, answered_at)
select 'ausable', 'PaddlerJess', 'Is the Keystone access good for a canoe launch?', true, now()
where not exists (
  select 1 from public.river_questions
  where river_id = 'ausable' and question = 'Is the Keystone access good for a canoe launch?'
);

insert into public.river_answers (question_id, river_id, display_name, answer, helpful_count)
select id, 'ausable', 'CrawfordLocal',
       'Yes — dirt ramp, easy carry to water. Parking for about 8 cars. Can get muddy in spring.',
       5
from public.river_questions
where river_id = 'ausable' and question = 'Is the Keystone access good for a canoe launch?'
  and not exists (
    select 1 from public.river_answers a
    where a.question_id = public.river_questions.id
  );

insert into public.river_questions (river_id, display_name, question, answered, answered_at)
select 'ausable', 'NewToFlyFishing', 'Can you wade the holy water section in waders without a guide?', true, now()
where not exists (
  select 1 from public.river_questions
  where river_id = 'ausable' and question = 'Can you wade the holy water section in waders without a guide?'
);

insert into public.river_answers (question_id, river_id, display_name, answer, helpful_count)
select id, 'ausable', 'GraylingGuide',
       'Absolutely — the Holy Water from Burton''s Landing to Wakeley Bridge is wadeable for most of its length and well-marked. Be courteous about boats coming through and don''t stand in the middle of the channel. Catch and release, single barbless flies only.',
       8
from public.river_questions
where river_id = 'ausable' and question = 'Can you wade the holy water section in waders without a guide?'
  and not exists (
    select 1 from public.river_answers a
    where a.question_id = public.river_questions.id
  );

-- ─── Manistee (manistee) ──────────────────────────────────

insert into public.river_questions (river_id, display_name, question, answered, answered_at)
select 'manistee', 'SteelheadHopeful', 'When do steelhead start showing up in the lower Manistee?', true, now()
where not exists (
  select 1 from public.river_questions
  where river_id = 'manistee' and question = 'When do steelhead start showing up in the lower Manistee?'
);

insert into public.river_answers (question_id, river_id, display_name, answer, helpful_count, is_best_answer)
select id, 'manistee', 'TippyDamRegular',
       'Fall run picks up in late October once the water cools below 55°F, peaks mid-November. Spring run is March-April. Tippy Dam tailwaters are the obvious spot but you''ll be elbow to elbow on weekends — drift the water below Bear Creek for fewer people and similar fish.',
       11, true
from public.river_questions
where river_id = 'manistee' and question = 'When do steelhead start showing up in the lower Manistee?'
  and not exists (
    select 1 from public.river_answers a
    where a.question_id = public.river_questions.id
  );

insert into public.river_questions (river_id, display_name, question, answered, answered_at)
select 'manistee', 'CampingFamily', 'Is High Bridge a good spot to camp the night before a float?', true, now()
where not exists (
  select 1 from public.river_questions
  where river_id = 'manistee' and question = 'Is High Bridge a good spot to camp the night before a float?'
);

insert into public.river_answers (question_id, river_id, display_name, answer, helpful_count)
select id, 'manistee', 'NorthernLowerLifer',
       'High Bridge State Forest Campground is right at the access — first come first served, no reservations, 16 sites. Get there by Friday afternoon in summer or it''s full. Vault toilets, no showers, but the location is hard to beat for an early launch.',
       6
from public.river_questions
where river_id = 'manistee' and question = 'Is High Bridge a good spot to camp the night before a float?'
  and not exists (
    select 1 from public.river_answers a
    where a.question_id = public.river_questions.id
  );

-- ─── Pere Marquette (pere_marquette) ──────────────────────

insert into public.river_questions (river_id, display_name, question, answered, answered_at)
select 'pere_marquette', 'DriftBoatNewbie', 'Where can I launch a drift boat on the PM?', true, now()
where not exists (
  select 1 from public.river_questions
  where river_id = 'pere_marquette' and question = 'Where can I launch a drift boat on the PM?'
);

insert into public.river_answers (question_id, river_id, display_name, answer, helpful_count, is_best_answer)
select id, 'pere_marquette', 'PMfishbum',
       'Gleason''s Landing, Bowman Bridge, and Maple Leaf are the standard drift-boat launches. The flies-only water above M-37 is wade-only — no boats allowed in that stretch, period. Don''t be that guy who tries.',
       9, true
from public.river_questions
where river_id = 'pere_marquette' and question = 'Where can I launch a drift boat on the PM?'
  and not exists (
    select 1 from public.river_answers a
    where a.question_id = public.river_questions.id
  );

insert into public.river_questions (river_id, display_name, question, answered, answered_at)
select 'pere_marquette', 'KingFever', 'Best time for the king salmon run?', true, now()
where not exists (
  select 1 from public.river_questions
  where river_id = 'pere_marquette' and question = 'Best time for the king salmon run?'
);

insert into public.river_answers (question_id, river_id, display_name, answer, helpful_count)
select id, 'pere_marquette', 'BaldwinLocal',
       'Last week of August through the third week of September. Peak is usually Labor Day weekend through mid-September. Lots of fish but lots of pressure too — weekday mornings before sunrise are your friend.',
       7
from public.river_questions
where river_id = 'pere_marquette' and question = 'Best time for the king salmon run?'
  and not exists (
    select 1 from public.river_answers a
    where a.question_id = public.river_questions.id
  );

-- ─── Gauley (gauley) ──────────────────────────────────────

insert into public.river_questions (river_id, display_name, question, answered, answered_at)
select 'gauley', 'FirstGauleyTrip', 'How early should I arrive on Gauley Season Saturdays?', true, now()
where not exists (
  select 1 from public.river_questions
  where river_id = 'gauley' and question = 'How early should I arrive on Gauley Season Saturdays?'
);

insert into public.river_answers (question_id, river_id, display_name, answer, helpful_count, is_best_answer)
select id, 'gauley', 'SummersvilleVet',
       'By 6am or you''re fighting for parking. The tailwaters lot fills completely by 7:30am on busy weekends. If you''re running shuttle yourself, leave a vehicle at the takeout the night before — that lot is even worse.',
       18, true
from public.river_questions
where river_id = 'gauley' and question = 'How early should I arrive on Gauley Season Saturdays?'
  and not exists (
    select 1 from public.river_answers a
    where a.question_id = public.river_questions.id
  );

insert into public.river_questions (river_id, display_name, question, answered, answered_at)
select 'gauley', 'IntermediateClass3', 'Can a solid Class III paddler handle the Upper at 2800 cfs?', true, now()
where not exists (
  select 1 from public.river_questions
  where river_id = 'gauley' and question = 'Can a solid Class III paddler handle the Upper at 2800 cfs?'
);

insert into public.river_answers (question_id, river_id, display_name, answer, helpful_count)
select id, 'gauley', 'WVRiverRat',
       'Honestly? No, not as a first-timer. The Upper at release flow is a real Class V — Pillow, Lost Paddle, Iron Ring, and Sweet''s Falls are not Class III with consequences, they''re Class V with consequences. Run the Lower first (still big water but more forgiving), or hire a guide for the Upper your first time.',
       14
from public.river_questions
where river_id = 'gauley' and question = 'Can a solid Class III paddler handle the Upper at 2800 cfs?'
  and not exists (
    select 1 from public.river_answers a
    where a.question_id = public.river_questions.id
  );

insert into public.river_questions (river_id, display_name, question, answered, answered_at)
select 'gauley', 'CamperVan', 'Where can I camp during Gauley season without booking months ahead?', true, now()
where not exists (
  select 1 from public.river_questions
  where river_id = 'gauley' and question = 'Where can I camp during Gauley season without booking months ahead?'
);

insert into public.river_answers (question_id, river_id, display_name, answer, helpful_count)
select id, 'gauley', 'NewRiverRegular',
       'Battle Run and Tailwaters campgrounds at Summersville Lake are the convenient ones and they fill 2-3 months out for release weekends. Last-minute bets: dispersed camping in the Monongahela, the private campgrounds in Fayetteville (more expensive but usually have something), or just sleep in your rig at one of the river outfitter lots — most look the other way during release weekends.',
       6
from public.river_questions
where river_id = 'gauley' and question = 'Where can I camp during Gauley season without booking months ahead?'
  and not exists (
    select 1 from public.river_answers a
    where a.question_id = public.river_questions.id
  );

commit;
