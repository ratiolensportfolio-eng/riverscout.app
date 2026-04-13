import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// James River (VIRGINIA) — geometry from USGS NHDPlus HR
// 12 points

export const accessPoints: AccessPoint[] = [
  { name: 'Scottsville', lat: 37.799, lng: -78.492, type: 'put-in', description: 'Town of Scottsville — the most popular launch on the upper James.' },
  { name: 'Reedy Creek (Richmond)', lat: 37.534, lng: -77.471, type: 'access', description: 'City of Richmond access at the start of the urban James River Park System.' },
  { name: '14th Street Take-out', lat: 37.524, lng: -77.434, type: 'take-out', description: 'Take-out below the fall-line rapids in downtown Richmond.' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-79.637, 37.5375],
  [-79.6321, 37.5372],
  [-79.626, 37.5426],
  [-79.6265, 37.5446],
  [-79.6332, 37.5455],
  [-79.6334, 37.5466],
  [-79.6336, 37.5468],
  [-79.6336, 37.5468],
  [-79.6336, 37.547],
  [-79.6336, 37.547],
  [-79.6336, 37.5485],
  [-79.6336, 37.5485],
]
