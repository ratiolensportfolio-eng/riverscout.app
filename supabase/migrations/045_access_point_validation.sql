-- Access point coordinate validation. The snap validator checks
-- each point's distance to the nearest NHDPlus HR flowline for
-- its river. Points > 100m from any flowline are flagged suspect
-- and hidden from public display until manually verified.

alter table public.river_access_points
  add column if not exists coordinates_suspect boolean default false,
  add column if not exists snap_distance_meters numeric,
  add column if not exists snap_validated_at timestamptz;

create index if not exists idx_access_points_suspect
  on public.river_access_points(coordinates_suspect)
  where coordinates_suspect = true;
