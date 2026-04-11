import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { sendEmail, ADMIN_EMAIL } from '@/lib/email'

// POST /api/access-points/report-change
// Body: { accessPointId, changeType, notes? }
//
// Logged-in users flag a verified access point for re-review (e.g.,
// "ramp damaged"). The trigger in migration 032 flips the parent
// row's verification_status from `verified` to `needs_review` so
// the public render shows an amber dot until admin reviews.

export const dynamic = 'force-dynamic'

const ALLOWED_CHANGE_TYPES = new Set([
  'ramp_damaged', 'parking_reduced', 'access_closed',
  'facilities_changed', 'other',
])

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const accessPointId: string | undefined = body.accessPointId
    const changeType: string | undefined = body.changeType
    const notes: string | undefined = body.notes

    if (!accessPointId) {
      return NextResponse.json({ error: 'accessPointId required' }, { status: 400 })
    }
    if (!changeType || !ALLOWED_CHANGE_TYPES.has(changeType)) {
      return NextResponse.json({ error: 'Invalid changeType' }, { status: 400 })
    }
    if (notes && notes.length > 1000) {
      return NextResponse.json({ error: 'Notes must be 1000 characters or fewer' }, { status: 400 })
    }

    const userClient = await createSupabaseServerClient()
    const { data: { user } } = await userClient.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Sign in required to report a change' }, { status: 401 })
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !serviceKey) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

    const { error } = await supabase
      .from('river_access_point_change_reports')
      .insert({
        access_point_id: accessPointId,
        user_id: user.id,
        change_type: changeType,
        notes: notes || null,
      })

    if (error) {
      console.error('[access-points/report-change] error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Best-effort admin email so the report doesn't sit unnoticed.
    try {
      // Look up the access point + parent river name for the email.
      const { data: ap } = await supabase
        .from('river_access_points')
        .select('name, river_id')
        .eq('id', accessPointId)
        .maybeSingle()

      await sendEmail({
        to: ADMIN_EMAIL,
        subject: `[Access Point Change] ${ap?.name ?? accessPointId} (${ap?.river_id ?? '?'})`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 520px;">
            <h2 style="color: #BA7517; margin: 0 0 12px;">Access point change reported</h2>
            <p><strong>Access point:</strong> ${ap?.name ?? accessPointId}</p>
            <p><strong>River:</strong> ${ap?.river_id ?? 'unknown'}</p>
            <p><strong>Change type:</strong> ${changeType}</p>
            ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
            <p><strong>Reported by:</strong> ${user.email ?? user.id}</p>
            <hr/>
            <p>The access point has been flagged for re-review (amber state).</p>
            <p><a href="https://riverscout.app/admin/access-points">Open admin queue &rarr;</a></p>
          </div>
        `,
      })
    } catch (emailErr) {
      console.error('[access-points/report-change] admin email failed:', emailErr)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[access-points/report-change] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
