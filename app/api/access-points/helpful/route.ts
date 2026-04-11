import { NextRequest, NextResponse } from 'next/server'

// POST /api/access-points/helpful
// Body: { id }
//
// Bumps helpful_count by 1. No login required — same Q&A pattern.
// Routes through bump_access_point_helpful() (SECURITY DEFINER) so
// anon users can call it without us opening a blanket UPDATE
// policy on the parent row.

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const id: string | undefined = body.id
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

    const { error } = await supabase.rpc('bump_access_point_helpful', { target_id: id })
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[access-points/helpful] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
