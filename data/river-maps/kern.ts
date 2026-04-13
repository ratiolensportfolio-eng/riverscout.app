import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Kern River (CALIFORNIA) — geometry from USGS NHDPlus HR
// 14 points

export const accessPoints: AccessPoint[] = [
  { name: 'Johnsondale Bridge', lat: 35.967, lng: -118.538, type: 'put-in', description: 'Upper Kern put-in — Class IV-V.' },
  { name: 'Riverside Park (Kernville)', lat: 35.755, lng: -118.425, type: 'take-out', description: 'Town of Kernville access.' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-118.4801, 35.9664],
  [-118.4801, 35.9658],
  [-118.4801, 35.9658],
  [-118.4809, 35.9655],
  [-118.4809, 35.9655],
  [-118.4816, 35.964],
  [-118.4771, 35.9622],
  [-118.4774, 35.958],
  [-118.4774, 35.958],
  [-118.4811, 35.9586],
  [-118.4825, 35.956],
  [-118.4825, 35.956],
  [-118.4829, 35.9537],
  [-118.4829, 35.9537],
]
