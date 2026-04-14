import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Big Piney Creek (ARKANSAS) — geometry from USGS NHDPlus HR
// 21 points

export const accessPoints: AccessPoint[] = [
  { name: 'Limestone', lat: 35.78098, lng: -93.28625, type: 'access', description: 'Ozark-St. Francis National Forest — parking: yes' },
  { name: 'Parker Ridge', lat: 35.73307, lng: -93.27281, type: 'access', description: 'Ozark-St. Francis National Forest' },
  { name: 'Ft. Douglas', lat: 35.67792, lng: -93.23810, type: 'access', description: 'Ozark-St. Francis National Forest — parking: overnight' },
  { name: 'Helton\'s Farm', lat: 35.61389, lng: -93.18575, type: 'access', description: 'Ozark-St. Francis National Forest — parking: overnight' },
  { name: 'Long Pool', lat: 35.55038, lng: -93.16168, type: 'access', description: 'Ozark-St. Francis National Forest — restrooms, parking: overnight, fee' },
  { name: 'Twin Bridges', lat: 35.50444, lng: -93.18222, type: 'access', description: 'Ozark-St. Francis National Forest' },
  { name: 'Boiling Spring Access', lat: 37.46158, lng: -91.98764, type: 'access' },
  { name: 'Dogs Bluff Access', lat: 37.32667, lng: -92.00213, type: 'access' },
  { name: 'Mason Bridge Access', lat: 37.50566, lng: -91.98321, type: 'access' },
  { name: 'Mineral Springs Access', lat: 37.36308, lng: -91.96982, type: 'access' },
  { name: 'Simmons Ford Access', lat: 37.24185, lng: -92.00972, type: 'access' },
  { name: 'Ross Access', lat: 37.66977, lng: -92.04933, type: 'access' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-93.2487, 35.4372],
  [-93.2508, 35.4374],
  [-93.2552, 35.4427],
  [-93.2552, 35.4427],
  [-93.2593, 35.4411],
  [-93.259, 35.4385],
  [-93.2615, 35.4346],
  [-93.2687, 35.433],
  [-93.2807, 35.4375],
  [-93.2835, 35.4399],
  [-93.2835, 35.4399],
  [-93.2842, 35.4413],
  [-93.2842, 35.4413],
  [-93.2879, 35.444],
  [-93.2936, 35.4419],
  [-93.2936, 35.4419],
  [-93.294, 35.4416],
  [-93.2973, 35.4394],
  [-93.2997, 35.4374],
  [-93.2994, 35.435],
  [-93.2994, 35.435],
]
