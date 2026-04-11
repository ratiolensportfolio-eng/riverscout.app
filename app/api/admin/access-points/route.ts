import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin'
import { revalidatePath } from 'next/cache'
import { getRiver, getStateSlug, getRiverSlug } from '@/data/rivers'

// POST /api/admin/access-points
// Body: { userId, userEmail, action, id, patch? }
//   action:
//     'verify'         — set verification_status='verified', verified=true,
//                        stamp last_verified_at
//     'reject'         — set verification_status='rejected'
//     'needs-review'   — flip to needs_review (manual flag)
//     'edit'           — apply patch (object of column overrides)
//     'resolve-report' — mark a change report row resolved
//
// All actions are admin-only via the lib/admin.ts allow-list.
// On verify/edit we revalidate the parent river page so the
// change shows up immediately instead of waiting on ISR.

export const dynamic = 'force-dynamic'

const ALLOWED_ACTIONS = new Set([
  'verify', 'reject', 'needs-review', 'edit', 'resolve-report',
])

// Whitelist of editable columns. Anything not in here is silently
// dropped on edit so a malicious admin client can't slip arbitrary
// SQL columns into the update payload.
const EDITABLE_COLUMNS = new Set([
  'name', 'description', 'access_type', 'ramp_surface',
  'trailer_access', 'max_trailer_length_ft',
  'parking_capacity', 'parking_fee', 'fee_amount', 'facilities',
  'lat', 'lng', 'river_mile',
  'distance_to_next_access_miles', 'next_access_name',
  'float_time_to_next', 'seasonal_notes', 'admin_notes',
])

function revalidateRiverPage(riverId: string): void {
  try {
    const river = getRiver(riverId)
    if (river) {
      revalidatePath(`/rivers/${getStateSlug(river.stateKey)}/${getRiverSlug(river)}`)
    }
  } catch (err) {
    console.error('[admin/access-points] revalidatePath failed:', err)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, userEmail, action, id, patch } = body

    if (!isAdmin(userId, userEmail)) {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 })
    }
    if (!ALLOWED_ACTIONS.has(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'id required' }, { status: 400 })
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !serviceKey) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

    // resolve-report acts on a different table; handle separately.
    if (action === 'resolve-report') {
      const { error } = await supabase
        .from('river_access_point_change_reports')
        .update({ status: 'resolved' })
        .eq('id', id)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ ok: true })
    }

    // For everything else we operate on river_access_points and
    // need the river_id so we can revalidate the right page.
    const { data: existing, error: lookupErr } = await supabase
      .from('river_access_points')
      .select('id, river_id')
      .eq('id', id)
      .maybeSingle()
    if (lookupErr || !existing) {
      return NextResponse.json({ error: 'Access point not found' }, { status: 404 })
    }

    let update: Record<string, unknown> = {}
    if (action === 'verify') {
      update = {
        verification_status: 'verified',
        verified: true,
        last_verified_at: new Date().toISOString(),
        last_verified_by: userEmail || 'admin',
      }
    } else if (action === 'reject') {
      update = { verification_status: 'rejected' }
    } else if (action === 'needs-review') {
      update = { verification_status: 'needs_review' }
    } else if (action === 'edit') {
      if (!patch || typeof patch !== 'object') {
        return NextResponse.json({ error: 'patch required for edit' }, { status: 400 })
      }
      for (const [k, v] of Object.entries(patch)) {
        if (EDITABLE_COLUMNS.has(k)) update[k] = v
      }
      if (Object.keys(update).length === 0) {
        return NextResponse.json({ error: 'No editable fields in patch' }, { status: 400 })
      }
    }

    const { error } = await supabase
      .from('river_access_points')
      .update(update)
      .eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    revalidateRiverPage(existing.river_id)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[admin/access-points] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
