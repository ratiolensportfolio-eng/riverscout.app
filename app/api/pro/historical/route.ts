import { NextRequest, NextResponse } from 'next/server'

const DV_BASE = 'https://waterservices.usgs.gov/nwis/dv/'

// Vercel edge cache window — matches USGS gauge update frequency.
// Combined with the Cache-Control header below, this serves cached responses
// instantly and revalidates in the background.
export const revalidate = 900 // 15 minutes

// GET /api/pro/historical?gaugeId=...&years=10 — fetch historical daily values
// Returns weekly averages for the past N years grouped by week-of-year
export async function GET(req: NextRequest) {
  const gaugeId = req.nextUrl.searchParams.get('gaugeId')
  const years = parseInt(req.nextUrl.searchParams.get('years') || '10')

  if (!gaugeId) {
    return NextResponse.json({ error: 'gaugeId required' }, { status: 400 })
  }

  const endDate = new Date()
  const startDate = new Date()
  startDate.setFullYear(startDate.getFullYear() - years)

  const start = startDate.toISOString().split('T')[0]
  const end = endDate.toISOString().split('T')[0]

  const url = `${DV_BASE}?format=json&sites=${gaugeId}&parameterCd=00060&startDT=${start}&endDT=${end}&siteStatus=all`

  try {
    const res = await fetch(url, { next: { revalidate: 86400 } }) // 24hr cache
    if (!res.ok) {
      return NextResponse.json({ error: `USGS responded ${res.status}` }, { status: 502 })
    }

    const json = await res.json()
    const series = json?.value?.timeSeries?.[0]
    const values: Array<{ dateTime: string; value: string }> = series?.values?.[0]?.value ?? []

    // Group by week-of-year and compute stats
    const weekBuckets: Record<number, number[]> = {}
    for (const v of values) {
      const cfs = Number(v.value)
      if (isNaN(cfs) || cfs < 0) continue

      const d = new Date(v.dateTime)
      const dayOfYear = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000)
      const week = Math.floor(dayOfYear / 7)

      if (!weekBuckets[week]) weekBuckets[week] = []
      weekBuckets[week].push(cfs)
    }

    // Compute weekly stats
    const weeks: Array<{
      week: number
      month: string
      avg: number
      median: number
      p10: number
      p90: number
      min: number
      max: number
      samples: number
    }> = []

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    for (let w = 0; w < 52; w++) {
      const bucket = weekBuckets[w]
      if (!bucket || bucket.length === 0) continue

      const sorted = [...bucket].sort((a, b) => a - b)
      const avg = Math.round(sorted.reduce((a, b) => a + b, 0) / sorted.length)
      const median = Math.round(sorted[Math.floor(sorted.length / 2)])
      const p10 = Math.round(sorted[Math.floor(sorted.length * 0.1)])
      const p90 = Math.round(sorted[Math.floor(sorted.length * 0.9)])

      // Approximate month for this week
      const approxDate = new Date(2024, 0, w * 7 + 1)
      const month = monthNames[approxDate.getMonth()]

      weeks.push({
        week: w,
        month,
        avg,
        median,
        p10,
        p90,
        min: sorted[0],
        max: sorted[sorted.length - 1],
        samples: sorted.length,
      })
    }

    return NextResponse.json(
      {
        gaugeId,
        years,
        totalReadings: values.length,
        weeks,
      },
      {
        headers: {
          // Serve cached responses instantly from the Vercel edge for 15 min,
          // then keep serving the stale copy for up to 30 min while a fresh
          // one fetches in the background. Matches USGS update cadence.
          'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800',
        },
      },
    )
  } catch (err) {
    console.error('Historical fetch error:', err)
    return NextResponse.json({ error: 'Failed to fetch historical data' }, { status: 500 })
  }
}
