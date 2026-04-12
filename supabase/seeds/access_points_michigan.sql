-- Michigan river access points — seed data.
--
-- Covers all Michigan rivers in data/rivers.ts EXCEPT pine_mi
-- (user enters manually) and pere_marquette (separate seed file).
-- Each river gets its primary well-known access points with
-- river miles, float times, and local knowledge descriptions.
--
-- Idempotent: skips rows where (river_id, name) already exists.
-- Run AFTER migration 032_river_access_points.sql is applied.

begin;

-- ════════════════════════════════════════════════════════════
-- AU SABLE RIVER (ausable) — Michigan's premier trout stream
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'ausable', 'Burton''s Landing', 'Start of the legendary Holy Water — flies-only, catch-and-release trophy trout water. Gravel pull-off, room for about 10 cars. The most famous wade fishing access in Michigan.',
  'carry_in', 'gravel', false, 'small_5_to_15', '{}',
  44.6215, -84.7015, 1.0,
  6.0, 'Wakeley Bridge', 'about 3-4 hours (wade fishing pace)',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'ausable' and name = 'Burton''s Landing');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'ausable', 'Wakeley Bridge', 'End of the Holy Water section. Paved ramp good for canoes. Popular take-out for the flies-only float. Parking for 15+ vehicles.',
  'boat_ramp', 'paved', false, 'medium_15_to_30', ARRAY['Restroom'],
  44.5940, -84.7520, 7.0,
  8.0, 'Stephan Bridge', 'about 3-4 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'ausable' and name = 'Wakeley Bridge');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'ausable', 'Stephan Bridge', 'USFS access on the mainstream Au Sable. Good canoe launch, gravel ramp. The river widens here and picks up current. Popular overnight camping float from here to Mio.',
  'boat_ramp', 'gravel', true, 'small_5_to_15', ARRAY['Restroom', 'Picnic tables'],
  44.5690, -84.3850, 15.0,
  7.0, 'Keystone Landing', 'about 3 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'ausable' and name = 'Stephan Bridge');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'ausable', 'Keystone Landing', 'Dirt ramp, easy carry to water. Parking for about 8 cars. Can get muddy in spring. Good mid-trip access between Stephan and Mio.',
  'carry_in', 'dirt', false, 'small_5_to_15', '{}',
  44.5510, -84.3150, 22.0,
  8.0, 'Mio Dam Pond', 'about 3-4 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'ausable' and name = 'Keystone Landing');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'ausable', 'Mio Dam Pond', 'Access below Mio Dam. Concrete ramp, large parking area. Below here the Au Sable is wider and warmer — different character than the Holy Water. Good smallmouth and walleye water.',
  'boat_ramp', 'concrete', true, 'large_over_30', ARRAY['Restroom', 'Picnic tables'],
  44.5080, -84.1310, 30.0,
  10.0, 'Alcona Dam Pond', 'about 4-5 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'ausable' and name = 'Mio Dam Pond');

-- ════════════════════════════════════════════════════════════
-- MANISTEE RIVER (manistee) — steelhead capital of Michigan
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'manistee', 'M-72 Bridge', 'Upper Manistee access near the headwaters. Small gravel pull-off. The river is narrow and fast here — canoe or kayak only. Wild brook trout water.',
  'carry_in', 'gravel', false, 'limited_under_5', '{}',
  44.5920, -85.0510, 5.0,
  8.0, 'CCC Bridge', 'about 3-4 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'manistee' and name = 'M-72 Bridge');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'manistee', 'CCC Bridge', 'USFS bridge crossing. Gravel ramp, room for 8-10 vehicles. Good brown trout water. Popular canoe camping put-in for the upper Manistee float.',
  'boat_ramp', 'gravel', false, 'small_5_to_15', '{}',
  44.5410, -85.1820, 13.0,
  9.0, 'Sharon Bridge / M-66', 'about 4 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'manistee' and name = 'CCC Bridge');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'manistee', 'M-66 Boat Launch', 'Major USFS access on the upper-middle Manistee. Concrete ramp, trailer turnaround. The river is wide enough for drift boats from here downstream. Good steelhead and salmon access in fall.',
  'boat_ramp', 'concrete', true, 'medium_15_to_30', ARRAY['Restroom'],
  44.4915, -85.2278, 22.0,
  12.0, 'High Bridge', 'about 5-6 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'manistee' and name = 'M-66 Boat Launch');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'manistee', 'High Bridge', 'USFS campground right at the access — first come first served, 16 sites. Get there by Friday afternoon in summer. Vault toilets. Gravel ramp for drift boats and canoes.',
  'boat_ramp', 'gravel', true, 'medium_15_to_30', ARRAY['Restroom', 'Camping'],
  44.4520, -85.5250, 34.0,
  8.0, 'Red Bridge', 'about 3-4 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'manistee' and name = 'High Bridge');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'manistee', 'Red Bridge', 'USFS access above Hodenpyl Dam Pond. Paved ramp, good parking. Last access before the river enters the impoundment. Popular fall steelhead and chinook spot.',
  'boat_ramp', 'paved', true, 'medium_15_to_30', ARRAY['Restroom', 'Picnic tables'],
  44.4200, -85.6600, 42.0,
  15.0, 'Tippy Dam', 'about 6-7 hours (through Hodenpyl Pond)',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'manistee' and name = 'Red Bridge');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'manistee', 'Tippy Dam', 'THE steelhead and salmon fishing spot in Michigan. Concrete ramp below the dam. Elbow-to-elbow combat fishing in fall but the fish are there. 15,000+ steelhead return annually. Large parking lot but fills by 6am on fall weekends.',
  'boat_ramp', 'concrete', true, 'large_over_30', ARRAY['Restroom', 'Picnic tables'],
  44.2390, -85.9322, 57.0,
  15.0, 'Bear Creek confluence', 'about 5-6 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'manistee' and name = 'Tippy Dam');

-- ════════════════════════════════════════════════════════════
-- MUSKEGON RIVER (muskegon) — largest west-side MI river
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'muskegon', 'Croton Dam', 'Below the dam — start of the best trout and steelhead water on the Muskegon. Paved ramp, large lot. Cold tailwater below the dam supports excellent year-round trout fishing.',
  'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom', 'Picnic tables'],
  43.4540, -85.6750, 1.0,
  6.0, 'Pine Street Access', 'about 2.5-3 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'muskegon' and name = 'Croton Dam');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'muskegon', 'Pine Street Access', 'City of Newaygo access. Paved ramp, good for drift boats. The Muskegon is big water here — 200+ feet wide. Good year-round fishing access.',
  'boat_ramp', 'paved', true, 'medium_15_to_30', ARRAY['Restroom'],
  43.4220, -85.7880, 7.0,
  8.0, 'Henning Park', 'about 3-4 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'muskegon' and name = 'Pine Street Access');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'muskegon', 'Henning Park', 'County park with concrete ramp. Big enough for jet boats. Popular steelhead access in spring. Good walleye and smallmouth in summer.',
  'boat_ramp', 'concrete', true, 'large_over_30', ARRAY['Restroom', 'Picnic tables', 'Camping'],
  43.3850, -85.8920, 15.0,
  10.0, 'Bridgeton Access', 'about 4 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'muskegon' and name = 'Henning Park');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'muskegon', 'Bridgeton Access', 'DNR access site. Gravel ramp, room for trailers. The river slows through here — good for beginners. Walleye fishing in the deeper pools.',
  'boat_ramp', 'gravel', true, 'small_5_to_15', '{}',
  43.3420, -85.9850, 25.0,
  12.0, 'Maple Island Road', 'about 5 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'muskegon' and name = 'Bridgeton Access');

-- ════════════════════════════════════════════════════════════
-- BOARDMAN RIVER (boardman) — Traverse City
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'boardman', 'Supply Road Bridge', 'Upper Boardman access. Remote forest paddle starts here. The river is narrow and winding — canoe or kayak only. Wild brook trout and brown trout.',
  'carry_in', 'gravel', false, 'limited_under_5', '{}',
  44.6830, -85.4120, 1.0,
  8.0, 'Brown Bridge Quiet Area', 'about 3-4 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'boardman' and name = 'Supply Road Bridge');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'boardman', 'Brown Bridge Quiet Area', 'Former dam site, now restored to free-flowing river. Beautiful stretch through the quiet area. Gravel access, limited parking. Excellent trout habitat since the dam removal.',
  'carry_in', 'gravel', false, 'small_5_to_15', '{}',
  44.6450, -85.4580, 9.0,
  6.0, 'Ranch Rudolf', 'about 2-3 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'boardman' and name = 'Brown Bridge Quiet Area');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'boardman', 'Ranch Rudolf', 'Private campground with public river access (fee for parking). Canoe and kayak rentals available. Popular launch for the lower Boardman float into downtown Traverse City.',
  'carry_in', 'sand', false, 'medium_15_to_30', ARRAY['Restroom', 'Camping'],
  44.6180, -85.4920, 15.0,
  5.0, 'Hull Park (Traverse City)', 'about 2 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'boardman' and name = 'Ranch Rudolf');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'boardman', 'Hull Park', 'City park in downtown Traverse City. Take-out at the end of the urban paddle. Paved path to the water, plenty of parking. The Boardman flows into Grand Traverse Bay just downstream.',
  'carry_in', 'paved', false, 'large_over_30', ARRAY['Restroom', 'Picnic tables', 'Drinking water'],
  44.7610, -85.6210, 20.0,
  null, null, null,
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'boardman' and name = 'Hull Park');

-- ════════════════════════════════════════════════════════════
-- JORDAN RIVER (jordan) — Michigan's first Natural River
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'jordan', 'Graves Crossing', 'Upper Jordan access. Classic cold-water trout stream. Canoe or kayak only — no motors allowed on the Jordan. The river is narrow, fast, and winding with lots of sweepers. Not for beginners.',
  'carry_in', 'gravel', false, 'small_5_to_15', '{}',
  44.9430, -84.9820, 1.0,
  5.0, 'Old State Road Bridge', 'about 2.5 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'jordan' and name = 'Graves Crossing');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'jordan', 'Old State Road Bridge', 'Mid-trip access on the Jordan. Small gravel pull-off. The river opens up slightly here. Good wade fishing for brook and brown trout.',
  'carry_in', 'gravel', false, 'limited_under_5', '{}',
  44.9180, -85.0120, 6.0,
  5.0, 'Webster Bridge', 'about 2.5 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'jordan' and name = 'Old State Road Bridge');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'jordan', 'Webster Bridge', 'Most popular take-out on the Jordan. Gravel ramp, room for 10+ vehicles. Beautiful Jordan River Valley from here. Michigan''s first designated Natural River (1970).',
  'carry_in', 'gravel', false, 'small_5_to_15', ARRAY['Port-a-john'],
  44.8920, -85.0580, 11.0,
  null, null, null,
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'jordan' and name = 'Webster Bridge');

-- ════════════════════════════════════════════════════════════
-- BETSIE RIVER (betsie) — Crystal-clear Lake Michigan trib
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'betsie', 'Grass Lake Road', 'Upper Betsie access. Small, quiet launch. The Betsie is crystal clear and cold — spring-fed from the Sleeping Bear dune aquifer. Good brook trout water.',
  'carry_in', 'dirt', false, 'limited_under_5', '{}',
  44.5680, -85.8510, 1.0,
  5.0, 'Kurick Road', 'about 2.5 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'betsie' and name = 'Grass Lake Road');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'betsie', 'Kurick Road', 'Mid-river access. Gravel pull-off on the south side. The Betsie braids through here with some fun riffles. Good brown trout water.',
  'carry_in', 'gravel', false, 'limited_under_5', '{}',
  44.5420, -85.9050, 6.0,
  6.0, 'Thompsonville / US-31', 'about 3 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'betsie' and name = 'Kurick Road');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'betsie', 'Thompsonville Bridge', 'Town of Thompsonville. Concrete ramp, good parking. Below here the Betsie widens and slows toward Betsie Lake. Fall salmon run is excellent.',
  'boat_ramp', 'concrete', true, 'medium_15_to_30', ARRAY['Restroom'],
  44.5130, -85.9540, 12.0,
  null, null, null,
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'betsie' and name = 'Thompsonville Bridge');

-- ════════════════════════════════════════════════════════════
-- LITTLE MANISTEE (little_manistee) — steelhead nursery
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'little_manistee', 'Old M-37 Bridge', 'Upper Little Manistee access. Small gravel pull-off. Wild, undeveloped trout stream. Home of the Little Manistee Weir — Michigan DNR collects steelhead eggs here for the statewide stocking program.',
  'carry_in', 'gravel', false, 'limited_under_5', '{}',
  44.1850, -85.8610, 1.0,
  6.0, 'Spencer Bridge', 'about 3 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'little_manistee' and name = 'Old M-37 Bridge');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'little_manistee', 'Spencer Bridge', 'USFS access. Gravel ramp, room for trailers. Popular steelhead fishing access in spring. The Little Manistee is narrow but holds big fish — 10-pound steelhead are common.',
  'boat_ramp', 'gravel', true, 'small_5_to_15', ARRAY['Port-a-john'],
  44.1510, -85.9280, 7.0,
  8.0, 'Nine Mile Bridge', 'about 3-4 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'little_manistee' and name = 'Spencer Bridge');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'little_manistee', 'Nine Mile Bridge', 'Lower Little Manistee access. Gravel ramp. Below here the river joins the Manistee at Stronach. Popular drift boat access for guided steelhead trips.',
  'boat_ramp', 'gravel', true, 'small_5_to_15', '{}',
  44.1180, -86.0120, 15.0,
  null, null, null,
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'little_manistee' and name = 'Nine Mile Bridge');

-- ════════════════════════════════════════════════════════════
-- RIFLE RIVER (rifle) — northeast LP gem
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'rifle', 'Rifle River Recreation Area', 'State recreation area with paved ramp and campground. The Rifle is a small, clear stream with good brown trout fishing. Vehicle permit required.',
  'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom', 'Camping', 'Picnic tables', 'Drinking water'],
  44.3740, -84.0510, 1.0,
  7.0, 'Sage Lake Road', 'about 3 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'rifle' and name = 'Rifle River Recreation Area');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'rifle', 'Sage Lake Road', 'Bridge access on the middle Rifle. Small gravel pull-off. Nice riffles and pools through this stretch. Good wade fishing for trout.',
  'carry_in', 'gravel', false, 'limited_under_5', '{}',
  44.3280, -84.0180, 8.0,
  8.0, 'Omer City Park', 'about 3-4 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'rifle' and name = 'Sage Lake Road');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'rifle', 'Omer City Park', 'City park at the end of the paddleable Rifle. Concrete ramp, good parking. The river widens and slows below Omer before reaching Saginaw Bay. Walleye and smallmouth in the lower river.',
  'boat_ramp', 'concrete', true, 'medium_15_to_30', ARRAY['Restroom', 'Picnic tables'],
  44.0490, -83.8540, 16.0,
  null, null, null,
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'rifle' and name = 'Omer City Park');

-- ════════════════════════════════════════════════════════════
-- WHITE RIVER (white_mi) — underrated west-side gem
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'white_mi', 'Hesperia Dam', 'Below the dam on the upper White. Carry-in access. Cold tailwater with good trout. The White is less crowded than the PM or Muskegon — a local''s secret.',
  'carry_in', 'gravel', false, 'small_5_to_15', '{}',
  43.5680, -86.0420, 1.0,
  7.0, 'Pines Point', 'about 3 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'white_mi' and name = 'Hesperia Dam');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'white_mi', 'Pines Point', 'USFS campground and access on the middle White. Paved ramp, campground with 32 sites. Beautiful stretch through the Manistee National Forest. Good steelhead in fall.',
  'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom', 'Camping', 'Picnic tables', 'Drinking water'],
  43.5310, -86.1050, 8.0,
  7.0, 'Diamond Point', 'about 3 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'white_mi' and name = 'Pines Point');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'white_mi', 'Diamond Point', 'Lower White access. Gravel ramp with trailer turnaround. Below here the river widens toward White Lake and Lake Michigan. Fall salmon run.',
  'boat_ramp', 'gravel', true, 'small_5_to_15', '{}',
  43.4850, -86.1720, 15.0,
  null, null, null,
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'white_mi' and name = 'Diamond Point');

-- ════════════════════════════════════════════════════════════
-- PLATTE RIVER (platte_mi) — Sleeping Bear Dunes
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'platte_mi', 'Veterans Memorial Park', 'Upper Platte launch in Honor. Paved ramp, large lot. Start of the popular float to Lake Michigan through Sleeping Bear Dunes National Lakeshore. Busy on summer weekends — arrive by 9am.',
  'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom', 'Picnic tables'],
  44.6650, -86.0180, 1.0,
  8.0, 'Platte River Point (Lake Michigan)', 'about 2-3 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'platte_mi' and name = 'Veterans Memorial Park');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'platte_mi', 'Platte River Point', 'Take-out where the Platte meets Lake Michigan in Sleeping Bear Dunes. Sandy beach landing — no ramp. NPS parking lot ($25 park pass or $10 daily). One of the most scenic river mouths in Michigan. Coho salmon run in September.',
  'beach_launch', 'sand', false, 'large_over_30', ARRAY['Restroom'],
  44.7110, -86.1040, 9.0,
  null, null, null,
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'platte_mi' and name = 'Platte River Point');

-- ════════════════════════════════════════════════════════════
-- HURON RIVER (huron_mi) — metro Detroit paddling
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'huron_mi', 'Proud Lake Recreation Area', 'State recreation area on the upper Huron. Carry-in access, good for kayaks. Vehicle permit required. The Huron is narrow and winding through here — watch for downed trees.',
  'carry_in', 'gravel', false, 'large_over_30', ARRAY['Restroom', 'Picnic tables'],
  42.5720, -83.5510, 1.0,
  8.0, 'Milford / Central Park', 'about 3-4 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'huron_mi' and name = 'Proud Lake Recreation Area');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'huron_mi', 'Delhi Metropark', 'Metropark with paved ramp. Most popular launch on the Ann Arbor stretch. Canoe and kayak rentals available in summer. Easy family float — Class I at most. Metropark entry fee.',
  'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom', 'Picnic tables', 'Drinking water'],
  42.3380, -83.8820, 20.0,
  5.0, 'Dexter-Huron Metropark', 'about 2 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'huron_mi' and name = 'Delhi Metropark');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'huron_mi', 'Gallup Park', 'City of Ann Arbor park with a livery and boat launch. Paved path to the water. The most accessible launch for the Ann Arbor urban paddle. Canoe and kayak rentals. Free parking.',
  'carry_in', 'paved', false, 'large_over_30', ARRAY['Restroom', 'Picnic tables', 'Drinking water'],
  42.2870, -83.7220, 28.0,
  null, null, null,
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'huron_mi' and name = 'Gallup Park');

-- ════════════════════════════════════════════════════════════
-- TWO HEARTED RIVER (twohearted) — Hemingway's river
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'twohearted', 'High Bridge', 'Upper Two Hearted access deep in the Lake Superior State Forest. Remote — bring everything you need. Wild brook trout. The river Hemingway made famous (though he actually fished the nearby Fox River).',
  'carry_in', 'dirt', false, 'limited_under_5', '{}',
  46.6320, -85.3510, 1.0,
  10.0, 'Reed & Green Bridge', 'about 4-5 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'twohearted' and name = 'High Bridge');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'twohearted', 'Reed & Green Bridge', 'DNR access on the lower Two Hearted. Gravel pull-off. The river braids through cedar swamp here — beautiful but bring bug spray. Steelhead in spring.',
  'carry_in', 'gravel', false, 'limited_under_5', '{}',
  46.6850, -85.2920, 11.0,
  5.0, 'Two Hearted River Campground (Lake Superior)', 'about 2-3 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'twohearted' and name = 'Reed & Green Bridge');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'twohearted', 'Two Hearted River Campground', 'DNR campground at the Lake Superior mouth. Sandy beach launch into the river mouth. Remote and wild — one of the most pristine river mouths on the Great Lakes. Campground has 39 sites, no reservations.',
  'beach_launch', 'sand', false, 'medium_15_to_30', ARRAY['Restroom', 'Camping'],
  46.7120, -85.2510, 16.0,
  null, null, null,
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'twohearted' and name = 'Two Hearted River Campground');

-- ════════════════════════════════════════════════════════════
-- KALAMAZOO RIVER (kalamazoo) — southwest MI
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'kalamazoo', 'Ceresco Dam', 'Access below the dam near Battle Creek. Gravel ramp. The Kalamazoo is a warm-water fishery here — smallmouth, walleye, and northern pike. Easy current for beginners.',
  'boat_ramp', 'gravel', true, 'small_5_to_15', '{}',
  42.2510, -85.0680, 1.0,
  12.0, 'Galesburg', 'about 4-5 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'kalamazoo' and name = 'Ceresco Dam');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'kalamazoo', 'Allegan City Dam', 'City access below the dam. Concrete ramp. Good steelhead fishing in spring below the dam. The river is wide and navigable for drift boats through here.',
  'boat_ramp', 'concrete', true, 'medium_15_to_30', ARRAY['Restroom', 'Picnic tables'],
  42.5290, -85.8550, 30.0,
  15.0, 'New Richmond Bridge', 'about 5-6 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'kalamazoo' and name = 'Allegan City Dam');

-- ════════════════════════════════════════════════════════════
-- PIGEON RIVER (pigeon_mi) — elk country
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'pigeon_mi', 'Pigeon Bridge Campground', 'DNR campground on the upper Pigeon. Carry-in access, narrow stream. Wild brook trout. The Pigeon River Country State Forest is Michigan''s elk range — you may see elk from the water.',
  'carry_in', 'dirt', false, 'small_5_to_15', ARRAY['Camping'],
  45.0210, -84.4120, 1.0,
  6.0, 'Tin Bridge', 'about 3 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'pigeon_mi' and name = 'Pigeon Bridge Campground');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'pigeon_mi', 'Tin Bridge', 'Mid-trip access in Pigeon River Country. Very remote — no facilities, limited cell service. Gravel pull-off for 3-4 vehicles. Watch for sweepers and logjams on this stretch.',
  'carry_in', 'gravel', false, 'limited_under_5', '{}',
  45.0580, -84.3480, 7.0,
  null, null, null,
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'pigeon_mi' and name = 'Tin Bridge');

commit;
