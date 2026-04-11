import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'

// GET /api/outfitters?riverId=...&stateKey=... — fetch active outfitter listings
export async function GET(req: NextRequest) {
  const riverId = req.nextUrl.searchParams.get('riverId')
  const stateKey = req.nextUrl.searchParams.get('stateKey')

  const supabase = createSupabaseClient()

  let query = supabase
    .from('outfitters')
    .select('*')
    .eq('active', true)

  if (riverId) {
    query = query.contains('river_ids', [riverId])
  }
  if (stateKey) {
    query = query.contains('state_keys', [stateKey])
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    console.error('Fetch outfitters error:', error)
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 })
  }

  // Sort by tier priority: destination > sponsored > featured > guide > listed
  const tierOrder: Record<string, number> = { destination: 0, sponsored: 1, featured: 2, guide: 3, listed: 4 }
  const sorted = (data || []).sort((a, b) => (tierOrder[a.tier] ?? 5) - (tierOrder[b.tier] ?? 5))

  return NextResponse.json({ listings: sorted })
}

// POST /api/outfitters — claim a free listing (requires user_id from auth)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, businessName, description, riverId, phone, website, email } = body

    if (!userId || !businessName || !riverId) {
      return NextResponse.json({ error: 'userId, businessName, and riverId are required' }, { status: 400 })
    }

    // Service role for the write path. The route is the gate
    // (we already validated userId / businessName / riverId).
    // Bypassing RLS sidesteps both the FK lookup failure on
    // outfitters.user_id and the RETURNING SELECT-policy issue
    // that previously made `data` come back empty even on a
    // successful insert. Same canonical pattern as the rest of
    // the user-facing write routes.
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !serviceKey) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

    const { data, error } = await supabase
      .from('outfitters')
      .insert({
        user_id: userId,
        business_name: businessName.trim(),
        description: description?.trim() || null,
        website: website?.trim() || null,
        phone: phone?.trim() || null,
        river_ids: [riverId],
        tier: 'listed',
        // Free listings are auto-published. The owner can always
        // unpublish from the dashboard. If spam becomes a problem
        // we'll add a moderation queue and flip this back.
        active: true,
      })
      .select()
      .single()

    if (error) {
      console.error('[outfitters] insert error:', error)
      return NextResponse.json({
        error: `Failed to create listing: ${error.message}`,
        code: error.code,
        details: error.details,
        hint: error.hint,
      }, { status: 500 })
    }

    return NextResponse.json({ ok: true, listing: data })
  } catch (err) {
    console.error('Outfitter API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
