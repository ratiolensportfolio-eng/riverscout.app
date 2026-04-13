import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Brazos River (TEXAS) — geometry from USGS NHDPlus HR
// 5 points

export const accessPoints: AccessPoint[] = [
  { name: 'Possum Kingdom State Park', lat: 32.869, lng: -98.525, type: 'put-in', description: 'State park below Possum Kingdom Dam.' },
  { name: 'Rochelle Park (Palo Pinto)', lat: 32.762, lng: -98.312, type: 'take-out', description: 'County park access on the middle Brazos.' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-98.705, 33.0382],
  [-98.6981, 33.0399],
  [-98.6965, 33.0383],
  [-98.6966, 33.0349],
  [-98.6966, 33.0349],
]
