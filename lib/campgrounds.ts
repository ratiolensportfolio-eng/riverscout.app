// RIDB (Recreation Information Database) adapter for federal
// campgrounds. Queries ridb.recreation.gov by lat/lng radius and
// caches results in the campgrounds table. The API is free but
// requires a key — register at ridb.recreation.gov.
//
// Used in two modes:
//   1. Bulk seed: scripts/fetch-campgrounds.js fetches all camping
//      facilities and inserts them into the campgrounds table.
//   2. River-page query: fetchCampgroundsNearRiver() returns cached
//      campgrounds within N miles of a river's coordinates.

import { RIVER_COORDS } from '@/data/river-coordinates'

const RIDB_BASE = 'https://ridb.recreation.gov/api/v1'

// State abbreviation → FIPS mapping for RIDB queries
const STATE_FIPS: Record<string, string> = {
  AL:'01',AK:'02',AZ:'04',AR:'05',CA:'06',CO:'08',CT:'09',DE:'10',
  FL:'12',GA:'13',HI:'15',ID:'16',IL:'17',IN:'18',IA:'19',KS:'20',
  KY:'21',LA:'22',ME:'23',MD:'24',MA:'25',MI:'26',MN:'27',MS:'28',
  MO:'29',MT:'30',NE:'31',NV:'32',NH:'33',NJ:'34',NM:'35',NY:'36',
  NC:'37',ND:'38',OH:'39',OK:'40',OR:'41',PA:'42',RI:'44',SC:'45',
  SD:'46',TN:'47',TX:'48',UT:'49',VT:'50',VA:'51',WA:'53',WV:'54',
  WI:'55',WY:'56',
}

export interface RidbFacility {
  FacilityID: string
  FacilityName: string
  FacilityDescription: string
  FacilityLatitude: number
  FacilityLongitude: number
  FacilityPhone: string
  FacilityEmail: string
  FacilityReservationURL: string
  FacilityUseFeeDescription: string
  Reservable: boolean
  ParentRecAreaName: string
  GEOJSON: { TYPE: string; COORDINATES: number[] }
}

export interface Campground {
  id: string
  name: string
  description: string | null
  lat: number
  lng: number
  agency: string | null
  parent_name: string | null
  reservable: boolean
  reservation_url: string | null
  fee_description: string | null
  distance_miles?: number
}

// Haversine distance in miles
function haversineMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

// Fetch camping facilities from RIDB by state. Paginates at 50
// (RIDB's default). Returns raw facility objects.
export async function fetchRidbFacilities(stateAbbr: string): Promise<RidbFacility[]> {
  const apiKey = process.env.RIDB_API_KEY
  if (!apiKey) throw new Error('RIDB_API_KEY not configured')

  const all: RidbFacility[] = []
  let offset = 0
  const limit = 50

  while (true) {
    const url = `${RIDB_BASE}/facilities?state=${stateAbbr}&activity=CAMPING&limit=${limit}&offset=${offset}&apikey=${apiKey}`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`RIDB API error: ${res.status}`)
    const data = await res.json()
    const facilities = data.RECDATA || []
    all.push(...facilities)
    if (facilities.length < limit) break
    offset += limit
    // RIDB rate limit: 50 req/min. 200ms delay keeps us safe.
    await new Promise(r => setTimeout(r, 200))
  }

  return all
}

// Convert a RIDB facility to our campground table shape
export function facilityToCampground(f: RidbFacility, stateKey: string): Campground {
  return {
    id: String(f.FacilityID),
    name: f.FacilityName?.trim() || 'Unnamed Campground',
    description: f.FacilityDescription?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 500) || null,
    lat: f.FacilityLatitude || f.GEOJSON?.COORDINATES?.[1] || 0,
    lng: f.FacilityLongitude || f.GEOJSON?.COORDINATES?.[0] || 0,
    agency: f.ParentRecAreaName ? null : null,
    parent_name: f.ParentRecAreaName || null,
    reservable: !!f.Reservable,
    reservation_url: f.FacilityReservationURL || null,
    fee_description: f.FacilityUseFeeDescription?.slice(0, 200) || null,
  }
}

// Query cached campgrounds near a river. Uses the Supabase table
// populated by the bulk fetch script. Returns sorted by distance.
export async function fetchCampgroundsNearRiver(
  riverId: string,
  supabase: { from: (table: string) => unknown },
  radiusMiles = 15,
): Promise<Campground[]> {
  const coord = RIVER_COORDS[riverId]
  if (!coord) return []
  const [lat, lng] = coord

  // Rough bounding box to narrow the SQL query before haversine
  const latDelta = radiusMiles / 69
  const lngDelta = radiusMiles / (69 * Math.cos(lat * Math.PI / 180))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any
  const { data } = await sb
    .from('campgrounds')
    .select('id, name, description, lat, lng, agency, parent_name, reservable, reservation_url, fee_description')
    .gte('lat', lat - latDelta)
    .lte('lat', lat + latDelta)
    .gte('lng', lng - lngDelta)
    .lte('lng', lng + lngDelta)
    .limit(50)

  if (!data) return []

  return (data as Campground[])
    .map(c => ({
      ...c,
      distance_miles: haversineMiles(lat, lng, c.lat, c.lng),
    }))
    .filter(c => c.distance_miles! <= radiusMiles)
    .sort((a, b) => a.distance_miles! - b.distance_miles!)
    .slice(0, 10)
}
