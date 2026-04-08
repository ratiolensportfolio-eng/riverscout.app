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

// Matches public.outfitters table in Supabase
export interface OutfitterListing {
  id: string
  user_id: string
  business_name: string
  description: string | null
  website: string | null
  phone: string | null
  logo_url: string | null
  cover_photo_url: string | null
  tier: OutfitterTier
  river_ids: string[]
  state_keys: string[]
  specialty_tags: string[]
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  stripe_price_id: string | null
  active: boolean
  founding_member: boolean
  clicks: number
  created_at: string
  updated_at: string
}

// Matches public.outfitter_clicks table in Supabase
export type ClickSource = 'overview' | 'outfitters_tab' | 'flow_alert' | 'search' | 'guide_tab'

export interface OutfitterClick {
  id: string
  outfitter_id: string
  river_id: string | null
  source: ClickSource | null
  clicked_at: string
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

// ── RiverScout Pro ───────────────────────────────────────────────

export interface ProFeature {
  icon: string
  title: string
  description: string
  available: boolean  // true = shipped, false = coming soon
}

export const PRO_PRICE = {
  monthly: 4.99,
  yearly: 39.99,    // ~$3.33/mo
}

export const PRO_FEATURES: ProFeature[] = [
  { icon: '\u26A1', title: 'Flow alerts', description: 'Email when your river hits optimal CFS', available: true },
  { icon: '\uD83D\uDC1F', title: 'Stocking alerts', description: 'Email when your river is stocked', available: true },
  { icon: '\uD83C\uDF0A', title: '72-hour flow forecast', description: 'See where CFS is heading before you drive', available: true },
  { icon: '\uD83D\uDCF1', title: 'Offline river pages', description: 'Works without cell service', available: false },
  { icon: '\uD83D\uDCC8', title: 'Historical flow analysis', description: '10-year CFS patterns by week', available: true },
  { icon: '\uD83C\uDFAF', title: 'Custom optimal CFS ranges', description: 'Set your own ideal ranges per river', available: true },
  { icon: '\uD83D\uDE80', title: 'Early access', description: 'New states and features before anyone else', available: true },
  { icon: '\uD83C\uDF3F', title: 'Support conservation data', description: 'Fund independent river data for everyone', available: true },
]

export const OUTFITTER_TIERS: OutfitterTierConfig[] = [
  {
    tier: 'listed',
    name: 'Listed',
    monthlyPrice: 0,
    yearlyPrice: 0,
    maxRivers: 1,
    features: [
      'Directory listing on selected rivers',
      'Business name, location, and website link',
      'Shows in Outfitters tab on river pages',
      'No photos, no priority placement',
    ],
  },
  {
    tier: 'featured',
    name: 'Featured',
    monthlyPrice: 49,
    yearlyPrice: 399,
    maxRivers: 3,
    features: [
      'Top placement in Outfitters tab',
      'Logo and cover photo upload',
      '3–5 sentence description',
      'Direct booking link and phone number',
      'Click analytics dashboard',
      'Up to 3 rivers included',
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
      'Placement in river Overview tab — first tab, above the fold',
      'Included in flow alert emails when rivers hit optimal CFS',
      'Up to 6 rivers included',
      'Priority placement above Featured listings',
      'Quarterly traffic report emailed to you',
    ],
  },
  {
    tier: 'guide',
    name: 'Guide Profile',
    monthlyPrice: 29,
    yearlyPrice: 249,
    maxRivers: 3,
    features: [
      'Personal guide profile page',
      'Specialty tags — fly fishing, kayak instruction, family floats',
      'Direct contact form on your profile',
      'Listed in Local Guides section on river pages',
      'Separate from outfitter business listings',
    ],
  },
  {
    tier: 'destination',
    name: 'Destination Sponsor',
    monthlyPrice: 499,
    yearlyPrice: null, // contact sales
    maxRivers: null,   // covers entire state/region
    features: [
      'Sponsored placement on every river page in your state',
      'Featured in state landing page hero section',
      'Logo placement in newsletter for that state',
      'Co-branded in flow alert emails for all rivers in state',
      'Contact sales — not self-serve checkout',
    ],
  },
]
