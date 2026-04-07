import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'

// GET /api/outfitters?riverId=... — fetch active outfitter listings for a river
export async function GET(req: NextRequest) {
  const riverId = req.nextUrl.searchParams.get('riverId')
  const stateKey = req.nextUrl.searchParams.get('stateKey')

  const supabase = createSupabaseClient()

  let query = supabase
    .from('outfitter_listings')
    .select('*')
    .eq('active', true)

  if (riverId) {
    query = query.contains('river_ids', [riverId])
  }
  if (stateKey) {
    query = query.contains('state_keys', [stateKey])
  }

  // Order by tier priority: destination > sponsored > featured > guide > listed
  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 })
  }

  // Sort by tier priority
  const tierOrder: Record<string, number> = { destination: 0, sponsored: 1, featured: 2, guide: 3, listed: 4 }
  const sorted = (data || []).sort((a, b) => (tierOrder[a.tier] ?? 5) - (tierOrder[b.tier] ?? 5))

  return NextResponse.json({ listings: sorted })
}

// POST /api/outfitters — claim a free listing
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, description, riverId, phone, website } = body

    if (!name || !email || !riverId) {
      return NextResponse.json({ error: 'Name, email, and river are required' }, { status: 400 })
    }

    const supabase = createSupabaseClient()

    // Check if this email already has a listing on this river
    const { data: existing } = await supabase
      .from('outfitter_listings')
      .select('id')
      .eq('email', email)
      .contains('river_ids', [riverId])

    if (existing && existing.length > 0) {
      return NextResponse.json({ error: 'You already have a listing on this river' }, { status: 409 })
    }

    const { data, error } = await supabase
      .from('outfitter_listings')
      .insert({
        name: name.trim(),
        email: email.trim(),
        description: description?.trim() || '',
        river_ids: [riverId],
        phone: phone?.trim() || null,
        website: null, // website link not shown on free tier
        tier: 'listed',
        active: true,
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
