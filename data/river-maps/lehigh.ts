import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Lehigh River (PENNSYLVANIA) — geometry from USGS NHDPlus HR
// 14 points

export const accessPoints: AccessPoint[] = [
  { name: 'White Haven', lat: 41.062, lng: -75.776, type: 'put-in', description: 'Put-in for the Lehigh Gorge — Class II-III dam-release whitewater through Lehigh Gorge State Park.' },
  { name: 'Jim Thorpe', lat: 40.869, lng: -75.732, type: 'take-out', description: 'Standard take-out for the Lehigh Gorge.' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-75.7496, 40.9739],
  [-75.7531, 40.9709],
  [-75.7531, 40.9709],
  [-75.7546, 40.9668],
  [-75.7546, 40.9668],
  [-75.7538, 40.9658],
  [-75.7496, 40.9664],
  [-75.7496, 40.9664],
  [-75.7441, 40.9707],
  [-75.7341, 40.9685],
  [-75.7235, 40.9696],
  [-75.7183, 40.972],
  [-75.7133, 40.9714],
  [-75.7133, 40.9714],
]
