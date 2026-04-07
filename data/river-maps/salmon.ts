import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Salmon River (ID) — geometry from USGS NHDPlus HR
// 15 points, 4/200 segments stitched

// Access points — TO BE POPULATED with real GPS coordinates
// Research put-in/take-out locations and add them here
export const accessPoints: AccessPoint[] = []

// Sections — TO BE POPULATED with real distances and paddle times
export const sections: RiverSection[] = []

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
