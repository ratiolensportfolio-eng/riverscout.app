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

    const supabase = createSupabaseClient()

    const { data, error } = await supabase
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
      .select()

    if (error) {
      console.error('Hatch alert insert error:', error)
      return NextResponse.json({ error: 'Failed to create alert' }, { status: 500 })
    }

    return NextResponse.json({ ok: true, alert: data?.[0] })
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
