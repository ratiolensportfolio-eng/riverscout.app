// ── River Data Types ─────────────────────────────────────────────

export type HistEraType = 'native' | 'logging' | 'survey' | 'modern'

export interface HistEntry {
  yr: string
  title: string
  text: string
  src: string
}

export interface HistEra {
  era: HistEraType
  entries: HistEntry[]
}

export interface RiverDoc {
  t: string   // title
  s: string   // source
  y: number   // year
  tp: string  // type
  pg: number  // pages
  url?: string // link to document (optional)
}

export interface Review {
  u: string   // username
  d: string   // date
  s: number   // stars (1–5)
  t: string   // text
}

export interface Outfitter {
  n: string   // name
  d: string   // description
  l: string   // website/link
}

export interface River {
  id: string
  n: string          // name
  co: string         // county/location
  len: string        // length (e.g. "140 mi")
  cls: string        // difficulty class (e.g. "I–II")
  opt: string        // optimal CFS range (e.g. "200–800")
  g: string          // USGS gauge site ID
  avg: number        // average flow CFS
  histFlow: number   // historical median CFS (renamed from 'hist' to avoid collision)
  mx: number         // map x coordinate
  my: number         // map y coordinate
  abbr: string       // state abbreviation
  desc: string
  desig: string      // designations
  secs: string[]     // sections
  history: HistEra[] // historical eras content
  docs: RiverDoc[]
  revs: Review[]
  outs: Outfitter[]
  // Boolean filter flags (vary by state)
  [key: string]: unknown
}

export interface StateFilters {
  [key: string]: string
}

export interface State {
  name: string
  abbr: string
  label: string
  filters: string[]
  fL: StateFilters
  rivers: River[]
}

export interface StatesDB {
  [stateKey: string]: State
}

// ── USGS Types ───────────────────────────────────────────────────

export type FlowCondition = 'optimal' | 'low' | 'high' | 'flood' | 'loading'
export type TrendDirection = 'up' | 'down' | 'flat'

export interface FlowData {
  cfs: number | null
  condition: FlowCondition
  trend: TrendDirection | null
  trendDelta: number | null
  trendDeltaPct: number | null
  percentile: number | null
  tempC: number | null
  readings: Array<{ t: string; v: number }>
  fetchedAt: Date
}

// ── Fisheries Types ──────────────────────────────────────────────

export interface FishSpecies {
  name: string
  type: 'resident' | 'anadromous' | 'warmwater'  // resident trout vs salmon/steelhead runs vs bass/etc
  primary: boolean  // is this a primary target species
  notes?: string
}

export interface SpawnTiming {
  species: string
  season: string      // e.g. "October–December"
  notes?: string
}

export interface HatchEvent {
  name: string        // e.g. "Hendrickson Mayfly"
  timing: string      // e.g. "Late April – Mid May"
  notes?: string
}

export interface RunTiming {
  species: string     // e.g. "Chinook Salmon"
  timing: string      // e.g. "September – November"
  peak?: string       // e.g. "Mid October"
  notes?: string
}

export interface RiverFisheries {
  species: FishSpecies[]
  designations: string[]        // e.g. ["Blue-Ribbon Trout Stream", "Catch & Release — flies only"]
  optimalFishingCfs?: string    // only if verified
  spawning: SpawnTiming[]
  hatches: HatchEvent[]
  runs: RunTiming[]             // salmon/steelhead run timing
  guides: string[]              // guide service names (links hidden for now like outfitters)
}

// ── Auth / User Types ─────────────────────────────────────────────

export interface UserProfile {
  id: string
  email: string
  displayName: string
  homeState: string | null
  avatarUrl: string | null
  createdAt: string
}

// ── Trip Report Types ─────────────────────────────────────────────

export interface TripReport {
  id: string
  riverId: string
  userId: string
  userDisplayName: string
  rating: number
  text: string
  flowCfs: number | null
  date: string
  photos: string[]
  createdAt: string
}

// ── Outfitter Types ───────────────────────────────────────────────

export type OutfitterTier = 'listed' | 'featured' | 'sponsored' | 'guide' | 'destination'

export interface OutfitterListing {
  id: string
  name: string
  description: string
  website: string
  phone?: string
  email?: string
  riverIds: string[]
  stateKeys?: string[]       // for destination sponsors
  tier: OutfitterTier
  logoUrl: string | null
  photoUrls?: string[]
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  active: boolean
  createdAt: string
  expiresAt?: string
}

export interface OutfitterTierConfig {
  tier: OutfitterTier
  name: string
  monthlyPrice: number       // 0 for free
  yearlyPrice: number | null // null = contact sales
  maxRivers: number | null   // null = unlimited (destination)
  stripePriceIdMonthly?: string
  stripePriceIdYearly?: string
  features: string[]
}

export const OUTFITTER_TIERS: OutfitterTierConfig[] = [
  {
    tier: 'listed',
    name: 'Listed',
    monthlyPrice: 0,
    yearlyPrice: 0,
    maxRivers: 1,
    features: [
      'Business name and description on river page',
      'Appear in outfitter directory',
      'Basic listing — no website link, no logo',
    ],
  },
  {
    tier: 'featured',
    name: 'Featured',
    monthlyPrice: 49,
    yearlyPrice: 399,
    maxRivers: 3,
    features: [
      'Everything in Listed',
      'Website link and phone number displayed',
      'Logo on river page',
      'Featured badge — higher placement',
      'Up to 3 rivers per subscription',
    ],
  },
  {
    tier: 'sponsored',
    name: 'Sponsored',
    monthlyPrice: 149,
    yearlyPrice: 999,
    maxRivers: 6,
    features: [
      'Everything in Featured',
      'Top-of-page placement with photo gallery',
      'Sponsored badge with accent border',
      'Up to 6 rivers per subscription',
      'Priority in search results',
      'Trip planning integration',
    ],
  },
  {
    tier: 'guide',
    name: 'Guide Profile',
    monthlyPrice: 29,
    yearlyPrice: 249,
    maxRivers: 3,
    features: [
      'Individual guide profile (not a business)',
      'Appear on Fishing tab as a listed guide',
      'Website link and contact info',
      'Guide badge',
      'Up to 3 rivers',
    ],
  },
  {
    tier: 'destination',
    name: 'Destination Sponsor',
    monthlyPrice: 499,
    yearlyPrice: null, // contact sales
    maxRivers: null,   // covers entire state/region
    features: [
      'Cover an entire state or region',
      'Brand placement on state page and all river pages',
      'Custom landing page on RiverScout',
      'Annual contract — contact sales',
    ],
  },
]
