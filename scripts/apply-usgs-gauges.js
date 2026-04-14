#!/usr/bin/env node
// Apply gauge discovery results to data/rivers.ts:
//   - For every `attach` row, set g: '<site_no>'
//   - For every `no_match` row, add noGaugeAvailable: true
//   - Leave `review` and `low_confidence` rows untouched (curator decides)
//
// Reads c:/tmp/gauge-discovery-preview.json.

const fs = require('fs')
const path = require('path')

const REPO = path.resolve(__dirname, '..')
const RIVERS_TS = path.join(REPO, 'data', 'rivers.ts')
const PREVIEW = 'c:/tmp/gauge-discovery-preview.json'

function main() {
  const preview = JSON.parse(fs.readFileSync(PREVIEW, 'utf8'))
  let src = fs.readFileSync(RIVERS_TS, 'utf8')

  let attachCount = 0
  let noMatchCount = 0
  let skippedCount = 0

  for (const r of preview.results) {
    if (r.action === 'attach') {
      // Find this river's entry block. Each entry starts with
      // `{ id: '<id>'` and contains `g: ''` somewhere within. Match
      // the g: '' that comes AFTER the id and BEFORE the next entry's
      // closing brace.
      const re = new RegExp(`(\\{ id: '${r.id}'[\\s\\S]{0,4000}?)g: ''`, 'm')
      const updated = src.replace(re, `$1g: '${r.best.site_no}'`)
      if (updated === src) { skippedCount++; continue }
      src = updated
      attachCount++
    } else if (r.action === 'no_match') {
      // Add noGaugeAvailable: true right after the g: '' field. Only
      // add if not already present.
      const re = new RegExp(`(\\{ id: '${r.id}'[\\s\\S]{0,4000}?g: '',)([^\\n]*?)(?!noGaugeAvailable)`, 'm')
      // Simpler: find the entry, check if already has the flag, else
      // append it after g: ''.
      const startIdx = src.indexOf(`{ id: '${r.id}'`)
      if (startIdx < 0) { skippedCount++; continue }
      const entryEnd = src.indexOf(' }', startIdx)
      if (entryEnd < 0) { skippedCount++; continue }
      const entry = src.slice(startIdx, entryEnd)
      if (entry.includes('noGaugeAvailable')) { skippedCount++; continue }
      const updated = src.slice(0, startIdx) +
        entry.replace(`g: '',`, `g: '', noGaugeAvailable: true,`) +
        src.slice(entryEnd)
      if (updated === src) { skippedCount++; continue }
      src = updated
      noMatchCount++
    }
  }

  fs.writeFileSync(RIVERS_TS, src)
  console.log(`Applied ${attachCount} gauge attachments`)
  console.log(`Flagged ${noMatchCount} rivers as noGaugeAvailable: true`)
  console.log(`Skipped ${skippedCount} (entry not found or already updated)`)
}

main()
