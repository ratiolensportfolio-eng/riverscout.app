#!/usr/bin/env node
// Fetch species presence for each new Alaska NRP river from the
// ADFG Anadromous Waters Catalog (AWC 2025). The AWC is the
// authoritative state source — adopted by reference under 5 AAC
// 95.011 — so this is verified data, not a guess.
//
// Writes c:/tmp/awc-fisheries.json keyed by our river_id.

const fs = require('fs')
const https = require('https')

const ADDITIONS = 'c:/tmp/nrp-river-additions.json'
const OUT = 'c:/tmp/awc-fisheries.json'
const AWC = 'https://gis.adfg.alaska.gov/mapping/rest/services/sf_public/AWC_2025/MapServer/10/query'

// AWC species code → canonical name + type. Sourced from the ADFG
// AWC documentation (published at adfg.alaska.gov/sf/SARR/AWC). If
// a code isn't in this table we skip rather than guess.
const SPECIES_KEY = {
  K:  { name: 'Chinook Salmon',    type: 'anadromous', primary: true  },
  S:  { name: 'Sockeye Salmon',    type: 'anadromous', primary: true  },
  CO: { name: 'Coho Salmon',       type: 'anadromous', primary: true  },
  P:  { name: 'Pink Salmon',       type: 'anadromous', primary: true  },
  CH: { name: 'Chum Salmon',       type: 'anadromous', primary: true  },
  SB: { name: 'Steelhead',         type: 'anadromous', primary: true  },
  DV: { name: 'Dolly Varden',      type: 'anadromous', primary: true  },
  R:  { name: 'Rainbow Trout',     type: 'resident',   primary: false },
  SF: { name: 'Sheefish',          type: 'anadromous', primary: false },
  W:  { name: 'Whitefish',         type: 'resident',   primary: false },
  AG: { name: 'Arctic Grayling',   type: 'resident',   primary: false },
}

function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: 30000, headers: { 'User-Agent': 'RiverScout-AWC/1.0' } }, res => {
      let d = ''
      res.on('data', c => d += c)
      res.on('end', () => resolve({ status: res.statusCode, body: d }))
    })
    req.on('error', reject)
    req.on('timeout', () => req.destroy(new Error('timeout')))
  })
}

async function queryAwc(name) {
  // Escape single quotes for ArcGIS SQL-like where clause.
  const safe = name.replace(/'/g, "''")
  const where = encodeURIComponent(`NAME = '${safe}'`)
  const url = `${AWC}?where=${where}&outFields=AWC_CODE,NAME,SPECIES,REGION,Length_Ft&returnGeometry=false&f=json&resultRecordCount=100`
  const { status, body } = await get(url)
  if (status !== 200) return []
  try { return (JSON.parse(body).features || []).map(f => f.attributes) }
  catch { return [] }
}

function parseSpeciesField(s) {
  // e.g. "CHp,COp,Kp,Pp,Sp,DVp,SFp,Wpr" — split by comma, strip
  // trailing life-stage letters (p/s/r/m/d), map against SPECIES_KEY.
  const out = []
  const seen = new Set()
  for (const raw of (s || '').split(',')) {
    const t = raw.trim()
    if (!t) continue
    // Match longest prefix (so "CH" wins over "C", "CO" wins over "C").
    let code = null
    for (const k of ['CH', 'CO', 'SB', 'DV', 'SF', 'AG', 'K', 'S', 'P', 'R', 'W']) {
      if (t.startsWith(k)) { code = k; break }
    }
    if (!code || !SPECIES_KEY[code]) continue
    if (seen.has(code)) continue
    seen.add(code)
    const lifeStages = t.slice(code.length).toLowerCase()
    const notes = []
    if (lifeStages.includes('s')) notes.push('spawning')
    if (lifeStages.includes('r')) notes.push('rearing')
    if (lifeStages.includes('m')) notes.push('migration')
    if (lifeStages.includes('p') && !notes.length) notes.push('present')
    out.push({ ...SPECIES_KEY[code], ...(notes.length ? { notes: notes.join(', ') } : {}) })
  }
  return out
}

async function main() {
  const adds = JSON.parse(fs.readFileSync(ADDITIONS, 'utf8')).additions.ak || []
  const result = {}
  let matched = 0
  let noMatch = []

  for (const e of adds) {
    process.stderr.write(`  ${e.id}  ${e.name}...`)
    const recs = await queryAwc(e.name)
    if (!recs.length) { process.stderr.write(' no match\n'); noMatch.push(e.id); continue }

    // Reject ambiguous matches: AWC has many duplicate stream names
    // across different watersheds (e.g. 17 distinct "Beaver Creek"s
    // around Alaska). Keep only matches whose AWC_CODE all share the
    // first numeric prefix — that means one HUC-equivalent drainage.
    // If the prefixes differ, the name is ambiguous and we drop it
    // rather than risk merging unrelated species lists.
    const prefixes = new Set(recs.map(r => (r.AWC_CODE || '').split('-')[0]))
    if (prefixes.size > 1) {
      process.stderr.write(` AMBIGUOUS (${prefixes.size} distinct watersheds: ${[...prefixes].join(', ')})\n`)
      noMatch.push(`${e.id} (ambiguous: ${[...prefixes].join('/')})`)
      continue
    }

    // Merge species across all AWC segments for this river (multiple
    // reach rows of the SAME stream can have different species
    // documented at different points).
    const speciesMap = new Map()
    const awcCodes = []
    for (const r of recs) {
      awcCodes.push(r.AWC_CODE)
      for (const sp of parseSpeciesField(r.SPECIES)) {
        if (!speciesMap.has(sp.name)) {
          speciesMap.set(sp.name, sp)
        } else {
          // Merge notes (union).
          const ex = speciesMap.get(sp.name)
          const mergedNotes = new Set([
            ...(ex.notes ? ex.notes.split(', ') : []),
            ...(sp.notes ? sp.notes.split(', ') : []),
          ])
          ex.notes = Array.from(mergedNotes).filter(Boolean).join(', ')
          if (!ex.notes) delete ex.notes
        }
      }
    }
    const species = Array.from(speciesMap.values())
    process.stderr.write(` ${recs.length} reaches, ${species.length} species\n`)

    result[e.id] = {
      species,
      designations: ['ADFG Anadromous Waters Catalog — specified under AS 16.05.871'],
      spawning: [],
      hatches: [],
      runs: [],
      guides: [],
      _source: { awc_codes: awcCodes, region: recs[0].REGION, reaches: recs.length },
    }
    matched++
    await new Promise(r => setTimeout(r, 300))
  }

  fs.writeFileSync(OUT, JSON.stringify(result, null, 2))
  console.log(`\nMatched ${matched}/${adds.length} AK rivers`)
  if (noMatch.length) {
    console.log(`Not matched in AWC: ${noMatch.join(', ')}`)
  }
  console.log(`Output: ${OUT}`)
}

main().catch(e => { console.error(e); process.exit(1) })
