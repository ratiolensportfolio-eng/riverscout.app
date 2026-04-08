import { NextRequest, NextResponse } from 'next/server'
import { fetchRiverWeather } from '@/lib/weather'
import { RIVER_COORDS } from '@/data/river-coordinates'

// GET /api/weather?riverId=... — fetch weather for a river
export async function GET(req: NextRequest) {
  const riverId = req.nextUrl.searchParams.get('riverId')
  if (!riverId) {
    return NextResponse.json({ error: 'riverId required' }, { status: 400 })
  }

  const coords = RIVER_COORDS[riverId]
  if (!coords) {
    return NextResponse.json({ error: 'No coordinates for this river' }, { status: 404 })
  }

  const [lat, lng] = coords
  const weather = await fetchRiverWeather(lat, lng)

  if (!weather) {
    return NextResponse.json({ error: 'Weather data unavailable' }, { status: 502 })
  }

  return NextResponse.json(weather)
}
