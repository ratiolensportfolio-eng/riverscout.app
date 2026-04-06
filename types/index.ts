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

export type OutfitterTier = 'free' | 'featured' | 'sponsored'

export interface OutfitterListing {
  id: string
  name: string
  description: string
  website: string
  riverIds: string[]
  tier: OutfitterTier
  logoUrl: string | null
  createdAt: string
}
