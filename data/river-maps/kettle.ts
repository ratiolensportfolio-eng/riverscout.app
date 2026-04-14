import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Kettle River (MINNESOTA) — geometry from USGS NHDPlus HR
// 26 points

export const accessPoints: AccessPoint[] = [
  { name: 'Kettle Creek State Park', lat: 41.37645, lng: -77.92872, type: 'access', description: 'COE — parking: yes' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-92.8995, 46.503],
  [-92.8953, 46.5],
  [-92.8972, 46.4994],
  [-92.8966, 46.4982],
  [-92.8966, 46.4982],
  [-92.8916, 46.4937],
  [-92.8866, 46.4919],
  [-92.8866, 46.4919],
  [-92.8841, 46.4903],
  [-92.8841, 46.4903],
  [-92.8886, 46.4824],
  [-92.8847, 46.4806],
  [-92.8838, 46.4782],
  [-92.8838, 46.4782],
  [-92.8854, 46.4773],
  [-92.883, 46.4728],
  [-92.883, 46.4728],
  [-92.8798, 46.4715],
  [-92.8818, 46.4682],
  [-92.8717, 46.4596],
  [-92.8714, 46.457],
  [-92.8744, 46.4544],
  [-92.8771, 46.4475],
  [-92.8771, 46.4475],
  [-92.8834, 46.4457],
  [-92.8834, 46.4457],
]
