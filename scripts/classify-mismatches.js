#!/usr/bin/env node
// Post-process /tmp/gauge-report.json — separate spelling-variant false
// positives from likely-genuine mismatches.

const fs = require('fs')
const report = require('/tmp/gauge-report.json')

function normalize(s) {
  return s.toLowerCase()
    .replace(/[.,']/g, '')
    .replace(/\bcreek\b|\briver\b|\bfork\b|\bnear\b|\bat\b|\bnr\b|\br\b|\bc\b|\bn\b/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(w => w.length >= 3)
}

const falsePositives = []
const genuine = []

for (const row of report.mismatched) {
  const ourWords = new Set(normalize(row.name))
  const stationWords = new Set(normalize(row.station))
  let overlap = 0
  for (const w of ourWords) if (stationWords.has(w)) overlap++
  // Common kill/beaverkill-style spelling variants: check if one string contains the other's main word
  const ourRaw = row.name.toLowerCase().replace(/\s/g, '')
  const stationRaw = row.station.toLowerCase().replace(/\s/g, '')
  let substrHit = false
  for (const w of ourWords) {
    const compact = w.replace(/\s/g, '')
    if (compact.length >= 4 && stationRaw.includes(compact)) { substrHit = true; break }
  }
  if (overlap > 0 || substrHit) {
    falsePositives.push(row)
  } else {
    genuine.push(row)
  }
}

console.log(`False positives (spelling variants, same river): ${falsePositives.length}`)
console.log(`Likely GENUINE mismatches: ${genuine.length}\n`)

genuine.sort((a, b) => a.id.localeCompare(b.id))

console.log('=== LIKELY GENUINE MISMATCHES ===')
console.log('id\tcurrent_gauge\tour_name\tusgs_station')
for (const r of genuine) {
  console.log(`${r.id}\t${r.gauge}\t${r.name}\t${r.station}`)
}

fs.writeFileSync('/tmp/gauge-genuine-mismatches.json', JSON.stringify(genuine, null, 2))
fs.writeFileSync('/tmp/gauge-false-positives.json', JSON.stringify(falsePositives, null, 2))
