import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'
import { fetchGaugeData, formatCfs } from '@/lib/usgs'
import { getRiver } from '@/data/rivers'

interface SponsoredOutfitter {
  business_name: string
  description: string | null
  website: string | null
  logo_url: string | null
}

// Build the flow alert email HTML with optional sponsored outfitter block
function buildAlertEmailHtml(
  riverName: string,
  cfs: number,
  condition: string,
  sponsor: SponsoredOutfitter | null,
): string {
  const conditionLabel = condition === 'optimal' ? 'Optimal conditions'
    : condition === 'high' ? 'High water'
    : condition === 'flood' ? 'Flood warning'
    : 'Conditions changed'

  const conditionColor = condition === 'optimal' ? '#1D9E75'
    : condition === 'high' ? '#BA7517'
    : condition === 'flood' ? '#A32D2D'
    : '#666660'

  let sponsorBlock = ''
  if (sponsor) {
    sponsorBlock = `
      <tr>
        <td style="padding: 24px 0 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background: #f6f5f2; border-radius: 8px; border: 1px solid #e2e1d8;">
            <tr>
              <td style="padding: 20px;">
                ${sponsor.logo_url ? `
                  <img src="${sponsor.logo_url}" alt="${sponsor.business_name}"
                    style="max-height: 40px; max-width: 160px; margin-bottom: 12px; display: block;" />
                ` : ''}
                <div style="font-family: Georgia, serif; font-size: 18px; font-weight: 700; color: #085041; margin-bottom: 4px;">
                  ${sponsor.business_name}
                </div>
                ${sponsor.description ? `
                  <div style="font-size: 14px; color: #666660; line-height: 1.5; margin-bottom: 12px;">
                    ${sponsor.description}
                  </div>
                ` : ''}
                ${sponsor.website ? `
                  <a href="https://${sponsor.website}" target="_blank"
                    style="display: inline-block; padding: 10px 24px; background: #1D9E75; color: #ffffff;
                    text-decoration: none; border-radius: 6px; font-family: monospace; font-size: 13px; font-weight: 500;">
                    Book Now
                  </a>
                ` : ''}
              </td>
            </tr>
          </table>
          <div style="font-family: monospace; font-size: 10px; color: #aaa99a; margin-top: 8px; text-align: center;">
            This message is sponsored by ${sponsor.business_name}, a RiverScout Sponsored Partner on ${riverName}.
          </div>
        </td>
      </tr>`
  }

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin: 0; padding: 0; background: #ffffff; font-family: Georgia, serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="padding-bottom: 16px; border-bottom: 1px solid #e2e1d8;">
        <span style="font-family: Georgia, serif; font-size: 20px; font-weight: 700; color: #085041; letter-spacing: -0.3px;">
          River<span style="color: #185FA5;">Scout</span>
        </span>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 0;">
        <div style="font-family: monospace; font-size: 10px; color: ${conditionColor}; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px;">
          Flow Alert
        </div>
        <div style="font-family: Georgia, serif; font-size: 24px; font-weight: 700; color: #1a1a18; line-height: 1.3; margin-bottom: 8px;">
          ${riverName} is running at ${formatCfs(cfs)} cfs
        </div>
        <div style="font-size: 16px; color: ${conditionColor}; font-weight: 600; margin-bottom: 4px;">
          ${conditionLabel} this weekend
        </div>
        <div style="font-family: monospace; font-size: 12px; color: #aaa99a; margin-top: 12px;">
          Optimal range for this river · Live data from USGS
        </div>
      </td>
    </tr>
    ${sponsorBlock}
    <tr>
      <td style="padding: 24px 0 0; border-top: 1px solid #e2e1d8;">
        <div style="font-family: monospace; font-size: 10px; color: #aaa99a; text-align: center; line-height: 1.6;">
          You received this because you subscribed to flow alerts for ${riverName} on
          <a href="https://riverscout.app" style="color: #1D9E75;">RiverScout</a>.<br />
          <a href="https://riverscout.app/alerts" style="color: #aaa99a;">Manage your alerts</a>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// GET /api/alerts/check?key=... — cron job to check conditions and queue notifications
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

  // Group alerts by river to avoid duplicate USGS fetches
  const byRiver = new Map<string, typeof alerts>()
  for (const alert of alerts) {
    const list = byRiver.get(alert.river_id) ?? []
    list.push(alert)
    byRiver.set(alert.river_id, list)
  }

  let checked = 0
  let triggered = 0
  const notifications: Array<{
    email: string
    riverName: string
    riverId: string
    cfs: number
    condition: string
    threshold: string
    html: string
  }> = []

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

        // Get sponsored outfitter for this river (if any)
        const sponsor = sponsorByRiver.get(riverId) || null

        // Build email HTML
        const html = buildAlertEmailHtml(alert.river_name, flow.cfs, flow.condition, sponsor)

        triggered++
        notifications.push({
          email: alert.email,
          riverName: alert.river_name,
          riverId,
          cfs: flow.cfs,
          condition: flow.condition,
          threshold: alert.threshold,
          html,
        })

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

  // Send notifications
  for (const n of notifications) {
    const sponsor = sponsorByRiver.get(n.riverId)

    console.log(
      `[FLOW ALERT] ${n.email}: ${n.riverName} at ${formatCfs(n.cfs)} cfs (${n.condition})` +
      (sponsor ? ` — sponsored by ${sponsor.business_name}` : '')
    )

    // TODO: Send email via Resend
    // await resend.emails.send({
    //   from: 'RiverScout <alerts@riverscout.app>',
    //   to: n.email,
    //   subject: `${n.riverName} is running at ${formatCfs(n.cfs)} cfs — ${n.condition === 'optimal' ? 'Optimal conditions' : 'Flow alert'}`,
    //   html: n.html,
    // })
  }

  return NextResponse.json({
    checked,
    triggered,
    sponsoredRivers: sponsorByRiver.size,
    notifications: notifications.map(n => ({
      email: n.email.replace(/(.{2}).*(@.*)/, '$1***$2'),
      river: n.riverName,
      cfs: n.cfs,
      condition: n.condition,
      hasSponsored: !!sponsorByRiver.get(n.riverId),
    })),
  })
}
