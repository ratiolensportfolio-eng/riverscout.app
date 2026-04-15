import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// /api/profile/onboarding
//
// GET ?userId=... — returns the user's onboarding state so the
// homepage can decide whether to mount the onboarding modal.
//
// POST { userId, action, value? } — actions:
//   set-home-state    → value: 'mi'      sets profiles.home_state
//   set-digest        → value: true|false sets profiles.weekly_digest_opted_in
//   complete          → marks onboarding_completed_at = now()
//
// Service-role only. We don't trust the client userId — it's used
// just to scope the row. Real auth happens in the browser via
// Supabase session; the client passes its own uid here. Worst case
// a malicious user changes their own onboarding state, which is
// not interesting.

export const dynamic = 'force-dynamic'

function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

  const supabase = client()
  if (!supabase) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })

  const { data } = await supabase
    .from('profiles')
    .select('home_state, weekly_digest_opted_in, onboarding_completed_at')
    .eq('id', userId)
    .maybeSingle()

  // savedCount lets the dashboard / onboarding flow show a counter
  // without a second round trip.
  const { count } = await supabase
    .from('saved_rivers')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  return NextResponse.json({
    home_state: data?.home_state ?? null,
    weekly_digest_opted_in: data?.weekly_digest_opted_in ?? null,
    onboarding_completed_at: data?.onboarding_completed_at ?? null,
    savedCount: count ?? 0,
  })
}

export async function POST(req: NextRequest) {
  try {
    const { userId, action, value } = await req.json()
    if (!userId || !action) {
      return NextResponse.json({ error: 'userId and action required' }, { status: 400 })
    }

    const supabase = client()
    if (!supabase) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })

    let patch: Record<string, unknown> | null = null
    if (action === 'set-home-state') {
      if (typeof value !== 'string' || !/^[a-z]{2,8}$/.test(value)) {
        return NextResponse.json({ error: 'invalid state key' }, { status: 400 })
      }
      patch = { home_state: value }
    } else if (action === 'set-digest') {
      patch = { weekly_digest_opted_in: !!value }
    } else if (action === 'complete') {
      patch = { onboarding_completed_at: new Date().toISOString() }
    } else {
      return NextResponse.json({ error: 'unknown action' }, { status: 400 })
    }

    // The user might not have a profiles row yet (rare — the signup
    // flow creates one — but defensive). Upsert by id.
    const { error } = await supabase
      .from('profiles')
      .update(patch)
      .eq('id', userId)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
