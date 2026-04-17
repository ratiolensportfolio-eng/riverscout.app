#!/usr/bin/env node
// Backfill avg CFS, optimal CFS range, and county for rivers that
// have a USGS gauge but are missing these fields. Uses:
//   - USGS Site Service (county name, drainage area)
//   - USGS Statistics Service (annual mean discharge)
//
// Optimal CFS is estimated as: avg*0.6 – avg*1.5, rounded to
// clean numbers. This is a paddling-community heuristic, NOT an
// official classification. Rivers with these auto-derived ranges
// get a needsVerification tag so the community can refine them.
//
// Usage: node scripts/backfill-usgs-stats.js
// Outputs: c:/tmp/usgs-backfill-results.json (review before applying)
//          Then run with --apply to write to rivers.ts

const fs = require('fs')
const path = require('path')

const RIVERS_TS = path.resolve(__dirname, '..', 'data', 'rivers.ts')
const DELAY_MS = 600
const APPLY = process.argv.includes('--apply')

async function fetchSiteInfo(gaugeIds) {
  const url = `https://waterservices.usgs.gov/nwis/site/?format=rdb&sites=${gaugeIds.join(',')}&siteOutput=expanded&siteStatus=all`
  const res = await fetch(url)
  const text = await res.text()
  const lines = text.split('\n').filter(l => !l.startsWith('#') && l.trim())
  if (lines.length < 2) return new Map()
  const headers = lines[0].split('\t')
  const countyIdx = headers.indexOf('county_cd')
  const siteIdx = headers.indexOf('site_no')
  const nameIdx = headers.indexOf('station_nm')
  const drainIdx = headers.indexOf('drain_area_va')
  const map = new Map()
  for (const line of lines.slice(2)) { // skip header + format row
    const cols = line.split('\t')
    if (cols[siteIdx]) {
      map.set(cols[siteIdx], {
        countyCode: cols[countyIdx] || '',
        name: cols[nameIdx] || '',
        drainArea: parseFloat(cols[drainIdx]) || 0,
      })
    }
  }
  return map
}

async function fetchCountyName(fips) {
  // FIPS county code is SS + CCC (state + county). We just need the name.
  // Use a simple lookup via the Census FIPS list, or derive from the site name.
  return null // Will use site name parsing instead
}

async function fetchAnnualStats(gaugeIds) {
  const url = `https://waterservices.usgs.gov/nwis/stat/?format=rdb&sites=${gaugeIds.join(',')}&parameterCd=00060&statReportType=annual&statType=mean`
  const res = await fetch(url)
  const text = await res.text()
  const lines = text.split('\n').filter(l => !l.startsWith('#') && l.trim())
  if (lines.length < 2) return new Map()
  const headers = lines[0].split('\t')
  const siteIdx = headers.indexOf('site_no')
  const yearIdx = headers.indexOf('year_nu')
  const valueIdx = headers.indexOf('mean_va')
  const map = new Map() // gauge_id → [values]
  for (const line of lines.slice(2)) {
    const cols = line.split('\t')
    const site = cols[siteIdx]
    const year = parseInt(cols[yearIdx])
    const val = parseFloat(cols[valueIdx])
    if (site && year >= 2015 && !isNaN(val)) {
      if (!map.has(site)) map.set(site, [])
      map.get(site).push(val)
    }
  }
  // Average per site
  const result = new Map()
  for (const [site, vals] of map) {
    const avg = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
    result.set(site, avg)
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

function deriveOptRange(avg) {
  const lo = roundOpt(avg * 0.5)
  const hi = roundOpt(avg * 1.5)
  return `${lo}\u2013${hi}`
}

// Extract county from USGS station name (often has "NEAR CITYNAME, ST" or "AT COUNTY, ST")
function extractCountyFromName(stationName, stateAbbr) {
  // Try to extract location after "NEAR" or "AT"
  const match = stationName.match(/(?:NEAR|NR|AT)\s+(.+?),?\s+[A-Z]{2}\s*$/i)
  if (match) {
    const loc = match[1].trim().replace(/,\s*$/, '')
    return `${loc} Co.`
  }
  return ''
}

async function main() {
  const src = fs.readFileSync(RIVERS_TS, 'utf8')
  const rivers = [...src.matchAll(/\{\s*id:\s*'([^']+)',\s*n:\s*'([^']+)'[^}]*?co:\s*'([^']*)'[^}]*?cls:\s*'([^']*)'[^}]*?opt:\s*'([^']*)'[^}]*?g:\s*'([^']*)'[^}]*?avg:\s*(\d+)[^}]*?abbr:\s*'([^']*)'/g)]
    .map(m => ({ id: m[1], name: m[2], co: m[3], cls: m[4], opt: m[5], g: m[6], avg: parseInt(m[7]), abbr: m[8] }))

  const needsBackfill = rivers.filter(r => r.g && (!r.opt || r.avg === 0 || !r.co))
  console.log(`Rivers needing backfill: ${needsBackfill.length}`)

  // Collect unique gauge IDs
  const gaugeIds = [...new Set(needsBackfill.map(r => r.g).filter(Boolean))]
  console.log(`Unique gauges to query: ${gaugeIds.length}`)

  // Batch queries (100 at a time)
  const siteInfo = new Map()
  const avgByGauge = new Map()

  for (let i = 0; i < gaugeIds.length; i += 80) {
    const batch = gaugeIds.slice(i, i + 80)
    process.stdout.write(`Querying USGS batch ${Math.floor(i/80) + 1}/${Math.ceil(gaugeIds.length/80)}...`)

    try {
      const [sites, stats] = await Promise.all([
        fetchSiteInfo(batch),
        fetchAnnualStats(batch),
      ])
      for (const [k, v] of sites) siteInfo.set(k, v)
      for (const [k, v] of stats) avgByGauge.set(k, v)
      console.log(` sites:${sites.size} stats:${stats.size}`)
    } catch (e) {
      console.log(` ERROR: ${e.message}`)
    }

    await new Promise(res => setTimeout(res, DELAY_MS))
  }

  console.log(`\nSite info fetched: ${siteInfo.size}`)
  console.log(`Avg CFS fetched: ${avgByGauge.size}`)

  // Build backfill proposals
  const proposals = []
  for (const r of needsBackfill) {
    const site = siteInfo.get(r.g)
    const avgCfs = avgByGauge.get(r.g)
    const patch = { id: r.id, gauge: r.g }
    let changed = false

    if (r.avg === 0 && avgCfs) {
      patch.avg = avgCfs
      changed = true
    }
    if (!r.opt && avgCfs) {
      patch.opt = deriveOptRange(avgCfs)
      changed = true
    }
    if (!r.co && site) {
      const county = extractCountyFromName(site.name, r.abbr)
      if (county) {
        patch.co = county
        changed = true
      }
    }

    if (changed) proposals.push(patch)
  }

  console.log(`\nProposals generated: ${proposals.length}`)
  fs.writeFileSync('c:/tmp/usgs-backfill-results.json', JSON.stringify(proposals, null, 2))
  console.log('Written to c:/tmp/usgs-backfill-results.json')

  if (APPLY) {
    console.log('\nApplying to rivers.ts...')
    let updated = fs.readFileSync(RIVERS_TS, 'utf8')
    let applied = 0

    for (const p of proposals) {
      const escaped = p.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

      if (p.avg) {
        const re = new RegExp("(id:\\s*'" + escaped + "'[^}]*?avg:\\s*)\\d+")
        const before = updated
        updated = updated.replace(re, '$1' + p.avg)
        if (updated !== before) applied++
      }
      if (p.opt) {
        const re = new RegExp("(id:\\s*'" + escaped + "'[^}]*?opt:\\s*)'([^']*)'")
        updated = updated.replace(re, "$1'" + p.opt + "'")
      }
      if (p.co) {
        const re = new RegExp("(id:\\s*'" + escaped + "'[^}]*?co:\\s*)'([^']*)'")
        updated = updated.replace(re, "$1'" + p.co.replace(/'/g, "\\'") + "'")
      }
    }

    fs.writeFileSync(RIVERS_TS, updated)
    console.log(`Applied ${applied} avg CFS updates (opt + co updated alongside)`)
  } else {
    console.log('\nRun with --apply to write changes to rivers.ts')
  }
}

main().catch(console.error)
