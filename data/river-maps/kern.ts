import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Kern River (CALIFORNIA) — geometry from USGS NHDPlus HR
// 14 points

export const accessPoints: AccessPoint[] = [
  { name: 'Junction Meadow', lat: 36.58135, lng: -118.41812, type: 'access', description: 'fee' },
  { name: 'Forks of the Kern', lat: 36.13084, lng: -118.43739, type: 'access' },
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
