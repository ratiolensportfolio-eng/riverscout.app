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
  // Internal QA flags — items the community is asked to verify or improve.
  // Each string is a short machine-readable tag (e.g. "cfs-range-wide",
  // "class-v-portage-note"). Surfaces in the Improve This River workflow.
  needsVerification?: string[]
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
  // Stage / gauge height in feet (USGS parameter 00065). Not all gauges
  // report height, so this is nullable.
  gaugeHeightFt: number | null
  condition: FlowCondition
  // Trend classification driven by changePerHour, not 6h delta. 'flat'
  // means |rate| < 25 cfs/hr; 'up'/'down' otherwise. The user-facing
  // text label lives in rateLabel below; this field is for code that
  // needs to color or branch by direction.
  trend: TrendDirection | null
  // Rate of change in cfs/hour, computed from the closest reading to
  // ~1 hour ago (within ±20 min tolerance). Falls back to (3h delta / 3)
  // if no 1h reading is available.
  changePerHour: number | null
  // Total cfs delta over the last ~3 hours.
  changeIn3Hours: number | null
  // Human-friendly rate label, e.g. "Rising slowly (+45 cfs/hr)",
  // "Falling fast (-420 cfs/hr)", "Stable", or "Rate unknown".
  rateLabel: string
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

// Features exclusive to RiverScout Pro. Everything not on this list is
// available in the free tier. The site should work end-to-end without
// ever hitting one of these — Pro is for paddlers and anglers who want
// the site to come to them (push notifications, deeper analytics,
// offline access, personal history).
export const PRO_FEATURES: ProFeature[] = [
  { icon: '\u26A1', title: 'Flow alert emails', description: 'Get notified the moment your river hits optimal', available: true },
  { icon: '\u26A1', title: 'Stocking alert emails', description: 'Know the moment your river is stocked', available: true },
  { icon: '\u26A1', title: 'Hatch alert emails', description: "Water temp hit the hex hatch trigger? We'll tell you", available: true },
  { icon: '\u26A1', title: 'Offline river pages', description: 'Full data with no cell service', available: true },
  { icon: '\u26A1', title: 'Historical flow analysis', description: '10-year CFS patterns and seasonal charts', available: true },
  { icon: '\u26A1', title: 'AI forecast interpretation', description: 'Plain-language forecast with confidence intervals', available: true },
  { icon: '\u26A1', title: 'Custom CFS ranges', description: 'Set your personal optimal window per river', available: true },
  { icon: '\u26A1', title: 'River journal and trip statistics', description: 'Your paddling history in one place', available: true },
  { icon: '\u26A1', title: 'Float plan saved templates', description: 'Pre-filled for your regular rivers', available: false },
  { icon: '\u26A1', title: 'Early access to new features', description: 'New states and tools before anyone else', available: true },
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

// ── River Hazard Alerts ───────────────────────────────────────────
// Time-sensitive safety warnings. Distinct from trip_reports (which are
// retrospective). A hazard auto-expires after 72 hours unless a logged-in
// user confirms it's still present.

export type HazardType =
  | 'strainer'
  | 'hydraulic'
  | 'access_closure'
  | 'debris'
  | 'flood'
  | 'other'

export type HazardSeverity = 'info' | 'warning' | 'critical'

export const HAZARD_TYPE_LABELS: Record<HazardType, string> = {
  strainer:       'Strainer / woody debris',
  hydraulic:      'Hydraulic / low-head dam',
  access_closure: 'Access closure',
  debris:         'Debris / obstruction',
  flood:          'Dangerous high water',
  other:          'Other',
}

export const HAZARD_SEVERITY_LABELS: Record<HazardSeverity, string> = {
  info:     'Info',
  warning:  'Warning',
  critical: 'Critical — life-threatening',
}

// ── River Permits ─────────────────────────────────────────────────
// Permit requirements for overnight / multi-day private trips. The
// display layer treats absence of a row as "no permit required".

export type PermitType =
  | 'lottery_weighted'
  | 'lottery_standard'
  | 'first_come_first_served'
  | 'reservation'
  | 'self_issue'
  | 'no_permit_required'

export type PermitRequiredFor =
  | 'overnight'
  | 'day_use'
  | 'all_launches'
  | 'commercial_only'

export const PERMIT_TYPE_LABELS: Record<PermitType, string> = {
  lottery_weighted:        'Weighted lottery',
  lottery_standard:        'Lottery',
  first_come_first_served: 'First come, first served',
  reservation:             'Reservation',
  self_issue:              'Self-issue permit',
  no_permit_required:      'No permit required',
}

export const PERMIT_REQUIRED_FOR_LABELS: Record<PermitRequiredFor, string> = {
  overnight:      'Overnight trips',
  day_use:        'Day use',
  all_launches:   'All launches',
  commercial_only:'Commercial trips only',
}

// Matches public.river_permits row shape
export interface RiverPermit {
  id: string
  river_id: string
  river_name: string
  state_key: string
  permit_name: string
  managing_agency: string
  permit_type: PermitType
  required_for: PermitRequiredFor
  application_opens: string | null
  application_closes: string | null
  results_date: string | null
  permit_season_start: string | null
  permit_season_end: string | null
  group_size_min: number | null
  group_size_max: number | null
  cost_per_person: number | null
  cost_per_group: number | null
  apply_url: string | null
  info_url: string | null
  phone: string | null
  notes: string | null
  commercial_available: boolean
  commercial_notes: string | null
  verified: boolean
  last_verified_year: number | null
  created_at: string
  updated_at: string
}

// Matches public.river_hazards row shape
export interface RiverHazard {
  id: string
  river_id: string
  river_name: string
  state_key: string | null
  hazard_type: HazardType
  severity: HazardSeverity
  title: string
  description: string
  location_description: string | null
  mile_marker: number | null
  reported_by: string | null
  reporter_name: string | null
  reporter_email: string | null
  created_at: string
  expires_at: string
  active: boolean
  confirmations: number
  last_confirmed_at: string | null
  resolved_at: string | null
  resolved_by: string | null
  resolved_note: string | null
  email_sent_at: string | null
  email_recipients_count: number | null
  admin_hidden: boolean
  admin_notes: string | null
}
