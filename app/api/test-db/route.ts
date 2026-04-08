import { NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'

// GET /api/test-db — verify database queries work correctly
export async function GET() {
  const supabase = createSupabaseClient()
  const results: Record<string, unknown> = {}

  // 1. Count states
  const { count: stateCount, error: e1 } = await supabase.from('states').select('*', { count: 'exact', head: true })
  results['1_states'] = { count: stateCount, error: e1?.message || null }

  // 2. Count rivers
  const { count: riverCount, error: e2 } = await supabase.from('rivers').select('*', { count: 'exact', head: true })
  results['2_rivers'] = { count: riverCount, error: e2?.message || null }

  // 3. Get Pine River
  const { data: pine, error: e3 } = await supabase.from('rivers').select('id, name, class, optimal_cfs, usgs_gauge, state_key').eq('id', 'pine_mi').single()
  results['3_pine_river'] = { data: pine, error: e3?.message || null }

  // 4. Michigan rivers count
  const { data: miRivers, error: e4 } = await supabase.from('rivers').select('id, name').eq('state_key', 'mi').order('name')
  results['4_michigan_rivers'] = { count: miRivers?.length, first5: miRivers?.slice(0, 5), error: e4?.message || null }

  // 5. Pine River history
  const { data: history, error: e5 } = await supabase.from('river_history').select('era, title').eq('river_id', 'pine_mi').order('sort_order')
  results['5_pine_history'] = { count: history?.length, entries: history, error: e5?.message || null }

  // 6. Pine River species
  const { data: species, error: e6 } = await supabase.from('river_species').select('name, species_type, is_primary').eq('river_id', 'pine_mi')
  results['6_pine_species'] = { count: species?.length, entries: species, error: e6?.message || null }

  // 7. Gauley rapids
  const { data: rapids, error: e7 } = await supabase.from('river_rapids').select('name, class').eq('river_id', 'gauley').order('sort_order')
  results['7_gauley_rapids'] = { count: rapids?.length, entries: rapids, error: e7?.message || null }

  // 8. Documents with URLs
  const { data: docs, error: e8 } = await supabase.from('river_documents').select('river_id, title').not('url', 'is', null).limit(5)
  results['8_docs_with_urls'] = { count: docs?.length, sample: docs, error: e8?.message || null }

  // 9. Count all child tables
  const tables = ['river_history', 'river_documents', 'river_reviews', 'river_outfitters', 'river_species', 'river_hatches', 'river_runs', 'river_spawning', 'river_guides', 'river_rapids']
  const counts: Record<string, number | null> = {}
  for (const t of tables) {
    const { count, error } = await supabase.from(t).select('*', { count: 'exact', head: true })
    counts[t] = error ? null : count
  }
  results['9_table_counts'] = counts

  // 10. Test the full state reconstruction (like rivers-db.ts does)
  const { data: miState } = await supabase.from('states').select('*').eq('key', 'mi').single()
  const { data: miAllRivers } = await supabase.from('rivers').select('*').eq('state_key', 'mi')
  results['10_full_state_test'] = {
    state: miState ? { key: miState.key, name: miState.name, riverCount: miAllRivers?.length } : null,
  }

  // Summary
  const allPassing = !e1 && !e2 && !e3 && !e4 && !e5 && !e6 && !e7 && !e8
    && (stateCount || 0) >= 48
    && (riverCount || 0) >= 370

  return NextResponse.json({
    ok: allPassing,
    summary: {
      states: stateCount,
      rivers: riverCount,
      history: counts['river_history'],
      documents: counts['river_documents'],
      reviews: counts['river_reviews'],
      outfitters: counts['river_outfitters'],
      species: counts['river_species'],
      hatches: counts['river_hatches'],
      runs: counts['river_runs'],
      spawning: counts['river_spawning'],
      guides: counts['river_guides'],
      rapids: counts['river_rapids'],
    },
    details: results,
  })
}
