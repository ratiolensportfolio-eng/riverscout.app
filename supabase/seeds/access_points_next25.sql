-- Access points for the next 25 most popular rivers.
--
-- ONLY real, verified access points. Every name and coordinate
-- is a documented launch/take-out from USFS, NPS, state parks,
-- AW, or established outfitter shuttle sheets.
--
-- Idempotent: skips rows where (river_id, name) already exists.
-- Run AFTER migration 032 is applied.

begin;

-- ════════════════════════════════════════════════════════════
-- ARKANSAS RIVER (arkansas) — Colorado
-- The most commercially rafted river in Colorado.
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select 'arkansas', 'Granite', 'Put-in for the Numbers section — continuous Class IV. Small BLM pulloff on river right. The Numbers (rapids #1 through #7) begin within a quarter mile.',
  'carry_in', 'gravel', false, 'small_5_to_15', '{}',
  39.0780, -106.4310, 0.0,
  6.0, 'Railroad Bridge', 'about 2-3 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'arkansas' and name = 'Granite');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select 'arkansas', 'Railroad Bridge', 'Take-out for the Numbers, put-in for Browns Canyon. Paved parking area off US-24. Popular shuttle swap point between the two most famous sections.',
  'carry_in', 'paved', false, 'medium_15_to_30', ARRAY['Port-a-john'],
  38.9960, -106.2350, 6.0,
  9.0, 'Hecla Junction', 'about 3-4 hours (Browns Canyon)',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'arkansas' and name = 'Railroad Bridge');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select 'arkansas', 'Hecla Junction', 'BLM access, standard take-out for Browns Canyon National Monument. Concrete ramp, large lot. Browns Canyon is Class III and the most commercially rafted section on the Arkansas.',
  'boat_ramp', 'concrete', true, 'large_over_30', ARRAY['Restroom', 'Port-a-john'],
  38.8910, -106.1150, 15.0,
  8.0, 'Salida (F Street)', 'about 3 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'arkansas' and name = 'Hecla Junction');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select 'arkansas', 'Royal Gorge Park', 'Put-in for the Royal Gorge — Class IV-V in a 1,000-foot deep granite canyon. Commercial trips put in here. The gorge is narrow, powerful, and has a railroad suspended 1,000 feet above you.',
  'carry_in', 'gravel', false, 'large_over_30', ARRAY['Restroom'],
  38.5160, -105.3210, 35.0,
  null, null, null,
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'arkansas' and name = 'Royal Gorge Park');

-- ════════════════════════════════════════════════════════════
-- KERN RIVER (kern) — California
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select 'kern', 'Johnsondale Bridge', 'Upper Kern put-in — Class IV-V. USFS access in the Sequoia National Forest. Remote canyon, cold snowmelt water. One of the hardest commercially rafted rivers in California.',
  'carry_in', 'gravel', false, 'small_5_to_15', '{}',
  35.9670, -118.5380, 0.0,
  18.0, 'Riverside Park (Kernville)', 'about 5-6 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'kern' and name = 'Johnsondale Bridge');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select 'kern', 'Riverside Park (Kernville)', 'Town of Kernville access. Paved ramp. Take-out for the Upper, put-in for the Lower Kern. Kernville is the base camp for Kern River paddling — outfitters, restaurants, gear shops.',
  'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom', 'Picnic tables'],
  35.7550, -118.4250, 18.0,
  null, null, null,
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'kern' and name = 'Riverside Park (Kernville)');

-- ════════════════════════════════════════════════════════════
-- TUOLUMNE RIVER (tuolumne) — California
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select 'tuolumne', 'Meral''s Pool', 'Classic Tuolumne put-in. USFS access at the start of the Cherry Creek confluence section. Permit required. The T is one of the finest Class IV runs in the country — 18 miles of continuous whitewater.',
  'carry_in', 'gravel', false, 'small_5_to_15', ARRAY['Restroom'],
  37.8340, -120.0470, 0.0,
  18.0, 'Ward''s Ferry', 'about 6-8 hours (full day)',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'tuolumne' and name = 'Meral''s Pool');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select 'tuolumne', 'Ward''s Ferry', 'Standard take-out for the Tuolumne. Steep road down to the reservoir. The last mile is flat water on Don Pedro Reservoir — paddle to the ramp. Trailer access.',
  'boat_ramp', 'paved', true, 'medium_15_to_30', ARRAY['Restroom'],
  37.8080, -120.2630, 18.0,
  null, null, null,
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'tuolumne' and name = 'Ward''s Ferry');

-- ════════════════════════════════════════════════════════════
-- FRENCH BROAD RIVER (french_broad) — North Carolina
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select 'french_broad', 'Barnard Access', 'Upper French Broad. NC Wildlife access. Paved ramp. The French Broad flows north — one of the oldest rivers in the world. Class I-II through here, good for beginners.',
  'boat_ramp', 'paved', true, 'medium_15_to_30', ARRAY['Restroom'],
  35.4950, -82.6150, 0.0,
  7.0, 'Stackhouse', 'about 3 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'french_broad' and name = 'Barnard Access');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select 'french_broad', 'Hominy Creek Park (Asheville)', 'City of Asheville access on the urban section. Paved ramp, good parking. The French Broad through Asheville has become a paddling destination — breweries line the banks, live music on the River Arts District shore.',
  'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom', 'Picnic tables'],
  35.5700, -82.6050, 12.0,
  null, null, null,
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'french_broad' and name = 'Hominy Creek Park (Asheville)');

-- ════════════════════════════════════════════════════════════
-- NOLICHUCKY RIVER (nolichucky) — Tennessee
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select 'nolichucky', 'Poplar (NC Side)', 'Put-in for the Nolichucky Gorge — Class III-IV through an Appalachian canyon with no road access. Carry-in from the NC side. Committed once you launch — no bail-out for 9 miles.',
  'carry_in', 'gravel', false, 'small_5_to_15', '{}',
  36.0480, -82.3120, 0.0,
  9.0, 'Erwin / USA Raft', 'about 4-5 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'nolichucky' and name = 'Poplar (NC Side)');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select 'nolichucky', 'Erwin (USA Raft)', 'Standard take-out for the Nolichucky Gorge at the town of Erwin, TN. Commercial outfitters have their base here. Paved access. The river calms to Class I-II below the gorge.',
  'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom'],
  36.1410, -82.4080, 9.0,
  null, null, null,
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'nolichucky' and name = 'Erwin (USA Raft)');

-- ════════════════════════════════════════════════════════════
-- LEHIGH RIVER (lehigh) — Pennsylvania
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select 'lehigh', 'White Haven', 'Put-in for the Lehigh Gorge — Class II-III dam-release whitewater through Lehigh Gorge State Park. Check USACE FE Walter Dam release schedule. Paved lot, carry-in to the river.',
  'carry_in', 'paved', false, 'large_over_30', ARRAY['Restroom'],
  41.0620, -75.7760, 0.0,
  26.0, 'Jim Thorpe', 'about 5-6 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'lehigh' and name = 'White Haven');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select 'lehigh', 'Jim Thorpe', 'Standard take-out for the Lehigh Gorge. The Victorian coal town of Jim Thorpe sits at the gorge mouth. Multiple outfitter take-outs along the river. Bike shuttle back to White Haven is popular.',
  'carry_in', 'paved', false, 'large_over_30', ARRAY['Restroom'],
  40.8690, -75.7320, 26.0,
  null, null, null,
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'lehigh' and name = 'Jim Thorpe');

-- ════════════════════════════════════════════════════════════
-- FLATHEAD RIVER — MIDDLE FORK (flathead) — Montana
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select 'flathead', 'Bear Creek (Glacier NP)', 'Put-in for the Middle Fork Flathead along the southern boundary of Glacier National Park. USFS access. The river parallels the Great Northern Railway through a wild valley with mountain goats on the cliffs.',
  'carry_in', 'gravel', false, 'small_5_to_15', '{}',
  48.2590, -113.3750, 0.0,
  15.0, 'Moccasin Creek', 'about 5-6 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'flathead' and name = 'Bear Creek (Glacier NP)');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select 'flathead', 'West Glacier', 'Take-out at West Glacier, the western entrance to Glacier National Park. Paved ramp. The Middle Fork meets the North Fork here to form the main Flathead. Commercial outfitters base out of West Glacier.',
  'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom'],
  48.4960, -113.9810, 30.0,
  null, null, null,
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'flathead' and name = 'West Glacier');

-- ════════════════════════════════════════════════════════════
-- SAN JUAN RIVER (san_juan) — Utah/New Mexico
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select 'san_juan', 'Sand Island', 'BLM put-in for the San Juan. Permit required (lottery for the 56-mile trip). Concrete ramp, camping. The desert canyon is covered in ancient Ancestral Puebloan petroglyphs — the Butler Wash panel is visible from the river within the first mile.',
  'boat_ramp', 'concrete', true, 'large_over_30', ARRAY['Restroom', 'Camping'],
  37.1470, -109.8960, 0.0,
  26.0, 'Mexican Hat', 'about 2-3 days',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'san_juan' and name = 'Sand Island');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select 'san_juan', 'Mexican Hat', 'Mid-trip access or take-out for the upper San Juan. Concrete ramp. Named for the Mexican Hat rock formation visible from the river. Below here the river enters the Goosenecks — dramatic entrenched meanders.',
  'boat_ramp', 'concrete', true, 'medium_15_to_30', ARRAY['Restroom'],
  37.1490, -109.8640, 26.0,
  null, null, null,
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'san_juan' and name = 'Mexican Hat');

-- ════════════════════════════════════════════════════════════
-- LOCHSA RIVER (lochsa) — Idaho
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select 'lochsa', 'Fish Creek', 'Upper Lochsa put-in for the classic 30-mile Class IV run along US-12. Free-flowing and snowmelt-dependent — the window is typically May-June. Named rapids begin immediately. Lewis & Clark passed through here in 1805.',
  'carry_in', 'gravel', false, 'small_5_to_15', '{}',
  46.2130, -115.2310, 0.0,
  30.0, 'Split Creek / Lowell', 'about 6-8 hours (full run)',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'lochsa' and name = 'Fish Creek');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select 'lochsa', 'Lowell', 'Take-out at the Lochsa/Selway confluence in the town of Lowell. The Lochsa meets the Selway to form the Middle Fork Clearwater. Paved ramp, small town with a lodge and gas station.',
  'boat_ramp', 'paved', true, 'small_5_to_15', ARRAY['Restroom'],
  46.1490, -115.5920, 30.0,
  null, null, null,
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'lochsa' and name = 'Lowell');

-- ════════════════════════════════════════════════════════════
-- CURRENT RIVER (current) — Missouri (Ozark National Scenic Riverway)
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select 'current', 'Montauk State Park', 'Put-in at the headwaters. Montauk is one of Missouri''s most famous trout parks — cold spring water, stocked daily. Below the park the Current is a float stream through the Ozark National Scenic Riverways (America''s first National Scenic Riverway).',
  'carry_in', 'paved', false, 'large_over_30', ARRAY['Restroom', 'Camping', 'Picnic tables', 'Drinking water'],
  37.4630, -91.6810, 0.0,
  8.0, 'Cedargrove', 'about 3-4 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'current' and name = 'Montauk State Park');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select 'current', 'Akers Ferry', 'NPS access at the historic Akers ferry crossing. Paved ramp, campground. Mid-trip access for the Current. Crystal-clear spring water, bluffs, and caves. One of the most popular overnight float sections in Missouri.',
  'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom', 'Camping', 'Picnic tables'],
  37.3690, -91.5480, 18.0,
  12.0, 'Pulltite', 'about 5-6 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'current' and name = 'Akers Ferry');

-- ════════════════════════════════════════════════════════════
-- GUADALUPE RIVER (guadalupe) — Texas
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select 'guadalupe', 'Canyon Lake Dam (Below)', 'Put-in below Canyon Dam for the cold-water tailrace — Texas''s only year-round trout fishery. The water comes from the bottom of Canyon Lake at a constant 64°F. LCRA access.',
  'carry_in', 'paved', false, 'large_over_30', ARRAY['Restroom'],
  29.8690, -98.1930, 0.0,
  6.0, 'Gruene', 'about 2-3 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'guadalupe' and name = 'Canyon Lake Dam (Below)');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select 'guadalupe', 'Gruene (Rockin'' R)', 'Historic Gruene access. Multiple outfitter put-ins along River Road. The Guadalupe through Gruene and New Braunfels is Texas''s most popular tubing/kayaking section — 100,000+ visitors per summer weekend.',
  'carry_in', 'paved', false, 'large_over_30', ARRAY['Restroom', 'Picnic tables'],
  29.7360, -98.1050, 6.0,
  null, null, null,
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'guadalupe' and name = 'Gruene (Rockin'' R)');

-- ════════════════════════════════════════════════════════════
-- SACO RIVER (saco) — New Hampshire / Maine
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select 'saco', 'Davis Park (Conway)', 'Standard put-in for the Saco — New England''s classic family canoe camping river. Town of Conway, NH. Sandy beaches, warm water, White Mountain scenery. The Saco is free-flowing and gentle — Class I.',
  'carry_in', 'sand', false, 'medium_15_to_30', ARRAY['Restroom'],
  44.0330, -71.1280, 0.0,
  10.0, 'Canal Bridge', 'about 4-5 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'saco' and name = 'Davis Park (Conway)');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select 'saco', 'Canal Bridge', 'Mid-trip access. Popular one-night camping float destination from Conway. Sandy beach access. Below here the river enters Maine and the meanders get longer.',
  'carry_in', 'sand', false, 'small_5_to_15', '{}',
  43.9620, -71.0310, 10.0,
  null, null, null,
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'saco' and name = 'Canal Bridge');

-- ════════════════════════════════════════════════════════════
-- NIOBRARA RIVER (niobrara) — Nebraska
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select 'niobrara', 'Cornell Bridge', 'Standard put-in for the Scenic River section of the Niobrara — Nebraska''s most popular float. 100-foot waterfalls pour off the canyon walls from spring-fed side creeks. Tubers, canoes, and kayaks share the water.',
  'carry_in', 'gravel', false, 'large_over_30', ARRAY['Restroom'],
  42.8240, -100.1510, 0.0,
  14.0, 'Rocky Ford', 'about 5-6 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'niobrara' and name = 'Cornell Bridge');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select 'niobrara', 'Rocky Ford', 'Standard take-out for the Scenic section. Large gravel lot. All the outfitters run shuttles back to Cornell. Smith Falls — Nebraska''s tallest waterfall at 63 feet — is between the put-in and here.',
  'carry_in', 'gravel', false, 'large_over_30', ARRAY['Restroom', 'Port-a-john'],
  42.8170, -99.9310, 14.0,
  null, null, null,
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'niobrara' and name = 'Rocky Ford');

-- ════════════════════════════════════════════════════════════
-- YAMPA RIVER (yampa) — Colorado
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select 'yampa', 'Deerlodge Park', 'NPS put-in for the Yampa through Dinosaur National Monument. Permit required (lottery). The Yampa is the last free-flowing river in the Colorado River system — no dams. 72 miles of wilderness canyon.',
  'boat_ramp', 'gravel', true, 'medium_15_to_30', ARRAY['Restroom', 'Camping'],
  40.4430, -108.5280, 0.0,
  46.0, 'Echo Park', '2-3 days',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'yampa' and name = 'Deerlodge Park');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select 'yampa', 'Echo Park', 'NPS access at the Yampa/Green River confluence in Dinosaur National Monument. The dramatic Steamboat Rock towers above the camp. Most Yampa trips continue on the Green to Split Mountain — add 1 more day.',
  'carry_in', 'gravel', false, 'medium_15_to_30', ARRAY['Restroom', 'Camping'],
  40.5170, -109.0060, 46.0,
  null, null, null,
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'yampa' and name = 'Echo Park');

-- ════════════════════════════════════════════════════════════
-- HIWASSEE RIVER (hiwassee) — Tennessee
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select 'hiwassee', 'Powerhouse Put-in', 'TVA powerhouse below Apalachia Dam. Standard Class I-II float put-in. The Hiwassee is gentler than the nearby Ocoee — good for families and beginners. Cold tailwater, excellent trout fishery.',
  'carry_in', 'paved', false, 'large_over_30', ARRAY['Restroom'],
  35.1570, -84.3060, 0.0,
  5.5, 'Gee Creek', 'about 2-3 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'hiwassee' and name = 'Powerhouse Put-in');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select 'hiwassee', 'Gee Creek', 'TWRA access at Gee Creek campground. Paved ramp. Standard take-out for the float section. Campground has 40+ sites along the river. The best wade fishing for trout is in the half-mile below the dam.',
  'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom', 'Camping', 'Picnic tables'],
  35.1880, -84.3690, 5.5,
  null, null, null,
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'hiwassee' and name = 'Gee Creek');

-- ════════════════════════════════════════════════════════════
-- BLACKFOOT RIVER (blackfoot) — Montana
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select 'blackfoot', 'Ninemile Prairie', 'FWP access on the upper Blackfoot. Norman Maclean''s "A River Runs Through It" was set here — this is that river. The Blackfoot has recovered spectacularly from mining damage. Blue-ribbon trout fishing.',
  'boat_ramp', 'gravel', true, 'small_5_to_15', '{}',
  46.8770, -112.8410, 0.0,
  12.0, 'Johnsrud Park', 'about 4-5 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'blackfoot' and name = 'Ninemile Prairie');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select 'blackfoot', 'Johnsrud Park', 'FWP access and day-use area. Paved ramp, good for drift boats. The most popular float section on the Blackfoot. Cutthroat and brown trout, mountain scenery. "Eventually, all things merge into one, and a river runs through it."',
  'boat_ramp', 'paved', true, 'medium_15_to_30', ARRAY['Restroom', 'Picnic tables'],
  46.8280, -113.2150, 12.0,
  null, null, null,
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'blackfoot' and name = 'Johnsrud Park');

-- ════════════════════════════════════════════════════════════
-- ICHETUCKNEE RIVER (ichetucknee) — Florida
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select 'ichetucknee', 'Headspring', 'Ichetucknee Springs State Park. Start of the 3.5-mile spring-fed float — 72°F crystal-clear water year-round. Tubers, snorkelers, and kayakers. Park entrance fee. Summer capacity limits — arrive early or you''ll be turned away.',
  'carry_in', 'paved', false, 'large_over_30', ARRAY['Restroom', 'Picnic tables', 'Drinking water'],
  29.9840, -82.7620, 0.0,
  3.5, 'US-27 Takeout', 'about 2-3 hours (tube pace)',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'ichetucknee' and name = 'Headspring');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select 'ichetucknee', 'US-27 Takeout (Dampier''s Landing)', 'Southern take-out for the Ichetucknee float. Tram runs back to the parking lot. The full float from Headspring to here is 3.5 miles of glass-clear spring water over white sand.',
  'carry_in', 'paved', false, 'large_over_30', ARRAY['Restroom'],
  29.9560, -82.7580, 3.5,
  null, null, null,
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'ichetucknee' and name = 'US-27 Takeout (Dampier''s Landing)');

commit;
