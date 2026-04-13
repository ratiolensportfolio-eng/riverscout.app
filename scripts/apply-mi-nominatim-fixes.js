#!/usr/bin/env node
// Apply the audit results from /tmp/mi-nominatim-fixes.json:
//   - NEAR pins: replace lat/lng in data/river-maps/<id>.ts with Nominatim coord
//   - MISS pins: remove from data/river-maps/<id>.ts entirely
//
// Also emits a SQL file so the Supabase rows stay in sync:
//   - NEAR: update lat/lng to Nominatim coord
//   - MISS: delete the row

const fs = require('fs')
const path = require('path')

const REPO = path.resolve(__dirname, '..')
const MAPS_DIR = path.join(REPO, 'data', 'river-maps')
const SQL_OUT = path.join(REPO, 'supabase', 'seeds', 'cleanup_mi_access_points.sql')

const { fixes, removals } = require('/tmp/mi-nominatim-fixes.json')

// Per-river, group actions.
const byRiver = {}
for (const f of fixes) {
  byRiver[f.id] = byRiver[f.id] || { fix: [], remove: [] }
  byRiver[f.id].fix.push(f)
}
for (const r of removals) {
  byRiver[r.id] = byRiver[r.id] || { fix: [], remove: [] }
  byRiver[r.id].remove.push(r)
}

let mapUpdates = 0
let mapRemovals = 0

for (const [id, actions] of Object.entries(byRiver)) {
  const file = path.join(MAPS_DIR, `${id}.ts`)
  if (!fs.existsSync(file)) continue
  let src = fs.readFileSync(file, 'utf8')
  const re = /export const accessPoints: AccessPoint\[\]\s*=\s*\[\n([\s\S]*?)\n\]/
  const m = src.match(re)
  if (!m) continue

  // Rebuild line by line.
  const removeNames = new Set(actions.remove.map(r => r.name))
  const fixMap = new Map(actions.fix.map(f => [f.oldName, f]))

  const lines = m[1].split('\n')
  const kept = []
  const lineRe = /^\s*\{[^}]*name:\s*'([^']+)'[^}]*lat:\s*(-?\d+\.?\d*)[^}]*lng:\s*(-?\d+\.?\d*)[^}]*\},?\s*$/

  for (const line of lines) {
    const mm = line.match(lineRe)
    if (!mm) { kept.push(line); continue }
    const name = mm[1]
    if (removeNames.has(name)) { mapRemovals++; continue }
    const fix = fixMap.get(name)
    if (fix) {
      // Replace lat and lng in place; leave everything else as-is.
      const newLine = line
        .replace(/lat:\s*-?\d+\.?\d*/, `lat: ${fix.newLat.toFixed(5)}`)
        .replace(/lng:\s*-?\d+\.?\d*/, `lng: ${fix.newLng.toFixed(5)}`)
      kept.push(newLine)
      mapUpdates++
    } else {
      kept.push(line)
    }
  }

  const body = kept.join('\n')
  const replacement = body.trim()
    ? `export const accessPoints: AccessPoint[] = [\n${body}\n]`
    : `export const accessPoints: AccessPoint[] = []`
  src = src.replace(re, replacement)
  fs.writeFileSync(file, src)
  console.log(`  ${id}: ${actions.fix.length} updated, ${actions.remove.length} removed`)
}

// Emit SQL for Supabase.
const sql = [
  '-- cleanup_mi_access_points.sql',
  '--',
  `-- Generated ${new Date().toISOString().slice(0,10)} by scripts/apply-mi-nominatim-fixes.js.`,
  '--',
  '-- Updates the 7 MI access points where Nominatim (OSM geocoder) found',
  '-- a matching named feature 0.5-3 mi from our stored coordinate, using',
  '-- the gazetteer-sourced lat/lng as ground truth. Removes the 10 MI',
  '-- access points that could not be verified against Nominatim at all.',
  '--',
  '-- Pere Marquette, Pine, and Manistee excluded (handled separately).',
  '-- Safe to re-run.',
  '',
  'begin;',
  '',
]

for (const f of fixes) {
  const nameEsc = f.oldName.replace(/'/g, "''")
  sql.push(
    `update public.river_access_points set lat = ${f.newLat.toFixed(5)}, lng = ${f.newLng.toFixed(5)}, last_verified_at = now(), last_verified_by = 'Nominatim/OSM' where river_id = '${f.id}' and name = '${nameEsc}';  -- was ${f.distMi.toFixed(1)} mi off`
  )
}
sql.push('')
for (const r of removals) {
  const nameEsc = r.name.replace(/'/g, "''")
  sql.push(
    `delete from public.river_access_points where river_id = '${r.id}' and name = '${nameEsc}';`
  )
}
sql.push('')
sql.push('commit;')
sql.push('')

fs.writeFileSync(SQL_OUT, sql.join('\n'))

console.log(`\nMap files: ${mapUpdates} coords updated, ${mapRemovals} pins removed.`)
console.log(`SQL written to ${SQL_OUT}`)
