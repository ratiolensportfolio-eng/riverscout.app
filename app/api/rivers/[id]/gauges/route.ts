import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { fetchGaugeData, fetchUsgsLongTermMean } from '@/lib/usgs'

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
  avg_flow_cfs: number | null
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
    .select('id, gauge_id, gauge_name, gauge_source, river_section, river_mile, is_primary, lat, lng, notes, avg_flow_cfs')
    .eq('river_id', id)
    .order('is_primary', { ascending: false })
    .order('river_mile', { ascending: true, nullsFirst: false })

  if (error || !data?.length) {
    return NextResponse.json({ gauges: [] })
  }
  const rows = data as GaugeRow[]

  // Lazy-populate avg_flow_cfs from USGS stats for any gauge that
  // doesn't have it cached yet. Only USGS gauges (digit-only IDs)
  // have a stats endpoint — WSC doesn't expose one in the same
  // shape, so we leave WSC avg_flow_cfs null for now.
  const needAvg = rows.filter(g => g.avg_flow_cfs == null && g.gauge_source === 'usgs' && g.gauge_id)
  if (needAvg.length) {
    const fetched = await Promise.allSettled(
      needAvg.map(g => fetchUsgsLongTermMean(g.gauge_id))
    )
    const updates: Array<{ gauge_id: string; avg: number }> = []
    fetched.forEach((res, i) => {
      const avg = res.status === 'fulfilled' ? res.value : null
      if (avg != null) {
        needAvg[i].avg_flow_cfs = avg
        updates.push({ gauge_id: needAvg[i].gauge_id, avg })
      }
    })
    // Persist back so the next caller doesn't re-fetch.
    if (updates.length) {
      await Promise.allSettled(
        updates.map(u =>
          supabase
            .from('river_gauges')
            .update({ avg_flow_cfs: u.avg, avg_flow_fetched_at: new Date().toISOString() })
            .eq('river_id', id)
            .eq('gauge_id', u.gauge_id),
        ),
      )
    }
  }

  // Fetch live cfs for each. fetchGaugeData internally routes to USGS
  // or WSC by gauge ID format; we don't have an opt range per gauge so
  // we pass an empty string — the caller only needs `cfs`, not the
  // condition classification. (Condition is computed against the
  // river's main opt range on the page.)
  const flows = await Promise.allSettled(
    rows.map(g => fetchGaugeData(g.gauge_id, ''))
  )
  const out = rows.map((g, i) => ({
    ...g,
    current_cfs: flows[i].status === 'fulfilled' ? flows[i].value.cfs : null,
    fetched_at: flows[i].status === 'fulfilled' ? flows[i].value.fetchedAt : null,
  }))

  const res = NextResponse.json({ gauges: out })
  res.headers.set('Cache-Control', 's-maxage=300, stale-while-revalidate=900')
  return res
}
