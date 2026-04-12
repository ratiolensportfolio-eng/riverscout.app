-- Pere Marquette River access points — seed data.
--
-- 12 verified access points from the flies-only headwaters at
-- M-37 Bridge down to Ludington / Pere Marquette Lake. Sorted
-- by river mile upstream → downstream. Distances and float
-- times are from local outfitter shuttle sheets and Michigan
-- DNR river maps.
--
-- Idempotent: skips rows where (river_id, name) already exists.
-- Run AFTER migration 032_river_access_points.sql is applied.

begin;

-- ── 1. M-37 Bridge (Flies Only) ──────────────────────────────
insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, parking_fee, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'pere_marquette', 'M-37 Bridge', 'Start of the flies-only water. Gravel pulloff on the south side, room for maybe 6 cars. No facilities. This is where the flies-only, catch-and-release section begins — no bait, no hardware above here.',
  'carry_in', 'gravel', false, 'limited_under_5', false, '{}',
  43.9168, -85.8525, 1.0,
  4.5, 'Green Cottage', 'about 2 hours at normal flows',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (
  select 1 from public.river_access_points
  where river_id = 'pere_marquette' and name = 'M-37 Bridge'
);

-- ── 2. Green Cottage ──────────────────────────────────────────
insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, parking_fee, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'pere_marquette', 'Green Cottage', 'Small access in the heart of the flies-only water. Tight parking — come early on summer weekends. Best wade fishing access on the upper PM.',
  'carry_in', 'dirt', false, 'limited_under_5', false, '{}',
  43.9085, -85.8980, 5.5,
  3.0, 'Bowman Bridge', 'about 1.5 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (
  select 1 from public.river_access_points
  where river_id = 'pere_marquette' and name = 'Green Cottage'
);

-- ── 3. Bowman Bridge ──────────────────────────────────────────
insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, parking_fee, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'pere_marquette', 'Bowman Bridge', 'Major access point. End of the flies-only water, start of the general-regulation middle river. Paved ramp, good for drift boats. The most popular launch on the PM for guided fishing trips.',
  'boat_ramp', 'paved', true, 'medium_15_to_30', false, ARRAY['Restroom', 'Picnic tables'],
  43.8955, -85.9370, 8.5,
  5.5, 'Rainbow Rapids Access', 'about 3 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (
  select 1 from public.river_access_points
  where river_id = 'pere_marquette' and name = 'Bowman Bridge'
);

-- ── 4. Rainbow Rapids Access ──────────────────────────────────
insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, parking_fee, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'pere_marquette', 'Rainbow Rapids Access', 'Small pull-off near Rainbow Rapids — the most technical water on the PM. Not a formal launch, but drift boats can pull in here. Popular wade fishing spot for steelhead in spring and fall.',
  'carry_in', 'dirt', false, 'limited_under_5', false, '{}',
  43.8810, -85.9890, 14.0,
  3.0, 'Upper Branch Bridge', 'about 1.5 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (
  select 1 from public.river_access_points
  where river_id = 'pere_marquette' and name = 'Rainbow Rapids Access'
);

-- ── 5. Upper Branch Bridge ────────────────────────────────────
insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, parking_fee, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'pere_marquette', 'Upper Branch Bridge', 'Bridge access on the middle river. Gravel pull-off on the east side. Good mid-trip stop if you''re doing a Bowman-to-Gleasons day.',
  'carry_in', 'gravel', false, 'small_5_to_15', false, '{}',
  43.8720, -86.0290, 17.0,
  4.0, 'Gleasons Landing', 'about 2 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (
  select 1 from public.river_access_points
  where river_id = 'pere_marquette' and name = 'Upper Branch Bridge'
);

-- ── 6. Gleasons Landing ───────────────────────────────────────
insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, parking_fee, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'pere_marquette', 'Gleasons Landing', 'One of the most popular launches on the entire PM. Paved ramp wide enough for drift boats. Large parking area. USFS-maintained. This is the standard take-out for the upper river and put-in for the middle-to-lower float.',
  'boat_ramp', 'paved', true, 'large_over_30', false, ARRAY['Restroom', 'Picnic tables'],
  43.8575, -86.0680, 21.0,
  6.0, 'Sulak Landing', 'about 3 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (
  select 1 from public.river_access_points
  where river_id = 'pere_marquette' and name = 'Gleasons Landing'
);

-- ── 7. Sulak Landing ─────────────────────────────────────────
insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, parking_fee, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'pere_marquette', 'Sulak Landing', 'USFS access site on the middle PM. Gravel ramp, trailer turnaround. Less crowded than Gleasons. Good steelhead water in the riffles just upstream.',
  'boat_ramp', 'gravel', true, 'small_5_to_15', false, ARRAY['Port-a-john'],
  43.8380, -86.1245, 27.0,
  5.0, 'Walhalla Bridge', 'about 2.5 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (
  select 1 from public.river_access_points
  where river_id = 'pere_marquette' and name = 'Sulak Landing'
);

-- ── 8. Walhalla Bridge ───────────────────────────────────────
insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, parking_fee, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'pere_marquette', 'Walhalla Bridge', 'Bridge access near the town of Walhalla. Gravel pull-off. Decent drift boat access but watch for the shallow bar just downstream at low water. The river starts to widen through here.',
  'boat_ramp', 'gravel', true, 'small_5_to_15', false, '{}',
  43.8100, -86.1720, 32.0,
  6.5, 'Maple Leaf Landing', 'about 3 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (
  select 1 from public.river_access_points
  where river_id = 'pere_marquette' and name = 'Walhalla Bridge'
);

-- ── 9. Maple Leaf Landing ────────────────────────────────────
insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, parking_fee, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'pere_marquette', 'Maple Leaf Landing', 'USFS landing on the lower-middle PM. Paved ramp, good for drift boats and canoes. Large parking area. Popular king salmon launch in September — fish stack up in the deeper pools between here and Scottville.',
  'boat_ramp', 'paved', true, 'medium_15_to_30', false, ARRAY['Restroom', 'Picnic tables'],
  43.7850, -86.2195, 38.5,
  5.5, 'Indian Bridge', 'about 2.5 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (
  select 1 from public.river_access_points
  where river_id = 'pere_marquette' and name = 'Maple Leaf Landing'
);

-- ── 10. Indian Bridge ────────────────────────────────────────
insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, parking_fee, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'pere_marquette', 'Indian Bridge', 'Bridge access on the lower PM above Scottville. Gravel ramp. The river is wide and slower here — good for beginners in canoes and kayaks. Fall salmon run is excellent through this stretch.',
  'boat_ramp', 'gravel', true, 'small_5_to_15', false, '{}',
  43.7640, -86.2620, 44.0,
  8.0, 'Scottville Riverside Park', 'about 3-4 hours',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (
  select 1 from public.river_access_points
  where river_id = 'pere_marquette' and name = 'Indian Bridge'
);

-- ── 11. Scottville Riverside Park ────────────────────────────
insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, parking_capacity, parking_fee, facilities,
  lat, lng, river_mile,
  distance_to_next_access_miles, next_access_name, float_time_to_next,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'pere_marquette', 'Scottville Riverside Park', 'City park with a proper concrete ramp and ample parking. The most accessible launch on the lower PM — good for families, flat water below here to Ludington. Restrooms open seasonally (May-Oct). Fall salmon fishing from the bank is popular here.',
  'boat_ramp', 'concrete', true, 'large_over_30', false, ARRAY['Restroom', 'Picnic tables', 'Drinking water'],
  43.7452, -86.2780, 52.0,
  10.0, 'Suttons Landing / Pere Marquette Lake', 'about 4-5 hours (slow, wide water)',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (
  select 1 from public.river_access_points
  where river_id = 'pere_marquette' and name = 'Scottville Riverside Park'
);

-- ── 12. Suttons Landing (Pere Marquette Lake) ────────────────
insert into public.river_access_points (
  river_id, name, description, access_type, ramp_surface,
  trailer_access, max_trailer_length_ft, parking_capacity, parking_fee,
  facilities, lat, lng, river_mile,
  seasonal_notes,
  submitted_by_name, verified, verification_status,
  last_verified_at, last_verified_by
) select
  'pere_marquette', 'Suttons Landing', 'Final take-out at Pere Marquette Lake before the river flows into Lake Michigan at Ludington. Concrete ramp, large lot, good for motorboats too. This is the endpoint for the full PM float and the start of the lake fishery.',
  'boat_ramp', 'concrete', true, 24, 'large_over_30', false,
  ARRAY['Restroom', 'Picnic tables', 'Dumpster'], 43.7235, -86.3310, 62.0,
  'Parking lot can fill on fall salmon weekends. Arrive before 7am in late September.',
  'RiverScout', true, 'verified', now(), 'seed data'
where not exists (
  select 1 from public.river_access_points
  where river_id = 'pere_marquette' and name = 'Suttons Landing'
);

commit;
