import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Jackson River — polyline from National Rivers Project (NRP).
// 7 points, stitched from 1 NRP segments.

export const accessPoints: AccessPoint[] = []

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-79.7930, 37.8060],
  [-79.7903, 37.8026],
  [-79.7863, 37.7998],
  [-79.7848, 37.7951],
  [-79.7845, 37.7929],
  [-79.7824, 37.7902],
  [-79.7778, 37.7855],
]
