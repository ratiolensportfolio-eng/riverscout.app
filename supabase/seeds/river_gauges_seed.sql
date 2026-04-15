-- river_gauges_seed.sql
--
-- Seed the multi-gauge demonstration set: 15 gauges across 6 rivers.
-- Per-river: marks one gauge is_primary (matches whatever's already
-- in data/rivers.ts.g). Coords are real USGS station locations.
--
-- Run AFTER migration 034_river_gauges.sql.
--
-- Idempotent: per-river delete-then-insert.

begin;

-- ── Au Sable (MI) — 4 gauges ──────────────────────────────────
delete from public.river_gauges where river_id = 'ausable';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values
  ('ausable', '04137500', 'AU SABLE RIVER NEAR AU SABLE, MI', 'usgs', 'Lower (near mouth)',         44.4187, -83.4286, true),
  ('ausable', '04136500', 'AU SABLE RIVER AT MIO, MI',         'usgs', 'Main Stem at Mio',          44.6566, -84.1289, false),
  ('ausable', '04136900', 'AU SABLE RIVER NEAR MC KINLEY, MI', 'usgs', 'Main Stem near Parmalee',   44.6448, -83.9395, false),
  ('ausable', '04135700', 'SOUTH BRANCH AU SABLE RIVER NEAR LUZERNE, MI', 'usgs', 'South Branch (Roscommon area)', 44.6731, -84.2664, false);
-- North Branch at Lovells:
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values
  ('ausable', '04135800', 'NB AU SABLE RIVER AT KELLOGGS BR NEAR LOVELLS, MI', 'usgs', 'North Branch at Lovells', 44.7833, -84.4628, false);

-- ── Muskegon (MI) — 3 gauges ──────────────────────────────────
delete from public.river_gauges where river_id = 'muskegon';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values
  ('muskegon', '04121970', 'MUSKEGON RIVER NEAR CROTON, MI',           'usgs', 'Below Croton Dam',       43.4239, -85.6678, true),
  ('muskegon', '04121680', 'MUSKEGON RIVER NEAR OXBOW, MI',            'usgs', 'Above Croton Dam',       43.4664, -85.6878, false),
  ('muskegon', '04122001', 'MUSKEGON RIVER AT BRIDGE STREET AT NEWAYGO, MI', 'usgs', 'At Newaygo',     43.4189, -85.7972, false);

-- ── Pere Marquette (MI) — 1 gauge (Baldwin has no active USGS) ──
delete from public.river_gauges where river_id = 'pere_marquette';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values
  ('pere_marquette', '04122500', 'PERE MARQUETTE RIVER AT SCOTTVILLE, MI', 'usgs', 'At Scottville', 43.9544, -86.2747, true);

-- ── Gauley (WV) — 2 gauges ────────────────────────────────────
delete from public.river_gauges where river_id = 'gauley';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values
  ('gauley', '03189600', 'GAULEY RIVER BELOW SUMMERSVILLE DAM, WV', 'usgs', 'Summersville Dam release', 38.2197, -80.8881, true),
  ('gauley', '03191982', 'GAULEY RIVER BELOW RICH CREEK AT JODIE, WV', 'usgs', 'Below Swiss (Jodie)',    38.2256, -81.1169, false);

-- ── New (WV) — 3 gauges ───────────────────────────────────────
delete from public.river_gauges where river_id = 'new_river';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values
  ('new_river', '03184500', 'NEW RIVER AT HINTON, WV',     'usgs', 'At Hinton',     37.6745, -80.8872, true),
  ('new_river', '03185400', 'NEW RIVER AT THURMOND, WV',   'usgs', 'At Thurmond',   37.9536, -81.0728, false),
  ('new_river', '380649081083301', 'NEW RIVER BELOW HAWKS NEST DAM, WV', 'usgs', 'Below Hawks Nest (Fayetteville area)', 38.1136, -81.1425, false);

-- ── Muskingum (OH) — 5 gauges along 112 miles ─────────────────
-- Coshocton (top of river) → Beverly (above Marietta confluence).
-- Primary set to McConnelsville to match data/rivers.ts.
delete from public.river_gauges where river_id = 'muskingum_oh';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values
  ('muskingum_oh', '03150000', 'Muskingum River at McConnelsville OH', 'usgs', 'At McConnelsville (mid-river)', 39.6451, -81.8499, true),
  ('muskingum_oh', '03140500', 'Muskingum River near Coshocton OH',   'usgs', 'Near Coshocton (head, Three Rivers)', 40.2789, -81.8485, false),
  ('muskingum_oh', '03144500', 'Muskingum River at Dresden OH',       'usgs', 'At Dresden',                39.9978, -81.9612, false),
  ('muskingum_oh', '03148000', 'Muskingum River at Zanesville OH',    'usgs', 'At Zanesville',             39.9320, -82.0070, false),
  ('muskingum_oh', '03150500', 'Muskingum River at Beverly OH',       'usgs', 'At Beverly (lower river)',  39.5364, -81.6353, false);

-- ── Colorado (AZ) — 2 gauges ──────────────────────────────────
delete from public.river_gauges where river_id = 'colorado';
insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values
  ('colorado', '09380000', 'COLORADO RIVER AT LEES FERRY, AZ', 'usgs', 'Lees Ferry (Grand Canyon put-in)', 36.8647, -111.5878, true),
  ('colorado', '09404200', 'COLORADO RVR ABV DIAMOND CREEK NR PEACH SPRINGS AZ', 'usgs', 'Above Diamond Creek (take-out)', 35.7681, -113.3658, false);

commit;
