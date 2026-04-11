import { NextRequest, NextResponse } from 'next/server'

// GET /api/access-points/list?riverId=...
//
// Same payload shape as fetchRiverPageData() builds for SSR. Used
// by the RiverTabs component to refresh the access points block
// after a submit / confirm / report-change so the user sees their
// action take effect without a full page reload.

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const riverId = req.nextUrl.searchParams.get('riverId')
  if (!riverId) {
    return NextResponse.json({ error: 'riverId required' }, { status: 400 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }
  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

  try {
    const { data: rows, error } = await supabase
      .from('river_access_points')
      .select('*')
      .eq('river_id', riverId)
      .neq('verification_status', 'rejected')
      .order('river_mile', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: true })
      .limit(50)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    const apRows = (rows ?? []) as Array<Record<string, unknown>>
    if (apRows.length === 0) {
      return NextResponse.json({ accessPoints: [] })
    }

    // Batch confirmation counts.
    const ids = apRows.map(r => r.id as string)
    const { data: confRows } = await supabase
      .from('river_access_point_confirmations')
      .select('access_point_id')
      .in('access_point_id', ids)
    const countByAp: Record<string, number> = {}
    for (const c of (confRows ?? []) as Array<{ access_point_id: string }>) {
      countByAp[c.access_point_id] = (countByAp[c.access_point_id] ?? 0) + 1
    }

    const accessPoints = apRows.map(r => ({
      ...r,
      lat: r.lat != null ? Number(r.lat) : null,
      lng: r.lng != null ? Number(r.lng) : null,
      river_mile: r.river_mile != null ? Number(r.river_mile) : null,
      distance_to_next_access_miles: r.distance_to_next_access_miles != null
        ? Number(r.distance_to_next_access_miles) : null,
      facilities: ((r.facilities as string[] | null) ?? []),
      confirmation_count: countByAp[r.id as string] ?? 0,
    }))

    return NextResponse.json({ accessPoints })
  } catch (err) {
    console.error('[access-points/list] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
