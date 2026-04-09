import { NextRequest, NextResponse } from 'next/server'
import { fetchNoaaJson } from '@/lib/noaa-fetch'
import { createSupabaseClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// NWS AHPS river forecast API
// Maps USGS gauge IDs to NWS location IDs (AHPS 5-char codes)
// VERIFIED via individual lookups against api.water.noaa.gov/nwps/v1/gauges/{lid}
// To add more: visit water.noaa.gov/gauges/{lid}, confirm the USGS site number,
// and add the mapping below.
const USGS_TO_NWS: Record<string, string> = {
  // Michigan — Au Sable chain (verified)
  '04136000': 'RDOM4',  // Au Sable near Red Oak
  '04136500': 'MIOM4',  // Au Sable at Mio (Mio Dam)
  '04136900': 'MCKM4',  // Au Sable near McKinley
  '04137005': 'CSVM4',  // Au Sable at Curtisville (Alcona Dam)
  '04137500': 'ASBM4',  // Au Sable near Au Sable (mouth)

  // Michigan — Manistee chain (verified)
  '04123500': 'GYMM4',  // Manistee near Grayling
  '04124000': 'SHRM4',  // Manistee near Sherman
  '04124200': 'MSKM4',  // Manistee near Mesick (Hodenpyl Dam)
  '04125550': 'WLSM4',  // Manistee at Wellston (Tippy Dam)

  // Michigan — Muskegon (verified)
  '04121970': 'CROM4',  // Muskegon near Croton (Croton Dam)

  // Michigan — Grand River (verified)
  '04116000': 'IONM4',  // Grand River at Ionia

  // Michigan — other (verified)
  '04157005': 'SAGM4',  // Saginaw at Saginaw
  '04156000': 'MIDM4',  // Tittabawassee at Midland

  // Montana (verified)
  '06043500': 'GLGM8',  // Gallatin near Gallatin Gateway
  '06192500': 'LIVM8',  // Yellowstone at Livingston

  // West Virginia (verified)
  '03189600': 'SUMW2',  // Gauley below Summersville Lake
}

interface ForecastPoint {
  time: string
  cfs: number
  stage: number | null
}

const CACHE_TTL_MS = 30 * 60 * 1000 // 30 minutes

// GET /api/pro/forecast?gaugeId=... — fetch 72-hour river forecast from NWS
export async function GET(req: NextRequest) {
  const gaugeId = req.nextUrl.searchParams.get('gaugeId')
  if (!gaugeId) {
    return NextResponse.json({ error: 'gaugeId required' }, { status: 400 })
  }

  const nwsId = USGS_TO_NWS[gaugeId]
  if (!nwsId) {
    return NextResponse.json({
      error: 'no_forecast',
      message: 'No NWS forecast available for this gauge',
    }, { status: 404 })
  }

  // Check Supabase cache first (30-min TTL)
  const supabase = createSupabaseClient()
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
    if (age < CACHE_TTL_MS) {
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
  const json = await fetchNoaaJson<Record<string, unknown>>(url, { timeoutMs: 10000, retries: 1 })

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

  // Update cache
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
