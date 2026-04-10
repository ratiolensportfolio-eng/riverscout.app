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

    // NOTE: we used to do an "existing listing" pre-check here with a
    // .select().eq('user_id', ...) query, but under our anon RLS
    // policies that query returns [] for any inactive row regardless
    // of whether one exists (the "Active listings are public" policy
    // requires active=true; the "Outfitters manage own listing"
    // policy requires auth.uid()). So the pre-check was a silent
    // no-op that gave a false sense of duplicate-protection. Real
    // duplicate protection has to live in a DB unique constraint or
    // a service-role check; for now we just let the insert fly.

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
      // We've debugged this route blind three times now. Surface the
      // real Supabase error message + code to the client so the next
      // failure mode is visible from the browser, not just the
      // server logs.
      console.error('Outfitter claim error:', error)
      return NextResponse.json({
        error: `Failed to create listing: ${error.message}`,
        code: error.code,
        details: error.details,
        hint: error.hint,
      }, { status: 500 })
    }

    // If the insert succeeded but the SELECT policy filtered out the
    // returned row, `data` is []. Treat that as success — the row
    // is in the table — and just don't echo it back. Without this
    // branch the client gets `ok:true, listing:undefined` and may
    // treat it as a no-op.
    if (!data || data.length === 0) {
      return NextResponse.json({ ok: true, listing: null, note: 'inserted (RLS hid the returning row)' })
    }

    return NextResponse.json({ ok: true, listing: data[0] })
  } catch (err) {
    console.error('Outfitter API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
