#!/usr/bin/env node
// Generate data/river-maps/<id>.ts for the 569 new NRP rivers,
// using cached polyline features from
// c:/tmp/nrp-floatable-reaches-raw.json.
//
// Each file exports riverPath (stitched NRP coords), plus empty
// accessPoints and sections arrays. Access points are rendered
// from Supabase at runtime, so the empty array here is fine — the
// map page will still show the pins.
//
// Also registers each new file in data/river-maps/index.ts.

const fs = require('fs')
const path = require('path')

const REPO = path.resolve(__dirname, '..')
const MAPS_DIR = path.join(REPO, 'data', 'river-maps')
const INDEX_FILE = path.join(MAPS_DIR, 'index.ts')
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

function stitch(feats) {
  // NRP returns many separate reach segments per river. For a decent
  // visual we concatenate all coords in whatever order the layer
  // returned them. Any gaps will render as straight-line jumps; NHDPlus
  // extraction replaces this later with a proper single stitched line.
  const coords = []
  for (const f of feats) {
    const g = f.geometry
    if (!g) continue
    if (g.type === 'LineString') {
      coords.push(...g.coordinates)
    } else if (g.type === 'MultiLineString') {
      for (const part of g.coordinates) coords.push(...part)
    }
  }
  return coords
}

function existingRegistry(src) {
  const out = new Set()
  for (const m of src.matchAll(/^\s+([a-z0-9_]+):\s*\(\)\s*=>\s*import\(/gm)) out.add(m[1])
  return out
}

function entryBlock(id) {
  return `  ${id}: () => import('./${id}').then(m => ({\r\n    accessPoints: m.accessPoints,\r\n    sections: m.sections,\r\n    riverPath: m.riverPath,\r\n  })),\r\n`
}

function main() {
  const feats = JSON.parse(fs.readFileSync(RAW, 'utf8'))
  const additions = JSON.parse(fs.readFileSync(ADDITIONS, 'utf8')).additions

  // Index features by (normalized name, state).
  const byKey = {}
  for (const f of feats) {
    const name = f.properties.GNIS_River_Name
    if (!name) continue
    const k = `${normalize(name)}|${f.__state}`
    if (!byKey[k]) byKey[k] = []
    byKey[k].push(f)
  }

  const existingFiles = new Set(
    fs.readdirSync(MAPS_DIR).filter(f => f.endsWith('.ts') && f !== 'index.ts').map(f => f.replace('.ts', ''))
  )

  let created = 0
  let tooShort = 0
  let alreadyExists = 0
  const createdIds = []

  for (const entries of Object.values(additions)) {
    for (const e of entries) {
      if (existingFiles.has(e.id)) { alreadyExists++; continue }
      const key = `${normalize(e.name)}|${e.state}`
      const fs_ = byKey[key] || []
      const coords = stitch(fs_)
      if (coords.length < 2) { tooShort++; continue }

      const content = `import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'\r\n\r\n// ${e.name} (${e.state}) — polyline from National Rivers Project (NRP).\r\n// ${coords.length} points, stitched from ${fs_.length} NRP segments.\r\n// Access points render from Supabase at runtime.\r\n\r\nexport const accessPoints: AccessPoint[] = []\r\n\r\nexport const sections: RiverSection[] = []\r\n\r\nexport const riverPath: [number, number][] = [\r\n${coords.map(([lng, lat]) => `  [${lng.toFixed(4)}, ${lat.toFixed(4)}],`).join('\r\n')}\r\n]\r\n`

      fs.writeFileSync(path.join(MAPS_DIR, `${e.id}.ts`), content)
      createdIds.push(e.id)
      created++
    }
  }

  // Register new files in index.ts registry object.
  if (createdIds.length) {
    let indexSrc = fs.readFileSync(INDEX_FILE, 'utf8')
    const registered = existingRegistry(indexSrc)
    const toAdd = createdIds.filter(id => !registered.has(id)).sort()
    if (toAdd.length) {
      const closeMatch = indexSrc.match(/\}\s*(\r?\n)+\s*export function hasRiverMap/)
      if (!closeMatch) {
        console.error('!! registry close not found in index.ts')
      } else {
        const before = indexSrc.slice(0, closeMatch.index)
        const after = indexSrc.slice(closeMatch.index)
        indexSrc = before + toAdd.map(entryBlock).join('') + after
        fs.writeFileSync(INDEX_FILE, indexSrc)
        console.log(`Registered ${toAdd.length} new entries in index.ts`)
      }
    }
  }

  console.log(`\nCreated ${created} map files`)
  console.log(`  already existed: ${alreadyExists}`)
  console.log(`  skipped (too few coords): ${tooShort}`)
}

main()
