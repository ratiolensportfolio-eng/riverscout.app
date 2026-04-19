#!/usr/bin/env node
// Apply corrected western river access points (rivers 9-20).
// DO NOT touch Pine River. Only ADD to Au Sable and Pere Marquette.
// All others: replace access points + sections.

const fs = require('fs')
const path = require('path')
const MAPS_DIR = path.resolve(__dirname, '..', 'data', 'river-maps')

// Rivers to FULLY REPLACE (not Pine, PM, Au Sable)
const REPLACE = {
  manistee: {
    accessPoints: [
      { name: 'Tippy Dam Canoe Launch', lat: 44.1468, lng: -85.9687, type: 'access', description: 'Below Tippy Dam, upper float section.' },
      { name: 'Bear Creek Road', lat: 44.193, lng: -85.984, type: 'access', description: 'State forest access.' },
      { name: 'High Bridge', lat: 44.241, lng: -86.019, type: 'access-campsite', description: 'Off High Bridge Road. USFS campground, 16 sites.' },
      { name: 'Sawdust Bridge', lat: 44.268, lng: -86.057, type: 'access', description: 'USFS access.' },
      { name: 'Red Bridge', lat: 44.31, lng: -86.098, type: 'access-campsite', description: 'State forest campground.' },
      { name: 'Manistee River Bridge M-55', lat: 44.34, lng: -86.16, type: 'access', description: 'Near Wellston.' },
      { name: 'CCC Bridge', lat: 44.364, lng: -86.2, type: 'access', description: 'USFS.' },
      { name: 'Magoon Creek', lat: 44.391, lng: -86.239, type: 'access', description: 'State forest.' },
      { name: 'Coates Highway', lat: 44.418, lng: -86.278, type: 'access', description: 'Access point.' },
      { name: 'Manistee / Lake Michigan', lat: 44.253, lng: -86.348, type: 'take-out', description: 'River mouth at Manistee city.' },
    ],
    sections: [
      { from: 'Tippy Dam', to: 'Bear Creek Road', miles: 5, paddleTime: '2 hours', class: 'Riffles' },
      { from: 'Bear Creek Road', to: 'High Bridge', miles: 5, paddleTime: '2 hours', class: 'Riffles' },
      { from: 'High Bridge', to: 'Red Bridge', miles: 6, paddleTime: '2.5 hours', class: 'Riffles' },
      { from: 'Red Bridge', to: 'CCC Bridge', miles: 6, paddleTime: '2.5 hours', class: 'Riffles' },
      { from: 'CCC Bridge', to: 'Manistee / Lake Michigan', miles: 10, paddleTime: '4 hours', class: 'Riffles' },
    ],
  },
  muskegon: {
    accessPoints: [
      { name: 'Reedsburg Dam', lat: 43.773, lng: -85.543, type: 'access', description: 'Upper access, Osceola County.' },
      { name: 'Croton Dam (above)', lat: 43.526, lng: -85.621, type: 'access', description: 'Above Croton — different character than below.' },
      { name: 'Croton Dam (below)', lat: 43.521, lng: -85.622, type: 'access', description: 'Below dam — steelhead and salmon access.' },
      { name: 'Newaygo City', lat: 43.416, lng: -85.798, type: 'access', description: 'City park access, paved ramp.' },
      { name: 'Bridgeton', lat: 43.292, lng: -85.879, type: 'access', description: 'Mid-lower access.' },
      { name: 'Muskegon State Park', lat: 43.227, lng: -86.332, type: 'access', description: 'Lower river near Lake Michigan.' },
    ],
    sections: [
      { from: 'Croton Dam (below)', to: 'Newaygo City', miles: 12, paddleTime: '4-5 hours', class: 'I' },
      { from: 'Newaygo City', to: 'Bridgeton', miles: 14, paddleTime: '5-6 hours', class: 'I' },
    ],
  },
  boardman: {
    accessPoints: [
      { name: 'Forks Campground', lat: 44.72, lng: -85.457, type: 'access-campsite', description: 'Upper Boardman, USFS.' },
      { name: 'Supply Road', lat: 44.696, lng: -85.497, type: 'access', description: 'USFS.' },
      { name: "Scheck\\'s Place", lat: 44.67, lng: -85.535, type: 'access-campsite', description: 'State forest campground.' },
      { name: 'Brown Bridge Pond', lat: 44.646, lng: -85.539, type: 'access', description: 'Below Brown Bridge Dam removal site.' },
      { name: 'Ranch Rudolf', lat: 44.622, lng: -85.532, type: 'access', description: 'Private/access road.' },
      { name: 'Traverse City', lat: 44.762, lng: -85.62, type: 'take-out', description: 'River mouth at Grand Traverse Bay.' },
    ],
    sections: [
      { from: 'Forks Campground', to: 'Supply Road', miles: 3, paddleTime: '1.5 hours', class: 'I' },
      { from: 'Supply Road', to: "Scheck\\'s Place", miles: 3, paddleTime: '1.5 hours', class: 'I' },
      { from: "Scheck\\'s Place", to: 'Brown Bridge Pond', miles: 3, paddleTime: '1.5 hours', class: 'I', notes: 'Dam removal area' },
    ],
  },
  madison: {
    accessPoints: [
      { name: 'Three Dollar Bridge FAS', lat: 44.783, lng: -111.522, type: 'access', description: 'Wade fishing, no float fishing above Lyons.' },
      { name: 'Lyons Bridge FAS', lat: 44.899369, lng: -111.590521, type: 'access', description: 'CONFIRMED — MT FWP. Float fishing begins. Two concrete ramps, parking, dump station.' },
      { name: 'Palisades FAS', lat: 44.971, lng: -111.619, type: 'access-campsite', description: '~27 miles south of Ennis. Camping.' },
      { name: 'Varney Bridge FAS', lat: 45.229, lng: -111.75195, type: 'access-campsite', description: 'CONFIRMED — MT FWP. Concrete ramp, camping, 8 mi south of Ennis.' },
      { name: 'Ennis FAS', lat: 45.347, lng: -111.73, type: 'access', description: 'Town ramp, wide dirt, above US-287 bridge.' },
      { name: 'Valley Garden FAS', lat: 45.37, lng: -111.737, type: 'access', description: '2 miles below Ennis. Only access to wade-only channels section.' },
    ],
    sections: [
      { from: 'Lyons Bridge', to: 'Varney Bridge', miles: 25, paddleTime: '6-8 hours', class: 'I', notes: 'Upper Madison — drift boat country' },
      { from: 'Varney Bridge', to: 'Ennis', miles: 10, paddleTime: '3-4 hours', class: 'I' },
    ],
  },
  south_platte: {
    accessPoints: [
      { name: 'Cheesman Canyon / Gill Trailhead', lat: 39.036, lng: -105.607, type: 'access', description: 'CONFIRMED. Walk-in only, 30-min hike to river.' },
      { name: 'Deckers Bridge (put-in)', lat: 39.25666, lng: -105.22223, type: 'access', description: 'CONFIRMED — riverfacts.com GPS. Most popular access.' },
      { name: 'Deckers Bridge (takeout)', lat: 39.40722, lng: -105.17223, type: 'access', description: 'CONFIRMED — riverfacts.com GPS.' },
      { name: 'Dream Stream / Eleven Mile', lat: 38.94, lng: -105.489, type: 'access', description: 'Below Eleven Mile Reservoir.' },
    ],
    sections: [
      { from: 'Cheesman Canyon', to: 'Deckers Bridge', miles: 5, paddleTime: '3 hours', class: 'I-II', notes: 'Gold Medal trout water' },
    ],
  },
  arkansas: {
    accessPoints: [
      { name: 'Numbers Launch Site', lat: 38.88, lng: -106.22, type: 'access', description: 'Above Buena Vista, Class IV-V put-in.' },
      { name: 'Buena Vista Riverside Park', lat: 38.842, lng: -106.133, type: 'access', description: 'Town park, kayak playpark.' },
      { name: "Fisherman\\'s Bridge", lat: 38.76385, lng: -106.08899, type: 'access', description: 'CONFIRMED — riverfacts.com GPS.' },
      { name: 'Hecla Junction', lat: 38.66, lng: -106.063, type: 'access', description: 'BLM, Browns Canyon NM.' },
      { name: 'Stone Bridge', lat: 38.61027, lng: -106.06806, type: 'access', description: 'CONFIRMED — riverfacts.com GPS.' },
      { name: 'Salida Boat Ramp', lat: 38.537778, lng: -105.9925, type: 'access', description: 'CONFIRMED — Colorado Parks & Wildlife.' },
      { name: 'Rincon', lat: 38.4556, lng: -105.84127, type: 'access', description: 'CONFIRMED — riverfacts.com GPS.' },
      { name: 'Parkdale Recreation Site', lat: 38.48472, lng: -105.39917, type: 'access', description: 'CONFIRMED — Last access before Royal Gorge.' },
      { name: 'Canon City takeout', lat: 38.43805, lng: -105.23056, type: 'take-out', description: 'CONFIRMED — Below gorge.' },
    ],
    sections: [
      { from: 'Numbers', to: 'Buena Vista', miles: 7, paddleTime: '2-3 hours', class: 'IV-V', notes: 'Expert only — the Numbers' },
      { from: 'Buena Vista', to: 'Hecla Junction', miles: 15, paddleTime: '5-6 hours', class: 'II-III', notes: 'Browns Canyon National Monument' },
      { from: 'Salida', to: 'Parkdale', miles: 30, paddleTime: '1-2 days', class: 'III-IV' },
      { from: 'Parkdale', to: 'Canon City', miles: 10, paddleTime: '3-4 hours', class: 'III-V', notes: 'Royal Gorge — expert only' },
    ],
  },
  green_ut: {
    accessPoints: [
      { name: 'Flaming Gorge Dam', lat: 40.916, lng: -109.421, type: 'access', description: 'Main tailwater put-in, Red Canyon area.' },
      { name: 'Little Hole', lat: 40.932, lng: -109.558, type: 'access', description: '7 miles below dam, BLM day use.' },
      { name: 'Indian Crossing', lat: 40.924, lng: -109.65, type: 'access', description: "Browns Park section." },
      { name: 'Swinging Bridge', lat: 40.916, lng: -109.707, type: 'access', description: 'BLM.' },
      { name: 'Dutch John Bridge', lat: 40.921, lng: -109.403, type: 'access', description: 'Near dam, alternate access.' },
    ],
    sections: [
      { from: 'Flaming Gorge Dam', to: 'Little Hole', miles: 7, paddleTime: '3-4 hours', class: 'I-II', notes: 'Trophy trout tailwater — A section' },
      { from: 'Little Hole', to: 'Indian Crossing', miles: 7, paddleTime: '3-4 hours', class: 'I-II', notes: 'B section' },
    ],
  },
  deschutes: {
    accessPoints: [
      { name: 'Bend Whitewater Park', lat: 44.058, lng: -121.312, type: 'access', description: 'City of Bend, Tumalo State Park area.' },
      { name: 'Warm Springs', lat: 44.756, lng: -121.3, type: 'access', description: 'CONFIRMED — BLM. No motorized boats above on reservation section.' },
      { name: 'Trout Creek', lat: 44.88, lng: -121.004, type: 'access', description: 'CONFIRMED — BLM. Best float access, 3-day drift to Maupin.' },
      { name: 'Maupin City Park', lat: 45.178, lng: -121.087, type: 'access', description: 'CONFIRMED — BLM. Boat ramp, large parking.' },
      { name: 'Sherars Falls', lat: 45.27, lng: -121.004, type: 'portage', description: 'CONFIRMED — 15ft vertical drop. Portage required. Tribal fishing platforms.' },
      { name: 'Macks Canyon', lat: 45.454, lng: -120.977, type: 'access-campsite', description: 'BLM campground, remote lower river.' },
      { name: 'Heritage Landing', lat: 45.63, lng: -120.907, type: 'take-out', description: 'CONFIRMED — Columbia River confluence. BLM, paved ramp.' },
    ],
    sections: [
      { from: 'Warm Springs', to: 'Trout Creek', miles: 12, paddleTime: '5-6 hours', class: 'II', notes: 'Reservation section — stay east bank' },
      { from: 'Trout Creek', to: 'Maupin', miles: 25, paddleTime: '2-3 days', class: 'II-III', notes: 'Classic multi-day float' },
      { from: 'Maupin', to: 'Heritage Landing', miles: 45, paddleTime: '3-4 days', class: 'II-III', notes: 'Lower Deschutes. BLM Boater Pass required overnight.' },
    ],
  },
  gauley: {
    accessPoints: [
      { name: 'Summersville Dam', lat: 38.206149, lng: -81.004208, type: 'access', description: 'CONFIRMED — NPS/Recreation.gov. Upper Gauley Class V. Releases Sept-Oct only.' },
      { name: "Mason\\'s Branch", lat: 38.22, lng: -81.04, type: 'access', description: 'NPS public access, parking, boat launch.' },
      { name: "Wood\\'s Ferry", lat: 38.222, lng: -81.07, type: 'access', description: 'NPS public access.' },
      { name: 'Upper Swiss', lat: 38.229, lng: -81.106, type: 'access', description: 'NPS public access.' },
      { name: 'Bucklick Branch', lat: 38.22682, lng: -81.03062, type: 'access', description: 'CONFIRMED — riverfacts.com GPS. Lower Gauley.' },
      { name: 'Swiss takeout', lat: 38.22905, lng: -81.12605, type: 'take-out', description: 'CONFIRMED — riverfacts.com GPS.' },
    ],
    sections: [
      { from: 'Summersville Dam', to: 'Upper Swiss', miles: 12, paddleTime: '4-5 hours', class: 'V', notes: 'Upper Gauley — expert only. Fall dam releases.' },
      { from: 'Bucklick Branch', to: 'Swiss takeout', miles: 10, paddleTime: '3-4 hours', class: 'III-IV', notes: 'Lower Gauley — intermediate-advanced.' },
    ],
  },
  nantahala: {
    accessPoints: [
      { name: 'Ferebee Memorial Park', lat: 35.362, lng: -83.722, type: 'access', description: 'Upper put-in above gorge on US-19.' },
      { name: "Patton\\'s Run", lat: 35.373, lng: -83.707, type: 'access', description: 'Mid-river access.' },
      { name: 'Nantahala Outdoor Center (NOC)', lat: 35.378, lng: -83.697, type: 'access', description: 'CONFIRMED — USGS topo. Main hub, outfitters, restaurant, shuttle.' },
      { name: 'Nantahala Falls', lat: 35.379, lng: -83.695, type: 'access', description: 'Class III falls, most photographed.' },
      { name: 'Wesser takeout', lat: 35.388, lng: -83.693, type: 'take-out', description: 'Standard takeout at NOC.' },
    ],
    sections: [
      { from: 'Ferebee Memorial Park', to: 'Wesser', miles: 8, paddleTime: '3-4 hours', class: 'II-III', notes: 'Dam-release run, consistent flow. NOC provides shuttles.' },
    ],
  },
  san_juan_nm: {
    accessPoints: [
      { name: 'Navajo Dam', lat: 36.8003, lng: -107.6126, type: 'access', description: 'CONFIRMED. C&R only directly below dam. Trophy tailwater begins.' },
      { name: 'Upper Flats / Beaver Flats', lat: 36.8067, lng: -107.61685, type: 'access', description: 'CONFIRMED — 1.25 miles below dam.' },
      { name: 'Texas Hole', lat: 36.813893, lng: -107.669994, type: 'access', description: 'CONFIRMED. Most popular section. Large NM State Park lot.' },
      { name: 'Simon Canyon', lat: 36.832, lng: -107.661, type: 'access', description: 'Less crowded, wade fishing.' },
      { name: 'Cottonwood Campground', lat: 36.856, lng: -107.704, type: 'access-campsite', description: 'Via CR 4280 west of Aztec Bridge.' },
      { name: 'Aztec Bridge boat ramp', lat: 36.87, lng: -107.761, type: 'take-out', description: 'Public parking and boat ramp.' },
    ],
    sections: [
      { from: 'Navajo Dam', to: 'Texas Hole', miles: 4, paddleTime: '2 hours', class: 'I', notes: 'Quality Waters — flies/artificials only, barbless, C&R' },
      { from: 'Texas Hole', to: 'Aztec Bridge', miles: 5, paddleTime: '3 hours', class: 'I', notes: 'Below Quality Waters — bait allowed' },
    ],
  },
}

function escapeQuote(s) { return s.replace(/'/g, "\\'") }

function writeRiver(riverId, data) {
  const filePath = path.join(MAPS_DIR, `${riverId}.ts`)
  if (!fs.existsSync(filePath)) {
    // Create stub with just access points + sections, no riverPath
    const apLines = data.accessPoints.map(ap =>
      `  { name: '${escapeQuote(ap.name)}', lat: ${ap.lat}, lng: ${ap.lng}, type: '${ap.type}', description: '${escapeQuote(ap.description || '')}' },`
    ).join('\n')
    const secLines = (data.sections || []).map(s => {
      let line = `  { from: '${escapeQuote(s.from)}', to: '${escapeQuote(s.to)}', miles: ${s.miles}, paddleTime: '${s.paddleTime}', class: '${s.class || 'I'}'`
      if (s.notes) line += `, notes: '${escapeQuote(s.notes)}'`
      return line + ' },'
    }).join('\n')

    const ts = `import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'\n\nexport const accessPoints: AccessPoint[] = [\n${apLines}\n]\n\nexport const sections: RiverSection[] = [\n${secLines}\n]\n\nexport const riverPath: [number, number][] = []\n`
    fs.writeFileSync(filePath, ts)
    console.log(`CREATED: ${riverId} — ${data.accessPoints.length} access points`)
    return true
  }

  let src = fs.readFileSync(filePath, 'utf8')

  const apLines = data.accessPoints.map(ap =>
    `  { name: '${escapeQuote(ap.name)}', lat: ${ap.lat}, lng: ${ap.lng}, type: '${ap.type}', description: '${escapeQuote(ap.description || '')}' },`
  ).join('\n')
  const secLines = (data.sections || []).map(s => {
    let line = `  { from: '${escapeQuote(s.from)}', to: '${escapeQuote(s.to)}', miles: ${s.miles}, paddleTime: '${s.paddleTime}', class: '${s.class || 'I'}'`
    if (s.notes) line += `, notes: '${escapeQuote(s.notes)}'`
    return line + ' },'
  }).join('\n')

  src = src.replace(
    /export const accessPoints: AccessPoint\[\] = \[[\s\S]*?\]/,
    `export const accessPoints: AccessPoint[] = [\n${apLines}\n]`
  )
  src = src.replace(
    /export const sections: RiverSection\[\] = \[[\s\S]*?\]/,
    `export const sections: RiverSection[] = [\n${secLines}\n]`
  )

  fs.writeFileSync(filePath, src)
  console.log(`Updated: ${riverId} — ${data.accessPoints.length} access points, ${(data.sections || []).length} sections`)
  return true
}

// Also need to register new rivers in index.ts
function registerInIndex(riverId) {
  const idxPath = path.join(MAPS_DIR, 'index.ts')
  let idx = fs.readFileSync(idxPath, 'utf8')
  if (idx.includes(`  ${riverId}: () => import`)) return false

  const entry = `  ${riverId}: () => import('./${riverId}').then(m => ({\n    accessPoints: m.accessPoints,\n    sections: m.sections,\n    riverPath: m.riverPath,\n  })),\n`

  // Find alphabetical position
  const entryRegex = /^  (\w+): \(\) => import/gm
  let match, insertBefore = null
  while ((match = entryRegex.exec(idx)) !== null) {
    if (match[1] > riverId) { insertBefore = match.index; break }
  }

  if (insertBefore !== null) {
    idx = idx.slice(0, insertBefore) + entry + idx.slice(insertBefore)
  } else {
    const closingBrace = idx.lastIndexOf('\n}\n')
    if (closingBrace !== -1) idx = idx.slice(0, closingBrace) + '\n' + entry + idx.slice(closingBrace)
  }

  fs.writeFileSync(idxPath, idx)
  return true
}

let updated = 0
for (const [riverId, data] of Object.entries(REPLACE)) {
  if (writeRiver(riverId, data)) updated++
  registerInIndex(riverId)
}

console.log(`\nTotal updated: ${updated}`)
