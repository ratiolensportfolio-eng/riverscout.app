#!/usr/bin/env node
// Overnight deep follow-ups — three read-only deeper analyses on
// items that came back interesting from the initial overnight run.
//
//   A. Full outfitter dead-link sweep (initial sample was 60).
//   B. Broken-gauge categorization for the 121 no-series gauges.
//   C. Morning brief — prioritized action plan tying all reports.
//
// All output appended to reports/. NO live writes.

const fs = require('fs')
const path = require('path')
const https = require('https')

const REPO = path.resolve(__dirname, '..')
const REPORTS = path.join(REPO, 'reports')
const DATE = new Date().toISOString().slice(0, 10)

function get(url, timeout = 15000) {
  return new Promise(resolve => {
    const req = https.get(url, { timeout, headers: { 'User-Agent': 'RiverScout-Overnight/1.0' } }, res => {
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
      if (id) rivers.push({ id, n, g, abbr, stateKey, gaugeSource })
    }
  }
  return rivers
}

function loadOutfitters() {
  const src = fs.readFileSync(path.join(REPO, 'data', 'rivers.ts'), 'utf8')
  const out = []
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

// ── A. Full outfitter dead-link sweep ───────────────────────────
async function deepA_fullDeadLinks() {
  const outs = loadOutfitters().filter(o => o.link)
  const results = { alive: [], dead: [], invalid: [] }
  console.log(`[A] Full sweep: ${outs.length} outfitter URLs (~${Math.ceil(outs.length / 10)} sec at 100ms throttle)`)

  let i = 0
  for (const o of outs) {
    i++
    let url = o.link.startsWith('http') ? o.link : `https://${o.link}`
    let u
    try { u = new URL(url) } catch { results.invalid.push({ ...o, reason: 'invalid URL' }); continue }
    const code = await new Promise(resolve => {
      const r = https.request({ hostname: u.hostname, path: u.pathname || '/', method: 'HEAD', timeout: 7000, headers: { 'User-Agent': 'RiverScout-LinkCheck/1.0' } }, response => resolve(response.statusCode || 0))
      r.on('error', () => resolve(0)); r.on('timeout', () => { r.destroy(); resolve(0) })
      r.end()
    })
    if (code >= 200 && code < 400) results.alive.push({ ...o, code })
    else if (code >= 400) results.dead.push({ ...o, code, reason: `HTTP ${code}` })
    else results.dead.push({ ...o, code: 0, reason: 'connect/timeout' })
    if (i % 50 === 0) console.log(`[A] ${i}/${outs.length}  alive=${results.alive.length} dead=${results.dead.length} invalid=${results.invalid.length}`)
    await new Promise(r => setTimeout(r, 80))
  }

  const lines = [
    `# Outfitter Dead-Link Sweep (FULL) — ${DATE}`,
    '',
    `Checked: **${outs.length}** outfitter URLs`,
    `- alive (2xx/3xx): **${results.alive.length}**`,
    `- dead: **${results.dead.length}**`,
    `- invalid URL: **${results.invalid.length}**`,
    '',
    '## Dead links — full list grouped by river',
    '',
  ]
  const byRiver = {}
  for (const d of results.dead) (byRiver[d.riverId] ||= []).push(d)
  for (const [rid, ds] of Object.entries(byRiver).sort((a, b) => b[1].length - a[1].length)) {
    lines.push(`### \`${rid}\` (${ds.length} dead)`)
    for (const d of ds) lines.push(`- ${d.link}  (${d.reason}) — ${d.name}`)
    lines.push('')
  }
  if (results.invalid.length) {
    lines.push('## Invalid URLs')
    for (const d of results.invalid) lines.push(`- \`${d.riverId}\`: ${d.link}  — ${d.name}`)
  }
  fs.writeFileSync(path.join(REPORTS, `10b-outfitter-dead-links-FULL-${DATE}.md`), lines.join('\n'))
  console.log(`[A] DONE: ${results.dead.length} dead of ${outs.length}`)
  return results
}

// ── B. Broken-gauge categorization ──────────────────────────────
// Known dam-controlled patterns: gauge name contains "BELOW", "DAM",
// "RELEASE", "POWERHOUSE". These are expected to go silent between
// scheduled releases.
async function deepB_brokenGaugeCategories() {
  const rivers = loadRivers().filter(r => r.g && r.gaugeSource === 'usgs')
  console.log(`[B] Re-checking ${rivers.length} USGS gauges (batched ${Math.ceil(rivers.length / 80)} chunks)`)

  // Pull station metadata for naming; collect no-series + stale lists.
  const noSeries = []
  const stale = []
  const live = []

  // Re-batch the same iv check from overnight, keep richer info.
  for (let i = 0; i < rivers.length; i += 80) {
    const chunk = rivers.slice(i, i + 80)
    const ids = chunk.map(r => r.g).join(',')
    const url = `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${ids}&parameterCd=00060&siteStatus=active&period=PT72H`
    const { status, body } = await get(url, 25000)
    const got = new Map() // siteCode → { lastVal, lastTime, name }
    if (status === 200) {
      try {
        const j = JSON.parse(body)
        for (const ts of j.value?.timeSeries || []) {
          const sid = ts.sourceInfo?.siteCode?.[0]?.value
          const name = ts.sourceInfo?.siteName ?? ''
          const vals = ts.values?.[0]?.value || []
          const last = vals[vals.length - 1]
          if (sid) got.set(sid, { lastVal: last?.value ?? null, lastTime: last?.dateTime ?? null, name })
        }
      } catch { /* fall through — chunk treated as no-series */ }
    }
    for (const c of chunk) {
      const r = got.get(c.g)
      if (!r) { noSeries.push({ ...c, name: '' }); continue }
      if (r.lastVal === '-999999' || r.lastVal == null) stale.push({ ...c, name: r.name, lastVal: r.lastVal, lastTime: r.lastTime })
      else live.push({ ...c, name: r.name, lastVal: r.lastVal, lastTime: r.lastTime })
    }
    console.log(`[B] chunk ${i}-${i+chunk.length}: live=${live.length} no-series=${noSeries.length} stale=${stale.length}`)
    await new Promise(r => setTimeout(r, 200))
  }

  // For categorization we need the station name. Fetch missing names
  // for noSeries gauges via the site metadata endpoint.
  for (let i = 0; i < noSeries.length; i += 100) {
    const chunk = noSeries.slice(i, i + 100)
    const ids = chunk.map(c => c.g).join(',')
    const url = `https://waterservices.usgs.gov/nwis/site/?format=rdb&sites=${ids}`
    const { status, body } = await get(url, 20000)
    if (status === 200) {
      const lines = body.split('\n').filter(l => l && !l.startsWith('#'))
      const cols = lines[0]?.split('\t') || []
      const iId = cols.indexOf('site_no'), iName = cols.indexOf('station_nm')
      const map = new Map()
      for (const l of lines.slice(2)) {
        const c = l.split('\t')
        if (c[iId]) map.set(c[iId], c[iName] || '')
      }
      for (const c of chunk) c.name = map.get(c.g) || ''
    }
    await new Promise(r => setTimeout(r, 200))
  }

  function classify(name) {
    const u = (name || '').toUpperCase()
    if (/BELOW.*DAM|RELEASE|POWERHOUSE|TAILRACE|TAILWATER/.test(u)) return 'dam-released'
    if (/ABOVE.*DAM|NEAR.*DAM|RESERVOIR|LAKE|POOL/.test(u)) return 'reservoir-related'
    if (/CREEK|FORK|BRANCH/.test(u) && !/RIVER/.test(u)) return 'small-creek-likely-seasonal'
    return 'unknown / possibly truly dead'
  }

  const buckets = {}
  for (const c of noSeries) {
    const k = classify(c.name)
    ;(buckets[k] ||= []).push(c)
  }

  const lines = [
    `# Broken-gauge Categorization (DEEP) — ${DATE}`,
    '',
    `Re-checked: **${rivers.length}** USGS gauges over a 72-hour window.`,
    `- live data returned: **${live.length}**`,
    `- no-series (suspected broken/seasonal): **${noSeries.length}**`,
    `- stale (-999999): **${stale.length}**`,
    '',
    '## No-series buckets',
    '',
  ]
  for (const [k, arr] of Object.entries(buckets).sort((a, b) => b[1].length - a[1].length)) {
    lines.push(`### ${k} — ${arr.length}`)
    for (const c of arr.slice(0, 30)) lines.push(`- \`${c.id}\` (${c.abbr}) → \`${c.g}\`  ${c.name || '(no name)'}`)
    if (arr.length > 30) lines.push(`  ...and ${arr.length - 30} more`)
    lines.push('')
  }
  if (stale.length) {
    lines.push('## Stale (-999999) gauges')
    for (const s of stale.slice(0, 30)) lines.push(`- \`${s.id}\` (${s.abbr}) → \`${s.g}\`  last reading at ${s.lastTime}`)
  }
  fs.writeFileSync(path.join(REPORTS, `11b-broken-gauges-categorized-${DATE}.md`), lines.join('\n'))
  console.log(`[B] DONE: live=${live.length} no-series=${noSeries.length} stale=${stale.length}`)
  return { live, noSeries, stale, buckets }
}

// ── C. Morning brief — prioritized action plan ───────────────────
function deepC_morningBrief(deadResults, gaugeResults) {
  const lines = [
    `# Morning Brief — ${DATE}`,
    '',
    'Prioritized action plan synthesizing all overnight reports.',
    'Items ordered by user-impact × effort.',
    '',
    '## 🔴 High user-impact, ready to action',
    '',
    '### 1. Apply 340 confident USGS gauge attaches (Task 1)',
    'Re-run `node scripts/apply-usgs-gauges.js` against the existing `c:/tmp/gauge-discovery-preview.json`. This is what we did before — same script, no schema changes. Adds live CFS to 340 currently-blank rivers.',
    '',
    '### 2. Fix 51 unfiltered Supabase queries (Task 12)',
    'See `12-db-query-performance-2026-04-15.md` for the call-site list. Each unfiltered `.from(\'table\')` either needs an `.eq()` filter, an index, or a `.limit(N)`. These are real perf liabilities at scale.',
    '',
    '### 3. Run migration 037 + multi-gauge seed in Supabase',
    'Migration 037 enables per-gauge avg flow caching (already coded, just needs to run). Then re-run `supabase/seeds/river_gauges_seed.sql` so the multi-gauge demos populate.',
    '',
    '## 🟡 Medium-impact, scoped follow-ups',
    '',
    `### 4. Outfitter link cleanup (FULL sweep complete: ${deadResults?.dead.length || '?'} dead of ${(deadResults?.alive.length || 0) + (deadResults?.dead.length || 0) + (deadResults?.invalid.length || 0)})`,
    'See `10b-outfitter-dead-links-FULL-2026-04-15.md`. Recommend: don\'t auto-remove (transient downtime exists), but flag the per-river top offenders to revisit URLs / contact outfitters.',
    '',
    `### 5. Broken-gauge triage (${gaugeResults?.noSeries.length || '?'} no-series, categorized)`,
    'See `11b-broken-gauges-categorized-2026-04-15.md`. Most "broken" gauges likely fall into:',
    '  - **dam-released**: expected silent (Gauley dam release, Hawks Nest, etc.) → flag noGaugeAvailable=true ONLY if the river paddles only on releases',
    '  - **reservoir-related**: keep the gauge, just expect intermittent data',
    '  - **small-creek-likely-seasonal**: probably correct gauge, low summer flow',
    '  - **unknown**: actual review candidates — investigate first',
    '',
    '### 6. NHDPlus polylines for the 109 remaining rivers (Task 6)',
    '90% coverage today. The remaining 10% includes the new Ontario rivers and a handful of OH stragglers (incl. `black_fork_oh`). Update `scripts/river_extraction_map.csv` to include them, then rerun `python scripts/extract_phase2.py` in the `riverscout-gis` conda env.',
    '',
    '## 🟢 Low-impact backlog',
    '',
    '### 7. Description quality (125 short, 35 NRP-boilerplate) (Task 7)',
    'Manual rewrite or LLM-assist needed. NOT auto-fixable.',
    '',
    '### 8. Q&A seed (1,123 rivers with zero Q&A) (Task 8)',
    'Templates queued; need to actually generate quality questions per river.',
    '',
    '### 9. Fisheries data for 81 MI/MT/OR/CO/PA rivers (Task 9)',
    'Same approach as Alaska AWC: find a per-state authoritative source (MI DNR trout-stream list, MT FWP, ODFW Fish Habitat Distribution, CDFW, PFBC) and write per-state import scripts.',
    '',
    '### 10. NRP 1,025 candidates (Task 4)',
    'CSV preview ready. Re-applying same opt2c filter would import another wave. Don\'t do without explicit decision.',
    '',
    '## ✅ No action needed',
    '',
    '- Sitemap: dynamic `app/sitemap.ts` is in place (Task 5).',
    '- Historical avg flow population: lazy-fill is wired (Task 3).',
    '- WSC matching: 12/13 Canadian rivers gauged; only Kananaskis is correctly flagged (Task 2).',
  ]
  fs.writeFileSync(path.join(REPORTS, `_MORNING_BRIEF-${DATE}.md`), lines.join('\n'))
  console.log('[C] Morning brief written.')
}

async function main() {
  const dead = await deepA_fullDeadLinks()
  const gauges = await deepB_brokenGaugeCategories()
  deepC_morningBrief(dead, gauges)
  console.log('\n═══════════════════════════════════════')
  console.log('OVERNIGHT DEEP RUN COMPLETE')
  console.log('Reports:')
  console.log('  - reports/10b-outfitter-dead-links-FULL-' + DATE + '.md')
  console.log('  - reports/11b-broken-gauges-categorized-' + DATE + '.md')
  console.log('  - reports/_MORNING_BRIEF-' + DATE + '.md')
}

main().catch(e => { console.error('FATAL', e); process.exit(1) })
