-- AuSable River — VERIFIED access-point coordinates.
--
-- Hand-provided by the PRPC owner from on-the-ground knowledge.
-- 29 points from Burton's Landing (upper) to the Lake Huron mouth.
-- Four sites near the mouth (Camp Ten Bridge, Riverbank Park, Harbor
-- St, AuSable River Boat Launch) have no verified coord yet — omitted.
--
-- Wipes existing AuSable rows so re-running swaps in the verified set.
-- Safe to re-run.

begin;

delete from public.river_access_points where river_id = 'ausable';

insert into public.river_access_points (
  river_id, name, description, access_type, lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status, last_verified_at, last_verified_by
) values
  ('ausable', 'Burton''s Landing',               'DNR. Restrooms, camping. Start of the flies-only Holy Water.',         'carry_in',  44.66433, -84.64764,   0.0, null, 'Keystone Landing',             '2 hours',        'PinePaddlesports', true, 'verified', now(), 'Pine River Paddlesports Center'),
  ('ausable', 'Keystone Landing',                'DNR. Restrooms, camping.',                                              'carry_in',  44.66604, -84.62733,   1.0, null, 'Stephan Bridge Launch',        '1.5 hours',      'PinePaddlesports', true, 'verified', now(), 'Pine River Paddlesports Center'),
  ('ausable', 'Stephan Bridge Launch',           'DNR. Restrooms.',                                                       'boat_ramp', 44.67919, -84.57344,   3.5, null, 'Wakeley Bridge',               '1.5 hours',      'PinePaddlesports', true, 'verified', now(), 'Pine River Paddlesports Center'),
  ('ausable', 'Wakeley Bridge',                  'County park.',                                                          'boat_ramp', 44.66008, -84.50731,   7.0, null, 'Connors Flats',                '1 hour',         'PinePaddlesports', true, 'verified', now(), 'Pine River Paddlesports Center'),
  ('ausable', 'Connors Flats',                   'DNR. Restrooms.',                                                       'carry_in',  44.66864, -84.43887,  10.0, null, 'McMasters Bridge',             '2 hours',        'PinePaddlesports', true, 'verified', now(), 'Pine River Paddlesports Center'),
  ('ausable', 'McMasters Bridge',                'DNR. Restrooms.',                                                       'boat_ramp', 44.66492, -84.39702,  13.0, null, 'Parmalee Canoe Landing',       '2.5 hours',      'PinePaddlesports', true, 'verified', now(), 'Pine River Paddlesports Center'),
  ('ausable', 'Parmalee Canoe Landing',          'DNR. Restrooms, camping.',                                              'carry_in',  44.67563, -84.29287,  18.0, null, 'Luzerne TWP Park',             '1 hour',         'PinePaddlesports', true, 'verified', now(), 'Pine River Paddlesports Center'),
  ('ausable', 'Luzerne TWP Park',                'Township park.',                                                        'carry_in',  44.67565, -84.27256,  20.0, null, 'Whirlpool Canoe Launch',       '1 hour',         'PinePaddlesports', true, 'verified', now(), 'Pine River Paddlesports Center'),
  ('ausable', 'Whirlpool Canoe Launch',          'DNR. Bathrooms.',                                                       'carry_in',  44.68234, -84.24087,  22.0, null, 'Camp Ten Bridge',              '2 hours',        'PinePaddlesports', true, 'verified', now(), 'Pine River Paddlesports Center'),
  ('ausable', 'Mio Dam Pond',                    'Above Mio Dam. Access to the reservoir.',                               'boat_ramp', 44.66174, -84.13184,  30.0, null, 'Loud''s Rest Stop',            '30 minutes',     'PinePaddlesports', true, 'verified', now(), 'Pine River Paddlesports Center'),
  ('ausable', 'Mio Au Sable River Launch',       'USFS. Restrooms. Below Mio Dam.',                                       'boat_ramp', 44.66013, -84.12710,  31.0, null, 'Loud''s Rest Stop',            '30 minutes',     'PinePaddlesports', true, 'verified', now(), 'Pine River Paddlesports Center'),
  ('ausable', 'Loud''s Rest Stop',               'USFS.',                                                                 'carry_in',  44.66154, -84.10506,  32.5, null, 'AuSable Loop',                 '30 minutes',     'PinePaddlesports', true, 'verified', now(), 'Pine River Paddlesports Center'),
  ('ausable', 'AuSable Loop',                    'USFS.',                                                                 'carry_in',  44.65845, -84.09176,  33.5, null, 'Comins Flats',                 '1 hour',         'PinePaddlesports', true, 'verified', now(), 'Pine River Paddlesports Center'),
  ('ausable', 'Comins Flats',                    'DNR. Restrooms.',                                                       'carry_in',  44.65415, -84.04330,  36.0, null, 'Davis Rest Stop',              '1 hour',         'PinePaddlesports', true, 'verified', now(), 'Pine River Paddlesports Center'),
  ('ausable', 'Davis Rest Stop',                 'USFS. Restrooms.',                                                      'carry_in',  44.65138, -83.99230,  38.5, null, 'McKinley Landing',             '1 hour',         'PinePaddlesports', true, 'verified', now(), 'Pine River Paddlesports Center'),
  ('ausable', 'McKinley Landing',                'USFS. Restrooms.',                                                      'carry_in',  44.64228, -83.94167,  41.5, null, 'Buttercup Landing',            '30 minutes',     'PinePaddlesports', true, 'verified', now(), 'Pine River Paddlesports Center'),
  ('ausable', 'Buttercup Landing',               'USFS. Restrooms, camping.',                                             'carry_in',  44.64250, -83.91348,  43.0, null, '4001 Bridge Landing',          '2 hours',        'PinePaddlesports', true, 'verified', now(), 'Pine River Paddlesports Center'),
  ('ausable', '4001 Bridge Landing',             'USFS.',                                                                 'carry_in',  44.61175, -83.83686,  48.0, null, 'Alcona Park Launch',           '30 minutes',     'PinePaddlesports', true, 'verified', now(), 'Pine River Paddlesports Center'),
  ('ausable', 'Alcona Park Launch',              'County park. Restrooms.',                                               'boat_ramp', 44.57898, -83.80463,  51.0, null, 'Alcona Dam Lower Launch',      'portage',        'PinePaddlesports', true, 'verified', now(), 'Pine River Paddlesports Center'),
  ('ausable', 'Alcona Dam Lower Launch',         'Consumers Power. Restrooms.',                                           'boat_ramp', 44.56108, -83.80285,  52.0, null, 'Thompson''s Landing',          '2 hours',        'PinePaddlesports', true, 'verified', now(), 'Pine River Paddlesports Center'),
  ('ausable', 'Thompson''s Landing',             'USFS. Restrooms.',                                                      'carry_in',  44.50362, -83.79986,  57.0, null, 'Loud Dam Upper Launch',        '3 hours',        'PinePaddlesports', true, 'verified', now(), 'Pine River Paddlesports Center'),
  ('ausable', 'Loud Dam Upper Launch',           'Consumers Power.',                                                      'boat_ramp', 44.46226, -83.72243,  63.0, null, 'Five Channels Dam Upper Launch', '2 hours',      'PinePaddlesports', true, 'verified', now(), 'Pine River Paddlesports Center'),
  ('ausable', 'Five Channels Dam Upper Launch',  'Consumers Power. Portage required.',                                    'boat_ramp', 44.45846, -83.67712,  66.0, null, 'Sawmill Point Launch',         '3 hours',        'PinePaddlesports', true, 'verified', now(), 'Pine River Paddlesports Center'),
  ('ausable', 'Sawmill Point Launch',            'USFS. Restrooms.',                                                      'carry_in',  44.45905, -83.60873,  70.0, null, 'Cooke Dam Upper Launch',       '3 hours',        'PinePaddlesports', true, 'verified', now(), 'Pine River Paddlesports Center'),
  ('ausable', 'Cooke Dam Upper Launch',          'Consumers Power. Restrooms.',                                           'boat_ramp', 44.47232, -83.57222,  74.0, null, 'Cooke Dam Lower Launch',       'portage',        'PinePaddlesports', true, 'verified', now(), 'Pine River Paddlesports Center'),
  ('ausable', 'Cooke Dam Lower Launch',          'Consumers Power. Restrooms.',                                           'boat_ramp', 44.47347, -83.56960,  74.5, null, 'Foote Dam',                    '5 hours',        'PinePaddlesports', true, 'verified', now(), 'Pine River Paddlesports Center'),
  ('ausable', 'Foote Dam',                       'DNR. Restrooms.',                                                       'boat_ramp', 44.43786, -83.43281,  82.0, null, 'Whirlpool Angler Access',      '1.5 hours',      'PinePaddlesports', true, 'verified', now(), 'Pine River Paddlesports Center'),
  ('ausable', 'Whirlpool Angler Access',         'USFS. Restrooms.',                                                      'carry_in',  44.43457, -83.39088,  85.0, null, 'Lake Huron (mouth)',           null,             'PinePaddlesports', true, 'verified', now(), 'Pine River Paddlesports Center'),
  ('ausable', 'Lake Huron (mouth)',              'AuSable River mouth at Lake Huron.',                                    'beach_launch', 44.40689, -83.32115, 90.0, null, null,                            null,             'PinePaddlesports', true, 'verified', now(), 'Pine River Paddlesports Center');

commit;
