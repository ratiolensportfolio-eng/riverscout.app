#!/usr/bin/env node
// Merge c:/tmp/awc-fisheries.json into data/fisheries.ts.
//
// Inserts new river_id keys before the closing `}` of the FISHERIES
// object. Skips keys already present so this is idempotent.

const fs = require('fs')
const path = require('path')

const REPO = path.resolve(__dirname, '..')
const FISHERIES_TS = path.join(REPO, 'data', 'fisheries.ts')
const SRC = 'c:/tmp/awc-fisheries.json'

function esc(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

function formatEntry(id, f) {
  const lines = []
  lines.push(`  ${id}: {`)
  // species
  lines.push(`    species: [`)
  for (const sp of f.species) {
    const parts = [`name: '${esc(sp.name)}'`, `type: '${sp.type}'`, `primary: ${sp.primary}`]
    if (sp.notes) parts.push(`notes: '${esc(sp.notes)}'`)
    lines.push(`      { ${parts.join(', ')} },`)
  }
  lines.push(`    ],`)
  // designations
  lines.push(`    designations: [${f.designations.map(d => `'${esc(d)}'`).join(', ')}],`)
  // empty arrays we don't have AWC data for
  lines.push(`    spawning: [],`)
  lines.push(`    hatches: [],`)
  lines.push(`    runs: [],`)
  lines.push(`    guides: [],`)
  lines.push(`  },`)
  return lines.join('\r\n')
}

function main() {
  const incoming = JSON.parse(fs.readFileSync(SRC, 'utf8'))
  let src = fs.readFileSync(FISHERIES_TS, 'utf8')

  // Find existing keys so we skip them.
  const existing = new Set()
  for (const m of src.matchAll(/^\s+([a-z0-9_]+):\s*\{/gm)) existing.add(m[1])

  const toAdd = []
  for (const [id, f] of Object.entries(incoming)) {
    if (existing.has(id)) continue
    toAdd.push(formatEntry(id, f))
  }
  if (!toAdd.length) {
    console.log('No new entries to add (all already present)')
    return
  }

  // Insert before the closing `}` of the const declaration. The file
  // ends with `}\n` (or CRLF). Match the very last `}` on its own line.
  const closeRe = /\r?\n\}\r?\n?\s*$/
  const m = src.match(closeRe)
  if (!m) { console.error('!! close brace not found'); process.exit(1) }

  const block = '\r\n  // ── ADFG AWC-sourced fisheries (auto-imported 2026-04-14) ──\r\n' +
                toAdd.join('\r\n\r\n') + '\r\n'
  src = src.slice(0, m.index) + block + src.slice(m.index)
  fs.writeFileSync(FISHERIES_TS, src)
  console.log(`Added ${toAdd.length} new fisheries entries`)
}

main()
