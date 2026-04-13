#!/usr/bin/env node
// Verify Michigan river access points against OpenStreetMap via
// the Overpass API. For each pin in data/river-maps/<id>.ts (for
// MI rivers other than the excluded three), query OSM for nearby
// named features (boat ramps, slipways, bridges). Report:
//   - HIT: matching named OSM feature within 0.5 mi of our coord
//   - NEAR: named OSM feature with matching name 0.5–3 mi away → offer OSM coord as replacement
//   - MISS: no named OSM feature matches → candidate for removal
//
// Output: docs/mi-access-audit.md

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
  // Pad the bbox by 0.05 degrees (~3 miles) so bridges near the
  // river but slightly off the polyline still come back.
  const PAD = 0.05
  return { minLat: minLat - PAD, maxLat: maxLat + PAD, minLng: minLng - PAD, maxLng: maxLng + PAD }
}

function overpassQuery(bbox) {
  // Fetch likely access features inside the padded river bbox.
  // Includes slipways, boat_ramps, bridges over waterways, and
  // nodes/ways tagged with canoe_put_in / river_access_point etc.
  const { minLat, maxLat, minLng, maxLng } = bbox
  return `[out:json][timeout:50];
(
  node["leisure"="slipway"](${minLat},${minLng},${maxLat},${maxLng});
  way["leisure"="slipway"](${minLat},${minLng},${maxLat},${maxLng});
  node["amenity"="boat_ramp"](${minLat},${minLng},${maxLat},${maxLng});
  way["amenity"="boat_ramp"](${minLat},${minLng},${maxLat},${maxLng});
  node["canoe"="put_in"](${minLat},${minLng},${maxLat},${maxLng});
  node["canoe"="take_out"](${minLat},${minLng},${maxLat},${maxLng});
  node[name~"Bridge",i]["highway"](${minLat},${minLng},${maxLat},${maxLng});
  way["man_made"="bridge"][name](${minLat},${minLng},${maxLat},${maxLng});
  node["highway"="services"][name](${minLat},${minLng},${maxLat},${maxLng});
);
out center;`
}

function post(url, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(url)
    const req = https.request({
      method: 'POST',
      host: u.host,
      path: u.pathname,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(body),
        'User-Agent': 'RiverScout-AccessAudit/1.0',
      },
    }, res => {
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => resolve({ status: res.statusCode, body: data }))
    })
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

function nameTokens(s) {
  return new Set(
    s.toLowerCase()
      .replace(/[^a-z0-9 ]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length >= 3 && !['the', 'bridge', 'access', 'ramp', 'landing', 'park', 'river', 'creek', 'road'].includes(w))
  )
}

function nameMatch(a, b) {
  const ta = nameTokens(a)
  const tb = nameTokens(b)
  if (ta.size === 0 || tb.size === 0) return 0
  let hits = 0
  for (const w of ta) if (tb.has(w)) hits++
  return hits / Math.min(ta.size, tb.size)
}

async function main() {
  const miRe = /id:\s*'([a-z0-9_]+)'[\s\S]{0,800}?abbr:\s*'MI'/g
  const riversSrc = fs.readFileSync(path.join(REPO, 'data', 'rivers.ts'), 'utf8')
  const miIds = []
  let m
  while ((m = miRe.exec(riversSrc))) miIds.push(m[1])
  const targets = miIds.filter(id => !EXCLUDE.has(id))

  const report = ['# Michigan access-point audit vs OpenStreetMap', '', `Generated ${new Date().toISOString().slice(0,10)}. Audits every surviving access pin in MI (except PM, Pine, Manistee) against features from OpenStreetMap's Overpass API. Uses the river polyline's bounding box to limit the OSM query.`, '', '- **HIT** — named OSM feature within 0.5 mi of our coord (confident match)', '- **NEAR** — named OSM feature matches name but coord is 0.5–3 mi off → replace with OSM coord', '- **MISS** — no named OSM feature matches our pin → unverifiable, recommend removal', '', '## Findings', '']

  const fixes = []
  const removals = []
  let total = 0
  let hits = 0
  let nears = 0
  let misses = 0

  for (const id of targets) {
    const mapFile = path.join(MAPS_DIR, `${id}.ts`)
    if (!fs.existsSync(mapFile)) continue
    const src = fs.readFileSync(mapFile, 'utf8')
    const aps = parseAccessPoints(src)
    if (aps.length === 0) continue
    const bbox = parsePolylineBBox(src)
    if (!bbox) continue

    process.stderr.write(`${id} (${aps.length})...\n`)
    const q = overpassQuery(bbox)
    let osmFeatures = []
    try {
      const res = await post('https://overpass-api.de/api/interpreter', 'data=' + encodeURIComponent(q))
      if (res.status === 200) {
        const json = JSON.parse(res.body)
        osmFeatures = (json.elements || []).filter(e => e.tags && (e.tags.name || e.tags['name:en']))
          .map(e => ({
            name: e.tags.name || e.tags['name:en'],
            lat: e.lat || (e.center && e.center.lat),
            lng: e.lon || (e.center && e.center.lon),
            tags: e.tags,
          }))
          .filter(f => f.lat && f.lng)
      }
    } catch (e) {
      process.stderr.write(`  overpass error: ${e.message}\n`)
    }

    await new Promise(r => setTimeout(r, 1500))  // Overpass rate limit

    report.push(`### ${id} — ${aps.length} pins, ${osmFeatures.length} OSM candidates in bbox`)
    report.push('')
    for (const ap of aps) {
      total++
      // Score each OSM feature by name overlap × distance penalty
      const ranked = osmFeatures
        .map(f => ({
          ...f,
          nameScore: nameMatch(ap.name, f.name),
          distMi: distMiles(ap.lat, ap.lng, f.lat, f.lng),
        }))
        .filter(f => f.nameScore > 0 || f.distMi < 0.3)  // Must share a word OR be very close
        .sort((a, b) => {
          if (Math.abs(a.nameScore - b.nameScore) > 0.01) return b.nameScore - a.nameScore
          return a.distMi - b.distMi
        })
      const best = ranked[0]
      if (!best) {
        misses++
        removals.push({ id, name: ap.name, lat: ap.lat, lng: ap.lng })
        report.push(`- **MISS** \`${ap.name}\` at ${ap.lat}, ${ap.lng} — no OSM feature matches`)
      } else if (best.distMi < 0.5 && best.nameScore >= 0.5) {
        hits++
        report.push(`- **HIT** \`${ap.name}\` matches OSM "${best.name}" at ${best.lat.toFixed(5)}, ${best.lng.toFixed(5)} (${(best.distMi * 5280).toFixed(0)} ft away, name score ${best.nameScore.toFixed(2)})`)
      } else if (best.nameScore >= 0.5) {
        nears++
        fixes.push({ id, oldName: ap.name, newLat: best.lat, newLng: best.lng, osmName: best.name, distMi: best.distMi })
        report.push(`- **NEAR** \`${ap.name}\` matches OSM "${best.name}" at ${best.lat.toFixed(5)}, ${best.lng.toFixed(5)} — **${best.distMi.toFixed(1)} mi off**, name score ${best.nameScore.toFixed(2)}. Replace coord.`)
      } else {
        misses++
        removals.push({ id, name: ap.name, lat: ap.lat, lng: ap.lng })
        report.push(`- **MISS** \`${ap.name}\` at ${ap.lat}, ${ap.lng} — closest OSM "${best.name}" at ${best.distMi.toFixed(1)} mi doesn't match by name`)
      }
    }
    report.push('')
  }

  report.unshift(`## Summary\n\n- Total pins audited: **${total}**\n- HIT (within 0.5 mi, name matches): **${hits}**\n- NEAR (name matches but off by 0.5–3+ mi): **${nears}** → replace coord with OSM value\n- MISS (no OSM match): **${misses}** → recommend removing\n`)
  report.unshift('# Michigan access-point audit vs OpenStreetMap\n\n' + `Generated ${new Date().toISOString().slice(0,10)}.\n`)

  fs.writeFileSync(OUT, report.join('\n'))
  fs.writeFileSync('/tmp/mi-access-fixes.json', JSON.stringify({ fixes, removals }, null, 2))
  console.log(`Wrote ${OUT}`)
  console.log(`HIT ${hits} / NEAR ${nears} / MISS ${misses} of ${total} pins`)
}

main().catch(e => { console.error(e); process.exit(1) })
