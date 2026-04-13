#!/usr/bin/env node
// Round 2 of manual gauge fixes — researched via web for rivers the
// auto-picker couldn't resolve in their state's gauge list.

const fs = require('fs')
const path = require('path')

const fixes = [
  ['twohearted',       '04063700', '04044800'],  // Two Hearted at Co Rd 407 nr Deer Park, MI
  ['newriver',         '03189100', '03185400'],  // New River at Thurmond, WV (gorge gauge)
  ['pinecreek',        '01549500', '01549700'],  // Pine Creek bl L Pine Creek nr Waterville, PA
  ['seneca_creek_wv',  '03183500', '01605890'],  // Seneca Creek above Seneca Falls, WV
  ['south_toe_nc',     '02153500', '03463300'],  // South Toe River near Celo, NC
  ['little_river_al',  '03572110', '02399200'],  // Little River near Blue Pond, AL (canyon)
  ['red_river',        '03282000', '03283500'],  // Red River at Clay City, KY (gorge)
]

const file = path.resolve(__dirname, '..', 'data', 'rivers.ts')
let src = fs.readFileSync(file, 'utf8')

for (const [id, oldG, newG] of fixes) {
  const re = new RegExp(`(id:\\s*'${id}'[\\s\\S]{0,800}?g:\\s*')${oldG}(')`)
  const next = src.replace(re, `$1${newG}$2`)
  if (next === src) console.error(`  MISS: ${id} (${oldG} -> ${newG})`)
  else { src = next; console.log(`  OK: ${id} ${oldG} -> ${newG}`) }
}

fs.writeFileSync(file, src)
