// Virginia DWR stocked trout streams — reference data from ArcGIS.
// This isn't event-level data (no "fish stocked on date X") but tells
// us which streams are in the stocking program, their schedule
// category (A=8x/yr, B=5x, C=3x), and which species.
//
// We insert one row per (river, species) with is_scheduled=true.
// The stocking_date is set to Oct 1 of the current season (VA stocks
// Oct–May). Quantity is estimated from the schedule category.

import { createClient } from '@supabase/supabase-js'
import { ALL_RIVERS } from '@/data/rivers'

const API = 'https://services.dwr.virginia.gov/arcgis/rest/services/Projects/TroutApp/FeatureServer/1/query'
const STOCKING_AUTHORITY = 'Virginia DWR'
const STATE_KEY = 'va'

const WATERBODY_TO_RIVER: Record<string, string> = {
  'Jackson River': 'jackson_va',
  'South Fork Shenandoah River': 'south_fork_shenandoah_va',
  'Rapidan River': 'rapidan',
  'Rappahannock River': 'rappahannock',
  'James River': 'james',
  'New River': 'new_river',
  'Clinch River': 'clinch_va',
  'North Fork Shenandoah River': 'north_fork_shenandoah',
  'Smith River': 'smith_va',
  'Staunton River': 'staunton',
}

const vaRivers = ALL_RIVERS.filter(r => r.stateKey === 'va')

function normalize(name: string): string {
  return name.toLowerCase()
    .replace(/\b(creek|river|brook|run|branch|fork)\b/gi, '')
    .replace(/\b(east|west|north|south|upper|lower)\b/gi, '')
    .trim().replace(/\s+/g, ' ')
}

function matchRiver(wb: string): string | null {
  const clean = wb.trim()
  if (WATERBODY_TO_RIVER[clean]) return WATERBODY_TO_RIVER[clean]
  const norm = normalize(clean)
  for (const r of vaRivers) {
    const normR = normalize(r.n)
    if (norm === normR || normR.includes(norm) || norm.includes(normR)) return r.id
  }
  return null
}

// Schedule category → estimated stockings per season
const SCHED_QTY: Record<string, number> = { A: 8, B: 5, C: 3 }

export interface VaScraperReport {
  total: number; matched: number; inserted: number; skipped: number; errors: number
  unmatched: string[]; fetchedAt: string
}

export async function runVaStockingScraper(): Promise<VaScraperReport> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase not configured')
  const supabase = createClient(url, key, { auth: { persistSession: false } })

  const res = await fetch(
    `${API}?where=1%3D1&outFields=Waterbody,County,StockSched,RainbowTrout,BrownTrout,BrookTrout&returnGeometry=false&resultRecordCount=2000&f=json`
  )
  const data = await res.json()
  const features = data.features || []

  const report: VaScraperReport = {
    total: features.length, matched: 0, inserted: 0, skipped: 0, errors: 0,
    unmatched: [], fetchedAt: new Date().toISOString(),
  }
  const unmatchedSet = new Set<string>()
  const year = new Date().getFullYear()

  for (const f of features) {
    const a = f.attributes
    const wb = String(a.Waterbody || '').trim()
    if (!wb) { report.skipped++; continue }

    const riverId = matchRiver(wb)
    if (!riverId) { unmatchedSet.add(wb); report.skipped++; continue }
    report.matched++

    const sched = String(a.StockSched || 'C')
    const timesPerYear = SCHED_QTY[sched] ?? 3
    const species: string[] = []
    if (a.RainbowTrout === 'Yes' || a.RainbowTrout === 1) species.push('Rainbow Trout')
    if (a.BrownTrout === 'Yes' || a.BrownTrout === 1) species.push('Brown Trout')
    if (a.BrookTrout === 'Yes' || a.BrookTrout === 1) species.push('Brook Trout')
    if (species.length === 0) species.push('Trout')

    for (const sp of species) {
      const sourceId = `va-${riverId}-${year}-${sp}`.toLowerCase().replace(/\s+/g, '-')
      const { error } = await supabase
        .from('river_stocking')
        .upsert({
          source_record_id: sourceId,
          river_id: riverId,
          state_key: STATE_KEY,
          stocking_date: `${year}-10-01`,
          is_scheduled: true,
          species: sp,
          quantity: timesPerYear,
          size_category: 'catchable',
          location_description: `${String(a.County || '')} — Schedule ${sched} (${timesPerYear}x/yr)`,
          stocking_authority: STOCKING_AUTHORITY,
          source_url: 'https://dwr.virginia.gov/fishing/trout-stocking-schedule/',
          verified: true,
        }, { onConflict: 'stocking_authority,source_record_id' })

      if (error) { report.errors++ } else { report.inserted++ }
    }
  }

  report.unmatched = [...unmatchedSet].slice(0, 30)
  return report
}
