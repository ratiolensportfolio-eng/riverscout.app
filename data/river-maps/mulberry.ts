import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Mulberry River (ARKANSAS) — geometry from USGS NHDPlus HR
// 12 points

export const accessPoints: AccessPoint[] = [
  { name: 'Headwaters', lat: 35.68543, lng: -93.45434, type: 'access', description: 'Ozark-St. Francis National Forest' },
  { name: 'Wolf Pen', lat: 35.67452, lng: -93.63154, type: 'access', description: 'Ozark-St. Francis National Forest — restrooms, fee' },
  { name: 'Highbank', lat: 35.67881, lng: -93.68905, type: 'access', description: 'Ozark-St. Francis National Forest' },
  { name: 'Indian Creek', lat: 35.68400, lng: -93.71123, type: 'access', description: 'Ozark-St. Francis National Forest' },
  { name: 'Redding', lat: 35.68156, lng: -93.78704, type: 'access', description: 'Ozark-St. Francis National Forest — restrooms, parking: overnight, fee' },
  { name: 'Turner Bend', lat: 35.66939, lng: -93.82847, type: 'access', description: 'Ozark-St. Francis National Forest — restrooms, parking: overnight' },
  { name: 'Big Eddy', lat: 35.65631, lng: -93.85894, type: 'access', description: 'Ozark-St. Francis National Forest — parking: overnight' },
  { name: 'Campbell Cemetery', lat: 35.62343, lng: -93.91088, type: 'access', description: 'Ozark-St. Francis National Forest — parking: overnight' },
  { name: 'Forest Boundary', lat: 35.57460, lng: -94.01741, type: 'access', description: 'Ozark-St. Francis National Forest' },
  { name: 'Wire Rd', lat: 35.53044, lng: -94.04094, type: 'access', description: 'Outside Forest Boundary' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-93.4336, 35.7091],
  [-93.4348, 35.7071],
  [-93.4337, 35.7049],
  [-93.4359, 35.7037],
  [-93.4336, 35.7019],
  [-93.4352, 35.7019],
  [-93.4355, 35.7002],
  [-93.4355, 35.7002],
  [-93.4356, 35.6982],
  [-93.4392, 35.6945],
  [-93.439, 35.692],
  [-93.439, 35.692],
]
