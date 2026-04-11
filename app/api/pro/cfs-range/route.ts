import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'
import { getUserPro } from '@/lib/pro'

// GET /api/pro/cfs-range?userId=...&riverId=... — get custom CFS range
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')
  const riverId = req.nextUrl.searchParams.get('riverId')

  if (!userId || !riverId) {
    return NextResponse.json({ range: null })
  }

  const supabase = createSupabaseClient()
  const { data } = await supabase
    .from('custom_cfs_ranges')
    .select('min_cfs, max_cfs, notes')
    .eq('user_id', userId)
    .eq('river_id', riverId)
    .single()

  return NextResponse.json({ range: data || null })
}

// POST /api/pro/cfs-range — set custom CFS range (Pro only)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, riverId, minCfs, maxCfs, notes } = body

    if (!userId || !riverId || !minCfs || !maxCfs) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (minCfs >= maxCfs) {
      return NextResponse.json({ error: 'Min CFS must be less than max CFS' }, { status: 400 })
    }

    const isPro = await getUserPro(userId)
    if (!isPro) {
      return NextResponse.json({ error: 'pro_required', message: 'Custom CFS ranges are a Pro feature' }, { status: 403 })
    }

    // Service role: custom_cfs_ranges.user_id is FK-bound to
    // auth.users so the anon write hits the migration-026 error.
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !serviceKey) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

    const { error } = await supabase
      .from('custom_cfs_ranges')
      .upsert({
        user_id: userId,
        river_id: riverId,
        min_cfs: minCfs,
        max_cfs: maxCfs,
        notes: notes || null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,river_id' })

    if (error) {
      console.error('[pro/cfs-range] insert error:', error)
      return NextResponse.json({ error: `Failed to save range: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('CFS range error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/pro/cfs-range?userId=...&riverId=... — remove custom range
export async function DELETE(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')
  const riverId = req.nextUrl.searchParams.get('riverId')

  if (!userId || !riverId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const supabase = createSupabaseClient()
  await supabase
    .from('custom_cfs_ranges')
    .delete()
    .eq('user_id', userId)
    .eq('river_id', riverId)

  return NextResponse.json({ ok: true })
}
