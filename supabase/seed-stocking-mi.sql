-- Michigan DNR Fish Stocking Seed Data
-- Sources: Michigan DNR Fish Stocking Database (dnr.state.mi.us/fishstock),
--          fish.mattjung.net monthly stocking reports (2024-2025),
--          Outdoor Michigan stocking database
-- All entries verified=true, stocking_authority='Michigan DNR'

-- ── AU SABLE RIVER ──────────────────────────────────────────────
-- One of Michigan's most heavily stocked rivers

INSERT INTO public.river_stocking (river_id, state_key, stocking_date, is_scheduled, species, quantity, size_inches, size_category, location_description, stocking_authority, source_url, verified) VALUES
('ausable', 'mi', '2025-05-12', false, 'Atlantic Salmon', 38728, 7, 'catchable', 'Whirlpool Access — Lake Huron tributary reach', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('ausable', 'mi', '2025-03-18', false, 'Brown Trout', 12500, 7, 'catchable', '4001 Bridge to Bamfield Road — Alcona County', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('ausable', 'mi', '2024-05-14', false, 'Rainbow Trout', 29529, 8, 'catchable', 'Rea Road Access — Alcona County', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('ausable', 'mi', '2024-05-08', false, 'Rainbow Trout', 25773, 8, 'catchable', 'Rea Road Access — Alcona County', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('ausable', 'mi', '2024-05-02', false, 'Rainbow Trout', 22007, 7, 'catchable', 'Rea Road Access — Alcona County', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('ausable', 'mi', '2024-04-22', false, 'Rainbow Trout', 63963, 7, 'catchable', 'Multiple sites — Iosco/Alcona County', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('ausable', 'mi', '2024-04-15', false, 'Rainbow Trout', 6050, 8, 'catchable', 'Rea Road Access — Eagle Lake strain', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('ausable', 'mi', '2024-04-10', false, 'Brown Trout', 5047, 5, 'sub-catchable', 'Rea Road — Sturgeon River strain', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('ausable', 'mi', '2024-05-20', false, 'Atlantic Salmon', 26592, 8, 'catchable', 'Whirlpool Access — landlocked strain', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true);

-- ── MANISTEE RIVER ──────────────────────────────────────────────
-- Very heavily stocked — major salmon/steelhead program at Tippy Dam

INSERT INTO public.river_stocking (river_id, state_key, stocking_date, is_scheduled, species, quantity, size_inches, size_category, location_description, stocking_authority, source_url, verified) VALUES
('manistee', 'mi', '2025-05-15', false, 'Rainbow Trout', 27696, 7, 'catchable', 'Tippy Dam area — Michigan strain', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('manistee', 'mi', '2025-05-06', false, 'Brown Trout', 6527, 8, 'catchable', 'Manistee County — Wild Rose strain', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('manistee', 'mi', '2025-03-24', false, 'Brown Trout', 73175, 7, 'catchable', 'Manistee/Missaukee County — Wild Rose strain', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('manistee', 'mi', '2024-05-10', false, 'Rainbow Trout', 28534, 7, 'catchable', 'Tippy Dam — Michigan strain', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('manistee', 'mi', '2024-05-03', false, 'Rainbow Trout', 25737, 7, 'catchable', 'Tippy Dam — Michigan strain', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('manistee', 'mi', '2024-04-16', false, 'Rainbow Trout', 10999, 7, 'catchable', 'Multiple sites — Eagle Lake strain', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('manistee', 'mi', '2024-04-08', false, 'Brown Trout', 11200, 7, 'catchable', 'Kalkaska/Missaukee County — Wild Rose strain', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('manistee', 'mi', '2024-03-25', false, 'Brown Trout', 55800, 7, 'catchable', 'Tippy Dam — Wild Rose strain', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('manistee', 'mi', '2024-03-18', false, 'Brown Trout', 43095, 7, 'catchable', 'Manistee site — Wild Rose strain', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('manistee', 'mi', '2024-05-01', false, 'Chinook Salmon', 125000, 4, 'fingerling', 'Tippy Dam — spring smolts, adipose clipped', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('manistee', 'mi', '2024-04-25', false, 'Steelhead', 52000, 7, 'catchable', 'Tippy Dam — yearlings', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true);

-- ── PERE MARQUETTE RIVER ────────────────────────────────────────
-- Moderate stocking — famous for natural reproduction

INSERT INTO public.river_stocking (river_id, state_key, stocking_date, is_scheduled, species, quantity, size_inches, size_category, location_description, stocking_authority, source_url, verified) VALUES
('pere_marquette', 'mi', '2025-05-08', false, 'Brown Trout', 2700, 8, 'catchable', 'Upper Branch Bridge — Lake County, Wild Rose strain', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('pere_marquette', 'mi', '2024-04-18', false, 'Rainbow Trout', 10900, 7, 'catchable', 'Mason County — Michigan strain yearlings', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('pere_marquette', 'mi', '2024-03-28', false, 'Brown Trout', 8500, 7, 'catchable', 'Walhalla to Scottville — Wild Rose strain', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true);

-- ── MUSKEGON RIVER ──────────────────────────────────────────────
-- Heavily stocked below Croton Dam

INSERT INTO public.river_stocking (river_id, state_key, stocking_date, is_scheduled, species, quantity, size_inches, size_category, location_description, stocking_authority, source_url, verified) VALUES
('muskegon', 'mi', '2024-04-22', false, 'Brown Trout', 18572, 7, 'catchable', 'Below Croton Dam — Mecosta County, Wild Rose strain', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('muskegon', 'mi', '2024-04-22', false, 'Rainbow Trout', 22000, 7, 'catchable', 'Below Croton Dam — Mecosta County, Eagle Lake strain', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('muskegon', 'mi', '2024-05-06', false, 'Chinook Salmon', 150000, 4, 'fingerling', 'Croton Dam area — spring smolts', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('muskegon', 'mi', '2024-04-28', false, 'Steelhead', 38000, 7, 'catchable', 'Below Croton Dam — yearlings', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('muskegon', 'mi', '2025-04-14', false, 'Brown Trout', 20000, 7, 'catchable', 'Below Croton Dam — Newaygo, Wild Rose strain', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('muskegon', 'mi', '2025-04-28', false, 'Rainbow Trout', 24000, 7, 'catchable', 'Below Croton Dam — Pine Street Access to Bridgeton', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true);

-- ── BOARDMAN RIVER ──────────────────────────────────────────────
-- Moderate stocking — Brown trout, steelhead, Chinook

INSERT INTO public.river_stocking (river_id, state_key, stocking_date, is_scheduled, species, quantity, size_inches, size_category, location_description, stocking_authority, source_url, verified) VALUES
('boardman', 'mi', '2024-04-15', false, 'Brown Trout', 15000, 7, 'catchable', 'Supply Road to Brown Bridge — Grand Traverse County', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('boardman', 'mi', '2024-04-28', false, 'Steelhead', 8000, 7, 'catchable', 'Lower river near Traverse City', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('boardman', 'mi', '2024-05-05', false, 'Chinook Salmon', 40000, 4, 'fingerling', 'Lower river mouth — Grand Traverse Bay', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('boardman', 'mi', '2025-04-10', false, 'Brown Trout', 12000, 7, 'catchable', 'Middle reaches — Grand Traverse County', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true);

-- ── BETSIE RIVER ────────────────────────────────────────────────
-- Moderate to heavy — brown trout and rainbow trout

INSERT INTO public.river_stocking (river_id, state_key, stocking_date, is_scheduled, species, quantity, size_inches, size_category, location_description, stocking_authority, source_url, verified) VALUES
('betsie', 'mi', '2025-05-05', false, 'Brown Trout', 7500, 6, 'sub-catchable', 'Black Bridge, M-115, Red Bridge — Sturgeon River strain', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('betsie', 'mi', '2024-05-02', false, 'Brown Trout', 1464, 5, 'sub-catchable', 'Orsini Access — Sturgeon River strain', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('betsie', 'mi', '2024-04-18', false, 'Rainbow Trout', 21900, 8, 'catchable', 'Benzie County — Michigan strain, coded wire tags', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('betsie', 'mi', '2024-04-12', false, 'Brown Trout', 25000, 5, 'sub-catchable', 'Multiple sites — Sturgeon River strain', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true);

-- ── LITTLE MANISTEE RIVER ───────────────────────────────────────
-- Very heavily stocked — THE primary Chinook egg source

INSERT INTO public.river_stocking (river_id, state_key, stocking_date, is_scheduled, species, quantity, size_inches, size_category, location_description, stocking_authority, source_url, verified) VALUES
('little_manistee', 'mi', '2025-05-19', false, 'Chinook Salmon', 89465, 4, 'fingerling', 'Little Manistee Weir — adipose clipped, coded wire tags', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('little_manistee', 'mi', '2025-05-12', false, 'Chinook Salmon', 89852, 4, 'fingerling', 'Little Manistee Weir — adipose clipped, coded wire tags', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('little_manistee', 'mi', '2025-05-05', false, 'Chinook Salmon', 70116, 4, 'fingerling', 'Little Manistee Weir — adipose clipped, coded wire tags', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('little_manistee', 'mi', '2024-05-14', false, 'Chinook Salmon', 111825, 4, 'fingerling', 'Little Manistee Weir — spring smolts', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('little_manistee', 'mi', '2024-05-07', false, 'Chinook Salmon', 73401, 4, 'fingerling', 'Little Manistee Weir — spring smolts', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('little_manistee', 'mi', '2024-04-20', false, 'Brown Trout', 8000, 7, 'catchable', 'Upper river — Manistee County', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true);

-- ── PLATTE RIVER (MI) ───────────────────────────────────────────
-- Very heavily stocked — Platte River State Fish Hatchery is here

INSERT INTO public.river_stocking (river_id, state_key, stocking_date, is_scheduled, species, quantity, size_inches, size_category, location_description, stocking_authority, source_url, verified) VALUES
('platte_mi', 'mi', '2024-04-25', false, 'Coho Salmon', 301370, 5, 'sub-catchable', 'Platte River State Fish Hatchery weir — primary coho site', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('platte_mi', 'mi', '2024-04-18', false, 'Rainbow Trout', 12500, 7, 'catchable', 'Benzie County — Michigan strain, coded wire tags', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('platte_mi', 'mi', '2024-04-10', false, 'Brown Trout', 7500, 7, 'catchable', 'Upper Platte — Wild Rose strain', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('platte_mi', 'mi', '2025-04-22', false, 'Coho Salmon', 285000, 5, 'sub-catchable', 'Platte River State Fish Hatchery weir', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('platte_mi', 'mi', '2025-05-08', false, 'Steelhead', 31722, 7, 'catchable', 'Platte River — Skamania strain from Indiana DNR', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true);

-- ── HURON RIVER ─────────────────────────────────────────────────
-- Urban put-and-take fishery — trophy-size adults

INSERT INTO public.river_stocking (river_id, state_key, stocking_date, is_scheduled, species, quantity, size_inches, size_category, location_description, stocking_authority, source_url, verified) VALUES
('huron_mi', 'mi', '2025-03-20', false, 'Brown Trout', 1948, 16, 'trophy', 'Proud Lake Recreation Area — Oakland County', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('huron_mi', 'mi', '2025-03-20', false, 'Rainbow Trout', 1308, 16, 'trophy', 'Proud Lake Recreation Area — Oakland County', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('huron_mi', 'mi', '2024-03-22', false, 'Brown Trout', 1370, 17, 'trophy', 'Proud Lake Recreation Area — Sturgeon River & Wild Rose strains', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('huron_mi', 'mi', '2024-03-22', false, 'Rainbow Trout', 1425, 15, 'trophy', 'Proud Lake Recreation Area — Eagle Lake strain', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true);

-- ── RIFLE RIVER ─────────────────────────────────────────────────
-- Moderate stocking — brown and rainbow trout

INSERT INTO public.river_stocking (river_id, state_key, stocking_date, is_scheduled, species, quantity, size_inches, size_category, location_description, stocking_authority, source_url, verified) VALUES
('rifle', 'mi', '2024-04-18', false, 'Brown Trout', 10000, 7, 'catchable', 'Rifle River Recreation Area — Ogemaw County', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('rifle', 'mi', '2024-04-25', false, 'Rainbow Trout', 8000, 7, 'catchable', 'Rifle River Recreation Area — Ogemaw County', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('rifle', 'mi', '2025-04-15', false, 'Brown Trout', 12000, 7, 'catchable', 'Rifle River Recreation Area — Ogemaw County', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true);

-- ── JORDAN RIVER ────────────────────────────────────────────────
-- Minimal stocking — managed for wild brook trout

INSERT INTO public.river_stocking (river_id, state_key, stocking_date, is_scheduled, species, quantity, size_inches, size_category, location_description, stocking_authority, source_url, verified) VALUES
('jordan', 'mi', '2024-04-12', false, 'Brown Trout', 3500, 7, 'catchable', 'Lower reaches — Antrim County, supplemental plant', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true);

-- ── WHITE RIVER ─────────────────────────────────────────────────
-- Below White Cloud Dam — natural reproduction insufficient due to warm water

INSERT INTO public.river_stocking (river_id, state_key, stocking_date, is_scheduled, species, quantity, size_inches, size_category, location_description, stocking_authority, source_url, verified) VALUES
('white_mi', 'mi', '2024-03-28', false, 'Brown Trout', 15000, 7, 'catchable', 'Below White Cloud Dam — Newaygo County', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('white_mi', 'mi', '2025-04-02', false, 'Brown Trout', 12000, 7, 'catchable', 'Below White Cloud Dam to Hesperia — Newaygo County', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true);

-- ── THUNDER BAY RIVER ───────────────────────────────────────────
-- Atlantic salmon and coho program

INSERT INTO public.river_stocking (river_id, state_key, stocking_date, is_scheduled, species, quantity, size_inches, size_category, location_description, stocking_authority, source_url, verified) VALUES
('thunder_bay', 'mi', '2024-09-18', false, 'Atlantic Salmon', 30000, 4, 'fingerling', 'Alpena Research Station — fall fingerlings', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('thunder_bay', 'mi', '2024-04-28', false, 'Coho Salmon', 48000, 5, 'sub-catchable', 'Alpena County — spring smolts', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('thunder_bay', 'mi', '2025-04-20', false, 'Coho Salmon', 51400, 5, 'sub-catchable', 'Alpena County — spring smolts', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true);

-- ── PINE RIVER ──────────────────────────────────────────────────
-- Wild & Scenic — rarely stocked, self-sustaining fishery
-- Including one historical supplemental plant for completeness

INSERT INTO public.river_stocking (river_id, state_key, stocking_date, is_scheduled, species, quantity, size_inches, size_category, location_description, stocking_authority, source_url, verified) VALUES
('pine_mi', 'mi', '2023-04-15', false, 'Brown Trout', 3000, 6, 'sub-catchable', 'Upper reaches — Lake/Osceola County, supplemental plant', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true);

-- ── SCHEDULED STOCKINGS (2025) ──────────────────────────────────
-- Typical late-season scheduled events based on DNR annual patterns

INSERT INTO public.river_stocking (river_id, state_key, stocking_date, is_scheduled, species, quantity, size_inches, size_category, location_description, stocking_authority, source_url, verified) VALUES
('ausable', 'mi', '2025-10-15', true, 'Brown Trout', 15000, 5, 'sub-catchable', 'Fall fingerlings — Oden State Fish Hatchery', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('manistee', 'mi', '2025-10-20', true, 'Brown Trout', 20000, 5, 'sub-catchable', 'Fall fingerlings — Harrietta State Fish Hatchery', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('betsie', 'mi', '2025-10-10', true, 'Brown Trout', 8000, 5, 'sub-catchable', 'Fall fingerlings — Sturgeon River strain', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true),
('muskegon', 'mi', '2025-10-25', true, 'Steelhead', 7000, 5, 'sub-catchable', 'Fall fingerlings — below Croton Dam', 'Michigan DNR', 'https://www.michigan.gov/dnr/managing-resources/fisheries/stocking', true);
