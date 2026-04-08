import { createSupabaseClient } from '@/lib/supabase'
import type { River, State, StatesDB, HistEra, RiverDoc, Review, Outfitter } from '@/types'

// Fetches river data from Supabase with caching
// Falls back to static data if DB is empty/unavailable

const supabase = createSupabaseClient()

// Cache to avoid re-fetching on every render
let statesCache: StatesDB | null = null
let allRiversCache: (River & { stateKey: string; stateName: string })[] | null = null
let lastFetch = 0
const CACHE_TTL = 60 * 1000 // 1 minute cache

function isCacheValid() {
  return statesCache && (Date.now() - lastFetch) < CACHE_TTL
}

// Fetch all states and rivers from Supabase
export async function fetchStatesFromDB(): Promise<StatesDB | null> {
  if (isCacheValid()) return statesCache

  try {
    // Fetch states
    const { data: states, error: statesErr } = await supabase
      .from('states')
      .select('*')
      .order('key')

    if (statesErr || !states || states.length === 0) return null

    // Fetch all rivers
    const { data: rivers, error: riversErr } = await supabase
      .from('rivers')
      .select('*')
      .order('state_key, name')

    if (riversErr || !rivers) return null

    // Fetch history for all rivers
    const { data: history } = await supabase
      .from('river_history')
      .select('*')
      .order('river_id, sort_order')

    // Fetch documents
    const { data: docs } = await supabase
      .from('river_documents')
      .select('*')

    // Fetch seed reviews
    const { data: reviews } = await supabase
      .from('river_reviews')
      .select('*')
      .eq('is_seed', true)

    // Fetch seed outfitters
    const { data: outfitters } = await supabase
      .from('river_outfitters')
      .select('*')
      .eq('is_seed', true)

    // Build the STATES structure
    const result: StatesDB = {}

    for (const state of states) {
      const stateRivers = rivers.filter(r => r.state_key === state.key)

      result[state.key] = {
        name: state.name,
        abbr: state.abbr,
        label: state.label,
        filters: state.filters || [],
        fL: state.filter_labels || {},
        rivers: stateRivers.map(r => {
          // Build history eras
          const riverHistory = (history || []).filter(h => h.river_id === r.id)
          const eras: HistEra[] = []
          const eraMap = new Map<string, { yr: string; title: string; text: string; src: string }[]>()
          for (const h of riverHistory) {
            if (!eraMap.has(h.era)) eraMap.set(h.era, [])
            eraMap.get(h.era)!.push({ yr: h.year, title: h.title, text: h.body, src: h.source })
          }
          for (const [era, entries] of eraMap) {
            eras.push({ era: era as HistEra['era'], entries })
          }

          // Build docs
          const riverDocs: RiverDoc[] = (docs || [])
            .filter(d => d.river_id === r.id)
            .map(d => ({ t: d.title, s: d.source, y: d.year, tp: d.doc_type, pg: d.pages, url: d.url || undefined }))

          // Build reviews
          const riverRevs: Review[] = (reviews || [])
            .filter(rv => rv.river_id === r.id)
            .map(rv => ({ u: rv.username, d: rv.review_date, s: rv.stars, t: rv.body }))

          // Build outfitters
          const riverOuts: Outfitter[] = (outfitters || [])
            .filter(o => o.river_id === r.id)
            .map(o => ({ n: o.name, d: o.description, l: o.link || '' }))

          // Parse filter flags
          const flags = r.filter_flags || {}

          return {
            id: r.id,
            n: r.name,
            co: r.county,
            len: r.length,
            cls: r.class,
            opt: r.optimal_cfs,
            g: r.usgs_gauge,
            avg: r.avg_cfs,
            histFlow: r.hist_flow,
            mx: r.map_x,
            my: r.map_y,
            abbr: state.abbr,
            desc: r.description,
            desig: r.designations,
            secs: r.sections || [],
            history: eras,
            docs: riverDocs,
            revs: riverRevs,
            outs: riverOuts,
            ...flags,
          } as River
        }),
      }
    }

    statesCache = result
    lastFetch = Date.now()
    return result

  } catch (err) {
    console.error('[rivers-db] Failed to fetch from Supabase:', err)
    return null
  }
}

// Get all rivers as flat array (like ALL_RIVERS)
export async function fetchAllRiversFromDB() {
  const states = await fetchStatesFromDB()
  if (!states) return null

  return Object.entries(states).flatMap(([stateKey, state]) =>
    state.rivers.map(r => ({ ...r, stateKey, stateName: state.name }))
  )
}

// Invalidate cache (call after DB updates)
export function invalidateRiverCache() {
  statesCache = null
  allRiversCache = null
  lastFetch = 0
}
