#!/usr/bin/env node
// Import access point GPS coordinates from government APIs.
// Sources: MT FWP, CO BLM. Each returns exact survey GPS.
// NEVER fabricate coordinates. If an API doesn't return data
// for a river, leave it empty.

const fs = require('fs')
const path = require('path')
const MAPS = path.resolve(__dirname, '..', 'data', 'river-maps')

// PROTECTED rivers — never overwrite
const PROTECTED = new Set(['pine_mi','jordan','platte_mi','pere_marquette','ausable'])

// ── MT FWP Fishing Access Sites ──────────────────────────────
const MT_URL = 'https://services3.arcgis.com/Cdxz8r11hT0MGzg1/arcgis/rest/services/FWPLND_FAS_POINTS/FeatureServer/0/query'
const MT_WATER_MAP = {
  'Madison River': 'madison',
  'Gallatin River': 'gallatin',
  'Yellowstone River': 'yellowstone',
  'Missouri River': 'missouri_mt',
  'Flathead River': 'flathead',
  'Blackfoot River': 'blackfoot',
  'Bitterroot River': 'bitterroot',
  'Clark Fork River': 'clarks_fork',
  'Big Hole River': 'big_hole',
  'Smith River': 'smith',
  'Rock Creek': 'rock_creek_mt',
  'Ruby River': 'ruby',
  'Boulder River': 'boulder_mt',
  'Stillwater River': 'stillwater',
}

// ── CO BLM Recreation Sites (Boat Ramps) ─────────────────────
const CO_URL = 'https://gis.blm.gov/coarcgis/rest/services/recreation/BLM_CO_Recreation/MapServer/1/query'
const CO_WATER_MAP = {
  'Arkansas River': 'arkansas',
  'Colorado River': 'colorado_co',
  'Gunnison River': 'gunnison',
  'Yampa River': 'yampa',
  'Green River': 'green_ut',
  'Dolores River': 'dolores',
  'Rio Grande': 'rio_grande_co',
  'South Platte River': 'south_platte',
  'Cache la Poudre River': 'cache_la_poudre',
  'Roaring Fork River': 'roaring_fork',
}

async function fetchAll(url, params) {
  const all = []
  let offset = 0
  while (true) {
    const fullUrl = `${url}?${params}&resultRecordCount=1000&resultOffset=${offset}&f=json`
    const res = await fetch(fullUrl)
    const data = await res.json()
    if (data.error) { console.log('  API error:', data.error.message); break }
    const features = data.features || []
    all.push(...features)
    if (features.length < 1000) break
    offset += 1000
    await new Promise(r => setTimeout(r, 500))
  }
  return all
}

function writeAccessPoints(riverId, sites, source) {
  if (PROTECTED.has(riverId)) { console.log('  PROTECTED (skip):', riverId); return false }
  const filePath = path.join(MAPS, riverId + '.ts')
  if (!fs.existsSync(filePath)) { console.log('  NO MAP FILE:', riverId); return false }

  let src = fs.readFileSync(filePath, 'utf8')

  // Sort by longitude (generally upstream to downstream)
  sites.sort((a, b) => a.lng - b.lng)

  const apLines = sites.map(s =>
    `  { name: '${s.name.replace(/'/g, '')}', lat: ${s.lat}, lng: ${s.lng}, type: 'access', description: '${source}. ${(s.desc || '').replace(/'/g, '')}' },`
  ).join('\n')

  src = src.replace(
    /export const accessPoints: AccessPoint\[\] = \[[\s\S]*?\]/,
    `export const accessPoints: AccessPoint[] = [\n${apLines}\n]`
  )

  fs.writeFileSync(filePath, src)
  return true
}

async function importMT() {
  console.log('\n=== MT FWP Fishing Access Sites ===')
  const features = await fetchAll(MT_URL, 'where=1%3D1&outFields=NAME,BOAT_FAC,LATITUDE,LONGITUDE&returnGeometry=true&outSR=4326')
  console.log('Total MT features:', features.length)

  // No WaterBody field — match by proximity to our MT rivers
  let RIVER_COORDS, ALL_RIVERS
  try {
    RIVER_COORDS = require(path.resolve(__dirname, '..', 'data', 'river-coordinates.ts').replace('.ts', '')).RIVER_COORDS
  } catch {
    // TS file — parse manually
    const coordSrc = fs.readFileSync(path.resolve(__dirname, '..', 'data', 'river-coordinates.ts'), 'utf8')
    RIVER_COORDS = {}
    for (const m of coordSrc.matchAll(/(\w+):\s*\[([-\d.]+),\s*([-\d.]+)\]/g)) {
      RIVER_COORDS[m[1]] = [parseFloat(m[2]), parseFloat(m[3])]
    }
  }
  const riversSrc = fs.readFileSync(path.resolve(__dirname, '..', 'data', 'rivers.ts'), 'utf8')
  const mtRiverIds = [...riversSrc.matchAll(/id:\s*'([^']+)'[^}]*?stateKey:\s*'mt'/g)].map(m => m[1])
  // Also grab rivers whose abbr is MT
  const mtRiverIds2 = [...riversSrc.matchAll(/id:\s*'([^']+)'[^}]*?abbr:\s*'MT'/g)].map(m => m[1])
  const mtIds = new Set([...mtRiverIds, ...mtRiverIds2])

  function haversine(lat1, lng1, lat2, lng2) {
    const R = 3958.8; const toRad = d => d * Math.PI / 180
    const dLat = toRad(lat2-lat1); const dLng = toRad(lng2-lng1)
    const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLng/2)**2
    return 2 * R * Math.asin(Math.sqrt(a))
  }

  const byRiver = new Map()
  for (const f of features) {
    const lat = f.attributes?.LATITUDE || f.geometry?.y
    const lng = f.attributes?.LONGITUDE || f.geometry?.x
    if (!lat || !lng) continue
    if (f.attributes?.BOAT_FAC === 'No Boat Facilities') continue

    let bestRiver = null, bestDist = Infinity
    for (const rid of mtIds) {
      const coord = RIVER_COORDS[rid]
      if (!coord) continue
      const d = haversine(lat, lng, coord[0], coord[1])
      if (d < bestDist) { bestDist = d; bestRiver = rid }
    }
    if (bestRiver && bestDist < 15) {
      if (!byRiver.has(bestRiver)) byRiver.set(bestRiver, [])
      byRiver.get(bestRiver).push({
        name: (f.attributes.NAME || 'Unnamed').trim(),
        lat, lng,
        desc: (f.attributes.BOAT_FAC || '').trim(),
      })
    }
  }

  let updated = 0
  for (const [rid, sites] of byRiver) {
    if (writeAccessPoints(rid, sites, 'MT FWP FAS')) {
      console.log('  UPDATED:', rid, '—', sites.length, 'sites')
      updated++
    }
  }
  console.log('MT total updated:', updated)
}

async function importCO() {
  console.log('\n=== CO BLM Boat Ramps ===')
  const features = await fetchAll(CO_URL, 'where=FET_SUBTYPE%3D%27Boat+Ramp%27&outFields=FET_NAME,DESCRIPTION,UNIT_NAME,LAT,LONG&returnGeometry=true&outSR=4326')
  console.log('Total CO BLM features:', features.length)

  // CO BLM doesn't have a WaterBody field — match by proximity
  // to our river coordinates
  // Parse coordinates from TS file
  const coordSrc = fs.readFileSync(path.resolve(__dirname, '..', 'data', 'river-coordinates.ts'), 'utf8')
  const RIVER_COORDS = {}
  for (const m of coordSrc.matchAll(/(\w+):\s*\[([-\d.]+),\s*([-\d.]+)\]/g)) {
    RIVER_COORDS[m[1]] = [parseFloat(m[2]), parseFloat(m[3])]
  }
  const riversSrc = fs.readFileSync(path.resolve(__dirname, '..', 'data', 'rivers.ts'), 'utf8')
  const coRiverIds = [...riversSrc.matchAll(/id:\s*'([^']+)'[^}]*?abbr:\s*'CO'/g)].map(m => m[1])
  const coRivers = coRiverIds.map(id => ({ id }))

  function haversine(lat1, lng1, lat2, lng2) {
    const R = 3958.8
    const toRad = d => d * Math.PI / 180
    const dLat = toRad(lat2 - lat1)
    const dLng = toRad(lng2 - lng1)
    const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLng/2)**2
    return 2 * R * Math.asin(Math.sqrt(a))
  }

  // For each BLM site, find the nearest CO river within 10 miles
  const byRiver = new Map()
  for (const f of features) {
    const lat = f.attributes?.LAT || f.geometry?.y
    const lng = f.attributes?.LONG || f.geometry?.x
    if (!lat || !lng) continue

    let bestRiver = null, bestDist = Infinity
    for (const r of coRivers) {
      const coord = RIVER_COORDS[r.id]
      if (!coord) continue
      const d = haversine(lat, lng, coord[0], coord[1])
      if (d < bestDist) { bestDist = d; bestRiver = r.id }
    }
    if (bestRiver && bestDist < 10) {
      if (!byRiver.has(bestRiver)) byRiver.set(bestRiver, [])
      byRiver.get(bestRiver).push({
        name: (f.attributes.FET_NAME || 'BLM Boat Ramp').trim(),
        lat, lng,
        desc: (f.attributes.DESCRIPTION || '').trim(),
      })
    }
  }

  let updated = 0
  for (const [rid, sites] of byRiver) {
    if (writeAccessPoints(rid, sites, 'BLM Colorado')) {
      console.log('  UPDATED:', rid, '—', sites.length, 'sites')
      updated++
    }
  }
  console.log('CO total updated:', updated)
}

async function main() {
  try { await importMT() } catch (e) { console.error('MT error:', e.message) }
  try { await importCO() } catch (e) { console.error('CO error:', e.message) }
}

main().catch(console.error)
