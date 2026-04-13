#!/usr/bin/env node
// Apply manually-researched gauge fixes for rivers the auto-picker
// couldn't resolve. Each pair scopes its replace to (river id + current
// gauge) so the wrong row is never touched.

const fs = require('fs')
const path = require('path')

const fixes = [
  ['ocqueoc',         '04133501', '04132160'],
  ['pinecreek',       '01553500', '01549500'],
  ['mossy_creek_va',  '01622000', '01620850'],
  ['wilson_creek_nc', '02141500', '02140510'],
  ['dead_river',      '01047000', '01045000'],
  ['wolf_ms',         '02481000', '02481500'],
  ['fall_river_ks',   '07167500', '07168500'],
  ['rock_il',         '05444000', '05441500'],
  ['hunt',            '01117100', '01116910'],
  ['naknek_ak',       '15301500', '15297890'],
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
