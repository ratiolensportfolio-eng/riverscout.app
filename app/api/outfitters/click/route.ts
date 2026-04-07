import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'

// POST /api/outfitters/click — record a click on an outfitter listing
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { outfitterId, riverId } = body

    if (!outfitterId) {
      return NextResponse.json({ error: 'outfitterId required' }, { status: 400 })
    }

    const supabase = createSupabaseClient()

    // Insert click record
    await supabase
      .from('outfitter_clicks')
      .insert({
        outfitter_id: outfitterId,
        river_id: riverId || null,
      })

    // Increment click counter on the outfitter
    await supabase.rpc('increment_outfitter_clicks', { outfitter_uuid: outfitterId })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Click tracking error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
