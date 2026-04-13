import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Pine Creek (PENNSYLVANIA) — geometry from USGS NHDPlus HR
// 18 points

export const accessPoints: AccessPoint[] = [
  { name: 'Ansonia', lat: 41.735, lng: -77.346, type: 'put-in', description: 'Put-in for the PA Grand Canyon of Pine Creek.' },
  { name: 'Blackwell', lat: 41.569, lng: -77.383, type: 'take-out', description: 'Mid-canyon access at the town of Blackwell.' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-77.4046, 41.5386],
  [-77.4094, 41.5367],
  [-77.4094, 41.5367],
  [-77.4127, 41.5369],
  [-77.4127, 41.5369],
  [-77.4172, 41.5352],
  [-77.4172, 41.5352],
  [-77.4257, 41.5336],
  [-77.4257, 41.5336],
  [-77.4271, 41.5318],
  [-77.4246, 41.5261],
  [-77.4246, 41.5261],
  [-77.4249, 41.5222],
  [-77.4288, 41.5206],
  [-77.4337, 41.5223],
  [-77.4415, 41.5288],
  [-77.4468, 41.5277],
  [-77.4468, 41.5277],
]
