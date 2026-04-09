import { NextRequest, NextResponse } from 'next/server'
import { fetchNoaaJson } from '@/lib/noaa-fetch'
import { createSupabaseClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// NWS AHPS river forecast API
// Maps USGS gauge IDs to NWS location IDs (AHPS 5-char codes)
const USGS_TO_NWS: Record<string, string> = {
  // Michigan
  '04137500': 'MIOM4',  // Au Sable at Mio
  '04125460': 'PHRM4',  // Pine River
  '04126000': 'MNTM4',  // Manistee
  '04121500': 'NWGM4',  // Muskegon at Newaygo
  '04122500': 'PRMM4',  // Pere Marquette
  // Colorado
  '07094500': 'ARPC2',  // Arkansas at Parkdale
  '07091200': 'BVEC2',  // Arkansas at Buena Vista
  // West Virginia
  '03189600': 'SMWV2',  // Gauley at Summersville
  '03185400': 'FYWV2',  // New River at Fayette
  // Idaho
  '13317000': 'SALI1',  // Salmon at Salmon
  // Oregon
  '14048000': 'DESO3',  // Deschutes at Moody
  '14359000': 'GRPO3',  // Rogue at Grants Pass
  // Montana
  '06052500': 'GALM8',  // Gallatin at Gallatin Gateway
  '06192500': 'YLSM8',  // Yellowstone at Livingston
  // Pennsylvania
  '03082500': 'OHPM4',  // Youghiogheny at Ohiopyle
  // Tennessee
  '03566000': 'OCOT1',  // Ocoee
  // North Carolina
  '03504000': 'NANP1',  // Nantahala
  // Maine
  '01034500': 'WVLM1',  // Penobscot
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
