// New York DEC fish stocking scraper via the SODA API on data.ny.gov.
// Dataset: Current Season Spring Trout Stocking (d9y2-n436)
// Fields: year, dec_region, county, town, waterbody, date (month name),
//         number, species_name, size_inches
//
// Cron: runs weekly via /api/cron/stocking-multi. The dataset updates
// as NY DEC stocks throughout the spring season (Feb–June).

import { createClient } from '@supabase/supabase-js'
import { ALL_RIVERS } from '@/data/rivers'

const SODA_URL = 'https://data.ny.gov/resource/d9y2-n436.json'
const STOCKING_AUTHORITY = 'New York DEC'
const STATE_KEY = 'ny'

// Hand-curated waterbody → river_id map. The NY dataset uses
// "waterbody" names like "Esopus Creek" which may not exactly
// match our river catalog's names or IDs.
const WATERBODY_TO_RIVER: Record<string, string> = {
  'Esopus Creek': 'esopus',
  'Beaverkill': 'beaverkill',
  'Raquette River': 'raquette',
  'West Branch Ausable River': 'west_branch_ausable_ny',
  'East Branch Delaware River': 'east_branch_delaware',
  'West Branch Delaware River': 'west_branch_delaware',
  'Delaware River': 'delaware',
  'Genesee River': 'genesee',
  'Salmon River': 'salmon_ny',
  'Black River': 'black_ny',
  'Cattaraugus Creek': 'cattaraugus',
  'Willowemoc Creek': 'willowemoc',
}

// Build fuzzy fallback from our NY rivers
const nyRivers = ALL_RIVERS.filter(r => r.stateKey === 'ny')
function normalize(name: string): string {
  return name.toLowerCase()
    .replace(/\b(creek|river|brook|kill|branch)\b/gi, '')
    .replace(/\b(east|west|north|south|upper|lower)\b/gi, '')
    .trim().replace(/\s+/g, ' ')
}

function matchRiver(waterbody: string): string | null {
  // 1. Exact map
  if (WATERBODY_TO_RIVER[waterbody]) return WATERBODY_TO_RIVER[waterbody]
  // 2. Fuzzy: normalize both sides and compare tokens
  const normWb = normalize(waterbody)
  for (const r of nyRivers) {
    const normR = normalize(r.n)
    if (normWb === normR || normR.includes(normWb) || normWb.includes(normR)) {
      return r.id
    }
  }
  return null
}

// Month name → approximate date (mid-month). NY data only has month
// granularity, not specific dates.
function monthToDate(monthName: string, year: string): string {
  const months: Record<string, string> = {
    january: '01', february: '02', march: '03', april: '04',
    may: '05', june: '06', july: '07', august: '08',
    september: '09', october: '10', november: '11', december: '12',
  }
  const mm = months[monthName.toLowerCase()] ?? '01'
  return `${year}-${mm}-15`
}

function parseSizeCategory(sizeStr: string): string {
  if (!sizeStr) return 'catchable'
  const lower = sizeStr.toLowerCase()
  if (lower.includes('fry') || lower.includes('1 ')) return 'fingerling'
  if (lower.includes('fingerling') || /[2-5]\s*inch/i.test(lower)) return 'fingerling'
  if (lower.includes('yearling') || /[6-8]\s*inch/i.test(lower)) return 'sub-catchable'
  if (/1[2-9]\s*inch|1[0-5]/i.test(lower)) return 'catchable'
  if (/trophy|20/i.test(lower)) return 'trophy'
  return 'catchable'
}

export interface NyScraperReport {
  total: number
  matched: number
  inserted: number
  skipped: number
  errors: number
  unmatched: string[]
  fetchedAt: string
}

export async function runNyStockingScraper(): Promise<NyScraperReport> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase not configured')
  const supabase = createClient(url, key, { auth: { persistSession: false } })

  // Fetch all 2026 records
  const res = await fetch(`${SODA_URL}?$where=year='2026'&$limit=5000`)
  if (!res.ok) throw new Error(`NY SODA API error: ${res.status}`)
  const records = await res.json() as Array<{
    year: string; county: string; waterbody: string; town: string
    date: string; number: string; species_name: string; size_inches: string
  }>

  const report: NyScraperReport = {
    total: records.length, matched: 0, inserted: 0, skipped: 0, errors: 0,
    unmatched: [], fetchedAt: new Date().toISOString(),
  }

  const unmatchedSet = new Set<string>()

  for (const rec of records) {
    const riverId = matchRiver(rec.waterbody)
    if (!riverId) {
      unmatchedSet.add(rec.waterbody)
      report.skipped++
      continue
    }
    report.matched++

    const stockingDate = monthToDate(rec.date, rec.year)
    const sourceId = `ny-${rec.waterbody}-${rec.date}-${rec.species_name}-${rec.number}`.toLowerCase().replace(/\s+/g, '-')

    const { error } = await supabase
      .from('river_stocking')
      .upsert({
        source_record_id: sourceId,
        river_id: riverId,
        state_key: STATE_KEY,
        stocking_date: stockingDate,
        is_scheduled: false,
        species: rec.species_name?.trim() || 'Trout',
        quantity: parseInt(rec.number) || 0,
        size_inches: parseFloat(rec.size_inches) || null,
        size_category: parseSizeCategory(rec.size_inches),
        location_description: `${rec.town}, ${rec.county} Co.`,
        stocking_authority: STOCKING_AUTHORITY,
        source_url: 'https://data.ny.gov/resource/d9y2-n436',
        verified: true,
      }, { onConflict: 'stocking_authority,source_record_id' })

    if (error) {
      report.errors++
      if (report.errors <= 3) console.error('[ny-stocking] insert error:', error.message)
    } else {
      report.inserted++
    }
  }

  report.unmatched = [...unmatchedSet].slice(0, 30)
  return report
}
