#!/usr/bin/env node
// For each mismatched river, find candidate USGS discharge gauges in
// the matching state by name-keyword match. The USGS site service
// doesn't support a name-search query parameter, so we fetch ALL
// stream-discharge sites per state once, cache them, and filter
// client-side.
//
// Output: docs/gauge-audit.md ranked candidates per river.

const fs = require('fs')
const https = require('https')
const path = require('path')

const rivers = require('/tmp/gauge-genuine-mismatches.json')

const src = fs.readFileSync(path.resolve(__dirname, '..', 'data', 'rivers.ts'), 'utf8')
const stateByRiver = {}
const re = /id:\s*'([a-z0-9_]+)'[\s\S]{0,800}?abbr:\s*'([A-Z]{2})'/g
let m
while ((m = re.exec(src))) stateByRiver[m[1]] = m[2]

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
  const { status, body } = await get(url)
  if (status !== 200) { stateCache[state] = []; return [] }
  stateCache[state] = parseRdb(body)
  return stateCache[state]
}

function tokenize(s) {
  return s.toLowerCase()
    .replace(/[\u2014\u2013-]/g, ' ')
    .replace(/[^a-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 3 && !['the','river','creek','fork','near','for','and','with'].includes(w))
}

function score(siteName, riverName) {
  const a = new Set(tokenize(siteName))
  const b = new Set(tokenize(riverName))
  let s = 0
  for (const w of b) if (a.has(w)) s += 2
  // Bonus for substring containment of the dominant noun
  const compactSite = siteName.toLowerCase().replace(/[^a-z0-9]/g, '')
  for (const w of b) if (w.length >= 5 && compactSite.includes(w)) s += 1
  return s
}

async function main() {
  // Pre-fetch every needed state once
  const needed = Array.from(new Set(rivers.map(r => stateByRiver[r.id]).filter(Boolean)))
  process.stderr.write(`Loading ${needed.length} states...\n`)
  for (const st of needed) {
    process.stderr.write(`  ${st}\n`)
    await loadState(st)
    await new Promise(r => setTimeout(r, 250))
  }

  const lines = [
    '# Gauge audit — candidate replacements',
    '',
    `Generated ${new Date().toISOString().slice(0, 10)}. ${rivers.length} rivers flagged where the live USGS station name doesn\u2019t match our river. For each, up to 5 ranked candidates from in-state USGS discharge gauges. Pick the best match (or confirm the current one is intentionally a proxy).`,
    '',
  ]

  let withCandidates = 0
  for (const r of rivers) {
    const state = stateByRiver[r.id]
    if (!state) { lines.push(`## ${r.id} (no state)`); lines.push(''); continue }
    const sites = stateCache[state] || []
    const ranked = sites
      .map(s => ({ ...s, score: score(s.name, r.name) }))
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
    lines.push(`## ${r.id} \u2014 "${r.name}" (${state})`)
    lines.push(`- Current: \`${r.gauge}\` (${r.station})`)
    if (ranked.length === 0) {
      lines.push(`- No USGS discharge gauge in ${state} matches the river name. (Likely no gauge exists; current may be intentional proxy.)`)
    } else {
      withCandidates++
      lines.push('- Candidates:')
      for (const c of ranked) {
        const flag = c.site === r.gauge ? ' \u2190 current' : ''
        lines.push(`  - \`${c.site}\` (score ${c.score}) \u2014 ${c.name}${flag}`)
      }
    }
    lines.push('')
  }

  const out = path.resolve(__dirname, '..', 'docs', 'gauge-audit.md')
  fs.writeFileSync(out, lines.join('\n'))
  console.log(`Wrote ${out}`)
  console.log(`${withCandidates}/${rivers.length} rivers have candidate matches in their state`)
}

main().catch(e => { console.error(e); process.exit(1) })
