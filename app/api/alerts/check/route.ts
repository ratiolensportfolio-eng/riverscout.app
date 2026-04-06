import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'
import { fetchGaugeData, formatCfs } from '@/lib/usgs'
import { getRiver } from '@/data/rivers'

// GET /api/alerts/check?key=... — cron job to check conditions and queue notifications
// Secured by a simple API key in the query string (set CRON_SECRET env var)
export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && key !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createSupabaseClient()

  // Fetch all active alerts
  const { data: alerts, error } = await supabase
    .from('flow_alerts')
    .select('*')
    .eq('active', true)

  if (error || !alerts) {
    return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 })
  }

  if (alerts.length === 0) {
    return NextResponse.json({ checked: 0, triggered: 0 })
  }

  // Group alerts by river to avoid duplicate USGS fetches
  const byRiver = new Map<string, typeof alerts>()
  for (const alert of alerts) {
    const list = byRiver.get(alert.river_id) ?? []
    list.push(alert)
    byRiver.set(alert.river_id, list)
  }

  let checked = 0
  let triggered = 0
  const notifications: Array<{ email: string; riverName: string; cfs: number; condition: string; threshold: string }> = []

  for (const [riverId, riverAlerts] of byRiver) {
    const river = getRiver(riverId)
    if (!river) continue

    try {
      const flow = await fetchGaugeData(river.g, river.opt)
      checked++

      if (flow.cfs === null) continue

      for (const alert of riverAlerts) {
        const shouldFire =
          alert.threshold === 'any' ||
          (alert.threshold === 'optimal' && flow.condition === 'optimal') ||
          (alert.threshold === 'high' && (flow.condition === 'high' || flow.condition === 'flood')) ||
          (alert.threshold === 'flood' && flow.condition === 'flood')

        if (!shouldFire) continue

        // Check if we already notified in the last 12 hours
        const lastNotified = alert.last_notified_at ? new Date(alert.last_notified_at) : null
        const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000)

        if (lastNotified && lastNotified > twelveHoursAgo) continue

        triggered++
        notifications.push({
          email: alert.email,
          riverName: alert.river_name,
          cfs: flow.cfs,
          condition: flow.condition,
          threshold: alert.threshold,
        })

        // Update last_notified_at
        await supabase
          .from('flow_alerts')
          .update({ last_notified_at: new Date().toISOString() })
          .eq('id', alert.id)
      }
    } catch {
      // Skip this river if USGS fetch fails
      continue
    }
  }

  // Send notifications (log for now — integrate Resend/SendGrid/Supabase Edge Functions later)
  for (const n of notifications) {
    console.log(
      `[FLOW ALERT] ${n.email}: ${n.riverName} is at ${formatCfs(n.cfs)} cfs (${n.condition}) — threshold: ${n.threshold}`
    )

    // TODO: Send email via Resend or Supabase Edge Function
    // await sendAlertEmail(n.email, n.riverName, n.cfs, n.condition)
  }

  return NextResponse.json({
    checked,
    triggered,
    notifications: notifications.map(n => ({
      email: n.email.replace(/(.{2}).*(@.*)/, '$1***$2'),
      river: n.riverName,
      cfs: n.cfs,
      condition: n.condition,
    })),
  })
}
