import { NextRequest, NextResponse } from 'next/server'
import { ALL_RIVERS } from '@/data/rivers'
import { hasReleases } from '@/data/dam-releases'

// POST /api/releases/subscribe
//
// Body: { email, riverId, seasonLabel?, notifyDaysBefore?, userId? }
//
// Creates a release_alert subscription. Idempotent on
// (email, river_id, season_label) — re-subscribing with the
// same combo flips the row back to active rather than erroring.
//
// userId is optional — anonymous subscribers can sign up with
// just an email. If userId is supplied, the row links to the
// auth user so /account can list and manage it.

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, riverId, seasonLabel, notifyDaysBefore, userId } = body

    // Input validation. Email is the only mandatory field
    // beyond riverId — we accept anonymous subscriptions
    // because release alerts have low spam value (you'd have
    // to know the exact river_id to even hit this endpoint).
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }
    if (!riverId || typeof riverId !== 'string') {
      return NextResponse.json({ error: 'riverId required' }, { status: 400 })
    }

    // Verify the river exists in our database AND has at least
    // one scheduled release. We don't want to create dead
    // subscriptions for rivers that will never trigger.
    const river = ALL_RIVERS.find(r => r.id === riverId)
    if (!river) {
      return NextResponse.json({ error: 'Unknown riverId' }, { status: 404 })
    }
    if (!hasReleases(riverId)) {
      return NextResponse.json({
        error: 'This river has no scheduled dam releases. Subscribe to a river with active release scheduling.',
      }, { status: 400 })
    }

    // Clamp notifyDaysBefore to the schema range (1-30). Default 3.
    let daysBefore = 3
    if (typeof notifyDaysBefore === 'number') {
      daysBefore = Math.max(1, Math.min(30, Math.round(notifyDaysBefore)))
    }

    // Use the service role for the write path. The route is the
    // gate (we already validated email + riverId + hasReleases),
    // and the alternative — relying on auth.uid() inside the
    // policies — fails because the anon supabase client has no
    // session context server-side. Same pattern as the Michigan
    // DNR stocking route and the publish-listing route.
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !serviceKey) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

    // Check for an existing subscription with the same key.
    // Postgres' UNIQUE constraint would catch this on insert,
    // but we re-activate stale ones rather than erroring out
    // so the user experience is "subscribe button always works".
    const { data: existing, error: existingErr } = await supabase
      .from('release_alerts')
      .select('id, active')
      .eq('email', email.toLowerCase())
      .eq('river_id', riverId)
      .eq('season_label', seasonLabel ?? null)
      .maybeSingle()

    if (existingErr) {
      console.error('[releases/subscribe] lookup error:', existingErr)
      return NextResponse.json({ error: `Subscribe failed: ${existingErr.message}` }, { status: 500 })
    }

    if (existing) {
      if (!existing.active) {
        const { error: reactivateErr } = await supabase
          .from('release_alerts')
          .update({ active: true, notify_days_before: daysBefore })
          .eq('id', existing.id)
        if (reactivateErr) {
          console.error('[releases/subscribe] reactivate error:', reactivateErr)
          return NextResponse.json({ error: 'Failed to reactivate subscription' }, { status: 500 })
        }
      }
      return NextResponse.json({
        ok: true,
        id: existing.id,
        message: existing.active ? 'Already subscribed' : 'Subscription reactivated',
      })
    }

    // New subscription. Plain insert without .select() so we
    // don't trigger PostgREST's implicit RETURNING — that path
    // is what was failing earlier with the "new row violates
    // row-level security policy" error even though the policy
    // is permissive on writes (the RETURNING was triggering a
    // SELECT-policy check too).
    const { error } = await supabase
      .from('release_alerts')
      .insert({
        user_id: userId || null,
        email: email.toLowerCase(),
        river_id: riverId,
        river_name: river.n,
        season_label: seasonLabel || null,
        notify_days_before: daysBefore,
        active: true,
      })

    if (error) {
      console.error('[releases/subscribe] insert error:', error)
      return NextResponse.json({ error: `Subscribe failed: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      message: `You'll get an email ${daysBefore} day${daysBefore === 1 ? '' : 's'} before each release.`,
    })
  } catch (err) {
    console.error('[releases/subscribe] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/releases/subscribe?id=...
// Lets the user (or the unsubscribe link in an email) deactivate
// a subscription without deleting the row — keeps history for
// re-activation later. Same service-role auth pattern as POST.
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'id required' }, { status: 400 })
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }
  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })
  const { error } = await supabase
    .from('release_alerts')
    .update({ active: false })
    .eq('id', id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
