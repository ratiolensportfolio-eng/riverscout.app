import { NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'

// GET /api/debug/outfitters — debug endpoint to check outfitter system state
export async function GET() {
  const supabase = createSupabaseClient()
  const results: Record<string, unknown> = {}

  // 1. Count all outfitters
  const { count: total, error: e1 } = await supabase
    .from('outfitters')
    .select('*', { count: 'exact', head: true })
  results['1_total_outfitters'] = { count: total, error: e1?.message || null }

  // 2. Count by tier
  const { data: allOutfitters, error: e2 } = await supabase
    .from('outfitters')
    .select('id, business_name, tier, active, river_ids, created_at')

  if (allOutfitters) {
    const byTier: Record<string, number> = {}
    const byActive: Record<string, number> = { active: 0, inactive: 0 }
    for (const o of allOutfitters) {
      byTier[o.tier] = (byTier[o.tier] || 0) + 1
      if (o.active) byActive.active++
      else byActive.inactive++
    }
    results['2_by_tier'] = byTier
    results['3_by_active'] = byActive
    results['4_all_listings'] = allOutfitters.map(o => ({
      id: o.id,
      name: o.business_name,
      tier: o.tier,
      active: o.active,
      rivers: o.river_ids,
      created: o.created_at,
    }))
  } else {
    results['2_by_tier'] = { error: e2?.message }
  }

  // 3. Test the GET /api/outfitters endpoint for pine_mi
  try {
    const { data: pineOutfitters, error: e3 } = await supabase
      .from('outfitters')
      .select('*')
      .eq('active', true)
      .contains('river_ids', ['pine_mi'])
    results['5_pine_mi_active_outfitters'] = { count: pineOutfitters?.length || 0, data: pineOutfitters, error: e3?.message || null }
  } catch (err) {
    results['5_pine_mi_active_outfitters'] = { error: String(err) }
  }

  // 4. Count outfitter_clicks
  const { count: clickCount, error: e4 } = await supabase
    .from('outfitter_clicks')
    .select('*', { count: 'exact', head: true })
  results['6_total_clicks'] = { count: clickCount, error: e4?.message || null }

  return NextResponse.json(results)
}
