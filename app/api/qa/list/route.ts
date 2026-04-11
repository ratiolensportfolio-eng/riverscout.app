import { NextRequest, NextResponse } from 'next/server'
import { fetchContributorCounts } from '@/lib/contributor-counts'

// GET /api/qa/list?riverId=...
//
// Returns the same Q&A payload shape that fetchRiverPageData()
// builds for SSR — questions sorted answered-first, each with
// its answers attached (best/most-helpful first). The river page
// uses this for client-side refresh after a user submits a new
// question or answer, so the new content shows up without a full
// page reload.
//
// Also decorates each row with `contributor_count` so the inline
// tier badges survive a client refresh. Same dual-source count as
// the rest of the contributor system: approved suggestions plus
// helpful (count >= 1) Q&A answers.

export const dynamic = 'force-dynamic'

interface AnswerRow {
  id: string
  question_id: string
  user_id: string | null
  display_name: string
  answer: string
  created_at: string
  helpful_count: number
  is_best_answer: boolean
}

interface QuestionRow {
  id: string
  river_id: string
  user_id: string | null
  display_name: string
  question: string
  created_at: string
  answered: boolean
  helpful_count: number
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
      .select('id, river_id, user_id, display_name, question, created_at, answered, helpful_count')
      .eq('river_id', riverId)
      .eq('status', 'active')
      .order('answered', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(100)

    if (qRes.error) {
      return NextResponse.json({ error: qRes.error.message }, { status: 500 })
    }
    const questions = (qRes.data ?? []) as QuestionRow[]
    if (questions.length === 0) {
      return NextResponse.json({ qa: [] })
    }

    const aRes = await supabase
      .from('river_answers')
      .select('id, question_id, user_id, display_name, answer, created_at, helpful_count, is_best_answer')
      .in('question_id', questions.map(q => q.id))
      .eq('status', 'active')
      .order('is_best_answer', { ascending: false })
      .order('helpful_count', { ascending: false })
      .order('created_at', { ascending: true })

    const answers = (aRes.data ?? []) as AnswerRow[]

    // Batch contributor counts for every unique authoring user_id
    // across questions and answers. One round trip per source table
    // (suggestions, river_answers).
    const allUserIds: string[] = []
    for (const q of questions) if (q.user_id) allUserIds.push(q.user_id)
    for (const a of answers) if (a.user_id) allUserIds.push(a.user_id)
    const counts = await fetchContributorCounts(supabase, allUserIds)

    const byQ = new Map<string, Array<Omit<AnswerRow, 'question_id' | 'user_id'> & { contributor_count: number | null }>>()
    for (const a of answers) {
      const list = byQ.get(a.question_id) ?? []
      const { question_id: _qid, user_id: aUid, ...rest } = a
      list.push({
        ...rest,
        contributor_count: aUid ? (counts[aUid] ?? 0) : null,
      })
      byQ.set(a.question_id, list)
    }

    const qa = questions.map(q => {
      const { user_id: qUid, ...rest } = q
      return {
        ...rest,
        contributor_count: qUid ? (counts[qUid] ?? 0) : null,
        answers: byQ.get(q.id) ?? [],
      }
    })

    return NextResponse.json({ qa })
  } catch (err) {
    console.error('[qa/list] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
