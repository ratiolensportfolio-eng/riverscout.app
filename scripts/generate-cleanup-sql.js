#!/usr/bin/env node
// Parse every supabase/seeds/access_points_*.sql, compute the distance
// from each inserted (lat, lng) to the matching river's polyline
// (data/river-maps/<id>.ts), and emit a SQL DELETE file for any row
// more than TOLERANCE_MILES off-river.
//
// Run the output in the Supabase SQL editor — deletes rows by the
// composite (river_id, name) key that was used to seed them.

const fs = require('fs')
const path = require('path')

const REPO = path.resolve(__dirname, '..')
const SEEDS_DIR = path.join(REPO, 'supabase', 'seeds')
const MAPS_DIR = path.join(REPO, 'data', 'river-maps')
const OUT = path.join(REPO, 'supabase', 'seeds', 'cleanup_off_river_access_points.sql')
const TOLERANCE_MILES = 2.0

function distMiles(lat1, lng1, lat2, lng2) {
  const R = 3959
  const toRad = d => d * Math.PI / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng/2)**2
  return 2 * R * Math.asin(Math.sqrt(a))
}

// Cache of river_id -> polyline points [[lng, lat], ...].
const polylineCache = {}
function loadPolyline(riverId) {
  if (polylineCache[riverId] !== undefined) return polylineCache[riverId]
  const file = path.join(MAPS_DIR, `${riverId}.ts`)
  if (!fs.existsSync(file)) { polylineCache[riverId] = null; return null }
  const src = fs.readFileSync(file, 'utf8')
  const m = src.match(/export const riverPath[^=]*=\s*\[([\s\S]*?)\n\]/)
  if (!m) { polylineCache[riverId] = null; return null }
  const pts = []
  const re = /\[\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*\]/g
  let g
  while ((g = re.exec(m[1])) !== null) pts.push([parseFloat(g[1]), parseFloat(g[2])])
  polylineCache[riverId] = pts.length ? pts : null
  return polylineCache[riverId]
}

function nearestPolylineDistance(lat, lng, polyline) {
  let min = Infinity
  for (const [plng, plat] of polyline) {
    const d = distMiles(lat, lng, plat, plng)
    if (d < min) min = d
  }
  return min
}

const seedFiles = fs.readdirSync(SEEDS_DIR)
  .filter(f => f.startsWith('access_points_') && f.endsWith('.sql'))
  .map(f => path.join(SEEDS_DIR, f))

// Same regex pattern used in the sync script.
const re = /select\s+'([a-z0-9_]+)',\s+'((?:[^'\\]|\\.|'')+)',\s+'((?:[^'\\]|\\.|'')+)',([\s\S]*?)where not exists/g

const offenders = []
let totalRows = 0
let riversWithoutPolyline = new Set()

for (const file of seedFiles) {
  const sql = fs.readFileSync(file, 'utf8')
  let m
  while ((m = re.exec(sql)) !== null) {
    totalRows++
    const riverId = m[1]
    const name = m[2].replace(/''/g, "'")
    const tail = m[4]
    const numbers = tail.match(/-?\d+\.\d+/g) || []
    let lat = null, lng = null
    for (const n of numbers) {
      const val = parseFloat(n)
      if (lat === null && val > 20 && val < 72) { lat = val; continue }
      if (lng === null && val < 0 && val > -180) { lng = val; break }
    }
    if (lat === null || lng === null) continue
    const poly = loadPolyline(riverId)
    if (!poly) {
      riversWithoutPolyline.add(riverId)
      // Can't verify — skip (leave the row alone).
      continue
    }
    const d = nearestPolylineDistance(lat, lng, poly)
    if (d > TOLERANCE_MILES) {
      offenders.push({ riverId, name, lat, lng, distMiles: d })
    }
  }
}

offenders.sort((a, b) => a.riverId.localeCompare(b.riverId) || a.name.localeCompare(b.name))

const lines = [
  '-- cleanup_off_river_access_points.sql',
  '--',
  `-- Generated ${new Date().toISOString().slice(0, 10)} by scripts/generate-cleanup-sql.js.`,
  '--',
  `-- Deletes ${offenders.length} access-point rows whose coordinates are more`,
  `-- than ${TOLERANCE_MILES} miles from the river's polyline. These were`,
  `-- seeded from training-data guesses in prior work and are being removed`,
  `-- so the map and the access-point list both show clean/verified data only.`,
  '--',
  '-- Review before running. Safe to run multiple times (idempotent).',
  '',
  'begin;',
  '',
]

// Group by river for readability.
let lastRiver = null
for (const o of offenders) {
  if (o.riverId !== lastRiver) {
    lines.push(`-- ${o.riverId} — ${offenders.filter(x => x.riverId === o.riverId).length} rows`)
    lastRiver = o.riverId
  }
  const nameEsc = o.name.replace(/'/g, "''")
  lines.push(
    `delete from public.river_access_points where river_id = '${o.riverId}' and name = '${nameEsc}';  -- ${o.distMiles.toFixed(1)} mi off`
  )
}

lines.push('')
lines.push('commit;')
lines.push('')

fs.writeFileSync(OUT, lines.join('\n'))
console.log(`Parsed ${totalRows} seeded rows across ${seedFiles.length} seed files.`)
console.log(`Flagged ${offenders.length} rows >${TOLERANCE_MILES} mi off-river.`)
if (riversWithoutPolyline.size) {
  console.log(`Skipped (no polyline file): ${riversWithoutPolyline.size} rivers: ${Array.from(riversWithoutPolyline).slice(0,10).join(', ')}${riversWithoutPolyline.size > 10 ? '...' : ''}`)
}
console.log(`\nWrote ${OUT}`)
console.log(`\nRun it in Supabase SQL editor (Dashboard → SQL Editor → paste & execute).`)
