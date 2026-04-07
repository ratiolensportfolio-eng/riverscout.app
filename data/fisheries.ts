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
      { name: 'Hex (Hexagenia limbata)', timing: 'Late June – Early July', notes: 'The legendary night hatch — largest mayfly in North America. Brings out trophy browns after dark.' },
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
      { name: 'Hex (Hexagenia limbata)', timing: 'Late June – Early July' },
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
      { name: 'Steelhead', type: 'anadromous', primary: true, notes: 'World-class runs below Tippy Dam' },
      { name: 'Chinook Salmon', type: 'anadromous', primary: true, notes: 'Fall run below Tippy Dam' },
      { name: 'Brook Trout', type: 'resident', primary: false, notes: 'Upper river sections' },
    ],
    designations: ['Michigan Blue-Ribbon Trout Stream', 'National Scenic River'],
    spawning: [
      { species: 'Brown Trout', season: 'October–November' },
      { species: 'Steelhead', season: 'March–April' },
    ],
    hatches: [
      { name: 'Hendrickson', timing: 'Late April – Mid May' },
      { name: 'Caddis', timing: 'May–June' },
      { name: 'Brown Drake', timing: 'Late May – Mid June' },
      { name: 'Hex', timing: 'Late June – Early July' },
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
      { name: 'Hex (Hexagenia limbata)', timing: 'Late June – Early July', notes: 'Major night hatch on the PM' },
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
    spawning: [
      { species: 'Brown Trout', season: 'October–November' },
      { species: 'Steelhead', season: 'March–April' },
      { species: 'Walleye', season: 'March–April' },
    ],
    hatches: [
      { name: 'Blue-Winged Olive (BWO)', timing: 'April–May, September–October' },
      { name: 'Caddis', timing: 'May–June' },
      { name: 'Hex (Hexagenia limbata)', timing: 'Late June – Early July' },
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
      { name: 'Hex (Hexagenia limbata)', timing: 'Late June – Early July' },
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
      { name: 'Hex (Hexagenia limbata)', timing: 'Late June – Early July' },
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
    spawning: [
      { species: 'Steelhead', season: 'March–April' },
      { species: 'Chinook Salmon', season: 'September–October' },
    ],
    hatches: [
      { name: 'Caddis', timing: 'May–June' },
      { name: 'Hex (Hexagenia limbata)', timing: 'Late June – Early July' },
    ],
    runs: [
      { species: 'Chinook Salmon', timing: 'September – October', peak: 'Late September' },
      { species: 'Coho Salmon', timing: 'September – November', peak: 'October' },
      { species: 'Steelhead', timing: 'October – April', peak: 'November and March' },
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
      { name: 'Hex (Hexagenia limbata)', timing: 'Late June – Early July' },
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
    guides: ["Pine Creek Outfitters", "Wolfe"s Sporting Goods"],
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
    guides: ["Shenandoah River Outfitters", "Murray"s Fly Shop"],
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
    guides: ["Nolichucky Gorge Campground", "Wahoo"s Adventures"],
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
}
