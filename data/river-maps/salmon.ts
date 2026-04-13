import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Salmon River (ID) — geometry from USGS NHDPlus HR
// 15 points, 4/200 segments stitched

// Access points snapped to USGS NHDPlus river geometry (upstream to downstream)
export const accessPoints: AccessPoint[] = []

// Main Salmon River sections
export const sections: RiverSection[] = [
  {
    from: 'Corn Creek',
    to: 'Vinegar Creek',
    miles: 80,
    paddleTime: '5\u20136 days',
    class: 'III-IV',
    notes: 'The "River of No Return" \u2014 premier multi-day wilderness float through the Frank Church Wilderness. Big sandy beaches, hot springs, and Class III-IV rapids including Salmon Falls and Whiplash.',
  },
]

// River path from USGS NHDPlus High Resolution dataset
export const riverPath: [number, number][] = [
  [-113.9157, 45.0291],
  [-113.9173, 45.0335],
  [-113.9173, 45.0335],
  [-113.92, 45.0362],
  [-113.915, 45.0414],
  [-113.915, 45.0414],
  [-113.9145, 45.0456],
  [-113.9145, 45.0456],
  [-113.9155, 45.0497],
  [-113.9139, 45.0544],
  [-113.9214, 45.0603],
  [-113.9206, 45.0625],
  [-113.9145, 45.0654],
  [-113.9168, 45.0697],
  [-113.9168, 45.0697],
]
