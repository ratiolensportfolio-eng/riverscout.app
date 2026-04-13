import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Deschutes River (OREGON) — geometry from USGS NHDPlus HR
// 6 points

export const accessPoints: AccessPoint[] = [
  { name: 'Warm Springs Access', lat: 44.897, lng: -121.25, type: 'put-in', description: 'BLM access at the top of the Lower Deschutes.' },
  { name: 'Trout Creek', lat: 44.825, lng: -121.154, type: 'access', description: 'Popular day-trip put-in for the Maupin section.' },
  { name: 'Sandy Beach (Maupin)', lat: 45.175, lng: -121.076, type: 'take-out', description: 'Town of Maupin access.' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-121.1234, 45.0813],
  [-121.1276, 45.0851],
  [-121.1272, 45.089],
  [-121.1312, 45.092],
  [-121.1281, 45.0935],
  [-121.1281, 45.0935],
]
