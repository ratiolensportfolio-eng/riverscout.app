import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Ichetucknee River (FL) — geometry from USGS NHDPlus HR
// 22 points, 7/7 segments stitched

// Access points snapped to riverPath geometry
export const accessPoints: AccessPoint[] = []

// River sections
export const sections: RiverSection[] = []

// River path from USGS NHDPlus High Resolution dataset
export const riverPath: [number, number][] = [
  [-82.759, 29.9833],
  [-82.7587, 29.9833],
  [-82.7587, 29.9833],
  [-82.7588, 29.9801],
  [-82.7588, 29.9801],
  [-82.7593, 29.9777],
  [-82.7593, 29.9777],
  [-82.7597, 29.9715],
  [-82.7597, 29.9715],
  [-82.7614, 29.9663],
  [-82.7614, 29.9663],
  [-82.7622, 29.9644],
  [-82.7729, 29.9591],
  [-82.7792, 29.958],
  [-82.7832, 29.9546],
  [-82.7858, 29.9549],
  [-82.7919, 29.944],
  [-82.7915, 29.9421],
  [-82.7973, 29.9372],
  [-82.7973, 29.9372],
  [-82.8003, 29.9324],
  [-82.8003, 29.9324],
]
