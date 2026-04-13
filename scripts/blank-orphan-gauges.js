#!/usr/bin/env node
// Final pass: rivers where no plausibly-correct USGS gauge exists.
// Setting g='' is more honest than displaying flow from a different
// watershed. UI shows "no live data" rather than misleading numbers.
//
// Each of these has been verified to have either NO USGS gauge or
// only a proxy that's clearly wrong (different watershed entirely).
// Listed here for visibility — flip back if a real gauge surfaces.

const fs = require('fs')
const path = require('path')

// rivers whose currently-stored gauge belongs to a different watershed
// and where we couldn't find a true gauge for this river.
const blanks = [
  'anahulu_hi',         // No USGS gauge for Anahulu (Oahu small stream)
  'bantam',             // No USGS gauge for Bantam River CT
  'betsie',             // Lake MI tributary, no own gauge
  'bowie',              // Bowie Creek MS, no gauge
  'boyne_mi',           // Boyne River MI, no gauge
  'broadkill',          // Small DE coastal river
  'brooks_ak',          // Short Brooks River AK has no gauge
  'flint_hills',        // Our river is "South Fork Cottonwood" — needs a real Cottonwood gauge
  'goodnews_ak',        // Remote AK river, no gauge
  'hatchery_creek_ky',  // Tiny spring creek, no gauge
  'lacombe',            // Bayou Lacombe LA, no own gauge
  'rapid_me',           // No USGS gauge on the Rapid River (Maine)
  'san_antonio',        // Tributary creek, no own gauge
  'wharton',            // Pine Barrens area, no single gauge
]

// rivers where we'll keep an intentional proxy but a comment would help.
// Listed for future verification — not auto-modified.
const intentionalProxies = [
  'alagnak_ak',  // Uses KVICHAK R AT IGIUGIG — Alagnak drains into the Kvichak system, reasonable proxy
  'little_sc',   // Uses Saluda River near Greenville — Little River SC tributary; nearest available
]

const file = path.resolve(__dirname, '..', 'data', 'rivers.ts')
let src = fs.readFileSync(file, 'utf8')

let blanked = 0
for (const id of blanks) {
  const re = new RegExp(`(id:\\s*'${id}'[\\s\\S]{0,800}?g:\\s*')[0-9]+(')`)
  const next = src.replace(re, "$1$2")
  if (next === src) console.error(`  MISS: ${id}`)
  else { src = next; blanked++; console.log(`  blanked: ${id}`) }
}

fs.writeFileSync(file, src)
console.log(`\nBlanked ${blanked} orphan gauges.`)
console.log(`Kept as intentional proxies: ${intentionalProxies.join(', ')}`)
