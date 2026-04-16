#!/usr/bin/env node
// Re-check the 142 outfitter "dead" links with GET (not HEAD).
// HEAD returns 405 on many live sites — GET is the real test.
// Only flag a link as genuinely dead when GET also fails.
//
// Output: c:/tmp/dead-links-recheck.json + console summary

const fs = require('fs')
const https = require('https')
const http = require('http')

const REPORT = 'reports/10b-outfitter-dead-links-FULL-2026-04-15.md'
const OUT = 'c:/tmp/dead-links-recheck.json'

function parseDeadLinks(body) {
  const out = []
  for (const m of body.matchAll(/^- (\S+)\s+\(([^)]+)\) — (.+)$/gm)) {
    out.push({ url: m[1], prevReason: m[2], name: m[3] })
  }
  // Extract river_id from the ### headers
  let currentRiver = ''
  for (const line of body.split('\n')) {
    const hm = line.match(/^### `([^`]+)`/)
    if (hm) currentRiver = hm[1]
    const lm = line.match(/^- (\S+)\s+\(([^)]+)\) — (.+)$/)
    if (lm) {
      const last = out.find(o => o.url === lm[1] && o.name === lm[3] && !o.riverId)
      if (last) last.riverId = currentRiver
    }
  }
  return out
}

function fetchGet(rawUrl, timeout = 10000) {
  return new Promise(resolve => {
    const url = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`
    let u
    try { u = new URL(url) } catch { resolve({ status: 0, reason: 'invalid URL' }); return }
    const lib = u.protocol === 'http:' ? http : https
    const req = lib.get(url, { timeout, headers: { 'User-Agent': 'Mozilla/5.0 (RiverScout link check)' } }, res => {
      res.resume() // drain body
      resolve({ status: res.statusCode })
    })
    req.on('error', () => resolve({ status: 0, reason: 'connect error' }))
    req.on('timeout', () => { req.destroy(); resolve({ status: 0, reason: 'timeout' }) })
  })
}

async function main() {
  const body = fs.readFileSync(REPORT, 'utf8')
  const links = parseDeadLinks(body)
  console.log(`Re-checking ${links.length} links with GET...`)

  const results = { alive: [], dead: [], ambiguous: [] }
  let i = 0
  for (const l of links) {
    i++
    const r = await fetchGet(l.url, 12000)
    const entry = { ...l, getStatus: r.status, getError: r.reason || null }
    if (r.status >= 200 && r.status < 400) {
      results.alive.push(entry)
    } else if (r.status === 0) {
      results.dead.push(entry) // truly unreachable
    } else if (r.status >= 400) {
      // 4xx/5xx on GET — still potentially alive (WAF, geo-block).
      // If 404 → dead. If 403/500/503 → ambiguous.
      if (r.status === 404) results.dead.push(entry)
      else results.ambiguous.push(entry)
    }
    if (i % 30 === 0) console.log(`  ${i}/${links.length}  alive=${results.alive.length} dead=${results.dead.length} ambig=${results.ambiguous.length}`)
    await new Promise(r => setTimeout(r, 100))
  }

  fs.writeFileSync(OUT, JSON.stringify(results, null, 2))
  console.log(`\nResults:`)
  console.log(`  Alive (GET 2xx/3xx): ${results.alive.length}`)
  console.log(`  Dead (timeout/404):  ${results.dead.length}`)
  console.log(`  Ambiguous (403/5xx): ${results.ambiguous.length}`)
  console.log(`\nDead links to blank:`)
  for (const d of results.dead) console.log(`  [${d.riverId}] ${d.url} — ${d.name} (GET ${d.getStatus || d.getError})`)
}
main().catch(e => { console.error(e); process.exit(1) })
