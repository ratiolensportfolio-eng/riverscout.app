import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// /api/profile/gauge-preference
//
// POST { userId, riverId, gaugeId }  → upserts the user's gauge
// preference for that river. Called from GaugeSwitcher whenever an
// authed user picks a non-primary gauge.
//
// DELETE { userId, riverId } → clears the preference (revert to
// river's primary). Currently no UI surface for this — wire from
// the dashboard later if needed.

export const dynamic = 'force-dynamic'

function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}

export async function POST(req: NextRequest) {
  try {
    const { userId, riverId, gaugeId } = await req.json()
    if (!userId || !riverId || !gaugeId) {
      return NextResponse.json({ error: 'userId, riverId, gaugeId required' }, { status: 400 })
    }
    const supabase = client()
    if (!supabase) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })

    const { error } = await supabase
      .from('user_gauge_preferences')
      .upsert(
        { user_id: userId, river_id: riverId, gauge_id: gaugeId, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,river_id' },
      )
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId, riverId } = await req.json()
    if (!userId || !riverId) return NextResponse.json({ error: 'userId, riverId required' }, { status: 400 })
    const supabase = client()
    if (!supabase) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    const { error } = await supabase
      .from('user_gauge_preferences')
      .delete()
      .eq('user_id', userId)
      .eq('river_id', riverId)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
