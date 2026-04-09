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

export interface RiverPageData {
  tripReports: PrefetchedTripReport[]
  stockingEvents: PrefetchedStockingEvent[]
  outfitters: PrefetchedOutfitter[]
  hasSupabaseRapids: boolean   // for the verified-rapids confidence banner
}

const TIER_ORDER: Record<string, number> = {
  destination: 0,
  sponsored: 1,
  featured: 2,
  guide: 3,
  listed: 4,
}

// Empty result for when Supabase is not configured or fails entirely.
function emptyResult(): RiverPageData {
  return {
    tripReports: [],
    stockingEvents: [],
    outfitters: [],
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
  const [tripReportsRes, stockingRes, outfittersRes, rapidsRes] = await Promise.all([
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
  ])

  // Sort outfitters by tier priority (destination → listed)
  const outfitters = ((outfittersRes.data ?? []) as PrefetchedOutfitter[])
    .slice()
    .sort((a, b) => (TIER_ORDER[a.tier] ?? 5) - (TIER_ORDER[b.tier] ?? 5))

  return {
    tripReports: (tripReportsRes.data ?? []) as PrefetchedTripReport[],
    stockingEvents: (stockingRes.data ?? []) as PrefetchedStockingEvent[],
    outfitters,
    hasSupabaseRapids: !!(rapidsRes.data && rapidsRes.data.length > 0),
  }
}
