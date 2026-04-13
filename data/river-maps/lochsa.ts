import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Lochsa River (IDAHO) — geometry from USGS NHDPlus HR
// 13 points

export const accessPoints: AccessPoint[] = [
  { name: 'Fish Creek', lat: 46.213, lng: -115.231, type: 'put-in', description: 'Upper Lochsa put-in for the classic 30-mile Class IV run along US-12.' },
  { name: 'Lowell', lat: 46.149, lng: -115.592, type: 'take-out', description: 'Take-out at the Lochsa/Selway confluence in the town of Lowell.' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-115.3091, 46.3436],
  [-115.313, 46.3382],
  [-115.315, 46.338],
  [-115.3188, 46.3389],
  [-115.3197, 46.3388],
  [-115.3198, 46.3388],
  [-115.3294, 46.3368],
  [-115.3294, 46.3368],
  [-115.3306, 46.3362],
  [-115.3291, 46.3323],
  [-115.3325, 46.3318],
  [-115.3371, 46.3344],
  [-115.3371, 46.3344],
]
