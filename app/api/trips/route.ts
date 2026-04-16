import { NextRequest, NextResponse } from 'next/server'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { ALL_RIVERS } from '@/data/rivers'
import { verifyTripReport } from '@/lib/ai-verify'

// /api/trips
//
// GET  ?riverId=... [&limit=20]  → verified trip reports for a river
// POST { userId, riverId, tripDate, reportText, ... }  → submit
//
// Service-role writes (same pattern as /api/journal, /api/suggestions).
// userId comes from the client body as the row scope. The AI verifier
// runs inline (adds ~3-10s); high-confidence scores auto-verify and
// bump the user's leaderboard counters.

export const dynamic = 'force-dynamic'

// +10 contribution score per verified trip. Matches the catch weight
// (+5 per catch) — trips are heavier because they take more effort.
// Counters are cached aggregates; rebuild from the base tables if
// drift is ever suspected (admin script, not auto-scheduled).
const SCORE_PER_TRIP = 10

function client(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}

export async function GET(req: NextRequest) {
  const riverId = req.nextUrl.searchParams.get('riverId')
  const limit = Math.min(100, parseInt(req.nextUrl.searchParams.get('limit') || '20', 10))

  const supabase = client()
  if (!supabase) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })

  let query = supabase
    .from('trip_reports')
    .select('id, user_id, river_id, trip_date, cfs_at_time, water_temp, duration_hours, party_size, watercraft, report_text, conditions_rating, ai_confidence, verified_at, status, created_at')
    .eq('status', 'verified')
    .order('trip_date', { ascending: false })
    .limit(limit)

  if (riverId) query = query.eq('river_id', riverId)

  const { data: reports, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Hydrate with author display name + username in a single round-trip
  // per table. /profile/[username] links need the username; the report
  // card header needs the display_name.
  const userIds = Array.from(new Set((reports ?? []).map(r => r.user_id).filter((x): x is string => !!x)))
  const authorById = new Map<string, { display_name: string; username: string | null }>()
  if (userIds.length) {
    const [{ data: userProfiles }, { data: profiles }] = await Promise.all([
      supabase.from('user_profiles').select('id, display_name').in('id', userIds),
      supabase.from('profiles').select('id, username').in('id', userIds),
    ])
    for (const up of userProfiles ?? []) {
      authorById.set(up.id, { display_name: up.display_name || 'paddler', username: null })
    }
    for (const p of profiles ?? []) {
      const existing = authorById.get(p.id)
      authorById.set(p.id, { display_name: existing?.display_name || 'paddler', username: p.username })
    }
  }

  return NextResponse.json({
    reports: (reports ?? []).map(r => ({
      ...r,
      author: r.user_id ? authorById.get(r.user_id) ?? { display_name: 'paddler', username: null } : null,
    })),
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      userId, riverId, tripDate, reportText,
      cfsAtTime, waterTemp, durationHours, partySize, watercraft, conditionsRating,
    } = body

    if (!userId || !riverId || !tripDate || !reportText) {
      return NextResponse.json({ error: 'userId, riverId, tripDate, reportText required' }, { status: 400 })
    }
    if (typeof reportText !== 'string' || reportText.trim().length < 20) {
      return NextResponse.json({ error: 'reportText must be at least 20 characters' }, { status: 400 })
    }

    const supabase = client()
    if (!supabase) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })

    const river = ALL_RIVERS.find(r => r.id === riverId)
    if (!river) {
      return NextResponse.json({ error: 'Unknown riverId' }, { status: 400 })
    }

    // Inline AI verification. Falls back to 'pending' with a descriptive
    // note when the key is missing or the call fails, so submissions
    // are never blocked by verifier availability.
    const ai = await verifyTripReport({
      riverName: river.n,
      stateKey: river.stateKey,
      reportText,
      tripDate,
      cfsAtTime: cfsAtTime == null || cfsAtTime === '' ? null : Number(cfsAtTime),
      waterTemp: waterTemp == null || waterTemp === '' ? null : Number(waterTemp),
      conditionsRating: conditionsRating == null || conditionsRating === '' ? null : Number(conditionsRating),
    })

    const now = new Date().toISOString()
    const { data: inserted, error } = await supabase
      .from('trip_reports')
      .insert({
        user_id: userId,
        river_id: riverId,
        trip_date: tripDate,
        cfs_at_time: cfsAtTime == null || cfsAtTime === '' ? null : parseInt(cfsAtTime, 10),
        water_temp: waterTemp == null || waterTemp === '' ? null : Number(waterTemp),
        duration_hours: durationHours == null || durationHours === '' ? null : Number(durationHours),
        party_size: partySize == null || partySize === '' ? null : parseInt(partySize, 10),
        watercraft: watercraft || null,
        report_text: reportText.trim(),
        conditions_rating: conditionsRating == null || conditionsRating === '' ? null : parseInt(conditionsRating, 10),
        ai_verified: ai.status === 'verified',
        ai_confidence: ai.score,
        ai_verification_notes: ai.notes,
        verified_at: ai.status === 'verified' ? now : null,
        status: ai.status,
      })
      .select()
      .single()

    if (error) {
      console.error('[TRIPS] insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Only bump counters when the AI auto-verifies. Flagged/rejected
    // don't count; future admin-verified rows will bump on the flip.
    if (ai.status === 'verified') {
      await bumpCounters(supabase, userId)
    }

    return NextResponse.json({ ok: true, report: inserted, verification: ai })
  } catch (err) {
    console.error('[TRIPS] POST error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function bumpCounters(supabase: SupabaseClient, userId: string) {
  // Read-then-write rather than atomic increment — supabase-js doesn't
  // expose UPDATE … SET x = x + 1 without an RPC, and contention is
  // low (one writer per user).
  const { data: row } = await supabase
    .from('user_profiles')
    .select('total_verified_trips, contribution_score')
    .eq('id', userId)
    .maybeSingle()
  if (!row) return
  await supabase
    .from('user_profiles')
    .update({
      total_verified_trips: (row.total_verified_trips ?? 0) + 1,
      contribution_score: (row.contribution_score ?? 0) + SCORE_PER_TRIP,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
}
