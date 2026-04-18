import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'
import { fetchCampgroundsNearRiver } from '@/lib/campgrounds'

// GET /api/campgrounds?riverId=pine_mi[&radius=15]
//
// Returns up to 10 campgrounds within `radius` miles of the river's
// representative coordinate. Data comes from the cached campgrounds
// table (seeded from RIDB). No API key needed at request time —
// the RIDB key is only used during the bulk seed script.

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const riverId = req.nextUrl.searchParams.get('riverId')
  if (!riverId) {
    return NextResponse.json({ error: 'riverId required' }, { status: 400 })
  }

  const radius = Math.min(50, parseInt(req.nextUrl.searchParams.get('radius') || '15', 10))
  const supabase = createSupabaseClient()
  const campgrounds = await fetchCampgroundsNearRiver(riverId, supabase, radius)

  return NextResponse.json({ campgrounds })
}
