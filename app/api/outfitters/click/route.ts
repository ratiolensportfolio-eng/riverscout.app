import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'

// POST /api/outfitters/click — record a click on an outfitter listing
// No personal data stored — just outfitter_id, river_id, source, timestamp
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { outfitterId, riverId, source } = body

    if (!outfitterId) {
      return NextResponse.json({ error: 'outfitterId required' }, { status: 400 })
    }

    const validSources = ['overview', 'outfitters_tab', 'flow_alert', 'search', 'guide_tab']
    const cleanSource = validSources.includes(source) ? source : null

    const supabase = createSupabaseClient()

    // Insert click record
    await supabase
      .from('outfitter_clicks')
      .insert({
        outfitter_id: outfitterId,
        river_id: riverId || null,
        source: cleanSource,
      })

    // Increment click counter on the outfitter
    await supabase.rpc('increment_outfitter_clicks', { outfitter_uuid: outfitterId })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Click tracking error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
