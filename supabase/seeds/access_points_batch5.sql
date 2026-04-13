-- Access points batch 5 — 20 more iconic rivers, 80 access points.
--
-- Fills gaps on rivers that had no access data: Allagash, Allegheny,
-- Battenkill, Beaverkill, Big Hole, Clackamas, Glenwood Canyon,
-- Upper Colorado (Pumphouse), Cumberland, Deerfield, Eagle,
-- Eleven Point, Farmington, Feather, Frying Pan, Gunnison,
-- Henry's Fork, Hudson Gorge, Clark Fork, Kickapoo.
--
-- Descriptions and coordinates drafted from general knowledge of
-- these rivers — NOT field-verified. Inserted with status 'pending'
-- so they surface community corrections before going live as trusted
-- data. Promote to 'verified' only after a human confirms on the ground.
--
-- Idempotent. Run AFTER migration 032 is applied.

begin;

-- ═══ ALLAGASH WILDERNESS WATERWAY (allagash) — Maine ═══

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'allagash', 'Chamberlain Bridge', 'Southern gateway to the Allagash Wilderness Waterway. Gravel put-in at the bridge over Chamberlain Lake. Registration required at the ranger station. Start of the classic 92-mile canoe trip.', 'carry_in', 'gravel', false, 'medium_15_to_30', ARRAY['Restroom'], 46.2110, -69.2780, 0.0, 22.0, 'Churchill Dam', 'about 2 days (lake paddling)', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'allagash' and name = 'Chamberlain Bridge');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'allagash', 'Churchill Dam', 'Ranger station and put-in for the whitewater stretch below the dam. Chase Rapids begins right at the dam release — Class II-III for 5 miles. Ranger coordinates dam releases with paddlers each morning.', 'carry_in', 'gravel', false, 'small_5_to_15', ARRAY['Restroom', 'Camping'], 46.4460, -69.3680, 22.0, 21.0, 'Umsaskis Lake', 'about 1 day', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'allagash' and name = 'Churchill Dam');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'allagash', 'Michaud Farm', 'Ranger station near the end of the waterway. Historic farm site. Last official campsite before Allagash Falls portage. Register out here before the final paddle to the St. John.', 'carry_in', 'dirt', false, 'limited_under_5', ARRAY['Restroom', 'Camping'], 46.8640, -69.0540, 80.0, 12.0, 'Allagash Village', 'about 6 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'allagash' and name = 'Michaud Farm');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'allagash', 'Allagash Village', 'Take-out at the confluence with the St. John River. Small village, end of the waterway trip. Shuttle services operate from here back to Chamberlain. Cell service returns.', 'carry_in', 'gravel', false, 'small_5_to_15', '{}', 47.0820, -69.0450, 92.0, 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'allagash' and name = 'Allagash Village');

-- ═══ ALLEGHENY RIVER (allegheny) — Pennsylvania ═══

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'allegheny', 'Kinzua Dam Tailwater', 'Below Kinzua Dam. Paved ramp, Army Corps facility. Cold tailwater with excellent trout fishing. The Allegheny Wild & Scenic stretch begins here — 86 miles of undammed river downstream.', 'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom', 'Picnic tables'], 41.8390, -79.0020, 0.0, 18.0, 'Warren', 'about 6 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'allegheny' and name = 'Kinzua Dam Tailwater');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'allegheny', 'Warren', 'City of Warren launch. Paved ramp at Betts Park. Good for drift boats and jet boats. Smallmouth bass and muskie fishing. The Allegheny National Forest surrounds the river here.', 'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom', 'Picnic tables'], 41.8440, -79.1450, 18.0, 27.0, 'Tionesta', 'about 8 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'allegheny' and name = 'Warren');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'allegheny', 'Tionesta', 'Borough of Tionesta access at the confluence of Tionesta Creek. Concrete ramp. Wild & Scenic river corridor. The Allegheny Islands Wilderness lies just downstream — seven wilderness islands in the river.', 'boat_ramp', 'concrete', true, 'medium_15_to_30', ARRAY['Restroom'], 41.4950, -79.4520, 45.0, 25.0, 'Franklin', 'about 8 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'allegheny' and name = 'Tionesta');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'allegheny', 'Franklin', 'City of Franklin — confluence with French Creek. Paved ramp at the city park. Below here the Allegheny loses its Wild & Scenic status and becomes more industrial. Good muskie water.', 'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom', 'Picnic tables'], 41.3970, -79.8320, 70.0, 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'allegheny' and name = 'Franklin');

-- ═══ BATTENKILL (battenkill) — Vermont/New York ═══

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'battenkill', 'Manchester', 'Upper Battenkill access in Manchester, VT. Small gravel pull-off near the Orvis flagship store. Fly fishing only above here by local tradition. Wild brown trout water — tough but rewarding.', 'carry_in', 'gravel', false, 'limited_under_5', '{}', 43.1650, -73.0720, 1.0, 6.0, 'Arlington', 'about 3 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'battenkill' and name = 'Manchester');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'battenkill', 'Arlington', 'Town of Arlington access. Gravel ramp at the town park. Classic Norman Rockwell country — he painted many Battenkill scenes from here. Good wade fishing pools just upstream and down.', 'carry_in', 'gravel', false, 'small_5_to_15', ARRAY['Restroom'], 43.0750, -73.1540, 7.0, 10.0, 'Shushan', 'about 4 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'battenkill' and name = 'Arlington');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'battenkill', 'Shushan', 'NY side of the Battenkill. Gravel ramp near the covered bridge. The river widens and slows a bit here — good for canoes. Wild brown trout to 20+ inches holding in the undercut banks.', 'carry_in', 'gravel', false, 'small_5_to_15', '{}', 43.0890, -73.3460, 17.0, 5.0, 'Eagleville Covered Bridge', 'about 2 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'battenkill' and name = 'Shushan');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'battenkill', 'Eagleville Covered Bridge', 'Historic covered bridge access on the lower Battenkill. Small gravel pull-off. Below here the river joins the Hudson near Schuylerville. Scenic take-out for a full-day float.', 'carry_in', 'gravel', false, 'limited_under_5', '{}', 43.0760, -73.4270, 22.0, 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'battenkill' and name = 'Eagleville Covered Bridge');

-- ═══ BEAVERKILL (beaverkill) — New York ═══

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'beaverkill', 'Roscoe (Junction Pool)', 'Roscoe — "Trout Town USA." Junction Pool is the confluence of the Beaverkill and Willowemoc — the birthplace of American fly fishing. Opening day (April 1) is a pilgrimage. Small public access behind the tackle shops.', 'carry_in', 'gravel', false, 'small_5_to_15', '{}', 41.9270, -74.9180, 1.0, 5.0, 'Horton', 'about 2 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'beaverkill' and name = 'Roscoe (Junction Pool)');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'beaverkill', 'Beaverkill Campground', 'NY DEC campground with classic covered bridge. Gravel access to the river. No-kill fly-fishing-only water above the bridge. Historic Catskills trout water with generations of angling tradition.', 'carry_in', 'gravel', false, 'medium_15_to_30', ARRAY['Restroom', 'Camping'], 41.9620, -74.7340, 6.0, 4.0, 'Horton', 'about 2 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'beaverkill' and name = 'Beaverkill Campground');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'beaverkill', 'Horton', 'Mid-river public fishing access. Gravel pull-off on Old Route 17. Classic wade fishing water. Hendrickson and March Brown hatches are legendary here in May.', 'carry_in', 'gravel', false, 'limited_under_5', '{}', 41.9330, -74.8280, 10.0, 4.0, 'Cooks Falls', 'about 1.5 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'beaverkill' and name = 'Horton');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'beaverkill', 'Cooks Falls', 'Lower Beaverkill public access. Gravel pull-off. Catch-and-release water. The river deepens and slows toward the East Branch of the Delaware confluence downstream at Peakville.', 'carry_in', 'gravel', false, 'small_5_to_15', '{}', 41.9480, -74.9650, 14.0, 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'beaverkill' and name = 'Cooks Falls');

-- ═══ BIG HOLE RIVER (big_hole) — Montana ═══

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'big_hole', 'Wise River', 'Classic upper Big Hole put-in at the town of Wise River. Gravel ramp. Home water of the Arctic grayling — the last native population in the Lower 48. Catch-and-release for grayling.', 'boat_ramp', 'gravel', true, 'medium_15_to_30', ARRAY['Restroom'], 45.7870, -112.8560, 1.0, 11.0, 'Divide', 'about 4-5 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'big_hole' and name = 'Wise River');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'big_hole', 'Divide', 'FWP access at Divide. Paved ramp, trailer parking. Popular drift boat launch. The Big Hole winds through a steep canyon below here — good brown and rainbow trout water.', 'boat_ramp', 'paved', true, 'medium_15_to_30', ARRAY['Restroom'], 45.7410, -112.7520, 12.0, 9.0, 'Maidenrock', 'about 3-4 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'big_hole' and name = 'Divide');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'big_hole', 'Maidenrock', 'FWP fishing access site. Gravel ramp in a scenic canyon section. Salmonfly hatch in late June draws anglers from across the West. Big browns on big bugs.', 'boat_ramp', 'gravel', true, 'small_5_to_15', ARRAY['Restroom'], 45.6810, -112.6320, 21.0, 8.0, 'Melrose', 'about 3 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'big_hole' and name = 'Maidenrock');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'big_hole', 'Melrose', 'FWP access near the town of Melrose. Gravel ramp. The Big Hole flows into the Jefferson below Twin Bridges. Lower canyon has the biggest fish but also the most boat traffic during hatches.', 'boat_ramp', 'gravel', true, 'medium_15_to_30', ARRAY['Restroom'], 45.6350, -112.6780, 29.0, 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'big_hole' and name = 'Melrose');

-- ═══ CLACKAMAS RIVER (clackamas) — Oregon ═══

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'clackamas', 'Milo McIver State Park', 'State park with paved ramp. Upper Clackamas put-in. Salmon and steelhead fishing, plus summer rafting. The Clackamas is Portland''s backyard whitewater river.', 'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom', 'Camping', 'Picnic tables', 'Drinking water'], 45.3080, -122.3620, 1.0, 6.0, 'Barton Park', 'about 2-3 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'clackamas' and name = 'Milo McIver State Park');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'clackamas', 'Barton Park', 'Clackamas County park with concrete ramp. Busy summer tubing and rafting launch. Class II rapids through the next section. Shuttle service available in summer.', 'boat_ramp', 'concrete', true, 'large_over_30', ARRAY['Restroom', 'Camping', 'Picnic tables'], 45.3850, -122.4720, 7.0, 5.0, 'Carver Park', 'about 2 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'clackamas' and name = 'Barton Park');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'clackamas', 'Carver Park', 'Clackamas County park, paved ramp. Popular mid-river take-out for the Barton to Carver float. The river flattens below here into the urban stretch through Gladstone.', 'boat_ramp', 'paved', true, 'medium_15_to_30', ARRAY['Restroom', 'Picnic tables'], 45.3990, -122.5010, 12.0, 4.0, 'Riverside Park (Oregon City)', 'about 1.5 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'clackamas' and name = 'Carver Park');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'clackamas', 'Riverside Park (Oregon City)', 'Oregon City park near the Willamette confluence. Paved ramp. End of the Clackamas paddle. Upstream of the falls where spring chinook and steelhead stage before running the ladder.', 'boat_ramp', 'paved', true, 'medium_15_to_30', ARRAY['Restroom', 'Picnic tables'], 45.3650, -122.5950, 16.0, 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'clackamas' and name = 'Riverside Park (Oregon City)');

-- ═══ COLORADO — GLENWOOD CANYON (colorado_glenwood) — Colorado ═══

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'colorado_glenwood', 'Grizzly Creek', 'I-70 rest area put-in in Glenwood Canyon. Paved ramp. Start of the Class III Shoshone run — the most popular whitewater stretch on the Colorado. Busy commercial rafting launch.', 'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom'], 39.5580, -107.2640, 0.0, 3.0, 'Shoshone', 'about 1 hour', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'colorado_glenwood' and name = 'Grizzly Creek');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'colorado_glenwood', 'Shoshone', 'I-70 rest area at the Shoshone Dam. Paved access. Standard put-in for commercial rafting through Glenwood Canyon. Class III "Superstition," "Tombstone," and "Maneater" rapids just downstream.', 'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom'], 39.5760, -107.2270, 3.0, 5.0, 'Grizzly Creek', 'about 45 minutes (lap run)', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'colorado_glenwood' and name = 'Shoshone');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'colorado_glenwood', 'No Name', 'I-70 exit 119 access. Gravel ramp. Popular take-out for the Shoshone run. Parking fills early on summer weekends. Colorado Department of Transportation facility.', 'boat_ramp', 'gravel', true, 'medium_15_to_30', ARRAY['Restroom'], 39.5500, -107.2930, 7.0, 2.0, 'Two Rivers Park', 'about 30 minutes', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'colorado_glenwood' and name = 'No Name');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'colorado_glenwood', 'Two Rivers Park', 'Glenwood Springs city park at the Roaring Fork confluence. Paved ramp, large lot. Standard take-out for the full Glenwood Canyon run. Hot springs and lodging 5 minutes away downtown.', 'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom', 'Picnic tables', 'Drinking water'], 39.5440, -107.3290, 9.0, 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'colorado_glenwood' and name = 'Two Rivers Park');

-- ═══ COLORADO — PUMPHOUSE (colorado_pumphouse) — Colorado ═══

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'colorado_pumphouse', 'Pumphouse', 'BLM Pumphouse Recreation Site. Paved ramp, fee site ($10). The classic upper Colorado put-in. Class II-III canyon downstream. Overnight camping permits via BLM.', 'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom', 'Camping'], 39.9800, -106.5350, 0.0, 5.0, 'Radium', 'about 2 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'colorado_pumphouse' and name = 'Pumphouse');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'colorado_pumphouse', 'Radium', 'BLM Radium Recreation Site. Gravel ramp. Hot springs on the opposite bank — paddle across and soak. Class II Yarmony Rapid just upstream. Fee site with primitive camping.', 'boat_ramp', 'gravel', true, 'medium_15_to_30', ARRAY['Restroom', 'Camping'], 39.9530, -106.5840, 5.0, 7.0, 'Rancho Del Rio', 'about 3 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'colorado_pumphouse' and name = 'Radium');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'colorado_pumphouse', 'Rancho Del Rio', 'Private access with paved ramp (fee). Store, tubing rentals, shuttle service. The most developed access on this stretch. Busy commercial raft traffic in summer.', 'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom', 'Camping'], 39.9280, -106.6410, 12.0, 5.0, 'State Bridge', 'about 2 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'colorado_pumphouse' and name = 'Rancho Del Rio');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'colorado_pumphouse', 'State Bridge', 'Historic State Bridge — lodge and music venue on the river. Gravel ramp, fee access. Take-out for the Pumphouse to State Bridge float. Below here the river enters Little Gore Canyon.', 'boat_ramp', 'gravel', true, 'medium_15_to_30', ARRAY['Restroom'], 39.9040, -106.7000, 17.0, 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'colorado_pumphouse' and name = 'State Bridge');

-- ═══ CUMBERLAND RIVER (cumberland) — Kentucky/Tennessee ═══

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'cumberland', 'Cumberland Falls State Park', 'The "Niagara of the South" — 125 ft wide, 68 ft drop. State park with paved ramp above the falls and access below. The only place in the Western Hemisphere with regular moonbows. Class V below the falls — experts only.', 'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom', 'Camping', 'Picnic tables', 'Drinking water'], 36.8390, -84.3450, 0.0, 15.0, 'Williamsburg', 'about 5-6 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'cumberland' and name = 'Cumberland Falls State Park');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'cumberland', 'Williamsburg', 'Kentucky Highway 92 access in Williamsburg. Paved ramp. Popular drift boat access for smallmouth and muskie fishing. The Cumberland is wide and gentle through here.', 'boat_ramp', 'paved', true, 'medium_15_to_30', ARRAY['Restroom'], 36.7440, -84.1550, 15.0, 20.0, 'Laurel River confluence', 'about 7 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'cumberland' and name = 'Williamsburg');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'cumberland', 'Wolf Creek Dam Tailwater', 'Below Wolf Creek Dam on Lake Cumberland. Army Corps access, paved ramp. World-class trout tailwater — state-record brown trout came from here. Cold, clear water year-round. Drift boats and wade fishing.', 'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom', 'Picnic tables'], 36.8700, -85.1450, 460.0, 10.0, 'Winfrey''s Ferry', 'about 4 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'cumberland' and name = 'Wolf Creek Dam Tailwater');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'cumberland', 'Winfrey''s Ferry', 'KDFWR access site on the Cumberland tailwater. Gravel ramp. Excellent trout fishing, especially during generation with sufficient flow. Local guides run drift boats out of here.', 'boat_ramp', 'gravel', true, 'medium_15_to_30', ARRAY['Restroom'], 36.8100, -85.2780, 470.0, 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'cumberland' and name = 'Winfrey''s Ferry');

-- ═══ DEERFIELD RIVER (deerfield) — Massachusetts ═══

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'deerfield', 'Fife Brook Dam', 'Dam release put-in for the most popular rafting run in New England. Scheduled whitewater releases April-October. Class II-III through Zoar Gap. Commercial outfitters run daily trips.', 'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom'], 42.6390, -72.9420, 0.0, 5.0, 'Zoar Gap', 'about 2 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'deerfield' and name = 'Fife Brook Dam');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'deerfield', 'Zoar Gap', 'The signature Class III rapid. Roadside gravel access for surfing and play boating. Popular take-out for the Fife Brook run. Watch for commercial rafts on summer weekends.', 'carry_in', 'gravel', false, 'small_5_to_15', '{}', 42.6170, -72.9050, 5.0, 6.0, 'Charlemont', 'about 2 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'deerfield' and name = 'Zoar Gap');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'deerfield', 'Charlemont', 'Town of Charlemont access. Paved pull-off on Route 2. Standard take-out for the Fife Brook to Charlemont float. Tubing and family paddling below here. Catch-and-release trout water upstream.', 'carry_in', 'gravel', false, 'medium_15_to_30', ARRAY['Restroom'], 42.6290, -72.8680, 11.0, 8.0, 'Shelburne Falls', 'about 3 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'deerfield' and name = 'Charlemont');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'deerfield', 'Shelburne Falls', 'Historic village with the Bridge of Flowers. Public access near the falls. The Deerfield slows through the village and widens toward the Connecticut River confluence at Greenfield.', 'carry_in', 'paved', false, 'medium_15_to_30', ARRAY['Restroom', 'Picnic tables'], 42.6050, -72.7390, 19.0, 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'deerfield' and name = 'Shelburne Falls');

-- ═══ EAGLE RIVER (eagle) — Colorado ═══

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'eagle', 'Edwards', 'Edwards town put-in. Paved ramp at Edwards Access. Upper Eagle is narrow and fast — Class II-III during runoff in late May/June. Small window for rafting season.', 'boat_ramp', 'paved', true, 'medium_15_to_30', ARRAY['Restroom'], 39.6400, -106.5920, 1.0, 8.0, 'Wolcott', 'about 2-3 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'eagle' and name = 'Edwards');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'eagle', 'Wolcott', 'Eagle County access at Wolcott. Gravel ramp. Good mid-river access. The Eagle runs alongside I-70 here — commercial rafting splits the canyon section into upper and lower runs.', 'boat_ramp', 'gravel', true, 'small_5_to_15', '{}', 39.7030, -106.6690, 9.0, 7.0, 'Eagle', 'about 2-3 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'eagle' and name = 'Wolcott');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'eagle', 'Eagle Town Park', 'Town of Eagle park. Paved ramp. Good standard take-out for the upper and middle Eagle floats. Whitewater park just upstream with play features.', 'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom', 'Picnic tables'], 39.6560, -106.8290, 16.0, 8.0, 'Gypsum', 'about 2-3 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'eagle' and name = 'Eagle Town Park');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'eagle', 'Gypsum', 'Gypsum town access near the confluence with the Colorado. Paved ramp. Below here the Eagle joins the Colorado at Dotsero — start of the Glenwood Canyon stretch.', 'boat_ramp', 'paved', true, 'medium_15_to_30', ARRAY['Restroom'], 39.6490, -106.9530, 24.0, 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'eagle' and name = 'Gypsum');

-- ═══ ELEVEN POINT RIVER (eleven_point) — Missouri ═══

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'eleven_point', 'Greer Crossing', 'USFS put-in on Greer Spring — the second largest spring in Missouri. Paved ramp. Start of the Wild & Scenic stretch. Cold spring water keeps the Eleven Point cool year-round. Rainbow trout below here.', 'boat_ramp', 'paved', true, 'medium_15_to_30', ARRAY['Restroom', 'Camping'], 36.7780, -91.3410, 0.0, 8.0, 'Turner''s Mill', 'about 3-4 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'eleven_point' and name = 'Greer Crossing');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'eleven_point', 'Turner''s Mill', 'USFS access at the historic Turner''s Mill ruins. Gravel ramp. Primitive camping. The Wild & Scenic corridor limits development — feels remote despite being only a few miles from roads.', 'carry_in', 'gravel', false, 'small_5_to_15', ARRAY['Camping'], 36.7180, -91.2690, 8.0, 11.0, 'Riverton', 'about 4-5 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'eleven_point' and name = 'Turner''s Mill');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'eleven_point', 'Riverton', 'MDC access at Riverton. Gravel ramp. Popular day-trip take-out. Smallmouth bass fishing picks up below here as the river warms.', 'boat_ramp', 'gravel', true, 'medium_15_to_30', ARRAY['Restroom'], 36.6320, -91.1950, 19.0, 9.0, 'Highway 142', 'about 3-4 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'eleven_point' and name = 'Riverton');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'eleven_point', 'Highway 142 Bridge', 'End of the Wild & Scenic section. Gravel ramp. Below here the Eleven Point enters the Arkansas state line and eventually joins the Spring River.', 'boat_ramp', 'gravel', true, 'small_5_to_15', '{}', 36.5640, -91.1650, 28.0, 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'eleven_point' and name = 'Highway 142 Bridge');

-- ═══ FARMINGTON RIVER (farmington) — Connecticut ═══

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'farmington', 'Riverton', 'Historic Riverton — home of the Hitchcock chair. Gravel access on the Wild & Scenic upper Farmington. Cold tailwater from the Goodwin Dam. Trout Management Area — fly fishing only, catch and release.', 'carry_in', 'gravel', false, 'small_5_to_15', '{}', 41.9580, -73.0100, 0.0, 5.0, 'People''s State Forest', 'about 2 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'farmington' and name = 'Riverton');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'farmington', 'People''s State Forest', 'State forest access with multiple pull-offs along East River Road. Classic Farmington trout water — Hendrickson, Sulphur, and Isonychia hatches. Drift boats and wade anglers.', 'carry_in', 'gravel', false, 'medium_15_to_30', ARRAY['Restroom'], 41.9200, -72.9880, 5.0, 6.0, 'Satan''s Kingdom', 'about 2-3 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'farmington' and name = 'People''s State Forest');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'farmington', 'Satan''s Kingdom', 'State recreation area with paved ramp. Popular tubing and rafting put-in. Class II through Satan''s Kingdom Gorge — New Britain''s summertime urban whitewater. Gets crowded on weekends.', 'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom', 'Picnic tables'], 41.8570, -72.8810, 12.0, 7.0, 'Collinsville', 'about 2-3 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'farmington' and name = 'Satan''s Kingdom');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'farmington', 'Collinsville', 'Village of Collinsville — former Collins Axe Company town. Paved access near the old factory. Lower Farmington is gentler Class I-II. Bike trail parallels the river.', 'carry_in', 'paved', false, 'medium_15_to_30', ARRAY['Restroom'], 41.8190, -72.9210, 19.0, 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'farmington' and name = 'Collinsville');

-- ═══ FEATHER RIVER (feather) — California ═══

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'feather', 'Oroville Wildlife Area', 'Below Lake Oroville on the Feather. Paved ramp, CDFW wildlife area. World-class salmon and steelhead fishery — Feather River Hatchery is Central Valley''s biggest. Fall Chinook run is massive.', 'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom'], 39.5120, -121.5470, 0.0, 15.0, 'Gridley', 'about 5 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'feather' and name = 'Oroville Wildlife Area');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'feather', 'Gridley', 'CDFW access near the town of Gridley. Gravel ramp. Striper fishing in spring, salmon in fall. The Feather is wide and slow through the Sacramento Valley ag country.', 'boat_ramp', 'gravel', true, 'medium_15_to_30', ARRAY['Restroom'], 39.3630, -121.6980, 15.0, 12.0, 'Live Oak', 'about 4 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'feather' and name = 'Gridley');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'feather', 'Live Oak', 'Sutter County park, paved ramp. Popular bass and catfish access. Striper fishing in spring when the fish run up from the Delta. Jet boats common here.', 'boat_ramp', 'paved', true, 'medium_15_to_30', ARRAY['Restroom', 'Picnic tables'], 39.2750, -121.6700, 27.0, 10.0, 'Yuba City', 'about 3 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'feather' and name = 'Live Oak');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'feather', 'Yuba City', 'Sutter County river access at the Yuba confluence. Paved ramp. Below here the Feather joins the Sacramento near Verona. Urban fishing access, easy for trailers.', 'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom', 'Picnic tables'], 39.1400, -121.6170, 37.0, 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'feather' and name = 'Yuba City');

-- ═══ FRYING PAN RIVER (frying_pan) — Colorado ═══

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'frying_pan', 'Ruedi Dam Tailwater', 'Below Ruedi Reservoir. Gravel pull-off. The toilet bowl — a deep hole below the dam where massive rainbows feed on mysis shrimp flushed through the outflow. State record browns caught here.', 'carry_in', 'gravel', false, 'small_5_to_15', '{}', 39.3720, -106.8420, 0.0, 4.0, 'Seven Castles', 'about 2 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'frying_pan' and name = 'Ruedi Dam Tailwater');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'frying_pan', 'Seven Castles', 'Roadside pull-off below the namesake rock formations. Gravel parking for 4-5 cars. Classic wade fishing pools. Green Drake hatch in July is the Pan''s best event.', 'carry_in', 'gravel', false, 'limited_under_5', '{}', 39.3530, -106.8880, 4.0, 5.0, 'Baetis Bridge', 'about 2-3 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'frying_pan' and name = 'Seven Castles');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'frying_pan', 'Baetis Bridge', 'Local-name access below Seven Castles. Gravel pull-off. Classic Gold Medal water — big rainbows, pressured but plentiful. BWO hatches reliable in fall.', 'carry_in', 'gravel', false, 'limited_under_5', '{}', 39.3370, -106.9280, 9.0, 5.0, 'Basalt', 'about 2 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'frying_pan' and name = 'Baetis Bridge');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'frying_pan', 'Basalt', 'Town of Basalt at the Roaring Fork confluence. Paved access at the town park. End of the Frying Pan — below here is the Roaring Fork. Fly shops and lodging downtown.', 'carry_in', 'paved', false, 'large_over_30', ARRAY['Restroom', 'Picnic tables', 'Drinking water'], 39.3680, -107.0310, 14.0, 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'frying_pan' and name = 'Basalt');

-- ═══ GUNNISON RIVER (gunnison_main) — Colorado ═══

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'gunnison_main', 'East Portal', 'Bottom of Black Canyon of the Gunnison NP. Extremely steep access road — 16% grade. Paved ramp at the base of the canyon. Only vehicle access to the river within the park. Trophy trout water.', 'carry_in', 'paved', false, 'small_5_to_15', ARRAY['Restroom', 'Camping'], 38.5590, -107.6630, 0.0, 14.0, 'Chukar', 'about 5-6 hours (multi-day wilderness trip)', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'gunnison_main' and name = 'East Portal');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'gunnison_main', 'Chukar Trail', 'BLM pack-in access to the Gunnison Gorge. 1-mile steep trail with llama packers available. Gold Medal trout water in a deep canyon. Multi-day float trips start here.', 'carry_in', 'dirt', false, 'small_5_to_15', '{}', 38.6530, -107.8120, 14.0, 13.0, 'Pleasure Park', 'about 1-2 days', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'gunnison_main' and name = 'Chukar Trail');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'gunnison_main', 'Pleasure Park', 'Private takeout with road access at the North Fork confluence. Paved ramp, fee. Standard end of the Gunnison Gorge multi-day float. Store, shuttles, camping.', 'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom', 'Camping'], 38.7840, -107.8370, 27.0, 15.0, 'Delta', 'about 5 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'gunnison_main' and name = 'Pleasure Park');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'gunnison_main', 'Delta Confluence Park', 'City park at the Gunnison-Uncompahgre confluence in Delta. Paved ramp. Lower Gunnison is slow, muddy, and carp-filled but accessible. Most paddlers take out upstream at Pleasure Park.', 'boat_ramp', 'paved', true, 'medium_15_to_30', ARRAY['Restroom', 'Picnic tables'], 38.7450, -108.0680, 42.0, 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'gunnison_main' and name = 'Delta Confluence Park');

-- ═══ HENRY'S FORK (henrys_fork) — Idaho ═══

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'henrys_fork', 'Last Chance', 'The Railroad Ranch section. Possibly the most famous dry-fly water in America. Gravel pull-offs along Highway 20 in Harriman State Park. Flat, spring-fed water — technical wade fishing only.', 'carry_in', 'gravel', false, 'large_over_30', ARRAY['Restroom'], 44.4280, -111.3640, 0.0, 5.0, 'Pinehaven', 'about 2-3 hours (wade pace)', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'henrys_fork' and name = 'Last Chance');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'henrys_fork', 'Pinehaven', 'Access below the Ranch. Gravel pull-off. Classic Green Drake and Brown Drake water in June. The spring creek character continues downstream — glassy water, picky rainbows.', 'carry_in', 'gravel', false, 'small_5_to_15', '{}', 44.4000, -111.3300, 5.0, 10.0, 'Warm River', 'about 4 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'henrys_fork' and name = 'Pinehaven');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'henrys_fork', 'Warm River', 'USFS campground and access where Warm River enters. Paved ramp. The character changes below here — faster, cobble bottom, more rainbows than the upper spring-creek reach.', 'boat_ramp', 'paved', true, 'medium_15_to_30', ARRAY['Restroom', 'Camping'], 44.1410, -111.3100, 15.0, 8.0, 'Ashton Dam Tailwater', 'about 3 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'henrys_fork' and name = 'Warm River');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'henrys_fork', 'Ashton Dam Tailwater', 'Below Ashton Dam. Paved ramp. Cold tailwater, big browns. Popular drift boat float from Ashton to St. Anthony. Canyon section has Class II rapids — watch for Lower Mesa Falls upstream (portage).', 'boat_ramp', 'paved', true, 'medium_15_to_30', ARRAY['Restroom'], 44.0710, -111.4500, 23.0, 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'henrys_fork' and name = 'Ashton Dam Tailwater');

-- ═══ HUDSON GORGE (hudson_gorge) — New York ═══

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'hudson_gorge', 'Indian River Put-in', 'Upper Hudson Gorge commercial rafting put-in. Gravel access at the Indian River confluence. Adirondack wilderness. Dam releases from Lake Abanakee drive the spring and fall rafting seasons. Class III-IV.', 'carry_in', 'gravel', false, 'medium_15_to_30', '{}', 43.8780, -74.1260, 0.0, 17.0, 'North Creek', 'about 5-6 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'hudson_gorge' and name = 'Indian River Put-in');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'hudson_gorge', 'North Creek', 'Town of North Creek — traditional take-out for the Hudson Gorge commercial run. Paved ramp. End of the whitewater section. Commercial outfitters shuttle from here. Restaurants and lodging in town.', 'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom', 'Picnic tables'], 43.7040, -73.9780, 17.0, 5.0, 'Riparius', 'about 2 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'hudson_gorge' and name = 'North Creek');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'hudson_gorge', 'Riparius', 'Small Adirondack hamlet. Gravel access at the bridge. Below here the Hudson is mellow Class I-II, good for family canoeing. Steel bridge is a classic landmark.', 'carry_in', 'gravel', false, 'small_5_to_15', '{}', 43.6770, -73.9330, 22.0, 6.0, 'The Glen', 'about 2 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'hudson_gorge' and name = 'Riparius');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'hudson_gorge', 'The Glen', 'Community of The Glen. Gravel ramp at the Route 28 bridge. Below here the Hudson slows further and widens toward Warrensburg. Popular tubing stretch in summer.', 'carry_in', 'gravel', false, 'small_5_to_15', '{}', 43.6320, -73.8820, 28.0, 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'hudson_gorge' and name = 'The Glen');

-- ═══ CLARK FORK (clark_fork) — Montana ═══

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'clark_fork', 'Alberton Gorge (Cyr)', 'FWP access at the top of Alberton Gorge. Paved ramp. The Gorge is Montana''s most popular commercial whitewater — Class II-III for 10 miles. Fang Rapid and Tumbleweed are the big ones.', 'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom'], 47.0080, -114.4970, 0.0, 10.0, 'Tarkio', 'about 3-4 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'clark_fork' and name = 'Alberton Gorge (Cyr)');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'clark_fork', 'Tarkio', 'FWP access at the bottom of Alberton Gorge. Gravel ramp. Standard take-out for the commercial rafting run. Watch for the Class IV Boateater Rapid just upstream at low water.', 'boat_ramp', 'gravel', true, 'medium_15_to_30', ARRAY['Restroom'], 46.9800, -114.6820, 10.0, 12.0, 'Petty Creek', 'about 4 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'clark_fork' and name = 'Tarkio');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'clark_fork', 'Petty Creek', 'FWP access. Gravel ramp. Good trout fishing below the gorge — big browns and rainbows. Less crowded than the Missoula stretch upstream.', 'boat_ramp', 'gravel', true, 'medium_15_to_30', ARRAY['Restroom'], 46.9920, -114.3770, 22.0, 18.0, 'St. Regis', 'about 6 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'clark_fork' and name = 'Petty Creek');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'clark_fork', 'St. Regis', 'FWP access at the St. Regis River confluence. Paved ramp. The Clark Fork continues northwest toward Idaho from here, broadening into big water. Good northern pike in backwaters.', 'boat_ramp', 'paved', true, 'medium_15_to_30', ARRAY['Restroom'], 47.3020, -115.0970, 40.0, 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'clark_fork' and name = 'St. Regis');

-- ═══ KICKAPOO RIVER (kickapoo) — Wisconsin ═══

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'kickapoo', 'Ontario', 'Village of Ontario — "Canoe Capital of the Kickapoo." Put-in at the Wildcat Mountain SP access. Wisconsin''s crookedest river — 120 miles of river to cover 65 miles crow-flies. Sandstone cliffs.', 'carry_in', 'gravel', false, 'medium_15_to_30', ARRAY['Restroom', 'Camping'], 43.7200, -90.5930, 0.0, 8.0, 'Rockton', 'about 3-4 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'kickapoo' and name = 'Ontario');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'kickapoo', 'Rockton', 'Township access. Gravel ramp. Classic Driftless Area scenery — no glaciers carved this valley. Spring-fed tributaries support wild brown trout. The Kickapoo winds through farm country.', 'carry_in', 'gravel', false, 'small_5_to_15', '{}', 43.6200, -90.6290, 8.0, 10.0, 'La Farge', 'about 4 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'kickapoo' and name = 'Rockton');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'kickapoo', 'La Farge', 'Kickapoo Valley Reserve trailhead — 8,600 acres of former dam project land now managed for recreation. Paved ramp, Reserve visitor center nearby. Prime smallmouth water.', 'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom', 'Picnic tables', 'Drinking water'], 43.5720, -90.6400, 18.0, 12.0, 'Viola', 'about 4-5 hours', 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'kickapoo' and name = 'La Farge');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'kickapoo', 'Viola', 'Village of Viola access. Gravel ramp at the town park. The Kickapoo widens and slows through here. Good summer tubing. Below here the river joins the Wisconsin at Wauzeka.', 'carry_in', 'gravel', false, 'small_5_to_15', ARRAY['Restroom'], 43.5060, -90.6760, 30.0, 'RiverScout', false, 'pending', null, null
where not exists (select 1 from public.river_access_points where river_id = 'kickapoo' and name = 'Viola');

commit;
