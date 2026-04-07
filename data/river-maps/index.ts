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
  ausable: () => import('./ausable').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  gauley: () => import('./gauley').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  arkansas: () => import('./arkansas').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  salmon: () => import('./salmon').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  wenatchee: () => import('./wenatchee').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  yough: () => import('./yough').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  nantahala: () => import('./nantahala').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  american: () => import('./american').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  snake_wy: () => import('./snake_wy').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  buffalo: () => import('./buffalo').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  current: () => import('./current').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  niobrara: () => import('./niobrara').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  illinois_ok: () => import('./illinois_ok').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  guadalupe: () => import('./guadalupe').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  chattooga: () => import('./chattooga').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  kennebec: () => import('./kennebec').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  hudson_gorge: () => import('./hudson_gorge').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  wolf_wi: () => import('./wolf_wi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  ocoee: () => import('./ocoee').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  deerfield: () => import('./deerfield').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  saco: () => import('./saco').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  west_river: () => import('./west_river').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  housatonic: () => import('./housatonic').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  delaware_gap: () => import('./delaware_gap').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  grandcanyon: () => import('./grandcanyon').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  flathead: () => import('./flathead').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  ichetucknee: () => import('./ichetucknee').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  upper_iowa: () => import('./upper_iowa').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  desolation: () => import('./desolation').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  taos_box: () => import('./taos_box').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  chattahoochee: () => import('./chattahoochee').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  cahaba: () => import('./cahaba').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  black_creek_ms: () => import('./black_creek_ms').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  saluda: () => import('./saluda').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  little_miami: () => import('./little_miami').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  sugar_creek: () => import('./sugar_creek').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  kankakee: () => import('./kankakee').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  wood_ri: () => import('./wood_ri').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  brandywine: () => import('./brandywine').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  potomac: () => import('./potomac').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  flint_hills: () => import('./flint_hills').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  little_missouri: () => import('./little_missouri').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  missouri_sd: () => import('./missouri_sd').then(m => ({
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
