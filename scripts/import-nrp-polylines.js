#!/usr/bin/env node
// Pull NRP FloatableReaches (layer 0, polylines) and create
// data/river-maps/<id>.ts files for any matched river that doesn't
// already have one. Does NOT overwrite existing polylines.
//
// Also updates data/river-maps/index.ts to register the new files.

const fs = require('fs')
const https = require('https')
const path = require('path')

const REPO = path.resolve(__dirname, '..')
const MAPS_DIR = path.join(REPO, 'data', 'river-maps')
const INDEX_FILE = path.join(MAPS_DIR, 'index.ts')

const NRP_POLY = 'https://services5.arcgis.com/8lwfLbGBq2iCHgYd/arcgis/rest/services/NRRD_062818/FeatureServer/0/query'

// State field is alphabetical 1-50 in NRP.
const STATE_ORDER = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
]

function getOnce(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'RiverScout-NRPImport/1.0' }, timeout: 60000 }, res => {
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => resolve({ status: res.statusCode, body: data }))
    })
    req.on('error', reject)
    req.on('timeout', () => { req.destroy(new Error('timeout')) })
  })
}

async function get(url) {
  let lastErr
  for (let attempt = 0; attempt < 4; attempt++) {
    try { return await getOnce(url) }
    catch (e) {
      lastErr = e
      await new Promise(r => setTimeout(r, 2000 * (attempt + 1)))
    }
  }
  throw lastErr
}

function normalizeName(s) {
  return s.toLowerCase()
    .replace(/\bthe\s+/g, '')
    .replace(/[,()'"]/g, '')
    .replace(/\s+river\b/g, '')
    .replace(/\s+creek\b/g, '')
    .replace(/\s+fork\b/g, ' fork')
    .replace(/\s+/g, ' ')
    .trim()
}

function buildRiverIndex() {
  const src = fs.readFileSync(path.join(REPO, 'data', 'rivers.ts'), 'utf8')
  const re = /id:\s*'([a-z0-9_]+)',\s*n:\s*'([^']+)'[\s\S]{0,600}?abbr:\s*'([A-Z]{2})'/g
  const byKey = new Map()
  const byId = new Map()
  let m
  while ((m = re.exec(src))) {
    const id = m[1]
    const name = m[2]
    const abbr = m[3]
    byId.set(id, { name, abbr })
    byKey.set(normalizeName(name), id)
    const first = normalizeName(name).split(' ')[0]
    if (first.length >= 5 && !byKey.has(first)) byKey.set(first, id)
  }
  return { byKey, byId }
}

async function fetchStatePolylines(stateIdx) {
  const url = `${NRP_POLY}?where=State%3D${stateIdx}&outFields=GNIS_River_Name&returnGeometry=true&f=geojson&outSR=4326&resultRecordCount=2000`
  const { status, body } = await get(url)
  if (status !== 200) return []
  try {
    return (JSON.parse(body).features || [])
  } catch { return [] }
}

function stitchPolyline(features) {
  // Each NRP polyline feature is a LineString or MultiLineString.
  // For simple display we concatenate all segments sorted by whichever
  // endpoint chains to the next. Good enough for a visual. If the
  // features aren't in order, the rendered line may have jumps; we
  // accept that for the initial import.
  const coords = []
  for (const f of features) {
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

function existingRegistryIds(src) {
  const re = /^\s+([a-z0-9_]+):\s*\(\)\s*=>\s*import\(/gm
  const out = new Set()
  let m
  while ((m = re.exec(src))) out.add(m[1])
  return out
}

function registryEntry(id) {
  return `  ${id}: () => import('./${id}').then(m => ({\n    accessPoints: m.accessPoints,\n    sections: m.sections,\n    riverPath: m.riverPath,\n  })),\n`
}

async function main() {
  const { byKey, byId } = buildRiverIndex()
  const needsPoly = require('c:/tmp/rivers-needing-polyline.json')
    .filter(([, kind]) => kind === 'NOFILE')
    .map(([id]) => id)
  const needSet = new Set(needsPoly)

  process.stderr.write(`Need polylines for ${needSet.size} rivers.\n`)

  // Build state-index for each target river.
  const byState = {}
  for (const id of needSet) {
    const info = byId.get(id)
    if (!info) continue
    const stateIdx = STATE_ORDER.indexOf(info.abbr) + 1
    if (stateIdx < 1) continue
    ;(byState[stateIdx] = byState[stateIdx] || []).push(id)
  }

  // For each state that has target rivers, fetch all polylines then
  // group by River_Name and match to our river_ids.
  const byRiverId = {}
  for (const [stateIdx, ids] of Object.entries(byState)) {
    process.stderr.write(`  state ${stateIdx} (${ids.length} target rivers)...\n`)
    const feats = await fetchStatePolylines(Number(stateIdx))
    const byNRPName = {}
    for (const f of feats) {
      const n = f.properties.GNIS_River_Name || f.properties.River_Name
      if (!n) continue
      ;(byNRPName[n] = byNRPName[n] || []).push(f)
    }
    for (const [nrpName, fs_] of Object.entries(byNRPName)) {
      let ourId = byKey.get(normalizeName(nrpName))
      if (!ourId) {
        const first = normalizeName(nrpName).split(' ')[0]
        if (first.length >= 5) ourId = byKey.get(first)
      }
      if (!ourId || !needSet.has(ourId)) continue
      byRiverId[ourId] = fs_
    }
    await new Promise(r => setTimeout(r, 300))
  }

  // Write the new map files.
  let created = 0
  for (const [id, feats] of Object.entries(byRiverId)) {
    const coords = stitchPolyline(feats)
    if (coords.length < 2) continue
    const info = byId.get(id) || {}
    const content = `import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// ${info.name || id} — polyline from National Rivers Project (NRP).
// ${coords.length} points, stitched from ${feats.length} NRP segments.

export const accessPoints: AccessPoint[] = []

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
${coords.map(([lng, lat]) => `  [${lng.toFixed(4)}, ${lat.toFixed(4)}],`).join('\n')}
]
`
    const file = path.join(MAPS_DIR, `${id}.ts`)
    fs.writeFileSync(file, content)
    created++
  }

  // Register in index.ts. Insert new entries alphabetically into the
  // registry object.
  let indexSrc = fs.readFileSync(INDEX_FILE, 'utf8')
  const existing = existingRegistryIds(indexSrc)
  const toAdd = Object.keys(byRiverId).filter(id => !existing.has(id)).sort()
  if (toAdd.length) {
    // Simple approach: append all new entries before the closing `}`
    // of the registry object. The registry isn't meaningfully sorted
    // currently, so order doesn't matter functionally.
    // Registry object ends at the first `}\n` that precedes `export
    // function hasRiverMap`. Match loosely to survive CRLF.
    const match = indexSrc.match(/\}\s*(\r?\n)+\s*export function hasRiverMap/)
    if (match) {
      const closeIdx = match.index
      const before = indexSrc.slice(0, closeIdx)
      const after = indexSrc.slice(closeIdx)
      indexSrc = before + toAdd.map(registryEntry).join('') + after
      fs.writeFileSync(INDEX_FILE, indexSrc)
    }
  }

  console.log(`\nCreated ${created} river-map files with NRP polylines`)
  console.log(`Registered ${toAdd.length} new entries in index.ts`)

  // List any target rivers that got NO polyline (NRP didn't cover them)
  const missing = [...needSet].filter(id => !byRiverId[id])
  console.log(`\n${missing.length} rivers had access points but no polyline:`)
  for (const id of missing.slice(0, 20)) console.log(`  ${id}`)
  if (missing.length > 20) console.log(`  ... and ${missing.length - 20} more`)
}

main().catch(e => { console.error(e); process.exit(1) })
