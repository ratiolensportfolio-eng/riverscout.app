import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { isAdmin } from '@/lib/admin'
import { revalidatePath } from 'next/cache'
import { getRiver, getStateSlug, getRiverSlug } from '@/data/rivers'

// POST /api/access-points/edit
// Body: { id, patch }
//
// In-place edit of an existing access point. Replaces the
// "Report Change → admin reviews → admin edits" cycle for users
// who are either:
//
//   1. The original submitter, while the row is still pending
//      (mirrors the RLS policy in migration 032 — owners can
//      edit their own pending submissions)
//   2. An admin (can edit any row regardless of status)
//
// Service-role write because the table's RLS policies don't
// reliably forward auth.uid() through the anon client. We
// auth-check the cookie session here and gate the write before
// it ever hits the DB.

export const dynamic = 'force-dynamic'

// Whitelist of editable columns. Anything not in here is silently
// dropped so a malicious client can't slip arbitrary SQL columns
// into the patch payload. Mirrors the same list in
// /api/admin/access-points.
const EDITABLE_COLUMNS = new Set([
  'name', 'description', 'access_type', 'ramp_surface',
  'trailer_access', 'max_trailer_length_ft',
  'parking_capacity', 'parking_fee', 'fee_amount', 'facilities',
  'lat', 'lng', 'river_mile',
  'distance_to_next_access_miles', 'next_access_name',
  'float_time_to_next', 'seasonal_notes',
])

// Bust the river page cache so the edit shows up on next request
// instead of waiting for the 15-minute ISR window.
function revalidateRiverPage(riverId: string): void {
  try {
    const river = getRiver(riverId)
    if (river) {
      revalidatePath(`/rivers/${getStateSlug(river.stateKey)}/${getRiverSlug(river)}`)
    }
  } catch (err) {
    console.error('[access-points/edit] revalidatePath failed:', err)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const id: string | undefined = body.id
    const patch = body.patch as Record<string, unknown> | undefined

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'id required' }, { status: 400 })
    }
    if (!patch || typeof patch !== 'object') {
      return NextResponse.json({ error: 'patch required' }, { status: 400 })
    }

    // Auth check via cookie session.
    const userClient = await createSupabaseServerClient()
    const { data: { user } } = await userClient.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Sign in required to edit an access point' }, { status: 401 })
    }
    const userIsAdmin = isAdmin(user.id, user.email ?? null)

    // Service-role read of the existing row so we can authorize.
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !serviceKey) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

    const { data: existing, error: lookupErr } = await supabase
      .from('river_access_points')
      .select('id, river_id, submitted_by, verification_status')
      .eq('id', id)
      .maybeSingle()

    if (lookupErr || !existing) {
      return NextResponse.json({ error: 'Access point not found' }, { status: 404 })
    }

    // Authorization. Admins can edit any row. Submitters can edit
    // their own row only while it's still pending — verified rows
    // are locked, mirroring the RLS policy.
    const isOwner = existing.submitted_by === user.id
    const ownerCanEdit = isOwner && existing.verification_status === 'pending'
    if (!userIsAdmin && !ownerCanEdit) {
      if (isOwner) {
        return NextResponse.json({
          error: 'This access point is verified and locked. Use Report Change to suggest a fix.',
        }, { status: 403 })
      }
      return NextResponse.json({ error: 'You do not have permission to edit this access point' }, { status: 403 })
    }

    // Filter the patch to allow-listed columns.
    const safe: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(patch)) {
      if (EDITABLE_COLUMNS.has(k)) safe[k] = v
    }
    if (Object.keys(safe).length === 0) {
      return NextResponse.json({ error: 'No editable fields in patch' }, { status: 400 })
    }

    const { error: updateErr } = await supabase
      .from('river_access_points')
      .update(safe)
      .eq('id', id)

    if (updateErr) {
      console.error('[access-points/edit] update error:', updateErr)
      return NextResponse.json({ error: `Failed to update: ${updateErr.message}` }, { status: 500 })
    }

    revalidateRiverPage(existing.river_id)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[access-points/edit] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
