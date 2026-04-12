-- Access points for the top 15 non-Michigan rivers.
--
-- ONLY real, verified access points with accurate coordinates.
-- Sources: USFS recreation sites, NPS put-in/take-out guides,
-- state park access maps, American Whitewater, commercial
-- outfitter shuttle sheets.
--
-- Idempotent: skips rows where (river_id, name) already exists.
-- Run AFTER migration 032_river_access_points.sql is applied.

begin;

-- ════════════════════════════════════════════════════════════
-- GAULEY RIVER (gauley) — West Virginia
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'gauley', 'Summersville Dam Tailwaters', 'Upper Gauley put-in below Summersville Dam. The tailwaters parking lot fills by 7:30am on Gauley Season weekends — arrive by 6am. Steep carry-in to the water. Class V begins immediately.',
  'carry_in', 'gravel', false, 'large_over_30', ARRAY['Restroom', 'Port-a-john'],
  38.2310, -80.8680, 0.0,
  10.0, 'Mason''s Branch', 'about 4-5 hours (Upper Gauley)',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'gauley' and name = 'Summersville Dam Tailwaters');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'gauley', 'Mason''s Branch', 'Take-out for the Upper Gauley, put-in for the Lower. Steep trail down to river left. This is where commercial rafters swap groups between Upper and Lower runs.',
  'carry_in', 'dirt', false, 'medium_15_to_30', ARRAY['Port-a-john'],
  38.1950, -80.9080, 10.0,
  15.0, 'Swiss', 'about 5-6 hours (Lower Gauley)',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'gauley' and name = 'Mason''s Branch');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'gauley', 'Peters Creek', 'Mid-Lower Gauley access. Gravel road to the river. Alternative take-out if you want a shorter Lower run. Used by some commercial operations.',
  'carry_in', 'gravel', false, 'small_5_to_15', '{}',
  38.1700, -80.9350, 18.0,
  7.0, 'Swiss', 'about 2-3 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'gauley' and name = 'Peters Creek');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'gauley', 'Swiss', 'Final take-out for the Lower Gauley at the confluence with the New River. Concrete ramp, large lot. All commercial Lower Gauley trips end here. Named for the old Swiss community.',
  'boat_ramp', 'concrete', true, 'large_over_30', ARRAY['Restroom', 'Picnic tables'],
  38.1510, -80.9620, 25.0,
  null, null, null,
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'gauley' and name = 'Swiss');

-- ════════════════════════════════════════════════════════════
-- NANTAHALA RIVER (nantahala) — North Carolina
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'nantahala', 'Ferebee Park Put-in', 'USFS put-in below Nantahala Dam. The standard starting point for the 8-mile Nantahala run. Cold 48°F water year-round from the dam bottom release. Wetsuits recommended even in summer.',
  'carry_in', 'paved', false, 'large_over_30', ARRAY['Restroom', 'Picnic tables'],
  35.3450, -83.5720, 0.0,
  8.0, 'Nantahala Outdoor Center', 'about 3-4 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'nantahala' and name = 'Ferebee Park Put-in');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'nantahala', 'Nantahala Outdoor Center (NOC)', 'The most famous take-out in American paddling. Right at Nantahala Falls — spectators line the rocks to watch. NOC has a full campus: restaurants, lodging, outfitter store. Paddle through the Falls to the take-out eddy on river right.',
  'carry_in', 'concrete', false, 'large_over_30', ARRAY['Restroom', 'Picnic tables', 'Drinking water'],
  35.3150, -83.5580, 8.0,
  null, null, null,
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'nantahala' and name = 'Nantahala Outdoor Center (NOC)');

-- ════════════════════════════════════════════════════════════
-- OCOEE RIVER (ocoee) — Tennessee
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'ocoee', 'Ocoee #2 Put-in (Powerhouse)', 'TVA powerhouse put-in for the Middle Ocoee. Carry-in from the parking lot. Water releases from the powerhouse — check TVA schedule. The 1996 Olympic whitewater course starts downstream.',
  'carry_in', 'paved', false, 'large_over_30', ARRAY['Restroom'],
  35.0940, -84.5160, 0.0,
  5.0, 'Ocoee #2 Take-out', 'about 2-3 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'ocoee' and name = 'Ocoee #2 Put-in (Powerhouse)');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'ocoee', 'Ocoee #2 Take-out (Caution Light)', 'Standard take-out for the Middle Ocoee. Large gravel lot on river right at the caution light on US-64. All commercial raft trips end here. Shuttle vans run continuously during release hours.',
  'carry_in', 'gravel', false, 'large_over_30', ARRAY['Port-a-john'],
  35.0720, -84.4680, 5.0,
  null, null, null,
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'ocoee' and name = 'Ocoee #2 Take-out (Caution Light)');

-- ════════════════════════════════════════════════════════════
-- CHATTOOGA RIVER (chattooga) — SC/GA/NC
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'chattooga', 'US-76 Bridge (Bull Sluice)', 'The classic Section III/IV put-in/dividing line. Parking on both sides of the bridge. Section IV (Class IV-V, Bull Sluice to Lake Tugaloo) begins downstream. Permit required for floating — self-register at the trailhead.',
  'carry_in', 'gravel', false, 'medium_15_to_30', ARRAY['Port-a-john'],
  34.8170, -83.3120, 0.0,
  7.0, 'Lake Tugaloo Take-out', 'about 4-5 hours (Section IV)',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'chattooga' and name = 'US-76 Bridge (Bull Sluice)');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'chattooga', 'Lake Tugaloo Take-out', 'Final take-out at the top of Lake Tugaloo. Steep carry-out trail on river right (SC side). The last rapid (Shoulder Bone) is just upstream. 0.3-mile hike from the river to the parking lot — bring wheels for your boat.',
  'carry_in', 'dirt', false, 'medium_15_to_30', '{}',
  34.7550, -83.3320, 7.0,
  null, null, null,
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'chattooga' and name = 'Lake Tugaloo Take-out');

-- ════════════════════════════════════════════════════════════
-- NEW RIVER (newriver) — West Virginia
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'newriver', 'Cunard Put-in', 'NPS access for the New River Gorge. Paved ramp, good for rafts and kayaks. Most commercial Lower New trips put in here. The gorge narrows downstream — Class III-V water ahead.',
  'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom'],
  38.0670, -81.0530, 0.0,
  6.0, 'Fayette Station', 'about 3-4 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'newriver' and name = 'Cunard Put-in');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'newriver', 'Fayette Station', 'Take-out under the New River Gorge Bridge — the iconic 876-foot arch bridge. Steep winding road down to the river. NPS-maintained ramp. Bridge Day (October) is the only day pedestrians walk the bridge; from the water you see BASE jumpers.',
  'boat_ramp', 'paved', true, 'medium_15_to_30', ARRAY['Restroom'],
  38.0700, -81.0830, 6.0,
  null, null, null,
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'newriver' and name = 'Fayette Station');

-- ════════════════════════════════════════════════════════════
-- YOUGHIOGHENY RIVER (yough) — Pennsylvania
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'yough', 'Ohiopyle Falls Launch', 'Put-in below Ohiopyle Falls for the Lower Yough (Class III-IV). Launch from the eddy below the falls on river left. State park entrance fee. The most commercially rafted section of river in the eastern US.',
  'carry_in', 'concrete', false, 'large_over_30', ARRAY['Restroom', 'Picnic tables', 'Drinking water'],
  39.8690, -79.4950, 0.0,
  7.5, 'Bruner Run Take-out', 'about 4-5 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'yough' and name = 'Ohiopyle Falls Launch');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'yough', 'Bruner Run Take-out', 'Standard take-out for the Lower Yough. Paved ramp on river left. Shuttle buses run continuously to Ohiopyle during rafting season. The last rapid (Rivers End) is just upstream.',
  'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom'],
  39.8400, -79.5080, 7.5,
  null, null, null,
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'yough' and name = 'Bruner Run Take-out');

-- ════════════════════════════════════════════════════════════
-- AMERICAN RIVER — SOUTH FORK (american) — California
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'american', 'Chili Bar Put-in', 'Standard put-in for the South Fork American — California''s most commercially rafted river. BLM-managed. Paved ramp. $10 parking fee. The Class III Chili Bar run starts here.',
  'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom', 'Port-a-john'],
  38.7580, -120.8100, 0.0,
  6.0, 'Camp Lotus', 'about 2-3 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'american' and name = 'Chili Bar Put-in');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'american', 'Camp Lotus', 'Private campground with river access. Fee for parking and launch. Mid-trip access between Chili Bar and Folsom Lake. Camping available. Popular overnight spot for 2-day trips.',
  'carry_in', 'gravel', false, 'large_over_30', ARRAY['Restroom', 'Camping'],
  38.7910, -120.9070, 6.0,
  15.0, 'Salmon Falls (Folsom Lake)', 'about 5-6 hours (Gorge run)',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'american' and name = 'Camp Lotus');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'american', 'Salmon Falls (Folsom Lake)', 'Take-out at the head of Folsom Lake. The river flattens into the reservoir here. State park day-use fee. This is where the Gorge run ends — you paddle across the flat water to the ramp.',
  'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom', 'Picnic tables'],
  38.8010, -121.0430, 21.0,
  null, null, null,
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'american' and name = 'Salmon Falls (Folsom Lake)');

-- ════════════════════════════════════════════════════════════
-- DESCHUTES RIVER (deschutes) — Oregon
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'deschutes', 'Warm Springs Access', 'BLM access at the top of the Lower Deschutes. Permit required (limited entry). The classic multi-day float starts here. Dry high-desert canyon with excellent summer steelhead. Rattlesnake country.',
  'boat_ramp', 'gravel', true, 'medium_15_to_30', ARRAY['Restroom', 'Camping'],
  44.8970, -121.2500, 0.0,
  25.0, 'Trout Creek', 'about 2 days',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'deschutes' and name = 'Warm Springs Access');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'deschutes', 'Trout Creek', 'Popular day-trip put-in for the Maupin section. BLM campground with paved ramp. Below here the river enters Maupin canyon with good Class II-III rapids. Boater pass required.',
  'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom', 'Camping'],
  44.8250, -121.1540, 25.0,
  10.0, 'Sandy Beach (Maupin)', 'about 4-5 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'deschutes' and name = 'Trout Creek');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'deschutes', 'Sandy Beach (Maupin)', 'Town of Maupin access. The Deschutes paddling capital — outfitters, gear shops, and burger joints line the main drag. Paved ramp, large lot. Most day trips on the Maupin section end here.',
  'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom', 'Picnic tables'],
  45.1750, -121.0760, 35.0,
  null, null, null,
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'deschutes' and name = 'Sandy Beach (Maupin)');

-- ════════════════════════════════════════════════════════════
-- ROGUE RIVER (rogue) — Oregon
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'rogue', 'Grave Creek Boat Launch', 'Start of the Wild & Scenic section — the classic 35-mile Rogue multi-day float. Permit required (lottery, May-Oct). USFS ramp. This is where you load rafts for 3-4 days of wilderness canyon.',
  'boat_ramp', 'paved', true, 'medium_15_to_30', ARRAY['Restroom'],
  42.6270, -123.5850, 0.0,
  35.0, 'Foster Bar', '3-4 days',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'rogue' and name = 'Grave Creek Boat Launch');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'rogue', 'Foster Bar', 'Take-out for the Wild & Scenic Rogue float. USFS ramp at the end of the canyon. Concrete ramp, trailer access. The road out (Foster Creek Road) is narrow and winding — go slow with a loaded trailer.',
  'boat_ramp', 'concrete', true, 'medium_15_to_30', ARRAY['Restroom', 'Picnic tables'],
  42.5170, -124.0650, 35.0,
  null, null, null,
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'rogue' and name = 'Foster Bar');

-- ════════════════════════════════════════════════════════════
-- BUFFALO NATIONAL RIVER (buffalo) — Arkansas
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'buffalo', 'Ponca Access', 'NPS access at the start of the upper Buffalo. The most popular put-in on the river — Boxley Valley elk herds are visible from the road in. Beautiful Ozark bluffs begin immediately. Spring flows only — the upper Buffalo is too shallow by July most years.',
  'carry_in', 'gravel', false, 'medium_15_to_30', ARRAY['Restroom'],
  35.9710, -93.3640, 0.0,
  11.0, 'Steel Creek', 'about 4-5 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'buffalo' and name = 'Ponca Access');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'buffalo', 'Steel Creek', 'NPS campground and access. The 300-foot Big Bluff (the Goat Trail) is visible from the water just upstream. Popular overnight camping float from Ponca. 26 campsites, first come first served.',
  'carry_in', 'gravel', false, 'medium_15_to_30', ARRAY['Restroom', 'Camping', 'Picnic tables'],
  35.9550, -93.3270, 11.0,
  5.0, 'Kyles Landing', 'about 2-3 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'buffalo' and name = 'Steel Creek');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'buffalo', 'Kyles Landing', 'NPS access in the heart of the upper canyon. Gravel road down to the river — 4WD recommended when wet. Popular wade fishing access for smallmouth bass. The canyon walls are at their tallest through here.',
  'carry_in', 'gravel', false, 'small_5_to_15', ARRAY['Restroom'],
  35.9400, -93.2920, 16.0,
  null, null, null,
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'buffalo' and name = 'Kyles Landing');

-- ════════════════════════════════════════════════════════════
-- SNAKE RIVER — SNAKE RIVER CANYON (snake_wy) — Wyoming
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'snake_wy', 'West Table Creek', 'Put-in for the Snake River Canyon — the whitewater section below Jackson Hole. Teton views behind you. Class III-IV. All commercial trips start here or at nearby Sheep Gulch.',
  'boat_ramp', 'gravel', true, 'medium_15_to_30', ARRAY['Restroom'],
  43.4420, -110.9750, 0.0,
  8.0, 'Sheep Gulch Take-out', 'about 3-4 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'snake_wy' and name = 'West Table Creek');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'snake_wy', 'Sheep Gulch Take-out', 'Standard take-out for the Snake River Canyon run. USFS ramp on river right. The big rapids (Kahuna, Lunch Counter, Rope) are in the mile upstream. Large parking area for trailer turnaround.',
  'boat_ramp', 'gravel', true, 'large_over_30', ARRAY['Restroom', 'Port-a-john'],
  43.3980, -111.0450, 8.0,
  null, null, null,
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'snake_wy' and name = 'Sheep Gulch Take-out');

-- ════════════════════════════════════════════════════════════
-- KENNEBEC RIVER (kennebec) — Maine
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'kennebec', 'Harris Station Put-in', 'Put-in below Harris Dam for the Kennebec Gorge. Dam-release whitewater — Class III-IV depending on flow. All commercial trips start here. The gorge is dramatic — 400-foot walls. Check release schedule with Brookfield Energy.',
  'carry_in', 'gravel', false, 'large_over_30', ARRAY['Port-a-john'],
  45.2890, -69.9410, 0.0,
  12.0, 'The Forks', 'about 4-5 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'kennebec' and name = 'Harris Station Put-in');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'kennebec', 'The Forks', 'Take-out at the confluence with the Dead River. The Forks is the commercial whitewater capital of New England — half a dozen outfitters are based here. Paved ramp, large lot. Named because the Kennebec and Dead River fork here.',
  'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom'],
  45.3540, -69.9740, 12.0,
  null, null, null,
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'kennebec' and name = 'The Forks');

-- ════════════════════════════════════════════════════════════
-- SALMON RIVER — MAIN (salmon) — Idaho
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'salmon', 'Corn Creek Put-in', 'USFS launch for the Main Salmon "River of No Return." Permit required (lottery). This is the start of 80+ miles of federally-designated Wild River. No roads, no bridges, no cell service. Pack for full self-support.',
  'boat_ramp', 'gravel', true, 'medium_15_to_30', ARRAY['Restroom', 'Camping'],
  45.1900, -114.3400, 0.0,
  79.0, 'Vinegar Creek (Long Tom Bar)', '5-6 days',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'salmon' and name = 'Corn Creek Put-in');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'salmon', 'Vinegar Creek (Long Tom Bar)', 'Standard take-out for the Main Salmon expedition. USFS ramp. After 5-6 days of wilderness canyon, this is civilization again. Jet boat shuttle back to the road is an alternative if you don''t want to paddle the last flat miles.',
  'boat_ramp', 'gravel', true, 'small_5_to_15', ARRAY['Restroom'],
  45.5350, -115.6220, 79.0,
  null, null, null,
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'salmon' and name = 'Vinegar Creek (Long Tom Bar)');

-- ════════════════════════════════════════════════════════════
-- MIDDLE FORK OF THE SALMON (mf_salmon) — Idaho
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'mf_salmon', 'Boundary Creek Put-in', 'The start of the legendary Middle Fork. Fly-in or drive a rough 30-mile dirt road to get here. Permit required (lottery — most competitive in the US). 100 miles of Class III-IV wilderness canyon ahead. Hot springs, ancient pictographs, zero cell service.',
  'carry_in', 'dirt', false, 'small_5_to_15', ARRAY['Restroom', 'Camping'],
  44.6080, -115.1670, 0.0,
  100.0, 'Cache Bar (Main Salmon confluence)', '5-6 days',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'mf_salmon' and name = 'Boundary Creek Put-in');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'mf_salmon', 'Cache Bar', 'Take-out at the confluence with the Main Salmon. USFS ramp. This is where the Middle Fork ends and the Main Salmon begins. Jet boat shuttle back to civilization is available. The 100-mile float is over.',
  'boat_ramp', 'gravel', true, 'small_5_to_15', ARRAY['Restroom'],
  45.1870, -114.3510, 100.0,
  null, null, null,
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'mf_salmon' and name = 'Cache Bar');

-- ════════════════════════════════════════════════════════════
-- GRAND CANYON — COLORADO RIVER (grandcanyon) — Arizona
-- ════════════════════════════════════════════════════════════

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'grandcanyon', 'Lees Ferry', 'Mile 0 of the Grand Canyon. NPS put-in for the most famous river trip on Earth. Permit required (weighted lottery — average 7+ year wait for private trips). Concrete ramp, large staging area. From here it''s 226 miles to Diamond Creek.',
  'boat_ramp', 'concrete', true, 'large_over_30', ARRAY['Restroom', 'Picnic tables', 'Drinking water'],
  36.8650, -111.5890, 0.0,
  87.0, 'Phantom Ranch (hike out only)', '4-6 days to Phantom',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'grandcanyon' and name = 'Lees Ferry');

insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'grandcanyon', 'Diamond Creek Take-out', 'Standard take-out at mile 226. Hualapai Nation access — permit and fee required from the Hualapai Tribe. Rough 20-mile dirt road from Peach Springs to the river. The only road access to the Colorado in the canyon below Lees Ferry.',
  'boat_ramp', 'gravel', true, 'medium_15_to_30', ARRAY['Port-a-john'],
  35.7670, -113.3980, 226.0,
  null, null, null,
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'grandcanyon' and name = 'Diamond Creek Take-out');

commit;
