#!/usr/bin/env node
// Pull Ontario MNRF Fishing Access Points for the 5 Ontario rivers
// added this week. Generates supabase/seeds/access_points_ontario_mnrf.sql
// for review + manual run in Supabase.
//
// Source: Ontario LIO Open Data — Fishing Access Point layer
//   https://ws.lioservices.lrc.gov.on.ca/arcgis2/rest/services/LIO_OPEN_DATA/LIO_Open07/MapServer/15/query
//
// For each river: bbox 0.20° (~14 mi) around the river coord. Filter
// returned access points to within 8 mi of the centroid (so we don't
// pick up neighboring-river sites). Inserted as
// submitted_by='Ontario MNRF', verified=true.

const fs = require('fs')
const https = require('https')
const path = require('path')

const REPO = path.resolve(__dirname, '..')
const SQL_OUT = path.join(REPO, 'supabase', 'seeds', 'access_points_ontario_mnrf.sql')
const LIO = 'https://ws.lioservices.lrc.gov.on.ca/arcgis2/rest/services/LIO_OPEN_DATA/LIO_Open07/MapServer/15/query'

// River_id → centroid coords + name. Pulls coords from
// data/river-coordinates.ts.
const ON_RIVERS = [
  { id: 'grand_on',      name: 'Grand River',      coord: [43.133, -80.267]  },
  { id: 'speed_on',      name: 'Speed River',      coord: [43.422, -80.333]  },
  { id: 'eramosa_on',    name: 'Eramosa River',    coord: [43.548, -80.182]  },
  { id: 'french_on',     name: 'French River',     coord: [46.069, -80.612]  },
  { id: 'magnetawan_on', name: 'Magnetawan River', coord: [45.773, -80.482]  },
]

const BBOX_PAD = 0.40  // ~28 mi N/S
const KEEP_RADIUS_MI = 15

function get(url, timeout = 30000) {
  return new Promise(resolve => {
    const req = https.get(url, { timeout, headers: { 'User-Agent': 'RiverScout-OntarioAccessPoints/1.0' } }, res => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => resolve({ status: res.statusCode, body: d }))
    })
    req.on('error', () => resolve({ status: 0, body: '' }))
    req.on('timeout', () => { req.destroy(); resolve({ status: 0, body: '' }) })
  })
}

function distMi([lat1, lng1], [lat2, lng2]) {
  const R = 3958.8, toRad = d => d * Math.PI / 180
  const dLat = toRad(lat2 - lat1), dLng = toRad(lng2 - lng1)
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng/2)**2
  return 2 * R * Math.asin(Math.sqrt(a))
}

// Map LIO FISHING_ACCESS_POINT_TYPE → our access_type enum.
function mapAccessType(t) {
  const u = (t || '').toUpperCase()
  if (u.includes('BOAT LAUNCH') || u.includes('RAMP')) return 'boat_ramp'
  if (u.includes('DOCK')) return 'dock'
  if (u.includes('SHORELINE') || u.includes('SHORE')) return 'carry_in'
  if (u.includes('BEACH')) return 'beach_launch'
  return 'carry_in'  // safest default
}
// Map LIO MATERIAL_TYPE → our ramp_surface enum.
function mapSurface(t) {
  const u = (t || '').toUpperCase()
  if (u.includes('CONCRETE')) return 'concrete'
  if (u.includes('PAVED') || u.includes('ASPHALT')) return 'paved'
  if (u.includes('GRAVEL')) return 'gravel'
  if (u.includes('DIRT') || u.includes('EARTH')) return 'dirt'
  if (u.includes('SAND')) return 'sand'
  if (u.includes('WOOD')) return 'none'
  return 'none'
}
function buildDescription(p) {
  const bits = []
  if (p.SITE_OWNERSHIP_TYPE) bits.push(p.SITE_OWNERSHIP_TYPE)
  const amenities = []
  if (p.PARKING_PRESENCE_FLG === 'Y' || /yes/i.test(p.PARKING_PRESENCE_FLG || '')) amenities.push('parking')
  if (p.ACCESSIBILITY_FLG === 'Y' || /yes/i.test(p.ACCESSIBILITY_FLG || '')) amenities.push('accessible')
  if (p.USER_FEE_FLG === 'Y' || /yes/i.test(p.USER_FEE_FLG || '')) amenities.push('fee')
  if (amenities.length) bits.push(amenities.join(', '))
  return bits.join(' \u2014 ').replace(/\s+/g, ' ').trim() || null
}

async function fetchForRiver(river) {
  const [lat, lng] = river.coord
  const bbox = `${lng - BBOX_PAD},${lat - BBOX_PAD},${lng + BBOX_PAD},${lat + BBOX_PAD}`
  const url = `${LIO}?where=1%3D1&geometry=${bbox}&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=SITE_NAME,FISHING_ACCESS_POINT_TYPE,SITE_OWNERSHIP_TYPE,MATERIAL_TYPE,PARKING_PRESENCE_FLG,ACCESSIBILITY_FLG,USER_FEE_FLG,GENERAL_COMMENTS&outSR=4326&returnGeometry=true&f=geojson&resultRecordCount=500`
  const { status, body } = await get(url)
  if (status !== 200) { process.stderr.write(`  ${river.id}: HTTP ${status}\n`); return [] }
  let feats = []
  try { feats = JSON.parse(body).features || [] } catch { return [] }

  // Filter to within KEEP_RADIUS_MI of the river centroid.
  const out = []
  for (const f of feats) {
    const c = f.geometry?.coordinates
    if (!c || c.length < 2) continue
    const d = distMi([lat, lng], [c[1], c[0]])
    if (d > KEEP_RADIUS_MI) continue
    out.push({ p: f.properties, lat: c[1], lng: c[0], distMi: d })
  }
  process.stderr.write(`  ${river.id}: ${feats.length} bbox hits → ${out.length} within ${KEEP_RADIUS_MI}mi\n`)
  return out
}

function escSql(s) { return (s || '').replace(/'/g, "''").replace(/\s*[\r\n]+\s*/g, ' ').trim() }

async function main() {
  process.stderr.write('Pulling Ontario MNRF Fishing Access Points...\n')
  const sql = [
    '-- access_points_ontario_mnrf.sql',
    '--',
    `-- Generated ${new Date().toISOString().slice(0,10)} by scripts/fetch-ontario-access-points.js`,
    '-- Source: Ontario LIO Open Data — Fishing Access Point layer (MapServer/15)',
    '--',
    '-- One block per Ontario river — wipes prior MNRF rows so re-running',
    '-- swaps in the latest dataset (other submitters preserved).',
    '',
    'begin;',
    '',
  ]
  let totalSites = 0
  for (const r of ON_RIVERS) {
    const sites = await fetchForRiver(r)
    sql.push(`-- ${r.name} — ${sites.length} sites within ${KEEP_RADIUS_MI}mi`)
    sql.push(`delete from public.river_access_points where river_id = '${r.id}' and submitted_by_name = 'Ontario MNRF';`)
    for (const s of sites) {
      const name = escSql(s.p.SITE_NAME) || 'Fishing Access Point'
      const desc = escSql(buildDescription(s.p) || '')
      const acc = mapAccessType(s.p.FISHING_ACCESS_POINT_TYPE)
      const surf = mapSurface(s.p.MATERIAL_TYPE)
      sql.push(
        `insert into public.river_access_points (river_id, name, description, access_type, ramp_surface, lat, lng, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by) values (` +
        `'${r.id}', '${name}', ${desc ? `'${desc}'` : 'null'}, '${acc}', '${surf}', ${s.lat.toFixed(5)}, ${s.lng.toFixed(5)}, ` +
        `'Ontario MNRF', true, 'verified', now(), 'Ontario LIO Fishing Access Point dataset');`
      )
    }
    sql.push('')
    totalSites += sites.length
    await new Promise(res => setTimeout(res, 400))
  }
  sql.push('commit;')
  fs.writeFileSync(SQL_OUT, sql.join('\n'))
  process.stderr.write(`\nWrote ${SQL_OUT}\n`)
  process.stderr.write(`Total sites: ${totalSites}\n`)
}
main().catch(e => { console.error(e); process.exit(1) })
