#!/usr/bin/env node
// Backfill missing entries in data/river-coordinates.ts from each
// river's polyline file (data/river-maps/<id>.ts riverPath centroid).
//
// State maps drop any river without a coords entry, so this fixes
// the long-standing bug where ~200 curated rivers never showed up
// as pins on their state map.

const fs = require('fs')
const path = require('path')

const REPO = path.resolve(__dirname, '..')
const RIVERS_TS = path.join(REPO, 'data', 'rivers.ts')
const COORDS_TS = path.join(REPO, 'data', 'river-coordinates.ts')
const MAPS_DIR = path.join(REPO, 'data', 'river-maps')

function listRivers() {
  // Returns [{ id, gauge }] for every river. Empty gauge string when
  // not set.
  const src = fs.readFileSync(RIVERS_TS, 'utf8')
  const out = []
  // Walk each river entry. Each entry starts with `{ id: '...'` and
  // contains `g: '...'` somewhere within the same object literal.
  const entries = src.split(/\n\s*\{\s*id: '/).slice(1)
  for (const e of entries) {
    const id = e.match(/^([a-z0-9_]+)'/)?.[1]
    const g  = e.match(/g:\s*'([^']*)'/)?.[1] ?? ''
    if (id) out.push({ id, gauge: g })
  }
  return out
}

function existingCoords() {
  const src = fs.readFileSync(COORDS_TS, 'utf8')
  return new Set([...src.matchAll(/^\s+([a-z0-9_]+):\s*\[/gm)].map(m => m[1]))
}

function centroidFromMapFile(id) {
  const f = path.join(MAPS_DIR, `${id}.ts`)
  if (!fs.existsSync(f)) return null
  const src = fs.readFileSync(f, 'utf8')
  // riverPath is an array of [lng, lat] pairs. The lazy /\[(.*?)\]/
  // approach trips on the inner pairs, so just scan the whole file
  // for [lng, lat] coordinate pairs (lng is negative for US data,
  // which makes false positives unlikely).
  const pairs = [...src.matchAll(/\[\s*(-\d{2,3}\.\d+)\s*,\s*(\d{1,2}\.\d+)\s*\]/g)]
  if (!pairs.length) return null
  let sx = 0, sy = 0
  for (const p of pairs) { sx += parseFloat(p[1]); sy += parseFloat(p[2]) }
  return [+(sy / pairs.length).toFixed(4), +(sx / pairs.length).toFixed(4)]  // [lat, lng]
}

async function fetchUsgsCoord(siteId) {
  // RDB format: header lines start with #, then a column row, then
  // a unit row, then data. dec_lat_va / dec_long_va give us lat/lng.
  return new Promise(resolve => {
    const url = `https://waterservices.usgs.gov/nwis/site/?format=rdb&sites=${siteId}`
    require('https').get(url, { timeout: 15000, headers: { 'User-Agent': 'RiverScout-Backfill/1.0' } }, res => {
      let d = ''
      res.on('data', c => d += c)
      res.on('end', () => {
        const lines = d.split('\n').filter(l => l && !l.startsWith('#'))
        if (lines.length < 3) return resolve(null)
        const cols = lines[0].split('\t')
        const iLat = cols.indexOf('dec_lat_va')
        const iLng = cols.indexOf('dec_long_va')
        const data = lines[2].split('\t')
        const lat = parseFloat(data[iLat])
        const lng = parseFloat(data[iLng])
        if (!isFinite(lat) || !isFinite(lng)) return resolve(null)
        resolve([+lat.toFixed(4), +lng.toFixed(4)])
      })
    }).on('error', () => resolve(null))
  })
}

async function main() {
  const all = listRivers()
  const have = existingCoords()
  const missing = all.filter(r => !have.has(r.id))

  const fixed = []
  const stillMissing = []
  for (const r of missing) {
    const c = centroidFromMapFile(r.id)
    if (c) { fixed.push({ id: r.id, lat: c[0], lng: c[1], src: 'polyline' }); continue }
    if (r.gauge) {
      process.stderr.write(`  ${r.id} → USGS ${r.gauge}...`)
      const g = await fetchUsgsCoord(r.gauge)
      if (g) { fixed.push({ id: r.id, lat: g[0], lng: g[1], src: 'gauge' }); process.stderr.write(' ok\n'); continue }
      process.stderr.write(' fail\n')
    }
    stillMissing.push(r.id)
  }

  console.log(`Total missing coords: ${missing.length}`)
  console.log(`  fixable from polyline file: ${fixed.length}`)
  console.log(`  still missing (no map file): ${stillMissing.length}`)
  if (stillMissing.length) {
    console.log('\\nStill missing:')
    for (const id of stillMissing.slice(0, 30)) console.log(`  ${id}`)
    if (stillMissing.length > 30) console.log(`  ... and ${stillMissing.length - 30} more`)
  }

  if (!fixed.length) return

  let src = fs.readFileSync(COORDS_TS, 'utf8')
  const lines = fixed.map(r => `  ${r.id}: [${r.lat}, ${r.lng}],`).join('\r\n')
  const block = `\r\n  // ── Backfilled from polyline centroids (2026-04-14) ────────────\r\n${lines}\r\n`
  const closeRe = /\r?\n\}\r?\n?\s*$/
  const m = src.match(closeRe)
  if (!m) { console.error('!! close brace not found'); process.exit(1) }
  src = src.slice(0, m.index) + block + src.slice(m.index)
  fs.writeFileSync(COORDS_TS, src)
  console.log(`\\nWrote ${fixed.length} new coords entries`)
}

main()
