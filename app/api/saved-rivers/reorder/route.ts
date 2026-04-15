import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// POST /api/saved-rivers/reorder
//
// Body: { userId, riverIds: string[] }
// Persists the dashboard card order. We write integer positions
// 0..N matching the order of riverIds. Any saved-river not in the
// list keeps its current position (so reorder operations can be
// partial without nuking the rest).

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { userId, riverIds } = await req.json()
    if (!userId || !Array.isArray(riverIds)) {
      return NextResponse.json({ error: 'userId and riverIds required' }, { status: 400 })
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    const supabase = createClient(url, key, { auth: { persistSession: false } })

    // One UPDATE per id. Volume is tiny (<50 cards typical).
    await Promise.all(
      riverIds.map((rid: string, i: number) =>
        supabase
          .from('saved_rivers')
          .update({ position: i })
          .eq('user_id', userId)
          .eq('river_id', rid),
      ),
    )

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
