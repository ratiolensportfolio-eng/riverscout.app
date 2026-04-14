import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Gila River (NEW MEXICO) — geometry from USGS NHDPlus HR
// 36 points

export const accessPoints: AccessPoint[] = [
  { name: 'Nichol\'s Canyon', lat: 32.65018, lng: -108.84493, type: 'access', description: 'Bureau of Land Management — parking: yes' },
  { name: 'Fisherman\'s Point', lat: 32.63197, lng: -108.85473, type: 'access', description: 'Bureau of Land Management — parking: yes' },
  { name: 'Spring-on-the-Bluff', lat: 32.63399, lng: -108.87653, type: 'access', description: 'Bureau of Land Management — parking: yes' },
  { name: 'Game Department Road Bridge', lat: 32.69326, lng: -108.73247, type: 'access', description: 'New Mexico State Land' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-108.5867, 32.9698],
  [-108.5873, 32.969],
  [-108.5873, 32.969],
  [-108.5895, 32.9669],
  [-108.5895, 32.9669],
  [-108.5902, 32.9646],
  [-108.5933, 32.9638],
  [-108.5958, 32.9601],
  [-108.6018, 32.9566],
  [-108.6018, 32.9566],
  [-108.6023, 32.9564],
  [-108.6023, 32.9564],
  [-108.6051, 32.9554],
  [-108.6051, 32.9554],
  [-108.6067, 32.9539],
  [-108.6067, 32.9539],
  [-108.6102, 32.9525],
  [-108.61, 32.9501],
  [-108.6077, 32.9487],
  [-108.6077, 32.9487],
  [-108.6069, 32.9476],
  [-108.6097, 32.9412],
  [-108.6067, 32.9405],
  [-108.6036, 32.937],
  [-108.6053, 32.9338],
  [-108.6041, 32.93],
  [-108.5978, 32.9285],
  [-108.5949, 32.9256],
  [-108.5935, 32.9243],
  [-108.5935, 32.9243],
  [-108.5877, 32.9212],
  [-108.5877, 32.9212],
  [-108.5866, 32.9194],
  [-108.5895, 32.9188],
  [-108.59, 32.9142],
  [-108.59, 32.9142],
]
