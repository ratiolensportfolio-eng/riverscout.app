import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Jackson River — polyline from National Rivers Project (NRP).
// 7 points, stitched from 1 NRP segments.

export const accessPoints: AccessPoint[] = [
  { name: 'Jackson Pit (Greene-Sullivan)', lat: 38.99415, lng: -87.21641, type: 'access', description: 'Indiana Department of Natural Resources' },
  { name: 'Petticoat Junction', lat: 37.84211, lng: -79.98881, type: 'access', description: 'Virginia Department of Game and Inland Fisheries' },
  { name: 'Indian Draft', lat: 37.86870, lng: -79.98935, type: 'access', description: 'Virginia Department of Game and Inland Fisheries' },
  { name: 'Johnson Spring', lat: 37.91509, lng: -79.97238, type: 'access', description: 'Virginia Department of Game and Inland Fisheries' },
  { name: 'Island Ford II', lat: 37.77923, lng: -79.93350, type: 'access', description: 'Virginia Department of Game and Inland Fisheries' },
  { name: 'Low Moor', lat: 37.80007, lng: -79.87125, type: 'access', description: 'Virginia Department of Game and Inland Fisheries' },
]

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
