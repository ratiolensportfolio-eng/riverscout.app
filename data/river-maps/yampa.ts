import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Yampa River (COLORADO) — geometry from USGS NHDPlus HR
// 28 points

export const accessPoints: AccessPoint[] = [
  { name: 'Deerlodge Park', lat: 40.443, lng: -108.528, type: 'put-in', description: 'NPS put-in for the Yampa through Dinosaur National Monument.' },
  { name: 'Echo Park', lat: 40.517, lng: -109.006, type: 'take-out', description: 'NPS access at the Yampa/Green River confluence in Dinosaur National Monument.' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-106.9087, 40.1718],
  [-106.909, 40.1743],
  [-106.9154, 40.1804],
  [-106.9157, 40.1842],
  [-106.918, 40.1855],
  [-106.9183, 40.1886],
  [-106.9183, 40.1897],
  [-106.9183, 40.1897],
  [-106.9182, 40.193],
  [-106.9224, 40.199],
  [-106.9248, 40.1993],
  [-106.9261, 40.204],
  [-106.9289, 40.207],
  [-106.9303, 40.2098],
  [-106.9316, 40.209],
  [-106.9306, 40.2107],
  [-106.9329, 40.2116],
  [-106.9319, 40.2135],
  [-106.9332, 40.2154],
  [-106.9353, 40.2147],
  [-106.9356, 40.2162],
  [-106.9356, 40.2162],
  [-106.9373, 40.218],
  [-106.9385, 40.2184],
  [-106.9415, 40.219],
  [-106.9417, 40.2214],
  [-106.9406, 40.2214],
  [-106.9406, 40.2214],
]
