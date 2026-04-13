#!/usr/bin/env node
// Parse all supabase/seeds/access_points_*.sql files and populate the
// matching data/river-maps/<river_id>.ts files with an AccessPoint[] array
// so the Maps & Guides tab shows pins. Safe to re-run — it replaces the
// existing accessPoints block each time.
//
// Pin-type inference: sorted by river_mile ascending, first = put-in,
// last = take-out, others = access. Override-able by editing the TS file
// manually afterward; the script won't touch sections or riverPath.

const fs = require('fs')
const path = require('path')

const REPO = path.resolve(__dirname, '..')
const SEEDS_DIR = path.join(REPO, 'supabase', 'seeds')
const MAPS_DIR = path.join(REPO, 'data', 'river-maps')

const seedFiles = fs.readdirSync(SEEDS_DIR)
  .filter(f => f.startsWith('access_points_') && f.endsWith('.sql'))
  .map(f => path.join(SEEDS_DIR, f))

// Each insert in the seed files follows one of two templates — a
// wide-column version and a trimmed version that omits the next-access
// fields. Rather than parse SQL precisely, we extract the `select ...`
// payload line and pick positional fields we care about: river_id, name,
// description, lat, lng, river_mile.
//
// Both templates start the select with:
//   select '<river_id>', '<name>', '<description>',
// and then include lat, lng, and river_mile among the numeric values.
// We rely on the distinctive lat/lng pattern (two decimals like 44.5xxx,
// -85.xxxx) to find the right numbers.

const byRiver = new Map()

for (const file of seedFiles) {
  const sql = fs.readFileSync(file, 'utf8')
  // Match multi-line select statements up to the next-line `where not exists`.
  const re = /select\s+'([a-z0-9_]+)',\s+'((?:[^'\\]|\\.|'')+)',\s+'((?:[^'\\]|\\.|'')+)',([\s\S]*?)where not exists/g
  let m
  while ((m = re.exec(sql)) !== null) {
    const riverId = m[1]
    const name = m[2].replace(/''/g, "'")
    const description = m[3].replace(/''/g, "'")
    const tail = m[4]
    // Find all decimal numbers in the tail. Lat is the first positive
    // decimal in the 20s-60s range, lng is the first negative decimal.
    const numbers = tail.match(/-?\d+\.\d+/g) || []
    let lat = null, lng = null, riverMile = null
    for (const n of numbers) {
      const val = parseFloat(n)
      if (lat === null && val > 20 && val < 72) { lat = val; continue }
      if (lng === null && val < 0 && val > -180) { lng = val; continue }
      if (riverMile === null) { riverMile = val; break }
    }
    if (lat === null || lng === null) continue
    if (!byRiver.has(riverId)) byRiver.set(riverId, [])
    byRiver.get(riverId).push({ name, description, lat, lng, riverMile: riverMile ?? 0 })
  }
}

function pinType(i, total, desc) {
  const d = (desc || '').toLowerCase()
  if (/take[- ]?out|end of|confluence with|mouth (at|of)/.test(d) && i === total - 1) return 'take-out'
  if (/put[- ]?in|start of|headwater/.test(d) && i === 0) return 'put-in'
  if (/portage/.test(d)) return 'portage'
  if (/camp(site|ground)/.test(d) && !/below|above/.test(d)) return 'campsite'
  if (i === 0) return 'put-in'
  if (i === total - 1) return 'take-out'
  return 'access'
}

let updated = 0
let missing = 0
const skipped = []

for (const [riverId, points] of byRiver) {
  points.sort((a, b) => a.riverMile - b.riverMile)
  const mapFile = path.join(MAPS_DIR, `${riverId}.ts`)
  if (!fs.existsSync(mapFile)) {
    skipped.push(riverId)
    missing++
    continue
  }
  const src = fs.readFileSync(mapFile, 'utf8')
  const entries = points.map((pt, i) => {
    const type = pinType(i, points.length, pt.description)
    // Keep descriptions short in the static file — trim to first sentence.
    const shortDesc = pt.description.split(/(?<=[.!?])\s+/)[0]
    const escName = pt.name.replace(/'/g, "\\'")
    const escDesc = shortDesc.replace(/'/g, "\\'")
    return `  { name: '${escName}', lat: ${pt.lat}, lng: ${pt.lng}, type: '${type}', description: '${escDesc}' },`
  }).join('\n')
  const block = `export const accessPoints: AccessPoint[] = [\n${entries}\n]`
  // Replace whether it's empty, single-line, or multi-line.
  const re = /export const accessPoints: AccessPoint\[\]\s*=\s*\[[\s\S]*?\]/
  if (!re.test(src)) {
    skipped.push(`${riverId} (no accessPoints export found)`)
    continue
  }
  const next = src.replace(re, block)
  if (next !== src) {
    fs.writeFileSync(mapFile, next)
    updated++
    console.log(`  ${riverId}: ${points.length} points`)
  }
}

console.log(`\nUpdated ${updated} river-map files.`)
if (missing) console.log(`No matching river-map file for ${missing} river IDs: ${skipped.join(', ')}`)
