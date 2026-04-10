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

export interface RiverPageData {
  tripReports: PrefetchedTripReport[]
  stockingEvents: PrefetchedStockingEvent[]
  outfitters: PrefetchedOutfitter[]
  hazards: PrefetchedHazard[]  // active, non-expired, non-hidden hazards
  hasSupabaseRapids: boolean   // for the verified-rapids confidence banner
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
    hasSupabaseRapids: false,
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

  const [tripReportsRes, stockingRes, outfittersRes, rapidsRes, hazardsRes] = await Promise.all([
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

  return {
    tripReports: (tripReportsRes.data ?? []) as PrefetchedTripReport[],
    stockingEvents: (stockingRes.data ?? []) as PrefetchedStockingEvent[],
    outfitters,
    hazards,
    hasSupabaseRapids: !!(rapidsRes.data && rapidsRes.data.length > 0),
  }
}
