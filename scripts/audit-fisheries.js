const fs = require('fs')
const path = require('path')

const content = fs.readFileSync(path.join(__dirname, '..', 'data', 'fisheries.ts'), 'utf-8')
const riversContent = fs.readFileSync(path.join(__dirname, '..', 'data', 'rivers.ts'), 'utf-8')

// Build river ID -> state mapping
const idToState = {}
const stateRe = /id: '([^']+)'[^}]*?abbr: '([A-Z]{2})'/g
let s
while ((s = stateRe.exec(riversContent)) !== null) {
  idToState[s[1]] = s[2]
}

// Geographic species rules
const PACIFIC_SALMON_NAMES = ['chinook', 'coho', 'sockeye', 'pink salmon', 'chum', 'pacific salmon']
const PACIFIC_WILD = new Set(['CA', 'OR', 'WA', 'ID', 'AK'])
const GREAT_LAKES_STOCKED = new Set(['MI', 'WI', 'MN', 'IL', 'IN', 'OH', 'PA', 'NY'])
const ATLANTIC_SALMON_OK = new Set(['ME', 'NH', 'VT', 'MA', 'CT', 'NY', 'MI', 'WI', 'MN'])
const STEELHEAD_OK = new Set(['CA', 'OR', 'WA', 'ID', 'AK', 'MI', 'WI', 'MN', 'IL', 'IN', 'OH', 'PA', 'NY'])
const HEX_OK = new Set(['MI', 'WI', 'MN', 'NY', 'PA', 'IA', 'IL', 'IN', 'OH', 'VT', 'NH', 'ME', 'MA', 'CT'])
const SALMONFLY_OK = new Set(['MT', 'ID', 'WY', 'CO', 'OR', 'WA', 'CA', 'UT', 'NM', 'AZ', 'NV', 'AK'])

const flags = { red: [], yellow: [] }
const designations = []
const stats = { entries: 0, totalSpecies: 0, totalHatches: 0, totalRuns: 0, byState: {} }
const allSpeciesByRiver = []

// Line-based parsing — split into entries
const lines = content.split('\n')
let currentId = null
let bodyLines = []

function processEntry(id, body) {
  const state = idToState[id]
  if (id === 'ausable') {
    console.log('DEBUG ausable: state =', state, 'body length =', body.length)
  }
  if (!state) return

  // Extract sections by finding their boundaries
  function extractBlock(name) {
    const startRe = new RegExp(`(^|\\s)${name}:\\s*\\[`)
    let inBlock = false
    let depth = 0
    const collected = []
    for (const line of body.split('\n')) {
      if (!inBlock && startRe.test(line)) {
        inBlock = true
        for (const ch of line) {
          if (ch === '[') depth++
          if (ch === ']') depth--
        }
        collected.push(line)
        if (depth === 0) break
        continue
      }
      if (inBlock) {
        collected.push(line)
        for (const ch of line) {
          if (ch === '[') depth++
          if (ch === ']') depth--
        }
        if (depth === 0) break
      }
    }
    return collected.join('\n')
  }

  const speciesText = extractBlock('species')
  const hatchesText = extractBlock('hatches')
  const runsText = extractBlock('runs')
  const designationsText = extractBlock('designations')

  const fishSpecies = [...speciesText.matchAll(/name:\s*['"]([^'"]+)['"]/g)].map(s => s[1])
  const hatches = [...hatchesText.matchAll(/name:\s*['"]([^'"]+)['"]/g)].map(h => h[1])
  const runs = [...runsText.matchAll(/species:\s*['"]([^'"]+)['"]/g)].map(r => r[1])
  const desigItems = [...designationsText.matchAll(/['"]([^'"]+)['"]/g)].map(x => x[1])

  stats.entries++
  stats.totalSpecies += fishSpecies.length
  stats.totalHatches += hatches.length
  stats.totalRuns += runs.length
  stats.byState[state] = (stats.byState[state] || 0) + 1
  allSpeciesByRiver.push({ id, state, species: fishSpecies, hatches, runs })

  // === Species checks ===
  for (const sp of fishSpecies) {
    const lower = sp.toLowerCase()

    if (PACIFIC_SALMON_NAMES.some(p => lower.includes(p))) {
      if (!PACIFIC_WILD.has(state) && !GREAT_LAKES_STOCKED.has(state)) {
        flags.red.push({ id, state, type: 'species', detail: `${sp} listed but ${state} has no Pacific salmon` })
      }
    }

    if (lower.includes('atlantic salmon')) {
      if (!ATLANTIC_SALMON_OK.has(state)) {
        flags.red.push({ id, state, type: 'species', detail: `Atlantic Salmon in ${state} — outside native range` })
      }
    }

    if (lower.includes('bull trout')) {
      const ok = new Set(['MT', 'ID', 'WA', 'OR', 'NV'])
      if (!ok.has(state)) {
        flags.red.push({ id, state, type: 'species', detail: `Bull Trout in ${state} — only MT/ID/WA/OR/NV` })
      }
    }

    if (lower.includes('apache trout') && state !== 'AZ') {
      flags.red.push({ id, state, type: 'species', detail: `Apache Trout in ${state} — only AZ` })
    }

    if (lower.includes('lahontan') && !['NV', 'CA', 'OR'].includes(state)) {
      flags.red.push({ id, state, type: 'species', detail: `Lahontan Cutthroat in ${state} — Great Basin endemic` })
    }

    if (lower.includes('yellowstone cutthroat') && !['MT', 'WY', 'ID'].includes(state)) {
      flags.red.push({ id, state, type: 'species', detail: `Yellowstone Cutthroat in ${state} — only MT/WY/ID` })
    }

    if (lower.includes('westslope cutthroat') && !['MT', 'ID', 'WA', 'OR'].includes(state)) {
      flags.red.push({ id, state, type: 'species', detail: `Westslope Cutthroat in ${state} — only MT/ID/WA/OR` })
    }

    if (lower.includes('rio grande cutthroat') && !['NM', 'CO'].includes(state)) {
      flags.red.push({ id, state, type: 'species', detail: `Rio Grande Cutthroat in ${state} — only NM/CO` })
    }

    if (lower.includes('redband') && !['CA', 'OR', 'NV', 'ID', 'WA'].includes(state)) {
      flags.red.push({ id, state, type: 'species', detail: `Redband Trout in ${state} — only CA/OR/ID/NV/WA` })
    }

    if (lower.includes('arctic grayling') && !['MT', 'AK', 'WY'].includes(state)) {
      flags.yellow.push({ id, state, type: 'species', detail: `Arctic Grayling in ${state} — verify (only MT/AK native)` })
    }

    if (lower.includes('gila trout') && !['NM', 'AZ'].includes(state)) {
      flags.red.push({ id, state, type: 'species', detail: `Gila Trout in ${state} — only NM/AZ` })
    }
  }

  // === Hatch checks ===
  for (const hatch of hatches) {
    const lower = hatch.toLowerCase()

    if (lower.includes('hex') && !HEX_OK.has(state)) {
      flags.red.push({ id, state, type: 'hatch', detail: `Hex hatch in ${state} — outside Hexagenia limbata range` })
    }

    if (lower.includes('salmonfly') && !SALMONFLY_OK.has(state)) {
      flags.red.push({ id, state, type: 'hatch', detail: `Salmonfly in ${state} — outside Western Pteronarcys range` })
    }

    if (lower.includes('skwala') && !SALMONFLY_OK.has(state)) {
      flags.red.push({ id, state, type: 'hatch', detail: `Skwala stonefly in ${state} — Western only` })
    }

    if (lower.includes('callibaetis') && !['MT', 'ID', 'WY', 'CO', 'OR', 'WA', 'CA', 'UT', 'NV', 'AZ'].includes(state)) {
      flags.yellow.push({ id, state, type: 'hatch', detail: `Callibaetis in ${state} — typically lakes/Western` })
    }
  }

  // === Run timing checks ===
  for (const run of runs) {
    const lower = run.toLowerCase()
    if (PACIFIC_SALMON_NAMES.some(p => lower.includes(p))) {
      if (!PACIFIC_WILD.has(state) && !GREAT_LAKES_STOCKED.has(state)) {
        flags.red.push({ id, state, type: 'run', detail: `${run} run in ${state} — no such run exists` })
      }
    }
    if (lower.includes('steelhead')) {
      if (!STEELHEAD_OK.has(state)) {
        flags.red.push({ id, state, type: 'run', detail: `Steelhead run in ${state} — no steelhead program` })
      }
    }
    if (lower.includes('atlantic salmon')) {
      if (!ATLANTIC_SALMON_OK.has(state)) {
        flags.red.push({ id, state, type: 'run', detail: `Atlantic Salmon run in ${state} — outside range` })
      }
    }
  }

  // === Designation collection ===
  for (const item of desigItems) {
    const l = item.toLowerCase()
    if (l.includes('gold medal') || l.includes('blue ribbon') || l.includes('blue-ribbon')) {
      designations.push({ id, state, desig: item })
    }
  }
}

// Parse line by line
let parsedCount = 0
for (const line of lines) {
  const m = line.match(/^  ([a-z][a-z0-9_]*): \{$/)
  if (m) {
    if (currentId) {
      processEntry(currentId, bodyLines.join('\n'))
      parsedCount++
    }
    currentId = m[1]
    bodyLines = []
  } else if (currentId && /^  \},?$/.test(line)) {
    processEntry(currentId, bodyLines.join('\n'))
    parsedCount++
    currentId = null
    bodyLines = []
  } else if (currentId) {
    bodyLines.push(line)
  }
}
console.log('Entries processed:', parsedCount)
console.log('Stats:', stats.entries, 'entries with state |', stats.totalSpecies, 'species |', stats.totalHatches, 'hatches |', stats.totalRuns, 'runs')
// Show all runs (small dataset)
console.log('--- All runs ---')
allSpeciesByRiver.forEach(r => {
  if (r.runs.length) console.log(`  [${r.state}] ${r.id}: ${r.runs.join(', ')}`)
})
// Count missing fisheries entries
const allRiverIds = Object.keys(idToState)
const missing = allRiverIds.filter(rid => !allSpeciesByRiver.find(s => s.id === rid))
console.log(`--- ${missing.length} rivers missing from fisheries.ts ---`)
console.log(missing.slice(0, 30).join(', '))

console.log('========================================')
console.log('RED FLAGS:', flags.red.length)
console.log('========================================')
flags.red.forEach(f => console.log(`[${f.state}] ${f.id} | ${f.type}: ${f.detail}`))
console.log()
console.log('========================================')
console.log('YELLOW FLAGS:', flags.yellow.length)
console.log('========================================')
flags.yellow.forEach(f => console.log(`[${f.state}] ${f.id} | ${f.type}: ${f.detail}`))
console.log()
console.log('========================================')
console.log('GOLD MEDAL / BLUE RIBBON DESIGNATIONS:', designations.length)
console.log('========================================')
designations.forEach(d => console.log(`[${d.state}] ${d.id}: ${d.desig}`))
