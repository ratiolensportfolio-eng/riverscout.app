import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Blue River (INDIANA) — geometry from USGS NHDPlus HR
// 11 points

export const accessPoints: AccessPoint[] = [
  { name: 'Base of Green Mountain Reservoir Dam', lat: 39.88321, lng: -106.33649, type: 'access', description: 'Bureau of Reclamation — parking: yes' },
  { name: 'Spring Creek Road (Take out only)', lat: 39.92231, lng: -106.34816, type: 'access', description: 'Private, Take out only — parking: yes' },
  { name: 'Stage Stop Campground', lat: 38.21509, lng: -86.27003, type: 'access', description: 'Indiana Department of Natural Resources' },
  { name: 'Rothrock Mill', lat: 38.27251, lng: -86.27441, type: 'access', description: 'Indiana Department of Natural Resources' },
  { name: 'Milltown', lat: 38.34056, lng: -86.27371, type: 'access', description: 'Indiana Department of Natural Resources' },
  { name: 'Old Iron Bridge', lat: 38.19773, lng: -86.30934, type: 'access', description: 'Indiana Department of Natural Resources' },
  { name: 'Blue River Chapel', lat: 38.22641, lng: -86.25655, type: 'access', description: 'Indiana Department of Natural Resources' },
  { name: 'Brown Athletic Field Access (Jackson County)', lat: 38.89134, lng: -94.58285, type: 'access' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-86.2513, 38.3992],
  [-86.2505, 38.3968],
  [-86.2524, 38.3945],
  [-86.2568, 38.3958],
  [-86.2584, 38.3976],
  [-86.2609, 38.3972],
  [-86.2612, 38.3944],
  [-86.2516, 38.3917],
  [-86.2516, 38.3917],
  [-86.2493, 38.3906],
  [-86.2493, 38.3906],
]
