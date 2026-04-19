import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Colorado River — Glenwood Canyon (COLORADO) — geometry from USGS NHDPlus HR
// 24 points

export const accessPoints: AccessPoint[] = [
  { name: 'South Canyon Boat Ramp', lat: 39.56515514, lng: -107.41688681, type: 'access', description: 'BLM Colorado. South Canyon Boat Ramp' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-107.0239, 39.7241],
  [-107.0245, 39.7233],
  [-107.0254, 39.7226],
  [-107.028, 39.721],
  [-107.033, 39.7223],
  [-107.0347, 39.7212],
  [-107.0347, 39.7212],
  [-107.0339, 39.7172],
  [-107.0366, 39.7132],
  [-107.0366, 39.7132],
  [-107.0375, 39.7134],
  [-107.0375, 39.7134],
  [-107.0414, 39.712],
  [-107.0414, 39.712],
  [-107.0428, 39.7107],
  [-107.0455, 39.712],
  [-107.0455, 39.712],
  [-107.0473, 39.7119],
  [-107.0472, 39.7104],
  [-107.0468, 39.7076],
  [-107.0471, 39.7072],
  [-107.0458, 39.7044],
  [-107.0498, 39.7012],
  [-107.0498, 39.7012],
]
