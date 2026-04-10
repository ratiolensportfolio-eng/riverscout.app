import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'
import { digestSubject } from '@/lib/email'
import { generateDigest, sendDigestToUser } from '@/lib/digest'
import { isAdmin } from '@/lib/admin'

// Cron + admin-preview surfaces for the weekly digest.
//
// GET /api/digest?key=CRON_SECRET                     — main Thursday cron send
// GET /api/digest?userId=&adminUserId=&adminEmail=    — admin preview JSON
// POST /api/digest/preview { userId }                 — user-triggered preview (sibling route)
//
// Why both cron + admin preview share GET: Vercel's scheduler always
// invokes via GET, and the existing crons in this project (alerts,
// permits) follow the same pattern. We disambiguate by which query
// param is present — `?key=` is the cron, `?adminUserId=` is the
// preview.
//
// The cron is idempotent within a 6-day window: each user's
// `digest_last_sent` gets updated only after a successful send, so
// re-running the cron the same Thursday is safe — it skips users it
// already mailed.

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Walk every digest_subscribed user, generate, send. Skip when:
//   - no saved rivers
//   - already mailed in the last 6 days
//   - missing or invalid email on user_profiles
async function runCronSend(): Promise<{ sent: number; skipped: number; errors: number; total: number }> {
  const supabase = createSupabaseClient()

  const { data: subscribers, error } = await supabase
    .from('user_profiles')
    .select('id, email, digest_last_sent')
    .eq('digest_subscribed', true)

  if (error) {
    console.error('[digest] subscriber fetch error:', error)
    throw new Error('Failed to fetch subscribers')
  }

  const results = { sent: 0, skipped: 0, errors: 0, total: subscribers?.length ?? 0 }
  const sixDaysMs = 6 * 24 * 60 * 60 * 1000
  const nowMs = Date.now()

  for (const user of subscribers ?? []) {
    if (!user.email) {
      results.skipped++
      continue
    }
    if (user.digest_last_sent) {
      const lastMs = new Date(user.digest_last_sent).getTime()
      if (nowMs - lastMs < sixDaysMs) {
        results.skipped++
        continue
      }
    }

    try {
      const result = await sendDigestToUser(user.id)
      if (!result.ok) {
        if (result.reason === 'no_rivers' || result.reason === 'no_digest') {
          results.skipped++
        } else {
          results.errors++
        }
        continue
      }

      // Best-effort post-send: if either of these fails the email
      // already went out, so the worst case is a duplicate next
      // Thursday (still bounded by the 6-day check above).
      await supabase
        .from('user_profiles')
        .update({ digest_last_sent: new Date().toISOString() })
        .eq('id', user.id)

      await supabase
        .from('digest_log')
        .insert({
          user_id: user.id,
          rivers_included: result.riversIncluded ?? 0,
        })

      results.sent++

      // Resend's free tier allows 100 emails per second; 100ms between
      // sends keeps us comfortably under the rate limit.
      await new Promise(resolve => setTimeout(resolve, 100))
    } catch (err) {
      console.error(`[digest] error for user ${user.id}:`, err)
      results.errors++
    }
  }

  return results
}

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  const adminUserId = req.nextUrl.searchParams.get('adminUserId')
  const adminEmail = req.nextUrl.searchParams.get('adminEmail')
  const userId = req.nextUrl.searchParams.get('userId')

  // Cron mode: ?key=... is the only param needed, the rest is ignored
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && key === cronSecret) {
    try {
      const results = await runCronSend()
      return NextResponse.json(results)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Internal error'
      return NextResponse.json({ error: message }, { status: 500 })
    }
  }
  // Reject unauthenticated cron attempts when CRON_SECRET is set
  if (cronSecret && key && key !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Admin preview mode: ?adminUserId=... + ?userId=...
  if (adminUserId && isAdmin(adminUserId, adminEmail)) {
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }
    const digest = await generateDigest(userId)
    if (!digest) {
      return NextResponse.json({ error: 'No digest available (no saved rivers or missing profile)' }, { status: 404 })
    }
    return NextResponse.json({
      subject: digestSubject(digest.rivers),
      digest,
    })
  }

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
