import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Tuolumne River (CALIFORNIA) — geometry from USGS NHDPlus HR
// 5 points

export const accessPoints: AccessPoint[] = [
  { name: 'Merals Pool', lat: 37.83646, lng: -120.05347, type: 'access', description: 'Stanislaus National Forest — restrooms, parking: overnight' },
  { name: 'Cherry Creek', lat: 37.89522, lng: -119.97134, type: 'access', description: 'Stanislaus National Forest — parking: overnight' },
  { name: 'Wards Ferry', lat: 37.87804, lng: -120.29417, type: 'access', description: 'Mother Lode Field Office, BLM — restrooms, parking: overnight' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-120.466, 37.6664],
  [-120.4762, 37.667],
  [-120.4804, 37.6654],
  [-120.4821, 37.6626],
  [-120.4821, 37.6626],
]
