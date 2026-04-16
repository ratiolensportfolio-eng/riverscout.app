// AI verification for trip reports (Haiku text) and fish catches
// (Haiku vision). Pattern mirrors app/api/suggestions/route.ts —
// direct fetch to api.anthropic.com, 10s AbortController timeout,
// graceful degradation when ANTHROPIC_API_KEY is missing (returns
// a neutral result that keeps the submission in 'pending' so a
// human can review).
//
// The verifier is the single source of truth for what counts as
// a "verified" contribution. The submission API routes call these
// helpers inline, use the result to set the row's status, and only
// bump user_profiles counters when status flips to 'verified'.

import { RIVER_COORDS } from '@/data/river-coordinates'
import { SPECIES_MAX_PLAUSIBLE_LBS, type VerificationStatus } from '@/types'

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-haiku-4-5-20251001'
const TIMEOUT_MS = 10_000

// Thresholds from the product spec:
//   score > 75 → auto-verify
//   score < 40 → auto-reject
//   else       → flagged (manual review)
const VERIFY_THRESHOLD = 75
const REJECT_THRESHOLD = 40

// ── Trip report verification ──────────────────────────────────────

export interface TripVerification {
  score: number
  status: VerificationStatus
  notes: string
}

export async function verifyTripReport(params: {
  riverName: string
  stateKey: string
  reportText: string
  tripDate: string
  cfsAtTime: number | null
  waterTemp: number | null
  conditionsRating: number | null
}): Promise<TripVerification> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return { score: 0, status: 'pending', notes: 'AI verification unavailable — no API key; queued for manual review.' }
  }

  const { riverName, stateKey, reportText, tripDate, cfsAtTime, waterTemp, conditionsRating } = params

  const prompt = `Review this trip report and determine if it appears to be a genuine first-hand account of a paddling trip on ${riverName} (${stateKey.toUpperCase()}). Score it 0-100 on authenticity.

Look for:
- Specific conditions mentioned (water clarity, wind, wildlife)
- River features or landmarks named
- Realistic CFS reference that aligns with the reported trip
- Appropriate seasonal context for the trip date
- Personal observations (not generic claims)

Flag if it appears generic, AI-generated, or submitted to game a leaderboard.

Trip report context:
- Trip date: ${tripDate}
- CFS at time of trip: ${cfsAtTime ?? 'not provided'}
- Water temp: ${waterTemp != null ? `${waterTemp}°F` : 'not provided'}
- Conditions rating: ${conditionsRating != null ? `${conditionsRating}/5` : 'not provided'}

Report text:
"""
${reportText.slice(0, 4000)}
"""

Return ONLY a JSON object in this exact format:
{"score": <0-100>, "verified": <true|false>, "notes": "<1-3 sentence assessment>"}`

  const result = await callClaude(apiKey, [{ role: 'user', content: prompt }])
  if (!result.ok) {
    return { score: 0, status: 'pending', notes: result.error }
  }

  try {
    const parsed = extractJson(result.text)
    const rawScore = Number(parsed.score)
    const score = Number.isFinite(rawScore) ? Math.max(0, Math.min(100, rawScore)) : 0
    const notes = typeof parsed.notes === 'string' ? parsed.notes.slice(0, 1000) : 'No assessment provided.'
    const status: VerificationStatus =
      score >= VERIFY_THRESHOLD ? 'verified'
      : score < REJECT_THRESHOLD  ? 'rejected'
      :                              'flagged'
    return { score, status, notes }
  } catch {
    return { score: 0, status: 'pending', notes: 'AI returned unparseable response — queued for manual review.' }
  }
}

// ── Fish catch verification ───────────────────────────────────────

export interface CatchVerification {
  speciesConfirmed: boolean
  weightPlausible: boolean
  extractedWeightLbs: number | null
  notes: string
}

export async function verifyCatchPhoto(params: {
  photoUrl: string
  species: string
  claimedWeightLbs: number | null
}): Promise<CatchVerification> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return {
      speciesConfirmed: false,
      weightPlausible: false,
      extractedWeightLbs: null,
      notes: 'AI verification unavailable — no API key; queued for manual review.',
    }
  }

  const { photoUrl, species, claimedWeightLbs } = params

  // Hard ceiling check first — if someone claims a 100 lb brook trout,
  // reject before spending a Vision call. Ceiling is well above IGFA
  // records so "exceptional but real" catches still go to Claude.
  const ceiling = SPECIES_MAX_PLAUSIBLE_LBS[species]
  if (claimedWeightLbs != null && ceiling && claimedWeightLbs > ceiling) {
    return {
      speciesConfirmed: false,
      weightPlausible: false,
      extractedWeightLbs: null,
      notes: `Claimed weight ${claimedWeightLbs} lb exceeds the plausibility ceiling for ${species} (${ceiling} lb).`,
    }
  }

  const prompt = `Does this photo show a ${species} on a weighing scale? Is the weight reading visible and plausible for this species? Confirm yes/no and extract the weight reading if visible.

${claimedWeightLbs != null ? `The angler claims a weight of ${claimedWeightLbs} lb. Compare that claim to what you see in the photo.` : 'The angler did not provide a weight.'}

Return ONLY a JSON object in this exact format:
{"species_confirmed": <true|false>, "weight_plausible": <true|false>, "extracted_weight_lbs": <number or null>, "notes": "<1-2 sentence assessment>"}

- species_confirmed = true only if you can visually identify the fish as a ${species}
- weight_plausible = true if a scale is visible AND the reading matches the claimed weight within 10%, OR no weight was claimed but what you see is plausible for the species
- extracted_weight_lbs = the number you read from the scale, or null if no scale/reading visible`

  const result = await callClaude(apiKey, [{
    role: 'user',
    content: [
      { type: 'image', source: { type: 'url', url: photoUrl } },
      { type: 'text', text: prompt },
    ],
  }])

  if (!result.ok) {
    return {
      speciesConfirmed: false,
      weightPlausible: false,
      extractedWeightLbs: null,
      notes: result.error,
    }
  }

  try {
    const parsed = extractJson(result.text)
    return {
      speciesConfirmed: !!parsed.species_confirmed,
      weightPlausible: !!parsed.weight_plausible,
      extractedWeightLbs: typeof parsed.extracted_weight_lbs === 'number' ? parsed.extracted_weight_lbs : null,
      notes: typeof parsed.notes === 'string' ? parsed.notes.slice(0, 1000) : 'No assessment provided.',
    }
  } catch {
    return {
      speciesConfirmed: false,
      weightPlausible: false,
      extractedWeightLbs: null,
      notes: 'AI returned unparseable response — queued for manual review.',
    }
  }
}

// Combines proximity + AI vision into a final status for catches.
// A catch is 'verified' only when all three signals agree. Partial
// signals go to 'flagged' (manual review); a hard ceiling violation
// goes straight to 'rejected'.
export function classifyCatch(signals: {
  proximityVerified: boolean
  speciesConfirmed: boolean
  weightPlausible: boolean
  ceilingViolation: boolean
}): VerificationStatus {
  if (signals.ceilingViolation) return 'rejected'
  if (signals.proximityVerified && signals.speciesConfirmed && signals.weightPlausible) return 'verified'
  return 'flagged'
}

// ── Proximity check ───────────────────────────────────────────────

// Verifies photo EXIF GPS coords fall within `radiusMiles` of the
// claimed river's representative coordinate from data/river-coordinates.
// Returns true when the river has no coord on file (can't verify,
// don't fail the submission — let AI + human review handle it).
export function checkRiverProximity(params: {
  lat: number | null
  lng: number | null
  riverId: string
  radiusMiles?: number
}): { verified: boolean; distanceMiles: number | null; reason: string } {
  const { lat, lng, riverId, radiusMiles = 10 } = params
  if (lat == null || lng == null) {
    return { verified: false, distanceMiles: null, reason: 'No EXIF GPS data on photo.' }
  }
  const coord = RIVER_COORDS[riverId]
  if (!coord) {
    // No river coord to compare against — skip the check rather than
    // blocking the submission. Counts as a pass so the other signals
    // (AI vision, human review) decide the outcome.
    return { verified: true, distanceMiles: null, reason: 'No river coordinate on file — proximity check skipped.' }
  }
  const [riverLat, riverLng] = coord
  const miles = haversineMiles(lat, lng, riverLat, riverLng)
  const verified = miles <= radiusMiles
  return {
    verified,
    distanceMiles: miles,
    reason: verified
      ? `Photo GPS is ${miles.toFixed(1)} mi from river center.`
      : `Photo GPS is ${miles.toFixed(1)} mi from river center — outside ${radiusMiles} mi verification radius.`,
  }
}

function haversineMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

// ── Internal: Claude call + JSON extraction ───────────────────────

type ClaudeContent = string | Array<
  { type: 'text'; text: string }
  | { type: 'image'; source: { type: 'url'; url: string } | { type: 'base64'; media_type: string; data: string } }
>

async function callClaude(
  apiKey: string,
  messages: Array<{ role: 'user' | 'assistant'; content: ClaudeContent }>,
): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ model: MODEL, max_tokens: 500, messages }),
    })
    clearTimeout(timer)
    if (!res.ok) {
      const body = await res.text().catch(() => '')
      console.error('[AI-VERIFY] Claude API error:', res.status, body.slice(0, 200))
      return { ok: false, error: `Claude API error ${res.status} — queued for manual review.` }
    }
    const data = await res.json()
    const text: string = data.content?.[0]?.text?.trim() || ''
    return { ok: true, text }
  } catch (err) {
    clearTimeout(timer)
    if (err instanceof Error && (err.name === 'AbortError' || err.message.includes('aborted'))) {
      console.warn('[AI-VERIFY] Claude timeout after 10s')
      return { ok: false, error: 'AI verification timed out — queued for manual review.' }
    }
    console.error('[AI-VERIFY] Error:', err)
    return { ok: false, error: 'AI verification failed — queued for manual review.' }
  }
}

// Claude sometimes wraps JSON in prose or code fences. Strip both.
function extractJson(text: string): Record<string, unknown> {
  const stripped = text.replace(/```json\s*/gi, '').replace(/```/g, '').trim()
  const match = stripped.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('No JSON object found')
  return JSON.parse(match[0])
}
