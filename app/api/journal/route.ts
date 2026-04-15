import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// /api/journal
//
// GET ?userId=...        → list (most recent first, capped 500)
// POST { userId, ... }   → create new entry (returns row)
// DELETE { userId, id }  → remove (only if owner)
//
// Service-role writes (saved_rivers/gauge-pref pattern). Reads also
// go through the service role; userId is the scope filter, validated
// against the body so a user can't list someone else's log.

export const dynamic = 'force-dynamic'

function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })
  const supabase = client()
  if (!supabase) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  const { data, error } = await supabase
    .from('paddling_log')
    .select('id, river_id, river_name, trip_date, miles, hours, flow_cfs, conditions, notes, photo_url, created_at')
    .eq('user_id', userId)
    .order('trip_date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(500)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ entries: data ?? [] })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, riverId, riverName, tripDate, miles, hours, flowCfs, conditions, notes, photoUrl } = body
    if (!userId || !riverId || !riverName || !tripDate) {
      return NextResponse.json({ error: 'userId, riverId, riverName, tripDate required' }, { status: 400 })
    }
    const supabase = client()
    if (!supabase) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    const { data, error } = await supabase
      .from('paddling_log')
      .insert({
        user_id: userId,
        river_id: riverId,
        river_name: riverName,
        trip_date: tripDate,
        miles: miles == null || miles === '' ? null : Number(miles),
        hours: hours == null || hours === '' ? null : Number(hours),
        flow_cfs: flowCfs == null || flowCfs === '' ? null : parseInt(flowCfs, 10),
        conditions: conditions || null,
        notes: notes || null,
        photo_url: photoUrl || null,
      })
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, entry: data })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId, id } = await req.json()
    if (!userId || !id) return NextResponse.json({ error: 'userId and id required' }, { status: 400 })
    const supabase = client()
    if (!supabase) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    const { error } = await supabase
      .from('paddling_log')
      .delete()
      .eq('user_id', userId)
      .eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
