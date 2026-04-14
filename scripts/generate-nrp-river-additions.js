#!/usr/bin/env node
// Generate rivers.ts additions for option-2 NRP import.
//
// Filter: Whitewater=1 OR WSR=1 OR Water_Trail=1 OR total_miles>=15.
// Only adds rivers with NO existing match in rivers.ts (state-aware).
//
// Writes:
//   c:/tmp/nrp-river-additions.json  — { [stateKey]: [ { id, tsEntry, meta... }, ... ] }
// Does NOT touch rivers.ts. Use apply-nrp-river-additions.js next.

const fs = require('fs')
const path = require('path')

const REPO = path.resolve(__dirname, '..')
const RIVERS_TS = path.join(REPO, 'data', 'rivers.ts')
const RAW = 'c:/tmp/nrp-floatable-reaches-raw.json'
const OUT = 'c:/tmp/nrp-river-additions.json'
const MAPS_DIR = path.join(REPO, 'data', 'river-maps')

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

function clean(s) {
  if (!s) return null
  return String(s).replace(/\s*[\r\n]+\s*/g, ' ').trim() || null
}

// Single-quote-safe escape for TS string literals.
function esc(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

function slugifyBase(name) {
  return name.toLowerCase()
    .replace(/'/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_river$|_creek$|_fork$/, '')
}

// Build index of existing rivers by (normalized name + state abbr).
// State-aware ONLY — no un-stated fallback, to avoid cross-state
// false matches like salmon_ct <= Salmon River (AK).
function buildRiverIndex() {
  const src = fs.readFileSync(RIVERS_TS, 'utf8')
  const re = /id:\s*'([a-z0-9_]+)',\s*n:\s*'([^']+)'[\s\S]{0,600}?abbr:\s*'([A-Z]{2})'/g
  const byStateName = new Map()  // key: "<normalized>|<STATE>" -> id
  const existingIds = new Set()
  let m
  while ((m = re.exec(src))) {
    const id = m[1]; const name = m[2]; const abbr = m[3]
    byStateName.set(`${normalizeName(name)}|${abbr}`, id)
    existingIds.add(id)
  }
  return { byStateName, existingIds, src }
}

// Extract each state's filter key list and current id list from rivers.ts.
// We need the filter keys so each new entry sets all of them to false.
function parseStateBlocks(src) {
  const stateBlocks = {}
  const stateRe = /^  ([a-z]{2}): \{$/gm
  const matches = [...src.matchAll(stateRe)]
  for (let i = 0; i < matches.length; i++) {
    const m = matches[i]
    const key = m[1]
    const start = m.index
    const end = i + 1 < matches.length ? matches[i + 1].index : src.length
    const block = src.slice(start, end)

    const filtersM = block.match(/filters:\s*\[([^\]]+)\]/)
    const filters = filtersM
      ? filtersM[1].split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).filter(f => f !== 'all')
      : []

    const abbrM = block.match(/abbr:\s*'([A-Z]{2})'/)
    const abbr = abbrM ? abbrM[1] : key.toUpperCase()

    stateBlocks[key] = { filters, abbr, blockStart: start, blockEnd: end }
  }
  return stateBlocks
}

function aggregateReaches(feats) {
  const miles = feats.map(f => f.properties.Miles || f.properties.LengthGIS_Mi || 0).filter(Boolean)
  const totalMiles = miles.length ? +miles.reduce((s, x) => s + x, 0).toFixed(1) : null
  const isWW = feats.some(f => f.properties.Whitewater === 1)
  const isWSR = feats.some(f => f.properties.WSR_Section === 1)
  const isWaterTrail = feats.some(f => f.properties.Water_Trail === 1)
  const hasPermit = feats.some(f => f.properties.Permit === 1)
  const fishing = feats.some(f => f.properties.Fishing === 1)
  const camping = feats.some(f => f.properties.Camping === 1)
  const mgmt = [...new Set(feats.flatMap(f => [f.properties.Management, f.properties.Management_2]).filter(Boolean).map(clean))]
  const sections = [...new Set(feats.map(f => clean(f.properties.Section_Name_1)).filter(Boolean))]
  const descriptions = [...new Set(feats.map(f => clean(f.properties.Description_New)).filter(Boolean))]
  const websites = [...new Set(feats.flatMap(f => [f.properties.Website, f.properties.Website2]).filter(Boolean).map(clean))]
  const awLinks = [...new Set(feats.map(f => clean(f.properties.AW_Link)).filter(Boolean))]
  const nrpDiffs = feats.map(f => f.properties.Difficulty).filter(d => d != null)
  return {
    totalMiles, isWW, isWSR, isWaterTrail, hasPermit, fishing, camping,
    mgmt, sections, descriptions, websites, awLinks,
    nrpDifficulty: nrpDiffs.length ? [Math.min(...nrpDiffs), Math.max(...nrpDiffs)] : null,
    reachCount: feats.length,
  }
}

function synthesizeDesig(agg) {
  const bits = []
  if (agg.isWSR) bits.push('National Wild & Scenic River')
  if (agg.isWaterTrail) bits.push('Designated Water Trail')
  if (agg.mgmt.length) bits.push(agg.mgmt[0])
  return bits.join(' · ') || null
}

function synthesizeDesc(agg) {
  if (agg.descriptions.length) {
    // Prefer the longest — usually most informative.
    return agg.descriptions.sort((a, b) => b.length - a.length)[0].slice(0, 600)
  }
  return null
}

function synthesizeDocs(agg) {
  // Emit the required RiverDoc shape: t, s, y, tp, pg, url. For NRP
  // imports we don't have y/pg, so stub them with 0 — the UI already
  // hides "0 pages" and "year 0" as unknowns.
  const docs = []
  for (const url of agg.websites) {
    if (!/^https?:\/\//i.test(url)) continue
    docs.push({ t: 'Official river website', s: 'Managing agency', y: 0, tp: 'Reference', pg: 0, url })
  }
  for (const url of agg.awLinks) {
    if (!/^https?:\/\//i.test(url)) continue
    docs.push({ t: 'American Whitewater river page', s: 'American Whitewater', y: 0, tp: 'Whitewater', pg: 0, url })
  }
  return docs
}

function formatTsEntry(entry, filterKeys) {
  // Emit every required River field so the TypeScript interface is
  // satisfied. Empty string / zero stands in for data we don't have;
  // the dataSource: 'nrp' flag lets UI code filter these out until a
  // human curates them.
  const parts = [`id: '${entry.id}'`, `n: '${esc(entry.n)}'`]
  for (const k of filterKeys) parts.push(`${k}: false`)
  parts.push(`co: ''`)
  parts.push(`len: '${esc(entry.len || '')}'`)
  parts.push(`cls: ''`)
  parts.push(`opt: ''`)
  parts.push(`g: ''`)
  parts.push(`avg: 0`)
  parts.push(`histFlow: 0`)
  parts.push(`mx: 0`)
  parts.push(`my: 0`)
  parts.push(`abbr: '${entry.abbr}'`)
  parts.push(`desc: '${esc(entry.desc || '')}'`)
  parts.push(`desig: '${esc(entry.desig || '')}'`)
  if (entry.secs && entry.secs.length) {
    parts.push(`secs: [${entry.secs.map(s => `'${esc(s)}'`).join(', ')}]`)
  } else {
    parts.push(`secs: []`)
  }
  parts.push(`history: []`)
  if (entry.docs && entry.docs.length) {
    const docsStr = entry.docs.map(d => {
      const dparts = Object.entries(d).map(([k, v]) =>
        typeof v === 'number' ? `${k}: ${v}` : `${k}: '${esc(v)}'`
      ).join(', ')
      return `{ ${dparts} }`
    }).join(', ')
    parts.push(`docs: [${docsStr}]`)
  } else {
    parts.push(`docs: []`)
  }
  parts.push(`revs: []`)
  parts.push(`outs: []`)
  parts.push(`needsVerification: ['class-rating-nrp', 'map-position-missing']`)
  parts.push(`dataSource: 'nrp'`)
  if (entry.nrpDifficulty) {
    parts.push(`nrpDifficulty: [${entry.nrpDifficulty[0]}, ${entry.nrpDifficulty[1]}]`)
  }
  return `{ ${parts.join(', ')} }`
}

function main() {
  const feats = JSON.parse(fs.readFileSync(RAW, 'utf8'))
  const { byStateName, existingIds, src } = buildRiverIndex()
  const states = parseStateBlocks(src)

  // Existing polyline map files (for flagging "polyline waiting").
  const polyFiles = new Set(
    fs.readdirSync(MAPS_DIR)
      .filter(f => f.endsWith('.ts') && f !== 'index.ts')
      .map(f => f.replace('.ts', ''))
  )

  // Group features by (normalized name, state abbr).
  const groups = {}
  for (const f of feats) {
    const name = clean(f.properties.GNIS_River_Name)
    if (!name) continue
    const state = f.__state
    const key = `${normalizeName(name)}|${state}`
    if (!groups[key]) groups[key] = { name, state, feats: [] }
    groups[key].feats.push(f)
  }

  // Filter + diff.
  const additionsByState = {}
  const used = new Set(existingIds)
  let filtered = 0
  let matchedExisting = 0
  let skippedFilter = 0
  let nameCollision = 0

  // Sort groups so stable id generation prefers long/interesting rivers first.
  const groupList = Object.values(groups).map(g => ({ g, agg: aggregateReaches(g.feats) }))
  groupList.sort((a, b) => ((b.agg.totalMiles || 0) - (a.agg.totalMiles || 0)) || (b.agg.reachCount - a.agg.reachCount))

  for (const { g, agg } of groupList) {
    const key = `${normalizeName(g.name)}|${g.state}`
    if (byStateName.has(key)) { matchedExisting++; continue }

    // Option-2c filter: WW OR WSR OR >=20 mi; no water-trails-only;
    // exclude coastal/bay/sound names that NRP mixes in with rivers.
    const badNameRe = /\b(gulf|bay|harbor|intracoastal|ocean|straits|sound|blueway|lagoon|waterway)\b/i
    if (badNameRe.test(g.name)) { skippedFilter++; continue }
    const keep = agg.isWW || agg.isWSR || (agg.totalMiles || 0) >= 20
    if (!keep) { skippedFilter++; continue }

    const stateKey = g.state.toLowerCase()
    if (!states[stateKey]) { continue }

    // id: <base>_<state>. If collision, append a digit.
    const baseSlug = slugifyBase(g.name) + '_' + stateKey
    let id = baseSlug
    let n = 2
    while (used.has(id)) { id = `${baseSlug}_${n}`; n++; nameCollision++ }
    used.add(id)

    const entry = {
      id,
      n: g.name,
      abbr: g.state,
      len: agg.totalMiles ? `${Math.round(agg.totalMiles)} mi` : null,
      desc: synthesizeDesc(agg),
      desig: synthesizeDesig(agg),
      secs: agg.sections,
      docs: synthesizeDocs(agg),
      nrpDifficulty: agg.nrpDifficulty,
    }

    const tsEntry = formatTsEntry(entry, states[stateKey].filters)

    if (!additionsByState[stateKey]) additionsByState[stateKey] = []
    additionsByState[stateKey].push({
      id, name: g.name, state: g.state,
      tsEntry,
      polylineReady: polyFiles.has(id),
      reachCount: agg.reachCount,
      miles: agg.totalMiles,
      ww: agg.isWW, wsr: agg.isWSR, waterTrail: agg.isWaterTrail,
      nrpDifficulty: agg.nrpDifficulty,
    })
    filtered++
  }

  // Summary
  const byStateCounts = Object.fromEntries(
    Object.entries(additionsByState).map(([k, v]) => [k, v.length]).sort((a, b) => b[1] - a[1])
  )

  const out = {
    generated_at: new Date().toISOString(),
    filter: 'opt2c: (WW=1 OR WSR=1 OR totalMiles>=20), excluding coastal/bay/sound names',
    counts: {
      total_groups: groupList.length,
      matched_existing: matchedExisting,
      skipped_by_filter: skippedFilter,
      name_collisions_suffixed: nameCollision,
      new_rivers_added: filtered,
    },
    by_state: byStateCounts,
    additions: additionsByState,
  }
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2))

  console.log(`Total (river, state) groups:   ${groupList.length}`)
  console.log(`Already in rivers.ts:          ${matchedExisting}`)
  console.log(`Skipped by filter:             ${skippedFilter}`)
  console.log(`New rivers to add:             ${filtered}`)
  console.log(`Name collisions (suffixed):    ${nameCollision}`)
  console.log(`\nTop 15 states by add count:`)
  for (const [st, c] of Object.entries(byStateCounts).slice(0, 15)) console.log(`  ${st.toUpperCase()}: ${c}`)
  console.log(`\nPreview written: ${OUT}`)
}

main()
