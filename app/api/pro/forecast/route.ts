import { NextRequest, NextResponse } from 'next/server'
import { fetchExternalJson } from '@/lib/noaa-fetch'
import { createSupabaseClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// Hardcoded fallback for when gauge_mappings table is unavailable.
// Primary source of truth is the gauge_mappings Supabase table (see migration 014).
const HARDCODED_FALLBACK: Record<string, string> = {
  '04136000': 'RDOM4', '04136500': 'MIOM4', '04136900': 'MCKM4',
  '04137005': 'CSVM4', '04137500': 'ASBM4',
  '04123500': 'GYMM4', '04124000': 'SHRM4', '04124200': 'MSKM4',
  '04125550': 'WLSM4', '04121970': 'CROM4', '04116000': 'IONM4',
  '04157005': 'SAGM4', '04156000': 'MIDM4',
  '06043500': 'GLGM8', '06192500': 'LIVM8', '03189600': 'SUMW2',
}

interface ForecastPoint {
  time: string
  cfs: number
  stage: number | null
}

interface GaugeMapping {
  nws_lid: string | null
  status: 'pending' | 'found' | 'not_found' | 'error'
}

const FORECAST_CACHE_TTL_MS = 30 * 60 * 1000 // 30 minutes
const NOT_FOUND_RETRY_DAYS = 30 // re-check unknowns after 30 days

/**
 * Get NWS LID for a USGS site, with discovery + caching.
 * Priority: gauge_mappings table → NOAA discovery → hardcoded fallback
 */
async function getNwsLid(usgsSiteId: string): Promise<string | null> {
  const supabase = createSupabaseClient()

  // 1. Check gauge_mappings table first (instant)
  try {
    const { data: cached } = await supabase
      .from('gauge_mappings')
      .select('nws_lid, status, last_verified')
      .eq('usgs_site_id', usgsSiteId)
      .single()

    if (cached) {
      if (cached.status === 'found' && cached.nws_lid) {
        return cached.nws_lid
      }
      if (cached.status === 'not_found') {
        // Re-check old not_found entries every 30 days in case NWS adds the gauge
        const age = Date.now() - new Date(cached.last_verified).getTime()
        if (age < NOT_FOUND_RETRY_DAYS * 86400000) {
          return null // Definitely not in NWS
        }
        // else fall through to re-discover
      }
    }
  } catch { /* table missing or query failed — fall through */ }

  // 2. Try hardcoded fallback (in case the table doesn't exist yet)
  if (HARDCODED_FALLBACK[usgsSiteId]) {
    return HARDCODED_FALLBACK[usgsSiteId]
  }

  // 3. Discover from NOAA API (timeout-safe, retries built in)
  const discovered = await discoverNwsLid(usgsSiteId)

  // 4. Cache the result regardless of success/failure
  try {
    await supabase
      .from('gauge_mappings')
      .upsert({
        usgs_site_id: usgsSiteId,
        nws_lid: discovered,
        has_forecast: discovered !== null,
        status: discovered ? 'found' : 'not_found',
        discovered_at: new Date().toISOString(),
        last_verified: new Date().toISOString(),
      }, { onConflict: 'usgs_site_id' })
  } catch { /* cache write failure is non-critical */ }

  return discovered
}

/**
 * Query NOAA NWPS API to find the NWS LID for a USGS site.
 * Returns null on timeout, 404, or any failure.
 */
async function discoverNwsLid(usgsSiteId: string): Promise<string | null> {
  const url = `https://api.water.noaa.gov/nwps/v1/gauges?usgsSiteId=${usgsSiteId}`
  const data = await fetchExternalJson<{ gauges?: Array<{ lid?: string; nwsLid?: string }> } | Array<{ lid?: string; nwsLid?: string }>>(
    url,
    { timeoutMs: 8000, retries: 1 }
  )
  if (!data) return null

  try {
    // NOAA returns either { gauges: [...] } or [...] depending on version
    const gauges = Array.isArray(data) ? data : data.gauges
    if (!gauges || gauges.length === 0) return null

    const gauge = gauges[0]
    return gauge.lid || gauge.nwsLid || null
  } catch {
    return null
  }
}

// GET /api/pro/forecast?gaugeId=... — fetch 72-hour river forecast from NWS
export async function GET(req: NextRequest) {
  const gaugeId = req.nextUrl.searchParams.get('gaugeId')
  if (!gaugeId) {
    return NextResponse.json({ error: 'gaugeId required' }, { status: 400 })
  }

  const nwsId = await getNwsLid(gaugeId)
  if (!nwsId) {
    return NextResponse.json({
      error: 'no_forecast',
      message: 'No NWS forecast available for this gauge',
    }, { status: 404 })
  }

  const supabase = createSupabaseClient()

  // Check forecast cache (30-min TTL)
  let cached: { forecasts: ForecastPoint[]; fetched_at: string } | null = null
  try {
    const { data } = await supabase
      .from('forecast_cache')
      .select('forecasts, fetched_at')
      .eq('gauge_id', gaugeId)
      .single()
    cached = data
  } catch { /* cache miss is fine */ }

  if (cached) {
    const age = Date.now() - new Date(cached.fetched_at).getTime()
    if (age < FORECAST_CACHE_TTL_MS) {
      return NextResponse.json({
        nwsId,
        available: true,
        forecasts: cached.forecasts,
        cached: true,
        cacheAge: Math.round(age / 1000),
      })
    }
  }

  // Fetch from NOAA with timeout + retry — never hangs
  const url = `https://api.water.noaa.gov/nwps/v1/gauges/${nwsId}/stageflow/forecast`
  const json = await fetchExternalJson<Record<string, unknown>>(url, { timeoutMs: 10000, retries: 1 })

  if (!json) {
    // Fall back to stale cache if available
    if (cached) {
      return NextResponse.json({
        nwsId,
        available: true,
        forecasts: cached.forecasts,
        cached: true,
        stale: true,
        message: 'Showing cached forecast — NOAA temporarily unavailable',
      })
    }
    return NextResponse.json({
      error: 'unavailable',
      message: 'Forecast temporarily unavailable',
    }, { status: 503 })
  }

  const forecasts = parseForecast(json)

  if (forecasts.length === 0) {
    return NextResponse.json({
      nwsId,
      available: false,
      message: 'Forecast data not available',
      forecasts: [],
    })
  }

  // Update forecast cache
  try {
    await supabase
      .from('forecast_cache')
      .upsert({
        gauge_id: gaugeId,
        nws_id: nwsId,
        forecasts,
        fetched_at: new Date().toISOString(),
      }, { onConflict: 'gauge_id' })
  } catch { /* cache write failure is non-critical */ }

  return NextResponse.json({
    nwsId,
    available: true,
    forecasts,
    generatedAt: new Date().toISOString(),
  })
}

function parseForecast(json: Record<string, unknown>): ForecastPoint[] {
  const forecasts: ForecastPoint[] = []

  try {
    const data = json as Record<string, unknown>
    const projections = (data.projections || data.data || data.forecast) as Array<Record<string, unknown>> | undefined

    if (Array.isArray(projections)) {
      const now = new Date()
      const cutoff = new Date(now.getTime() + 72 * 60 * 60 * 1000)

      for (const p of projections) {
        const time = String(p.validTime || p.dateTime || p.time || '')
        const flow = Number(p.flow || p.discharge || p.primary || 0)
        const stage = p.stage != null ? Number(p.stage) : null

        if (!time || isNaN(flow) || flow <= 0) continue

        const t = new Date(time)
        if (t > cutoff) break
        if (t < now) continue

        forecasts.push({ time, cfs: Math.round(flow), stage })
      }
    }
  } catch { /* parsing failed */ }

  return forecasts
}
