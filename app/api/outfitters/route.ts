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

    const supabase = createSupabaseClient()

    // Check if this user already has a listing on this river
    const { data: existing } = await supabase
      .from('outfitters')
      .select('id')
      .eq('user_id', userId)
      .contains('river_ids', [riverId])

    if (existing && existing.length > 0) {
      return NextResponse.json({ error: 'You already have a listing on this river' }, { status: 409 })
    }

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
        active: false,  // free listings start inactive until reviewed
      })
      .select()

    if (error) {
      console.error('Outfitter claim error:', error)
      return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 })
    }

    return NextResponse.json({ ok: true, listing: data?.[0] })
  } catch (err) {
    console.error('Outfitter API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
