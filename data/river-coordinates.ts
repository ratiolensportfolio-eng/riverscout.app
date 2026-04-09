// Approximate GPS coordinates for each river (used for state map dots)
// Based on USGS gauge locations and river midpoints
// Format: [latitude, longitude]

export const RIVER_COORDS: Record<string, [number, number]> = {
  // Michigan LP
  ausable: [44.60, -84.13],
  manistee: [44.25, -85.98],
  muskegon: [43.56, -85.92],
  pine_mi: [44.15, -85.72],
  pere_marquette: [43.95, -86.20],
  boardman: [44.72, -85.55],
  jordan: [44.95, -85.10],
  betsie: [44.63, -86.10],
  platte_mi: [44.72, -86.05],
  rifle: [44.10, -84.02],
  huron_mi: [42.28, -83.74],
  flat_river: [43.15, -85.22],
  thornapple: [42.72, -85.25],
  crystal_mi: [44.88, -86.03],
  ausable_sb: [44.43, -84.72],
  black_cheboygan: [45.35, -84.30],
  cass: [43.48, -83.37],
  chippewa_mi: [43.60, -84.90],
  dowagiac: [41.98, -86.10],
  kalamazoo: [42.50, -86.00],
  little_manistee: [44.02, -86.05],
  little_muskegon: [43.65, -85.50],
  ocqueoc: [45.37, -84.05],
  pigeon_mi: [45.00, -84.45],
  shiawassee: [42.92, -84.02],
  sturgeon_lp: [45.02, -84.65],
  thunder_bay: [44.90, -83.68],
  white_mi: [43.60, -86.15],
  big_manistee_lake: [44.28, -85.82],
  sturgeon_mi: [45.02, -84.68],
  rogue_mi: [43.10, -85.58],
  maple_mi: [45.42, -84.88],
  coldwater_mi: [42.00, -85.00],
  // Michigan UP
  twohearted: [46.68, -85.60],

  // West Virginia
  gauley: [38.22, -80.90],
  newriver: [38.07, -81.08],
  greenbrier: [38.10, -80.25],
  cheat: [39.48, -79.85],
  tygart: [39.15, -80.05],

  // Colorado
  arkansas: [38.72, -106.10],
  poudre: [40.68, -105.22],
  yampa: [40.48, -106.83],
  crystal: [39.20, -107.22],
  glenwood: [39.55, -107.32],

  // Idaho
  salmon: [45.18, -113.90],
  lochsa: [46.42, -115.52],
  payette: [44.08, -115.95],
  mf_salmon: [44.72, -115.00],
  hells_canyon: [45.35, -116.70],
  henrys_fork: [44.08, -111.38],

  // Oregon
  rogue: [42.55, -123.50],
  deschutes: [45.25, -121.10],
  mckenzie: [44.12, -122.35],
  illinois_or: [42.22, -123.85],
  north_umpqua: [43.28, -122.72],

  // Washington
  wenatchee: [47.55, -120.70],
  methow: [48.35, -120.10],
  skagit: [48.52, -121.65],
  skykomish: [47.80, -121.35],
  sauk: [48.35, -121.55],
  columbia: [46.65, -119.52],

  // Pennsylvania
  yough: [39.87, -79.50],
  loyalsock: [41.45, -76.60],
  pinecreek: [41.62, -77.45],
  clarion: [41.32, -79.15],
  lehigh: [40.85, -75.72],

  // Montana
  flathead: [48.25, -113.55],
  gallatin: [45.55, -111.15],
  blackfoot: [46.88, -113.22],
  missouri_mt: [47.85, -110.30],
  stillwater: [45.62, -109.92],
  madison: [45.32, -111.58],

  // Tennessee
  nolichucky: [36.12, -82.55],
  obeds: [36.10, -84.72],
  hiwassee: [35.18, -84.40],
  ocoee: [35.08, -84.52],
  duck_river: [35.60, -86.98],

  // California
  american: [38.75, -121.00],
  tuolumne: [37.82, -120.25],
  kern: [35.78, -118.52],
  trinity: [40.85, -123.10],
  merced: [37.52, -120.10],
  sacramento: [40.58, -122.38],
  yuba: [39.23, -121.10],
  cache_creek: [38.72, -122.15],
  mokelumne: [38.22, -120.72],
  smith: [41.82, -124.08],

  // Virginia
  james: [37.55, -79.45],
  shenandoah: [38.82, -78.35],
  rappahannock: [38.42, -77.52],
  newriver_va: [37.25, -80.62],
  russell_fork: [37.28, -82.28],

  // Kentucky
  cumberland: [36.65, -84.68],
  red_river: [37.78, -83.65],
  green_river: [37.18, -86.12],
  rockcastle: [37.32, -84.32],
  elkhorn: [38.12, -84.72],

  // North Carolina
  nantahala: [35.32, -83.58],
  chattooga: [34.95, -83.25],
  french_broad: [35.58, -82.58],
  green_nc: [35.22, -82.32],
  watauga: [36.22, -81.72],

  // Arizona
  grandcanyon: [36.10, -112.10],
  salt_river: [33.72, -110.95],
  verde: [34.55, -111.85],

  // Wyoming
  snake_wy: [43.48, -110.85],
  green_wy: [41.05, -109.48],
  north_platte: [41.58, -106.82],

  // Utah
  desolation: [39.62, -110.15],
  san_juan: [37.15, -109.88],
  cataract: [38.20, -109.92],

  // New Mexico
  taos_box: [36.52, -105.72],
  rio_chama: [36.22, -106.58],
  gila_nm: [33.22, -108.55],

  // Maine
  penobscot: [45.88, -68.98],
  allagash: [47.08, -69.15],
  kennebec: [45.35, -69.88],
  dead_river: [45.18, -70.15],
  st_croix_me: [45.62, -67.42],

  // New York
  hudson_gorge: [43.72, -74.08],
  black_ny: [43.98, -75.68],
  salmon_ny: [43.58, -75.98],
  moose_ny: [43.72, -75.25],
  delaware_ny: [41.82, -75.02],
  beaverkill: [41.95, -74.88],

  // Georgia
  chattooga_ga: [34.82, -83.30],
  chattahoochee: [33.95, -84.38],
  toccoa: [34.88, -84.28],
  oconee: [33.72, -83.42],
  etowah: [34.22, -84.32],

  // Minnesota
  st_croix: [45.05, -92.72],
  kawishiwi: [47.92, -91.62],
  kettle: [46.22, -92.80],
  st_louis_mn: [46.72, -92.18],
  crow_wing: [46.42, -94.35],

  // Wisconsin
  wolf_wi: [44.85, -88.85],
  namekagon: [46.02, -91.42],
  peshtigo: [45.12, -88.48],
  flambeau: [45.52, -90.42],
  kickapoo: [43.52, -90.68],

  // Iowa
  upper_iowa: [43.42, -91.58],
  yellow_ia: [43.18, -91.32],
  maquoketa: [42.08, -90.68],

  // Missouri
  current: [37.22, -91.42],
  eleven_point: [36.78, -91.35],
  st_francis: [37.58, -90.62],
  jacks_fork: [37.15, -91.52],
  meramec: [38.28, -91.08],

  // Arkansas
  buffalo: [35.95, -92.92],
  cossatot: [34.35, -94.22],
  mulberry: [35.55, -93.72],
  war_eagle: [36.05, -93.82],
  big_piney: [35.58, -93.22],

  // Louisiana
  atchafalaya: [30.38, -91.65],
  bogue_chitto: [30.85, -90.15],
  whiskey_chitto: [30.58, -92.78],

  // Mississippi
  black_creek_ms: [31.22, -89.22],
  okatoma: [31.52, -89.52],
  wolf_ms: [30.72, -89.08],

  // Alabama
  little_river_al: [34.38, -85.62],
  cahaba: [33.08, -86.85],
  locust_fork: [33.78, -86.68],

  // Florida
  ichetucknee: [29.98, -82.76],
  suwannee: [30.38, -83.18],
  wekiva: [28.72, -81.42],
  peace: [27.18, -81.82],
  loxahatchee: [26.98, -80.12],

  // South Carolina
  chattooga_sc: [34.82, -83.25],
  saluda: [34.00, -81.15],
  edisto: [33.42, -80.62],

  // Nebraska
  niobrara: [42.78, -100.08],
  dismal: [41.72, -100.42],
  platte: [40.82, -98.38],

  // South Dakota
  missouri_sd: [43.05, -98.55],
  big_sioux: [43.55, -96.72],
  cheyenne_sd: [44.08, -102.22],

  // North Dakota
  little_missouri: [46.95, -103.52],
  sheyenne: [46.85, -97.52],
  missouri_nd: [47.32, -100.82],

  // Kansas
  flint_hills: [38.35, -96.55],
  kaw: [39.05, -95.68],
  fall_river_ks: [37.62, -96.05],

  // Oklahoma
  illinois_ok: [35.92, -94.72],
  mountain_fork: [34.15, -94.72],
  blue_ok: [34.42, -96.65],

  // Texas
  big_bend: [29.25, -103.25],
  guadalupe: [29.72, -98.12],
  devils_river: [29.88, -100.92],
  brazos: [32.85, -98.42],
  san_marcos: [29.88, -97.92],
  frio: [29.55, -99.75],
  comal: [29.72, -98.12],
  blanco: [30.05, -98.42],
  nueces: [29.48, -100.05],
  sabine: [32.32, -95.82],

  // Nevada
  truckee: [39.32, -120.02],
  carson: [38.82, -119.72],
  humboldt: [40.82, -117.52],
  walker: [38.68, -119.18],
  east_walker: [38.52, -119.32],
  jarbidge: [41.88, -115.42],
  bruneau: [42.78, -115.78],

  // Ohio
  cuyahoga: [41.22, -81.55],
  mohican: [40.58, -82.22],
  little_miami: [39.42, -84.05],
  grand_oh: [41.72, -81.08],
  hocking: [39.32, -82.12],
  kokosing: [40.38, -82.32],
  olentangy: [40.28, -83.05],
  scioto: [39.72, -82.98],
  maumee: [41.08, -84.02],
  chagrin: [41.52, -81.38],

  // Indiana
  whitewater_in: [39.52, -84.98],
  sugar_creek: [39.78, -87.02],
  blue_in: [38.35, -86.22],
  tippecanoe: [40.78, -86.68],
  muscatatuck: [38.82, -85.78],
  eel_in: [40.88, -85.52],
  wildcat_in: [40.42, -86.82],

  // Illinois
  vermilion_il: [41.28, -89.02],
  cache_il: [37.22, -89.02],
  kankakee: [41.18, -87.88],
  fox_il: [41.78, -88.32],
  des_plaines: [41.65, -87.95],
  mackinaw: [40.52, -89.38],
  sangamon: [39.82, -89.65],
  apple_il: [42.42, -90.12],

  // New Hampshire
  androscoggin: [44.42, -71.18],
  saco: [44.05, -71.12],
  pemi: [43.82, -71.68],

  // Vermont
  west_river: [43.12, -72.68],
  lamoille: [44.62, -72.72],
  white_vt: [43.78, -72.52],

  // Connecticut
  housatonic: [41.82, -73.32],
  farmington: [41.92, -72.92],
  connecticut: [41.55, -72.65],

  // Rhode Island
  wood_ri: [41.48, -71.72],
  pawcatuck: [41.38, -71.82],
  blackstone: [41.92, -71.42],

  // New Jersey
  delaware_gap: [41.02, -74.98],
  wharton: [39.72, -74.62],
  mullica: [39.62, -74.58],

  // Delaware
  brandywine: [39.78, -75.55],
  st_jones: [39.15, -75.52],
  christina: [39.72, -75.65],
  white_clay: [39.72, -75.75],
  red_clay: [39.75, -75.68],
  nanticoke: [38.55, -75.72],
  broadkill: [38.78, -75.22],

  // Maryland
  yough_md: [39.52, -79.42],
  potomac: [39.00, -77.25],
  savage: [39.52, -79.08],
  gunpowder: [39.42, -76.52],
  patuxent: [39.05, -76.72],
  monocacy: [39.38, -77.38],
  antietam_creek: [39.45, -77.72],

  // Massachusetts
  deerfield: [42.62, -72.82],
  westfield: [42.18, -72.82],
  concord: [42.45, -71.38],
}
