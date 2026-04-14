import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Russell Fork (VIRGINIA) — geometry from USGS NHDPlus HR
// 11 points

export const accessPoints: AccessPoint[] = [
  { name: 'Breaks Interstate Park', lat: 37.30001, lng: -82.32117, type: 'access', description: 'restrooms, parking: yes' },
  { name: 'Carson Island Access', lat: 37.29549, lng: -82.33749, type: 'access', description: 'parking: yes' },
  { name: 'Elkhorn City Park', lat: 37.30422, lng: -82.35170, type: 'access', description: 'parking: yes' },
  { name: 'Garden Hole Carrydown', lat: 37.27073, lng: -82.30317, type: 'access', description: 'parking: yes' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-82.3022, 37.2714],
  [-82.2997, 37.2743],
  [-82.2964, 37.2759],
  [-82.2934, 37.2766],
  [-82.2915, 37.2818],
  [-82.2952, 37.2824],
  [-82.2986, 37.2797],
  [-82.307, 37.282],
  [-82.3136, 37.2905],
  [-82.3146, 37.2957],
  [-82.3146, 37.2957],
]
