import { NextRequest, NextResponse } from 'next/server'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { ALL_RIVERS } from '@/data/rivers'
import { verifyCatchPhoto, checkRiverProximity, classifyCatch } from '@/lib/ai-verify'
import { SPECIES_MAX_PLAUSIBLE_LBS } from '@/types'

// /api/catches
//
// GET  ?species=...  → verified catches for a species, sorted by weight desc
// GET  ?riverId=...  → verified catches for a river (any species)
// POST { userId, riverId, species, catchDate, photoUrl, ... }  → submit
//
// Service-role writes. The POST runs three verification signals inline:
//   1. Proximity — photo EXIF GPS within 10 mi of the river's coord
//   2. AI species + weight check via Claude vision
//   3. Species-specific plausibility ceiling
// A row reaches status='verified' only when 1 AND 2 pass. Ceiling
// violation → 'rejected'. Any other failure → 'flagged' for manual
// review. See classifyCatch() in lib/ai-verify.ts.

export const dynamic = 'force-dynamic'

const SCORE_PER_CATCH = 5

function client(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}

export async function GET(req: NextRequest) {
  const species = req.nextUrl.searchParams.get('species')
  const riverId = req.nextUrl.searchParams.get('riverId')
  const limit = Math.min(100, parseInt(req.nextUrl.searchParams.get('limit') || '10', 10))

  const supabase = client()
  if (!supabase) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })

  let query = supabase
    .from('fish_catches')
    .select('id, user_id, river_id, catch_date, species, weight_lbs, length_inches, photo_url, catch_and_release, verification_status, created_at')
    .eq('verification_status', 'verified')
    .order('weight_lbs', { ascending: false, nullsFirst: false })
    .limit(limit)

  if (species) query = query.eq('species', species)
  if (riverId) query = query.eq('river_id', riverId)

  const { data: catches, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Hydrate with author display name + username so the leaderboard
  // row can link to /profile/[username].
  const userIds = Array.from(new Set((catches ?? []).map(r => r.user_id).filter((x): x is string => !!x)))
  const authorById = new Map<string, { display_name: string; username: string | null }>()
  if (userIds.length) {
    const [{ data: userProfiles }, { data: profiles }] = await Promise.all([
      supabase.from('user_profiles').select('id, display_name').in('id', userIds),
      supabase.from('profiles').select('id, username').in('id', userIds),
    ])
    for (const up of userProfiles ?? []) {
      authorById.set(up.id, { display_name: up.display_name || 'angler', username: null })
    }
    for (const p of profiles ?? []) {
      const existing = authorById.get(p.id)
      authorById.set(p.id, { display_name: existing?.display_name || 'angler', username: p.username })
    }
  }

  return NextResponse.json({
    catches: (catches ?? []).map((c, i) => ({
      ...c,
      rank: i + 1,
      author: c.user_id ? authorById.get(c.user_id) ?? { display_name: 'angler', username: null } : null,
    })),
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      userId, riverId, species, catchDate, photoUrl,
      weightLbs, lengthInches,
      photoExifLat, photoExifLng, photoExifTimestamp,
      catchAndRelease, notes,
    } = body

    if (!userId || !riverId || !species || !catchDate) {
      return NextResponse.json({ error: 'userId, riverId, species, catchDate required' }, { status: 400 })
    }

    const supabase = client()
    if (!supabase) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })

    const river = ALL_RIVERS.find(r => r.id === riverId)
    if (!river) {
      return NextResponse.json({ error: 'Unknown riverId' }, { status: 400 })
    }

    const claimedWeight = weightLbs == null || weightLbs === '' ? null : Number(weightLbs)

    // 1. Proximity check from client-extracted EXIF.
    const proximity = checkRiverProximity({
      lat: photoExifLat == null || photoExifLat === '' ? null : Number(photoExifLat),
      lng: photoExifLng == null || photoExifLng === '' ? null : Number(photoExifLng),
      riverId,
    })

    // 2. Species ceiling pre-check (avoids a pointless Vision call
    // for obvious world-record-territory claims).
    const ceiling = SPECIES_MAX_PLAUSIBLE_LBS[species]
    const ceilingViolation = claimedWeight != null && ceiling != null && claimedWeight > ceiling

    // 3. Claude Vision — only runs when there's a photoUrl; otherwise
    // the submission stays 'flagged' pending manual review.
    const vision = photoUrl
      ? await verifyCatchPhoto({ photoUrl, species, claimedWeightLbs: claimedWeight })
      : { speciesConfirmed: false, weightPlausible: false, extractedWeightLbs: null, notes: 'No photo provided.' }

    const status = classifyCatch({
      proximityVerified: proximity.verified,
      speciesConfirmed: vision.speciesConfirmed,
      weightPlausible: vision.weightPlausible,
      ceilingViolation,
    })

    // Combined verification notes so the user (and future admin UI)
    // can see why a catch landed where it did.
    const combinedNotes = [
      `Proximity: ${proximity.reason}`,
      `Vision: ${vision.notes}`,
      ceilingViolation ? `Ceiling: exceeds species plausibility ceiling (${ceiling} lb).` : null,
    ].filter(Boolean).join(' | ')

    const now = new Date().toISOString()
    const { data: inserted, error } = await supabase
      .from('fish_catches')
      .insert({
        user_id: userId,
        river_id: riverId,
        catch_date: catchDate,
        species,
        weight_lbs: claimedWeight,
        length_inches: lengthInches == null || lengthInches === '' ? null : Number(lengthInches),
        photo_url: photoUrl || null,
        photo_exif_lat: photoExifLat == null || photoExifLat === '' ? null : Number(photoExifLat),
        photo_exif_lng: photoExifLng == null || photoExifLng === '' ? null : Number(photoExifLng),
        photo_exif_timestamp: photoExifTimestamp || null,
        river_proximity_verified: proximity.verified,
        ai_species_confirmed: vision.speciesConfirmed,
        ai_weight_plausible: vision.weightPlausible,
        verification_status: status,
        catch_and_release: catchAndRelease !== false,
        notes: (notes ? `${notes}\n\n` : '') + `[verification] ${combinedNotes}`,
      })
      .select()
      .single()

    if (error) {
      console.error('[CATCHES] insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (status === 'verified') {
      await bumpCounters(supabase, userId)
    }

    return NextResponse.json({
      ok: true,
      catch: inserted,
      verification: {
        status,
        proximity,
        vision,
        ceilingViolation,
      },
    })
  } catch (err) {
    console.error('[CATCHES] POST error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function bumpCounters(supabase: SupabaseClient, userId: string) {
  const { data: row } = await supabase
    .from('user_profiles')
    .select('total_verified_catches, contribution_score')
    .eq('id', userId)
    .maybeSingle()
  if (!row) return
  await supabase
    .from('user_profiles')
    .update({
      total_verified_catches: (row.total_verified_catches ?? 0) + 1,
      contribution_score: (row.contribution_score ?? 0) + SCORE_PER_CATCH,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
}
