import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin'

// POST /api/admin/qa
//
// Body: { userId, userEmail, action, kind, id }
//   action: 'remove' | 'restore' | 'mark-best' | 'unmark-best'
//   kind:   'question' | 'answer'
//
// Q&A moderation. Service-role write because the admin client
// can't reliably forward auth context. We gate on the lib/admin.ts
// allow-list check the same way /api/hazards admin actions do.
//
// 'remove' soft-deletes by flipping status to 'removed' (still in
// the DB for history; the public SELECT policy filters it out).
// 'mark-best' flips river_answers.is_best_answer to true. Only one
// best answer per question — the route demotes the previous best
// before promoting the new one.

export const dynamic = 'force-dynamic'

const ALLOWED_ACTIONS = new Set(['remove', 'restore', 'mark-best', 'unmark-best'])
const ALLOWED_KINDS = new Set(['question', 'answer'])

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, userEmail, action, kind, id } = body

    if (!isAdmin(userId, userEmail)) {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 })
    }
    if (!ALLOWED_ACTIONS.has(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
    if (!ALLOWED_KINDS.has(kind)) {
      return NextResponse.json({ error: 'Invalid kind' }, { status: 400 })
    }
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'id required' }, { status: 400 })
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !serviceKey) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

    const table = kind === 'question' ? 'river_questions' : 'river_answers'

    if (action === 'remove' || action === 'restore') {
      const { error } = await supabase
        .from(table)
        .update({ status: action === 'remove' ? 'removed' : 'active' })
        .eq('id', id)
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      return NextResponse.json({ ok: true })
    }

    // mark-best / unmark-best — answers only.
    if (kind !== 'answer') {
      return NextResponse.json({ error: 'mark-best only applies to answers' }, { status: 400 })
    }
    if (action === 'unmark-best') {
      const { error } = await supabase
        .from('river_answers')
        .update({ is_best_answer: false })
        .eq('id', id)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ ok: true })
    }

    // mark-best — find the parent question id, demote any current
    // best, then promote this one.
    const { data: row, error: rowErr } = await supabase
      .from('river_answers')
      .select('id, question_id')
      .eq('id', id)
      .maybeSingle()
    if (rowErr || !row) {
      return NextResponse.json({ error: 'Answer not found' }, { status: 404 })
    }
    // Demote any existing best on this question. We don't care if
    // there isn't one — the update is a no-op then.
    await supabase
      .from('river_answers')
      .update({ is_best_answer: false })
      .eq('question_id', row.question_id)
      .eq('is_best_answer', true)

    const { error: promoteErr } = await supabase
      .from('river_answers')
      .update({ is_best_answer: true })
      .eq('id', id)
    if (promoteErr) {
      return NextResponse.json({ error: promoteErr.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[admin/qa] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
