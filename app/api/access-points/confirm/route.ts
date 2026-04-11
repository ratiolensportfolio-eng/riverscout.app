import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'

// POST /api/access-points/confirm
// Body: { accessPointId }
//
// Logged-in users mark an access point still accurate. Each
// distinct user counts once toward the auto-verify threshold (3
// confirmations) — enforced by the UNIQUE(access_point_id, user_id)
// constraint on the confirmations table. The auto-verify trigger
// in migration 032 flips the parent to `verified` once the third
// distinct confirmation lands.
//
// Service-role write because the row's RLS policy requires
// auth.uid() = user_id which the anon browser client can't
// reliably forward to PostgREST. We auth-check via the SSR cookie
// session and then write under service role with the verified
// user_id from the session.

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const accessPointId: string | undefined = body.accessPointId
    if (!accessPointId) {
      return NextResponse.json({ error: 'accessPointId required' }, { status: 400 })
    }

    const userClient = await createSupabaseServerClient()
    const { data: { user } } = await userClient.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Sign in required to confirm an access point' }, { status: 401 })
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !serviceKey) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

    const { error } = await supabase
      .from('river_access_point_confirmations')
      .insert({ access_point_id: accessPointId, user_id: user.id })

    if (error) {
      // Unique violation = user already confirmed this point.
      // Treat as success — the action is idempotent from the
      // user's POV.
      if (error.code === '23505') {
        return NextResponse.json({ ok: true, alreadyConfirmed: true })
      }
      console.error('[access-points/confirm] error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[access-points/confirm] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
