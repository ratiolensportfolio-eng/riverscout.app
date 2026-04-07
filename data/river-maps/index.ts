// Registry of rivers that have interactive map data
// Add new rivers here as their access points are mapped

import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

interface RiverMapData {
  accessPoints: AccessPoint[]
  sections: RiverSection[]
  riverPath: [number, number][]
}

const registry: Record<string, () => Promise<RiverMapData>> = {
  pine_mi: () => import('./pine_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
}

export function hasRiverMap(riverId: string): boolean {
  return riverId in registry
}

export async function loadRiverMap(riverId: string): Promise<RiverMapData | null> {
  const loader = registry[riverId]
  if (!loader) return null
  return loader()
}
