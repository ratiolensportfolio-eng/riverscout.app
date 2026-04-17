#!/usr/bin/env node
// Batch extract river polylines from USGS NHDPlus HR ArcGIS REST API.
// Creates data/river-maps/{id}.ts modules for rivers that are missing
// from the registry. Does NOT update index.ts — outputs a list of
// entries to add so a second pass can splice them in.
//
// Usage: node scripts/batch-extract-polylines.js

const fs = require('fs')
const path = require('path')

const API = 'https://hydro.nationalmap.gov/arcgis/rest/services/NHDPlus_HR/MapServer/3/query'
const MAPS_DIR = path.resolve(__dirname, '..', 'data', 'river-maps')
const DELAY_MS = 1200

const missing = JSON.parse(fs.readFileSync('c:/tmp/missing-maps.json', 'utf8'))

// Build GNIS name guesses from our river name
function gnisGuesses(name) {
  const guesses = [name]
  // Try without trailing "River"/"Creek" qualifier
  const stripped = name.replace(/\s+(River|Creek|Brook)$/i, '')
  if (stripped !== name) guesses.push(stripped)
  // Try with "River" appended if not present
  if (!/River|Creek|Brook/i.test(name)) guesses.push(name + ' River')
  return guesses
}

async function fetchPolyline(riverName, lat, lng) {
  const bbox = `${lng - 0.5},${lat - 0.5},${lng + 0.5},${lat + 0.5}`

  for (const gnis of gnisGuesses(riverName)) {
    const where = `gnis_name = '${gnis.replace(/'/g, "''")}'`
    const url = `${API}?where=${encodeURIComponent(where)}&geometry=${bbox}&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=gnis_name,lengthkm&returnGeometry=true&geometryPrecision=5&outSR=4326&f=json&resultRecordCount=200`

    try {
      const res = await fetch(url)
      const d = await res.json()
      if (d.features && d.features.length > 0) {
        return { features: d.features, gnisMatch: gnis }
      }
    } catch (e) {
      console.error(`  API error for "${gnis}":`, e.message)
    }
  }

  // Try LIKE query as fallback
  const firstWord = riverName.split(/\s+/)[0]
  if (firstWord.length >= 4) {
    const where = `gnis_name LIKE '%${firstWord}%'`
    const bbox = `${lng - 0.3},${lat - 0.3},${lng + 0.3},${lat + 0.3}`
    const url = `${API}?where=${encodeURIComponent(where)}&geometry=${bbox}&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=gnis_name,lengthkm&returnGeometry=true&geometryPrecision=5&outSR=4326&f=json&resultRecordCount=200`
    try {
      const res = await fetch(url)
      const d = await res.json()
      if (d.features && d.features.length > 0) {
        return { features: d.features, gnisMatch: `LIKE %${firstWord}%` }
      }
    } catch {}
  }

  return null
}

function chainAndSimplify(features, targetPoints = 300) {
  const allPaths = []
  for (const f of features) {
    for (const p of (f.geometry?.paths || [])) {
      allPaths.push(p.map(c => [c[0], c[1]])) // [lng, lat]
    }
  }
  if (allPaths.length === 0) return []

  // Chain segments by nearest endpoint
  const ordered = [allPaths.shift()]
  while (allPaths.length > 0) {
    const lastEnd = ordered[ordered.length - 1].slice(-1)[0]
    let bestIdx = 0, bestDist = Infinity, bestReverse = false
    for (let i = 0; i < allPaths.length; i++) {
      const seg = allPaths[i]
      const d1 = Math.hypot(seg[0][0] - lastEnd[0], seg[0][1] - lastEnd[1])
      const d2 = Math.hypot(seg[seg.length - 1][0] - lastEnd[0], seg[seg.length - 1][1] - lastEnd[1])
      if (d1 < bestDist) { bestDist = d1; bestIdx = i; bestReverse = false }
      if (d2 < bestDist) { bestDist = d2; bestIdx = i; bestReverse = true }
    }
    const seg = allPaths.splice(bestIdx, 1)[0]
    ordered.push(bestReverse ? seg.reverse() : seg)
  }

  const flat = ordered.flat()
  const step = Math.max(1, Math.floor(flat.length / targetPoints))
  return flat
    .filter((_, i) => i % step === 0 || i === flat.length - 1)
    .map(c => [Math.round(c[0] * 10000) / 10000, Math.round(c[1] * 10000) / 10000])
}

function writeMapModule(riverId, coords, gnisMatch) {
  const lines = coords.map(c => `  [${c[0]}, ${c[1]}],`).join('\n')
  const ts = `import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Geometry from USGS NHDPlus HR — ${coords.length} points
// GNIS match: ${gnisMatch}

export const accessPoints: AccessPoint[] = []

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
${lines}
]
`
  fs.writeFileSync(path.join(MAPS_DIR, `${riverId}.ts`), ts)
}

async function main() {
  console.log(`Processing ${missing.length} rivers missing polylines...\n`)

  let succeeded = 0, failed = 0, skipped = 0
  const newEntries = []

  for (let i = 0; i < missing.length; i++) {
    const r = missing[i]
    process.stdout.write(`[${i + 1}/${missing.length}] ${r.name}... `)

    // Skip lakes and obviously non-river features
    if (/\bLake\b|\bBay\b|\bSound\b|\bOcean\b|\bSea\b/i.test(r.name)) {
      console.log('SKIP (lake/bay)')
      skipped++
      continue
    }

    const result = await fetchPolyline(r.name, r.lat, r.lng)
    if (!result) {
      console.log('NO MATCH')
      failed++
      await new Promise(res => setTimeout(res, DELAY_MS))
      continue
    }

    const coords = chainAndSimplify(result.features)
    if (coords.length < 5) {
      console.log(`TOO FEW POINTS (${coords.length})`)
      failed++
      await new Promise(res => setTimeout(res, DELAY_MS))
      continue
    }

    writeMapModule(r.id, coords, result.gnisMatch)
    newEntries.push(r.id)
    console.log(`OK — ${coords.length} pts (${result.gnisMatch})`)
    succeeded++

    await new Promise(res => setTimeout(res, DELAY_MS))
  }

  console.log(`\n=== RESULTS ===`)
  console.log(`Succeeded: ${succeeded}`)
  console.log(`Failed: ${failed}`)
  console.log(`Skipped: ${skipped}`)
  console.log(`Total: ${missing.length}`)

  // Write the registry entries needed
  fs.writeFileSync('c:/tmp/polyline-new-entries.json', JSON.stringify(newEntries, null, 2))
  console.log(`\nNew entries to register: c:/tmp/polyline-new-entries.json`)
}

main().catch(console.error)
