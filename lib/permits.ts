// River permit data fetchers.
//
// Two access patterns:
//   1. fetchRiverPermit(riverId) — single full row for the river page
//   2. fetchPermittedRiverIds() — Set<string> of every river_id that has
//      a permit row, used by state pages and search results to render
//      the small "PERMIT" badge without needing the full row data
//
// Both fail soft: if Supabase is unreachable they return null / empty
// Set so the page still renders. Permit data is reference content, not
// safety-critical, so silent fallback is acceptable.

import { createSupabaseServerClient } from '@/lib/supabase-server'
import type { RiverPermit } from '@/types'

export async function fetchRiverPermit(riverId: string): Promise<RiverPermit | null> {
  let supabase
  try {
    supabase = await createSupabaseServerClient()
  } catch {
    return null
  }

  const { data, error } = await supabase
    .from('river_permits')
    .select('*')
    .eq('river_id', riverId)
    .maybeSingle()

  if (error || !data) return null
  return data as RiverPermit
}

// Cached at the route level via the calling page's `revalidate` setting.
// State pages and the search route already revalidate every 15 min via
// USGS data, so the permit ID set effectively refreshes on the same
// schedule without us needing per-route caching here.
export async function fetchPermittedRiverIds(): Promise<Set<string>> {
  let supabase
  try {
    supabase = await createSupabaseServerClient()
  } catch {
    return new Set()
  }

  const { data, error } = await supabase
    .from('river_permits')
    .select('river_id')

  if (error || !data) return new Set()
  return new Set(data.map(r => r.river_id))
}
