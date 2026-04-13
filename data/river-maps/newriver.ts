import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// New River (WEST VIRGINIA) — geometry from USGS NHDPlus HR
// 18 points

export const accessPoints: AccessPoint[] = [
  { name: 'Cunard Put-in', lat: 38.067, lng: -81.053, type: 'put-in', description: 'NPS access for the New River Gorge.' },
  { name: 'Fayette Station', lat: 38.07, lng: -81.083, type: 'take-out', description: 'Take-out under the New River Gorge Bridge — the iconic 876-foot arch bridge.' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-81.0265, 37.982],
  [-81.0266, 37.9885],
  [-81.0233, 37.9932],
  [-81.0214, 38.0006],
  [-81.0214, 38.0006],
  [-81.0244, 38.0068],
  [-81.0244, 38.0068],
  [-81.0248, 38.0078],
  [-81.0248, 38.0078],
  [-81.0259, 38.0109],
  [-81.0255, 38.0151],
  [-81.0259, 38.0192],
  [-81.0309, 38.0239],
  [-81.0326, 38.0261],
  [-81.0332, 38.0276],
  [-81.0332, 38.0276],
  [-81.0334, 38.0281],
  [-81.0334, 38.0281],
]
