import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Colorado River (AZ) — geometry from USGS NHDPlus HR
// 12 points, 4/200 segments stitched

// Access points — TO BE POPULATED with real GPS coordinates
// Research put-in/take-out locations and add them here
export const accessPoints: AccessPoint[] = []

// Sections — TO BE POPULATED with real distances and paddle times
export const sections: RiverSection[] = []

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
