import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

interface RiverMapData {
  accessPoints: AccessPoint[]
  sections: RiverSection[]
  riverPath: [number, number][]
}

const registry: Record<string, () => Promise<RiverMapData>> = {
  american: () => import('./american').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  androscoggin: () => import('./androscoggin').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  arkansas: () => import('./arkansas').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  ausable: () => import('./ausable').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  betsie: () => import('./betsie').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  big_piney: () => import('./big_piney').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  big_sioux: () => import('./big_sioux').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  black_cheboygan: () => import('./black_cheboygan').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  black_creek_ms: () => import('./black_creek_ms').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  black_ny: () => import('./black_ny').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  blackfoot: () => import('./blackfoot').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  blackstone: () => import('./blackstone').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  blue_in: () => import('./blue_in').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  blue_ok: () => import('./blue_ok').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  boardman: () => import('./boardman').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  brandywine: () => import('./brandywine').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  brazos: () => import('./brazos').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  buffalo: () => import('./buffalo').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  cache_il: () => import('./cache_il').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  cahaba: () => import('./cahaba').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  cass: () => import('./cass').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  cataract: () => import('./cataract').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  chattahoochee: () => import('./chattahoochee').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  chattooga: () => import('./chattooga').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  cheat: () => import('./cheat').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  chippewa_mi: () => import('./chippewa_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  clarion: () => import('./clarion').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  concord: () => import('./concord').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  cossatot: () => import('./cossatot').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  crow_wing: () => import('./crow_wing').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  crystal: () => import('./crystal').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  crystal_mi: () => import('./crystal_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  cumberland: () => import('./cumberland').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  current: () => import('./current').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  cuyahoga: () => import('./cuyahoga').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  dead_river: () => import('./dead_river').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  deerfield: () => import('./deerfield').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  delaware_gap: () => import('./delaware_gap').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  deschutes: () => import('./deschutes').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  desolation: () => import('./desolation').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  devils_river: () => import('./devils_river').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  dismal: () => import('./dismal').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  eleven_point: () => import('./eleven_point').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  etowah: () => import('./etowah').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  fall_river_ks: () => import('./fall_river_ks').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  flat_river: () => import('./flat_river').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  flathead: () => import('./flathead').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  flint_hills: () => import('./flint_hills').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  gallatin: () => import('./gallatin').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  gauley: () => import('./gauley').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  gila_nm: () => import('./gila_nm').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  glenwood: () => import('./glenwood').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  grand_oh: () => import('./grand_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  grandcanyon: () => import('./grandcanyon').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  green_river: () => import('./green_river').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  green_wy: () => import('./green_wy').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  greenbrier: () => import('./greenbrier').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  guadalupe: () => import('./guadalupe').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  hells_canyon: () => import('./hells_canyon').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  hocking: () => import('./hocking').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  housatonic: () => import('./housatonic').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  hudson_gorge: () => import('./hudson_gorge').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  humboldt: () => import('./humboldt').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  huron_mi: () => import('./huron_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  ichetucknee: () => import('./ichetucknee').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  illinois_ok: () => import('./illinois_ok').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  james: () => import('./james').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  jordan: () => import('./jordan').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  kalamazoo: () => import('./kalamazoo').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  kankakee: () => import('./kankakee').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  kennebec: () => import('./kennebec').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  kern: () => import('./kern').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  kettle: () => import('./kettle').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  kickapoo: () => import('./kickapoo').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  lamoille: () => import('./lamoille').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  lehigh: () => import('./lehigh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  little_manistee: () => import('./little_manistee').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  little_miami: () => import('./little_miami').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  little_missouri: () => import('./little_missouri').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  little_muskegon: () => import('./little_muskegon').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  lochsa: () => import('./lochsa').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  loxahatchee: () => import('./loxahatchee').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  loyalsock: () => import('./loyalsock').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  manistee: () => import('./manistee').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  maquoketa: () => import('./maquoketa').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  meramec: () => import('./meramec').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  merced: () => import('./merced').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  methow: () => import('./methow').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  missouri_mt: () => import('./missouri_mt').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  missouri_nd: () => import('./missouri_nd').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  missouri_sd: () => import('./missouri_sd').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  mohican: () => import('./mohican').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  moose_ny: () => import('./moose_ny').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  mulberry: () => import('./mulberry').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  mullica: () => import('./mullica').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  muskegon: () => import('./muskegon').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  namekagon: () => import('./namekagon').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  nantahala: () => import('./nantahala').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  newriver: () => import('./newriver').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  newriver_va: () => import('./newriver_va').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  niobrara: () => import('./niobrara').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  north_platte: () => import('./north_platte').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  ocoee: () => import('./ocoee').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  ocqueoc: () => import('./ocqueoc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  peace: () => import('./peace').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  pemi: () => import('./pemi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  pere_marquette: () => import('./pere_marquette').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  peshtigo: () => import('./peshtigo').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  pigeon_mi: () => import('./pigeon_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  pine_mi: () => import('./pine_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  pinecreek: () => import('./pinecreek').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  platte: () => import('./platte').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  platte_mi: () => import('./platte_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  potomac: () => import('./potomac').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  rappahannock: () => import('./rappahannock').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  rifle: () => import('./rifle').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  rogue: () => import('./rogue').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  russell_fork: () => import('./russell_fork').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  saco: () => import('./saco').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  salmon: () => import('./salmon').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  salmon_ny: () => import('./salmon_ny').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  saluda: () => import('./saluda').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  san_juan: () => import('./san_juan').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  shiawassee: () => import('./shiawassee').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  snake_wy: () => import('./snake_wy').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  st_croix_me: () => import('./st_croix_me').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  stillwater: () => import('./stillwater').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  sturgeon_lp: () => import('./sturgeon_lp').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  sugar_creek: () => import('./sugar_creek').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  suwannee: () => import('./suwannee').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  taos_box: () => import('./taos_box').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  thornapple: () => import('./thornapple').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  thunder_bay: () => import('./thunder_bay').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  truckee: () => import('./truckee').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  tuolumne: () => import('./tuolumne').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  twohearted: () => import('./twohearted').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  tygart: () => import('./tygart').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  upper_iowa: () => import('./upper_iowa').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  verde: () => import('./verde').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  vermilion_il: () => import('./vermilion_il').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  war_eagle: () => import('./war_eagle').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  wekiva: () => import('./wekiva').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  wenatchee: () => import('./wenatchee').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  west_river: () => import('./west_river').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  westfield: () => import('./westfield').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  white_mi: () => import('./white_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  whitewater_in: () => import('./whitewater_in').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  wolf_wi: () => import('./wolf_wi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  wood_ri: () => import('./wood_ri').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  yampa: () => import('./yampa').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  yough: () => import('./yough').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  yough_md: () => import('./yough_md').then(m => ({
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
