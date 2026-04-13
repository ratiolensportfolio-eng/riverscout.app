import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Tuolumne River (CALIFORNIA) — geometry from USGS NHDPlus HR
// 5 points

export const accessPoints: AccessPoint[] = [
  { name: 'Meral\'s Pool', lat: 37.834, lng: -120.047, type: 'put-in', description: 'Classic Tuolumne put-in.' },
  { name: 'Ward\'s Ferry', lat: 37.808, lng: -120.263, type: 'take-out', description: 'Standard take-out for the Tuolumne.' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-120.466, 37.6664],
  [-120.4762, 37.667],
  [-120.4804, 37.6654],
  [-120.4821, 37.6626],
  [-120.4821, 37.6626],
]
