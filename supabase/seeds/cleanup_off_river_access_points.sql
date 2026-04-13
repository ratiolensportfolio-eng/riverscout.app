-- cleanup_off_river_access_points.sql
--
-- Generated 2026-04-13 by scripts/generate-cleanup-sql.js.
--
-- Deletes 124 access-point rows whose coordinates are more
-- than 2 miles from the river's polyline. These were
-- seeded from training-data guesses in prior work and are being removed
-- so the map and the access-point list both show clean/verified data only.
--
-- Review before running. Safe to run multiple times (idempotent).

begin;

-- american — 2 rows
delete from public.river_access_points where river_id = 'american' and name = 'Camp Lotus';  -- 5.6 mi off
delete from public.river_access_points where river_id = 'american' and name = 'Salmon Falls (Folsom Lake)';  -- 12.9 mi off
-- arkansas — 4 rows
delete from public.river_access_points where river_id = 'arkansas' and name = 'Granite';  -- 33.9 mi off
delete from public.river_access_points where river_id = 'arkansas' and name = 'Hecla Junction';  -- 14.4 mi off
delete from public.river_access_points where river_id = 'arkansas' and name = 'Railroad Bridge';  -- 23.5 mi off
delete from public.river_access_points where river_id = 'arkansas' and name = 'Royal Gorge Park';  -- 25.8 mi off
-- ausable — 5 rows
delete from public.river_access_points where river_id = 'ausable' and name = 'Burton''s Landing';  -- 2.6 mi off
delete from public.river_access_points where river_id = 'ausable' and name = 'Keystone Landing';  -- 7.9 mi off
delete from public.river_access_points where river_id = 'ausable' and name = 'Mio Dam Pond';  -- 9.8 mi off
delete from public.river_access_points where river_id = 'ausable' and name = 'Stephan Bridge';  -- 6.7 mi off
delete from public.river_access_points where river_id = 'ausable' and name = 'Wakeley Bridge';  -- 4.5 mi off
-- blackfoot — 2 rows
delete from public.river_access_points where river_id = 'blackfoot' and name = 'Johnsrud Park';  -- 8.3 mi off
delete from public.river_access_points where river_id = 'blackfoot' and name = 'Ninemile Prairie';  -- 5.7 mi off
-- brazos — 2 rows
delete from public.river_access_points where river_id = 'brazos' and name = 'Possum Kingdom State Park';  -- 15.2 mi off
delete from public.river_access_points where river_id = 'brazos' and name = 'Rochelle Park (Palo Pinto)';  -- 29.2 mi off
-- buffalo — 3 rows
delete from public.river_access_points where river_id = 'buffalo' and name = 'Kyles Landing';  -- 30.3 mi off
delete from public.river_access_points where river_id = 'buffalo' and name = 'Ponca Access';  -- 34.2 mi off
delete from public.river_access_points where river_id = 'buffalo' and name = 'Steel Creek';  -- 32.2 mi off
-- cossatot — 1 rows
delete from public.river_access_points where river_id = 'cossatot' and name = 'Sandbar Access';  -- 3.0 mi off
-- cumberland — 4 rows
delete from public.river_access_points where river_id = 'cumberland' and name = 'Cumberland Falls State Park';  -- 28.6 mi off
delete from public.river_access_points where river_id = 'cumberland' and name = 'Williamsburg';  -- 40.5 mi off
delete from public.river_access_points where river_id = 'cumberland' and name = 'Winfrey''s Ferry';  -- 17.0 mi off
delete from public.river_access_points where river_id = 'cumberland' and name = 'Wolf Creek Dam Tailwater';  -- 8.6 mi off
-- current — 2 rows
delete from public.river_access_points where river_id = 'current' and name = 'Akers Ferry';  -- 5.5 mi off
delete from public.river_access_points where river_id = 'current' and name = 'Montauk State Park';  -- 2.0 mi off
-- deschutes — 3 rows
delete from public.river_access_points where river_id = 'deschutes' and name = 'Sandy Beach (Maupin)';  -- 6.2 mi off
delete from public.river_access_points where river_id = 'deschutes' and name = 'Trout Creek';  -- 17.8 mi off
delete from public.river_access_points where river_id = 'deschutes' and name = 'Warm Springs Access';  -- 14.2 mi off
-- eleven_point — 4 rows
delete from public.river_access_points where river_id = 'eleven_point' and name = 'Greer Crossing';  -- 3.5 mi off
delete from public.river_access_points where river_id = 'eleven_point' and name = 'Highway 142 Bridge';  -- 20.7 mi off
delete from public.river_access_points where river_id = 'eleven_point' and name = 'Riverton';  -- 16.0 mi off
delete from public.river_access_points where river_id = 'eleven_point' and name = 'Turner''s Mill';  -- 9.0 mi off
-- flathead — 2 rows
delete from public.river_access_points where river_id = 'flathead' and name = 'Bear Creek (Glacier NP)';  -- 7.9 mi off
delete from public.river_access_points where river_id = 'flathead' and name = 'West Glacier';  -- 2.3 mi off
-- gallatin — 2 rows
delete from public.river_access_points where river_id = 'gallatin' and name = 'Greek Creek';  -- 8.9 mi off
delete from public.river_access_points where river_id = 'gallatin' and name = 'Missouri Headwaters State Park';  -- 30.1 mi off
-- gauley — 4 rows
delete from public.river_access_points where river_id = 'gauley' and name = 'Mason''s Branch';  -- 6.3 mi off
delete from public.river_access_points where river_id = 'gauley' and name = 'Peters Creek';  -- 8.5 mi off
delete from public.river_access_points where river_id = 'gauley' and name = 'Summersville Dam Tailwaters';  -- 3.0 mi off
delete from public.river_access_points where river_id = 'gauley' and name = 'Swiss';  -- 10.5 mi off
-- grandcanyon — 2 rows
delete from public.river_access_points where river_id = 'grandcanyon' and name = 'Diamond Creek Take-out';  -- 33.9 mi off
delete from public.river_access_points where river_id = 'grandcanyon' and name = 'Lees Ferry';  -- 138.9 mi off
-- greenbrier — 3 rows
delete from public.river_access_points where river_id = 'greenbrier' and name = 'Alderson';  -- 48.0 mi off
delete from public.river_access_points where river_id = 'greenbrier' and name = 'Durbin';  -- 15.6 mi off
delete from public.river_access_points where river_id = 'greenbrier' and name = 'Marlinton';  -- 2.7 mi off
-- hudson_gorge — 4 rows
delete from public.river_access_points where river_id = 'hudson_gorge' and name = 'Indian River Put-in';  -- 5.6 mi off
delete from public.river_access_points where river_id = 'hudson_gorge' and name = 'North Creek';  -- 17.8 mi off
delete from public.river_access_points where river_id = 'hudson_gorge' and name = 'Riparius';  -- 20.2 mi off
delete from public.river_access_points where river_id = 'hudson_gorge' and name = 'The Glen';  -- 24.0 mi off
-- huron_mi — 3 rows
delete from public.river_access_points where river_id = 'huron_mi' and name = 'Delhi Metropark';  -- 7.1 mi off
delete from public.river_access_points where river_id = 'huron_mi' and name = 'Gallup Park';  -- 12.5 mi off
delete from public.river_access_points where river_id = 'huron_mi' and name = 'Proud Lake Recreation Area';  -- 4.5 mi off
-- james — 3 rows
delete from public.river_access_points where river_id = 'james' and name = '14th Street Take-out';  -- 120.1 mi off
delete from public.river_access_points where river_id = 'james' and name = 'Reedy Creek (Richmond)';  -- 118.1 mi off
delete from public.river_access_points where river_id = 'james' and name = 'Scottsville';  -- 64.5 mi off
-- jordan — 3 rows
delete from public.river_access_points where river_id = 'jordan' and name = 'Graves Crossing';  -- 4.9 mi off
delete from public.river_access_points where river_id = 'jordan' and name = 'Old State Road Bridge';  -- 6.5 mi off
delete from public.river_access_points where river_id = 'jordan' and name = 'Webster Bridge';  -- 8.5 mi off
-- kalamazoo — 1 rows
delete from public.river_access_points where river_id = 'kalamazoo' and name = 'Ceresco Dam';  -- 34.6 mi off
-- kennebec — 1 rows
delete from public.river_access_points where river_id = 'kennebec' and name = 'Harris Station Put-in';  -- 2.4 mi off
-- kern — 2 rows
delete from public.river_access_points where river_id = 'kern' and name = 'Johnsondale Bridge';  -- 3.2 mi off
delete from public.river_access_points where river_id = 'kern' and name = 'Riverside Park (Kernville)';  -- 14.1 mi off
-- kickapoo — 4 rows
delete from public.river_access_points where river_id = 'kickapoo' and name = 'La Farge';  -- 25.6 mi off
delete from public.river_access_points where river_id = 'kickapoo' and name = 'Ontario';  -- 36.0 mi off
delete from public.river_access_points where river_id = 'kickapoo' and name = 'Rockton';  -- 28.9 mi off
delete from public.river_access_points where river_id = 'kickapoo' and name = 'Viola';  -- 20.7 mi off
-- lehigh — 2 rows
delete from public.river_access_points where river_id = 'lehigh' and name = 'Jim Thorpe';  -- 6.8 mi off
delete from public.river_access_points where river_id = 'lehigh' and name = 'White Haven';  -- 6.2 mi off
-- little_manistee — 2 rows
delete from public.river_access_points where river_id = 'little_manistee' and name = 'Old M-37 Bridge';  -- 6.3 mi off
delete from public.river_access_points where river_id = 'little_manistee' and name = 'Spencer Bridge';  -- 2.6 mi off
-- little_miami — 2 rows
delete from public.river_access_points where river_id = 'little_miami' and name = 'John Bryan State Park';  -- 8.5 mi off
delete from public.river_access_points where river_id = 'little_miami' and name = 'Loveland Canoe Rental';  -- 7.3 mi off
-- lochsa — 2 rows
delete from public.river_access_points where river_id = 'lochsa' and name = 'Fish Creek';  -- 9.5 mi off
delete from public.river_access_points where river_id = 'lochsa' and name = 'Lowell';  -- 17.7 mi off
-- manistee — 2 rows
delete from public.river_access_points where river_id = 'manistee' and name = 'CCC Bridge';  -- 4.1 mi off
delete from public.river_access_points where river_id = 'manistee' and name = 'M-72 Bridge';  -- 11.1 mi off
-- mulberry — 2 rows
delete from public.river_access_points where river_id = 'mulberry' and name = 'Turner Bend';  -- 7.8 mi off
delete from public.river_access_points where river_id = 'mulberry' and name = 'Wolf Pen';  -- 13.1 mi off
-- nantahala — 1 rows
delete from public.river_access_points where river_id = 'nantahala' and name = 'Nantahala Outdoor Center (NOC)';  -- 2.1 mi off
-- newriver — 2 rows
delete from public.river_access_points where river_id = 'newriver' and name = 'Cunard Put-in';  -- 2.9 mi off
delete from public.river_access_points where river_id = 'newriver' and name = 'Fayette Station';  -- 4.0 mi off
-- niobrara — 2 rows
delete from public.river_access_points where river_id = 'niobrara' and name = 'Cornell Bridge';  -- 12.6 mi off
delete from public.river_access_points where river_id = 'niobrara' and name = 'Rocky Ford';  -- 23.3 mi off
-- pere_marquette — 10 rows
delete from public.river_access_points where river_id = 'pere_marquette' and name = 'Gleasons Landing';  -- 5.2 mi off
delete from public.river_access_points where river_id = 'pere_marquette' and name = 'Green Cottage';  -- 2.4 mi off
delete from public.river_access_points where river_id = 'pere_marquette' and name = 'Indian Bridge';  -- 10.6 mi off
delete from public.river_access_points where river_id = 'pere_marquette' and name = 'M-37 Bridge';  -- 3.9 mi off
delete from public.river_access_points where river_id = 'pere_marquette' and name = 'Maple Leaf Landing';  -- 10.1 mi off
delete from public.river_access_points where river_id = 'pere_marquette' and name = 'Scottville Riverside Park';  -- 11.7 mi off
delete from public.river_access_points where river_id = 'pere_marquette' and name = 'Sulak Landing';  -- 6.5 mi off
delete from public.river_access_points where river_id = 'pere_marquette' and name = 'Suttons Landing';  -- 12.9 mi off
delete from public.river_access_points where river_id = 'pere_marquette' and name = 'Upper Branch Bridge';  -- 3.8 mi off
delete from public.river_access_points where river_id = 'pere_marquette' and name = 'Walhalla Bridge';  -- 8.6 mi off
-- pigeon_mi — 2 rows
delete from public.river_access_points where river_id = 'pigeon_mi' and name = 'Pigeon Bridge Campground';  -- 6.2 mi off
delete from public.river_access_points where river_id = 'pigeon_mi' and name = 'Tin Bridge';  -- 7.8 mi off
-- pinecreek — 2 rows
delete from public.river_access_points where river_id = 'pinecreek' and name = 'Ansonia';  -- 13.9 mi off
delete from public.river_access_points where river_id = 'pinecreek' and name = 'Blackwell';  -- 2.4 mi off
-- potomac — 1 rows
delete from public.river_access_points where river_id = 'potomac' and name = 'Violettes Lock';  -- 2.3 mi off
-- rappahannock — 2 rows
delete from public.river_access_points where river_id = 'rappahannock' and name = 'City Dock (Fredericksburg)';  -- 10.4 mi off
delete from public.river_access_points where river_id = 'rappahannock' and name = 'Kelly''s Ford';  -- 30.8 mi off
-- rifle — 2 rows
delete from public.river_access_points where river_id = 'rifle' and name = 'Rifle River Recreation Area';  -- 20.7 mi off
delete from public.river_access_points where river_id = 'rifle' and name = 'Sage Lake Road';  -- 17.3 mi off
-- rogue — 2 rows
delete from public.river_access_points where river_id = 'rogue' and name = 'Foster Bar';  -- 19.5 mi off
delete from public.river_access_points where river_id = 'rogue' and name = 'Grave Creek Boat Launch';  -- 7.0 mi off
-- saco — 1 rows
delete from public.river_access_points where river_id = 'saco' and name = 'Canal Bridge';  -- 2.6 mi off
-- salmon — 2 rows
delete from public.river_access_points where river_id = 'salmon' and name = 'Corn Creek Put-in';  -- 22.2 mi off
delete from public.river_access_points where river_id = 'salmon' and name = 'Vinegar Creek (Long Tom Bar)';  -- 88.9 mi off
-- san_juan — 2 rows
delete from public.river_access_points where river_id = 'san_juan' and name = 'Mexican Hat';  -- 4.7 mi off
delete from public.river_access_points where river_id = 'san_juan' and name = 'Sand Island';  -- 6.2 mi off
-- snake_wy — 2 rows
delete from public.river_access_points where river_id = 'snake_wy' and name = 'Sheep Gulch Take-out';  -- 8.2 mi off
delete from public.river_access_points where river_id = 'snake_wy' and name = 'West Table Creek';  -- 12.8 mi off
-- suwannee — 1 rows
delete from public.river_access_points where river_id = 'suwannee' and name = 'Spirit of the Suwannee Music Park';  -- 2.3 mi off
-- tuolumne — 2 rows
delete from public.river_access_points where river_id = 'tuolumne' and name = 'Meral''s Pool';  -- 25.7 mi off
delete from public.river_access_points where river_id = 'tuolumne' and name = 'Ward''s Ferry';  -- 14.8 mi off
-- twohearted — 3 rows
delete from public.river_access_points where river_id = 'twohearted' and name = 'High Bridge';  -- 5.5 mi off
delete from public.river_access_points where river_id = 'twohearted' and name = 'Reed & Green Bridge';  -- 6.0 mi off
delete from public.river_access_points where river_id = 'twohearted' and name = 'Two Hearted River Campground';  -- 7.8 mi off
-- upper_iowa — 1 rows
delete from public.river_access_points where river_id = 'upper_iowa' and name = 'Kendallville Park';  -- 5.9 mi off
-- white_mi — 2 rows
delete from public.river_access_points where river_id = 'white_mi' and name = 'Hesperia Dam';  -- 8.9 mi off
delete from public.river_access_points where river_id = 'white_mi' and name = 'Pines Point';  -- 4.8 mi off
-- wolf_wi — 2 rows
delete from public.river_access_points where river_id = 'wolf_wi' and name = 'Big Smokey Falls';  -- 5.2 mi off
delete from public.river_access_points where river_id = 'wolf_wi' and name = 'Langlade (Hwy 55)';  -- 4.5 mi off
-- yampa — 2 rows
delete from public.river_access_points where river_id = 'yampa' and name = 'Deerlodge Park';  -- 84.9 mi off
delete from public.river_access_points where river_id = 'yampa' and name = 'Echo Park';  -- 110.6 mi off

commit;
