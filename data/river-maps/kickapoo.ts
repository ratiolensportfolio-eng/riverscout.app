import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Kickapoo River (WISCONSIN) — geometry from USGS NHDPlus HR
// 13 points

export const accessPoints: AccessPoint[] = [
  { name: 'Ontario', lat: 43.72, lng: -90.593, type: 'put-in', description: 'Village of Ontario — "Canoe Capital of the Kickapoo." Put-in at the Wildcat Mountain SP access.' },
  { name: 'Rockton', lat: 43.62, lng: -90.629, type: 'access', description: 'Township access.' },
  { name: 'La Farge', lat: 43.572, lng: -90.64, type: 'access', description: 'Kickapoo Valley Reserve trailhead — 8,600 acres of former dam project land now managed for recreation.' },
  { name: 'Viola', lat: 43.506, lng: -90.676, type: 'take-out', description: 'Village of Viola access.' },
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
