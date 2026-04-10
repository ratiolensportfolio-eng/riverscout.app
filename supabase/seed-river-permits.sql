-- Seed data for public.river_permits
--
-- Twelve rivers in the RiverScout database that require permits for
-- private overnight or multi-day trips. Run this AFTER applying
-- supabase/migrations/016_river_permits.sql.
--
-- Provenance note: every row is marked last_verified_year = 2025 and
-- the in-app display surfaces "always confirm with the managing
-- agency before applying" as a footer. Permit rules change yearly —
-- treat these rows as a starting point, not the source of truth.
--
-- URL strategy: every URL is an agency root (nps.gov/grca, blm.gov,
-- fs.usda.gov, recreation.gov) — these are stable and won't 404 even
-- as agencies reorganize their permit pages. The single exception is
-- Middle Fork Salmon, which uses the verified
-- recreation.gov/permits/234623 direct link as apply_url. As deep
-- links are independently verified by the project owner, individual
-- rows can be patched by re-running this seed (it deletes the 12
-- target rows at the top).
--
-- Cost fields are intentionally null when fees are variable; the
-- cost detail lives in `notes` so the display surfaces it as prose
-- ("Cost varies — see…") instead of an incorrect number.

-- Fresh seed: clear any prior rows for these rivers so re-running
-- the script is idempotent.
delete from public.river_permits where river_id in (
  'grandcanyon', 'mf_salmon', 'rogue', 'selway', 'yampa',
  'desolation', 'cataract', 'westwater', 'green_lodore',
  'illinois_or', 'chattooga_ga', 'kawishiwi'
);

-- ─── 1. Colorado River — Grand Canyon ────────────────────────────
-- The most famous private river permit in the US. NPS weighted lottery;
-- the weighted pool favors applicants who have not run the canyon
-- recently, but desirable launch dates still take 10+ years to win.
-- Followup lotteries throughout the year are the realistic path for
-- many trips as cancellations come in.
insert into public.river_permits (
  river_id, river_name, state_key,
  permit_name, managing_agency, permit_type, required_for,
  application_opens, application_closes, results_date,
  permit_season_start, permit_season_end,
  group_size_min, group_size_max,
  cost_per_person, cost_per_group,
  apply_url, info_url, phone,
  notes,
  commercial_available, commercial_notes,
  verified, last_verified_year
) values (
  'grandcanyon',
  'Colorado River — Grand Canyon',
  'az',
  'Grand Canyon River Permit',
  'National Park Service — Grand Canyon NP',
  'lottery_weighted',
  'overnight',
  'February 1',
  'Late February',
  'Late February (followup lotteries throughout the year)',
  'Year-round',
  'Year-round',
  1,
  16,
  null,
  null,
  'https://www.nps.gov/grca/',
  'https://www.nps.gov/grca/',
  '(800) 959-9164',
  'Cost varies by trip type and length — typical fees include a per-person/per-night user fee plus a non-refundable launch fee. Current fee schedule on the NPS site. The weighted lottery favors applicants who have not run the canyon recently; wait times for desirable launch dates exceed 12 years. Followup lotteries run throughout the year as cancellations come in. Permit holder must be on the river every day of the trip; commercial trips operate under a separate allocation.',
  true,
  'Roughly 25,000 people run the canyon annually under commercial allocation. Trips range from 6-day motor to 18-day oar. See outfitters below for booking.',
  true,
  2025
);

-- ─── 2. Middle Fork of the Salmon ────────────────────────────────
-- USFS Four Rivers Lottery (also covers Main Salmon, Selway, Hells
-- Canyon). recreation.gov apply_url verified working.
insert into public.river_permits (
  river_id, river_name, state_key,
  permit_name, managing_agency, permit_type, required_for,
  application_opens, application_closes, results_date,
  permit_season_start, permit_season_end,
  group_size_min, group_size_max,
  cost_per_person, cost_per_group,
  apply_url, info_url, phone,
  notes,
  commercial_available, commercial_notes,
  verified, last_verified_year
) values (
  'mf_salmon',
  'Middle Fork of the Salmon',
  'id',
  'Four Rivers Lottery — Middle Fork Salmon',
  'USFS Salmon-Challis National Forest',
  'lottery_standard',
  'all_launches',
  'December 1',
  'January 31',
  'Mid-February',
  'May 28',
  'September 3',
  1,
  24,
  null,
  null,
  'https://www.recreation.gov/permits/234623',
  'https://www.fs.usda.gov/',
  '(208) 879-4101',
  'Cost is a per-person/per-day recreation fee plus a permit issuance fee — varies by year and trip length. Current schedule on the USFS site. One application per person across all four rivers in the lottery system (Middle Fork, Main Salmon, Selway, Hells Canyon). The same person cannot lead more than one trip per river per year. Best launch windows (June–July) take 5+ years to win for desirable dates. The cancellation list opens after the lottery and is the realistic path for shoulder-season trips.',
  true,
  'Roughly 10,000 people float the Middle Fork annually. Multiple licensed outfitters run guided 6-day fly-in trips. See outfitters below.',
  true,
  2025
);

-- ─── 3. Rogue River — Wild Section ───────────────────────────────
-- BLM Medford District lottery for the 35-mile Wild Section from
-- Grave Creek to Foster Bar. May 15 – Oct 15 control season.
insert into public.river_permits (
  river_id, river_name, state_key,
  permit_name, managing_agency, permit_type, required_for,
  application_opens, application_closes, results_date,
  permit_season_start, permit_season_end,
  group_size_min, group_size_max,
  cost_per_person, cost_per_group,
  apply_url, info_url, phone,
  notes,
  commercial_available, commercial_notes,
  verified, last_verified_year
) values (
  'rogue',
  'Rogue River',
  'or',
  'Rogue Wild Section River Permit',
  'BLM Medford District — Rogue River-Siskiyou NF',
  'lottery_standard',
  'all_launches',
  'December 1',
  'January 31',
  'Mid-February',
  'May 15',
  'October 15',
  1,
  null,
  null,
  null,
  'https://www.blm.gov/',
  'https://www.blm.gov/',
  '(541) 618-2200',
  'Daily user fees apply per person plus a permit issuance fee — current schedule on the BLM site. Permit covers the 34-mile Wild Section from Grave Creek to Foster Bar. Outside the May 15 – October 15 control season, permits are self-issue at the put-in. Trips typically run 3–5 days; reservations are also available for the 13 designated camp areas via the same system.',
  true,
  'Multiple licensed outfitters run guided 3–5 day Wild Rogue trips. Lodge-based trips with overnight stays at Black Bar, Marial, and Half Moon Bar are also available. See outfitters below.',
  true,
  2025
);

-- ─── 4. Selway River ─────────────────────────────────────────────
-- Part of the Four Rivers Lottery system. Hardest US river permit to
-- win — only ONE launch per day during the May 15 – July 31 control
-- season, ~62 launches per year total.
insert into public.river_permits (
  river_id, river_name, state_key,
  permit_name, managing_agency, permit_type, required_for,
  application_opens, application_closes, results_date,
  permit_season_start, permit_season_end,
  group_size_min, group_size_max,
  cost_per_person, cost_per_group,
  apply_url, info_url, phone,
  notes,
  commercial_available, commercial_notes,
  verified, last_verified_year
) values (
  'selway',
  'Selway River',
  'id',
  'Four Rivers Lottery — Selway',
  'USFS Bitterroot National Forest / Nez Perce-Clearwater NF',
  'lottery_standard',
  'all_launches',
  'December 1',
  'January 31',
  'Mid-February',
  'May 15',
  'July 31',
  1,
  16,
  null,
  null,
  'https://www.recreation.gov/',
  'https://www.fs.usda.gov/',
  '(406) 821-3201',
  'The hardest river permit to win in the United States — only one launch per day during the May 15 – July 31 control season, roughly 62 launches per year for the entire country. Permit is part of the Four Rivers Lottery covering the Middle Fork Salmon, Main Salmon, Selway, and Hells Canyon. One application per person across all four rivers. Snowmelt-driven flows; the river is often unrunnable in low-water years.',
  false,
  null,
  true,
  2025
);

-- ─── 5. Yampa River ──────────────────────────────────────────────
-- NPS Dinosaur National Monument lottery. Snowmelt-dependent, so the
-- season is tight (typically May 1 – early July). The same lottery
-- covers Lodore Canyon on the Green.
insert into public.river_permits (
  river_id, river_name, state_key,
  permit_name, managing_agency, permit_type, required_for,
  application_opens, application_closes, results_date,
  permit_season_start, permit_season_end,
  group_size_min, group_size_max,
  cost_per_person, cost_per_group,
  apply_url, info_url, phone,
  notes,
  commercial_available, commercial_notes,
  verified, last_verified_year
) values (
  'yampa',
  'Yampa River',
  'co',
  'Dinosaur NM River Permit — Yampa',
  'National Park Service — Dinosaur National Monument',
  'lottery_standard',
  'overnight',
  'December 1',
  'January 31',
  'Early February',
  'May 1',
  'July 10',
  1,
  25,
  null,
  null,
  'https://www.nps.gov/dino/',
  'https://www.nps.gov/dino/',
  '(970) 374-2468',
  'Snowmelt-driven; the Yampa typically runs May through early July and is often unrunnable in low-snowpack years. The NPS administers a single annual lottery covering both Yampa and Lodore Canyon launches. Yampa is the more competitive of the two because of the short season. Cost is a per-person/per-night fee — current schedule on the NPS site.',
  true,
  'Multiple licensed outfitters run 4–5 day Yampa trips during the spring window. See outfitters below.',
  true,
  2025
);

-- ─── 6. Green River — Desolation Canyon ──────────────────────────
-- BLM Price Field Office lottery for 84 miles of Class II–III through
-- the deepest canyon in the Uinta Basin.
insert into public.river_permits (
  river_id, river_name, state_key,
  permit_name, managing_agency, permit_type, required_for,
  application_opens, application_closes, results_date,
  permit_season_start, permit_season_end,
  group_size_min, group_size_max,
  cost_per_person, cost_per_group,
  apply_url, info_url, phone,
  notes,
  commercial_available, commercial_notes,
  verified, last_verified_year
) values (
  'desolation',
  'Green River — Desolation Canyon',
  'ut',
  'Desolation Canyon River Permit',
  'BLM Price Field Office',
  'lottery_standard',
  'overnight',
  'December 1',
  'January 31',
  'Mid-February',
  'May 1',
  'September 30',
  1,
  25,
  null,
  null,
  'https://www.blm.gov/',
  'https://www.blm.gov/',
  '(435) 636-3600',
  'Eighty-four miles of Class II–III wilderness through the deepest canyon in the Uinta Basin. Cost is a per-person fee — current schedule on the BLM site. Trip length typically 5–7 days. Take-out at Swasey\u2019s Beach (Green River, UT) requires a separate boat ramp fee. Sand Wash put-in is reached by a 2WD-passable dirt road.',
  true,
  'Several licensed outfitters run guided multi-day Desolation Canyon trips. See outfitters below.',
  true,
  2025
);

-- ─── 7. Cataract Canyon ──────────────────────────────────────────
-- NPS Canyonlands National Park reservation system (not a lottery).
-- 100+ miles from Green River, UT or Moab to Hite Marina, with the
-- big-water Class III–V Cataract section in the middle.
insert into public.river_permits (
  river_id, river_name, state_key,
  permit_name, managing_agency, permit_type, required_for,
  application_opens, application_closes, results_date,
  permit_season_start, permit_season_end,
  group_size_min, group_size_max,
  cost_per_person, cost_per_group,
  apply_url, info_url, phone,
  notes,
  commercial_available, commercial_notes,
  verified, last_verified_year
) values (
  'cataract',
  'Colorado River — Cataract Canyon',
  'ut',
  'Cataract Canyon River Permit',
  'National Park Service — Canyonlands NP',
  'reservation',
  'overnight',
  'Reservations open year-round',
  null,
  null,
  'Year-round',
  'Year-round',
  1,
  40,
  null,
  null,
  'https://www.nps.gov/cany/',
  'https://www.nps.gov/cany/',
  '(435) 259-4351',
  'Reservation-based, not a lottery. Permits become available on a rolling basis and the most popular spring/fall launch dates fill quickly. Cost is a per-person fee plus a non-refundable application fee — current schedule on the NPS site. Trips typically launch from Mineral Bottom (Green River) or Potash (Colorado River) and take out at Hite Marina, 100+ miles downstream. The Cataract Canyon rapids in the middle are Class III–V depending on water level.',
  true,
  'Multiple outfitters run 4–6 day guided Cataract trips, often with jet boat takeout from Hite. See outfitters below.',
  true,
  2025
);

-- ─── 8. Westwater Canyon ─────────────────────────────────────────
-- BLM Moab Field Office reservation system. Short 17-mile run packed
-- with Class III–IV rapids — fills quickly for spring/summer dates.
insert into public.river_permits (
  river_id, river_name, state_key,
  permit_name, managing_agency, permit_type, required_for,
  application_opens, application_closes, results_date,
  permit_season_start, permit_season_end,
  group_size_min, group_size_max,
  cost_per_person, cost_per_group,
  apply_url, info_url, phone,
  notes,
  commercial_available, commercial_notes,
  verified, last_verified_year
) values (
  'westwater',
  'Colorado River — Westwater Canyon',
  'ut',
  'Westwater Canyon River Permit',
  'BLM Moab Field Office',
  'reservation',
  'all_launches',
  'Reservations open 2 months in advance',
  null,
  null,
  'April 1',
  'October 31',
  1,
  25,
  null,
  null,
  'https://www.blm.gov/',
  'https://www.blm.gov/',
  '(435) 259-2100',
  'Reservation-based. Permits open two months in advance and fill within minutes for the popular spring and summer launch dates — set a calendar reminder. Day-trip permits and overnight permits both available. Cost is a per-person fee — current schedule on the BLM site. Seventeen miles of Class III–IV through a striking sandstone canyon with no road access between put-in and take-out.',
  true,
  'Multiple Moab outfitters run guided day and overnight Westwater trips. See outfitters below.',
  true,
  2025
);

-- ─── 9. Green River — Lodore Canyon ──────────────────────────────
-- NPS Dinosaur National Monument — same lottery as Yampa. Lodore
-- launches are typically less competitive than Yampa launches because
-- the Green runs through the full season while the Yampa is
-- snowmelt-dependent.
insert into public.river_permits (
  river_id, river_name, state_key,
  permit_name, managing_agency, permit_type, required_for,
  application_opens, application_closes, results_date,
  permit_season_start, permit_season_end,
  group_size_min, group_size_max,
  cost_per_person, cost_per_group,
  apply_url, info_url, phone,
  notes,
  commercial_available, commercial_notes,
  verified, last_verified_year
) values (
  'green_lodore',
  'Green River — Lodore Canyon',
  'co',
  'Dinosaur NM River Permit — Lodore',
  'National Park Service — Dinosaur National Monument',
  'lottery_standard',
  'overnight',
  'December 1',
  'January 31',
  'Early February',
  'May 1',
  'September 15',
  1,
  25,
  null,
  null,
  'https://www.nps.gov/dino/',
  'https://www.nps.gov/dino/',
  '(970) 374-2468',
  'Lodore launches are part of the same Dinosaur NM lottery as the Yampa. Green River flows through the full season, so Lodore is typically less competitive than Yampa, where the snowmelt window is short. Cost is a per-person/per-night fee — current schedule on the NPS site. Trip is typically 4–5 days from Gates of Lodore put-in to Split Mountain take-out.',
  true,
  'Multiple licensed outfitters run guided multi-day Lodore trips. See outfitters below.',
  true,
  2025
);

-- ─── 10. Illinois River, OR ──────────────────────────────────────
-- Self-issue free permit at the Miami Bar put-in kiosk. Class IV–V
-- expert-only river through the Kalmiopsis Wilderness — short
-- snowmelt window in March–May.
insert into public.river_permits (
  river_id, river_name, state_key,
  permit_name, managing_agency, permit_type, required_for,
  application_opens, application_closes, results_date,
  permit_season_start, permit_season_end,
  group_size_min, group_size_max,
  cost_per_person, cost_per_group,
  apply_url, info_url, phone,
  notes,
  commercial_available, commercial_notes,
  verified, last_verified_year
) values (
  'illinois_or',
  'Illinois River',
  'or',
  'Illinois River Self-Issue Permit',
  'USFS Rogue River-Siskiyou National Forest',
  'self_issue',
  'all_launches',
  null,
  null,
  null,
  'March 1',
  'May 31',
  1,
  null,
  0,
  null,
  null,
  'https://www.fs.usda.gov/',
  '(541) 471-6500',
  'Free self-issue permit at the Miami Bar put-in. Snowmelt-dependent — runnable window is roughly March through May. Class IV–V expert wilderness trip through the Kalmiopsis Wilderness with multiple mandatory portages. No road access for 30+ miles between put-in and take-out. Carry your own SPOT/InReach; cell coverage is non-existent.',
  false,
  null,
  true,
  2025
);

-- ─── 11. Chattooga River — Section IV ────────────────────────────
-- Self-issue permit at trailhead kiosks. Free. Day use only —
-- Section IV runs the GA-SC border through the Chattooga Wild &
-- Scenic corridor.
insert into public.river_permits (
  river_id, river_name, state_key,
  permit_name, managing_agency, permit_type, required_for,
  application_opens, application_closes, results_date,
  permit_season_start, permit_season_end,
  group_size_min, group_size_max,
  cost_per_person, cost_per_group,
  apply_url, info_url, phone,
  notes,
  commercial_available, commercial_notes,
  verified, last_verified_year
) values (
  'chattooga_ga',
  'Chattooga River — Georgia Section',
  'ga',
  'Chattooga Self-Issue Permit',
  'USFS Chattahoochee NF / Sumter NF',
  'self_issue',
  'day_use',
  null,
  null,
  null,
  'Year-round',
  'Year-round',
  1,
  null,
  0,
  null,
  null,
  'https://www.fs.usda.gov/',
  '(706) 754-6221',
  'Free self-issue permit at trailhead kiosks at Earl\u2019s Ford, Sandy Ford, US 76 Bridge, and other access points. Required for all paddlers on Sections III and IV. Section IV (Class III–V) is the most-paddled stretch and includes the Five Falls sequence. The Chattooga is the only river east of the Mississippi designated entirely as Wild & Scenic; private boating only on the upper sections, no commercial outfitters above US 76.',
  true,
  'Commercial outfitters operate on Section III with USFS allocation. Section IV is private-boater only. See outfitters below for Section III guided trips.',
  true,
  2025
);

-- ─── 12. Boundary Waters — Kawishiwi River ───────────────────────
-- USFS Superior National Forest BWCAW quota permit system. Quotas
-- by entry point during the May 1 – Sep 30 quota season; permits
-- available year-round outside that window.
insert into public.river_permits (
  river_id, river_name, state_key,
  permit_name, managing_agency, permit_type, required_for,
  application_opens, application_closes, results_date,
  permit_season_start, permit_season_end,
  group_size_min, group_size_max,
  cost_per_person, cost_per_group,
  apply_url, info_url, phone,
  notes,
  commercial_available, commercial_notes,
  verified, last_verified_year
) values (
  'kawishiwi',
  'Boundary Waters — Kawishiwi River',
  'mn',
  'BWCAW Overnight Quota Permit',
  'USFS Superior National Forest',
  'reservation',
  'overnight',
  'Reservations open late January',
  null,
  null,
  'May 1',
  'September 30',
  1,
  9,
  null,
  null,
  'https://www.recreation.gov/',
  'https://www.fs.usda.gov/',
  '(218) 626-4300',
  'Quota permits required for overnight trips during the May 1 – September 30 quota season. Each BWCAW entry point has its own daily quota; popular entry points (notably Lake One, Snowbank, and Sawbill) book out months in advance for July weekends. Group size limit is 9 people / 4 watercraft. Reservations open in late January for the upcoming season. Cost is a per-person reservation fee plus a per-trip overnight fee — current schedule on the USFS site. Day-use permits are self-issue and free.',
  true,
  'Several outfitters in Ely and Grand Marais provide canoe rentals, food packs, and shuttles for self-guided BWCAW trips. Fully guided wilderness trips also available. See outfitters below.',
  true,
  2025
);
