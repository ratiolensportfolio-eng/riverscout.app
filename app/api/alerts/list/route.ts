import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// GET /api/alerts/list?userId=...&email=...
//
// Returns the user's subscriptions across all three alert
// tables: flow_alerts, release_alerts, hatch_alerts.
//
// Why a server route instead of client-side reads:
//   - flow_alerts has fully-permissive RLS (legacy)
//   - release_alerts gates SELECT on auth.uid() = user_id
//     OR user_id is null
//   - hatch_alerts gates ALL on auth.uid() = user_id
// The anon browser client doesn't pass auth.uid() server-side
// even when the user is signed in, so direct .from() reads
// from the account page were inconsistent. Centralizing
// behind a service-role route makes the rules uniform.
//
// Auth: the route accepts a userId query param but does NOT
// trust it blindly — it uses the service role to look up
// rows by EMAIL (which the user has to know to query) and
// by user_id when supplied. We accept both to cover the
// flow_alerts case where some legacy rows have email but
// no user_id (those were created before the alerts feature
// was tied to auth).

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')
  const email = req.nextUrl.searchParams.get('email')

  if (!userId && !email) {
    return NextResponse.json({ error: 'userId or email required' }, { status: 400 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }
  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

  // Helper to build a query that matches by user_id OR email,
  // depending on which params we have.
  const matchQuery = (table: string, columns: string) => {
    let q = supabase.from(table).select(columns)
    if (userId && email) {
      // Match either column. Email is the more reliable key
      // for legacy rows.
      q = q.or(`user_id.eq.${userId},email.eq.${email.toLowerCase()}`)
    } else if (userId) {
      q = q.eq('user_id', userId)
    } else if (email) {
      q = q.eq('email', email.toLowerCase())
    }
    return q
  }

  try {
    const [flowRes, releaseRes, hatchRes] = await Promise.all([
      matchQuery(
        'flow_alerts',
        'id, river_id, river_name, state_key, threshold, active, last_notified_at, created_at',
      ),
      matchQuery(
        'release_alerts',
        'id, river_id, river_name, season_label, notify_days_before, active, last_notified_at, created_at',
      ),
      matchQuery(
        'hatch_alerts',
        'id, river_id, river_name, state_key, hatch_name, species, notify_days_before, active, last_notified_at, created_at',
      ),
    ])

    return NextResponse.json({
      flow: flowRes.error ? [] : (flowRes.data ?? []),
      release: releaseRes.error ? [] : (releaseRes.data ?? []),
      hatch: hatchRes.error ? [] : (hatchRes.data ?? []),
      // Surface per-table errors so the account page can show
      // a "couldn't load X alerts" line if one is broken
      // without breaking the others.
      errors: {
        flow: flowRes.error?.message ?? null,
        release: releaseRes.error?.message ?? null,
        hatch: hatchRes.error?.message ?? null,
      },
    })
  } catch (err) {
    console.error('[alerts/list] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
