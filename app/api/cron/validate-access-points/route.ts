import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { validateRiverAccessPoints } from '@/lib/snap-validator'

// GET /api/cron/validate-access-points?key=CRON_SECRET
//
// Nightly cron that re-runs the NHDPlus snap validation on all
// access points that haven't been validated in the last 24 hours
// (or have never been validated). Catches bad coordinates from
// community submissions and auto-imported data.
//
// Rate-limited by the 200ms delay per point in the validator +
// the maxDuration cap. Processes up to ~500 points per run.

export const dynamic = 'force-dynamic'
export const maxDuration = 60

function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || key !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = client()
  if (!supabase) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })

  // Find access points needing validation:
  // - Never validated (snap_validated_at is null)
  // - OR validated > 7 days ago (re-check periodically)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const { data: stalePoints } = await supabase
    .from('river_access_points')
    .select('river_id')
    .not('lat', 'is', null)
    .not('lng', 'is', null)
    .or(`snap_validated_at.is.null,snap_validated_at.lt.${sevenDaysAgo}`)
    .limit(50)

  if (!stalePoints?.length) {
    return NextResponse.json({ message: 'All access points validated.', checked: 0 })
  }

  // Group by river_id so we batch the NHDPlus queries per river
  const riverIds = [...new Set(stalePoints.map(p => p.river_id))]

  const results: Record<string, { total: number; validated: number; suspect: number; errors: number }> = {}
  let totalSuspect = 0

  for (const riverId of riverIds) {
    try {
      const r = await validateRiverAccessPoints(riverId, supabase)
      results[riverId] = r
      totalSuspect += r.suspect
    } catch (err) {
      console.error(`[validate] Error on ${riverId}:`, err)
      results[riverId] = { total: 0, validated: 0, suspect: 0, errors: 1 }
    }
  }

  return NextResponse.json({
    rivers: riverIds.length,
    totalSuspect,
    results,
  })
}
