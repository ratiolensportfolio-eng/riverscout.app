import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Current River (MO) — geometry from USGS NHDPlus HR
// 39 points, 14/200 segments stitched

// Access points — TO BE POPULATED with real GPS coordinates
// Research put-in/take-out locations and add them here
export const accessPoints: AccessPoint[] = []

// Sections — TO BE POPULATED with real distances and paddle times
export const sections: RiverSection[] = []

// River path from USGS NHDPlus High Resolution dataset
export const riverPath: [number, number][] = [
  [-91.6561, 37.4409],
  [-91.6581, 37.4356],
  [-91.6549, 37.4352],
  [-91.6522, 37.4369],
  [-91.6522, 37.4369],
  [-91.6491, 37.4382],
  [-91.647, 37.4362],
  [-91.6477, 37.4307],
  [-91.6496, 37.4291],
  [-91.6496, 37.4291],
  [-91.6504, 37.426],
  [-91.6464, 37.4217],
  [-91.6464, 37.4217],
  [-91.6458, 37.421],
  [-91.6458, 37.421],
  [-91.6438, 37.4204],
  [-91.6438, 37.4204],
  [-91.642, 37.4226],
  [-91.642, 37.4226],
  [-91.6415, 37.4234],
  [-91.6415, 37.4234],
  [-91.6439, 37.4271],
  [-91.6439, 37.4271],
  [-91.6428, 37.428],
  [-91.6428, 37.428],
  [-91.6325, 37.4279],
  [-91.63, 37.4322],
  [-91.6308, 37.4353],
  [-91.6308, 37.4353],
  [-91.6298, 37.4368],
  [-91.6239, 37.4377],
  [-91.621, 37.4371],
  [-91.6201, 37.4372],
  [-91.6201, 37.4372],
  [-91.6155, 37.434],
  [-91.6144, 37.4311],
  [-91.6144, 37.4311],
  [-91.6145, 37.4294],
  [-91.6145, 37.4294],
]
