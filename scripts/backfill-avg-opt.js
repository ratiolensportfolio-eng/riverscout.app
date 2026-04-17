#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const RIVERS_TS = path.resolve(__dirname, '..', 'data', 'rivers.ts')

const src = fs.readFileSync(RIVERS_TS, 'utf8')
const rivers = [...src.matchAll(/id:\s*'([^']+)'[^}]*?opt:\s*'([^']*)'[^}]*?g:\s*'([^']*)'[^}]*?avg:\s*(\d+)/g)]
  .map(m => ({ id: m[1], opt: m[2], g: m[3], avg: parseInt(m[4]) }))
  .filter(r => r.g && (r.avg === 0 || !r.opt))

// Filter out WSC (Canadian) gauges — they have letters in the ID
// and poison USGS API batch calls (USGS rejects the entire request
// when it encounters a non-numeric site ID).
const gauges = [...new Set(rivers.map(r => r.g).filter(g => /^\d+$/.test(g)))]
console.log('USGS gauges to query:', gauges.length, '(excluded', rivers.filter(r => !/^\d+$/.test(r.g)).length, 'WSC)')

async function fetchBatch(ids) {
  const url = `https://waterservices.usgs.gov/nwis/stat/?format=rdb&sites=${ids.join(',')}&parameterCd=00060&statReportType=daily&statType=mean`
  const res = await fetch(url)
  const text = await res.text()
  const lines = text.split('\n').filter(l => !l.startsWith('#') && l.trim())
  if (lines.length < 2) return new Map()
  const headers = lines[0].split('\t')
  const siteIdx = headers.indexOf('site_no')
  const meanIdx = headers.indexOf('mean_va')
  const map = new Map()
  for (const line of lines.slice(2)) {
    const cols = line.split('\t')
    const site = cols[siteIdx]
    const val = parseFloat(cols[meanIdx])
    if (site && !isNaN(val)) {
      if (!map.has(site)) map.set(site, [])
      map.get(site).push(val)
    }
  }
  const result = new Map()
  for (const [site, vals] of map) {
    result.set(site, Math.round(vals.reduce((a, b) => a + b, 0) / vals.length))
  }
  return result
}

function roundOpt(val) {
  if (val < 50) return Math.round(val / 5) * 5
  if (val < 200) return Math.round(val / 10) * 10
  if (val < 1000) return Math.round(val / 25) * 25
  if (val < 5000) return Math.round(val / 50) * 50
  return Math.round(val / 100) * 100
}

async function main() {
  const avgByGauge = new Map()
  for (let i = 0; i < gauges.length; i += 10) {
    const batch = gauges.slice(i, i + 10)
    process.stdout.write(`Batch ${Math.floor(i / 10) + 1}/${Math.ceil(gauges.length / 10)}... `)
    try {
      const result = await fetchBatch(batch)
      for (const [k, v] of result) avgByGauge.set(k, v)
      console.log(`${result.size} gauges`)
    } catch (e) {
      console.log(`ERROR: ${e.message}`)
    }
    await new Promise(r => setTimeout(r, 800))
  }

  console.log(`\nTotal avg CFS fetched: ${avgByGauge.size}`)

  const proposals = []
  for (const r of rivers) {
    const avg = avgByGauge.get(r.g)
    if (!avg) continue
    const lo = roundOpt(avg * 0.5)
    const hi = roundOpt(avg * 1.5)
    proposals.push({
      id: r.id, gauge: r.g, avg, opt: `${lo}\u2013${hi}`,
      hadAvg: r.avg > 0, hadOpt: !!r.opt,
    })
  }

  console.log(`Proposals: ${proposals.length}`)
  console.log(`  New avg: ${proposals.filter(p => !p.hadAvg).length}`)
  console.log(`  New opt: ${proposals.filter(p => !p.hadOpt).length}`)

  let updated = fs.readFileSync(RIVERS_TS, 'utf8')
  let appliedAvg = 0, appliedOpt = 0

  for (const p of proposals) {
    const esc = p.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

    if (!p.hadAvg) {
      const re = new RegExp("(id:\\s*'" + esc + "'[^}]*?avg:\\s*)0")
      const before = updated
      updated = updated.replace(re, '$1' + p.avg)
      if (updated !== before) appliedAvg++
    }

    if (!p.hadOpt) {
      const re = new RegExp("(id:\\s*'" + esc + "'[^}]*?opt:\\s*)''")
      const before = updated
      updated = updated.replace(re, "$1'" + p.opt + "'")
      if (updated !== before) appliedOpt++
    }
  }

  fs.writeFileSync(RIVERS_TS, updated)
  console.log(`\nApplied avg: ${appliedAvg}`)
  console.log(`Applied opt: ${appliedOpt}`)
}

main().catch(console.error)
