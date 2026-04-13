#!/usr/bin/env node
// Remove access-point entries from data/river-maps/<id>.ts whose
// coordinates are more than the tolerance distance from the river
// polyline. Only edits the static map files. The seed SQL and
// Supabase rows stay intact (status='pending') so a human can
// verify-and-readd later.

const fs = require('fs')
const path = require('path')

const MAPS_DIR = path.resolve(__dirname, '..', 'data', 'river-maps')
const TOLERANCE_MILES = 2.0

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

function parsePolyline(src) {
  const m = src.match(/export const riverPath[^=]*=\s*\[([\s\S]*?)\n\]/)
  if (!m) return []
  const pts = []
  const re = /\[\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*\]/g
  let g
  while ((g = re.exec(m[1])) !== null) pts.push([parseFloat(g[1]), parseFloat(g[2])])
  return pts
}

const files = fs.readdirSync(MAPS_DIR).filter(f => f.endsWith('.ts') && f !== 'index.ts')
let totalRemoved = 0
let filesChanged = 0

for (const f of files) {
  const fp = path.join(MAPS_DIR, f)
  const src = fs.readFileSync(fp, 'utf8')
  const polyline = parsePolyline(src)
  if (polyline.length === 0) continue

  // Each access point is a one-line object literal (sync script writes them that way).
  // We rebuild the accessPoints array, dropping bad rows.
  const accessRe = /export const accessPoints: AccessPoint\[\]\s*=\s*\[\n([\s\S]*?)\n\]/
  const accessMatch = src.match(accessRe)
  if (!accessMatch) continue

  const lineRe = /^\s*\{[^}]*lat:\s*(-?\d+\.?\d*)[^}]*lng:\s*(-?\d+\.?\d*)[^}]*\},?\s*$/
  const kept = []
  let removed = 0
  for (const line of accessMatch[1].split('\n')) {
    const m = line.match(lineRe)
    if (!m) { kept.push(line); continue }
    const lat = parseFloat(m[1])
    const lng = parseFloat(m[2])
    const d = nearestPolylineDistance(lat, lng, polyline)
    if (d > TOLERANCE_MILES) {
      removed++
      totalRemoved++
    } else {
      kept.push(line)
    }
  }
  if (removed === 0) continue

  // Re-render. Empty array if everything got stripped.
  const body = kept.length > 0 ? kept.join('\n') : ''
  const replacement = body
    ? `export const accessPoints: AccessPoint[] = [\n${body}\n]`
    : `export const accessPoints: AccessPoint[] = []`
  const next = src.replace(accessRe, replacement)
  fs.writeFileSync(fp, next)
  filesChanged++
  console.log(`  ${f.replace(/\.ts$/, '')}: removed ${removed}`)
}

console.log(`\nStripped ${totalRemoved} bad pins across ${filesChanged} files.`)
