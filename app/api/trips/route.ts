import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'

// GET /api/trips?riverId=... — fetch trip reports for a river
export async function GET(req: NextRequest) {
  const riverId = req.nextUrl.searchParams.get('riverId')
  if (!riverId) {
    return NextResponse.json({ error: 'riverId required' }, { status: 400 })
  }

  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('trip_reports')
    .select('*')
    .eq('river_id', riverId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Fetch trip reports error:', error)
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 })
  }

  return NextResponse.json({ reports: data })
}

// POST /api/trips — submit a new trip report
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { riverId, riverName, authorName, rating, flowCfs, tripDate, text, photos } = body

    if (!riverId || !authorName || !rating || !text) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be 1-5' }, { status: 400 })
    }

    if (text.length > 5000) {
      return NextResponse.json({ error: 'Report text too long (max 5000 chars)' }, { status: 400 })
    }

    // Service role for the write path. Same canonical pattern as
    // every other user-facing write route — sidesteps the
    // misleading RLS error class even on tables that don't
    // currently have an auth.users FK, in case the schema
    // tightens later.
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !serviceKey) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

    const { data, error } = await supabase
      .from('trip_reports')
      .insert({
        river_id: riverId,
        river_name: riverName || riverId,
        author_name: authorName.trim(),
        rating: Math.round(rating),
        flow_cfs: flowCfs ? parseInt(flowCfs) : null,
        trip_date: tripDate || null,
        body: text.trim(),
        photos: photos || [],
      })
      .select()
      .single()

    if (error) {
      console.error('[trips] insert error:', error)
      return NextResponse.json({ error: `Failed to submit report: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({ ok: true, report: data })
  } catch (err) {
    console.error('Trip report submit error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
