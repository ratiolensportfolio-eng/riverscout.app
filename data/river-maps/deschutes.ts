import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Deschutes River (OREGON) — geometry from USGS NHDPlus HR
// 6 points

export const accessPoints: AccessPoint[] = [
  { name: 'Sandy Beach', lat: 45.24033, lng: -121.04904, type: 'access', description: 'BLM — restrooms, parking: yes' },
  { name: 'Heritage Landing', lat: 45.63221, lng: -120.91297, type: 'access', description: 'Oregon State Parks — restrooms, parking: yes' },
  { name: 'Macks Canyon', lat: 45.39253, lng: -120.88089, type: 'access', description: 'BLM — restrooms, parking: yes' },
  { name: 'Buckhollow', lat: 45.26721, lng: -121.01897, type: 'access', description: 'BLM — restrooms, parking: yes' },
  { name: 'Harpham Flat', lat: 45.13362, lng: -121.12158, type: 'access', description: 'Tribal owned and managd by the BLM — restrooms, parking: overnight' },
  { name: 'Trout Creek', lat: 44.81642, lng: -121.09524, type: 'access', description: 'BLM — restrooms, parking: overnight, fee' },
  { name: 'Warm Springs Boat Ramp', lat: 44.75864, lng: -121.22733, type: 'access', description: 'restrooms, parking: yes' },
  { name: 'Lake Billy Chinook (Middle Deschutes)', lat: 44.52560, lng: -121.29900, type: 'access', description: 'BLM' },
  { name: 'Lower Bridge', lat: 44.35961, lng: -121.29484, type: 'access', description: 'BLM — parking: yes' },
  { name: 'Mecca Flat', lat: 44.77042, lng: -121.20884, type: 'access', description: 'BLM — restrooms, parking: overnight, fee' },
  { name: 'Nena', lat: 45.10128, lng: -121.13046, type: 'access', description: 'BLM — parking: yes' },
  { name: 'Long Bend', lat: 45.12682, lng: -121.12944, type: 'access', description: 'BLM — restrooms, parking: yes' },
  { name: 'Wapinitia', lat: 45.14437, lng: -121.12548, type: 'access', description: 'BLM — restrooms, parking: yes' },
  { name: 'Maupin City Park', lat: 45.17378, lng: -121.07416, type: 'access', description: 'City of Maupin — restrooms, parking: yes, fee' },
  { name: 'Pine Tree', lat: 45.29927, lng: -121.01811, type: 'access', description: 'BLM — restrooms, parking: yes' },
  { name: 'Beavertail', lat: 45.33647, lng: -120.94694, type: 'access', description: 'BLM — restrooms, parking: yes' },
  { name: 'Tetherow Crossing', lat: 44.31257, lng: -121.23835, type: 'access' },
  { name: 'Lower Deschutes', lat: 44.54744, lng: -121.27918, type: 'access', description: 'Oregon State Parks — restrooms, parking: yes, fee' },
  { name: 'Upper Deschutes', lat: 44.53261, lng: -121.29125, type: 'access', description: 'Oregon State Parks — restrooms, parking: yes, fee' },
  { name: 'Steelhead Falls', lat: 44.41127, lng: -121.29260, type: 'access', description: 'BLM — restrooms, parking: yes' },
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
