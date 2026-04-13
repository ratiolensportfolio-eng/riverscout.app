import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Mulberry River (ARKANSAS) — geometry from USGS NHDPlus HR
// 12 points

export const accessPoints: AccessPoint[] = [
  { name: 'Wolf Pen', lat: 35.712, lng: -93.671, type: 'put-in', description: 'USFS put-in for the upper Mulberry — Arkansas\'s most remote Class III whitewater.' },
  { name: 'Turner Bend', lat: 35.687, lng: -93.578, type: 'take-out', description: 'The classic Mulberry take-out at Turner Bend store — been running shuttle for paddlers since the 1970s.' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-93.4336, 35.7091],
  [-93.4348, 35.7071],
  [-93.4337, 35.7049],
  [-93.4359, 35.7037],
  [-93.4336, 35.7019],
  [-93.4352, 35.7019],
  [-93.4355, 35.7002],
  [-93.4355, 35.7002],
  [-93.4356, 35.6982],
  [-93.4392, 35.6945],
  [-93.439, 35.692],
  [-93.439, 35.692],
]
