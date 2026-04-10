import { NextRequest, NextResponse } from 'next/server'
import { sendDigestToUser } from '@/lib/digest'

// POST /api/digest/preview { userId }
//
// User-triggered digest preview. Wired to the "Send me a preview now"
// button on /account. The user authenticates client-side via Supabase
// auth and passes their own userId in the body — we verify by checking
// that the userId matches a real user_profiles row before generating.
//
// Rate-limited via the digest_log table: a user can request at most
// one preview every 5 minutes. This is intentional throttling, not
// security — the digest generation fans out 30+ external API calls
// per request and we don't want a user spamming the button.
//
// Does NOT update digest_last_sent or set digest_subscribed=true.
// Previews are independent from the cron schedule; they don't count
// against the 6-day cron dedupe window, and they don't auto-subscribe
// the user. Subscription is a separate explicit action.

export const dynamic = 'force-dynamic'
export const revalidate = 0

const PREVIEW_RATE_LIMIT_MS = 5 * 60 * 1000  // 5 min

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const { userId } = body
    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    // Rate limit — check digest_log for recent rows from this user
    const { createSupabaseClient } = await import('@/lib/supabase')
    const supabase = createSupabaseClient()
    const since = new Date(Date.now() - PREVIEW_RATE_LIMIT_MS).toISOString()
    const { data: recent } = await supabase
      .from('digest_log')
      .select('id')
      .eq('user_id', userId)
      .gte('sent_at', since)
      .limit(1)

    if (recent && recent.length > 0) {
      return NextResponse.json({
        error: 'rate_limited',
        message: 'Wait a few minutes before requesting another preview.',
      }, { status: 429 })
    }

    const result = await sendDigestToUser(userId)
    if (!result.ok) {
      if (result.reason === 'no_rivers' || result.reason === 'no_digest') {
        return NextResponse.json({
          error: 'no_rivers',
          message: 'Save at least one river before previewing the digest.',
        }, { status: 400 })
      }
      return NextResponse.json({ error: 'send_failed' }, { status: 500 })
    }

    // Log the preview send so the rate limit works on next request.
    // We don't touch digest_last_sent — previews don't count against
    // the Thursday cron schedule.
    await supabase
      .from('digest_log')
      .insert({
        user_id: userId,
        rivers_included: result.riversIncluded ?? 0,
      })

    return NextResponse.json({
      ok: true,
      riversIncluded: result.riversIncluded,
    })
  } catch (err) {
    console.error('[digest/preview] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
