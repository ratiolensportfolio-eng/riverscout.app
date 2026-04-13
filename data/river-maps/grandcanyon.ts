import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Colorado River (AZ) — geometry from USGS NHDPlus HR
// 12 points, 4/200 segments stitched

// Access points snapped to riverPath geometry
// Note: river path has very few points; access points placed at path endpoints
export const accessPoints: AccessPoint[] = []

// River sections
export const sections: RiverSection[] = [
  {
    from: "Lees Ferry",
    to: "Phantom Ranch",
    miles: 88,
    paddleTime: "3\u20135 days",
    class: "I-IV",
    notes: "Upper Grand Canyon. Includes House Rock, Hance, Horn Creek, and Granite rapids. Stunning inner gorge scenery.",
  },
  {
    from: "Phantom Ranch",
    to: "Diamond Creek",
    miles: 138,
    paddleTime: "5\u20138 days",
    class: "III-V",
    notes: "Lower Grand Canyon. Features Lava Falls (Class V), Crystal, and Hermit rapids. 226 total river miles from Lees Ferry.",
  },
]

// River path from USGS NHDPlus High Resolution dataset
export const riverPath: [number, number][] = [
  [-113.8828, 36.0608],
  [-113.8877, 36.0648],
  [-113.8877, 36.0648],
  [-113.8924, 36.0696],
  [-113.895, 36.0758],
  [-113.895, 36.0758],
  [-113.895, 36.0805],
  [-113.895, 36.0805],
  [-113.8944, 36.0859],
  [-113.8959, 36.0906],
  [-113.9025, 36.0929],
  [-113.9025, 36.0929],
]
