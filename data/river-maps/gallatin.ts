import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Gallatin River (MONTANA) — geometry from USGS NHDPlus HR
// 5 points

export const accessPoints: AccessPoint[] = [
  { name: 'Greek Creek', lat: 45.398, lng: -111.275, type: 'put-in', description: 'USFS access in the Gallatin Canyon south of Big Sky.' },
  { name: 'Missouri Headwaters State Park', lat: 45.927, lng: -111.505, type: 'take-out', description: 'Where the Gallatin meets the Madison and Jefferson to form the Missouri River.' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-111.2483, 45.5249],
  [-111.2439, 45.53],
  [-111.2393, 45.5314],
  [-111.2386, 45.5334],
  [-111.2386, 45.5334],
]
