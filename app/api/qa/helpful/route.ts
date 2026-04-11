import { NextRequest, NextResponse } from 'next/server'

// POST /api/qa/helpful
// Body: { kind: 'question' | 'answer', id: string }
//
// Bumps helpful_count by 1 on either a question or an answer. No
// login required per spec — we route through the SECURITY DEFINER
// function bump_qa_helpful() so anon users can mark helpful
// without us opening a blanket UPDATE policy that would let anyone
// rewrite the underlying text.
//
// Cheap-and-cheerful: we don't dedupe per visitor. A determined
// user can spam helpful counts; admins can prune obvious abuse
// from /admin. The friction-free count is worth the noise.

export const dynamic = 'force-dynamic'

const ALLOWED = new Set(['question', 'answer'])

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { kind, id } = body

    if (!ALLOWED.has(kind)) {
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

    const { error } = await supabase.rpc('bump_qa_helpful', {
      target_kind: kind,
      target_id: id,
    })

    if (error) {
      console.error('[qa/helpful] rpc error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[qa/helpful] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
