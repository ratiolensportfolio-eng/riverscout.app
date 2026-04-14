import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Lochsa River (IDAHO) — geometry from USGS NHDPlus HR
// 13 points

export const accessPoints: AccessPoint[] = [
  { name: '9 Mile', lat: 46.39125, lng: -115.21783, type: 'access', description: 'Nez Perce Clearwater National Forest — parking: overnight' },
  { name: 'Bald Mountain', lat: 46.38330, lng: -115.23357, type: 'access', description: 'Nez Perce Clearwater National Forest — restrooms, parking: overnight' },
  { name: 'Fish Creek', lat: 46.33478, lng: -115.34486, type: 'access', description: 'Nez Perce Clearwater National Forest — restrooms, parking: yes' },
  { name: 'Knife Edge', lat: 46.22742, lng: -115.47387, type: 'access', description: 'Nez Perce Clearwater National Forest — restrooms, parking: overnight, fee' },
  { name: 'Split Creek', lat: 46.23103, lng: -115.41610, type: 'access', description: 'Nez Perce Clearwater National Forest — restrooms, parking: overnight' },
  { name: 'White Pine', lat: 46.44571, lng: -115.09041, type: 'access', description: 'Nez Perce Clearwater National Forest — parking: overnight' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-115.3091, 46.3436],
  [-115.313, 46.3382],
  [-115.315, 46.338],
  [-115.3188, 46.3389],
  [-115.3197, 46.3388],
  [-115.3198, 46.3388],
  [-115.3294, 46.3368],
  [-115.3294, 46.3368],
  [-115.3306, 46.3362],
  [-115.3291, 46.3323],
  [-115.3325, 46.3318],
  [-115.3371, 46.3344],
  [-115.3371, 46.3344],
]
