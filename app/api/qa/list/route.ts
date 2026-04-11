import { NextRequest, NextResponse } from 'next/server'

// GET /api/qa/list?riverId=...
//
// Returns the same Q&A payload shape that fetchRiverPageData()
// builds for SSR — questions sorted answered-first, each with
// its answers attached (best/most-helpful first). The river page
// uses this for client-side refresh after a user submits a new
// question or answer, so the new content shows up without a full
// page reload.

export const dynamic = 'force-dynamic'

interface AnswerRow {
  id: string
  question_id: string
  display_name: string
  answer: string
  created_at: string
  helpful_count: number
  is_best_answer: boolean
}

export async function GET(req: NextRequest) {
  const riverId = req.nextUrl.searchParams.get('riverId')
  if (!riverId) {
    return NextResponse.json({ error: 'riverId required' }, { status: 400 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }
  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

  try {
    const qRes = await supabase
      .from('river_questions')
      .select('id, river_id, display_name, question, created_at, answered, helpful_count')
      .eq('river_id', riverId)
      .eq('status', 'active')
      .order('answered', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(100)

    if (qRes.error) {
      return NextResponse.json({ error: qRes.error.message }, { status: 500 })
    }
    const questions = qRes.data ?? []
    if (questions.length === 0) {
      return NextResponse.json({ qa: [] })
    }

    const aRes = await supabase
      .from('river_answers')
      .select('id, question_id, display_name, answer, created_at, helpful_count, is_best_answer')
      .in('question_id', questions.map(q => q.id))
      .eq('status', 'active')
      .order('is_best_answer', { ascending: false })
      .order('helpful_count', { ascending: false })
      .order('created_at', { ascending: true })

    const byQ = new Map<string, AnswerRow[]>()
    for (const a of (aRes.data ?? []) as AnswerRow[]) {
      const list = byQ.get(a.question_id) ?? []
      list.push(a)
      byQ.set(a.question_id, list)
    }

    const qa = questions.map(q => {
      // Strip question_id from each child answer before sending to
      // the client — the parent already owns them.
      const answers = (byQ.get(q.id) ?? []).map(({ question_id: _qid, ...rest }) => rest)
      return { ...q, answers }
    })

    return NextResponse.json({ qa })
  } catch (err) {
    console.error('[qa/list] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
