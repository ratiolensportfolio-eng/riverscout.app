#!/usr/bin/env node
// Fetch Michigan DNR public boating access sites from ArcGIS and
// insert into river_access_points. Matches WaterBody names to our
// river catalog, converts to access point rows with lat/lng.
//
// Source: services3.arcgis.com/Jdnp1TjADvSDxMAX/arcgis/rest/services/
//         Boat_Launches/FeatureServer/0
//
// Usage: node scripts/fetch-mi-access-sites.js
// Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

const fs = require('fs')
const path = require('path')

const API = 'https://services3.arcgis.com/Jdnp1TjADvSDxMAX/arcgis/rest/services/Boat_Launches/FeatureServer/0/query'
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Hand-curated WaterBody → river_id map for MI rivers we track
const WATER_TO_RIVER = {
  'Manistee River': 'manistee',
  'Pine River': 'pine_mi',
  'Au Sable River': 'ausable',
  'Pere Marquette River': 'pere_marquette',
  'Muskegon River': 'muskegon',
  'Boardman River': 'boardman',
  'Jordan River': 'jordan',
  'Betsie River': 'betsie',
  'Little Manistee River': 'little_manistee',
  'Platte River': 'platte_mi',
  'White River': 'white_mi',
  'Rifle River': 'rifle_mi',
  'Thunder Bay River': 'thunder_bay_mi',
  'Huron River': 'huron_mi',
  'Clinton River': 'clinton_mi',
  'Grand River': 'grand_mi',
  'Kalamazoo River': 'kalamazoo',
  'St. Joseph River': 'st_joseph_mi',
  'Flat River': 'flat_mi',
  'Rogue River': 'rogue_mi',
  'Thornapple River': 'thornapple',
  'Chippewa River': 'chippewa_mi',
  'Tittabawassee River': 'tittabawassee',
  'Sturgeon River': 'sturgeon_mi',
  'Black River': 'black_cheboygan',
  'Presque Isle River': 'presque_isle_mi',
  'Boyne River': 'boyne_mi',
  'Manistique River': 'manistique_mi',
  'Little Muskegon River': 'little_muskegon_mi',
  'Pigeon River': 'pigeon_mi',
  'Indian River': 'indian_mi',
  'Flint River': 'flint_mi',
  'Paw Paw River': 'paw_paw_mi',
  'Dowagiac River': 'dowagiac',
}

async function fetchAll() {
  const all = []
  let offset = 0
  while (true) {
    const url = `${API}?where=1%3D1&outFields=SiteName,WaterBody,County,Type,TotalParking,ImprovedRamp,CarryDown,LocationDescription,BAS_SiteID&returnGeometry=true&outSR=4326&f=json&resultRecordCount=1000&resultOffset=${offset}`
    const res = await fetch(url)
    const data = await res.json()
    const features = data.features || []
    all.push(...features)
    if (features.length < 1000) break
    offset += 1000
    await new Promise(r => setTimeout(r, 500))
  }
  return all
}

function determineType(feature) {
  const a = feature.attributes
  if (a.CarryDown === 'Yes' && a.ImprovedRamp !== 'Yes') return 'carry_in'
  if (a.ImprovedRamp === 'Yes') return 'boat_ramp'
  return 'boat_ramp'
}

function determineRampSurface(feature) {
  const a = feature.attributes
  if (a.ImprovedRamp === 'Yes') return 'concrete'
  if (a.CarryDown === 'Yes') return null
  return 'gravel'
}

async function main() {
  const { createClient } = require('@supabase/supabase-js')
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } })

  console.log('Fetching MI DNR boat launches...')
  const features = await fetchAll()
  console.log(`Total features: ${features.length}`)

  let matched = 0, inserted = 0, skipped = 0, errors = 0
  const unmatchedWaters = new Set()

  for (const f of features) {
    const a = f.attributes
    const geom = f.geometry
    if (!geom || !geom.x || !geom.y) { skipped++; continue }

    const waterBody = (a.WaterBody || '').trim()
    const riverId = WATER_TO_RIVER[waterBody]
    if (!riverId) {
      unmatchedWaters.add(waterBody)
      skipped++
      continue
    }
    matched++

    const siteName = (a.SiteName || 'Unnamed Access').trim()
    const accessType = determineType(f)
    const sourceId = `midnr-${a.BAS_SiteID || siteName.replace(/\s+/g, '-').toLowerCase()}`

    // Check if this access point already exists (by name + river)
    const { data: existing } = await supabase
      .from('river_access_points')
      .select('id')
      .eq('river_id', riverId)
      .ilike('name', siteName)
      .limit(1)

    if (existing && existing.length > 0) {
      skipped++
      continue
    }

    const { error } = await supabase
      .from('river_access_points')
      .insert({
        river_id: riverId,
        name: siteName,
        description: a.LocationDescription || null,
        access_type: accessType,
        lat: geom.y,
        lng: geom.x,
        parking_capacity: a.TotalParking
          ? (a.TotalParking < 5 ? 'limited_under_5' : a.TotalParking <= 15 ? 'small_5_to_15' : a.TotalParking <= 30 ? 'medium_15_to_30' : 'large_over_30')
          : null,
        ramp_surface: determineRampSurface(f),
        trailer_access: a.ImprovedRamp === 'Yes',
        verification_status: 'verified',
        submitted_by_name: 'Michigan DNR',
        ai_confidence: 'high',
        ai_reasoning: `Auto-imported from MI DNR Boating Access Sites (${sourceId})`,
      })

    if (error) {
      errors++
      if (errors <= 5) console.error(`  Insert error for ${siteName}:`, error.message)
    } else {
      inserted++
    }
  }

  console.log(`\n=== RESULTS ===`)
  console.log(`Total features: ${features.length}`)
  console.log(`Matched to our rivers: ${matched}`)
  console.log(`Inserted: ${inserted}`)
  console.log(`Skipped (no match or duplicate): ${skipped}`)
  console.log(`Errors: ${errors}`)
  console.log(`\nUnmatched water bodies (top 20):`)
  const sorted = [...unmatchedWaters].sort()
  for (const w of sorted.slice(0, 20)) console.log(`  ${w}`)
  console.log(`Total unmatched waters: ${unmatchedWaters.size}`)
}

main().catch(console.error)
