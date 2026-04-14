#!/usr/bin/env node
// Discover USGS stream gauges for every river without a `g` field.
//
// For each river:
//   1. Get the river's lat/lng centroid from data/river-coordinates.ts
//   2. Query USGS Water Services for active stream gauges within ~50 mi
//   3. Score each candidate by:
//        - name similarity (river name vs station name)
//        - distance (closer is better)
//   4. Pick the best match. Output one of:
//        attach   — confidence >= 0.80 AND distance <= 25 mi
//        review   — 0.40 <= confidence < 0.80
//        no_match — no candidates within 50 mi
//
// DRY-RUN: writes c:/tmp/gauge-discovery-preview.json and prints the
// top 20 matches. Does NOT modify data/rivers.ts. Run a follow-up
// apply script after review.

const fs = require('fs')
const https = require('https')
const path = require('path')

const REPO = path.resolve(__dirname, '..')
const RIVERS_TS = path.join(REPO, 'data', 'rivers.ts')
const COORDS_TS = path.join(REPO, 'data', 'river-coordinates.ts')
const OUT = 'c:/tmp/gauge-discovery-preview.json'

// 50 mi ≈ 0.72° latitude; longitude varies by latitude but ~0.7° at
// mid-US is close enough for a square bbox.
const RADIUS_DEG = 0.72
const AUTO_ATTACH_CONFIDENCE = 0.80
const AUTO_ATTACH_MAX_MI = 25
const REVIEW_MIN = 0.40

function get(url) {
  return new Promise(resolve => {
    https.get(url, { timeout: 25000, headers: { 'User-Agent': 'RiverScout-GaugeDiscovery/1.0' } }, res => {
      let d = ''
      res.on('data', c => d += c)
      res.on('end', () => resolve({ status: res.statusCode, body: d }))
    }).on('error', () => resolve({ status: 0, body: '' }))
      .on('timeout', function () { this.destroy() })
  })
}

function normalize(s) {
  return s.toLowerCase()
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\b(river|creek|fork|branch|the)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function listRiversNeedingGauge() {
  const src = fs.readFileSync(RIVERS_TS, 'utf8')
  const out = []
  const entries = src.split(/\n\s*\{\s*id: '/).slice(1)
  for (const e of entries) {
    const id = e.match(/^([a-z0-9_]+)'/)?.[1]
    const n  = e.match(/n:\s*'([^']+)'/)?.[1]
    const g  = e.match(/g:\s*'([^']*)'/)?.[1] ?? ''
    const abbr = e.match(/abbr:\s*'([A-Z]{2})'/)?.[1] ?? ''
    if (id && !g) out.push({ id, name: n, abbr })
  }
  return out
}

function loadCoords() {
  const src = fs.readFileSync(COORDS_TS, 'utf8')
  const map = new Map()
  for (const m of src.matchAll(/^\s+([a-z0-9_]+):\s*\[\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\]/gm)) {
    map.set(m[1], [parseFloat(m[2]), parseFloat(m[3])])  // [lat, lng]
  }
  return map
}

function bbox(lat, lng, padDeg = RADIUS_DEG) {
  return [lng - padDeg, lat - padDeg, lng + padDeg, lat + padDeg]
    .map(v => v.toFixed(4)).join(',')
}

async function findCandidates(lat, lng) {
  const url = `https://waterservices.usgs.gov/nwis/site/?format=rdb&bBox=${bbox(lat, lng)}&siteType=ST&siteStatus=active&hasDataTypeCd=iv`
  const { status, body } = await get(url)
  if (status !== 200) return []
  const lines = body.split('\n').filter(l => l && !l.startsWith('#'))
  if (lines.length < 3) return []
  const cols = lines[0].split('\t')
  const iId = cols.indexOf('site_no')
  const iName = cols.indexOf('station_nm')
  const iLat = cols.indexOf('dec_lat_va')
  const iLng = cols.indexOf('dec_long_va')
  const out = []
  for (const line of lines.slice(2)) {
    const c = line.split('\t')
    const sid = c[iId]; const nm = c[iName]
    const slat = parseFloat(c[iLat]); const slng = parseFloat(c[iLng])
    if (!sid || !nm || !isFinite(slat) || !isFinite(slng)) continue
    out.push({ site_no: sid, station_nm: nm, lat: slat, lng: slng })
  }
  return out
}

// Haversine distance in miles.
function distMi(lat1, lng1, lat2, lng2) {
  const R = 3958.8
  const toRad = d => d * Math.PI / 180
  const dLat = toRad(lat2 - lat1); const dLng = toRad(lng2 - lng1)
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng/2)**2
  return 2 * R * Math.asin(Math.sqrt(a))
}

function scoreCandidate(river, gauge, riverLat, riverLng) {
  const dist = distMi(riverLat, riverLng, gauge.lat, gauge.lng)
  const stationLower = gauge.station_nm.toLowerCase()
  const riverNorm = normalize(river.name)
  const riverWords = riverNorm.split(' ').filter(Boolean)

  // Name match: 0.6 if every river-name word appears in station name,
  // 0.3 if any do, 0 if none.
  let nameScore = 0
  if (riverWords.length) {
    const hits = riverWords.filter(w => w.length >= 3 && stationLower.includes(w))
    if (hits.length === riverWords.length) nameScore = 0.6
    else if (hits.length > 0) nameScore = 0.3 * (hits.length / riverWords.length)
  }

  // Distance score: linear 0..0.4 from 50mi..0mi
  const distScore = dist < 50 ? 0.4 * (50 - dist) / 50 : 0
  return { confidence: +(nameScore + distScore).toFixed(3), nameScore, distScore: +distScore.toFixed(3), distMi: +dist.toFixed(1) }
}

async function main() {
  const rivers = listRiversNeedingGauge()
  const coords = loadCoords()
  console.log(`Rivers without a gauge: ${rivers.length}`)
  console.log(`Looking up USGS candidates within 50 mi of each centroid...`)
  console.log()

  const results = []
  let i = 0
  for (const r of rivers) {
    i++
    const c = coords.get(r.id)
    if (!c) { results.push({ ...r, action: 'no_coord', reason: 'no entry in river-coordinates.ts' }); continue }
    const [lat, lng] = c
    const cands = await findCandidates(lat, lng)
    if (i % 25 === 0) process.stderr.write(`  ${i}/${rivers.length}  (${cands.length} candidates for ${r.id})\n`)

    if (!cands.length) {
      results.push({ ...r, lat, lng, action: 'no_match', candidates: 0 })
      continue
    }

    const scored = cands.map(g => ({ gauge: g, ...scoreCandidate(r, g, lat, lng) }))
    scored.sort((a, b) => b.confidence - a.confidence)
    const best = scored[0]

    const action = (best.confidence >= AUTO_ATTACH_CONFIDENCE && best.distMi <= AUTO_ATTACH_MAX_MI) ? 'attach'
                  : best.confidence >= REVIEW_MIN ? 'review'
                  : 'low_confidence'

    results.push({
      ...r, lat, lng, action,
      best: {
        site_no: best.gauge.site_no,
        station_nm: best.gauge.station_nm,
        confidence: best.confidence,
        distMi: best.distMi,
        nameScore: best.nameScore,
        distScore: best.distScore,
      },
      runners_up: scored.slice(1, 3).map(s => ({
        site_no: s.gauge.site_no, station_nm: s.gauge.station_nm,
        confidence: s.confidence, distMi: s.distMi,
      })),
      total_candidates: cands.length,
    })

    await new Promise(r => setTimeout(r, 200))
  }

  // Summary
  const counts = results.reduce((acc, r) => { acc[r.action] = (acc[r.action] || 0) + 1; return acc }, {})
  console.log('\nDry-run summary:')
  for (const [k, v] of Object.entries(counts)) console.log(`  ${k.padEnd(16)} ${v}`)

  // Top 20 highest-confidence ATTACH candidates
  const attaches = results.filter(r => r.action === 'attach').sort((a, b) => b.best.confidence - a.best.confidence)
  console.log(`\nTop 20 auto-attach candidates (confidence >= ${AUTO_ATTACH_CONFIDENCE}, distance <= ${AUTO_ATTACH_MAX_MI} mi):`)
  for (const r of attaches.slice(0, 20)) {
    console.log(`  ${r.id.padEnd(28)} → ${r.best.site_no.padEnd(10)} ${r.best.confidence.toFixed(2)}  ${r.best.distMi.toFixed(1)}mi  ${r.best.station_nm.slice(0, 60)}`)
  }

  fs.writeFileSync(OUT, JSON.stringify({ summary: counts, results }, null, 2))
  console.log(`\nFull dry-run written to: ${OUT}`)
  console.log(`No data/rivers.ts modifications. Run apply-usgs-gauges.js after review.`)
}

main().catch(e => { console.error(e); process.exit(1) })
