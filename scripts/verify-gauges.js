#!/usr/bin/env node
// Verify every USGS gauge ID in data/rivers.ts against the USGS site
// service. Reports (1) gauges that don't exist, (2) gauges whose
// station_nm doesn't plausibly match the river name in our data.
//
// Output: /tmp/gauge-report.json with { missing, mismatched, ok } lists.

const fs = require('fs')
const path = require('path')
const https = require('https')

const src = fs.readFileSync(path.resolve(__dirname, '..', 'data', 'rivers.ts'), 'utf8')

// Parse (id, name, gauge) triples. Name follows `n: '...'` and gauge follows `g: '...'`
const rows = []
const re = /id:\s*'([a-z0-9_]+)',\s*n:\s*'([^']+)'[\s\S]{0,600}?g:\s*'([0-9]*)'/g
let m
while ((m = re.exec(src))) {
  rows.push({ id: m[1], name: m[2], gauge: m[3] })
}
console.log(`Parsed ${rows.length} rivers`)

const withGauge = rows.filter(r => r.gauge)
const withoutGauge = rows.filter(r => !r.gauge)
console.log(`${withGauge.length} with gauge, ${withoutGauge.length} without`)

function fetchBatch(sites) {
  return new Promise((resolve, reject) => {
    const url = `https://waterservices.usgs.gov/nwis/site/?sites=${sites.join(',')}&format=rdb&siteOutput=expanded`
    https.get(url, res => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => resolve({ status: res.statusCode, body: data }))
    }).on('error', reject)
  })
}

async function main() {
  const BATCH = 50
  const siteMap = {}  // site_no -> station_nm
  for (let i = 0; i < withGauge.length; i += BATCH) {
    const batch = withGauge.slice(i, i + BATCH).map(r => r.gauge)
    const unique = Array.from(new Set(batch))
    process.stderr.write(`  batch ${i / BATCH + 1}/${Math.ceil(withGauge.length / BATCH)}...\n`)
    const { status, body } = await fetchBatch(unique)
    if (status !== 200) {
      console.error(`  status ${status} for batch starting ${batch[0]}`)
      continue
    }
    for (const line of body.split('\n')) {
      if (line.startsWith('#') || !line.trim() || line.startsWith('agency_cd') || line.startsWith('5s')) continue
      const fields = line.split('\t')
      // USGS format: agency_cd, site_no, station_nm, ...
      if (fields.length < 3 || !/^\d+$/.test(fields[1])) continue
      siteMap[fields[1]] = fields[2]
    }
    await new Promise(r => setTimeout(r, 500))  // be polite
  }

  const missing = []
  const mismatched = []
  const ok = []
  for (const r of withGauge) {
    const station = siteMap[r.gauge]
    if (!station) { missing.push(r); continue }
    // Plausibility: does the river name (first word) appear in the station name?
    const riverWord = r.name.replace(/ River$/i, '').replace(/'/g, '').split(/[\s,]/)[0].toLowerCase()
    const stationLower = station.toLowerCase()
    if (riverWord.length >= 3 && !stationLower.includes(riverWord)) {
      mismatched.push({ ...r, station })
    } else {
      ok.push({ ...r, station })
    }
  }

  const report = {
    totals: { rivers: rows.length, withGauge: withGauge.length, withoutGauge: withoutGauge.length, missing: missing.length, mismatched: mismatched.length, ok: ok.length },
    missing,
    mismatched,
    withoutGauge,
  }
  fs.writeFileSync('/tmp/gauge-report.json', JSON.stringify(report, null, 2))
  console.log(JSON.stringify(report.totals, null, 2))
  console.log(`\nMISSING (${missing.length}):`)
  for (const r of missing) console.log(`  ${r.id}  g=${r.gauge}  (${r.name})`)
  console.log(`\nMISMATCHED (${mismatched.length}):`)
  for (const r of mismatched) console.log(`  ${r.id}  g=${r.gauge}  our="${r.name}"  USGS="${r.station}"`)
}

main().catch(e => { console.error(e); process.exit(1) })
