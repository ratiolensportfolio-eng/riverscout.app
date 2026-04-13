-- cleanup_mi_access_points.sql
--
-- Generated 2026-04-13 by scripts/apply-mi-nominatim-fixes.js.
--
-- Updates the 7 MI access points where Nominatim (OSM geocoder) found
-- a matching named feature 0.5-3 mi from our stored coordinate, using
-- the gazetteer-sourced lat/lng as ground truth. Removes the 10 MI
-- access points that could not be verified against Nominatim at all.
--
-- Pere Marquette, Pine, and Manistee excluded (handled separately).
-- Safe to re-run.

begin;

update public.river_access_points set lat = 43.43712, lng = -85.66410, last_verified_at = now(), last_verified_by = 'Nominatim/OSM' where river_id = 'muskegon' and name = 'Croton Dam';  -- was 1.3 mi off
update public.river_access_points set lat = 44.64963, lng = -85.49576, last_verified_at = now(), last_verified_by = 'Nominatim/OSM' where river_id = 'boardman' and name = 'Brown Bridge Quiet Area';  -- was 1.9 mi off
update public.river_access_points set lat = 44.75677, lng = -85.60970, last_verified_at = now(), last_verified_by = 'Nominatim/OSM' where river_id = 'boardman' and name = 'Hull Park';  -- was 0.6 mi off
update public.river_access_points set lat = 44.58271, lng = -85.85035, last_verified_at = now(), last_verified_by = 'Nominatim/OSM' where river_id = 'betsie' and name = 'Grass Lake Road';  -- was 1.0 mi off
update public.river_access_points set lat = 44.73193, lng = -86.15546, last_verified_at = now(), last_verified_by = 'Nominatim/OSM' where river_id = 'platte_mi' and name = 'Platte River Point';  -- was 2.9 mi off
update public.river_access_points set lat = 42.52488, lng = -85.84581, last_verified_at = now(), last_verified_by = 'Nominatim/OSM' where river_id = 'kalamazoo' and name = 'Allegan City Dam';  -- was 0.5 mi off
update public.river_access_points set lat = 43.47437, lng = -86.21191, last_verified_at = now(), last_verified_by = 'Nominatim/OSM' where river_id = 'white_mi' and name = 'Diamond Point';  -- was 2.1 mi off

delete from public.river_access_points where river_id = 'muskegon' and name = 'Pine Street Access';
delete from public.river_access_points where river_id = 'muskegon' and name = 'Henning Park';
delete from public.river_access_points where river_id = 'muskegon' and name = 'Bridgeton Access';
delete from public.river_access_points where river_id = 'boardman' and name = 'Supply Road Bridge';
delete from public.river_access_points where river_id = 'boardman' and name = 'Ranch Rudolf';
delete from public.river_access_points where river_id = 'betsie' and name = 'Kurick Road';
delete from public.river_access_points where river_id = 'betsie' and name = 'Thompsonville Bridge';
delete from public.river_access_points where river_id = 'platte_mi' and name = 'Veterans Memorial Park';
delete from public.river_access_points where river_id = 'rifle' and name = 'Omer City Park';
delete from public.river_access_points where river_id = 'little_manistee' and name = 'Nine Mile Bridge';

commit;
