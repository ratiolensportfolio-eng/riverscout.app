import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Merced River (CALIFORNIA) — geometry from USGS NHDPlus HR
// 8 points

export const accessPoints: AccessPoint[] = [
  { name: 'Stoneman Bridge', lat: 37.74054, lng: -119.57433, type: 'access', description: 'restrooms, parking: yes, fee' },
  { name: 'Sentinal Beach', lat: 37.73572, lng: -119.60448, type: 'access', description: 'restrooms, parking: yes, fee' },
  { name: 'Clarks Bridge', lat: 37.73984, lng: -119.56487, type: 'access', description: 'parking: yes, fee' },
  { name: 'El Capitan Bridge', lat: 37.72391, lng: -119.63131, type: 'access', description: 'restrooms, parking: yes, fee' },
  { name: 'Junction 140 and 120', lat: 37.71883, lng: -119.68168, type: 'access', description: 'parking: yes, fee' },
  { name: 'Swinging Bridge', lat: 37.54041, lng: -119.62311, type: 'access', description: 'fee' },
  { name: 'Wawona Campground', lat: 37.54421, lng: -119.67371, type: 'access', description: 'parking: overnight, fee' },
  { name: 'Gravelly Ford', lat: 37.54575, lng: -119.45302, type: 'access', description: 'fee' },
  { name: 'Redbud Picnic Site and Boat Launch', lat: 37.66943, lng: -119.81774, type: 'access', description: 'Sierra National Forest — restrooms, parking: yes, fee' },
  { name: 'Indian Flat Picnic Site and Put in', lat: 37.66172, lng: -119.84552, type: 'access', description: 'Sierra National Forest — restrooms, parking: yes, fee' },
  { name: 'Cranberry Flat Day Use Picnic Site', lat: 37.66159, lng: -119.85066, type: 'access', description: 'Sierra National Forest — restrooms, parking: yes, fee' },
  { name: 'Mcclendon Beach Day Use Picnic Site', lat: 37.66211, lng: -119.86250, type: 'access', description: 'Sierra National Forest — restrooms, parking: yes, fee' },
  { name: 'Briceburg Put-in', lat: 37.60488, lng: -119.96680, type: 'access', description: 'BLM — restrooms, parking: yes' },
  { name: 'Bagby Recreation Area', lat: 37.61041, lng: -120.13454, type: 'access', description: 'Merced Irrigation District — restrooms, parking: yes, fee' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-120.0791, 37.5955],
  [-120.0829, 37.5972],
  [-120.0811, 37.5998],
  [-120.0824, 37.6025],
  [-120.0874, 37.603],
  [-120.093, 37.5999],
  [-120.0952, 37.6012],
  [-120.0952, 37.6012],
]
