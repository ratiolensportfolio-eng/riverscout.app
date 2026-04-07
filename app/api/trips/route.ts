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

    const supabase = createSupabaseClient()

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

    if (error) {
      console.error('Insert trip report error:', error)
      return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 })
    }

    return NextResponse.json({ ok: true, report: data?.[0] })
  } catch (err) {
    console.error('Trip report submit error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
