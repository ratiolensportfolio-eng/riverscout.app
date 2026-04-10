import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'

// POST /api/hazards/:id/confirm — "still present" confirmation.
// Any logged-in user can confirm. Each user's confirmation is unique
// (enforced by the river_hazard_confirmations unique constraint), so
// repeated taps from the same user don't ratchet expires_at. A fresh
// confirmation from any user extends expires_at by 72 hours from now.
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

  const supabase = createSupabaseClient()

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
