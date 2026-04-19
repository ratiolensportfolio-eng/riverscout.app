import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Gallatin River (MONTANA) — geometry from USGS NHDPlus HR
// 5 points

export const accessPoints: AccessPoint[] = [
  { name: 'Axtell Bridge', lat: 45.62339, lng: -111.20486, type: 'access', description: 'MT FWP FAS. Hand Launch' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-111.2483, 45.5249],
  [-111.2439, 45.53],
  [-111.2393, 45.5314],
  [-111.2386, 45.5334],
  [-111.2386, 45.5334],
]
