#!/usr/bin/env node
// Compute lat/lng centroids for the 569 new NRP rivers from their
// cached polyline features, and add them to data/river-coordinates.ts.
//
// Uses:
//   c:/tmp/nrp-floatable-reaches-raw.json  (cached per-state fetch)
//   c:/tmp/nrp-river-additions.json        (knows which river_ids we added)
//
// Inserts new entries at the end of the RIVER_COORDS object in
// river-coordinates.ts, preserving existing ones.

const fs = require('fs')
const path = require('path')

const REPO = path.resolve(__dirname, '..')
const COORDS_TS = path.join(REPO, 'data', 'river-coordinates.ts')
const RAW = 'c:/tmp/nrp-floatable-reaches-raw.json'
const ADDITIONS = 'c:/tmp/nrp-river-additions.json'

function normalize(s) {
  return s.toLowerCase()
    .replace(/\bthe\s+/g, '')
    .replace(/[,()'"]/g, '')
    .replace(/\s+river\b/g, '')
    .replace(/\s+creek\b/g, '')
    .replace(/\s+fork\b/g, ' fork')
    .replace(/\s+/g, ' ')
    .trim()
}

function centroid(feats) {
  let sx = 0, sy = 0, n = 0
  for (const f of feats) {
    const g = f.geometry
    if (!g) continue
    const coords = g.type === 'LineString' ? g.coordinates
      : g.type === 'MultiLineString' ? g.coordinates.flat() : []
    for (const [x, y] of coords) { sx += x; sy += y; n++ }
  }
  if (!n) return null
  return [+(sy / n).toFixed(4), +(sx / n).toFixed(4)]  // [lat, lng]
}

function main() {
  const rawFeats = JSON.parse(fs.readFileSync(RAW, 'utf8'))
  const additions = JSON.parse(fs.readFileSync(ADDITIONS, 'utf8')).additions

  // Index raw features by (normalized name, state) so we can look up
  // polylines for each added river_id.
  const byKey = {}
  for (const f of rawFeats) {
    const name = f.properties.GNIS_River_Name
    if (!name) continue
    const key = `${normalize(name)}|${f.__state}`
    if (!byKey[key]) byKey[key] = []
    byKey[key].push(f)
  }

  // Collect (id -> [lat, lng]) for every added river.
  const toAdd = []
  let missing = 0
  for (const entries of Object.values(additions)) {
    for (const e of entries) {
      const key = `${normalize(e.name)}|${e.state}`
      const feats = byKey[key] || []
      const c = centroid(feats)
      if (!c) { missing++; continue }
      toAdd.push({ id: e.id, lat: c[0], lng: c[1] })
    }
  }

  // Read current file; skip any ids already present (idempotent).
  const src = fs.readFileSync(COORDS_TS, 'utf8')
  const existing = new Set()
  for (const m of src.matchAll(/^\s*([a-z0-9_]+):\s*\[/gm)) existing.add(m[1])
  const fresh = toAdd.filter(r => !existing.has(r.id))

  if (!fresh.length) {
    console.log('No new coords to add (all already present or no centroid)')
    console.log(`Missing polyline data for ${missing} rivers`)
    return
  }

  // Insert before the closing `}` of the object literal.
  const lines = fresh.map(r => `  ${r.id}: [${r.lat}, ${r.lng}],`).join('\r\n')
  const block = `\r\n  // ── NRP-sourced rivers (auto-imported 2026-04-14) ─────────────\r\n${lines}\r\n`

  // Find the last `}\n` that closes the exported const object.
  const closeRe = /\r?\n\}\r?\n?\s*$/
  const m = src.match(closeRe)
  if (!m) { console.error('!! close brace not found'); process.exit(1) }
  const insertAt = m.index
  const updated = src.slice(0, insertAt) + block + src.slice(insertAt)
  fs.writeFileSync(COORDS_TS, updated)

  console.log(`Added ${fresh.length} new river coords to river-coordinates.ts`)
  console.log(`  (${toAdd.length - fresh.length} already present, ${missing} had no polyline)`)
}

main()
