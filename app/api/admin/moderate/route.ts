import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { isAdmin } from '@/lib/admin'

// POST /api/admin/moderate
//
// Body: { table, id, action: 'approve' | 'reject' }
//
// Flips a flagged submission to approved (published) or rejected
// (hidden). Admin-only — caller's userId is checked against the
// admin list.
//
// The status column name varies by table:
//   trip_reports / river_answers / suggestions → status
//   river_hazards → active (boolean)
//   river_access_points → verification_status
//   fish_catches → verification_status

export const dynamic = 'force-dynamic'

const TABLE_STATUS: Record<string, { col: string; approvedVal: string | boolean; rejectedVal: string | boolean }> = {
  trip_reports:       { col: 'status', approvedVal: 'verified', rejectedVal: 'rejected' },
  river_answers:      { col: 'status', approvedVal: 'active', rejectedVal: 'rejected' },
  suggestions:        { col: 'status', approvedVal: 'pending', rejectedVal: 'rejected' },
  river_hazards:      { col: 'active', approvedVal: true, rejectedVal: false },
  river_access_points:{ col: 'verification_status', approvedVal: 'verified', rejectedVal: 'rejected' },
  fish_catches:       { col: 'verification_status', approvedVal: 'verified', rejectedVal: 'rejected' },
}

function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { table, id, action, userId } = body

    if (!table || !id || !action || !userId) {
      return NextResponse.json({ error: 'table, id, action, userId required' }, { status: 400 })
    }
    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'action must be approve or reject' }, { status: 400 })
    }
    const config = TABLE_STATUS[table]
    if (!config) {
      return NextResponse.json({ error: `Unknown table: ${table}` }, { status: 400 })
    }

    const supabase = client()
    if (!supabase) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })

    if (!await isAdmin(userId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const value = action === 'approve' ? config.approvedVal : config.rejectedVal
    const { error } = await supabase
      .from(table)
      .update({ [config.col]: value })
      .eq('id', id)

    if (error) {
      console.error('[admin/moderate] update error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, table, id, action })
  } catch (err) {
    console.error('[admin/moderate] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
