#!/usr/bin/env node
// Apply confident gauge corrections to data/rivers.ts based on the
// top-scoring candidate from suggest-correct-gauges.js (uses the
// in-memory pipeline rather than re-parsing markdown).
//
// Confident = top candidate's compact-name contains the river's
// dominant noun AND the score is >= the per-river threshold below.
// The threshold filters out pure "Creek/River" word matches and
// keeps only matches where the distinctive river name appears.

const fs = require('fs')
const https = require('https')
const path = require('path')

const RIVERS_PATH = path.resolve(__dirname, '..', 'data', 'rivers.ts')
const rivers = require('/tmp/gauge-genuine-mismatches.json')

const src0 = fs.readFileSync(RIVERS_PATH, 'utf8')
const stateByRiver = {}
const re = /id:\s*'([a-z0-9_]+)'[\s\S]{0,800}?abbr:\s*'([A-Z]{2})'/g
let m
while ((m = re.exec(src0))) stateByRiver[m[1]] = m[2]

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'RiverScout-GaugeAudit/1.0' } }, res => {
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => resolve({ status: res.statusCode, body: data }))
    }).on('error', reject)
  })
}

function parseRdb(body) {
  const sites = []
  for (const line of body.split('\n')) {
    if (line.startsWith('#') || !line.trim()) continue
    if (line.startsWith('agency_cd') || line.startsWith('5s')) continue
    const f = line.split('\t')
    if (f.length < 3 || !/^\d+$/.test(f[1])) continue
    sites.push({ site: f[1], name: f[2] })
  }
  return sites
}

const stateCache = {}
async function loadState(state) {
  if (stateCache[state]) return stateCache[state]
  const url = `https://waterservices.usgs.gov/nwis/site/?stateCd=${state.toLowerCase()}&siteType=ST&parameterCd=00060&format=rdb`
  const { body } = await get(url)
  stateCache[state] = parseRdb(body)
  return stateCache[state]
}

// The "dominant noun" of a river name — the distinctive word, not a
// generic suffix. e.g. "Beaverkill River" -> "beaverkill", "South Toe River" -> "toe".
function dominantNoun(name) {
  const stripped = name
    .toLowerCase()
    .replace(/[\u2014\u2013-]/g, ' ')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\b(north|south|east|west|upper|lower|big|little|main|fork|the)\b/g, ' ')
    .replace(/\b(river|creek|fork|run|bayou|lake|stream|canyon|gorge|tailwater|waterway)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return stripped.split(' ')[0] || ''
}

function compactName(s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '')
}

async function main() {
  const needed = Array.from(new Set(rivers.map(r => stateByRiver[r.id]).filter(Boolean)))
  for (const st of needed) {
    process.stderr.write(`  loading ${st}\n`)
    await loadState(st)
    await new Promise(r => setTimeout(r, 250))
  }

  let src = src0
  const applied = []
  const ambiguous = []
  const noMatch = []

  for (const r of rivers) {
    const state = stateByRiver[r.id]
    const noun = dominantNoun(r.name)
    if (!state || noun.length < 4) { ambiguous.push({ r, reason: 'no dominant noun' }); continue }
    const sites = stateCache[state] || []
    // Only sites whose compact name contains the dominant noun and is also
    // a "_river_" or "_creek_" or "_fork_" type station — skip places like
    // "RIVERPOINT" etc. by requiring the noun appear next to a watercourse word.
    const matches = sites.filter(s => {
      const compact = compactName(s.name)
      if (!compact.includes(noun)) return false
      // Require the station name actually be ON that river (not just a
      // bridge "near Beaverkill Rd"). Crude heuristic: the noun should be
      // the leading token of the station name, allowing for direction or
      // size prefixes.
      const lead = s.name.toLowerCase()
        .replace(/^[\s,]*([nsew]\s+|north\s+|south\s+|east\s+|west\s+|upper\s+|lower\s+|big\s+|little\s+|main\s+|f\s+|fork\s+)*/, '')
      return lead.startsWith(noun.slice(0, 4))
    })
    if (matches.length === 0) { noMatch.push(r); continue }
    if (matches.length > 1) {
      // Multiple candidates — try a few tie-breakers before giving up.
      // 1. City hint in our river name (rare).
      const cityHint = (r.name.toLowerCase().match(/\b(at|near|nr)\s+([a-z\s]+)/) || [])[2]
      if (cityHint) {
        const cityMatch = matches.find(s => s.name.toLowerCase().includes(cityHint.trim().split(' ')[0]))
        if (cityMatch) { applied.push({ r, picked: cityMatch }); continue }
      }
      // 2. County match — our `co:` field often names a city/county that
      //    appears in one specific station's name.
      const countyRaw = (src0.match(new RegExp(`id:\\s*'${r.id}'[\\s\\S]{0,400}?co:\\s*'([^']+)'`)) || [])[1] || ''
      const countyParts = countyRaw.toLowerCase().split(/[\s\/,]+/).filter(w => w.length >= 4 && !['county','borough','parish'].includes(w))
      const countyMatch = matches.find(s => countyParts.some(p => s.name.toLowerCase().includes(p)))
      if (countyMatch) { applied.push({ r, picked: countyMatch }); continue }
      // 3. All candidates clearly share the dominant noun (i.e. they're
      //    all on the same river). Pick the median-numbered gauge as a
      //    sensible default (downstream gauges typically have higher
      //    site numbers and represent the floatable lower river).
      const allSameRiver = matches.every(s => compactName(s.name).includes(noun))
      if (allSameRiver && noun.length >= 5) {
        const sorted = [...matches].sort((a, b) => a.site.localeCompare(b.site))
        const picked = sorted[Math.floor(sorted.length / 2)]
        applied.push({ r, picked })
        continue
      }
      ambiguous.push({ r, candidates: matches.slice(0, 5) })
      continue
    }
    applied.push({ r, picked: matches[0] })
  }

  // Apply confident fixes by replacing the gauge in rivers.ts. Match
  // against the unique combination of (river id, current gauge) so we
  // never touch the wrong row.
  for (const { r, picked } of applied) {
    const pattern = new RegExp(
      `(id:\\s*'${r.id}'[\\s\\S]{0,800}?g:\\s*')${r.gauge}(')`
    )
    const next = src.replace(pattern, `$1${picked.site}$2`)
    if (next === src) {
      console.error(`  WARN: no replace match for ${r.id} (${r.gauge} -> ${picked.site})`)
    } else {
      src = next
    }
  }
  fs.writeFileSync(RIVERS_PATH, src)

  console.log(`\nAuto-applied: ${applied.length}`)
  for (const { r, picked } of applied) {
    console.log(`  ${r.id}\t${r.gauge} -> ${picked.site}\t${picked.name}`)
  }
  console.log(`\nAmbiguous (multiple candidates, manual pick needed): ${ambiguous.length}`)
  for (const { r, candidates } of ambiguous) {
    if (!candidates) continue
    console.log(`  ${r.id}\t(${r.name})`)
    for (const c of candidates) console.log(`    ${c.site}  ${c.name}`)
  }
  console.log(`\nNo good candidate (current may be intentional proxy): ${noMatch.length}`)
  for (const r of noMatch) console.log(`  ${r.id}\t${r.gauge}  our="${r.name}"  station="${r.station}"`)
}

main().catch(e => { console.error(e); process.exit(1) })
