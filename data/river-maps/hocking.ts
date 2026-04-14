import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Hocking River (OHIO) — geometry from USGS NHDPlus HR
// 19 points

export const accessPoints: AccessPoint[] = [
  { name: 'Hocking River Access', lat: 39.71999, lng: -82.60996, type: 'access', description: 'parking: yes' },
  { name: 'Hocking River Access', lat: 39.70615, lng: -82.60257, type: 'access', description: 'restrooms' },
  { name: 'Hocking River Access', lat: 39.65180, lng: -82.55790, type: 'access', description: 'parking: yes' },
  { name: 'Hocking River Access', lat: 39.58362, lng: -82.51858, type: 'access', description: 'parking: yes' },
  { name: 'Hocking River Access', lat: 39.54772, lng: -82.43853, type: 'access', description: 'restrooms, parking: yes' },
  { name: 'Hocking River Access', lat: 39.53372, lng: -82.40742, type: 'access', description: 'restrooms, parking: yes' },
  { name: 'Hocking River Access', lat: 39.43990, lng: -82.21000, type: 'access', description: 'parking: yes' },
  { name: 'Hocking River Access', lat: 39.22940, lng: -81.79450, type: 'access', description: 'parking: yes' },
  { name: 'Hocking River Access', lat: 39.20213, lng: -81.77342, type: 'access', description: 'restrooms' },
  { name: 'Hocking River Access', lat: 39.54190, lng: -82.43130, type: 'access', description: 'parking: yes' },
  { name: 'Hocking River Access', lat: 39.52050, lng: -82.37750, type: 'access', description: 'parking: yes' },
  { name: 'Hocking River Access', lat: 39.47420, lng: -82.32980, type: 'access', description: 'parking: yes' },
  { name: 'Hocking River Access', lat: 39.45930, lng: -82.31310, type: 'access', description: 'parking: yes' },
  { name: 'Hocking River Access', lat: 39.45901, lng: -82.24020, type: 'access', description: 'parking: yes' },
  { name: 'Hocking River Access', lat: 39.45758, lng: -82.23370, type: 'access', description: 'restrooms, parking: yes' },
  { name: 'Hocking River Access', lat: 39.45100, lng: -82.22940, type: 'access', description: 'restrooms, parking: yes' },
  { name: 'Hocking River Access', lat: 39.38920, lng: -82.14010, type: 'access', description: 'parking: yes' },
  { name: 'Hocking River Access', lat: 39.33310, lng: -82.12590, type: 'access', description: 'restrooms, parking: yes' },
  { name: 'Hocking River Access', lat: 39.32750, lng: -82.00470, type: 'access', description: 'parking: yes' },
  { name: 'Hocking River Access', lat: 39.28921, lng: -81.92383, type: 'access', description: 'restrooms, parking: yes' },
  { name: 'Hocking River Access', lat: 39.31950, lng: -81.87900, type: 'access', description: 'parking: yes' },
  { name: 'Hocking River Access', lat: 39.27630, lng: -81.83080, type: 'access', description: 'parking: yes' },
  { name: 'Hocking River Access', lat: 39.18440, lng: -81.75390, type: 'access', description: 'parking: yes' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-82.1855, 39.4036],
  [-82.1835, 39.4037],
  [-82.1835, 39.4037],
  [-82.1761, 39.4037],
  [-82.1761, 39.4037],
  [-82.1737, 39.4034],
  [-82.173, 39.4007],
  [-82.173, 39.4007],
  [-82.1693, 39.4011],
  [-82.1693, 39.4011],
  [-82.1648, 39.3995],
  [-82.1642, 39.3975],
  [-82.1668, 39.3962],
  [-82.164, 39.3958],
  [-82.1632, 39.394],
  [-82.1632, 39.394],
  [-82.1613, 39.3881],
  [-82.1591, 39.3878],
  [-82.1591, 39.3878],
]
