import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Cossatot River (ARKANSAS) — geometry from USGS NHDPlus HR
// 14 points

export const accessPoints: AccessPoint[] = [
  { name: 'Hwy 246 State Park Picnic Area', lat: 34.37960, lng: -94.23682, type: 'access', description: 'Cassatot River State Park — parking: yes' },
  { name: 'Ed Banks Rd', lat: 34.33963, lng: -94.25089, type: 'access', description: 'Cassatot River State Park — parking: yes' },
  { name: 'Hwy 278 Bridge', lat: 34.29588, lng: -94.17602, type: 'access', description: 'Cassatot River State Park — parking: yes' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-94.2066, 34.3926],
  [-94.2097, 34.3913],
  [-94.2113, 34.3928],
  [-94.2113, 34.3928],
  [-94.2132, 34.3936],
  [-94.2154, 34.3901],
  [-94.2207, 34.3873],
  [-94.2266, 34.387],
  [-94.2278, 34.384],
  [-94.2278, 34.3801],
  [-94.2311, 34.3779],
  [-94.2335, 34.3794],
  [-94.2325, 34.3803],
  [-94.2325, 34.3803],
]
