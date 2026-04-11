import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'
import { isAdmin } from '@/lib/admin'

// Admin permit management.
//
// GET /api/permits — admin only, lists every row in river_permits
// PATCH /api/permits — admin only, updates a single row by id
//
// The public-facing fetch (one permit row per river) lives in
// lib/permits.ts and goes through the server prefetch in
// river-page-data.ts. This route is only used by /admin/permits.

const PERMIT_TYPES = [
  'lottery_weighted',
  'lottery_standard',
  'first_come_first_served',
  'reservation',
  'self_issue',
  'no_permit_required',
]

const REQUIRED_FOR = ['overnight', 'day_use', 'all_launches', 'commercial_only']

// Allow-list of editable columns. Anything not in this list is
// silently ignored — protects against admins accidentally writing to
// id / created_at / generated columns and against future schema
// changes that add columns we don't want exposed via the API.
const EDITABLE_COLUMNS = new Set([
  'permit_name',
  'managing_agency',
  'permit_type',
  'required_for',
  'application_opens',
  'application_closes',
  'results_date',
  'permit_season_start',
  'permit_season_end',
  'group_size_min',
  'group_size_max',
  'cost_per_person',
  'cost_per_group',
  'apply_url',
  'info_url',
  'phone',
  'notes',
  'commercial_available',
  'commercial_notes',
  'verified',
  'last_verified_year',
])

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')
  const userEmail = req.nextUrl.searchParams.get('userEmail')

  if (!userId || !isAdmin(userId, userEmail)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('river_permits')
    .select('*')
    .order('state_key', { ascending: true })
    .order('river_name', { ascending: true })

  if (error) {
    console.error('[permits GET] error:', error)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }

  return NextResponse.json({ permits: data ?? [] })
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, userId, userEmail, updates } = body

    if (!userId || !isAdmin(userId, userEmail)) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 })
    }
    if (!id || typeof updates !== 'object' || updates === null) {
      return NextResponse.json({ error: 'Missing id or updates' }, { status: 400 })
    }

    // Filter to allow-listed columns + validate enum values
    const safe: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(updates as Record<string, unknown>)) {
      if (!EDITABLE_COLUMNS.has(k)) continue
      if (k === 'permit_type' && typeof v === 'string' && !PERMIT_TYPES.includes(v)) {
        return NextResponse.json({ error: `Invalid permit_type: ${v}` }, { status: 400 })
      }
      if (k === 'required_for' && typeof v === 'string' && !REQUIRED_FOR.includes(v)) {
        return NextResponse.json({ error: `Invalid required_for: ${v}` }, { status: 400 })
      }
      // Coerce empty strings to null so admins can clear optional fields
      // by leaving them blank in the form.
      safe[k] = v === '' ? null : v
    }

    if (Object.keys(safe).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    safe.updated_at = new Date().toISOString()

    // Service role for the write — admin gate above is the
    // authorization check, and anon writes to tables with strict
    // RLS write policies hit the misleading error class.
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !serviceKey) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

    const { data, error } = await supabase
      .from('river_permits')
      .update(safe)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[permits PATCH] error:', error)
      return NextResponse.json({ error: `Failed to update: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({ ok: true, permit: data })
  } catch (err) {
    console.error('[permits PATCH] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
