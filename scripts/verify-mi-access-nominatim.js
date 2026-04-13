#!/usr/bin/env node
// Per-pin verification via Nominatim (OSM geocoder). For each MI
// access pin, query Nominatim with "<name> <river> Michigan" and
// "<name> county Michigan", keep the best hit within the river's
// bounding box. Compare to our stored coord.
//
// Output: updates docs/mi-access-audit.md with Nominatim results and
// writes /tmp/mi-nominatim-fixes.json with recommended coord swaps.
//
// Nominatim usage policy: max 1 req/sec, User-Agent required.

const fs = require('fs')
const https = require('https')
const path = require('path')

const REPO = path.resolve(__dirname, '..')
const MAPS_DIR = path.join(REPO, 'data', 'river-maps')
const OUT = path.join(REPO, 'docs', 'mi-access-audit.md')

const EXCLUDE = new Set(['pere_marquette', 'pine_mi', 'manistee'])

function distMiles(lat1, lng1, lat2, lng2) {
  const R = 3959
  const toRad = d => d * Math.PI / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng/2)**2
  return 2 * R * Math.asin(Math.sqrt(a))
}

function parseAccessPoints(src) {
  const m = src.match(/export const accessPoints: AccessPoint\[\]\s*=\s*\[([\s\S]*?)\n\]/)
  if (!m) return []
  const points = []
  const re = /\{[^}]*name:\s*'([^']+)'[^}]*lat:\s*(-?\d+\.?\d*)[^}]*lng:\s*(-?\d+\.?\d*)[^}]*type:\s*'([^']+)'[^}]*\}/g
  let g
  while ((g = re.exec(m[1])) !== null) {
    points.push({ name: g[1], lat: parseFloat(g[2]), lng: parseFloat(g[3]), type: g[4] })
  }
  return points
}

function parsePolylineBBox(src) {
  const m = src.match(/export const riverPath[^=]*=\s*\[([\s\S]*?)\n\]/)
  if (!m) return null
  let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity
  const re = /\[\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*\]/g
  let g
  while ((g = re.exec(m[1])) !== null) {
    const lng = parseFloat(g[1]), lat = parseFloat(g[2])
    if (lat < minLat) minLat = lat
    if (lat > maxLat) maxLat = lat
    if (lng < minLng) minLng = lng
    if (lng > maxLng) maxLng = lng
  }
  if (!isFinite(minLat)) return null
  const PAD = 0.1  // ~7 miles — Nominatim is a viewbox hint, not a hard filter
  return { minLat: minLat - PAD, maxLat: maxLat + PAD, minLng: minLng - PAD, maxLng: maxLng + PAD }
}

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'RiverScout-AccessAudit/1.0 (paddle.rivers.us@gmail.com)' } }, res => {
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => resolve({ status: res.statusCode, body: data }))
    }).on('error', reject)
  })
}

// River display names for the query string.
const RIVER_NAMES = {
  muskegon: 'Muskegon River',
  boardman: 'Boardman River',
  betsie: 'Betsie River',
  platte_mi: 'Platte River',
  rifle: 'Rifle River',
  kalamazoo: 'Kalamazoo River',
  little_manistee: 'Little Manistee River',
  white_mi: 'White River',
}

async function nominatim(query, bbox) {
  // Nominatim "q" search with viewbox + bounded=0 (hint, not strict).
  const vb = `${bbox.minLng},${bbox.maxLat},${bbox.maxLng},${bbox.minLat}`  // left,top,right,bottom
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&viewbox=${vb}&bounded=1&countrycodes=us`
  const { status, body } = await get(url)
  if (status !== 200) return []
  try {
    return JSON.parse(body).map(r => ({
      name: r.display_name,
      lat: parseFloat(r.lat),
      lng: parseFloat(r.lon),
      type: r.type,
      class: r.class,
    }))
  } catch { return [] }
}

async function main() {
  const miRe = /id:\s*'([a-z0-9_]+)'[\s\S]{0,800}?abbr:\s*'MI'/g
  const riversSrc = fs.readFileSync(path.join(REPO, 'data', 'rivers.ts'), 'utf8')
  const miIds = []
  let m
  while ((m = miRe.exec(riversSrc))) miIds.push(m[1])
  const targets = miIds.filter(id => !EXCLUDE.has(id))

  const report = [
    '# Michigan access-point audit vs Nominatim (OSM)',
    '',
    `Generated ${new Date().toISOString().slice(0,10)}. Per-pin geocoder lookup using Nominatim with the river's bounding box as viewbox constraint. Tries two queries per pin: "<name> <river>" and "<name> Michigan".`,
    '',
    '- **HIT** — Nominatim returned a match within 0.5 mi of our coord',
    '- **NEAR** — Nominatim found a likely match 0.5\u20133 mi away \u2192 replace coord',
    '- **MISS** — Nominatim returned nothing or results were far off \u2192 cannot verify',
    '',
  ]

  const fixes = []
  const removals = []
  let total = 0, hits = 0, nears = 0, misses = 0

  for (const id of targets) {
    const mapFile = path.join(MAPS_DIR, `${id}.ts`)
    if (!fs.existsSync(mapFile)) continue
    const src = fs.readFileSync(mapFile, 'utf8')
    const aps = parseAccessPoints(src)
    if (aps.length === 0) continue
    const bbox = parsePolylineBBox(src)
    if (!bbox) continue

    report.push(`## ${id} \u2014 ${aps.length} pins`)
    report.push('')
    const riverName = RIVER_NAMES[id] || id

    for (const ap of aps) {
      total++
      process.stderr.write(`${id} / ${ap.name}...\n`)

      // Try name + river first, then name + Michigan.
      let best = null
      for (const q of [`${ap.name} ${riverName}`, `${ap.name} Michigan`]) {
        const results = await nominatim(q, bbox)
        await new Promise(r => setTimeout(r, 1100))  // Nominatim: 1 req/sec
        for (const r of results) {
          const d = distMiles(ap.lat, ap.lng, r.lat, r.lng)
          if (!best || d < best.distMi) best = { ...r, distMi: d, query: q }
        }
        if (best && best.distMi < 0.5) break  // good hit, stop querying
      }

      if (!best) {
        misses++
        removals.push({ id, name: ap.name })
        report.push(`- **MISS** \`${ap.name}\` at ${ap.lat}, ${ap.lng} \u2014 Nominatim returned no matches`)
      } else if (best.distMi < 0.5) {
        hits++
        report.push(`- **HIT** \`${ap.name}\` at ${ap.lat}, ${ap.lng} \u2014 matches Nominatim "${best.name.slice(0,80)}" at ${best.lat.toFixed(5)}, ${best.lng.toFixed(5)} (${(best.distMi * 5280).toFixed(0)} ft away)`)
      } else if (best.distMi < 3) {
        nears++
        fixes.push({ id, oldName: ap.name, oldLat: ap.lat, oldLng: ap.lng, newLat: best.lat, newLng: best.lng, osmName: best.name, distMi: best.distMi })
        report.push(`- **NEAR** \`${ap.name}\` \u2014 closest Nominatim match "${best.name.slice(0,80)}" at ${best.lat.toFixed(5)}, ${best.lng.toFixed(5)} is **${best.distMi.toFixed(1)} mi off**. Replace coord.`)
      } else {
        misses++
        removals.push({ id, name: ap.name })
        report.push(`- **MISS** \`${ap.name}\` at ${ap.lat}, ${ap.lng} \u2014 best match ${best.distMi.toFixed(1)} mi away, not trustworthy`)
      }
    }
    report.push('')
  }

  const summary = [
    '## Summary',
    '',
    `- Total pins audited: **${total}**`,
    `- HIT (within 0.5 mi): **${hits}**`,
    `- NEAR (0.5\u20133 mi, recommend replace): **${nears}**`,
    `- MISS (cannot verify): **${misses}**`,
    '',
  ]
  report.splice(5, 0, ...summary)

  fs.writeFileSync(OUT, report.join('\n'))
  fs.writeFileSync('/tmp/mi-nominatim-fixes.json', JSON.stringify({ fixes, removals }, null, 2))
  console.log(`Wrote ${OUT}`)
  console.log(`HIT ${hits} / NEAR ${nears} / MISS ${misses} of ${total} pins`)
}

main().catch(e => { console.error(e); process.exit(1) })
