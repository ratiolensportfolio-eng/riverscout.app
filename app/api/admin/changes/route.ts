import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'
import { isAdmin } from '@/lib/admin'

// GET /api/admin/changes?userId=... — fetch all approved/rolled_back suggestions as change log
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')

  if (!isAdmin(userId || undefined)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const supabase = createSupabaseClient()

  const { data, error } = await supabase
    .from('suggestions')
    .select('id, river_id, river_name, state_key, field, current_value, suggested_value, user_email, status, reviewed_at, created_at')
    .in('status', ['approved', 'rolled_back'])
    .order('reviewed_at', { ascending: false })
    .limit(500)

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch changes' }, { status: 500 })
  }

  return NextResponse.json({ changes: data || [] })
}
