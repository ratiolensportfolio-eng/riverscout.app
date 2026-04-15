import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'

// GET /api/hatch-alerts?email=...&riverId=... — get hatch alerts for a user on a river
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email')
  const riverId = req.nextUrl.searchParams.get('riverId')

  if (!email) {
    return NextResponse.json({ alerts: [] })
  }

  const supabase = createSupabaseClient()
  let query = supabase
    .from('hatch_alerts')
    .select('*')
    .eq('email', email)
    .eq('active', true)

  if (riverId) {
    query = query.eq('river_id', riverId)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ alerts: [] })
  }

  return NextResponse.json({ alerts: data || [] })
}

// POST /api/hatch-alerts — subscribe to a hatch alert
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      userId, email, riverId, riverName, stateKey,
      hatchName, species, notifyDaysBefore,
      notifyOnTempTrigger, notifyOnCalendar,
    } = body

    if (!email || !riverId || !hatchName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Service role for the write path. The Pro gate above only
    // needs SELECT on user_profiles which the anon role can do
    // safely; the actual hatch_alerts write hits the same FK
    // bug class as flow_alerts / suggestions / release_alerts.
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !serviceKey) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

    // Hatch alerts are Pro-only
    if (userId) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('is_pro, email')
        .eq('id', userId)
        .single()

      // Allow admins
      const isAdmin = profile?.email && ['paddle.rivers.us@gmail.com'].includes(profile.email.toLowerCase())
      if (!profile?.is_pro && !isAdmin) {
        return NextResponse.json({
          error: 'pro_required',
          message: 'Hatch alerts are a Pro feature. Upgrade for $1.99/month.',
        }, { status: 403 })
      }
    }

    // Plain upsert without .select() — drops the RETURNING
    // SELECT-policy check that bites the anon path.
    const { error } = await supabase
      .from('hatch_alerts')
      .upsert({
        user_id: userId || null,
        email,
        river_id: riverId,
        river_name: riverName || riverId,
        state_key: stateKey || '',
        hatch_name: hatchName,
        species: species || hatchName,
        notify_days_before: notifyDaysBefore ?? 7,
        notify_on_temp_trigger: notifyOnTempTrigger ?? true,
        notify_on_calendar: notifyOnCalendar ?? true,
        active: true,
      }, { onConflict: 'email,river_id,hatch_name' })

    if (error) {
      console.error('[hatch-alerts] insert error:', error)
      return NextResponse.json({ error: `Failed to create alert: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Hatch alert error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/hatch-alerts?id=... — unsubscribe from a hatch alert
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  const email = req.nextUrl.searchParams.get('email')
  const riverId = req.nextUrl.searchParams.get('riverId')
  const hatchName = req.nextUrl.searchParams.get('hatchName')

  const supabase = createSupabaseClient()

  if (id) {
    await supabase.from('hatch_alerts').update({ active: false }).eq('id', id)
  } else if (email && riverId && hatchName) {
    await supabase.from('hatch_alerts').update({ active: false })
      .eq('email', email).eq('river_id', riverId).eq('hatch_name', hatchName)
  }

  return NextResponse.json({ ok: true })
}
