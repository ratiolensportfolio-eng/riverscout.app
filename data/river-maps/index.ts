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
  anahulu_hi: () => import('./anahulu_hi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  anchor_ak: () => import('./anchor_ak').then(m => ({
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
  atchafalaya: () => import('./atchafalaya').then(m => ({
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
  black_az: () => import('./black_az').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  black_cheboygan: () => import('./black_cheboygan').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  black_fork_oh: () => import('./black_fork_oh').then(m => ({
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
  bogue_chitto: () => import('./bogue_chitto').then(m => ({
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
  broad_ga: () => import('./broad_ga').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  broadkill: () => import('./broadkill').then(m => ({
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
  caddo: () => import('./caddo').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  cahaba: () => import('./cahaba').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  calamus: () => import('./calamus').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  canadian_nm: () => import('./canadian_nm').then(m => ({
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
  chattooga_ga: () => import('./chattooga_ga').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  chattooga_sc: () => import('./chattooga_sc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  chattooga_sc_main: () => import('./chattooga_sc_main').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  cheat: () => import('./cheat').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  cheat_narrows: () => import('./cheat_narrows').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  chippewa_mi: () => import('./chippewa_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  christina: () => import('./christina').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  chunky: () => import('./chunky').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  clarion: () => import('./clarion').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  clinch_norris_tn: () => import('./clinch_norris_tn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  concord: () => import('./concord').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  copper_ak: () => import('./copper_ak').then(m => ({
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
  deshka_ak: () => import('./deshka_ak').then(m => ({
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
  elkhorn: () => import('./elkhorn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  eramosa_on: () => import('./eramosa_on').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  esopus: () => import('./esopus').then(m => ({
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
  french_on: () => import('./french_on').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  frio: () => import('./frio').then(m => ({
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
  gila_box: () => import('./gila_box').then(m => ({
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
  glover: () => import('./glover').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  grand_oh: () => import('./grand_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  grand_on: () => import('./grand_on').then(m => ({
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
  jarbidge: () => import('./jarbidge').then(m => ({
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
  kasilof_ak: () => import('./kasilof_ak').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  kenai_ak: () => import('./kenai_ak').then(m => ({
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
  kiamichi: () => import('./kiamichi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  kickapoo: () => import('./kickapoo').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  kicking_horse_bc: () => import('./kicking_horse_bc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  kiski: () => import('./kiski').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  klutina_ak: () => import('./klutina_ak').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  lamoille: () => import('./lamoille').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  leaf: () => import('./leaf').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  lehigh: () => import('./lehigh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  linville: () => import('./linville').then(m => ({
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
  little_susitna_ak: () => import('./little_susitna_ak').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  llano: () => import('./llano').then(m => ({
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
  machias: () => import('./machias').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  magnetawan_on: () => import('./magnetawan_on').then(m => ({
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
  mokelumne: () => import('./mokelumne').then(m => ({
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
  nanticoke: () => import('./nanticoke').then(m => ({
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
  nueces: () => import('./nueces').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  obeds: () => import('./obeds').then(m => ({
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
  okatoma: () => import('./okatoma').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  payette: () => import('./payette').then(m => ({
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
  raquette: () => import('./raquette').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  raritan: () => import('./raritan').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  red_clay: () => import('./red_clay').then(m => ({
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
  rogue_mi: () => import('./rogue_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  root: () => import('./root').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  russell_fork: () => import('./russell_fork').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  russian_ak: () => import('./russian_ak').then(m => ({
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
  san_francisco_az: () => import('./san_francisco_az').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  san_juan: () => import('./san_juan').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  san_juan_nm: () => import('./san_juan_nm').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  savage: () => import('./savage').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  seboeis: () => import('./seboeis').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  sf_boise: () => import('./sf_boise').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  shavers_fork: () => import('./shavers_fork').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  shiawassee: () => import('./shiawassee').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  shoshone: () => import('./shoshone').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  snake_wy: () => import('./snake_wy').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  speed_on: () => import('./speed_on').then(m => ({
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
  susitna_ak: () => import('./susitna_ak').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  suwannee: () => import('./suwannee').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  swift_nh: () => import('./swift_nh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  talkeetna_ak: () => import('./talkeetna_ak').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  tallahala: () => import('./tallahala').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  tallulah_ga: () => import('./tallulah_ga').then(m => ({
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
  toccoa: () => import('./toccoa').then(m => ({
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
  tygart_wv: () => import('./tygart_wv').then(m => ({
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
  vermilion_oh: () => import('./vermilion_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  vermillion_sd: () => import('./vermillion_sd').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  war_eagle: () => import('./war_eagle').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  washita: () => import('./washita').then(m => ({
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
  west_branch_ausable_ny: () => import('./west_branch_ausable_ny').then(m => ({
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
  white_in: () => import('./white_in').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  white_mi: () => import('./white_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  white_salmon: () => import('./white_salmon').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  whitewater_in: () => import('./whitewater_in').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  whitewater_mn: () => import('./whitewater_mn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  wind_river: () => import('./wind_river').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  winooski: () => import('./winooski').then(m => ({
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
  alagnak_ak: () => import('./alagnak_ak').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  allagash: () => import('./allagash').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  allegheny: () => import('./allegheny').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  big_mo: () => import('./big_mo').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  black_sc: () => import('./black_sc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  bluestone: () => import('./bluestone').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  broad_sc: () => import('./broad_sc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  brule_wi: () => import('./brule_wi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  bruneau: () => import('./bruneau').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  cache_la_poudre: () => import('./cache_la_poudre').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  caney_fork: () => import('./caney_fork').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  cannon: () => import('./cannon').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  cedar_ia: () => import('./cedar_ia').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  chagrin: () => import('./chagrin').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  chipuxet: () => import('./chipuxet').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  clackamas: () => import('./clackamas').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  clarks_fork: () => import('./clarks_fork').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  clinch_va: () => import('./clinch_va').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  coldwater_mi: () => import('./coldwater_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  congaree: () => import('./congaree').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  connecticut: () => import('./connecticut').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  coosa: () => import('./coosa').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  cottonwood: () => import('./cottonwood').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  deep_creek_ak: () => import('./deep_creek_ak').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  delaware_pa: () => import('./delaware_pa').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  des_moines: () => import('./des_moines').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  des_plaines: () => import('./des_plaines').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  dolores: () => import('./dolores').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  duck_river: () => import('./duck_river').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  eagle: () => import('./eagle').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  edisto: () => import('./edisto').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  eel_in: () => import('./eel_in').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  elk_tn: () => import('./elk_tn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  elkhorn_ne: () => import('./elkhorn_ne').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  enoree: () => import('./enoree').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  farmington: () => import('./farmington').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  flambeau: () => import('./flambeau').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  flint_al: () => import('./flint_al').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  fox_il: () => import('./fox_il').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  french_broad: () => import('./french_broad').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  gasconade: () => import('./gasconade').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  great_egg: () => import('./great_egg').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  great_miami_oh: () => import('./great_miami_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  gulkana_ak: () => import('./gulkana_ak').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  gunnison_main: () => import('./gunnison_main').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  hillsborough: () => import('./hillsborough').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  hiwassee: () => import('./hiwassee').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  hoback: () => import('./hoback').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  holston: () => import('./holston').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  jacks_fork: () => import('./jacks_fork').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  jackson_va: () => import('./jackson_va').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  james_sd: () => import('./james_sd').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  john_day: () => import('./john_day').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  juniata: () => import('./juniata').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  kankakee_il: () => import('./kankakee_il').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  kentucky: () => import('./kentucky').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  klamath: () => import('./klamath').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  kobuk_ak: () => import('./kobuk_ak').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  kokosing: () => import('./kokosing').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  lacombe: () => import('./lacombe').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  licking: () => import('./licking').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  little_sc: () => import('./little_sc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  little_tennessee: () => import('./little_tennessee').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  lumber: () => import('./lumber').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  lynches: () => import('./lynches').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  mad_vt: () => import('./mad_vt').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  manistique_mi: () => import('./manistique_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  maumee: () => import('./maumee').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  maurice: () => import('./maurice').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  maury: () => import('./maury').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  mckenzie: () => import('./mckenzie').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  meadow: () => import('./meadow').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  menominee_wi: () => import('./menominee_wi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  mf_salmon: () => import('./mf_salmon').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  milwaukee_wi: () => import('./milwaukee_wi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  missisquoi: () => import('./missisquoi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  mountain_fork: () => import('./mountain_fork').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  muscatatuck: () => import('./muscatatuck').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  musconetcong: () => import('./musconetcong').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  nantahala_lake: () => import('./nantahala_lake').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  nolichucky: () => import('./nolichucky').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  north_branch: () => import('./north_branch').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  north_umpqua: () => import('./north_umpqua').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  olentangy: () => import('./olentangy').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  otter_creek: () => import('./otter_creek').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  pawcatuck: () => import('./pawcatuck').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  pigeon_tn: () => import('./pigeon_tn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  pine_wi: () => import('./pine_wi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  rainbow: () => import('./rainbow').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  rapidan: () => import('./rapidan').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  red_river_nm: () => import('./red_river_nm').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  rio_chama: () => import('./rio_chama').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  roanoke: () => import('./roanoke').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  roaring_fork: () => import('./roaring_fork').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  rock_il: () => import('./rock_il').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  rockcastle: () => import('./rockcastle').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  sacramento: () => import('./sacramento').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  salmon_ct: () => import('./salmon_ct').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  sandy: () => import('./sandy').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  santa_fe: () => import('./santa_fe').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  schuylkill: () => import('./schuylkill').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  scioto: () => import('./scioto').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  selway: () => import('./selway').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  slate_run_pa: () => import('./slate_run_pa').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  smith: () => import('./smith').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  south_platte: () => import('./south_platte').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  spring_creek_pa: () => import('./spring_creek_pa').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  st_croix: () => import('./st_croix').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  st_francis: () => import('./st_francis').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  sudbury_ma: () => import('./sudbury_ma').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  susquehanna: () => import('./susquehanna').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  tellico_tn: () => import('./tellico_tn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  tippecanoe: () => import('./tippecanoe').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  trinity: () => import('./trinity').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  tuckasegee: () => import('./tuckasegee').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  turkey: () => import('./turkey').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  tuscarawas: () => import('./tuscarawas').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  tyger_sc: () => import('./tyger_sc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  volga: () => import('./volga').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  wabash_in: () => import('./wabash_in').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  waccamaw: () => import('./waccamaw').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  wapsipinicon: () => import('./wapsipinicon').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  wateree: () => import('./wateree').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  white_clay: () => import('./white_clay').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  white_vt: () => import('./white_vt').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  wildcat_in: () => import('./wildcat_in').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  wilson_creek_nc: () => import('./wilson_creek_nc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  wisconsin: () => import('./wisconsin').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  wolf_ms: () => import('./wolf_ms').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  yellow_ia: () => import('./yellow_ia').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  alabama_al: () => import('./alabama_al').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  alatna_ak: () => import('./alatna_ak').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  allagash_me: () => import('./allagash_me').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  alsea_or: () => import('./alsea_or').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  altahama_ga: () => import('./altahama_ga').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  alum_oh: () => import('./alum_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  american_ca: () => import('./american_ca').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  anacostia_md: () => import('./anacostia_md').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  andreafsky_ak: () => import('./andreafsky_ak').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  aniakchak_ak: () => import('./aniakchak_ak').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  apalachia_lake_nc: () => import('./apalachia_lake_nc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  apalachicola_fl: () => import('./apalachicola_fl').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  appomattox_va: () => import('./appomattox_va').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  arkansas_ks: () => import('./arkansas_ks').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  ashaway_ri: () => import('./ashaway_ri').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  ashley_sc: () => import('./ashley_sc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  ashtabula_oh: () => import('./ashtabula_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  assabet_ma: () => import('./assabet_ma').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  aucilla_fl: () => import('./aucilla_fl').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  auglaize_oh: () => import('./auglaize_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  baraboo_wi: () => import('./baraboo_wi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  barren_ky: () => import('./barren_ky').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  bayou_bartholomew_ar: () => import('./bayou_bartholomew_ar').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  bayou_teche_la: () => import('./bayou_teche_la').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  bear_id: () => import('./bear_id').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  beaver_ak: () => import('./beaver_ak').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  beaver_ny: () => import('./beaver_ny').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  beaver_ri: () => import('./beaver_ri').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  big_cedar_ia: () => import('./big_cedar_ia').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  big_darby_oh: () => import('./big_darby_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  big_fork_mn: () => import('./big_fork_mn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  big_pine_in: () => import('./big_pine_in').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  big_piney_mo: () => import('./big_piney_mo').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  big_sioux_ia: () => import('./big_sioux_ia').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  big_south_fork_cumberland_tn: () => import('./big_south_fork_cumberland_tn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  big_walnut_in: () => import('./big_walnut_in').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  big_walnut_oh: () => import('./big_walnut_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  big_wood_id: () => import('./big_wood_id').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  bighorn_wy: () => import('./bighorn_wy').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  birch_ak: () => import('./birch_ak').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  black_hawk_ia: () => import('./black_hawk_ia').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  black_mo: () => import('./black_mo').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  black_oh: () => import('./black_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  blackfoot_id: () => import('./blackfoot_id').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  blackstone_ma: () => import('./blackstone_ma').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  blackwater_fl: () => import('./blackwater_fl').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  blanchard_oh: () => import('./blanchard_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  blue_earth_mn: () => import('./blue_earth_mn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  blue_mo: () => import('./blue_mo').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  boone_ia: () => import('./boone_ia').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  bourbeuse_mo: () => import('./bourbeuse_mo').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  boyer_ia: () => import('./boyer_ia').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  brule_mi: () => import('./brule_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  brule_wi_2: () => import('./brule_wi_2').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  bruneau_id: () => import('./bruneau_id').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  bryant_mo: () => import('./bryant_mo').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  buck_ky: () => import('./buck_ky').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  buck_oh: () => import('./buck_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  buffalo_ar: () => import('./buffalo_ar').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  buffalo_ia: () => import('./buffalo_ia').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  buffalo_tn: () => import('./buffalo_tn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  buggs_island_beechwood_flats_water_trail_va: () => import('./buggs_island_beechwood_flats_water_trail_va').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  burt_lake_mi: () => import('./burt_lake_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  caesar_oh: () => import('./caesar_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  calumet_il: () => import('./calumet_il').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  canyon_ca: () => import('./canyon_ca').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  captina_oh: () => import('./captina_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  carp_mi: () => import('./carp_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  carson_nv: () => import('./carson_nv').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  cashie_nc: () => import('./cashie_nc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  castor_mo: () => import('./castor_mo').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  catawba_sc: () => import('./catawba_sc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  cedar_mn: () => import('./cedar_mn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  cedar_ne: () => import('./cedar_ne').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  chariton_ia: () => import('./chariton_ia').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  charley_ak: () => import('./charley_ak').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  chattahoochee_ga: () => import('./chattahoochee_ga').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  chattooga_sc_2: () => import('./chattooga_sc_2').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  chatuge_lake_nc: () => import('./chatuge_lake_nc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  chauga_sc: () => import('./chauga_sc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  cheoah_nc: () => import('./cheoah_nc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  chicago_il: () => import('./chicago_il').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  chickahominy_water_trail_va: () => import('./chickahominy_water_trail_va').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  chilikadrotna_ak: () => import('./chilikadrotna_ak').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  chipola_fl: () => import('./chipola_fl').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  chippewa_mn: () => import('./chippewa_mn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  chippewa_wi: () => import('./chippewa_wi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  choctawhatchee_fl: () => import('./choctawhatchee_fl').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  clarks_fork_of_the_yellowstone_wy: () => import('./clarks_fork_of_the_yellowstone_wy').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  clear_ca: () => import('./clear_ca').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  clear_tn: () => import('./clear_tn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  clear_tn_2: () => import('./clear_tn_2').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  clearwater_id: () => import('./clearwater_id').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  clinch_tn: () => import('./clinch_tn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  clinton_mi: () => import('./clinton_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  coal_wv: () => import('./coal_wv').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  colorado_co: () => import('./colorado_co').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  colorado_nv: () => import('./colorado_nv').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  colorado_ut: () => import('./colorado_ut').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  combahee_sc: () => import('./combahee_sc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  conestoga_pa: () => import('./conestoga_pa').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  conneaut_oh: () => import('./conneaut_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  conodoguinet_pa: () => import('./conodoguinet_pa').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  conotton_oh: () => import('./conotton_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  coosaw_river_icw_sc: () => import('./coosaw_river_icw_sc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  coosawhatchie_sc: () => import('./coosawhatchie_sc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  cottonwood_mn: () => import('./cottonwood_mn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  courtois_mo: () => import('./courtois_mo').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  crooked_ar: () => import('./crooked_ar').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  crooked_or: () => import('./crooked_or').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  crow_river_north_mn: () => import('./crow_river_north_mn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  crow_river_south_mn: () => import('./crow_river_south_mn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  cumberland_ky: () => import('./cumberland_ky').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  daddys_tn: () => import('./daddys_tn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  dan_va: () => import('./dan_va').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  deep_id: () => import('./deep_id').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  deep_in: () => import('./deep_in').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  deer_oh: () => import('./deer_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  delaware_pa_2: () => import('./delaware_pa_2').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  delta_ak: () => import('./delta_ak').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  dennison_ak: () => import('./dennison_ak').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  des_moines_mn: () => import('./des_moines_mn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  detroit_mi: () => import('./detroit_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  dirty_devil_ut: () => import('./dirty_devil_ut').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  dolores_co: () => import('./dolores_co').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  donner_und_blitzen_or: () => import('./donner_und_blitzen_or').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  driftwood_in: () => import('./driftwood_in').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  duck_oh: () => import('./duck_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  dupage_il: () => import('./dupage_il').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  east_branch_ashtabula_oh: () => import('./east_branch_ashtabula_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  east_branch_chagrin_oh: () => import('./east_branch_chagrin_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  east_branch_salmon_brook_ct: () => import('./east_branch_salmon_brook_ct').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  east_branch_whitefish_mi: () => import('./east_branch_whitefish_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  east_fork_andreafsky_ak: () => import('./east_fork_andreafsky_ak').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  east_fork_carson_ca: () => import('./east_fork_carson_ca').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  east_fork_des_moines_ia: () => import('./east_fork_des_moines_ia').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  east_fork_white_in: () => import('./east_fork_white_in').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  east_nishnabotna_ia: () => import('./east_nishnabotna_ia').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  eau_claire_wi: () => import('./eau_claire_wi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  econfina_fl: () => import('./econfina_fl').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  econolockhatchee_fl: () => import('./econolockhatchee_fl').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  eightmile_ct: () => import('./eightmile_ct').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  elk_mo: () => import('./elk_mo').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  elk_or: () => import('./elk_or').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  elkhart_in: () => import('./elkhart_in').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  elkhorn_ky: () => import('./elkhorn_ky').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  embarras_il: () => import('./embarras_il').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  encampment_wy: () => import('./encampment_wy').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  english_ia: () => import('./english_ia').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  escalante_co: () => import('./escalante_co').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  escalante_ut: () => import('./escalante_ut').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  everglades_fl: () => import('./everglades_fl').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  fawn_in: () => import('./fawn_in').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  flatrock_in: () => import('./flatrock_in').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  flint_mi: () => import('./flint_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  fontana_lake_nc: () => import('./fontana_lake_nc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  fortymile_ak: () => import('./fortymile_ak').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  fox_wi: () => import('./fox_wi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  fraser_co: () => import('./fraser_co').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  french_broad_tn: () => import('./french_broad_tn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  french_pa: () => import('./french_pa').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  gasper_ky: () => import('./gasper_ky').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  generals_cut_ga: () => import('./generals_cut_ga').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  grand_ia: () => import('./grand_ia').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  grand_mi: () => import('./grand_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  grand_mo: () => import('./grand_mo').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  grande_ronde_or: () => import('./grande_ronde_or').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  grande_ronde_wa: () => import('./grande_ronde_wa').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  great_pee_dee_sc: () => import('./great_pee_dee_sc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  green_fall_ct: () => import('./green_fall_ct').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  green_nc_2: () => import('./green_nc_2').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  green_ut: () => import('./green_ut').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  greenville_oh: () => import('./greenville_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  gunnison_co: () => import('./gunnison_co').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  guyandotte_wv: () => import('./guyandotte_wv').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  hamlin_lake_mi: () => import('./hamlin_lake_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  harpeth_tn: () => import('./harpeth_tn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  hatchie_tn: () => import('./hatchie_tn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  hiwassee_nc: () => import('./hiwassee_nc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  holmes_fl: () => import('./holmes_fl').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  holston_tn: () => import('./holston_tn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  hudson_ny: () => import('./hudson_ny').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  huron_oh: () => import('./huron_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  hurricane_ar: () => import('./hurricane_ar').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  huzzah_mo: () => import('./huzzah_mo').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  illinois_il: () => import('./illinois_il').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  indian_mi: () => import('./indian_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  iowa_ia: () => import('./iowa_ia').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  iroquois_il: () => import('./iroquois_il').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  iroquois_in: () => import('./iroquois_in').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  ivishak_ak: () => import('./ivishak_ak').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  james_mo: () => import('./james_mo').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  jarbidge_id: () => import('./jarbidge_id').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  john_ak: () => import('./john_ak').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  johns_va: () => import('./johns_va').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  kankakee_in: () => import('./kankakee_in').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  kansas_ks: () => import('./kansas_ks').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  kaskaskia_il: () => import('./kaskaskia_il').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  kennebec_me: () => import('./kennebec_me').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  killbuck_oh: () => import('./killbuck_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  kishwaukee_il: () => import('./kishwaukee_il').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  kiski_conemaugh_pa: () => import('./kiski_conemaugh_pa').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  klickitat_wa: () => import('./klickitat_wa').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  la_moine_il: () => import('./la_moine_il').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  lake_erie_mi: () => import('./lake_erie_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  lake_eustis_run_fl: () => import('./lake_eustis_run_fl').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  lake_glenville_nc: () => import('./lake_glenville_nc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  lake_harris_run_fl: () => import('./lake_harris_run_fl').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  lake_huron_mi: () => import('./lake_huron_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  lake_louisa_state_park_trail_fl: () => import('./lake_louisa_state_park_trail_fl').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  lake_michigan_il: () => import('./lake_michigan_il').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  lake_michigan_mi: () => import('./lake_michigan_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  lake_red_rock_ia: () => import('./lake_red_rock_ia').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  lake_santeelah_nc: () => import('./lake_santeelah_nc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  lake_st_clair_mi: () => import('./lake_st_clair_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  lake_superior_mi: () => import('./lake_superior_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  lake_superior_mn: () => import('./lake_superior_mn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  lake_superior_wi: () => import('./lake_superior_wi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  lamine_mo: () => import('./lamine_mo').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  lamprey_nh: () => import('./lamprey_nh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  lawsons_fork_sc: () => import('./lawsons_fork_sc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  licking_oh: () => import('./licking_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  little_al: () => import('./little_al').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  little_beaver_oh: () => import('./little_beaver_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  little_cedar_ia: () => import('./little_cedar_ia').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  little_darby_oh: () => import('./little_darby_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  little_fork_mn: () => import('./little_fork_mn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  little_manatee_fl: () => import('./little_manatee_fl').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  little_muskingum_oh: () => import('./little_muskingum_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  little_pee_dee_sc: () => import('./little_pee_dee_sc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  little_scioto_oh: () => import('./little_scioto_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  little_sioux_ia: () => import('./little_sioux_ia').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  little_south_fork_cumberland_ky: () => import('./little_south_fork_cumberland_ky').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  little_tn: () => import('./little_tn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  lizard_ia: () => import('./lizard_ia').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  logging_cabin_ak: () => import('./logging_cabin_ak').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  long_prairie_mn: () => import('./long_prairie_mn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  loramie_oh: () => import('./loramie_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  lower_elkhorn_ne: () => import('./lower_elkhorn_ne').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  lower_ochlockonee_river_state_trail_fl: () => import('./lower_ochlockonee_river_state_trail_fl').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  lower_saluda_sc: () => import('./lower_saluda_sc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  lower_suwannee_national_wildlife_refuge_trail_fl: () => import('./lower_suwannee_national_wildlife_refuge_trail_fl').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  lower_suwannee_river_trail_fl: () => import('./lower_suwannee_river_trail_fl').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  loyalhanna_pa: () => import('./loyalhanna_pa').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  lumber_nc: () => import('./lumber_nc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  mahoning_oh: () => import('./mahoning_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  manitowish_wi: () => import('./manitowish_wi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  mathews_county_blueways_va: () => import('./mathews_county_blueways_va').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  mattaponi_and_pamunkey_rivers_trail_va: () => import('./mattaponi_and_pamunkey_rivers_trail_va').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  mattole_ca: () => import('./mattole_ca').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  maumee_in: () => import('./maumee_in').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  maury_river_water_trail_va: () => import('./maury_river_water_trail_va').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  meherrin_river_trail_va: () => import('./meherrin_river_trail_va').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  middle_branch_ontonagon_mi: () => import('./middle_branch_ontonagon_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  middle_fork_clearwater_id: () => import('./middle_fork_clearwater_id').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  middle_fork_eel_ca: () => import('./middle_fork_eel_ca').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  middle_fork_feather_ca: () => import('./middle_fork_feather_ca').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  middle_fork_flathead_mt: () => import('./middle_fork_flathead_mt').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  middle_fork_fortymile_ak: () => import('./middle_fork_fortymile_ak').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  middle_fork_kings_ca: () => import('./middle_fork_kings_ca').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  middle_fork_salmon_id: () => import('./middle_fork_salmon_id').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  middle_fork_smith_ca: () => import('./middle_fork_smith_ca').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  middle_fork_vermillion_il: () => import('./middle_fork_vermillion_il').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  middle_grand_mi: () => import('./middle_grand_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  middle_ia: () => import('./middle_ia').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  middle_raccoon_ia: () => import('./middle_raccoon_ia').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  middle_saluda_sc: () => import('./middle_saluda_sc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  middle_susquehanna_pa: () => import('./middle_susquehanna_pa').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  mill_wv: () => import('./mill_wv').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  minnesota_mn: () => import('./minnesota_mn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  mississinewa_in: () => import('./mississinewa_in').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  mississippi_ia: () => import('./mississippi_ia').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  mississippi_il: () => import('./mississippi_il').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  mississippi_mn: () => import('./mississippi_mn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  mississippi_mo: () => import('./mississippi_mo').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  missouri_ia: () => import('./missouri_ia').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  missouri_mo: () => import('./missouri_mo').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  missouri_mt_2: () => import('./missouri_mt_2').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  molalla_or: () => import('./molalla_or').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  mongaup_ny: () => import('./mongaup_ny').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  monogahela_pa: () => import('./monogahela_pa').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  monongahela_wv: () => import('./monongahela_wv').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  montreal_wi: () => import('./montreal_wi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  moose_ak: () => import('./moose_ak').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  muddy_ut: () => import('./muddy_ut').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  mulchatna_ak: () => import('./mulchatna_ak').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  mullett_lake_mi: () => import('./mullett_lake_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  muskingum_oh: () => import('./muskingum_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  myakka_fl: () => import('./myakka_fl').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  nantahala_lake_nc: () => import('./nantahala_lake_nc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  nashua_ma: () => import('./nashua_ma').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  new_ca: () => import('./new_ca').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  new_nc: () => import('./new_nc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  new_tn: () => import('./new_tn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  niangua_mo: () => import('./niangua_mo').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  nippersink_il: () => import('./nippersink_il').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  nissitissit_nh: () => import('./nissitissit_nh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  noatak_ak: () => import('./noatak_ak').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  nolichucky_nc_2: () => import('./nolichucky_nc_2').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  nonvianuk_ak: () => import('./nonvianuk_ak').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  north_branch_chicago_il: () => import('./north_branch_chicago_il').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  north_branch_potomac_md: () => import('./north_branch_potomac_md').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  north_branch_susquehanna_pa: () => import('./north_branch_susquehanna_pa').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  north_fork_american_ca: () => import('./north_fork_american_ca').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  north_fork_edisto_sc: () => import('./north_fork_edisto_sc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  north_fork_eel_ca: () => import('./north_fork_eel_ca').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  north_fork_feather_ca: () => import('./north_fork_feather_ca').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  north_fork_flambeau_wi: () => import('./north_fork_flambeau_wi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  north_fork_flathead_mt: () => import('./north_fork_flathead_mt').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  north_fork_fortymile_ak: () => import('./north_fork_fortymile_ak').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  north_fork_john_day_or: () => import('./north_fork_john_day_or').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  north_fork_koyukuk_ak: () => import('./north_fork_koyukuk_ak').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  north_fork_maquoketa_ia: () => import('./north_fork_maquoketa_ia').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  north_fork_mokelumne_ca: () => import('./north_fork_mokelumne_ca').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  north_fork_owyhee_id: () => import('./north_fork_owyhee_id').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  north_fork_owyhee_or: () => import('./north_fork_owyhee_or').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  north_fork_paint_oh: () => import('./north_fork_paint_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  north_fork_rogue_or: () => import('./north_fork_rogue_or').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  north_fork_shoshone_wy: () => import('./north_fork_shoshone_wy').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  north_fork_smith_ca: () => import('./north_fork_smith_ca').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  north_fork_trinity_ca: () => import('./north_fork_trinity_ca').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  north_fork_virgin_ut: () => import('./north_fork_virgin_ut').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  north_ia: () => import('./north_ia').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  north_platte_co: () => import('./north_platte_co').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  north_platte_wy: () => import('./north_platte_wy').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  north_raccoon_ia: () => import('./north_raccoon_ia').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  north_saluda_sc: () => import('./north_saluda_sc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  north_skunk_ia: () => import('./north_skunk_ia').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  north_sylamore_ar: () => import('./north_sylamore_ar').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  north_tyger_sc: () => import('./north_tyger_sc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  northern_forest_canoe_trail_me: () => import('./northern_forest_canoe_trail_me').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  northern_forest_canoe_trail_nh: () => import('./northern_forest_canoe_trail_nh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  northern_forest_canoe_trail_ny: () => import('./northern_forest_canoe_trail_ny').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  northern_forest_canoe_trail_vt: () => import('./northern_forest_canoe_trail_vt').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  nowitna_ak: () => import('./nowitna_ak').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  obed_tn: () => import('./obed_tn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  occoquan_water_trail_va: () => import('./occoquan_water_trail_va').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  ocheyedan_ia: () => import('./ocheyedan_ia').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  ochlockonee_fl: () => import('./ochlockonee_fl').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  ocmulgee_ga: () => import('./ocmulgee_ga').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  oconaluftee_nc: () => import('./oconaluftee_nc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  oh_be_joyful_co: () => import('./oh_be_joyful_co').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  ohio_brush_oh: () => import('./ohio_brush_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  ohio_il: () => import('./ohio_il').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  ohio_in: () => import('./ohio_in').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  ohio_pa: () => import('./ohio_pa').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  okanogan_wa: () => import('./okanogan_wa').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  ontonagon_mi: () => import('./ontonagon_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  osage_fork_gasconade_mo: () => import('./osage_fork_gasconade_mo').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  osage_mo: () => import('./osage_mo').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  ottawa_oh: () => import('./ottawa_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  otter_tail_mn: () => import('./otter_tail_mn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  owyhee_id: () => import('./owyhee_id').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  owyhee_or: () => import('./owyhee_or').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  pacolet_sc: () => import('./pacolet_sc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  paint_mi: () => import('./paint_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  paint_oh: () => import('./paint_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  paw_paw_mi: () => import('./paw_paw_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  pawcatuck_ct: () => import('./pawcatuck_ct').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  payette_id: () => import('./payette_id').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  payette_river_north_id: () => import('./payette_river_north_id').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  payette_river_south_id: () => import('./payette_river_south_id').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  pecatonica_il: () => import('./pecatonica_il').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  persimmon_lake_nc: () => import('./persimmon_lake_nc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  pigeon_in: () => import('./pigeon_in').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  pigg_va: () => import('./pigg_va').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  pike_wi: () => import('./pike_wi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  pine_mn: () => import('./pine_mn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  pomme_de_terre_mn: () => import('./pomme_de_terre_mn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  popple_wi: () => import('./popple_wi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  portage_oh: () => import('./portage_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  potomac_md: () => import('./potomac_md').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  presque_isle_mi: () => import('./presque_isle_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  price_ut: () => import('./price_ut').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  putnam_county_blueways_fl: () => import('./putnam_county_blueways_fl').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  pymatuning_oh: () => import('./pymatuning_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  quartzville_or: () => import('./quartzville_or').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  queen_ri: () => import('./queen_ri').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  raccoon_ia: () => import('./raccoon_ia').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  raccoon_oh: () => import('./raccoon_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  rappahannock_river_water_trail_va: () => import('./rappahannock_river_water_trail_va').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  rathbun_lake_ia: () => import('./rathbun_lake_ia').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  raystown_branch_juniata_pa: () => import('./raystown_branch_juniata_pa').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  red_cedar_wi: () => import('./red_cedar_wi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  red_ky: () => import('./red_ky').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  red_lake_mn: () => import('./red_lake_mn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  red_river_of_the_north_mn: () => import('./red_river_of_the_north_mn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  red_wi: () => import('./red_wi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  redwood_mn: () => import('./redwood_mn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  reedy_sc: () => import('./reedy_sc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  richland_ar: () => import('./richland_ar').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  rio_grande_co: () => import('./rio_grande_co').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  rio_grande_nm: () => import('./rio_grande_nm').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  rio_grande_tx: () => import('./rio_grande_tx').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  rivanna_river_water_trail_va: () => import('./rivanna_river_water_trail_va').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  river_raisin_mi: () => import('./river_raisin_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  rock_ia: () => import('./rock_ia').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  rock_springs_run_fl: () => import('./rock_springs_run_fl').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  rock_wi: () => import('./rock_wi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  rocky_oh: () => import('./rocky_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  ruby_lake_nv: () => import('./ruby_lake_nv').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  rum_mn: () => import('./rum_mn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  russell_ky_2: () => import('./russell_ky_2').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  s_fork_alsea_or: () => import('./s_fork_alsea_or').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  sac_mo: () => import('./sac_mo').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  saint_joe_id: () => import('./saint_joe_id').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  saint_joseph_oh: () => import('./saint_joseph_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  saint_joseph_river_fort_wayne_in: () => import('./saint_joseph_river_fort_wayne_in').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  saint_joseph_river_south_bend_in: () => import('./saint_joseph_river_south_bend_in').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  saint_marys_fl: () => import('./saint_marys_fl').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  saint_marys_oh: () => import('./saint_marys_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  salkehatchie_sc: () => import('./salkehatchie_sc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  salmon_ak: () => import('./salmon_ak').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  salmon_brook_ct: () => import('./salmon_brook_ct').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  salmon_id: () => import('./salmon_id').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  salmon_or: () => import('./salmon_or').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  salt_il: () => import('./salt_il').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  salt_oh: () => import('./salt_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  san_miguel_co: () => import('./san_miguel_co').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  san_rafael_ut: () => import('./san_rafael_ut').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  sandusky_oh: () => import('./sandusky_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  sandy_oh: () => import('./sandy_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  santee_sc: () => import('./santee_sc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  satilla_ga: () => import('./satilla_ga').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  sauk_mn: () => import('./sauk_mn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  scioto_brush_oh: () => import('./scioto_brush_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  scott_ca: () => import('./scott_ca').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  selawik_ak: () => import('./selawik_ak').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  shasta_ca: () => import('./shasta_ca').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  sheboygan_wi: () => import('./sheboygan_wi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  sheenjek_ak: () => import('./sheenjek_ak').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  sheep_id: () => import('./sheep_id').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  shell_rock_ia: () => import('./shell_rock_ia').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  shenango_pa: () => import('./shenango_pa').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  shoal_mo: () => import('./shoal_mo').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  shoal_river_state_fl: () => import('./shoal_river_state_fl').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  shunock_ct: () => import('./shunock_ct').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  similkameen_wa: () => import('./similkameen_wa').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  siuslaw_or: () => import('./siuslaw_or').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  skunk_ia: () => import('./skunk_ia').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  slate_ky: () => import('./slate_ky').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  snake_id: () => import('./snake_id').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  snake_mn: () => import('./snake_mn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  snake_river_henrys_id: () => import('./snake_river_henrys_id').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  snake_wy_2: () => import('./snake_wy_2').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  south_branch_black_mi: () => import('./south_branch_black_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  south_branch_elkhart_in: () => import('./south_branch_elkhart_in').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  south_branch_ontonagon_mi: () => import('./south_branch_ontonagon_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  south_fork_american_ca: () => import('./south_fork_american_ca').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  south_fork_edisto_sc: () => import('./south_fork_edisto_sc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  south_fork_eel_ca: () => import('./south_fork_eel_ca').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  south_fork_flambeau_wi: () => import('./south_fork_flambeau_wi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  south_fork_flathead_mt: () => import('./south_fork_flathead_mt').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  south_fork_fortymile_ak: () => import('./south_fork_fortymile_ak').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  south_fork_holston_tn: () => import('./south_fork_holston_tn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  south_fork_iowa_ia: () => import('./south_fork_iowa_ia').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  south_fork_kings_ca: () => import('./south_fork_kings_ca').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  south_fork_licking_ky: () => import('./south_fork_licking_ky').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  south_fork_merced_ca: () => import('./south_fork_merced_ca').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  south_fork_of_the_snake_id: () => import('./south_fork_of_the_snake_id').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  south_fork_owyhee_id: () => import('./south_fork_owyhee_id').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  south_fork_owyhee_nv: () => import('./south_fork_owyhee_nv').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  south_fork_shenandoah_va: () => import('./south_fork_shenandoah_va').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  south_fork_smith_ca: () => import('./south_fork_smith_ca').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  south_fork_trinity_ca: () => import('./south_fork_trinity_ca').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  south_fork_yuba_ca: () => import('./south_fork_yuba_ca').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  south_raccoon_ia: () => import('./south_raccoon_ia').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  south_saluda_sc: () => import('./south_saluda_sc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  south_skunk_ia: () => import('./south_skunk_ia').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  south_tyger_sc: () => import('./south_tyger_sc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  spoon_il: () => import('./spoon_il').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  squannacook_ma: () => import('./squannacook_ma').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  st_clair_mi: () => import('./st_clair_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  st_croix_wi: () => import('./st_croix_wi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  st_johns_fl: () => import('./st_johns_fl').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  st_joseph_mi: () => import('./st_joseph_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  st_marys_mi: () => import('./st_marys_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  stevens_sc: () => import('./stevens_sc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  stillwater_oh: () => import('./stillwater_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  stone_lakes_ca: () => import('./stone_lakes_ca').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  stono_sc: () => import('./stono_sc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  straight_mn: () => import('./straight_mn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  sturgeon_mi_2: () => import('./sturgeon_mi_2').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  suffolk_blue_water_trail_va: () => import('./suffolk_blue_water_trail_va').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  sugar_oh: () => import('./sugar_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  sugar_wi: () => import('./sugar_wi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  sultan_wa: () => import('./sultan_wa').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  sunfish_oh: () => import('./sunfish_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  suwannee_ga: () => import('./suwannee_ga').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  swan_mt: () => import('./swan_mt').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  swatara_pa: () => import('./swatara_pa').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  symmes_oh: () => import('./symmes_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  table_rock_or: () => import('./table_rock_or').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  tallapoosa_ga: () => import('./tallapoosa_ga').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  tangle_ak: () => import('./tangle_ak').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  taunton_ma: () => import('./taunton_ma').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  tennessee_tn: () => import('./tennessee_tn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  teton_id: () => import('./teton_id').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  tidal_delaware_pa: () => import('./tidal_delaware_pa').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  timucuan_ecological_and_historic_preserve_trail_fl: () => import('./timucuan_ecological_and_historic_preserve_trail_fl').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  tinkers_oh: () => import('./tinkers_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  tlikakila_ak: () => import('./tlikakila_ak').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  tomahawk_wi: () => import('./tomahawk_wi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  totagatic_wi: () => import('./totagatic_wi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  town_sc: () => import('./town_sc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  trammel_ky: () => import('./trammel_ky').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  trout_vt: () => import('./trout_vt').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  twelve_mile_sc: () => import('./twelve_mile_sc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  twin_oh: () => import('./twin_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  tygarts_ky: () => import('./tygarts_ky').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  umbagog_lake_nh: () => import('./umbagog_lake_nh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  umpqua_or: () => import('./umpqua_or').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  umpqua_river_south_or: () => import('./umpqua_river_south_or').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  unalakleet_ak: () => import('./unalakleet_ak').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  upper_cheat_wv: () => import('./upper_cheat_wv').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  upper_elkhorn_ne: () => import('./upper_elkhorn_ne').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  upper_green_ky: () => import('./upper_green_ky').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  upper_james_river_water_trail_va: () => import('./upper_james_river_water_trail_va').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  upper_saluda_sc: () => import('./upper_saluda_sc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  upper_suwannee_river_trail_fl: () => import('./upper_suwannee_river_trail_fl').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  usquepaug_ri: () => import('./usquepaug_ri').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  valley_nc: () => import('./valley_nc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  van_duzen_ca: () => import('./van_duzen_ca').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  vermilion_mn: () => import('./vermilion_mn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  virginia_seaside_water_trail_va: () => import('./virginia_seaside_water_trail_va').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  wabash_il: () => import('./wabash_il').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  waccamaw_river_icw_sc: () => import('./waccamaw_river_icw_sc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  walhonding_oh: () => import('./walhonding_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  wallowa_or: () => import('./wallowa_or').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  watonwan_mn: () => import('./watonwan_mn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  wekiva_river_rock_springs_run_fl: () => import('./wekiva_river_rock_springs_run_fl').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  west_branch_dupage_il: () => import('./west_branch_dupage_il').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  west_branch_farmington_ct: () => import('./west_branch_farmington_ct').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  west_branch_ontonagon_mi: () => import('./west_branch_ontonagon_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  west_branch_penobscot_me: () => import('./west_branch_penobscot_me').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  west_branch_salmon_brook_ct: () => import('./west_branch_salmon_brook_ct').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  west_branch_susquehanna_pa: () => import('./west_branch_susquehanna_pa').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  west_branch_whitefish_mi: () => import('./west_branch_whitefish_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  west_chickamauga_ga: () => import('./west_chickamauga_ga').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  west_fork_bruneau_id: () => import('./west_fork_bruneau_id').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  west_fork_cedar_ia: () => import('./west_fork_cedar_ia').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  west_fork_dennison_ak: () => import('./west_fork_dennison_ak').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  west_fork_drakes_ky: () => import('./west_fork_drakes_ky').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  west_fork_tuckasegee_nc: () => import('./west_fork_tuckasegee_nc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  west_nishnabotna_ia: () => import('./west_nishnabotna_ia').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  white_oak_oh: () => import('./white_oak_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  white_or: () => import('./white_or').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  white_ut: () => import('./white_ut').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  white_wi: () => import('./white_wi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  whitewater_ia: () => import('./whitewater_ia').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  willamette_or: () => import('./willamette_or').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  wills_oh: () => import('./wills_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  wind_ak: () => import('./wind_ak').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  winnebago_ia: () => import('./winnebago_ia').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  withlacoochee_fl: () => import('./withlacoochee_fl').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  withlacoochee_river_north_trail_fl: () => import('./withlacoochee_river_north_trail_fl').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  wolf_tn: () => import('./wolf_tn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  wood_ct: () => import('./wood_ct').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  yahara_wi: () => import('./yahara_wi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  yakima_wa: () => import('./yakima_wa').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  yellow_breeches_pa: () => import('./yellow_breeches_pa').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  yellow_fl: () => import('./yellow_fl').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  yellow_ga: () => import('./yellow_ga').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  yellow_ia_2: () => import('./yellow_ia_2').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  zumbro_mn: () => import('./zumbro_mn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  zumbro_river_middle_mn: () => import('./zumbro_river_middle_mn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  zumbro_river_north_branch_mn: () => import('./zumbro_river_north_branch_mn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  zumbro_river_south_branch_mn: () => import('./zumbro_river_south_branch_mn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  abrams_creek_tn: () => import('./abrams_creek_tn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  amicalola: () => import('./amicalola').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  amite: () => import('./amite').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  antietam_creek: () => import('./antietam_creek').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  apple_il: () => import('./apple_il').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  bantam: () => import('./bantam').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  baron_fork: () => import('./baron_fork').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  big_bend: () => import('./big_bend').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  big_hole: () => import('./big_hole').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  big_manistee_lake: () => import('./big_manistee_lake').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  black_wi: () => import('./black_wi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  blanco: () => import('./blanco').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  blue_co: () => import('./blue_co').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  boyne_mi: () => import('./boyne_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  brodhead_pa: () => import('./brodhead_pa').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  cacapon: () => import('./cacapon').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  cache_creek: () => import('./cache_creek').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  caney: () => import('./caney').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  cannonball: () => import('./cannonball').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  cape_fear: () => import('./cape_fear').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  carson: () => import('./carson').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  charles_ma: () => import('./charles_ma').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  cheyenne_sd: () => import('./cheyenne_sd').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  citico_creek_tn: () => import('./citico_creek_tn').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  clark_fork: () => import('./clark_fork').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  cloquet: () => import('./cloquet').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  colorado_glenwood: () => import('./colorado_glenwood').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  colorado_pumphouse: () => import('./colorado_pumphouse').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  colorado_tx: () => import('./colorado_tx').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  columbia: () => import('./columbia').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  comal: () => import('./comal').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  comite: () => import('./comite').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  connecticut_nh: () => import('./connecticut_nh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  contoocook: () => import('./contoocook').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  coosawattee: () => import('./coosawattee').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  cranberry: () => import('./cranberry').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  cumberland_wolf_ky: () => import('./cumberland_wolf_ky').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  davidson: () => import('./davidson').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  delaware_ny: () => import('./delaware_ny').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  dowagiac: () => import('./dowagiac').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  dry_fork_wv: () => import('./dry_fork_wv').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  east_walker: () => import('./east_walker').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  eel: () => import('./eel').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  elk_wv: () => import('./elk_wv').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  ellis: () => import('./ellis').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  feather: () => import('./feather').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  fossil_creek: () => import('./fossil_creek').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  frying_pan: () => import('./frying_pan').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  genesee: () => import('./genesee').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  green_lodore: () => import('./green_lodore').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  green_nc: () => import('./green_nc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  green_wa: () => import('./green_wa').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  greys: () => import('./greys').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  gunpowder: () => import('./gunpowder').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  hanalei_hi: () => import('./hanalei_hi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  haw: () => import('./haw').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  hazel_creek_nc: () => import('./hazel_creek_nc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  heart: () => import('./heart').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  henrys_fork: () => import('./henrys_fork').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  hunt: () => import('./hunt').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  illinois_bayou: () => import('./illinois_bayou').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  illinois_or: () => import('./illinois_or').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  jackson_river_va: () => import('./jackson_river_va').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  jemez: () => import('./jemez').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  kaw: () => import('./kaw').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  kawishiwi: () => import('./kawishiwi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  kettle_creek_pa: () => import('./kettle_creek_pa').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  kings: () => import('./kings').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  kings_ar: () => import('./kings_ar').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  knife: () => import('./knife').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  lackawaxen: () => import('./lackawaxen').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  little_juniata: () => import('./little_juniata').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  little_river_al: () => import('./little_river_al').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  locust_fork: () => import('./locust_fork').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  logan: () => import('./logan').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  loup: () => import('./loup').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  mackinaw: () => import('./mackinaw').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  mad_oh: () => import('./mad_oh').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  madison: () => import('./madison').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  maple_mi: () => import('./maple_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  marais: () => import('./marais').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  medina: () => import('./medina').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  merrimack: () => import('./merrimack').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  middle_loup: () => import('./middle_loup').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  mohawk: () => import('./mohawk').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  monocacy: () => import('./monocacy').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  mossy_creek_va: () => import('./mossy_creek_va').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  mulberry_al: () => import('./mulberry_al').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  napa: () => import('./napa').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  natchaug: () => import('./natchaug').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  neosho: () => import('./neosho').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  neuse: () => import('./neuse').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  neversink_ny: () => import('./neversink_ny').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  nolichucky_nc: () => import('./nolichucky_nc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  north_fork_white: () => import('./north_fork_white').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  oak_creek: () => import('./oak_creek').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  oconee: () => import('./oconee').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  patapsco: () => import('./patapsco').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  patuxent: () => import('./patuxent').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  paulins_kill: () => import('./paulins_kill').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  pawtuxet: () => import('./pawtuxet').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  pearl: () => import('./pearl').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  pecos_nm: () => import('./pecos_nm').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  pee_dee: () => import('./pee_dee').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  pembina: () => import('./pembina').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  penns_creek: () => import('./penns_creek').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  pit: () => import('./pit').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  poudre: () => import('./poudre').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  priest: () => import('./priest').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  provo: () => import('./provo').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  quinnipiac: () => import('./quinnipiac').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  rapid_creek: () => import('./rapid_creek').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  rapid_me: () => import('./rapid_me').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  red_river: () => import('./red_river').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  republican: () => import('./republican').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  russell_ky: () => import('./russell_ky').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  russian: () => import('./russian').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  sabine: () => import('./sabine').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  sacandaga: () => import('./sacandaga').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  salmon_ca: () => import('./salmon_ca').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  salt_river: () => import('./salt_river').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  san_antonio: () => import('./san_antonio').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  san_marcos: () => import('./san_marcos').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  sangamon: () => import('./sangamon').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  sauk: () => import('./sauk').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  seneca_creek_wv: () => import('./seneca_creek_wv').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  shenandoah: () => import('./shenandoah').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  shepaug: () => import('./shepaug').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  sheyenne: () => import('./sheyenne').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  sipsey_fork: () => import('./sipsey_fork').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  skagit: () => import('./skagit').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  skykomish: () => import('./skykomish').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  slippery_rock: () => import('./slippery_rock').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  smoky_hill: () => import('./smoky_hill').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  solomon: () => import('./solomon').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  south_branch: () => import('./south_branch').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  south_river_va: () => import('./south_river_va').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  south_toe_nc: () => import('./south_toe_nc').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  spearfish: () => import('./spearfish').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  stanislaus: () => import('./stanislaus').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  sturgeon_mi: () => import('./sturgeon_mi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  tallapoosa: () => import('./tallapoosa').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  tangipahoa: () => import('./tangipahoa').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  taylor: () => import('./taylor').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  tchefuncte: () => import('./tchefuncte').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  ten_mile: () => import('./ten_mile').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  tieton: () => import('./tieton').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  tohickon: () => import('./tohickon').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  truckee_ca: () => import('./truckee_ca').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  wailua_hi: () => import('./wailua_hi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  wailuku_hi: () => import('./wailuku_hi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  waimea_hi: () => import('./waimea_hi').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  walker: () => import('./walker').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  watauga: () => import('./watauga').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  weber: () => import('./weber').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  westwater: () => import('./westwater').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  wharton: () => import('./wharton').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  white_sd: () => import('./white_sd').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  williams_wv: () => import('./williams_wv').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  willowemoc_ny: () => import('./willowemoc_ny').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  woonasquatucket: () => import('./woonasquatucket').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  yellowstone: () => import('./yellowstone').then(m => ({
    accessPoints: m.accessPoints,
    sections: m.sections,
    riverPath: m.riverPath,
  })),
  yuba: () => import('./yuba').then(m => ({
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
