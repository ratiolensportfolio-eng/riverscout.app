#!/usr/bin/env node
// Bulk-import access points from the National Rivers Project ArcGIS
// Feature Service, matched by river name to our river_id list.
//
// Source: https://services5.arcgis.com/8lwfLbGBq2iCHgYd/arcgis/rest/
//         services/NRRD_062818/FeatureServer/2  (River_Access_Sites)
//
// Output:
//   - supabase/seeds/access_points_nrp.sql (wipes + inserts per matched river)
//   - data/river-maps/<id>.ts updated for each matched river
//   - /tmp/nrp-import-report.json with match stats
//
// Excludes rivers that already have hand-verified coords so we don't
// clobber the PRPC owner's data:
const EXCLUDE = new Set([
  'pere_marquette',
  'ausable',
  'pine_mi',
  'manistee',
])

const fs = require('fs')
const https = require('https')
const path = require('path')

const REPO = path.resolve(__dirname, '..')
const MAPS_DIR = path.join(REPO, 'data', 'river-maps')
const SQL_OUT = path.join(REPO, 'supabase', 'seeds', 'access_points_nrp.sql')
const REPORT_OUT = 'c:/tmp/nrp-import-report.json'

const NRP_ROOT = 'https://services5.arcgis.com/8lwfLbGBq2iCHgYd/arcgis/rest/services/NRRD_062818/FeatureServer/2/query'

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'RiverScout-NRPImport/1.0' } }, res => {
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => resolve({ status: res.statusCode, body: data }))
    }).on('error', reject)
  })
}

async function fetchAllStates() {
  // NRP caps at 2000 per request. Pull by state (max 50 calls) so
  // each response stays small and we never hit the ceiling.
  const all = []
  for (let state = 1; state <= 50; state++) {
    const url = `${NRP_ROOT}?where=State%3D${state}&outFields=*&returnGeometry=true&f=geojson&outSR=4326&resultRecordCount=2000`
    process.stderr.write(`  state ${state}...`)
    const { status, body } = await get(url)
    if (status !== 200) { process.stderr.write(` FAIL\n`); continue }
    try {
      const json = JSON.parse(body)
      const feats = json.features || []
      process.stderr.write(` ${feats.length}\n`)
      all.push(...feats)
    } catch { process.stderr.write(` parse fail\n`) }
    await new Promise(r => setTimeout(r, 300))
  }
  return all
}

// ── River-name matcher ──────────────────────────────────────────────
// Build a map from normalized river names to our river_id. NRP names
// look like "Pere Marquette River" or "Flathead, Middle Fork" — we
// strip "River"/punctuation and handle the fork suffix.

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
  const re = /id:\s*'([a-z0-9_]+)',\s*n:\s*'([^']+)'/g
  const byName = new Map()
  let m
  while ((m = re.exec(src))) {
    const id = m[1]
    const name = m[2]
    byName.set(normalizeName(name), id)
    // Also index by the first word for coarse fallback match
    const first = normalizeName(name).split(' ')[0]
    if (first.length >= 5 && !byName.has(first)) byName.set(first, id)
  }
  return byName
}

// ── Access-type mapping ─────────────────────────────────────────────
// NRP Access_Type uses small integer codes. We don't have the code
// table, so infer from Put_In/Take_Out flags and map to our enum.
function inferAccessType(f) {
  const p = f.properties
  // "put-in" / "take-out" / "access" / "portage" / "campsite"
  // NRP has 0/1 flags for Put_In and Take_Out on every site.
  // We can't distinguish put-in vs take-out for middle sites (most
  // are tagged both), so default to 'access' when both are true.
  if (p.Put_In === 1 && p.Take_Out === 0) return 'carry_in'
  if (p.Take_Out === 1 && p.Put_In === 0) return 'carry_in'
  return 'carry_in'  // default — we don't have enough info to pick boat_ramp vs carry_in
}

// Strip CR/LF inside any text we emit — NRP fields sometimes have
// trailing newlines that broke the Vercel build (san_juan.ts).
function clean(s) {
  if (s == null) return null
  return String(s).replace(/\s*[\r\n]+\s*/g, ' ').trim() || null
}

function buildDescription(f) {
  const p = f.properties
  const bits = []
  if (p.Access_Site_Management2) bits.push(clean(p.Access_Site_Management2))
  const amenities = []
  if (p.Restrooms === 1) amenities.push('restrooms')
  if (p.Parking && p.Parking !== 'No') {
    const parkClean = clean(p.Parking)
    if (parkClean) amenities.push(`parking: ${parkClean.toLowerCase()}`)
  }
  if (p.Fee === 1) amenities.push('fee')
  if (amenities.length) bits.push(amenities.join(', '))
  return bits.filter(Boolean).join(' \u2014 ') || null
}

function pinType(f) {
  const p = f.properties
  if (p.Put_In === 1 && p.Take_Out === 0) return 'put-in'
  if (p.Take_Out === 1 && p.Put_In === 0) return 'take-out'
  return 'access'
}

async function main() {
  process.stderr.write('Fetching all NRP access sites per state...\n')
  const all = await fetchAllStates()
  process.stderr.write(`\nTotal NRP features: ${all.length}\n`)

  const riverIndex = buildRiverIndex()
  process.stderr.write(`Our river name index: ${riverIndex.size} entries\n`)

  const byOurId = {}
  const unmatched = new Map()
  for (const f of all) {
    const nrpName = f.properties.River_Name
    if (!nrpName) continue
    const key = normalizeName(nrpName)
    let ourId = riverIndex.get(key)
    if (!ourId) {
      // Try the first word as a fallback
      const first = key.split(' ')[0]
      if (first.length >= 5) ourId = riverIndex.get(first)
    }
    if (!ourId) {
      unmatched.set(nrpName, (unmatched.get(nrpName) || 0) + 1)
      continue
    }
    if (EXCLUDE.has(ourId)) continue
    ;(byOurId[ourId] = byOurId[ourId] || []).push(f)
  }

  process.stderr.write(`Matched to ${Object.keys(byOurId).length} of our rivers\n`)

  // ── Generate SQL ─────────────────────────────────────────────────
  const sql = [
    '-- access_points_nrp.sql',
    '--',
    `-- Generated ${new Date().toISOString().slice(0,10)} by scripts/import-nrp-access-points.js.`,
    '--',
    '-- Bulk import from National Rivers Project ArcGIS Feature Service',
    '-- (https://nationalriversproject.com). Access sites matched by river',
    `-- name to our ${Object.keys(byOurId).length} rivers. Rivers with hand-verified`,
    `-- coords are skipped: ${Array.from(EXCLUDE).join(', ')}.`,
    '--',
    '-- Per river: wipes existing rows, inserts NRP set. Re-run whenever',
    '-- NRP updates or our exclusion list changes.',
    '',
    'begin;',
    '',
  ]

  for (const [id, feats] of Object.entries(byOurId)) {
    sql.push(`-- ${id}: ${feats.length} sites from NRP`)
    sql.push(`delete from public.river_access_points where river_id = '${id}';`)
    for (const f of feats) {
      const [lng, lat] = f.geometry.coordinates
      const p = f.properties
      const name = (clean(p.Site_Name) || '').replace(/'/g, "''")
      if (!name) continue
      const desc = (buildDescription(f) || '').replace(/'/g, "''")
      const accessType = inferAccessType(f)
      sql.push(
        `insert into public.river_access_points (river_id, name, description, access_type, lat, lng, submitted_by_name, verified, verification_status, last_verified_at, last_verified_by) values ('${id}', '${name}', ${desc ? `'${desc}'` : 'null'}, '${accessType}', ${lat.toFixed(5)}, ${lng.toFixed(5)}, 'NationalRiversProject', true, 'verified', now(), 'National Rivers Project ArcGIS Feature Service');`
      )
    }
    sql.push('')
  }
  sql.push('commit;')
  sql.push('')
  fs.writeFileSync(SQL_OUT, sql.join('\n'))

  // ── Update static river-map files ────────────────────────────────
  let mapUpdates = 0
  for (const [id, feats] of Object.entries(byOurId)) {
    const mapFile = path.join(MAPS_DIR, `${id}.ts`)
    if (!fs.existsSync(mapFile)) continue
    const src = fs.readFileSync(mapFile, 'utf8')
    const re = /export const accessPoints: AccessPoint\[\]\s*=\s*\[[\s\S]*?\]/
    if (!re.test(src)) continue
    const entries = feats.map(f => {
      const [lng, lat] = f.geometry.coordinates
      const p = f.properties
      const name = (clean(p.Site_Name) || '').replace(/'/g, "\\'")
      if (!name) return null
      const desc = (buildDescription(f) || '').replace(/'/g, "\\'")
      const type = pinType(f)
      return `  { name: '${name}', lat: ${lat.toFixed(5)}, lng: ${lng.toFixed(5)}, type: '${type}'${desc ? `, description: '${desc}'` : ''} },`
    }).filter(Boolean).join('\n')
    const block = entries
      ? `export const accessPoints: AccessPoint[] = [\n${entries}\n]`
      : `export const accessPoints: AccessPoint[] = []`
    fs.writeFileSync(mapFile, src.replace(re, block))
    mapUpdates++
  }

  // ── Report ───────────────────────────────────────────────────────
  const unmatchedSorted = Array.from(unmatched.entries()).sort((a, b) => b[1] - a[1])
  const report = {
    totalNRP: all.length,
    matchedRivers: Object.keys(byOurId).length,
    totalMatchedSites: Object.values(byOurId).reduce((s, a) => s + a.length, 0),
    excluded: Array.from(EXCLUDE),
    mapFilesUpdated: mapUpdates,
    unmatchedRivers: unmatchedSorted.slice(0, 30),
    matchedSiteCountByRiver: Object.fromEntries(
      Object.entries(byOurId).map(([k, v]) => [k, v.length]).sort((a, b) => b[1] - a[1])
    ),
  }
  fs.writeFileSync(REPORT_OUT, JSON.stringify(report, null, 2))

  console.log('')
  console.log(`NRP features fetched:    ${all.length}`)
  console.log(`Rivers matched:          ${Object.keys(byOurId).length} (excluded: ${EXCLUDE.size})`)
  console.log(`Access sites imported:   ${report.totalMatchedSites}`)
  console.log(`Map files updated:       ${mapUpdates}`)
  console.log(`SQL:                     ${SQL_OUT}`)
  console.log(`Report:                  ${REPORT_OUT}`)
  console.log(`Top unmatched NRP river names (candidates we should add as river_ids):`)
  for (const [name, count] of unmatchedSorted.slice(0, 15)) console.log(`  ${count}  ${name}`)
}

main().catch(e => { console.error(e); process.exit(1) })
