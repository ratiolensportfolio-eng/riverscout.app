import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Truckee River (NEVADA) — geometry from USGS NHDPlus HR
// 7 points

export const accessPoints: AccessPoint[] = [
  { name: 'Donner Creek Inflow', lat: 39.31644, lng: -120.20049, type: 'access', description: 'Private — restrooms, parking: yes' },
  { name: 'Glenshire Bridge', lat: 39.35383, lng: -120.12251, type: 'access', description: 'Private — parking: yes' },
  { name: 'Old Boca Bridge', lat: 39.38490, lng: -120.08820, type: 'access', description: 'Private — parking: yes' },
  { name: 'Bridge at I-80 - Floriston', lat: 39.39433, lng: -120.02421, type: 'access', description: 'Private — parking: yes' },
  { name: 'Farad Power Plant - return flow', lat: 39.41782, lng: -120.02954, type: 'access', description: 'Private — parking: yes' },
  { name: '64 Acres Park Rafting Ramp', lat: 39.16516, lng: -120.14727, type: 'access', description: 'Tahoe City Public Utility District — restrooms, parking: yes' },
  { name: 'River Ranch Access', lat: 39.18512, lng: -120.19516, type: 'access', description: 'River Ranch Lodge — restrooms, parking: yes' },
  { name: 'Crystal Peak Park', lat: 39.51374, lng: -119.99616, type: 'access', description: 'Washoe County — restrooms, parking: yes' },
  { name: 'Route 109 Junction', lat: 39.52121, lng: -119.96052, type: 'access', description: 'Private — parking: yes' },
  { name: 'Mayberry Park', lat: 39.50297, lng: -119.89685, type: 'access', description: 'Washoe County — restrooms, parking: yes' },
  { name: 'Crissy Caughlin Park', lat: 39.51105, lng: -119.85265, type: 'access', description: 'Reno Parks and Recreation — restrooms, parking: yes' },
  { name: 'Idlewild Park', lat: 39.52276, lng: -119.83478, type: 'access', description: 'Reno Parks and Recreation — restrooms, parking: yes' },
  { name: 'Booth Street Bridge', lat: 39.52045, lng: -119.82615, type: 'access', description: 'Private' },
  { name: 'Wingfield Park West', lat: 39.52384, lng: -119.81807, type: 'access', description: 'Reno Parks and Recreation — restrooms, parking: yes' },
  { name: 'Wingfield Park East', lat: 39.52437, lng: -119.81519, type: 'access', description: 'Reno Parks and Recreation — restrooms, parking: yes' },
  { name: 'Fisherman\'s Park', lat: 39.53083, lng: -119.78139, type: 'access', description: 'Reno Parks and Recreation — restrooms, parking: yes' },
  { name: 'Post Glendale Diversion Dam Access', lat: 39.52663, lng: -119.77700, type: 'access', description: 'Private' },
  { name: 'Rock Park', lat: 39.52099, lng: -119.76589, type: 'access', description: 'Sparks Parks and Facilities — restrooms, parking: yes' },
  { name: 'Cottonwood Park', lat: 39.51390, lng: -119.72952, type: 'access', description: 'City of Sparks — restrooms, parking: yes' },
  { name: 'Lockwood Trailhead Park', lat: 39.50926, lng: -119.65163, type: 'access', description: 'Washoe County — restrooms, parking: yes' },
  { name: 'USA Parkway Bridge', lat: 39.56434, lng: -119.48641, type: 'access', description: 'Private — parking: yes' },
  { name: 'Wadsworth Bridge Access', lat: 39.63231, lng: -119.28313, type: 'access', description: 'Pyramid Lake Paiute Tribe — parking: yes, fee' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-119.9595, 39.5187],
  [-119.9594, 39.5168],
  [-119.9614, 39.5153],
  [-119.9594, 39.5126],
  [-119.9542, 39.5124],
  [-119.9533, 39.5111],
  [-119.9533, 39.5111],
]
