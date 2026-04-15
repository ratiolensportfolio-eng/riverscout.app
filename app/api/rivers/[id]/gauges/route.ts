import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { fetchGaugeData } from '@/lib/usgs'

// GET /api/rivers/[id]/gauges
//
// Returns every gauge attached to the given river, each enriched
// with its current cfs. Used by the GaugeSwitcher popover on the
// river page hero — without live cfs the user can't tell which
// gauge to pick.
//
// Cached for 5 min so a popover open doesn't re-fetch USGS every
// render. The river page itself uses ISR on a 15-min revalidate;
// keeping this 5 min means the popover can be more current than
// the page's own gauge.

export const dynamic = 'force-dynamic'

interface GaugeRow {
  id: string
  gauge_id: string
  gauge_name: string
  gauge_source: 'usgs' | 'wsc' | 'manual'
  river_section: string | null
  river_mile: number | null
  is_primary: boolean
  lat: number | null
  lng: number | null
  notes: string | null
}

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    return NextResponse.json({ gauges: [] })
  }
  const supabase = createClient(url, key, { auth: { persistSession: false } })

  const { data, error } = await supabase
    .from('river_gauges')
    .select('id, gauge_id, gauge_name, gauge_source, river_section, river_mile, is_primary, lat, lng, notes')
    .eq('river_id', id)
    .order('is_primary', { ascending: false })
    .order('river_mile', { ascending: true, nullsFirst: false })

  if (error || !data?.length) {
    return NextResponse.json({ gauges: [] })
  }

  // Fetch live cfs for each. fetchGaugeData internally routes to USGS
  // or WSC by gauge ID format; we don't have an opt range per gauge so
  // we pass an empty string — the caller only needs `cfs`, not the
  // condition classification. (Condition is computed against the
  // river's main opt range on the page.)
  const flows = await Promise.allSettled(
    data.map(g => fetchGaugeData(g.gauge_id, ''))
  )
  const out = (data as GaugeRow[]).map((g, i) => ({
    ...g,
    current_cfs: flows[i].status === 'fulfilled' ? flows[i].value.cfs : null,
    fetched_at: flows[i].status === 'fulfilled' ? flows[i].value.fetchedAt : null,
  }))

  const res = NextResponse.json({ gauges: out })
  res.headers.set('Cache-Control', 's-maxage=300, stale-while-revalidate=900')
  return res
}
