import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'
import { sendEmail, hazardAlertEmail } from '@/lib/email'
import { getRiver, getStateSlug, getRiverSlug } from '@/data/rivers'

const VALID_TYPES = ['strainer', 'hydraulic', 'access_closure', 'debris', 'flood', 'other']
const VALID_SEVERITIES = ['info', 'warning', 'critical']

// GET /api/hazards?riverId=pine_mi — list active hazards for a river.
// Public endpoint — no auth required. Expired hazards are filtered out
// here rather than at RLS level so the admin page can still see them.
export async function GET(req: NextRequest) {
  const riverId = req.nextUrl.searchParams.get('riverId')
  if (!riverId) {
    return NextResponse.json({ error: 'riverId required' }, { status: 400 })
  }

  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('river_hazards')
    .select('*')
    .eq('river_id', riverId)
    .eq('active', true)
    .eq('admin_hidden', false)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[hazards] fetch error:', error)
    return NextResponse.json({ hazards: [] })
  }

  // Severity rank — Postgres would alphabetize the text column (critical,
  // info, warning) so we sort in JS to put critical first, warning second.
  const SEVERITY_RANK: Record<string, number> = { critical: 0, warning: 1, info: 2 }
  const sorted = (data ?? [])
    .slice()
    .sort((a, b) => (SEVERITY_RANK[a.severity] ?? 9) - (SEVERITY_RANK[b.severity] ?? 9))

  return NextResponse.json({ hazards: sorted })
}

// POST /api/hazards — create a new hazard report. Requires auth.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      userId,
      userEmail,
      reporterName,
      riverId,
      hazardType,
      severity,
      title,
      description,
      locationDescription,
      mileMarker,
    } = body

    // Auth gate — any logged-in user can post, but we need a userId
    // attributed to the row for RLS insertion to succeed.
    if (!userId) {
      return NextResponse.json({ error: 'auth_required' }, { status: 401 })
    }

    // Field validation
    if (!riverId || !hazardType || !severity || !title || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (!VALID_TYPES.includes(hazardType)) {
      return NextResponse.json({ error: 'Invalid hazard type' }, { status: 400 })
    }
    if (!VALID_SEVERITIES.includes(severity)) {
      return NextResponse.json({ error: 'Invalid severity' }, { status: 400 })
    }
    if (title.length > 140) {
      return NextResponse.json({ error: 'Title too long (max 140 chars)' }, { status: 400 })
    }
    if (description.length > 2000) {
      return NextResponse.json({ error: 'Description too long (max 2000 chars)' }, { status: 400 })
    }

    // Resolve river metadata from the static river database so we can
    // cache river_name/state_key without a second DB round trip.
    const river = getRiver(riverId)
    if (!river) {
      return NextResponse.json({ error: 'Unknown river' }, { status: 404 })
    }

    // Service role for the write path. We need the inserted row's
    // id back so we can stamp email_sent_at on it after the
    // critical-hazard fan-out, which means .select() stays — and
    // anon + .select() hits the RLS-misleading error class
    // documented in migration 026. Service role sidesteps both
    // by bypassing RLS entirely. The route is the gate.
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !serviceKey) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

    const { data: inserted, error } = await supabase
      .from('river_hazards')
      .insert({
        river_id: riverId,
        river_name: river.n,
        state_key: river.stateKey,
        hazard_type: hazardType,
        severity,
        title,
        description,
        location_description: locationDescription || null,
        mile_marker: typeof mileMarker === 'number' ? mileMarker : null,
        reported_by: userId,
        reporter_name: reporterName || null,
        reporter_email: userEmail || null,
      })
      .select()
      .single()

    if (error || !inserted) {
      console.error('[hazards] insert error:', error)
      return NextResponse.json({ error: `Failed to create hazard: ${error?.message ?? 'unknown'}` }, { status: 500 })
    }

    // Critical hazards trigger an email blast to every flow-alert
    // subscriber for this river. This is deliberately NOT gated behind
    // Pro — safety-critical notifications go to everyone who has
    // expressed interest in the river.
    let emailRecipients = 0
    if (severity === 'critical') {
      try {
        const { data: subs } = await supabase
          .from('flow_alerts')
          .select('email')
          .eq('river_id', riverId)
          .eq('active', true)

        const uniqueEmails = Array.from(new Set((subs ?? [])
          .map(s => s.email?.toLowerCase())
          .filter((e): e is string => !!e)))

        if (uniqueEmails.length > 0) {
          const stateSlug = getStateSlug(river.stateKey)
          const riverSlug = getRiverSlug(river)
          const html = hazardAlertEmail(
            river.n,
            stateSlug,
            riverSlug,
            hazardType,
            severity,
            title,
            description,
            locationDescription || null,
            reporterName || null,
          )
          const subject = `\u26A0 Hazard on ${river.n}: ${title}`

          // Fan-out sends. Resend supports batch via multiple `to`
          // addresses, but we want separate deliveries so unsubscribe
          // links per recipient still work; send one at a time.
          for (const email of uniqueEmails) {
            const ok = await sendEmail({ to: email, subject, html })
            if (ok) emailRecipients++
          }

          await supabase
            .from('river_hazards')
            .update({
              email_sent_at: new Date().toISOString(),
              email_recipients_count: emailRecipients,
            })
            .eq('id', inserted.id)
        }
      } catch (e) {
        // Email failure should never block hazard creation — log and
        // return success on the insert. Admins can resend if needed.
        console.error('[hazards] email blast failed:', e)
      }
    }

    return NextResponse.json({
      ok: true,
      hazard: inserted,
      emailRecipients,
    })
  } catch (err) {
    console.error('[hazards] POST error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
