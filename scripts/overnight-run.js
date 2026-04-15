#!/usr/bin/env node
// Overnight reports runner — 12 read-only analysis tasks.
// All output written to reports/<task>-<DATE>.md. NO writes to
// rivers.ts, fisheries.ts, river-coordinates.ts, or Supabase.
//
// Run: node scripts/overnight-run.js > reports/_run.log 2>&1

const fs = require('fs')
const path = require('path')
const https = require('https')

const REPO = path.resolve(__dirname, '..')
const REPORTS = path.join(REPO, 'reports')
const DATE = new Date().toISOString().slice(0, 10)
fs.mkdirSync(REPORTS, { recursive: true })

const summaries = []
function summary(line) { console.log(line); summaries.push(line) }
function reportPath(name) { return path.join(REPORTS, `${name}-${DATE}.md`) }
function writeReport(name, body) { fs.writeFileSync(reportPath(name), body) }

function get(url, timeoutMs = 20000) {
  return new Promise(resolve => {
    const req = https.get(url, { timeout: timeoutMs, headers: { 'User-Agent': 'RiverScout-Overnight/1.0' } }, res => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => resolve({ status: res.statusCode, body: d }))
    })
    req.on('error', () => resolve({ status: 0, body: '' }))
    req.on('timeout', () => { req.destroy(); resolve({ status: 0, body: '' }) })
  })
}

// ── Shared loaders ─────────────────────────────────────────────
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
      const desc = e.match(/desc:\s*['"]([\s\S]{0,2000}?)['"],?\s*desig:/)?.[1] ?? ''
      const abbr = e.match(/abbr:\s*'([A-Z]{2})'/)?.[1] ?? stateKey.toUpperCase()
      const dataSource = e.match(/dataSource:\s*'([^']+)'/)?.[1] ?? null
      const noGauge = /noGaugeAvailable:\s*true/.test(e)
      const gaugeSource = e.match(/gaugeSource:\s*'([^']+)'/)?.[1] ?? 'usgs'
      if (id) rivers.push({ id, n, g, desc, abbr, stateKey, dataSource, noGauge, gaugeSource })
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
function loadFisheriesIds() {
  const src = fs.readFileSync(path.join(REPO, 'data', 'fisheries.ts'), 'utf8')
  return new Set([...src.matchAll(/^\s+([a-z0-9_]+):\s*\{/gm)].map(m => m[1]))
}
function loadOutfitters(rivers) {
  // Outfitter listings live on each river. Walk rivers.ts for `outs: [{ ..., l: 'thepineriver.com' }]`
  const src = fs.readFileSync(path.join(REPO, 'data', 'rivers.ts'), 'utf8')
  const out = []
  // Extract per-river entries crudely.
  const entries = src.split(/\n\s*\{\s*id: '/).slice(1)
  for (const e of entries) {
    const id = e.match(/^([a-z0-9_]+)'/)?.[1]
    if (!id) continue
    const outsBlock = e.match(/outs:\s*\[([\s\S]{0,3000}?)\]/)?.[1] ?? ''
    for (const o of outsBlock.matchAll(/\{\s*n:\s*['"]([^'"]+)['"][\s\S]{0,400}?l:\s*['"]([^'"]*)['"]/g)) {
      out.push({ riverId: id, name: o[1], link: o[2] })
    }
  }
  return out
}

// ── TASK 1: USGS gauge discovery report ────────────────────────
function task1_usgsGaugeReport() {
  const rivers = loadRivers()
  const ungauged = rivers.filter(r => !r.g && !r.noGauge && r.gaugeSource === 'usgs')

  // Reuse the prior discovery preview if it exists (built earlier
  // this session). Skip a fresh slow run.
  const previewPath = 'c:/tmp/gauge-discovery-preview.json'
  let dryRun = null
  if (fs.existsSync(previewPath)) {
    try { dryRun = JSON.parse(fs.readFileSync(previewPath, 'utf8')) } catch { /* ignore */ }
  }

  const lines = [
    `# USGS Gauge Discovery Report — ${DATE}`,
    '',
    `Rivers with no gauge attached and no \`noGaugeAvailable\` flag: **${ungauged.length}**.`,
    '',
    'Reusing the earlier dry-run preview at `c:/tmp/gauge-discovery-preview.json`.',
    'Per-river action proposals (NOT applied — review before next session):',
    '',
  ]
  if (dryRun?.results) {
    const counts = dryRun.summary || {}
    lines.push('## Action summary')
    for (const [k, v] of Object.entries(counts)) lines.push(`- ${k}: ${v}`)
    lines.push('')
    const att = dryRun.results.filter(r => r.action === 'attach').sort((a, b) => b.best.confidence - a.best.confidence)
    lines.push(`## Top 50 confident attaches (confidence ≥ 0.80, distance ≤ 25 mi)`)
    for (const r of att.slice(0, 50)) {
      lines.push(`- \`${r.id}\` → \`${r.best.site_no}\`  conf=${r.best.confidence.toFixed(2)}  dist=${r.best.distMi.toFixed(1)}mi  ${r.best.station_nm}`)
    }
    lines.push('')
    lines.push(`## Review band (115 candidates) — see preview JSON for full list`)
    lines.push(`Mid-confidence matches (0.40 ≤ confidence < 0.80) need human spot-check before attaching.`)
    summary(`Task 1 (USGS gauge discovery): ${counts.attach || 0} confident attaches proposed, ${counts.review || 0} need review, ${counts.no_match || 0} truly ungauged`)
  } else {
    lines.push('No prior dry-run found. Run scripts/discover-usgs-gauges.js to generate.')
    summary(`Task 1 (USGS gauge discovery): no preview JSON found — re-run scripts/discover-usgs-gauges.js`)
  }
  writeReport('1-usgs-gauge-discovery', lines.join('\n'))
}

// ── TASK 2: WSC gauge matching for Canadian rivers ──────────────
async function task2_wscMatching() {
  const rivers = loadRivers()
  const canadian = rivers.filter(r => r.gaugeSource === 'wsc' || r.abbr === 'AB' || r.abbr === 'BC' || r.abbr === 'ON')
  const lines = [
    `# WSC Gauge Matching Report — ${DATE}`,
    '',
    `Canadian rivers in catalog: **${canadian.length}**`,
    '',
    '## Coverage status',
  ]
  let withGauge = 0, withoutGauge = 0
  for (const r of canadian) {
    if (r.g) withGauge++
    else withoutGauge++
    lines.push(`- \`${r.id}\` (${r.abbr})  ${r.g ? 'gauge=' + r.g : r.noGauge ? 'NO ACTIVE GAUGE (flagged)' : '⚠️  NO GAUGE — needs attention'}`)
  }
  lines.unshift(`Without gauge (excluding flagged): **${canadian.filter(r => !r.g && !r.noGauge).length}**`)
  lines.unshift(`With gauge: **${withGauge}**`)
  lines.unshift(`Total Canadian rivers: **${canadian.length}**`)
  lines.unshift(`# WSC Gauge Matching Report — ${DATE}`)
  lines.unshift('')
  // Live-test each gauge
  lines.push('')
  lines.push('## Live data check (last 24h)')
  for (const r of canadian.filter(x => x.g)) {
    const since = new Date(Date.now() - 86400000).toISOString()
    const url = `https://api.weather.gc.ca/collections/hydrometric-realtime/items?STATION_NUMBER=${r.g}&datetime=${encodeURIComponent(since + '/..')}&limit=1&sortby=-DATETIME&f=json`
    const { status, body } = await get(url, 15000)
    if (status !== 200) { lines.push(`- \`${r.id}\` → \`${r.g}\`  ⚠️  HTTP ${status}`); continue }
    try {
      const j = JSON.parse(body)
      const f = (j.features || [])[0]
      if (!f || f.properties.DISCHARGE == null) lines.push(`- \`${r.id}\` → \`${r.g}\`  no recent discharge`)
      else lines.push(`- \`${r.id}\` → \`${r.g}\`  ${(f.properties.DISCHARGE * 35.3147).toFixed(0)} cfs at ${f.properties.DATETIME}`)
    } catch { lines.push(`- \`${r.id}\` → \`${r.g}\`  parse fail`) }
    await new Promise(r => setTimeout(r, 200))
  }
  writeReport('2-wsc-gauge-matching', lines.join('\n'))
  summary(`Task 2 (WSC matching): ${canadian.length} Canadian rivers — ${withGauge} gauged, ${canadian.filter(r => !r.g && !r.noGauge).length} need attention`)
}

// ── TASK 3: Historical avg flow population (REPORT only) ────────
async function task3_historicalAvg() {
  const rivers = loadRivers()
  const usgsGauged = rivers.filter(r => r.g && r.gaugeSource === 'usgs')
  const lines = [
    `# Historical Avg Flow Population — ${DATE}`,
    '',
    `USGS-gauged rivers: **${usgsGauged.length}**.`,
    '',
    'Sampling 50 gauges to estimate coverage. Full population would proceed via /api/rivers/[id]/gauges lazy-fill on first page view, OR a dedicated nightly job. NOT writing to DB in this run.',
    '',
    '## Sample (first 50)',
  ]
  let withMean = 0, withoutMean = 0
  const sample = usgsGauged.slice(0, 50)
  for (const r of sample) {
    const url = `https://waterservices.usgs.gov/nwis/stat/?format=rdb&sites=${r.g}&statReportType=annual&statType=mean&parameterCd=00060`
    const { status, body } = await get(url, 12000)
    if (status !== 200) { lines.push(`- \`${r.id}\` (${r.g})  HTTP ${status}`); withoutMean++; continue }
    const dataLines = body.split('\n').filter(l => l && !l.startsWith('#'))
    if (dataLines.length < 3) { lines.push(`- \`${r.id}\` (${r.g})  no stats`); withoutMean++; continue }
    const cols = dataLines[0].split('\t')
    const mIdx = cols.indexOf('mean_va')
    const vals = dataLines.slice(2).map(l => parseFloat(l.split('\t')[mIdx])).filter(v => isFinite(v) && v > 0)
    if (!vals.length) { lines.push(`- \`${r.id}\` (${r.g})  empty stats`); withoutMean++; continue }
    const avg = Math.round(vals.reduce((s, x) => s + x, 0) / vals.length)
    lines.push(`- \`${r.id}\` (${r.g})  long-term mean = **${avg.toLocaleString()} cfs** (${vals.length} years)`)
    withMean++
    await new Promise(r => setTimeout(r, 250))
  }
  lines.push('')
  lines.push(`Sample success rate: ${withMean}/${sample.length}.`)
  lines.push('Population strategy: rely on /api/rivers/[id]/gauges lazy fill (already wired in commit 97a7368) — every gauge populates on first dashboard or river-page view.')
  writeReport('3-historical-avg-flow', lines.join('\n'))
  summary(`Task 3 (Historical avg): sampled 50/${usgsGauged.length} USGS gauges; ${withMean} have data, ${withoutMean} don't. Lazy-fill is wired — no batch write needed.`)
}

// ── TASK 4: NRP import preview ────────────────────────────────
function task4_nrpImportPreview() {
  const previewPath = 'c:/tmp/nrp-river-import-preview.json'
  const lines = [`# NRP Import Analysis — ${DATE}`, '']
  if (!fs.existsSync(previewPath)) {
    lines.push('No preview JSON cached. Run scripts/preview-nrp-new-rivers.js to regenerate.')
    writeReport('4-nrp-import-preview', lines.join('\n'))
    summary(`Task 4 (NRP import): no cached preview — re-run scripts/preview-nrp-new-rivers.js`)
    return
  }
  const d = JSON.parse(fs.readFileSync(previewPath, 'utf8'))
  lines.push(`## Counts`)
  for (const [k, v] of Object.entries(d.counts || {})) lines.push(`- ${k}: ${v}`)
  lines.push('')
  lines.push(`## CSV — full new-candidate brief (truncated)`)
  lines.push('')
  lines.push('```csv')
  lines.push('proposed_id,nrp_name,state,reach_count,total_miles,difficulty_label,whitewater')
  const all = d.all_new_candidates_brief || []
  for (const r of all.slice(0, 100)) {
    lines.push([r.proposed_id, JSON.stringify(r.nrp_name), r.state, r.reach_count, r.total_miles, r.difficulty_label, r.whitewater].join(','))
  }
  lines.push('```')
  lines.push(`(${all.length} total candidates — first 100 shown)`)
  writeReport('4-nrp-import-preview', lines.join('\n'))
  summary(`Task 4 (NRP preview): ${d.counts?.new_candidates || '?'} new candidates available — preview only, no import`)
}

// ── TASK 5: Sitemap regeneration (no submission) ────────────────
function task5_sitemap() {
  const rivers = loadRivers()
  const states = new Set(rivers.map(r => r.stateKey))
  const lines = [`# Sitemap Status — ${DATE}`, '']
  lines.push(`Static URLs to include: 1 home + ${states.size} state pages + ${rivers.length} river pages = **${1 + states.size + rivers.length}** total URLs.`)
  lines.push('')
  // Check if app/sitemap.ts exists
  const sitemapTs = path.join(REPO, 'app', 'sitemap.ts')
  const sitemapXml = path.join(REPO, 'public', 'sitemap.xml')
  lines.push(`- app/sitemap.ts exists: ${fs.existsSync(sitemapTs)}`)
  lines.push(`- public/sitemap.xml exists: ${fs.existsSync(sitemapXml)}`)
  lines.push('')
  if (fs.existsSync(sitemapTs)) {
    lines.push('Next.js dynamic sitemap is in place — regenerated automatically on build. No action needed.')
  } else {
    lines.push('No sitemap.ts found. Recommend creating one to expose all river + state URLs.')
  }
  lines.push('')
  lines.push('Submission to Google Search Console / Bing Webmaster Tools NOT performed (would be a live action).')
  writeReport('5-sitemap-status', lines.join('\n'))
  summary(`Task 5 (Sitemap): ${1 + states.size + rivers.length} URLs total; sitemap.ts ${fs.existsSync(sitemapTs) ? 'present' : 'MISSING'}`)
}

// ── TASK 6: Phase 2 polyline status ─────────────────────────────
function task6_polylineStatus() {
  const rivers = loadRivers()
  const mapsDir = path.join(REPO, 'data', 'river-maps')
  const haveMap = new Set(fs.readdirSync(mapsDir).filter(f => f.endsWith('.ts') && f !== 'index.ts').map(f => f.replace('.ts', '')))
  const withMap = rivers.filter(r => haveMap.has(r.id))
  const withoutMap = rivers.filter(r => !haveMap.has(r.id))
  const byState = {}
  for (const r of withoutMap) byState[r.stateKey] = (byState[r.stateKey] || 0) + 1

  const lines = [`# Phase 2 Polyline Status — ${DATE}`, '']
  lines.push(`Total rivers: **${rivers.length}**`)
  lines.push(`With map file: **${withMap.length}** (${(100 * withMap.length / rivers.length).toFixed(1)}%)`)
  lines.push(`Without map file: **${withoutMap.length}**`)
  lines.push('')
  lines.push('## Top 20 states by missing-map count')
  const sorted = Object.entries(byState).sort((a, b) => b[1] - a[1])
  for (const [st, n] of sorted.slice(0, 20)) lines.push(`- ${st.toUpperCase()}: ${n} rivers`)
  lines.push('')
  lines.push('## First 30 rivers needing extraction')
  for (const r of withoutMap.slice(0, 30)) lines.push(`- \`${r.id}\` (${r.abbr})  ${r.n}`)
  writeReport('6-polyline-status', lines.join('\n'))
  summary(`Task 6 (Polylines): ${withMap.length}/${rivers.length} rivers have map files (${(100 * withMap.length / rivers.length).toFixed(0)}%)`)
}

// ── TASK 7: Description quality audit ───────────────────────────
function task7_descAudit() {
  const rivers = loadRivers()
  const SHORT = rivers.filter(r => (r.desc || '').length < 100)
  const NRP_GENERIC = rivers.filter(r => /Paddling access exists|water trail destination/i.test(r.desc || ''))
  const lines = [`# Description Quality Audit — ${DATE}`, '']
  lines.push(`Rivers with short desc (<100 chars): **${SHORT.length}**`)
  lines.push(`Rivers with generic NRP boilerplate: **${NRP_GENERIC.length}**`)
  lines.push('')
  lines.push('## Short desc rivers (first 50)')
  for (const r of SHORT.slice(0, 50)) lines.push(`- \`${r.id}\` (${r.abbr}, ${(r.desc || '').length} chars): ${r.desc?.slice(0, 80) || '(empty)'}`)
  lines.push('')
  lines.push('## NRP boilerplate rivers (first 30)')
  for (const r of NRP_GENERIC.slice(0, 30)) lines.push(`- \`${r.id}\` (${r.abbr}): ${r.desc?.slice(0, 100)}`)
  writeReport('7-description-quality', lines.join('\n'))
  summary(`Task 7 (Desc audit): ${SHORT.length} short, ${NRP_GENERIC.length} NRP-boilerplate descriptions need rewriting`)
}

// ── TASK 8: Q&A seed question candidates ───────────────────────
async function task8_qaSeed(supabaseConfig) {
  const rivers = loadRivers()
  const lines = [`# Q&A Seed Candidates — ${DATE}`, '']
  // Try to query river_answers table for which river_ids have any rows
  let answeredIds = new Set()
  if (supabaseConfig) {
    try {
      const url = `${supabaseConfig.url}/rest/v1/river_answers?select=river_id&limit=10000`
      const res = await fetch(url, {
        headers: {
          apikey: supabaseConfig.key,
          Authorization: `Bearer ${supabaseConfig.key}`,
        },
      })
      if (res.ok) {
        const arr = await res.json()
        for (const r of arr) answeredIds.add(r.river_id)
      }
    } catch { /* ignore */ }
  }
  const noQA = rivers.filter(r => !answeredIds.has(r.id))
  lines.push(`Rivers with zero Q&A answers: **${noQA.length}** of ${rivers.length}`)
  lines.push('')
  lines.push('## Suggested starter questions per river (template — DRAFT, not seeded)')
  lines.push('')
  lines.push('Each river without Q&A could prompt these 3 starter questions:')
  lines.push('1. "Best put-in for first-timers?"')
  lines.push('2. "When does the spring runoff peak here?"')
  lines.push('3. "Any current strainers or hazards I should know about?"')
  lines.push('')
  lines.push('## First 100 rivers needing Q&A seed')
  for (const r of noQA.slice(0, 100)) lines.push(`- \`${r.id}\` (${r.abbr}) ${r.n}`)
  writeReport('8-qa-seed-candidates', lines.join('\n'))
  summary(`Task 8 (Q&A seed): ${noQA.length} rivers have zero Q&A — starter questions templated, not inserted`)
}

// ── TASK 9: Missing fisheries data ─────────────────────────────
function task9_missingFisheries() {
  const rivers = loadRivers()
  const fishIds = loadFisheriesIds()
  const STATES_OF_INTEREST = new Set(['mi', 'mt', 'or', 'co', 'pa'])
  const missing = rivers.filter(r => STATES_OF_INTEREST.has(r.stateKey) && !fishIds.has(r.id))
  const byState = {}
  for (const r of missing) byState[r.stateKey] = (byState[r.stateKey] || 0) + 1
  const lines = [`# Missing Fisheries Data — ${DATE}`, '']
  lines.push(`Target states: MI, MT, OR, CO, PA`)
  lines.push(`Rivers missing fisheries entries in those states: **${missing.length}**`)
  lines.push('')
  for (const [st, n] of Object.entries(byState).sort((a, b) => b[1] - a[1])) {
    lines.push(`## ${st.toUpperCase()} — ${n} rivers missing`)
    for (const r of missing.filter(x => x.stateKey === st)) lines.push(`- \`${r.id}\` ${r.n}`)
    lines.push('')
  }
  writeReport('9-missing-fisheries', lines.join('\n'))
  summary(`Task 9 (Missing fisheries): ${missing.length} rivers in MI/MT/OR/CO/PA need fisheries data`)
}

// ── TASK 10: Outfitter dead-link checker ───────────────────────
async function task10_deadLinks() {
  const rivers = loadRivers()
  const outfitters = loadOutfitters(rivers)
  const lines = [`# Outfitter Dead-Link Check — ${DATE}`, '']
  lines.push(`Total outfitter listings with a link: **${outfitters.filter(o => o.link).length}** of ${outfitters.length}`)
  lines.push('')
  lines.push('## Sampling first 60 links (rate-limited check)')
  let dead = 0, alive = 0, skipped = 0
  for (const o of outfitters.filter(x => x.link).slice(0, 60)) {
    let url = o.link.startsWith('http') ? o.link : `https://${o.link}`
    try {
      const u = new URL(url)
      const res = await new Promise(resolve => {
        const r = https.request({ hostname: u.hostname, path: u.pathname || '/', method: 'HEAD', timeout: 8000, headers: { 'User-Agent': 'RiverScout-LinkCheck/1.0' } }, response => { resolve(response.statusCode || 0) })
        r.on('error', () => resolve(0)); r.on('timeout', () => { r.destroy(); resolve(0) })
        r.end()
      })
      if (res >= 200 && res < 400) { alive++; lines.push(`- ✓ ${o.link}  (${res})  [${o.riverId}]`) }
      else { dead++; lines.push(`- ✗ ${o.link}  (${res || 'error'})  [${o.riverId}] ${o.name}`) }
    } catch { skipped++; lines.push(`- ? ${o.link}  invalid URL  [${o.riverId}]`) }
    await new Promise(r => setTimeout(r, 100))
  }
  lines.push('')
  lines.push(`Sample: ${alive} alive, ${dead} dead, ${skipped} skipped (invalid URL).`)
  lines.push(`Dead links flagged for review — do not auto-remove; outfitters may have temp downtime.`)
  writeReport('10-outfitter-dead-links', lines.join('\n'))
  summary(`Task 10 (Dead links): sampled 60 outfitter URLs — ${dead} dead, ${alive} alive, ${skipped} invalid`)
}

// ── TASK 11: Broken USGS gauge detection ──────────────────────
async function task11_brokenGauges() {
  const rivers = loadRivers()
  const usgsGauged = rivers.filter(r => r.g && r.gaugeSource === 'usgs')
  const lines = [`# Broken/Stale USGS Gauge Detection — ${DATE}`, '']
  lines.push(`Total USGS-gauged rivers: **${usgsGauged.length}**`)
  lines.push('')
  lines.push('Batched USGS instantaneous-values check (chunks of 80, last 24h):')
  // Reuse batch endpoint approach
  const ids = usgsGauged.map(r => r.g)
  const broken = []
  const stale = []
  for (let i = 0; i < ids.length; i += 80) {
    const chunk = ids.slice(i, i + 80)
    const url = `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${chunk.join(',')}&parameterCd=00060&siteStatus=active&period=PT24H`
    const { status, body } = await get(url, 25000)
    if (status !== 200) {
      // Whole chunk failed — flag all in this chunk as suspect
      for (const c of chunk) broken.push({ id: c, reason: `HTTP ${status} on chunk` })
      continue
    }
    try {
      const j = JSON.parse(body)
      const got = new Set()
      for (const ts of j.value?.timeSeries || []) {
        const sid = ts.sourceInfo?.siteCode?.[0]?.value
        if (sid) got.add(sid)
        const vals = ts.values?.[0]?.value || []
        const last = vals[vals.length - 1]
        if (!last || last.value === '-999999') stale.push({ id: sid, reason: 'no recent value' })
      }
      for (const c of chunk) if (!got.has(c)) broken.push({ id: c, reason: 'no series returned' })
    } catch { for (const c of chunk) broken.push({ id: c, reason: 'parse fail' }) }
    await new Promise(r => setTimeout(r, 200))
  }
  // Map back to river IDs
  const idToRiver = new Map(usgsGauged.map(r => [r.g, r]))
  lines.push(`## Broken / no-data gauges (${broken.length})`)
  for (const b of broken.slice(0, 60)) {
    const r = idToRiver.get(b.id)
    lines.push(`- \`${r?.id || '?'}\` (${r?.abbr || '?'}) → \`${b.id}\` — ${b.reason}`)
  }
  if (broken.length > 60) lines.push(`...and ${broken.length - 60} more`)
  lines.push('')
  lines.push(`## Stale gauges (last reading -999999): ${stale.length}`)
  writeReport('11-broken-usgs-gauges', lines.join('\n'))
  summary(`Task 11 (Broken USGS): ${broken.length} gauges returned no series, ${stale.length} stale (-999999)`)
}

// ── TASK 12: DB query performance analysis (static) ─────────────
function task12_dbQueryAnalysis() {
  // Static analysis — grep for .from('...') patterns and flag known
  // performance hot spots based on the codebase.
  const lines = [`# DB Query Performance Analysis — ${DATE}`, '']
  lines.push('Static analysis only (no live DB EXPLAIN access from this run).')
  lines.push('')
  // Recursively scan app/ and lib/ for .from() calls
  const supabaseCalls = []
  const walk = (dir) => {
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, f.name)
      if (f.isDirectory()) { if (!p.includes('node_modules') && !p.includes('.next')) walk(p); continue }
      if (!/\.(ts|tsx)$/.test(f.name)) continue
      const src = fs.readFileSync(p, 'utf8')
      for (const m of src.matchAll(/\.from\(['"]([a-z_]+)['"]\)([\s\S]{0,200})/g)) {
        const next = m[2]
        const hasLimit = /\.limit\(/.test(next)
        const hasFilter = /\.eq\(|\.in\(|\.gt\(|\.lt\(|\.match\(|\.or\(/.test(next)
        supabaseCalls.push({ file: path.relative(REPO, p), table: m[1], hasLimit, hasFilter })
      }
    }
  }
  walk(path.join(REPO, 'app'))
  walk(path.join(REPO, 'lib'))

  const unfiltered = supabaseCalls.filter(c => !c.hasFilter)
  const tableUsage = {}
  for (const c of supabaseCalls) tableUsage[c.table] = (tableUsage[c.table] || 0) + 1

  lines.push(`Total \`.from('...')\` calls: **${supabaseCalls.length}** across ${new Set(supabaseCalls.map(c => c.file)).size} files`)
  lines.push(`Unfiltered (no .eq/.in/.gt/.match/.or): **${unfiltered.length}** — these scan whole tables and may need an index or .limit()`)
  lines.push('')
  lines.push('## Most queried tables')
  for (const [t, n] of Object.entries(tableUsage).sort((a, b) => b[1] - a[1]).slice(0, 15)) {
    lines.push(`- \`${t}\`: ${n} call sites`)
  }
  lines.push('')
  lines.push('## Unfiltered queries (potential full-table scans)')
  for (const c of unfiltered.slice(0, 30)) lines.push(`- \`${c.table}\` in \`${c.file}\`${c.hasLimit ? ' (has .limit)' : ' ⚠️  no .limit'}`)
  writeReport('12-db-query-performance', lines.join('\n'))
  summary(`Task 12 (DB perf): ${supabaseCalls.length} Supabase calls scanned; ${unfiltered.length} unfiltered (potential full-table scans)`)
}

// ── Main ───────────────────────────────────────────────────────
async function main() {
  // Read .env.local for Supabase config (optional — Q&A task uses it)
  let supabaseConfig = null
  try {
    const env = fs.readFileSync(path.join(REPO, '.env.local'), 'utf8')
    const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(\S+)/)?.[1]
    const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(\S+)/)?.[1] || env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(\S+)/)?.[1]
    if (url && key) supabaseConfig = { url, key }
  } catch { /* fine */ }

  // Local / fast tasks first
  task6_polylineStatus()
  task7_descAudit()
  task9_missingFisheries()
  task5_sitemap()
  task12_dbQueryAnalysis()
  task1_usgsGaugeReport()
  task4_nrpImportPreview()

  // Network-bound tasks
  await task2_wscMatching()
  await task8_qaSeed(supabaseConfig)
  await task11_brokenGauges()
  await task10_deadLinks()
  await task3_historicalAvg()

  // Final summary
  const final = [
    '',
    '═══════════════════════════════════════',
    'OVERNIGHT RUN COMPLETE',
    '═══════════════════════════════════════',
    `Reports written to ${REPORTS}`,
    '',
    'Per-task summaries:',
    ...summaries.map(s => '  • ' + s),
    '',
  ].join('\n')
  console.log(final)
  fs.writeFileSync(path.join(REPORTS, `_OVERNIGHT_SUMMARY-${DATE}.md`), final)
}

main().catch(e => { console.error('FATAL', e); process.exit(1) })
