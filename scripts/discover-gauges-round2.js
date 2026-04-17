#!/usr/bin/env node
// Round 2 gauge discovery: query USGS Water Services by state to find
// active streamflow gauges for the ~127 rivers with g:''.
//
// Strategy (different from round 1 which used bbox):
//   1. Fetch ALL active streamflow gauges for each US state (parameterCd=00060)
//   2. Match river names against station names using token matching
//   3. Use river-coordinates.ts proximity (≤30 mi) as secondary filter
//   4. Output proposals to c:/tmp/gauge-discoveries-round2.json
//
// Does NOT modify rivers.ts — just outputs proposals for review.

const fs = require('fs')
const https = require('https')
const path = require('path')

const REPO = path.resolve(__dirname, '..')
const RIVERS_TS = path.join(REPO, 'data', 'rivers.ts')
const COORDS_TS = path.join(REPO, 'data', 'river-coordinates.ts')
const OUT = 'c:/tmp/gauge-discoveries-round2.json'

const MAX_DISTANCE_MI = 30
const DELAY_MS = 500

// ── Helpers ────────────────────────────────────────────────────────

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { timeout: 30000, headers: { 'User-Agent': 'RiverScout-GaugeDiscovery-R2/1.0 (jake@thepineriver.com)' } }, res => {
      let d = ''
      res.on('data', c => d += c)
      res.on('end', () => resolve({ status: res.statusCode, body: d }))
    }).on('error', e => resolve({ status: 0, body: '', error: e.message }))
      .on('timeout', function () { this.destroy() })
  })
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

// Haversine distance in miles.
function distMi(lat1, lng1, lat2, lng2) {
  const R = 3958.8
  const toRad = d => d * Math.PI / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

// Normalize a river/station name for matching:
// strip common suffixes, directional prefixes, lowercase, collapse spaces.
function normalize(s) {
  return s.toLowerCase()
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\b(river|creek|fork|branch|run|brook|the|of|near|at|above|below|nr|ab|blw)\b/g, '')
    .replace(/\b(north|south|east|west|middle|upper|lower|big|little)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// Extract significant tokens (≥3 chars) from a normalized name
function significantTokens(normalized) {
  return normalized.split(' ').filter(w => w.length >= 3)
}

// ── Data loading ───────────────────────────────────────────────────

// Canadian province codes and non-US entries to skip
const SKIP_ABBRS = new Set([
  'AB', 'BC', 'ON', 'MB', 'SK', 'QC', 'NB', 'NS', 'PE', 'NL', 'YT', 'NT', 'NU',
  '' // no abbr
])

// Lake patterns to skip (no streamflow gauges for Great Lakes, reservoirs named "Lake X")
const LAKE_SKIP_PATTERNS = [
  /^lake (michigan|huron|superior|erie|st\.?\s*clair|ontario)/i,
  /^lake /i,  // any entry whose name starts with "Lake " is likely a lake
]

function isLakeOrSkip(name, id) {
  if (!name) return true
  for (const pat of LAKE_SKIP_PATTERNS) {
    if (pat.test(name)) return true
  }
  // Also skip IDs that clearly reference lakes
  if (/^(lake_|.*_lake_)/.test(id) && !/run|trail|creek/.test(id)) return true
  return false
}

function listUngaugedRivers() {
  const src = fs.readFileSync(RIVERS_TS, 'utf8')
  const out = []
  const entries = src.split(/\n\s*\{\s*id: '/).slice(1)
  for (const e of entries) {
    const id = e.match(/^([a-z0-9_]+)'/)?.[1]
    const n = e.match(/n:\s*'([^']+)'/)?.[1]
    const g = e.match(/g:\s*'([^']*)'/)?.[1] ?? ''
    const abbr = e.match(/abbr:\s*'([A-Z]{2,})'/)?.[1] ?? ''
    if (id && g === '') out.push({ id, name: n, abbr })
  }
  return out
}

function loadCoords() {
  const src = fs.readFileSync(COORDS_TS, 'utf8')
  const map = new Map()
  for (const m of src.matchAll(/^\s+([a-z0-9_]+):\s*\[\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\]/gm)) {
    map.set(m[1], [parseFloat(m[2]), parseFloat(m[3])])
  }
  return map
}

// ── USGS state-level gauge fetching ────────────────────────────────

// Parse USGS RDB (tab-separated) response into gauge objects
function parseUSGS_RDB(body) {
  const lines = body.split('\n').filter(l => l && !l.startsWith('#'))
  if (lines.length < 3) return []
  const cols = lines[0].split('\t')
  const iId = cols.indexOf('site_no')
  const iName = cols.indexOf('station_nm')
  const iLat = cols.indexOf('dec_lat_va')
  const iLng = cols.indexOf('dec_long_va')
  if (iId < 0 || iName < 0) return []

  const out = []
  for (const line of lines.slice(2)) {
    const c = line.split('\t')
    const sid = c[iId]
    const nm = c[iName]
    const slat = iLat >= 0 ? parseFloat(c[iLat]) : NaN
    const slng = iLng >= 0 ? parseFloat(c[iLng]) : NaN
    if (!sid || !nm) continue
    out.push({ site_no: sid.trim(), station_nm: nm.trim(), lat: slat, lng: slng })
  }
  return out
}

async function fetchGaugesForState(stateCd) {
  const url = `https://waterservices.usgs.gov/nwis/site/?format=rdb&stateCd=${stateCd}&siteType=ST&parameterCd=00060&siteStatus=active`
  const { status, body } = await get(url)
  if (status !== 200) {
    console.error(`  USGS returned ${status} for state ${stateCd}`)
    return []
  }
  return parseUSGS_RDB(body)
}

// ── Matching ───────────────────────────────────────────────────────

function matchRiverToGauges(river, gauges, riverCoord) {
  const riverNorm = normalize(river.name)
  const riverTokens = significantTokens(riverNorm)
  if (riverTokens.length === 0) return null

  const candidates = []
  for (const gauge of gauges) {
    const stationNorm = normalize(gauge.station_nm)
    const stationLower = gauge.station_nm.toLowerCase()

    // Check: all significant river tokens must appear in station name
    const allMatch = riverTokens.every(t => stationLower.includes(t))
    if (!allMatch) continue

    // Compute distance if we have coordinates
    let dist = null
    if (riverCoord && isFinite(gauge.lat) && isFinite(gauge.lng)) {
      dist = distMi(riverCoord[0], riverCoord[1], gauge.lat, gauge.lng)
      if (dist > MAX_DISTANCE_MI) continue // too far
    }

    candidates.push({
      gaugeId: gauge.site_no,
      gaugeName: gauge.station_nm,
      gaugeLat: gauge.lat,
      gaugeLng: gauge.lng,
      distanceMiles: dist !== null ? +dist.toFixed(1) : null,
      matchMethod: dist !== null ? 'name+proximity' : 'name-only',
    })
  }

  // Sort: prefer name+proximity matches (closest first), then name-only
  candidates.sort((a, b) => {
    if (a.distanceMiles !== null && b.distanceMiles !== null) return a.distanceMiles - b.distanceMiles
    if (a.distanceMiles !== null) return -1
    if (b.distanceMiles !== null) return 1
    return 0
  })

  return candidates.length > 0 ? candidates[0] : null
}

// ── Main ───────────────────────────────────────────────────────────

async function main() {
  const allUngauged = listUngaugedRivers()
  const coords = loadCoords()
  console.log(`Total ungauged rivers in rivers.ts: ${allUngauged.length}`)

  // Filter out Canadian, no-abbr, and lake entries
  const rivers = allUngauged.filter(r => {
    if (SKIP_ABBRS.has(r.abbr)) {
      return false
    }
    if (isLakeOrSkip(r.name, r.id)) {
      return false
    }
    return true
  })

  const skipped = allUngauged.length - rivers.length
  console.log(`Skipped ${skipped} (lakes, Canadian, no-abbr). Processing ${rivers.length} US rivers.`)

  // Group rivers by state
  const byState = new Map()
  for (const r of rivers) {
    if (!byState.has(r.abbr)) byState.set(r.abbr, [])
    byState.get(r.abbr).push(r)
  }

  const stateList = [...byState.keys()].sort()
  console.log(`States to query: ${stateList.join(', ')} (${stateList.length} states)\n`)

  // Cache of gauges per state
  const stateGaugeCache = new Map()

  const results = []
  let matched = 0, noMatch = 0, noCoord = 0

  for (const st of stateList) {
    // Fetch gauges for this state (with caching)
    if (!stateGaugeCache.has(st)) {
      process.stderr.write(`Fetching USGS gauges for ${st}...`)
      const gauges = await fetchGaugesForState(st)
      stateGaugeCache.set(st, gauges)
      process.stderr.write(` ${gauges.length} gauges\n`)
      await sleep(DELAY_MS)
    }
    const gauges = stateGaugeCache.get(st)

    for (const river of byState.get(st)) {
      const coord = coords.get(river.id) || null
      if (!coord) noCoord++

      const best = matchRiverToGauges(river, gauges, coord)
      if (best) {
        matched++
        results.push({
          riverId: river.id,
          riverName: river.name,
          state: river.abbr,
          ...best,
        })
        console.log(`  ✓ ${river.id.padEnd(35)} → ${best.gaugeId}  ${(best.distanceMiles !== null ? best.distanceMiles + 'mi' : 'no-coord').padEnd(10)} ${best.gaugeName.slice(0, 55)}`)
      } else {
        noMatch++
      }
    }
  }

  console.log(`\n── Summary ──────────────────────────────────────────`)
  console.log(`  Processed:    ${rivers.length} US rivers`)
  console.log(`  Matched:      ${matched}`)
  console.log(`  No match:     ${noMatch}`)
  console.log(`  No coord:     ${noCoord} (relied on name-only matching)`)
  console.log(`  Skipped:      ${skipped} (lakes/Canadian/no-abbr)`)

  fs.writeFileSync(OUT, JSON.stringify(results, null, 2))
  console.log(`\nProposals written to: ${OUT}`)
  console.log(`Review and then apply with a separate script.`)
}

main().catch(e => { console.error(e); process.exit(1) })
