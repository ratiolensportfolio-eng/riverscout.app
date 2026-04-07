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
}
