import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'

// Service-role client factory. Reused by every write path in this
// file because flow_alerts.user_id is FK-bound to auth.users in
// some deployments and the anon role can't satisfy that lookup
// (the misleading "RLS" error class documented in migration 026).
// Same canonical pattern used in /api/releases/subscribe and the
// suggestions submit route.
async function getServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return null
  const { createClient } = await import('@supabase/supabase-js')
  return createClient(url, serviceKey, { auth: { persistSession: false } })
}

// POST /api/alerts — subscribe to flow alerts
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, riverId, riverName, threshold, stateKey, minCfs, maxCfs } = body

    if (!email || !riverId || !riverName) {
      return NextResponse.json({ error: 'email, riverId, riverName required' }, { status: 400 })
    }

    // Either min/max CFS OR a threshold enum is required. New UI
    // submits min/max; legacy callers still pass threshold. When
    // both are sent, min/max wins at evaluation time — stored on
    // the row, threshold stays as a hint.
    const hasRange = minCfs != null || maxCfs != null
    if (!hasRange && !threshold) {
      return NextResponse.json({ error: 'minCfs/maxCfs or threshold required' }, { status: 400 })
    }
    if (threshold && !['optimal', 'high', 'flood', 'any'].includes(threshold)) {
      return NextResponse.json({ error: 'Invalid threshold. Must be optimal, high, flood, or any' }, { status: 400 })
    }

    // Sanity: min <= max when both present; coerce to ints.
    const minCfsInt = minCfs == null || minCfs === '' ? null : parseInt(String(minCfs), 10)
    const maxCfsInt = maxCfs == null || maxCfs === '' ? null : parseInt(String(maxCfs), 10)
    if (minCfsInt != null && maxCfsInt != null && minCfsInt > maxCfsInt) {
      return NextResponse.json({ error: 'minCfs cannot exceed maxCfs' }, { status: 400 })
    }

    const supabase = await getServiceRoleClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }

    // Flow alerts are Pro — matches the hatch_alerts gate. We only
    // enforce when userId is supplied (anonymous submissions via
    // email-only are legacy-friendly no-ops at the cron layer if
    // the user isn't Pro; the UI surfaces the Pro prompt on the 403).
    const { userId } = body
    if (userId) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('is_pro, email')
        .eq('id', userId)
        .single()
      const isAdmin = profile?.email && ['paddle.rivers.us@gmail.com'].includes(profile.email.toLowerCase())
      if (!profile?.is_pro && !isAdmin) {
        return NextResponse.json({
          error: 'pro_required',
          message: 'Flow alerts are a Pro feature. Upgrade for $1.99/month.',
        }, { status: 403 })
      }
    }

    // Upsert — if same email+river already exists, update threshold.
    // Plain upsert without .select() — we don't need the returned
    // row and dropping it sidesteps the RETURNING SELECT-policy
    // check that bites the anon path.
    const { error } = await supabase
      .from('flow_alerts')
      .upsert(
        {
          user_id: userId || null,
          email,
          river_id: riverId,
          river_name: riverName,
          state_key: stateKey || null,
          threshold: threshold || 'any',
          min_cfs: minCfsInt,
          max_cfs: maxCfsInt,
          active: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'email,river_id' }
      )

    if (error) {
      console.error('[alerts] insert error:', error)
      return NextResponse.json({ error: `Failed to create alert: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Alert subscribe error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/alerts?email=... — list alerts for an email
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email')
  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 })
  }

  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('flow_alerts')
    .select('*')
    .eq('email', email)
    .eq('active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Supabase fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 })
  }

  return NextResponse.json({ alerts: data })
}

// DELETE /api/alerts — unsubscribe
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, riverId } = body

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    const supabase = createSupabaseClient()

    if (riverId) {
      // Delete specific alert
      const { error } = await supabase
        .from('flow_alerts')
        .delete()
        .eq('email', email)
        .eq('river_id', riverId)

      if (error) {
        return NextResponse.json({ error: 'Failed to delete alert' }, { status: 500 })
      }
    } else {
      // Delete all alerts for this email
      const { error } = await supabase
        .from('flow_alerts')
        .delete()
        .eq('email', email)

      if (error) {
        return NextResponse.json({ error: 'Failed to delete alerts' }, { status: 500 })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Alert delete error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
