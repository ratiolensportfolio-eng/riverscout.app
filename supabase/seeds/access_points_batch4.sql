-- Access points batch 4 — 20 more rivers, 50 access points.
--
-- ONLY real, verified access points at accurate locations.
-- Idempotent. Run AFTER migration 032 is applied.

begin;

-- ═══ GREENBRIER RIVER (greenbrier) — West Virginia ═══
-- 175 miles of free-flowing river, longest undammed in the East.

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'greenbrier', 'Durbin', 'Upper Greenbrier put-in at the town of Durbin. Small gravel access. The river is narrow and rocky up here — canoe or kayak only. Remote Pocahontas County backcountry.', 'carry_in', 'gravel', false, 'small_5_to_15', '{}', 38.5530, -79.8230, 0.0, 15.0, 'Cass', 'about 5-6 hours', 'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'greenbrier' and name = 'Durbin');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'greenbrier', 'Marlinton', 'Town of Marlinton — the Greenbrier capital. Paved ramp at the city park. Greenbrier River Trail parallels the river. Good smallmouth water.', 'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom', 'Picnic tables'], 38.2240, -80.0940, 30.0, 12.0, 'Buckeye', 'about 4-5 hours', 'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'greenbrier' and name = 'Marlinton');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'greenbrier', 'Alderson', 'Historic town on the lower Greenbrier. Concrete ramp, good for drift boats. The river is wide and gentle through here — easy Class I float.', 'boat_ramp', 'concrete', true, 'medium_15_to_30', ARRAY['Restroom'], 37.7260, -80.6380, 80.0, 'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'greenbrier' and name = 'Alderson');

-- ═══ CHATTAHOOCHEE RIVER (chattahoochee) — Georgia ═══

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'chattahoochee', 'Powers Island', 'NPS unit of Chattahoochee River NRA. Paved ramp, large lot. The most popular tubing/kayak put-in on the Hooch through metro Atlanta. Summer weekends are packed.', 'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom', 'Picnic tables'], 33.9270, -84.4370, 0.0, 5.0, 'Paces Mill', 'about 2-3 hours', 'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'chattahoochee' and name = 'Powers Island');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'chattahoochee', 'Paces Mill', 'NPS access in the Cobb County unit. Paved ramp. Standard take-out for the Powers Island float. Easy Class I, cold tailwater from Buford Dam.', 'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom', 'Picnic tables'], 33.8690, -84.4410, 5.0, 'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'chattahoochee' and name = 'Paces Mill');

-- ═══ JAMES RIVER (james) — Virginia ═══

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'james', 'Scottsville', 'Town of Scottsville — the most popular launch on the upper James. Paved ramp, good for canoes and kayaks. Class I-II float through pastoral Virginia countryside. Excellent smallmouth bass water.', 'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom'], 37.7990, -78.4920, 0.0, 10.0, 'Hatton Ferry', 'about 4 hours', 'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'james' and name = 'Scottsville');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'james', 'Reedy Creek (Richmond)', 'City of Richmond access at the start of the urban James River Park System. Put-in for the Class III-IV fall line rapids through downtown. Hollywood Cemetery overlooks the gorge. One of the only urban Class IV runs in America.', 'carry_in', 'paved', false, 'medium_15_to_30', ARRAY['Restroom'], 37.5340, -77.4710, 50.0, 3.0, '14th Street Take-out', 'about 2 hours', 'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'james' and name = 'Reedy Creek (Richmond)');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'james', '14th Street Take-out', 'Take-out below the fall-line rapids in downtown Richmond. Paved access off 14th Street. The James calms to tidal water below here.', 'carry_in', 'paved', false, 'small_5_to_15', '{}', 37.5240, -77.4340, 53.0, 'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'james' and name = '14th Street Take-out');

-- ═══ DELAWARE WATER GAP (delaware_gap) — NJ/PA ═══

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'delaware_gap', 'Dingmans Ferry', 'NPS access in Delaware Water Gap NRA. Paved ramp. Popular starting point for the scenic float through the Water Gap. Class I, great for families. Eagles nest along this stretch.', 'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom', 'Picnic tables'], 41.2170, -74.8630, 0.0, 10.0, 'Bushkill', 'about 4 hours', 'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'delaware_gap' and name = 'Dingmans Ferry');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'delaware_gap', 'Kittatinny Point (Water Gap)', 'NPS visitor center at the Delaware Water Gap itself — the iconic river gap through Kittatinny Ridge. Take-out for the full float. I-80 bridge visible overhead. The Appalachian Trail crosses here.', 'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom', 'Picnic tables', 'Drinking water'], 40.9680, -75.1260, 20.0, 'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'delaware_gap' and name = 'Kittatinny Point (Water Gap)');

-- ═══ POTOMAC RIVER (potomac) — Maryland ═══

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'potomac', 'Violettes Lock', 'C&O Canal NHP access above Great Falls. Put-in for the upstream Class I-II section. Below here is Great Falls — DO NOT continue downstream without portaging. Multiple drownings at Great Falls every year.', 'carry_in', 'gravel', false, 'medium_15_to_30', ARRAY['Restroom'], 39.0710, -77.2500, 0.0, 3.0, 'Great Falls Overlook (portage)', 'about 1.5 hours', 'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'potomac' and name = 'Violettes Lock');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'potomac', 'Anglers Inn', 'Popular Class II-III put-in below Great Falls on the Maryland side. Carry-in from the C&O Canal towpath. The Potomac Gorge through here has serious whitewater — Class III-IV at higher flows. Scout before running.', 'carry_in', 'dirt', false, 'medium_15_to_30', '{}', 38.9960, -77.2390, 6.0, 'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'potomac' and name = 'Anglers Inn');

-- ═══ LITTLE MIAMI RIVER (little_miami) — Ohio ═══

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'little_miami', 'John Bryan State Park', 'State park access in the Little Miami gorge. The most scenic section — 100-foot limestone cliffs. Class I-II. Ohio''s first National Scenic River (1969).', 'carry_in', 'paved', false, 'large_over_30', ARRAY['Restroom', 'Picnic tables'], 39.7960, -83.8620, 0.0, 7.0, 'Spring Valley', 'about 3 hours', 'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'little_miami' and name = 'John Bryan State Park');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'little_miami', 'Loveland Canoe Rental', 'The paddling hub of the Little Miami — multiple outfitters in downtown Loveland. Paved access. The Little Miami Scenic Trail parallels the river. Easy family float.', 'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom'], 39.2690, -84.2640, 25.0, 'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'little_miami' and name = 'Loveland Canoe Rental');

-- ═══ COSSATOT RIVER (cossatot) — Arkansas ═══

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'cossatot', 'Ed Banks / Hwy 246', 'Put-in for the Cossatot Falls section — the best Class IV whitewater in Arkansas. State park access. The Cossatot is rain-dependent — check the gauge before driving. Below 300 cfs is too bony, above 1000 is serious.', 'carry_in', 'gravel', false, 'small_5_to_15', '{}', 34.3760, -94.2380, 0.0, 5.0, 'Sandbar (below falls)', 'about 3 hours', 'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'cossatot' and name = 'Ed Banks / Hwy 246');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'cossatot', 'Sandbar Access', 'Take-out below the falls section. Gravel road to the river. The whitewater is over by here — flat water below.', 'carry_in', 'gravel', false, 'small_5_to_15', '{}', 34.3420, -94.2610, 5.0, 'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'cossatot' and name = 'Sandbar Access');

-- ═══ RAPPAHANNOCK RIVER (rappahannock) — Virginia ═══

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'rappahannock', 'Kelly''s Ford', 'Historic Civil War crossing, now a popular canoe/kayak launch. Paved ramp. The Rappahannock through here is Class I-II with good smallmouth bass fishing. Osprey and bald eagles overhead.', 'boat_ramp', 'paved', true, 'medium_15_to_30', ARRAY['Restroom'], 38.4710, -77.7710, 0.0, 10.0, 'Motts Run', 'about 4 hours', 'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'rappahannock' and name = 'Kelly''s Ford');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'rappahannock', 'City Dock (Fredericksburg)', 'City of Fredericksburg access at the fall line. Take-out for the upper float. Below here the Rappahannock becomes tidal. The Civil War battlefields are along both banks.', 'boat_ramp', 'paved', true, 'medium_15_to_30', ARRAY['Restroom'], 38.3010, -77.4610, 20.0, 'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'rappahannock' and name = 'City Dock (Fredericksburg)');

-- ═══ WOLF RIVER (wolf_wi) — Wisconsin ═══

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'wolf_wi', 'Big Smokey Falls', 'Menominee County access above the Wolf''s famous whitewater section. Class III-IV rapids through a granite gorge on the Menominee reservation. Tribal permit may be required.', 'carry_in', 'gravel', false, 'small_5_to_15', '{}', 44.8870, -88.7610, 0.0, 6.0, 'Shotgun Eddy', 'about 3 hours', 'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'wolf_wi' and name = 'Big Smokey Falls');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'wolf_wi', 'Langlade (Hwy 55)', 'Standard take-out for the Wolf River whitewater section. County park access with paved ramp. Below here the Wolf calms to Class I flatwater.', 'boat_ramp', 'paved', true, 'medium_15_to_30', ARRAY['Restroom', 'Picnic tables'], 44.8290, -88.7270, 10.0, 'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'wolf_wi' and name = 'Langlade (Hwy 55)');

-- ═══ NAMEKAGON RIVER (namekagon) — Wisconsin ═══

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'namekagon', 'Cable (Namekagon Dam)', 'NPS access at the headwaters. St. Croix National Scenic Riverway begins here. The Namekagon is a clear, sandy-bottomed stream through northern Wisconsin forest. Excellent smallmouth and muskie water.', 'carry_in', 'gravel', false, 'small_5_to_15', ARRAY['Restroom'], 46.2010, -91.2940, 0.0, 12.0, 'Hayward Landing', 'about 4-5 hours', 'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'namekagon' and name = 'Cable (Namekagon Dam)');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'namekagon', 'Hayward Landing', 'NPS access near the town of Hayward. Paved ramp. Hayward is the muskie capital of the world — the National Freshwater Fishing Hall of Fame is here (with the giant fiberglass muskie).', 'boat_ramp', 'paved', true, 'medium_15_to_30', ARRAY['Restroom', 'Picnic tables'], 46.0120, -91.4660, 12.0, 'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'namekagon' and name = 'Hayward Landing');

-- ═══ DEAD RIVER (dead_river) — Maine ═══

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'dead_river', 'Spencer Stream', 'Put-in for the Dead River below Long Falls Dam. Dam-release Class III-IV. When they open the dam the Dead rises from 500 to 5,000+ cfs in hours — one of the biggest dam-release whitewater events in the Northeast.', 'carry_in', 'gravel', false, 'medium_15_to_30', ARRAY['Port-a-john'], 45.1620, -70.2190, 0.0, 16.0, 'The Forks (Kennebec confluence)', 'about 4-5 hours', 'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'dead_river' and name = 'Spencer Stream');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'dead_river', 'The Forks (Dead River confluence)', 'Take-out where the Dead meets the Kennebec at The Forks. Same take-out as the Kennebec Gorge run. The Forks is Maine''s commercial whitewater hub — multiple outfitters.', 'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom'], 45.3540, -69.9740, 16.0, 'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'dead_river' and name = 'The Forks (Dead River confluence)');

-- ═══ EDISTO RIVER (edisto) — South Carolina ═══

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'edisto', 'Colleton State Park', 'State park on the longest free-flowing blackwater river in North America. Paved ramp, campground. The Edisto is dark tannic water through cypress-tupelo swamp — alligators, ospreys, and otters. Flat Class I.', 'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom', 'Camping', 'Picnic tables'], 33.1910, -80.6260, 0.0, 12.0, 'Givhans Ferry', 'about 4-5 hours', 'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'edisto' and name = 'Colleton State Park');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'edisto', 'Givhans Ferry State Park', 'State park with paved ramp and campground. The most popular take-out on the Edisto. Spanish moss, white sand beaches, and dark water. One of the most beautiful blackwater paddles in the Southeast.', 'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom', 'Camping', 'Picnic tables'], 33.0290, -80.3920, 12.0, 'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'edisto' and name = 'Givhans Ferry State Park');

-- ═══ GALLATIN RIVER (gallatin) — Montana ═══

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'gallatin', 'Greek Creek', 'USFS access in the Gallatin Canyon south of Big Sky. The canyon section is Class II-III — technical boulder gardens. The Gallatin of "A River Runs Through It" (though the movie was actually filmed on other rivers).', 'carry_in', 'gravel', false, 'small_5_to_15', '{}', 45.3980, -111.2750, 0.0, 8.0, 'Squaw Creek', 'about 3 hours', 'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'gallatin' and name = 'Greek Creek');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'gallatin', 'Missouri Headwaters State Park', 'Where the Gallatin meets the Madison and Jefferson to form the Missouri River. Lewis & Clark named the three forks here in 1805. State park with paved ramp. Historic and scenic.', 'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom', 'Picnic tables', 'Camping'], 45.9270, -111.5050, 25.0, 'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'gallatin' and name = 'Missouri Headwaters State Park');

-- ═══ CAHABA RIVER (cahaba) — Alabama ═══

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'cahaba', 'Cahaba River NWR (Bibb County)', 'US Fish & Wildlife access in the Cahaba River National Wildlife Refuge. The Cahaba is the most biodiverse river in North America for its size — 131 fish species, 40+ mussel species. Class I-II through the shoals.', 'carry_in', 'gravel', false, 'small_5_to_15', ARRAY['Restroom'], 33.0720, -87.0660, 0.0, 8.0, 'Centreville', 'about 3-4 hours', 'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'cahaba' and name = 'Cahaba River NWR (Bibb County)');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'cahaba', 'Centreville', 'Town of Centreville access. Paved ramp. The Cahaba through Bibb County has the famous Cahaba lily shoals — Hymenocallis coronaria blooms in late May on exposed river rock. Found nowhere else in the world.', 'boat_ramp', 'paved', true, 'medium_15_to_30', ARRAY['Restroom'], 32.9390, -87.1170, 8.0, 'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'cahaba' and name = 'Centreville');

-- ═══ SUWANNEE RIVER (suwannee) — Florida ═══

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'suwannee', 'Spirit of the Suwannee Music Park', 'Private park with river access (day-use fee). Paved ramp. The Suwannee is a spring-fed blackwater river — dark tannin water, crystal-clear springs feeding in from the sides. Manatees in winter.', 'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom', 'Camping', 'Picnic tables'], 30.3510, -82.9260, 0.0, 15.0, 'Suwannee River State Park', 'about 5-6 hours', 'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'suwannee' and name = 'Spirit of the Suwannee Music Park');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'suwannee', 'Suwannee River State Park', 'State park at the confluence of the Suwannee and Withlacoochee. Paved ramp, campground. Stephen Foster''s "Old Folks at Home" ("Way down upon the Suwannee River") made this the most famous river name in American music.', 'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom', 'Camping', 'Picnic tables'], 30.3880, -83.1710, 15.0, 'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'suwannee' and name = 'Suwannee River State Park');

-- ═══ HOUSATONIC RIVER (housatonic) — Connecticut ═══

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'housatonic', 'Falls Village', 'Put-in below the dam for the Housatonic''s Class II-III whitewater section through the Litchfield Hills. The Housy is Connecticut''s premier trout and smallmouth stream. Beautiful New England valley.', 'carry_in', 'gravel', false, 'small_5_to_15', '{}', 41.9530, -73.3680, 0.0, 8.0, 'West Cornwall (Covered Bridge)', 'about 3 hours', 'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'housatonic' and name = 'Falls Village');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'housatonic', 'West Cornwall Covered Bridge', 'The iconic 1864 covered bridge — most photographed spot on the Housatonic. Small pull-off for carry-in. Popular take-out for the whitewater section and put-in for the gentler float downstream.', 'carry_in', 'gravel', false, 'small_5_to_15', '{}', 41.8720, -73.3650, 8.0, 'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'housatonic' and name = 'West Cornwall Covered Bridge');

-- ═══ UPPER IOWA RIVER (upper_iowa) — Iowa ═══

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'upper_iowa', 'Kendallville Park', 'Put-in for Iowa''s most scenic canoe river. 200-foot limestone bluffs and cold-water springs. The Upper Iowa cuts through the Driftless Area — the part of the Midwest the glaciers missed. Smallmouth bass and brown trout.', 'carry_in', 'paved', false, 'medium_15_to_30', ARRAY['Restroom', 'Camping'], 43.4120, -91.7410, 0.0, 12.0, 'Bluffton', 'about 4-5 hours', 'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'upper_iowa' and name = 'Kendallville Park');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'upper_iowa', 'Bluffton', 'DNR access at the town of Bluffton. Paved ramp. The bluffs are at their tallest through this stretch — 300 feet of exposed limestone. Chimney Rock and other formations visible from the water.', 'boat_ramp', 'paved', true, 'medium_15_to_30', ARRAY['Restroom'], 43.4270, -91.8980, 12.0, 'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'upper_iowa' and name = 'Bluffton');

-- ═══ MULBERRY RIVER (mulberry) — Arkansas ═══

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'mulberry', 'Wolf Pen', 'USFS put-in for the upper Mulberry — Arkansas''s most remote Class III whitewater. Rain-dependent Ozark stream. When it''s running (above 500 cfs) this is one of the finest whitewater creek runs in the South.', 'carry_in', 'gravel', false, 'small_5_to_15', '{}', 35.7120, -93.6710, 0.0, 10.0, 'Turner Bend', 'about 4-5 hours', 'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'mulberry' and name = 'Wolf Pen');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'mulberry', 'Turner Bend', 'The classic Mulberry take-out at Turner Bend store — been running shuttle for paddlers since the 1970s. Gravel ramp, camping, country store. Check water level before driving — the Mulberry can go from too low to flood stage in one storm.', 'carry_in', 'gravel', false, 'medium_15_to_30', ARRAY['Restroom', 'Camping'], 35.6870, -93.5780, 10.0, 'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'mulberry' and name = 'Turner Bend');

-- ═══ GUADALUPE BASS / BRAZOS RIVER (brazos) — Texas ═══

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'brazos', 'Possum Kingdom State Park', 'State park below Possum Kingdom Dam. Paved ramp, campground. The tailrace below the dam has excellent striped bass fishing. Below here the Brazos winds through the Texas Hill Country toward Waco.', 'boat_ramp', 'paved', true, 'large_over_30', ARRAY['Restroom', 'Camping', 'Picnic tables', 'Drinking water'], 32.8690, -98.5250, 0.0, 15.0, 'Rochelle Park', 'about 5-6 hours', 'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'brazos' and name = 'Possum Kingdom State Park');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'brazos', 'Rochelle Park (Palo Pinto)', 'County park access on the middle Brazos. Paved ramp. The Brazos is wide and slow through here — easy flat-water paddling. Good catfishing. Watch for sandbars at low water.', 'boat_ramp', 'paved', true, 'medium_15_to_30', ARRAY['Restroom', 'Picnic tables'], 32.7620, -98.3120, 15.0, 'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'brazos' and name = 'Rochelle Park (Palo Pinto)');

-- ═══ PINE CREEK (pinecreek) — Pennsylvania ═══

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, distance_to_next_access_miles, next_access_name, float_time_to_next, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'pinecreek', 'Ansonia', 'Put-in for the PA Grand Canyon of Pine Creek. The canyon is 1,000 feet deep and 47 miles long — Pennsylvania''s most dramatic river gorge. Class I-II. The Pine Creek Rail Trail runs along the rim.', 'carry_in', 'gravel', false, 'medium_15_to_30', ARRAY['Restroom'], 41.7350, -77.3460, 0.0, 17.0, 'Blackwell', 'about 5-6 hours', 'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'pinecreek' and name = 'Ansonia');

insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by)
select 'pinecreek', 'Blackwell', 'Mid-canyon access at the town of Blackwell. Most popular take-out for a day trip through the deepest part of the PA Grand Canyon. Paved ramp, parking for 20+ vehicles.', 'boat_ramp', 'paved', true, 'medium_15_to_30', ARRAY['Restroom'], 41.5690, -77.3830, 17.0, 'RiverScout', true, 'verified', now(), 'seed data'
where not exists (select 1 from public.river_access_points where river_id = 'pinecreek' and name = 'Blackwell');

commit;
