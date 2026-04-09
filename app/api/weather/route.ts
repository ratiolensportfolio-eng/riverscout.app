import { NextRequest, NextResponse } from 'next/server'
import { fetchRiverWeather } from '@/lib/weather'
import { RIVER_COORDS } from '@/data/river-coordinates'

export const dynamic = 'force-dynamic'

// GET /api/weather?riverId=... — fetch weather for a river
export async function GET(req: NextRequest) {
  const riverId = req.nextUrl.searchParams.get('riverId')
  if (!riverId) {
    return NextResponse.json({ error: 'riverId required' }, { status: 400 })
  }

  const coords = RIVER_COORDS[riverId]
  if (!coords) {
    return NextResponse.json({ error: 'No coordinates for this river', riverId }, { status: 404 })
  }

  const [lat, lng] = coords

  try {
    const weather = await fetchRiverWeather(lat, lng)

    if (!weather) {
      return NextResponse.json({ error: 'Weather data unavailable', lat, lng }, { status: 502 })
    }

    return NextResponse.json(weather)
  } catch (err) {
    console.error('Weather API error:', err)
    return NextResponse.json({ error: 'Weather fetch failed', lat, lng }, { status: 500 })
  }
}
