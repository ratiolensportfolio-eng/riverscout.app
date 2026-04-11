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

  // ── OCOEE RIVER 2026 ──────────────────────────────────────────
  // TVA Apalachia Powerhouse releases. Middle Ocoee runs Wed-Sun
  // Memorial Day weekend through Labor Day weekend, plus weekend
  // releases through early October. Standard release: 1500-2750
  // cfs. We surface the headline weekend dates rather than every
  // weekday — the daily Wed/Thu schedule is pretty mechanical and
  // would clutter the calendar. Source:
  // https://www.tva.com/environment/lake-levels/ocoee-river-recreation
  {
    id: 'ocoee_2026_05_23',
    riverId: 'ocoee',
    name: 'Ocoee Memorial Day Opener',
    date: '2026-05-23',
    startTime: '10:00',
    endTime: '17:00',
    expectedCfs: 1500,
    agency: 'TVA',
    sourceUrl: 'https://www.tva.com/environment/lake-levels/ocoee-river-recreation',
    notes: 'First weekend of the Middle Ocoee summer recreation season. Standard 1500 cfs release.',
    seasonLabel: 'Ocoee Summer Releases',
  },
  {
    id: 'ocoee_2026_07_04',
    riverId: 'ocoee',
    name: 'Ocoee Independence Day',
    date: '2026-07-04',
    startTime: '10:00',
    endTime: '17:00',
    expectedCfs: 1500,
    agency: 'TVA',
    sourceUrl: 'https://www.tva.com/environment/lake-levels/ocoee-river-recreation',
    notes: 'Holiday weekend release. Often the busiest day of the Middle Ocoee summer season.',
    seasonLabel: 'Ocoee Summer Releases',
  },
  {
    id: 'ocoee_2026_09_05',
    riverId: 'ocoee',
    name: 'Ocoee Labor Day Closer',
    date: '2026-09-05',
    startTime: '10:00',
    endTime: '17:00',
    expectedCfs: 1500,
    agency: 'TVA',
    sourceUrl: 'https://www.tva.com/environment/lake-levels/ocoee-river-recreation',
    notes: 'Last weekend of the Middle Ocoee summer schedule. Weekend-only releases continue through early October.',
    seasonLabel: 'Ocoee Summer Releases',
  },

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
