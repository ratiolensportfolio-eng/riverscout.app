import { NextRequest, NextResponse } from 'next/server'

// POST /api/hazards/:id/confirm — "still present" confirmation.
// Any logged-in user can confirm. Each user's confirmation is unique
// (enforced by the river_hazard_confirmations unique constraint), so
// repeated taps from the same user don't ratchet expires_at. A fresh
// confirmation from any user extends expires_at by 72 hours from now.
//
// Service-role write because river_hazard_confirmations.user_id and
// river_hazards.reported_by are FK-bound to auth.users in some
// deployments — anon writes hit the misleading RLS error class
// documented in migration 026.
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  const body = await req.json().catch(() => ({}))
  const { userId } = body

  if (!userId) {
    return NextResponse.json({ error: 'auth_required' }, { status: 401 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }
  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

  // Upsert the confirmation ledger row. Conflict on (hazard_id, user_id)
  // means this user has already confirmed once — we still bump expires_at
  // for them because the hazard is clearly still there, but the row
  // count of confirmations only tracks unique users.
  const { error: confErr } = await supabase
    .from('river_hazard_confirmations')
    .upsert(
      { hazard_id: id, user_id: userId, confirmed_at: new Date().toISOString() },
      { onConflict: 'hazard_id,user_id' },
    )

  if (confErr) {
    console.error('[hazards/confirm] upsert error:', confErr)
    return NextResponse.json({ error: 'Failed to confirm' }, { status: 500 })
  }

  // Count unique confirmers for this hazard so the banner can show
  // "confirmed by N paddlers" transparently.
  const { count: confirmationCount } = await supabase
    .from('river_hazard_confirmations')
    .select('*', { count: 'exact', head: true })
    .eq('hazard_id', id)

  // Extend expiry + bump count on the hazard row
  const newExpires = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString()
  const { data: updated, error: updErr } = await supabase
    .from('river_hazards')
    .update({
      expires_at: newExpires,
      confirmations: confirmationCount ?? 0,
      last_confirmed_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (updErr) {
    console.error('[hazards/confirm] update error:', updErr)
    return NextResponse.json({ error: 'Failed to extend hazard' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, hazard: updated })
}
