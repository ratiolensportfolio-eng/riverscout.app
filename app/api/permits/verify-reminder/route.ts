import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'
import { sendEmail, permitVerificationReminderEmail, ADMIN_EMAIL } from '@/lib/email'

// GET /api/permits/verify-reminder?key=...
// Annual cron — fires January 15 from vercel.json. Pulls every
// river_permits row whose last_verified_year is older than the
// current year (or null) and emails the project owner a punch list.
//
// Run-anytime safe: hitting this endpoint manually with the right
// CRON_SECRET will send the same email immediately, which is useful
// for testing or for triggering an off-cycle review after a known
// permit-rule change (e.g. an agency announcement in October).
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && key !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createSupabaseClient()
  const currentYear = new Date().getFullYear()

  // Pull rows where verification is stale. We treat null
  // last_verified_year as stale (never verified) so newly inserted
  // rows that forgot to set the year still surface in the reminder.
  const { data, error } = await supabase
    .from('river_permits')
    .select('river_name, state_key, permit_name, managing_agency, last_verified_year, info_url')
    .or(`last_verified_year.lt.${currentYear},last_verified_year.is.null`)
    .order('state_key', { ascending: true })
    .order('river_name', { ascending: true })

  if (error) {
    console.error('[permits/verify-reminder] fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch permits' }, { status: 500 })
  }

  const rows = data ?? []
  const html = permitVerificationReminderEmail(rows, currentYear)

  const subject = rows.length > 0
    ? `RiverScout — ${rows.length} permit${rows.length === 1 ? '' : 's'} need verification for ${currentYear}`
    : `RiverScout — Annual permit verification reminder (all current)`

  const sent = await sendEmail({
    to: ADMIN_EMAIL,
    subject,
    html,
  })

  return NextResponse.json({
    ok: sent,
    rowsFound: rows.length,
    currentYear,
  })
}
