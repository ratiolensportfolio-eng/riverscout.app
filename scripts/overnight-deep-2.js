#!/usr/bin/env node
// Second deep pass — read-only. Three analyses:
//   A. Replacement-gauge candidates for dead USGS stations
//   B. docs[].url dead-link sweep (separate from outfitter links)
//   C. Duplicate-river detection (same normalized name + nearby coords)
//
// All output to reports/. NO live writes.

const fs = require('fs')
const path = require('path')
const https = require('https')

const REPO = path.resolve(__dirname, '..')
const REPORTS = path.join(REPO, 'reports')
const DATE = new Date().toISOString().slice(0, 10)

function get(url, timeout = 20000) {
  return new Promise(resolve => {
    const req = https.get(url, { timeout, headers: { 'User-Agent': 'RiverScout-DeepAudit/1.0' } }, res => {
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
      // Grab docs URLs
      const docsBlock = e.match(/docs:\s*\[([\s\S]{0,5000}?)\]/)?.[1] ?? ''
      const docs = [...docsBlock.matchAll(/url:\s*['"]([^'"]+)['"]/g)].map(m => m[1])
      if (id) rivers.push({ id, n, g, abbr, stateKey, gaugeSource, docs })
    }
  }
  return rivers
}
function loadCoords() {
  const src = fs.readFileSync(path.join(REPO, 'data', 'river-coordinates.ts'), 'utf8')
  const m = new Map()
  for (const x of src.matchAll(/^\s+([a-z0-9_]+):\s*\[\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\]/gm)) {
    m.set(x[1], [parseFloat(x[2]), parseFloat(x[3])])
  }
  return m
}

function normalize(s) {
  return (s || '').toLowerCase()
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\b(river|creek|fork|branch|the)\b/g, '')
    .replace(/\s+/g, ' ').trim()
}
function distMi(a, b) {
  const R = 3958.8, toRad = d => d * Math.PI / 180
  const dLat = toRad(b[0] - a[0]), dLng = toRad(b[1] - a[1])
  const x = Math.sin(dLat/2)**2 + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng/2)**2
  return 2 * R * Math.asin(Math.sqrt(x))
}

// ── A. Replacement gauges for dead USGS stations ────────────────
// We reuse the 11b report output to get the 95 "unknown/possibly
// truly dead" gauges, then for each: bbox USGS for active gauges
// within ~15 mi of the river coord, score by name match + distance.
async function deepA_replacementGauges() {
  const reportPath = path.join(REPORTS, `11b-broken-gauges-categorized-${DATE}.md`)
  if (!fs.existsSync(reportPath)) {
    console.log('[A] 11b report not found, skipping')
    return
  }
  const body = fs.readFileSync(reportPath, 'utf8')
  // Parse out the "unknown / possibly truly dead" section
  const section = body.split('### unknown / possibly truly dead')[1] ?? ''
  // Lines look like: - `river_id` (ST) → `gauge_id`  station name
  const entries = [...section.matchAll(/- `([a-z0-9_]+)` \(([A-Z]{2})\) → `([^`]+)`\s*(.*)/g)]
    .map(m => ({ riverId: m[1], abbr: m[2], gaugeId: m[3], stationName: m[4].trim() }))
  console.log(`[A] Proposing replacements for ${entries.length} suspect gauges`)

  const rivers = loadRivers()
  const coords = loadCoords()
  const riverById = new Map(rivers.map(r => [r.id, r]))

  const proposals = []
  for (const e of entries) {
    const r = riverById.get(e.riverId)
    const c = coords.get(e.riverId)
    if (!c) { proposals.push({ ...e, note: 'no river-coords entry' }); continue }

    // Bbox ~15 mi around the river coord (0.22° is ~15 mi)
    const bbox = [c[1] - 0.22, c[0] - 0.22, c[1] + 0.22, c[0] + 0.22].map(v => v.toFixed(4)).join(',')
    const url = `https://waterservices.usgs.gov/nwis/site/?format=rdb&bBox=${bbox}&siteType=ST&siteStatus=active&hasDataTypeCd=iv`
    const { status, body } = await get(url, 15000)
    if (status !== 200) { proposals.push({ ...e, note: `lookup HTTP ${status}` }); continue }
    const lines = body.split('\n').filter(l => l && !l.startsWith('#'))
    if (lines.length < 3) { proposals.push({ ...e, note: 'no nearby candidates' }); continue }
    const cols = lines[0].split('\t')
    const iId = cols.indexOf('site_no'), iName = cols.indexOf('station_nm')
    const iLat = cols.indexOf('dec_lat_va'), iLng = cols.indexOf('dec_long_va')

    const riverNorm = normalize(r?.n || e.riverId.replace(/_/g, ' '))
    const words = riverNorm.split(' ').filter(w => w.length >= 3)
    const candidates = []
    for (const l of lines.slice(2)) {
      const cc = l.split('\t')
      const sid = cc[iId], nm = cc[iName] || ''
      if (!sid || sid === e.gaugeId) continue
      const lat = parseFloat(cc[iLat]), lng = parseFloat(cc[iLng])
      if (!isFinite(lat) || !isFinite(lng)) continue
      const d = distMi(c, [lat, lng])
      const nameLower = nm.toLowerCase()
      const hits = words.filter(w => nameLower.includes(w))
      if (!hits.length) continue  // strict: must share at least one river-name word
      const score = (hits.length / words.length) * 0.7 + (1 - d / 15) * 0.3
      candidates.push({ site_no: sid, station_nm: nm, distMi: +d.toFixed(1), nameHits: hits.length, score: +score.toFixed(3) })
    }
    candidates.sort((a, b) => b.score - a.score)

    // Verify the top candidate actually has live data right now
    const top = candidates[0]
    if (!top) { proposals.push({ ...e, note: 'no name-matched candidate within 15mi' }); continue }

    const ivUrl = `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${top.site_no}&parameterCd=00060&siteStatus=active&period=PT24H`
    const iv = await get(ivUrl, 12000)
    let hasLive = false
    try {
      const j = JSON.parse(iv.body)
      const vals = j.value?.timeSeries?.[0]?.values?.[0]?.value || []
      hasLive = vals.some(v => v.value && v.value !== '-999999')
    } catch { /* no live */ }

    proposals.push({
      ...e,
      riverName: r?.n,
      riverCoord: c,
      proposedSwap: hasLive ? top : null,
      runnersUp: candidates.slice(1, 3),
      note: hasLive ? 'swap candidate has live data' : 'top candidate found but also has no live data — no confident swap',
    })
    await new Promise(res => setTimeout(res, 250))
  }

  const swaps = proposals.filter(p => p.proposedSwap)
  const noSwap = proposals.filter(p => !p.proposedSwap)
  const lines = [
    `# Replacement-Gauge Proposals for Dead USGS Stations — ${DATE}`,
    '',
    `Analyzed ${proposals.length} suspect gauges from 11b report.`,
    `Proposed swaps with confirmed live data: **${swaps.length}**`,
    `No confident alternate: **${noSwap.length}**`,
    '',
    '## Proposed swaps (confidence sorted)',
    '',
  ]
  swaps.sort((a, b) => b.proposedSwap.score - a.proposedSwap.score)
  for (const p of swaps) {
    lines.push(`### \`${p.riverId}\` (${p.abbr}) — ${p.riverName}`)
    lines.push(`- **Current (no data):** \`${p.gaugeId}\` — ${p.stationName}`)
    lines.push(`- **Proposed:** \`${p.proposedSwap.site_no}\` — ${p.proposedSwap.station_nm}  (score ${p.proposedSwap.score}, ${p.proposedSwap.distMi}mi, ${p.proposedSwap.nameHits} name-word hits)`)
    if (p.runnersUp?.length) lines.push(`  - runners-up: ${p.runnersUp.map(r => `\`${r.site_no}\` (${r.distMi}mi)`).join(', ')}`)
    lines.push('')
  }
  lines.push('## No confident swap')
  for (const p of noSwap) lines.push(`- \`${p.riverId}\` (${p.abbr}) \`${p.gaugeId}\` — ${p.note}`)
  fs.writeFileSync(path.join(REPORTS, `A-replacement-gauges-${DATE}.md`), lines.join('\n'))
  console.log(`[A] DONE: ${swaps.length} swap proposals, ${noSwap.length} no confident alternate`)
}

// ── B. docs[].url dead-link check ──────────────────────────────
async function deepB_docsLinks() {
  const rivers = loadRivers()
  const allUrls = []
  for (const r of rivers) {
    for (const u of r.docs || []) {
      if (u && /^https?:\/\//.test(u)) allUrls.push({ riverId: r.id, url: u })
    }
  }
  // Dedupe — many rivers share the same "Ohio Watercraft Map Viewer" URL.
  const byUrl = new Map()
  for (const e of allUrls) (byUrl.get(e.url) || byUrl.set(e.url, []).get(e.url)).push(e.riverId)
  const unique = [...byUrl.keys()]
  console.log(`[B] Checking ${unique.length} unique docs URLs (${allUrls.length} total refs)`)

  const dead = []
  const alive = []
  let i = 0
  for (const url of unique) {
    i++
    let u
    try { u = new URL(url) } catch { dead.push({ url, code: 0, reason: 'invalid' }); continue }
    const code = await new Promise(resolve => {
      const r = https.request({ hostname: u.hostname, path: (u.pathname || '/') + (u.search || ''), method: 'HEAD', timeout: 7000, headers: { 'User-Agent': 'RiverScout-LinkCheck/1.0' } }, response => resolve(response.statusCode || 0))
      r.on('error', () => resolve(0)); r.on('timeout', () => { r.destroy(); resolve(0) })
      r.end()
    })
    if (code >= 200 && code < 400) alive.push({ url, code })
    else dead.push({ url, code, reason: code ? `HTTP ${code}` : 'connect/timeout' })
    if (i % 50 === 0) console.log(`[B] ${i}/${unique.length}  alive=${alive.length} dead=${dead.length}`)
    await new Promise(r => setTimeout(r, 80))
  }

  const lines = [
    `# docs[].url Dead-Link Check — ${DATE}`,
    '',
    `Unique URLs in data/rivers.ts \`docs\` arrays: **${unique.length}** (${allUrls.length} total references)`,
    `Alive: **${alive.length}**, dead: **${dead.length}**`,
    '',
    '## Dead URLs (affecting these rivers)',
    '',
  ]
  for (const d of dead) {
    const affected = byUrl.get(d.url) || []
    lines.push(`- ${d.url}  (${d.reason}) — used by ${affected.length} river${affected.length === 1 ? '' : 's'}: ${affected.slice(0, 6).join(', ')}${affected.length > 6 ? '...' : ''}`)
  }
  fs.writeFileSync(path.join(REPORTS, `B-docs-dead-links-${DATE}.md`), lines.join('\n'))
  console.log(`[B] DONE: ${dead.length} dead of ${unique.length} unique docs URLs`)
}

// ── C. Duplicate-river detection ────────────────────────────────
function deepC_duplicates() {
  const rivers = loadRivers()
  const coords = loadCoords()
  // Group by normalized name. For each group, also factor in state
  // so "Salmon River" entries in CT and AK don't flag.
  const byKey = {}
  for (const r of rivers) {
    const k = normalize(r.n) + '|' + r.abbr
    ;(byKey[k] ||= []).push(r)
  }
  const groups = Object.values(byKey).filter(g => g.length > 1)

  const lines = [
    `# Duplicate-River Detection — ${DATE}`,
    '',
    `Rivers with duplicate (normalized_name + state) keys: **${groups.length}** groups`,
    '',
    '## Potential duplicates',
    '',
  ]
  for (const g of groups) {
    const coords1 = coords.get(g[0].id)
    lines.push(`### "${g[0].n}" (${g[0].abbr}) — ${g.length} entries`)
    for (const r of g) {
      const c = coords.get(r.id)
      const distLabel = c && coords1 ? ` · ${distMi(coords1, c).toFixed(1)}mi from first` : ''
      lines.push(`- \`${r.id}\`  gauge=${r.g || '(none)'}${distLabel}`)
    }
    lines.push('')
  }
  // Also cross-state name-only matches (heads-up, not necessarily duplicates)
  const byNameOnly = {}
  for (const r of rivers) {
    const k = normalize(r.n)
    ;(byNameOnly[k] ||= []).push(r)
  }
  const nameOnlyGroups = Object.values(byNameOnly).filter(g => {
    if (g.length < 2) return false
    const states = new Set(g.map(r => r.abbr))
    return states.size < g.length  // at least 2 share the same state OR we already covered them
  })
  // Subset: rivers sharing the exact same name across DIFFERENT states (e.g. "Salmon River" in CT + AK)
  const crossState = Object.values(byNameOnly).filter(g => g.length > 1 && new Set(g.map(r => r.abbr)).size === g.length)
  lines.push('## Cross-state name overlaps (informational, often legitimately distinct)')
  for (const g of crossState.slice(0, 25)) {
    lines.push(`- "${g[0].n}" — ${g.map(r => `\`${r.id}\` (${r.abbr})`).join(', ')}`)
  }
  fs.writeFileSync(path.join(REPORTS, `C-duplicate-rivers-${DATE}.md`), lines.join('\n'))
  console.log(`[C] DONE: ${groups.length} same-state duplicate groups, ${crossState.length} cross-state name overlaps`)
}

async function main() {
  await deepA_replacementGauges()
  await deepB_docsLinks()
  deepC_duplicates()
  console.log('\n═══════════════════════════════════════')
  console.log('OVERNIGHT DEEP-2 COMPLETE')
  console.log('  reports/A-replacement-gauges-' + DATE + '.md')
  console.log('  reports/B-docs-dead-links-' + DATE + '.md')
  console.log('  reports/C-duplicate-rivers-' + DATE + '.md')
}
main().catch(e => { console.error(e); process.exit(1) })
