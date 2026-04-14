import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Eleven Point River (MISSOURI) — geometry from USGS NHDPlus HR
// 26 points

export const accessPoints: AccessPoint[] = [
  { name: 'Eleven Point Boat Ramp', lat: 36.25031, lng: -91.08608, type: 'access', description: 'AGFC' },
  { name: 'Dalton Boat Ramp', lat: 36.42209, lng: -91.13958, type: 'access', description: 'AGFC' },
  { name: 'Thomasville', lat: 36.78542, lng: -91.52839, type: 'access', description: 'Mark Twain National Forest — restrooms, parking: yes' },
  { name: 'Cane Bluff', lat: 36.79623, lng: -91.40600, type: 'access', description: 'Mark Twain National Forest — restrooms, parking: overnight' },
  { name: 'Long Hollow', lat: 36.81764, lng: -91.36355, type: 'access', description: 'Mark Twain National Forest — parking: overnight' },
  { name: 'Boom Hole', lat: 36.80924, lng: -91.35706, type: 'access', description: 'Mark Twain National Forest — parking: overnight' },
  { name: 'Greer Crossing', lat: 36.79344, lng: -91.33162, type: 'access', description: 'Mark Twain National Forest — restrooms, parking: overnight' },
  { name: 'Turners Mill North', lat: 36.76603, lng: -91.26731, type: 'access', description: 'Mark Twain National Forest — restrooms, parking: overnight' },
  { name: 'Turners Mill South', lat: 36.76497, lng: -91.26650, type: 'access', description: 'Mark Twain National Forest — restrooms, parking: overnight' },
  { name: 'Stinking Pond Float Camp', lat: 36.76158, lng: -91.25742, type: 'access', description: 'Mark Twain National Forest — restrooms' },
  { name: 'McDowell', lat: 36.76054, lng: -91.24113, type: 'access', description: 'Mark Twain National Forest — parking: overnight' },
  { name: 'Horseshoe Bend Float Camp', lat: 36.74989, lng: -91.24139, type: 'access', description: 'Mark Twain National Forest — restrooms' },
  { name: 'Barn Hollow Float Camp', lat: 36.74133, lng: -91.24139, type: 'access', description: 'Mark Twain National Forest — restrooms' },
  { name: 'Whitten', lat: 36.73241, lng: -91.21483, type: 'access', description: 'Mark Twain National Forest — restrooms, parking: overnight' },
  { name: 'Whites Creek Float Camp', lat: 36.72508, lng: -91.20953, type: 'access', description: 'Mark Twain National Forest — restrooms' },
  { name: 'Greenbriar Float Camp', lat: 36.69025, lng: -91.19628, type: 'access', description: 'Mark Twain National Forest — restrooms' },
  { name: 'Boze Mill', lat: 36.66314, lng: -91.19767, type: 'access', description: 'Mark Twain National Forest — restrooms, parking: overnight' },
  { name: 'Riverton East', lat: 36.64912, lng: -91.19991, type: 'access', description: 'Mark Twain National Forest — restrooms, parking: overnight' },
  { name: 'Morgan Spring Float Camp', lat: 36.55883, lng: -91.19681, type: 'access', description: 'Mark Twain National Forest — restrooms' },
  { name: 'The Narrows', lat: 36.55076, lng: -91.19151, type: 'access', description: 'Mark Twain National Forest — restrooms, parking: overnight' },
  { name: 'Myrtle Access', lat: 36.51252, lng: -91.17066, type: 'access' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-91.4507, 36.7808],
  [-91.4495, 36.7807],
  [-91.4463, 36.7816],
  [-91.4424, 36.7832],
  [-91.4383, 36.7827],
  [-91.4344, 36.7829],
  [-91.4295, 36.7829],
  [-91.4255, 36.7838],
  [-91.4255, 36.7838],
  [-91.4255, 36.7839],
  [-91.4255, 36.7839],
  [-91.4208, 36.7852],
  [-91.4141, 36.7919],
  [-91.4123, 36.7947],
  [-91.4082, 36.7944],
  [-91.4094, 36.7973],
  [-91.4083, 36.7987],
  [-91.4032, 36.794],
  [-91.3992, 36.7966],
  [-91.3992, 36.7966],
  [-91.3991, 36.7979],
  [-91.3991, 36.7979],
  [-91.3993, 36.7982],
  [-91.3968, 36.8015],
  [-91.3967, 36.8015],
  [-91.3967, 36.8015],
]
