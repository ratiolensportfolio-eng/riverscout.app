import { NextRequest, NextResponse } from 'next/server'

// NWS AHPS river forecast API
// Maps USGS gauge IDs to NWS location IDs (AHPS 5-char codes)
// This is a subset — expand as needed
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

// GET /api/pro/forecast?gaugeId=... — fetch 72-hour river forecast from NWS
export async function GET(req: NextRequest) {
  const gaugeId = req.nextUrl.searchParams.get('gaugeId')
  if (!gaugeId) {
    return NextResponse.json({ error: 'gaugeId required' }, { status: 400 })
  }

  const nwsId = USGS_TO_NWS[gaugeId]
  if (!nwsId) {
    return NextResponse.json({ error: 'no_forecast', message: 'No NWS forecast available for this gauge' }, { status: 404 })
  }

  // NWS AHPS XML-to-JSON endpoint
  const url = `https://api.water.noaa.gov/nwps/v1/gauges/${nwsId}/stageflow/forecast`

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 }, // 1hr cache
      headers: { 'Accept': 'application/json' },
    })

    if (!res.ok) {
      // Try alternate endpoint format
      const altUrl = `https://api.water.noaa.gov/nwps/v1/gauges/${nwsId.toLowerCase()}/stageflow/forecast`
      const altRes = await fetch(altUrl, {
        next: { revalidate: 3600 },
        headers: { 'Accept': 'application/json' },
      })

      if (!altRes.ok) {
        return NextResponse.json({ error: 'no_forecast', message: 'Forecast unavailable from NWS' }, { status: 404 })
      }

      const altJson = await altRes.json()
      return parseForecast(altJson, nwsId)
    }

    const json = await res.json()
    return parseForecast(json, nwsId)
  } catch (err) {
    console.error('Forecast fetch error:', err)
    return NextResponse.json({ error: 'Failed to fetch forecast' }, { status: 500 })
  }
}

function parseForecast(json: Record<string, unknown>, nwsId: string) {
  // NWS NWPS API returns forecast data in various formats
  // Try to extract time-series flow predictions
  const forecasts: ForecastPoint[] = []

  try {
    // Handle the NWPS v1 format
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
  } catch {
    // Parsing failed
  }

  if (forecasts.length === 0) {
    return NextResponse.json({
      nwsId,
      available: false,
      message: 'Forecast data not available in expected format',
      forecasts: [],
    })
  }

  return NextResponse.json({
    nwsId,
    available: true,
    forecasts,
    generatedAt: new Date().toISOString(),
  })
}
