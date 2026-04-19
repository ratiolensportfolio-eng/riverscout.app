#!/usr/bin/env node
// Apply verified access point data to river-maps/*.ts files.
// Reads the structured data below and updates each river's
// accessPoints + sections arrays.

const fs = require('fs')
const path = require('path')
const MAPS_DIR = path.resolve(__dirname, '..', 'data', 'river-maps')

const RIVERS = {
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
  ausable: {
    accessPoints: [
      { name: 'Stephan Bridge (Gates Lodge)', lat: 44.66, lng: -84.698, type: 'access', description: 'Upper access, Grayling area, near Gates Au Sable Lodge.' },
      { name: "Burton's Landing", lat: 44.635, lng: -84.588, type: 'access', description: 'USFS.' },
      { name: 'Parmalee Bridge', lat: 44.556, lng: -84.455, type: 'access', description: 'USGS gauge 04136900 — confirmed gauge location.' },
      { name: 'Whirlpool Access', lat: 44.43, lng: -83.959, type: 'access', description: 'State forest.' },
      { name: '4001 Bridge', lat: 44.466, lng: -83.659, type: 'access', description: 'Last takeout on National Scenic River section.' },
      { name: 'Rainbow Bend', lat: 44.433, lng: -83.551, type: 'access', description: 'Mid-river access.' },
      { name: 'Foote Dam', lat: 44.543, lng: -83.445, type: 'access', description: 'Below Foote Dam.' },
      { name: 'Oscoda / Lake Huron', lat: 44.428, lng: -83.333, type: 'take-out', description: 'River mouth at Lake Huron.' },
      { name: 'Chase Bridge (Mason Tract)', lat: 44.424, lng: -84.583, type: 'access', description: 'Upper South Branch.' },
      { name: 'Lovells Area', lat: 44.847, lng: -84.361, type: 'access', description: 'North Branch, near gauge 04134500.' },
    ],
    sections: [
      { from: 'Stephan Bridge', to: "Burton's Landing", miles: 8, paddleTime: '3-4 hours', class: 'I', notes: 'Upper Au Sable, flies-only stretch' },
      { from: "Burton's Landing", to: 'Parmalee Bridge', miles: 12, paddleTime: '5-6 hours', class: 'I' },
      { from: 'Parmalee Bridge', to: '4001 Bridge', miles: 20, paddleTime: '8-10 hours', class: 'I', notes: 'National Scenic River section' },
    ],
  },
  pere_marquette: {
    accessPoints: [
      { name: 'M-37 Bridge (Baldwin)', lat: 43.889, lng: -85.852, type: 'access', description: 'Flies-only section begins. USFS.' },
      { name: 'Gleasons Landing', lat: 43.886, lng: -85.979, type: 'access-campsite', description: 'USFS, water, toilets, camping. Flies-only section ends here.' },
      { name: 'Bowmans Bridge', lat: 43.885, lng: -86.046, type: 'access-campsite', description: 'USFS, water, toilets, camping, 5 miles west of Baldwin on 56th St.' },
      { name: 'Rainbow Rapids', lat: 43.882, lng: -86.093, type: 'access', description: 'USFS, picnic area, restrooms.' },
      { name: 'Upper Branch Bridge', lat: 43.873, lng: -86.176, type: 'access-campsite', description: 'USFS, parking, restrooms, camping.' },
      { name: 'Walhalla Bridge', lat: 43.887, lng: -86.298, type: 'access', description: 'DNR site.' },
      { name: 'Indian Bridge', lat: 43.893, lng: -86.335, type: 'access', description: 'USFS, lower river.' },
      { name: 'Scottville Riverside', lat: 43.956, lng: -86.275, type: 'access', description: 'City park, paved ramp.' },
      { name: 'US-31 / Lake Michigan', lat: 44.023, lng: -86.424, type: 'take-out', description: 'Lower takeout near Ludington.' },
    ],
    sections: [
      { from: 'M-37 Bridge', to: 'Gleasons Landing', miles: 8, paddleTime: '4 hours', class: 'I', notes: 'Flies-only section' },
      { from: 'Gleasons Landing', to: 'Bowmans Bridge', miles: 5, paddleTime: '2.5 hours', class: 'I' },
      { from: 'Bowmans Bridge', to: 'Rainbow Rapids', miles: 4, paddleTime: '2 hours', class: 'I' },
      { from: 'Rainbow Rapids', to: 'Indian Bridge', miles: 15, paddleTime: '6-7 hours', class: 'I', notes: 'Lower river, wider' },
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
      { name: "Scheck's Place", lat: 44.67, lng: -85.535, type: 'access-campsite', description: 'State forest campground.' },
      { name: 'Brown Bridge Pond', lat: 44.646, lng: -85.539, type: 'access', description: 'Below Brown Bridge Dam removal site.' },
      { name: 'Ranch Rudolf', lat: 44.622, lng: -85.532, type: 'access', description: 'Private/access road.' },
      { name: 'Traverse City / Grand Traverse Bay', lat: 44.762, lng: -85.62, type: 'take-out', description: 'River mouth at Traverse City.' },
    ],
    sections: [
      { from: 'Forks Campground', to: 'Supply Road', miles: 3, paddleTime: '1.5 hours', class: 'I' },
      { from: 'Supply Road', to: "Scheck's Place", miles: 3, paddleTime: '1.5 hours', class: 'I' },
      { from: "Scheck's Place", to: 'Brown Bridge Pond', miles: 3, paddleTime: '1.5 hours', class: 'I', notes: 'Dam removal area — verify current conditions' },
    ],
  },
  gauley: {
    accessPoints: [
      { name: 'Summersville Dam', lat: 38.217, lng: -80.853, type: 'access', description: 'Dam release put-in. Upper Gauley Class V.' },
      { name: 'Carnifex Ferry', lat: 38.241, lng: -80.931, type: 'access', description: 'Access point.' },
      { name: "Sweets Falls", lat: 38.224, lng: -80.974, type: 'access', description: 'Major rapid.' },
      { name: 'Swiss Access / Lower Gauley', lat: 38.208, lng: -81.022, type: 'access', description: 'Transition to Lower Gauley Class III-IV.' },
      { name: 'Belva', lat: 38.166, lng: -81.092, type: 'take-out', description: 'Lower Gauley takeout.' },
    ],
    sections: [
      { from: 'Summersville Dam', to: 'Swiss Access', miles: 12, paddleTime: '4-5 hours', class: 'V', notes: 'Upper Gauley — expert only. Scheduled fall releases.' },
      { from: 'Swiss Access', to: 'Belva', miles: 10, paddleTime: '3-4 hours', class: 'III-IV', notes: 'Lower Gauley — intermediate-advanced.' },
    ],
  },
  new_river: {
    accessPoints: [
      { name: 'Thurmond', lat: 37.966, lng: -81.074, type: 'access', description: 'Historic depot access.' },
      { name: 'Cunard Launch', lat: 37.99, lng: -81.087, type: 'access', description: 'Main rafting put-in, Upper New.' },
      { name: 'Fayette Station', lat: 38.074, lng: -81.08, type: 'access', description: 'Below New River Gorge Bridge.' },
      { name: 'Lansing / Millstone', lat: 38.097, lng: -81.101, type: 'take-out', description: 'Takeout for lower gorge.' },
    ],
    sections: [
      { from: 'Cunard Launch', to: 'Fayette Station', miles: 8, paddleTime: '3-4 hours', class: 'III-V', notes: 'New River Gorge — Class III-V rapids' },
    ],
  },
  nantahala: {
    accessPoints: [
      { name: 'Ferebee Memorial Park', lat: 35.362, lng: -83.722, type: 'access', description: 'Upper put-in above gorge.' },
      { name: 'Nantahala Outdoor Center (NOC)', lat: 35.378, lng: -83.697, type: 'access', description: 'Main commercial hub, outfitters, restaurant, gear.' },
      { name: 'Nantahala Falls', lat: 35.379, lng: -83.695, type: 'access', description: 'Class III falls, most photographed section.' },
      { name: 'Wesser', lat: 35.388, lng: -83.693, type: 'take-out', description: 'Standard takeout at NOC.' },
    ],
    sections: [
      { from: 'Ferebee Memorial Park', to: 'Wesser', miles: 8, paddleTime: '3-4 hours', class: 'II-III', notes: 'Dam-release run, consistent flow' },
    ],
  },
  arkansas: {
    accessPoints: [
      { name: 'Buena Vista Whitewater Park', lat: 38.842, lng: -106.133, type: 'access', description: 'Town park put-in.' },
      { name: "Fisherman's Bridge", lat: 38.778, lng: -106.098, type: 'access', description: 'USFS.' },
      { name: 'Salida Riverside Park', lat: 38.535, lng: -106.0, type: 'access', description: 'Town of Salida put-in.' },
      { name: 'Texas Creek', lat: 38.389, lng: -105.73, type: 'access', description: 'Access point.' },
      { name: 'Royal Gorge / Canon City', lat: 38.449, lng: -105.324, type: 'take-out', description: 'Below gorge.' },
    ],
    sections: [
      { from: 'Buena Vista', to: 'Salida', miles: 26, paddleTime: '6-8 hours', class: 'II-III', notes: 'Browns Canyon National Monument' },
      { from: 'Salida', to: 'Royal Gorge', miles: 40, paddleTime: '2 days', class: 'III-V', notes: 'Includes Royal Gorge — expert only' },
    ],
  },
  south_platte: {
    accessPoints: [
      { name: 'Cheesman Canyon', lat: 39.244, lng: -105.293, type: 'access', description: 'Upper Cheesman Canyon.' },
      { name: 'Deckers Bridge', lat: 39.216, lng: -105.215, type: 'access', description: 'Most popular access, parking area.' },
      { name: 'Eleven Mile Canyon', lat: 38.908, lng: -105.474, type: 'access', description: 'Reservoir tailwater section.' },
    ],
    sections: [
      { from: 'Cheesman Canyon', to: 'Deckers Bridge', miles: 3, paddleTime: '2 hours', class: 'I-II', notes: 'Gold Medal trout water' },
    ],
  },
  green_ut: {
    accessPoints: [
      { name: 'Flaming Gorge Dam', lat: 40.916, lng: -109.421, type: 'access', description: 'Main put-in for trophy tailwater. Red Canyon area.' },
      { name: 'Little Hole', lat: 40.932, lng: -109.56, type: 'access', description: '7 miles below dam. Day use area.' },
      { name: 'Indian Crossing', lat: 40.924, lng: -109.65, type: 'access', description: "Browns Park section." },
    ],
    sections: [
      { from: 'Flaming Gorge Dam', to: 'Little Hole', miles: 7, paddleTime: '3-4 hours', class: 'I-II', notes: 'Trophy trout tailwater — Green River A section' },
    ],
  },
  deschutes: {
    accessPoints: [
      { name: 'Bend Whitewater Park', lat: 44.058, lng: -121.312, type: 'access', description: 'City of Bend put-in.' },
      { name: 'Maupin', lat: 45.177, lng: -121.087, type: 'access', description: 'Fishing and whitewater hub, lower river.' },
      { name: 'Sherars Falls', lat: 45.27, lng: -121.004, type: 'portage', description: 'Portage required.' },
    ],
    sections: [
      { from: 'Bend Whitewater Park', to: 'Sunriver', miles: 10, paddleTime: '3-4 hours', class: 'II-III', notes: 'Upper Deschutes, playspots' },
    ],
  },
  white_ar: {
    accessPoints: [
      { name: 'Bull Shoals Dam', lat: 36.378, lng: -92.579, type: 'access', description: 'Tailwater section begins below dam. Trophy trout.' },
      { name: 'Cotter Bridge', lat: 36.27, lng: -92.526, type: 'access', description: 'Town of Cotter, popular wade access.' },
      { name: 'Buffalo City', lat: 36.188, lng: -92.444, type: 'access', description: 'Below Buffalo River confluence.' },
      { name: 'Calico Rock', lat: 36.116, lng: -92.135, type: 'access', description: 'Lower White River.' },
    ],
    sections: [
      { from: 'Bull Shoals Dam', to: 'Cotter Bridge', miles: 10, paddleTime: '4-5 hours', class: 'I', notes: 'Trophy tailwater — brown and rainbow trout' },
    ],
  },
  san_juan_nm: {
    accessPoints: [
      { name: 'Navajo Dam', lat: 36.808, lng: -107.612, type: 'access', description: 'Trophy tailwater begins.' },
      { name: 'Texas Hole', lat: 36.82, lng: -107.64, type: 'access', description: 'Most popular wade fishing section.' },
      { name: 'Cottonwood', lat: 36.857, lng: -107.703, type: 'access', description: 'Lower section put-in.' },
      { name: 'Blanco', lat: 36.87, lng: -107.761, type: 'take-out', description: 'Standard takeout.' },
    ],
    sections: [
      { from: 'Navajo Dam', to: 'Texas Hole', miles: 1.5, paddleTime: '1 hour', class: 'I', notes: 'Quality Water — special regulations' },
      { from: 'Texas Hole', to: 'Blanco', miles: 5, paddleTime: '3 hours', class: 'I' },
    ],
  },
}

// Write each river's access points + sections into its map file
let updated = 0
for (const [riverId, data] of Object.entries(RIVERS)) {
  const filePath = path.join(MAPS_DIR, `${riverId}.ts`)
  if (!fs.existsSync(filePath)) {
    console.log(`SKIP: ${riverId} — no map file`)
    continue
  }

  let src = fs.readFileSync(filePath, 'utf8')

  // Build new accessPoints array
  const apLines = data.accessPoints.map(ap =>
    `  { name: '${ap.name.replace(/'/g, "\\'")}', lat: ${ap.lat}, lng: ${ap.lng}, type: '${ap.type}', description: '${(ap.description || '').replace(/'/g, "\\'")}' },`
  ).join('\n')

  // Build new sections array
  const secLines = (data.sections || []).map(s => {
    let line = `  { from: '${s.from.replace(/'/g, "\\'")}', to: '${s.to.replace(/'/g, "\\'")}', miles: ${s.miles}, paddleTime: '${s.paddleTime}', class: '${s.class || 'I'}'`
    if (s.notes) line += `, notes: '${s.notes.replace(/'/g, "\\'")}'`
    line += ' },'
    return line
  }).join('\n')

  // Replace accessPoints array
  src = src.replace(
    /export const accessPoints: AccessPoint\[\] = \[[\s\S]*?\]/,
    `export const accessPoints: AccessPoint[] = [\n${apLines}\n]`
  )

  // Replace sections array
  src = src.replace(
    /export const sections: RiverSection\[\] = \[[\s\S]*?\]/,
    `export const sections: RiverSection[] = [\n${secLines}\n]`
  )

  fs.writeFileSync(filePath, src)
  console.log(`Updated: ${riverId} — ${data.accessPoints.length} access points, ${(data.sections || []).length} sections`)
  updated++
}

console.log(`\nTotal updated: ${updated}`)
