import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Kickapoo River (WISCONSIN) — geometry from USGS NHDPlus HR
// 13 points

export const accessPoints: AccessPoint[] = [
  { name: 'Kickapoo Lake', lat: 39.17168, lng: -87.24419, type: 'access', description: 'Indiana Department of Natural Resources' },
  { name: 'Village Park Landing', lat: 43.18223, lng: -90.85819, type: 'access', description: ' ' },
  { name: 'Plum Creek Landing', lat: 43.11448, lng: -90.91266, type: 'access', description: 'Wildlife Biologist' },
  { name: 'Village Park Landing', lat: 43.31975, lng: -90.85105, type: 'access', description: ' ' },
  { name: 'Kickapoo River Landing 7', lat: 43.67260, lng: -90.59422, type: 'access', description: 'Kickapoo Valley Reserve' },
  { name: 'Wildcat Mountain State Park Canoe Launch', lat: 43.69217, lng: -90.58202, type: 'access', description: 'Wildcat Mtn. State Park' },
  { name: 'WAUZEKA BOAT LANDING', lat: 43.08481, lng: -90.87910, type: 'access', description: ' ' },
  { name: 'ONTARIO CANOE LAUNCH', lat: 43.72301, lng: -90.58705, type: 'access', description: 'Village Office' },
  { name: 'KICKAPOO RIVER LANDING 12', lat: 43.63708, lng: -90.60288, type: 'access', description: 'Kickapoo Valley Reserve' },
  { name: 'Kickapoo River Landing 14', lat: 43.62188, lng: -90.62937, type: 'access', description: 'Kickapoo Valley Reserve' },
  { name: 'Kickapoo River Landing 10', lat: 43.64947, lng: -90.59341, type: 'access', description: 'Kickapoo Valley Reserve' },
  { name: 'Village Park Access', lat: 43.39393, lng: -90.77552, type: 'access', description: ' ' },
  { name: 'LA FARGE CANOE LAUNCH', lat: 43.57484, lng: -90.64379, type: 'access', description: 'Village Hall' },
  { name: 'Kickapoo River Landing 4', lat: 43.69775, lng: -90.60262, type: 'access', description: ' ' },
  { name: 'Kickapoo Landing', lat: 43.10103, lng: -90.85858, type: 'access', description: 'Wildlife Biologist' },
  { name: 'KICKAPOO RIVER LANDING 5', lat: 43.68559, lng: -90.59304, type: 'access', description: 'Kickapoo Valley Reserve' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-90.866, 43.2358],
  [-90.8612, 43.233],
  [-90.8531, 43.2325],
  [-90.8513, 43.2338],
  [-90.8495, 43.2318],
  [-90.8477, 43.2332],
  [-90.8446, 43.2325],
  [-90.8446, 43.2325],
  [-90.8468, 43.2299],
  [-90.842, 43.2213],
  [-90.842, 43.2213],
  [-90.8425, 43.2192],
  [-90.8425, 43.2192],
]
