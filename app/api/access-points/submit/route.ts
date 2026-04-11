import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { ALL_RIVERS } from '@/data/rivers'
import { sendEmail, ADMIN_EMAIL } from '@/lib/email'

// POST /api/access-points/submit
//
// Body: full access point payload (see ACCESS_POINTS_PROGRESS.md for
// the modal section breakdown). Login required per RLS — anonymous
// users can't submit.
//
// On submit:
//   1. We auth-check via the SSR cookie session.
//   2. Validate the river_id matches a real river in the static
//      catalog (sanity gate before AI cost).
//   3. Run Claude Haiku for plausibility — checks GPS proximity to
//      the river's stated lat/lng, ramp/type consistency, distance
//      sanity. Same shape as the suggestions AI eval but tailored
//      to access points.
//   4. Service-role insert (anon client can't reliably forward auth
//      context) with the AI assessment attached.
//   5. Send admin notification email so the queue gets attention.
//
// Pending submissions go live immediately with a "pending" badge —
// the user's launch decision (instant visibility, admin reviews
// later).

export const dynamic = 'force-dynamic'

const ALLOWED_TYPES = new Set(['boat_ramp', 'carry_in', 'beach_launch', 'dock', 'steps', 'primitive'])
const ALLOWED_SURFACES = new Set(['paved', 'gravel', 'dirt', 'concrete', 'sand', 'none'])
const ALLOWED_PARKING = new Set(['limited_under_5', 'small_5_to_15', 'medium_15_to_30', 'large_over_30'])

interface AccessPointBody {
  riverId: string
  name: string
  description?: string | null
  accessType?: string | null
  rampSurface?: string | null
  trailerAccess?: boolean
  maxTrailerLengthFt?: number | null
  parkingCapacity?: string | null
  parkingFee?: boolean
  feeAmount?: string | null
  facilities?: string[]
  lat?: number | null
  lng?: number | null
  riverMile?: number | null
  distanceToNextAccessMiles?: number | null
  nextAccessName?: string | null
  floatTimeToNext?: string | null
  seasonalNotes?: string | null
  displayName: string
}

// Plausibility evaluation. Same fail-soft pattern as the
// suggestions route — if the AI is unavailable or errors out we
// return a medium-confidence default rather than blocking the
// submission.
async function evaluatePlausibility(
  river: { n: string; stateName: string; mx: number; my: number },
  body: AccessPointBody,
): Promise<{ confidence: 'high' | 'medium' | 'low'; reasoning: string }> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return { confidence: 'medium', reasoning: 'AI evaluation unavailable — no API key configured.' }
  }
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 10000)
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        messages: [{
          role: 'user',
          content: `You are evaluating a user-submitted river access point for the RiverScout paddling atlas.

River: ${river.n} (${river.stateName})
River centerpoint (rough): lat ${river.my}, lng ${river.mx}

Submission:
- Name: ${body.name}
- Type: ${body.accessType ?? 'unspecified'}
- Ramp surface: ${body.rampSurface ?? 'unspecified'}
- Trailer access: ${body.trailerAccess ? `yes${body.maxTrailerLengthFt ? ` (max ${body.maxTrailerLengthFt}ft)` : ''}` : 'no'}
- Parking: ${body.parkingCapacity ?? 'unspecified'}
- GPS: ${body.lat != null && body.lng != null ? `${body.lat}, ${body.lng}` : 'not provided'}
- River mile: ${body.riverMile ?? 'not provided'}
- Distance to next: ${body.distanceToNextAccessMiles ?? 'not provided'} miles
- Description: ${body.description ?? 'not provided'}

Evaluate plausibility:
1. Are the GPS coordinates (if given) anywhere near the river's stated center point? Coordinates more than ~50 miles away should be flagged.
2. Does the access type match the description? (e.g., "carry_in" with "trailer access yes" is suspicious)
3. Is the distance-to-next-access realistic for a paddleable river segment (typically 0.5–20 miles)?
4. Does the description read as genuine local knowledge or as spam/filler?

Respond ONLY with a JSON object: {"confidence": "high"|"medium"|"low", "reasoning": "1-3 sentence assessment"}.
- high: looks like genuine local knowledge with internally consistent details
- medium: plausible but missing context or has minor inconsistencies
- low: suspicious — wrong location, contradictory fields, or spam/filler text`,
        }],
      }),
    })
    clearTimeout(timer)
    if (!res.ok) {
      return { confidence: 'medium', reasoning: 'AI evaluation failed — API error.' }
    }
    const data = await res.json()
    const text = data.content?.[0]?.text?.trim() || ''
    try {
      const parsed = JSON.parse(text)
      const confidence = ['high', 'medium', 'low'].includes(parsed.confidence) ? parsed.confidence : 'medium'
      const reasoning = typeof parsed.reasoning === 'string' ? parsed.reasoning.slice(0, 1000) : 'No reasoning provided.'
      return { confidence, reasoning }
    } catch {
      return { confidence: 'medium', reasoning: text.slice(0, 500) || 'AI returned unparseable response.' }
    }
  } catch (err) {
    clearTimeout(timer)
    if (err instanceof Error && err.name === 'AbortError') {
      return { confidence: 'medium', reasoning: 'AI evaluation timed out.' }
    }
    return { confidence: 'medium', reasoning: 'AI evaluation failed.' }
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as AccessPointBody

    // Auth check via cookie session — submissions require login.
    const userClient = await createSupabaseServerClient()
    const { data: { user } } = await userClient.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Sign in required to submit an access point' }, { status: 401 })
    }

    if (!body.riverId || typeof body.riverId !== 'string') {
      return NextResponse.json({ error: 'riverId required' }, { status: 400 })
    }
    if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
      return NextResponse.json({ error: 'Access point name required' }, { status: 400 })
    }
    if (!body.displayName || typeof body.displayName !== 'string') {
      return NextResponse.json({ error: 'Display name required' }, { status: 400 })
    }
    if (body.description && body.description.length > 280) {
      return NextResponse.json({ error: 'Description must be 280 characters or fewer' }, { status: 400 })
    }
    if (body.accessType && !ALLOWED_TYPES.has(body.accessType)) {
      return NextResponse.json({ error: 'Invalid access type' }, { status: 400 })
    }
    if (body.rampSurface && !ALLOWED_SURFACES.has(body.rampSurface)) {
      return NextResponse.json({ error: 'Invalid ramp surface' }, { status: 400 })
    }
    if (body.parkingCapacity && !ALLOWED_PARKING.has(body.parkingCapacity)) {
      return NextResponse.json({ error: 'Invalid parking capacity' }, { status: 400 })
    }

    const river = ALL_RIVERS.find(r => r.id === body.riverId)
    if (!river) {
      return NextResponse.json({ error: 'Unknown riverId' }, { status: 404 })
    }

    // AI plausibility eval (best effort).
    const ai = await evaluatePlausibility(
      { n: river.n, stateName: river.stateName, mx: river.mx, my: river.my },
      body,
    )

    // Service-role insert. Anon client can't reliably forward
    // auth.uid() to PostgREST so we set submitted_by from the
    // verified session above.
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !serviceKey) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

    const insertRow = {
      river_id: body.riverId,
      name: body.name.trim().slice(0, 120),
      description: body.description?.slice(0, 280) || null,
      access_type: body.accessType || null,
      ramp_surface: body.rampSurface || null,
      trailer_access: !!body.trailerAccess,
      max_trailer_length_ft: body.maxTrailerLengthFt ?? null,
      parking_capacity: body.parkingCapacity || null,
      parking_fee: !!body.parkingFee,
      fee_amount: body.feeAmount || null,
      facilities: Array.isArray(body.facilities) ? body.facilities.slice(0, 20) : [],
      lat: body.lat ?? null,
      lng: body.lng ?? null,
      river_mile: body.riverMile ?? null,
      distance_to_next_access_miles: body.distanceToNextAccessMiles ?? null,
      next_access_name: body.nextAccessName || null,
      float_time_to_next: body.floatTimeToNext || null,
      seasonal_notes: body.seasonalNotes || null,
      submitted_by: user.id,
      submitted_by_name: body.displayName.trim().slice(0, 60),
      verification_status: 'pending' as const,
      ai_confidence: ai.confidence,
      ai_reasoning: ai.reasoning,
    }

    const { error } = await supabase.from('river_access_points').insert(insertRow)
    if (error) {
      console.error('[access-points/submit] insert error:', error)
      return NextResponse.json({ error: `Failed to submit: ${error.message}` }, { status: 500 })
    }

    // Best-effort admin notification email.
    try {
      await sendEmail({
        to: ADMIN_EMAIL,
        subject: `[Access Point] ${river.n}: ${insertRow.name}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 520px;">
            <h2 style="color: #185FA5; margin: 0 0 12px;">New access point submission</h2>
            <p><strong>River:</strong> ${river.n} (${river.stateName})</p>
            <p><strong>Name:</strong> ${insertRow.name}</p>
            <p><strong>Type:</strong> ${insertRow.access_type ?? 'unspecified'}</p>
            <p><strong>GPS:</strong> ${insertRow.lat != null && insertRow.lng != null ? `${insertRow.lat}, ${insertRow.lng}` : 'not provided'}</p>
            <p><strong>Submitted by:</strong> ${insertRow.submitted_by_name} (${user.email ?? 'no email'})</p>
            <p><strong>AI assessment:</strong> ${ai.confidence} — ${ai.reasoning}</p>
            <hr/>
            <p><a href="https://riverscout.app/admin/access-points">Review in admin queue &rarr;</a></p>
          </div>
        `,
      })
    } catch (emailErr) {
      console.error('[access-points/submit] admin email failed:', emailErr)
    }

    return NextResponse.json({
      ok: true,
      message: 'Access point submitted. It\'s visible immediately and will be marked verified after admin review or 3 community confirmations.',
    })
  } catch (err) {
    console.error('[access-points/submit] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
