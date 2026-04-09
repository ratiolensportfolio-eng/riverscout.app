-- One-shot cleanup: remove all seeded/fake reviews from river_reviews
-- Real user-submitted reviews (is_seed = false) are preserved

-- First show count of what will be deleted
select
  count(*) as fake_reviews_to_delete,
  count(distinct river_id) as rivers_affected
from public.river_reviews
where is_seed = true;

-- Delete all seeded reviews
delete from public.river_reviews
where is_seed = true;

-- Confirm cleanup
select
  count(*) as remaining_reviews,
  count(*) filter (where is_seed = true) as seeded_remaining,
  count(*) filter (where is_seed = false or is_seed is null) as user_submitted
from public.river_reviews;
