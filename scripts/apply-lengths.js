const fs = require('fs')
const path = require('path')
const RIVERS_TS = path.resolve(__dirname, '..', 'data', 'rivers.ts')
let src = fs.readFileSync(RIVERS_TS, 'utf8')

const lengths = {
  escalante_co: '6.5 mi',
  bow_ab: '365 mi',
  kananaskis_ab: '50 mi',
  athabasca_ab: '168 mi',
  kicking_horse_bc: '42 mi',
  north_saskatchewan_ab: '800 mi',
  red_deer_ab: '450 mi',
  elbow_ab: '75 mi',
  sunwapta_ab: '32 mi',
}

let applied = 0
for (const [id, len] of Object.entries(lengths)) {
  const re = new RegExp("(id:\\s*'" + id + "'[^}]*?len:\\s*)''")
  const before = src
  src = src.replace(re, "$1'" + len + "'")
  if (src !== before) {
    applied++
    console.log('Applied:', id, '→', len)
  } else {
    console.log('NOT FOUND:', id)
  }
}
fs.writeFileSync(RIVERS_TS, src)
console.log('\nApplied', applied, 'lengths')
