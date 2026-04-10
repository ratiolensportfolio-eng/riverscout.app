import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'
import { fetchGaugeData, formatCfs } from '@/lib/usgs'
import { getRiver } from '@/data/rivers'
import { sendEmail, flowAlertEmail } from '@/lib/email'

// Cron route — must run fresh every invocation. Caching the response would
// silently skip alert checks. The underlying fetchGaugeData call still uses
// the lib/usgs.ts 15-min fetch cache, so concurrent crons within that window
// share gauge fetches without an upstream USGS hit.
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface SponsoredOutfitter {
  business_name: string
  description: string | null
  website: string | null
  logo_url: string | null
}

// GET /api/alerts/check?key=... — cron job to check conditions and send emails
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
    return NextResponse.json({ checked: 0, triggered: 0, sent: 0, skippedFree: 0 })
  }

  // Flow alert emails are a Pro feature — free users can subscribe to as
  // many rivers as they like (the subscription list is free and unlimited),
  // but only Pro users actually receive the emails. Build a Set of Pro
  // emails keyed by lowercased email so we can filter in-memory.
  const { data: proProfiles } = await supabase
    .from('user_profiles')
    .select('email, pro_expires_at')
    .eq('is_pro', true)

  const nowTs = Date.now()
  const proEmails = new Set<string>()
  for (const p of proProfiles ?? []) {
    if (!p.email) continue
    if (p.pro_expires_at && new Date(p.pro_expires_at).getTime() < nowTs) continue
    proEmails.add(p.email.toLowerCase())
  }

  // Fetch all active sponsored outfitters (for email integration)
  const { data: sponsors } = await supabase
    .from('outfitters')
    .select('business_name, description, website, logo_url, river_ids')
    .eq('active', true)
    .in('tier', ['sponsored', 'destination'])

  // Build sponsor lookup by river ID
  const sponsorByRiver = new Map<string, SponsoredOutfitter>()
  if (sponsors) {
    for (const s of sponsors) {
      for (const rid of (s.river_ids || [])) {
        if (!sponsorByRiver.has(rid)) {
          sponsorByRiver.set(rid, {
            business_name: s.business_name,
            description: s.description,
            website: s.website,
            logo_url: s.logo_url,
          })
        }
      }
    }
  }

  // Group alerts by river
  const byRiver = new Map<string, typeof alerts>()
  for (const alert of alerts) {
    const list = byRiver.get(alert.river_id) ?? []
    list.push(alert)
    byRiver.set(alert.river_id, list)
  }

  let checked = 0
  let triggered = 0
  let sent = 0
  let skippedFree = 0

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

        // 12-hour cooldown
        const lastNotified = alert.last_notified_at ? new Date(alert.last_notified_at) : null
        const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000)
        if (lastNotified && lastNotified > twelveHoursAgo) continue

        triggered++

        // Flow alert emails are a Pro feature. The subscription stays
        // active for free users so they can upgrade at any time and start
        // receiving emails without losing their list — we just skip the
        // actual send here. Do NOT touch last_notified_at for skipped
        // alerts, or they'd silently deliver stale triggers after upgrade.
        if (!proEmails.has(alert.email.toLowerCase())) {
          skippedFree++
          continue
        }

        // Get sponsored outfitter for this river
        const sponsor = sponsorByRiver.get(riverId) || null

        // Build and send email
        const conditionLabel = flow.condition === 'optimal' ? 'Optimal conditions'
          : flow.condition === 'high' ? 'High water alert'
          : flow.condition === 'flood' ? 'Flood warning'
          : 'Flow alert'

        const html = flowAlertEmail(
          alert.river_name,
          flow.cfs,
          flow.condition,
          river.opt,
          sponsor,
          flow.gaugeHeightFt,
          flow.changePerHour,
          flow.rateLabel,
        )

        const emailSent = await sendEmail({
          to: alert.email,
          subject: `${alert.river_name} at ${formatCfs(flow.cfs)} cfs — ${conditionLabel}`,
          html,
        })

        if (emailSent) sent++

        // Update last_notified_at
        await supabase
          .from('flow_alerts')
          .update({ last_notified_at: new Date().toISOString() })
          .eq('id', alert.id)
      }
    } catch {
      continue
    }
  }

  return NextResponse.json({
    checked,
    triggered,
    sent,
    skippedFree,
    sponsoredRivers: sponsorByRiver.size,
  })
}
