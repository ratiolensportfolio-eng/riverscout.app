import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendEmail, releaseAlertEmail, ADMIN_EMAIL } from '@/lib/email'
import { DAM_RELEASES } from '@/data/dam-releases'
import { ALL_RIVERS, getStateSlug, getRiverSlug } from '@/data/rivers'

// GET /api/cron/release-alerts?key=CRON_SECRET
//
// Daily cron that walks all active release_alerts subscriptions,
// finds upcoming releases inside each user's lookahead window,
// and emails the subscriber. Each (alert_id, release_id) pair
// is logged to release_alert_log so we don't double-send.
//
// The cron is idempotent — running it twice in the same day
// produces zero new emails because every notification is
// already logged.
//
// Manual trigger:
//   curl 'https://riverscout.app/api/cron/release-alerts?key=YOUR_CRON_SECRET'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const maxDuration = 60

interface AlertRow {
  id: string
  email: string
  river_id: string
  river_name: string
  season_label: string | null
  notify_days_before: number
}

interface LogRow {
  alert_id: string
  release_id: string
}

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || key !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    return NextResponse.json({ error: 'Service role not configured' }, { status: 500 })
  }
  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

  const startedAt = new Date()
  const todayIso = startedAt.toISOString().slice(0, 10)

  // Pull every active subscription
  const { data: alertsData, error: alertsErr } = await supabase
    .from('release_alerts')
    .select('id, email, river_id, river_name, season_label, notify_days_before')
    .eq('active', true)
  if (alertsErr) {
    console.error('[cron/release-alerts] alerts fetch:', alertsErr)
    return NextResponse.json({ ok: false, error: alertsErr.message }, { status: 500 })
  }
  const alerts = (alertsData ?? []) as AlertRow[]

  if (alerts.length === 0) {
    return NextResponse.json({
      ok: true,
      fetchedAt: startedAt.toISOString(),
      message: 'No active subscriptions',
      sent: 0, skipped: 0,
    })
  }

  // Pull the dedupe log so we can skip alerts we've already sent.
  // The log only matters for releases that are still in the
  // future or just-passed window — old logs are noise. Cap at a
  // generous 50k so the cron doesn't pull the full history every
  // run; older rows never affect the "already sent" set because
  // the release IDs they reference have long since expired.
  const { data: logData, error: logErr } = await supabase
    .from('release_alert_log')
    .select('alert_id, release_id')
    .order('created_at', { ascending: false })
    .limit(50000)
  if (logErr) {
    console.error('[cron/release-alerts] log fetch:', logErr)
    return NextResponse.json({ ok: false, error: logErr.message }, { status: 500 })
  }
  const sentSet = new Set((logData ?? []).map((l: LogRow) => `${l.alert_id}::${l.release_id}`))

  // Pre-build a river_id → slug URL map
  const riverInfo: Record<string, { stateSlug: string; riverSlug: string }> = {}
  for (const r of ALL_RIVERS) {
    riverInfo[r.id] = {
      stateSlug: getStateSlug(r.stateKey as string),
      riverSlug: getRiverSlug(r),
    }
  }

  let sent = 0
  let skipped = 0
  let errors = 0
  const errorMessages: string[] = []
  const newLogRows: LogRow[] = []

  for (const alert of alerts) {
    // Find upcoming releases on this river that fall inside the
    // alert's lookahead window. We only fire when a release is
    // EXACTLY notify_days_before days away (or 0/1/2 if cron
    // missed earlier days due to outage). Filter by season label
    // if the user specified one.
    const candidates = DAM_RELEASES.filter(r => {
      if (r.riverId !== alert.river_id) return false
      if (alert.season_label && r.seasonLabel !== alert.season_label) return false
      const days = daysBetween(todayIso, r.date)
      // Fire when release is between today and notify_days_before
      // days from now. Also fire for releases happening today.
      return days >= 0 && days <= alert.notify_days_before
    })

    for (const release of candidates) {
      const dedupeKey = `${alert.id}::${release.id}`
      if (sentSet.has(dedupeKey)) {
        skipped++
        continue
      }

      const info = riverInfo[release.riverId]
      if (!info) {
        skipped++
        continue
      }

      const days = daysBetween(todayIso, release.date)
      const unsubscribeUrl = `https://riverscout.app/api/releases/subscribe?id=${alert.id}` // DELETE via redirect handler in phase 2; for now this is a placeholder

      try {
        await sendEmail({
          to: alert.email,
          subject: dayPrefix(days) + ` ${alert.river_name} release on ${formatHumanDate(release.date)}`,
          html: releaseAlertEmail(
            alert.river_name,
            info.stateSlug,
            info.riverSlug,
            release.name,
            release.date,
            days,
            release.expectedCfs ?? null,
            release.startTime ?? null,
            release.endTime ?? null,
            release.agency,
            release.notes ?? null,
            release.sourceUrl,
            unsubscribeUrl,
          ),
        })
        sent++
        newLogRows.push({ alert_id: alert.id, release_id: release.id })
        sentSet.add(dedupeKey)
      } catch (err) {
        errors++
        errorMessages.push(`${alert.email} / ${release.id}: ${err instanceof Error ? err.message : String(err)}`)
      }
    }
  }

  // Persist the dedupe log entries in one batch.
  if (newLogRows.length > 0) {
    const { error: logInsertErr } = await supabase
      .from('release_alert_log')
      .insert(newLogRows)
    if (logInsertErr) {
      console.error('[cron/release-alerts] log insert:', logInsertErr)
      // Not fatal — emails went out, but next run might re-send
      // if the log write keeps failing. Surface in the response
      // so it gets noticed.
      errorMessages.push(`log_insert: ${logInsertErr.message}`)
    }

    // Update last_notified_at for the affected alerts
    const affectedIds = Array.from(new Set(newLogRows.map(r => r.alert_id)))
    await supabase
      .from('release_alerts')
      .update({ last_notified_at: new Date().toISOString() })
      .in('id', affectedIds)
  }

  // Optional admin summary email when something fired
  if (sent > 0 || errors > 0) {
    try {
      await sendEmail({
        to: ADMIN_EMAIL,
        subject: `[release-alerts] ${sent} sent, ${errors} errors`,
        html: `<p>Daily release-alerts cron summary:</p><ul><li>Subscriptions checked: ${alerts.length}</li><li>Emails sent: ${sent}</li><li>Already-sent skips: ${skipped}</li><li>Errors: ${errors}</li></ul>${errors > 0 ? '<pre>' + errorMessages.slice(0, 10).join('\n') + '</pre>' : ''}`,
      })
    } catch {
      // best effort
    }
  }

  return NextResponse.json({
    ok: errors === 0,
    fetchedAt: startedAt.toISOString(),
    today: todayIso,
    subscriptionsChecked: alerts.length,
    sent,
    skipped,
    errors,
    errorMessages: errorMessages.slice(0, 10),
  })
}

// Days between two ISO date strings (b - a). Both must be
// YYYY-MM-DD. Returns a non-negative integer if b is on or
// after a.
function daysBetween(a: string, b: string): number {
  const da = new Date(a + 'T12:00:00').getTime()
  const db = new Date(b + 'T12:00:00').getTime()
  return Math.round((db - da) / (1000 * 60 * 60 * 24))
}

function dayPrefix(days: number): string {
  if (days === 0) return '\u26A1 Today \u2014'
  if (days === 1) return '\u26A1 Tomorrow \u2014'
  return `\u26A1 ${days} days \u2014`
}

function formatHumanDate(iso: string): string {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })
}
