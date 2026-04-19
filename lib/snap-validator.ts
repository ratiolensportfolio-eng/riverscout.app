// NHDPlus HR snap validator — checks whether an access point's
// coordinates fall within 100 meters of the claimed river's
// flowline. Uses the same NHDPlus HR ArcGIS REST API we use for
// polyline extraction, but in point-distance mode.
//
// The validator queries the NHDPlus NetworkNHDFlowline layer with
// a small buffer geometry around the access point, then computes
// the minimum point-to-segment distance. If > 100m, the access
// point is flagged as coordinates_suspect=true and hidden from
// public display until manually verified.
//
// Called by:
//   - /api/cron/validate-access-points (nightly)
//   - Inline after community submissions (best-effort)

import { RIVER_COORDS } from '@/data/river-coordinates'
import { ALL_RIVERS } from '@/data/rivers'
import type { SupabaseClient } from '@supabase/supabase-js'

const NHDPLUS_URL = 'https://hydro.nationalmap.gov/arcgis/rest/services/NHDPlus_HR/MapServer/3/query'
const MAX_SNAP_DISTANCE_M = 100
const EARTH_RADIUS_M = 6371000

function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(a))
}

// Minimum distance from a point to a line segment (all in degrees,
// converted to meters via haversine at the end).
function pointToSegmentMeters(
  pLat: number, pLng: number,
  aLat: number, aLng: number,
  bLat: number, bLng: number,
): number {
  const dx = bLng - aLng
  const dy = bLat - aLat
  const lenSq = dx * dx + dy * dy
  if (lenSq === 0) return haversineMeters(pLat, pLng, aLat, aLng)

  let t = ((pLng - aLng) * dx + (pLat - aLat) * dy) / lenSq
  t = Math.max(0, Math.min(1, t))

  const projLng = aLng + t * dx
  const projLat = aLat + t * dy
  return haversineMeters(pLat, pLng, projLat, projLng)
}

// Build a GNIS name guess for the river to query NHDPlus.
function gnisGuess(riverName: string): string {
  // Common patterns: "Pine River" → "Pine River", "Au Sable River" → "Au Sable River"
  if (/River|Creek|Brook/i.test(riverName)) return riverName
  return riverName + ' River'
}

export interface SnapResult {
  distanceMeters: number | null
  suspect: boolean
  reason: string
}

// Check a single access point against NHDPlus flowlines.
// Uses a small bounding box around the point (±0.005°, ~500m)
// and the river's GNIS name to find nearby flowline segments.
export async function snapCheckPoint(
  lat: number, lng: number, riverId: string,
): Promise<SnapResult> {
  const river = ALL_RIVERS.find(r => r.id === riverId)
  if (!river) return { distanceMeters: null, suspect: false, reason: 'Unknown river — skipped.' }

  const gnis = gnisGuess(river.n)
  const buffer = 0.005 // ~500m
  const bbox = `${lng - buffer},${lat - buffer},${lng + buffer},${lat + buffer}`
  const where = encodeURIComponent(`gnis_name = '${gnis.replace(/'/g, "''")}'`)

  try {
    const url = `${NHDPLUS_URL}?where=${where}&geometry=${bbox}&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects&returnGeometry=true&geometryPrecision=6&outSR=4326&f=json&resultRecordCount=50`
    const res = await fetch(url)
    if (!res.ok) return { distanceMeters: null, suspect: false, reason: `NHDPlus API error: ${res.status}` }

    const data = await res.json()
    const features = data.features || []

    if (features.length === 0) {
      // No flowline found in the buffer — try a wider search
      const widerBuffer = 0.02 // ~2km
      const widerBbox = `${lng - widerBuffer},${lat - widerBuffer},${lng + widerBuffer},${lat + widerBuffer}`
      const widerUrl = `${NHDPLUS_URL}?where=${where}&geometry=${widerBbox}&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects&returnGeometry=true&geometryPrecision=6&outSR=4326&f=json&resultRecordCount=50`
      const widerRes = await fetch(widerUrl)
      if (!widerRes.ok) return { distanceMeters: null, suspect: false, reason: 'NHDPlus wider search failed.' }
      const widerData = await widerRes.json()
      const widerFeatures = widerData.features || []

      if (widerFeatures.length === 0) {
        // No flowline even within 2km — might be a lake, tributary, or bad GNIS name
        return { distanceMeters: null, suspect: false, reason: `No NHDPlus flowline found for "${gnis}" within 2km.` }
      }

      // Compute distance to the nearest segment in the wider result
      return computeMinDistance(lat, lng, widerFeatures)
    }

    return computeMinDistance(lat, lng, features)
  } catch (err) {
    return { distanceMeters: null, suspect: false, reason: `Snap check error: ${err instanceof Error ? err.message : 'unknown'}` }
  }
}

function computeMinDistance(
  lat: number, lng: number,
  features: Array<{ geometry?: { paths?: number[][][] } }>,
): SnapResult {
  let minDist = Infinity

  for (const f of features) {
    for (const path of (f.geometry?.paths || [])) {
      for (let i = 0; i < path.length - 1; i++) {
        const d = pointToSegmentMeters(
          lat, lng,
          path[i][1], path[i][0],     // [lng, lat] → lat, lng
          path[i + 1][1], path[i + 1][0],
        )
        if (d < minDist) minDist = d
      }
    }
  }

  if (minDist === Infinity) {
    return { distanceMeters: null, suspect: false, reason: 'No segments in flowline geometry.' }
  }

  const suspect = minDist > MAX_SNAP_DISTANCE_M
  return {
    distanceMeters: Math.round(minDist),
    suspect,
    reason: suspect
      ? `${Math.round(minDist)}m from nearest flowline — exceeds ${MAX_SNAP_DISTANCE_M}m threshold.`
      : `${Math.round(minDist)}m from nearest flowline — within threshold.`,
  }
}

// Batch-validate all access points for a river. Updates the
// Supabase rows with snap_distance_meters, coordinates_suspect,
// and snap_validated_at.
export async function validateRiverAccessPoints(
  riverId: string,
  supabase: SupabaseClient,
): Promise<{ total: number; validated: number; suspect: number; errors: number }> {
  const { data: points } = await supabase
    .from('river_access_points')
    .select('id, lat, lng, river_id')
    .eq('river_id', riverId)
    .not('lat', 'is', null)
    .not('lng', 'is', null)

  if (!points?.length) return { total: 0, validated: 0, suspect: 0, errors: 0 }

  const result = { total: points.length, validated: 0, suspect: 0, errors: 0 }

  for (const pt of points) {
    const snap = await snapCheckPoint(pt.lat, pt.lng, pt.river_id)
    if (snap.distanceMeters == null) {
      result.errors++
      continue
    }

    const { error } = await supabase
      .from('river_access_points')
      .update({
        snap_distance_meters: snap.distanceMeters,
        coordinates_suspect: snap.suspect,
        snap_validated_at: new Date().toISOString(),
      })
      .eq('id', pt.id)

    if (error) {
      result.errors++
    } else {
      result.validated++
      if (snap.suspect) result.suspect++
    }

    // Rate limit NHDPlus calls
    await new Promise(r => setTimeout(r, 200))
  }

  return result
}
