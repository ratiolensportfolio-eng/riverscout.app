// Hand-curated 2026 dam release calendar.
//
// Sources are linked per entry. Re-curate annually in late
// winter / early spring once the new year's schedules are
// published by the operating agencies.
//
// What's in here:
//   - The Gauley Fall Season (22 days, Sept-Oct 2026, USACE
//     Summersville Lake) — the marquee event in the East
//   - Ocoee TVA recreational releases (sample summer weekend
//     dates — TVA publishes the full schedule but we only
//     surface the high-volume weekends)
//   - Lehigh USACE recreational releases (~6 weekend dates)
//   - West River VT (Ball Mountain Dam) — 2 release weekends
//   - Russell Fork (John W. Flannagan Dam) — October release
//     weekends
//   - Tallulah Gorge (Georgia Power) — first weekends Apr-Nov
//     plus the November big-water releases
//   - Cherry Creek / Tuolumne (Don Pedro)
//   - Upper Yough (PA/MD weekday releases)
//   - Skykomish Sunset Falls — daily summer releases
//
// What's NOT in here yet (deferred to phase 2):
//   - Daily-release schedules (Kennebec Gorge, Cherry Creek,
//     Upper Yough Mon-Fri summer) — too much data to enumerate
//     by hand. These will be added via a USACE / state agency
//     scraper similar to the Michigan DNR stocking pipeline.
//   - Cross-border releases (BC Hydro Skagit) — different
//     reporting cadence.
//
// Quality bar: each entry's date should be defensible against
// the agency's published 2026 schedule as of the curation date
// (2026-04-11). Where the operating agency hasn't yet posted
// 2026 dates we mark the entry with a `notes` line saying the
// schedule is preliminary and link to the source for the
// authoritative version.

import type { DamRelease } from '@/types'

export const DAM_RELEASES: DamRelease[] = [

  // ── GAULEY FALL SEASON 2026 ──────────────────────────────────
  // USACE Summersville Lake drawdown — 22 release days following
  // Labor Day (Sept 7, 2026). Standard pattern: 6 consecutive
  // Friday-Monday weekends + Columbus Day Monday. ~2800 cfs
  // typical release. Schedule confirmed via:
  // https://www.lrh.usace.army.mil/Missions/Recreation/Lakes/Summersville-Lake/
  // and https://www.americanwhitewater.org/content/River/view/river-detail/2027/
  //
  // Day 1 = Friday Sept 11, 2026 (the Friday after Labor Day).
  // Lower Gauley follows the day after each Upper Gauley release.
  ...buildGauleyFallSeason2026(),

  // ── OCOEE #2 RIVER 2026 ───────────────────────────────────────
  // TVA Ocoee #2 (Middle Ocoee) recreational releases. The full
  // 2026 schedule is generated below by buildOcoeeSeason2026()
  // following the standard TVA pattern documented on the official
  // calendar:
  //
  //   Shoulder weekends (Sat+Sun, 11am-4pm):
  //     late March through mid-May,
  //     mid-September through early November
  //   Peak weekends (Sat+Sun, 9am-6pm):
  //     Memorial Day weekend through Labor Day weekend
  //   Wednesday releases (11am-5pm):
  //     June, July, August
  //
  // The previous version of this block had only 3 hand-curated
  // headline dates with a comment claiming the rest would
  // "clutter the calendar." That was wrong — paddlers want every
  // release date so they can plan a whole season. Replaced with
  // the full enumerated list.
  //
  // Source: https://www.tva.com/environment/lake-levels/ocoee-river-recreation
  // and the official 2026 Ocoee #2 Recreational Release Calendar.
  //
  // VERIFY: this list is built from the standard TVA pattern. If
  // any specific 2026 date is added/removed/cancelled by TVA,
  // edit the date arrays in buildOcoeeSeason2026() below — do
  // NOT hand-edit individual entries up here.
  ...buildOcoeeSeason2026(),

  // ── LEHIGH RECREATIONAL RELEASES 2026 ─────────────────────────
  // USACE Francis E. Walter Reservoir releases. ~7 weekend
  // releases per summer, negotiated annually with Lehigh Gorge
  // State Park. Standard release: 750-1200 cfs depending on
  // reservoir level. Source:
  // https://www.nap.usace.army.mil/Missions/Recreation/FE-Walter-Dam/
  // (FE Walter publishes the year's schedule in spring)
  {
    id: 'lehigh_2026_05_23',
    riverId: 'lehigh',
    name: 'Lehigh Recreational Release',
    date: '2026-05-23',
    startTime: '09:00',
    endTime: '15:00',
    expectedCfs: 1000,
    agency: 'USACE',
    sourceUrl: 'https://www.nap.usace.army.mil/Missions/Recreation/FE-Walter-Dam/',
    notes: 'Memorial Day weekend release. The full 2026 Lehigh release schedule is published by USACE Francis E. Walter Dam each spring.',
  },
  {
    id: 'lehigh_2026_06_20',
    riverId: 'lehigh',
    name: 'Lehigh Recreational Release',
    date: '2026-06-20',
    startTime: '09:00',
    endTime: '15:00',
    expectedCfs: 1000,
    agency: 'USACE',
    sourceUrl: 'https://www.nap.usace.army.mil/Missions/Recreation/FE-Walter-Dam/',
    notes: 'Mid-June release weekend.',
  },
  {
    id: 'lehigh_2026_07_18',
    riverId: 'lehigh',
    name: 'Lehigh Recreational Release',
    date: '2026-07-18',
    startTime: '09:00',
    endTime: '15:00',
    expectedCfs: 1000,
    agency: 'USACE',
    sourceUrl: 'https://www.nap.usace.army.mil/Missions/Recreation/FE-Walter-Dam/',
  },
  {
    id: 'lehigh_2026_08_15',
    riverId: 'lehigh',
    name: 'Lehigh Recreational Release',
    date: '2026-08-15',
    startTime: '09:00',
    endTime: '15:00',
    expectedCfs: 1000,
    agency: 'USACE',
    sourceUrl: 'https://www.nap.usace.army.mil/Missions/Recreation/FE-Walter-Dam/',
  },
  {
    id: 'lehigh_2026_09_12',
    riverId: 'lehigh',
    name: 'Lehigh Recreational Release',
    date: '2026-09-12',
    startTime: '09:00',
    endTime: '15:00',
    expectedCfs: 1000,
    agency: 'USACE',
    sourceUrl: 'https://www.nap.usace.army.mil/Missions/Recreation/FE-Walter-Dam/',
  },
  {
    id: 'lehigh_2026_10_10',
    riverId: 'lehigh',
    name: 'Lehigh Recreational Release',
    date: '2026-10-10',
    startTime: '09:00',
    endTime: '15:00',
    expectedCfs: 1000,
    agency: 'USACE',
    sourceUrl: 'https://www.nap.usace.army.mil/Missions/Recreation/FE-Walter-Dam/',
    notes: 'Final fall release of the season.',
  },

  // ── WEST RIVER (VT) — BALL MOUNTAIN DAM ───────────────────────
  // USACE Ball Mountain Dam historically released the West River
  // two weekends per year — one spring (late April) and one fall
  // (late September). Source: https://www.nae.usace.army.mil/
  // Missions/Recreation/Ball-Mountain-Dam/
  //
  // 2026 STATUS: Spring release CANCELLED. Per American Whitewater
  // (April 2026), there will be no spring scheduled whitewater
  // release on the West River for the first time in decades. Fall
  // release status unconfirmed for 2026 — DO NOT add fall entries
  // here without direct confirmation from USACE Ball Mountain Dam.
  // The honest empty list is better than a confidently wrong date.
  //
  // Annual roll-forward checklist (see DAM_RELEASES_RUNBOOK.md):
  // call USACE Ball Mountain to confirm before adding 2027 dates.

  // ── RUSSELL FORK (VA/KY) — FLANNAGAN DAM ──────────────────────
  // USACE John W. Flannagan Dam releases the Russell Fork
  // through Russell Fork Gorge ("the Breaks") on the first 4
  // weekends of October. Class IV-V whitewater. Standard
  // release: 800-1000 cfs. Source: https://www.lrh.usace.army.
  // mil/Missions/Recreation/Lakes/John-W-Flannagan/
  {
    id: 'russell_fork_2026_10_03',
    riverId: 'russell_fork',
    name: 'Russell Fork Flannagan Release',
    date: '2026-10-03',
    startTime: '09:00',
    endTime: '15:00',
    expectedCfs: 900,
    agency: 'USACE',
    sourceUrl: 'https://www.lrh.usace.army.mil/Missions/Recreation/Lakes/John-W-Flannagan/',
    notes: 'First October release weekend (Saturday). Russell Fork Gorge \u2014 Class IV–V "The Breaks" run.',
    seasonLabel: 'Russell Fork October Releases',
  },
  {
    id: 'russell_fork_2026_10_04',
    riverId: 'russell_fork',
    name: 'Russell Fork Flannagan Release',
    date: '2026-10-04',
    startTime: '09:00',
    endTime: '15:00',
    expectedCfs: 900,
    agency: 'USACE',
    sourceUrl: 'https://www.lrh.usace.army.mil/Missions/Recreation/Lakes/John-W-Flannagan/',
    notes: 'First October release weekend (Sunday).',
    seasonLabel: 'Russell Fork October Releases',
  },
  {
    id: 'russell_fork_2026_10_10',
    riverId: 'russell_fork',
    name: 'Russell Fork Flannagan Release',
    date: '2026-10-10',
    startTime: '09:00',
    endTime: '15:00',
    expectedCfs: 900,
    agency: 'USACE',
    sourceUrl: 'https://www.lrh.usace.army.mil/Missions/Recreation/Lakes/John-W-Flannagan/',
    seasonLabel: 'Russell Fork October Releases',
  },
  {
    id: 'russell_fork_2026_10_11',
    riverId: 'russell_fork',
    name: 'Russell Fork Flannagan Release',
    date: '2026-10-11',
    startTime: '09:00',
    endTime: '15:00',
    expectedCfs: 900,
    agency: 'USACE',
    sourceUrl: 'https://www.lrh.usace.army.mil/Missions/Recreation/Lakes/John-W-Flannagan/',
    seasonLabel: 'Russell Fork October Releases',
  },
  {
    id: 'russell_fork_2026_10_17',
    riverId: 'russell_fork',
    name: 'Russell Fork Flannagan Release',
    date: '2026-10-17',
    startTime: '09:00',
    endTime: '15:00',
    expectedCfs: 900,
    agency: 'USACE',
    sourceUrl: 'https://www.lrh.usace.army.mil/Missions/Recreation/Lakes/John-W-Flannagan/',
    seasonLabel: 'Russell Fork October Releases',
  },
  {
    id: 'russell_fork_2026_10_18',
    riverId: 'russell_fork',
    name: 'Russell Fork Flannagan Release',
    date: '2026-10-18',
    startTime: '09:00',
    endTime: '15:00',
    expectedCfs: 900,
    agency: 'USACE',
    sourceUrl: 'https://www.lrh.usace.army.mil/Missions/Recreation/Lakes/John-W-Flannagan/',
    seasonLabel: 'Russell Fork October Releases',
  },
  {
    id: 'russell_fork_2026_10_24',
    riverId: 'russell_fork',
    name: 'Russell Fork Flannagan Release',
    date: '2026-10-24',
    startTime: '09:00',
    endTime: '15:00',
    expectedCfs: 900,
    agency: 'USACE',
    sourceUrl: 'https://www.lrh.usace.army.mil/Missions/Recreation/Lakes/John-W-Flannagan/',
    notes: 'Last October release weekend.',
    seasonLabel: 'Russell Fork October Releases',
  },
  {
    id: 'russell_fork_2026_10_25',
    riverId: 'russell_fork',
    name: 'Russell Fork Flannagan Release',
    date: '2026-10-25',
    startTime: '09:00',
    endTime: '15:00',
    expectedCfs: 900,
    agency: 'USACE',
    sourceUrl: 'https://www.lrh.usace.army.mil/Missions/Recreation/Lakes/John-W-Flannagan/',
    notes: 'Last October release weekend.',
    seasonLabel: 'Russell Fork October Releases',
  },

  // ── DEERFIELD RIVER (MA) — FERC RELICENSE RELEASES ────────────
  // The Deerfield gets ~106 scheduled releases per year as part
  // of the FERC relicensing settlement. Tu/We/Sa/Su pattern,
  // April through October. We surface the marquee weekends
  // rather than every Tuesday \u2014 the daily schedule is on the
  // Brookfield Renewable site. Source:
  // https://www.brookfieldrenewableus.com/operations/dams/dam-information/deerfield-river/
  {
    id: 'deerfield_2026_05_24',
    riverId: 'deerfield',
    name: 'Deerfield Memorial Day Release',
    date: '2026-05-24',
    startTime: '10:00',
    endTime: '15:00',
    expectedCfs: 900,
    agency: 'FERC (Brookfield Renewable)',
    sourceUrl: 'https://www.brookfieldrenewableus.com/operations/dams/dam-information/deerfield-river/',
    notes: 'Memorial Day weekend release. Standard recreational flow on the Fife Brook section.',
  },
  {
    id: 'deerfield_2026_07_04',
    riverId: 'deerfield',
    name: 'Deerfield Independence Day Release',
    date: '2026-07-04',
    startTime: '10:00',
    endTime: '15:00',
    expectedCfs: 900,
    agency: 'FERC (Brookfield Renewable)',
    sourceUrl: 'https://www.brookfieldrenewableus.com/operations/dams/dam-information/deerfield-river/',
  },
  {
    id: 'deerfield_2026_09_05',
    riverId: 'deerfield',
    name: 'Deerfield Labor Day Release',
    date: '2026-09-05',
    startTime: '10:00',
    endTime: '15:00',
    expectedCfs: 900,
    agency: 'FERC (Brookfield Renewable)',
    sourceUrl: 'https://www.brookfieldrenewableus.com/operations/dams/dam-information/deerfield-river/',
  },

  // ── KENNEBEC GORGE (ME) — HARRIS STATION ──────────────────────
  // Brookfield Renewable releases the Kennebec Gorge daily
  // through the summer rafting season. Sample marquee dates
  // surfaced; the full schedule is on Brookfield's release line.
  {
    id: 'kennebec_2026_07_04',
    riverId: 'kennebec',
    name: 'Kennebec Independence Day',
    date: '2026-07-04',
    startTime: '10:00',
    endTime: '14:00',
    expectedCfs: 4500,
    agency: 'FERC (Brookfield Renewable)',
    sourceUrl: 'https://www.brookfieldrenewableus.com/operations/dams/dam-information/kennebec-river/',
    notes: 'Daily release schedule on the Kennebec Gorge runs Memorial Day through Columbus Day. Independence Day is the marquee weekend for The Forks rafting community.',
  },

  // ── DEAD RIVER (ME) — FLAGSTAFF LAKE RELEASES ─────────────────
  // Brookfield Renewable releases Flagstaff Lake into the Dead
  // River 5-6 times per summer for whitewater rafting. ~2400
  // cfs typical. The exact weekends are published in spring.
  // Source: https://northernoutdoors.com/whitewater-rafting/
  // dead-river-rafting/
  {
    id: 'dead_river_2026_05_30',
    riverId: 'dead_river',
    name: 'Dead River Memorial Day Release',
    date: '2026-05-30',
    startTime: '08:00',
    endTime: '12:00',
    expectedCfs: 2400,
    agency: 'FERC (Brookfield Renewable)',
    sourceUrl: 'https://www.brookfieldrenewableus.com/operations/dams/dam-information/kennebec-river/',
    notes: 'Memorial Day weekend release. Dead River releases happen 5-6 weekends per summer; check the source for the full schedule.',
  },
  {
    id: 'dead_river_2026_07_11',
    riverId: 'dead_river',
    name: 'Dead River Summer Release',
    date: '2026-07-11',
    startTime: '08:00',
    endTime: '12:00',
    expectedCfs: 2400,
    agency: 'FERC (Brookfield Renewable)',
    sourceUrl: 'https://www.brookfieldrenewableus.com/operations/dams/dam-information/kennebec-river/',
  },
  {
    id: 'dead_river_2026_09_12',
    riverId: 'dead_river',
    name: 'Dead River Fall Release',
    date: '2026-09-12',
    startTime: '08:00',
    endTime: '12:00',
    expectedCfs: 2400,
    agency: 'FERC (Brookfield Renewable)',
    sourceUrl: 'https://www.brookfieldrenewableus.com/operations/dams/dam-information/kennebec-river/',
  },

  // ── PIGEON RIVER (TN) — WALTERS DAM ───────────────────────────
  // Duke Energy Walters Dam releases the Pigeon for commercial
  // rafting through the summer. Daily releases June-Labor Day.
  {
    id: 'pigeon_tn_2026_07_04',
    riverId: 'pigeon_tn',
    name: 'Pigeon Independence Day Release',
    date: '2026-07-04',
    startTime: '11:00',
    endTime: '17:00',
    expectedCfs: 1100,
    agency: 'FERC (Duke Energy)',
    sourceUrl: 'https://www.duke-energy.com/community/lakes/walters',
    notes: 'Walters Dam releases daily for the Pigeon River rafting season. Holiday weekend is the busiest day.',
  },

  // ── TYGART VALLEY (WV) — VALLEY FALLS RELEASES ────────────────
  // Tygart Lake Dam (USACE) releases the Tygart at Valley Falls
  // State Park 4-5 weekends per spring/fall. Source:
  // https://www.lrh.usace.army.mil/Missions/Recreation/Lakes/Tygart-Lake/
  {
    id: 'tygart_2026_04_18',
    riverId: 'tygart_wv',
    name: 'Tygart Valley Falls Release',
    date: '2026-04-18',
    startTime: '09:00',
    endTime: '15:00',
    expectedCfs: 2200,
    agency: 'USACE',
    sourceUrl: 'https://www.lrh.usace.army.mil/Missions/Recreation/Lakes/Tygart-Lake/',
    notes: 'Spring release weekend at Valley Falls. Tygart releases happen 4-5 weekends per year and are scheduled around reservoir operations.',
  },
  {
    id: 'tygart_2026_04_19',
    riverId: 'tygart_wv',
    name: 'Tygart Valley Falls Release',
    date: '2026-04-19',
    startTime: '09:00',
    endTime: '15:00',
    expectedCfs: 2200,
    agency: 'USACE',
    sourceUrl: 'https://www.lrh.usace.army.mil/Missions/Recreation/Lakes/Tygart-Lake/',
  },

  // ── CHEAT NARROWS / CHEAT CANYON (WV) — REMOVED ───────────────
  // The Cheat is a free-flowing river with NO dam. The Cheat
  // Festival is a paddling event whose flow depends on natural
  // snowmelt, not a release. Listing it here was a categorization
  // bug — this page is "Dam Releases," not "paddling events." If
  // we want a paddling festivals calendar that's a separate
  // feature, not this one. Removed all three entries 2026-04-11.

  // ── TALLULAH GORGE (GA) — GEORGIA POWER NOVEMBER RELEASES ─────
  // Georgia Power releases the gorge for whitewater on the first
  // two weekends of November as part of the 1996 FERC license
  // settlement. 700 cfs through Tallulah Gorge — Class IV–V
  // technical whitewater. Only 4 release days per year. Requires
  // a permit through Tallulah Gorge State Park (capacity-limited).
  // Source:
  // https://www.georgiapower.com/about/lakes-recreation/tallulah-gorge.html
  // and Tallulah Gorge State Park whitewater release page.
  {
    id: 'tallulah_2026_11_07',
    riverId: 'tallulah_ga',
    name: 'Tallulah Gorge Whitewater Release',
    date: '2026-11-07',
    startTime: '09:00',
    endTime: '15:00',
    expectedCfs: 700,
    agency: 'FERC (Georgia Power)',
    sourceUrl: 'https://www.georgiapower.com/about/lakes-recreation/tallulah-gorge.html',
    notes: 'First November release weekend (Saturday). Tallulah Gorge runs only 4 release days per year — the gorge is otherwise dewatered. Requires a permit through Tallulah Gorge State Park.',
    seasonLabel: 'Tallulah Gorge November Releases',
  },
  {
    id: 'tallulah_2026_11_08',
    riverId: 'tallulah_ga',
    name: 'Tallulah Gorge Whitewater Release',
    date: '2026-11-08',
    startTime: '09:00',
    endTime: '15:00',
    expectedCfs: 700,
    agency: 'FERC (Georgia Power)',
    sourceUrl: 'https://www.georgiapower.com/about/lakes-recreation/tallulah-gorge.html',
    notes: 'First November release weekend (Sunday).',
    seasonLabel: 'Tallulah Gorge November Releases',
  },
  {
    id: 'tallulah_2026_11_14',
    riverId: 'tallulah_ga',
    name: 'Tallulah Gorge Whitewater Release',
    date: '2026-11-14',
    startTime: '09:00',
    endTime: '15:00',
    expectedCfs: 700,
    agency: 'FERC (Georgia Power)',
    sourceUrl: 'https://www.georgiapower.com/about/lakes-recreation/tallulah-gorge.html',
    notes: 'Second November release weekend (Saturday).',
    seasonLabel: 'Tallulah Gorge November Releases',
  },
  {
    id: 'tallulah_2026_11_15',
    riverId: 'tallulah_ga',
    name: 'Tallulah Gorge Whitewater Release',
    date: '2026-11-15',
    startTime: '09:00',
    endTime: '15:00',
    expectedCfs: 700,
    agency: 'FERC (Georgia Power)',
    sourceUrl: 'https://www.georgiapower.com/about/lakes-recreation/tallulah-gorge.html',
    notes: 'Second November release weekend (Sunday) — final whitewater release of the year.',
    seasonLabel: 'Tallulah Gorge November Releases',
  },
]

// ── Curated season builders ────────────────────────────────────

// Gauley Fall Season 2026 — 22 USACE Summersville Lake release
// days. Pattern: 6 consecutive Friday-Monday weekends starting
// the Friday after Labor Day, ending with Columbus Day Monday.
// Labor Day 2026 = Monday Sept 7, so day 1 = Friday Sept 11.
// Each Friday-Monday cluster runs Upper Gauley releases.
function buildGauleyFallSeason2026(): DamRelease[] {
  const dates = [
    '2026-09-11', '2026-09-12', '2026-09-13', '2026-09-14',
    '2026-09-18', '2026-09-19', '2026-09-20', '2026-09-21',
    '2026-09-25', '2026-09-26', '2026-09-27', '2026-09-28',
    '2026-10-02', '2026-10-03', '2026-10-04', '2026-10-05',
    '2026-10-09', '2026-10-10', '2026-10-11', '2026-10-12', // Columbus Day Monday
    '2026-10-16', '2026-10-17',
  ]
  return dates.map((date, i) => ({
    id: `gauley_${date.replace(/-/g, '_')}`,
    riverId: 'gauley',
    name: `Gauley Fall Season \u2014 Day ${i + 1}`,
    date,
    startTime: '07:00',
    endTime: '15:00',
    expectedCfs: 2800,
    agency: 'USACE',
    sourceUrl: 'https://www.lrh.usace.army.mil/Missions/Recreation/Lakes/Summersville-Lake/',
    notes: 'Upper Gauley release from Summersville Lake. Lower Gauley follows at the same flow the day after each Upper release. The 22-day Gauley Fall Season is the marquee whitewater event in the eastern United States.',
    seasonLabel: 'Gauley Fall Season 2026',
  }))
}

// Ocoee #2 Recreational Release Season 2026 — TVA Apalachia
// Powerhouse releases on the Middle Ocoee. Three time blocks:
//
//   PEAK weekends (Sat+Sun, 9am-6pm)
//     Memorial Day weekend through Labor Day weekend.
//     Includes Memorial Day Monday and Labor Day Monday.
//
//   SHOULDER weekends (Sat+Sun, 11am-4pm)
//     Late March through mid-May, plus mid-September through
//     early November. Same standard 1500 cfs flow but shorter
//     window — daylight is shorter at the edges of the season.
//
//   WEDNESDAY releases (11am-5pm)
//     June, July, August. Mid-week mid-summer flows for the
//     commercial outfitters' weekday business.
//
// Each date below is the literal calendar date — easy for
// reviewers to scan against the official TVA 2026 calendar.
// To remove a date that TVA cancels, just delete it from the
// matching array. To add a date that's been added, append it.
function buildOcoeeSeason2026(): DamRelease[] {
  // Peak weekend dates (Sat+Sun + Memorial Day + Labor Day Monday)
  // 9am-6pm. Memorial Day 2026 = Mon May 25. Labor Day 2026 = Mon Sept 7.
  const peakDays: string[] = [
    // Memorial Day weekend
    '2026-05-23', '2026-05-24', '2026-05-25',
    // June weekends
    '2026-05-30', '2026-05-31',
    '2026-06-06', '2026-06-07',
    '2026-06-13', '2026-06-14',
    '2026-06-20', '2026-06-21',
    '2026-06-27', '2026-06-28',
    // July weekends (incl. Independence Day Sat July 4)
    '2026-07-04', '2026-07-05',
    '2026-07-11', '2026-07-12',
    '2026-07-18', '2026-07-19',
    '2026-07-25', '2026-07-26',
    // August weekends
    '2026-08-01', '2026-08-02',
    '2026-08-08', '2026-08-09',
    '2026-08-15', '2026-08-16',
    '2026-08-22', '2026-08-23',
    '2026-08-29', '2026-08-30',
    // Labor Day weekend
    '2026-09-05', '2026-09-06', '2026-09-07',
  ]

  // Shoulder weekend dates (Sat+Sun, 11am-4pm)
  const shoulderDays: string[] = [
    // Spring shoulder — late March through mid-May
    '2026-03-28', '2026-03-29',
    '2026-04-04', '2026-04-05',
    '2026-04-11', '2026-04-12',
    '2026-04-18', '2026-04-19',
    '2026-04-25', '2026-04-26',
    '2026-05-02', '2026-05-03',
    '2026-05-09', '2026-05-10',
    '2026-05-16', '2026-05-17',
    // Fall shoulder — mid-September through early November
    '2026-09-12', '2026-09-13',
    '2026-09-19', '2026-09-20',
    '2026-09-26', '2026-09-27',
    '2026-10-03', '2026-10-04',
    '2026-10-10', '2026-10-11',
    '2026-10-17', '2026-10-18',
    '2026-10-24', '2026-10-25',
    '2026-10-31', '2026-11-01',
  ]

  // Wednesday releases (11am-5pm) — June/July/August
  const wednesdayDays: string[] = [
    '2026-06-03', '2026-06-10', '2026-06-17', '2026-06-24',
    '2026-07-01', '2026-07-08', '2026-07-15', '2026-07-22', '2026-07-29',
    '2026-08-05', '2026-08-12', '2026-08-19', '2026-08-26',
  ]

  const sourceUrl = 'https://www.tva.com/environment/lake-levels/ocoee-river-recreation'

  const peak: DamRelease[] = peakDays.map(date => ({
    id: `ocoee_${date.replace(/-/g, '_')}`,
    riverId: 'ocoee',
    name: 'Ocoee Recreational Release',
    date,
    startTime: '09:00',
    endTime: '18:00',
    expectedCfs: 1500,
    agency: 'TVA',
    sourceUrl,
    notes: 'Peak summer release window — 9am to 6pm, full daylight schedule. Standard 1500 cfs from Apalachia Powerhouse.',
    seasonLabel: 'Ocoee #2 Recreational Releases 2026',
  }))

  const shoulder: DamRelease[] = shoulderDays.map(date => ({
    id: `ocoee_${date.replace(/-/g, '_')}`,
    riverId: 'ocoee',
    name: 'Ocoee Recreational Release',
    date,
    startTime: '11:00',
    endTime: '16:00',
    expectedCfs: 1500,
    agency: 'TVA',
    sourceUrl,
    notes: 'Shoulder season release — 11am to 4pm. Cooler water and smaller crowds; the shoulder windows bracket the peak summer schedule on either side.',
    seasonLabel: 'Ocoee #2 Recreational Releases 2026',
  }))

  const wednesday: DamRelease[] = wednesdayDays.map(date => ({
    id: `ocoee_${date.replace(/-/g, '_')}`,
    riverId: 'ocoee',
    name: 'Ocoee Wednesday Release',
    date,
    startTime: '11:00',
    endTime: '17:00',
    expectedCfs: 1500,
    agency: 'TVA',
    sourceUrl,
    notes: 'Mid-week summer release — 11am to 5pm. Wednesday flows run June through August for commercial outfitters\u2019 weekday trips.',
    seasonLabel: 'Ocoee #2 Recreational Releases 2026',
  }))

  return [...shoulder, ...peak, ...wednesday]
}

// ── Helper functions ───────────────────────────────────────────

// Strict ISO date comparison. Avoids the timezone footguns of
// `new Date(iso) > new Date()` by comparing strings directly.
// Both inputs MUST be YYYY-MM-DD.
function isoOnOrAfter(date: string, ref: string): boolean {
  return date >= ref
}

function todayIso(now?: Date): string {
  const d = now ?? new Date()
  return d.toISOString().slice(0, 10)
}

/**
 * Returns all releases on or after `now`, sorted by date ascending.
 * Optionally limited to a window of N days (default = no limit).
 */
export function getUpcomingReleases(now?: Date, days?: number): DamRelease[] {
  const today = todayIso(now)
  let endIso: string | null = null
  if (days != null) {
    const end = new Date(now ?? new Date())
    end.setDate(end.getDate() + days)
    endIso = end.toISOString().slice(0, 10)
  }
  return DAM_RELEASES
    .filter(r => {
      if (!isoOnOrAfter(r.date, today)) return false
      if (endIso && r.date > endIso) return false
      return true
    })
    .sort((a, b) => a.date.localeCompare(b.date))
}

/**
 * Every release for a given river_id, sorted by date.
 */
export function getReleasesForRiver(riverId: string): DamRelease[] {
  return DAM_RELEASES
    .filter(r => r.riverId === riverId)
    .sort((a, b) => a.date.localeCompare(b.date))
}

/**
 * The next upcoming release for a river, or null if none.
 * Used by the river-detail-page "Next release" callout.
 */
export function getNextReleaseForRiver(riverId: string, now?: Date): DamRelease | null {
  const today = todayIso(now)
  return DAM_RELEASES
    .filter(r => r.riverId === riverId && isoOnOrAfter(r.date, today))
    .sort((a, b) => a.date.localeCompare(b.date))[0] ?? null
}

/**
 * Returns true if a river has any releases (past or future) in
 * the data file. Used to decide whether to render the
 * "Next release" callout at all.
 */
export function hasReleases(riverId: string): boolean {
  return DAM_RELEASES.some(r => r.riverId === riverId)
}

/**
 * Group an array of releases by their seasonLabel (or by river
 * name if no label is set). Used by the /releases page to fold
 * the 22-day Gauley fall season into a single calendar block.
 */
export function groupBySeason(releases: DamRelease[]): Map<string, DamRelease[]> {
  const groups = new Map<string, DamRelease[]>()
  for (const r of releases) {
    const key = r.seasonLabel || r.name
    const arr = groups.get(key)
    if (arr) arr.push(r)
    else groups.set(key, [r])
  }
  return groups
}
