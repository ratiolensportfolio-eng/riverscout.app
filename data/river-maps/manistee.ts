import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Manistee River (MICHIGAN) — geometry from USGS NHDPlus HR.
//
// COVERAGE NOTE: the 80-point NHDPlus extraction below only
// covers ~9 miles of the river around Cadillac, which is a tiny
// fraction of the actual paddleable extent. The Manistee is
// paddleable for ~190 miles from M-72 / M-66 area down to Lake
// Michigan, and the user flagged the visualization as too short.
//
// As a stopgap I've prepended ~12 hand-placed waypoints that
// trace the upper Manistee from M-66 Boat Launch (the upstream
// snap point the user identified, near Sharon, MI) westward to
// the start of the original NHDPlus extraction. These are
// approximations — the river meanders much more than the
// straight segments here suggest, and I do not have NHDPlus data
// for the upper river to do better. The visualization will look
// roughly straight in this stretch but will correctly indicate
// the upstream water as paddleable.
//
// TODO: replace the upstream extension with a full NHDPlus HR
// extraction from headwaters to mouth. Same for the downstream
// extension below Cadillac to Tippy Dam tailwaters and on to
// Manistee Lake.
//
// M-66 Boat Launch: approximately 44.4915, -85.2278.

export const accessPoints: AccessPoint[] = [
  { name: 'M-72 Bridge', lat: 44.592, lng: -85.051, type: 'put-in', description: 'Upper Manistee access near the headwaters.' },
  { name: 'CCC Bridge', lat: 44.541, lng: -85.182, type: 'access', description: 'USFS bridge crossing.' },
  { name: 'M-66 Boat Launch', lat: 44.4915, lng: -85.2278, type: 'access', description: 'Major USFS access on the upper-middle Manistee.' },
  { name: 'High Bridge', lat: 44.452, lng: -85.525, type: 'campsite', description: 'USFS campground right at the access — first come first served, 16 sites.' },
  { name: 'Red Bridge', lat: 44.42, lng: -85.66, type: 'access', description: 'USFS access above Hodenpyl Dam Pond.' },
  { name: 'Tippy Dam', lat: 44.239, lng: -85.9322, type: 'take-out', description: 'THE steelhead and salmon fishing spot in Michigan.' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  // ── Upstream extension to M-66 Boat Launch (approximated) ──
  [-85.2278, 44.4915], // M-66 Boat Launch (snap point)
  [-85.2620, 44.4880],
  [-85.3000, 44.4920],
  [-85.3450, 44.4950],
  [-85.3900, 44.4880],
  [-85.4350, 44.4790],
  [-85.4800, 44.4700],
  [-85.5250, 44.4620],
  [-85.5650, 44.4520],
  [-85.6000, 44.4450],
  [-85.6350, 44.4400],
  [-85.6600, 44.4360],
  // ── Original NHDPlus HR extraction (Cadillac area, ~9 mi) ──
  [-85.6772, 44.4318],
  [-85.6808, 44.4333],
  [-85.6805, 44.4355],
  [-85.6843, 44.435],
  [-85.6863, 44.437],
  [-85.6906, 44.4372],
  [-85.6939, 44.435],
  [-85.6972, 44.4361],
  [-85.6972, 44.4361],
  [-85.6998, 44.437],
  [-85.6998, 44.437],
  [-85.7074, 44.4375],
  [-85.7074, 44.4375],
  [-85.7103, 44.4335],
  [-85.7103, 44.4335],
  [-85.7095, 44.4303],
  [-85.7049, 44.4299],
  [-85.706, 44.4282],
  [-85.706, 44.4282],
  [-85.7085, 44.4292],
  [-85.707, 44.4254],
  [-85.7099, 44.4242],
  [-85.7118, 44.4234],
  [-85.7134, 44.423],
  [-85.7134, 44.423],
  [-85.7187, 44.4219],
  [-85.7187, 44.4219],
  [-85.7195, 44.4208],
  [-85.7195, 44.4208],
  [-85.7204, 44.42],
  [-85.7204, 44.42],
  [-85.7207, 44.4191],
  [-85.7207, 44.4191],
  [-85.7214, 44.4181],
  [-85.7214, 44.4181],
  [-85.7208, 44.4149],
  [-85.7208, 44.4149],
  [-85.7214, 44.4144],
  [-85.7214, 44.4144],
  [-85.7226, 44.4139],
  [-85.7226, 44.4139],
  [-85.7265, 44.4153],
  [-85.7265, 44.4153],
  [-85.7292, 44.4159],
  [-85.7292, 44.4159],
  [-85.7322, 44.4099],
  [-85.7322, 44.4099],
  [-85.7345, 44.4091],
  [-85.7345, 44.4091],
  [-85.7308, 44.4033],
  [-85.7308, 44.4031],
  [-85.7305, 44.4011],
  [-85.7305, 44.4011],
  [-85.7386, 44.3992],
  [-85.7454, 44.4026],
  [-85.7454, 44.4026],
  [-85.7486, 44.3979],
  [-85.7472, 44.3957],
  [-85.7472, 44.3957],
  [-85.7508, 44.3924],
  [-85.7582, 44.3929],
  [-85.7627, 44.3913],
  [-85.7627, 44.3913],
  [-85.7665, 44.3859],
  [-85.7665, 44.3859],
  [-85.7718, 44.3825],
  [-85.774, 44.3777],
  [-85.774, 44.3777],
  [-85.7967, 44.3706],
  [-85.7967, 44.3706],
  [-85.8094, 44.3726],
  [-85.8161, 44.3713],
  [-85.8161, 44.3713],
  [-85.8174, 44.368],
  [-85.8157, 44.3643],
  [-85.8157, 44.3643],
  [-85.8166, 44.363],
  [-85.8166, 44.363],
  [-85.8199, 44.3625],
  [-85.8199, 44.3625],
  // ── Downstream extension to Lake Michigan (approximated) ──
  // Hand-placed waypoints tracing the lower Manistee from the
  // end of the NHDPlus extraction down through Hodenpyl Pond,
  // Tippy Dam, the lower river canyon (Wellston / High Bridge /
  // Bear Creek confluence), Manistee Lake, and out to Lake
  // Michigan at the city of Manistee. Same caveats as the
  // upstream extension above: these are approximations and the
  // visualization will look straighter than the actual
  // meandering river. Replace with a full NHDPlus HR extraction
  // when the data work happens.
  //
  // Key landmarks the waypoints try to hit:
  //   Hodenpyl Dam Pond — ~44.358, -85.901
  //   Tippy Dam         — ~44.239, -85.932 (fishing capital
  //                       of MI for steelhead and chinook)
  //   High Bridge area  — ~44.247, -85.985
  //   Bear Creek mouth  — ~44.249, -86.040
  //   Manistee Lake     — ~44.250, -86.320
  //   Lake Michigan     — ~44.255, -86.343 (city of Manistee)
  [-85.8400, 44.3600],
  [-85.8600, 44.3585],
  [-85.8800, 44.3590],
  [-85.8950, 44.3600], // Hodenpyl Pond approach
  [-85.9011, 44.3580], // Hodenpyl Dam
  [-85.9050, 44.3450],
  [-85.9100, 44.3300],
  [-85.9150, 44.3100],
  [-85.9200, 44.2900],
  [-85.9270, 44.2700],
  [-85.9322, 44.2500],
  [-85.9322, 44.2392], // Tippy Dam
  [-85.9500, 44.2410], // Below Tippy
  [-85.9700, 44.2440],
  [-85.9850, 44.2470], // High Bridge area
  [-86.0100, 44.2485],
  [-86.0400, 44.2490], // Bear Creek confluence
  [-86.0700, 44.2500],
  [-86.1000, 44.2495],
  [-86.1300, 44.2490],
  [-86.1600, 44.2485],
  [-86.1900, 44.2485],
  [-86.2200, 44.2490],
  [-86.2500, 44.2495],
  [-86.2800, 44.2497], // Manistee Lake (north end)
  [-86.3050, 44.2510], // Through Manistee Lake
  [-86.3200, 44.2535],
  [-86.3350, 44.2547], // Lake Michigan mouth (city of Manistee)
]
