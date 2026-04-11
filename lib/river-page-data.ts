// Server-side batched fetcher for river page data.
//
// Why this exists: the river detail page used to trigger 4-6 separate
// browser→Vercel→Supabase round trips after JS hydration as the user clicked
// each tab. This module fetches all the public, non-auth-dependent data in
// one server-side function via Promise.all, so the river page server
// component can pass it as `initialData` to RiverTabs.
//
// What's NOT here:
//  - /api/weather, /api/pro/forecast, /api/pro/historical → external (NOAA/USGS)
//  - /api/pro/status, /api/pro/cfs-range → require user auth context
//  - /api/hatch-alerts → only loaded if user enters their email
//  - /api/suggestions → owned by SuggestCorrection component
//
// Architectural note: Supabase nested-select with FK joins (the textbook
// optimization) does NOT work here because the active user-content tables
// (trip_reports, outfitters, river_stocking) intentionally use
// `river_id text` columns with no foreign key to public.rivers — the
// canonical river data lives in data/rivers.ts, not Supabase. Promise.all
// gives us parallel queries within one serverless function which is the
// next-best win and saves 4-6 client round trips.

import { createSupabaseServerClient } from '@/lib/supabase-server'
import { fetchContributorCounts } from '@/lib/contributor-counts'
import type { RiverPermit } from '@/types'

export interface PrefetchedTripReport {
  id: string
  author_name: string
  rating: number
  flow_cfs: number | null
  trip_date: string | null
  body: string
  photos: string[]
  created_at: string
}

export interface PrefetchedStockingEvent {
  id: string
  stocking_date: string
  is_scheduled: boolean
  species: string
  quantity: number | null
  size_category: string | null
  size_inches: number | null
  location_description: string | null
  stocking_authority: string | null
  source_url: string | null
  verified: boolean
}

export interface PrefetchedOutfitter {
  id: string
  business_name: string
  description: string | null
  website: string | null
  phone: string | null
  logo_url: string | null
  cover_photo_url: string | null
  tier: 'listed' | 'featured' | 'sponsored' | 'guide' | 'destination'
  specialty_tags: string[]
}

export interface PrefetchedRapid {
  id: string
}

// Matches the subset of public.river_hazards used by the banner. We
// deliberately exclude email bookkeeping / admin fields so the wire
// payload stays small and we don't leak reporter emails to the public.
export interface PrefetchedHazard {
  id: string
  river_id: string
  hazard_type: string
  severity: 'info' | 'warning' | 'critical'
  title: string
  description: string
  location_description: string | null
  mile_marker: number | null
  reporter_name: string | null
  created_at: string
  expires_at: string
  confirmations: number
  last_confirmed_at: string | null
  reported_by: string | null
}

// Map of field key → override value. Field keys match the
// suggestions.field column (cls, opt, len, desc, desig, gauge,
// sections, safe_cfs). The river page merges these on top of the
// static data/rivers.ts entries before rendering. See
// supabase/migrations/018_river_overrides.sql for the schema and
// app/rivers/[state]/[slug]/page.tsx for the merge logic.
export type RiverFieldOverrides = Record<string, string>

// Access points — mirrors public.river_access_points from migration
// 032 with confirmation count + viewer-confirmation flag joined in.
// Anonymous-friendly: pending submissions are visible immediately
// (gray dot) per the user's launch decision; only `rejected` rows
// are filtered out.
export type AccessVerificationStatus = 'pending' | 'verified' | 'needs_review' | 'rejected'

export interface PrefetchedAccessPoint {
  id: string
  river_id: string
  name: string
  description: string | null
  access_type: string | null
  ramp_surface: string | null
  trailer_access: boolean
  max_trailer_length_ft: number | null
  parking_capacity: string | null
  parking_fee: boolean
  fee_amount: string | null
  facilities: string[]
  lat: number | null
  lng: number | null
  river_mile: number | null
  distance_to_next_access_miles: number | null
  next_access_name: string | null
  float_time_to_next: string | null
  seasonal_notes: string | null
  submitted_by: string | null
  submitted_by_name: string | null
  verification_status: AccessVerificationStatus
  helpful_count: number
  last_verified_at: string | null
  last_verified_by: string | null
  created_at: string
  updated_at: string
  // Server-decorated count of confirmations (populated from a
  // batched count over the confirmations table). Drives the
  // "X confirmations" line under the freshness indicator.
  confirmation_count: number
}

// Q&A — mirrors public.river_questions / public.river_answers from
// migration 031. We prefetch questions + their top answers so the
// Q&A tab body renders server-side and Google indexes the actual
// question/answer text instead of an empty client shell.
//
// `contributor_count` is decorated server-side from the user_id
// column so the Q&A render can show a tier badge next to each
// display name without an N+1 client lookup. Anonymous rows
// (user_id null) get null and render no badge.
export interface PrefetchedQAAnswer {
  id: string
  display_name: string
  answer: string
  created_at: string
  helpful_count: number
  is_best_answer: boolean
  contributor_count: number | null
}

export interface PrefetchedQAQuestion {
  id: string
  river_id: string
  display_name: string
  question: string
  created_at: string
  answered: boolean
  helpful_count: number
  contributor_count: number | null
  answers: PrefetchedQAAnswer[]
}

export interface RiverPageData {
  tripReports: PrefetchedTripReport[]
  stockingEvents: PrefetchedStockingEvent[]
  outfitters: PrefetchedOutfitter[]
  hazards: PrefetchedHazard[]  // active, non-expired, non-hidden hazards
  permit: RiverPermit | null   // null = no permit required for this river
  fieldOverrides: RiverFieldOverrides
  // Tags from the static needsVerification array that have been
  // cleared by admin approval. The river page subtracts these from
  // the static list before rendering the DataConfidenceBanner.
  clearedVerificationTags: string[]
  hasSupabaseRapids: boolean   // for the verified-rapids confidence banner
  qa: PrefetchedQAQuestion[]   // Q&A tab — answered first, unanswered after
  accessPoints: PrefetchedAccessPoint[] // Maps & Guides tab — sorted by river_mile asc, nulls last
}

const TIER_ORDER: Record<string, number> = {
  destination: 0,
  sponsored: 1,
  featured: 2,
  guide: 3,
  listed: 4,
}

// Rank hazards by danger (critical first). Alphabetical ordering in SQL
// would give critical, info, warning — which buries warnings under info,
// so we sort in JS instead.
const SEVERITY_RANK: Record<string, number> = {
  critical: 0,
  warning: 1,
  info: 2,
}

// Empty result for when Supabase is not configured or fails entirely.
function emptyResult(): RiverPageData {
  return {
    tripReports: [],
    stockingEvents: [],
    outfitters: [],
    hazards: [],
    permit: null,
    fieldOverrides: {},
    clearedVerificationTags: [],
    hasSupabaseRapids: false,
    qa: [],
    accessPoints: [],
  }
}

/**
 * Fetch all public river page data in parallel.
 * Each query is wrapped so a failure in one doesn't block the others.
 * Returns empty arrays on total Supabase failure (rather than throwing) so
 * the page still renders.
 */
export async function fetchRiverPageData(
  riverId: string,
  stateKey: string,
): Promise<RiverPageData> {
  let supabase
  try {
    supabase = await createSupabaseServerClient()
  } catch {
    // Supabase env vars missing — fall back to empty data so the page renders.
    return emptyResult()
  }

  // All queries fire in parallel inside this single serverless function.
  // Compared to the old waterfall (4-6 client round trips post-hydration),
  // this is one server-to-Supabase round trip's worth of latency.
  const nowIso = new Date().toISOString()

  const [
    tripReportsRes, stockingRes, outfittersRes, rapidsRes, hazardsRes,
    permitRes, overridesRes, clearedTagsRes, qaQuestionsRes, accessPointsRes,
  ] = await Promise.all([
    supabase
      .from('trip_reports')
      .select('id, author_name, rating, flow_cfs, trip_date, body, photos, created_at')
      .eq('river_id', riverId)
      .order('created_at', { ascending: false })
      .limit(50),
    supabase
      .from('river_stocking')
      .select('id, stocking_date, is_scheduled, species, quantity, size_category, size_inches, location_description, stocking_authority, source_url, verified')
      .eq('river_id', riverId)
      .order('stocking_date', { ascending: false })
      .limit(50),
    supabase
      .from('outfitters')
      .select('id, business_name, description, website, phone, logo_url, cover_photo_url, tier, specialty_tags')
      .eq('active', true)
      .or(`river_ids.cs.{${riverId}},state_keys.cs.{${stateKey}}`),
    supabase
      .from('river_rapids')
      .select('id')
      .eq('river_id', riverId)
      .limit(1),
    // Hazards: only active, non-hidden, non-expired rows. We sort
    // critical → warning → info in JS below because Postgres orders the
    // text column alphabetically (critical, info, warning) which would
    // bury warnings under info.
    supabase
      .from('river_hazards')
      .select('id, river_id, hazard_type, severity, title, description, location_description, mile_marker, reporter_name, created_at, expires_at, confirmations, last_confirmed_at, reported_by')
      .eq('river_id', riverId)
      .eq('active', true)
      .eq('admin_hidden', false)
      .gt('expires_at', nowIso)
      .order('created_at', { ascending: false }),
    // Permit row — at most one per river. .maybeSingle() returns
    // {data: null, error: null} for the no-row case (most rivers).
    supabase
      .from('river_permits')
      .select('*')
      .eq('river_id', riverId)
      .maybeSingle(),
    // Field overrides — admin-approved field changes that take
    // precedence over the static data/rivers.ts values. Most rivers
    // have zero rows here.
    supabase
      .from('river_field_overrides')
      .select('field, value')
      .eq('river_id', riverId),
    // Cleared verification tags — entries from the static
    // needsVerification array that admin approval has marked as
    // resolved. Subtracted from the static list at render time.
    supabase
      .from('river_cleared_verification_tags')
      .select('tag')
      .eq('river_id', riverId),
    // Q&A — pull active questions for this river. We'll fetch the
    // matching answers in a separate small query and stitch them
    // in JS, since Supabase nested-select with manual FKs is
    // brittle (same constraint that forces us to do trip_reports
    // the same way). Limit to 100 questions per page — beyond that
    // we'd want pagination, but no river is anywhere near that yet.
    //
    // user_id is included so the renderer can attach a contributor
    // tier badge next to each display name. Anonymous rows have a
    // null user_id and render no badge.
    supabase
      .from('river_questions')
      .select('id, river_id, user_id, display_name, question, created_at, answered, helpful_count')
      .eq('river_id', riverId)
      .eq('status', 'active')
      .order('answered', { ascending: false })       // answered first
      .order('created_at', { ascending: false })     // newest within group
      .limit(100),
    // Access points — anything except rejected. Sorted by river
    // mile (nulls last) so the public render renders upstream→
    // downstream when river_mile data is available, falling back
    // to creation order for points without a milepost.
    supabase
      .from('river_access_points')
      .select('*')
      .eq('river_id', riverId)
      .neq('verification_status', 'rejected')
      .order('river_mile', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: true })
      .limit(50),
  ])

  // Sort outfitters by tier priority (destination → listed)
  const outfitters = ((outfittersRes.data ?? []) as PrefetchedOutfitter[])
    .slice()
    .sort((a, b) => (TIER_ORDER[a.tier] ?? 5) - (TIER_ORDER[b.tier] ?? 5))

  // Sort hazards by severity rank (critical → warning → info), preserving
  // created_at ordering within each rank since Postgres already ordered
  // the input by created_at desc.
  const hazards = ((hazardsRes.data ?? []) as PrefetchedHazard[])
    .slice()
    .sort((a, b) => (SEVERITY_RANK[a.severity] ?? 9) - (SEVERITY_RANK[b.severity] ?? 9))

  // Build the field-override map. Last value wins on duplicates,
  // but the unique(river_id, field) constraint should prevent dupes.
  const fieldOverrides: RiverFieldOverrides = {}
  for (const row of (overridesRes.data ?? []) as Array<{ field: string; value: string }>) {
    fieldOverrides[row.field] = row.value
  }

  const clearedVerificationTags = ((clearedTagsRes.data ?? []) as Array<{ tag: string }>)
    .map(r => r.tag)

  // Stitch answers onto each question. We do a single follow-up
  // query for ALL answers across the prefetched questions rather
  // than N+1 queries. Each question gets its top answers (sorted
  // by best_answer first, then helpful_count desc). The Q&A tab UI
  // shows the top one inline and offers an expander for the rest.
  const questionRows = (qaQuestionsRes.data ?? []) as Array<{
    id: string; river_id: string; user_id: string | null; display_name: string;
    question: string; created_at: string; answered: boolean; helpful_count: number;
  }>
  let qa: PrefetchedQAQuestion[] = []
  if (questionRows.length > 0) {
    const questionIds = questionRows.map(q => q.id)
    const answersRes = await supabase
      .from('river_answers')
      .select('id, question_id, user_id, display_name, answer, created_at, helpful_count, is_best_answer')
      .in('question_id', questionIds)
      .eq('status', 'active')
      .order('is_best_answer', { ascending: false })
      .order('helpful_count', { ascending: false })
      .order('created_at', { ascending: true })

    type AnswerRowWithUser = {
      id: string; question_id: string; user_id: string | null;
      display_name: string; answer: string; created_at: string;
      helpful_count: number; is_best_answer: boolean;
    }
    const answerRows = (answersRes.data ?? []) as AnswerRowWithUser[]

    // Batch-fetch contributor counts for every unique user_id that
    // owns a question or an answer on this river page. Single round
    // trip vs N+1.
    const allUserIds: string[] = []
    for (const q of questionRows) if (q.user_id) allUserIds.push(q.user_id)
    for (const a of answerRows) if (a.user_id) allUserIds.push(a.user_id)
    const counts = await fetchContributorCounts(supabase, allUserIds)

    const answersByQuestion = new Map<string, PrefetchedQAAnswer[]>()
    for (const a of answerRows) {
      const list = answersByQuestion.get(a.question_id) ?? []
      // Strip question_id and user_id off the row before storing —
      // the parent question already owns it, and we replace user_id
      // with the contributor_count needed by the renderer.
      const { question_id: _qid, user_id: aUid, ...rest } = a
      list.push({
        ...rest,
        contributor_count: aUid ? (counts[aUid] ?? 0) : null,
      })
      answersByQuestion.set(a.question_id, list)
    }
    qa = questionRows.map(q => {
      const { user_id: qUid, ...rest } = q
      return {
        ...rest,
        contributor_count: qUid ? (counts[qUid] ?? 0) : null,
        answers: answersByQuestion.get(q.id) ?? [],
      }
    })
  }

  // ── Access points ──
  // We pulled the rows above; here we batch-fetch confirmation
  // counts for all of them in one query and stitch the count
  // onto each row. Far cheaper than N+1 client-side counts.
  const apRows = (accessPointsRes.data ?? []) as Array<Record<string, unknown>>
  let accessPoints: PrefetchedAccessPoint[] = []
  if (apRows.length > 0) {
    const apIds = apRows.map(r => r.id as string)
    const { data: confRows } = await supabase
      .from('river_access_point_confirmations')
      .select('access_point_id')
      .in('access_point_id', apIds)
    const countByAp: Record<string, number> = {}
    for (const c of (confRows ?? []) as Array<{ access_point_id: string }>) {
      countByAp[c.access_point_id] = (countByAp[c.access_point_id] ?? 0) + 1
    }
    accessPoints = apRows.map(r => ({
      id: r.id as string,
      river_id: r.river_id as string,
      name: r.name as string,
      description: (r.description as string | null) ?? null,
      access_type: (r.access_type as string | null) ?? null,
      ramp_surface: (r.ramp_surface as string | null) ?? null,
      trailer_access: !!r.trailer_access,
      max_trailer_length_ft: (r.max_trailer_length_ft as number | null) ?? null,
      parking_capacity: (r.parking_capacity as string | null) ?? null,
      parking_fee: !!r.parking_fee,
      fee_amount: (r.fee_amount as string | null) ?? null,
      facilities: ((r.facilities as string[] | null) ?? []),
      lat: r.lat != null ? Number(r.lat) : null,
      lng: r.lng != null ? Number(r.lng) : null,
      river_mile: r.river_mile != null ? Number(r.river_mile) : null,
      distance_to_next_access_miles: r.distance_to_next_access_miles != null
        ? Number(r.distance_to_next_access_miles) : null,
      next_access_name: (r.next_access_name as string | null) ?? null,
      float_time_to_next: (r.float_time_to_next as string | null) ?? null,
      seasonal_notes: (r.seasonal_notes as string | null) ?? null,
      submitted_by: (r.submitted_by as string | null) ?? null,
      submitted_by_name: (r.submitted_by_name as string | null) ?? null,
      verification_status: (r.verification_status as AccessVerificationStatus) ?? 'pending',
      helpful_count: (r.helpful_count as number | null) ?? 0,
      last_verified_at: (r.last_verified_at as string | null) ?? null,
      last_verified_by: (r.last_verified_by as string | null) ?? null,
      created_at: r.created_at as string,
      updated_at: r.updated_at as string,
      confirmation_count: countByAp[r.id as string] ?? 0,
    }))
  }

  return {
    tripReports: (tripReportsRes.data ?? []) as PrefetchedTripReport[],
    stockingEvents: (stockingRes.data ?? []) as PrefetchedStockingEvent[],
    outfitters,
    hazards,
    permit: (permitRes.data ?? null) as RiverPermit | null,
    fieldOverrides,
    clearedVerificationTags,
    hasSupabaseRapids: !!(rapidsRes.data && rapidsRes.data.length > 0),
    qa,
    accessPoints,
  }
}
