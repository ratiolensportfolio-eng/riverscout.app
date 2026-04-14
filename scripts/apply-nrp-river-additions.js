#!/usr/bin/env node
// Apply NRP river additions to data/rivers.ts.
//
// Reads c:/tmp/nrp-river-additions.json (produced by
// generate-nrp-river-additions.js) and inserts new entries into each
// state block's `rivers: [ ... ]` array, immediately before the
// array's closing `    ],` line.
//
// Also registers any already-existing polyline map files (under
// data/river-maps/<id>.ts) in data/river-maps/index.ts.

const fs = require('fs')
const path = require('path')

const REPO = path.resolve(__dirname, '..')
const RIVERS_TS = path.join(REPO, 'data', 'rivers.ts')
const MAPS_INDEX = path.join(REPO, 'data', 'river-maps', 'index.ts')
const ADDITIONS = 'c:/tmp/nrp-river-additions.json'

function main() {
  const data = JSON.parse(fs.readFileSync(ADDITIONS, 'utf8'))
  let src = fs.readFileSync(RIVERS_TS, 'utf8')

  // Walk state-by-state. For each state key present in additions,
  // locate the state block in src, find its `    ],` rivers-array
  // close, and splice the formatted entries before it.
  let totalInserted = 0
  for (const [stateKey, entries] of Object.entries(data.additions)) {
    if (!entries.length) continue

    // Match "  <key>: {" as the block opener.
    const openerRe = new RegExp(`^  ${stateKey}: \\{$`, 'm')
    const openerM = openerRe.exec(src)
    if (!openerM) {
      console.error(`!! state ${stateKey} not found in rivers.ts — skipping`)
      continue
    }
    const blockStart = openerM.index
    // The block closes at the next "  }," line at column 0 (2 spaces).
    const nextCloseRe = /^  \},$/m
    nextCloseRe.lastIndex = blockStart
    const nextCloseM = src.slice(blockStart).match(nextCloseRe)
    if (!nextCloseM) {
      console.error(`!! close for state ${stateKey} not found`)
      continue
    }
    const closeAbsIdx = blockStart + nextCloseM.index

    // Within blockStart .. closeAbsIdx, find the last "    ],<EOL>" —
    // that closes the rivers array. File is CRLF, so accept \r?\n.
    const blockSlice = src.slice(blockStart, closeAbsIdx)
    const riversCloseRe = /\r?\n    \],\r?\n/g
    let lastMatch = null
    let m
    while ((m = riversCloseRe.exec(blockSlice)) !== null) lastMatch = m
    if (!lastMatch) {
      console.error(`!! rivers-array close for state ${stateKey} not found`)
      continue
    }
    // Insert just AFTER the leading \r?\n so the new entries become
    // their own lines preceding the "    ],".
    const eolLen = lastMatch[0].startsWith('\r\n') ? 2 : 1
    const insertAt = blockStart + lastMatch.index + eolLen

    // Build insertion text. Use CRLF to match the file's existing endings.
    const block = entries.map(e => `      ${e.tsEntry},`).join('\r\n') + '\r\n'
    src = src.slice(0, insertAt) + block + src.slice(insertAt)
    totalInserted += entries.length
  }

  fs.writeFileSync(RIVERS_TS, src)
  console.log(`rivers.ts: inserted ${totalInserted} entries`)

  // ── Register existing polyline files in data/river-maps/index.ts
  const registeredBefore = new Set()
  const indexSrc = fs.readFileSync(MAPS_INDEX, 'utf8')
  for (const m of indexSrc.matchAll(/^\s+([a-z0-9_]+):\s*\(\)\s*=>\s*import\(/gm)) {
    registeredBefore.add(m[1])
  }

  const mapsDir = path.dirname(MAPS_INDEX)
  const polyFiles = new Set(
    fs.readdirSync(mapsDir)
      .filter(f => f.endsWith('.ts') && f !== 'index.ts')
      .map(f => f.replace('.ts', ''))
  )

  const newRegistrations = []
  for (const entries of Object.values(data.additions)) {
    for (const e of entries) {
      if (polyFiles.has(e.id) && !registeredBefore.has(e.id)) {
        newRegistrations.push(e.id)
      }
    }
  }

  if (newRegistrations.length) {
    const closePattern = /\}\s*(\r?\n)+\s*export function hasRiverMap/
    const closeM = indexSrc.match(closePattern)
    if (!closeM) {
      console.error(`!! cannot find registry close in index.ts — skipping polyline registration`)
    } else {
      const newLines = newRegistrations.map(id =>
        `  ${id}: () => import('./${id}').then(m => ({\n    accessPoints: m.accessPoints,\n    sections: m.sections,\n    riverPath: m.riverPath,\n  })),\n`
      ).join('')
      const updated = indexSrc.slice(0, closeM.index) + newLines + indexSrc.slice(closeM.index)
      fs.writeFileSync(MAPS_INDEX, updated)
      console.log(`river-maps/index.ts: registered ${newRegistrations.length} existing polyline files`)
    }
  } else {
    console.log(`river-maps/index.ts: no new polyline files to register`)
  }

  console.log('\nDone. Next: tsc --noEmit and visual spot-check.')
}

main()
