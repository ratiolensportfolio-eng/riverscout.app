import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Deschutes River (OREGON) — geometry from USGS NHDPlus HR
// 6 points

export const accessPoints: AccessPoint[] = [
  { name: 'Bend Whitewater Park', lat: 44.058, lng: -121.312, type: 'access', description: 'City of Bend put-in.' },
  { name: 'Maupin', lat: 45.177, lng: -121.087, type: 'access', description: 'Fishing and whitewater hub, lower river.' },
  { name: 'Sherars Falls', lat: 45.27, lng: -121.004, type: 'portage', description: 'Portage required.' },
]

export const sections: RiverSection[] = [
  { from: 'Bend Whitewater Park', to: 'Sunriver', miles: 10, paddleTime: '3-4 hours', class: 'II-III', notes: 'Upper Deschutes, playspots' },
]

export const riverPath: [number, number][] = [
  [-121.1234, 45.0813],
  [-121.1276, 45.0851],
  [-121.1272, 45.089],
  [-121.1312, 45.092],
  [-121.1281, 45.0935],
  [-121.1281, 45.0935],
]
