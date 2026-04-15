import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'

// POST /api/stocking/alerts — subscribe to stocking alerts (Pro only)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, riverId, stateKey, userId, speciesFilter } = body

    if (!email || !riverId || !stateKey) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Service role: stocking_alerts.user_id is FK-bound to
    // auth.users so the anon write hits the migration-026 error.
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !serviceKey) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

    // Check Pro status — stocking alerts are Pro-only
    let isPro = false
    if (userId) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('is_pro')
        .eq('id', userId)
        .single()
      isPro = profile?.is_pro ?? false
    }

    if (!isPro) {
      return NextResponse.json({
        error: 'pro_required',
        message: 'Stocking alerts are a Pro feature. Upgrade to Pro for $1.99/month.',
      }, { status: 403 })
    }

    // Plain upsert without .select() — we don't echo the row back.
    const { error } = await supabase
      .from('stocking_alerts')
      .upsert(
        {
          email,
          river_id: riverId,
          state_key: stateKey,
          user_id: userId || null,
          species_filter: speciesFilter?.length > 0 ? speciesFilter : null,
          notify_historical: true,
          notify_scheduled: true,
          active: true,
        },
        { onConflict: 'email,river_id' }
      )

    if (error) {
      console.error('[stocking/alerts] insert error:', error)
      return NextResponse.json({ error: `Failed to create alert: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Stocking alert error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/stocking/alerts?email=... — list stocking alerts for an email
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email')
  if (!email) {
    return NextResponse.json({ error: 'email required' }, { status: 400 })
  }

  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('stocking_alerts')
    .select('*')
    .eq('email', email)
    .eq('active', true)

  if (error) {
    return NextResponse.json({ alerts: [] })
  }

  return NextResponse.json({ alerts: data || [] })
}

// DELETE /api/stocking/alerts?id=... — unsubscribe
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'id required' }, { status: 400 })
  }

  const supabase = createSupabaseClient()
  await supabase
    .from('stocking_alerts')
    .update({ active: false })
    .eq('id', id)

  return NextResponse.json({ ok: true })
}
