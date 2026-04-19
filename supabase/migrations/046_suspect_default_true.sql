-- Fix: unvalidated access points should be suspect by default.
-- The original default of false meant every unvalidated point
-- appeared trusted on the map. Flip to true so points are hidden
-- until the snap validator explicitly clears them.

-- Change the column default for new rows
alter table public.river_access_points
  alter column coordinates_suspect set default true;

-- Mark ALL existing points as suspect if they haven't been
-- validated yet (snap_validated_at is null). This hides them
-- from maps until the validator runs and clears the good ones.
update public.river_access_points
  set coordinates_suspect = true
  where snap_validated_at is null;
