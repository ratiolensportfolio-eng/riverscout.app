import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'

// POST /api/qa/answer
// Body: { questionId, answer, displayName }
//
// Posts an answer to an existing question. Requires login per
// spec. We verify the user via the SSR cookie session, then
// write through the service-role client (because the trigger that
// flips river_questions.answered=true runs as definer and sees
// only the service-role identity reliably).
//
// On insert the trg_mark_question_answered trigger sets the parent
// question to answered=true with answered_at=now(), so the SSR
// sort surfaces it above unanswered questions on next page load.
//
// Sending the "your question was answered" notification email is
// fire-and-forget — failure to send doesn't block the answer
// itself. The cron in /api/cron/qa-notify will catch any rows we
// missed (notify_email set, notified_at null, has answers).

export const dynamic = 'force-dynamic'

const MAX_ANSWER_LEN = 2000
const MAX_NAME_LEN = 60

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { questionId, answer, displayName } = body

    if (!questionId || typeof questionId !== 'string') {
      return NextResponse.json({ error: 'questionId required' }, { status: 400 })
    }
    if (!answer || typeof answer !== 'string') {
      return NextResponse.json({ error: 'answer required' }, { status: 400 })
    }
    const trimmedA = answer.trim()
    if (trimmedA.length === 0) {
      return NextResponse.json({ error: 'Answer cannot be empty' }, { status: 400 })
    }
    if (trimmedA.length > MAX_ANSWER_LEN) {
      return NextResponse.json({
        error: `Answer must be ${MAX_ANSWER_LEN} characters or fewer`,
      }, { status: 400 })
    }
    if (!displayName || typeof displayName !== 'string') {
      return NextResponse.json({ error: 'displayName required' }, { status: 400 })
    }

    // Auth check via cookie session — answers require login.
    const userClient = await createSupabaseServerClient()
    const { data: { user } } = await userClient.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Sign in required to answer' }, { status: 401 })
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !serviceKey) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

    // Look up the parent question to copy its river_id onto the
    // answer row (denormalized so admin queries don't need a join).
    const { data: parent, error: parentErr } = await supabase
      .from('river_questions')
      .select('id, river_id, status')
      .eq('id', questionId)
      .maybeSingle()

    if (parentErr || !parent) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }
    if (parent.status !== 'active') {
      return NextResponse.json({ error: 'This question is no longer accepting answers' }, { status: 410 })
    }

    const trimmedName = displayName.trim().slice(0, MAX_NAME_LEN)

    const { error } = await supabase
      .from('river_answers')
      .insert({
        question_id: questionId,
        river_id: parent.river_id,
        user_id: user.id,
        display_name: trimmedName,
        answer: trimmedA,
      })

    if (error) {
      console.error('[qa/answer] insert error:', error)
      return NextResponse.json({ error: `Failed to post answer: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({ ok: true, message: 'Answer posted.' })
  } catch (err) {
    console.error('[qa/answer] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
