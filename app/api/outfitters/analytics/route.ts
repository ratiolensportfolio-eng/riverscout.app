import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'

// GET /api/outfitters/analytics?outfitterId=...&userId=...
// Returns click analytics for an outfitter's dashboard
export async function GET(req: NextRequest) {
  const outfitterId = req.nextUrl.searchParams.get('outfitterId')
  const userId = req.nextUrl.searchParams.get('userId')

  if (!outfitterId || !userId) {
    return NextResponse.json({ error: 'outfitterId and userId required' }, { status: 400 })
  }

  const supabase = createSupabaseClient()

  // Verify this user owns the outfitter
  const { data: outfitter } = await supabase
    .from('outfitters')
    .select('id, user_id, business_name, tier')
    .eq('id', outfitterId)
    .eq('user_id', userId)
    .single()

  if (!outfitter) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const now = new Date()
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString()

  // Fetch this month's clicks
  const { data: thisMonthClicks } = await supabase
    .from('outfitter_clicks')
    .select('river_id, source, clicked_at')
    .eq('outfitter_id', outfitterId)
    .gte('clicked_at', thisMonthStart)

  // Fetch last month's clicks
  const { data: lastMonthClicks } = await supabase
    .from('outfitter_clicks')
    .select('river_id, source, clicked_at')
    .eq('outfitter_id', outfitterId)
    .gte('clicked_at', lastMonthStart)
    .lte('clicked_at', lastMonthEnd)

  const clicks = thisMonthClicks || []
  const prevClicks = lastMonthClicks || []

  // Clicks by river
  const byRiver: Record<string, number> = {}
  for (const c of clicks) {
    const rid = c.river_id || 'unknown'
    byRiver[rid] = (byRiver[rid] || 0) + 1
  }

  // Clicks by source
  const bySource: Record<string, number> = {}
  for (const c of clicks) {
    const src = c.source || 'direct'
    bySource[src] = (bySource[src] || 0) + 1
  }

  // Daily breakdown for chart (this month)
  const daily: Record<string, number> = {}
  for (const c of clicks) {
    const day = c.clicked_at.slice(0, 10) // YYYY-MM-DD
    daily[day] = (daily[day] || 0) + 1
  }

  const totalThisMonth = clicks.length
  const totalLastMonth = prevClicks.length
  const monthOverMonth = totalLastMonth > 0
    ? Math.round(((totalThisMonth - totalLastMonth) / totalLastMonth) * 100)
    : totalThisMonth > 0 ? 100 : 0

  // Estimated bookings (3-5% conversion)
  const estBookingsLow = Math.round(totalThisMonth * 0.03)
  const estBookingsHigh = Math.round(totalThisMonth * 0.05)

  return NextResponse.json({
    outfitter: {
      id: outfitter.id,
      businessName: outfitter.business_name,
      tier: outfitter.tier,
    },
    period: {
      thisMonth: new Date(now.getFullYear(), now.getMonth(), 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      lastMonth: new Date(now.getFullYear(), now.getMonth() - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    },
    clicksThisMonth: totalThisMonth,
    clicksLastMonth: totalLastMonth,
    monthOverMonth,
    byRiver: Object.entries(byRiver)
      .map(([riverId, count]) => ({ riverId, count }))
      .sort((a, b) => b.count - a.count),
    bySource: Object.entries(bySource)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count),
    daily: Object.entries(daily)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date)),
    estimatedBookings: {
      low: estBookingsLow,
      high: estBookingsHigh,
      rate: '3–5%',
    },
  })
}
