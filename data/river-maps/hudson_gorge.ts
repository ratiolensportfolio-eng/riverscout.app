import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Hudson River (NY) — geometry from USGS NHDPlus HR
// 17 points, 4/200 segments stitched

// Access points — TO BE POPULATED with real GPS coordinates
// Research put-in/take-out locations and add them here
export const accessPoints: AccessPoint[] = []

// Sections — TO BE POPULATED with real distances and paddle times
export const sections: RiverSection[] = []

// River path from USGS NHDPlus High Resolution dataset
export const riverPath: [number, number][] = [
  [-74.0687, 43.9526],
  [-74.0822, 43.9523],
  [-74.0822, 43.9523],
  [-74.0816, 43.9556],
  [-74.0816, 43.9556],
  [-74.0816, 43.9567],
  [-74.0867, 43.9567],
  [-74.0867, 43.9567],
  [-74.0937, 43.9586],
  [-74.0903, 43.9616],
  [-74.0886, 43.9599],
  [-74.0861, 43.962],
  [-74.0877, 43.9642],
  [-74.0924, 43.9656],
  [-74.0917, 43.9677],
  [-74.094, 43.9695],
  [-74.094, 43.9695],
]
