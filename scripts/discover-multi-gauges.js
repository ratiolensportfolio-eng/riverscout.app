#!/usr/bin/env node
// Find rivers in our catalog that have 2+ active USGS gauges on
// the same physical river. For each: emit a multi-gauge seed block
// (delete + N inserts) ready to append to
// supabase/seeds/river_gauges_seed.sql.
//
// Algorithm per river:
//   1. Normalize the river name (strip "River", "Creek", common
//      prefixes/suffixes).
//   2. Query active USGS stream gauges in the river's state.
//   3. Keep candidates whose station name contains the normalized
//      river name as a whole word.
//   4. Verify each candidate returns live discharge data (last 2h).
//   5. If >= 2 distinct candidates remain → emit a seed block.
//   6. Mark the river's existing g as is_primary=true; add the
//      others as is_primary=false.
//
// Output:
//   c:/tmp/multi-gauge-discovery.json — full per-river breakdown
//   c:/tmp/multi-gauge-seed.sql       — concatenated SQL ready to
//                                        review + paste

const fs = require('fs')
const https = require('https')
const path = require('path')

const REPO = path.resolve(__dirname, '..')
const OUT_JSON = 'c:/tmp/multi-gauge-discovery.json'
const OUT_SQL  = 'c:/tmp/multi-gauge-seed.sql'

// Already-seeded rivers (skip — they're in supabase/seeds/river_gauges_seed.sql).
const ALREADY_SEEDED = new Set([
  'ausable', 'manistee', 'muskegon', 'pere_marquette',
  'gauley', 'new_river', 'colorado', 'grand_on', 'muskingum_oh',
])

function get(url, timeout = 25000) {
  return new Promise(resolve => {
    const req = https.get(url, { timeout, headers: { 'User-Agent': 'RiverScout-MultiGauge/1.0' } }, res => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => resolve({ status: res.statusCode, body: d }))
    })
    req.on('error', () => resolve({ status: 0, body: '' }))
    req.on('timeout', () => { req.destroy(); resolve({ status: 0, body: '' }) })
  })
}

function loadRivers() {
  const src = fs.readFileSync(path.join(REPO, 'data', 'rivers.ts'), 'utf8')
  const stateRe = /^  ([a-z]+): \{$/gm
  const matches = [...src.matchAll(stateRe)]
  const rivers = []
  for (let i = 0; i < matches.length; i++) {
    const stateKey = matches[i][1]
    const start = matches[i].index
    const end = i + 1 < matches.length ? matches[i + 1].index : src.length
    const block = src.slice(start, end)
    const entries = block.split(/\n\s*\{\s*id: '/).slice(1)
    for (const e of entries) {
      const id = e.match(/^([a-z0-9_]+)'/)?.[1]
      const n = e.match(/n:\s*'([^']+)'/)?.[1]
      const g = e.match(/g:\s*'([^']*)'/)?.[1] ?? ''
      const abbr = e.match(/abbr:\s*'([A-Z]{2})'/)?.[1] ?? stateKey.toUpperCase()
      const gaugeSource = e.match(/gaugeSource:\s*'([^']+)'/)?.[1] ?? 'usgs'
      if (id && g && gaugeSource === 'usgs') rivers.push({ id, n, g, abbr, stateKey })
    }
  }
  return rivers
}

// Tokenize a river name into the words that MUST appear in the
// station-name prefix. Keeps Big/Little/North/etc qualifiers — a
// "Little Muskegon" entry should NOT match plain "Muskegon River"
// stations. Drops only the generic suffix (River/Creek/Fork/Branch).
function riverNameTokens(s) {
  return s.toLowerCase()
    .replace(/[\u2019']/g, '')
    .replace(/^the\s+/, '')
    .replace(/\s+(river|creek|fork|branch)\b.*$/, '')
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ').trim()
    .split(' ').filter(w => w.length >= 2)
}

// Match the river name in the PREFIX of the station name (before
// the AT/NEAR/BELOW/ABOVE connector). USGS station names follow
// "<RIVER_NAME> (AT|NEAR|BELOW|ABOVE) <LOCATION>, <STATE>" — so
// the prefix is the river. Substring match in the location half
// produced bad matches like "ST. CLAIR RIVER AT PORT HURON"
// matching "huron".
function stationMatchesRiver(stationName, tokens) {
  const upper = stationName.toUpperCase()
  // Prefix = everything before the first AT/NEAR/BELOW/ABOVE.
  const m = upper.match(/^(.+?)\s+(?:AT|NEAR|BELOW|ABOVE|BL|NR|AB)\s+/)
  const prefix = m ? m[1] : upper.split(',')[0]
  // ALL tokens must appear as whole words in the prefix.
  return tokens.every(t => new RegExp(`\\b${t.toUpperCase()}\\b`).test(prefix))
}

const stateActiveCache = new Map()
async function activeStateGauges(stateAbbr) {
  if (stateActiveCache.has(stateAbbr)) return stateActiveCache.get(stateAbbr)
  const url = `https://waterservices.usgs.gov/nwis/site/?format=rdb&stateCd=${stateAbbr.toLowerCase()}&siteStatus=active&siteType=ST&hasDataTypeCd=iv`
  const { status, body } = await get(url)
  if (status !== 200) { stateActiveCache.set(stateAbbr, []); return [] }
  const lines = body.split('\n').filter(l => l && !l.startsWith('#'))
  if (lines.length < 3) { stateActiveCache.set(stateAbbr, []); return [] }
  const cols = lines[0].split('\t')
  const iId = cols.indexOf('site_no'), iName = cols.indexOf('station_nm')
  const iLat = cols.indexOf('dec_lat_va'), iLng = cols.indexOf('dec_long_va')
  const out = []
  for (const l of lines.slice(2)) {
    const c = l.split('\t')
    if (!c[iId] || !c[iName]) continue
    out.push({ site_no: c[iId], station_nm: c[iName], lat: parseFloat(c[iLat]), lng: parseFloat(c[iLng]) })
  }
  stateActiveCache.set(stateAbbr, out)
  return out
}

async function liveDischarge(siteIds) {
  if (!siteIds.length) return new Set()
  // Batched IV query — single chunk of up to 80 sites.
  const url = `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${siteIds.join(',')}&parameterCd=00060&siteStatus=active&period=PT2H`
  const { status, body } = await get(url)
  if (status !== 200) return new Set()
  const live = new Set()
  try {
    const j = JSON.parse(body)
    for (const ts of j.value?.timeSeries ?? []) {
      const sid = ts.sourceInfo?.siteCode?.[0]?.value
      const vals = ts.values?.[0]?.value || []
      const last = vals[vals.length - 1]
      if (sid && last && last.value && last.value !== '-999999') live.add(sid)
    }
  } catch { /* fall through — no sites confirmed live */ }
  return live
}

// Haversine distance in miles. Used to drop candidates that match
// the river name but are on a different physical river (e.g. the
// 4 distinct "Pine River"s in MI all have the right name).
function distMi(a, b) {
  const R = 3958.8, toRad = d => d * Math.PI / 180
  const dLat = toRad(b[0] - a[0]), dLng = toRad(b[1] - a[1])
  const x = Math.sin(dLat/2)**2 + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng/2)**2
  return 2 * R * Math.asin(Math.sqrt(x))
}

function inferSection(stationName) {
  // Pull the "near X" / "at X" / "below X" tail for a friendly section
  // label. Falls back to the bare station name when no preposition.
  const m = stationName.match(/\b(?:near|at|below|above)\s+(.+?)(?:,\s*[A-Z]{2})?$/i)
  if (m) return `${m[0].split(/\s/)[0]} ${m[1].trim()}`.replace(/^\w/, c => c.toUpperCase())
  return stationName
}
function escSql(s) { return (s || '').replace(/'/g, "''").replace(/\s*[\r\n]+\s*/g, ' ').trim() }

async function main() {
  const rivers = loadRivers().filter(r => !ALREADY_SEEDED.has(r.id))
  process.stderr.write(`Auditing ${rivers.length} USGS-gauged rivers (skipping ${ALREADY_SEEDED.size} already seeded)\n`)

  const proposals = []
  let i = 0
  for (const r of rivers) {
    i++
    if (i % 50 === 0) process.stderr.write(`  ${i}/${rivers.length}...\n`)
    const tokens = riverNameTokens(r.n)
    if (!tokens.length || tokens.join('').length < 4) continue  // skip too-generic
    const stateGauges = await activeStateGauges(r.abbr)
    if (!stateGauges.length) continue
    let candidates = stateGauges.filter(g => stationMatchesRiver(g.station_nm, tokens))
    if (candidates.length < 2) continue

    // Distance gate: drop candidates more than 30 mi from the river's
    // primary gauge. Catches the "multiple Pine Rivers in one state"
    // case — same name, different physical rivers spread across the
    // state. Only applied when we actually know the primary's coords.
    const primaryStation = candidates.find(c => c.site_no === r.g)
    if (primaryStation && isFinite(primaryStation.lat) && isFinite(primaryStation.lng)) {
      const pCoord = [primaryStation.lat, primaryStation.lng]
      candidates = candidates.filter(c =>
        c.site_no === r.g ||
        (isFinite(c.lat) && isFinite(c.lng) && distMi(pCoord, [c.lat, c.lng]) <= 30)
      )
      if (candidates.length < 2) continue
    } else {
      // No primary coords known — be conservative and skip rather
      // than risk merging unrelated rivers.
      continue
    }

    // Confirm live discharge — drop candidates with no recent data.
    const liveSet = await liveDischarge(candidates.map(c => c.site_no).slice(0, 80))
    const liveCands = candidates.filter(c => liveSet.has(c.site_no) || c.site_no === r.g)
    if (liveCands.length < 2) continue

    // Make sure the river's primary gauge is included as primary
    const primary = liveCands.find(c => c.site_no === r.g) ?? liveCands[0]
    const others = liveCands.filter(c => c.site_no !== primary.site_no).slice(0, 4)  // cap at 5 total

    proposals.push({
      river: r,
      primary,
      others,
    })
    await new Promise(res => setTimeout(res, 150))
  }

  fs.writeFileSync(OUT_JSON, JSON.stringify(proposals, null, 2))

  // Build SQL
  const sql = [
    '-- Multi-gauge seed (auto-generated by scripts/discover-multi-gauges.js)',
    `-- ${new Date().toISOString().slice(0, 10)} — ${proposals.length} rivers with 2+ live USGS gauges`,
    '--',
    '-- Append (or paste) into supabase/seeds/river_gauges_seed.sql',
    '-- inside the existing begin;..commit; block.',
    '',
  ]
  for (const p of proposals) {
    sql.push(`-- ${p.river.n} (${p.river.abbr}) — ${1 + p.others.length} gauges`)
    sql.push(`delete from public.river_gauges where river_id = '${p.river.id}';`)
    const all = [{ ...p.primary, isPrimary: true }, ...p.others.map(o => ({ ...o, isPrimary: false }))]
    for (const g of all) {
      const section = escSql(inferSection(g.station_nm))
      const name = escSql(g.station_nm)
      sql.push(
        `insert into public.river_gauges (river_id, gauge_id, gauge_name, gauge_source, river_section, lat, lng, is_primary) values (` +
        `'${p.river.id}', '${g.site_no}', '${name}', 'usgs', '${section}', ${g.lat?.toFixed(4) ?? 'null'}, ${g.lng?.toFixed(4) ?? 'null'}, ${g.isPrimary});`
      )
    }
    sql.push('')
  }
  fs.writeFileSync(OUT_SQL, sql.join('\n'))
  process.stderr.write(`\nProposed ${proposals.length} rivers for multi-gauge seeding.\n`)
  process.stderr.write(`Preview JSON: ${OUT_JSON}\nSeed SQL: ${OUT_SQL}\n`)
}
main().catch(e => { console.error(e); process.exit(1) })
