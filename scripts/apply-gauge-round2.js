#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const confident = JSON.parse(fs.readFileSync('c:/tmp/gauge-confident.json', 'utf8'))
const RIVERS_TS = path.resolve(__dirname, '..', 'data', 'rivers.ts')
let src = fs.readFileSync(RIVERS_TS, 'utf8')

let applied = 0
for (const p of confident) {
  // Match: id: 'river_id' ... g: ''
  // The g field is always like: g: ''  or  g: '04125460'
  // We want to find this river's entry and replace g: '' with g: 'gaugeId'
  const escaped = p.riverId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp("(id:\\s*'" + escaped + "'[^}]*?g:\\s*)'()'")
  const before = src
  src = src.replace(re, "$1'" + p.gaugeId + "'")
  if (src !== before) {
    applied++
    console.log('Applied:', p.riverId, '→', p.gaugeId)
  } else {
    console.log('NOT FOUND:', p.riverId)
  }
}

fs.writeFileSync(RIVERS_TS, src)
console.log('\nApplied', applied, 'of', confident.length, 'gauge assignments')
