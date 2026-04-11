import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// POST /api/alerts/unsubscribe
// Body: { type: 'flow' | 'release' | 'hatch', id: string }
//
// Soft-delete a single alert subscription by flipping
// active=false. Same service-role pattern as
// /api/alerts/list — sidesteps the per-table RLS variance.
//
// We accept either a hard delete (flow_alerts has no
// last_notified bookkeeping) or a soft toggle (release/hatch
// keep last_notified_at for digest analytics) depending on
// table — the route picks the right path per-table.

export const dynamic = 'force-dynamic'

const ALLOWED_TYPES = new Set(['flow', 'release', 'hatch'])

const TABLE_FOR_TYPE: Record<string, string> = {
  flow: 'flow_alerts',
  release: 'release_alerts',
  hatch: 'hatch_alerts',
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, id } = body
    if (!ALLOWED_TYPES.has(type)) {
      return NextResponse.json({ error: 'Invalid alert type' }, { status: 400 })
    }
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'id required' }, { status: 400 })
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !serviceKey) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }
    const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

    const table = TABLE_FOR_TYPE[type]
    const { error } = await supabase
      .from(table)
      .update({ active: false })
      .eq('id', id)

    if (error) {
      console.error(`[alerts/unsubscribe] ${type}:`, error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[alerts/unsubscribe] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
