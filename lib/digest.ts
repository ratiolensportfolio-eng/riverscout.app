// Weekly River Conditions Digest — generator.
//
// Builds a personalized DigestData payload for one user from their
// saved rivers. Every external fetch is wrapped in Promise.allSettled
// so a single failing river or weather call can't poison the whole
// digest. Free for all users.
//
// Architecture: this module is the data layer only. The HTML rendering
// lives in lib/email.ts (digestEmail). The cron loop lives in
// app/api/digest/route.ts.
//
// Performance budget: each user's digest fans out N USGS calls + N
// NOAA calls + ~3N Supabase queries (hazards, stocking, hatches). With
// max 10 saved rivers per digest that's roughly 50 outbound calls per
// user, all parallelized. The cron should comfortably handle hundreds
// of users per Thursday run within Vercel's serverless time budget.

import { createSupabaseClient } from '@/lib/supabase'
import { fetchGaugeData } from '@/lib/usgs'
import { fetchRiverWeather } from '@/lib/weather'
import { RIVER_COORDS } from '@/data/river-coordinates'
import { getRiver, getStateSlug, getRiverSlug } from '@/data/rivers'
import { FISHERIES } from '@/data/fisheries'
import { getHatchTrigger } from '@/lib/hatch-triggers'
import { evaluateHatchConditions, parseTimingString } from '@/lib/hatch-conditions'
import type { HatchStatus } from '@/lib/hatch-conditions'
import type { FlowCondition } from '@/types'
import type { DailyForecast } from '@/lib/weather'
import { sendEmail, digestEmail, digestSubject } from '@/lib/email'
import { signDigestToken } from '@/lib/digest-token'

// ── Public types ──────────────────────────────────────────────────

// Quality rating for a single day's paddling potential. Distinct from
// FlowCondition because it folds in weather (rain, thunderstorms,
// wind) on top of CFS.
export type PaddlingCondition = 'excellent' | 'good' | 'fair' | 'poor' | 'dangerous'

export interface DigestUser {
  id: string
  email: string
  displayName: string
}

export interface DigestHazard {
  id: string
  hazardType: string
  severity: 'info' | 'warning' | 'critical'
  title: string
  description: string
  locationDescription: string | null
  createdAt: string
}

export interface DigestStocking {
  species: string
  quantity: number | null
  sizeCategory: string | null
  locationDescription: string | null
  stockingAuthority: string | null
  stockingDate: string
  isScheduled: boolean
}

export interface DigestHatch {
  hatchName: string
  status: HatchStatus
  message: string
  daysUntilPeak: number | null
  triggerTempF: number | null
  waterTempF: number | null
}

// One day in the weekend forecast block (Fri / Sat / Sun).
export interface DigestWeekendDay {
  label: string             // "Fri", "Sat", "Sun"
  dateIso: string           // ISO date for the day
  highF: number | null
  shortForecast: string     // "Sunny", "Rain 60%", etc
  precipChance: number
  hasThunderstorm: boolean
  paddlingCondition: PaddlingCondition
}

export interface DigestRiver {
  id: string
  name: string
  stateKey: string
  stateName: string
  url: string

  // Live conditions
  currentCfs: number | null
  gaugeHeightFt: number | null
  condition: FlowCondition
  rateLabel: string
  waterTempF: number | null
  weatherSummary: string

  // Composite "should I paddle this weekend" rating, based on flow +
  // weather + active hazards.
  paddlingCondition: PaddlingCondition

  // Weekend snapshot (Fri-Sun) — empty array if NOAA forecast failed.
  weekendForecast: DigestWeekendDay[]

  // Surfaced events
  activeHazards: DigestHazard[]
  upcomingStocking: DigestStocking | null
  activeHatch: DigestHatch | null
}

export interface DigestData {
  user: DigestUser
  rivers: DigestRiver[]
  bestRiverThisWeekend: DigestRiver | null
  generatedAt: string
}

// Internal — data we fetch for each saved river before transforming
// into a DigestRiver.
interface RawRiverData {
  riverId: string
  flow: Awaited<ReturnType<typeof fetchGaugeData>> | null
  weather: Awaited<ReturnType<typeof fetchRiverWeather>> | null
  hazards: Array<Record<string, unknown>>
  stockings: Array<Record<string, unknown>>
}

// ── Per-river fetchers ────────────────────────────────────────────

// Active hazards for one river. Uses the same filter as
// /api/hazards GET: active, non-hidden, non-expired, sorted critical
// → warning → info in JS.
async function fetchHazardsForRiver(riverId: string): Promise<Array<Record<string, unknown>>> {
  const supabase = createSupabaseClient()
  const { data } = await supabase
    .from('river_hazards')
    .select('id, hazard_type, severity, title, description, location_description, created_at')
    .eq('river_id', riverId)
    .eq('active', true)
    .eq('admin_hidden', false)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })

  if (!data) return []
  const RANK: Record<string, number> = { critical: 0, warning: 1, info: 2 }
  return data.slice().sort(
    (a, b) => (RANK[String(a.severity)] ?? 9) - (RANK[String(b.severity)] ?? 9),
  )
}

// Recent + scheduled stocking events. Returns the most recent / next
// upcoming row only — the digest needs one item per river, not a
// stocking history.
async function fetchStockingForRiver(riverId: string): Promise<Array<Record<string, unknown>>> {
  const supabase = createSupabaseClient()
  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const { data } = await supabase
    .from('river_stocking')
    .select('species, quantity, size_category, location_description, stocking_authority, stocking_date, is_scheduled')
    .eq('river_id', riverId)
    .gte('stocking_date', fourteenDaysAgo)
    .order('stocking_date', { ascending: false })
    .limit(5)

  return data ?? []
}

// ── Helpers ───────────────────────────────────────────────────────

// Score one day's paddling potential by folding flow + weather. Used
// per-day in the weekend forecast and for the river-level overall
// rating. The scoring is heuristic on purpose — the digest's job is
// to give users a fast "is this weekend worth a trip" read, not to
// be a precise risk model.
function scorePaddlingDay(
  condition: FlowCondition,
  precipChance: number,
  hasThunderstorm: boolean,
  hasCriticalHazard: boolean,
): PaddlingCondition {
  if (hasCriticalHazard) return 'dangerous'
  if (condition === 'flood') return 'dangerous'
  if (hasThunderstorm) return 'poor'
  if (condition === 'high') return 'fair'
  if (condition === 'low') return 'fair'
  if (precipChance >= 60) return 'fair'
  if (condition === 'optimal' && precipChance < 30) return 'excellent'
  if (condition === 'optimal') return 'good'
  return 'good'
}

// Roll up the weekend days into one overall paddling rating. The
// digest's headline rating per river uses the BEST of the three days,
// not the worst — users want to know if there's a window, not whether
// every single day is bad.
function bestOfPaddling(days: DigestWeekendDay[]): PaddlingCondition {
  const RANK: Record<PaddlingCondition, number> = {
    excellent: 0, good: 1, fair: 2, poor: 3, dangerous: 4,
  }
  if (days.length === 0) return 'good'
  return days.slice().sort((a, b) => RANK[a.paddlingCondition] - RANK[b.paddlingCondition])[0].paddlingCondition
}

// Pick out Fri/Sat/Sun from a NOAA daily forecast. NOAA returns
// alternating day + night periods named "Friday", "Friday Night",
// etc., so we filter to daytime entries and match by name.
//
// Edge case: if today is Saturday and the forecast doesn't include
// Friday, we silently skip that day rather than showing a wrong date.
function extractWeekendDays(
  daily: DailyForecast[],
  condition: FlowCondition,
  hasCriticalHazard: boolean,
): DigestWeekendDay[] {
  const out: DigestWeekendDay[] = []
  const targets = ['Friday', 'Saturday', 'Sunday']
  const labels: Record<string, string> = { Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun' }

  for (const target of targets) {
    const day = daily.find(d => d.isDaytime && d.name === target)
    if (!day) continue
    out.push({
      label: labels[target],
      dateIso: new Date().toISOString().split('T')[0], // not the actual day's date — labels are enough
      highF: day.tempF,
      shortForecast: day.shortForecast,
      precipChance: day.precipChance,
      hasThunderstorm: day.hasThunderstorm,
      paddlingCondition: scorePaddlingDay(condition, day.precipChance, day.hasThunderstorm, hasCriticalHazard),
    })
  }

  return out
}

// Find the active / imminent hatch for a river, if any. Uses the
// same evaluator as the /hatches page so the digest stays consistent
// with the live UI.
function findActiveHatch(riverId: string, waterTempF: number | null): DigestHatch | null {
  const fishData = FISHERIES[riverId]
  if (!fishData || fishData.hatches.length === 0) return null

  const now = new Date()
  let best: DigestHatch | null = null
  const RANK: Record<HatchStatus, number> = {
    peak: 0, active: 1, imminent: 2, approaching: 3, fading: 4, off_season: 5,
  }

  for (const h of fishData.hatches) {
    const trigger = getHatchTrigger(h.name)
    const parsed = parseTimingString(h.timing)
    if (!parsed) continue

    const evaluation = evaluateHatchConditions(
      {
        riverId,
        hatchName: h.name,
        species: h.name,
        tempTriggerF: trigger?.tempMinF ?? null,
        tempTriggerMaxF: trigger?.tempMaxF ?? null,
        peakStartMonth: parsed.startMonth,
        peakStartDay: parsed.startDay,
        peakEndMonth: parsed.endMonth,
        peakEndDay: parsed.endDay,
        conditionsDescription: trigger?.description ?? '',
      },
      waterTempF,
      now,
    )

    // Only surface hatches that are at least approaching — off-season
    // and fading hatches just clutter the digest.
    if (evaluation.status === 'off_season' || evaluation.status === 'fading') continue

    const candidate: DigestHatch = {
      hatchName: h.name,
      status: evaluation.status,
      message: evaluation.message,
      daysUntilPeak: evaluation.daysUntilPeak,
      triggerTempF: trigger?.tempMinF ?? null,
      waterTempF,
    }

    if (!best || RANK[candidate.status] < RANK[best.status]) {
      best = candidate
    }
  }

  return best
}

// Brief weather summary line for the river card. Mirrors the format
// used by lib/weather.formatWeatherSummary but with digest-friendly
// punctuation.
function formatWeatherForDigest(weather: Awaited<ReturnType<typeof fetchRiverWeather>>): string {
  if (!weather || !weather.current) return 'Weather unavailable'
  const parts: string[] = [`${weather.current.shortForecast}, high ${weather.todayHigh ?? weather.current.tempF}°F`]
  if (weather.thunderstormRisk) parts.push('thunderstorm risk')
  return parts.join(' · ')
}

// Score for ranking the "best river this weekend" callout. Higher is
// better. Folds the per-river paddling rating with bonus weight for
// recent stocking, active hatch, and zero hazards. Critical hazards
// disqualify the river outright by returning -1.
function bestRiverScore(r: DigestRiver): number {
  if (r.activeHazards.some(h => h.severity === 'critical')) return -1
  const baseRank: Record<PaddlingCondition, number> = {
    excellent: 100, good: 70, fair: 40, poor: 15, dangerous: 0,
  }
  let score = baseRank[r.paddlingCondition]
  if (r.upcomingStocking && !r.upcomingStocking.isScheduled) score += 8
  if (r.activeHatch && (r.activeHatch.status === 'peak' || r.activeHatch.status === 'active')) score += 12
  if (r.activeHatch && r.activeHatch.status === 'imminent') score += 6
  if (r.activeHazards.length === 0) score += 3
  // Tiebreak by sustained excellence: count weekend days that hit excellent
  const excellentDays = r.weekendForecast.filter(d => d.paddlingCondition === 'excellent').length
  score += excellentDays * 2
  return score
}

// ── Main entry point ──────────────────────────────────────────────

/**
 * Generate the full digest payload for one user.
 *
 * Returns null when:
 *   - The user has no saved rivers (caller should skip the email)
 *   - The user_profiles row can't be loaded (missing email/auth)
 *
 * Never throws — every external call is settled, and a partial digest
 * (e.g. one river failed weather lookup) still ships with placeholder
 * values for the missing pieces.
 */
export async function generateDigest(userId: string): Promise<DigestData | null> {
  const supabase = createSupabaseClient()

  // Pull the user's profile + email + display name. We need the email
  // address to send to and the display name for the salutation.
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('id, email, display_name')
    .eq('id', userId)
    .single()

  if (!profile?.email) return null

  // Saved rivers — cap at 10 per digest so the email stays scannable
  // and the fan-out cost stays bounded.
  const { data: saved } = await supabase
    .from('saved_rivers')
    .select('river_id')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .limit(10)

  if (!saved || saved.length === 0) return null

  // Fan-out per river. Each river hydrates with 4 parallel external
  // calls (gauge, weather, hazards, stocking) wrapped in Promise.all.
  // The outer Promise.allSettled then makes sure one bad river doesn't
  // poison the whole digest.
  const rawResults = await Promise.allSettled(
    saved.map(async (s): Promise<RawRiverData> => {
      const river = getRiver(s.river_id)
      if (!river) {
        return { riverId: s.river_id, flow: null, weather: null, hazards: [], stockings: [] }
      }
      const coords = RIVER_COORDS[s.river_id]
      const [flow, weather, hazards, stockings] = await Promise.allSettled([
        fetchGaugeData(river.g, river.opt),
        coords ? fetchRiverWeather(coords[0], coords[1]) : Promise.resolve(null),
        fetchHazardsForRiver(s.river_id),
        fetchStockingForRiver(s.river_id),
      ])
      return {
        riverId: s.river_id,
        flow: flow.status === 'fulfilled' ? flow.value : null,
        weather: weather.status === 'fulfilled' ? weather.value : null,
        hazards: hazards.status === 'fulfilled' ? hazards.value : [],
        stockings: stockings.status === 'fulfilled' ? stockings.value : [],
      }
    }),
  )

  // Transform raw → DigestRiver shape
  const rivers: DigestRiver[] = []
  for (const r of rawResults) {
    if (r.status !== 'fulfilled') continue
    const raw = r.value
    const river = getRiver(raw.riverId)
    if (!river) continue

    const stateSlug = getStateSlug(river.stateKey)
    const riverSlug = getRiverSlug(river)
    const url = `https://riverscout.app/rivers/${stateSlug}/${riverSlug}`

    const condition = raw.flow?.condition ?? 'loading'
    const cfs = raw.flow?.cfs ?? null
    const gaugeHeightFt = raw.flow?.gaugeHeightFt ?? null
    const rateLabel = raw.flow?.rateLabel ?? 'Rate unknown'
    const waterTempF = raw.flow?.tempC != null
      ? Math.round(raw.flow.tempC * 9 / 5 + 32)
      : null

    const hazards: DigestHazard[] = raw.hazards.map(h => ({
      id: String(h.id),
      hazardType: String(h.hazard_type),
      severity: h.severity as 'info' | 'warning' | 'critical',
      title: String(h.title),
      description: String(h.description),
      locationDescription: h.location_description ? String(h.location_description) : null,
      createdAt: String(h.created_at),
    }))

    const hasCritical = hazards.some(h => h.severity === 'critical')

    const weekendForecast = raw.weather
      ? extractWeekendDays(raw.weather.daily, condition, hasCritical)
      : []

    // Pick the most recent stocking (recent or scheduled). The fetch
    // already orders by date desc, so [0] is the right one.
    let upcomingStocking: DigestStocking | null = null
    if (raw.stockings.length > 0) {
      const s = raw.stockings[0]
      upcomingStocking = {
        species: String(s.species),
        quantity: typeof s.quantity === 'number' ? s.quantity : null,
        sizeCategory: s.size_category ? String(s.size_category) : null,
        locationDescription: s.location_description ? String(s.location_description) : null,
        stockingAuthority: s.stocking_authority ? String(s.stocking_authority) : null,
        stockingDate: String(s.stocking_date),
        isScheduled: !!s.is_scheduled,
      }
    }

    const activeHatch = findActiveHatch(raw.riverId, waterTempF)

    // Overall paddling rating — best of weekend if we have forecast,
    // otherwise score the current conditions alone.
    const paddlingCondition = weekendForecast.length > 0
      ? bestOfPaddling(weekendForecast)
      : scorePaddlingDay(condition, raw.weather?.rainNext24h ? 50 : 0, raw.weather?.thunderstormRisk ?? false, hasCritical)

    rivers.push({
      id: raw.riverId,
      name: river.n,
      stateKey: river.stateKey,
      stateName: river.stateName as string,
      url,
      currentCfs: cfs,
      gaugeHeightFt,
      condition,
      rateLabel,
      waterTempF,
      weatherSummary: formatWeatherForDigest(raw.weather),
      paddlingCondition,
      weekendForecast,
      activeHazards: hazards,
      upcomingStocking,
      activeHatch,
    })
  }

  // Best river callout — highest score wins. Returns null if every
  // river is dangerous or has score <= 0 (e.g. critical hazard
  // everywhere), so the email can hide the section gracefully.
  let bestRiverThisWeekend: DigestRiver | null = null
  let bestScore = 0
  for (const r of rivers) {
    const s = bestRiverScore(r)
    if (s > bestScore) {
      bestScore = s
      bestRiverThisWeekend = r
    }
  }

  return {
    user: {
      id: profile.id,
      email: profile.email,
      displayName: profile.display_name || profile.email.split('@')[0] || 'paddler',
    },
    rivers,
    bestRiverThisWeekend,
    generatedAt: new Date().toISOString(),
  }
}

// ── Send helper ───────────────────────────────────────────────────
//
// One place where the digest gets generated, rendered, and handed off
// to Resend. Both the cron loop and the user-triggered preview route
// call this so the send flow stays in sync.
//
// Returns a structured result so callers can distinguish "no rivers"
// from "send failed" without parsing strings.
export interface SendDigestResult {
  ok: boolean
  reason?: 'no_digest' | 'no_rivers' | 'send_failed'
  riversIncluded?: number
}

export async function sendDigestToUser(userId: string): Promise<SendDigestResult> {
  const digest = await generateDigest(userId)
  if (!digest) return { ok: false, reason: 'no_digest' }
  if (digest.rivers.length === 0) return { ok: false, reason: 'no_rivers' }

  const subject = digestSubject(digest.rivers)
  const token = signDigestToken({ userId })
  const unsubscribeUrl = `https://riverscout.app/api/digest/unsubscribe?token=${encodeURIComponent(token)}`
  const html = digestEmail(digest, unsubscribeUrl)

  const sent = await sendEmail({
    to: digest.user.email,
    subject,
    html,
  })

  if (!sent) return { ok: false, reason: 'send_failed' }
  return { ok: true, riversIncluded: digest.rivers.length }
}
