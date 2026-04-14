import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Generals Cut (GA) — polyline from National Rivers Project (NRP).
// 8 points, stitched from 1 NRP segments.
// Access points render from Supabase at runtime.

export const accessPoints: AccessPoint[] = []

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-81.4396, 31.3555],
  [-81.4366, 31.3605],
  [-81.4362, 31.3608],
  [-81.4355, 31.3611],
  [-81.4346, 31.3612],
  [-81.4337, 31.3609],
  [-81.4327, 31.3616],
  [-81.4316, 31.3617],
]
