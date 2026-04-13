#!/usr/bin/env node
// Audit every access point in data/river-maps/<id>.ts against that
// river's polyline. Any pin more than ~2 miles from the nearest
// polyline vertex is flagged — almost certainly a wrong coordinate
// (either the SQL seed had bad lat/lng, or the river-map sync got it
// wrong, or both).
//
// Output: docs/access-point-audit.md with one section per offending
// river. Doesn't modify any files — review before fixing.

const fs = require('fs')
const path = require('path')

const MAPS_DIR = path.resolve(__dirname, '..', 'data', 'river-maps')
const OUT = path.resolve(__dirname, '..', 'docs', 'access-point-audit.md')

// Haversine distance in miles
function distMiles(lat1, lng1, lat2, lng2) {
  const R = 3959
  const toRad = d => d * Math.PI / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng/2)**2
  return 2 * R * Math.asin(Math.sqrt(a))
}

function nearestPolylineDistance(lat, lng, polyline) {
  let min = Infinity
  for (const [plng, plat] of polyline) {
    const d = distMiles(lat, lng, plat, plng)
    if (d < min) min = d
  }
  return min
}

// Naive parser of accessPoints + riverPath arrays from the .ts file —
// the format is regular enough that string regex works.
function parseFile(src) {
  const accessMatch = src.match(/export const accessPoints[^=]*=\s*\[([\s\S]*?)\n\]/)
  const pathMatch = src.match(/export const riverPath[^=]*=\s*\[([\s\S]*?)\n\]/)
  if (!accessMatch || !pathMatch) return null

  const accessPoints = []
  const apRe = /\{[^}]*name:\s*'([^']+)'[^}]*lat:\s*(-?\d+\.?\d*)[^}]*lng:\s*(-?\d+\.?\d*)/g
  let m
  while ((m = apRe.exec(accessMatch[1])) !== null) {
    accessPoints.push({ name: m[1], lat: parseFloat(m[2]), lng: parseFloat(m[3]) })
  }

  const polyline = []
  const ptRe = /\[\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*\]/g
  while ((m = ptRe.exec(pathMatch[1])) !== null) {
    polyline.push([parseFloat(m[1]), parseFloat(m[2])])
  }
  return { accessPoints, polyline }
}

const TOLERANCE_MILES = 2.0
const files = fs.readdirSync(MAPS_DIR).filter(f => f.endsWith('.ts') && f !== 'index.ts')

const flagged = []
let totalAccessPoints = 0
let totalRivers = 0
let riversWithBadPins = 0

for (const f of files) {
  const id = f.replace(/\.ts$/, '')
  const src = fs.readFileSync(path.join(MAPS_DIR, f), 'utf8')
  const parsed = parseFile(src)
  if (!parsed || parsed.polyline.length === 0) continue
  if (parsed.accessPoints.length === 0) continue
  totalRivers++
  const offenders = []
  for (const ap of parsed.accessPoints) {
    totalAccessPoints++
    const d = nearestPolylineDistance(ap.lat, ap.lng, parsed.polyline)
    if (d > TOLERANCE_MILES) {
      offenders.push({ ...ap, distMiles: d })
    }
  }
  if (offenders.length > 0) {
    riversWithBadPins++
    flagged.push({ id, offenders, totalPoints: parsed.accessPoints.length })
  }
}

// Sort by worst river first
flagged.sort((a, b) => {
  const aMax = Math.max(...a.offenders.map(o => o.distMiles))
  const bMax = Math.max(...b.offenders.map(o => o.distMiles))
  return bMax - aMax
})

const lines = [
  '# Access-point coordinate audit',
  '',
  `Generated ${new Date().toISOString().slice(0, 10)}.`,
  '',
  '| Metric | Value |',
  '|---|---|',
  `| River-map files audited | ${totalRivers} |`,
  `| Total access points | ${totalAccessPoints} |`,
  `| Rivers with at least one bad pin | ${riversWithBadPins} |`,
  `| Tolerance | ${TOLERANCE_MILES} miles from nearest polyline vertex |`,
  '',
  'Pin distance is measured to the nearest vertex of the river polyline (`riverPath` in the .ts file). A pin more than ~2 miles off is almost certainly the wrong coordinate — either the seed SQL had bad lat/lng or the wrong location was inferred. Worst rivers first.',
  '',
]

for (const r of flagged) {
  lines.push(`## ${r.id} — ${r.offenders.length}/${r.totalPoints} bad`)
  for (const o of r.offenders) {
    lines.push(`- **${o.name}** at \`${o.lat}, ${o.lng}\` — ${o.distMiles.toFixed(1)} mi off-river`)
  }
  lines.push('')
}

fs.writeFileSync(OUT, lines.join('\n'))
console.log(`Wrote ${OUT}`)
console.log(`${riversWithBadPins}/${totalRivers} rivers have at least one bad pin (${flagged.reduce((s, r) => s + r.offenders.length, 0)}/${totalAccessPoints} pins flagged)`)
