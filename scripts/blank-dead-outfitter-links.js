#!/usr/bin/env node
// Blank the `l` field for all 121 dead outfitter links confirmed by
// scripts/recheck-dead-links.js (GET re-verification). Leaves the
// outfitter entry in the outs array so the business name + description
// are still visible — just removes the broken link.

const fs = require('fs')
const path = require('path')

const RIVERS_TS = path.resolve(__dirname, '..', 'data', 'rivers.ts')
const RECHECK = 'c:/tmp/dead-links-recheck.json'

const data = JSON.parse(fs.readFileSync(RECHECK, 'utf8'))
let src = fs.readFileSync(RIVERS_TS, 'utf8')

let blanked = 0
let notFound = 0

for (const entry of data.dead) {
  const url = entry.url
  if (!url) continue
  // Escape special regex chars in the URL
  const escaped = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp("l: '" + escaped + "'", 'g')
  const before = src
  src = src.replace(re, "l: ''")
  if (src !== before) blanked++
  else notFound++
}

fs.writeFileSync(RIVERS_TS, src)
console.log(`Blanked ${blanked} dead outfitter links`)
console.log(`Not found in rivers.ts: ${notFound}`)
