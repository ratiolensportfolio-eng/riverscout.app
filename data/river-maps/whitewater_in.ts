import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Whitewater River (INDIANA) — geometry from USGS NHDPlus HR
// 13 points

export const accessPoints: AccessPoint[] = [
  { name: 'Connersville Canoe Site', lat: 39.62167, lng: -85.13882, type: 'access', description: 'Indiana Department of Natural Resources' },
  { name: 'Whitewater State Park', lat: 39.60527, lng: -84.96985, type: 'access', description: 'Indiana Department of Natural Resources' },
  { name: 'Old Plantation Access', lat: 37.47417, lng: -89.84854, type: 'access' },
  { name: 'Whitewater River Access', lat: 39.18223, lng: -84.79145, type: 'access', description: 'restrooms, parking: yes' },
  { name: 'Whitewater River Access', lat: 39.18504, lng: -84.79412, type: 'access', description: 'parking: yes' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-84.7981, 39.235],
  [-84.79, 39.2321],
  [-84.7876, 39.228],
  [-84.7897, 39.2251],
  [-84.7983, 39.2253],
  [-84.7947, 39.2209],
  [-84.7959, 39.2159],
  [-84.792, 39.2065],
  [-84.7878, 39.2021],
  [-84.7879, 39.1976],
  [-84.7845, 39.1954],
  [-84.7864, 39.1944],
  [-84.7864, 39.1944],
]
