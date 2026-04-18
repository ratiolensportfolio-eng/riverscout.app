// Pennsylvania Fish & Boat Commission stocking scraper via ArcGIS.
// Endpoint: fbweb.pa.gov/arcgis/rest/services/PFBC_Map_Services/
//           TroutStocked{YEAR}/MapServer
//
// PA publishes annual allocation data — total fish per section for
// the stocking year, broken down by species (brook, brown, rainbow,
// golden, brood). Not event-level (no specific stocking dates),
// but tells us "this river section gets X trout per year."
//
// We insert one row per (river, species) with is_scheduled=true
// and stocking_date set to April 1 of the stocking year (the
// typical start of PA's adult stocking season).

import { createClient } from '@supabase/supabase-js'
import { ALL_RIVERS } from '@/data/rivers'

const BASE_URL = 'https://fbweb.pa.gov/arcgis/rest/services/PFBC_Map_Services'
const STOCKING_AUTHORITY = 'Pennsylvania PFBC'
const STATE_KEY = 'pa'

const WATERBODY_TO_RIVER: Record<string, string> = {
  'Lehigh River': 'lehigh',
  'Pine Creek': 'pine_creek_pa',
  'Youghiogheny River': 'yough',
  'Loyalhanna Creek': 'loyalhanna',
  'Kettle Creek': 'kettle_creek',
  'Penns Creek': 'penns_creek',
  'Fishing Creek': 'fishing_creek_pa',
  'Spring Creek': 'spring_creek_pa',
  'Lackawaxen River': 'lackawaxen',
  'Delaware River': 'delaware',
  'Little Juniata River': 'little_juniata',
  'Juniata River': 'juniata',
  'Allegheny River': 'allegheny',
  'French Creek': 'french_pa',
  'Oil Creek': 'oil_creek',
  'Clarion River': 'clarion',
  'Slippery Rock Creek': 'slippery_rock',
}

const paRivers = ALL_RIVERS.filter(r => r.stateKey === 'pa')

function normalize(name: string): string {
  return name.toLowerCase()
    .replace(/\b(creek|river|brook|run|branch)\b/gi, '')
    .replace(/\b(east|west|north|south|upper|lower|big|little)\b/gi, '')
    .trim().replace(/\s+/g, ' ')
}

function matchRiver(wtrName: string): string | null {
  const clean = wtrName.trim()
  if (WATERBODY_TO_RIVER[clean]) return WATERBODY_TO_RIVER[clean]
  const normWb = normalize(clean)
  for (const r of paRivers) {
    const normR = normalize(r.n)
    if (normWb === normR || normR.includes(normWb) || normWb.includes(normR)) {
      return r.id
    }
  }
  return null
}

export interface PaScraperReport {
  total: number
  matched: number
  inserted: number
  skipped: number
  errors: number
  unmatched: string[]
  fetchedAt: string
}

export async function runPaStockingScraper(opts?: { year?: number }): Promise<PaScraperReport> {
  const year = opts?.year ?? new Date().getFullYear()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase not configured')
  const supabase = createClient(url, key, { auth: { persistSession: false } })

  // PA publishes TroutStocked{YEAR} — try current year first, fall back to previous
  let layerId = 2 // PA uses layer 2 for the stocked sections
  let apiUrl = `${BASE_URL}/TroutStocked${year}/MapServer/${layerId}/query`

  // Test if the year's layer exists
  const testRes = await fetch(`${apiUrl}?where=1%3D1&returnCountOnly=true&f=json`)
  const testData = await testRes.json()
  if (testData.error || testData.count === 0) {
    // Fall back to previous year
    apiUrl = `${BASE_URL}/TroutStocked${year - 1}/MapServer/${layerId}/query`
    console.log(`[pa-stocking] No ${year} data, falling back to ${year - 1}`)
  }

  // Fetch all records (paginate at 2000)
  const allFeatures: Array<{ attributes: Record<string, unknown> }> = []
  let offset = 0
  while (true) {
    const res = await fetch(
      `${apiUrl}?where=1%3D1&outFields=WtrName,County,StockingYear,TotalAdultStocked_minusBrood,TotalBrookStocked,TotalBrownStocked,TotalRainbowStocked,TotalGoldenStocked,SpeciesLifestage,Mid_Lat,Mid_Long&returnGeometry=false&resultRecordCount=2000&resultOffset=${offset}&f=json`
    )
    const data = await res.json()
    const features = data.features || []
    allFeatures.push(...features)
    if (features.length < 2000) break
    offset += 2000
  }

  const report: PaScraperReport = {
    total: allFeatures.length, matched: 0, inserted: 0, skipped: 0, errors: 0,
    unmatched: [], fetchedAt: new Date().toISOString(),
  }

  const unmatchedSet = new Set<string>()
  const seen = new Set<string>()

  for (const f of allFeatures) {
    const a = f.attributes
    const wtrName = String(a.WtrName || '').trim()
    if (!wtrName) { report.skipped++; continue }

    const riverId = matchRiver(wtrName)
    if (!riverId) {
      unmatchedSet.add(wtrName)
      report.skipped++
      continue
    }

    const stockYear = Number(a.StockingYear) || year
    const total = Number(a.TotalAdultStocked_minusBrood) || 0
    if (total === 0) { report.skipped++; continue }

    // Build per-species rows
    const species: Array<{ name: string; qty: number }> = []
    const brook = Number(a.TotalBrookStocked) || 0
    const brown = Number(a.TotalBrownStocked) || 0
    const rainbow = Number(a.TotalRainbowStocked) || 0
    const golden = Number(a.TotalGoldenStocked) || 0
    if (brook > 0) species.push({ name: 'Brook Trout', qty: brook })
    if (brown > 0) species.push({ name: 'Brown Trout', qty: brown })
    if (rainbow > 0) species.push({ name: 'Rainbow Trout', qty: rainbow })
    if (golden > 0) species.push({ name: 'Golden Trout', qty: golden })
    if (species.length === 0) species.push({ name: 'Trout', qty: total })

    report.matched++

    for (const sp of species) {
      const sourceId = `pa-${riverId}-${stockYear}-${sp.name}`.toLowerCase().replace(/\s+/g, '-')
      if (seen.has(sourceId)) continue
      seen.add(sourceId)

      const { error } = await supabase
        .from('river_stocking')
        .upsert({
          source_record_id: sourceId,
          river_id: riverId,
          state_key: STATE_KEY,
          stocking_date: `${stockYear}-04-01`,
          is_scheduled: true,
          species: sp.name,
          quantity: sp.qty,
          size_category: 'catchable',
          location_description: `${String(a.County || '')} Co.`,
          stocking_authority: STOCKING_AUTHORITY,
          source_url: 'https://fbweb.pa.gov/TroutStocking',
          verified: true,
        }, { onConflict: 'stocking_authority,source_record_id' })

      if (error) {
        report.errors++
        if (report.errors <= 3) console.error('[pa-stocking] insert error:', error.message)
      } else {
        report.inserted++
      }
    }
  }

  report.unmatched = [...unmatchedSet].slice(0, 30)
  return report
}
