-- access_points seed: river_gauges_auto_seed.sql
-- Generated 2026-04-15 by scripts/discover-multi-gauges.js
--
-- 386 rivers with 2+ live USGS gauges, discovered by querying
-- USGS site service per state and filtering candidates by:
--   1. ALL river-name tokens must appear in the station prefix
--      (before any AT/NEAR/BELOW/ABOVE connector)
--   2. Distance ≤ 30 mi from the river's primary gauge
--   3. Live discharge data within the last 2 hours
--
-- Run AFTER 034_river_gauges.sql migration. Idempotent: every
-- river block is delete-then-insert.
--
-- Skips rivers already in the hand-curated river_gauges_seed.sql
-- (ausable, manistee, muskegon, pere_marquette, gauley, new_river,
-- colorado, grand_on, muskingum_oh).

begin;


-- Pine River (MI) — 2 gauges
delete from public.river_gauges where river_id = 'pine_mi';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('pine_mi', '04125460', 'PINE RIVER AT HIGH SCHOOL BRIDGE NR HOXEYVILLE, MI', 'usgs', 'AT HIGH SCHOOL BRIDGE NR HOXEYVILLE', 44.1933, -85.7698, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('pine_mi', '04124500', 'EAST BRANCH PINE RIVER NEAR TUSTIN, MI', 'usgs', 'NEAR TUSTIN', 44.1025, -85.5173, false);

-- Boardman River (MI) — 2 gauges
delete from public.river_gauges where river_id = 'boardman';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('boardman', '04127200', 'BOARDMAN RIVER AT BEITNER RD NR TRAVERSE CITY, MI', 'usgs', 'AT BEITNER RD NR TRAVERSE CITY', 44.6753, -85.6309, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('boardman', '04126970', 'BOARDMAN R ABOVE BROWN BRIDGE ROAD NR MAYFIELD, MI', 'usgs', 'ABOVE BROWN BRIDGE ROAD NR MAYFIELD', 44.6567, -85.4367, false);

-- Huron River (MI) — 3 gauges
delete from public.river_gauges where river_id = 'huron_mi';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('huron_mi', '04174500', 'HURON RIVER AT ANN ARBOR, MI', 'usgs', 'AT ANN ARBOR', 42.2870, -83.7338, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('huron_mi', '04172000', 'HURON RIVER NEAR HAMBURG, MI', 'usgs', 'NEAR HAMBURG', 42.4653, -83.7999, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('huron_mi', '04174040', 'HURON RIVER AT ZEEB RD AT SCIO, MI', 'usgs', 'AT ZEEB RD AT SCIO', 42.3237, -83.8406, false);

-- Chippewa River (MI) — 4 gauges
delete from public.river_gauges where river_id = 'chippewa_mi';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('chippewa_mi', '04154000', 'CHIPPEWA RIVER NEAR MOUNT PLEASANT, MI', 'usgs', 'NEAR MOUNT PLEASANT', 43.6261, -84.7078, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('chippewa_mi', '04153725', 'CHIPPEWA RIVER AT DREW RD NR DREW, MI', 'usgs', 'AT DREW RD NR DREW', 43.6613, -85.0301, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('chippewa_mi', '04153905', 'N BR CHIPPEWA RIVER MERIDIAN RD NR MT PLEASANT MI', 'usgs', 'N BR CHIPPEWA RIVER MERIDIAN RD NR MT PLEASANT MI', 43.5927, -84.8479, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('chippewa_mi', '04154512', 'CHIPPEWA RIVER AT S HOMER RD NR MIDLAND', 'usgs', 'AT S HOMER RD NR MIDLAND', 43.6011, -84.3305, false);

-- Dowagiac River (MI) — 3 gauges
delete from public.river_gauges where river_id = 'dowagiac';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('dowagiac', '04101800', 'DOWAGIAC RIVER AT SUMNERVILLE, MI', 'usgs', 'AT SUMNERVILLE', 41.9134, -86.2131, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('dowagiac', '04101535', 'DOWAGIAC RIVER AT STATE HWY 51 NEAR DOWAGIAC, MI', 'usgs', 'AT STATE HWY 51 NEAR DOWAGIAC', 42.0278, -86.1075, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('dowagiac', '04101590', 'DOWAGIAC CREEK AT DUTCH SETTLEMENT RD NR DOWAGIAC,', 'usgs', 'AT DUTCH SETTLEMENT RD NR DOWAGIAC,', 41.9836, -86.0028, false);

-- Kalamazoo River (MI) — 4 gauges
delete from public.river_gauges where river_id = 'kalamazoo';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('kalamazoo', '04106000', 'KALAMAZOO RIVER AT COMSTOCK, MI', 'usgs', 'AT COMSTOCK', 42.2856, -85.5139, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('kalamazoo', '04103500', 'KALAMAZOO RIVER AT MARSHALL, MI', 'usgs', 'AT MARSHALL', 42.2648, -84.9639, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('kalamazoo', '04105500', 'KALAMAZOO RIVER NEAR BATTLE CREEK, MI', 'usgs', 'NEAR BATTLE CREEK', 42.3239, -85.1975, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('kalamazoo', '04107850', 'KALAMAZOO RIVER NEAR ALLEGAN, MI', 'usgs', 'NEAR ALLEGAN', 42.4823, -85.7984, false);

-- Shiawassee River (MI) — 2 gauges
delete from public.river_gauges where river_id = 'shiawassee';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('shiawassee', '04144500', 'SHIAWASSEE RIVER AT OWOSSO, MI', 'usgs', 'AT OWOSSO', 43.0150, -84.1800, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('shiawassee', '04145000', 'SHIAWASSEE RIVER NEAR FERGUS, MI', 'usgs', 'NEAR FERGUS', 43.2547, -84.1055, false);

-- Flint River (MI) — 4 gauges
delete from public.river_gauges where river_id = 'flint_mi';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('flint_mi', '04147500', 'FLINT RIVER NEAR OTISVILLE, MI', 'usgs', 'NEAR OTISVILLE', 43.1111, -83.5194, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('flint_mi', '04146063', 'SOUTH BRANCH FLINT RIVER NEAR COLUMBIAVILLE,MI', 'usgs', 'NEAR COLUMBIAVILLE', 43.1595, -83.3508, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('flint_mi', '04148500', 'FLINT RIVER NEAR FLINT, MI', 'usgs', 'NEAR FLINT', 43.0389, -83.7716, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('flint_mi', '04149000', 'FLINT RIVER NEAR FOSTERS, MI', 'usgs', 'NEAR FOSTERS', 43.3083, -83.9535, false);

-- Detroit River (MI) — 2 gauges
delete from public.river_gauges where river_id = 'detroit_mi';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('detroit_mi', '421337083074201', 'Detroit R at SW Water Intake nr Grassy Island, MI', 'usgs', 'At SW Water Intake nr Grassy Island', 42.2269, -83.1293, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('detroit_mi', '04165710', 'DETROIT RIVER AT FORT WAYNE AT DETROIT, MI', 'usgs', 'AT FORT WAYNE AT DETROIT', 42.2981, -83.0927, false);

-- Paw Paw River (MI) — 2 gauges
delete from public.river_gauges where river_id = 'paw_paw_mi';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('paw_paw_mi', '04102500', 'PAW PAW RIVER AT RIVERSIDE, MI', 'usgs', 'AT RIVERSIDE', 42.1864, -86.3689, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('paw_paw_mi', '04102148', 'SOUTH BRANCH PAW PAW RIVER NEAR PAW PAW, MI', 'usgs', 'NEAR PAW PAW', 42.2006, -85.9014, false);

-- Clinton River (MI) — 5 gauges
delete from public.river_gauges where river_id = 'clinton_mi';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('clinton_mi', '04161000', 'CLINTON RIVER AT AUBURN HILLS, MI', 'usgs', 'AT AUBURN HILLS', 42.6334, -83.2244, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('clinton_mi', '04161820', 'CLINTON RIVER AT STERLING HEIGHTS, MI', 'usgs', 'AT STERLING HEIGHTS', 42.6145, -83.0266, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('clinton_mi', '04164000', 'CLINTON RIVER NEAR FRASER, MI', 'usgs', 'NEAR FRASER', 42.5778, -82.9516, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('clinton_mi', '04164151', 'N BRANCH CLINTON R AT 26 MILE NR MEADE, MI', 'usgs', 'AT 26 MILE NR MEADE', 42.7172, -82.9046, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('clinton_mi', '04164500', 'NORTH BRANCH CLINTON RIVER NEAR MT. CLEMENS, MI', 'usgs', 'NEAR MT. CLEMENS', 42.6292, -82.8888, false);

-- Grand River (MI) — 3 gauges
delete from public.river_gauges where river_id = 'grand_mi';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('grand_mi', '04119400', 'GRAND RIVER NEAR EASTMANVILLE, MI', 'usgs', 'NEAR EASTMANVILLE', 43.0242, -86.0264, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('grand_mi', '04119000', 'GRAND RIVER AT GRAND RAPIDS, MI', 'usgs', 'AT GRAND RAPIDS', 42.9631, -85.6773, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('grand_mi', '04119070', 'GRAND RIVER AT STATE HWY M-11 AT GRANDVILLE, MI', 'usgs', 'AT STATE HWY M-11 AT GRANDVILLE', 42.9153, -85.7673, false);

-- River Raisin (MI) — 2 gauges
delete from public.river_gauges where river_id = 'river_raisin_mi';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('river_raisin_mi', '04176500', 'RIVER RAISIN NEAR MONROE, MI', 'usgs', 'NEAR MONROE', 41.9606, -83.5310, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('river_raisin_mi', '04176000', 'RIVER RAISIN NEAR ADRIAN, MI', 'usgs', 'NEAR ADRIAN', 41.9048, -83.9808, false);

-- South Branch Black River (MI) — 2 gauges
delete from public.river_gauges where river_id = 'south_branch_black_mi';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('south_branch_black_mi', '04102700', 'SOUTH BRANCH BLACK RIVER NEAR BANGOR, MI', 'usgs', 'NEAR BANGOR', 42.3542, -86.1875, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('south_branch_black_mi', '04102148', 'SOUTH BRANCH PAW PAW RIVER NEAR PAW PAW, MI', 'usgs', 'NEAR PAW PAW', 42.2006, -85.9014, false);

-- Ontonagon River (MI) — 3 gauges
delete from public.river_gauges where river_id = 'ontonagon_mi';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('ontonagon_mi', '04040000', 'ONTONAGON RIVER NEAR ROCKLAND, MI', 'usgs', 'NEAR ROCKLAND', 46.7208, -89.2071, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('ontonagon_mi', '04033000', 'MIDDLE BRANCH ONTONAGON RIVER NEAR PAULDING, MI', 'usgs', 'NEAR PAULDING', 46.3569, -89.0765, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('ontonagon_mi', '04036000', 'WEST BRANCH ONTONAGON RIVER NEAR BERGLAND, MI', 'usgs', 'NEAR BERGLAND', 46.5874, -89.5418, false);

-- Paint River (MI) — 2 gauges
delete from public.river_gauges where river_id = 'paint_mi';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('paint_mi', '04061500', 'PAINT RIVER AT CRYSTAL FALLS, MI', 'usgs', 'AT CRYSTAL FALLS', 46.1058, -88.3349, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('paint_mi', '04062000', 'PAINT RIVER NEAR ALPHA, MI', 'usgs', 'NEAR ALPHA', 46.0111, -88.2585, false);

-- Greenbrier River (WV) — 2 gauges
delete from public.river_gauges where river_id = 'greenbrier';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('greenbrier', '03184000', 'GREENBRIER RIVER AT HILLDALE, WV', 'usgs', 'AT HILLDALE', 37.6401, -80.8051, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('greenbrier', '03183500', 'GREENBRIER RIVER AT ALDERSON, WV', 'usgs', 'AT ALDERSON', 37.7243, -80.6415, false);

-- Cheat River (WV) — 3 gauges
delete from public.river_gauges where river_id = 'cheat';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cheat', '03069500', 'CHEAT RIVER NEAR PARSONS, WV', 'usgs', 'NEAR PARSONS', 39.1216, -79.6755, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cheat', '0307020015', 'CHEAT RIVER BELOW SALTLICK CREEK AT ROWLESBURG, WV', 'usgs', 'BELOW SALTLICK CREEK AT ROWLESBURG', 39.3498, -79.6679, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cheat', '03070260', 'CHEAT RIVER AT ALBRIGHT, WV', 'usgs', 'AT ALBRIGHT', 39.4948, -79.6445, false);

-- Tygart Valley River (WV) — 5 gauges
delete from public.river_gauges where river_id = 'tygart';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('tygart', '03054500', 'TYGART VALLEY RIVER AT PHILIPPI, WV', 'usgs', 'AT PHILIPPI', 39.1504, -80.0387, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('tygart', '03050000', 'TYGART VALLEY RIVER NEAR DAILEY, WV', 'usgs', 'NEAR DAILEY', 38.8093, -79.8817, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('tygart', '03051000', 'TYGART VALLEY RIVER AT BELINGTON, WV', 'usgs', 'AT BELINGTON', 39.0293, -79.9359, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('tygart', '03056000', 'TYGART VALLEY R AT TYGART DAM NR GRAFTON, WV', 'usgs', 'AT TYGART DAM NR GRAFTON', 39.3198, -80.0251, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('tygart', '03057000', 'TYGART VALLEY RIVER AT COLFAX, WV', 'usgs', 'AT COLFAX', 39.4351, -80.1326, false);

-- Guyandotte River (WV) — 3 gauges
delete from public.river_gauges where river_id = 'guyandotte_wv';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('guyandotte_wv', '03203600', 'GUYANDOTTE RIVER AT LOGAN, WV', 'usgs', 'AT LOGAN', 37.8423, -81.9760, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('guyandotte_wv', '03202300', 'GUYANDOTTE RIVER AT PINEVILLE, WV', 'usgs', 'AT PINEVILLE', 37.5819, -81.5371, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('guyandotte_wv', '03202400', 'GUYANDOTTE RIVER NEAR BAILEYSVILLE, WV', 'usgs', 'NEAR BAILEYSVILLE', 37.6040, -81.6451, false);

-- Coal River (WV) — 3 gauges
delete from public.river_gauges where river_id = 'coal_wv';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('coal_wv', '03198500', 'BIG COAL RIVER AT ASHFORD, WV', 'usgs', 'AT ASHFORD', 38.1798, -81.7115, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('coal_wv', '03199000', 'LITTLE COAL RIVER AT DANVILLE, WV', 'usgs', 'AT DANVILLE', 38.0798, -81.8365, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('coal_wv', '03200500', 'COAL RIVER AT TORNADO, WV', 'usgs', 'AT TORNADO', 38.3390, -81.8415, false);

-- Arkansas River (CO) — 2 gauges
delete from public.river_gauges where river_id = 'arkansas';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('arkansas', '07091200', 'ARKANSAS RIVER NEAR NATHROP, CO', 'usgs', 'NEAR NATHROP', 38.6522, -106.0511, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('arkansas', '07087050', 'ARKANSAS RIVER BELOW GRANITE, CO', 'usgs', 'BELOW GRANITE', 38.9769, -106.2140, false);

-- Cache la Poudre (CO) — 5 gauges
delete from public.river_gauges where river_id = 'poudre';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('poudre', '06752260', 'CACHE LA POUDRE RIVER AT FORT COLLINS, CO', 'usgs', 'AT FORT COLLINS', 40.5881, -105.0692, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('poudre', '06751145', 'N FK CACHE LA POUDRE R ABV HALLIGAN RES NR VA DALE', 'usgs', 'N FK CACHE LA POUDRE R ABV HALLIGAN RES NR VA DALE', 40.8946, -105.3672, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('poudre', '06751150', 'N FK CACHE LA POUDRE R BLW HALLIGAN RES NR VA DALE', 'usgs', 'N FK CACHE LA POUDRE R BLW HALLIGAN RES NR VA DALE', 40.8783, -105.3380, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('poudre', '06751490', 'NORTH FORK CACHE LA POUDRE RIVER AT LIVERMORE, CO', 'usgs', 'AT LIVERMORE', 40.7875, -105.2522, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('poudre', '06752280', 'CACHE LA POUDRE RIV AB BOXELDER CRK NR TIMNATH, CO', 'usgs', 'CACHE LA POUDRE RIV AB BOXELDER CRK NR TIMNATH, CO', 40.5519, -105.0114, false);

-- Yampa River (CO) — 3 gauges
delete from public.river_gauges where river_id = 'yampa';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('yampa', '09251000', 'YAMPA RIVER NEAR MAYBELL, CO', 'usgs', 'NEAR MAYBELL', 40.5027, -108.0334, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('yampa', '09247600', 'YAMPA RIVER BELOW CRAIG, CO.', 'usgs', 'BELOW CRAIG, CO.', 40.4808, -107.6143, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('yampa', '09260050', 'YAMPA RIVER AT DEERLODGE PARK, CO', 'usgs', 'AT DEERLODGE PARK', 40.4516, -108.5251, false);

-- Blue River (CO) — 4 gauges
delete from public.river_gauges where river_id = 'blue_co';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('blue_co', '09046600', 'BLUE RIVER NEAR DILLON, CO', 'usgs', 'NEAR DILLON', 39.5667, -106.0495, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('blue_co', '09046490', 'BLUE RIVER AT BLUE RIVER, CO.', 'usgs', 'AT BLUE RIVER, CO.', 39.4558, -106.0317, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('blue_co', '09050700', 'BLUE RIVER BELOW DILLON, CO.', 'usgs', 'BELOW DILLON, CO.', 39.6256, -106.0658, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('blue_co', '09057500', 'BLUE RIVER BELOW GREEN MOUNTAIN RESERVOIR, CO', 'usgs', 'BELOW GREEN MOUNTAIN RESERVOIR', 39.8803, -106.3339, false);

-- Roaring Fork River (CO) — 2 gauges
delete from public.river_gauges where river_id = 'roaring_fork';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('roaring_fork', '09085000', 'ROARING FORK RIVER AT GLENWOOD SPRINGS, CO.', 'usgs', 'AT GLENWOOD SPRINGS, CO.', 39.5467, -107.3308, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('roaring_fork', '09081000', 'ROARING FORK RIVER NEAR EMMA, CO', 'usgs', 'NEAR EMMA', 39.3733, -107.0839, false);

-- Eagle River (CO) — 3 gauges
delete from public.river_gauges where river_id = 'eagle';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('eagle', '09070000', 'EAGLE RIVER BELOW GYPSUM, CO.', 'usgs', 'BELOW GYPSUM, CO.', 39.6494, -106.9537, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('eagle', '09067020', 'EAGLE R BLW WASTEWATER TREATMENT PLANT AT AVON, CO', 'usgs', 'AT AVON', 39.6349, -106.5319, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('eagle', '394220106431500', 'EAGLE RIVER BELOW MILK CREEK NEAR WOLCOTT, CO', 'usgs', 'BELOW MILK CREEK NEAR WOLCOTT', 39.7050, -106.7258, false);

-- Taylor River (CO) — 3 gauges
delete from public.river_gauges where river_id = 'taylor';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('taylor', '09110000', 'TAYLOR RIVER AT ALMONT, CO.', 'usgs', 'AT ALMONT, CO.', 38.6644, -106.8447, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('taylor', '09107000', 'TAYLOR RIVER AT TAYLOR PARK, CO.', 'usgs', 'AT TAYLOR PARK, CO.', 38.8603, -106.5667, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('taylor', '09109000', 'TAYLOR RIVER BELOW TAYLOR PARK RESERVOIR, CO.', 'usgs', 'BELOW TAYLOR PARK RESERVOIR, CO.', 38.8183, -106.6092, false);

-- South Platte River (CO) — 3 gauges
delete from public.river_gauges where river_id = 'south_platte';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('south_platte', '06701900', 'SOUTH PLATTE RIVER BLW BRUSH CRK NEAR TRUMBULL, CO', 'usgs', 'NEAR TRUMBULL', 39.2600, -105.2219, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('south_platte', '06700000', 'SOUTH PLATTE RIVER ABOVE CHEESMAN LAKE, CO.', 'usgs', 'ABOVE CHEESMAN LAKE, CO.', 39.1628, -105.3097, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('south_platte', '06710247', 'SOUTH PLATTE RIVER BELOW UNION AVE, AT ENGLEWOOD,C', 'usgs', 'BELOW UNION AVE, AT ENGLEWOOD,C', 39.6325, -105.0150, false);

-- Gunnison River — Main (CO) — 4 gauges
delete from public.river_gauges where river_id = 'gunnison_main';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('gunnison_main', '09144250', 'GUNNISON RIVER AT DELTA, CO', 'usgs', 'AT DELTA', 38.7530, -108.0784, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('gunnison_main', '09128000', 'GUNNISON RIVER BELOW GUNNISON TUNNEL, CO', 'usgs', 'BELOW GUNNISON TUNNEL', 38.5292, -107.6489, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('gunnison_main', '09136100', 'NORTH FK GUNNISON RIVER ABOVE MOUTH NR LAZEAR, CO', 'usgs', 'ABOVE MOUTH NR LAZEAR', 38.7852, -107.8334, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('gunnison_main', '09152500', 'GUNNISON RIVER NEAR GRAND JUNCTION, CO.', 'usgs', 'NEAR GRAND JUNCTION, CO.', 38.9833, -108.4506, false);

-- Colorado River — Upper (CO) — 3 gauges
delete from public.river_gauges where river_id = 'colorado_pumphouse';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('colorado_pumphouse', '09058000', 'COLORADO RIVER NEAR KREMMLING, CO', 'usgs', 'NEAR KREMMLING', 40.0367, -106.4400, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('colorado_pumphouse', '09034250', 'COLORADO RIVER AT WINDY GAP, NEAR GRANBY, CO.', 'usgs', 'AT WINDY GAP, NEAR GRANBY, CO.', 40.1083, -106.0042, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('colorado_pumphouse', '09060799', 'COLORADO RIVER AT CATAMOUNT BRIDGE, CO', 'usgs', 'AT CATAMOUNT BRIDGE', 39.8911, -106.8317, false);

-- Dolores River (CO) — 3 gauges
delete from public.river_gauges where river_id = 'dolores_co';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('dolores_co', '09168730', 'DOLORES RIVER NEAR SLICK ROCK, CO', 'usgs', 'NEAR SLICK ROCK', 38.0444, -108.9054, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('dolores_co', '09169500', 'DOLORES RIVER AT BEDROCK, CO', 'usgs', 'AT BEDROCK', 38.3103, -108.8854, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('dolores_co', '09171100', 'DOLORES RIVER NEAR BEDROCK, CO.', 'usgs', 'NEAR BEDROCK, CO.', 38.3569, -108.8335, false);

-- Colorado River (CO) — 3 gauges
delete from public.river_gauges where river_id = 'colorado_co';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('colorado_co', '09070500', 'COLORADO RIVER NEAR DOTSERO, CO', 'usgs', 'NEAR DOTSERO', 39.6446, -107.0780, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('colorado_co', '09060799', 'COLORADO RIVER AT CATAMOUNT BRIDGE, CO', 'usgs', 'AT CATAMOUNT BRIDGE', 39.8911, -106.8317, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('colorado_co', '09085100', 'COLORADO RIVER BELOW GLENWOOD SPRINGS, CO', 'usgs', 'BELOW GLENWOOD SPRINGS', 39.5550, -107.3376, false);

-- Gunnison River (CO) — 4 gauges
delete from public.river_gauges where river_id = 'gunnison_co';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('gunnison_co', '09144250', 'GUNNISON RIVER AT DELTA, CO', 'usgs', 'AT DELTA', 38.7530, -108.0784, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('gunnison_co', '09128000', 'GUNNISON RIVER BELOW GUNNISON TUNNEL, CO', 'usgs', 'BELOW GUNNISON TUNNEL', 38.5292, -107.6489, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('gunnison_co', '09136100', 'NORTH FK GUNNISON RIVER ABOVE MOUTH NR LAZEAR, CO', 'usgs', 'ABOVE MOUTH NR LAZEAR', 38.7852, -107.8334, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('gunnison_co', '09152500', 'GUNNISON RIVER NEAR GRAND JUNCTION, CO.', 'usgs', 'NEAR GRAND JUNCTION, CO.', 38.9833, -108.4506, false);

-- Fraser River (CO) — 3 gauges
delete from public.river_gauges where river_id = 'fraser_co';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('fraser_co', '09033300', 'FRASER RIVER BLW CROOKED CR AT TABERNASH CO', 'usgs', 'AT TABERNASH CO', 40.0069, -105.8483, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('fraser_co', '09022000', 'FRASER RIVER AT UPPER STA, NEAR WINTER PARK, CO.', 'usgs', 'AT UPPER STA, NEAR WINTER PARK, CO.', 39.8458, -105.7514, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('fraser_co', '09024000', 'FRASER RIVER AT WINTER PARK, CO.', 'usgs', 'AT WINTER PARK, CO.', 39.9000, -105.7767, false);

-- San Miguel River (CO) — 4 gauges
delete from public.river_gauges where river_id = 'san_miguel_co';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('san_miguel_co', '09172500', 'SAN MIGUEL RIVER NEAR PLACERVILLE, CO', 'usgs', 'NEAR PLACERVILLE', 38.0307, -108.1103, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('san_miguel_co', '09171240', 'LAKE FORK SAN MIGUEL RV ABV TROUT LAKE NR OPHIR CO', 'usgs', 'LAKE FORK SAN MIGUEL RV ABV TROUT LAKE NR OPHIR CO', 37.8178, -107.8791, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('san_miguel_co', '09171310', 'SOUTH FORK SAN MIGUEL RIVER NEAR OPHIR, CO', 'usgs', 'NEAR OPHIR', 37.8731, -107.8944, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('san_miguel_co', '09174600', 'SAN MIGUEL RIVER AT BROOKS BRIDGE NEAR NUCLA CO', 'usgs', 'AT BROOKS BRIDGE NEAR NUCLA CO', 38.2442, -108.5014, false);

-- Salmon River — Main (ID) — 2 gauges
delete from public.river_gauges where river_id = 'salmon';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('salmon', '13302500', 'SALMON RIVER AT SALMON ID', 'usgs', 'AT SALMON ID', 45.1836, -113.8953, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('salmon', '13307000', 'SALMON RIVER NR SHOUP ID', 'usgs', 'SALMON RIVER NR SHOUP ID', 45.3225, -114.4400, false);

-- Priest River (ID) — 2 gauges
delete from public.river_gauges where river_id = 'priest';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('priest', '12395000', 'Priest River near Priest River, ID', 'usgs', 'Near Priest River', 48.2085, -116.9146, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('priest', '12393501', 'PRIEST R OUTFLOW NR COOLIN, ID', 'usgs', 'PRIEST R OUTFLOW NR COOLIN, ID', 48.4880, -116.9086, false);

-- Salmon River (ID) — 2 gauges
delete from public.river_gauges where river_id = 'salmon_id';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('salmon_id', '13310199', 'MF SALMON RIVER AT MOUTH NR SHOUP, ID', 'usgs', 'AT MOUTH NR SHOUP', 45.2936, -114.5964, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('salmon_id', '13307000', 'SALMON RIVER NR SHOUP ID', 'usgs', 'SALMON RIVER NR SHOUP ID', 45.3225, -114.4400, false);

-- Clearwater River (ID) — 3 gauges
delete from public.river_gauges where river_id = 'clearwater_id';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('clearwater_id', '13341050', 'CLEARWATER RIVER NR PECK ID', 'usgs', 'CLEARWATER RIVER NR PECK ID', 46.5003, -116.3925, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('clearwater_id', '13340000', 'CLEARWATER RIVER AT OROFINO ID', 'usgs', 'AT OROFINO ID', 46.4783, -116.2575, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('clearwater_id', '13342500', 'CLEARWATER RIVER AT SPALDING ID', 'usgs', 'AT SPALDING ID', 46.4483, -116.8275, false);

-- Big Wood River (ID) — 5 gauges
delete from public.river_gauges where river_id = 'big_wood_id';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('big_wood_id', '13139510', 'BIG WOOD RIVER AT HAILEY ID TOTAL FLOW', 'usgs', 'AT HAILEY ID TOTAL FLOW', 43.5172, -114.3217, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('big_wood_id', '13135500', 'BIG WOOD RIVER NR KETCHUM ID', 'usgs', 'BIG WOOD RIVER NR KETCHUM ID', 43.7863, -114.4251, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('big_wood_id', '13135520', 'NF BIG WOOD RIVER NR SAWTOOTH NRA HQ NR KETCHUM ID', 'usgs', 'NF BIG WOOD RIVER NR SAWTOOTH NRA HQ NR KETCHUM ID', 43.7861, -114.4192, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('big_wood_id', '13138000', 'EAST FORK BIG WOOD RIVER AT GIMLET ID', 'usgs', 'AT GIMLET ID', 43.6031, -114.3303, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('big_wood_id', '13140335', 'BIG WOOD R AT S BROADFORD BRIDGE NR BELLEVUE, ID', 'usgs', 'AT S BROADFORD BRIDGE NR BELLEVUE', 43.4680, -114.2677, false);

-- Blackfoot River (ID) — 5 gauges
delete from public.river_gauges where river_id = 'blackfoot_id';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('blackfoot_id', '13066000', 'BLACKFOOT RIVER NR SHELLEY ID', 'usgs', 'BLACKFOOT RIVER NR SHELLEY ID', 43.2628, -112.0478, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('blackfoot_id', '13068300', 'BLACKFOOT RIVER BELOW NORTH CANAL AT BLACKFOOT ID', 'usgs', 'BELOW NORTH CANAL AT BLACKFOOT ID', 43.1683, -112.3347, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('blackfoot_id', '13068495', 'BLACKFOOT RIVER BYPASS NR BLACKFOOT ID', 'usgs', 'BLACKFOOT RIVER BYPASS NR BLACKFOOT ID', 43.1708, -112.3878, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('blackfoot_id', '13068500', 'BLACKFOOT RIVER NR BLACKFOOT ID', 'usgs', 'BLACKFOOT RIVER NR BLACKFOOT ID', 43.1306, -112.4767, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('blackfoot_id', '13068501', 'BLACKFOOT RIVER AND BYPASS CHANNEL NR BLACKFOOT ID', 'usgs', 'BLACKFOOT RIVER AND BYPASS CHANNEL NR BLACKFOOT ID', 43.1305, -112.4772, false);

-- Teton River (ID) — 4 gauges
delete from public.river_gauges where river_id = 'teton_id';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('teton_id', '13055000', 'TETON RIVER NR ST ANTHONY ID', 'usgs', 'TETON RIVER NR ST ANTHONY ID', 43.9272, -111.6139, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('teton_id', '13052200', 'TETON RIVER AB SOUTH LEIGH CREEK NR DRIGGS ID', 'usgs', 'TETON RIVER AB SOUTH LEIGH CREEK NR DRIGGS ID', 43.7819, -111.2092, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('teton_id', '13055250', 'NF TETON RIVER NR SUGAR CITY ID', 'usgs', 'NF TETON RIVER NR SUGAR CITY ID', 43.8875, -111.7578, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('teton_id', '13055340', 'SF TETON RIVER NEAR REXBURG ID', 'usgs', 'NEAR REXBURG ID', 43.8350, -111.7778, false);

-- Bear River (ID) — 3 gauges
delete from public.river_gauges where river_id = 'bear_id';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('bear_id', '10086500', 'BEAR RIVER BL UPL TAILRACE AT ONEIDA ID', 'usgs', 'AT ONEIDA ID', 42.2666, -111.7519, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('bear_id', '10068500', 'BEAR RIVER AT PESCADERO ID', 'usgs', 'AT PESCADERO ID', 42.4016, -111.3569, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('bear_id', '10092700', 'BEAR RIVER AT IDAHO-UTAH STATE LINE', 'usgs', 'AT IDAHO-UTAH STATE LINE', 42.0130, -111.9213, false);

-- Payette River, South Fork (ID) — 3 gauges
delete from public.river_gauges where river_id = 'payette_river_south_id';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('payette_river_south_id', '13235000', 'SOUTH FORK PAYETTE RIVER AT LOWMAN, ID', 'usgs', 'AT LOWMAN', 44.0853, -115.6222, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('payette_river_south_id', '13237920', 'MIDDLE FORK PAYETTE RIVER NR CROUCH ID', 'usgs', 'MIDDLE FORK PAYETTE RIVER NR CROUCH ID', 44.1086, -115.9822, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('payette_river_south_id', '13246000', 'NF PAYETTE RIVER NR BANKS ID', 'usgs', 'NF PAYETTE RIVER NR BANKS ID', 44.1142, -116.1072, false);

-- Payette River (ID) — 5 gauges
delete from public.river_gauges where river_id = 'payette_id';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('payette_id', '13246000', 'NF PAYETTE RIVER NR BANKS ID', 'usgs', 'NF PAYETTE RIVER NR BANKS ID', 44.1142, -116.1072, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('payette_id', '13235000', 'SOUTH FORK PAYETTE RIVER AT LOWMAN, ID', 'usgs', 'AT LOWMAN', 44.0853, -115.6222, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('payette_id', '13237920', 'MIDDLE FORK PAYETTE RIVER NR CROUCH ID', 'usgs', 'MIDDLE FORK PAYETTE RIVER NR CROUCH ID', 44.1086, -115.9822, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('payette_id', '13247500', 'PAYETTE RIVER NR HORSESHOE BEND ID', 'usgs', 'PAYETTE RIVER NR HORSESHOE BEND ID', 43.9433, -116.1967, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('payette_id', '13249500', 'PAYETTE RIVER NR EMMETT ID', 'usgs', 'PAYETTE RIVER NR EMMETT ID', 43.9306, -116.4428, false);

-- Rogue River (OR) — 3 gauges
delete from public.river_gauges where river_id = 'rogue';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('rogue', '14361500', 'ROGUE RIVER AT GRANTS PASS, OR', 'usgs', 'AT GRANTS PASS', 42.4304, -123.3178, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('rogue', '14339000', 'ROGUE RIVER AT DODGE BRIDGE, NEAR EAGLE POINT, OR', 'usgs', 'AT DODGE BRIDGE, NEAR EAGLE POINT', 42.5248, -122.8428, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('rogue', '14359000', 'ROGUE RIVER AT RAYGOLD NEAR CENTRAL POINT, OR', 'usgs', 'AT RAYGOLD NEAR CENTRAL POINT', 42.4373, -122.9873, false);

-- Deschutes River (OR) — 2 gauges
delete from public.river_gauges where river_id = 'deschutes';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('deschutes', '14092500', 'DESCHUTES RIVER NEAR MADRAS, OR', 'usgs', 'NEAR MADRAS', 44.7260, -121.2470, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('deschutes', '14076500', 'DESCHUTES RIVER NEAR CULVER, OR', 'usgs', 'NEAR CULVER', 44.4987, -121.3212, false);

-- McKenzie River (OR) — 5 gauges
delete from public.river_gauges where river_id = 'mckenzie';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('mckenzie', '14162500', 'MCKENZIE RIVER NEAR VIDA, OR', 'usgs', 'NEAR VIDA', 44.1248, -122.4706, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('mckenzie', '14158500', 'MCKENZIE RIVER AT OUTLET OF CLEAR LAKE, OR', 'usgs', 'AT OUTLET OF CLEAR LAKE', 44.3610, -121.9956, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('mckenzie', '14158740', 'MCKENZIE RIVER BL PAYNE CR, NR BELKNAP SPRINGS, OR', 'usgs', 'MCKENZIE RIVER BL PAYNE CR, NR BELKNAP SPRINGS, OR', 44.2864, -122.0368, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('mckenzie', '14158850', 'MCKENZIE R BLW TRAIL BR DAM NR BELKNAP SPRINGS, OR', 'usgs', 'MCKENZIE R BLW TRAIL BR DAM NR BELKNAP SPRINGS, OR', 44.2679, -122.0498, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('mckenzie', '14159200', 'SO FK MCKENZIE RIVER ABV COUGAR LAKE NR RAINBOW OR', 'usgs', 'SO FK MCKENZIE RIVER ABV COUGAR LAKE NR RAINBOW OR', 44.0471, -122.2178, false);

-- Illinois River (OR) — 2 gauges
delete from public.river_gauges where river_id = 'illinois_or';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('illinois_or', '14377100', 'ILLINOIS RIVER NEAR KERBY, OR', 'usgs', 'NEAR KERBY', 42.2318, -123.6637, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('illinois_or', '14378200', 'ILLINOIS RIVER NEAR AGNESS, OR', 'usgs', 'NEAR AGNESS', 42.5449, -124.0519, false);

-- Sandy River (OR) — 3 gauges
delete from public.river_gauges where river_id = 'sandy';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('sandy', '14142500', 'SANDY RIVER BLW BULL RUN RIVER, NR BULL RUN, OR', 'usgs', 'SANDY RIVER BLW BULL RUN RIVER, NR BULL RUN, OR', 45.4490, -122.2451, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('sandy', '14137000', 'SANDY RIVER NEAR MARMOT, OR', 'usgs', 'NEAR MARMOT', 45.3996, -122.1373, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('sandy', '14141500', 'LITTLE SANDY RIVER NEAR BULL RUN, OR', 'usgs', 'NEAR BULL RUN', 45.4154, -122.1715, false);

-- Willamette River (OR) — 4 gauges
delete from public.river_gauges where river_id = 'willamette_or';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('willamette_or', '14174000', 'WILLAMETTE RIVER AT ALBANY, OR', 'usgs', 'AT ALBANY', 44.6387, -123.1068, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('willamette_or', '14166000', 'WILLAMETTE RIVER AT HARRISBURG, OR', 'usgs', 'AT HARRISBURG', 44.2704, -123.1737, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('willamette_or', '14171600', 'WILLAMETTE RIVER AT CORVALLIS, OR', 'usgs', 'AT CORVALLIS', 44.5664, -123.2568, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('willamette_or', '14191000', 'WILLAMETTE RIVER AT SALEM, OR', 'usgs', 'AT SALEM', 44.9443, -123.0429, false);

-- Umpqua River (OR) — 3 gauges
delete from public.river_gauges where river_id = 'umpqua_or';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('umpqua_or', '14321000', 'UMPQUA RIVER NEAR ELKTON, OR', 'usgs', 'NEAR ELKTON', 43.5860, -123.5554, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('umpqua_or', '14312330', 'SOUTH UMPQUA RIVER AT MELROSE, OR', 'usgs', 'AT MELROSE', 43.2518, -123.4477, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('umpqua_or', '14319500', 'NORTH UMPQUA RIVER AT WINCHESTER, OR', 'usgs', 'AT WINCHESTER', 43.2710, -123.4115, false);

-- Umpqua River, South Fork (OR) — 5 gauges
delete from public.river_gauges where river_id = 'umpqua_river_south_or';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('umpqua_river_south_or', '14312000', 'SOUTH UMPQUA RIVER NEAR BROCKWAY, OR', 'usgs', 'NEAR BROCKWAY', 43.1332, -123.3984, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('umpqua_river_south_or', '14308000', 'SOUTH UMPQUA RIVER AT TILLER, OR', 'usgs', 'AT TILLER', 42.9304, -122.9484, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('umpqua_river_south_or', '14308910', 'S UMPQUA RIVER AT CANYONVILLE, OR', 'usgs', 'AT CANYONVILLE', 42.9437, -123.2859, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('umpqua_river_south_or', '14312330', 'SOUTH UMPQUA RIVER AT MELROSE, OR', 'usgs', 'AT MELROSE', 43.2518, -123.4477, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('umpqua_river_south_or', '14319500', 'NORTH UMPQUA RIVER AT WINCHESTER, OR', 'usgs', 'AT WINCHESTER', 43.2710, -123.4115, false);

-- Siuslaw River (OR) — 2 gauges
delete from public.river_gauges where river_id = 'siuslaw_or';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('siuslaw_or', '14307620', 'SIUSLAW RIVER NEAR MAPLETON, OR', 'usgs', 'NEAR MAPLETON', 44.0623, -123.8832, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('siuslaw_or', '14306950', 'SIUSLAW RIVER NEAR ALMA, OR', 'usgs', 'NEAR ALMA', 43.9211, -123.6116, false);

-- Crooked River (OR) — 2 gauges
delete from public.river_gauges where river_id = 'crooked_or';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('crooked_or', '14087380', 'CROOKED RIVER BLW OSBORNE CANYON, NR OPAL CITY, OR', 'usgs', 'CROOKED RIVER BLW OSBORNE CANYON, NR OPAL CITY, OR', 44.4269, -121.2329, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('crooked_or', '14087400', 'CROOKED RIVER BELOW OPAL SPRINGS, NEAR CULVER, OR', 'usgs', 'BELOW OPAL SPRINGS, NEAR CULVER', 44.4923, -121.2984, false);

-- Molalla River (OR) — 2 gauges
delete from public.river_gauges where river_id = 'molalla_or';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('molalla_or', '14198500', 'MOLALLA R AB PC NR WILHOIT, OR', 'usgs', 'MOLALLA R AB PC NR WILHOIT, OR', 45.0097, -122.4809, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('molalla_or', '14200000', 'MOLALLA RIVER NEAR CANBY, OR', 'usgs', 'NEAR CANBY', 45.2439, -122.6874, false);

-- Quartzville Creek (OR) — 2 gauges
delete from public.river_gauges where river_id = 'quartzville_or';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('quartzville_or', '14185865', 'QUARTZVILLE CREEK BLW GALENA CREEK NR CASCADIA, OR', 'usgs', 'QUARTZVILLE CREEK BLW GALENA CREEK NR CASCADIA, OR', 44.5811, -122.3350, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('quartzville_or', '14185900', 'QUARTZVILLE CREEK NEAR CASCADIA, OR', 'usgs', 'NEAR CASCADIA', 44.5401, -122.4359, false);

-- Wenatchee River (WA) — 3 gauges
delete from public.river_gauges where river_id = 'wenatchee';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('wenatchee', '12462500', 'WENATCHEE RIVER AT MONITOR, WA', 'usgs', 'AT MONITOR', 47.4993, -120.4245, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('wenatchee', '12457000', 'WENATCHEE RIVER AT PLAIN, WA', 'usgs', 'AT PLAIN', 47.7629, -120.6662, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('wenatchee', '12459000', 'WENATCHEE RIVER AT PESHASTIN, WA', 'usgs', 'AT PESHASTIN', 47.5831, -120.6195, false);

-- Methow River (WA) — 3 gauges
delete from public.river_gauges where river_id = 'methow';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('methow', '12449950', 'METHOW RIVER NEAR PATEROS, WA', 'usgs', 'NEAR PATEROS', 48.0774, -119.9851, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('methow', '12448500', 'METHOW RIVER AT WINTHROP, WA', 'usgs', 'AT WINTHROP', 48.4735, -120.1773, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('methow', '12449500', 'METHOW RIVER AT TWISP, WA', 'usgs', 'AT TWISP', 48.3651, -120.1162, false);

-- Skagit River (WA) — 3 gauges
delete from public.river_gauges where river_id = 'skagit';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('skagit', '12178000', 'SKAGIT RIVER AT NEWHALEM, WA', 'usgs', 'AT NEWHALEM', 48.6718, -121.2462, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('skagit', '12181000', 'SKAGIT RIVER AT MARBLEMOUNT, WA', 'usgs', 'AT MARBLEMOUNT', 48.5337, -121.4298, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('skagit', '12194000', 'SKAGIT RIVER NEAR CONCRETE, WA', 'usgs', 'NEAR CONCRETE', 48.5243, -121.7710, false);

-- Skykomish River (WA) — 2 gauges
delete from public.river_gauges where river_id = 'skykomish';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('skykomish', '12134500', 'SKYKOMISH RIVER NEAR GOLD BAR, WA', 'usgs', 'NEAR GOLD BAR', 47.8373, -121.6668, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('skykomish', '12131500', 'SOUTH FORK SKYKOMISH RIVER AT SKYKOMISH, WA', 'usgs', 'AT SKYKOMISH', 47.7110, -121.3607, false);

-- Sauk River (WA) — 2 gauges
delete from public.river_gauges where river_id = 'sauk';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('sauk', '12189500', 'SAUK RIVER NEAR SAUK, WA', 'usgs', 'NEAR SAUK', 48.4246, -121.5685, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('sauk', '12186000', 'SAUK RIVER AB WHITE CHUCK RIVER NR  DARRINGTON, WA', 'usgs', 'SAUK RIVER AB WHITE CHUCK RIVER NR  DARRINGTON, WA', 48.1687, -121.4707, false);

-- Green River (WA) — 5 gauges
delete from public.river_gauges where river_id = 'green_wa';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('green_wa', '12113000', 'GREEN RIVER NEAR AUBURN, WA', 'usgs', 'NEAR AUBURN', 47.3123, -122.2040, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('green_wa', '12105900', 'GREEN RIVER BELOW HOWARD A HANSON DAM, WA', 'usgs', 'BELOW HOWARD A HANSON DAM', 47.2837, -121.7979, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('green_wa', '12106700', 'GREEN RIVER AT PURIFICATION PLANT NEAR PALMER, WA', 'usgs', 'AT PURIFICATION PLANT NEAR PALMER', 47.3051, -121.8507, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('green_wa', '12108800', 'GREEN RIVER BELOW CRISP CREEK NR BLACK DIAMOND, WA', 'usgs', 'BELOW CRISP CREEK NR BLACK DIAMOND', 47.2848, -122.0829, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('green_wa', '12113150', 'GREEN RIVER ABOVE S 277TH ST AT KENT, WA', 'usgs', 'ABOVE S 277TH ST AT KENT', 47.3534, -122.2085, false);

-- Yakima River (WA) — 2 gauges
delete from public.river_gauges where river_id = 'yakima_wa';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('yakima_wa', '12484500', 'YAKIMA RIVER AT UMTANUM, WA', 'usgs', 'AT UMTANUM', 46.8626, -120.4801, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('yakima_wa', '12500450', 'YAKIMA RIVER ABOVE AHTANUM CREEK AT UNION GAP, WA', 'usgs', 'ABOVE AHTANUM CREEK AT UNION GAP', 46.5343, -120.4673, false);

-- Sultan River (WA) — 3 gauges
delete from public.river_gauges where river_id = 'sultan_wa';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('sultan_wa', '12138160', 'SULTAN RIVER BELOW POWERPLANT NEAR SULTAN, WA', 'usgs', 'BELOW POWERPLANT NEAR SULTAN', 47.9073, -121.8154, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('sultan_wa', '12137290', 'SOUTH FORK SULTAN RIVER NEAR SULTAN, WA', 'usgs', 'NEAR SULTAN', 47.9473, -121.6268, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('sultan_wa', '12137800', 'SULTAN RIVER BELOW DIVERSION DAM NEAR SULTAN, WA', 'usgs', 'BELOW DIVERSION DAM NEAR SULTAN', 47.9593, -121.7973, false);

-- Pine Creek (PA) — 2 gauges
delete from public.river_gauges where river_id = 'pinecreek';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('pinecreek', '01549700', 'Pine Creek bl L Pine Creek near Waterville, PA', 'usgs', 'Near Waterville', 41.2736, -77.3241, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('pinecreek', '01548500', 'Pine Creek at Cedar Run, PA', 'usgs', 'At Cedar Run', 41.5217, -77.4475, false);

-- Clarion River (PA) — 5 gauges
delete from public.river_gauges where river_id = 'clarion';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('clarion', '03028500', 'Clarion River at Johnsonburg, PA', 'usgs', 'At Johnsonburg', 41.4862, -78.6784, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('clarion', '03027500', 'EB Clarion River at EB Clarion River Dam, PA', 'usgs', 'At EB Clarion River Dam', 41.5531, -78.5961, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('clarion', '03028000', 'West Branch Clarion River at Wilcox, PA', 'usgs', 'At Wilcox', 41.5753, -78.6922, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('clarion', '03029000', 'Clarion River at Ridgway, PA', 'usgs', 'At Ridgway', 41.4209, -78.7359, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('clarion', '03029500', 'Clarion River at Cooksburg, PA', 'usgs', 'At Cooksburg', 41.3306, -79.2089, false);

-- Lehigh River (PA) — 5 gauges
delete from public.river_gauges where river_id = 'lehigh';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('lehigh', '01451000', 'Lehigh River at Walnutport, PA', 'usgs', 'At Walnutport', 40.7570, -75.6030, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('lehigh', '01447500', 'Lehigh River at Stoddartsville, PA', 'usgs', 'At Stoddartsville', 41.1303, -75.6255, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('lehigh', '01447800', 'Lehigh R bl Francis E Walter Res nr White Haven PA', 'usgs', 'Lehigh R bl Francis E Walter Res nr White Haven PA', 41.1047, -75.7321, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('lehigh', '01449000', 'Lehigh River at Lehighton, PA', 'usgs', 'At Lehighton', 40.8293, -75.7052, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('lehigh', '01451380', 'Little Lehigh Creek near Trexlertown, PA', 'usgs', 'Near Trexlertown', 40.5311, -75.6005, false);

-- Susquehanna River (PA) — 2 gauges
delete from public.river_gauges where river_id = 'susquehanna';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('susquehanna', '01570500', 'Susquehanna River at Harrisburg, PA', 'usgs', 'At Harrisburg', 40.2547, -76.8861, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('susquehanna', '01576000', 'Susquehanna River at Marietta, PA', 'usgs', 'At Marietta', 40.0545, -76.5308, false);

-- Schuylkill River (PA) — 3 gauges
delete from public.river_gauges where river_id = 'schuylkill';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('schuylkill', '01474500', 'Schuylkill River at Philadelphia, PA', 'usgs', 'At Philadelphia', 39.9678, -75.1885, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('schuylkill', '01473500', 'Schuylkill River at Norristown, PA', 'usgs', 'At Norristown', 40.1156, -75.3561, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('schuylkill', '01473730', 'Schuylkill River at Conshohocken, PA', 'usgs', 'At Conshohocken', 40.0707, -75.3096, false);

-- Juniata River (PA) — 2 gauges
delete from public.river_gauges where river_id = 'juniata';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('juniata', '01567000', 'Juniata River at Newport, PA', 'usgs', 'At Newport', 40.4784, -77.1291, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('juniata', '01564895', 'Juniata River at Lewistown, PA', 'usgs', 'At Lewistown', 40.5945, -77.5825, false);

-- Lackawaxen River (PA) — 5 gauges
delete from public.river_gauges where river_id = 'lackawaxen';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('lackawaxen', '01431500', 'Lackawaxen River at Hawley, PA', 'usgs', 'At Hawley', 41.4762, -75.1721, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('lackawaxen', '01428750', 'West Branch Lackawaxen River near Aldenville, PA', 'usgs', 'Near Aldenville', 41.6745, -75.3760, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('lackawaxen', '01429000', 'West Branch Lackawaxen River at Prompton, PA', 'usgs', 'At Prompton', 41.5872, -75.3268, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('lackawaxen', '01430000', 'Lackawaxen River near Honesdale, PA', 'usgs', 'Near Honesdale', 41.5619, -75.2479, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('lackawaxen', '01432055', 'Lackawaxen River near Baoba, PA', 'usgs', 'Near Baoba', 41.4694, -75.1089, false);

-- Kettle Creek (PA) — 2 gauges
delete from public.river_gauges where river_id = 'kettle_creek_pa';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('kettle_creek_pa', '01545000', 'Kettle Creek near Westport, PA', 'usgs', 'Near Westport', 41.3195, -77.8739, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('kettle_creek_pa', '01544500', 'Kettle Creek at Cross Fork, PA', 'usgs', 'At Cross Fork', 41.4758, -77.8258, false);

-- Allegheny River (PA) — 3 gauges
delete from public.river_gauges where river_id = 'allegheny';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('allegheny', '03025500', 'Allegheny River at Franklin, PA', 'usgs', 'At Franklin', 41.3895, -79.8203, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('allegheny', '03016000', 'Allegheny River at West Hickory, PA', 'usgs', 'At West Hickory', 41.5709, -79.4078, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('allegheny', '03031500', 'Allegheny River at Parker, PA', 'usgs', 'At Parker', 41.1006, -79.6812, false);

-- Spring Creek (PA) — 3 gauges
delete from public.river_gauges where river_id = 'spring_creek_pa';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('spring_creek_pa', '01546500', 'Spring Creek near Axemann, PA', 'usgs', 'Near Axemann', 40.8898, -77.7942, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('spring_creek_pa', '01546400', 'Spring Creek at Houserville, PA', 'usgs', 'At Houserville', 40.8337, -77.8275, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('spring_creek_pa', '01547100', 'Spring Creek at Milesburg, PA', 'usgs', 'At Milesburg', 40.9317, -77.7855, false);

-- Brodhead Creek (PA) — 2 gauges
delete from public.river_gauges where river_id = 'brodhead_pa';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('brodhead_pa', '01442500', 'Brodhead Creek at Minisink Hills, PA', 'usgs', 'At Minisink Hills', 40.9987, -75.1427, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('brodhead_pa', '01440400', 'Brodhead Creek near Analomink, PA', 'usgs', 'Near Analomink', 41.0848, -75.2146, false);

-- West Branch Susquehanna River (PA) — 2 gauges
delete from public.river_gauges where river_id = 'west_branch_susquehanna_pa';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('west_branch_susquehanna_pa', '01541303', 'West Branch Susquehanna River at Hyde, PA', 'usgs', 'At Hyde', 41.0045, -78.4567, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('west_branch_susquehanna_pa', '01541000', 'West Branch Susquehanna River at Bower, PA', 'usgs', 'At Bower', 40.8970, -78.6769, false);

-- Delaware River (PA) — 3 gauges
delete from public.river_gauges where river_id = 'delaware_pa_2';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('delaware_pa_2', '01438500', 'Delaware River at Montague NJ', 'usgs', 'At Montague NJ', 41.3092, -74.7953, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('delaware_pa_2', '01432160', 'DELAWARE RIVER AT BARRYVILLE NY', 'usgs', 'AT BARRYVILLE NY', 41.4748, -74.9133, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('delaware_pa_2', '01434000', 'DELAWARE RIVER AT PORT JERVIS NY', 'usgs', 'AT PORT JERVIS NY', 41.3706, -74.6971, false);

-- French Creek (PA) — 5 gauges
delete from public.river_gauges where river_id = 'french_pa';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('french_pa', '03021890', 'French Creek at Cambridge Springs, PA', 'usgs', 'At Cambridge Springs', 41.8072, -80.0633, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('french_pa', '03021350', 'French Creek near Wattsburg, PA', 'usgs', 'Near Wattsburg', 42.0153, -79.7826, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('french_pa', '03021520', 'French Creek near Union City, PA', 'usgs', 'Near Union City', 41.9078, -79.8967, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('french_pa', '03023100', 'French Creek at Meadville, PA', 'usgs', 'At Meadville', 41.6326, -80.1595, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('french_pa', '03024000', 'French Creek at Utica, PA', 'usgs', 'At Utica', 41.4376, -79.9559, false);

-- Raystown Branch Juniata River (PA) — 2 gauges
delete from public.river_gauges where river_id = 'raystown_branch_juniata_pa';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('raystown_branch_juniata_pa', '01559790', 'Raystown Branch Juniata River at Wolfsburg, PA', 'usgs', 'At Wolfsburg', 40.0459, -78.5289, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('raystown_branch_juniata_pa', '01562000', 'Raystown Branch Juniata River at Saxton, PA', 'usgs', 'At Saxton', 40.2159, -78.2653, false);

-- Ohio River (PA) — 2 gauges
delete from public.river_gauges where river_id = 'ohio_pa';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('ohio_pa', '03086001', 'Ohio River (lower pool) at Sewickley, PA', 'usgs', 'At Sewickley', 40.5497, -80.2069, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('ohio_pa', '03086000', 'Ohio River at Sewickley, PA', 'usgs', 'At Sewickley', 40.5492, -80.2056, false);

-- Swatara Creek (PA) — 5 gauges
delete from public.river_gauges where river_id = 'swatara_pa';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('swatara_pa', '01573000', 'Swatara Creek at Harper Tavern, PA', 'usgs', 'At Harper Tavern', 40.4025, -76.5772, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('swatara_pa', '01572025', 'Swatara Creek near Pine Grove, PA', 'usgs', 'Near Pine Grove', 40.5326, -76.4022, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('swatara_pa', '01572190', 'Swatara Creek near Inwood, PA', 'usgs', 'Near Inwood', 40.4793, -76.5308, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('swatara_pa', '01573208', 'Swatara Creek near Palmyra, PA', 'usgs', 'Near Palmyra', 40.3222, -76.6294, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('swatara_pa', '01573560', 'Swatara Creek near Hershey, PA', 'usgs', 'Near Hershey', 40.2984, -76.6677, false);

-- Conestoga River (PA) — 2 gauges
delete from public.river_gauges where river_id = 'conestoga_pa';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('conestoga_pa', '01576500', 'Conestoga River at Lancaster, PA', 'usgs', 'At Lancaster', 40.0501, -76.2772, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('conestoga_pa', '01576754', 'Conestoga River at Conestoga, PA', 'usgs', 'At Conestoga', 39.9465, -76.3677, false);

-- Loyalhanna Creek (PA) — 3 gauges
delete from public.river_gauges where river_id = 'loyalhanna_pa';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('loyalhanna_pa', '03045010', 'Loyalhanna Creek at Latrobe, PA', 'usgs', 'At Latrobe', 40.3161, -79.3908, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('loyalhanna_pa', '03045000', 'Loyalhanna Creek at Kingston, PA', 'usgs', 'At Kingston', 40.2926, -79.3406, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('loyalhanna_pa', '03047000', 'Loyalhanna Creek at Loyalhanna Dam, PA', 'usgs', 'At Loyalhanna Dam', 40.4589, -79.4494, false);

-- Shenango River (PA) — 4 gauges
delete from public.river_gauges where river_id = 'shenango_pa';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('shenango_pa', '03102500', 'Little Shenango River at Greenville, PA', 'usgs', 'At Greenville', 41.4220, -80.3762, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('shenango_pa', '03101500', 'Shenango River at Pymatuning Dam, PA', 'usgs', 'At Pymatuning Dam', 41.4981, -80.4601, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('shenango_pa', '03102850', 'Shenango River near Transfer, PA', 'usgs', 'Near Transfer', 41.3537, -80.3978, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('shenango_pa', '03103500', 'Shenango River at Sharpsville, PA', 'usgs', 'At Sharpsville', 41.2661, -80.4726, false);

-- Flathead River — Middle Fork (MT) — 4 gauges
delete from public.river_gauges where river_id = 'flathead';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('flathead', '12358500', 'M F Flathead River near West Glacier MT', 'usgs', 'Near West Glacier MT', 48.4955, -114.0102, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('flathead', '12355500', 'N F Flathead River nr Columbia Falls MT', 'usgs', 'N F Flathead River nr Columbia Falls MT', 48.4958, -114.1268, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('flathead', '12362500', 'S F Flathead River nr Columbia Falls MT', 'usgs', 'S F Flathead River nr Columbia Falls MT', 48.3566, -114.0379, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('flathead', '12363000', 'Flathead River at Columbia Falls MT', 'usgs', 'At Columbia Falls MT', 48.3618, -114.1850, false);

-- Gallatin River (MT) — 4 gauges
delete from public.river_gauges where river_id = 'gallatin';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('gallatin', '06043500', 'Gallatin River near Gallatin Gateway, MT', 'usgs', 'Near Gallatin Gateway', 45.4973, -111.2707, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('gallatin', '06043120', 'Gallatin River above Deer Creek, near Big Sky, MT', 'usgs', 'Above Deer Creek, near Big Sky', 45.2973, -111.2114, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('gallatin', '06048650', 'E Gallatin R ab Water Reclamation Fa nr Bozeman MT', 'usgs', 'E Gallatin R ab Water Reclamation Fa nr Bozeman MT', 45.7257, -111.0662, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('gallatin', '06052500', 'Gallatin River at Logan MT', 'usgs', 'At Logan MT', 45.8862, -111.4420, false);

-- Big Hole River (MT) — 3 gauges
delete from public.river_gauges where river_id = 'big_hole';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('big_hole', '06024540', 'Big Hole River bl Mudd Cr nr Wisdom MT', 'usgs', 'Big Hole River bl Mudd Cr nr Wisdom MT', 45.8075, -113.3133, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('big_hole', '06024450', 'Big Hole River bl Big Lake Cr at Wisdom MT', 'usgs', 'At Wisdom MT', 45.6180, -113.4569, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('big_hole', '06025250', 'Big Hole River at Maiden Rock nr Divide MT', 'usgs', 'At Maiden Rock nr Divide MT', 45.7013, -112.7360, false);

-- Madison River (MT) — 4 gauges
delete from public.river_gauges where river_id = 'madison';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('madison', '06041000', 'Madison River bl Ennis Lake nr McAllister MT', 'usgs', 'Madison River bl Ennis Lake nr McAllister MT', 45.4902, -111.6345, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('madison', '06040000', 'Madison River near Cameron MT', 'usgs', 'Near Cameron MT', 45.2331, -111.7516, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('madison', '06040050', 'Madison River at Ennis, MT', 'usgs', 'At Ennis', 45.3476, -111.7225, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('madison', '06040800', 'Madison River ab powerplant nr McAllister MT', 'usgs', 'Madison River ab powerplant nr McAllister MT', 45.4866, -111.6339, false);

-- Nolichucky River (TN) — 2 gauges
delete from public.river_gauges where river_id = 'nolichucky';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('nolichucky', '03467609', 'NOLICHUCKY RIVER NEAR LOWLAND', 'usgs', 'NEAR LOWLAND', 36.1263, -83.1753, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('nolichucky', '03466500', 'NOLICHUCKY RIVER BELOW NOLICHUCKY DAM, TN', 'usgs', 'BELOW NOLICHUCKY DAM', 36.0656, -82.8664, false);

-- Duck River (TN) — 5 gauges
delete from public.river_gauges where river_id = 'duck_river';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('duck_river', '03599500', 'DUCK RIVER AT COLUMBIA, TN', 'usgs', 'AT COLUMBIA', 35.6181, -87.0323, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('duck_river', '03598185', 'DUCK RIVER AT HALLS MILL BRIDGE, TN', 'usgs', 'AT HALLS MILL BRIDGE', 35.5529, -86.5823, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('duck_river', '03599240', 'DUCK RIVER ABOVE MILLTOWN, TN', 'usgs', 'ABOVE MILLTOWN', 35.5764, -86.7786, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('duck_river', '03599419', 'DUCK RIVER AT MILE 156 NEAR POTTSVILLE, TN', 'usgs', 'AT MILE 156 NEAR POTTSVILLE', 35.5703, -86.8714, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('duck_river', '03601600', 'DUCK RIVER NEAR SHADY GROVE, TN.', 'usgs', 'NEAR SHADY GROVE, TN.', 35.7207, -87.2660, false);

-- Pigeon River (TN) — 3 gauges
delete from public.river_gauges where river_id = 'pigeon_tn';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('pigeon_tn', '03461500', 'PIGEON RIVER AT NEWPORT, TN', 'usgs', 'AT NEWPORT', 35.9606, -83.1743, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('pigeon_tn', '03469251', 'WEST PRONG LITTLE PIGEON R NR GATLINBURG, TN', 'usgs', 'WEST PRONG LITTLE PIGEON R NR GATLINBURG, TN', 35.6995, -83.5271, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('pigeon_tn', '03470000', 'LITTLE PIGEON RIVER AT SEVIERVILLE, TN', 'usgs', 'AT SEVIERVILLE', 35.8785, -83.5775, false);

-- Wolf River (TN) — 4 gauges
delete from public.river_gauges where river_id = 'wolf_tn';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('wolf_tn', '07030500', 'WOLF RIVER AT ROSSVILLE, TN', 'usgs', 'AT ROSSVILLE', 35.0543, -89.5412, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('wolf_tn', '07030392', 'WOLF RIVER AT LAGRANGE, TN', 'usgs', 'AT LAGRANGE', 35.0326, -89.2467, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('wolf_tn', '07031650', 'WOLF RIVER AT GERMANTOWN, TN', 'usgs', 'AT GERMANTOWN', 35.1165, -89.8015, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('wolf_tn', '07031740', 'WOLF RIVER AT HOLLYWOOD ST AT MEMPHIS, TN', 'usgs', 'AT HOLLYWOOD ST AT MEMPHIS', 35.1879, -89.9756, false);

-- Harpeth River (TN) — 5 gauges
delete from public.river_gauges where river_id = 'harpeth_tn';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('harpeth_tn', '03433500', 'HARPETH RIVER AT BELLEVUE, TN', 'usgs', 'AT BELLEVUE', 36.0546, -86.9285, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('harpeth_tn', '03432100', 'HARPETH RIVER AT MCDANIEL, TN', 'usgs', 'AT MCDANIEL', 35.8326, -86.6989, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('harpeth_tn', '0343233905', 'HARPETH RIVER AT MILE 90.5 NEAR FRANKLIN, TN', 'usgs', 'AT MILE 90.5 NEAR FRANKLIN', 35.8998, -86.8429, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('harpeth_tn', '03432350', 'HARPETH RIVER AT FRANKLIN, TN', 'usgs', 'AT FRANKLIN', 35.9208, -86.8655, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('harpeth_tn', '03432400', 'HARPETH RIVER BELOW FRANKLIN, TN', 'usgs', 'BELOW FRANKLIN', 35.9482, -86.8817, false);

-- Buffalo River (TN) — 2 gauges
delete from public.river_gauges where river_id = 'buffalo_tn';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('buffalo_tn', '03604000', 'BUFFALO RIVER NEAR FLAT WOODS, TN', 'usgs', 'NEAR FLAT WOODS', 35.4959, -87.8328, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('buffalo_tn', '03604400', 'BUFFALO RIVER BELOW LOBELVILLE, TN', 'usgs', 'BELOW LOBELVILLE', 35.8118, -87.7788, false);

-- Little River (TN) — 5 gauges
delete from public.river_gauges where river_id = 'little_tn';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('little_tn', '03498500', 'LITTLE RIVER NEAR MARYVILLE, TN', 'usgs', 'NEAR MARYVILLE', 35.7856, -83.8846, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('little_tn', '03469251', 'WEST PRONG LITTLE PIGEON R NR GATLINBURG, TN', 'usgs', 'WEST PRONG LITTLE PIGEON R NR GATLINBURG, TN', 35.6995, -83.5271, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('little_tn', '03470000', 'LITTLE PIGEON RIVER AT SEVIERVILLE, TN', 'usgs', 'AT SEVIERVILLE', 35.8785, -83.5775, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('little_tn', '03497300', 'LITTLE RIVER ABOVE TOWNSEND, TN', 'usgs', 'ABOVE TOWNSEND', 35.6645, -83.7113, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('little_tn', '03498850', 'LITTLE RIVER NEAR ALCOA, TN', 'usgs', 'NEAR ALCOA', 35.8088, -83.9266, false);

-- Clear Fork (TN) — 2 gauges
delete from public.river_gauges where river_id = 'clear_tn';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('clear_tn', '03409500', 'CLEAR FORK NEAR ROBBINS, TN', 'usgs', 'NEAR ROBBINS', 36.3883, -84.6302, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('clear_tn', '03539778', 'CLEAR CREEK AT LILLY BRIDGE NEAR LANCING, TN', 'usgs', 'AT LILLY BRIDGE NEAR LANCING', 36.1031, -84.7183, false);

-- Obed River (TN) — 2 gauges
delete from public.river_gauges where river_id = 'obed_tn';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('obed_tn', '03539800', 'OBED RIVER NEAR LANCING, TN', 'usgs', 'NEAR LANCING', 36.0815, -84.6703, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('obed_tn', '03538830', 'OBED RIVER AT ADAMS BRIDGE NEAR CROSSVILLE, TN', 'usgs', 'AT ADAMS BRIDGE NEAR CROSSVILLE', 36.0617, -84.9614, false);

-- Clear Creek (TN) — 2 gauges
delete from public.river_gauges where river_id = 'clear_tn_2';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('clear_tn_2', '03539778', 'CLEAR CREEK AT LILLY BRIDGE NEAR LANCING, TN', 'usgs', 'AT LILLY BRIDGE NEAR LANCING', 36.1031, -84.7183, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('clear_tn_2', '03409500', 'CLEAR FORK NEAR ROBBINS, TN', 'usgs', 'NEAR ROBBINS', 36.3883, -84.6302, false);

-- American River — South Fork (CA) — 2 gauges
delete from public.river_gauges where river_id = 'american';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('american', '11446500', 'AMERICAN R A FAIR OAKS CA', 'usgs', 'AMERICAN R A FAIR OAKS CA', 38.6354, -121.2277, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('american', '11427000', 'NF AMERICAN R A NORTH FORK DAM CA', 'usgs', 'NF AMERICAN R A NORTH FORK DAM CA', 38.9360, -121.0238, false);

-- Tuolumne River (CA) — 4 gauges
delete from public.river_gauges where river_id = 'tuolumne';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('tuolumne', '11274790', 'TUOLUMNE R A GRAND CYN OF TUOLUMNE AB HETCH HETCHY', 'usgs', 'TUOLUMNE R A GRAND CYN OF TUOLUMNE AB HETCH HETCHY', 37.9166, -119.6599, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('tuolumne', '11276500', 'TUOLUMNE R NR HETCH HETCHY CA', 'usgs', 'TUOLUMNE R NR HETCH HETCHY CA', 37.9374, -119.7982, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('tuolumne', '11276600', 'TUOLUMNE R AB EARLY INTAKE NR MATHER CA', 'usgs', 'TUOLUMNE R AB EARLY INTAKE NR MATHER CA', 37.8794, -119.9471, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('tuolumne', '11276900', 'TUOLUMNE R BL EARLY INTAKE NR MATHER CA', 'usgs', 'TUOLUMNE R BL EARLY INTAKE NR MATHER CA', 37.8816, -119.9701, false);

-- Merced River (CA) — 2 gauges
delete from public.river_gauges where river_id = 'merced';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('merced', '11264500', 'MERCED R A HAPPY ISLES BRIDGE NR YOSEMITE CA', 'usgs', 'MERCED R A HAPPY ISLES BRIDGE NR YOSEMITE CA', 37.7313, -119.5590, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('merced', '11266500', 'MERCED R A POHONO BRIDGE NR YOSEMITE CA', 'usgs', 'MERCED R A POHONO BRIDGE NR YOSEMITE CA', 37.7163, -119.6657, false);

-- Klamath River (CA) — 2 gauges
delete from public.river_gauges where river_id = 'klamath';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('klamath', '11530500', 'KLAMATH R NR KLAMATH CA', 'usgs', 'KLAMATH R NR KLAMATH CA', 41.5109, -123.9795, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('klamath', '11523000', 'KLAMATH R A ORLEANS', 'usgs', 'KLAMATH R A ORLEANS', 41.3034, -123.5345, false);

-- Stanislaus River (CA) — 2 gauges
delete from public.river_gauges where river_id = 'stanislaus';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('stanislaus', '11302000', 'STANISLAUS R BL GOODWIN DAM NR KNIGHTS FERRY CA', 'usgs', 'STANISLAUS R BL GOODWIN DAM NR KNIGHTS FERRY CA', 37.8516, -120.6380, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('stanislaus', '11303000', 'STANISLAUS R A RIPON CA', 'usgs', 'STANISLAUS R A RIPON CA', 37.7296, -121.1105, false);

-- Sacramento River (CA) — 2 gauges
delete from public.river_gauges where river_id = 'sacramento';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('sacramento', '11377100', 'SACRAMENTO R AB BEND BRIDGE NR RED BLUFF CA', 'usgs', 'SACRAMENTO R AB BEND BRIDGE NR RED BLUFF CA', 40.2885, -122.1866, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('sacramento', '11370500', 'SACRAMENTO R A KESWICK CA', 'usgs', 'SACRAMENTO R A KESWICK CA', 40.6010, -122.4445, false);

-- Cache Creek (CA) — 5 gauges
delete from public.river_gauges where river_id = 'cache_creek';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cache_creek', '11451800', 'CACHE C A RUMSEY CA', 'usgs', 'CACHE C A RUMSEY CA', 38.8899, -122.2383, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cache_creek', '11451000', 'CACHE C NR LOWER LAKE CA', 'usgs', 'CACHE C NR LOWER LAKE CA', 38.9240, -122.5658, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cache_creek', '11451100', 'NF CACHE C A HOUGH SPRING NR CLEARLAKE OAKS CA', 'usgs', 'NF CACHE C A HOUGH SPRING NR CLEARLAKE OAKS CA', 39.1654, -122.6200, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cache_creek', '11451300', 'NF CACHE C NR CLEARLAKE OAKS CA', 'usgs', 'NF CACHE C NR CLEARLAKE OAKS CA', 39.0754, -122.5341, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cache_creek', '11452500', 'CACHE C A YOLO CA', 'usgs', 'CACHE C A YOLO CA', 38.7271, -121.8072, false);

-- Russian River (CA) — 5 gauges
delete from public.river_gauges where river_id = 'russian';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('russian', '11464000', 'RUSSIAN R NR HEALDSBURG CA', 'usgs', 'RUSSIAN R NR HEALDSBURG CA', 38.6132, -122.8363, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('russian', '11463000', 'RUSSIAN R NR CLOVERDALE CA', 'usgs', 'RUSSIAN R NR CLOVERDALE CA', 38.8793, -123.0536, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('russian', '11463500', 'RUSSIAN R A GEYSERVILLE CA', 'usgs', 'RUSSIAN R A GEYSERVILLE CA', 38.7126, -122.8958, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('russian', '11463682', 'RUSSIAN R A JIMTOWN CA', 'usgs', 'RUSSIAN R A JIMTOWN CA', 38.6582, -122.8294, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('russian', '11467000', 'RUSSIAN R A HACIENDA BRIDGE NR GUERNEVILLE CA', 'usgs', 'RUSSIAN R A HACIENDA BRIDGE NR GUERNEVILLE CA', 38.5085, -122.9277, false);

-- Napa River (CA) — 2 gauges
delete from public.river_gauges where river_id = 'napa';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('napa', '11458000', 'NAPA R NR NAPA CA', 'usgs', 'NAPA R NR NAPA CA', 38.3682, -122.3033, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('napa', '11456000', 'NAPA R NR ST HELENA CA', 'usgs', 'NAPA R NR ST HELENA CA', 38.5113, -122.4558, false);

-- Truckee River (CA) — 5 gauges
delete from public.river_gauges where river_id = 'truckee_ca';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('truckee_ca', '10346000', 'TRUCKEE R A FARAD CA', 'usgs', 'TRUCKEE R A FARAD CA', 39.4279, -120.0341, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('truckee_ca', '10337500', 'TRUCKEE R A TAHOE CITY CA', 'usgs', 'TRUCKEE R A TAHOE CITY CA', 39.1663, -120.1443, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('truckee_ca', '10338000', 'TRUCKEE R NR TRUCKEE CA', 'usgs', 'TRUCKEE R NR TRUCKEE CA', 39.2963, -120.2055, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('truckee_ca', '10339410', 'TRUCKEE R BL MARTIS C NR TRUCKEE CA', 'usgs', 'TRUCKEE R BL MARTIS C NR TRUCKEE CA', 39.3531, -120.1194, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('truckee_ca', '10344400', 'LITTLE TRUCKEE R AB BOCA RES NR TRUCKEE CA', 'usgs', 'LITTLE TRUCKEE R AB BOCA RES NR TRUCKEE CA', 39.4357, -120.0843, false);

-- Mattole River (CA) — 2 gauges
delete from public.river_gauges where river_id = 'mattole_ca';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('mattole_ca', '11469000', 'MATTOLE R NR PETROLIA CA', 'usgs', 'MATTOLE R NR PETROLIA CA', 40.3132, -124.2834, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('mattole_ca', '11468900', 'MATTOLE R NR ETTERSBURG CA', 'usgs', 'MATTOLE R NR ETTERSBURG CA', 40.1393, -123.9914, false);

-- American River (CA) — 3 gauges
delete from public.river_gauges where river_id = 'american_ca';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('american_ca', '11446700', 'AMERICAN R A WILLIAM B POND PARK A CARMICHAEL CA', 'usgs', 'AMERICAN R A WILLIAM B POND PARK A CARMICHAEL CA', 38.5913, -121.3327, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('american_ca', '11427000', 'NF AMERICAN R A NORTH FORK DAM CA', 'usgs', 'NF AMERICAN R A NORTH FORK DAM CA', 38.9360, -121.0238, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('american_ca', '11446500', 'AMERICAN R A FAIR OAKS CA', 'usgs', 'AMERICAN R A FAIR OAKS CA', 38.6354, -121.2277, false);

-- Shasta River (CA) — 2 gauges
delete from public.river_gauges where river_id = 'shasta_ca';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('shasta_ca', '11517500', 'SHASTA R NR YREKA CA', 'usgs', 'SHASTA R NR YREKA CA', 41.8229, -122.5956, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('shasta_ca', '11517000', 'SHASTA R NR  MONTAGUE CA', 'usgs', 'SHASTA R NR  MONTAGUE CA', 41.7090, -122.5381, false);

-- James River (VA) — 2 gauges
delete from public.river_gauges where river_id = 'james';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('james', '02037500', 'JAMES RIVER NEAR RICHMOND, VA', 'usgs', 'NEAR RICHMOND', 37.5632, -77.5469, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('james', '02037000', 'JAMES RIVER AND KANAWHA CANAL NEAR RICHMOND, VA', 'usgs', 'NEAR RICHMOND', 37.5646, -77.5742, false);

-- Rappahannock River (VA) — 2 gauges
delete from public.river_gauges where river_id = 'rappahannock';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('rappahannock', '01668000', 'RAPPAHANNOCK RIVER NEAR FREDERICKSBURG, VA', 'usgs', 'NEAR FREDERICKSBURG', 38.3085, -77.5292, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('rappahannock', '01664000', 'RAPPAHANNOCK RIVER AT REMINGTON, VA', 'usgs', 'AT REMINGTON', 38.5306, -77.8136, false);

-- Maury River (VA) — 2 gauges
delete from public.river_gauges where river_id = 'maury';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('maury', '02024000', 'MAURY RIVER NEAR BUENA VISTA, VA', 'usgs', 'NEAR BUENA VISTA', 37.7626, -79.3914, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('maury', '02021500', 'MAURY RIVER AT ROCKBRIDGE BATHS, VA', 'usgs', 'AT ROCKBRIDGE BATHS', 37.9074, -79.4220, false);

-- Jackson River (VA) — 4 gauges
delete from public.river_gauges where river_id = 'jackson_va';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('jackson_va', '02012500', 'JACKSON RIVER AT FALLING SPRING, VA', 'usgs', 'AT FALLING SPRING', 37.8767, -79.9775, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('jackson_va', '02011400', 'JACKSON RIVER NEAR BACOVA, VA', 'usgs', 'NEAR BACOVA', 38.0423, -79.8814, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('jackson_va', '02011800', 'JACKSON RIVER BL GATHRIGHT DAM NR HOT SPGS, VA', 'usgs', 'JACKSON RIVER BL GATHRIGHT DAM NR HOT SPGS, VA', 37.9485, -79.9492, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('jackson_va', '02013100', 'JACKSON RIVER BL DUNLAP CREEK AT COVINGTON, VA', 'usgs', 'AT COVINGTON', 37.7887, -80.0006, false);

-- Rapidan River (VA) — 2 gauges
delete from public.river_gauges where river_id = 'rapidan';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('rapidan', '01667500', 'RAPIDAN RIVER NEAR CULPEPER, VA', 'usgs', 'NEAR CULPEPER', 38.3504, -77.9750, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('rapidan', '01665500', 'RAPIDAN RIVER NEAR RUCKERSVILLE, VA', 'usgs', 'NEAR RUCKERSVILLE', 38.2807, -78.3400, false);

-- Jackson River \u2014 Lake Moomaw Tailwater (VA) — 4 gauges
delete from public.river_gauges where river_id = 'jackson_river_va';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('jackson_river_va', '02012500', 'JACKSON RIVER AT FALLING SPRING, VA', 'usgs', 'AT FALLING SPRING', 37.8767, -79.9775, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('jackson_river_va', '02011400', 'JACKSON RIVER NEAR BACOVA, VA', 'usgs', 'NEAR BACOVA', 38.0423, -79.8814, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('jackson_river_va', '02011800', 'JACKSON RIVER BL GATHRIGHT DAM NR HOT SPGS, VA', 'usgs', 'JACKSON RIVER BL GATHRIGHT DAM NR HOT SPGS, VA', 37.9485, -79.9492, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('jackson_river_va', '02013100', 'JACKSON RIVER BL DUNLAP CREEK AT COVINGTON, VA', 'usgs', 'AT COVINGTON', 37.7887, -80.0006, false);

-- Appomattox River (VA) — 3 gauges
delete from public.river_gauges where river_id = 'appomattox_va';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('appomattox_va', '02041650', 'APPOMATTOX RIVER AT MATOACA, VA', 'usgs', 'AT MATOACA', 37.2252, -77.4753, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('appomattox_va', '02040000', 'APPOMATTOX RIVER AT MATTOAX, VA', 'usgs', 'AT MATTOAX', 37.4215, -77.8589, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('appomattox_va', '02040892', 'APPOMATTOX RIVER AT ROUTE 602 NEAR MANNBORO, VA', 'usgs', 'AT ROUTE 602 NEAR MANNBORO', 37.3181, -77.8017, false);

-- Green River (KY) — 2 gauges
delete from public.river_gauges where river_id = 'green_river';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('green_river', '03308500', 'GREEN RIVER AT MUNFORDVILLE, KY', 'usgs', 'AT MUNFORDVILLE', 37.2694, -85.8881, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('green_river', '03309000', 'GREEN RIVER AT MAMMOTH CAVE, KY', 'usgs', 'AT MAMMOTH CAVE', 37.1800, -86.1125, false);

-- Kentucky River (KY) — 4 gauges
delete from public.river_gauges where river_id = 'kentucky';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('kentucky', '03284000', 'KENTUCKY RIVER AT LOCK 10 NEAR WINCHESTER, KY', 'usgs', 'AT LOCK 10 NEAR WINCHESTER', 37.8940, -84.2605, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('kentucky', '03282290', 'KENTUCKY RIVER AT LOCK 11 NEAR COLLEGE HILL, KY', 'usgs', 'AT LOCK 11 NEAR COLLEGE HILL', 37.7840, -84.1033, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('kentucky', '03284230', 'KENTUCKY RIVER AT LOCK 9 AT VALLEY VIEW, KY', 'usgs', 'AT LOCK 9 AT VALLEY VIEW', 37.8440, -84.4406, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('kentucky', '03284500', 'KENTUCKY RIVER AT LOCK 8 NEAR CAMP NELSON, KY', 'usgs', 'AT LOCK 8 NEAR CAMP NELSON', 37.7454, -84.5866, false);

-- Licking River (KY) — 5 gauges
delete from public.river_gauges where river_id = 'licking';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('licking', '03253000', 'SOUTH FORK LICKING RIVER AT HAYES, KY', 'usgs', 'AT HAYES', 38.6587, -84.3519, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('licking', '03250500', 'LICKING RIVER AT BLUE LICK SPRINGS, KY', 'usgs', 'AT BLUE LICK SPRINGS', 38.4201, -83.9974, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('licking', '03251200', 'NORTH FORK LICKING RIVER NEAR MT OLIVET, KY', 'usgs', 'NEAR MT OLIVET', 38.5948, -84.0202, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('licking', '03251500', 'LICKING RIVER AT MCKINNEYSBURG, KY', 'usgs', 'AT MCKINNEYSBURG', 38.6001, -84.2663, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('licking', '03252500', 'SOUTH FORK LICKING RIVER AT CYNTHIANA, KY', 'usgs', 'AT CYNTHIANA', 38.3909, -84.3030, false);

-- Cumberland River \u2014 Wolf Creek Tailwater (KY) — 2 gauges
delete from public.river_gauges where river_id = 'cumberland_wolf_ky';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cumberland_wolf_ky', '03401000', 'CUMBERLAND RIVER NEAR HARLAN, KY', 'usgs', 'NEAR HARLAN', 36.8468, -83.3557, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cumberland_wolf_ky', '03402900', 'CUMBERLAND R AT PINE ST BR AT PINEVILLE, KY', 'usgs', 'AT PINE ST BR AT PINEVILLE', 36.7631, -83.6919, false);

-- Cumberland River (KY) — 2 gauges
delete from public.river_gauges where river_id = 'cumberland_ky';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cumberland_ky', '03404500', 'CUMBERLAND RIVER AT CUMBERLAND FALLS, KY', 'usgs', 'AT CUMBERLAND FALLS', 36.8373, -84.3433, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cumberland_ky', '03404000', 'CUMBERLAND RIVER AT WILLIAMSBURG, KY', 'usgs', 'AT WILLIAMSBURG', 36.7434, -84.1560, false);

-- South Fork Licking River (KY) — 4 gauges
delete from public.river_gauges where river_id = 'south_fork_licking_ky';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('south_fork_licking_ky', '03252500', 'SOUTH FORK LICKING RIVER AT CYNTHIANA, KY', 'usgs', 'AT CYNTHIANA', 38.3909, -84.3030, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('south_fork_licking_ky', '03253000', 'SOUTH FORK LICKING RIVER AT HAYES, KY', 'usgs', 'AT HAYES', 38.6587, -84.3519, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('south_fork_licking_ky', '03289000', 'SOUTH ELKHORN CREEK AT FORT SPRING, KY', 'usgs', 'AT FORT SPRING', 38.0431, -84.6263, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('south_fork_licking_ky', '03289300', 'SOUTH ELKHORN CREEK NEAR MIDWAY, KY', 'usgs', 'NEAR MIDWAY', 38.1409, -84.6452, false);

-- Barren River (KY) — 2 gauges
delete from public.river_gauges where river_id = 'barren_ky';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('barren_ky', '03313000', 'BARREN RIVER NEAR FINNEY, KY', 'usgs', 'NEAR FINNEY', 36.8950, -86.1339, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('barren_ky', '03314500', 'BARREN RIVER AT BOWLING GREEN, KY', 'usgs', 'AT BOWLING GREEN', 37.0028, -86.4328, false);

-- Tygarts Creek (KY) — 2 gauges
delete from public.river_gauges where river_id = 'tygarts_ky';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('tygarts_ky', '03216777', 'TYGARTS CREEK AT LAWTON RD AT OLIVE HILL,KY', 'usgs', 'AT LAWTON RD AT OLIVE HILL', 38.2904, -83.1896, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('tygarts_ky', '03217000', 'TYGARTS CREEK NEAR GREENUP, KY', 'usgs', 'NEAR GREENUP', 38.5642, -82.9521, false);

-- Elkhorn Creek (KY) — 5 gauges
delete from public.river_gauges where river_id = 'elkhorn_ky';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('elkhorn_ky', '03289500', 'ELKHORN CREEK NEAR FRANKFORT, KY', 'usgs', 'NEAR FRANKFORT', 38.2687, -84.8147, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('elkhorn_ky', '03287590', 'N ELKHORN CR AT WINCHESTER RD NR LEXINGTON, KY', 'usgs', 'AT WINCHESTER RD NR LEXINGTON', 38.0401, -84.4111, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('elkhorn_ky', '03287600', 'N ELKHORN CR AT BRYAN STATION RD AT MONTROSE, KY', 'usgs', 'AT BRYAN STATION RD AT MONTROSE', 38.0765, -84.4133, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('elkhorn_ky', '03288100', 'NORTH ELKHORN CREEK AT GEORGETOWN, KY', 'usgs', 'AT GEORGETOWN', 38.2195, -84.5630, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('elkhorn_ky', '03289000', 'SOUTH ELKHORN CREEK AT FORT SPRING, KY', 'usgs', 'AT FORT SPRING', 38.0431, -84.6263, false);

-- Nantahala River (NC) — 2 gauges
delete from public.river_gauges where river_id = 'nantahala';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('nantahala', '03504000', 'NANTAHALA RIVER NEAR RAINBOW SPRINGS, NC', 'usgs', 'NEAR RAINBOW SPRINGS', 35.1275, -83.6186, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('nantahala', '03505550', 'NANTAHALA RIVER NEAR HEWITT, NC', 'usgs', 'NEAR HEWITT', 35.3050, -83.6522, false);

-- French Broad River (NC) — 5 gauges
delete from public.river_gauges where river_id = 'french_broad';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('french_broad', '03451500', 'FRENCH BROAD RIVER AT ASHEVILLE, NC', 'usgs', 'AT ASHEVILLE', 35.6089, -82.5781, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('french_broad', '03443000', 'FRENCH BROAD RIVER AT BLANTYRE, NC', 'usgs', 'AT BLANTYRE', 35.2992, -82.6239, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('french_broad', '03447687', 'FRENCH BROAD RIVER NEAR FLETCHER, NC', 'usgs', 'NEAR FLETCHER', 35.4292, -82.5525, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('french_broad', '03453500', 'FRENCH BROAD RIVER AT MARSHALL, NC', 'usgs', 'AT MARSHALL', 35.7864, -82.6608, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('french_broad', '03454500', 'FRENCH BROAD RIVER AT HOT SPRINGS, NC', 'usgs', 'AT HOT SPRINGS', 35.8899, -82.8210, false);

-- Tuckasegee River (NC) — 3 gauges
delete from public.river_gauges where river_id = 'tuckasegee';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('tuckasegee', '03513000', 'TUCKASEGEE RIVER AT BRYSON CITY, NC', 'usgs', 'AT BRYSON CITY', 35.4275, -83.4469, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('tuckasegee', '03508050', 'TUCKASEGEE RIVER AT SR 1172 NR CULLOWHEE, NC', 'usgs', 'AT SR 1172 NR CULLOWHEE', 35.2878, -83.1439, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('tuckasegee', '03510577', 'TUCKASEGEE RIVER AT BARKER''S CREEK, NC', 'usgs', 'AT BARKER''S CREEK', 35.3844, -83.2917, false);

-- Little Tennessee River (NC) — 2 gauges
delete from public.river_gauges where river_id = 'little_tennessee';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('little_tennessee', '03503000', 'LITTLE TENNESSEE RIVER AT NEEDMORE, NC', 'usgs', 'AT NEEDMORE', 35.3364, -83.5269, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('little_tennessee', '03500000', 'LITTLE TENNESSEE RIVER NEAR PRENTISS, NC', 'usgs', 'NEAR PRENTISS', 35.1500, -83.3797, false);

-- Cape Fear River (NC) — 2 gauges
delete from public.river_gauges where river_id = 'cape_fear';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cape_fear', '02105500', 'CAPE FEAR R AT WILM O HUSKE LOCK NR TARHEEL, NC', 'usgs', 'AT WILM O HUSKE LOCK NR TARHEEL', 34.8356, -78.8236, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cape_fear', '02104000', 'CAPE FEAR RIVER AT FAYETTEVILLE, NC', 'usgs', 'AT FAYETTEVILLE', 35.0497, -78.8564, false);

-- Lumber River (NC) — 3 gauges
delete from public.river_gauges where river_id = 'lumber_nc';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('lumber_nc', '02134170', 'LUMBER RIVER AT LUMBERTON, NC', 'usgs', 'AT LUMBERTON', 34.6180, -79.0113, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('lumber_nc', '02133624', 'LUMBER RIVER NEAR MAXTON, NC', 'usgs', 'NEAR MAXTON', 34.7728, -79.3319, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('lumber_nc', '02134500', 'LUMBER RIVER AT BOARDMAN, NC', 'usgs', 'AT BOARDMAN', 34.4425, -78.9603, false);

-- Salt River Canyon (AZ) — 2 gauges
delete from public.river_gauges where river_id = 'salt_river';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('salt_river', '09498500', 'SALT RIVER NEAR ROOSEVELT, AZ', 'usgs', 'NEAR ROOSEVELT', 33.6192, -110.9221, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('salt_river', '09497500', 'SALT RIVER NEAR CHRYSOTILE, AZ', 'usgs', 'NEAR CHRYSOTILE', 33.7981, -110.4998, false);

-- Verde River (AZ) — 3 gauges
delete from public.river_gauges where river_id = 'verde';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('verde', '09504000', 'VERDE RIVER NEAR CLARKDALE, AZ', 'usgs', 'NEAR CLARKDALE', 34.8522, -112.0660, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('verde', '09503700', 'VERDE RIVER NEAR PAULDEN, AZ', 'usgs', 'NEAR PAULDEN', 34.8950, -112.3429, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('verde', '09504950', 'VERDE RIVER ABOVE CAMP VERDE, AZ', 'usgs', 'ABOVE CAMP VERDE', 34.6117, -111.8984, false);

-- Gila River — Gila Box (AZ) — 3 gauges
delete from public.river_gauges where river_id = 'gila_box';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('gila_box', '09448500', 'GILA RIVER AT HEAD OF SAFFORD VALLEY, NR SOLOMON,', 'usgs', 'AT HEAD OF SAFFORD VALLEY, NR SOLOMON,', 32.8827, -109.4796, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('gila_box', '09439000', 'GILA RIVER AT DUNCAN, AZ', 'usgs', 'AT DUNCAN', 32.7244, -109.0992, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('gila_box', '09442000', 'GILA RIVER NEAR CLIFTON, AZ', 'usgs', 'NEAR CLIFTON', 32.9653, -109.3086, false);

-- Snake River — Snake River Canyon (WY) — 2 gauges
delete from public.river_gauges where river_id = 'snake_wy';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('snake_wy', '13022500', 'SNAKE RIVER ABOVE RESERVOIR, NEAR ALPINE, WY', 'usgs', 'ABOVE RESERVOIR, NEAR ALPINE', 43.1961, -110.8894, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('snake_wy', '13018750', 'SNAKE RIVER BELOW FLAT CREEK, NEAR JACKSON, WY', 'usgs', 'BELOW FLAT CREEK, NEAR JACKSON', 43.3722, -110.7386, false);

-- Wind River (WY) — 4 gauges
delete from public.river_gauges where river_id = 'wind_river';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('wind_river', '06228000', 'WIND RIVER AT RIVERTON, WY', 'usgs', 'AT RIVERTON', 43.0105, -108.3768, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('wind_river', '06227600', 'WIND RIVER NEAR KINNEAR, WY', 'usgs', 'NEAR KINNEAR', 43.1428, -108.7089, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('wind_river', '06235500', 'LITTLE WIND RIVER NEAR RIVERTON, WY', 'usgs', 'NEAR RIVERTON', 42.9975, -108.3754, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('wind_river', '06236100', 'WIND RIVER AB BOYSEN RESERVOIR, NR SHOSHONI, WY', 'usgs', 'WIND RIVER AB BOYSEN RESERVOIR, NR SHOSHONI, WY', 43.1290, -108.2248, false);

-- Bighorn River (WY) — 2 gauges
delete from public.river_gauges where river_id = 'bighorn_wy';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('bighorn_wy', '06274300', 'BIGHORN RIVER AT BASIN, WY', 'usgs', 'AT BASIN', 44.3833, -108.0363, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('bighorn_wy', '06279500', 'BIGHORN RIVER AT KANE, WY', 'usgs', 'AT KANE', 44.7585, -108.1816, false);

-- Snake River (WY) — 3 gauges
delete from public.river_gauges where river_id = 'snake_wy_2';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('snake_wy_2', '13013650', 'SNAKE RIVER AT MOOSE, WY', 'usgs', 'AT MOOSE', 43.6541, -110.7155, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('snake_wy_2', '13011000', 'SNAKE RIVER NEAR MORAN, WY', 'usgs', 'NEAR MORAN', 43.8585, -110.5866, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('snake_wy_2', '13018750', 'SNAKE RIVER BELOW FLAT CREEK, NEAR JACKSON, WY', 'usgs', 'BELOW FLAT CREEK, NEAR JACKSON', 43.3722, -110.7386, false);

-- Encampment River (WY) — 2 gauges
delete from public.river_gauges where river_id = 'encampment_wy';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('encampment_wy', '06623800', 'ENCAMPMENT RIVER AB HOG PARK CR, NR ENCAMPMENT, WY', 'usgs', 'ENCAMPMENT RIVER AB HOG PARK CR, NR ENCAMPMENT, WY', 41.0236, -106.8248, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('encampment_wy', '06625000', 'ENCAMPMENT RIVER AT MOUTH, NEAR ENCAMPMENT, WY', 'usgs', 'AT MOUTH, NEAR ENCAMPMENT', 41.3033, -106.7154, false);

-- Green River — Desolation Canyon (UT) — 2 gauges
delete from public.river_gauges where river_id = 'desolation';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('desolation', '09315000', 'GREEN RIVER AT GREEN RIVER, UT', 'usgs', 'AT GREEN RIVER', 38.9889, -110.1504, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('desolation', '09314700', 'GREEN RIVER BL SWASEYS RAPID NEAR GREEN RIVER, UT', 'usgs', 'NEAR GREEN RIVER', 39.1143, -110.1090, false);

-- Colorado River — Cataract Canyon (UT) — 2 gauges
delete from public.river_gauges where river_id = 'cataract';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cataract', '09180500', 'COLORADO RIVER NEAR CISCO, UT', 'usgs', 'NEAR CISCO', 38.8105, -109.2934, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cataract', '09185600', 'COLORADO RIVER AT POTASH, UT', 'usgs', 'AT POTASH', 38.5047, -109.6583, false);

-- Provo River (UT) — 5 gauges
delete from public.river_gauges where river_id = 'provo';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('provo', '10155500', 'PROVO RIVER NEAR CHARLESTON, UT', 'usgs', 'NEAR CHARLESTON', 40.4841, -111.4635, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('provo', '10154200', 'PROVO RIVER NEAR WOODLAND, UT', 'usgs', 'NEAR WOODLAND', 40.5577, -111.1688, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('provo', '10155000', 'PROVO RIVER NEAR HAILSTONE, UT', 'usgs', 'NEAR HAILSTONE', 40.6051, -111.3145, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('provo', '10155200', 'PROVO RIV AT RIV ROAD BRIDGE NR HEBER CITY, UT', 'usgs', 'AT RIV ROAD BRIDGE NR HEBER CITY', 40.5544, -111.4332, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('provo', '10163000', 'PROVO RIVER AT PROVO, UT', 'usgs', 'AT PROVO', 40.2393, -111.7112, false);

-- Weber River (UT) — 5 gauges
delete from public.river_gauges where river_id = 'weber';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('weber', '10128500', 'WEBER RIVER NEAR OAKLEY, UT', 'usgs', 'NEAR OAKLEY', 40.7372, -111.2480, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('weber', '10129300', 'WEBER RIVER NEAR PEOA, UTAH', 'usgs', 'NEAR PEOA, UTAH', 40.7511, -111.3705, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('weber', '10129500', 'WEBER RIVER NEAR WANSHIP, UT', 'usgs', 'NEAR WANSHIP', 40.7927, -111.4049, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('weber', '10130500', 'WEBER RIVER NEAR COALVILLE, UT', 'usgs', 'NEAR COALVILLE', 40.8952, -111.4019, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('weber', '10132000', 'WEBER RIVER AT ECHO, UT', 'usgs', 'AT ECHO', 40.9677, -111.4377, false);

-- Logan River (UT) — 2 gauges
delete from public.river_gauges where river_id = 'logan';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('logan', '10109000', 'LOGAN RIVER ABOVE STATE DAM, NEAR LOGAN, UT', 'usgs', 'ABOVE STATE DAM, NEAR LOGAN', 41.7435, -111.7840, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('logan', '10109001', 'COM F LOGAN R AB ST D AND CACHE HL CAN NR LOGAN UT', 'usgs', 'COM F LOGAN R AB ST D AND CACHE HL CAN NR LOGAN UT', 41.7444, -111.7844, false);

-- Colorado River (UT) — 2 gauges
delete from public.river_gauges where river_id = 'colorado_ut';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('colorado_ut', '09180500', 'COLORADO RIVER NEAR CISCO, UT', 'usgs', 'NEAR CISCO', 38.8105, -109.2934, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('colorado_ut', '09185600', 'COLORADO RIVER AT POTASH, UT', 'usgs', 'AT POTASH', 38.5047, -109.6583, false);

-- Muddy Creek (UT) — 2 gauges
delete from public.river_gauges where river_id = 'muddy_ut';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('muddy_ut', '09332100', 'MUDDY CREEK BL I-70 NR EMERY, UTAH', 'usgs', 'MUDDY CREEK BL I-70 NR EMERY, UTAH', 38.8126, -111.2002, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('muddy_ut', '09330500', 'MUDDY CREEK NEAR EMERY, UT', 'usgs', 'NEAR EMERY', 38.9911, -111.2539, false);

-- Price River (UT) — 5 gauges
delete from public.river_gauges where river_id = 'price_ut';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('price_ut', '09314500', 'PRICE RIVER AT WOODSIDE, UT', 'usgs', 'AT WOODSIDE', 39.2644, -110.3428, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('price_ut', '09313600', 'PRICE RIVER AT WELLINGTON, UTAH', 'usgs', 'AT WELLINGTON, UTAH', 39.5314, -110.7344, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('price_ut', '09313980', 'PRICE RIVER AT RIDGE ROAD NEAR WELLINGTON, UT', 'usgs', 'AT RIDGE ROAD NEAR WELLINGTON', 39.5361, -110.6994, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('price_ut', '09314250', 'PRICE RIVER BL MILLER CREEK NR WELLINGTON, UT', 'usgs', 'PRICE RIVER BL MILLER CREEK NR WELLINGTON, UT', 39.4497, -110.6280, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('price_ut', '09314300', 'PRICE RIVER ABV SILVAGNI RANCH DIV NR WOODSIDE, UT', 'usgs', 'PRICE RIVER ABV SILVAGNI RANCH DIV NR WOODSIDE, UT', 39.3355, -110.4281, false);

-- Rio Chama (NM) — 4 gauges
delete from public.river_gauges where river_id = 'rio_chama';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('rio_chama', '08284100', 'RIO CHAMA NEAR LA PUENTE, NM', 'usgs', 'NEAR LA PUENTE', 36.6627, -106.6334, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('rio_chama', '08281400', 'RIO CHAMA ABOVE CHAMA, NM', 'usgs', 'ABOVE CHAMA', 36.9350, -106.5552, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('rio_chama', '08285500', 'RIO CHAMA BELOW EL VADO DAM, NM', 'usgs', 'BELOW EL VADO DAM', 36.5804, -106.7248, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('rio_chama', '08286500', 'RIO CHAMA ABOVE ABIQUIU RESERVOIR, NM', 'usgs', 'ABOVE ABIQUIU RESERVOIR', 36.3188, -106.5995, false);

-- Gila River (NM) — 5 gauges
delete from public.river_gauges where river_id = 'gila_nm';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('gila_nm', '09430500', 'GILA RIVER NEAR GILA, NM', 'usgs', 'NEAR GILA', 33.0615, -108.5374, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('gila_nm', '09430010', 'WEST FORK GILA RIVER AT GILA CLIFF DWELLINGS, NM', 'usgs', 'AT GILA CLIFF DWELLINGS', 33.2292, -108.2652, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('gila_nm', '09430020', 'W FORK GILA R BLW MDL FORK NR GILA HOT SPRINGS, NM', 'usgs', 'W FORK GILA R BLW MDL FORK NR GILA HOT SPRINGS, NM', 33.2219, -108.2420, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('gila_nm', '09430030', 'GILA RIVER NR GILA HOT SPRINGS, NM', 'usgs', 'GILA RIVER NR GILA HOT SPRINGS, NM', 33.1797, -108.2063, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('gila_nm', '09431500', 'GILA RIVER NEAR REDROCK, NM', 'usgs', 'NEAR REDROCK', 32.7269, -108.6756, false);

-- Pecos River (NM) — 5 gauges
delete from public.river_gauges where river_id = 'pecos_nm';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('pecos_nm', '08382650', 'PECOS RIVER ABOVE SANTA ROSA LAKE, NM', 'usgs', 'ABOVE SANTA ROSA LAKE', 35.0594, -104.7611, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('pecos_nm', '08379500', 'PECOS RIVER NEAR ANTON CHICO, NM', 'usgs', 'NEAR ANTON CHICO', 35.1787, -105.1088, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('pecos_nm', '08382600', 'PECOS R ABV CANON DEL UTA NR COLONIAS, NM', 'usgs', 'PECOS R ABV CANON DEL UTA NR COLONIAS, NM', 35.0914, -104.8006, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('pecos_nm', '08382830', 'PECOS RIVER BELOW SANTA ROSA DAM, NM', 'usgs', 'BELOW SANTA ROSA DAM', 35.0242, -104.6889, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('pecos_nm', '08383500', 'PECOS RIVER NEAR PUERTO DE LUNA, NM', 'usgs', 'NEAR PUERTO DE LUNA', 34.7301, -104.5249, false);

-- Jemez River (NM) — 2 gauges
delete from public.river_gauges where river_id = 'jemez';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('jemez', '08324000', 'JEMEZ RIVER NEAR JEMEZ, NM', 'usgs', 'NEAR JEMEZ', 35.6620, -106.7434, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('jemez', '08328950', 'JEMEZ RIVER OUTLET BELOW JEMEZ CANYON DAM, NM', 'usgs', 'BELOW JEMEZ CANYON DAM', 35.3948, -106.5453, false);

-- Rio Grande (NM) — 4 gauges
delete from public.river_gauges where river_id = 'rio_grande_nm';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('rio_grande_nm', '08276500', 'RIO GRANDE BLW TAOS JUNCTION BRIDGE NEAR TAOS, NM', 'usgs', 'NEAR TAOS', 36.3200, -105.7544, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('rio_grande_nm', '08263500', 'RIO GRANDE NEAR CERRO, NM', 'usgs', 'NEAR CERRO', 36.7400, -105.6834, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('rio_grande_nm', '08275500', 'RIO GRANDE DEL RANCHO NEAR TALPA, NM', 'usgs', 'NEAR TALPA', 36.2995, -105.5826, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('rio_grande_nm', '08279500', 'RIO GRANDE AT EMBUDO, NM', 'usgs', 'AT EMBUDO', 36.2056, -105.9640, false);

-- Kennebec River (ME) — 2 gauges
delete from public.river_gauges where river_id = 'kennebec_me';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('kennebec_me', '01042500', 'Kennebec River at The Forks, Maine', 'usgs', 'At The Forks, Maine', 45.3397, -69.9619, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('kennebec_me', '01046500', 'Kennebec River at Bingham, Maine', 'usgs', 'At Bingham, Maine', 45.0519, -69.8856, false);

-- Hudson River Gorge (NY) — 3 gauges
delete from public.river_gauges where river_id = 'hudson_gorge';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('hudson_gorge', '01315500', 'HUDSON RIVER AT NORTH CREEK NY', 'usgs', 'AT NORTH CREEK NY', 43.7009, -73.9832, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('hudson_gorge', '01312000', 'HUDSON RIVER NEAR NEWCOMB NY', 'usgs', 'NEAR NEWCOMB NY', 43.9660, -74.1314, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('hudson_gorge', '01318500', 'HUDSON RIVER AT HADLEY NY', 'usgs', 'AT HADLEY NY', 43.3191, -73.8443, false);

-- Salmon River (NY) — 2 gauges
delete from public.river_gauges where river_id = 'salmon_ny';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('salmon_ny', '04250200', 'SALMON RIVER AT PINEVILLE NY', 'usgs', 'AT PINEVILLE NY', 43.5312, -76.0377, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('salmon_ny', '04249200', 'NORTH BRANCH SALMON RIVER AT REDFIELD NY', 'usgs', 'AT REDFIELD NY', 43.5424, -75.8140, false);

-- Esopus Creek (NY) — 5 gauges
delete from public.river_gauges where river_id = 'esopus';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('esopus', '01362500', 'ESOPUS CREEK AT COLDBROOK NY', 'usgs', 'AT COLDBROOK NY', 42.0145, -74.2702, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('esopus', '0136219503', 'ESOPUS CREEK BELOW LOST CLOVE RD AT BIG INDIAN NY', 'usgs', 'BELOW LOST CLOVE RD AT BIG INDIAN NY', 42.0979, -74.4491, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('esopus', '01362200', 'ESOPUS CREEK AT ALLABEN NY', 'usgs', 'AT ALLABEN NY', 42.1169, -74.3801, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('esopus', '01363556', 'ESOPUS CREEK NEAR LOMONTVILLE NY', 'usgs', 'NEAR LOMONTVILLE NY', 41.8793, -74.1454, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('esopus', '01364500', 'ESOPUS CREEK AT MOUNT MARION NY', 'usgs', 'AT MOUNT MARION NY', 42.0381, -73.9722, false);

-- Sacandaga River (NY) — 2 gauges
delete from public.river_gauges where river_id = 'sacandaga';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('sacandaga', '01321000', 'SACANDAGA RIVER NEAR HOPE NY', 'usgs', 'NEAR HOPE NY', 43.3535, -74.2685, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('sacandaga', '01325000', 'SACANDAGA RIVER AT STEWARTS BRIDGE NR HADLEY NY', 'usgs', 'AT STEWARTS BRIDGE NR HADLEY NY', 43.3114, -73.8672, false);

-- Raquette River (NY) — 2 gauges
delete from public.river_gauges where river_id = 'raquette';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('raquette', '04266500', 'RAQUETTE RIVER AT PIERCEFIELD NY', 'usgs', 'AT PIERCEFIELD NY', 44.2342, -74.5715, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('raquette', '04267500', 'RAQUETTE RIVER AT SOUTH COLTON NY', 'usgs', 'AT SOUTH COLTON NY', 44.5098, -74.8836, false);

-- Mohawk River (NY) — 5 gauges
delete from public.river_gauges where river_id = 'mohawk';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('mohawk', '01355475', 'MOHAWK RIVER AT REXFORD NY', 'usgs', 'AT REXFORD NY', 42.8511, -73.8872, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('mohawk', '01349527', 'MOHAWK R ABOVE STATE HIGHWAY 30A AT FONDA NY', 'usgs', 'ABOVE STATE HIGHWAY 30A AT FONDA NY', 42.9504, -74.3710, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('mohawk', '01354083', 'MOHAWK RIVER AT AMSTERDAM NY', 'usgs', 'AT AMSTERDAM NY', 42.9340, -74.1919, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('mohawk', '01354500', 'MOHAWK RIVER AT FREEMAN''S BRIDGE AT SCHENECTADY NY', 'usgs', 'AT FREEMAN''S BRIDGE AT SCHENECTADY NY', 42.8305, -73.9308, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('mohawk', '01357500', 'MOHAWK RIVER AT COHOES NY', 'usgs', 'AT COHOES NY', 42.7854, -73.7078, false);

-- Genesee River (NY) — 4 gauges
delete from public.river_gauges where river_id = 'genesee';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('genesee', '04231600', 'GENESEE RIVER AT FORD STREET BRIDGE, ROCHESTER NY', 'usgs', 'AT FORD STREET BRIDGE, ROCHESTER NY', 43.1417, -77.6163, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('genesee', '04227500', 'GENESEE RIVER NEAR MOUNT MORRIS NY', 'usgs', 'NEAR MOUNT MORRIS NY', 42.7667, -77.8389, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('genesee', '04228500', 'GENESEE RIVER AT AVON NY', 'usgs', 'AT AVON NY', 42.9227, -77.7574, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('genesee', '04230650', 'GENESEE R AT BALLANTYNE BRIDGE NEAR MORTIMER NY', 'usgs', 'AT BALLANTYNE BRIDGE NEAR MORTIMER NY', 43.0929, -77.6808, false);

-- Neversink River (NY) — 5 gauges
delete from public.river_gauges where river_id = 'neversink_ny';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('neversink_ny', '01435000', 'NEVERSINK RIVER NEAR CLARYVILLE NY', 'usgs', 'NEAR CLARYVILLE NY', 41.8899, -74.5898, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('neversink_ny', '01365505', 'NEVERSINK RES DIVERSION CHANNEL AT GRAHAMSVILLE NY', 'usgs', 'AT GRAHAMSVILLE NY', 41.8456, -74.5361, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('neversink_ny', '0143400680', 'E BR NEVERSINK R NORTHEAST OF DENNING NY', 'usgs', 'E BR NEVERSINK R NORTHEAST OF DENNING NY', 41.9674, -74.4481, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('neversink_ny', '01434017', 'EAST BRANCH NEVERSINK RIVER NEAR CLARYVILLE NY', 'usgs', 'NEAR CLARYVILLE NY', 41.9254, -74.5401, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('neversink_ny', '01434021', 'W BR NEVERSINK R AT WINNISOOK L NR FROST VALLEY NY', 'usgs', 'AT WINNISOOK L NR FROST VALLEY NY', 42.0111, -74.4144, false);

-- Hudson River (NY) — 3 gauges
delete from public.river_gauges where river_id = 'hudson_ny';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('hudson_ny', '01335754', 'HUDSON RIVER ABOVE LOCK 1 NEAR WATERFORD NY', 'usgs', 'ABOVE LOCK 1 NEAR WATERFORD NY', 42.8296, -73.6663, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('hudson_ny', '01335755', 'HUDSON RIVER AT LOCK 1 NEAR WATERFORD NY', 'usgs', 'AT LOCK 1 NEAR WATERFORD NY', 42.8248, -73.6611, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('hudson_ny', '01358000', 'HUDSON RIVER AT GREEN ISLAND NY', 'usgs', 'AT GREEN ISLAND NY', 42.7522, -73.6891, false);

-- Mongaup River (NY) — 3 gauges
delete from public.river_gauges where river_id = 'mongaup_ny';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('mongaup_ny', '01433500', 'MONGAUP RIVER NEAR MONGAUP NY', 'usgs', 'NEAR MONGAUP NY', 41.4612, -74.7588, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('mongaup_ny', '01432900', 'MONGAUP RIVER AT MONGAUP VALLEY NY', 'usgs', 'AT MONGAUP VALLEY NY', 41.6684, -74.7805, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('mongaup_ny', '01433005', 'MONGAUP R BELOW SWINGING BRIDGE RESERVOIR NY', 'usgs', 'BELOW SWINGING BRIDGE RESERVOIR NY', 41.5673, -74.7833, false);

-- Chattahoochee River — Metro Atlanta (GA) — 5 gauges
delete from public.river_gauges where river_id = 'chattahoochee';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('chattahoochee', '02336000', 'CHATTAHOOCHEE RIVER AT ATLANTA, GA', 'usgs', 'AT ATLANTA', 33.8592, -84.4544, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('chattahoochee', '02334430', 'CHATTAHOOCHEE RIVER AT BUFORD DAM, NEAR BUFORD, GA', 'usgs', 'AT BUFORD DAM, NEAR BUFORD', 34.1567, -84.0784, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('chattahoochee', '02334653', 'CHATTAHOOCHEE R 0.76 MI US MCGINNIS FY SUWANEE GA', 'usgs', 'CHATTAHOOCHEE R 0.76 MI US MCGINNIS FY SUWANEE GA', 34.0567, -84.1083, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('chattahoochee', '02335000', 'CHATTAHOOCHEE RIVER NEAR NORCROSS, GA', 'usgs', 'NEAR NORCROSS', 33.9972, -84.2019, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('chattahoochee', '02335450', 'CHATTAHOOCHEE RIVER ABOVE ROSWELL, GA', 'usgs', 'ABOVE ROSWELL', 33.9858, -84.3157, false);

-- Oconee River (GA) — 4 gauges
delete from public.river_gauges where river_id = 'oconee';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('oconee', '02218300', 'OCONEE RIVER NEAR PENFIELD, GA', 'usgs', 'NEAR PENFIELD', 33.7207, -83.2956, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('oconee', '02217475', 'MIDDLE OCONEE RIVER NEAR ARCADE, GA', 'usgs', 'NEAR ARCADE', 34.0318, -83.5631, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('oconee', '02217500', 'MIDDLE OCONEE RIVER NEAR ATHENS, GA', 'usgs', 'NEAR ATHENS', 33.9467, -83.4228, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('oconee', '02217770', 'NORTH OCONEE RIVER AT COLLEGE ST, AT ATHENS, GA', 'usgs', 'AT COLLEGE ST, AT ATHENS', 33.9697, -83.3776, false);

-- Etowah River (GA) — 5 gauges
delete from public.river_gauges where river_id = 'etowah';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('etowah', '02392000', 'ETOWAH RIVER AT CANTON, GA', 'usgs', 'AT CANTON', 34.2402, -84.4945, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('etowah', '02388975', 'ETOWAH RIVER AT GA 136, NEAR LANDDRUM, GA', 'usgs', 'AT GA 136, NEAR LANDDRUM', 34.4091, -84.0198, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('etowah', '02389050', 'ETOWAH RIVER 0.2 MI DS GA 53, NR DAWSONVILLE, GA', 'usgs', 'ETOWAH RIVER 0.2 MI DS GA 53, NR DAWSONVILLE, GA', 34.3794, -84.0647, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('etowah', '02389150', 'ETOWAH RIVER AT GA 9, NEAR DAWSONVILLE, GA', 'usgs', 'AT GA 9, NEAR DAWSONVILLE', 34.3576, -84.1136, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('etowah', '02390050', 'ETOWAH RIVER AT KELLY BRIDGE ROAD, NEAR MATT, GA', 'usgs', 'AT KELLY BRIDGE ROAD, NEAR MATT', 34.3526, -84.2062, false);

-- Broad River (GA) — 2 gauges
delete from public.river_gauges where river_id = 'broad_ga';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('broad_ga', '02191300', 'BROAD RIVER ABOVE CARLTON, GA', 'usgs', 'ABOVE CARLTON', 34.0742, -83.0039, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('broad_ga', '02192000', 'BROAD RIVER NEAR BELL, GA', 'usgs', 'NEAR BELL', 33.9726, -82.7709, false);

-- Coosawattee River (GA) — 3 gauges
delete from public.river_gauges where river_id = 'coosawattee';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('coosawattee', '02383500', 'COOSAWATTEE RIVER NEAR PINE CHAPEL, GA', 'usgs', 'NEAR PINE CHAPEL', 34.5642, -84.8331, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('coosawattee', '02380500', 'COOSAWATTEE RIVER NEAR ELLIJAY, GA', 'usgs', 'NEAR ELLIJAY', 34.6759, -84.5068, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('coosawattee', '02382500', 'COOSAWATTEE RIVER AT CARTERS, GA', 'usgs', 'AT CARTERS', 34.6038, -84.6958, false);

-- Tallulah River (GA) — 3 gauges
delete from public.river_gauges where river_id = 'tallulah_ga';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('tallulah_ga', '02178400', 'TALLULAH RIVER NEAR CLAYTON, GA', 'usgs', 'NEAR CLAYTON', 34.8900, -83.5306, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('tallulah_ga', '02181350', 'TALLULAH R AT TERRORA PWRHSE, NR TALLULAH FALLS,GA', 'usgs', 'AT TERRORA PWRHSE, NR TALLULAH FALLS', 34.7503, -83.4050, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('tallulah_ga', '02181580', 'TALLULAH RIVER AB POWERHOUSE, NR TALLULAH FALLS,GA', 'usgs', 'TALLULAH RIVER AB POWERHOUSE, NR TALLULAH FALLS,GA', 34.7319, -83.3754, false);

-- Ocmulgee River (GA) — 3 gauges
delete from public.river_gauges where river_id = 'ocmulgee_ga';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('ocmulgee_ga', '02215260', 'OCMULGEE RIVER AT ABBEVILLE, GA', 'usgs', 'AT ABBEVILLE', 31.9967, -83.2790, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('ocmulgee_ga', '02215000', 'OCMULGEE RIVER AT US 341, AT HAWKINSVILLE, GA', 'usgs', 'AT US 341, AT HAWKINSVILLE', 32.2830, -83.4623, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('ocmulgee_ga', '02215900', 'LITTLE OCMULGEE RIVER AT GA 149, AT SCOTLAND, GA', 'usgs', 'AT GA 149, AT SCOTLAND', 32.0524, -82.8156, false);

-- Satilla River (GA) — 4 gauges
delete from public.river_gauges where river_id = 'satilla_ga';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('satilla_ga', '02228000', 'SATILLA RIVER AT ATKINSON, GA', 'usgs', 'AT ATKINSON', 31.2196, -81.8664, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('satilla_ga', '02226500', 'SATILLA RIVER NEAR WAYCROSS, GA', 'usgs', 'NEAR WAYCROSS', 31.2384, -82.3228, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('satilla_ga', '02227500', 'LITTLE SATILLA RIVER NEAR OFFERMAN, GA', 'usgs', 'NEAR OFFERMAN', 31.4521, -82.0543, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('satilla_ga', '02228070', 'SATILLA RIVER AT US 17, AT WOODBINE, GA', 'usgs', 'AT US 17, AT WOODBINE', 30.9749, -81.7269, false);

-- Suwannee River (GA) — 2 gauges
delete from public.river_gauges where river_id = 'suwannee_ga';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('suwannee_ga', '02314495', 'SUWANNEE RIVER ABOVE FARGO, GA', 'usgs', 'ABOVE FARGO', 30.7075, -82.5392, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('suwannee_ga', '02314500', 'SUWANNEE RIVER AT US 441, AT FARGO, GA', 'usgs', 'AT US 441, AT FARGO', 30.6810, -82.5601, false);

-- Chattahoochee River (GA) — 5 gauges
delete from public.river_gauges where river_id = 'chattahoochee_ga';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('chattahoochee_ga', '02334401', 'CHATTAHOOCHEE RIVER BUFORD DAM NR BUFORD, GA', 'usgs', 'CHATTAHOOCHEE RIVER BUFORD DAM NR BUFORD, GA', 34.1616, -84.0761, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('chattahoochee_ga', '02334430', 'CHATTAHOOCHEE RIVER AT BUFORD DAM, NEAR BUFORD, GA', 'usgs', 'AT BUFORD DAM, NEAR BUFORD', 34.1567, -84.0784, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('chattahoochee_ga', '02334653', 'CHATTAHOOCHEE R 0.76 MI US MCGINNIS FY SUWANEE GA', 'usgs', 'CHATTAHOOCHEE R 0.76 MI US MCGINNIS FY SUWANEE GA', 34.0567, -84.1083, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('chattahoochee_ga', '02335000', 'CHATTAHOOCHEE RIVER NEAR NORCROSS, GA', 'usgs', 'NEAR NORCROSS', 33.9972, -84.2019, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('chattahoochee_ga', '02335450', 'CHATTAHOOCHEE RIVER ABOVE ROSWELL, GA', 'usgs', 'ABOVE ROSWELL', 33.9858, -84.3157, false);

-- Yellow River (GA) — 5 gauges
delete from public.river_gauges where river_id = 'yellow_ga';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('yellow_ga', '02207300', 'YELLOW RIVER AT MILSTEAD, GA', 'usgs', 'AT MILSTEAD', 33.6925, -83.9967, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('yellow_ga', '02206500', 'YELLOW RIVER NEAR SNELLVILLE, GA', 'usgs', 'NEAR SNELLVILLE', 33.8531, -84.0783, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('yellow_ga', '02207120', 'YELLOW RIVER AT GA 124, NEAR LITHONIA, GA', 'usgs', 'AT GA 124, NEAR LITHONIA', 33.7725, -84.0582, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('yellow_ga', '02207220', 'YELLOW RIVER AT PLEASANT HILL ROAD, NR LITHONIA,GA', 'usgs', 'AT PLEASANT HILL ROAD, NR LITHONIA', 33.7336, -84.0616, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('yellow_ga', '02207335', 'YELLOW RIVER AT GEES MILL ROAD, NEAR MILSTEAD, GA', 'usgs', 'AT GEES MILL ROAD, NEAR MILSTEAD', 33.6669, -83.9381, false);

-- Tallapoosa River (GA) — 4 gauges
delete from public.river_gauges where river_id = 'tallapoosa_ga';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('tallapoosa_ga', '02411930', 'TALLAPOOSA RIVER AT US 78, NEAR TALLAPOOSA, GA', 'usgs', 'AT US 78, NEAR TALLAPOOSA', 33.7414, -85.3361, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('tallapoosa_ga', '02413000', 'LITTLE TALLAPOOSA RIVER AT US 27, AT CARROLLTON,GA', 'usgs', 'AT US 27, AT CARROLLTON', 33.5968, -85.0794, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('tallapoosa_ga', '02413205', 'LITTLE TALLAPOOSA R AT REAVESVILLE RD NR BOWDON,GA', 'usgs', 'AT REAVESVILLE RD NR BOWDON', 33.5008, -85.2525, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('tallapoosa_ga', '02413210', 'LITTLE TALLAPOOSA R AT GA 100, NEAR BOWDON, GA', 'usgs', 'AT GA 100, NEAR BOWDON', 33.4927, -85.2793, false);

-- Root River (MN) — 3 gauges
delete from public.river_gauges where river_id = 'root';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('root', '05385000', 'ROOT RIVER NEAR HOUSTON, MN', 'usgs', 'NEAR HOUSTON', 43.7686, -91.5699, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('root', '05383950', 'ROOT RIVER NEAR PILOT MOUND, MN', 'usgs', 'NEAR PILOT MOUND', 43.7828, -92.0316, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('root', '05385500', 'SOUTH FORK ROOT RIVER NEAR HOUSTON, MN', 'usgs', 'NEAR HOUSTON', 43.7388, -91.5643, false);

-- Cannon River (MN) — 4 gauges
delete from public.river_gauges where river_id = 'cannon';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cannon', '05355200', 'CANNON RIVER AT WELCH, MN', 'usgs', 'AT WELCH', 44.5642, -92.7316, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cannon', '05354500', 'CANNON RIVER AT CO. HWY. 29 BELOW FARIBAULT, MN', 'usgs', 'AT CO. HWY. 29 BELOW FARIBAULT', 44.3597, -93.2567, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cannon', '05355024', 'CANNON RIVER AT NORTHFIELD MN', 'usgs', 'AT NORTHFIELD MN', 44.4586, -93.1597, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cannon', '05355092', 'CANNON RIVER AT 9TH ST. BRIDGE IN CANNON FALLS, MN', 'usgs', 'AT 9TH ST. BRIDGE IN CANNON FALLS', 44.5170, -92.9129, false);

-- Mississippi River (MN) — 3 gauges
delete from public.river_gauges where river_id = 'mississippi_mn';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('mississippi_mn', '05227500', 'MISSISSIPPI RIVER AT AITKIN, MN', 'usgs', 'AT AITKIN', 46.5407, -93.7074, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('mississippi_mn', '05227530', 'MISSISSIPPI RIVER DIVERSION NEAR AITKIN, MN', 'usgs', 'NEAR AITKIN', 46.5917, -93.6869, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('mississippi_mn', '05242300', 'MISSISSIPPI RIVER AT BRAINERD, MN', 'usgs', 'AT BRAINERD', 46.3777, -94.1826, false);

-- Otter Tail River (MN) — 2 gauges
delete from public.river_gauges where river_id = 'otter_tail_mn';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('otter_tail_mn', '05030500', 'OTTER TAIL RIVER NEAR ELIZABETH, MN', 'usgs', 'NEAR ELIZABETH', 46.3695, -96.0171, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('otter_tail_mn', '05046000', 'OTTER TAIL RIVER BL ORWELL D NR FERGUS FALLS, MN', 'usgs', 'OTTER TAIL RIVER BL ORWELL D NR FERGUS FALLS, MN', 46.2145, -96.1837, false);

-- Cottonwood River (MN) — 2 gauges
delete from public.river_gauges where river_id = 'cottonwood_mn';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cottonwood_mn', '05317000', 'COTTONWOOD RIVER NEAR NEW ULM, MN', 'usgs', 'NEAR NEW ULM', 44.2892, -94.4394, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cottonwood_mn', '05317200', 'LITTLE COTTONWOOD RIVER NEAR COURTLAND, MN', 'usgs', 'NEAR COURTLAND', 44.2466, -94.3390, false);

-- Chippewa River (MN) — 2 gauges
delete from public.river_gauges where river_id = 'chippewa_mn';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('chippewa_mn', '05304500', 'CHIPPEWA RIVER NEAR MILAN, MN', 'usgs', 'NEAR MILAN', 45.1085, -95.7988, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('chippewa_mn', '05305000', 'CHIPPEWA RIVER (TW) NEAR WATSON, MN', 'usgs', 'NEAR WATSON', 45.0211, -95.7917, false);

-- Kickapoo River (WI) — 3 gauges
delete from public.river_gauges where river_id = 'kickapoo';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('kickapoo', '05408000', 'KICKAPOO RIVER AT LA FARGE, WI', 'usgs', 'AT LA FARGE', 43.5742, -90.6432, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('kickapoo', '05407468', 'KICKAPOO R @ ST HWY 131 AT ONTARIO, WI', 'usgs', 'AT ONTARIO', 43.7299, -90.5889, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('kickapoo', '05410490', 'KICKAPOO RIVER AT STEUBEN, WI', 'usgs', 'AT STEUBEN', 43.1828, -90.8583, false);

-- Black River (WI) — 2 gauges
delete from public.river_gauges where river_id = 'black_wi';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('black_wi', '05381000', 'BLACK RIVER AT NEILLSVILLE, WI', 'usgs', 'AT NEILLSVILLE', 44.5597, -90.6150, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('black_wi', '053813595', 'BLACK RIVER DS ST HWY 54 AT BLACK RIVER FALLS, WI', 'usgs', 'AT BLACK RIVER FALLS', 44.2936, -90.8465, false);

-- Menominee River (WI) — 2 gauges
delete from public.river_gauges where river_id = 'menominee_wi';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('menominee_wi', '04067500', 'MENOMINEE RIVER NEAR MC ALLISTER, WI', 'usgs', 'NEAR MC ALLISTER', 45.3258, -87.6633, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('menominee_wi', '04066003', 'MENOMINEE RIVER BELOW PEMENE CREEK NR PEMBINE, WI', 'usgs', 'BELOW PEMENE CREEK NR PEMBINE', 45.5795, -87.7870, false);

-- Milwaukee River (WI) — 4 gauges
delete from public.river_gauges where river_id = 'milwaukee_wi';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('milwaukee_wi', '04087000', 'MILWAUKEE RIVER AT MILWAUKEE, WI', 'usgs', 'AT MILWAUKEE', 43.1000, -87.9090, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('milwaukee_wi', '04086600', 'MILWAUKEE RIVER NEAR CEDARBURG, WI', 'usgs', 'NEAR CEDARBURG', 43.2803, -87.9425, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('milwaukee_wi', '040871475', 'WILSON PARK CREEK @ GMIA OUTFALL 7 @ MILWAUKEE,WI', 'usgs', 'WILSON PARK CREEK @ GMIA OUTFALL 7 @ MILWAUKEE,WI', 42.9570, -87.9073, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('milwaukee_wi', '04087159', 'KINNICKINNIC RIVER @ S. 11TH STREET @ MILWAUKEE,WI', 'usgs', 'KINNICKINNIC RIVER @ S. 11TH STREET @ MILWAUKEE,WI', 42.9975, -87.9264, false);

-- Baraboo River (WI) — 2 gauges
delete from public.river_gauges where river_id = 'baraboo_wi';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('baraboo_wi', '054041665', 'BARABOO RIVER AT MAIN STREET AT REEDSBURG, WI', 'usgs', 'AT MAIN STREET AT REEDSBURG', 43.5324, -90.0114, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('baraboo_wi', '05405000', 'BARABOO RIVER NEAR BARABOO, WI', 'usgs', 'NEAR BARABOO', 43.4817, -89.6364, false);

-- Rock River (WI) — 4 gauges
delete from public.river_gauges where river_id = 'rock_wi';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('rock_wi', '05424057', 'ROCK RIVER AT HORICON, WI', 'usgs', 'AT HORICON', 43.4503, -88.6322, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('rock_wi', '05423500', 'SOUTH BRANCH ROCK RIVER AT WAUPUN, WI', 'usgs', 'AT WAUPUN', 43.6417, -88.7207, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('rock_wi', '05424157', 'ROCK RIVER NEAR LEBANON, WI', 'usgs', 'NEAR LEBANON', 43.2619, -88.5743, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('rock_wi', '05425500', 'ROCK RIVER AT WATERTOWN, WI', 'usgs', 'AT WATERTOWN', 43.1881, -88.7261, false);

-- Sugar River (WI) — 2 gauges
delete from public.river_gauges where river_id = 'sugar_wi';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('sugar_wi', '05436500', 'SUGAR RIVER NEAR BRODHEAD, WI', 'usgs', 'NEAR BRODHEAD', 42.6123, -89.3980, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('sugar_wi', '05435950', 'SUGAR RIVER NEAR VERONA, WI', 'usgs', 'NEAR VERONA', 42.9492, -89.5442, false);

-- Yahara River (WI) — 5 gauges
delete from public.river_gauges where river_id = 'yahara_wi';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('yahara_wi', '05428500', 'YAHARA RIVER AT EAST MAIN STREET AT MADISON, WI', 'usgs', 'AT EAST MAIN STREET AT MADISON', 43.0894, -89.3608, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('yahara_wi', '05427718', 'YAHARA RIVER AT WINDSOR, WI', 'usgs', 'AT WINDSOR', 43.2089, -89.3525, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('yahara_wi', '05427850', 'YAHARA RIVER AT STATE HIGHWAY 113 AT MADISON, WI', 'usgs', 'AT STATE HIGHWAY 113 AT MADISON', 43.1508, -89.4019, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('yahara_wi', '05429500', 'YAHARA RIVER AT MC FARLAND, WI', 'usgs', 'AT MC FARLAND', 43.0089, -89.3050, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('yahara_wi', '05429700', 'YAHARA RIVER @ FORTON STREET BRIDGE @ STOUGHTON,WI', 'usgs', 'YAHARA RIVER @ FORTON STREET BRIDGE @ STOUGHTON,WI', 42.9197, -89.2204, false);

-- Red Cedar River (WI) — 2 gauges
delete from public.river_gauges where river_id = 'red_cedar_wi';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('red_cedar_wi', '05367500', 'RED CEDAR RIVER NEAR COLFAX, WI', 'usgs', 'NEAR COLFAX', 45.0531, -91.7119, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('red_cedar_wi', '05369000', 'RED CEDAR RIVER AT MENOMONIE, WI', 'usgs', 'AT MENOMONIE', 44.8753, -91.9381, false);

-- Chippewa River (WI) — 3 gauges
delete from public.river_gauges where river_id = 'chippewa_wi';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('chippewa_wi', '05365500', 'CHIPPEWA RIVER AT CHIPPEWA FALLS, WI', 'usgs', 'AT CHIPPEWA FALLS', 44.9267, -91.4108, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('chippewa_wi', '05365550', 'CHIPPEWA RIVER BELOW DELLS DAM AT EAU CLAIRE, WI', 'usgs', 'BELOW DELLS DAM AT EAU CLAIRE', 44.8226, -91.5076, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('chippewa_wi', '05366800', 'CHIPPEWA R AT GRAND AVE AT EAU CLAIRE, WI', 'usgs', 'AT GRAND AVE AT EAU CLAIRE', 44.8096, -91.5030, false);

-- Upper Iowa River (IA) — 3 gauges
delete from public.river_gauges where river_id = 'upper_iowa';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('upper_iowa', '05388250', 'Upper Iowa River near Dorchester, IA', 'usgs', 'Near Dorchester', 43.4211, -91.5088, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('upper_iowa', '05387440', 'Upper Iowa River at Bluffton, IA', 'usgs', 'At Bluffton', 43.4069, -91.8990, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('upper_iowa', '05387500', 'Upper Iowa River at Decorah, IA', 'usgs', 'At Decorah', 43.3049, -91.7955, false);

-- Maquoketa River (IA) — 2 gauges
delete from public.river_gauges where river_id = 'maquoketa';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('maquoketa', '05418500', 'Maquoketa River near Maquoketa, IA', 'usgs', 'Near Maquoketa', 42.0834, -90.6329, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('maquoketa', '05418400', 'North Fork Maquoketa River near Fulton, IA', 'usgs', 'Near Fulton', 42.1643, -90.7293, false);

-- Cedar River (IA) — 5 gauges
delete from public.river_gauges where river_id = 'cedar_ia';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cedar_ia', '05464500', 'Cedar River at Cedar Rapids, IA', 'usgs', 'At Cedar Rapids', 41.9719, -91.6671, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cedar_ia', '05464315', 'Cedar River at Vinton, IA', 'usgs', 'At Vinton', 42.1708, -92.0238, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cedar_ia', '05464420', 'Cedar River at Blairs Ferry Road at Palo, IA', 'usgs', 'At Blairs Ferry Road at Palo', 42.0692, -91.7852, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cedar_ia', '05464730', 'Cedar River below Indian Creek at Cedar Rapids, IA', 'usgs', 'Below Indian Creek at Cedar Rapids', 41.9630, -91.5771, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cedar_ia', '05464780', 'Cedar River at Cedar Bluff, IA', 'usgs', 'At Cedar Bluff', 41.7872, -91.3137, false);

-- Des Moines River (IA) — 4 gauges
delete from public.river_gauges where river_id = 'des_moines';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('des_moines', '05481650', 'Des Moines River near Saylorville, IA', 'usgs', 'Near Saylorville', 41.6803, -93.6676, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('des_moines', '05482000', 'Des Moines River at 2nd Avenue at Des Moines, IA', 'usgs', 'At 2nd Avenue at Des Moines', 41.6119, -93.6197, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('des_moines', '05485500', 'Des Moines River blw Raccoon Riv at Des Moines, IA', 'usgs', 'At Des Moines', 41.5786, -93.6056, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('des_moines', '05487520', 'Des Moines River near Swan, IA', 'usgs', 'Near Swan', 41.4894, -93.2782, false);

-- Turkey River (IA) — 2 gauges
delete from public.river_gauges where river_id = 'turkey';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('turkey', '05412500', 'Turkey River at Garber, IA', 'usgs', 'At Garber', 42.7400, -91.2618, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('turkey', '05412020', 'Turkey River above French Hollow Cr at Elkader, IA', 'usgs', 'Above French Hollow Cr at Elkader', 42.8435, -91.4013, false);

-- Iowa River (IA) — 3 gauges
delete from public.river_gauges where river_id = 'iowa_ia';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('iowa_ia', '05451770', 'Iowa River at County Highway E49 near Tama, IA', 'usgs', 'At County Highway E49 near Tama', 41.9643, -92.6365, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('iowa_ia', '05451500', 'Iowa River at Marshalltown, IA', 'usgs', 'At Marshalltown', 42.0658, -92.9077, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('iowa_ia', '05452500', 'Iowa River near Belle Plaine, IA', 'usgs', 'Near Belle Plaine', 41.8591, -92.2779, false);

-- North Raccoon River (IA) — 3 gauges
delete from public.river_gauges where river_id = 'north_raccoon_ia';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('north_raccoon_ia', '05482430', 'North Raccoon River near Lanesboro, IA', 'usgs', 'Near Lanesboro', 42.1691, -94.7260, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('north_raccoon_ia', '05482300', 'North Raccoon River near Sac City, IA', 'usgs', 'Near Sac City', 42.3546, -94.9910, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('north_raccoon_ia', '05482500', 'North Raccoon River near Jefferson, IA', 'usgs', 'Near Jefferson', 41.9879, -94.3771, false);

-- South Skunk River (IA) — 2 gauges
delete from public.river_gauges where river_id = 'south_skunk_ia';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('south_skunk_ia', '05471050', 'South Skunk River at Colfax, IA', 'usgs', 'At Colfax', 41.6818, -93.2468, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('south_skunk_ia', '05471000', 'South Skunk River below Ioway Creek near Ames, IA', 'usgs', 'Below Ioway Creek near Ames', 42.0082, -93.5960, false);

-- East Fork Des Moines River (IA) — 2 gauges
delete from public.river_gauges where river_id = 'east_fork_des_moines_ia';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('east_fork_des_moines_ia', '05478265', 'East Fork Des Moines River near Algona, IA', 'usgs', 'Near Algona', 43.0827, -94.2306, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('east_fork_des_moines_ia', '05479000', 'East Fork Des Moines River at Dakota City, IA', 'usgs', 'At Dakota City', 42.7236, -94.1933, false);

-- Boone River (IA) — 2 gauges
delete from public.river_gauges where river_id = 'boone_ia';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('boone_ia', '05480820', 'Boone River near Goldfield, IA', 'usgs', 'Near Goldfield', 42.7244, -93.9467, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('boone_ia', '05481000', 'Boone River near Webster City, IA', 'usgs', 'Near Webster City', 42.4320, -93.8059, false);

-- Middle Raccoon River (IA) — 2 gauges
delete from public.river_gauges where river_id = 'middle_raccoon_ia';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('middle_raccoon_ia', '05483450', 'Middle Raccoon River near Bayard, IA', 'usgs', 'Near Bayard', 41.7791, -94.4930, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('middle_raccoon_ia', '05483600', 'Middle Raccoon River at Panora, IA', 'usgs', 'At Panora', 41.6874, -94.3711, false);

-- Rock River (IA) — 2 gauges
delete from public.river_gauges where river_id = 'rock_ia';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('rock_ia', '06483500', 'Rock River near Rock Valley, IA', 'usgs', 'Near Rock Valley', 43.2151, -96.2950, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('rock_ia', '06483290', 'Rock River below Tom Creek at Rock Rapids, IA', 'usgs', 'Below Tom Creek at Rock Rapids', 43.4231, -96.1649, false);

-- South Fork Iowa River (IA) — 2 gauges
delete from public.river_gauges where river_id = 'south_fork_iowa_ia';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('south_fork_iowa_ia', '05451210', 'South Fork Iowa River NE of New Providence, IA', 'usgs', 'South Fork Iowa River NE of New Providence, IA', 42.3153, -93.1522, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('south_fork_iowa_ia', '05470000', 'South Skunk River near Ames, IA', 'usgs', 'Near Ames', 42.0666, -93.6202, false);

-- Chariton River (IA) — 3 gauges
delete from public.river_gauges where river_id = 'chariton_ia';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('chariton_ia', '06904010', 'Chariton River near Moulton, IA', 'usgs', 'Near Moulton', 40.6925, -92.7726, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('chariton_ia', '06903700', 'South Fork Chariton River near Promise City, IA', 'usgs', 'Near Promise City', 40.8004, -93.1927, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('chariton_ia', '06903900', 'Chariton River near Rathbun, IA', 'usgs', 'Near Rathbun', 40.8219, -92.8910, false);

-- Raccoon River (IA) — 5 gauges
delete from public.river_gauges where river_id = 'raccoon_ia';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('raccoon_ia', '05484600', 'Raccoon River near West Des Moines, IA', 'usgs', 'Near West Des Moines', 41.5281, -93.7819, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('raccoon_ia', '05484000', 'South Raccoon River at Redfield, IA', 'usgs', 'At Redfield', 41.5904, -94.1512, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('raccoon_ia', '05484500', 'Raccoon River at Van Meter, IA', 'usgs', 'At Van Meter', 41.5340, -93.9498, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('raccoon_ia', '05484650', 'Raccoon River at 63rd Street at Des Moines, IA', 'usgs', 'At 63rd Street at Des Moines', 41.5617, -93.7033, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('raccoon_ia', '05484900', 'Raccoon River at Fleur Drive at Des Moines, IA', 'usgs', 'At Fleur Drive at Des Moines', 41.5815, -93.6427, false);

-- Bayou Bartholomew (AR) — 3 gauges
delete from public.river_gauges where river_id = 'bayou_bartholomew_ar';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('bayou_bartholomew_ar', '07364150', 'Bayou Bartholomew near McGehee, AR', 'usgs', 'Near McGehee', 33.6278, -91.4458, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('bayou_bartholomew_ar', '07364133', 'Bayou Bartholomew at Garrett Bridge, AR', 'usgs', 'At Garrett Bridge', 33.8664, -91.6561, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('bayou_bartholomew_ar', '07364185', 'Bayou Bartholomew near Portland, AR', 'usgs', 'Near Portland', 33.2356, -91.5356, false);

-- Buffalo River (AR) — 3 gauges
delete from public.river_gauges where river_id = 'buffalo_ar';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('buffalo_ar', '07056000', 'Buffalo River near St. Joe, AR', 'usgs', 'Near St. Joe', 35.9831, -92.7472, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('buffalo_ar', '07055680', 'Buffalo River at Pruitt, AR', 'usgs', 'At Pruitt', 36.0592, -93.1378, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('buffalo_ar', '07056700', 'Buffalo River near Harriet, AR', 'usgs', 'Near Harriet', 36.0678, -92.5775, false);

-- Amite River (LA) — 2 gauges
delete from public.river_gauges where river_id = 'amite';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('amite', '07378500', 'Amite River near Denham Springs, LA', 'usgs', 'Near Denham Springs', 30.4641, -90.9904, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('amite', '07380120', 'Amite River at Port Vincent, LA', 'usgs', 'At Port Vincent', 30.3327, -90.8520, false);

-- Comite River (LA) — 2 gauges
delete from public.river_gauges where river_id = 'comite';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('comite', '07378000', 'Comite River near Comite, LA', 'usgs', 'Near Comite', 30.5127, -91.0737, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('comite', '07377600', 'Comite R. at Pt. Hudson-Pride Rd near Milldale, LA', 'usgs', 'At Pt. Hudson-Pride Rd near Milldale', 30.7023, -91.0513, false);

-- Bayou Teche (LA) — 2 gauges
delete from public.river_gauges where river_id = 'bayou_teche_la';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('bayou_teche_la', '07385700', 'Bayou Teche at Keystone L&D nr St. Martinville, LA', 'usgs', 'At Keystone L&D nr St. Martinville', 30.0710, -91.8293, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('bayou_teche_la', '07385765', 'Bayou Teche at Adeline Bridge near Jeanerette, LA', 'usgs', 'At Adeline Bridge near Jeanerette', 29.8794, -91.5862, false);

-- Leaf River (MS) — 3 gauges
delete from public.river_gauges where river_id = 'leaf';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('leaf', '02473000', 'LEAF RIVER AT HATTIESBURG, MS', 'usgs', 'AT HATTIESBURG', 31.3431, -89.2803, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('leaf', '02472000', 'LEAF RIVER NR COLLINS, MS', 'usgs', 'LEAF RIVER NR COLLINS, MS', 31.7069, -89.4069, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('leaf', '02474560', 'LEAF RIVER NR NEW AUGUSTA, MS', 'usgs', 'LEAF RIVER NR NEW AUGUSTA, MS', 31.2217, -89.0531, false);

-- Pearl River (MS) — 3 gauges
delete from public.river_gauges where river_id = 'pearl';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('pearl', '02482000', 'PEARL RIVER AT EDINBURG, MS', 'usgs', 'AT EDINBURG', 32.7989, -89.3350, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('pearl', '02482550', 'PEARL RIVER NR CARTHAGE, MS', 'usgs', 'PEARL RIVER NR CARTHAGE, MS', 32.7072, -89.5264, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('pearl', '02483500', 'PEARL RIVER NR LENA, MS', 'usgs', 'PEARL RIVER NR LENA, MS', 32.6672, -89.6461, false);

-- Cahaba River (AL) — 5 gauges
delete from public.river_gauges where river_id = 'cahaba';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cahaba', '02423500', 'CAHABA RIVER NEAR ACTON AL', 'usgs', 'NEAR ACTON AL', 33.3634, -86.8130, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cahaba', '02423130', 'CAHABA RIVER AT TRUSSVILLE, AL.', 'usgs', 'AT TRUSSVILLE, AL.', 33.6223, -86.5994, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cahaba', '02423160', 'CAHABA RIVER NEAR WHITES CHAPEL AL', 'usgs', 'NEAR WHITES CHAPEL AL', 33.6037, -86.5492, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cahaba', '02423380', 'CAHABA RIVER NEAR MOUNTAIN BROOK AL', 'usgs', 'NEAR MOUNTAIN BROOK AL', 33.4818, -86.7128, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cahaba', '02423397', 'LITTLE CAHABA RIVER BELOW LEEDS, AL.', 'usgs', 'BELOW LEEDS, AL.', 33.5345, -86.5625, false);

-- Mulberry Fork (AL) — 2 gauges
delete from public.river_gauges where river_id = 'mulberry_al';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('mulberry_al', '02450000', 'MULBERRY FORK NEAR GARDEN CITY, AL.', 'usgs', 'NEAR GARDEN CITY, AL.', 34.0120, -86.7367, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('mulberry_al', '02450180', 'MULBERRY FORK NEAR ARKADELPHIA, AL.', 'usgs', 'NEAR ARKADELPHIA, AL.', 33.8720, -86.9222, false);

-- Tallapoosa River (AL) — 4 gauges
delete from public.river_gauges where river_id = 'tallapoosa';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('tallapoosa', '02414500', 'TALLAPOOSA RIVER AT WADLEY AL', 'usgs', 'AT WADLEY AL', 33.1168, -85.5608, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('tallapoosa', '02413300', 'LITTLE TALLAPOOSA RIVER NEAR NEWELL AL', 'usgs', 'NEAR NEWELL AL', 33.4373, -85.3991, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('tallapoosa', '02414300', 'TALLAPOOSA RIVER AT MALONE, ALABAMA', 'usgs', 'AT MALONE, ALABAMA', 33.1971, -85.5772, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('tallapoosa', '02414715', 'TALLAPOOSA RIVER NR NEW SITE, AL.(HORSESHOE BEND)', 'usgs', 'TALLAPOOSA RIVER NR NEW SITE, AL.(HORSESHOE BEND)', 32.9774, -85.7397, false);

-- Alabama River (AL) — 3 gauges
delete from public.river_gauges where river_id = 'alabama_al';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('alabama_al', '02428401', 'ALABAMA RIVER BEL CLAIB. L&D NR MONROEVILLE, AL.', 'usgs', 'ALABAMA RIVER BEL CLAIB. L&D NR MONROEVILLE, AL.', 31.6135, -87.5505, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('alabama_al', '02428400', 'ALABAMA RIVER AT CLAIBORNE L&D NEAR MONROEVILLE', 'usgs', 'AT CLAIBORNE L&D NEAR MONROEVILLE', 31.6152, -87.5505, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('alabama_al', '02429540', 'ALABAMA RIVER AT CHOCTAW BLUFF, AL.', 'usgs', 'AT CHOCTAW BLUFF, AL.', 31.3638, -87.7650, false);

-- Peace River (FL) — 5 gauges
delete from public.river_gauges where river_id = 'peace';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('peace', '02295637', 'PEACE RIVER AT US 17 AT ZOLFO SPRINGS, FL', 'usgs', 'AT US 17 AT ZOLFO SPRINGS', 27.5045, -81.8002, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('peace', '02293987', 'PEACE CREEK DRAINAGE CANAL NEAR WAHNETA FL', 'usgs', 'NEAR WAHNETA FL', 27.9247, -81.7267, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('peace', '02294161', 'PEACE CREEK NEAR BARTOW FL', 'usgs', 'NEAR BARTOW FL', 27.9244, -81.7956, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('peace', '02294650', 'PEACE RIVER AT SR 60 AT BARTOW, FL', 'usgs', 'AT SR 60 AT BARTOW', 27.9022, -81.8173, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('peace', '02294655', 'PEACE RIVER NEAR BARTOW FL', 'usgs', 'NEAR BARTOW FL', 27.8831, -81.8044, false);

-- Suwannee River (FL) — 5 gauges
delete from public.river_gauges where river_id = 'suwannee';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('suwannee', '02320500', 'SUWANNEE RIVER AT BRANFORD, FLA.', 'usgs', 'AT BRANFORD, FLA.', 29.9558, -82.9276, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('suwannee', '02315500', 'SUWANNEE RIVER AT WHITE SPRINGS, FLA.', 'usgs', 'AT WHITE SPRINGS, FLA.', 30.3258, -82.7382, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('suwannee', '02319800', 'SUWANNEE RIVER AT DOWLING PARK, FLORIDA', 'usgs', 'AT DOWLING PARK, FLORIDA', 30.2449, -83.2496, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('suwannee', '02320000', 'SUWANNEE RIVER AT LURAVILLE, FLA.', 'usgs', 'AT LURAVILLE, FLA.', 30.0999, -83.1715, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('suwannee', '02323000', 'SUWANNEE RIVER NEAR BELL, FLORIDA', 'usgs', 'NEAR BELL, FLORIDA', 29.7913, -82.9243, false);

-- Wekiva River (FL) — 2 gauges
delete from public.river_gauges where river_id = 'wekiva';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('wekiva', '02235000', 'WEKIVA RIVER NEAR SANFORD, FL', 'usgs', 'NEAR SANFORD', 28.8143, -81.4193, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('wekiva', '02234990', 'LITTLE WEKIVA RIVER NEAR ALTAMONTE SPRINGS, FL', 'usgs', 'NEAR ALTAMONTE SPRINGS', 28.6872, -81.3970, false);

-- Rainbow River (FL) — 2 gauges
delete from public.river_gauges where river_id = 'rainbow';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('rainbow', '02313100', 'RAINBOW RIVER AT DUNNELLON, FL', 'usgs', 'AT DUNNELLON', 29.0494, -82.4476, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('rainbow', '02313098', 'RAINBOW RIVER NEAR DUNNELLON, FL', 'usgs', 'NEAR DUNNELLON', 29.0713, -82.4266, false);

-- Hillsborough River (FL) — 5 gauges
delete from public.river_gauges where river_id = 'hillsborough';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('hillsborough', '02304500', 'HILLSBOROUGH RIVER NEAR TAMPA FL', 'usgs', 'NEAR TAMPA FL', 28.0239, -82.4276, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('hillsborough', '02301990', 'HILLSBOROUGH R AB CRYSTAL SPR NEAR ZEPHYRHILLS FL', 'usgs', 'NEAR ZEPHYRHILLS FL', 28.1856, -82.1842, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('hillsborough', '02302010', 'HILLSBOROUGH R BL CRYSTAL SPR NEAR ZEPHYRHILLS FL', 'usgs', 'NEAR ZEPHYRHILLS FL', 28.1786, -82.1892, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('hillsborough', '02303000', 'HILLSBOROUGH RV AT STATE PARK NR ZEPHYRHILLS, FL', 'usgs', 'AT STATE PARK NR ZEPHYRHILLS', 28.1503, -82.2318, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('hillsborough', '02303330', 'HILLSBOROUGH R AT MORRIS BR NEAR THONOTOSASSA FL', 'usgs', 'AT MORRIS BR NEAR THONOTOSASSA FL', 28.0986, -82.3114, false);

-- Santa Fe River (FL) — 5 gauges
delete from public.river_gauges where river_id = 'santa_fe';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('santa_fe', '02321500', 'SANTA FE RIVER AT WORTHINGTON SPRINGS, FLA.', 'usgs', 'AT WORTHINGTON SPRINGS, FLA.', 29.9219, -82.4262, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('santa_fe', '02321898', 'SANTA FE RIVER AT O''LENO STATE PARK FLA', 'usgs', 'AT O''LENO STATE PARK FLA', 29.9266, -82.5596, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('santa_fe', '02321958', 'SANTA FE RIVER AT RIVER RISE NR HIGH SPRINGS, FL', 'usgs', 'AT RIVER RISE NR HIGH SPRINGS', 29.8736, -82.5912, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('santa_fe', '02321975', 'SANTA FE RIVER AT US HWY 441 NEAR HIGH SPRINGS,FL.', 'usgs', 'AT US HWY 441 NEAR HIGH SPRINGS,FL.', 29.8525, -82.6086, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('santa_fe', '02322500', 'SANTA FE RIVER NEAR FORT WHITE, FLA.', 'usgs', 'NEAR FORT WHITE, FLA.', 29.8488, -82.7151, false);

-- Apalachicola River (FL) — 2 gauges
delete from public.river_gauges where river_id = 'apalachicola_fl';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('apalachicola_fl', '02359170', 'APALACHICOLA RIVER NR SUMATRA,FLA.', 'usgs', 'APALACHICOLA RIVER NR SUMATRA,FLA.', 29.9494, -85.0155, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('apalachicola_fl', '02358754', 'APALACHICOLA R.AB CHIPOLA CUTOFF NR WEWAHITCHKA,FL', 'usgs', 'APALACHICOLA R.AB CHIPOLA CUTOFF NR WEWAHITCHKA,FL', 30.1323, -85.1420, false);

-- Withlacoochee River (FL) — 5 gauges
delete from public.river_gauges where river_id = 'withlacoochee_fl';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('withlacoochee_fl', '02312598', 'WITHLACOOCHEE RIVER NR PINEOLA, FL', 'usgs', 'WITHLACOOCHEE RIVER NR PINEOLA, FL', 28.7242, -82.2423, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('withlacoochee_fl', '02311500', 'WITHLACOOCHEE RIVER NEAR DADE CITY, FL', 'usgs', 'NEAR DADE CITY', 28.3525, -82.1259, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('withlacoochee_fl', '02312000', 'WITHLACOOCHEE RIVER AT US 301 AT TRILBY, FL', 'usgs', 'AT US 301 AT TRILBY', 28.4800, -82.1776, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('withlacoochee_fl', '02312180', 'LITTLE WITHLACOOCHEE RIVER NEAR TARRYTOWN, FL', 'usgs', 'NEAR TARRYTOWN', 28.5217, -82.0548, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('withlacoochee_fl', '02312200', 'LITTLE WITHLACOOCHEE RIVER AT RERDELL, FL', 'usgs', 'AT RERDELL', 28.5728, -82.1554, false);

-- Choctawhatchee River (FL) — 3 gauges
delete from public.river_gauges where river_id = 'choctawhatchee_fl';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('choctawhatchee_fl', '02365500', 'CHOCTAWHATCHEE RIVER AT CARYVILLE, FLA.', 'usgs', 'AT CARYVILLE, FLA.', 30.7757, -85.8277, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('choctawhatchee_fl', '02365200', 'CHOCTAWHATCHEE RIVER NR PITTMAN, FLA.', 'usgs', 'CHOCTAWHATCHEE RIVER NR PITTMAN, FLA.', 30.9499, -85.8430, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('choctawhatchee_fl', '02366500', 'CHOCTAWHATCHEE RIVER NR BRUCE, FLA.', 'usgs', 'CHOCTAWHATCHEE RIVER NR BRUCE, FLA.', 30.4510, -85.8983, false);

-- Yellow River (FL) — 3 gauges
delete from public.river_gauges where river_id = 'yellow_fl';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('yellow_fl', '02368000', 'YELLOW RIVER AT MILLIGAN, FLA.', 'usgs', 'AT MILLIGAN, FLA.', 30.7530, -86.6291, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('yellow_fl', '02367900', 'YELLOW RIVER NR OAK GROVE, FLA.', 'usgs', 'YELLOW RIVER NR OAK GROVE, FLA.', 30.9252, -86.5594, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('yellow_fl', '02369600', 'YELLOW RIVER NR MILTON, FLA.', 'usgs', 'YELLOW RIVER NR MILTON, FLA.', 30.5696, -86.9236, false);

-- Chipola River (FL) — 3 gauges
delete from public.river_gauges where river_id = 'chipola_fl';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('chipola_fl', '02359000', 'CHIPOLA RIVER NR ALTHA, FLA.', 'usgs', 'CHIPOLA RIVER NR ALTHA, FLA.', 30.5341, -85.1652, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('chipola_fl', '02358754', 'APALACHICOLA R.AB CHIPOLA CUTOFF NR WEWAHITCHKA,FL', 'usgs', 'APALACHICOLA R.AB CHIPOLA CUTOFF NR WEWAHITCHKA,FL', 30.1323, -85.1420, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('chipola_fl', '02358789', 'CHIPOLA RIVER AT MARIANNA FL', 'usgs', 'AT MARIANNA FL', 30.7730, -85.2163, false);

-- Myakka River (FL) — 5 gauges
delete from public.river_gauges where river_id = 'myakka_fl';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('myakka_fl', '02298880', 'MYAKKA RIVER AT CONTROL NEAR LAUREL FL', 'usgs', 'AT CONTROL NEAR LAUREL FL', 27.1856, -82.3556, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('myakka_fl', '02298488', 'MYAKKA RIVER UPST FROM YOUNGS CK NR MYAKKA CITY FL', 'usgs', 'MYAKKA RIVER UPST FROM YOUNGS CK NR MYAKKA CITY FL', 27.4292, -82.1387, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('myakka_fl', '02298554', 'MYAKKA RIVER NEAR MYAKKA CITY FL', 'usgs', 'NEAR MYAKKA CITY FL', 27.3662, -82.1493, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('myakka_fl', '02298608', 'MYAKKA RIVER AT MYAKKA CITY FL', 'usgs', 'AT MYAKKA CITY FL', 27.3437, -82.1568, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('myakka_fl', '02298830', 'MYAKKA RIVER NEAR SR 72 NEAR SARASOTA, FL', 'usgs', 'NEAR SR 72 NEAR SARASOTA', 27.2352, -82.3119, false);

-- Little Manatee River (FL) — 4 gauges
delete from public.river_gauges where river_id = 'little_manatee_fl';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('little_manatee_fl', '02300500', 'LITTLE MANATEE RIVER AT US 301 NEAR WIMAUMA, FL', 'usgs', 'AT US 301 NEAR WIMAUMA', 27.6711, -82.3526, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('little_manatee_fl', '02300100', 'LITTLE MANATEE RIVER NEAR FT. LONESOME FL', 'usgs', 'NEAR FT. LONESOME FL', 27.7048, -82.1979, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('little_manatee_fl', '02300210', 'SOUTH FORK LITTLE MANATEE RIVER NEAR PARRISH FL', 'usgs', 'NEAR PARRISH FL', 27.6020, -82.2112, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('little_manatee_fl', '02300300', 'SOUTH FORK LITTLE MANATEE RIVER NEAR WIMAUMA FL', 'usgs', 'NEAR WIMAUMA FL', 27.6495, -82.2943, false);

-- Ochlockonee River (FL) — 3 gauges
delete from public.river_gauges where river_id = 'ochlockonee_fl';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('ochlockonee_fl', '02329000', 'OCHLOCKONEE RIVER NR HAVANA, FLA.', 'usgs', 'OCHLOCKONEE RIVER NR HAVANA, FLA.', 30.5541, -84.3841, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('ochlockonee_fl', '02328522', 'OCHLOCKONEE RIVER NR CONCORD, FLA.', 'usgs', 'OCHLOCKONEE RIVER NR CONCORD, FLA.', 30.6691, -84.3052, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('ochlockonee_fl', '02330000', 'OCHLOCKONEE RIVER NR BLOXHAM, FLA.', 'usgs', 'OCHLOCKONEE RIVER NR BLOXHAM, FLA.', 30.3833, -84.6549, false);

-- Saluda River (SC) — 2 gauges
delete from public.river_gauges where river_id = 'saluda';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('saluda', '02169000', 'SALUDA RIVER NEAR COLUMBIA, SC', 'usgs', 'NEAR COLUMBIA', 34.0140, -81.0879, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('saluda', '02168504', 'SALUDA RIVER BELOW LK MURRAY DAM NR COLUMBIA, SC', 'usgs', 'BELOW LK MURRAY DAM NR COLUMBIA', 34.0510, -81.2095, false);

-- Edisto River (SC) — 4 gauges
delete from public.river_gauges where river_id = 'edisto';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('edisto', '02175000', 'EDISTO RIVER NR GIVHANS, SC', 'usgs', 'EDISTO RIVER NR GIVHANS, SC', 33.0279, -80.3915, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('edisto', '02174000', 'EDISTO RIVER NEAR BRANCHVILLE, SC', 'usgs', 'NEAR BRANCHVILLE', 33.1766, -80.8012, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('edisto', '02174055', 'EDISTO RIVER BELOW CANADYS, SC', 'usgs', 'BELOW CANADYS', 33.0617, -80.5244, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('edisto', '02175025', 'EDISTO RIVER BELOW JACKSONBORO, SC', 'usgs', 'BELOW JACKSONBORO', 32.7539, -80.4502, false);

-- Broad River (SC) — 3 gauges
delete from public.river_gauges where river_id = 'broad_sc';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('broad_sc', '02156500', 'BROAD RIVER NEAR CARLISLE, SC', 'usgs', 'NEAR CARLISLE', 34.5951, -81.4212, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('broad_sc', '021564493', 'BROAD RIVER BELOW NEAL SHOALS RES NR CARLISLE, SC', 'usgs', 'BELOW NEAL SHOALS RES NR CARLISLE', 34.6631, -81.4472, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('broad_sc', '02161000', 'BROAD RIVER AT ALSTON, SC', 'usgs', 'AT ALSTON', 34.2432, -81.3195, false);

-- Congaree River (SC) — 2 gauges
delete from public.river_gauges where river_id = 'congaree';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('congaree', '02169500', 'CONGAREE RIVER AT COLUMBIA, SC', 'usgs', 'AT COLUMBIA', 33.9932, -81.0498, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('congaree', '02169625', 'CONGAREE RIVER AT CONGAREE NP NEAR GADSDEN, SC', 'usgs', 'AT CONGAREE NP NEAR GADSDEN', 33.8107, -80.8670, false);

-- Waccamaw River (SC) — 2 gauges
delete from public.river_gauges where river_id = 'waccamaw';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('waccamaw', '02110500', 'WACCAMAW RIVER NEAR LONGS, SC', 'usgs', 'NEAR LONGS', 33.9127, -78.7150, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('waccamaw', '02110550', 'WACCAMAW RIVER ABOVE CONWAY, SC', 'usgs', 'ABOVE CONWAY', 33.8508, -78.8972, false);

-- Enoree River (SC) — 2 gauges
delete from public.river_gauges where river_id = 'enoree';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('enoree', '02160700', 'ENOREE RIVER AT WHITMIRE, SC', 'usgs', 'AT WHITMIRE', 34.5093, -81.5982, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('enoree', '02160390', 'ENOREE RIVER NEAR WOODRUFF, SC', 'usgs', 'NEAR WOODRUFF', 34.6835, -82.0398, false);

-- Lynches River (SC) — 2 gauges
delete from public.river_gauges where river_id = 'lynches';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('lynches', '02132000', 'LYNCHES RIVER AT EFFINGHAM, SC', 'usgs', 'AT EFFINGHAM', 34.0515, -79.7540, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('lynches', '02131500', 'LYNCHES RIVER NEAR BISHOPVILLE, SC', 'usgs', 'NEAR BISHOPVILLE', 34.2502, -80.2137, false);

-- Wateree River (SC) — 2 gauges
delete from public.river_gauges where river_id = 'wateree';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('wateree', '02148000', 'WATEREE RIVER NR. CAMDEN, SC', 'usgs', 'WATEREE RIVER NR. CAMDEN, SC', 34.2446, -80.6540, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('wateree', '02147801', 'LAKE WATEREE TAILRACE ABOVE CAMDEN, SC', 'usgs', 'ABOVE CAMDEN', 34.3321, -80.6984, false);

-- Pee Dee River (SC) — 4 gauges
delete from public.river_gauges where river_id = 'pee_dee';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('pee_dee', '02131000', 'PEE DEE RIVER AT PEEDEE, SC', 'usgs', 'AT PEEDEE', 34.2043, -79.5484, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('pee_dee', '02131010', 'PEE DEE RIVER BELOW PEE DEE, SC', 'usgs', 'BELOW PEE DEE', 34.1574, -79.5534, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('pee_dee', '02132500', 'LITTLE PEE DEE RIVER NEAR DILLON, SC', 'usgs', 'NEAR DILLON', 34.4049, -79.3400, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('pee_dee', '02135000', 'LITTLE PEE DEE R. AT GALIVANTS FERRY, SC', 'usgs', 'AT GALIVANTS FERRY', 34.0568, -79.2477, false);

-- Little Pee Dee River (SC) — 3 gauges
delete from public.river_gauges where river_id = 'little_pee_dee_sc';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('little_pee_dee_sc', '02132715', 'LITTLE PEE DEE RIVER NEAR NICHOLS,SC', 'usgs', 'NEAR NICHOLS', 34.2069, -79.1725, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('little_pee_dee_sc', '02132500', 'LITTLE PEE DEE RIVER NEAR DILLON, SC', 'usgs', 'NEAR DILLON', 34.4049, -79.3400, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('little_pee_dee_sc', '02135000', 'LITTLE PEE DEE R. AT GALIVANTS FERRY, SC', 'usgs', 'AT GALIVANTS FERRY', 34.0568, -79.2477, false);

-- Santee River (SC) — 3 gauges
delete from public.river_gauges where river_id = 'santee_sc';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('santee_sc', '02171001', 'SANTEE R AT LK MARION TAILRACE NR PINEVILLE, SC', 'usgs', 'AT LK MARION TAILRACE NR PINEVILLE', 33.4502, -80.1637, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('santee_sc', '02171500', 'SANTEE RIVER NEAR PINEVILLE, SC', 'usgs', 'NEAR PINEVILLE', 33.4538, -80.1414, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('santee_sc', '02171700', 'SANTEE RIVER NR JAMESTOWN, SC', 'usgs', 'SANTEE RIVER NR JAMESTOWN, SC', 33.3049, -79.6781, false);

-- South Fork Edisto River (SC) — 4 gauges
delete from public.river_gauges where river_id = 'south_fork_edisto_sc';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('south_fork_edisto_sc', '02173000', 'SOUTH FORK EDISTO RIVER NEAR DENMARK, SC', 'usgs', 'NEAR DENMARK', 33.3932, -81.1332, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('south_fork_edisto_sc', '02172558', 'SOUTH FORK EDISTO RIVER ABOVE SPRINGFIELD, SC', 'usgs', 'ABOVE SPRINGFIELD', 33.5203, -81.4103, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('south_fork_edisto_sc', '02173030', 'SOUTH FORK EDISTO RIVER NEAR COPE, SC', 'usgs', 'NEAR COPE', 33.3590, -81.0595, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('south_fork_edisto_sc', '02173051', 'SOUTH FORK EDISTO RIVER NEAR BAMBERG, SC', 'usgs', 'NEAR BAMBERG', 33.3371, -81.0187, false);

-- North Fork Edisto River (SC) — 2 gauges
delete from public.river_gauges where river_id = 'north_fork_edisto_sc';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('north_fork_edisto_sc', '02173500', 'NORTH FORK EDISTO RIVER AT ORANGEBURG, SC', 'usgs', 'AT ORANGEBURG', 33.4779, -80.8747, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('north_fork_edisto_sc', '02173299', 'NORTH FORK EDISTO RIVER AT SC394, ABOVE NORTH, SC', 'usgs', 'AT SC394, ABOVE NORTH', 33.6070, -81.1356, false);

-- Reedy River (SC) — 3 gauges
delete from public.river_gauges where river_id = 'reedy_sc';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('reedy_sc', '02164110', 'REEDY RIVER ABOVE FORK SHOALS, SC', 'usgs', 'ABOVE FORK SHOALS', 34.6534, -82.2986, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('reedy_sc', '02164000', 'REEDY RIVER NEAR GREENVILLE, SC', 'usgs', 'NEAR GREENVILLE', 34.8000, -82.3646, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('reedy_sc', '021650905', 'REEDY RIVER NEAR WATERLOO, SC', 'usgs', 'NEAR WATERLOO', 34.3914, -82.1394, false);

-- Catawba River (SC) — 3 gauges
delete from public.river_gauges where river_id = 'catawba_sc';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('catawba_sc', '02147020', 'CATAWBA RIVER BELOW CATAWBA, SC', 'usgs', 'BELOW CATAWBA', 34.8363, -80.8795, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('catawba_sc', '02145910', 'CATAWBA RIVER BL LAKE WYLIE DAM FEWELL ISLAND, SC', 'usgs', 'CATAWBA RIVER BL LAKE WYLIE DAM FEWELL ISLAND, SC', 35.0164, -81.0016, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('catawba_sc', '02146000', 'CATAWBA RIVER NEAR ROCK HILL, SC', 'usgs', 'NEAR ROCK HILL', 34.9849, -80.9740, false);

-- Pacolet River (SC) — 5 gauges
delete from public.river_gauges where river_id = 'pacolet_sc';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('pacolet_sc', '02156350', 'PACOLET RIVER AT PACOLET, SC', 'usgs', 'AT PACOLET', 34.9212, -81.7424, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('pacolet_sc', '02154500', 'NORTH PACOLET RIVER AT FINGERVILLE, SC', 'usgs', 'AT FINGERVILLE', 35.1205, -81.9873, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('pacolet_sc', '02154790', 'SOUTH PACOLET RIVER NR CAMPOBELLO, SC', 'usgs', 'SOUTH PACOLET RIVER NR CAMPOBELLO, SC', 35.1063, -82.1298, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('pacolet_sc', '02155500', 'PACOLET RIVER NEAR FINGERVILLE, SC', 'usgs', 'NEAR FINGERVILLE', 35.1102, -81.9588, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('pacolet_sc', '021556525', 'PACOLET RIVER BELOW LAKE BLALOCK NEAR COWPENS, SC', 'usgs', 'BELOW LAKE BLALOCK NEAR COWPENS', 35.0476, -81.8557, false);

-- Coosawhatchie River (SC) — 2 gauges
delete from public.river_gauges where river_id = 'coosawhatchie_sc';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('coosawhatchie_sc', '021765182', 'COOSAWHATCHIE RIVER AT I95 NEAR RIDGELAND, SC', 'usgs', 'AT I95 NEAR RIDGELAND', 32.5884, -80.9235, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('coosawhatchie_sc', '02176500', 'COOSAWHATCHIE RIVER NEAR HAMPTON, SC', 'usgs', 'NEAR HAMPTON', 32.8363, -81.1318, false);

-- South Saluda River (SC) — 2 gauges
delete from public.river_gauges where river_id = 'south_saluda_sc';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('south_saluda_sc', '02162290', 'SOUTH SALUDA RIVER NEAR CLEVELAND, SC', 'usgs', 'NEAR CLEVELAND', 35.0635, -82.6505, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('south_saluda_sc', '021622845', 'SOUTH SALUDA RIVER NEAR ROCKY BOTTOM, SC', 'usgs', 'NEAR ROCKY BOTTOM', 35.0608, -82.7044, false);

-- North Saluda River (SC) — 2 gauges
delete from public.river_gauges where river_id = 'north_saluda_sc';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('north_saluda_sc', '021623975', 'NORTH SALUDA RIVER ABOVE SLATER, SC', 'usgs', 'ABOVE SLATER', 35.0836, -82.4600, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('north_saluda_sc', '021623950', 'NORTH SALUDA RIVER NEAR HIGHLAND, SC', 'usgs', 'NEAR HIGHLAND', 35.1672, -82.3647, false);

-- North Tyger River (SC) — 2 gauges
delete from public.river_gauges where river_id = 'north_tyger_sc';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('north_tyger_sc', '02157000', 'NORTH TYGER RIVER NEAR FAIRMONT, SC', 'usgs', 'NEAR FAIRMONT', 34.9301, -82.0438, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('north_tyger_sc', '021569983', 'NORTH TYGER RIVER AT WELLFORD, SC', 'usgs', 'AT WELLFORD', 34.9595, -82.0800, false);

-- Loup River (NE) — 2 gauges
delete from public.river_gauges where river_id = 'loup';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('loup', '06792500', 'Loup River Power Canal near Genoa, Nebr.', 'usgs', 'Near Genoa, Nebr.', 41.4095, -97.7938, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('loup', '06793000', 'Loup River near Genoa, Nebr.', 'usgs', 'Near Genoa, Nebr.', 41.4175, -97.7229, false);

-- Republican River (NE) — 2 gauges
delete from public.river_gauges where river_id = 'republican';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('republican', '06843500', 'Republican River at Cambridge, Nebr.', 'usgs', 'At Cambridge, Nebr.', 40.2844, -100.1436, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('republican', '06837000', 'Republican River at McCook, Nebr.', 'usgs', 'At McCook, Nebr.', 40.1876, -100.6189, false);

-- Middle Loup River (NE) — 2 gauges
delete from public.river_gauges where river_id = 'middle_loup';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('middle_loup', '06775500', 'Middle Loup River at Dunning, Nebr.', 'usgs', 'At Dunning, Nebr.', 41.8311, -100.1009, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('middle_loup', '06777495', 'Middle Loup River near Gates, Nebr.', 'usgs', 'Near Gates, Nebr.', 41.6632, -99.6357, false);

-- Cheyenne River (SD) — 3 gauges
delete from public.river_gauges where river_id = 'cheyenne_sd';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cheyenne_sd', '06408650', 'CHEYENNE RIVER NEAR SCENIC, SD', 'usgs', 'NEAR SCENIC', 43.8980, -102.6441, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cheyenne_sd', '06403700', 'CHEYENNE RIVER AT RED SHIRT, SD', 'usgs', 'AT RED SHIRT', 43.6724, -102.8921, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cheyenne_sd', '06423500', 'CHEYENNE RIVER NEAR WASTA, SD', 'usgs', 'NEAR WASTA', 44.0811, -102.4013, false);

-- Spearfish Creek (SD) — 3 gauges
delete from public.river_gauges where river_id = 'spearfish';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('spearfish', '06431500', 'SPEARFISH CREEK AT SPEARFISH,SD', 'usgs', 'AT SPEARFISH', 44.4825, -103.8616, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('spearfish', '06430770', 'SPEARFISH CREEK NR LEAD, SD', 'usgs', 'SPEARFISH CREEK NR LEAD, SD', 44.2992, -103.8682, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('spearfish', '06430850', 'LITTLE SPEARFISH CREEK NEAR LEAD, SD', 'usgs', 'NEAR LEAD', 44.3497, -103.9359, false);

-- Rapid Creek (SD) — 5 gauges
delete from public.river_gauges where river_id = 'rapid_creek';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('rapid_creek', '06414000', 'RAPID CR AT RAPID CITY,SD', 'usgs', 'AT RAPID CITY', 44.0855, -103.2418, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('rapid_creek', '06410500', 'RAPID CREEK ABOVE PACTOLA RES AT SILVER CITY,  SD', 'usgs', 'ABOVE PACTOLA RES AT SILVER CITY', 44.0847, -103.5805, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('rapid_creek', '06411500', 'RAPID CREEK BELOW PACTOLA DAM,SD', 'usgs', 'BELOW PACTOLA DAM', 44.0767, -103.4821, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('rapid_creek', '06412500', 'RAPID CREEK ABV CANYON LAKE NEAR RAPID CITY,SD', 'usgs', 'NEAR RAPID CITY', 44.0528, -103.3119, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('rapid_creek', '06418800', 'RAPID CREEK ABOVE WRF NR RAPID CITY, SD', 'usgs', 'ABOVE WRF NR RAPID CITY', 44.0268, -103.1011, false);

-- James River (SD) — 3 gauges
delete from public.river_gauges where river_id = 'james_sd';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('james_sd', '06477000', 'JAMES RIVER NEAR FORESTBURG,SD', 'usgs', 'NEAR FORESTBURG', 43.9739, -98.0709, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('james_sd', '06476000', 'JAMES RIVER AT HURON,SD', 'usgs', 'AT HURON', 44.3636, -98.1993, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('james_sd', '06478000', 'JAMES RIVER NEAR MITCHELL,SD', 'usgs', 'NEAR MITCHELL', 43.6589, -97.9192, false);

-- Vermillion River (SD) — 2 gauges
delete from public.river_gauges where river_id = 'vermillion_sd';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('vermillion_sd', '06478690', 'WEST FORK VERMILLION RIVER NEAR PARKER,SD', 'usgs', 'NEAR PARKER', 43.4156, -97.2049, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('vermillion_sd', '06478600', 'EAST FORK VERMILLION RIVER NEAR PARKER, SD', 'usgs', 'NEAR PARKER', 43.4453, -97.1094, false);

-- Sheyenne River (ND) — 5 gauges
delete from public.river_gauges where river_id = 'sheyenne';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('sheyenne', '05059000', 'SHEYENNE RIVER NEAR KINDRED, ND', 'usgs', 'NEAR KINDRED', 46.6316, -97.0006, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('sheyenne', '05059300', 'SHEYENNE R AB SHEYENNE R DIVERSION NR HORACE, ND', 'usgs', 'SHEYENNE R AB SHEYENNE R DIVERSION NR HORACE, ND', 46.7464, -96.9269, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('sheyenne', '05059310', 'SHEYENNE RIVER DIVERSION NR HORACE, ND', 'usgs', 'SHEYENNE RIVER DIVERSION NR HORACE, ND', 46.7516, -96.9262, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('sheyenne', '05059480', 'SHEYENNE RIVER DIVERSION AT WEST FARGO, ND', 'usgs', 'AT WEST FARGO', 46.8911, -96.9168, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('sheyenne', '05060400', 'SHEYENNE RIVER AT HARWOOD, ND', 'usgs', 'AT HARWOOD', 46.9775, -96.8917, false);

-- Pembina River (ND) — 3 gauges
delete from public.river_gauges where river_id = 'pembina';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('pembina', '05099600', 'PEMBINA RIVER AT WALHALLA, ND', 'usgs', 'AT WALHALLA', 48.9133, -97.9170, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('pembina', '05099400', 'LITTLE SOUTH PEMBINA RIVER NR WALHALLA, ND', 'usgs', 'LITTLE SOUTH PEMBINA RIVER NR WALHALLA, ND', 48.8653, -98.0059, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('pembina', '05100000', 'PEMBINA RIVER AT NECHE, ND', 'usgs', 'AT NECHE', 48.9897, -97.5570, false);

-- Heart River (ND) — 2 gauges
delete from public.river_gauges where river_id = 'heart';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('heart', '06349000', 'HEART RIVER NR MANDAN, ND', 'usgs', 'HEART RIVER NR MANDAN, ND', 46.8339, -100.9746, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('heart', '06348300', 'HEART RIVER AT STARK BRIDGE NEAR JUDSON, ND', 'usgs', 'AT STARK BRIDGE NEAR JUDSON', 46.7033, -101.2136, false);

-- Knife River (ND) — 3 gauges
delete from public.river_gauges where river_id = 'knife';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('knife', '06340500', 'KNIFE RIVER AT HAZEN, ND', 'usgs', 'AT HAZEN', 47.2853, -101.6221, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('knife', '06339500', 'KNIFE RIVER NEAR GOLDEN VALLEY, ND', 'usgs', 'NEAR GOLDEN VALLEY', 47.1544, -102.0600, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('knife', '06340010', 'KNIFE RIVER NEAR BEULAH, ND', 'usgs', 'NEAR BEULAH', 47.2539, -101.7856, false);

-- Cannonball River (ND) — 3 gauges
delete from public.river_gauges where river_id = 'cannonball';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cannonball', '06354000', 'CANNONBALL RIVER AT BREIEN, ND', 'usgs', 'AT BREIEN', 46.3761, -100.9344, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cannonball', '06351200', 'CANNONBALL RIVER NEAR RALEIGH, ND', 'usgs', 'NEAR RALEIGH', 46.1269, -101.3333, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cannonball', '06354050', 'CANNONBALL RIVER AT SOLEN, ND', 'usgs', 'AT SOLEN', 46.3906, -100.7998, false);

-- Cottonwood River (KS) — 4 gauges
delete from public.river_gauges where river_id = 'cottonwood';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cottonwood', '07182250', 'COTTONWOOD R NR PLYMOUTH, KS', 'usgs', 'COTTONWOOD R NR PLYMOUTH, KS', 38.3975, -96.3561, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cottonwood', '07182000', 'COTTONWOOD R AT COTTONWOOD FALLS, KS', 'usgs', 'AT COTTONWOOD FALLS', 38.3877, -96.5973, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cottonwood', '07182200', 'SF COTTONWOOD R NR BAZAAR, KS', 'usgs', 'SF COTTONWOOD R NR BAZAAR, KS', 38.2856, -96.5128, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cottonwood', '07182260', 'COTTONWOOD R AT EMPORIA, KS', 'usgs', 'AT EMPORIA', 38.3851, -96.1814, false);

-- Neosho River (KS) — 5 gauges
delete from public.river_gauges where river_id = 'neosho';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('neosho', '07179730', 'NEOSHO R NR AMERICUS, KS', 'usgs', 'NEOSHO R NR AMERICUS, KS', 38.4670, -96.2506, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('neosho', '07179300', 'NEOSHO R NR PARKERVILLE, KS', 'usgs', 'NEOSHO R NR PARKERVILLE, KS', 38.7513, -96.6497, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('neosho', '07179500', 'NEOSHO R AT COUNCIL GROVE, KS', 'usgs', 'AT COUNCIL GROVE', 38.6658, -96.4936, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('neosho', '07179750', 'NEOSHO R AT BURLINGAME RD NR EMPORIA, KS', 'usgs', 'AT BURLINGAME RD NR EMPORIA', 38.4286, -96.1583, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('neosho', '07182390', 'NEOSHO R AT NEOSHO RAPIDS, KS', 'usgs', 'AT NEOSHO RAPIDS', 38.3681, -96.0003, false);

-- Solomon River (KS) — 2 gauges
delete from public.river_gauges where river_id = 'solomon';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('solomon', '06876000', 'SOLOMON R AT BELOIT, KS', 'usgs', 'AT BELOIT', 39.4545, -98.1099, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('solomon', '06875900', 'SOLOMON R NR GLEN ELDER, KS', 'usgs', 'SOLOMON R NR GLEN ELDER, KS', 39.4739, -98.2837, false);

-- Smoky Hill River (KS) — 2 gauges
delete from public.river_gauges where river_id = 'smoky_hill';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('smoky_hill', '06864500', 'SMOKY HILL R AT ELLSWORTH, KS', 'usgs', 'AT ELLSWORTH', 38.7267, -98.2337, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('smoky_hill', '06865500', 'SMOKY HILL R NR LANGLEY, KS', 'usgs', 'SMOKY HILL R NR LANGLEY, KS', 38.6115, -97.9526, false);

-- Marais des Cygnes River (KS) — 3 gauges
delete from public.river_gauges where river_id = 'marais';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('marais', '06913500', 'MARAIS DES CYGNES R NR OTTAWA, KS', 'usgs', 'MARAIS DES CYGNES R NR OTTAWA, KS', 38.6181, -95.2683, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('marais', '06911000', 'MARAIS DES CYGNES R AT MELVERN, KS', 'usgs', 'AT MELVERN', 38.5161, -95.6961, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('marais', '06913000', 'MARAIS DES CYGNES R NR POMONA, KS', 'usgs', 'MARAIS DES CYGNES R NR POMONA, KS', 38.5842, -95.4536, false);

-- Arkansas River (KS) — 5 gauges
delete from public.river_gauges where river_id = 'arkansas_ks';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('arkansas_ks', '07143330', 'ARKANSAS R NR HUTCHINSON, KS', 'usgs', 'ARKANSAS R NR HUTCHINSON, KS', 37.9461, -97.7751, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('arkansas_ks', '07142680', 'ARKANSAS R NR NICKERSON, KS', 'usgs', 'ARKANSAS R NR NICKERSON, KS', 38.1450, -98.1112, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('arkansas_ks', '07143375', 'ARKANSAS R NR MAIZE, KS', 'usgs', 'ARKANSAS R NR MAIZE, KS', 37.7814, -97.3898, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('arkansas_ks', '07143665', 'L ARKANSAS R AT ALTA MILLS, KS', 'usgs', 'AT ALTA MILLS', 38.1122, -97.5920, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('arkansas_ks', '07143672', 'L ARKANSAS R AT HWY 50 NR HALSTEAD, KS', 'usgs', 'AT HWY 50 NR HALSTEAD', 38.0285, -97.5405, false);

-- Kansas River (KS) — 4 gauges
delete from public.river_gauges where river_id = 'kansas_ks';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('kansas_ks', '06888350', 'KANSAS R NR BELVUE, KS', 'usgs', 'KANSAS R NR BELVUE, KS', 39.1931, -96.1475, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('kansas_ks', '06887500', 'KANSAS R AT WAMEGO, KS', 'usgs', 'AT WAMEGO', 39.1983, -96.3056, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('kansas_ks', '06888990', 'KANSAS R AB TOPEKA WEIR AT TOPEKA, KS', 'usgs', 'AT TOPEKA', 39.0719, -95.7164, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('kansas_ks', '06889000', 'KANSAS R AT TOPEKA, KS', 'usgs', 'AT TOPEKA', 39.0667, -95.6497, false);

-- Illinois River (OK) — 4 gauges
delete from public.river_gauges where river_id = 'illinois_ok';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('illinois_ok', '07196500', 'Illinois River near Tahlequah, OK', 'usgs', 'Near Tahlequah', 35.9255, -94.9217, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('illinois_ok', '07195500', 'Illinois River near Watts, OK', 'usgs', 'Near Watts', 36.1301, -94.5722, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('illinois_ok', '07196090', 'Illinois River at Chewey, OK', 'usgs', 'At Chewey', 36.1043, -94.7827, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('illinois_ok', '07198000', 'Illinois River near Gore, OK', 'usgs', 'Near Gore', 35.5732, -95.0688, false);

-- Washita River (OK) — 3 gauges
delete from public.river_gauges where river_id = 'washita';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('washita', '07325000', 'Washita River near Clinton, OK', 'usgs', 'Near Clinton', 35.5309, -98.9670, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('washita', '07324200', 'Washita River near Hammon, OK', 'usgs', 'Near Hammon', 35.6564, -99.3062, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('washita', '07324400', 'Washita River near Foss, OK', 'usgs', 'Near Foss', 35.5389, -99.1698, false);

-- Brazos River (TX) — 2 gauges
delete from public.river_gauges where river_id = 'brazos';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('brazos', '08088000', 'Brazos Rv nr South Bend, TX', 'usgs', 'Brazos Rv nr South Bend, TX', 33.0243, -98.6439, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('brazos', '08089000', 'Brazos Rv nr Palo Pinto, TX', 'usgs', 'Brazos Rv nr Palo Pinto, TX', 32.8626, -98.3025, false);

-- San Marcos River (TX) — 3 gauges
delete from public.river_gauges where river_id = 'san_marcos';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('san_marcos', '08170500', 'San Marcos Rv at San Marcos, TX', 'usgs', 'At San Marcos', 29.8891, -97.9342, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('san_marcos', '08171400', 'San Marcos Rv nr Martindale, TX', 'usgs', 'San Marcos Rv nr Martindale, TX', 29.8323, -97.8424, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('san_marcos', '08172000', 'San Marcos Rv at Luling, TX', 'usgs', 'At Luling', 29.6663, -97.6509, false);

-- Guadalupe River (TX) — 4 gauges
delete from public.river_gauges where river_id = 'guadalupe';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('guadalupe', '08167500', 'Guadalupe Rv nr Spring Branch, TX', 'usgs', 'Guadalupe Rv nr Spring Branch, TX', 29.8605, -98.3836, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('guadalupe', '08167200', 'Guadalupe Rv at FM 474 nr Bergheim, TX', 'usgs', 'At FM 474 nr Bergheim', 29.8936, -98.6698, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('guadalupe', '08167800', 'Guadalupe Rv at Sattler, TX', 'usgs', 'At Sattler', 29.8591, -98.1800, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('guadalupe', '08168500', 'Guadalupe Rv abv Comal Rv at New Braunfels, TX', 'usgs', 'At New Braunfels', 29.7149, -98.1100, false);

-- Colorado River — Austin (TX) — 2 gauges
delete from public.river_gauges where river_id = 'colorado_tx';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('colorado_tx', '08158000', 'Colorado Rv at Austin, TX', 'usgs', 'At Austin', 30.2461, -97.6801, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('colorado_tx', '08159200', 'Colorado Rv at Bastrop, TX', 'usgs', 'At Bastrop', 30.1047, -97.3194, false);

-- Llano River (TX) — 3 gauges
delete from public.river_gauges where river_id = 'llano';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('llano', '08150000', 'Llano Rv nr Junction, TX', 'usgs', 'Llano Rv nr Junction, TX', 30.5044, -99.7345, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('llano', '08148500', 'N Llano Rv nr Junction, TX', 'usgs', 'N Llano Rv nr Junction, TX', 30.5174, -99.8062, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('llano', '08149900', 'S Llano Rv at Flat Rock Ln at Junction, TX', 'usgs', 'At Flat Rock Ln at Junction', 30.4790, -99.7780, false);

-- Medina River (TX) — 3 gauges
delete from public.river_gauges where river_id = 'medina';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('medina', '08178880', 'Medina Rv at Bandera, TX', 'usgs', 'At Bandera', 29.7238, -99.0700, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('medina', '0817887350', 'Medina Rv at Patterson Rd at Medina, TX', 'usgs', 'At Patterson Rd at Medina', 29.7939, -99.2486, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('medina', '08178980', 'Medina Rv abv English Crsg nr Pipe Creek, TX', 'usgs', 'Medina Rv abv English Crsg nr Pipe Creek, TX', 29.6944, -98.9793, false);

-- Frio River (TX) — 3 gauges
delete from public.river_gauges where river_id = 'frio';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('frio', '08195000', 'Frio Rv at Concan, TX', 'usgs', 'At Concan', 29.4886, -99.7048, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('frio', '08196000', 'Dry Frio Rv nr Reagan Wells, TX', 'usgs', 'Dry Frio Rv nr Reagan Wells, TX', 29.5047, -99.7814, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('frio', '08197500', 'Frio Rv bl Dry Frio Rv nr Uvalde, TX', 'usgs', 'Frio Rv bl Dry Frio Rv nr Uvalde, TX', 29.2458, -99.6745, false);

-- Comal River (TX) — 5 gauges
delete from public.river_gauges where river_id = 'comal';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('comal', '08169000', 'Comal Rv at New Braunfels, TX', 'usgs', 'At New Braunfels', 29.7064, -98.1222, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('comal', '08168500', 'Guadalupe Rv abv Comal Rv at New Braunfels, TX', 'usgs', 'At New Braunfels', 29.7149, -98.1100, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('comal', '08168797', 'Dry Comal Ck at Loop 337 nr New Braunfels, TX', 'usgs', 'At Loop 337 nr New Braunfels', 29.6880, -98.1548, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('comal', '08168913', 'Comal Rv (oc) nr Landa Lk, New Braunfels, TX', 'usgs', 'Comal Rv (oc) nr Landa Lk, New Braunfels, TX', 29.7101, -98.1317, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('comal', '08168932', 'Comal Rv (nc) nr Landa Lk, New Braunfels, TX', 'usgs', 'Comal Rv (nc) nr Landa Lk, New Braunfels, TX', 29.7090, -98.1334, false);

-- Blanco River (TX) — 5 gauges
delete from public.river_gauges where river_id = 'blanco';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('blanco', '08171000', 'Blanco Rv at Wimberley, TX', 'usgs', 'At Wimberley', 29.9944, -98.0889, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('blanco', '08170890', 'Little Blanco Rv at FM 32 nr Fischer, TX', 'usgs', 'At FM 32 nr Fischer', 30.0208, -98.3306, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('blanco', '08170905', 'Blanco Rv at Valley View Rd nr Fischer, TX', 'usgs', 'At Valley View Rd nr Fischer', 30.0368, -98.2229, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('blanco', '08170950', 'Blanco Rv at Fischer Store Rd nr Fischer, TX', 'usgs', 'At Fischer Store Rd nr Fischer', 30.0006, -98.2004, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('blanco', '08171290', 'Blanco Rv at Halifax Rch nr Kyle, TX', 'usgs', 'At Halifax Rch nr Kyle', 30.0056, -97.9525, false);

-- Nueces River (TX) — 5 gauges
delete from public.river_gauges where river_id = 'nueces';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('nueces', '08190000', 'Nueces Rv at Laguna, TX', 'usgs', 'At Laguna', 29.4286, -99.9973, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('nueces', '0818999010', 'Nueces Rv nr Barksdale, TX', 'usgs', 'Nueces Rv nr Barksdale, TX', 29.7188, -100.0396, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('nueces', '08189998', 'Nueces Rv at CR 414 at Montell, TX', 'usgs', 'At CR 414 at Montell', 29.5265, -100.0184, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('nueces', '08190500', 'W Nueces Rv nr Brackettville, TX', 'usgs', 'W Nueces Rv nr Brackettville, TX', 29.4811, -100.2392, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('nueces', '08192000', 'Nueces Rv bl Uvalde, TX', 'usgs', 'Nueces Rv bl Uvalde, TX', 29.1239, -99.8948, false);

-- Sabine River (TX) — 2 gauges
delete from public.river_gauges where river_id = 'sabine';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('sabine', '08022040', 'Sabine Rv nr Beckville, TX', 'usgs', 'Sabine Rv nr Beckville, TX', 32.3285, -94.3538, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('sabine', '08020900', 'Sabine Rv bl Longview, TX', 'usgs', 'Sabine Rv bl Longview, TX', 32.4168, -94.7099, false);

-- Truckee River (NV) — 5 gauges
delete from public.river_gauges where river_id = 'truckee';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('truckee', '10348000', 'TRUCKEE RV AT RENO, NV', 'usgs', 'AT RENO', 39.5302, -119.7955, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('truckee', '10347460', 'TRUCKEE RV NR MOGUL, NV', 'usgs', 'TRUCKEE RV NR MOGUL, NV', 39.5071, -119.9319, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('truckee', '10348036', 'TRUCKEE RV AT GLENDALE AVE NR SPARKS, NV', 'usgs', 'AT GLENDALE AVE NR SPARKS', 39.5258, -119.7766, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('truckee', '10348200', 'TRUCKEE RV NR SPARKS, NV', 'usgs', 'TRUCKEE RV NR SPARKS, NV', 39.5176, -119.7416, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('truckee', '10348245', 'N TRUCKEE DRAIN AT SPANISH SPRINGS RD NR SPARK, NV', 'usgs', 'AT SPANISH SPRINGS RD NR SPARK', 39.5688, -119.7266, false);

-- Humboldt River (NV) — 5 gauges
delete from public.river_gauges where river_id = 'humboldt';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('humboldt', '10322500', 'HUMBOLDT RV AT PALISADE, NV', 'usgs', 'AT PALISADE', 40.6074, -116.2017, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('humboldt', '10319900', 'S FK HUMBOLDT RV ABV TENMILE CK NR ELKO, NV', 'usgs', 'S FK HUMBOLDT RV ABV TENMILE CK NR ELKO, NV', 40.6275, -115.7305, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('humboldt', '10320000', 'S FK HUMBOLDT RV ABV DIXIE CK NR ELKO, NV', 'usgs', 'S FK HUMBOLDT RV ABV DIXIE CK NR ELKO, NV', 40.6850, -115.8125, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('humboldt', '10321000', 'HUMBOLDT RV NR CARLIN, NV', 'usgs', 'HUMBOLDT RV NR CARLIN, NV', 40.7277, -116.0092, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('humboldt', '10323425', 'HUMBOLDT RV AT OLD US 40 BRG AT DUNPHY, NV', 'usgs', 'AT OLD US 40 BRG AT DUNPHY', 40.7055, -116.5309, false);

-- Walker River (NV) — 5 gauges
delete from public.river_gauges where river_id = 'walker';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('walker', '10301500', 'WALKER RV NR WABUSKA, NV', 'usgs', 'WALKER RV NR WABUSKA, NV', 39.1525, -119.0989, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('walker', '10293500', 'E WALKER RV ABV STROSNIDER DITCH NR MASON, NV', 'usgs', 'E WALKER RV ABV STROSNIDER DITCH NR MASON, NV', 38.8137, -119.0480, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('walker', '10295000', 'E WALKER RV NR MASON, NV', 'usgs', 'E WALKER RV NR MASON, NV', 38.8774, -119.1443, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('walker', '10300000', 'W WALKER RV NR HUDSON, NV', 'usgs', 'W WALKER RV NR HUDSON, NV', 38.8096, -119.2274, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('walker', '10300600', 'WALKER RV AT SNYDER LN NR MASON, NV', 'usgs', 'AT SNYDER LN NR MASON', 38.9213, -119.1916, false);

-- Carson River (NV) — 5 gauges
delete from public.river_gauges where river_id = 'carson_nv';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('carson_nv', '10311750', 'CARSON R ABV SIXMILE CYN CK BLW DAYTON, NV', 'usgs', 'CARSON R ABV SIXMILE CYN CK BLW DAYTON, NV', 39.2809, -119.5251, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('carson_nv', '10311000', 'CARSON RV NR CARSON CITY, NV', 'usgs', 'CARSON RV NR CARSON CITY, NV', 39.1077, -119.7132, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('carson_nv', '10311400', 'CARSON RV AT DEER RUN RD NR CARSON CITY, NV', 'usgs', 'AT DEER RUN RD NR CARSON CITY', 39.1814, -119.6949, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('carson_nv', '10312000', 'CARSON RV NR FORT CHURCHILL, NV', 'usgs', 'CARSON RV NR FORT CHURCHILL, NV', 39.2917, -119.3111, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('carson_nv', '10312150', 'CARSON RV BLW LAHONTAN RESERVOIR NR FALLON, NV', 'usgs', 'CARSON RV BLW LAHONTAN RESERVOIR NR FALLON, NV', 39.4639, -119.0463, false);

-- Cuyahoga River (OH) — 5 gauges
delete from public.river_gauges where river_id = 'cuyahoga';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cuyahoga', '04208000', 'Cuyahoga River at Independence OH', 'usgs', 'At Independence OH', 41.3953, -81.6298, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cuyahoga', '04202000', 'Cuyahoga River at Hiram Rapids OH', 'usgs', 'At Hiram Rapids OH', 41.3406, -81.1668, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cuyahoga', '04206000', 'Cuyahoga River at Old Portage OH', 'usgs', 'At Old Portage OH', 41.1356, -81.5471, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cuyahoga', '04206425', 'Cuyahoga River at Jaite OH', 'usgs', 'At Jaite OH', 41.2889, -81.5651, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('cuyahoga', '04208503', 'Cuyahoga R at Lower Harvard Brdg in Cleveland OH', 'usgs', 'At Lower Harvard Brdg in Cleveland OH', 41.4475, -81.6845, false);

-- Black Fork Mohican River (OH) — 2 gauges
delete from public.river_gauges where river_id = 'black_fork_oh';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('black_fork_oh', '03131500', 'Black Fork at Loudonville OH', 'usgs', 'At Loudonville OH', 40.6359, -82.2393, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('black_fork_oh', '03129197', 'Black Fork Mohican River at Shelby OH', 'usgs', 'At Shelby OH', 40.8811, -82.6597, false);

-- Little Miami River (OH) — 3 gauges
delete from public.river_gauges where river_id = 'little_miami';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('little_miami', '03245500', 'Little Miami River at Milford OH', 'usgs', 'At Milford OH', 39.1714, -84.2980, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('little_miami', '03246500', 'East Fork Little Miami River at Williamsburg OH', 'usgs', 'At Williamsburg OH', 39.0526, -84.0505, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('little_miami', '03247500', 'East Fork Little Miami River at Perintown OH', 'usgs', 'At Perintown OH', 39.1370, -84.2380, false);

-- Hocking River (OH) — 2 gauges
delete from public.river_gauges where river_id = 'hocking';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('hocking', '03159500', 'Hocking River at Athens OH', 'usgs', 'At Athens OH', 39.3290, -82.0876, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('hocking', '03157500', 'Hocking River at Enterprise OH', 'usgs', 'At Enterprise OH', 39.5651, -82.4746, false);

-- Olentangy River (OH) — 3 gauges
delete from public.river_gauges where river_id = 'olentangy';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('olentangy', '03226800', 'Olentangy River near Worthington OH', 'usgs', 'Near Worthington OH', 40.1103, -83.0319, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('olentangy', '03225500', 'Olentangy River near Delaware OH', 'usgs', 'Near Delaware OH', 40.3551, -83.0671, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('olentangy', '03227107', 'Olentangy River at J H Herrick Dr at Columbus OH', 'usgs', 'At J H Herrick Dr at Columbus OH', 39.9978, -83.0236, false);

-- Scioto River (OH) — 5 gauges
delete from public.river_gauges where river_id = 'scioto';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('scioto', '03227500', 'Scioto River at Columbus OH', 'usgs', 'At Columbus OH', 39.9095, -83.0091, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('scioto', '03221000', 'Scioto River below O''Shaughnessy Dam nr Dublin OH', 'usgs', 'Below O''Shaughnessy Dam nr Dublin OH', 40.1434, -83.1205, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('scioto', '03221646', 'Scioto River at 5th Ave at Columbus OH', 'usgs', 'At 5th Ave at Columbus OH', 39.9892, -83.0678, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('scioto', '03229610', 'Scioto River near Commercial Point OH', 'usgs', 'Near Commercial Point OH', 39.7742, -83.0077, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('scioto', '03230700', 'Scioto River at Circleville OH', 'usgs', 'At Circleville OH', 39.6015, -82.9552, false);

-- Great Miami River (OH) — 4 gauges
delete from public.river_gauges where river_id = 'great_miami_oh';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('great_miami_oh', '03274000', 'Great Miami River at Hamilton OH', 'usgs', 'At Hamilton OH', 39.3912, -84.5722, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('great_miami_oh', '03271500', 'Great Miami River at Miamisburg OH', 'usgs', 'At Miamisburg OH', 39.6445, -84.2897, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('great_miami_oh', '03271620', 'Great Miami River at Franklin OH', 'usgs', 'At Franklin OH', 39.5631, -84.3049, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('great_miami_oh', '03272100', 'Great Miami River at Middletown OH', 'usgs', 'At Middletown OH', 39.5199, -84.4127, false);

-- Sandusky River (OH) — 4 gauges
delete from public.river_gauges where river_id = 'sandusky_oh';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('sandusky_oh', '04197137', 'Sandusky River at Tiffin OH', 'usgs', 'At Tiffin OH', 41.1142, -83.1797, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('sandusky_oh', '04196000', 'Sandusky River near Bucyrus OH', 'usgs', 'Near Bucyrus OH', 40.8037, -83.0057, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('sandusky_oh', '04196500', 'Sandusky River near Upper Sandusky OH', 'usgs', 'Near Upper Sandusky OH', 40.8506, -83.2563, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('sandusky_oh', '04198000', 'Sandusky River near Fremont OH', 'usgs', 'Near Fremont OH', 41.3078, -83.1588, false);

-- Mahoning River (OH) — 5 gauges
delete from public.river_gauges where river_id = 'mahoning_oh';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('mahoning_oh', '03091500', 'Mahoning River at Pricetown OH', 'usgs', 'At Pricetown OH', 41.1314, -80.9712, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('mahoning_oh', '03090500', 'Mahoning River bl Berlin Dam nr Berlin Center OH', 'usgs', 'Mahoning River bl Berlin Dam nr Berlin Center OH', 41.0484, -81.0012, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('mahoning_oh', '03092460', 'West Branch Mahoning River at Wayland OH', 'usgs', 'At Wayland OH', 41.1570, -81.0718, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('mahoning_oh', '03094000', 'Mahoning River at Leavittsburg OH', 'usgs', 'At Leavittsburg OH', 41.2392, -80.8806, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('mahoning_oh', '03098600', 'Mahoning River above West Ave at Youngstown OH', 'usgs', 'Above West Ave at Youngstown OH', 41.1053, -80.6656, false);

-- Auglaize River (OH) — 3 gauges
delete from public.river_gauges where river_id = 'auglaize_oh';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('auglaize_oh', '04186500', 'Auglaize River near Fort Jennings OH', 'usgs', 'Near Fort Jennings OH', 40.9487, -84.2661, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('auglaize_oh', '04191058', 'Little Auglaize River at Melrose OH', 'usgs', 'At Melrose OH', 41.0919, -84.4075, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('auglaize_oh', '04191500', 'Auglaize River near Defiance OH', 'usgs', 'Near Defiance OH', 41.2375, -84.3991, false);

-- Paint Creek (OH) — 3 gauges
delete from public.river_gauges where river_id = 'paint_oh';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('paint_oh', '03232000', 'Paint Creek near Greenfield OH', 'usgs', 'Near Greenfield OH', 39.3792, -83.3755, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('paint_oh', '03234000', 'Paint Creek near Bourneville OH', 'usgs', 'Near Bourneville OH', 39.2637, -83.1669, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('paint_oh', '03234300', 'Paint Creek at Chillicothe OH', 'usgs', 'At Chillicothe OH', 39.3203, -82.9782, false);

-- Blanchard River (OH) — 5 gauges
delete from public.river_gauges where river_id = 'blanchard_oh';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('blanchard_oh', '04189000', 'Blanchard River near Findlay OH', 'usgs', 'Near Findlay OH', 41.0559, -83.6880, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('blanchard_oh', '04188337', 'Blanchard River below Mt. Blanchard OH', 'usgs', 'Below Mt. Blanchard OH', 40.9245, -83.5572, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('blanchard_oh', '04188400', 'Blanchard River above Findlay OH', 'usgs', 'Above Findlay OH', 41.0339, -83.5794, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('blanchard_oh', '04189131', 'Blanchard River at Gilboa OH', 'usgs', 'At Gilboa OH', 41.0153, -83.9189, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('blanchard_oh', '04189260', 'Blanchard River at Ottawa OH', 'usgs', 'At Ottawa OH', 41.0170, -84.0469, false);

-- Big Darby Creek (OH) — 2 gauges
delete from public.river_gauges where river_id = 'big_darby_oh';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('big_darby_oh', '395339083130100', 'Big Darby Creek above Georgesville OH', 'usgs', 'Above Georgesville OH', 39.8942, -83.2169, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('big_darby_oh', '03230500', 'Big Darby Creek at Darbyville OH', 'usgs', 'At Darbyville OH', 39.7006, -83.1102, false);

-- Big Walnut Creek (OH) — 3 gauges
delete from public.river_gauges where river_id = 'big_walnut_oh';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('big_walnut_oh', '03228500', 'Big Walnut Creek at Central College OH', 'usgs', 'At Central College OH', 40.1037, -82.8841, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('big_walnut_oh', '03228300', 'Big Walnut Creek at Sunbury OH', 'usgs', 'At Sunbury OH', 40.2362, -82.8513, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('big_walnut_oh', '03229500', 'Big Walnut Creek at Rees OH', 'usgs', 'At Rees OH', 39.8567, -82.9571, false);

-- Licking River (OH) — 5 gauges
delete from public.river_gauges where river_id = 'licking_oh';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('licking_oh', '03146500', 'Licking River near Newark OH', 'usgs', 'Near Newark OH', 40.0592, -82.3396, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('licking_oh', '03144816', 'South Fork Licking River at Kirkersville OH', 'usgs', 'At Kirkersville OH', 39.9636, -82.5986, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('licking_oh', '03145000', 'South Fork Licking River near Hebron OH', 'usgs', 'Near Hebron OH', 39.9887, -82.4749, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('licking_oh', '03145173', 'South Fork Licking River at Heath OH', 'usgs', 'At Heath OH', 40.0375, -82.4133, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('licking_oh', '03146000', 'North Fork Licking River at Utica OH', 'usgs', 'At Utica OH', 40.2298, -82.4549, false);

-- Stillwater River (OH) — 2 gauges
delete from public.river_gauges where river_id = 'stillwater_oh';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('stillwater_oh', '03265000', 'Stillwater River at Pleasant Hill OH', 'usgs', 'At Pleasant Hill OH', 40.0578, -84.3561, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('stillwater_oh', '03266000', 'Stillwater River at Englewood OH', 'usgs', 'At Englewood OH', 39.8703, -84.2861, false);

-- Alum Creek (OH) — 2 gauges
delete from public.river_gauges where river_id = 'alum_oh';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('alum_oh', '03228805', 'Alum Creek at Africa OH', 'usgs', 'At Africa OH', 40.1823, -82.9616, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('alum_oh', '03228750', 'Alum Creek near Kilbourne OH', 'usgs', 'Near Kilbourne OH', 40.3567, -82.9216, false);

-- Duck Creek (OH) — 3 gauges
delete from public.river_gauges where river_id = 'duck_oh';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('duck_oh', '03115786', 'Duck Creek below Whipple OH', 'usgs', 'Below Whipple OH', 39.5089, -81.4231, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('duck_oh', '03115644', 'East Fork Duck Creek near Harrietsville OH', 'usgs', 'Near Harrietsville OH', 39.6129, -81.3720, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('duck_oh', '03115712', 'West Fork Duck Creek at Macksburg OH', 'usgs', 'At Macksburg OH', 39.6316, -81.4608, false);

-- Sugar Creek (OH) — 2 gauges
delete from public.river_gauges where river_id = 'sugar_oh';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('sugar_oh', '03124000', 'Sugar Creek bl Beach City Dam near Beach City OH', 'usgs', 'Near Beach City OH', 40.6356, -81.5529, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('sugar_oh', '03124500', 'Sugar Creek at Strasburg OH', 'usgs', 'At Strasburg OH', 40.5876, -81.5232, false);

-- Ottawa River (OH) — 2 gauges
delete from public.river_gauges where river_id = 'ottawa_oh';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('ottawa_oh', '04187100', 'Ottawa River at Lima OH', 'usgs', 'At Lima OH', 40.7248, -84.1263, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('ottawa_oh', '04188100', 'Ottawa River near Kalida OH', 'usgs', 'Near Kalida OH', 40.9903, -84.2266, false);

-- Loramie Creek (OH) — 2 gauges
delete from public.river_gauges where river_id = 'loramie_oh';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('loramie_oh', '03261950', 'Loramie Creek near Newport OH', 'usgs', 'Near Newport OH', 40.3070, -84.3838, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('loramie_oh', '03262000', 'Loramie Creek at Lockington OH', 'usgs', 'At Lockington OH', 40.2145, -84.2441, false);

-- Rocky River (OH) — 3 gauges
delete from public.river_gauges where river_id = 'rocky_oh';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('rocky_oh', '04201500', 'Rocky River near Berea OH', 'usgs', 'Near Berea OH', 41.4075, -81.8826, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('rocky_oh', '04201400', 'West Branch Rocky River at West View OH', 'usgs', 'At West View OH', 41.3509, -81.9032, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('rocky_oh', '04201484', 'East Branch Rocky River near Strongsville OH', 'usgs', 'Near Strongsville OH', 41.3344, -81.8347, false);

-- Portage River (OH) — 2 gauges
delete from public.river_gauges where river_id = 'portage_oh';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('portage_oh', '04195820', 'Portage River near Elmore OH', 'usgs', 'Near Elmore OH', 41.4912, -83.2246, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('portage_oh', '04195500', 'Portage River at Woodville OH', 'usgs', 'At Woodville OH', 41.4495, -83.3613, false);

-- Whitewater River (IN) — 5 gauges
delete from public.river_gauges where river_id = 'whitewater_in';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('whitewater_in', '03275000', 'WHITEWATER RIVER NEAR ALPINE, IN', 'usgs', 'NEAR ALPINE', 39.5743, -85.1559, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('whitewater_in', '03274650', 'WHITEWATER RIVER NEAR ECONOMY, IN', 'usgs', 'NEAR ECONOMY', 40.0042, -85.1155, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('whitewater_in', '03275500', 'EAST FORK WHITEWATER RIVER AT RICHMOND, IN', 'usgs', 'AT RICHMOND', 39.8067, -84.9071, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('whitewater_in', '03275600', 'EAST FORK WHITEWATER RIVER AT ABINGTON, IN', 'usgs', 'AT ABINGTON', 39.7325, -84.9597, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('whitewater_in', '03276500', 'WHITEWATER RIVER AT BROOKVILLE, IN', 'usgs', 'AT BROOKVILLE', 39.4075, -85.0129, false);

-- Blue River (IN) — 3 gauges
delete from public.river_gauges where river_id = 'blue_in';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('blue_in', '03303000', 'BLUE RIVER NEAR WHITE CLOUD, IN', 'usgs', 'NEAR WHITE CLOUD', 38.2345, -86.2271, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('blue_in', '03302680', 'WEST FORK BLUE RIVER AT SALEM, IN', 'usgs', 'AT SALEM', 38.6053, -86.0944, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('blue_in', '03302800', 'BLUE RIVER AT FREDERICKSBURG, IN', 'usgs', 'AT FREDERICKSBURG', 38.4339, -86.1916, false);

-- Tippecanoe River (IN) — 4 gauges
delete from public.river_gauges where river_id = 'tippecanoe';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('tippecanoe', '03333050', 'TIPPECANOE RIVER NEAR DELPHI, IN', 'usgs', 'NEAR DELPHI', 40.5939, -86.7703, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('tippecanoe', '03332345', 'TIPPECANOE RIVER AT BUFFALO, IN', 'usgs', 'AT BUFFALO', 40.8779, -86.7512, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('tippecanoe', '03332555', 'TIPPECANOE RIVER AT NORWAY, IN', 'usgs', 'AT NORWAY', 40.7786, -86.7589, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('tippecanoe', '03332605', 'TIPPECANOE RIVER BELOW OAKDALE DAM, IN', 'usgs', 'BELOW OAKDALE DAM', 40.6534, -86.7567, false);

-- Wildcat Creek (IN) — 3 gauges
delete from public.river_gauges where river_id = 'wildcat_in';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('wildcat_in', '03335000', 'WILDCAT CREEK NEAR LAFAYETTE, IN', 'usgs', 'NEAR LAFAYETTE', 40.4406, -86.8292, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('wildcat_in', '03334000', 'WILDCAT CREEK AT OWASCO, IN', 'usgs', 'AT OWASCO', 40.4648, -86.6366, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('wildcat_in', '03334500', 'SOUTH FORK WILDCAT CREEK NEAR LAFAYETTE, IN', 'usgs', 'NEAR LAFAYETTE', 40.4178, -86.7680, false);

-- Wabash River (IN) — 3 gauges
delete from public.river_gauges where river_id = 'wabash_in';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('wabash_in', '03340500', 'WABASH RIVER AT MONTEZUMA, IN', 'usgs', 'AT MONTEZUMA', 39.7925, -87.3739, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('wabash_in', '03336000', 'WABASH RIVER AT COVINGTON, IN', 'usgs', 'AT COVINGTON', 40.1400, -87.4067, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('wabash_in', '03341500', 'WABASH RIVER AT TERRE HAUTE, IN', 'usgs', 'AT TERRE HAUTE', 39.4657, -87.4195, false);

-- White River (IN) — 5 gauges
delete from public.river_gauges where river_id = 'white_in';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('white_in', '03353000', 'WHITE RIVER AT INDIANAPOLIS, IN', 'usgs', 'AT INDIANAPOLIS', 39.7371, -86.1697, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('white_in', '03349000', 'WHITE RIVER AT NOBLESVILLE, IN', 'usgs', 'AT NOBLESVILLE', 40.0470, -86.0172, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('white_in', '03350800', 'WHITE RIVER AT CONNER PRAIRIE NEAR NOBLESVILLE, IN', 'usgs', 'AT CONNER PRAIRIE NEAR NOBLESVILLE', 39.9819, -86.0333, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('white_in', '03351000', 'WHITE RIVER NEAR NORA, IN', 'usgs', 'NEAR NORA', 39.9106, -86.1055, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('white_in', '03351201', 'WHITE RIVER AT INDIANAPOLIS MUSEUM OF ART, IN', 'usgs', 'AT INDIANAPOLIS MUSEUM OF ART', 39.8311, -86.1855, false);

-- East Fork White River (IN) — 2 gauges
delete from public.river_gauges where river_id = 'east_fork_white_in';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('east_fork_white_in', '03371500', 'EAST FORK WHITE RIVER NEAR BEDFORD, IN', 'usgs', 'NEAR BEDFORD', 38.7703, -86.4097, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('east_fork_white_in', '03373500', 'EAST FORK WHITE RIVER AT SHOALS, IN', 'usgs', 'AT SHOALS', 38.6670, -86.7919, false);

-- Iroquois River (IN) — 3 gauges
delete from public.river_gauges where river_id = 'iroquois_in';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('iroquois_in', '05524500', 'IROQUOIS RIVER NEAR FORESMAN, IN', 'usgs', 'NEAR FORESMAN', 40.8706, -87.3067, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('iroquois_in', '05520980', 'IROQUOIS RIVER NEAR PARR, IN', 'usgs', 'NEAR PARR', 41.0127, -87.2432, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('iroquois_in', '05522500', 'IROQUOIS RIVER AT RENSSELAER, IN', 'usgs', 'AT RENSSELAER', 40.9334, -87.1289, false);

-- Flatrock River (IN) — 2 gauges
delete from public.river_gauges where river_id = 'flatrock_in';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('flatrock_in', '03363400', 'FLATROCK RIVER NR RUSHVILLE, IN', 'usgs', 'FLATROCK RIVER NR RUSHVILLE, IN', 39.6042, -85.4442, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('flatrock_in', '03363500', 'FLATROCK RIVER AT ST. PAUL, IN', 'usgs', 'AT ST. PAUL', 39.4175, -85.6341, false);

-- Elkhart River (IN) — 2 gauges
delete from public.river_gauges where river_id = 'elkhart_in';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('elkhart_in', '04100500', 'ELKHART RIVER AT GOSHEN, IN', 'usgs', 'AT GOSHEN', 41.5933, -85.8486, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('elkhart_in', '04100222', 'NB ELKHART RIVER AT COSPERVILLE, IN', 'usgs', 'AT COSPERVILLE', 41.4817, -85.4755, false);

-- Pigeon River (IN) — 2 gauges
delete from public.river_gauges where river_id = 'pigeon_in';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('pigeon_in', '04099750', 'PIGEON RIVER NEAR SCOTT, IN', 'usgs', 'NEAR SCOTT', 41.7489, -85.5763, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('pigeon_in', '04099510', 'PIGEON CREEK NR ANGOLA, IN', 'usgs', 'PIGEON CREEK NR ANGOLA, IN', 41.6345, -85.1097, false);

-- Maumee River (IN) — 3 gauges
delete from public.river_gauges where river_id = 'maumee_in';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('maumee_in', '04183000', 'MAUMEE RIVER AT NEW HAVEN, IN', 'usgs', 'AT NEW HAVEN', 41.0850, -85.0222, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('maumee_in', '04182900', 'MAUMEE RIVER AT FORT WAYNE, IN', 'usgs', 'AT FORT WAYNE', 41.0825, -85.1152, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('maumee_in', '04182950', 'MAUMEE RIVER AT COLISEUM BLVD AT FORT WAYNE, IN', 'usgs', 'AT COLISEUM BLVD AT FORT WAYNE', 41.0797, -85.0874, false);

-- Vermilion River (IL) — 2 gauges
delete from public.river_gauges where river_id = 'vermilion_il';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('vermilion_il', '05555300', 'VERMILION RIVER NEAR LEONORE, IL', 'usgs', 'NEAR LEONORE', 41.2083, -88.9306, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('vermilion_il', '05554500', 'VERMILION RIVER AT PONTIAC, IL', 'usgs', 'AT PONTIAC', 40.8778, -88.6360, false);

-- Kankakee River (IL) — 2 gauges
delete from public.river_gauges where river_id = 'kankakee';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('kankakee', '05527500', 'KANKAKEE RIVER NEAR WILMINGTON, IL', 'usgs', 'NEAR WILMINGTON', 41.3463, -88.1867, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('kankakee', '05520500', 'KANKAKEE RIVER AT MOMENCE, IL', 'usgs', 'AT MOMENCE', 41.1599, -87.6688, false);

-- Des Plaines River (IL) — 5 gauges
delete from public.river_gauges where river_id = 'des_plaines';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('des_plaines', '05532500', 'DES PLAINES RIVER AT RIVERSIDE, IL', 'usgs', 'AT RIVERSIDE', 41.8215, -87.8220, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('des_plaines', '05528100', 'DES PLAINES RIVER AT LINCOLNSHIRE, IL', 'usgs', 'AT LINCOLNSHIRE', 42.2006, -87.9186, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('des_plaines', '05529000', 'DES PLAINES RIVER NEAR DES PLAINES, IL', 'usgs', 'NEAR DES PLAINES', 42.0872, -87.8872, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('des_plaines', '05530100', 'DES PLAINES R AT ALGONQUIN RD AT DES PLAINES, IL', 'usgs', 'AT ALGONQUIN RD AT DES PLAINES', 42.0317, -87.8781, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('des_plaines', '05533600', 'DES PLAINES RIVER NEAR LEMONT, IL', 'usgs', 'NEAR LEMONT', 41.6724, -88.0285, false);

-- Mackinaw River (IL) — 2 gauges
delete from public.river_gauges where river_id = 'mackinaw';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('mackinaw', '05568000', 'MACKINAW RIVER NEAR GREEN VALLEY, IL', 'usgs', 'NEAR GREEN VALLEY', 40.4547, -89.6062, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('mackinaw', '05567500', 'MACKINAW RIVER NEAR CONGERVILLE, IL', 'usgs', 'NEAR CONGERVILLE', 40.6235, -89.2417, false);

-- Sangamon River (IL) — 3 gauges
delete from public.river_gauges where river_id = 'sangamon';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('sangamon', '05576000', 'SOUTH FORK SANGAMON RIVER NEAR ROCHESTER, IL', 'usgs', 'NEAR ROCHESTER', 39.7422, -89.5673, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('sangamon', '05576500', 'SANGAMON RIVER AT RIVERTON, IL', 'usgs', 'AT RIVERTON', 39.8431, -89.5475, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('sangamon', '05578000', 'SANGAMON RIVER AT PETERSBURG, IL', 'usgs', 'AT PETERSBURG', 40.0133, -89.8383, false);

-- Kankakee River (IL) — 2 gauges
delete from public.river_gauges where river_id = 'kankakee_il';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('kankakee_il', '05520500', 'KANKAKEE RIVER AT MOMENCE, IL', 'usgs', 'AT MOMENCE', 41.1599, -87.6688, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('kankakee_il', '05527500', 'KANKAKEE RIVER NEAR WILMINGTON, IL', 'usgs', 'NEAR WILMINGTON', 41.3463, -88.1867, false);

-- Kaskaskia River (IL) — 3 gauges
delete from public.river_gauges where river_id = 'kaskaskia_il';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('kaskaskia_il', '05592100', 'KASKASKIA RIVER NEAR COWDEN, IL', 'usgs', 'NEAR COWDEN', 39.2299, -88.8418, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('kaskaskia_il', '05592000', 'KASKASKIA RIVER AT SHELBYVILLE, IL', 'usgs', 'AT SHELBYVILLE', 39.4070, -88.7810, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('kaskaskia_il', '05592500', 'KASKASKIA RIVER AT VANDALIA, IL', 'usgs', 'AT VANDALIA', 38.9606, -89.0888, false);

-- Spoon River (IL) — 2 gauges
delete from public.river_gauges where river_id = 'spoon_il';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('spoon_il', '05569500', 'SPOON RIVER AT LONDON MILLS, IL', 'usgs', 'AT LONDON MILLS', 40.7077, -90.2798, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('spoon_il', '05570000', 'SPOON RIVER AT SEVILLE, IL', 'usgs', 'AT SEVILLE', 40.4901, -90.3401, false);

-- Kishwaukee River (IL) — 5 gauges
delete from public.river_gauges where river_id = 'kishwaukee_il';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('kishwaukee_il', '05438500', 'KISHWAUKEE RIVER AT BELVIDERE, IL', 'usgs', 'AT BELVIDERE', 42.2561, -88.8632, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('kishwaukee_il', '05438170', 'KISHWAUKEE RIVER AT MARENGO, IL', 'usgs', 'AT MARENGO', 42.2653, -88.6085, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('kishwaukee_il', '05439000', 'SOUTH BRANCH KISHWAUKEE RIVER AT DEKALB, IL', 'usgs', 'AT DEKALB', 41.9311, -88.7597, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('kishwaukee_il', '05439500', 'SOUTH BRANCH KISHWAUKEE RIVER NR FAIRDALE IL', 'usgs', 'SOUTH BRANCH KISHWAUKEE RIVER NR FAIRDALE IL', 42.1106, -88.9007, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('kishwaukee_il', '05440000', 'KISHWAUKEE RIVER NEAR PERRYVILLE, IL', 'usgs', 'NEAR PERRYVILLE', 42.1944, -88.9989, false);

-- Pecatonica River (IL) — 2 gauges
delete from public.river_gauges where river_id = 'pecatonica_il';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('pecatonica_il', '05435500', 'PECATONICA RIVER AT FREEPORT, IL', 'usgs', 'AT FREEPORT', 42.3003, -89.6153, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('pecatonica_il', '05437050', 'PECATONICA RIVER NR SHIRLAND, ILL', 'usgs', 'PECATONICA RIVER NR SHIRLAND, ILL', 42.4381, -89.1750, false);

-- Iroquois River (IL) — 2 gauges
delete from public.river_gauges where river_id = 'iroquois_il';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('iroquois_il', '05525000', 'IROQUOIS RIVER AT IROQUOIS, IL', 'usgs', 'AT IROQUOIS', 40.8231, -87.5817, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('iroquois_il', '05526000', 'IROQUOIS RIVER NEAR CHEBANSE, IL', 'usgs', 'NEAR CHEBANSE', 41.0092, -87.8241, false);

-- Calumet River (IL) — 3 gauges
delete from public.river_gauges where river_id = 'calumet_il';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('calumet_il', '05536368', 'CALUMET SAG CHANNEL AT BLUE ISLAND, IL', 'usgs', 'AT BLUE ISLAND', 41.6528, -87.6703, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('calumet_il', '05536290', 'LITTLE CALUMET RIVER AT SOUTH HOLLAND, IL', 'usgs', 'AT SOUTH HOLLAND', 41.6070, -87.5976, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('calumet_il', '05536310', 'CALUMET UNION DRAINAGE CANAL NEAR MARKHAM, IL', 'usgs', 'NEAR MARKHAM', 41.5970, -87.6657, false);

-- North Branch Chicago River (IL) — 2 gauges
delete from public.river_gauges where river_id = 'north_branch_chicago_il';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('north_branch_chicago_il', '05536000', 'NORTH BRANCH CHICAGO RIVER AT NILES, IL', 'usgs', 'AT NILES', 42.0122, -87.7958, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('north_branch_chicago_il', '05534500', 'NORTH BRANCH CHICAGO RIVER AT DEERFIELD, IL', 'usgs', 'AT DEERFIELD', 42.1526, -87.8184, false);

-- Chicago River (IL) — 5 gauges
delete from public.river_gauges where river_id = 'chicago_il';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('chicago_il', '05536000', 'NORTH BRANCH CHICAGO RIVER AT NILES, IL', 'usgs', 'AT NILES', 42.0122, -87.7958, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('chicago_il', '05534500', 'NORTH BRANCH CHICAGO RIVER AT DEERFIELD, IL', 'usgs', 'AT DEERFIELD', 42.1526, -87.8184, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('chicago_il', '05535500', 'WF OF NB CHICAGO RIVER AT NORTHBROOK IL', 'usgs', 'AT NORTHBROOK IL', 42.1383, -87.8347, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('chicago_il', '05536085', 'NB CHICAGO RIVER AT N PULASKI ROAD AT CHICAGO, IL', 'usgs', 'AT N PULASKI ROAD AT CHICAGO', 41.9747, -87.7283, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('chicago_il', '05536890', 'CHICAGO SANITARY AND SHIP CANAL NR LEMONT, IL', 'usgs', 'CHICAGO SANITARY AND SHIP CANAL NR LEMONT, IL', 41.6912, -87.9638, false);

-- Nippersink Creek (IL) — 2 gauges
delete from public.river_gauges where river_id = 'nippersink_il';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('nippersink_il', '05548280', 'NIPPERSINK CREEK NEAR SPRING GROVE, IL', 'usgs', 'NEAR SPRING GROVE', 42.4437, -88.2474, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('nippersink_il', '05548105', 'NIPPERSINK CREEK ABOVE WONDER LAKE, IL', 'usgs', 'ABOVE WONDER LAKE', 42.3853, -88.3697, false);

-- Salt Creek (IL) — 4 gauges
delete from public.river_gauges where river_id = 'salt_il';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('salt_il', '05531300', 'SALT CREEK AT ELMHURST, IL', 'usgs', 'AT ELMHURST', 41.8862, -87.9596, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('salt_il', '05530990', 'SALT CREEK AT ROLLING MEADOWS, IL', 'usgs', 'AT ROLLING MEADOWS', 42.0604, -88.0167, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('salt_il', '05531045', 'SALT CREEK AT ELK GROVE VILLAGE, IL', 'usgs', 'AT ELK GROVE VILLAGE', 42.0121, -88.0010, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('salt_il', '05531500', 'SALT CREEK AT WESTERN SPRINGS, IL', 'usgs', 'AT WESTERN SPRINGS', 41.8258, -87.9003, false);

-- Androscoggin River (NH) — 3 gauges
delete from public.river_gauges where river_id = 'androscoggin';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('androscoggin', '01053600', 'Androscoggin River below Bog Brook at Cambridge NH', 'usgs', 'Below Bog Brook at Cambridge NH', 44.6661, -71.1814, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('androscoggin', '01053500', 'Androscoggin River at Errol, NH', 'usgs', 'At Errol', 44.7825, -71.1286, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('androscoggin', '01054000', 'Androscoggin River near Gorham, NH', 'usgs', 'Near Gorham', 44.4358, -71.1903, false);

-- Saco River (NH) — 2 gauges
delete from public.river_gauges where river_id = 'saco';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('saco', '01064500', 'Saco River near Conway, NH', 'usgs', 'Near Conway', 43.9908, -71.0906, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('saco', '010642505', 'SACO RIVER AT RIVER STREET, AT BARTLETT, NH', 'usgs', 'AT RIVER STREET, AT BARTLETT', 44.0839, -71.2856, false);

-- Pemigewasset River (NH) — 3 gauges
delete from public.river_gauges where river_id = 'pemi';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('pemi', '01076500', 'PEMIGEWASSET RIVER AT PLYMOUTH, NH', 'usgs', 'AT PLYMOUTH', 43.7592, -71.6856, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('pemi', '01074520', 'EAST BRANCH PEMIGEWASSET RIVER AT LINCOLN, NH', 'usgs', 'AT LINCOLN', 44.0476, -71.6598, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('pemi', '01075000', 'PEMIGEWASSET RIVER AT WOODSTOCK, NH', 'usgs', 'AT WOODSTOCK', 43.9762, -71.6795, false);

-- Contoocook River (NH) — 3 gauges
delete from public.river_gauges where river_id = 'contoocook';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('contoocook', '01085000', 'CONTOOCOOK RIVER NEAR HENNIKER, NH', 'usgs', 'NEAR HENNIKER', 43.1520, -71.8573, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('contoocook', '01082000', 'CONTOOCOOK RIVER AT PETERBOROUGH, NH', 'usgs', 'AT PETERBOROUGH', 42.8626, -71.9592, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('contoocook', '01085500', 'CONTOOCOOK R BL HOPKINTON DAM AT W HOPKINTON, NH', 'usgs', 'AT W HOPKINTON', 43.1929, -71.7473, false);

-- Lamprey River (NH) — 2 gauges
delete from public.river_gauges where river_id = 'lamprey_nh';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('lamprey_nh', '01073500', 'LAMPREY RIVER NEAR NEWMARKET, NH', 'usgs', 'NEAR NEWMARKET', 43.1026, -70.9526, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('lamprey_nh', '01073319', 'LAMPREY RIVER AT LANGFORD ROAD, AT RAYMOND, NH', 'usgs', 'AT LANGFORD ROAD, AT RAYMOND', 43.0414, -71.2017, false);

-- West River (VT) — 2 gauges
delete from public.river_gauges where river_id = 'west_river';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('west_river', '01155500', 'WEST RIVER AT JAMAICA, VT', 'usgs', 'AT JAMAICA', 43.1090, -72.7754, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('west_river', '01155910', 'WEST RIVER BELOW TOWNSHEND DAM NEAR TOWNSHEND, VT', 'usgs', 'BELOW TOWNSHEND DAM NEAR TOWNSHEND', 43.0512, -72.7001, false);

-- Lamoille River (VT) — 3 gauges
delete from public.river_gauges where river_id = 'lamoille';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('lamoille', '04292000', 'LAMOILLE RIVER AT JOHNSON, VT', 'usgs', 'AT JOHNSON', 44.6229, -72.6763, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('lamoille', '04292201', 'LAMOILLE RIVER AT JEFFERSONVILLE, VT', 'usgs', 'AT JEFFERSONVILLE', 44.6442, -72.8361, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('lamoille', '04292500', 'LAMOILLE RIVER AT EAST GEORGIA, VT', 'usgs', 'AT EAST GEORGIA', 44.6793, -73.0727, false);

-- Winooski River (VT) — 3 gauges
delete from public.river_gauges where river_id = 'winooski';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('winooski', '04286000', 'WINOOSKI RIVER AT MONTPELIER, VT', 'usgs', 'AT MONTPELIER', 44.2567, -72.5934, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('winooski', '04282886', 'WINOOSKI RIVER AT LOWER CABOT, VT', 'usgs', 'AT LOWER CABOT', 44.3905, -72.3307, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('winooski', '04285500', 'NORTH BRANCH WINOOSKI RIVER AT WRIGHTSVILLE, VT', 'usgs', 'AT WRIGHTSVILLE', 44.2995, -72.5787, false);

-- Missisquoi River (VT) — 2 gauges
delete from public.river_gauges where river_id = 'missisquoi';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('missisquoi', '04294000', 'MISSISQUOI RIVER AT SWANTON, VT', 'usgs', 'AT SWANTON', 44.9167, -73.1286, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('missisquoi', '04293500', 'MISSISQUOI RIVER NEAR EAST BERKSHIRE, VT', 'usgs', 'NEAR EAST BERKSHIRE', 44.9601, -72.6966, false);

-- Otter Creek (VT) — 2 gauges
delete from public.river_gauges where river_id = 'otter_creek';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('otter_creek', '04282000', 'OTTER CREEK AT CENTER RUTLAND, VT', 'usgs', 'AT CENTER RUTLAND', 43.6037, -73.0133, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('otter_creek', '04282500', 'OTTER CREEK AT MIDDLEBURY, VT', 'usgs', 'AT MIDDLEBURY', 44.0131, -73.1680, false);

-- Housatonic River (CT) — 3 gauges
delete from public.river_gauges where river_id = 'housatonic';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('housatonic', '01199000', 'HOUSATONIC RIVER AT FALLS VILLAGE, CT', 'usgs', 'AT FALLS VILLAGE', 41.9572, -73.3693, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('housatonic', '01200500', 'HOUSATONIC RIVER AT GAYLORDSVILLE, CT', 'usgs', 'AT GAYLORDSVILLE', 41.6530, -73.4898, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('housatonic', '01200600', 'HOUSATONIC RIVER NEAR NEW MILFORD, CT', 'usgs', 'NEAR NEW MILFORD', 41.5930, -73.4495, false);

-- Farmington River (CT) — 3 gauges
delete from public.river_gauges where river_id = 'farmington';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('farmington', '01189995', 'FARMINGTON RIVER AT TARIFFVILLE, CT', 'usgs', 'AT TARIFFVILLE', 41.9083, -72.7594, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('farmington', '01186000', 'WEST BRANCH FARMINGTON RIVER AT RIVERTON, CT', 'usgs', 'AT RIVERTON', 41.9628, -73.0176, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('farmington', '01188090', 'FARMINGTON RIVER AT UNIONVILLE, CT', 'usgs', 'AT UNIONVILLE', 41.7555, -72.8870, false);

-- Quinnipiac River (CT) — 2 gauges
delete from public.river_gauges where river_id = 'quinnipiac';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('quinnipiac', '01196500', 'QUINNIPIAC RIVER AT WALLINGFORD, CT', 'usgs', 'AT WALLINGFORD', 41.4503, -72.8413, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('quinnipiac', '01195490', 'QUINNIPIAC RIVER AT SOUTHINGTON, CT', 'usgs', 'AT SOUTHINGTON', 41.6035, -72.8832, false);

-- Natchaug River (CT) — 2 gauges
delete from public.river_gauges where river_id = 'natchaug';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('natchaug', '01122000', 'NATCHAUG RIVER AT WILLIMANTIC, CT', 'usgs', 'AT WILLIMANTIC', 41.7201, -72.1956, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('natchaug', '01120790', 'NATCHAUG RIVER AT MARCY RD. NEAR CHAPLIN, CT', 'usgs', 'AT MARCY RD. NEAR CHAPLIN', 41.8162, -72.1062, false);

-- Shepaug River (CT) — 2 gauges
delete from public.river_gauges where river_id = 'shepaug';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('shepaug', '01203000', 'SHEPAUG R NR ROXBURY, CT', 'usgs', 'SHEPAUG R NR ROXBURY, CT', 41.5497, -73.3298, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('shepaug', '01202501', 'SHEPAUG RIVER AT PETERS DAM AT WOODVILLE, CT', 'usgs', 'AT PETERS DAM AT WOODVILLE', 41.7196, -73.2926, false);

-- Eightmile River (CT) — 2 gauges
delete from public.river_gauges where river_id = 'eightmile_ct';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('eightmile_ct', '01194000', 'EIGHTMILE RIVER AT NORTH PLAIN, CT', 'usgs', 'AT NORTH PLAIN', 41.4417, -72.3327, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('eightmile_ct', '01194500', 'EAST BRANCH EIGHTMILE RIVER NEAR NORTH LYME, CT', 'usgs', 'NEAR NORTH LYME', 41.4275, -72.3348, false);

-- Wood River (RI) — 2 gauges
delete from public.river_gauges where river_id = 'wood_ri';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('wood_ri', '01117800', 'WOOD RIVER NEAR ARCADIA, RI', 'usgs', 'NEAR ARCADIA', 41.5740, -71.7206, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('wood_ri', '01118000', 'WOOD RIVER AT HOPE VALLEY, RI', 'usgs', 'AT HOPE VALLEY', 41.4982, -71.7165, false);

-- Pawcatuck River (RI) — 3 gauges
delete from public.river_gauges where river_id = 'pawcatuck';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('pawcatuck', '01118500', 'PAWCATUCK RIVER AT WESTERLY, RI', 'usgs', 'AT WESTERLY', 41.3853, -71.8331, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('pawcatuck', '01117430', 'PAWCATUCK RIVER AT KENYON, RI', 'usgs', 'AT KENYON', 41.4461, -71.6212, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('pawcatuck', '01117500', 'PAWCATUCK RIVER AT WOOD RIVER JUNCTION, RI', 'usgs', 'AT WOOD RIVER JUNCTION', 41.4450, -71.6809, false);

-- Blackstone River (RI) — 2 gauges
delete from public.river_gauges where river_id = 'blackstone';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('blackstone', '01112500', 'BLACKSTONE RIVER AT WOONSOCKET, RI', 'usgs', 'AT WOONSOCKET', 42.0065, -71.5026, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('blackstone', '01113895', 'BLACKSTONE R AT ROOSEVELT ST AT PAWTUCKET RI', 'usgs', 'AT ROOSEVELT ST AT PAWTUCKET RI', 41.8884, -71.3814, false);

-- Pawtuxet River (RI) — 3 gauges
delete from public.river_gauges where river_id = 'pawtuxet';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('pawtuxet', '01116500', 'PAWTUXET RIVER AT CRANSTON, RI', 'usgs', 'AT CRANSTON', 41.7509, -71.4451, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('pawtuxet', '01115500', 'NORTH BRANCH PAWTUXET RIVER AT FISKEVILLE, RI', 'usgs', 'AT FISKEVILLE', 41.7329, -71.5498, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('pawtuxet', '01116000', 'SOUTH BRANCH PAWTUXET RIVER AT WASHINGTON, RI', 'usgs', 'AT WASHINGTON', 41.6901, -71.5659, false);

-- Paulins Kill (NJ) — 2 gauges
delete from public.river_gauges where river_id = 'paulins_kill';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('paulins_kill', '01443500', 'Paulins Kill at Blairstown NJ', 'usgs', 'At Blairstown NJ', 40.9808, -74.9533, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('paulins_kill', '01443280', 'East Branch Paulins Kill near Lafayette NJ', 'usgs', 'Near Lafayette NJ', 41.0764, -74.6953, false);

-- Musconetcong River (NJ) — 2 gauges
delete from public.river_gauges where river_id = 'musconetcong';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('musconetcong', '01457000', 'Musconetcong River near Bloomsbury NJ', 'usgs', 'Near Bloomsbury NJ', 40.6722, -75.0608, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('musconetcong', '01455500', 'Musconetcong River at outlet of Lake Hopatcong NJ', 'usgs', 'At outlet of Lake Hopatcong NJ', 40.9172, -74.6656, false);

-- Great Egg Harbor River (NJ) — 3 gauges
delete from public.river_gauges where river_id = 'great_egg';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('great_egg', '01411000', 'Great Egg Harbor River at Folsom NJ', 'usgs', 'At Folsom NJ', 39.5947, -74.8517, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('great_egg', '01410784', 'Great Egg Harbor R near Sicklerville NJ', 'usgs', 'Near Sicklerville NJ', 39.7336, -74.9511, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('great_egg', '01410820', 'Great Egg Harbor River near Blue Anchor NJ', 'usgs', 'Near Blue Anchor NJ', 39.6692, -74.9133, false);

-- White Clay Creek (DE) — 2 gauges
delete from public.river_gauges where river_id = 'white_clay';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('white_clay', '01479000', 'WHITE CLAY CREEK NEAR NEWARK, DE', 'usgs', 'NEAR NEWARK', 39.6992, -75.6750, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('white_clay', '01478650', 'WHITE CLAY CREEK AT NEWARK, DE', 'usgs', 'AT NEWARK', 39.6892, -75.7488, false);

-- Red Clay Creek (DE) — 2 gauges
delete from public.river_gauges where river_id = 'red_clay';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('red_clay', '01480000', 'RED CLAY CREEK AT WOODDALE, DE', 'usgs', 'AT WOODDALE', 39.7628, -75.6365, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('red_clay', '01480015', 'RED CLAY CREEK NEAR STANTON, DE', 'usgs', 'NEAR STANTON', 39.7157, -75.6399, false);

-- Youghiogheny River — Maryland Section (MD) — 4 gauges
delete from public.river_gauges where river_id = 'yough_md';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('yough_md', '03075500', 'YOUGHIOGHENY RIVER NEAR OAKLAND, MD', 'usgs', 'NEAR OAKLAND', 39.4216, -79.4236, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('yough_md', '03075590', 'YOUGHIOGHENY RIVER NEAR SWALLOW FALLS PARK, MD', 'usgs', 'NEAR SWALLOW FALLS PARK', 39.4926, -79.4120, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('yough_md', '03076100', 'YOUGHIOGHENY RIVER NEAR MCHENRY, MD', 'usgs', 'NEAR MCHENRY', 39.5258, -79.4107, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('yough_md', '03076500', 'YOUGHIOGHENY RIVER AT FRIENDSVILLE, MD', 'usgs', 'AT FRIENDSVILLE', 39.6536, -79.4083, false);

-- Savage River (MD) — 2 gauges
delete from public.river_gauges where river_id = 'savage';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('savage', '01596500', 'SAVAGE RIVER NEAR BARTON, MD', 'usgs', 'NEAR BARTON', 39.5701, -79.1019, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('savage', '01597500', 'SAVAGE RIV BL SAVAGE RIV DAM NEAR BLOOMINGTON, MD', 'usgs', 'NEAR BLOOMINGTON', 39.5027, -79.1240, false);

-- Gunpowder Falls (MD) — 4 gauges
delete from public.river_gauges where river_id = 'gunpowder';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('gunpowder', '01582500', 'GUNPOWDER FALLS AT GLENCOE, MD', 'usgs', 'AT GLENCOE', 39.5497, -76.6361, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('gunpowder', '01581810', 'GUNPOWDER FALLS AT HOFFMANVILLE, MD', 'usgs', 'AT HOFFMANVILLE', 39.6898, -76.7815, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('gunpowder', '01581920', 'GUNPOWDER FALLS NEAR PARKTON, MD', 'usgs', 'NEAR PARKTON', 39.6191, -76.6904, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('gunpowder', '01584500', 'LITTLE GUNPOWDER FALLS AT LAUREL BROOK, MD', 'usgs', 'AT LAUREL BROOK', 39.5054, -76.4318, false);

-- Patuxent River (MD) — 5 gauges
delete from public.river_gauges where river_id = 'patuxent';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('patuxent', '01594440', 'PATUXENT RIVER NEAR BOWIE, MD', 'usgs', 'NEAR BOWIE', 38.9559, -76.6937, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('patuxent', '01591000', 'PATUXENT RIVER NEAR UNITY, MD', 'usgs', 'NEAR UNITY', 39.2383, -77.0557, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('patuxent', '01591610', 'Patuxent River below Brighton Dam near Brighton MD', 'usgs', 'Below Brighton Dam near Brighton MD', 39.1922, -77.0044, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('patuxent', '01592500', 'Patuxent River near Laurel, MD', 'usgs', 'Near Laurel', 39.1157, -76.8738, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('patuxent', '01593500', 'LITTLE PATUXENT RIVER AT GUILFORD, MD', 'usgs', 'AT GUILFORD', 39.1677, -76.8512, false);

-- Monocacy River (MD) — 4 gauges
delete from public.river_gauges where river_id = 'monocacy';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('monocacy', '01643000', 'MONOCACY RIVER AT JUG BRIDGE NEAR FREDERICK, MD', 'usgs', 'AT JUG BRIDGE NEAR FREDERICK', 39.4028, -77.3661, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('monocacy', '01639000', 'MONOCACY RIVER AT BRIDGEPORT, MD', 'usgs', 'AT BRIDGEPORT', 39.6791, -77.2345, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('monocacy', '01642190', 'MONOCACY RIVER AT MONOCACY BLVD AT FREDERICK, MD', 'usgs', 'AT MONOCACY BLVD AT FREDERICK', 39.4436, -77.3823, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('monocacy', '01643580', 'MONOCACY RIVER NEAR DICKERSON, MD', 'usgs', 'NEAR DICKERSON', 39.2634, -77.4357, false);

-- Antietam Creek (MD) — 2 gauges
delete from public.river_gauges where river_id = 'antietam_creek';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('antietam_creek', '01619500', 'ANTIETAM CREEK NEAR SHARPSBURG, MD', 'usgs', 'NEAR SHARPSBURG', 39.4498, -77.7302, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('antietam_creek', '01619000', 'ANTIETAM CREEK NEAR WAYNESBORO, PA', 'usgs', 'NEAR WAYNESBORO', 39.7163, -77.6066, false);

-- Patapsco River (MD) — 4 gauges
delete from public.river_gauges where river_id = 'patapsco';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('patapsco', '01589000', 'PATAPSCO RIVER AT HOLLOFIELD, MD', 'usgs', 'AT HOLLOFIELD', 39.3103, -76.7924, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('patapsco', '01586000', 'NORTH BRANCH PATAPSCO RIVER AT CEDARHURST, MD', 'usgs', 'AT CEDARHURST', 39.5030, -76.8844, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('patapsco', '01589025', 'PATAPSCO RIVER NEAR CATONSVILLE, MD', 'usgs', 'NEAR CATONSVILLE', 39.2512, -76.7638, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('patapsco', '01589035', 'PATAPSCO RIVER NEAR ELKRIDGE, MD', 'usgs', 'NEAR ELKRIDGE', 39.2273, -76.7230, false);

-- Potomac River (MD) — 2 gauges
delete from public.river_gauges where river_id = 'potomac_md';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('potomac_md', '01620000', 'POTOMAC RIVER AT HARPERS FERRY, WV', 'usgs', 'AT HARPERS FERRY', 39.3237, -77.7282, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('potomac_md', '01638500', 'POTOMAC RIVER AT POINT OF ROCKS, MD', 'usgs', 'AT POINT OF ROCKS', 39.2736, -77.5431, false);

-- North Branch Potomac River (MD) — 4 gauges
delete from public.river_gauges where river_id = 'north_branch_potomac_md';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('north_branch_potomac_md', '01603000', 'NORTH BRANCH POTOMAC RIVER NEAR CUMBERLAND, MD', 'usgs', 'NEAR CUMBERLAND', 39.6218, -78.7734, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('north_branch_potomac_md', '01595500', 'NORTH BRANCH POTOMAC RIVER AT KITZMILLER, MD', 'usgs', 'AT KITZMILLER', 39.3939, -79.1817, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('north_branch_potomac_md', '01598500', 'NORTH BRANCH POTOMAC RIVER AT LUKE, MD', 'usgs', 'AT LUKE', 39.4790, -79.0638, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('north_branch_potomac_md', '03075825', 'NORTH GLADE RUN NEAR SWANTON, MD', 'usgs', 'NEAR SWANTON', 39.5071, -79.2517, false);

-- Deerfield River (MA) — 2 gauges
delete from public.river_gauges where river_id = 'deerfield';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('deerfield', '01170000', 'DEERFIELD RIVER NEAR WEST DEERFIELD, MA', 'usgs', 'NEAR WEST DEERFIELD', 42.5359, -72.6534, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('deerfield', '01168500', 'DEERFIELD RIVER AT CHARLEMONT, MA', 'usgs', 'AT CHARLEMONT', 42.6260, -72.8542, false);

-- Westfield River (MA) — 3 gauges
delete from public.river_gauges where river_id = 'westfield';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('westfield', '01183500', 'WESTFIELD RIVER NEAR WESTFIELD, MA', 'usgs', 'NEAR WESTFIELD', 42.1068, -72.6990, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('westfield', '01179500', 'WESTFIELD RIVER AT KNIGHTVILLE, MA', 'usgs', 'AT KNIGHTVILLE', 42.2879, -72.8643, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('westfield', '01181000', 'WEST BRANCH WESTFIELD RIVER AT HUNTINGTON, MA', 'usgs', 'AT HUNTINGTON', 42.2373, -72.8957, false);

-- Charles River (MA) — 4 gauges
delete from public.river_gauges where river_id = 'charles_ma';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('charles_ma', '01104500', 'CHARLES RIVER AT WALTHAM, MA', 'usgs', 'AT WALTHAM', 42.3723, -71.2337, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('charles_ma', '01103280', 'CHARLES RIVER AT MEDWAY, MA', 'usgs', 'AT MEDWAY', 42.1398, -71.3895, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('charles_ma', '01103500', 'CHARLES RIVER AT DOVER, MA', 'usgs', 'AT DOVER', 42.2562, -71.2601, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('charles_ma', '01104200', 'CHARLES RIVER AT WELLESLEY, MA', 'usgs', 'AT WELLESLEY', 42.3165, -71.2278, false);

-- Sudbury River (MA) — 2 gauges
delete from public.river_gauges where river_id = 'sudbury_ma';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('sudbury_ma', '01098530', 'SUDBURY RIVER AT SAXONVILLE, MA', 'usgs', 'AT SAXONVILLE', 42.3254, -71.3976, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('sudbury_ma', '01097480', 'SUDBURY RIVER AT ASHLAND, MA', 'usgs', 'AT ASHLAND', 42.2600, -71.4564, false);

-- Nashua River (MA) — 4 gauges
delete from public.river_gauges where river_id = 'nashua_ma';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('nashua_ma', '01094500', 'NORTH NASHUA RIVER NEAR LEOMINSTER, MA', 'usgs', 'NEAR LEOMINSTER', 42.4951, -71.7219, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('nashua_ma', '01094400', 'NORTH NASHUA RIVER AT FITCHBURG, MA', 'usgs', 'AT FITCHBURG', 42.5762, -71.7881, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('nashua_ma', '01095503', 'NASHUA RIVER, WATER STREET BRIDGE, AT CLINTON, MA', 'usgs', 'AT CLINTON', 42.4194, -71.6661, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('nashua_ma', '01096500', 'NASHUA RIVER AT EAST PEPPERELL, MA', 'usgs', 'AT EAST PEPPERELL', 42.6676, -71.5751, false);

-- Kenai River (AK) — 2 gauges
delete from public.river_gauges where river_id = 'kenai_ak';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('kenai_ak', '15266300', 'KENAI R AT SOLDOTNA AK', 'usgs', 'AT SOLDOTNA AK', 60.4775, -151.0794, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('kenai_ak', '15266110', 'KENAI R BL SKILAK LK OUTLET NR STERLING AK', 'usgs', 'KENAI R BL SKILAK LK OUTLET NR STERLING AK', 60.4661, -150.6011, false);

-- Wailua River (HI) — 3 gauges
delete from public.river_gauges where river_id = 'wailua_hi';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('wailua_hi', '16060000', 'SF Wailua River nr Lihue, Kauai, HI', 'usgs', 'SF Wailua River nr Lihue, Kauai, HI', 22.0367, -159.3802, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('wailua_hi', '16060950', 'NF Wailua Riv abv N Wailua Ditch Int, Kauai, HI', 'usgs', 'NF Wailua Riv abv N Wailua Ditch Int, Kauai, HI', 22.0636, -159.4706, false);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('wailua_hi', '16068000', 'EB of NF Wailua River nr Lihue, Kauai, HI', 'usgs', 'EB of NF Wailua River nr Lihue, Kauai, HI', 22.0688, -159.4152, false);

-- Wailuku River (HI) — 2 gauges
delete from public.river_gauges where river_id = 'wailuku_hi';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('wailuku_hi', '16704000', 'Wailuku River at Piihonua, HI', 'usgs', 'At Piihonua', 19.7121, -155.1507, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('wailuku_hi', '16701800', 'Wailuku River nr Kaumana, HI', 'usgs', 'Wailuku River nr Kaumana, HI', 19.7177, -155.2661, false);

-- Waimea River (HI) — 2 gauges
delete from public.river_gauges where river_id = 'waimea_hi';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('waimea_hi', '16031000', 'Waimea River near Waimea, Kauai, HI', 'usgs', 'Near Waimea, Kauai', 21.9804, -159.6601, true);
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values ('waimea_hi', '16016000', 'Waimea River US of Kekaha-Waiahulu Int., Kauai, HI', 'usgs', 'Waimea River US of Kekaha-Waiahulu Int., Kauai, HI', 22.0751, -159.6483, false);

commit;
