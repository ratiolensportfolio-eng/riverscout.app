#!/usr/bin/env node
// Preview the NRP FloatableReaches import — fetch every state's
// polylines, diff the unique river names against data/rivers.ts,
// and build a preview JSON showing:
//   - count of new vs matched
//   - attributes NRP has for each new candidate
//   - USGS gauge candidates (first 20 only, to keep it cheap)
//
// Writes: c:/tmp/nrp-river-import-preview.json
//         c:/tmp/nrp-floatable-reaches-raw.json  (raw fetched features)
//
// Does NOT touch data/rivers.ts. Review the preview, then we build
// the commit stage separately.

const fs = require('fs')
const https = require('https')
const path = require('path')

const REPO = path.resolve(__dirname, '..')
const PREVIEW_OUT = 'c:/tmp/nrp-river-import-preview.json'
const RAW_OUT = 'c:/tmp/nrp-floatable-reaches-raw.json'

const NRP_POLY = 'https://services5.arcgis.com/8lwfLbGBq2iCHgYd/arcgis/rest/services/NRRD_062818/FeatureServer/0/query'
const USGS_BBOX = 'https://waterservices.usgs.gov/nwis/site/'

const STATE_ORDER = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
]

// NRP Difficulty codes — inferred from on-site samples. Integer 0-6
// roughly maps to whitewater classes I-VI; 0 = unknown/flat. Leave
// raw for manual review rather than guessing a final label.
const DIFFICULTY_GUESS = { 0: 'flat/unknown', 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI' }

function getOnce(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'RiverScout-NRPPreview/1.0' }, timeout: 60000 }, res => {
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => resolve({ status: res.statusCode, body: data }))
    })
    req.on('error', reject)
    req.on('timeout', () => { req.destroy(new Error('timeout')) })
  })
}

async function get(url, retries = 4) {
  let lastErr
  for (let i = 0; i < retries; i++) {
    try { return await getOnce(url) }
    catch (e) { lastErr = e; await new Promise(r => setTimeout(r, 2000 * (i + 1))) }
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
    const id = m[1]; const name = m[2]; const abbr = m[3]
    byId.set(id, { name, abbr })
    byKey.set(`${normalizeName(name)}|${abbr}`, id)
    byKey.set(normalizeName(name), id)
  }
  return { byKey, byId }
}

async function fetchStateReaches(stateIdx) {
  const url = `${NRP_POLY}?where=State%3D${stateIdx}&outFields=*&returnGeometry=true&f=geojson&outSR=4326&resultRecordCount=2000`
  const { status, body } = await get(url)
  if (status !== 200) return []
  try { return (JSON.parse(body).features || []) }
  catch { return [] }
}

function extractCentroid(geom) {
  if (!geom) return null
  const coords = geom.type === 'LineString' ? geom.coordinates
    : geom.type === 'MultiLineString' ? geom.coordinates.flat() : null
  if (!coords || coords.length === 0) return null
  let sx = 0, sy = 0
  for (const [x, y] of coords) { sx += x; sy += y }
  return [sx / coords.length, sy / coords.length]
}

function bboxAround(lat, lng, padDeg = 0.1) {
  return [lng - padDeg, lat - padDeg, lng + padDeg, lat + padDeg]
    .map(v => v.toFixed(4)).join(',')
}

async function findNearbyGauges(lat, lng, riverNameLower) {
  // USGS Water Services — find active stream gauges within ~0.1° (~7mi).
  const bbox = bboxAround(lat, lng, 0.1)
  const url = `${USGS_BBOX}?format=rdb&bBox=${bbox}&siteType=ST&siteStatus=active&hasDataTypeCd=iv`
  try {
    const { status, body } = await get(url, 2)
    if (status !== 200) return []
    const lines = body.split('\n').filter(l => l && !l.startsWith('#'))
    const header = lines[0]?.split('\t') || []
    const idxId = header.indexOf('site_no')
    const idxName = header.indexOf('station_nm')
    const out = []
    for (const line of lines.slice(2)) {
      const cells = line.split('\t')
      if (cells.length < 3) continue
      const sid = cells[idxId]; const sname = cells[idxName]
      if (!sid || !sname) continue
      const match = sname.toLowerCase().includes(riverNameLower)
      out.push({ site_no: sid, station_nm: sname, name_match: match })
    }
    // Sort: name matches first, then by site_no
    out.sort((a, b) => (b.name_match - a.name_match) || a.site_no.localeCompare(b.site_no))
    return out.slice(0, 5)
  } catch { return [] }
}

function summarizeFeatures(feats) {
  // Aggregate all reach features for one river into a single summary.
  const miles = feats.map(f => f.properties.Miles || f.properties.LengthGIS_Mi || 0).filter(Boolean)
  const difficulties = feats.map(f => f.properties.Difficulty).filter(d => d != null && d !== 0)
  const isWhitewater = feats.some(f => f.properties.Whitewater === 1)
  const hasPermit = feats.some(f => f.properties.Permit === 1)
  const managementOpts = [...new Set(feats.flatMap(f => [f.properties.Management, f.properties.Management_2]).filter(Boolean))]
  const sections = [...new Set(feats.map(f => f.properties.Section_Name_1).filter(Boolean))]
  const descriptions = [...new Set(feats.map(f => f.properties.Description_New).filter(Boolean))]
  const websites = [...new Set(feats.flatMap(f => [f.properties.Website, f.properties.Website2]).filter(Boolean))]
  const awLinks = [...new Set(feats.map(f => f.properties.AW_Link).filter(Boolean))]
  const regulations = [...new Set(feats.map(f => f.properties.Regulations).filter(Boolean))]
  const fishingAllowed = feats.some(f => f.properties.Fishing === 1)
  const campingAllowed = feats.some(f => f.properties.Camping === 1)
  const waterTrail = feats.some(f => f.properties.Water_Trail === 1)
  const wsrSection = feats.some(f => f.properties.WSR_Section === 1)

  return {
    reach_count: feats.length,
    total_miles: miles.length ? +miles.reduce((s, x) => s + x, 0).toFixed(1) : null,
    difficulty_min: difficulties.length ? Math.min(...difficulties) : null,
    difficulty_max: difficulties.length ? Math.max(...difficulties) : null,
    difficulty_label: difficulties.length ? (
      Math.min(...difficulties) === Math.max(...difficulties)
        ? DIFFICULTY_GUESS[Math.min(...difficulties)]
        : `${DIFFICULTY_GUESS[Math.min(...difficulties)]}–${DIFFICULTY_GUESS[Math.max(...difficulties)]}`
    ) : null,
    whitewater: isWhitewater,
    permit_required: hasPermit,
    water_trail: waterTrail,
    wild_scenic: wsrSection,
    fishing: fishingAllowed,
    camping: campingAllowed,
    management: managementOpts,
    section_names: sections,
    descriptions,
    websites,
    aw_links: awLinks,
    regulations,
  }
}

function loadExistingPolylineIds() {
  // Set of river_ids that already have a map file, so preview can
  // tell the user "polyline already waiting".
  const dir = path.join(REPO, 'data', 'river-maps')
  return new Set(fs.readdirSync(dir).filter(f => f.endsWith('.ts') && f !== 'index.ts').map(f => f.replace('.ts', '')))
}

function slugify(name, state) {
  const base = name.toLowerCase()
    .replace(/'/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_river$|_creek$|_fork$/, '')
  return `${base}_${state.toLowerCase()}`
}

async function main() {
  process.stderr.write('Fetching NRP FloatableReaches per state...\n')
  const allFeatures = []
  for (let s = 1; s <= 50; s++) {
    process.stderr.write(`  ${STATE_ORDER[s - 1]}...`)
    const feats = await fetchStateReaches(s)
    process.stderr.write(` ${feats.length}\n`)
    for (const f of feats) f.__state = STATE_ORDER[s - 1]
    allFeatures.push(...feats)
    await new Promise(r => setTimeout(r, 300))
  }
  process.stderr.write(`\nTotal NRP reaches fetched: ${allFeatures.length}\n`)

  // Cache raw for follow-up stages so we don't have to refetch.
  fs.writeFileSync(RAW_OUT, JSON.stringify(allFeatures))
  process.stderr.write(`Raw saved: ${RAW_OUT}\n`)

  // Group features by (normalized name + state) since "Wisconsin River"
  // in WI is different from any other state with the same name.
  const byRiverKey = {}
  for (const f of allFeatures) {
    const name = f.properties.GNIS_River_Name
    if (!name) continue
    const state = f.__state
    const key = `${normalizeName(name)}|${state}`
    if (!byRiverKey[key]) byRiverKey[key] = { name, state, normalized: normalizeName(name), feats: [] }
    byRiverKey[key].feats.push(f)
  }
  process.stderr.write(`Unique (river, state) pairs: ${Object.keys(byRiverKey).length}\n`)

  // Diff vs rivers.ts
  const { byKey, byId } = buildRiverIndex()
  const existingPolylines = loadExistingPolylineIds()
  const matched = []
  const candidates = []
  for (const group of Object.values(byRiverKey)) {
    const withState = `${group.normalized}|${group.state}`
    const withoutState = group.normalized
    const ourId = byKey.get(withState) || byKey.get(withoutState)
    if (ourId) {
      matched.push({ ourId, nrpName: group.name, state: group.state, reach_count: group.feats.length })
    } else {
      candidates.push(group)
    }
  }

  // Sort candidates: whitewater first, then by total miles desc, then by
  // reach_count desc. This surfaces the most "interesting" rivers in
  // the first 20.
  const enriched = candidates.map(g => {
    const summary = summarizeFeatures(g.feats)
    const centroid = extractCentroid(g.feats[0].geometry)
    return { group: g, summary, centroid }
  })
  enriched.sort((a, b) =>
    (b.summary.whitewater - a.summary.whitewater) ||
    ((b.summary.total_miles || 0) - (a.summary.total_miles || 0)) ||
    (b.summary.reach_count - a.summary.reach_count)
  )

  // USGS gauge candidates for the first 20 only (keep preview cheap).
  process.stderr.write(`\nLooking up USGS gauges for first 20 candidates...\n`)
  const previewRows = []
  for (let i = 0; i < Math.min(20, enriched.length); i++) {
    const { group, summary, centroid } = enriched[i]
    const proposedSlug = slugify(group.name, group.state)
    process.stderr.write(`  ${i + 1}. ${group.name} (${group.state})...`)
    let gauges = []
    if (centroid) {
      gauges = await findNearbyGauges(centroid[1], centroid[0], group.normalized)
      await new Promise(r => setTimeout(r, 250))
    }
    process.stderr.write(` ${gauges.length} gauge candidates\n`)
    previewRows.push({
      proposed_id: proposedSlug,
      nrp_name: group.name,
      state: group.state,
      centroid_latlng: centroid ? [+centroid[1].toFixed(4), +centroid[0].toFixed(4)] : null,
      polyline_already_exists: existingPolylines.has(proposedSlug),
      summary,
      gauge_candidates: gauges,
    })
  }

  // Full preview file — 20 enriched rows + the rest as lightweight entries.
  const lightTail = enriched.slice(20).map(({ group, summary }) => ({
    proposed_id: slugify(group.name, group.state),
    nrp_name: group.name,
    state: group.state,
    reach_count: summary.reach_count,
    total_miles: summary.total_miles,
    difficulty_label: summary.difficulty_label,
    whitewater: summary.whitewater,
  }))

  const preview = {
    generated_at: new Date().toISOString(),
    counts: {
      nrp_reaches_total: allFeatures.length,
      unique_river_state_pairs: Object.keys(byRiverKey).length,
      matched_to_existing: matched.length,
      new_candidates: candidates.length,
      polylines_already_written: existingPolylines.size,
    },
    matched_sample: matched.slice(0, 10),
    preview_top_20: previewRows,
    all_new_candidates_brief: lightTail,
  }
  fs.writeFileSync(PREVIEW_OUT, JSON.stringify(preview, null, 2))

  console.log('')
  console.log(`NRP reaches fetched:          ${allFeatures.length}`)
  console.log(`Unique (river, state) pairs:  ${Object.keys(byRiverKey).length}`)
  console.log(`Already in rivers.ts:         ${matched.length}`)
  console.log(`New candidates:               ${candidates.length}`)
  console.log(`Polylines already written:    ${existingPolylines.size}`)
  console.log(`\nPreview written: ${PREVIEW_OUT}`)
  console.log(`Raw cache:       ${RAW_OUT}`)
}

main().catch(e => { console.error(e); process.exit(1) })
