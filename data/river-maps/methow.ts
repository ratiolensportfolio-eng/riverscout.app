import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Methow River (WASHINGTON) — geometry from USGS NHDPlus HR
// 15 points

export const accessPoints: AccessPoint[] = [
  { name: 'The Winthrop Barn Auditorium', lat: 48.47608, lng: -120.18821, type: 'access', description: 'Town of Winthrop — parking: yes' },
  { name: 'Carlton Access', lat: 48.24617, lng: -120.11761, type: 'access', description: 'WA Department of Fish and Wildlife — restrooms, parking: yes' },
  { name: 'Averill Public Access', lat: 48.15087, lng: -120.05699, type: 'access', description: 'WA Department of Fish and Wildlife — restrooms, parking: yes' },
  { name: 'Douglas County PUD river access', lat: 48.04620, lng: -119.91562, type: 'access', description: 'Douglas County PUD — restrooms, parking: yes' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-120.2116, 48.4785],
  [-120.2023, 48.4786],
  [-120.1994, 48.4761],
  [-120.1994, 48.4761],
  [-120.1923, 48.4743],
  [-120.1872, 48.4761],
  [-120.1828, 48.4754],
  [-120.1828, 48.4754],
  [-120.1802, 48.475],
  [-120.1769, 48.4728],
  [-120.1753, 48.4693],
  [-120.17, 48.4645],
  [-120.1683, 48.4587],
  [-120.1628, 48.4552],
  [-120.1628, 48.4552],
]
