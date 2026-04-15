#!/usr/bin/env node
// Apply the 17 verified gauge swaps from
// reports/A-replacement-gauges-2026-04-15.md. Each swap replaces a
// river's currently-dead g: '<old_id>' with the proposed live
// alternate. The 5 questionable proposals from the report (Little
// Calumet, NF Cache la Poudre, Shenango at Pymatuning Dam, main
// Boise for SF Boise, Manistee main for Manistee Lake Branch) are
// skipped because they're a different physical river.

const fs = require('fs')
const path = require('path')

const RIVERS_TS = path.resolve(__dirname, '..', 'data', 'rivers.ts')

const SWAPS = [
  ['caney_fork',                 '03424500',          '03424860'],
  ['raccoon_ia',                 '05484600',          '05484650'],
  ['loyalhanna_pa',              '03045010',          '03045000'],
  ['okatoma',                    '02472800',          '02472850'],
  ['pacolet_sc',                 '02156350',          '02156370'],
  ['shavers_fork',               '03068600',          '03068800'],
  ['french_pa',                  '',                  '03023100'],   // current g unknown — match by id only
  ['ocoee',                      '03564500',          '03559500'],
  ['rockcastle',                 '',                  '03406500'],
  ['sugar_oh',                   '',                  '03124500'],
  ['pigeon_mi',                  '04129500',          '04128990'],
  ['raystown_branch_juniata_pa', '01559790',          '01562000'],
  ['black_creek_ms',             '',                  '02479130'],
  ['shepaug',                    '',                  '01202501'],
  ['detroit_mi',                 '421337083074201',   '04165710'],
  ['tygarts_ky',                 '',                  '03217000'],
  ['tygart_wv',                  '03055000',          '03056000'],
]

let src = fs.readFileSync(RIVERS_TS, 'utf8')
let applied = 0, skipped = 0

for (const [id, oldId, newId] of SWAPS) {
  // Find the river entry. NRP-style entries are on one line; older
  // hand-curated entries span multiple lines. Match the `g: '...'`
  // that comes within ~4kb after `id: '<id>'`.
  const re = new RegExp(`(\\{\\s*id: '${id}'[\\s\\S]{0,4000}?)g: '([^']*)'`, 'm')
  const m = src.match(re)
  if (!m) { console.log(`  SKIP ${id}: not found`); skipped++; continue }
  const currentG = m[2]
  if (oldId && currentG !== oldId) {
    console.log(`  SKIP ${id}: current g='${currentG}' doesn't match expected '${oldId}'`)
    skipped++
    continue
  }
  if (currentG === newId) { console.log(`  SKIP ${id}: already at '${newId}'`); skipped++; continue }
  src = src.replace(re, `$1g: '${newId}'`)
  console.log(`  APPLY ${id}: '${currentG}' → '${newId}'`)
  applied++
}

fs.writeFileSync(RIVERS_TS, src)
console.log(`\nApplied ${applied}, skipped ${skipped}`)
