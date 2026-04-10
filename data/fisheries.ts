import type { RiverFisheries } from '@/types'

// Fisheries data — only included for rivers with verified information
// Sources: state DNR/FWP agencies, Orvis fishing reports, Trout Unlimited, USFS
export const FISHERIES: Record<string, RiverFisheries> = {

  ausable: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true },
      { name: 'Brook Trout', type: 'resident', primary: true },
      { name: 'Rainbow Trout', type: 'resident', primary: false },
      { name: 'Chinook Salmon', type: 'anadromous', primary: false, notes: 'Fall run from Lake Huron' },
      { name: 'Steelhead', type: 'anadromous', primary: false, notes: 'Spring and fall runs from Lake Huron' },
    ],
    designations: ['Michigan Blue-Ribbon Trout Stream', 'Catch & Release — flies only (Holy Water section)'],
    spawning: [
      { species: 'Brook Trout', season: 'September–November', notes: 'Please avoid wading on redds' },
      { species: 'Brown Trout', season: 'October–December' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'March–April, September–October' },
      { name: 'Hendrickson Mayfly', timing: 'Late April – Mid May' },
      { name: 'Caddis', timing: 'April–June' },
      { name: 'March Brown / Grey Drake', timing: 'May–June' },
      { name: 'Brown Drake', timing: 'Late May – Mid June' },
      { name: 'Sulfur', timing: 'Late May – June' },
      { name: 'Hex (Hexagenia limbata)', timing: 'Late June – Mid July', notes: 'Triggered when water temperature reaches 60°F. The legendary night hatch — largest mayfly in North America. Brings out trophy browns after dark.' },
      { name: 'Trico', timing: 'July–September', notes: 'Early morning spinner falls' },
      { name: 'White Fly', timing: 'July–August' },
      { name: 'Terrestrials (hoppers, ants, beetles)', timing: 'July–September' },
    ],
    runs: [
      { species: 'Steelhead', timing: 'March–May', peak: 'April', notes: 'Spring run from Lake Huron, lower river' },
      { species: 'Chinook Salmon', timing: 'September–October', peak: 'Early October', notes: 'Fall run from Lake Huron' },
      { species: 'Steelhead', timing: 'October–November', peak: 'Late October', notes: 'Fall run from Lake Huron' },
    ],
    guides: ['Gates Au Sable Lodge', 'Old Au Sable Fly Shop', 'Streamside Orvis Shop'],
  },

  pine_mi: {
    species: [
      { name: 'Brook Trout', type: 'resident', primary: true, notes: 'Wild, self-sustaining population' },
      { name: 'Brown Trout', type: 'resident', primary: true },
      { name: 'Rainbow Trout', type: 'resident', primary: false },
    ],
    designations: ['Michigan Natural River', 'National Wild & Scenic River', 'Michigan Blue-Ribbon Trout Stream'],
    spawning: [
      { species: 'Brook Trout', season: 'September–November' },
      { species: 'Brown Trout', season: 'October–December' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'April–May, September–October' },
      { name: 'Hendrickson', timing: 'Late April – Mid May' },
      { name: 'Caddis', timing: 'May–June' },
      { name: 'Sulfur', timing: 'Late May – June' },
      { name: 'Hex (Hexagenia limbata)', timing: 'Late June – Mid July', notes: 'Triggered when water temperature reaches 60°F. The legendary night hatch — largest mayfly in North America. Brings out trophy browns after dark.' },
      { name: 'Terrestrials', timing: 'July–September' },
    ],
    runs: [],
    guides: ['Pine River Paddlesports Center'],
  },

  arkansas: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true, notes: 'Wild, self-sustaining — dominant species' },
      { name: 'Rainbow Trout', type: 'resident', primary: true },
    ],
    designations: ['Colorado Gold Medal Water (102 miles)', 'Browns Canyon National Monument'],
    spawning: [
      { species: 'Brown Trout', season: 'October–November' },
      { species: 'Rainbow Trout', season: 'March–May' },
    ],
    hatches: [
      { name: 'Midge', timing: 'Year-round, most important September–April' },
      { name: 'Blue-Winged Olive (BWO)', timing: 'March–May, September–November', notes: 'Prolific spring and fall hatches' },
      { name: 'Caddis (Mother\'s Day Caddis)', timing: 'May–June', notes: 'Massive emergence in May' },
      { name: 'Stonefly (Golden Stone, Salmonfly)', timing: 'June–July', notes: 'Big dry fly fishing' },
      { name: 'Pale Morning Dun (PMD)', timing: 'June–August' },
      { name: 'Red Quill', timing: 'July–August' },
      { name: 'Terrestrials (hoppers, ants)', timing: 'July–September' },
    ],
    runs: [],
    guides: ['Arkansas River Fly Shop', 'Dvorak Expeditions'],
  },

  salmon_ny: {
    species: [
      { name: 'Chinook Salmon', type: 'anadromous', primary: true, notes: 'Fish exceeding 30 lbs run each fall' },
      { name: 'Steelhead', type: 'anadromous', primary: true, notes: 'Washington and Skamania strains' },
      { name: 'Coho Salmon', type: 'anadromous', primary: false },
      { name: 'Brown Trout', type: 'resident', primary: false, notes: 'Lake-run browns in fall' },
    ],
    designations: ['New York State Recreation Area', 'NYSDEC Stocked Fishery'],
    spawning: [
      { species: 'Chinook Salmon', season: 'October–November' },
      { species: 'Steelhead', season: 'March–April' },
    ],
    hatches: [],
    runs: [
      { species: 'Chinook Salmon', timing: 'September – November', peak: 'Late September – Early October', notes: 'Kings stage at river mouth late August, enter after Labor Day' },
      { species: 'Coho Salmon', timing: 'October – November', peak: 'Late October' },
      { species: 'Steelhead (fall run)', timing: 'October – December', peak: 'November' },
      { species: 'Steelhead (spring run)', timing: 'March – May', peak: 'April', notes: 'Drop-back fishing excellent in April' },
      { species: 'Brown Trout (lake-run)', timing: 'October – November', peak: 'Late October' },
    ],
    guides: ["Whitaker's Sport Store", "Fat Nancy's Tackle Shop"],
  },

  manistee: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true },
      { name: 'Steelhead', type: 'anadromous', primary: true, notes: 'World-class runs below Tippy Dam — 15,000+ steelhead return annually' },
      { name: 'Chinook Salmon', type: 'anadromous', primary: true, notes: 'Fall run below Tippy Dam — kings to 30+ lbs' },
      { name: 'Brook Trout', type: 'resident', primary: false, notes: 'Upper river sections' },
    ],
    designations: ['Michigan Blue-Ribbon Trout Stream', 'National Scenic River'],
    optimalFishingCfs: '500–2500',
    spawning: [
      { species: 'Brown Trout', season: 'October–November' },
      { species: 'Steelhead', season: 'March–April' },
    ],
    hatches: [
      { name: 'Hendrickson', timing: 'Late April – Mid May' },
      { name: 'Caddis', timing: 'May–June' },
      { name: 'Brown Drake', timing: 'Late May – Mid June' },
      { name: 'Hex (Hexagenia limbata)', timing: 'Late June – Mid July', notes: 'Triggered when water temperature reaches 60°F. The legendary night hatch — largest mayfly in North America. Brings out trophy browns after dark.' },
      { name: 'Trico', timing: 'July–September' },
    ],
    runs: [
      { species: 'Chinook Salmon', timing: 'September – October', peak: 'Late September', notes: '15,000+ steelhead return annually below Tippy Dam' },
      { species: 'Steelhead', timing: 'October – April', peak: 'November and March' },
    ],
    guides: ['Schmidt Outfitters', 'Orvis Streamside'],
  },

  gallatin: {
    species: [
      { name: 'Rainbow Trout', type: 'resident', primary: true },
      { name: 'Brown Trout', type: 'resident', primary: true },
      { name: 'Cutthroat Trout', type: 'resident', primary: false, notes: 'Westslope cutthroat in upper reaches' },
      { name: 'Mountain Whitefish', type: 'resident', primary: false },
    ],
    designations: ['Montana Blue-Ribbon Trout Stream', 'Yellowstone National Park headwaters'],
    spawning: [
      { species: 'Rainbow Trout', season: 'April–June' },
      { species: 'Brown Trout', season: 'October–November' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive', timing: 'March–May, September–November' },
      { name: 'Skwala Stonefly', timing: 'March–April', notes: 'First big dry fly hatch of the year' },
      { name: 'Caddis (Mother\'s Day)', timing: 'May–June' },
      { name: 'Salmonfly / Golden Stone', timing: 'June–July' },
      { name: 'Pale Morning Dun', timing: 'June–August' },
      { name: 'Hopper/Dropper', timing: 'July–September', notes: 'Prime dry fly season' },
      { name: 'October Caddis', timing: 'September–October' },
    ],
    runs: [],
    guides: ['Montana Whitewater', 'Gallatin River Guides'],
  },

  blackfoot: {
    species: [
      { name: 'Westslope Cutthroat Trout', type: 'resident', primary: true, notes: 'Native — conservation priority' },
      { name: 'Bull Trout', type: 'resident', primary: true, notes: 'Threatened species — catch and release only' },
      { name: 'Brown Trout', type: 'resident', primary: true },
      { name: 'Rainbow Trout', type: 'resident', primary: false },
    ],
    designations: ['Montana Blue-Ribbon Trout Stream', 'Blackfoot Challenge Conservation Area', 'Bull Trout Critical Habitat (USFWS)'],
    spawning: [
      { species: 'Westslope Cutthroat', season: 'May–July' },
      { species: 'Bull Trout', season: 'September–October', notes: 'Must release all bull trout immediately' },
      { species: 'Brown Trout', season: 'October–November' },
    ],
    hatches: [
      { name: 'Skwala Stonefly', timing: 'March–April' },
      { name: 'Caddis', timing: 'May–June' },
      { name: 'Salmonfly', timing: 'June–July' },
      { name: 'PMD / Green Drake', timing: 'June–August' },
      { name: 'Hopper/Dropper', timing: 'July–September' },
    ],
    runs: [],
    guides: ['Blackfoot River Outfitters', 'Missoulian Angler'],
  },

  guadalupe: {
    species: [
      { name: 'Rainbow Trout', type: 'resident', primary: true, notes: 'Stocked below Canyon Dam — southernmost trout fishery in central US' },
      { name: 'Brown Trout', type: 'resident', primary: false, notes: 'Some holdover fish below dam' },
      { name: 'Largemouth Bass', type: 'warmwater', primary: true, notes: 'Above Canyon Lake' },
      { name: 'Guadalupe Bass', type: 'warmwater', primary: true, notes: 'Texas state fish — endemic to Hill Country' },
      { name: 'Smallmouth Bass', type: 'warmwater', primary: false },
    ],
    designations: ['Texas Paddling Trail', 'TPWD Stocked Trout Fishery (below Canyon Dam)'],
    spawning: [
      { species: 'Guadalupe Bass', season: 'March–June' },
    ],
    hatches: [],
    runs: [],
    guides: ['Action Angler & Outdoor Center', 'Living Waters Fly Fishing'],
  },

  nantahala: {
    species: [
      { name: 'Rainbow Trout', type: 'resident', primary: true, notes: 'Stocked and wild fish below Fontana' },
      { name: 'Brown Trout', type: 'resident', primary: true },
      { name: 'Brook Trout', type: 'resident', primary: false, notes: 'Headwater tributaries only' },
    ],
    designations: ['Nantahala National Forest', 'NC Hatchery Supported Trout Waters'],
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
      { species: 'Rainbow Trout', season: 'February–April' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive', timing: 'March–April, October–November' },
      { name: 'Quill Gordon', timing: 'March–April', notes: 'First major hatch of spring' },
      { name: 'Caddis', timing: 'April–June' },
      { name: 'Light Cahill', timing: 'May–June' },
      { name: 'Terrestrials', timing: 'July–September' },
    ],
    runs: [],
    guides: ['Nantahala Outdoor Center Fly Shop'],
  },

  deerfield: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true },
      { name: 'Rainbow Trout', type: 'resident', primary: true },
      { name: 'Brook Trout', type: 'resident', primary: false, notes: 'Upper tributaries' },
    ],
    designations: ['Massachusetts Catch & Release (Catch & Release section)', 'Dam-Release Controlled Flows'],
    spawning: [
      { species: 'Brown Trout', season: 'October–November' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive', timing: 'April–May, September–October' },
      { name: 'Hendrickson', timing: 'Late April – May' },
      { name: 'Caddis', timing: 'May–June' },
      { name: 'Sulfur', timing: 'May–June' },
      { name: 'Isonychia', timing: 'June–September' },
    ],
    runs: [],
    guides: ['Deerfield Fly Shop'],
  },

  saco: {
    species: [
      { name: 'Brook Trout', type: 'resident', primary: true, notes: 'Wild brook trout in upper reaches' },
      { name: 'Brown Trout', type: 'resident', primary: true },
      { name: 'Rainbow Trout', type: 'resident', primary: false },
      { name: 'Smallmouth Bass', type: 'warmwater', primary: false, notes: 'Lower river' },
    ],
    designations: ['New Hampshire Scenic River'],
    spawning: [
      { species: 'Brook Trout', season: 'October–November' },
      { species: 'Brown Trout', season: 'October–November' },
    ],
    hatches: [
      { name: 'Quill Gordon / Hendrickson', timing: 'April–May' },
      { name: 'Caddis', timing: 'May–June' },
      { name: 'Green Drake', timing: 'Late May – June' },
      { name: 'Sulfur', timing: 'June' },
      { name: 'Terrestrials', timing: 'July–September' },
    ],
    runs: [],
    guides: ['North Country Angler'],
  },

  pere_marquette: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true, notes: 'Wild fish throughout upper river' },
      { name: 'Rainbow Trout', type: 'resident', primary: true },
      { name: 'Brook Trout', type: 'resident', primary: false, notes: 'Headwaters and tributaries' },
      { name: 'Steelhead', type: 'anadromous', primary: true, notes: 'World-class runs from Lake Michigan' },
      { name: 'Chinook Salmon', type: 'anadromous', primary: true, notes: 'Fall run from Lake Michigan' },
      { name: 'Coho Salmon', type: 'anadromous', primary: false },
    ],
    designations: ['Michigan Blue-Ribbon Trout Stream', 'National Wild & Scenic River', "Fly-Fishing-Only section (72nd St to Gleason's Landing)"],
    optimalFishingCfs: '300–1200',
    spawning: [
      { species: 'Brown Trout', season: 'October–November' },
      { species: 'Steelhead', season: 'March–April' },
      { species: 'Chinook Salmon', season: 'September–October' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'April–May, September–October' },
      { name: 'Hendrickson', timing: 'Late April – Mid May' },
      { name: 'Caddis', timing: 'May–June' },
      { name: 'Sulfur', timing: 'Late May – June' },
      { name: 'Brown Drake', timing: 'Late May – Mid June' },
      { name: 'Hex (Hexagenia limbata)', timing: 'Late June – Mid July', notes: 'Triggered when water temperature reaches 60°F. Major night hatch on the PM — brings out trophy browns after dark.' },
      { name: 'Trico', timing: 'July–September' },
      { name: 'Terrestrials', timing: 'July–September' },
    ],
    runs: [
      { species: 'Chinook Salmon', timing: 'September – October', peak: 'Late September', notes: 'Kings run from Lake Michigan' },
      { species: 'Coho Salmon', timing: 'September – November', peak: 'October' },
      { species: 'Steelhead', timing: 'October – April', peak: 'November and March', notes: 'Both fall and spring runs' },
    ],
    guides: ['Pere Marquette Lodge', 'Baldwin Creek Outfitters'],
  },

  muskegon: {
    species: [
      { name: 'Steelhead', type: 'anadromous', primary: true, notes: 'Excellent runs below Croton Dam' },
      { name: 'Chinook Salmon', type: 'anadromous', primary: true, notes: 'Fall run below Croton Dam' },
      { name: 'Brown Trout', type: 'resident', primary: true },
      { name: 'Walleye', type: 'warmwater', primary: true, notes: 'Strong population below Croton Dam' },
      { name: 'Smallmouth Bass', type: 'warmwater', primary: false },
    ],
    designations: ['Michigan Blue-Ribbon Trout Stream (below Croton Dam)'],
    optimalFishingCfs: '1200–3500',
    spawning: [
      { species: 'Brown Trout', season: 'October–November' },
      { species: 'Steelhead', season: 'March–April' },
      { species: 'Walleye', season: 'March–April' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'April–May, September–October' },
      { name: 'Caddis', timing: 'May–June' },
      { name: 'Hex (Hexagenia limbata)', timing: 'Late June – Mid July', notes: 'Triggered when water temperature reaches 60°F. The legendary night hatch — largest mayfly in North America. Brings out trophy browns after dark.' },
      { name: 'Terrestrials', timing: 'July–September' },
    ],
    runs: [
      { species: 'Chinook Salmon', timing: 'September – October', peak: 'Late September', notes: 'Large kings from Lake Michigan; Croton Dam blocks passage' },
      { species: 'Steelhead', timing: 'October – April', peak: 'November and March' },
    ],
    guides: ['Muskegon River Fly Shop', 'Great Lakes Fly Fishing Company'],
  },

  boardman: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true, notes: 'Excellent wild brown trout fishery' },
      { name: 'Brook Trout', type: 'resident', primary: false, notes: 'Headwaters' },
      { name: 'Steelhead', type: 'anadromous', primary: false, notes: 'Passage improving with recent dam removals' },
    ],
    designations: ['Michigan Natural River', 'Michigan Blue-Ribbon Trout Stream'],
    spawning: [
      { species: 'Brown Trout', season: 'October–November' },
      { species: 'Brook Trout', season: 'September–November' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'April–May, September–October' },
      { name: 'Hendrickson', timing: 'Late April – Mid May' },
      { name: 'Caddis', timing: 'May–June' },
      { name: 'Sulfur', timing: 'Late May – June' },
      { name: 'Hex (Hexagenia limbata)', timing: 'Late June – Mid July', notes: 'Triggered when water temperature reaches 60°F. The legendary night hatch — largest mayfly in North America. Brings out trophy browns after dark.' },
      { name: 'Terrestrials', timing: 'July–September' },
    ],
    runs: [],
    guides: ['The Northern Angler', 'Streamside Orvis Traverse City'],
  },

  jordan: {
    species: [
      { name: 'Brook Trout', type: 'resident', primary: true, notes: "Michigan's premier wild brook trout stream" },
      { name: 'Brown Trout', type: 'resident', primary: true },
      { name: 'Rainbow Trout', type: 'resident', primary: false },
    ],
    designations: ["Michigan's first Natural River (1972)", 'Michigan Blue-Ribbon Trout Stream'],
    spawning: [
      { species: 'Brook Trout', season: 'September–November', notes: 'Critical spawning habitat — avoid wading on redds' },
      { species: 'Brown Trout', season: 'October–November' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'April–May, September–October' },
      { name: 'Hendrickson', timing: 'Late April – Mid May' },
      { name: 'Caddis', timing: 'May–June' },
      { name: 'Sulfur', timing: 'Late May – June' },
      { name: 'Hex (Hexagenia limbata)', timing: 'Late June – Mid July', notes: 'Triggered when water temperature reaches 60°F. The legendary night hatch — largest mayfly in North America. Brings out trophy browns after dark.' },
      { name: 'Terrestrials', timing: 'July–September' },
    ],
    runs: [],
    guides: ['Jordan River Outfitters', 'The Northern Angler'],
  },

  betsie: {
    species: [
      { name: 'Steelhead', type: 'anadromous', primary: true, notes: 'Strong runs from Lake Michigan' },
      { name: 'Chinook Salmon', type: 'anadromous', primary: true, notes: 'Fall run from Lake Michigan' },
      { name: 'Coho Salmon', type: 'anadromous', primary: false },
      { name: 'Brown Trout', type: 'resident', primary: false },
    ],
    designations: ['Michigan Natural River'],
    optimalFishingCfs: '150–800',
    spawning: [
      { species: 'Steelhead', season: 'March–April' },
      { species: 'Chinook Salmon', season: 'September–October' },
    ],
    hatches: [
      { name: 'Caddis', timing: 'May–June' },
      { name: 'Hex (Hexagenia limbata)', timing: 'Late June – Mid July', notes: 'Triggered when water temperature reaches 60°F. The legendary night hatch — largest mayfly in North America. Brings out trophy browns after dark.' },
    ],
    runs: [
      { species: 'Chinook Salmon', timing: 'September – October', peak: 'Late September', notes: 'One of the most reliable Lake Michigan king runs in northern Michigan; concentrated in the lower river above Crystal Lake' },
      { species: 'Coho Salmon', timing: 'September – November', peak: 'October' },
      { species: 'Steelhead', timing: 'October – April', peak: 'November and March', notes: 'Both fall and spring runs from Lake Michigan' },
    ],
    guides: ['Betsie River Outfitters'],
  },

  platte_mi: {
    species: [
      { name: 'Coho Salmon', type: 'anadromous', primary: true, notes: 'Site of the first successful Great Lakes coho planting (1966)' },
      { name: 'Chinook Salmon', type: 'anadromous', primary: true },
      { name: 'Steelhead', type: 'anadromous', primary: false },
      { name: 'Brown Trout', type: 'resident', primary: false },
    ],
    designations: ['Michigan Natural River', 'Historic Great Lakes salmon restoration site'],
    spawning: [
      { species: 'Coho Salmon', season: 'October–November' },
      { species: 'Chinook Salmon', season: 'September–October' },
    ],
    hatches: [],
    runs: [
      { species: 'Coho Salmon', timing: 'September – November', peak: 'October', notes: 'Famous coho run — the river that started Great Lakes salmon fishing' },
      { species: 'Chinook Salmon', timing: 'September – October', peak: 'Late September' },
      { species: 'Steelhead', timing: 'October – April', peak: 'March' },
    ],
    guides: ['Riverside Canoes (Honor)'],
  },

  rifle: {
    species: [
      { name: 'Smallmouth Bass', type: 'warmwater', primary: true, notes: 'Excellent smallmouth fishery in lower river' },
      { name: 'Brown Trout', type: 'resident', primary: false, notes: 'Upper sections near headwaters' },
      { name: 'Brook Trout', type: 'resident', primary: false, notes: 'Upper reaches' },
      { name: 'Northern Pike', type: 'warmwater', primary: false },
      { name: 'Walleye', type: 'warmwater', primary: false, notes: 'Lower river near Saginaw Bay' },
    ],
    designations: ['Michigan Natural River'],
    spawning: [
      { species: 'Smallmouth Bass', season: 'May–June' },
      { species: 'Brown Trout', season: 'October–November' },
    ],
    hatches: [],
    runs: [],
    guides: ['Rifle River Canoe Rental'],
  },

  huron_mi: {
    species: [
      { name: 'Smallmouth Bass', type: 'warmwater', primary: true },
      { name: 'Northern Pike', type: 'warmwater', primary: true },
      { name: 'Largemouth Bass', type: 'warmwater', primary: false },
      { name: 'Panfish (bluegill, rock bass)', type: 'warmwater', primary: false },
      { name: 'Channel Catfish', type: 'warmwater', primary: false },
    ],
    designations: ['Michigan Natural River (portions)', 'Huron River Water Trail'],
    spawning: [
      { species: 'Smallmouth Bass', season: 'May–June' },
      { species: 'Northern Pike', season: 'March–April' },
    ],
    hatches: [],
    runs: [],
    guides: ['Huron River Fly Shop'],
  },

  flat_river: {
    species: [
      { name: 'Smallmouth Bass', type: 'warmwater', primary: true },
      { name: 'Steelhead', type: 'anadromous', primary: false, notes: 'Some steelhead access from Grand River system' },
      { name: 'Northern Pike', type: 'warmwater', primary: false },
      { name: 'Rock Bass', type: 'warmwater', primary: false },
    ],
    designations: ['Michigan Natural River'],
    spawning: [
      { species: 'Smallmouth Bass', season: 'May–June' },
    ],
    hatches: [],
    runs: [],
    guides: ['Grand River Fly Shop'],
  },

  thornapple: {
    species: [
      { name: 'Smallmouth Bass', type: 'warmwater', primary: true },
      { name: 'Northern Pike', type: 'warmwater', primary: true },
      { name: 'Largemouth Bass', type: 'warmwater', primary: false },
      { name: 'Panfish (bluegill, rock bass)', type: 'warmwater', primary: false },
      { name: 'Channel Catfish', type: 'warmwater', primary: false },
    ],
    designations: [],
    spawning: [
      { species: 'Smallmouth Bass', season: 'May–June' },
      { species: 'Northern Pike', season: 'March–April' },
    ],
    hatches: [],
    runs: [],
    guides: [],
  },

  twohearted: {
    species: [
      { name: 'Brook Trout', type: 'resident', primary: true, notes: 'Wild brook trout — remote Upper Peninsula wilderness stream' },
      { name: 'Brown Trout', type: 'resident', primary: false },
      { name: 'Steelhead', type: 'anadromous', primary: false, notes: 'Runs from Lake Superior' },
    ],
    designations: ['Michigan Natural River', 'Michigan Blue-Ribbon Trout Stream'],
    spawning: [
      { species: 'Brook Trout', season: 'September–November' },
      { species: 'Brown Trout', season: 'October–November' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'May–June, September' },
      { name: 'Caddis', timing: 'May–June' },
      { name: 'Hex (Hexagenia limbata)', timing: 'Late June – Mid July', notes: 'Triggered when water temperature reaches 60°F. The legendary night hatch — largest mayfly in North America. Brings out trophy browns after dark.' },
      { name: 'Terrestrials', timing: 'July–September' },
    ],
    runs: [
      { species: 'Steelhead', timing: 'April – May', peak: 'Late April', notes: 'Spring run from Lake Superior' },
    ],
    guides: ["Two Hearted Outfitters"],
  },

// Western US Fisheries Data — paste these entries into the FISHERIES object in fisheries.ts
// Sources: IDFG, MT FWP, WGFD, CPW, ODFW, WDFW, CDFW, AZGFD, NDOW, UDWR, NMDGF, USFWS

  // ─── IDAHO ──────────────────────────────────────────────────────────

  salmon: {
    species: [
      { name: 'Chinook Salmon', type: 'anadromous', primary: true, notes: 'Spring/summer runs — longest freshwater salmon migration in lower 48 (900 mi from ocean)' },
      { name: 'Steelhead', type: 'anadromous', primary: true, notes: 'Wild B-run steelhead, often 10+ lbs' },
      { name: 'Westslope Cutthroat Trout', type: 'resident', primary: true, notes: 'Native population' },
      { name: 'Bull Trout', type: 'resident', primary: false, notes: 'Threatened species — catch and release only' },
    ],
    designations: ['National Wild & Scenic River', 'Frank Church–River of No Return Wilderness', 'Critical Habitat for ESA-listed salmon and steelhead'],
    spawning: [
      { species: 'Chinook Salmon', season: 'August–September', notes: 'Run timing critical — spawning closures enforced' },
      { species: 'Steelhead', season: 'March–May' },
      { species: 'Westslope Cutthroat', season: 'May–July' },
      { species: 'Bull Trout', season: 'September–October', notes: 'Must release all bull trout immediately' },
    ],
    hatches: [
      { name: 'Skwala Stonefly', timing: 'March–April' },
      { name: 'Salmonfly', timing: 'June–July', notes: 'Major hatch — draws big cutthroat to the surface' },
      { name: 'Golden Stonefly', timing: 'June–July' },
      { name: 'Pale Morning Dun', timing: 'June–August' },
      { name: 'Caddis', timing: 'June–September' },
      { name: 'Hopper/Dropper', timing: 'July–September' },
    ],
    runs: [
      { species: 'Chinook Salmon', timing: 'June – August', peak: 'July', notes: 'Spring/summer Chinook — run timing varies yearly; check IDFG counts' },
      { species: 'Steelhead', timing: 'September – April', peak: 'October–November', notes: 'Wild B-run fish — catch and release regulations apply' },
    ],
    guides: ['Middle Fork Outfitters', 'Salmon River Experience'],
  },

  lochsa: {
    species: [
      { name: 'Westslope Cutthroat Trout', type: 'resident', primary: true, notes: 'Wild, genetically pure population' },
      { name: 'Steelhead', type: 'anadromous', primary: true, notes: 'Wild run — catch and release only' },
      { name: 'Bull Trout', type: 'resident', primary: false, notes: 'Threatened — catch and release only' },
    ],
    designations: ['National Wild & Scenic River', 'Selway-Bitterroot Wilderness (upper tributaries)', 'Lewis & Clark National Historic Trail corridor'],
    spawning: [
      { species: 'Westslope Cutthroat', season: 'May–July' },
      { species: 'Steelhead', season: 'March–May' },
      { species: 'Bull Trout', season: 'September–October' },
    ],
    hatches: [
      { name: 'Skwala Stonefly', timing: 'March–April' },
      { name: 'Salmonfly', timing: 'June', notes: 'Brief but intense emergence' },
      { name: 'Golden Stonefly', timing: 'June–July' },
      { name: 'Caddis', timing: 'May–July' },
      { name: 'Pale Morning Dun', timing: 'June–August' },
      { name: 'Hopper/Dropper', timing: 'July–September' },
    ],
    runs: [
      { species: 'Steelhead', timing: 'March – June', peak: 'April–May', notes: 'Spring run — wild fish only, check IDFG regulations' },
    ],
    guides: ['Three Rivers Ranch', 'Clearwater River Company'],
  },

  mf_salmon: {
    species: [
      { name: 'Chinook Salmon', type: 'anadromous', primary: true, notes: 'Wild spring/summer run — only accessible by float or trail' },
      { name: 'Steelhead', type: 'anadromous', primary: true, notes: 'Wild B-run steelhead' },
      { name: 'Westslope Cutthroat Trout', type: 'resident', primary: true, notes: 'Excellent dry fly fishing' },
      { name: 'Bull Trout', type: 'resident', primary: false, notes: 'Threatened — catch and release only' },
    ],
    designations: ['National Wild & Scenic River', 'Frank Church–River of No Return Wilderness', 'Permit-only (limited launch dates)'],
    spawning: [
      { species: 'Chinook Salmon', season: 'August–September' },
      { species: 'Steelhead', season: 'March–May' },
      { species: 'Westslope Cutthroat', season: 'May–July' },
      { species: 'Bull Trout', season: 'September–October' },
    ],
    hatches: [
      { name: 'Salmonfly', timing: 'June–July', notes: 'Legendary hatch on the Middle Fork — fish go berserk' },
      { name: 'Golden Stonefly', timing: 'June–July' },
      { name: 'Caddis', timing: 'June–August' },
      { name: 'Green Drake', timing: 'Late June – July' },
      { name: 'Pale Morning Dun', timing: 'June–August' },
      { name: 'Hopper/Dropper', timing: 'July–September' },
    ],
    runs: [
      { species: 'Chinook Salmon', timing: 'June – August', peak: 'July', notes: 'Wild spring/summer Chinook — wilderness setting' },
      { species: 'Steelhead', timing: 'September – March', peak: 'October–November' },
    ],
    guides: ['Middle Fork River Expeditions', 'ARTA River Trips'],
  },

  // ─── MONTANA ────────────────────────────────────────────────────────

  flathead: {
    species: [
      { name: 'Westslope Cutthroat Trout', type: 'resident', primary: true, notes: 'Native — genetically pure populations in upper forks' },
      { name: 'Bull Trout', type: 'resident', primary: true, notes: 'Threatened species — catch and release only, critical habitat' },
      { name: 'Mountain Whitefish', type: 'resident', primary: false },
    ],
    designations: ['National Wild & Scenic River (North Fork, Middle Fork, South Fork)', 'Great Bear Wilderness', 'Glacier National Park headwaters', 'Bull Trout Critical Habitat (USFWS)'],
    spawning: [
      { species: 'Westslope Cutthroat', season: 'May–July' },
      { species: 'Bull Trout', season: 'September–October', notes: 'Must release all bull trout immediately — spawning closures on tributaries' },
    ],
    hatches: [
      { name: 'Skwala Stonefly', timing: 'March–April' },
      { name: 'Caddis', timing: 'May–June' },
      { name: 'Salmonfly', timing: 'June–July' },
      { name: 'Golden Stonefly', timing: 'June–July' },
      { name: 'Green Drake', timing: 'Late June – July' },
      { name: 'Pale Morning Dun', timing: 'June–August' },
      { name: 'Hopper/Dropper', timing: 'July–September' },
    ],
    runs: [],
    guides: ['Glacier Anglers', 'Glacier Raft Company'],
  },

  stillwater: {
    species: [
      { name: 'Rainbow Trout', type: 'resident', primary: true },
      { name: 'Brown Trout', type: 'resident', primary: true },
      { name: 'Yellowstone Cutthroat Trout', type: 'resident', primary: false, notes: 'Upper river and tributaries' },
      { name: 'Mountain Whitefish', type: 'resident', primary: false },
    ],
    designations: ['Absaroka-Beartooth Wilderness (headwaters)', 'Montana Blue-Ribbon Trout Stream'],
    spawning: [
      { species: 'Rainbow Trout', season: 'April–June' },
      { species: 'Brown Trout', season: 'October–November' },
      { species: 'Yellowstone Cutthroat', season: 'May–July' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive', timing: 'April–May, September–October' },
      { name: 'Caddis', timing: 'May–June' },
      { name: 'Salmonfly', timing: 'June–July' },
      { name: 'Golden Stonefly', timing: 'June–July' },
      { name: 'Pale Morning Dun', timing: 'June–August' },
      { name: 'Hopper/Dropper', timing: 'July–September' },
      { name: 'October Caddis', timing: 'September–October' },
    ],
    runs: [],
    guides: ['Stillwater Anglers', 'Sweetcast Angler'],
  },

  // ─── WYOMING ────────────────────────────────────────────────────────

  snake_wy: {
    species: [
      { name: 'Snake River Fine-Spotted Cutthroat Trout', type: 'resident', primary: true, notes: 'Endemic subspecies — found only in the Snake River drainage' },
      { name: 'Brown Trout', type: 'resident', primary: true, notes: 'Large fish in lower sections' },
      { name: 'Rainbow Trout', type: 'resident', primary: false },
      { name: 'Mountain Whitefish', type: 'resident', primary: false },
    ],
    designations: ['Grand Teton National Park', 'Wyoming Blue-Ribbon Trout Stream', 'Bridger-Teton National Forest'],
    spawning: [
      { species: 'Snake River Cutthroat', season: 'May–July' },
      { species: 'Brown Trout', season: 'October–November' },
      { species: 'Rainbow Trout', season: 'April–June' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive', timing: 'April–May, September–October' },
      { name: 'Caddis', timing: 'May–June' },
      { name: 'Salmonfly / Golden Stonefly', timing: 'Late June – July', notes: 'The premier hatch — cutthroat slash aggressively at big dries' },
      { name: 'Green Drake', timing: 'Late June – July' },
      { name: 'Pale Morning Dun', timing: 'June–August' },
      { name: 'Hopper/Dropper', timing: 'July–September', notes: 'Best dry fly fishing of summer' },
      { name: 'October Caddis', timing: 'September–October' },
    ],
    runs: [],
    guides: ['Snake River Angler', 'Worldcast Anglers'],
  },

  green_wy: {
    species: [
      { name: 'Rainbow Trout', type: 'resident', primary: true, notes: 'Tailwater rainbows average 16–20 inches' },
      { name: 'Brown Trout', type: 'resident', primary: true, notes: 'Trophy fish below Fontenelle and Flaming Gorge dams' },
      { name: 'Kokanee Salmon', type: 'resident', primary: false, notes: 'Landlocked sockeye — in Flaming Gorge Reservoir' },
      { name: 'Mountain Whitefish', type: 'resident', primary: false },
    ],
    designations: ['Blue-Ribbon Trout Stream (below Flaming Gorge Dam)', 'Flaming Gorge National Recreation Area'],
    spawning: [
      { species: 'Rainbow Trout', season: 'March–May' },
      { species: 'Brown Trout', season: 'October–November' },
    ],
    hatches: [
      { name: 'Midge', timing: 'Year-round, especially November–March' },
      { name: 'Blue-Winged Olive', timing: 'April–May, September–October' },
      { name: 'Caddis', timing: 'May–June' },
      { name: 'Pale Morning Dun', timing: 'June–August' },
      { name: 'Cicada', timing: 'July–August', notes: 'Periodic — explosive dry fly fishing in cycle years' },
      { name: 'Hopper/Dropper', timing: 'July–September' },
    ],
    runs: [],
    guides: ['Trout Creek Flies', 'Green River Drifters'],
  },

  north_platte: {
    species: [
      { name: 'Rainbow Trout', type: 'resident', primary: true, notes: 'Miracle Mile rainbows average 17–20 inches' },
      { name: 'Brown Trout', type: 'resident', primary: true, notes: 'Trophy browns — fish over 10 lbs taken annually' },
      { name: 'Walleye', type: 'warmwater', primary: false, notes: 'Reservoir-associated' },
    ],
    designations: ['Wyoming Blue-Ribbon Trout Stream', "Miracle Mile (WGFD Special Regulation Area)", 'Grey Reef Blue-Ribbon Section'],
    spawning: [
      { species: 'Rainbow Trout', season: 'March–May' },
      { species: 'Brown Trout', season: 'October–November' },
    ],
    hatches: [
      { name: 'Midge', timing: 'Year-round, dominant November–March', notes: 'The bread-and-butter pattern on the Miracle Mile' },
      { name: 'Blue-Winged Olive', timing: 'April–May, September–October' },
      { name: 'Caddis', timing: 'May–June' },
      { name: 'Pale Morning Dun', timing: 'June–August' },
      { name: 'Trico', timing: 'July–September', notes: 'Heavy spinner falls at Grey Reef' },
      { name: 'Hopper/Dropper', timing: 'July–September' },
    ],
    runs: [],
    guides: ['Ugly Bug Fly Shop', 'North Platte Lodge'],
  },

  // ─── COLORADO ───────────────────────────────────────────────────────

  poudre: {
    species: [
      { name: 'Rainbow Trout', type: 'resident', primary: true },
      { name: 'Brown Trout', type: 'resident', primary: true, notes: 'Wild fish dominant in canyon sections' },
      { name: 'Brook Trout', type: 'resident', primary: false, notes: 'Upper headwaters and tributaries' },
      { name: 'Greenback Cutthroat Trout', type: 'resident', primary: false, notes: "Colorado's state fish — recovery efforts in tributaries" },
    ],
    designations: ['National Wild & Scenic River', 'Colorado Gold Medal candidate waters', 'Roosevelt National Forest'],
    spawning: [
      { species: 'Brown Trout', season: 'October–November' },
      { species: 'Rainbow Trout', season: 'March–May' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive', timing: 'April–May, September–October' },
      { name: 'Caddis', timing: 'May–July', notes: "Mother's Day Caddis kicks off the season" },
      { name: 'Stonefly (Golden Stone)', timing: 'June–July' },
      { name: 'Pale Morning Dun', timing: 'June–August' },
      { name: 'Red Quill', timing: 'July–August' },
      { name: 'Hopper/Dropper', timing: 'July–September' },
      { name: 'Terrestrials', timing: 'July–September' },
    ],
    runs: [],
    guides: ["St. Peter's Fly Shop", 'Rocky Mountain Adventures'],
  },

  yampa: {
    species: [
      { name: 'Northern Pike', type: 'warmwater', primary: true, notes: 'Invasive — threatening native fish; removal encouraged' },
      { name: 'Smallmouth Bass', type: 'warmwater', primary: true },
      { name: 'Channel Catfish', type: 'warmwater', primary: false },
      { name: 'Colorado Pikeminnow', type: 'warmwater', primary: false, notes: 'Endangered native — catch and release, report sightings to CPW' },
    ],
    designations: ['Yampa River Core Habitat for endangered fish (USFWS)', 'Dinosaur National Monument (lower canyon)'],
    spawning: [
      { species: 'Northern Pike', season: 'March–May', notes: 'Pike removal programs active — keep all pike caught' },
      { species: 'Smallmouth Bass', season: 'May–July' },
    ],
    hatches: [],
    runs: [],
    guides: ['Steamboat Flyfisher', 'Bucking Rainbow Outfitters'],
  },

  // ─── OREGON ─────────────────────────────────────────────────────────

  rogue: {
    species: [
      { name: 'Steelhead (summer)', type: 'anadromous', primary: true, notes: 'Half-pounder steelhead unique to the Rogue' },
      { name: 'Steelhead (winter)', type: 'anadromous', primary: true },
      { name: 'Chinook Salmon (spring)', type: 'anadromous', primary: true },
      { name: 'Chinook Salmon (fall)', type: 'anadromous', primary: false },
      { name: 'Coho Salmon', type: 'anadromous', primary: false },
      { name: 'Resident Rainbow Trout', type: 'resident', primary: false },
    ],
    designations: ['National Wild & Scenic River', 'Wild Rogue Wilderness', 'ODFW Wild Fish Management Area'],
    spawning: [
      { species: 'Chinook Salmon (spring)', season: 'September–October' },
      { species: 'Chinook Salmon (fall)', season: 'October–November' },
      { species: 'Coho Salmon', season: 'November–January' },
      { species: 'Steelhead (winter)', season: 'February–April' },
    ],
    hatches: [
      { name: 'Caddis', timing: 'April–June' },
      { name: 'Salmonfly', timing: 'May–June' },
      { name: 'Golden Stonefly', timing: 'June–July' },
      { name: 'October Caddis', timing: 'September–November' },
    ],
    runs: [
      { species: 'Spring Chinook', timing: 'April – July', peak: 'May–June', notes: 'Prized for table quality — hatchery fish may be kept' },
      { species: 'Summer Steelhead', timing: 'June – October', peak: 'August–September', notes: 'Half-pounders return as immature 2–4 lb fish — unique to the Rogue and Klamath' },
      { species: 'Fall Chinook', timing: 'September – November', peak: 'October' },
      { species: 'Winter Steelhead', timing: 'December – April', peak: 'January–February' },
      { species: 'Coho Salmon', timing: 'September – November', peak: 'October' },
    ],
    guides: ['Rogue River Outfitters', 'Morrisons Rogue Wilderness Adventures'],
  },

  deschutes: {
    species: [
      { name: 'Resident Rainbow Trout (Redsides)', type: 'resident', primary: true, notes: 'Wild redside rainbows — hard-fighting, beautifully colored native strain' },
      { name: 'Steelhead', type: 'anadromous', primary: true, notes: 'Wild and hatchery summer steelhead' },
      { name: 'Chinook Salmon', type: 'anadromous', primary: false, notes: 'Spring Chinook — limited fishing opportunity' },
      { name: 'Brown Trout', type: 'resident', primary: false, notes: 'Below Pelton Dam' },
    ],
    designations: ['National Wild & Scenic River', 'Oregon Blue-Ribbon equivalent (ODFW Quality Waters)', 'BLM Wild & Scenic Corridor'],
    spawning: [
      { species: 'Rainbow Trout (Redsides)', season: 'March–May' },
      { species: 'Brown Trout', season: 'October–November' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive', timing: 'March–May' },
      { name: 'Caddis (Mother\'s Day Caddis)', timing: 'May–June', notes: 'Enormous emergence — the signature Deschutes hatch' },
      { name: 'Salmonfly', timing: 'Late May – June', notes: 'Iconic hatch — fish eat big dries aggressively' },
      { name: 'Golden Stonefly', timing: 'June–July' },
      { name: 'Pale Morning Dun', timing: 'June–August' },
      { name: 'October Caddis', timing: 'September–November', notes: 'Size 8 — best late season dry fly action' },
    ],
    runs: [
      { species: 'Summer Steelhead', timing: 'July – November', peak: 'September–October', notes: 'Legendary steelhead fishery — traditional spey and swing techniques' },
      { species: 'Spring Chinook', timing: 'April – June', peak: 'May', notes: 'Limited opportunity — check ODFW regulations' },
    ],
    guides: ['Deschutes Angler', 'The Fly Fisher\'s Place'],
  },

  mckenzie: {
    species: [
      { name: 'Rainbow Trout', type: 'resident', primary: true, notes: "Wild McKenzie strain — emerald-clear spring-fed water" },
      { name: 'Spring Chinook Salmon', type: 'anadromous', primary: true, notes: 'Highly prized spring run' },
      { name: 'Bull Trout', type: 'resident', primary: false, notes: 'Threatened — catch and release only' },
    ],
    designations: ['National Wild & Scenic River', 'Willamette National Forest', 'Home of the McKenzie River drift boat'],
    spawning: [
      { species: 'Rainbow Trout', season: 'March–May' },
      { species: 'Spring Chinook', season: 'August–September' },
      { species: 'Bull Trout', season: 'September–October' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive', timing: 'March–May' },
      { name: 'March Brown', timing: 'March–April' },
      { name: 'Caddis', timing: 'April–June' },
      { name: 'Green Drake', timing: 'Late May – June' },
      { name: 'Golden Stonefly', timing: 'June–July' },
      { name: 'October Caddis', timing: 'September–October' },
    ],
    runs: [
      { species: 'Spring Chinook', timing: 'April – July', peak: 'May–June', notes: 'Check ODFW regulations for retention rules' },
    ],
    guides: ['The Caddis Fly Angling Shop', 'Oregon Fly Fishing Blog Guides'],
  },

  north_umpqua: {
    species: [
      { name: 'Summer Steelhead', type: 'anadromous', primary: true, notes: "World-famous summer steelhead — Zane Grey called it his favorite river" },
      { name: 'Resident Rainbow Trout', type: 'resident', primary: false },
      { name: 'Spring Chinook Salmon', type: 'anadromous', primary: false },
    ],
    designations: ['National Wild & Scenic River', 'Fly-Fishing-Only Water (31-mile Camp Water stretch)', 'Umpqua National Forest', "Zane Grey's legendary steelhead river"],
    spawning: [
      { species: 'Summer Steelhead', season: 'January–March' },
      { species: 'Spring Chinook', season: 'August–September' },
    ],
    hatches: [
      { name: 'Caddis', timing: 'April–June' },
      { name: 'Golden Stonefly', timing: 'June–July' },
      { name: 'October Caddis', timing: 'September–November' },
    ],
    runs: [
      { species: 'Summer Steelhead', timing: 'June – November', peak: 'September–October', notes: 'Fly-fishing-only on Camp Water — traditional wet fly swing is the method' },
      { species: 'Spring Chinook', timing: 'April – July', peak: 'May–June' },
    ],
    guides: ['North Umpqua Outfitters', 'Blue Heron Fly Shop'],
  },

  // ─── WASHINGTON ─────────────────────────────────────────────────────

  wenatchee: {
    species: [
      { name: 'Steelhead', type: 'anadromous', primary: true, notes: 'Wild steelhead — catch and release only' },
      { name: 'Chinook Salmon', type: 'anadromous', primary: true, notes: 'Spring and summer/fall runs' },
      { name: 'Sockeye Salmon', type: 'anadromous', primary: false, notes: 'Run to Lake Wenatchee — tribal and sport harvest in select years' },
      { name: 'Resident Rainbow Trout', type: 'resident', primary: false },
    ],
    designations: ['Okanogan-Wenatchee National Forest', 'WDFW Wild Steelhead Release rules', 'Critical habitat for ESA-listed salmon'],
    spawning: [
      { species: 'Chinook Salmon', season: 'September–October' },
      { species: 'Steelhead', season: 'March–May' },
      { species: 'Sockeye Salmon', season: 'August–September' },
    ],
    hatches: [
      { name: 'Skwala Stonefly', timing: 'March–April' },
      { name: 'Caddis', timing: 'May–June' },
      { name: 'Salmonfly', timing: 'June–July' },
      { name: 'Pale Morning Dun', timing: 'June–August' },
      { name: 'Hopper/Dropper', timing: 'July–September' },
    ],
    runs: [
      { species: 'Spring Chinook', timing: 'May – July', peak: 'June', notes: 'Check WDFW emergency rules — openings vary yearly' },
      { species: 'Sockeye Salmon', timing: 'June – August', peak: 'July', notes: 'Limited sport seasons in strong run years only' },
      { species: 'Summer/Fall Chinook', timing: 'July – October', peak: 'September' },
      { species: 'Steelhead', timing: 'October – April', peak: 'November–December', notes: 'Wild steelhead release required' },
    ],
    guides: ['Wenatchee River Anglers', 'Evening Hatch Guide Service'],
  },

  skagit: {
    species: [
      { name: 'Chinook Salmon', type: 'anadromous', primary: true },
      { name: 'Coho Salmon', type: 'anadromous', primary: true },
      { name: 'Pink Salmon', type: 'anadromous', primary: false, notes: 'Odd-year runs' },
      { name: 'Chum Salmon', type: 'anadromous', primary: false },
      { name: 'Sockeye Salmon', type: 'anadromous', primary: false, notes: 'Baker Lake sockeye' },
      { name: 'Steelhead', type: 'anadromous', primary: true, notes: 'Wild winter and summer runs — all wild steelhead catch and release' },
      { name: 'Bull Trout', type: 'resident', primary: false, notes: 'Threatened — catch and release only' },
    ],
    designations: ['National Wild & Scenic River', 'Skagit River Bald Eagle Natural Area', 'All 5 Pacific salmon species present', 'WDFW Wild Steelhead Release rules'],
    spawning: [
      { species: 'Chinook Salmon', season: 'September–October' },
      { species: 'Chum Salmon', season: 'November–December' },
      { species: 'Coho Salmon', season: 'October–December' },
      { species: 'Steelhead (winter)', season: 'March–May' },
      { species: 'Bull Trout', season: 'September–October' },
    ],
    hatches: [
      { name: 'Skwala Stonefly', timing: 'February–April' },
      { name: 'Caddis', timing: 'April–June' },
      { name: 'Pink Albert (Pink Cahill)', timing: 'June–July' },
    ],
    runs: [
      { species: 'Summer Steelhead', timing: 'May – October', peak: 'July–August' },
      { species: 'Chinook Salmon', timing: 'July – October', peak: 'August–September' },
      { species: 'Pink Salmon', timing: 'August – October', peak: 'September', notes: 'Odd years only — massive runs when they come' },
      { species: 'Coho Salmon', timing: 'September – November', peak: 'October' },
      { species: 'Chum Salmon', timing: 'October – December', peak: 'November', notes: 'Draws hundreds of bald eagles in winter' },
      { species: 'Winter Steelhead', timing: 'December – April', peak: 'February–March', notes: 'World-class spey fishery — birthplace of the Skagit casting style' },
    ],
    guides: ['Emerald Water Anglers', 'Pacific Fly Fishers'],
  },

  // ─── CALIFORNIA ─────────────────────────────────────────────────────

  tuolumne: {
    species: [
      { name: 'Rainbow Trout', type: 'resident', primary: true, notes: 'Wild fish in upper canyon sections' },
      { name: 'Brown Trout', type: 'resident', primary: true, notes: 'Below reservoirs' },
    ],
    designations: ['National Wild & Scenic River (upper sections)', 'Stanislaus National Forest', 'Sierra granite whitewater and trout'],
    spawning: [
      { species: 'Rainbow Trout', season: 'March–May' },
      { species: 'Brown Trout', season: 'October–November' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive', timing: 'March–May, October–November' },
      { name: 'Caddis', timing: 'May–July' },
      { name: 'Golden Stonefly', timing: 'June–July' },
      { name: 'Pale Morning Dun', timing: 'June–August' },
      { name: 'Hopper/Dropper', timing: 'July–September' },
    ],
    runs: [],
    guides: ['Sierra Fly Fisher', 'ARTA River Trips'],
  },

  kern: {
    species: [
      { name: 'Rainbow Trout', type: 'resident', primary: true },
      { name: 'Golden Trout', type: 'resident', primary: true, notes: "California's state fish — native to upper Kern River drainage, South Fork Kern. One of the most beautiful trout in the world" },
      { name: 'Brown Trout', type: 'resident', primary: false, notes: 'Lower sections' },
    ],
    designations: ['National Wild & Scenic River', 'Sequoia National Forest', 'Golden Trout Wilderness (upper Kern)', "Kern River is the birthplace of California's golden trout"],
    spawning: [
      { species: 'Golden Trout', season: 'June–August', notes: 'High-elevation spawning — extremely sensitive habitat' },
      { species: 'Rainbow Trout', season: 'March–May' },
      { species: 'Brown Trout', season: 'October–November' },
    ],
    hatches: [
      { name: 'Caddis', timing: 'April–June' },
      { name: 'Golden Stonefly', timing: 'June–July' },
      { name: 'Pale Morning Dun', timing: 'June–August' },
      { name: 'Hopper/Dropper', timing: 'July–September' },
    ],
    runs: [],
    guides: ['Kern River Fly Shop', 'Sierra South Mountain Sports'],
  },

  trinity: {
    species: [
      { name: 'Steelhead', type: 'anadromous', primary: true, notes: 'Both wild and hatchery runs' },
      { name: 'Chinook Salmon (spring)', type: 'anadromous', primary: true },
      { name: 'Chinook Salmon (fall)', type: 'anadromous', primary: true },
      { name: 'Coho Salmon', type: 'anadromous', primary: false },
    ],
    designations: ['National Wild & Scenic River (portions)', 'Hoopa Valley Tribe treaty fishing rights', 'Trinity Alps Wilderness headwaters', 'CDFW-managed hatchery program at Trinity River Hatchery'],
    spawning: [
      { species: 'Spring Chinook', season: 'August–September' },
      { species: 'Fall Chinook', season: 'October–November' },
      { species: 'Coho Salmon', season: 'November–January' },
      { species: 'Steelhead', season: 'February–April' },
    ],
    hatches: [
      { name: 'Caddis', timing: 'April–June' },
      { name: 'Stonefly', timing: 'May–July' },
      { name: 'October Caddis', timing: 'September–November' },
    ],
    runs: [
      { species: 'Spring Chinook', timing: 'April – July', peak: 'May–June', notes: 'Prized run — check CDFW and Hoopa Tribe regulations' },
      { species: 'Fall Chinook', timing: 'September – November', peak: 'October' },
      { species: 'Coho Salmon', timing: 'October – December', peak: 'November' },
      { species: 'Steelhead', timing: 'November – April', peak: 'January–February', notes: "Both wild and hatchery fish — fin clip determines retention" },
    ],
    guides: ['Trinity River Outfitters', 'The Trinity Fly Shop'],
  },

  merced: {
    species: [
      { name: 'Rainbow Trout', type: 'resident', primary: true, notes: 'Wild populations in Yosemite Valley reaches' },
      { name: 'Brown Trout', type: 'resident', primary: true, notes: 'El Portal and downstream sections' },
    ],
    designations: ['National Wild & Scenic River', 'Yosemite National Park', 'Sierra National Forest'],
    spawning: [
      { species: 'Rainbow Trout', season: 'March–May' },
      { species: 'Brown Trout', season: 'October–November' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive', timing: 'March–May, October–November' },
      { name: 'Caddis', timing: 'April–June' },
      { name: 'Golden Stonefly', timing: 'June–July' },
      { name: 'Pale Morning Dun', timing: 'June–August' },
      { name: 'Hopper/Dropper', timing: 'July–September' },
    ],
    runs: [],
    guides: ['Yosemite Fly Fishing Guide Service', 'Sierra Fly Fisher'],
  },

  // ─── ARIZONA ────────────────────────────────────────────────────────

  grandcanyon: {
    species: [
      { name: 'Humpback Chub', type: 'warmwater', primary: true, notes: 'Federally endangered native — found only in Colorado River basin. The Little Colorado River confluence is the primary population stronghold. Release immediately if caught.' },
      { name: 'Rainbow Trout', type: 'resident', primary: true, notes: 'Lees Ferry tailwater below Glen Canyon Dam — cold, clear releases create a world-class 15-mile trout fishery' },
    ],
    designations: ['Grand Canyon National Park', 'Lees Ferry Special Trout Regulations (AZGFD)', 'Humpback Chub Critical Habitat (USFWS)', 'Glen Canyon National Recreation Area (Lees Ferry reach)'],
    spawning: [
      { species: 'Rainbow Trout', season: 'November–March', notes: 'Lees Ferry section — dam-controlled water temperatures shift natural timing' },
    ],
    hatches: [
      { name: 'Midge', timing: 'Year-round', notes: 'Dominant food source at Lees Ferry — size 18–24' },
      { name: 'Scud/Amphipod', timing: 'Year-round', notes: 'Not a hatch but a critical subsurface food source below the dam' },
      { name: 'Caddis', timing: 'April–June' },
    ],
    runs: [],
    guides: ['Lees Ferry Anglers', 'Marble Canyon Outfitters'],
  },

  // ─── NEVADA ─────────────────────────────────────────────────────────

  truckee: {
    species: [
      { name: 'Lahontan Cutthroat Trout', type: 'resident', primary: true, notes: 'Threatened native subspecies — Pyramid Lake strain can exceed 20 lbs. Recovery program ongoing.' },
      { name: 'Brown Trout', type: 'resident', primary: true },
      { name: 'Rainbow Trout', type: 'resident', primary: false },
      { name: 'Mountain Whitefish', type: 'resident', primary: false },
    ],
    designations: ['Lahontan Cutthroat Trout Recovery Area (USFWS)', 'Pyramid Lake Paiute Tribe Reservation (lower river/lake)', 'NDOW Special Regulations', 'Toiyabe National Forest (upper sections)'],
    spawning: [
      { species: 'Lahontan Cutthroat', season: 'March–June', notes: 'Spawning run from Pyramid Lake up the Truckee — historically one of the great fish migrations in North America' },
      { species: 'Brown Trout', season: 'October–November' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive', timing: 'March–May, October–November' },
      { name: 'Caddis', timing: 'May–June' },
      { name: 'Pale Morning Dun', timing: 'June–August' },
      { name: 'Golden Stonefly', timing: 'June–July' },
      { name: 'Hopper/Dropper', timing: 'July–September' },
      { name: 'October Caddis', timing: 'September–October' },
    ],
    runs: [
      { species: 'Lahontan Cutthroat Trout', timing: 'March – June', peak: 'April–May', notes: 'Pyramid Lake fish run upstream to spawn — tribal permit required for Pyramid Lake fishing' },
    ],
    guides: ['Truckee River Outfitters', 'Reno Fly Shop'],
  },

  // ─── UTAH ───────────────────────────────────────────────────────────

  desolation: {
    species: [
      { name: 'Channel Catfish', type: 'warmwater', primary: true, notes: 'Excellent catfishing — big fish common' },
      { name: 'Smallmouth Bass', type: 'warmwater', primary: true },
      { name: 'Colorado Pikeminnow', type: 'warmwater', primary: false, notes: 'Endangered native — release immediately if caught' },
      { name: 'Razorback Sucker', type: 'warmwater', primary: false, notes: 'Endangered native — release immediately' },
    ],
    designations: ['BLM Wilderness Study Area', 'Desolation Canyon (one of the deepest canyons in North America)', 'Critical habitat for endangered Colorado River fish'],
    spawning: [
      { species: 'Channel Catfish', season: 'June–August' },
      { species: 'Smallmouth Bass', season: 'May–July' },
    ],
    hatches: [],
    runs: [],
    guides: ['Holiday River Expeditions', 'OARS'],
  },

  san_juan: {
    species: [
      { name: 'Rainbow Trout', type: 'resident', primary: true, notes: 'Tailwater fish average 16–20 inches — 15,000+ trout per mile in Quality Waters' },
      { name: 'Brown Trout', type: 'resident', primary: true, notes: 'Trophy browns present' },
    ],
    designations: ['Quality Waters (NMDGF) — first 3.75 miles below Navajo Dam', 'World-class tailwater fishery', 'San Juan River Special Trout Water regulations'],
    spawning: [
      { species: 'Rainbow Trout', season: 'November–February', notes: 'Dam-controlled flows keep water temps stable — shifted spawn timing' },
      { species: 'Brown Trout', season: 'October–November' },
    ],
    hatches: [
      { name: 'Midge', timing: 'Year-round', notes: "The San Juan is a midge factory — size 22–28. This is THE pattern to master here" },
      { name: 'Blue-Winged Olive', timing: 'March–May, October–November', notes: 'Reliable hatches — fish key on emergers' },
      { name: 'Pale Morning Dun', timing: 'June–August' },
    ],
    runs: [],
    guides: ['Abe\'s Motel & Fly Shop', 'Duranglers (San Juan guide trips)'],
  },

  // ─── NEW MEXICO ─────────────────────────────────────────────────────

  taos_box: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true, notes: 'Wild fish — big browns in the deep pools of the gorge' },
      { name: 'Rainbow Trout', type: 'resident', primary: true },
      { name: 'Rio Grande Cutthroat Trout', type: 'resident', primary: false, notes: 'Native subspecies — rare, state fish of New Mexico. Found in tributaries above the gorge.' },
    ],
    designations: ['Rio Grande del Norte National Monument', 'Rio Grande Wild & Scenic River', 'NMDGF Special Trout Waters'],
    spawning: [
      { species: 'Brown Trout', season: 'October–November' },
      { species: 'Rainbow Trout', season: 'March–May' },
      { species: 'Rio Grande Cutthroat', season: 'May–July', notes: 'Extremely sensitive — avoid tributaries during spawning' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive', timing: 'March–May, September–October' },
      { name: 'Caddis', timing: 'May–July' },
      { name: 'Stonefly', timing: 'June–July' },
      { name: 'Pale Morning Dun', timing: 'June–August' },
      { name: 'Hopper/Dropper', timing: 'July–September' },
    ],
    runs: [],
    guides: ['The Taos Fly Shop', 'FishTales Guide Service'],
  },

  rio_chama: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true, notes: 'Wild browns in the wilderness canyon sections' },
      { name: 'Rainbow Trout', type: 'resident', primary: true },
    ],
    designations: ['National Wild & Scenic River', 'Chama River Canyon Wilderness', 'NMDGF Special Trout Waters (below El Vado Dam)'],
    spawning: [
      { species: 'Brown Trout', season: 'October–November' },
      { species: 'Rainbow Trout', season: 'March–May' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive', timing: 'March–May, September–October' },
      { name: 'Caddis', timing: 'May–June' },
      { name: 'Pale Morning Dun', timing: 'June–August' },
      { name: 'Hopper/Dropper', timing: 'July–September' },
    ],
    runs: [],
    guides: ['Rio Chama Outfitters', 'High Desert Angler'],
  },

  gila_nm: {
    species: [
      { name: 'Gila Trout', type: 'resident', primary: true, notes: "Federally endangered — one of the rarest trout in North America. Native only to the Gila River headwaters. Active recovery program by USFWS and NMDGF." },
      { name: 'Rainbow Trout', type: 'resident', primary: false, notes: 'Stocked in lower sections — being removed from recovery streams to protect Gila trout genetics' },
    ],
    designations: ['Gila Wilderness (first designated wilderness in the US, 1924)', 'Gila National Forest', 'Gila Trout Recovery Area (USFWS)', 'NMDGF Special Regulations — check current rules before fishing'],
    spawning: [
      { species: 'Gila Trout', season: 'April–June', notes: 'Recovery streams may be closed to all fishing — check NMDGF before going' },
    ],
    hatches: [
      { name: 'Caddis', timing: 'April–June' },
      { name: 'Stonefly', timing: 'May–June' },
      { name: 'Pale Morning Dun', timing: 'June–August' },
      { name: 'Hopper/Dropper', timing: 'July–September' },
    ],
    runs: [],
    guides: ['Gila Trout Fly Fishing (guided by NMDGF permit holders)', 'Silver City Outfitters'],
  },

// Eastern US fisheries data — object entries only
// Paste these into the main FISHERIES record in fisheries.ts
// Sources: state DNR/wildlife agencies, Trout Unlimited, IGFA, local fly shops

  // ==========================================
  // PENNSYLVANIA
  // ==========================================

  yough: {
    species: [
      { name: "Brown Trout", type: "resident", primary: true, notes: "Wild fish in Lower Yough below Ohiopyle" },
      { name: "Rainbow Trout", type: "resident", primary: true },
      { name: "Smallmouth Bass", type: "warmwater", primary: true, notes: "Excellent population in lower sections" },
    ],
    designations: ["Pennsylvania Scenic River", "PA Fish & Boat Commission Stocked Trout Waters"],
    spawning: [
      { species: "Brown Trout", season: "October–November" },
      { species: "Rainbow Trout", season: "March–April" },
    ],
    hatches: [
      { name: "Blue-Winged Olive", timing: "March–April, October–November" },
      { name: "Hendrickson", timing: "Late April – May" },
      { name: "Caddis", timing: "May–June" },
      { name: "Sulfur", timing: "Late May – June" },
      { name: "Light Cahill", timing: "June–July" },
      { name: "Terrestrials", timing: "July–September" },
    ],
    runs: [],
    guides: ["Youghiogheny Outfitters", "Ohiopyle Trading Post"],
  },

  pinecreek: {
    species: [
      { name: "Brown Trout", type: "resident", primary: true },
      { name: "Brook Trout", type: "resident", primary: true, notes: "Wild fish in tributaries and upper reaches" },
      { name: "Smallmouth Bass", type: "warmwater", primary: true, notes: "Strong population in the canyon" },
    ],
    designations: ["Pennsylvania Grand Canyon", "PA Scenic River", "PA Fish & Boat Commission Special Regulation Trout Waters"],
    spawning: [
      { species: "Brook Trout", season: "September–November" },
      { species: "Brown Trout", season: "October–November" },
    ],
    hatches: [
      { name: "Blue-Winged Olive", timing: "April–May, September–October" },
      { name: "Hendrickson", timing: "Late April – May" },
      { name: "March Brown", timing: "May–June" },
      { name: "Green Drake", timing: "Late May – Early June" },
      { name: "Sulfur", timing: "May–June" },
      { name: "Slate Drake", timing: "June–September" },
      { name: "Terrestrials", timing: "July–September" },
    ],
    runs: [],
    guides: ["Pine Creek Outfitters", "Wolfe's Sporting Goods"],
  },

  lehigh: {
    species: [
      { name: "Brown Trout", type: "resident", primary: true, notes: "Wild and stocked fish below Francis E. Walter Dam" },
      { name: "Rainbow Trout", type: "resident", primary: true },
    ],
    designations: ["Dam-Release Tailwater", "PA Fish & Boat Commission Stocked Trout Waters", "Lehigh Gorge State Park"],
    spawning: [
      { species: "Brown Trout", season: "October–November" },
      { species: "Rainbow Trout", season: "March–April" },
    ],
    hatches: [
      { name: "Blue-Winged Olive", timing: "March–April, October–November" },
      { name: "Hendrickson", timing: "Late April – May" },
      { name: "Caddis", timing: "May–June" },
      { name: "Sulfur", timing: "Late May – June" },
      { name: "Isonychia", timing: "June–September" },
      { name: "Terrestrials", timing: "July–September" },
    ],
    runs: [],
    guides: ["Lehigh River Stocking Association", "Pocono Fly Shop"],
  },

  // ==========================================
  // WEST VIRGINIA
  // ==========================================

  gauley: {
    species: [
      { name: "Smallmouth Bass", type: "warmwater", primary: true, notes: "Good numbers throughout the river" },
      { name: "Rock Bass", type: "warmwater", primary: false },
    ],
    designations: ["Gauley River National Recreation Area", "National Wild & Scenic River"],
    spawning: [],
    hatches: [],
    runs: [],
    guides: ["Rivers Resort", "Adventures on the Gorge"],
  },

  newriver: {
    species: [
      { name: "Smallmouth Bass", type: "warmwater", primary: true, notes: "World-class smallmouth fishery — one of the oldest rivers on Earth" },
      { name: "Rock Bass", type: "warmwater", primary: false },
      { name: "Musky", type: "warmwater", primary: false, notes: "Trophy musky present throughout" },
    ],
    designations: ["New River Gorge National Park", "National Wild & Scenic River"],
    spawning: [
      { species: "Smallmouth Bass", season: "May–June" },
    ],
    hatches: [],
    runs: [],
    guides: ["New River Smallmouth Adventures", "Rivers Resort"],
  },

  cheat: {
    species: [
      { name: "Smallmouth Bass", type: "warmwater", primary: true },
      { name: "Brook Trout", type: "resident", primary: false, notes: "Wild populations in cold tributaries" },
    ],
    designations: ["West Virginia Scenic River"],
    spawning: [
      { species: "Brook Trout", season: "September–November", notes: "In tributaries only" },
    ],
    hatches: [],
    runs: [],
    guides: ["Cheat River Outfitters"],
  },

  // ==========================================
  // VIRGINIA
  // ==========================================

  james: {
    species: [
      { name: "Smallmouth Bass", type: "warmwater", primary: true, notes: "World-class urban fishery through Richmond — fish the fall line rapids" },
      { name: "Channel Catfish", type: "warmwater", primary: true },
    ],
    designations: ["Virginia Scenic River (multiple segments)", "James River Park System (Richmond)"],
    spawning: [
      { species: "Smallmouth Bass", season: "May–June" },
    ],
    hatches: [],
    runs: [],
    guides: ["James River Fishing School", "Riverside Outfitters"],
  },

  shenandoah: {
    species: [
      { name: "Smallmouth Bass", type: "warmwater", primary: true },
      { name: "Musky", type: "warmwater", primary: true, notes: "South Fork is premier musky water" },
      { name: "Redbreast Sunfish", type: "warmwater", primary: false },
    ],
    designations: ["Shenandoah National Park (headwaters)", "Virginia Scenic River"],
    spawning: [
      { species: "Smallmouth Bass", season: "May–June" },
    ],
    hatches: [],
    runs: [],
    guides: ["Shenandoah River Outfitters", "Murray's Fly Shop"],
  },

  // ==========================================
  // KENTUCKY
  // ==========================================

  cumberland: {
    species: [
      { name: "Smallmouth Bass", type: "warmwater", primary: true, notes: "Excellent fishing in Big South Fork gorge" },
      { name: "Musky", type: "warmwater", primary: true },
      { name: "Rock Bass", type: "warmwater", primary: false },
    ],
    designations: ["Big South Fork National River & Recreation Area", "Kentucky Wild River"],
    spawning: [
      { species: "Smallmouth Bass", season: "May–June" },
    ],
    hatches: [],
    runs: [],
    guides: ["Sheltowee Trace Outfitters", "Big South Fork Guide Service"],
  },

  green_river: {
    species: [
      { name: "Smallmouth Bass", type: "warmwater", primary: true },
      { name: "Spotted Bass", type: "warmwater", primary: true },
      { name: "Musky", type: "warmwater", primary: false },
    ],
    designations: ["Mammoth Cave National Park", "Kentucky Scenic River"],
    spawning: [
      { species: "Smallmouth Bass", season: "May–June" },
    ],
    hatches: [],
    runs: [],
    guides: ["Green River Canoeing", "Mammoth Cave Kayak Tours"],
  },

  // ==========================================
  // TENNESSEE
  // ==========================================

  nolichucky: {
    species: [
      { name: "Smallmouth Bass", type: "warmwater", primary: true },
      { name: "Rainbow Trout", type: "resident", primary: true, notes: "Stocked in the gorge section — cold water from mountain tributaries" },
    ],
    designations: ["Cherokee National Forest", "Tennessee Scenic River"],
    spawning: [],
    hatches: [
      { name: "Caddis", timing: "April–June" },
      { name: "Sulfur", timing: "May–June" },
      { name: "Terrestrials", timing: "July–September" },
    ],
    runs: [],
    guides: ["Nolichucky Gorge Campground", "Wahoo's Adventures"],
  },

  ocoee: {
    species: [
      { name: "Rainbow Trout", type: "resident", primary: true, notes: "Stocked tailwater below Ocoee No. 3 Dam" },
    ],
    designations: ["Cherokee National Forest", "1996 Olympic Whitewater Venue", "TVA Dam-Release Tailwater"],
    spawning: [],
    hatches: [],
    runs: [],
    guides: ["Ocoee Outdoors"],
  },

  hiwassee: {
    species: [
      { name: "Brown Trout", type: "resident", primary: true, notes: "Trophy browns in cold tailwater below Appalachia Dam" },
      { name: "Rainbow Trout", type: "resident", primary: true },
    ],
    designations: ["Cherokee National Forest", "Tennessee Blue-Ribbon Equivalent Trout Stream", "TVA Dam-Release Tailwater"],
    spawning: [
      { species: "Brown Trout", season: "October–December" },
      { species: "Rainbow Trout", season: "February–April" },
    ],
    hatches: [
      { name: "Blue-Winged Olive", timing: "March–April, October–November" },
      { name: "Sulfur", timing: "May–June" },
      { name: "Caddis", timing: "April–June" },
      { name: "Light Cahill", timing: "June–July" },
      { name: "Terrestrials", timing: "July–September" },
    ],
    runs: [],
    guides: ["Hiwassee Outfitters", "Southeastern Anglers"],
  },

  // ==========================================
  // NORTH CAROLINA
  // ==========================================

  // nantahala: ALREADY EXISTS in fisheries.ts

  chattooga: {
    species: [
      { name: "Brown Trout", type: "resident", primary: true },
      { name: "Rainbow Trout", type: "resident", primary: true },
      { name: "Brook Trout", type: "resident", primary: false, notes: "Wild populations in headwater tributaries above 3,000 ft" },
    ],
    designations: ["National Wild & Scenic River", "Sumter / Nantahala / Chattahoochee National Forests", "Ellicott Rock Wilderness"],
    spawning: [
      { species: "Brook Trout", season: "September–November" },
      { species: "Brown Trout", season: "October–December" },
      { species: "Rainbow Trout", season: "February–April" },
    ],
    hatches: [
      { name: "Quill Gordon", timing: "March–April" },
      { name: "Blue-Winged Olive", timing: "March–May, October–November" },
      { name: "Caddis", timing: "April–June" },
      { name: "Light Cahill", timing: "May–June" },
      { name: "Terrestrials", timing: "July–September" },
    ],
    runs: [],
    guides: ["Chattooga River Fly Shop", "Chattooga Sounds Guides"],
  },

  french_broad: {
    species: [
      { name: "Smallmouth Bass", type: "warmwater", primary: true, notes: "Strong fishery through Asheville" },
      { name: "Musky", type: "warmwater", primary: true, notes: "Growing musky population — trophy potential" },
    ],
    designations: ["French Broad River State Trail", "NC Scenic River (portions)"],
    spawning: [
      { species: "Smallmouth Bass", season: "May–June" },
    ],
    hatches: [],
    runs: [],
    guides: ["French Broad Outfitters", "Asheville Anglers"],
  },

  // ==========================================
  // GEORGIA
  // ==========================================

  // chattooga_ga: Same river as chattooga (NC entry above).
  // The Chattooga forms the NC/SC/GA border — use the chattooga key for all states.
  chattooga_ga: {
    species: [
      { name: "Brown Trout", type: "resident", primary: true },
      { name: "Rainbow Trout", type: "resident", primary: true },
      { name: "Brook Trout", type: "resident", primary: false, notes: "Headwater tributaries" },
    ],
    designations: ["National Wild & Scenic River", "Chattahoochee National Forest (GA side)", "See chattooga entry for full details"],
    spawning: [],
    hatches: [],
    runs: [],
    guides: ["See chattooga entry"],
  },

  chattahoochee: {
    species: [
      { name: "Rainbow Trout", type: "resident", primary: true, notes: "Cold Buford Dam tailwater sustains trout through Atlanta — unique urban trout fishery" },
      { name: "Brown Trout", type: "resident", primary: true, notes: "Trophy browns below Buford Dam" },
    ],
    designations: ["Chattahoochee River National Recreation Area", "Georgia DNR Delayed Harvest Trout Stream", "Urban Trout Fishery"],
    spawning: [
      { species: "Brown Trout", season: "October–December" },
      { species: "Rainbow Trout", season: "February–April" },
    ],
    hatches: [
      { name: "Blue-Winged Olive", timing: "February–April, October–November" },
      { name: "Caddis", timing: "March–May" },
      { name: "Sulfur", timing: "May–June" },
      { name: "Midge", timing: "Year-round", notes: "Primary food source in tailwater" },
      { name: "Terrestrials", timing: "June–September" },
    ],
    runs: [],
    guides: ["River Through Atlanta Fly Fishing", "Fish Hawk"],
  },

  toccoa: {
    species: [
      { name: "Brown Trout", type: "resident", primary: true, notes: "Trophy browns — Georgia\"s best trout stream" },
      { name: "Rainbow Trout", type: "resident", primary: true },
    ],
    designations: ["Blue Ridge Dam Tailwater", "Georgia DNR Trophy Trout Waters", "Chattahoochee National Forest"],
    spawning: [
      { species: "Brown Trout", season: "October–December" },
      { species: "Rainbow Trout", season: "February–April" },
    ],
    hatches: [
      { name: "Blue-Winged Olive", timing: "March–April, October–November" },
      { name: "Caddis", timing: "April–June" },
      { name: "Sulfur", timing: "May–June" },
      { name: "Midge", timing: "Year-round" },
      { name: "Terrestrials", timing: "July–September" },
    ],
    runs: [],
    guides: ["Toccoa River Outfitters", "Reel Job Fishing"],
  },

  // ==========================================
  // NEW ENGLAND & MID-ATLANTIC
  // ==========================================

  // saco: ALREADY EXISTS in fisheries.ts
  // deerfield: ALREADY EXISTS in fisheries.ts

  penobscot: {
    species: [
      { name: "Landlocked Salmon", type: "resident", primary: true, notes: "Premier landlocked salmon river in Maine" },
      { name: "Brook Trout", type: "resident", primary: true, notes: "Wild populations throughout" },
      { name: "Smallmouth Bass", type: "warmwater", primary: true },
      { name: "Atlantic Salmon", type: "anadromous", primary: false, notes: "Active restoration program — catch and release only" },
    ],
    designations: ["Penobscot River Restoration Project", "NOAA Atlantic Salmon Critical Habitat"],
    spawning: [
      { species: "Brook Trout", season: "September–November" },
      { species: "Atlantic Salmon", season: "October–November", notes: "Endangered — do not disturb redds" },
    ],
    hatches: [
      { name: "Hendrickson", timing: "Late May – June" },
      { name: "Caddis", timing: "May–June" },
      { name: "Green Drake", timing: "June" },
      { name: "Hex", timing: "Late June – July" },
      { name: "Terrestrials", timing: "July–September" },
    ],
    runs: [
      { species: "Atlantic Salmon", timing: "May–October", peak: "June–July", notes: "Restoration run — all fish must be released" },
      { species: "Landlocked Salmon", timing: "September–November", peak: "October" },
    ],
    guides: ["Penobscot River Guides", "Maine Guide Fly Shop"],
  },

  kennebec: {
    species: [
      { name: "Landlocked Salmon", type: "resident", primary: true },
      { name: "Smallmouth Bass", type: "warmwater", primary: true },
      { name: "Brook Trout", type: "resident", primary: true, notes: "Wild fish in upper tributaries" },
    ],
    designations: ["Maine Scenic River (portions)", "Dam-Release Controlled Flows (below Harris Station)"],
    spawning: [
      { species: "Brook Trout", season: "September–November" },
      { species: "Landlocked Salmon", season: "October–November" },
    ],
    hatches: [
      { name: "Hendrickson", timing: "Late May – June" },
      { name: "Caddis", timing: "May–June" },
      { name: "Green Drake", timing: "June" },
      { name: "Hex", timing: "Late June – Early July" },
    ],
    runs: [],
    guides: ["Kennebec River Angler", "Maine Whitewater"],
  },

  hudson_gorge: {
    species: [
      { name: "Brook Trout", type: "resident", primary: true, notes: "Wild Adirondack brook trout" },
      { name: "Brown Trout", type: "resident", primary: true },
      { name: "Smallmouth Bass", type: "warmwater", primary: false },
    ],
    designations: ["Adirondack Park", "Hudson River Gorge Primitive Area"],
    spawning: [
      { species: "Brook Trout", season: "September–November" },
      { species: "Brown Trout", season: "October–November" },
    ],
    hatches: [
      { name: "Hendrickson", timing: "Late May – June" },
      { name: "Caddis", timing: "May–June" },
      { name: "Green Drake", timing: "June" },
      { name: "Terrestrials", timing: "July–September" },
    ],
    runs: [],
    guides: ["Hudson River Rafting Company", "Adirondack River Outfitters"],
  },

  west_river: {
    species: [
      { name: "Brown Trout", type: "resident", primary: true },
      { name: "Rainbow Trout", type: "resident", primary: true },
    ],
    designations: ["Vermont Dam-Release Fishery (Ball Mountain Dam)", "Green Mountain National Forest"],
    spawning: [
      { species: "Brown Trout", season: "October–November" },
    ],
    hatches: [
      { name: "Blue-Winged Olive", timing: "April–May, September–October" },
      { name: "Hendrickson", timing: "Late April – May" },
      { name: "Caddis", timing: "May–June" },
      { name: "Sulfur", timing: "May–June" },
      { name: "Terrestrials", timing: "July–September" },
    ],
    runs: [],
    guides: ["Vermont Fly Guys", "Orvis Manchester"],
  },

  housatonic: {
    species: [
      { name: "Brown Trout", type: "resident", primary: true, notes: "Trophy potential at Bull\"s Bridge — fishery recovering from PCB cleanup" },
      { name: "Rainbow Trout", type: "resident", primary: true },
    ],
    designations: ["Connecticut Trout Management Area", "Catch & Release — flies/lures only (TMA sections)", "EPA PCB Cleanup Recovery"],
    spawning: [
      { species: "Brown Trout", season: "October–November" },
      { species: "Rainbow Trout", season: "March–April" },
    ],
    hatches: [
      { name: "Blue-Winged Olive", timing: "March–April, October–November" },
      { name: "Hendrickson", timing: "Late April – May" },
      { name: "Caddis", timing: "May–June" },
      { name: "March Brown", timing: "May–June" },
      { name: "Sulfur", timing: "May–June" },
      { name: "Isonychia", timing: "June–September" },
      { name: "Trico", timing: "July–September" },
      { name: "Terrestrials", timing: "July–September" },
    ],
    runs: [],
    guides: ["Housatonic Anglers", "Housatonic Fly Fishing"],
  },

  farmington: {
    species: [
      { name: "Brown Trout", type: "resident", primary: true, notes: "Wild fish to 20+ inches — Connecticut\"s best trout stream" },
      { name: "Rainbow Trout", type: "resident", primary: true },
    ],
    designations: ["National Wild & Scenic River", "Connecticut Trout Management Area", "Catch & Release — flies/lures only (TMA sections)"],
    spawning: [
      { species: "Brown Trout", season: "October–November" },
      { species: "Rainbow Trout", season: "March–April" },
    ],
    hatches: [
      { name: "Blue-Winged Olive", timing: "March–April, October–November" },
      { name: "Hendrickson", timing: "Late April – May" },
      { name: "Caddis", timing: "May–June" },
      { name: "March Brown", timing: "May–June" },
      { name: "Sulfur", timing: "Late May – June" },
      { name: "Green Drake", timing: "Late May – Early June" },
      { name: "Isonychia", timing: "June–September" },
      { name: "Trico", timing: "July–September" },
      { name: "Terrestrials", timing: "July–September" },
    ],
    runs: [],
    guides: ["UpCountry Sportfishing", "Farmington River Anglers"],
  },

  delaware_gap: {
    species: [
      { name: "Smallmouth Bass", type: "warmwater", primary: true },
      { name: "American Shad", type: "anadromous", primary: true, notes: "Iconic spring shad run — largest on the East Coast" },
      { name: "Trout", type: "resident", primary: false, notes: "Brown and rainbow trout in upper cold-water sections" },
    ],
    designations: ["Delaware Water Gap National Recreation Area", "National Wild & Scenic River"],
    spawning: [
      { species: "Smallmouth Bass", season: "May–June" },
    ],
    hatches: [
      { name: "Hendrickson", timing: "Late April – May" },
      { name: "Caddis", timing: "May–June" },
      { name: "Green Drake", timing: "Late May – Early June" },
      { name: "Sulfur", timing: "May–June" },
    ],
    runs: [
      { species: "American Shad", timing: "April–June", peak: "May", notes: "Millions of shad migrate up the Delaware each spring" },
    ],
    guides: ["Delaware River Shad Fishermen\"s Association", "Kittatinny Canoes"],
  },

  // ==========================================
  // SOUTHEAST / OZARKS
  // ==========================================

  buffalo: {
    species: [
      { name: "Smallmouth Bass", type: "warmwater", primary: true, notes: "Classic Ozark smallmouth water" },
    ],
    designations: ["Buffalo National River (America\"s first national river)", "National Wild & Scenic River"],
    spawning: [
      { species: "Smallmouth Bass", season: "April–June" },
    ],
    hatches: [],
    runs: [],
    guides: ["Buffalo River Outfitters", "Wild Bill\"s Outfitters"],
  },

  current: {
    species: [
      { name: "Rainbow Trout", type: "resident", primary: true, notes: "Cold spring-fed water sustains trout year-round" },
      { name: "Brown Trout", type: "resident", primary: true },
      { name: "Smallmouth Bass", type: "warmwater", primary: true },
    ],
    designations: ["Ozark National Scenic Riverways", "Missouri Blue-Ribbon Trout Water (Montauk Springs to Cedar Grove)"],
    spawning: [
      { species: "Brown Trout", season: "October–November" },
      { species: "Rainbow Trout", season: "February–April" },
    ],
    hatches: [
      { name: "Blue-Winged Olive", timing: "March–April, October–November" },
      { name: "Caddis", timing: "April–June" },
      { name: "Sulfur", timing: "May–June" },
      { name: "Terrestrials", timing: "July–September" },
    ],
    runs: [],
    guides: ["Ozark Anglers", "Current River Fly Shop"],
  },

  illinois_ok: {
    species: [
      { name: "Smallmouth Bass", type: "warmwater", primary: true, notes: "Oklahoma\"s premier paddling and smallmouth fishery" },
      { name: "Spotted Bass", type: "warmwater", primary: true },
    ],
    designations: ["Oklahoma Scenic Rivers Act", "Illinois River Management Plan"],
    spawning: [
      { species: "Smallmouth Bass", season: "April–June" },
    ],
    hatches: [],
    runs: [],
    guides: ["Sparrowhawk Camp", "Eagle Bluff Resort"],
  },

  // ==========================================
  // SOUTH
  // ==========================================

  // guadalupe: ALREADY EXISTS in fisheries.ts

  suwannee: {
    species: [
      { name: "Largemouth Bass", type: "warmwater", primary: true },
      { name: "Channel Catfish", type: "warmwater", primary: true },
      { name: "Suwannee Bass", type: "warmwater", primary: true, notes: "Endemic species found only in the Suwannee and Ochlockonee drainages" },
    ],
    designations: ["Suwannee River Wilderness Trail", "Florida Outstanding Water", "Springs Coast"],
    spawning: [
      { species: "Suwannee Bass", season: "March–May" },
      { species: "Largemouth Bass", season: "February–April" },
    ],
    hatches: [],
    runs: [],
    guides: ["Suwannee River Fishing Guide", "Anderson\"s Outdoor Adventures"],
  },

  // ── Michigan (additional rivers) ──────────────────────────────────────

  ausable_sb: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true },
      { name: 'Brook Trout', type: 'resident', primary: false },
    ],
    designations: ['Michigan Blue-Ribbon Trout Stream'],
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
      { species: 'Brook Trout', season: 'September–November' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'March–May, September–October' },
      { name: 'Hendrickson', timing: 'Late April – Mid May' },
      { name: 'Caddis', timing: 'May–June' },
      { name: 'Hex (Hexagenia limbata)', timing: 'Late June – Mid July', notes: 'Triggered when water temperature reaches 60°F. The legendary night hatch — largest mayfly in North America. Brings out trophy browns after dark.' },
      { name: 'Trico', timing: 'July–September' },
    ],
    runs: [],
    guides: [],
  },

  black_cheboygan: {
    species: [
      { name: 'Brook Trout', type: 'resident', primary: true },
      { name: 'Brown Trout', type: 'resident', primary: false },
    ],
    designations: [],
    spawning: [
      { species: 'Brook Trout', season: 'September–November' },
      { species: 'Brown Trout', season: 'October–December' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'March–May, September–October' },
      { name: 'Caddis', timing: 'May–June' },
      { name: 'Hex (Hexagenia limbata)', timing: 'Late June – Mid July', notes: 'Triggered when water temperature reaches 60°F. The legendary night hatch — largest mayfly in North America. Brings out trophy browns after dark.' },
    ],
    runs: [],
    guides: [],
  },

  cass: {
    species: [
      { name: 'Smallmouth Bass', type: 'warmwater', primary: true },
      { name: 'Channel Catfish', type: 'warmwater', primary: false },
      { name: 'Rock Bass', type: 'warmwater', primary: false },
    ],
    designations: [],
    spawning: [],
    hatches: [],
    runs: [],
    guides: [],
  },

  chippewa_mi: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true },
      { name: 'Brook Trout', type: 'resident', primary: false },
    ],
    designations: [],
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
      { species: 'Brook Trout', season: 'September–November' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'March–May, September–October' },
      { name: 'Caddis', timing: 'May–June' },
      { name: 'Hex (Hexagenia limbata)', timing: 'Late June – Mid July', notes: 'Triggered when water temperature reaches 60°F. The legendary night hatch — largest mayfly in North America. Brings out trophy browns after dark.' },
    ],
    runs: [],
    guides: [],
  },

  crystal_mi: {
    species: [
      { name: 'Brook Trout', type: 'resident', primary: true },
    ],
    designations: [],
    spawning: [
      { species: 'Brook Trout', season: 'September–November' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'March–May, September–October' },
      { name: 'Caddis', timing: 'May–June' },
    ],
    runs: [],
    guides: [],
  },

  dowagiac: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true },
      { name: 'Steelhead', type: 'anadromous', primary: false },
    ],
    designations: [],
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'March–May, September–October' },
      { name: 'Caddis', timing: 'May–June' },
      { name: 'Sulfur', timing: 'Late May – June' },
    ],
    runs: [],
    guides: [],
  },

  kalamazoo: {
    species: [
      { name: 'Smallmouth Bass', type: 'warmwater', primary: true },
      { name: 'Steelhead', type: 'anadromous', primary: false },
      { name: 'Brown Trout', type: 'resident', primary: false },
    ],
    designations: [],
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'March–May, September–October' },
      { name: 'Caddis', timing: 'May–June' },
    ],
    runs: [],
    guides: [],
  },

  little_manistee: {
    species: [
      { name: 'Steelhead', type: 'anadromous', primary: true },
      { name: 'Chinook Salmon', type: 'anadromous', primary: false },
      { name: 'Brown Trout', type: 'resident', primary: false },
    ],
    designations: ['Michigan Blue-Ribbon Trout Stream'],
    spawning: [
      { species: 'Steelhead', season: 'March–May' },
      { species: 'Brown Trout', season: 'October–December' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'March–May, September–October' },
      { name: 'Caddis', timing: 'May–June' },
    ],
    runs: [
      { species: 'Steelhead', timing: 'March–May', peak: 'April' },
      { species: 'Chinook Salmon', timing: 'September–October', peak: 'Late September' },
    ],
    guides: [],
  },

  little_muskegon: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true },
      { name: 'Brook Trout', type: 'resident', primary: false },
    ],
    designations: [],
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
      { species: 'Brook Trout', season: 'September–November' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'March–May, September–October' },
      { name: 'Caddis', timing: 'May–June' },
      { name: 'Hex (Hexagenia limbata)', timing: 'Late June – Mid July', notes: 'Triggered when water temperature reaches 60°F. The legendary night hatch — largest mayfly in North America. Brings out trophy browns after dark.' },
    ],
    runs: [],
    guides: [],
  },

  ocqueoc: {
    species: [
      { name: 'Brook Trout', type: 'resident', primary: true },
      { name: 'Brown Trout', type: 'resident', primary: false },
    ],
    designations: [],
    spawning: [
      { species: 'Brook Trout', season: 'September–November' },
      { species: 'Brown Trout', season: 'October–December' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'March–May, September–October' },
      { name: 'Caddis', timing: 'May–June' },
    ],
    runs: [],
    guides: [],
  },

  pigeon_mi: {
    species: [
      { name: 'Brook Trout', type: 'resident', primary: true },
    ],
    designations: [],
    spawning: [
      { species: 'Brook Trout', season: 'September–November' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'March–May, September–October' },
      { name: 'Caddis', timing: 'May–June' },
    ],
    runs: [],
    guides: [],
  },

  shiawassee: {
    species: [
      { name: 'Smallmouth Bass', type: 'warmwater', primary: true },
      { name: 'Walleye', type: 'warmwater', primary: false },
      { name: 'Channel Catfish', type: 'warmwater', primary: false },
    ],
    designations: [],
    spawning: [],
    hatches: [],
    runs: [],
    guides: [],
  },

  sturgeon_lp: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true, notes: 'Source of Michigan\'s brown trout strain' },
      { name: 'Brook Trout', type: 'resident', primary: false },
    ],
    designations: ['Michigan Blue-Ribbon Trout Stream'],
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
      { species: 'Brook Trout', season: 'September–November' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'March–May, September–October' },
      { name: 'Hendrickson', timing: 'Late April – Mid May' },
      { name: 'Caddis', timing: 'May–June' },
      { name: 'Hex (Hexagenia limbata)', timing: 'Late June – Mid July', notes: 'Triggered when water temperature reaches 60°F. The legendary night hatch — largest mayfly in North America. Brings out trophy browns after dark.' },
    ],
    runs: [],
    guides: [],
  },

  thunder_bay: {
    species: [
      { name: 'Atlantic Salmon', type: 'anadromous', primary: true },
      { name: 'Steelhead', type: 'anadromous', primary: false },
      { name: 'Brown Trout', type: 'resident', primary: false },
    ],
    designations: [],
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
    ],
    hatches: [],
    runs: [
      { species: 'Atlantic Salmon', timing: 'September–October', peak: 'Late September' },
    ],
    guides: [],
  },

  white_mi: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true },
      { name: 'Steelhead', type: 'anadromous', primary: false },
    ],
    designations: [],
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'March–May, September–October' },
      { name: 'Caddis', timing: 'May–June' },
      { name: 'Hex (Hexagenia limbata)', timing: 'Late June – Mid July', notes: 'Triggered when water temperature reaches 60°F. The legendary night hatch — largest mayfly in North America. Brings out trophy browns after dark.' },
    ],
    runs: [],
    guides: [],
  },

  big_manistee_lake: {
    species: [
      { name: 'Brook Trout', type: 'resident', primary: true },
      { name: 'Brown Trout', type: 'resident', primary: false },
    ],
    designations: [],
    spawning: [
      { species: 'Brook Trout', season: 'September–November' },
      { species: 'Brown Trout', season: 'October–December' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'March–May, September–October' },
      { name: 'Caddis', timing: 'May–June' },
    ],
    runs: [],
    guides: [],
  },

  sturgeon_mi: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true },
      { name: 'Brook Trout', type: 'resident', primary: false },
    ],
    designations: [],
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
      { species: 'Brook Trout', season: 'September–November' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'March–May, September–October' },
      { name: 'Caddis', timing: 'May–June' },
    ],
    runs: [],
    guides: [],
  },

  rogue_mi: {
    species: [
      { name: 'Steelhead', type: 'anadromous', primary: true },
      { name: 'Chinook Salmon', type: 'anadromous', primary: false },
      { name: 'Brown Trout', type: 'resident', primary: false },
    ],
    designations: [],
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
    ],
    hatches: [],
    runs: [
      { species: 'Steelhead', timing: 'March–May', peak: 'April' },
      { species: 'Chinook Salmon', timing: 'September–October', peak: 'Late September' },
    ],
    guides: [],
  },

  maple_mi: {
    species: [
      { name: 'Brook Trout', type: 'resident', primary: true },
    ],
    designations: [],
    spawning: [
      { species: 'Brook Trout', season: 'September–November' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'March–May, September–October' },
      { name: 'Caddis', timing: 'May–June' },
    ],
    runs: [],
    guides: [],
  },

  coldwater_mi: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true },
      { name: 'Smallmouth Bass', type: 'warmwater', primary: false },
    ],
    designations: [],
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
    ],
    hatches: [],
    runs: [],
    guides: [],
  },

  // ── West Virginia ─────────────────────────────────────────────────────

  elk_wv: {
    species: [
      { name: 'Smallmouth Bass', type: 'warmwater', primary: true },
      { name: 'Muskie', type: 'warmwater', primary: false },
      { name: 'Channel Catfish', type: 'warmwater', primary: false },
    ],
    designations: [],
    spawning: [],
    hatches: [],
    runs: [],
    guides: [],
  },

  greenbrier: {
    species: [
      { name: 'Smallmouth Bass', type: 'warmwater', primary: true },
      { name: 'Brown Trout', type: 'resident', primary: false, notes: 'Upper river' },
      { name: 'Brook Trout', type: 'resident', primary: false, notes: 'Tributaries' },
    ],
    designations: [],
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
      { species: 'Brook Trout', season: 'September–November' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'March–May, September–October' },
      { name: 'Caddis', timing: 'May–June' },
      { name: 'March Brown', timing: 'May–June' },
    ],
    runs: [],
    guides: [],
  },

  tygart: {
    species: [
      { name: 'Smallmouth Bass', type: 'warmwater', primary: true },
      { name: 'Walleye', type: 'warmwater', primary: false },
      { name: 'Muskie', type: 'warmwater', primary: false },
    ],
    designations: [],
    spawning: [],
    hatches: [],
    runs: [],
    guides: [],
  },

  south_branch: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true },
      { name: 'Smallmouth Bass', type: 'warmwater', primary: false },
    ],
    designations: [],
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'March–May, September–October' },
      { name: 'Caddis', timing: 'May–June' },
      { name: 'Sulfur', timing: 'Late May – June' },
      { name: 'Green Drake', timing: 'Late May – Early June' },
    ],
    runs: [],
    guides: [],
  },

  // ── Pennsylvania (additional rivers) ──────────────────────────────────

  clarion: {
    species: [
      { name: 'Smallmouth Bass', type: 'warmwater', primary: true },
      { name: 'Muskie', type: 'warmwater', primary: false },
    ],
    designations: [],
    spawning: [],
    hatches: [],
    runs: [],
    guides: [],
  },

  delaware_pa: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true, notes: 'Wild, self-sustaining population — famous tailwater' },
      { name: 'Rainbow Trout', type: 'resident', primary: false },
    ],
    designations: ['National Wild & Scenic River'],
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
      { species: 'Rainbow Trout', season: 'March–May' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'March–May, September–October' },
      { name: 'Hendrickson', timing: 'Late April – Mid May' },
      { name: 'Caddis', timing: 'May–June' },
      { name: 'Green Drake', timing: 'Late May – Early June' },
      { name: 'Sulfur', timing: 'Late May – June' },
      { name: 'Trico', timing: 'July–September' },
      { name: 'Isonychia', timing: 'June–July, September–October' },
    ],
    runs: [],
    guides: [],
  },

  loyalsock: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true },
      { name: 'Brook Trout', type: 'resident', primary: false },
    ],
    designations: [],
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
      { species: 'Brook Trout', season: 'September–November' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'March–May, September–October' },
      { name: 'Caddis', timing: 'May–June' },
      { name: 'March Brown', timing: 'May–June' },
      { name: 'Sulfur', timing: 'Late May – June' },
    ],
    runs: [],
    guides: [],
  },

  schuylkill: {
    species: [
      { name: 'Smallmouth Bass', type: 'warmwater', primary: true },
      { name: 'Channel Catfish', type: 'warmwater', primary: false },
    ],
    designations: [],
    spawning: [],
    hatches: [],
    runs: [],
    guides: [],
  },

  susquehanna: {
    species: [
      { name: 'Smallmouth Bass', type: 'warmwater', primary: true, notes: 'World-class smallmouth fishery — best in the East' },
      { name: 'Channel Catfish', type: 'warmwater', primary: false },
      { name: 'Walleye', type: 'warmwater', primary: false },
      { name: 'Muskie', type: 'warmwater', primary: false },
    ],
    designations: [],
    spawning: [],
    hatches: [],
    runs: [],
    guides: [],
  },

  // ── New York (additional rivers) ──────────────────────────────────────

  black_ny: {
    species: [
      { name: 'Smallmouth Bass', type: 'warmwater', primary: true },
      { name: 'Brown Trout', type: 'resident', primary: false, notes: 'Upper river' },
      { name: 'Steelhead', type: 'anadromous', primary: false, notes: 'Fall run from Lake Ontario' },
    ],
    designations: [],
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
    ],
    hatches: [],
    runs: [
      { species: 'Steelhead', timing: 'October–November', peak: 'Late October' },
    ],
    guides: [],
  },

  delaware_ny: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true, notes: 'Wild, self-sustaining — legendary tailwater' },
      { name: 'Rainbow Trout', type: 'resident', primary: false },
    ],
    designations: ['National Wild & Scenic River'],
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
      { species: 'Rainbow Trout', season: 'March–May' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'March–May, September–October' },
      { name: 'Hendrickson', timing: 'Late April – Mid May' },
      { name: 'Caddis', timing: 'May–June' },
      { name: 'March Brown', timing: 'May–June' },
      { name: 'Green Drake', timing: 'Late May – Early June' },
      { name: 'Sulfur', timing: 'Late May – June' },
      { name: 'Isonychia', timing: 'June–July, September–October' },
      { name: 'Trico', timing: 'July–September' },
    ],
    runs: [],
    guides: [],
  },

  esopus: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true },
      { name: 'Rainbow Trout', type: 'resident', primary: false },
    ],
    designations: [],
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
      { species: 'Rainbow Trout', season: 'March–May' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'March–May, September–October' },
      { name: 'Hendrickson', timing: 'Late April – Mid May' },
      { name: 'Caddis', timing: 'May–June' },
      { name: 'March Brown', timing: 'May–June' },
    ],
    runs: [],
    guides: [],
  },

  moose_ny: {
    species: [
      { name: 'Brook Trout', type: 'resident', primary: true },
    ],
    designations: [],
    spawning: [
      { species: 'Brook Trout', season: 'September–November' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'March–May, September–October' },
      { name: 'Caddis', timing: 'May–June' },
    ],
    runs: [],
    guides: [],
  },

  raquette: {
    species: [
      { name: 'Smallmouth Bass', type: 'warmwater', primary: true },
      { name: 'Brook Trout', type: 'resident', primary: false, notes: 'Upper river' },
    ],
    designations: [],
    spawning: [
      { species: 'Brook Trout', season: 'September–November' },
    ],
    hatches: [],
    runs: [],
    guides: [],
  },

  sacandaga: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true },
      { name: 'Brook Trout', type: 'resident', primary: false },
    ],
    designations: [],
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
      { species: 'Brook Trout', season: 'September–November' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'March–May, September–October' },
      { name: 'Caddis', timing: 'May–June' },
      { name: 'March Brown', timing: 'May–June' },
    ],
    runs: [],
    guides: [],
  },

  beaverkill: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true },
      { name: 'Brook Trout', type: 'resident', primary: false },
    ],
    designations: ['Birthplace of American Fly Fishing'],
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
      { species: 'Brook Trout', season: 'September–November' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'March–May, September–October' },
      { name: 'Hendrickson', timing: 'Late April – Mid May' },
      { name: 'Caddis', timing: 'May–June' },
      { name: 'March Brown', timing: 'May–June' },
      { name: 'Green Drake', timing: 'Late May – Early June' },
      { name: 'Sulfur', timing: 'Late May – June' },
      { name: 'Isonychia', timing: 'June–July, September–October' },
      { name: 'Trico', timing: 'July–September' },
    ],
    runs: [],
    guides: [],
  },

  // ── COLORADO ─────────────────────────────────────────
  blue_co: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: false }],
    designations: ['Gold Medal Water'],
    spawning: [{ species: 'Brown Trout', season: 'October–November' }],
    hatches: [{ name: 'Midge', timing: 'Year-round' }, { name: 'Blue-Winged Olive (BWO)', timing: 'March–May, September–November' }, { name: 'Caddis', timing: 'May–June' }, { name: 'Pale Morning Dun', timing: 'June–August' }, { name: 'Hopper/Dropper', timing: 'July–September' }],
    runs: [], guides: [],
  },
  eagle: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: false }],
    designations: ['Gold Medal Water'],
    spawning: [{ species: 'Brown Trout', season: 'October–November' }],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May, September–October' }, { name: 'Caddis', timing: 'May–June' }, { name: 'Stonefly (Golden Stone)', timing: 'June–July' }, { name: 'Pale Morning Dun', timing: 'June–August' }, { name: 'Hopper/Dropper', timing: 'July–September' }],
    runs: [], guides: [],
  },
  dolores: {
    species: [{ name: 'Rainbow Trout', type: 'resident', primary: true }, { name: 'Brown Trout', type: 'resident', primary: false }],
    designations: [], spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Caddis', timing: 'May–June' }, { name: 'Stonefly', timing: 'June–July' }],
    runs: [], guides: [],
  },
  roaring_fork: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: false }],
    designations: ['Gold Medal Water'],
    spawning: [{ species: 'Brown Trout', season: 'October–November' }],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May, September–October' }, { name: 'Caddis', timing: 'May–June' }, { name: 'Green Drake', timing: 'Late June – July' }, { name: 'Pale Morning Dun', timing: 'June–August' }, { name: 'Hopper/Dropper', timing: 'July–September' }],
    runs: [], guides: [],
  },
  crystal: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: false }],
    designations: [], spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Caddis', timing: 'May–June' }, { name: 'Pale Morning Dun', timing: 'June–August' }],
    runs: [], guides: [],
  },
  westwater: {
    species: [{ name: 'Channel Catfish', type: 'warmwater', primary: true }, { name: 'Smallmouth Bass', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },

  // ── MONTANA ──────────────────────────────────────────
  big_hole: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: false }, { name: 'Arctic Grayling', type: 'resident', primary: false, notes: 'Last native fluvial population in lower 48' }],
    designations: ['Montana Blue-Ribbon Trout Stream'],
    spawning: [{ species: 'Brown Trout', season: 'October–November' }],
    hatches: [{ name: 'Skwala Stonefly', timing: 'March–April' }, { name: 'Blue-Winged Olive', timing: 'April–May, September–October' }, { name: 'Salmonfly', timing: 'June–July' }, { name: 'Golden Stonefly', timing: 'June–July' }, { name: 'Pale Morning Dun', timing: 'June–August' }, { name: 'Hopper/Dropper', timing: 'July–September' }],
    runs: [], guides: [],
  },
  clark_fork: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: false }, { name: 'Bull Trout', type: 'resident', primary: false }],
    designations: [],
    spawning: [{ species: 'Brown Trout', season: 'October–November' }],
    hatches: [{ name: 'Skwala Stonefly', timing: 'March–April' }, { name: 'Blue-Winged Olive', timing: 'April–May' }, { name: 'Caddis', timing: 'May–June' }, { name: 'Salmonfly', timing: 'June–July' }, { name: 'Pale Morning Dun', timing: 'June–August' }, { name: 'Hopper/Dropper', timing: 'July–September' }],
    runs: [], guides: [],
  },
  missouri_mt: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: false }],
    designations: ['Montana Blue-Ribbon Trout Stream'],
    spawning: [{ species: 'Brown Trout', season: 'October–November' }],
    hatches: [{ name: 'Midge', timing: 'Year-round' }, { name: 'Blue-Winged Olive', timing: 'March–May, September–November' }, { name: 'Caddis', timing: 'May–June' }, { name: 'Pale Morning Dun', timing: 'June–August' }, { name: 'Trico', timing: 'July–September' }],
    runs: [], guides: [],
  },
  yellowstone: {
    species: [{ name: 'Yellowstone Cutthroat', type: 'resident', primary: true }, { name: 'Brown Trout', type: 'resident', primary: false }, { name: 'Rainbow Trout', type: 'resident', primary: false }],
    designations: ['Montana Blue-Ribbon Trout Stream'],
    spawning: [{ species: 'Yellowstone Cutthroat', season: 'May–June' }],
    hatches: [{ name: 'Skwala Stonefly', timing: 'March–April' }, { name: 'Blue-Winged Olive', timing: 'April–May, September–October' }, { name: 'Caddis', timing: 'May–June' }, { name: 'Salmonfly', timing: 'June–July', notes: 'Legendary hatch on the Yellowstone' }, { name: 'Golden Stonefly', timing: 'June–July' }, { name: 'Pale Morning Dun', timing: 'June–August' }, { name: 'Hopper/Dropper', timing: 'July–September' }],
    runs: [], guides: [],
  },
  madison: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: false }],
    designations: ['Montana Blue-Ribbon Trout Stream'],
    spawning: [{ species: 'Brown Trout', season: 'October–November' }, { species: 'Rainbow Trout', season: 'March–May' }],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May, September–October' }, { name: 'Caddis', timing: 'May–June' }, { name: 'Salmonfly', timing: 'June–July' }, { name: 'Golden Stonefly', timing: 'June–July' }, { name: 'Pale Morning Dun', timing: 'June–August' }, { name: 'Hopper/Dropper', timing: 'July–September', notes: 'Prime dry fly season on the 50-mile riffle' }, { name: 'October Caddis', timing: 'September–October' }],
    runs: [], guides: [],
  },

  // ── IDAHO ────────────────────────────────────────────
  hells_canyon: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'White Sturgeon', type: 'resident', primary: false }, { name: 'Steelhead', type: 'anadromous', primary: false }],
    designations: [], spawning: [], hatches: [],
    runs: [{ species: 'Steelhead', timing: 'September–March' }],
    guides: [],
  },
  henrys_fork: {
    species: [{ name: 'Rainbow Trout', type: 'resident', primary: true, notes: 'Large wild rainbows in the Railroad Ranch section' }, { name: 'Brown Trout', type: 'resident', primary: false }, { name: 'Cutthroat Trout', type: 'resident', primary: false }],
    designations: ['Blue-Ribbon Trout Stream', 'Harriman State Park'],
    spawning: [{ species: 'Rainbow Trout', season: 'March–May' }],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'April–May, September–October' }, { name: 'Green Drake', timing: 'June', notes: 'The signature hatch — selective fish on flat water' }, { name: 'Pale Morning Dun', timing: 'June–August' }, { name: 'Caddis', timing: 'June–August' }, { name: 'Trico', timing: 'July–September', notes: 'Heavy spinner falls on the Ranch' }, { name: 'Callibaetis', timing: 'July–August' }, { name: 'Hopper/Dropper', timing: 'July–September' }],
    runs: [], guides: [],
  },
  payette: {
    species: [{ name: 'Rainbow Trout', type: 'resident', primary: true }, { name: 'Bull Trout', type: 'resident', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  priest: {
    species: [{ name: 'Cutthroat Trout', type: 'resident', primary: true }, { name: 'Bull Trout', type: 'resident', primary: false }],
    designations: [], spawning: [],
    hatches: [{ name: 'Caddis', timing: 'May–June' }, { name: 'Stonefly', timing: 'June–July' }],
    runs: [], guides: [],
  },
  selway: {
    species: [{ name: 'Westslope Cutthroat', type: 'resident', primary: true }, { name: 'Steelhead', type: 'anadromous', primary: false }],
    designations: ['National Wild & Scenic River'],
    spawning: [{ species: 'Westslope Cutthroat', season: 'May–June' }],
    hatches: [{ name: 'Salmonfly', timing: 'June–July' }, { name: 'Golden Stonefly', timing: 'June–July' }, { name: 'Caddis', timing: 'June–August' }],
    runs: [{ species: 'Steelhead', timing: 'August–October' }],
    guides: [],
  },
  sf_boise: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: false }],
    designations: ['Idaho Gold Medal Waters'],
    spawning: [{ species: 'Brown Trout', season: 'October–November' }],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May, September–October' }, { name: 'Caddis', timing: 'May–June' }, { name: 'Pale Morning Dun', timing: 'June–August' }, { name: 'Hopper/Dropper', timing: 'July–September' }],
    runs: [], guides: [],
  },

  // ── OREGON ───────────────────────────────────────────
  clackamas: {
    species: [{ name: 'Steelhead', type: 'anadromous', primary: true }, { name: 'Chinook Salmon', type: 'anadromous', primary: false }, { name: 'Coho Salmon', type: 'anadromous', primary: false }],
    designations: [], spawning: [], hatches: [],
    runs: [{ species: 'Winter Steelhead', timing: 'December–April' }, { species: 'Spring Chinook', timing: 'April–June' }],
    guides: [],
  },
  illinois_or: {
    species: [{ name: 'Steelhead', type: 'anadromous', primary: true }, { name: 'Chinook Salmon', type: 'anadromous', primary: false }],
    designations: ['National Wild & Scenic River'], spawning: [], hatches: [],
    runs: [{ species: 'Winter Steelhead', timing: 'December–March' }],
    guides: [],
  },
  john_day: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Steelhead', type: 'anadromous', primary: false }],
    designations: ['National Wild & Scenic River'], spawning: [],
    hatches: [{ name: 'Caddis', timing: 'May–June' }, { name: 'Golden Stonefly', timing: 'June–July' }],
    runs: [{ species: 'Summer Steelhead', timing: 'September–November' }],
    guides: [],
  },

  // ── WASHINGTON ────────────────────────────────────────
  green_wa: {
    species: [{ name: 'Steelhead', type: 'anadromous', primary: true }, { name: 'Chinook Salmon', type: 'anadromous', primary: false }],
    designations: [], spawning: [], hatches: [],
    runs: [{ species: 'Winter Steelhead', timing: 'December–April' }],
    guides: [],
  },
  methow: {
    species: [{ name: 'Steelhead', type: 'anadromous', primary: true }, { name: 'Spring Chinook', type: 'anadromous', primary: false }, { name: 'Bull Trout', type: 'resident', primary: false }],
    designations: [], spawning: [], hatches: [],
    runs: [{ species: 'Summer Steelhead', timing: 'August–November' }],
    guides: [],
  },
  sauk: {
    species: [{ name: 'Steelhead', type: 'anadromous', primary: true }, { name: 'Bull Trout', type: 'resident', primary: false }],
    designations: [], spawning: [], hatches: [],
    runs: [{ species: 'Winter Steelhead', timing: 'December–April' }],
    guides: [],
  },
  skykomish: {
    species: [{ name: 'Steelhead', type: 'anadromous', primary: true }, { name: 'Chinook Salmon', type: 'anadromous', primary: false }, { name: 'Coho Salmon', type: 'anadromous', primary: false }],
    designations: [], spawning: [], hatches: [],
    runs: [{ species: 'Winter Steelhead', timing: 'December–April' }, { species: 'Fall Chinook', timing: 'September–November' }],
    guides: [],
  },
  white_salmon: {
    species: [{ name: 'Steelhead', type: 'anadromous', primary: true }, { name: 'Spring Chinook', type: 'anadromous', primary: false }],
    designations: [], spawning: [], hatches: [],
    runs: [{ species: 'Winter Steelhead', timing: 'December–April' }],
    guides: [],
  },
  columbia: {
    species: [{ name: 'Fall Chinook Salmon', type: 'anadromous', primary: true, notes: 'Last wild fall Chinook run on the Columbia' }, { name: 'Steelhead', type: 'anadromous', primary: false }, { name: 'White Sturgeon', type: 'resident', primary: false }, { name: 'Walleye', type: 'warmwater', primary: false }, { name: 'Smallmouth Bass', type: 'warmwater', primary: false }],
    designations: ['Hanford Reach National Monument'], spawning: [], hatches: [],
    runs: [{ species: 'Fall Chinook', timing: 'September–November' }],
    guides: [],
  },
  tieton: {
    species: [{ name: 'Rainbow Trout', type: 'resident', primary: true }, { name: 'Brown Trout', type: 'resident', primary: false }],
    designations: [], spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Caddis', timing: 'May–June' }, { name: 'Pale Morning Dun', timing: 'June–August' }],
    runs: [], guides: [],
  },

  // ── CALIFORNIA ───────────────────────────────────────
  american: {
    species: [{ name: 'Rainbow Trout', type: 'resident', primary: true }, { name: 'Steelhead', type: 'anadromous', primary: false }, { name: 'Chinook Salmon', type: 'anadromous', primary: false }, { name: 'Smallmouth Bass', type: 'warmwater', primary: false }],
    designations: [], spawning: [],
    hatches: [{ name: 'Caddis', timing: 'April–June' }, { name: 'Stonefly', timing: 'May–June' }],
    runs: [{ species: 'Fall Chinook', timing: 'October–December' }, { species: 'Steelhead', timing: 'January–March' }],
    guides: [],
  },
  eel: {
    species: [{ name: 'Steelhead', type: 'anadromous', primary: true }, { name: 'Chinook Salmon', type: 'anadromous', primary: false }],
    designations: ['National Wild & Scenic River'], spawning: [], hatches: [],
    runs: [{ species: 'Winter Steelhead', timing: 'December–March' }],
    guides: [],
  },
  klamath: {
    species: [{ name: 'Steelhead', type: 'anadromous', primary: true }, { name: 'Chinook Salmon', type: 'anadromous', primary: false }, { name: 'Rainbow Trout', type: 'resident', primary: false }],
    designations: [], spawning: [], hatches: [],
    runs: [{ species: 'Fall Chinook', timing: 'September–November' }, { species: 'Steelhead', timing: 'November–March' }],
    guides: [],
  },
  stanislaus: {
    species: [{ name: 'Rainbow Trout', type: 'resident', primary: true }, { name: 'Brown Trout', type: 'resident', primary: false }],
    designations: [], spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Caddis', timing: 'April–June' }],
    runs: [], guides: [],
  },
  sacramento: {
    species: [{ name: 'Rainbow Trout', type: 'resident', primary: true }, { name: 'Brown Trout', type: 'resident', primary: false }, { name: 'Chinook Salmon', type: 'anadromous', primary: false }, { name: 'Steelhead', type: 'anadromous', primary: false }],
    designations: [], spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Caddis', timing: 'April–June' }, { name: 'Pale Morning Dun', timing: 'June–August' }, { name: 'October Caddis', timing: 'September–November', notes: 'Best fall dry fly action' }],
    runs: [{ species: 'Winter Chinook', timing: 'April–July' }, { species: 'Fall Chinook', timing: 'September–November' }],
    guides: [],
  },
  yuba: {
    species: [{ name: 'Rainbow Trout', type: 'resident', primary: true }, { name: 'Brown Trout', type: 'resident', primary: false }],
    designations: [], spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Caddis', timing: 'April–June' }, { name: 'Stonefly', timing: 'May–June' }],
    runs: [], guides: [],
  },
  cache_creek: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Sacramento Pikeminnow', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  mokelumne: {
    species: [{ name: 'Rainbow Trout', type: 'resident', primary: true }, { name: 'Chinook Salmon', type: 'anadromous', primary: false }],
    designations: [], spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Caddis', timing: 'April–June' }],
    runs: [{ species: 'Fall Chinook', timing: 'October–December' }],
    guides: [],
  },
  smith: {
    species: [{ name: 'Steelhead', type: 'anadromous', primary: true, notes: 'Last major undammed river in California' }, { name: 'Chinook Salmon', type: 'anadromous', primary: false }],
    designations: ['National Wild & Scenic River'], spawning: [], hatches: [],
    runs: [{ species: 'Winter Steelhead', timing: 'December–March' }],
    guides: [],
  },

  // ── NEVADA ───────────────────────────────────────────
  walker: {
    species: [{ name: 'Lahontan Cutthroat Trout', type: 'resident', primary: true }, { name: 'Brown Trout', type: 'resident', primary: false }],
    designations: [], spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Caddis', timing: 'May–June' }, { name: 'Pale Morning Dun', timing: 'June–August' }],
    runs: [], guides: [],
  },
  east_walker: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true, notes: 'Trophy browns to 10 lbs' }, { name: 'Rainbow Trout', type: 'resident', primary: false }],
    designations: [],
    spawning: [{ species: 'Brown Trout', season: 'October–November' }],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May, September–October' }, { name: 'Caddis', timing: 'May–June' }, { name: 'Pale Morning Dun', timing: 'June–August' }, { name: 'Hopper/Dropper', timing: 'July–September' }],
    runs: [], guides: [],
  },
  carson: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: false }],
    designations: [], spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Caddis', timing: 'May–June' }],
    runs: [], guides: [],
  },
  jarbidge: {
    species: [{ name: 'Bull Trout', type: 'resident', primary: true }, { name: 'Redband Trout', type: 'resident', primary: false }],
    designations: ['Wilderness'], spawning: [], hatches: [], runs: [], guides: [],
  },
  bruneau: {
    species: [{ name: 'Redband Trout', type: 'resident', primary: true }, { name: 'Smallmouth Bass', type: 'warmwater', primary: false }],
    designations: ['National Wild & Scenic River'], spawning: [], hatches: [], runs: [], guides: [],
  },
  humboldt: {
    species: [{ name: 'Lahontan Cutthroat Trout', type: 'resident', primary: true, notes: 'Native but rare' }, { name: 'Brown Trout', type: 'resident', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },

  // ── UTAH ─────────────────────────────────────────────
  provo: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: false }],
    designations: ['Utah Blue-Ribbon Fishery'],
    spawning: [{ species: 'Brown Trout', season: 'October–November' }],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May, September–October' }, { name: 'Caddis', timing: 'May–June' }, { name: 'Pale Morning Dun', timing: 'June–August' }, { name: 'Hopper/Dropper', timing: 'July–September' }],
    runs: [], guides: [],
  },
  logan: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Cutthroat Trout', type: 'resident', primary: false }],
    designations: [], spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Caddis', timing: 'May–June' }, { name: 'Pale Morning Dun', timing: 'June–August' }],
    runs: [], guides: [],
  },
  weber: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: false }],
    designations: [], spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Caddis', timing: 'May–June' }, { name: 'Pale Morning Dun', timing: 'June–August' }],
    runs: [], guides: [],
  },

  // ── WYOMING ──────────────────────────────────────────
  clarks_fork: {
    species: [{ name: 'Yellowstone Cutthroat', type: 'resident', primary: true }, { name: 'Brown Trout', type: 'resident', primary: false }],
    designations: ['National Wild & Scenic River'],
    spawning: [{ species: 'Yellowstone Cutthroat', season: 'May–June' }],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'April–May' }, { name: 'Caddis', timing: 'May–June' }, { name: 'Golden Stonefly', timing: 'June–July' }, { name: 'Pale Morning Dun', timing: 'June–August' }],
    runs: [], guides: [],
  },
  greys: {
    species: [{ name: 'Cutthroat Trout', type: 'resident', primary: true }, { name: 'Brown Trout', type: 'resident', primary: false }],
    designations: [], spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'April–May' }, { name: 'Caddis', timing: 'May–June' }, { name: 'Pale Morning Dun', timing: 'June–August' }],
    runs: [], guides: [],
  },
  hoback: {
    species: [{ name: 'Cutthroat Trout', type: 'resident', primary: true }, { name: 'Brown Trout', type: 'resident', primary: false }],
    designations: [], spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'April–May' }, { name: 'Caddis', timing: 'May–June' }, { name: 'Pale Morning Dun', timing: 'June–August' }],
    runs: [], guides: [],
  },
  shoshone: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: false }, { name: 'Cutthroat Trout', type: 'resident', primary: false }],
    designations: [], spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'April–May' }, { name: 'Caddis', timing: 'May–June' }, { name: 'Pale Morning Dun', timing: 'June–August' }],
    runs: [], guides: [],
  },
  wind_river: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: false }, { name: 'Cutthroat Trout', type: 'resident', primary: false }],
    designations: [], spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'April–May' }, { name: 'Caddis', timing: 'May–June' }, { name: 'Pale Morning Dun', timing: 'June–August' }],
    runs: [], guides: [],
  },

  // ── NEW MEXICO ───────────────────────────────────────
  canadian_nm: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: false }],
    designations: [], spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Caddis', timing: 'May–June' }],
    runs: [], guides: [],
  },
  jemez: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: false }],
    designations: [], spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Caddis', timing: 'May–June' }],
    runs: [], guides: [],
  },
  pecos_nm: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: false }, { name: 'Rio Grande Cutthroat', type: 'resident', primary: false, notes: 'Native subspecies in upper reaches' }],
    designations: ['Pecos Wilderness'], spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Caddis', timing: 'May–June' }, { name: 'Pale Morning Dun', timing: 'June–August' }],
    runs: [], guides: [],
  },
  red_river_nm: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: false }],
    designations: [], spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Caddis', timing: 'May–June' }],
    runs: [], guides: [],
  },

  // ── ARIZONA ──────────────────────────────────────────
  black_az: {
    species: [{ name: 'Apache Trout', type: 'resident', primary: true, notes: 'Arizona state fish — native and threatened' }, { name: 'Brown Trout', type: 'resident', primary: false }],
    designations: ['White Mountain Apache Reservation'], spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Caddis', timing: 'May–June' }],
    runs: [], guides: [],
  },
  fossil_creek: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }],
    designations: ['National Wild & Scenic River'], spawning: [], hatches: [], runs: [], guides: [],
  },
  gila_box: {
    species: [{ name: 'Gila Trout', type: 'resident', primary: true, notes: 'Federally threatened — native to Gila watershed' }, { name: 'Smallmouth Bass', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  oak_creek: {
    species: [{ name: 'Rainbow Trout', type: 'resident', primary: true }, { name: 'Smallmouth Bass', type: 'warmwater', primary: false }],
    designations: [], spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Caddis', timing: 'April–June' }],
    runs: [], guides: [],
  },
  salt_river: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Yellow Bass', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  san_francisco_az: {
    species: [{ name: 'Gila Trout', type: 'resident', primary: true }, { name: 'Smallmouth Bass', type: 'warmwater', primary: false }],
    designations: ['Gila National Forest'], spawning: [], hatches: [], runs: [], guides: [],
  },
  verde: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: ['National Wild & Scenic River'], spawning: [], hatches: [], runs: [], guides: [],
  },

  // ============================================================
  // ALABAMA
  // ============================================================
  cahaba: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }, { name: 'Spotted Bass', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: ['National Wildlife Refuge (lower)'], spawning: [], hatches: [], runs: [], guides: [],
  },
  coosa: {
    species: [{ name: 'Spotted Bass', type: 'warmwater', primary: true }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  flint_al: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Rock Bass', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  little_river_al: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Rock Bass', type: 'warmwater', primary: false }, { name: 'Spotted Bass', type: 'warmwater', primary: false }],
    designations: ['Little River Canyon National Preserve'], spawning: [], hatches: [], runs: [], guides: [],
  },
  locust_fork: {
    species: [{ name: 'Spotted Bass', type: 'warmwater', primary: true }, { name: 'Smallmouth Bass', type: 'warmwater', primary: false }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  mulberry_al: {
    species: [{ name: 'Spotted Bass', type: 'warmwater', primary: true }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  sipsey_fork: {
    species: [{ name: 'Rainbow Trout', type: 'resident', primary: true }, { name: 'Brown Trout', type: 'resident', primary: false }, { name: 'Smallmouth Bass', type: 'warmwater', primary: false }],
    designations: ['Bankhead National Forest'],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'February–April' }, { name: 'Caddis', timing: 'March–May' }, { name: 'Sulfur', timing: 'April–June' }],
    runs: [], guides: [],
  },
  tallapoosa: {
    species: [{ name: 'Spotted Bass', type: 'warmwater', primary: true }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },

  // ============================================================
  // ARKANSAS
  // ============================================================
  big_piney: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Longear Sunfish', type: 'warmwater', primary: false }, { name: 'Rock Bass', type: 'warmwater', primary: false }],
    designations: ['National Wild & Scenic River'], spawning: [], hatches: [], runs: [], guides: [],
  },
  caddo: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }, { name: 'Longear Sunfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  cossatot: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Longear Sunfish', type: 'warmwater', primary: false }, { name: 'Rock Bass', type: 'warmwater', primary: false }],
    designations: ['National Wild & Scenic River'], spawning: [], hatches: [], runs: [], guides: [],
  },
  illinois_bayou: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }, { name: 'Longear Sunfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  kings_ar: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }, { name: 'Rock Bass', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  mulberry: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Rock Bass', type: 'warmwater', primary: false }, { name: 'Longear Sunfish', type: 'warmwater', primary: false }],
    designations: ['National Wild & Scenic River'], spawning: [], hatches: [], runs: [], guides: [],
  },
  war_eagle: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Rock Bass', type: 'warmwater', primary: false }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },

  // ============================================================
  // COLORADO
  // ============================================================
  glenwood: {
    species: [{ name: 'Rainbow Trout', type: 'resident', primary: true }, { name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Mountain Whitefish', type: 'resident', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Caddis', timing: 'April–June' }, { name: 'Stonefly', timing: 'May–July' }, { name: 'PMD (Pale Morning Dun)', timing: 'June–August' }],
    runs: [], guides: [],
  },

  // ============================================================
  // CONNECTICUT
  // ============================================================
  bantam: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Brook Trout', type: 'resident', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Hendrickson', timing: 'April–May' }, { name: 'Caddis', timing: 'April–June' }],
    runs: [], guides: [],
  },
  connecticut: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'American Shad', type: 'anadromous', primary: false }],
    designations: [],
    spawning: [],
    hatches: [],
    runs: [{ species: 'American Shad', timing: 'May–June' }],
    guides: [],
  },
  natchaug: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Brook Trout', type: 'resident', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Hendrickson', timing: 'April–May' }, { name: 'Caddis', timing: 'April–June' }],
    runs: [], guides: [],
  },
  quinnipiac: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Caddis', timing: 'April–June' }],
    runs: [], guides: [],
  },
  salmon_ct: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Brook Trout', type: 'resident', primary: false }, { name: 'Atlantic Salmon', type: 'anadromous', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Hendrickson', timing: 'April–May' }, { name: 'Caddis', timing: 'April–June' }, { name: 'Sulfur', timing: 'May–June' }],
    runs: [{ species: 'Atlantic Salmon', timing: 'October–November' }],
    guides: [],
  },
  shepaug: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Brook Trout', type: 'resident', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Hendrickson', timing: 'April–May' }, { name: 'Caddis', timing: 'April–June' }],
    runs: [], guides: [],
  },

  // ============================================================
  // DELAWARE
  // ============================================================
  brandywine: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: false }, { name: 'Smallmouth Bass', type: 'warmwater', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Caddis', timing: 'April–June' }, { name: 'Sulfur', timing: 'May–June' }],
    runs: [], guides: [],
  },
  broadkill: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Bluegill', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  christina: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  nanticoke: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'White Perch', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  red_clay: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Caddis', timing: 'April–June' }, { name: 'Sulfur', timing: 'May–June' }],
    runs: [], guides: [],
  },
  st_jones: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  white_clay: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Caddis', timing: 'April–June' }, { name: 'Sulfur', timing: 'May–June' }],
    runs: [], guides: [],
  },

  // ============================================================
  // FLORIDA
  // ============================================================
  hillsborough: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Bluegill', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  ichetucknee: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Bluegill', type: 'warmwater', primary: false }, { name: 'Redear Sunfish', type: 'warmwater', primary: false }],
    designations: ['Ichetucknee Springs State Park'], spawning: [], hatches: [], runs: [], guides: [],
  },
  loxahatchee: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Snook', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: ['National Wild & Scenic River'], spawning: [], hatches: [], runs: [], guides: [],
  },
  peace: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Bluegill', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  rainbow: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Bluegill', type: 'warmwater', primary: false }, { name: 'Mullet', type: 'warmwater', primary: false }],
    designations: ['Rainbow Springs State Park'], spawning: [], hatches: [], runs: [], guides: [],
  },
  santa_fe: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Bluegill', type: 'warmwater', primary: false }, { name: 'Redear Sunfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  wekiva: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Bluegill', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: ['Wekiwa Springs State Park'], spawning: [], hatches: [], runs: [], guides: [],
  },

  // ============================================================
  // GEORGIA
  // ============================================================
  amicalola: {
    species: [{ name: 'Rainbow Trout', type: 'resident', primary: true }, { name: 'Brown Trout', type: 'resident', primary: false }, { name: 'Brook Trout', type: 'resident', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'February–April' }, { name: 'Caddis', timing: 'March–May' }],
    runs: [], guides: [],
  },
  broad_ga: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  coosawattee: {
    species: [{ name: 'Rainbow Trout', type: 'resident', primary: true }, { name: 'Brown Trout', type: 'resident', primary: false }, { name: 'Smallmouth Bass', type: 'warmwater', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'February–April' }, { name: 'Caddis', timing: 'March–May' }],
    runs: [], guides: [],
  },
  etowah: {
    species: [{ name: 'Spotted Bass', type: 'warmwater', primary: true }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  oconee: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },

  // ============================================================
  // ILLINOIS
  // ============================================================
  apple_il: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Rock Bass', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  cache_il: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  des_plaines: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  fox_il: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Walleye', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  kankakee: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Walleye', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  mackinaw: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  sangamon: {
    species: [{ name: 'Channel Catfish', type: 'warmwater', primary: true }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  vermilion_il: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Rock Bass', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: ['National Wild & Scenic River (Middle Fork)'], spawning: [], hatches: [], runs: [], guides: [],
  },

  // ============================================================
  // INDIANA
  // ============================================================
  blue_in: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Rock Bass', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  eel_in: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Rock Bass', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  muscatatuck: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  sugar_creek: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Rock Bass', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  tippecanoe: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  whitewater_in: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Rock Bass', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  wildcat_in: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Rock Bass', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },

  // ============================================================
  // IOWA
  // ============================================================
  cedar_ia: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Walleye', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  des_moines: {
    species: [{ name: 'Walleye', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Smallmouth Bass', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  maquoketa: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Walleye', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  turkey: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: false }, { name: 'Smallmouth Bass', type: 'warmwater', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Caddis', timing: 'April–June' }, { name: 'Sulfur', timing: 'May–June' }],
    runs: [], guides: [],
  },
  upper_iowa: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: false }, { name: 'Smallmouth Bass', type: 'warmwater', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Caddis', timing: 'April–June' }, { name: 'Hendrickson', timing: 'April–May' }],
    runs: [], guides: [],
  },
  volga: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: false }, { name: 'Brook Trout', type: 'resident', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Caddis', timing: 'April–June' }],
    runs: [], guides: [],
  },
  wapsipinicon: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Walleye', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  yellow_ia: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Brook Trout', type: 'resident', primary: false }, { name: 'Rainbow Trout', type: 'resident', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Caddis', timing: 'April–June' }],
    runs: [], guides: [],
  },

  // ============================================================
  // KANSAS
  // ============================================================
  cottonwood: {
    species: [{ name: 'Channel Catfish', type: 'warmwater', primary: true }, { name: 'Flathead Catfish', type: 'warmwater', primary: false }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  fall_river_ks: {
    species: [{ name: 'Channel Catfish', type: 'warmwater', primary: true }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  flint_hills: {
    species: [{ name: 'Channel Catfish', type: 'warmwater', primary: true }, { name: 'Smallmouth Bass', type: 'warmwater', primary: false }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  kaw: {
    species: [{ name: 'Channel Catfish', type: 'warmwater', primary: true }, { name: 'Flathead Catfish', type: 'warmwater', primary: false }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  marais: {
    species: [{ name: 'Channel Catfish', type: 'warmwater', primary: true }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  neosho: {
    species: [{ name: 'Channel Catfish', type: 'warmwater', primary: true }, { name: 'Smallmouth Bass', type: 'warmwater', primary: false }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  smoky_hill: {
    species: [{ name: 'Channel Catfish', type: 'warmwater', primary: true }, { name: 'Flathead Catfish', type: 'warmwater', primary: false }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  solomon: {
    species: [{ name: 'Channel Catfish', type: 'warmwater', primary: true }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }, { name: 'Walleye', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },

  // ============================================================
  // KENTUCKY
  // ============================================================
  elkhorn: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Rock Bass', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  kentucky: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Muskellunge', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  licking: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Spotted Bass', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  red_river: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Rock Bass', type: 'warmwater', primary: false }, { name: 'Longear Sunfish', type: 'warmwater', primary: false }],
    designations: ['Red River Gorge Geological Area'], spawning: [], hatches: [], runs: [], guides: [],
  },
  rockcastle: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Rock Bass', type: 'warmwater', primary: false }, { name: 'Rainbow Trout', type: 'resident', primary: false }],
    designations: ['National Wild & Scenic River'], spawning: [], hatches: [], runs: [], guides: [],
  },
  russell_ky: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Rock Bass', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },

  // ============================================================
  // LOUISIANA
  // ============================================================
  amite: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  atchafalaya: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Blue Catfish', type: 'warmwater', primary: false }, { name: 'Flathead Catfish', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: ['Atchafalaya National Wildlife Refuge'], spawning: [], hatches: [], runs: [], guides: [],
  },
  bogue_chitto: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  comite: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  lacombe: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Bluegill', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  tangipahoa: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  tchefuncte: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  whiskey_chitto: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },

  // ============================================================
  // MAINE
  // ============================================================
  allagash: {
    species: [{ name: 'Brook Trout', type: 'resident', primary: true }, { name: 'Lake Trout', type: 'resident', primary: false }, { name: 'Landlocked Salmon', type: 'resident', primary: false }],
    designations: ['National Wild & Scenic River'],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'May–June' }, { name: 'Caddis', timing: 'May–July' }, { name: 'Hex (Hexagenia)', timing: 'June–July' }],
    runs: [], guides: [],
  },
  dead_river: {
    species: [{ name: 'Brook Trout', type: 'resident', primary: true }, { name: 'Landlocked Salmon', type: 'resident', primary: false }, { name: 'Smallmouth Bass', type: 'warmwater', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'May–June' }, { name: 'Caddis', timing: 'May–July' }],
    runs: [], guides: [],
  },
  machias: {
    species: [{ name: 'Atlantic Salmon', type: 'anadromous', primary: true }, { name: 'Brook Trout', type: 'resident', primary: false }, { name: 'Smallmouth Bass', type: 'warmwater', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Caddis', timing: 'May–July' }],
    runs: [{ species: 'Atlantic Salmon', timing: 'June–October' }],
    guides: [],
  },
  rapid_me: {
    species: [{ name: 'Brook Trout', type: 'resident', primary: true }, { name: 'Landlocked Salmon', type: 'resident', primary: true }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'May–June' }, { name: 'Caddis', timing: 'May–July' }, { name: 'Hex (Hexagenia)', timing: 'June–July' }],
    runs: [], guides: [],
  },
  seboeis: {
    species: [{ name: 'Brook Trout', type: 'resident', primary: true }, { name: 'Landlocked Salmon', type: 'resident', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'May–June' }, { name: 'Caddis', timing: 'May–July' }],
    runs: [], guides: [],
  },
  st_croix_me: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Atlantic Salmon', type: 'anadromous', primary: false }, { name: 'Brook Trout', type: 'resident', primary: false }],
    designations: [],
    spawning: [],
    hatches: [],
    runs: [{ species: 'Atlantic Salmon', timing: 'June–October' }],
    guides: [],
  },

  // ============================================================
  // MARYLAND
  // ============================================================
  antietam_creek: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: false }, { name: 'Smallmouth Bass', type: 'warmwater', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Caddis', timing: 'April–June' }, { name: 'Sulfur', timing: 'May–June' }],
    runs: [], guides: [],
  },
  gunpowder: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: false }, { name: 'Brook Trout', type: 'resident', primary: false }],
    designations: ['Catch & Release — flies and artificials only (tailwater section)'],
    spawning: [{ species: 'Brown Trout', season: 'October–December' }],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Hendrickson', timing: 'April–May' }, { name: 'Caddis', timing: 'April–June' }, { name: 'Sulfur', timing: 'May–June' }, { name: 'Trico', timing: 'July–September' }],
    runs: [], guides: [],
  },
  monocacy: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  patuxent: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Chain Pickerel', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  potomac: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  savage: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Brook Trout', type: 'resident', primary: false }, { name: 'Rainbow Trout', type: 'resident', primary: false }],
    designations: ['Delayed Harvest — catch & release section'],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Caddis', timing: 'April–June' }, { name: 'Sulfur', timing: 'May–June' }],
    runs: [], guides: [],
  },
  yough_md: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: false }, { name: 'Smallmouth Bass', type: 'warmwater', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Caddis', timing: 'April–June' }, { name: 'Sulfur', timing: 'May–June' }],
    runs: [], guides: [],
  },

  // ============================================================
  // MASSACHUSETTS
  // ============================================================
  concord: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Chain Pickerel', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: ['National Wild & Scenic River'], spawning: [], hatches: [], runs: [], guides: [],
  },
  westfield: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Brook Trout', type: 'resident', primary: false }, { name: 'Rainbow Trout', type: 'resident', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Hendrickson', timing: 'April–May' }, { name: 'Caddis', timing: 'April–June' }],
    runs: [], guides: [],
  },

  // ============================================================
  // MINNESOTA
  // ============================================================
  cannon: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Smallmouth Bass', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'April–May' }, { name: 'Caddis', timing: 'May–June' }],
    runs: [], guides: [],
  },
  cloquet: {
    species: [{ name: 'Walleye', type: 'warmwater', primary: true }, { name: 'Smallmouth Bass', type: 'warmwater', primary: false }, { name: 'Northern Pike', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  crow_wing: {
    species: [{ name: 'Walleye', type: 'warmwater', primary: true }, { name: 'Northern Pike', type: 'warmwater', primary: false }, { name: 'Smallmouth Bass', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  kawishiwi: {
    species: [{ name: 'Walleye', type: 'warmwater', primary: true }, { name: 'Northern Pike', type: 'warmwater', primary: false }, { name: 'Smallmouth Bass', type: 'warmwater', primary: false }, { name: 'Lake Trout', type: 'resident', primary: false }],
    designations: ['Boundary Waters Canoe Area Wilderness'], spawning: [], hatches: [], runs: [], guides: [],
  },
  kettle: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Walleye', type: 'warmwater', primary: false }, { name: 'Northern Pike', type: 'warmwater', primary: false }],
    designations: ['National Wild & Scenic River'], spawning: [], hatches: [], runs: [], guides: [],
  },
  root: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Brook Trout', type: 'resident', primary: false }, { name: 'Rainbow Trout', type: 'resident', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'April–May' }, { name: 'Caddis', timing: 'May–June' }, { name: 'Hendrickson', timing: 'April–May' }],
    runs: [], guides: [],
  },
  st_croix: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Walleye', type: 'warmwater', primary: false }, { name: 'Northern Pike', type: 'warmwater', primary: false }, { name: 'Muskellunge', type: 'warmwater', primary: false }],
    designations: ['National Wild & Scenic River'], spawning: [], hatches: [], runs: [], guides: [],
  },
  st_louis_mn: {
    species: [{ name: 'Walleye', type: 'warmwater', primary: true }, { name: 'Smallmouth Bass', type: 'warmwater', primary: false }, { name: 'Northern Pike', type: 'warmwater', primary: false }, { name: 'Steelhead', type: 'anadromous', primary: false }],
    designations: [],
    spawning: [],
    hatches: [],
    runs: [{ species: 'Steelhead', timing: 'April–May' }],
    guides: [],
  },

  // ============================================================
  // MISSISSIPPI
  // ============================================================
  black_creek_ms: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: ['National Wild & Scenic River'], spawning: [], hatches: [], runs: [], guides: [],
  },
  bowie: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  chunky: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  leaf: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  okatoma: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  pearl: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Flathead Catfish', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  tallahala: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  wolf_ms: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },

  // ============================================================
  // MISSOURI
  // ============================================================
  big_mo: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  eleven_point: {
    species: [{ name: 'Rainbow Trout', type: 'resident', primary: true }, { name: 'Brown Trout', type: 'resident', primary: false }, { name: 'Smallmouth Bass', type: 'warmwater', primary: false }],
    designations: ['National Wild & Scenic River'],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Caddis', timing: 'April–June' }, { name: 'Sulfur', timing: 'May–June' }],
    runs: [], guides: [],
  },
  gasconade: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  jacks_fork: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Rock Bass', type: 'warmwater', primary: false }, { name: 'Longear Sunfish', type: 'warmwater', primary: false }],
    designations: ['Ozark National Scenic Riverways'], spawning: [], hatches: [], runs: [], guides: [],
  },
  meramec: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  north_fork_white: {
    species: [{ name: 'Rainbow Trout', type: 'resident', primary: true }, { name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Brook Trout', type: 'resident', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Caddis', timing: 'April–June' }, { name: 'Sulfur', timing: 'May–June' }, { name: 'Midge', timing: 'November–March' }],
    runs: [], guides: [],
  },
  st_francis: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },

  // ============================================================
  // NEBRASKA
  // ============================================================
  calamus: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'April–May' }, { name: 'Caddis', timing: 'May–June' }, { name: 'Trico', timing: 'July–September' }],
    runs: [], guides: [],
  },
  dismal: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: false }, { name: 'Brook Trout', type: 'resident', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'April–May' }, { name: 'Caddis', timing: 'May–June' }, { name: 'Trico', timing: 'July–September' }],
    runs: [], guides: [],
  },
  elkhorn_ne: {
    species: [{ name: 'Channel Catfish', type: 'warmwater', primary: true }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }, { name: 'Walleye', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  loup: {
    species: [{ name: 'Channel Catfish', type: 'warmwater', primary: true }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }, { name: 'Walleye', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  middle_loup: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Northern Pike', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'April–May' }, { name: 'Caddis', timing: 'May–June' }],
    runs: [], guides: [],
  },
  niobrara: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: ['National Wild & Scenic River'],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'April–May' }, { name: 'Caddis', timing: 'May–June' }, { name: 'Trico', timing: 'July–September' }],
    runs: [], guides: [],
  },
  platte: {
    species: [{ name: 'Channel Catfish', type: 'warmwater', primary: true }, { name: 'Walleye', type: 'warmwater', primary: false }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  republican: {
    species: [{ name: 'Channel Catfish', type: 'warmwater', primary: true }, { name: 'Walleye', type: 'warmwater', primary: false }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },

  // ============================================================
  // NEW HAMPSHIRE
  // ============================================================
  androscoggin: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: false }, { name: 'Brook Trout', type: 'resident', primary: false }, { name: 'Smallmouth Bass', type: 'warmwater', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'April–May' }, { name: 'Hendrickson', timing: 'April–May' }, { name: 'Caddis', timing: 'May–June' }],
    runs: [], guides: [],
  },
  connecticut_nh: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: false }, { name: 'Smallmouth Bass', type: 'warmwater', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'April–May' }, { name: 'Hendrickson', timing: 'April–May' }, { name: 'Caddis', timing: 'May–June' }],
    runs: [], guides: [],
  },
  contoocook: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Brook Trout', type: 'resident', primary: false }, { name: 'Smallmouth Bass', type: 'warmwater', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'April–May' }, { name: 'Caddis', timing: 'May–June' }],
    runs: [], guides: [],
  },
  ellis: {
    species: [{ name: 'Brook Trout', type: 'resident', primary: true }, { name: 'Brown Trout', type: 'resident', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'April–May' }, { name: 'Caddis', timing: 'May–June' }],
    runs: [], guides: [],
  },
  merrimack: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }, { name: 'American Shad', type: 'anadromous', primary: false }],
    designations: [],
    spawning: [],
    hatches: [],
    runs: [{ species: 'American Shad', timing: 'May–June' }],
    guides: [],
  },
  pemi: {
    species: [{ name: 'Brook Trout', type: 'resident', primary: true }, { name: 'Brown Trout', type: 'resident', primary: false }, { name: 'Rainbow Trout', type: 'resident', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'April–May' }, { name: 'Hendrickson', timing: 'April–May' }, { name: 'Caddis', timing: 'May–June' }],
    runs: [], guides: [],
  },
  swift_nh: {
    species: [{ name: 'Brook Trout', type: 'resident', primary: true }, { name: 'Brown Trout', type: 'resident', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'April–May' }, { name: 'Caddis', timing: 'May–June' }],
    runs: [], guides: [],
  },

  // ============================================================
  // NEW JERSEY
  // ============================================================
  great_egg: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Chain Pickerel', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  maurice: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  mullica: {
    species: [{ name: 'Chain Pickerel', type: 'warmwater', primary: true }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  musconetcong: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: false }, { name: 'Brook Trout', type: 'resident', primary: false }],
    designations: ['National Wild & Scenic River'],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Hendrickson', timing: 'April–May' }, { name: 'Caddis', timing: 'April–June' }, { name: 'Sulfur', timing: 'May–June' }],
    runs: [], guides: [],
  },
  paulins_kill: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Hendrickson', timing: 'April–May' }, { name: 'Caddis', timing: 'April–June' }],
    runs: [], guides: [],
  },
  raritan: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Brown Trout', type: 'resident', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Caddis', timing: 'April–June' }],
    runs: [], guides: [],
  },
  wharton: {
    species: [{ name: 'Chain Pickerel', type: 'warmwater', primary: true }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: ['Wharton State Forest / Pinelands National Reserve'], spawning: [], hatches: [], runs: [], guides: [],
  },

  // ============================================================
  // NEW MEXICO
  // ============================================================
  san_antonio: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Caddis', timing: 'April–June' }, { name: 'PMD (Pale Morning Dun)', timing: 'June–August' }],
    runs: [], guides: [],
  },

  // ============================================================
  // NORTH CAROLINA
  // ============================================================
  green_nc: {
    species: [{ name: 'Rainbow Trout', type: 'resident', primary: true }, { name: 'Brown Trout', type: 'resident', primary: false }, { name: 'Brook Trout', type: 'resident', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'February–April' }, { name: 'Caddis', timing: 'March–May' }],
    runs: [], guides: [],
  },
  linville: {
    species: [{ name: 'Rainbow Trout', type: 'resident', primary: true }, { name: 'Brown Trout', type: 'resident', primary: false }, { name: 'Brook Trout', type: 'resident', primary: false }],
    designations: ['Linville Gorge Wilderness'],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'February–April' }, { name: 'Caddis', timing: 'March–May' }, { name: 'Sulfur', timing: 'May–June' }],
    runs: [], guides: [],
  },
  nolichucky_nc: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Rock Bass', type: 'warmwater', primary: false }, { name: 'Rainbow Trout', type: 'resident', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Caddis', timing: 'March–May' }],
    runs: [], guides: [],
  },
  tuckasegee: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: false }, { name: 'Brook Trout', type: 'resident', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'February–April' }, { name: 'Caddis', timing: 'March–May' }, { name: 'Sulfur', timing: 'May–June' }],
    runs: [], guides: [],
  },
  watauga: {
    species: [{ name: 'Rainbow Trout', type: 'resident', primary: true }, { name: 'Brown Trout', type: 'resident', primary: false }, { name: 'Brook Trout', type: 'resident', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'February–April' }, { name: 'Caddis', timing: 'March–May' }, { name: 'Sulfur', timing: 'May–June' }],
    runs: [], guides: [],
  },

  // ============================================================
  // NORTH DAKOTA
  // ============================================================
  cannonball: {
    species: [{ name: 'Walleye', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Northern Pike', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  heart: {
    species: [{ name: 'Walleye', type: 'warmwater', primary: true }, { name: 'Northern Pike', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  knife: {
    species: [{ name: 'Walleye', type: 'warmwater', primary: true }, { name: 'Northern Pike', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  little_missouri: {
    species: [{ name: 'Channel Catfish', type: 'warmwater', primary: true }, { name: 'Walleye', type: 'warmwater', primary: false }, { name: 'Northern Pike', type: 'warmwater', primary: false }],
    designations: ['Theodore Roosevelt National Park'], spawning: [], hatches: [], runs: [], guides: [],
  },
  missouri_nd: {
    species: [{ name: 'Walleye', type: 'warmwater', primary: true }, { name: 'Northern Pike', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Smallmouth Bass', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  pembina: {
    species: [{ name: 'Walleye', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Northern Pike', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  sheyenne: {
    species: [{ name: 'Walleye', type: 'warmwater', primary: true }, { name: 'Northern Pike', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: ['National Wild & Scenic River'], spawning: [], hatches: [], runs: [], guides: [],
  },

  // ============================================================
  // OHIO
  // ============================================================
  chagrin: {
    species: [{ name: 'Steelhead', type: 'anadromous', primary: true }, { name: 'Smallmouth Bass', type: 'warmwater', primary: false }, { name: 'Brown Trout', type: 'resident', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Caddis', timing: 'April–June' }],
    runs: [{ species: 'Steelhead', timing: 'October–April' }],
    guides: [],
  },
  cuyahoga: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: ['Cuyahoga Valley National Park'], spawning: [], hatches: [], runs: [], guides: [],
  },
  grand_oh: {
    species: [{ name: 'Steelhead', type: 'anadromous', primary: true }, { name: 'Smallmouth Bass', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [],
    spawning: [],
    hatches: [],
    runs: [{ species: 'Steelhead', timing: 'October–April' }],
    guides: [],
  },
  hocking: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Rock Bass', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  kokosing: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Rock Bass', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  little_miami: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Rock Bass', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: ['National Wild & Scenic River'], spawning: [], hatches: [], runs: [], guides: [],
  },
  mad_oh: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: false }, { name: 'Smallmouth Bass', type: 'warmwater', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Caddis', timing: 'April–June' }, { name: 'Sulfur', timing: 'May–June' }],
    runs: [], guides: [],
  },
  maumee: {
    species: [{ name: 'Walleye', type: 'warmwater', primary: true }, { name: 'Smallmouth Bass', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  mohican: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Rock Bass', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  olentangy: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Rock Bass', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  scioto: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Saugeye', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  tuscarawas: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  vermilion_oh: {
    species: [{ name: 'Steelhead', type: 'anadromous', primary: true }, { name: 'Smallmouth Bass', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [],
    spawning: [],
    hatches: [],
    runs: [{ species: 'Steelhead', timing: 'October–April' }],
    guides: [],
  },

  // ============================================================
  // OKLAHOMA
  // ============================================================
  baron_fork: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }, { name: 'Longear Sunfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  blue_ok: {
    species: [{ name: 'Rainbow Trout', type: 'resident', primary: true }, { name: 'Brown Trout', type: 'resident', primary: false }, { name: 'Smallmouth Bass', type: 'warmwater', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'February–April' }, { name: 'Caddis', timing: 'March–May' }],
    runs: [], guides: [],
  },
  caney: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  glover: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  kiamichi: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  mountain_fork: {
    species: [{ name: 'Rainbow Trout', type: 'resident', primary: true }, { name: 'Brown Trout', type: 'resident', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'February–April' }, { name: 'Caddis', timing: 'March–May' }, { name: 'Midge', timing: 'November–March' }],
    runs: [], guides: [],
  },
  washita: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },

  // ============================================================
  // OREGON
  // ============================================================
  sandy: {
    species: [{ name: 'Steelhead', type: 'anadromous', primary: true }, { name: 'Chinook Salmon', type: 'anadromous', primary: false }, { name: 'Coho Salmon', type: 'anadromous', primary: false }, { name: 'Rainbow Trout', type: 'resident', primary: false }],
    designations: ['National Wild & Scenic River'],
    spawning: [],
    hatches: [{ name: 'Caddis', timing: 'April–June' }, { name: 'Stonefly', timing: 'May–July' }, { name: 'Blue-Winged Olive', timing: 'March–May' }],
    runs: [{ species: 'Steelhead', timing: 'December–April' }, { species: 'Chinook Salmon', timing: 'March–June' }, { species: 'Coho Salmon', timing: 'September–November' }],
    guides: [],
  },

  // ============================================================
  // RHODE ISLAND
  // ============================================================
  blackstone: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Smallmouth Bass', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  chipuxet: {
    species: [{ name: 'Brook Trout', type: 'resident', primary: true }, { name: 'Brown Trout', type: 'resident', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Caddis', timing: 'April–June' }],
    runs: [], guides: [],
  },
  hunt: {
    species: [{ name: 'Brook Trout', type: 'resident', primary: true }, { name: 'Brown Trout', type: 'resident', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Caddis', timing: 'April–June' }],
    runs: [], guides: [],
  },
  pawcatuck: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Chain Pickerel', type: 'warmwater', primary: false }, { name: 'Brown Trout', type: 'resident', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  pawtuxet: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  ten_mile: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Chain Pickerel', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  wood_ri: {
    species: [{ name: 'Brook Trout', type: 'resident', primary: true }, { name: 'Brown Trout', type: 'resident', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Hendrickson', timing: 'April–May' }, { name: 'Caddis', timing: 'April–June' }],
    runs: [], guides: [],
  },
  woonasquatucket: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Bluegill', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },

  // ============================================================
  // SOUTH CAROLINA
  // ============================================================
  broad_sc: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  chattooga_sc: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: false }, { name: 'Brook Trout', type: 'resident', primary: false }],
    designations: ['National Wild & Scenic River'],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'February–April' }, { name: 'Caddis', timing: 'March–May' }],
    runs: [], guides: [],
  },
  congaree: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }, { name: 'Flathead Catfish', type: 'warmwater', primary: false }],
    designations: ['Congaree National Park'], spawning: [], hatches: [], runs: [], guides: [],
  },
  edisto: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Redbreast Sunfish', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  little_sc: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Bluegill', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  saluda: {
    species: [{ name: 'Rainbow Trout', type: 'resident', primary: true }, { name: 'Brown Trout', type: 'resident', primary: false }, { name: 'Striped Bass', type: 'warmwater', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'February–April' }, { name: 'Caddis', timing: 'March–May' }, { name: 'Midge', timing: 'November–March' }],
    runs: [], guides: [],
  },
  tyger_sc: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Bluegill', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  waccamaw: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Redbreast Sunfish', type: 'warmwater', primary: false }, { name: 'Bowfin', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },

  // ============================================================
  // SOUTH DAKOTA
  // ============================================================
  big_sioux: {
    species: [{ name: 'Walleye', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Smallmouth Bass', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  cheyenne_sd: {
    species: [{ name: 'Walleye', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Northern Pike', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  james_sd: {
    species: [{ name: 'Walleye', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Northern Pike', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  missouri_sd: {
    species: [{ name: 'Walleye', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Northern Pike', type: 'warmwater', primary: false }, { name: 'Smallmouth Bass', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  rapid_creek: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: false }, { name: 'Brook Trout', type: 'resident', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'April–May' }, { name: 'Caddis', timing: 'May–June' }, { name: 'PMD (Pale Morning Dun)', timing: 'June–July' }, { name: 'Trico', timing: 'July–September' }],
    runs: [], guides: [],
  },
  spearfish: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: false }, { name: 'Brook Trout', type: 'resident', primary: false }],
    designations: ['Spearfish Canyon'],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'April–May' }, { name: 'Caddis', timing: 'May–June' }, { name: 'Stonefly', timing: 'May–July' }],
    runs: [], guides: [],
  },
  vermillion_sd: {
    species: [{ name: 'Channel Catfish', type: 'warmwater', primary: true }, { name: 'Walleye', type: 'warmwater', primary: false }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  white_sd: {
    species: [{ name: 'Walleye', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Northern Pike', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },

  // ============================================================
  // TENNESSEE
  // ============================================================
  caney_fork: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: true }, { name: 'Brook Trout', type: 'resident', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'February–April' }, { name: 'Caddis', timing: 'March–May' }, { name: 'Sulfur', timing: 'May–June' }, { name: 'Midge', timing: 'November–March' }],
    runs: [], guides: [],
  },
  duck_river: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Rock Bass', type: 'warmwater', primary: false }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  elk_tn: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Rock Bass', type: 'warmwater', primary: false }, { name: 'Spotted Bass', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  obeds: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Rock Bass', type: 'warmwater', primary: false }, { name: 'Longear Sunfish', type: 'warmwater', primary: false }],
    designations: ['National Wild & Scenic River'], spawning: [], hatches: [], runs: [], guides: [],
  },
  pigeon_tn: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Rock Bass', type: 'warmwater', primary: false }, { name: 'Rainbow Trout', type: 'resident', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },

  // ============================================================
  // TEXAS
  // ============================================================
  big_bend: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Blue Catfish', type: 'warmwater', primary: false }],
    designations: ['Big Bend National Park', 'National Wild & Scenic River'], spawning: [], hatches: [], runs: [], guides: [],
  },
  blanco: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Guadalupe Bass', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  brazos: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Flathead Catfish', type: 'warmwater', primary: false }, { name: 'Blue Catfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  colorado_tx: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Guadalupe Bass', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  comal: {
    species: [{ name: 'Rainbow Trout', type: 'resident', primary: true }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: [],
    spawning: [],
    hatches: [],
    runs: [],
    guides: [],
  },
  devils_river: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: ['Devils River State Natural Area'], spawning: [], hatches: [], runs: [], guides: [],
  },
  frio: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Guadalupe Bass', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  llano: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Guadalupe Bass', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  medina: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Guadalupe Bass', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  nueces: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Guadalupe Bass', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  sabine: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Channel Catfish', type: 'warmwater', primary: false }, { name: 'Blue Catfish', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  san_marcos: {
    species: [{ name: 'Largemouth Bass', type: 'warmwater', primary: true }, { name: 'Guadalupe Bass', type: 'warmwater', primary: false }, { name: 'Bluegill', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },

  // ============================================================
  // UTAH
  // ============================================================
  cataract: {
    species: [{ name: 'Channel Catfish', type: 'warmwater', primary: true }, { name: 'Smallmouth Bass', type: 'warmwater', primary: false }],
    designations: ['Canyonlands National Park'], spawning: [], hatches: [], runs: [], guides: [],
  },

  // ============================================================
  // VERMONT
  // ============================================================
  battenkill: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Brook Trout', type: 'resident', primary: false }, { name: 'Rainbow Trout', type: 'resident', primary: false }],
    designations: [],
    spawning: [{ species: 'Brown Trout', season: 'October–November' }],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'April–May' }, { name: 'Hendrickson', timing: 'April–May' }, { name: 'Caddis', timing: 'May–June' }, { name: 'March Brown', timing: 'May–June' }, { name: 'Sulfur', timing: 'May–June' }],
    runs: [], guides: [],
  },
  lamoille: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: false }, { name: 'Smallmouth Bass', type: 'warmwater', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'April–May' }, { name: 'Caddis', timing: 'May–June' }, { name: 'Hendrickson', timing: 'April–May' }],
    runs: [], guides: [],
  },
  mad_vt: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Brook Trout', type: 'resident', primary: false }, { name: 'Rainbow Trout', type: 'resident', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'April–May' }, { name: 'Hendrickson', timing: 'April–May' }, { name: 'Caddis', timing: 'May–June' }],
    runs: [], guides: [],
  },
  missisquoi: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: false }, { name: 'Smallmouth Bass', type: 'warmwater', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'April–May' }, { name: 'Caddis', timing: 'May–June' }],
    runs: [], guides: [],
  },
  otter_creek: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Smallmouth Bass', type: 'warmwater', primary: false }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'April–May' }, { name: 'Caddis', timing: 'May–June' }],
    runs: [], guides: [],
  },
  white_vt: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: false }, { name: 'Brook Trout', type: 'resident', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'April–May' }, { name: 'Hendrickson', timing: 'April–May' }, { name: 'Caddis', timing: 'May–June' }, { name: 'Sulfur', timing: 'May–June' }],
    runs: [], guides: [],
  },
  winooski: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: false }, { name: 'Smallmouth Bass', type: 'warmwater', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'April–May' }, { name: 'Caddis', timing: 'May–June' }],
    runs: [], guides: [],
  },

  // ============================================================
  // VIRGINIA
  // ============================================================
  jackson_va: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Rainbow Trout', type: 'resident', primary: false }, { name: 'Brook Trout', type: 'resident', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Caddis', timing: 'April–June' }, { name: 'Sulfur', timing: 'May–June' }, { name: 'March Brown', timing: 'May–June' }],
    runs: [], guides: [],
  },
  maury: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Rock Bass', type: 'warmwater', primary: false }, { name: 'Redbreast Sunfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  newriver_va: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Rock Bass', type: 'warmwater', primary: false }, { name: 'Muskellunge', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  rappahannock: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Largemouth Bass', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  russell_fork: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Rock Bass', type: 'warmwater', primary: false }, { name: 'Rainbow Trout', type: 'resident', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },

  // ============================================================
  // WEST VIRGINIA
  // ============================================================
  cranberry: {
    species: [{ name: 'Brook Trout', type: 'resident', primary: true }, { name: 'Brown Trout', type: 'resident', primary: false }, { name: 'Rainbow Trout', type: 'resident', primary: false }],
    designations: ['Cranberry Wilderness'],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'March–May' }, { name: 'Caddis', timing: 'April–June' }, { name: 'Sulfur', timing: 'May–June' }],
    runs: [], guides: [],
  },
  meadow: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Rock Bass', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },

  // ============================================================
  // WISCONSIN
  // ============================================================
  black_wi: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Walleye', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  flambeau: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Walleye', type: 'warmwater', primary: false }, { name: 'Muskellunge', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  kickapoo: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Brook Trout', type: 'resident', primary: false }, { name: 'Smallmouth Bass', type: 'warmwater', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'April–May' }, { name: 'Hendrickson', timing: 'April–May' }, { name: 'Caddis', timing: 'May–June' }],
    runs: [], guides: [],
  },
  namekagon: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Muskellunge', type: 'warmwater', primary: false }, { name: 'Walleye', type: 'warmwater', primary: false }],
    designations: ['National Wild & Scenic River (St. Croix National Scenic Riverway)'], spawning: [], hatches: [], runs: [], guides: [],
  },
  peshtigo: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Walleye', type: 'warmwater', primary: false }, { name: 'Northern Pike', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  pine_wi: {
    species: [{ name: 'Brown Trout', type: 'resident', primary: true }, { name: 'Brook Trout', type: 'resident', primary: false }],
    designations: [],
    spawning: [],
    hatches: [{ name: 'Blue-Winged Olive', timing: 'April–May' }, { name: 'Caddis', timing: 'May–June' }],
    runs: [], guides: [],
  },
  wisconsin: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Walleye', type: 'warmwater', primary: false }, { name: 'Muskellunge', type: 'warmwater', primary: false }, { name: 'Channel Catfish', type: 'warmwater', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },
  wolf_wi: {
    species: [{ name: 'Smallmouth Bass', type: 'warmwater', primary: true }, { name: 'Walleye', type: 'warmwater', primary: false }, { name: 'Muskellunge', type: 'warmwater', primary: false }, { name: 'Sturgeon', type: 'resident', primary: false }],
    designations: [], spawning: [], hatches: [], runs: [], guides: [],
  },

  // ── Added 2026-04-10: 43-river fisheries backfill (FISHERIES_PROGRESS.md) ──
  // Priority states: CO, WV, PA, CA, NC, SC. Quality bar: only species I'm
  // confident in given watershed + elevation + water temp regime. Hatches
  // only on coldwater (trout/salmon) rivers per spec. Designations
  // conservative — Gold Medal only when on the published CPW list.

  // ── Colorado ──
  green_lodore: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true, notes: 'Tailwater fishery below Flaming Gorge enters at the canyon top' },
      { name: 'Rainbow Trout', type: 'resident', primary: true },
      { name: 'Mountain Whitefish', type: 'resident', primary: false },
    ],
    designations: ['Dinosaur National Monument'],
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
      { species: 'Rainbow Trout', season: 'March–May' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'March–May, September–October' },
      { name: 'Caddis', timing: 'May–July' },
      { name: 'Pale Morning Dun (PMD)', timing: 'June–July' },
      { name: 'Trico', timing: 'July–September', notes: 'Morning spinner falls' },
      { name: 'Terrestrials', timing: 'July–September' },
    ],
    runs: [],
    guides: [],
  },

  colorado_glenwood: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true, notes: 'Wild browns are the dominant trout in Glenwood Canyon' },
      { name: 'Rainbow Trout', type: 'resident', primary: true },
      { name: 'Mountain Whitefish', type: 'resident', primary: false },
      { name: 'Cutthroat Trout', type: 'resident', primary: false, notes: 'Native Colorado River cutthroat in tributaries' },
    ],
    designations: ['White River National Forest'],
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
      { species: 'Rainbow Trout', season: 'March–May' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'March–May, September–October' },
      { name: 'Caddis', timing: 'May–July', notes: 'Mother\u2019s Day caddis is a major hatch' },
      { name: 'Pale Morning Dun (PMD)', timing: 'June–July' },
      { name: 'Yellow Sally (Stonefly)', timing: 'June–July' },
      { name: 'Terrestrials', timing: 'July–September' },
    ],
    runs: [],
    guides: [],
  },

  taylor: {
    species: [
      { name: 'Rainbow Trout', type: 'resident', primary: true, notes: 'World-famous Taylor River tailwater below Taylor Park Reservoir holds trophy rainbows' },
      { name: 'Brown Trout', type: 'resident', primary: true },
      { name: 'Cutthroat Trout', type: 'resident', primary: false },
    ],
    designations: ['Colorado Gold Medal Water (Hog Trough section)', 'Catch & Release — flies and lures only (Hog Trough)'],
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
      { species: 'Rainbow Trout', season: 'March–May' },
    ],
    hatches: [
      { name: 'Midges', timing: 'Year-round', notes: 'Tailwater stays cold and midges hatch all winter' },
      { name: 'Blue-Winged Olive (BWO)', timing: 'April–May, September–October' },
      { name: 'Mysis Shrimp', timing: 'Year-round', notes: 'Mysis flushed from the reservoir feed trophy fish in the Hog Trough' },
      { name: 'Caddis', timing: 'June–July' },
      { name: 'Pale Morning Dun (PMD)', timing: 'June–July' },
    ],
    runs: [],
    guides: [],
  },

  frying_pan: {
    species: [
      { name: 'Rainbow Trout', type: 'resident', primary: true, notes: 'Trophy rainbow tailwater below Ruedi Reservoir, mysis-fed' },
      { name: 'Brown Trout', type: 'resident', primary: true },
      { name: 'Mountain Whitefish', type: 'resident', primary: false },
    ],
    designations: ['Colorado Gold Medal Water (entire river)', 'Catch & Release — flies and lures only (Toilet Bowl)'],
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
      { species: 'Rainbow Trout', season: 'March–May' },
    ],
    hatches: [
      { name: 'Midges', timing: 'Year-round', notes: 'Cold tailwater fishes year-round' },
      { name: 'Blue-Winged Olive (BWO)', timing: 'March–May, September–October' },
      { name: 'Mysis Shrimp', timing: 'Year-round', notes: 'Hallmark of the Frying Pan — flushed from Ruedi, fuels trophy rainbows' },
      { name: 'Pale Morning Dun (PMD)', timing: 'June–August' },
      { name: 'Green Drake', timing: 'July–August', notes: 'Famous Pan green drake hatch' },
      { name: 'Trico', timing: 'August–September' },
    ],
    runs: [],
    guides: [],
  },

  south_platte: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true, notes: 'Cheesman Canyon and the Dream Stream are world-class wild brown fisheries' },
      { name: 'Rainbow Trout', type: 'resident', primary: true },
      { name: 'Cutthroat Trout', type: 'resident', primary: false },
      { name: 'Smallmouth Bass', type: 'warmwater', primary: false, notes: 'Lower river through the plains' },
    ],
    designations: ['Colorado Gold Medal Water (Cheesman Canyon, Dream Stream, and Deckers sections)', 'Catch & Release — flies and lures only (Cheesman, Dream Stream)'],
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
      { species: 'Rainbow Trout', season: 'March–May' },
    ],
    hatches: [
      { name: 'Midges', timing: 'Year-round' },
      { name: 'Blue-Winged Olive (BWO)', timing: 'March–May, September–October' },
      { name: 'Caddis', timing: 'May–July' },
      { name: 'Pale Morning Dun (PMD)', timing: 'June–August' },
      { name: 'Trico', timing: 'July–September', notes: 'Famous Dream Stream trico spinner falls' },
      { name: 'Terrestrials', timing: 'July–September' },
    ],
    runs: [],
    guides: [],
  },

  cache_la_poudre: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true },
      { name: 'Rainbow Trout', type: 'resident', primary: true },
      { name: 'Greenback Cutthroat Trout', type: 'resident', primary: false, notes: 'Native Colorado state fish — recovering population in headwaters' },
      { name: 'Brook Trout', type: 'resident', primary: false, notes: 'Headwater tributaries' },
    ],
    designations: ['National Wild & Scenic River (1986)', 'Roosevelt National Forest'],
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
      { species: 'Rainbow Trout', season: 'March–May' },
      { species: 'Brook Trout', season: 'September–October' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'April–May, September–October' },
      { name: 'Caddis', timing: 'May–July' },
      { name: 'Pale Morning Dun (PMD)', timing: 'June–July' },
      { name: 'Salmonfly', timing: 'June', notes: 'Brief window during peak runoff' },
      { name: 'Yellow Sally', timing: 'June–July' },
      { name: 'Terrestrials', timing: 'July–September' },
    ],
    runs: [],
    guides: [],
  },

  gunnison_main: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true, notes: 'Black Canyon and Gunnison Gorge hold trophy wild browns' },
      { name: 'Rainbow Trout', type: 'resident', primary: true },
      { name: 'Cutthroat Trout', type: 'resident', primary: false },
      { name: 'Mountain Whitefish', type: 'resident', primary: false },
    ],
    designations: ['Colorado Gold Medal Water (Black Canyon and Gunnison Gorge)', 'Black Canyon of the Gunnison National Park'],
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
      { species: 'Rainbow Trout', season: 'March–May' },
    ],
    hatches: [
      { name: 'Midges', timing: 'Year-round', notes: 'Cold tailwater fishes year-round in the canyon' },
      { name: 'Blue-Winged Olive (BWO)', timing: 'March–May, September–October' },
      { name: 'Caddis', timing: 'May–July' },
      { name: 'Salmonfly', timing: 'Late May – Early July', notes: 'Famous Gunnison salmonfly hatch — trophy fish window' },
      { name: 'Golden Stonefly', timing: 'June–July' },
      { name: 'Pale Morning Dun (PMD)', timing: 'June–August' },
      { name: 'Green Drake', timing: 'July' },
    ],
    runs: [],
    guides: [],
  },

  colorado_pumphouse: {
    species: [
      { name: 'Rainbow Trout', type: 'resident', primary: true, notes: 'Wild rainbows in the Pumphouse to State Bridge reach' },
      { name: 'Brown Trout', type: 'resident', primary: true },
      { name: 'Mountain Whitefish', type: 'resident', primary: false },
    ],
    designations: [],
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
      { species: 'Rainbow Trout', season: 'March–May' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'April–May, September–October' },
      { name: 'Caddis', timing: 'May–July', notes: 'Strong Mother\u2019s Day caddis hatch on the Upper Colorado' },
      { name: 'Pale Morning Dun (PMD)', timing: 'June–July' },
      { name: 'Yellow Sally', timing: 'June–July' },
      { name: 'Terrestrials', timing: 'July–September' },
    ],
    runs: [],
    guides: [],
  },

  // ── West Virginia ──
  cheat_narrows: {
    species: [
      { name: 'Smallmouth Bass', type: 'warmwater', primary: true },
      { name: 'Walleye', type: 'warmwater', primary: false },
      { name: 'Brown Trout', type: 'resident', primary: false, notes: 'Stocked in upper reaches by WVDNR' },
      { name: 'Muskellunge', type: 'warmwater', primary: false },
    ],
    designations: [],
    spawning: [],
    hatches: [],
    runs: [],
    guides: [],
  },

  bluestone: {
    species: [
      { name: 'Smallmouth Bass', type: 'warmwater', primary: true, notes: 'One of West Virginia\u2019s premier smallmouth fisheries' },
      { name: 'Rock Bass', type: 'warmwater', primary: false },
      { name: 'Channel Catfish', type: 'warmwater', primary: false },
      { name: 'Muskellunge', type: 'warmwater', primary: false },
    ],
    designations: ['National Wild & Scenic River (1988)', 'Bluestone National Scenic River (NPS)'],
    spawning: [],
    hatches: [],
    runs: [],
    guides: [],
  },

  tygart_wv: {
    species: [
      { name: 'Smallmouth Bass', type: 'warmwater', primary: true },
      { name: 'Brown Trout', type: 'resident', primary: false, notes: 'WVDNR stocks the upper river and tributaries' },
      { name: 'Rainbow Trout', type: 'resident', primary: false, notes: 'Stocked seasonally' },
      { name: 'Walleye', type: 'warmwater', primary: false },
      { name: 'Muskellunge', type: 'warmwater', primary: false },
    ],
    designations: [],
    spawning: [],
    hatches: [],
    runs: [],
    guides: [],
  },

  north_branch: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true, notes: 'Wild brown trout fishery below Jennings Randolph Dam — one of the East\u2019s top tailwaters' },
      { name: 'Rainbow Trout', type: 'resident', primary: true },
      { name: 'Cutthroat Trout', type: 'resident', primary: false, notes: 'Stocked by MD DNR in the upper tailwater' },
      { name: 'Brook Trout', type: 'resident', primary: false },
    ],
    designations: ['Catch & Release — flies and lures only (upper tailwater section)', 'Maryland Trophy Trout Management Area'],
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
      { species: 'Rainbow Trout', season: 'March–May' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'March–May, September–October' },
      { name: 'Caddis', timing: 'April–June' },
      { name: 'Sulfur', timing: 'May–June', notes: 'Excellent evening sulfur hatch on the tailwater' },
      { name: 'Trico', timing: 'July–September' },
      { name: 'Terrestrials', timing: 'July–September' },
    ],
    runs: [],
    guides: [],
  },

  cacapon: {
    species: [
      { name: 'Smallmouth Bass', type: 'warmwater', primary: true, notes: 'Cacapon is a classic Eastern Panhandle smallmouth river' },
      { name: 'Rock Bass', type: 'warmwater', primary: false },
      { name: 'Largemouth Bass', type: 'warmwater', primary: false },
      { name: 'Channel Catfish', type: 'warmwater', primary: false },
      { name: 'Brook Trout', type: 'resident', primary: false, notes: 'Native brook trout in the headwater tributaries only' },
    ],
    designations: [],
    spawning: [],
    hatches: [],
    runs: [],
    guides: [],
  },

  shavers_fork: {
    species: [
      { name: 'Brook Trout', type: 'resident', primary: true, notes: 'One of West Virginia\u2019s most important native brook trout streams in the upper river' },
      { name: 'Brown Trout', type: 'resident', primary: true },
      { name: 'Rainbow Trout', type: 'resident', primary: false },
      { name: 'Smallmouth Bass', type: 'warmwater', primary: false, notes: 'Lower reaches' },
    ],
    designations: ['Monongahela National Forest', 'Catch & Release — High Falls section (upper river)'],
    spawning: [
      { species: 'Brook Trout', season: 'September–November', notes: 'Please avoid wading on redds' },
      { species: 'Brown Trout', season: 'October–December' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'March–May, September–October' },
      { name: 'Quill Gordon', timing: 'April', notes: 'Early-season Appalachian classic' },
      { name: 'Hendrickson Mayfly', timing: 'Late April – Mid May' },
      { name: 'Caddis', timing: 'April–June' },
      { name: 'Sulfur', timing: 'May–June' },
      { name: 'Terrestrials', timing: 'July–September' },
    ],
    runs: [],
    guides: [],
  },

  williams_wv: {
    species: [
      { name: 'Brook Trout', type: 'resident', primary: true, notes: 'Native brook trout fishery — community verification needed for current population status' },
      { name: 'Brown Trout', type: 'resident', primary: true, notes: 'WVDNR stocks brown trout' },
      { name: 'Rainbow Trout', type: 'resident', primary: false, notes: 'Stocked seasonally' },
    ],
    designations: ['Monongahela National Forest', 'Catch & Release — flies only (Tea Creek section)'],
    spawning: [
      { species: 'Brook Trout', season: 'September–November' },
      { species: 'Brown Trout', season: 'October–December' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'March–May, September–October' },
      { name: 'Quill Gordon', timing: 'April' },
      { name: 'Hendrickson Mayfly', timing: 'Late April – Mid May' },
      { name: 'Caddis', timing: 'April–June' },
      { name: 'Sulfur', timing: 'May–June' },
      { name: 'Terrestrials', timing: 'July–September' },
    ],
    runs: [],
    guides: [],
  },

  // ── Pennsylvania ──
  juniata: {
    species: [
      { name: 'Smallmouth Bass', type: 'warmwater', primary: true, notes: 'The Juniata is one of Pennsylvania\u2019s most famous smallmouth rivers' },
      { name: 'Walleye', type: 'warmwater', primary: false },
      { name: 'Muskellunge', type: 'warmwater', primary: false },
      { name: 'Channel Catfish', type: 'warmwater', primary: false },
    ],
    designations: [],
    spawning: [],
    hatches: [],
    runs: [],
    guides: [],
  },

  slippery_rock: {
    species: [
      { name: 'Smallmouth Bass', type: 'warmwater', primary: true },
      { name: 'Brown Trout', type: 'resident', primary: false, notes: 'PFBC stocks the upper reaches' },
      { name: 'Rock Bass', type: 'warmwater', primary: false },
    ],
    designations: ['McConnells Mill State Park'],
    spawning: [],
    hatches: [],
    runs: [],
    guides: [],
  },

  kiski: {
    species: [
      { name: 'Smallmouth Bass', type: 'warmwater', primary: true, notes: 'Kiskiminetas has recovered as a smallmouth fishery since AMD remediation' },
      { name: 'Walleye', type: 'warmwater', primary: false },
      { name: 'Channel Catfish', type: 'warmwater', primary: false },
      { name: 'Muskellunge', type: 'warmwater', primary: false },
    ],
    designations: [],
    spawning: [],
    hatches: [],
    runs: [],
    guides: [],
  },

  tohickon: {
    species: [
      { name: 'Smallmouth Bass', type: 'warmwater', primary: true },
      { name: 'Brown Trout', type: 'resident', primary: false, notes: 'Stocked by PFBC in spring; seasonal trout fishery' },
      { name: 'Rock Bass', type: 'warmwater', primary: false },
    ],
    designations: ['Ralph Stover State Park'],
    spawning: [],
    hatches: [],
    runs: [],
    guides: [],
  },

  little_juniata: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true, notes: 'World-class wild brown trout limestone stream — one of the best in the East' },
      { name: 'Rainbow Trout', type: 'resident', primary: false },
    ],
    designations: ['Pennsylvania Class A Wild Trout Stream', 'Catch & Release — flies only (Spruce Creek section)'],
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'March–May, September–November' },
      { name: 'Hendrickson Mayfly', timing: 'Late April – Mid May' },
      { name: 'Caddis', timing: 'April–June', notes: 'Grannom hatch in late April is famous' },
      { name: 'March Brown', timing: 'May' },
      { name: 'Sulfur', timing: 'Late May – June', notes: 'Premier sulfur hatch — evening rises into July' },
      { name: 'Green Drake', timing: 'Late May – June', notes: 'Limited but present — limestone bug' },
      { name: 'Trico', timing: 'July–September', notes: 'Excellent morning trico spinner falls' },
      { name: 'Terrestrials', timing: 'July–September' },
    ],
    runs: [],
    guides: [],
  },

  lackawaxen: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true, notes: 'Wild brown trout in the Class A section below Lake Wallenpaupack' },
      { name: 'Rainbow Trout', type: 'resident', primary: false },
      { name: 'Smallmouth Bass', type: 'warmwater', primary: false, notes: 'Lower river' },
      { name: 'American Shad', type: 'anadromous', primary: false, notes: 'Spring shad run from the Delaware' },
    ],
    designations: ['Pennsylvania Class A Wild Trout Stream (sections)'],
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'April–May, September–October' },
      { name: 'Hendrickson Mayfly', timing: 'Late April – Mid May' },
      { name: 'Caddis', timing: 'April–June' },
      { name: 'Sulfur', timing: 'May–June' },
      { name: 'Slate Drake (Isonychia)', timing: 'May–June, September' },
      { name: 'Terrestrials', timing: 'July–September' },
    ],
    runs: [
      { species: 'American Shad', timing: 'April–May', peak: 'May', notes: 'Spring shad run from the Delaware River reaches the Lackawaxen' },
    ],
    guides: [],
  },

  kettle_creek_pa: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true, notes: 'Famous freestone brown trout fishery in the West Branch Susquehanna headwaters' },
      { name: 'Brook Trout', type: 'resident', primary: true, notes: 'Native brook trout in headwater tributaries' },
      { name: 'Rainbow Trout', type: 'resident', primary: false },
    ],
    designations: ['Catch & Release — flies only (Kettle Creek Catch and Release Area)', 'Pennsylvania Wilds region'],
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
      { species: 'Brook Trout', season: 'September–November' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'March–May, September–October' },
      { name: 'Quill Gordon', timing: 'April' },
      { name: 'Hendrickson Mayfly', timing: 'Late April – Mid May' },
      { name: 'Caddis', timing: 'April–June' },
      { name: 'March Brown', timing: 'May' },
      { name: 'Sulfur', timing: 'Late May – June' },
      { name: 'Slate Drake (Isonychia)', timing: 'May–June, September' },
      { name: 'Terrestrials', timing: 'July–September' },
    ],
    runs: [],
    guides: [],
  },

  // ── California ──
  feather: {
    species: [
      { name: 'Steelhead', type: 'anadromous', primary: true, notes: 'Wild and hatchery steelhead in the Low Flow Channel below Oroville' },
      { name: 'Chinook Salmon', type: 'anadromous', primary: true, notes: 'Both fall-run and spring-run Chinook' },
      { name: 'Rainbow Trout', type: 'resident', primary: true, notes: 'Resident rainbows in the Low Flow Channel between salmon runs' },
      { name: 'Smallmouth Bass', type: 'warmwater', primary: false, notes: 'Lower river warmwater sections' },
      { name: 'Striped Bass', type: 'anadromous', primary: false, notes: 'Spring run from the Delta' },
    ],
    designations: ['Catch & Release — Low Flow Channel (Oroville Wildlife Area)'],
    spawning: [
      { species: 'Chinook Salmon', season: 'September–December (fall run), April–June (spring run)' },
      { species: 'Steelhead', season: 'January–March' },
      { species: 'Rainbow Trout', season: 'March–May' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'October–April', notes: 'Cool-season tailwater hatch' },
      { name: 'Caddis', timing: 'April–June' },
      { name: 'Pale Morning Dun (PMD)', timing: 'May–July' },
    ],
    runs: [
      { species: 'Chinook Salmon (fall)', timing: 'September–December', peak: 'October', notes: 'Major fall Chinook run on the Low Flow Channel' },
      { species: 'Chinook Salmon (spring)', timing: 'March–June', peak: 'May', notes: 'Threatened spring-run Chinook' },
      { species: 'Steelhead', timing: 'September–March', peak: 'November–January' },
      { species: 'Striped Bass', timing: 'April–June', peak: 'May', notes: 'Anadromous run from the Delta' },
    ],
    guides: [],
  },

  russian: {
    species: [
      { name: 'Steelhead', type: 'anadromous', primary: true, notes: 'Winter-run wild and hatchery steelhead — community verification needed for current population status' },
      { name: 'Chinook Salmon', type: 'anadromous', primary: false, notes: 'Fall run, recovering' },
      { name: 'Coho Salmon', type: 'anadromous', primary: false, notes: 'Endangered Central California Coast ESU — limited and protected' },
      { name: 'Smallmouth Bass', type: 'warmwater', primary: false, notes: 'Wine country reaches in summer' },
      { name: 'Largemouth Bass', type: 'warmwater', primary: false },
    ],
    designations: ['California Heritage River'],
    spawning: [
      { species: 'Steelhead', season: 'December–April' },
      { species: 'Chinook Salmon', season: 'October–December' },
    ],
    hatches: [],
    runs: [
      { species: 'Steelhead', timing: 'December–April', peak: 'January–February', notes: 'Winter run — flow-dependent' },
      { species: 'Chinook Salmon', timing: 'October–December', peak: 'November' },
    ],
    guides: [],
  },

  kings: {
    species: [
      { name: 'Rainbow Trout', type: 'resident', primary: true, notes: 'Wild rainbows in the Sierra headwaters and Garnet Dike to Pine Flat reach' },
      { name: 'Brown Trout', type: 'resident', primary: true },
      { name: 'Brook Trout', type: 'resident', primary: false, notes: 'High elevation tributaries' },
      { name: 'Smallmouth Bass', type: 'warmwater', primary: false, notes: 'Below Pine Flat Reservoir' },
    ],
    designations: ['National Wild & Scenic River (1987) — Middle and South Forks', 'Kings Canyon National Park (headwaters)', 'Sierra National Forest'],
    spawning: [
      { species: 'Rainbow Trout', season: 'March–May' },
      { species: 'Brown Trout', season: 'October–December' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'April–May, September–October' },
      { name: 'Caddis', timing: 'May–July' },
      { name: 'Pale Morning Dun (PMD)', timing: 'June–August' },
      { name: 'Golden Stonefly', timing: 'June–July' },
      { name: 'Terrestrials', timing: 'July–September' },
    ],
    runs: [],
    guides: [],
  },

  napa: {
    species: [
      { name: 'Largemouth Bass', type: 'warmwater', primary: true },
      { name: 'Smallmouth Bass', type: 'warmwater', primary: false },
      { name: 'Striped Bass', type: 'anadromous', primary: false, notes: 'Tidal lower river — community verification needed' },
      { name: 'Channel Catfish', type: 'warmwater', primary: false },
    ],
    designations: [],
    spawning: [],
    hatches: [],
    runs: [],
    guides: [],
  },

  truckee_ca: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true, notes: 'Wild brown trout fishery — California\u2019s most famous trout river' },
      { name: 'Rainbow Trout', type: 'resident', primary: true },
      { name: 'Lahontan Cutthroat Trout', type: 'resident', primary: false, notes: 'Native species recovering through CDFW programs' },
      { name: 'Mountain Whitefish', type: 'resident', primary: false },
    ],
    designations: ['California Wild Trout Water', 'Catch & Release — flies and lures only (sections)'],
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
      { species: 'Rainbow Trout', season: 'March–May' },
    ],
    hatches: [
      { name: 'Midges', timing: 'Year-round' },
      { name: 'Blue-Winged Olive (BWO)', timing: 'March–May, September–October' },
      { name: 'Skwala (Stonefly)', timing: 'March–April', notes: 'Famous early-season Truckee skwala hatch' },
      { name: 'Caddis', timing: 'May–July' },
      { name: 'Pale Morning Dun (PMD)', timing: 'June–August' },
      { name: 'Golden Stonefly', timing: 'June–July' },
      { name: 'Trico', timing: 'August–September' },
      { name: 'Terrestrials', timing: 'July–September' },
    ],
    runs: [],
    guides: [],
  },

  salmon_ca: {
    species: [
      { name: 'Steelhead', type: 'anadromous', primary: true, notes: 'Wild summer and fall steelhead — Klamath system' },
      { name: 'Chinook Salmon', type: 'anadromous', primary: true, notes: 'Spring-run and fall-run Chinook' },
      { name: 'Coho Salmon', type: 'anadromous', primary: false, notes: 'SONCC ESU, threatened' },
      { name: 'Rainbow Trout', type: 'resident', primary: false },
      { name: 'Coastal Cutthroat Trout', type: 'anadromous', primary: false },
    ],
    designations: ['National Wild & Scenic River (1981)', 'Klamath National Forest'],
    spawning: [
      { species: 'Chinook Salmon', season: 'September–December' },
      { species: 'Steelhead', season: 'January–April' },
    ],
    hatches: [],
    runs: [
      { species: 'Chinook Salmon (spring)', timing: 'May–July', peak: 'June', notes: 'Famous Salmon River spring Chinook holding pools' },
      { species: 'Chinook Salmon (fall)', timing: 'September–November', peak: 'October' },
      { species: 'Steelhead (summer)', timing: 'June–September', peak: 'August' },
      { species: 'Steelhead (winter)', timing: 'December–March', peak: 'February' },
    ],
    guides: [],
  },

  pit: {
    species: [
      { name: 'Rainbow Trout', type: 'resident', primary: true, notes: 'Wild trophy rainbow tailwater — one of the West\u2019s top wild trout rivers' },
      { name: 'Brown Trout', type: 'resident', primary: true },
      { name: 'Mountain Whitefish', type: 'resident', primary: false },
    ],
    designations: ['California Wild Trout Water', 'Catch & Release — flies and lures only (Pit 3, Pit 4, Pit 5 reaches)'],
    spawning: [
      { species: 'Rainbow Trout', season: 'March–May' },
      { species: 'Brown Trout', season: 'October–December' },
    ],
    hatches: [
      { name: 'Midges', timing: 'Year-round' },
      { name: 'Blue-Winged Olive (BWO)', timing: 'March–May, September–October' },
      { name: 'Caddis', timing: 'May–July', notes: 'Heavy caddis hatches are the Pit\u2019s hallmark — fish nymphs deep' },
      { name: 'Pale Morning Dun (PMD)', timing: 'June–August' },
      { name: 'Golden Stonefly', timing: 'June–July' },
    ],
    runs: [],
    guides: [],
  },

  // ── North Carolina ──
  davidson: {
    species: [
      { name: 'Rainbow Trout', type: 'resident', primary: true, notes: 'Wild trophy rainbows — one of the East\u2019s most famous wild trout streams' },
      { name: 'Brown Trout', type: 'resident', primary: true },
      { name: 'Brook Trout', type: 'resident', primary: false, notes: 'Native brook trout in headwater tributaries' },
    ],
    designations: ['North Carolina Wild Trout Water', 'Catch & Release — flies only (Davidson River Catch and Release Area)', 'Pisgah National Forest'],
    spawning: [
      { species: 'Rainbow Trout', season: 'March–May' },
      { species: 'Brown Trout', season: 'October–December' },
      { species: 'Brook Trout', season: 'September–November' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'March–May, September–November' },
      { name: 'Quill Gordon', timing: 'March–April' },
      { name: 'Hendrickson Mayfly', timing: 'April' },
      { name: 'Caddis', timing: 'April–June' },
      { name: 'Sulfur', timing: 'May–June' },
      { name: 'Yellow Sally', timing: 'May–July' },
      { name: 'Terrestrials', timing: 'July–September' },
    ],
    runs: [],
    guides: [],
  },

  nantahala_lake: {
    species: [
      { name: 'Rainbow Trout', type: 'resident', primary: true, notes: 'Delayed Harvest section above the lake — heavily stocked October–June' },
      { name: 'Brown Trout', type: 'resident', primary: true },
      { name: 'Brook Trout', type: 'resident', primary: false, notes: 'Native brook trout in headwater tributaries' },
    ],
    designations: ['NC Wildlife Resources Commission Delayed Harvest Water', 'Nantahala National Forest'],
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
      { species: 'Rainbow Trout', season: 'March–May' },
      { species: 'Brook Trout', season: 'September–November' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'March–May, September–November' },
      { name: 'Hendrickson Mayfly', timing: 'April' },
      { name: 'Caddis', timing: 'April–June' },
      { name: 'Sulfur', timing: 'May–June' },
      { name: 'Terrestrials', timing: 'July–September' },
    ],
    runs: [],
    guides: [],
  },

  little_tennessee: {
    species: [
      { name: 'Smallmouth Bass', type: 'warmwater', primary: true, notes: 'Excellent smallmouth fishery in the lower river' },
      { name: 'Brown Trout', type: 'resident', primary: false, notes: 'Stocked in tailwater sections — community verification needed for current ranges' },
      { name: 'Rainbow Trout', type: 'resident', primary: false, notes: 'Stocked seasonally' },
      { name: 'Walleye', type: 'warmwater', primary: false },
      { name: 'Muskellunge', type: 'warmwater', primary: false },
    ],
    designations: ['Needmore Game Lands (lower reach)'],
    spawning: [],
    hatches: [],
    runs: [],
    guides: [],
  },

  roanoke: {
    species: [
      { name: 'Smallmouth Bass', type: 'warmwater', primary: true, notes: 'Upper Roanoke holds excellent smallmouth' },
      { name: 'Largemouth Bass', type: 'warmwater', primary: false, notes: 'Lower river' },
      { name: 'Striped Bass', type: 'anadromous', primary: true, notes: 'Famous spring striper run on the lower Roanoke through Weldon' },
      { name: 'Channel Catfish', type: 'warmwater', primary: false },
      { name: 'Blue Catfish', type: 'warmwater', primary: false, notes: 'Trophy blue catfish in the lower river' },
    ],
    designations: [],
    spawning: [],
    hatches: [],
    runs: [
      { species: 'Striped Bass', timing: 'April–May', peak: 'Late April', notes: 'Iconic spring striper run — Weldon to Roanoke Rapids holds tens of thousands of fish on spawning grounds' },
    ],
    guides: [],
  },

  cape_fear: {
    species: [
      { name: 'Largemouth Bass', type: 'warmwater', primary: true },
      { name: 'Smallmouth Bass', type: 'warmwater', primary: false, notes: 'Upper river only' },
      { name: 'Striped Bass', type: 'anadromous', primary: false, notes: 'Spring run from the Atlantic — limited in current state' },
      { name: 'Channel Catfish', type: 'warmwater', primary: false },
      { name: 'Flathead Catfish', type: 'warmwater', primary: false, notes: 'Introduced — trophy size in the lower river' },
      { name: 'American Shad', type: 'anadromous', primary: false, notes: 'Spring shad run' },
    ],
    designations: [],
    spawning: [],
    hatches: [],
    runs: [
      { species: 'American Shad', timing: 'March–May', peak: 'April', notes: 'Spring shad run from the Atlantic' },
    ],
    guides: [],
  },

  neuse: {
    species: [
      { name: 'Largemouth Bass', type: 'warmwater', primary: true },
      { name: 'Smallmouth Bass', type: 'warmwater', primary: false, notes: 'Upper river above Falls Lake' },
      { name: 'Striped Bass', type: 'anadromous', primary: true, notes: 'Spring spawning run from the Atlantic, plus year-round Falls Lake tailrace striped bass' },
      { name: 'Channel Catfish', type: 'warmwater', primary: false },
      { name: 'Flathead Catfish', type: 'warmwater', primary: false },
    ],
    designations: [],
    spawning: [],
    hatches: [],
    runs: [
      { species: 'Striped Bass', timing: 'April–May', peak: 'April', notes: 'Spring spawning run' },
    ],
    guides: [],
  },

  haw: {
    species: [
      { name: 'Smallmouth Bass', type: 'warmwater', primary: true },
      { name: 'Largemouth Bass', type: 'warmwater', primary: false },
      { name: 'Channel Catfish', type: 'warmwater', primary: false },
      { name: 'Sunfish (Bluegill, Redbreast)', type: 'warmwater', primary: false },
    ],
    designations: [],
    spawning: [],
    hatches: [],
    runs: [],
    guides: [],
  },

  // ── South Carolina ──
  chattooga_sc_main: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true, notes: 'Wild brown trout in the upper river (Sections 0–II) and Delayed Harvest reach' },
      { name: 'Rainbow Trout', type: 'resident', primary: true },
      { name: 'Brook Trout', type: 'resident', primary: false, notes: 'Native brook trout in headwater tributaries on both NC and GA sides' },
      { name: 'Smallmouth Bass', type: 'warmwater', primary: false, notes: 'Lower sections (III, IV) below Bull Sluice' },
      { name: 'Redeye Bass', type: 'warmwater', primary: false, notes: 'Native to the Savannah drainage' },
    ],
    designations: ['National Wild & Scenic River (1974) — first east of the Mississippi', 'Sumter National Forest', 'Chattahoochee National Forest', 'Delayed Harvest section (upper river)'],
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
      { species: 'Rainbow Trout', season: 'March–May' },
      { species: 'Brook Trout', season: 'September–November' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'March–May, September–November' },
      { name: 'Quill Gordon', timing: 'March–April' },
      { name: 'Hendrickson Mayfly', timing: 'April' },
      { name: 'Caddis', timing: 'April–June' },
      { name: 'Sulfur', timing: 'May–June' },
      { name: 'Yellow Sally', timing: 'May–July' },
      { name: 'Terrestrials', timing: 'July–September' },
    ],
    runs: [],
    guides: [],
  },

  enoree: {
    species: [
      { name: 'Largemouth Bass', type: 'warmwater', primary: true },
      { name: 'Redbreast Sunfish', type: 'warmwater', primary: false, notes: 'Native to South Carolina Piedmont rivers' },
      { name: 'Channel Catfish', type: 'warmwater', primary: false },
      { name: 'Bream (Bluegill)', type: 'warmwater', primary: false },
    ],
    designations: ['Sumter National Forest (lower reach)'],
    spawning: [],
    hatches: [],
    runs: [],
    guides: [],
  },

  lynches: {
    species: [
      { name: 'Largemouth Bass', type: 'warmwater', primary: true, notes: 'community verification needed for current population status' },
      { name: 'Redbreast Sunfish', type: 'warmwater', primary: false },
      { name: 'Bream (Bluegill)', type: 'warmwater', primary: false },
      { name: 'Channel Catfish', type: 'warmwater', primary: false },
      { name: 'Bowfin', type: 'warmwater', primary: false, notes: 'Coastal Plain blackwater swamps' },
    ],
    designations: ['National Wild & Scenic River (2008)'],
    spawning: [],
    hatches: [],
    runs: [],
    guides: [],
  },

  wateree: {
    species: [
      { name: 'Largemouth Bass', type: 'warmwater', primary: true },
      { name: 'Striped Bass', type: 'anadromous', primary: true, notes: 'Tailrace striped bass below Wateree Dam' },
      { name: 'Catfish', type: 'warmwater', primary: false, notes: 'Channel and blue catfish' },
      { name: 'Crappie', type: 'warmwater', primary: false },
    ],
    designations: [],
    spawning: [],
    hatches: [],
    runs: [],
    guides: [],
  },

  pee_dee: {
    species: [
      { name: 'Largemouth Bass', type: 'warmwater', primary: true },
      { name: 'Striped Bass', type: 'anadromous', primary: true, notes: 'Spring run from the Atlantic and tailrace stripers below Blewett Falls' },
      { name: 'Catfish', type: 'warmwater', primary: false, notes: 'Channel, blue, and flathead catfish — trophy blue cats in the lower river' },
      { name: 'American Shad', type: 'anadromous', primary: false, notes: 'Spring shad run' },
      { name: 'Robust Redhorse', type: 'resident', primary: false, notes: 'Rare native sucker, recovering population' },
    ],
    designations: [],
    spawning: [],
    hatches: [],
    runs: [
      { species: 'Striped Bass', timing: 'April–May', peak: 'Late April' },
      { species: 'American Shad', timing: 'March–May', peak: 'April' },
    ],
    guides: [],
  },

  black_sc: {
    species: [
      { name: 'Largemouth Bass', type: 'warmwater', primary: true, notes: 'community verification needed' },
      { name: 'Bowfin', type: 'warmwater', primary: false, notes: 'Coastal Plain blackwater' },
      { name: 'Redbreast Sunfish', type: 'warmwater', primary: false },
      { name: 'Bream (Bluegill)', type: 'warmwater', primary: false },
      { name: 'Channel Catfish', type: 'warmwater', primary: false },
    ],
    designations: ['National Wild & Scenic River (2019)'],
    spawning: [],
    hatches: [],
    runs: [],
    guides: [],
  },

  lumber: {
    species: [
      { name: 'Largemouth Bass', type: 'warmwater', primary: true },
      { name: 'Redbreast Sunfish', type: 'warmwater', primary: false, notes: 'A signature Lumber River species' },
      { name: 'Bowfin', type: 'warmwater', primary: false },
      { name: 'Channel Catfish', type: 'warmwater', primary: false },
      { name: 'Pickerel', type: 'warmwater', primary: false },
    ],
    designations: ['National Wild & Scenic River (1998)', 'North Carolina Natural and Scenic River'],
    spawning: [],
    hatches: [],
    runs: [],
    guides: [],
  },

  // ── Batch added 2026-04-10: 30 new rivers from this session ──
  // 10 East-coast (commit e7927b3) + 20 Appalachian fishing rivers
  // (commit 27adabc). Each entry includes optimalFishingCfs in
  // string min-max format (matches the existing schema).

  // ── East-coast batch (10 rivers) ──

  charles_ma: {
    species: [
      { name: 'Largemouth Bass', type: 'warmwater', primary: true },
      { name: 'Smallmouth Bass', type: 'warmwater', primary: false },
      { name: 'Bluegill', type: 'warmwater', primary: false },
      { name: 'Carp', type: 'warmwater', primary: false },
      { name: 'White Perch', type: 'warmwater', primary: false },
    ],
    designations: ['Charles River Watershed Heritage'],
    optimalFishingCfs: '100–500',
    spawning: [],
    hatches: [],
    runs: [],
    guides: [],
  },

  sudbury_ma: {
    species: [
      { name: 'Largemouth Bass', type: 'warmwater', primary: true },
      { name: 'Northern Pike', type: 'warmwater', primary: true },
      { name: 'Pickerel', type: 'warmwater', primary: false },
      { name: 'Bluegill', type: 'warmwater', primary: false },
      { name: 'Yellow Perch', type: 'warmwater', primary: false },
    ],
    designations: ['National Wild & Scenic River (1999)', 'Great Meadows National Wildlife Refuge'],
    optimalFishingCfs: '80–400',
    spawning: [],
    hatches: [],
    runs: [],
    guides: [],
  },

  allegheny: {
    species: [
      { name: 'Smallmouth Bass', type: 'warmwater', primary: true, notes: 'World-class smallmouth fishery in the Wild & Scenic reach' },
      { name: 'Muskellunge', type: 'warmwater', primary: true },
      { name: 'Walleye', type: 'warmwater', primary: false },
      { name: 'Channel Catfish', type: 'warmwater', primary: false },
      { name: 'Northern Pike', type: 'warmwater', primary: false },
    ],
    designations: ['National Wild & Scenic River (1992)', 'Allegheny National Forest'],
    optimalFishingCfs: '1500–6000',
    spawning: [],
    hatches: [],
    runs: [],
    guides: [],
  },

  mohawk: {
    species: [
      { name: 'Smallmouth Bass', type: 'warmwater', primary: true },
      { name: 'Walleye', type: 'warmwater', primary: true },
      { name: 'Channel Catfish', type: 'warmwater', primary: false },
      { name: 'Northern Pike', type: 'warmwater', primary: false },
      { name: 'Carp', type: 'warmwater', primary: false },
    ],
    designations: ['Erie Canalway National Heritage Corridor'],
    optimalFishingCfs: '500–3000',
    spawning: [],
    hatches: [],
    runs: [],
    guides: [],
  },

  genesee: {
    species: [
      { name: 'Smallmouth Bass', type: 'warmwater', primary: true },
      { name: 'Steelhead', type: 'anadromous', primary: true, notes: 'Lake Ontario steelhead run into the lower Genesee fall through spring' },
      { name: 'Brown Trout', type: 'anadromous', primary: false, notes: 'Lake Ontario lake-run browns' },
      { name: 'Chinook Salmon', type: 'anadromous', primary: false },
      { name: 'Walleye', type: 'warmwater', primary: false },
    ],
    designations: ['Letchworth State Park', 'NY State Scenic River'],
    optimalFishingCfs: '400–2500',
    spawning: [],
    hatches: [],
    runs: [
      { species: 'Steelhead', timing: 'October–April', peak: 'November–March', notes: 'Lake Ontario steelhead run into lower Genesee from the lake' },
      { species: 'Chinook Salmon', timing: 'September–November', peak: 'October' },
    ],
    guides: [],
  },

  tellico_tn: {
    species: [
      { name: 'Rainbow Trout', type: 'resident', primary: true, notes: 'TWRA stocks 90,000+ trout annually' },
      { name: 'Brown Trout', type: 'resident', primary: true },
      { name: 'Brook Trout', type: 'resident', primary: false, notes: 'Native Southern Appalachian brook trout in headwater tributaries' },
      { name: 'Smallmouth Bass', type: 'warmwater', primary: false, notes: 'Lower river' },
    ],
    designations: ['Cherokee National Forest', 'TWRA Trophy Trout Water'],
    optimalFishingCfs: '150–800',
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
      { species: 'Rainbow Trout', season: 'February–April' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive', timing: 'March–April, October' },
      { name: 'Quill Gordon', timing: 'March–April' },
      { name: 'Hendrickson', timing: 'April' },
      { name: 'Yellow Sally Stonefly', timing: 'May–June' },
      { name: 'Sulfur', timing: 'May–June' },
      { name: 'Light Cahill', timing: 'June' },
      { name: 'Terrestrials (ants, beetles, hoppers)', timing: 'July–September' },
    ],
    runs: [],
    guides: [],
  },

  holston: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true, notes: 'Self-sustaining wild population — TVA tailwater' },
      { name: 'Rainbow Trout', type: 'resident', primary: true, notes: 'TWRA stocks 80,000+ annually' },
    ],
    designations: ['TVA Tailwater', 'TWRA Trophy Trout Water'],
    optimalFishingCfs: '200–1500',
    spawning: [
      { species: 'Brown Trout', season: 'October–December', notes: 'Wild browns spawn in tailwater gravel' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive', timing: 'March–April, October–November' },
      { name: 'Sulfur', timing: 'May–June', notes: 'The South Holston signature hatch — most consistent and predictable in the region' },
      { name: 'Caddis', timing: 'April–June' },
      { name: 'Midges', timing: 'Year-round', notes: 'Year-round midge fishing in the cold tailwater' },
      { name: 'Terrestrials (ants, beetles, hoppers)', timing: 'July–September' },
    ],
    runs: [],
    guides: [],
  },

  clinch_va: {
    species: [
      { name: 'Smallmouth Bass', type: 'warmwater', primary: true },
      { name: 'Muskellunge', type: 'warmwater', primary: true, notes: 'Self-sustaining muskie population — one of the few in the southeast' },
      { name: 'Redbreast Sunfish', type: 'warmwater', primary: false },
      { name: 'Channel Catfish', type: 'warmwater', primary: false },
      { name: 'Walleye', type: 'warmwater', primary: false },
    ],
    designations: ['American Heritage River (1998)', 'Clinch River State Park'],
    optimalFishingCfs: '300–1500',
    spawning: [],
    hatches: [],
    runs: [],
    guides: [],
  },

  rapidan: {
    species: [
      { name: 'Brook Trout', type: 'resident', primary: true, notes: 'Native Southern Appalachian brook trout in Shenandoah NP headwaters' },
      { name: 'Smallmouth Bass', type: 'warmwater', primary: true, notes: 'Lower piedmont reaches' },
      { name: 'Rainbow Trout', type: 'resident', primary: false, notes: 'Stocked seasonally in middle reaches' },
      { name: 'Redbreast Sunfish', type: 'warmwater', primary: false },
    ],
    designations: ['Shenandoah National Park (headwaters)', 'Rapidan Wildlife Management Area'],
    optimalFishingCfs: '100–800',
    spawning: [
      { species: 'Brook Trout', season: 'September–November', notes: 'Native brookies spawn in SNP headwaters' },
    ],
    hatches: [
      { name: 'Blue Quill', timing: 'April' },
      { name: 'Quill Gordon', timing: 'April' },
      { name: 'Hendrickson', timing: 'April–May' },
      { name: 'March Brown', timing: 'May' },
      { name: 'Sulfur', timing: 'May–June' },
      { name: 'Yellow Sally Stonefly', timing: 'May–June' },
      { name: 'Terrestrials', timing: 'June–September' },
    ],
    runs: [],
    guides: [],
  },

  patapsco: {
    species: [
      { name: 'Smallmouth Bass', type: 'warmwater', primary: true },
      { name: 'Brown Trout', type: 'resident', primary: false, notes: 'MDNR stocks the Patapsco Valley State Park reach' },
      { name: 'Largemouth Bass', type: 'warmwater', primary: false },
      { name: 'Rock Bass', type: 'warmwater', primary: false },
      { name: 'American Shad', type: 'anadromous', primary: false, notes: 'Returning since 2018 Bloede Dam removal' },
      { name: 'Alewife', type: 'anadromous', primary: false, notes: 'Returning since 2018 Bloede Dam removal' },
    ],
    designations: ['Patapsco Valley State Park', 'Maryland Scenic River'],
    optimalFishingCfs: '100–500',
    spawning: [
      { species: 'American Shad', season: 'April–May', notes: 'First runs since the 2018 Bloede Dam removal' },
    ],
    hatches: [],
    runs: [
      { species: 'American Shad', timing: 'April–May', notes: 'Returning runs after Bloede Dam removal in 2018 reopened 65+ mi of habitat' },
    ],
    guides: [],
  },

  // ── Appalachian batch (20 rivers) ──

  penns_creek: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true, notes: 'Class A wild brown trout — large fish in the limestone water' },
      { name: 'Rainbow Trout', type: 'resident', primary: false },
      { name: 'Brook Trout', type: 'resident', primary: false, notes: 'Tributaries' },
    ],
    designations: ['PA Class A Wild Trout', 'Bald Eagle State Forest'],
    optimalFishingCfs: '150–700',
    spawning: [
      { species: 'Brown Trout', season: 'October–December', notes: 'Wild browns spawn in the limestone gravel' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive', timing: 'March–May, September–October' },
      { name: 'Hendrickson', timing: 'April' },
      { name: 'Grannom Caddis', timing: 'April–May' },
      { name: 'March Brown', timing: 'May' },
      { name: 'Sulfur', timing: 'May–June' },
      { name: 'Green Drake (Ephemera guttulata)', timing: 'Late May – Mid June', notes: 'The legendary Penns Creek green drake — one of the great hatches in American fly fishing. Brings out trophy browns from undercut banks.' },
      { name: 'Slate Drake', timing: 'June' },
      { name: 'Trico', timing: 'July–August' },
      { name: 'Terrestrials', timing: 'July–September' },
    ],
    runs: [],
    guides: [],
  },

  spring_creek_pa: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true, notes: 'Highest density wild brown trout in PA — over 4,000 trout per mile in some sections' },
      { name: 'Rainbow Trout', type: 'resident', primary: false },
    ],
    designations: ['PA Class A Wild Trout', 'Catch-and-Release', 'No Harvest', 'Fisherman\u2019s Paradise (1957)'],
    optimalFishingCfs: '60–250',
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive', timing: 'March–May, September–October' },
      { name: 'Hendrickson', timing: 'April' },
      { name: 'Sulfur', timing: 'May–June' },
      { name: 'Caddis', timing: 'April–June' },
      { name: 'Trico', timing: 'July–August', notes: 'Famous Spring Creek trico spinner falls' },
      { name: 'Midges', timing: 'Year-round', notes: 'Cold spring water supports midges all year' },
      { name: 'Terrestrials', timing: 'July–September' },
    ],
    runs: [],
    guides: [],
  },

  slate_run_pa: {
    species: [
      { name: 'Brook Trout', type: 'resident', primary: true, notes: 'Native Eastern brook trout in headwater tributaries' },
      { name: 'Brown Trout', type: 'resident', primary: true, notes: 'Wild browns dominate the middle and lower run' },
    ],
    designations: ['PA Heritage Trout Angling Stream', 'Catch-and-Release Fly Fishing Only'],
    optimalFishingCfs: '50–250',
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
      { species: 'Brook Trout', season: 'September–November' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive', timing: 'April–May, September' },
      { name: 'Hendrickson', timing: 'April–May' },
      { name: 'Grannom Caddis', timing: 'April–May' },
      { name: 'Sulfur', timing: 'May–June' },
      { name: 'Light Cahill', timing: 'June' },
      { name: 'Slate Drake', timing: 'June–July' },
      { name: 'Terrestrials', timing: 'July–September' },
    ],
    runs: [],
    guides: [],
  },

  brodhead_pa: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true, notes: 'Mix of wild and stocked' },
      { name: 'Rainbow Trout', type: 'resident', primary: false },
      { name: 'Brook Trout', type: 'resident', primary: false, notes: 'Tributaries' },
    ],
    designations: ['Brodhead Watershed Association', 'Pocono Fly Fishing Heritage'],
    optimalFishingCfs: '100–500',
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive', timing: 'March–May, September–October' },
      { name: 'Hendrickson', timing: 'April' },
      { name: 'Grannom Caddis', timing: 'April–May' },
      { name: 'Sulfur', timing: 'May–June' },
      { name: 'Green Drake', timing: 'Late May – Mid June' },
      { name: 'Light Cahill', timing: 'June' },
      { name: 'Trico', timing: 'July–August' },
    ],
    runs: [],
    guides: [],
  },

  abrams_creek_tn: {
    species: [
      { name: 'Rainbow Trout', type: 'resident', primary: true, notes: 'Wild population through Cades Cove' },
      { name: 'Brook Trout', type: 'resident', primary: true, notes: 'Native Southern Appalachian brook trout in headwaters and restoration tributaries' },
    ],
    designations: ['Great Smoky Mountains National Park', 'Native Brook Trout Restoration Stream'],
    optimalFishingCfs: '40–200',
    spawning: [
      { species: 'Brook Trout', season: 'October–November', notes: 'Native brookies in headwater restoration sections' },
      { species: 'Rainbow Trout', season: 'February–April' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive', timing: 'March–April' },
      { name: 'Quill Gordon', timing: 'March–April' },
      { name: 'Hendrickson', timing: 'April' },
      { name: 'Yellow Sally Stonefly', timing: 'May–June' },
      { name: 'Light Cahill', timing: 'June' },
      { name: 'Terrestrials', timing: 'July–September' },
    ],
    runs: [],
    guides: [],
  },

  citico_creek_tn: {
    species: [
      { name: 'Brook Trout', type: 'resident', primary: true, notes: 'Native Southern Appalachian brook trout above the falls' },
      { name: 'Rainbow Trout', type: 'resident', primary: true, notes: 'Wild rainbows below the falls' },
    ],
    designations: ['Citico Creek Wilderness', 'Cherokee National Forest', 'Native Brook Trout Stream'],
    optimalFishingCfs: '30–180',
    spawning: [
      { species: 'Brook Trout', season: 'October–November' },
      { species: 'Rainbow Trout', season: 'February–April' },
    ],
    hatches: [
      { name: 'Quill Gordon', timing: 'March–April' },
      { name: 'Blue-Winged Olive', timing: 'March–May' },
      { name: 'Hendrickson', timing: 'April' },
      { name: 'Yellow Sally Stonefly', timing: 'May–June' },
      { name: 'Terrestrials', timing: 'July–September' },
    ],
    runs: [],
    guides: [],
  },

  clinch_norris_tn: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true, notes: 'Self-sustaining wild population — state record fish over 28 lbs' },
      { name: 'Rainbow Trout', type: 'resident', primary: true, notes: 'Heavily stocked' },
    ],
    designations: ['TVA Tailwater', 'TWRA Trophy Trout Water', 'Norris Dam State Park'],
    optimalFishingCfs: '300–2500',
    spawning: [
      { species: 'Brown Trout', season: 'October–December', notes: 'Wild browns spawn in the cold tailwater gravels' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive', timing: 'March–May, September–November' },
      { name: 'Sulfur', timing: 'May–June' },
      { name: 'Caddis', timing: 'April–June' },
      { name: 'Midges', timing: 'Year-round', notes: 'Critical year-round food source in the cold tailwater' },
      { name: 'Terrestrials', timing: 'July–September' },
    ],
    runs: [],
    guides: [],
  },

  mossy_creek_va: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true, notes: 'Trophy wild browns up to 10 lbs in fewer than 10 mi of fishable water' },
      { name: 'Brook Trout', type: 'resident', primary: false, notes: 'Headwater tributaries' },
    ],
    designations: ['VA Heritage Trout Water', 'Catch-and-Release', 'Fly Fishing Only'],
    optimalFishingCfs: '20–120',
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive', timing: 'March–May, September–October' },
      { name: 'Sulfur', timing: 'May–June' },
      { name: 'Caddis', timing: 'April–June' },
      { name: 'Midges', timing: 'Year-round', notes: 'Cold spring water supports midges all year' },
      { name: 'Terrestrials (cricket, beetle, ant)', timing: 'June–September', notes: 'Trophy browns key on terrestrials in summer' },
    ],
    runs: [],
    guides: [],
  },

  jackson_river_va: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true, notes: 'Wild browns in cold tailwater' },
      { name: 'Rainbow Trout', type: 'resident', primary: true, notes: 'Stocked and holdover' },
      { name: 'Smallmouth Bass', type: 'warmwater', primary: false, notes: 'Lower river' },
    ],
    designations: ['VA Stocked Trout Water', 'USACE Gathright Dam Tailwater', 'Lake Moomaw'],
    optimalFishingCfs: '300–1500',
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive', timing: 'March–May, September–November' },
      { name: 'Hendrickson', timing: 'April' },
      { name: 'Sulfur', timing: 'May–June' },
      { name: 'Caddis', timing: 'April–June' },
      { name: 'Light Cahill', timing: 'June' },
      { name: 'Terrestrials', timing: 'July–September' },
    ],
    runs: [],
    guides: [],
  },

  south_river_va: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true, notes: 'Wild browns in the Waynesboro C&R section' },
      { name: 'Rainbow Trout', type: 'resident', primary: false, notes: 'Stocked' },
    ],
    designations: ['VA Heritage Trout Water', 'South River Catch-and-Release', 'Urban Trout Stream'],
    optimalFishingCfs: '50–300',
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive', timing: 'March–May, September–October' },
      { name: 'Hendrickson', timing: 'April' },
      { name: 'Sulfur', timing: 'May–June' },
      { name: 'Caddis', timing: 'April–June' },
      { name: 'Trico', timing: 'July–August' },
      { name: 'Terrestrials', timing: 'June–September' },
    ],
    runs: [],
    guides: [],
  },

  cumberland_wolf_ky: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true, notes: 'Self-sustaining wild population — multiple state records over 21 lbs' },
      { name: 'Rainbow Trout', type: 'resident', primary: true, notes: 'Heavily stocked' },
      { name: 'Cutthroat Trout', type: 'resident', primary: false, notes: 'Stocked experimentally' },
    ],
    designations: ['USACE Tailwater', 'KDFWR Trophy Trout Fishery', 'Wolf Creek National Fish Hatchery'],
    optimalFishingCfs: '500–4000',
    spawning: [
      { species: 'Brown Trout', season: 'October–December', notes: 'Wild browns spawn in the tailwater gravels — strict slot limit protects spawners' },
    ],
    hatches: [
      { name: 'Midges', timing: 'Year-round', notes: 'Primary food source in the cold tailwater' },
      { name: 'Blue-Winged Olive', timing: 'March–May, October–November' },
      { name: 'Sulfur', timing: 'May–June' },
      { name: 'Caddis', timing: 'April–June' },
      { name: 'Terrestrials', timing: 'July–September' },
    ],
    runs: [],
    guides: [],
  },

  hatchery_creek_ky: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true, notes: 'Self-sustaining wild population — fish escape from hatchery raceways and reproduce in engineered gravels' },
      { name: 'Rainbow Trout', type: 'resident', primary: true },
    ],
    designations: ['KDFWR Trophy Trout Fishery', 'USFWS Wolf Creek NFH', 'Catch-and-Release'],
    optimalFishingCfs: '15–60',
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
      { species: 'Rainbow Trout', season: 'February–April' },
    ],
    hatches: [
      { name: 'Midges', timing: 'Year-round' },
      { name: 'Blue-Winged Olive', timing: 'March–May' },
      { name: 'Caddis', timing: 'April–June' },
      { name: 'Sulfur', timing: 'May–June' },
    ],
    runs: [],
    guides: [],
  },

  hazel_creek_nc: {
    species: [
      { name: 'Rainbow Trout', type: 'resident', primary: true, notes: 'Wild rainbows throughout main creek' },
      { name: 'Brook Trout', type: 'resident', primary: true, notes: 'Native Southern Appalachian brook trout in highest tributaries' },
      { name: 'Brown Trout', type: 'resident', primary: false, notes: 'Below Sugar Fork confluence' },
    ],
    designations: ['Great Smoky Mountains National Park', 'Backcountry Wilderness Trout Stream'],
    optimalFishingCfs: '40–250',
    spawning: [
      { species: 'Brook Trout', season: 'October–November' },
      { species: 'Rainbow Trout', season: 'February–April' },
    ],
    hatches: [
      { name: 'Quill Gordon', timing: 'March–April' },
      { name: 'Blue-Winged Olive', timing: 'March–May' },
      { name: 'Hendrickson', timing: 'April' },
      { name: 'Yellow Sally Stonefly', timing: 'May–June' },
      { name: 'Light Cahill', timing: 'June' },
      { name: 'Terrestrials', timing: 'July–September' },
    ],
    runs: [],
    guides: [],
  },

  wilson_creek_nc: {
    species: [
      { name: 'Rainbow Trout', type: 'resident', primary: true, notes: 'Wild rainbows in upper C&R section' },
      { name: 'Brown Trout', type: 'resident', primary: false },
      { name: 'Brook Trout', type: 'resident', primary: false, notes: 'Small population in headwaters' },
      { name: 'Smallmouth Bass', type: 'warmwater', primary: false, notes: 'Lower gorge below the trout zone' },
    ],
    designations: ['National Wild & Scenic River (2000)', 'Pisgah National Forest', 'NC Heritage Trout Water'],
    optimalFishingCfs: '100–400',
    spawning: [
      { species: 'Rainbow Trout', season: 'February–April' },
    ],
    hatches: [
      { name: 'Quill Gordon', timing: 'March–April' },
      { name: 'Blue-Winged Olive', timing: 'March–May' },
      { name: 'Hendrickson', timing: 'April' },
      { name: 'Yellow Sally Stonefly', timing: 'May–June' },
      { name: 'Light Cahill', timing: 'June' },
      { name: 'Terrestrials', timing: 'July–September' },
    ],
    runs: [],
    guides: [],
  },

  south_toe_nc: {
    species: [
      { name: 'Rainbow Trout', type: 'resident', primary: true, notes: 'Wild rainbows in lower wild trout water; stocked above Newdale' },
      { name: 'Brook Trout', type: 'resident', primary: false, notes: 'Native brookies in highest tributaries off Mount Mitchell' },
      { name: 'Brown Trout', type: 'resident', primary: false },
    ],
    designations: ['Pisgah National Forest', 'NC Hatchery Supported Trout Water (upper)', 'NC Wild Trout Water (lower)'],
    optimalFishingCfs: '60–350',
    spawning: [
      { species: 'Rainbow Trout', season: 'February–April' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive', timing: 'March–May' },
      { name: 'Quill Gordon', timing: 'March–April' },
      { name: 'Hendrickson', timing: 'April' },
      { name: 'Yellow Sally Stonefly', timing: 'May–June' },
      { name: 'Light Cahill', timing: 'June' },
      { name: 'Terrestrials', timing: 'July–September' },
    ],
    runs: [],
    guides: [],
  },

  seneca_creek_wv: {
    species: [
      { name: 'Brook Trout', type: 'resident', primary: true, notes: 'Native Eastern brook trout — one of the southernmost natural populations' },
    ],
    designations: ['Spruce Knob-Seneca Rocks NRA', 'Monongahela National Forest', 'Native Brook Trout Stream'],
    optimalFishingCfs: '20–120',
    spawning: [
      { species: 'Brook Trout', season: 'October–November' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive', timing: 'April–May' },
      { name: 'Hendrickson', timing: 'April–May' },
      { name: 'Yellow Sally Stonefly', timing: 'May–June' },
      { name: 'Terrestrials', timing: 'June–September' },
    ],
    runs: [],
    guides: [],
  },

  dry_fork_wv: {
    species: [
      { name: 'Brook Trout', type: 'resident', primary: true, notes: 'Native brook trout in headwaters around Canaan Valley' },
      { name: 'Brown Trout', type: 'resident', primary: false, notes: 'Lower river' },
      { name: 'Rainbow Trout', type: 'resident', primary: false, notes: 'Stocked seasonally' },
    ],
    designations: ['Monongahela National Forest', 'Canaan Valley NWR', 'WV Native Brook Trout Stream'],
    optimalFishingCfs: '60–400',
    spawning: [
      { species: 'Brook Trout', season: 'October–November' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive', timing: 'April–May, September' },
      { name: 'Hendrickson', timing: 'April–May' },
      { name: 'Yellow Sally Stonefly', timing: 'May–June' },
      { name: 'Light Cahill', timing: 'June' },
      { name: 'Terrestrials', timing: 'June–September' },
    ],
    runs: [],
    guides: [],
  },

  west_branch_ausable_ny: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true, notes: 'Wild browns over 20 inches in the Two-Mile C&R section' },
      { name: 'Rainbow Trout', type: 'resident', primary: true, notes: 'Wild and stocked' },
      { name: 'Brook Trout', type: 'resident', primary: false, notes: 'Headwater tributaries' },
    ],
    designations: ['Adirondack Park', 'NY Trophy Trout Water', 'Catch-and-Release (Two-Mile and Flume sections)'],
    optimalFishingCfs: '150–800',
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
      { species: 'Rainbow Trout', season: 'March–May' },
    ],
    hatches: [
      { name: 'Blue Quill', timing: 'April–May' },
      { name: 'Hendrickson', timing: 'May' },
      { name: 'March Brown', timing: 'May–June' },
      { name: 'Sulfur', timing: 'May–June' },
      { name: 'Light Cahill', timing: 'June' },
      { name: 'Isonychia (Slate Drake)', timing: 'June, September' },
      { name: 'Trico', timing: 'July–August' },
      { name: 'Terrestrials', timing: 'July–September' },
    ],
    runs: [],
    guides: [],
  },

  willowemoc_ny: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true, notes: 'Wild browns throughout the lower river' },
      { name: 'Rainbow Trout', type: 'resident', primary: false },
      { name: 'Brook Trout', type: 'resident', primary: false, notes: 'Headwaters' },
    ],
    designations: ['Catskill Fly Fishing Heritage', 'NY State Scenic River', 'Catskill Park'],
    optimalFishingCfs: '80–400',
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
    ],
    hatches: [
      { name: 'Blue Quill', timing: 'April' },
      { name: 'Quill Gordon', timing: 'April' },
      { name: 'Hendrickson', timing: 'Late April – Mid May', notes: 'The Catskill Hendrickson — one of the most famous hatches in American fly fishing' },
      { name: 'March Brown', timing: 'May' },
      { name: 'Sulfur', timing: 'May–June' },
      { name: 'Green Drake', timing: 'Late May – Mid June' },
      { name: 'Light Cahill', timing: 'June' },
      { name: 'Isonychia', timing: 'June, September' },
      { name: 'Trico', timing: 'July–August' },
      { name: 'Terrestrials', timing: 'July–September' },
    ],
    runs: [],
    guides: [],
  },

  // ── Alaska batch (15 rivers) — added 2026-04-10 ──

  kenai_ak: {
    species: [
      { name: 'King Salmon (Chinook)', type: 'anadromous', primary: true, notes: 'World-record fishery — all-tackle record 97 lb 4 oz (1985)' },
      { name: 'Sockeye Salmon (Red)', type: 'anadromous', primary: true, notes: 'Massive runs at the Russian River confluence' },
      { name: 'Silver Salmon (Coho)', type: 'anadromous', primary: true, notes: 'Strong fall run' },
      { name: 'Pink Salmon (Humpy)', type: 'anadromous', primary: false, notes: 'Even-year runs' },
      { name: 'Chum Salmon', type: 'anadromous', primary: false },
      { name: 'Rainbow Trout', type: 'resident', primary: true, notes: 'Trophy wild rainbows in upper Kenai — fly fishing only' },
      { name: 'Dolly Varden Char', type: 'resident', primary: false },
    ],
    designations: ['Kenai National Wildlife Refuge', 'ADF&G Trophy King Salmon Fishery', 'Kenai River Special Management Area'],
    optimalFishingCfs: '4000–10000',
    spawning: [
      { species: 'King Salmon', season: 'July–August', notes: 'Late run kings spawn in lower river gravel' },
      { species: 'Sockeye Salmon', season: 'July–August' },
      { species: 'Silver Salmon', season: 'September–October' },
      { species: 'Rainbow Trout', season: 'May–June' },
    ],
    hatches: [],
    runs: [
      { species: 'King Salmon (Early Run)', timing: 'Mid-May – June', peak: 'Early June', notes: 'Brightest, most chrome fish of the year' },
      { species: 'King Salmon (Late Run)', timing: 'July', peak: 'Mid-July', notes: 'Trophy fish — historically over 75 lbs' },
      { species: 'Sockeye (Early Run)', timing: 'June', peak: 'Late June', notes: 'Russian River confluence combat fishery' },
      { species: 'Sockeye (Late Run)', timing: 'July–August', peak: 'Late July', notes: 'The huge run — millions of returning fish' },
      { species: 'Silver Salmon', timing: 'August–October', peak: 'September' },
    ],
    guides: [],
  },

  kasilof_ak: {
    species: [
      { name: 'King Salmon (Chinook)', type: 'anadromous', primary: true, notes: 'Fly-fishing only — early run kings are bright and chrome' },
      { name: 'Sockeye Salmon (Red)', type: 'anadromous', primary: true, notes: 'Strong run, dipnet fishery at the river mouth' },
      { name: 'Silver Salmon (Coho)', type: 'anadromous', primary: false },
      { name: 'Dolly Varden Char', type: 'resident', primary: false },
    ],
    designations: ['ADF&G Sport Fishery', 'Kenai Peninsula', 'Fly-Fishing-Only for King Salmon'],
    optimalFishingCfs: '800–2500',
    spawning: [
      { species: 'King Salmon', season: 'July–August' },
      { species: 'Sockeye Salmon', season: 'July–August' },
    ],
    hatches: [],
    runs: [
      { species: 'King Salmon', timing: 'Mid-May – July', peak: 'June', notes: 'Early-run kings, fly-fishing only' },
      { species: 'Sockeye Salmon', timing: 'Mid-June – August', peak: 'July' },
    ],
    guides: [],
  },

  russian_ak: {
    species: [
      { name: 'Sockeye Salmon (Red)', type: 'anadromous', primary: true, notes: 'Most concentrated sockeye fishery in the world' },
      { name: 'Rainbow Trout', type: 'resident', primary: true, notes: 'Wild rainbows feed on sockeye eggs and flesh' },
      { name: 'Dolly Varden Char', type: 'resident', primary: true },
    ],
    designations: ['Chugach National Forest', 'Russian River Falls', 'Fly-Fishing Only (lower 1.5 mi)'],
    optimalFishingCfs: '150–500',
    spawning: [
      { species: 'Sockeye Salmon', season: 'July–August' },
    ],
    hatches: [],
    runs: [
      { species: 'Sockeye (Early Run)', timing: 'Mid-June – early July', peak: 'Late June', notes: 'First peak of the combat sockeye fishery' },
      { species: 'Sockeye (Late Run)', timing: 'Mid-July – August', peak: 'Late July', notes: 'Larger second peak — millions of fish' },
    ],
    guides: [],
  },

  naknek_ak: {
    species: [
      { name: 'Rainbow Trout', type: 'resident', primary: true, notes: 'World-class trophy wild rainbows — 30+ inches and 15+ lbs are routine' },
      { name: 'King Salmon (Chinook)', type: 'anadromous', primary: true },
      { name: 'Sockeye Salmon (Red)', type: 'anadromous', primary: true, notes: 'Bristol Bay\u2019s legendary sockeye runs' },
      { name: 'Silver Salmon (Coho)', type: 'anadromous', primary: true },
      { name: 'Pink Salmon', type: 'anadromous', primary: false },
      { name: 'Chum Salmon', type: 'anadromous', primary: false },
      { name: 'Arctic Char', type: 'resident', primary: false },
      { name: 'Arctic Grayling', type: 'resident', primary: false },
    ],
    designations: ['Katmai National Park and Preserve', 'Bristol Bay Watershed', 'ADF&G Trophy Rainbow Trout'],
    optimalFishingCfs: '2000–5500',
    spawning: [
      { species: 'King Salmon', season: 'July–August' },
      { species: 'Sockeye Salmon', season: 'July–August' },
      { species: 'Silver Salmon', season: 'September–October' },
      { species: 'Rainbow Trout', season: 'May–June' },
    ],
    hatches: [],
    runs: [
      { species: 'King Salmon', timing: 'June–July', peak: 'Late June' },
      { species: 'Sockeye Salmon', timing: 'Late June – August', peak: 'July' },
      { species: 'Silver Salmon', timing: 'August–October', peak: 'September' },
    ],
    guides: [],
  },

  brooks_ak: {
    species: [
      { name: 'Rainbow Trout', type: 'resident', primary: true, notes: 'Wild trophy rainbows — 25+ inches' },
      { name: 'Sockeye Salmon (Red)', type: 'anadromous', primary: true, notes: 'Brooks Falls salmon-and-bear show' },
      { name: 'Arctic Char', type: 'resident', primary: true },
      { name: 'Arctic Grayling', type: 'resident', primary: true },
      { name: 'Lake Trout', type: 'resident', primary: false, notes: 'Brooks Lake' },
    ],
    designations: ['Katmai National Park and Preserve', 'Brooks Camp National Historic Landmark', 'Fly-Fishing Only'],
    optimalFishingCfs: '150–400',
    spawning: [
      { species: 'Sockeye Salmon', season: 'July–August' },
      { species: 'Rainbow Trout', season: 'May–June' },
    ],
    hatches: [],
    runs: [
      { species: 'Sockeye Salmon', timing: 'Late June – July', peak: 'Early–Mid July', notes: 'Peak run brings the bears to Brooks Falls' },
    ],
    guides: [],
  },

  alagnak_ak: {
    species: [
      { name: 'Rainbow Trout', type: 'resident', primary: true, notes: 'Trophy wild rainbows feeding on salmon eggs and carcasses' },
      { name: 'King Salmon (Chinook)', type: 'anadromous', primary: true },
      { name: 'Sockeye Salmon (Red)', type: 'anadromous', primary: true },
      { name: 'Silver Salmon (Coho)', type: 'anadromous', primary: true },
      { name: 'Pink Salmon', type: 'anadromous', primary: false },
      { name: 'Chum Salmon', type: 'anadromous', primary: false },
      { name: 'Arctic Char', type: 'resident', primary: false },
      { name: 'Arctic Grayling', type: 'resident', primary: false },
    ],
    designations: ['National Wild & Scenic River (1980)', 'Katmai National Park and Preserve', 'Bristol Bay Watershed'],
    optimalFishingCfs: '1200–3500',
    spawning: [
      { species: 'King Salmon', season: 'July' },
      { species: 'Sockeye Salmon', season: 'July–August' },
      { species: 'Silver Salmon', season: 'September' },
      { species: 'Rainbow Trout', season: 'May–June' },
    ],
    hatches: [],
    runs: [
      { species: 'King Salmon', timing: 'June–July', peak: 'Late June' },
      { species: 'Sockeye Salmon', timing: 'Late June – July', peak: 'Early July' },
      { species: 'Silver Salmon', timing: 'August–September', peak: 'Mid-August' },
    ],
    guides: [],
  },

  kvichak_ak: {
    species: [
      { name: 'Rainbow Trout', type: 'resident', primary: true, notes: 'Iliamna-system trophy rainbows — 30+ inches feeding on the world\u2019s largest sockeye run' },
      { name: 'Sockeye Salmon (Red)', type: 'anadromous', primary: true, notes: 'Largest sockeye run on earth — 10+ million fish per year' },
      { name: 'King Salmon (Chinook)', type: 'anadromous', primary: true },
      { name: 'Silver Salmon (Coho)', type: 'anadromous', primary: false },
      { name: 'Arctic Char', type: 'resident', primary: false },
      { name: 'Arctic Grayling', type: 'resident', primary: false },
    ],
    designations: ['Bristol Bay Watershed', 'Largest Sockeye Run on Earth', 'ADF&G Trophy Rainbow Trout'],
    optimalFishingCfs: '8000–18000',
    spawning: [
      { species: 'Sockeye Salmon', season: 'July–August' },
      { species: 'Rainbow Trout', season: 'May–June' },
    ],
    hatches: [],
    runs: [
      { species: 'Sockeye Salmon', timing: 'Late June – August', peak: 'Mid-July', notes: 'Up to 40+ million returning fish in peak years' },
      { species: 'King Salmon', timing: 'June–July', peak: 'Late June' },
    ],
    guides: [],
  },

  nushagak_ak: {
    species: [
      { name: 'King Salmon (Chinook)', type: 'anadromous', primary: true, notes: 'Largest king salmon producer in Bristol Bay — historically 100,000+ kings/year' },
      { name: 'Sockeye Salmon (Red)', type: 'anadromous', primary: true },
      { name: 'Silver Salmon (Coho)', type: 'anadromous', primary: true },
      { name: 'Pink Salmon', type: 'anadromous', primary: false },
      { name: 'Chum Salmon', type: 'anadromous', primary: false },
      { name: 'Rainbow Trout', type: 'resident', primary: true, notes: 'Trophy rainbows in the upper river' },
      { name: 'Arctic Char', type: 'resident', primary: false },
      { name: 'Arctic Grayling', type: 'resident', primary: false },
    ],
    designations: ['Bristol Bay Watershed', 'ADF&G King Salmon Fishery', 'Wood-Tikchik State Park (headwaters)'],
    optimalFishingCfs: '4000–12000',
    spawning: [
      { species: 'King Salmon', season: 'July–August' },
      { species: 'Sockeye Salmon', season: 'July–August' },
      { species: 'Silver Salmon', season: 'September' },
    ],
    hatches: [],
    runs: [
      { species: 'King Salmon', timing: 'June–July', peak: 'Late June – Early July', notes: 'Peak run — combat king fishery at Portage Creek' },
      { species: 'Sockeye Salmon', timing: 'Late June – August', peak: 'Mid-July' },
      { species: 'Silver Salmon', timing: 'August–September', peak: 'Mid-August' },
    ],
    guides: [],
  },

  talkeetna_ak: {
    species: [
      { name: 'King Salmon (Chinook)', type: 'anadromous', primary: true, notes: 'Late-June run from the Susitna' },
      { name: 'Silver Salmon (Coho)', type: 'anadromous', primary: true, notes: 'August fall run' },
      { name: 'Sockeye Salmon (Red)', type: 'anadromous', primary: false },
      { name: 'Pink Salmon', type: 'anadromous', primary: false },
      { name: 'Arctic Grayling', type: 'resident', primary: true, notes: 'Multi-day float trips target trophy grayling' },
      { name: 'Dolly Varden Char', type: 'resident', primary: false },
    ],
    designations: ['BLM Talkeetna River Special Recreation Management Area'],
    optimalFishingCfs: '1200–3500',
    spawning: [
      { species: 'King Salmon', season: 'July' },
      { species: 'Silver Salmon', season: 'September' },
    ],
    hatches: [],
    runs: [
      { species: 'King Salmon', timing: 'Late June – Mid July', peak: 'Early July' },
      { species: 'Silver Salmon', timing: 'August–September', peak: 'Mid-August' },
    ],
    guides: [],
  },

  susitna_ak: {
    species: [
      { name: 'King Salmon (Chinook)', type: 'anadromous', primary: true, notes: 'Largest king run in southcentral Alaska' },
      { name: 'Silver Salmon (Coho)', type: 'anadromous', primary: true },
      { name: 'Sockeye Salmon (Red)', type: 'anadromous', primary: false },
      { name: 'Pink Salmon', type: 'anadromous', primary: false },
      { name: 'Chum Salmon', type: 'anadromous', primary: false },
      { name: 'Arctic Grayling', type: 'resident', primary: false },
      { name: 'Dolly Varden Char', type: 'resident', primary: false },
    ],
    designations: ['Matanuska-Susitna Borough', 'ADF&G Sport Fishery'],
    optimalFishingCfs: '8000–20000',
    spawning: [
      { species: 'King Salmon', season: 'July–August' },
      { species: 'Silver Salmon', season: 'September' },
    ],
    hatches: [],
    runs: [
      { species: 'King Salmon', timing: 'Late May – July', peak: 'Late June' },
      { species: 'Silver Salmon', timing: 'August–September', peak: 'Late August' },
      { species: 'Pink Salmon', timing: 'July–August', notes: 'Even-year runs' },
    ],
    guides: [],
  },

  copper_ak: {
    species: [
      { name: 'Sockeye Salmon (Red)', type: 'anadromous', primary: true, notes: 'Famous \u201cCopper River reds\u201d — premium-priced commercial fishery' },
      { name: 'King Salmon (Chinook)', type: 'anadromous', primary: true, notes: 'Premium \u201cCopper River kings\u201d' },
      { name: 'Silver Salmon (Coho)', type: 'anadromous', primary: false },
      { name: 'Dolly Varden Char', type: 'resident', primary: false },
    ],
    designations: ['Wrangell-St. Elias National Park (headwaters)', 'Chugach National Forest', 'ADF&G Personal Use Dipnet Fishery'],
    optimalFishingCfs: '12000–30000',
    spawning: [
      { species: 'King Salmon', season: 'July–August' },
      { species: 'Sockeye Salmon', season: 'July–August' },
    ],
    hatches: [],
    runs: [
      { species: 'King Salmon', timing: 'Mid-May – July', peak: 'Mid-June', notes: 'Earliest king run in Alaska' },
      { species: 'Sockeye Salmon', timing: 'Mid-May – August', peak: 'June–July' },
    ],
    guides: [],
  },

  anchor_ak: {
    species: [
      { name: 'Steelhead', type: 'anadromous', primary: true, notes: 'Southernmost wild steelhead run in Alaska — state record 42 lb 3 oz (1970)' },
      { name: 'King Salmon (Chinook)', type: 'anadromous', primary: true },
      { name: 'Silver Salmon (Coho)', type: 'anadromous', primary: true, notes: 'Strong August run' },
      { name: 'Pink Salmon', type: 'anadromous', primary: false },
      { name: 'Dolly Varden Char', type: 'resident', primary: true, notes: 'Year-round bank fishery' },
    ],
    designations: ['ADF&G Wild Steelhead Stream', 'Kenai Peninsula'],
    optimalFishingCfs: '80–300',
    spawning: [
      { species: 'Steelhead', season: 'April–May' },
      { species: 'King Salmon', season: 'July' },
    ],
    hatches: [],
    runs: [
      { species: 'Steelhead (Fall)', timing: 'September–October', peak: 'Late September', notes: 'Wild steelhead — catch-and-release encouraged' },
      { species: 'Steelhead (Spring)', timing: 'April–May' },
      { species: 'King Salmon', timing: 'June–July', peak: 'Late June' },
      { species: 'Silver Salmon', timing: 'August–September' },
    ],
    guides: [],
  },

  goodnews_ak: {
    species: [
      { name: 'Rainbow Trout', type: 'resident', primary: true, notes: 'Trophy wild rainbows in the upper river' },
      { name: 'Arctic Char', type: 'resident', primary: true, notes: 'Famous arctic char fishery in Goodnews Lake' },
      { name: 'Dolly Varden Char', type: 'resident', primary: true },
      { name: 'King Salmon (Chinook)', type: 'anadromous', primary: true },
      { name: 'Sockeye Salmon (Red)', type: 'anadromous', primary: true },
      { name: 'Silver Salmon (Coho)', type: 'anadromous', primary: true },
      { name: 'Chum Salmon', type: 'anadromous', primary: false },
      { name: 'Pink Salmon', type: 'anadromous', primary: false },
      { name: 'Arctic Grayling', type: 'resident', primary: false },
    ],
    designations: ['Togiak National Wildlife Refuge', 'Western Alaska'],
    optimalFishingCfs: '800–2200',
    spawning: [
      { species: 'King Salmon', season: 'July' },
      { species: 'Sockeye Salmon', season: 'July–August' },
      { species: 'Silver Salmon', season: 'September' },
    ],
    hatches: [],
    runs: [
      { species: 'King Salmon', timing: 'Late June – July', peak: 'Early July' },
      { species: 'Sockeye Salmon', timing: 'Late June – August', peak: 'Mid-July' },
      { species: 'Silver Salmon', timing: 'August–September', peak: 'Late August' },
    ],
    guides: [],
  },

  karluk_ak: {
    species: [
      { name: 'Steelhead', type: 'anadromous', primary: true, notes: 'Premier Kodiak Island wild steelhead run' },
      { name: 'Silver Salmon (Coho)', type: 'anadromous', primary: true, notes: 'Trophy Kodiak silvers — fish over 20 lbs are common' },
      { name: 'Sockeye Salmon (Red)', type: 'anadromous', primary: true },
      { name: 'King Salmon (Chinook)', type: 'anadromous', primary: false },
      { name: 'Dolly Varden Char', type: 'resident', primary: true },
      { name: 'Pink Salmon', type: 'anadromous', primary: false },
    ],
    designations: ['Kodiak National Wildlife Refuge', 'ADF&G Wild Steelhead Stream'],
    optimalFishingCfs: '500–1500',
    spawning: [
      { species: 'Steelhead', season: 'April–May' },
      { species: 'Sockeye Salmon', season: 'July–August' },
      { species: 'Silver Salmon', season: 'September–October' },
    ],
    hatches: [],
    runs: [
      { species: 'Steelhead', timing: 'September–November, April–May', peak: 'October', notes: 'Fall and spring runs' },
      { species: 'Sockeye Salmon', timing: 'June–August', peak: 'July' },
      { species: 'Silver Salmon', timing: 'August–October', peak: 'September', notes: 'Trophy Kodiak silvers, often 18–22 lbs' },
    ],
    guides: [],
  },

  situk_ak: {
    species: [
      { name: 'Steelhead', type: 'anadromous', primary: true, notes: 'Largest wild steelhead run in southeast Alaska — historically 9,000+ returning fish/year' },
      { name: 'Silver Salmon (Coho)', type: 'anadromous', primary: true, notes: 'Strong fall run' },
      { name: 'Sockeye Salmon (Red)', type: 'anadromous', primary: true },
      { name: 'King Salmon (Chinook)', type: 'anadromous', primary: false },
      { name: 'Pink Salmon', type: 'anadromous', primary: false },
      { name: 'Chum Salmon', type: 'anadromous', primary: false },
      { name: 'Cutthroat Trout', type: 'resident', primary: true, notes: 'Sea-run cutthroat — \u2018harvest trout\u2019' },
      { name: 'Dolly Varden Char', type: 'resident', primary: true },
    ],
    designations: ['Tongass National Forest', 'ADF&G Wild Steelhead Stream'],
    optimalFishingCfs: '400–1200',
    spawning: [
      { species: 'Steelhead', season: 'April–May' },
      { species: 'Sockeye Salmon', season: 'July–August' },
      { species: 'Silver Salmon', season: 'September–October' },
    ],
    hatches: [],
    runs: [
      { species: 'Steelhead (Spring)', timing: 'March–May', peak: 'Mid-April', notes: 'Largest wild steelhead run in southeast AK' },
      { species: 'Steelhead (Fall)', timing: 'October–November' },
      { species: 'Sockeye Salmon', timing: 'June–August', peak: 'July' },
      { species: 'Silver Salmon', timing: 'August–October', peak: 'September' },
    ],
    guides: [],
  },

  neversink_ny: {
    species: [
      { name: 'Brown Trout', type: 'resident', primary: true, notes: 'Wild browns — Theodore Gordon\u2019s home water' },
      { name: 'Brook Trout', type: 'resident', primary: false, notes: 'Headwaters' },
      { name: 'Rainbow Trout', type: 'resident', primary: false, notes: 'Stocked below Neversink Reservoir' },
    ],
    designations: ['Catskill Park', 'NYC Watershed', 'Catskill Fly Fishing Heritage'],
    optimalFishingCfs: '60–400',
    spawning: [
      { species: 'Brown Trout', season: 'October–December' },
    ],
    hatches: [
      { name: 'Quill Gordon', timing: 'April', notes: 'Theodore Gordon\u2019s namesake fly was developed for the Neversink hatch' },
      { name: 'Hendrickson', timing: 'Late April – Mid May' },
      { name: 'Blue-Winged Olive', timing: 'April–May, September–October' },
      { name: 'March Brown', timing: 'May' },
      { name: 'Sulfur', timing: 'May–June' },
      { name: 'Green Drake', timing: 'Late May – Mid June' },
      { name: 'Light Cahill', timing: 'June' },
      { name: 'Isonychia', timing: 'June, September' },
      { name: 'Terrestrials', timing: 'July–September' },
    ],
    runs: [],
    guides: [],
  },

}
