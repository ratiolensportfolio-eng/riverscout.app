import { NextRequest, NextResponse } from 'next/server'
import { ALL_RIVERS } from '@/data/rivers'
import { randomBytes } from 'crypto'

// POST /api/qa/ask
// Body: { riverId, question, displayName, userId?, notifyEmail? }
//
// Creates a new river_questions row. No login required (per spec)
// — anonymous users supply just a display name. Logged-in users
// can supply userId so the question links to their account and
// counts toward their contributor tier.
//
// `notifyEmail` opts the asker into "email me when answered". We
// stamp a random unsub token so the eventual notification email
// can carry a one-click stop-notifying link.
//
// Service-role write because the table's INSERT policy allows
// `user_id is null OR auth.uid() = user_id` and the anon browser
// client can't reliably forward auth context to PostgREST. Same
// pattern as /api/releases/subscribe.

export const dynamic = 'force-dynamic'

const MAX_QUESTION_LEN = 280
const MAX_NAME_LEN = 60

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { riverId, question, displayName, userId, notifyEmail } = body

    if (!riverId || typeof riverId !== 'string') {
      return NextResponse.json({ error: 'riverId required' }, { status: 400 })
    }
    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'question required' }, { status: 400 })
    }
    const trimmedQ = question.trim()
    if (trimmedQ.length === 0) {
      return NextResponse.json({ error: 'Question cannot be empty' }, { status: 400 })
    }
    if (trimmedQ.length > MAX_QUESTION_LEN) {
      return NextResponse.json({
        error: `Question must be ${MAX_QUESTION_LEN} characters or fewer`,
      }, { status: 400 })
    }
    if (!displayName || typeof displayName !== 'string') {
      return NextResponse.json({ error: 'displayName required' }, { status: 400 })
    }
    const trimmedName = displayName.trim().slice(0, MAX_NAME_LEN)
    if (trimmedName.length === 0) {
      return NextResponse.json({ error: 'displayName cannot be empty' }, { status: 400 })
    }

    // Verify the river exists in our static catalog. Anyone can hit
    // this endpoint but they have to know a real river_id.
    const river = ALL_RIVERS.find(r => r.id === riverId)
    if (!river) {
      return NextResponse.json({ error: 'Unknown riverId' }, { status: 404 })
    }

    // notifyEmail is optional. Validate the shape only if present.
    let normalizedNotifyEmail: string | null = null
    let notifyToken: string | null = null
    if (notifyEmail) {
      if (typeof notifyEmail !== 'string' || !notifyEmail.includes('@')) {
        return NextResponse.json({ error: 'Invalid notifyEmail' }, { status: 400 })
      }
      normalizedNotifyEmail = notifyEmail.toLowerCase().trim()
      // 32 hex chars — long enough that brute-force-stop is infeasible
      // for an unsub link, short enough for a tidy URL.
      notifyToken = randomBytes(16).toString('hex')
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !serviceKey) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

    // Plain insert without .select() — same RETURNING-trigger
    // workaround documented in /api/releases/subscribe.
    const { error } = await supabase
      .from('river_questions')
      .insert({
        river_id: riverId,
        user_id: userId || null,
        display_name: trimmedName,
        question: trimmedQ,
        notify_email: normalizedNotifyEmail,
        notify_token: notifyToken,
      })

    if (error) {
      console.error('[qa/ask] insert error:', error)
      return NextResponse.json({ error: `Failed to post question: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      message: normalizedNotifyEmail
        ? `Question posted. We'll email you when someone answers.`
        : 'Question posted.',
    })
  } catch (err) {
    console.error('[qa/ask] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
