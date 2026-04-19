import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Deschutes River (OREGON) — geometry from USGS NHDPlus HR
// 6 points

export const accessPoints: AccessPoint[] = [
  { name: 'Bend Whitewater Park', lat: 44.058, lng: -121.312, type: 'access', description: 'City of Bend, Tumalo State Park area.' },
  { name: 'Warm Springs', lat: 44.756, lng: -121.3, type: 'access', description: 'CONFIRMED — BLM. No motorized boats above on reservation section.' },
  { name: 'Trout Creek', lat: 44.88, lng: -121.004, type: 'access', description: 'CONFIRMED — BLM. Best float access, 3-day drift to Maupin.' },
  { name: 'Maupin City Park', lat: 45.178, lng: -121.087, type: 'access', description: 'CONFIRMED — BLM. Boat ramp, large parking.' },
  { name: 'Sherars Falls', lat: 45.27, lng: -121.004, type: 'portage', description: 'CONFIRMED — 15ft vertical drop. Portage required. Tribal fishing platforms.' },
  { name: 'Macks Canyon', lat: 45.454, lng: -120.977, type: 'access-campsite', description: 'BLM campground, remote lower river.' },
  { name: 'Heritage Landing', lat: 45.63, lng: -120.907, type: 'take-out', description: 'CONFIRMED — Columbia River confluence. BLM, paved ramp.' },
]

export const sections: RiverSection[] = [
  { from: 'Warm Springs', to: 'Trout Creek', miles: 12, paddleTime: '5-6 hours', class: 'II', notes: 'Reservation section — stay east bank' },
  { from: 'Trout Creek', to: 'Maupin', miles: 25, paddleTime: '2-3 days', class: 'II-III', notes: 'Classic multi-day float' },
  { from: 'Maupin', to: 'Heritage Landing', miles: 45, paddleTime: '3-4 days', class: 'II-III', notes: 'Lower Deschutes. BLM Boater Pass required overnight.' },
]

export const riverPath: [number, number][] = [
  [-121.1234, 45.0813],
  [-121.1276, 45.0851],
  [-121.1272, 45.089],
  [-121.1312, 45.092],
  [-121.1281, 45.0935],
  [-121.1281, 45.0935],
]
