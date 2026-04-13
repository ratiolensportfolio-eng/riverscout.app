-- Pere Marquette River — VERIFIED access-point coordinates.
--
-- Provided by the owner of Pine River Paddlesports Center (runs shuttles
-- on the PM). These coordinates come from on-the-ground knowledge, not
-- training-data guesses. All ten points are within a few meters of the
-- actual boat ramps / bridges.
--
-- Supersedes the original access_points_pere_marquette.sql which had
-- training-data-estimated coordinates. Run AFTER:
--   1. cleanup_off_river_access_points.sql (deletes the bad PM rows)
--   2. migration 032_river_access_points.sql is applied
--
-- Idempotent. Safe to re-run.

begin;

-- Wipe any existing PM rows first so re-running swaps in the verified
-- coordinates cleanly — no risk of leftover bad rows surviving.
delete from public.river_access_points where river_id = 'pere_marquette';

insert into public.river_access_points (
  river_id, name, description, access_type, lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status, last_verified_at, last_verified_by
) values
  ('pere_marquette', 'Forks Bridge',          'Upper put-in on the Pere Marquette. Classic trout water above here.',                           'carry_in',  43.85663, -85.84114,  0.0, 1.5, 'M-37',                '20 minutes', 'PinePaddlesports', true, 'verified', now(), 'Pine River Paddlesports Center'),
  ('pere_marquette', 'M-37',                  'Bridge access on M-37. Standard upper-river access.',                                            'carry_in',  43.85755, -85.85147,  1.5, 3.5, 'Green Cottage',       '1.5 hours',  'PinePaddlesports', true, 'verified', now(), 'Pine River Paddlesports Center'),
  ('pere_marquette', 'Green Cottage',         'Mid-upper river access. Fly-fishing-only water above here.',                                     'carry_in',  43.86164, -85.88113,  5.0, 3.5, 'Gleason''s Landing', '1.5 hours',  'PinePaddlesports', true, 'verified', now(), 'Pine River Paddlesports Center'),
  ('pere_marquette', 'Gleason''s Landing',    'Popular launch. Start of the flies-only section.',                                                'boat_ramp', 43.87103, -85.91960,  8.5, 2.5, 'Bowman''s Bridge',   '1 hour',     'PinePaddlesports', true, 'verified', now(), 'Pine River Paddlesports Center'),
  ('pere_marquette', 'Bowman''s Bridge',      'The classic PM trip starts here. Most popular access on the river.',                              'boat_ramp', 43.88890, -85.94190, 11.0, 9.0, 'Rainbow Rapids',      '2.5 hours',  'PinePaddlesports', true, 'verified', now(), 'Pine River Paddlesports Center'),
  ('pere_marquette', 'Rainbow Rapids',        'Mid-river access at the most technical water on the PM. Small pull-off.',                        'carry_in',  43.92259, -85.97616, 20.0, 3.0, 'Sulak Landing',       '1 hour',     'PinePaddlesports', true, 'verified', now(), 'Pine River Paddlesports Center'),
  ('pere_marquette', 'Sulak Landing',         'Mid-lower river access. Good steelhead water in season.',                                         'carry_in',  43.92615, -86.00589, 23.0, 3.0, 'Upper Branch Bridge', '1 hour',     'PinePaddlesports', true, 'verified', now(), 'Pine River Paddlesports Center'),
  ('pere_marquette', 'Upper Branch Bridge',   'Branch Road bridge access.',                                                                      'carry_in',  43.92847, -86.02057, 26.0, 2.5, 'Lower Branch Bridge', '1.5 hours',  'PinePaddlesports', true, 'verified', now(), 'Pine River Paddlesports Center'),
  ('pere_marquette', 'Lower Branch Bridge',   'Lower Branch access.',                                                                            'carry_in',  43.93533, -86.05066, 28.5, 8.0, 'Walhalla Bridge',     '2.5 hours',  'PinePaddlesports', true, 'verified', now(), 'Pine River Paddlesports Center'),
  ('pere_marquette', 'Walhalla Bridge',       'Standard take-out. Full PM float ends here.',                                                     'boat_ramp', 43.93296, -86.11515, 36.5, null, null,                  null,         'PinePaddlesports', true, 'verified', now(), 'Pine River Paddlesports Center');

commit;
