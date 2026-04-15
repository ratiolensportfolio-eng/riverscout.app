#!/usr/bin/env node
// Pull fish-presence data for Oregon rivers from ODFW's Fish Habitat
// Distribution (FHD) feature service. For each OR river in our
// catalog, bbox-query each of 12 species layers and mark species as
// present if any stream segment intersects the bbox.
//
// Source: https://nrimp.dfw.state.or.us/arcgis/rest/services/FHD/OregonFishHabitatDistribution2/FeatureServer
// (state-stewarded data; "areas of suitable habitat believed to be
// used currently or historically by native or non-native fish
// populations" — public.)
//
// Output: c:/tmp/odfw-fisheries.json (read-only). Merged into
// data/fisheries.ts in a follow-up step.

const fs = require('fs')
const https = require('https')
const path = require('path')

const REPO = path.resolve(__dirname, '..')
const OUT = 'c:/tmp/odfw-fisheries.json'
const FHD = 'https://nrimp.dfw.state.or.us/arcgis/rest/services/FHD/OregonFishHabitatDistribution2/FeatureServer'

// (layer id, our canonical name, type, primary)
const SPECIES = [
  [2,  'Fall Chinook Salmon',   'anadromous', true],
  [4,  'Spring Chinook Salmon', 'anadromous', true],
  [7,  'Coho Salmon',           'anadromous', true],
  [11, 'Summer Steelhead',      'anadromous', true],
  [13, 'Winter Steelhead',      'anadromous', true],
  [1,  'Bull Trout',            'resident',   true],
  [17, 'Rainbow Trout',         'resident',   false],
  [19, 'Coastal Cutthroat Trout','resident',  false],
  [22, 'Westslope Cutthroat Trout','resident',false],
  [21, 'Lahontan Cutthroat Trout','resident', false],
  [6,  'Chum Salmon',           'anadromous', false],
  [9,  'Sockeye Salmon',        'anadromous', false],
]

function get(url, timeout = 25000) {
  return new Promise(resolve => {
    const req = https.get(url, { timeout, headers: { 'User-Agent': 'RiverScout-ODFW/1.0' } }, res => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => resolve({ status: res.statusCode, body: d }))
    })
    req.on('error', () => resolve({ status: 0, body: '' }))
    req.on('timeout', () => { req.destroy(); resolve({ status: 0, body: '' }) })
  })
}

function loadOregonRivers() {
  const src = fs.readFileSync(path.join(REPO, 'data', 'rivers.ts'), 'utf8')
  const stateRe = /^  ([a-z]+): \{$/gm
  const matches = [...src.matchAll(stateRe)]
  const orMatch = matches.find(m => m[1] === 'or')
  if (!orMatch) return []
  const orIdx = matches.indexOf(orMatch)
  const start = orMatch.index
  const end = orIdx + 1 < matches.length ? matches[orIdx + 1].index : src.length
  const block = src.slice(start, end)
  const out = []
  for (const e of block.split(/\n\s*\{\s*id: '/).slice(1)) {
    const id = e.match(/^([a-z0-9_]+)'/)?.[1]
    const n = e.match(/n:\s*'([^']+)'/)?.[1]
    if (id) out.push({ id, name: n })
  }
  return out
}
function loadCoords() {
  const src = fs.readFileSync(path.join(REPO, 'data', 'river-coordinates.ts'), 'utf8')
  const m = new Map()
  for (const x of src.matchAll(/^\s+([a-z0-9_]+):\s*\[\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\]/gm)) {
    m.set(x[1], [parseFloat(x[2]), parseFloat(x[3])])
  }
  return m
}

async function speciesPresentForRiver(coord, layerId) {
  // Bbox 0.10° (~7 mi) around the river coord. Query that species
  // layer with returnCountOnly to keep responses tiny.
  const [lat, lng] = coord
  const bbox = `${lng - 0.10},${lat - 0.10},${lng + 0.10},${lat + 0.10}`
  const url = `${FHD}/${layerId}/query?where=1%3D1&geometry=${bbox}&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects&returnCountOnly=true&f=json`
  const { status, body } = await get(url)
  if (status !== 200) return null
  try { return JSON.parse(body).count ?? 0 }
  catch { return null }
}

async function main() {
  const rivers = loadOregonRivers()
  const coords = loadCoords()
  process.stderr.write(`OR rivers in catalog: ${rivers.length}\n`)

  const result = {}
  let matched = 0, skipped = 0
  for (const r of rivers) {
    const c = coords.get(r.id)
    if (!c) { skipped++; process.stderr.write(`  ${r.id}: no coords, skip\n`); continue }
    process.stderr.write(`  ${r.id} (${r.name})...`)
    const present = []
    for (const [lid, label, type, primary] of SPECIES) {
      const cnt = await speciesPresentForRiver(c, lid)
      if (cnt && cnt > 0) present.push({ name: label, type, primary })
      await new Promise(r => setTimeout(r, 80))
    }
    if (present.length === 0) {
      process.stderr.write(' no species present\n')
      continue
    }
    process.stderr.write(` ${present.length} species\n`)
    result[r.id] = {
      species: present,
      designations: ['ODFW Fish Habitat Distribution — documented presence'],
      spawning: [],
      hatches: [],
      runs: [],
      guides: [],
    }
    matched++
  }

  fs.writeFileSync(OUT, JSON.stringify(result, null, 2))
  process.stderr.write(`\nMatched ${matched} OR rivers; ${skipped} skipped (no coords)\n`)
  process.stderr.write(`Output: ${OUT}\n`)
}
main().catch(e => { console.error(e); process.exit(1) })
