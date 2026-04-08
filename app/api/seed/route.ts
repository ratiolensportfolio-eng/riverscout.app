import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'
import { isAdmin } from '@/lib/admin'
import { STATES } from '@/data/rivers'
import { FISHERIES } from '@/data/fisheries'
import { RAPIDS } from '@/data/rapids'

// GET /api/seed?userId=...&state=mi  — seed one state at a time
// GET /api/seed?userId=...&step=states — seed just the states table
// GET /api/seed?userId=...&step=fisheries — seed just fisheries
// GET /api/seed?userId=...&step=rapids — seed just rapids
// GET /api/seed?userId=...&step=all — auto-run all states sequentially
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')
  const secret = req.nextUrl.searchParams.get('secret')
  const stateParam = req.nextUrl.searchParams.get('state')
  const step = req.nextUrl.searchParams.get('step')
  const cronSecret = process.env.CRON_SECRET

  if (!isAdmin(userId || undefined) && secret !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const supabase = createSupabaseClient()
  let errors = 0

  // Step: seed states table only
  if (step === 'states') {
    for (const [key, state] of Object.entries(STATES)) {
      const { error } = await supabase.from('states').upsert({
        key, name: state.name, abbr: state.abbr, label: state.label,
        filters: state.filters, filter_labels: state.fL,
      }, { onConflict: 'key' })
      if (error) errors++
    }
    return NextResponse.json({ ok: errors === 0, step: 'states', count: Object.keys(STATES).length, errors })
  }

  // Step: seed fisheries only
  if (step === 'fisheries') {
    let count = 0
    for (const [riverId, fish] of Object.entries(FISHERIES)) {
      count++
      await supabase.from('river_species').delete().eq('river_id', riverId)
      for (const sp of (fish.species || [])) {
        await supabase.from('river_species').insert({ river_id: riverId, name: sp.name, species_type: sp.type, is_primary: sp.primary, notes: sp.notes || null })
      }
      await supabase.from('river_designations_fish').delete().eq('river_id', riverId)
      for (const d of (fish.designations || [])) {
        await supabase.from('river_designations_fish').insert({ river_id: riverId, designation: d })
      }
      await supabase.from('river_spawning').delete().eq('river_id', riverId)
      for (const s of (fish.spawning || [])) {
        await supabase.from('river_spawning').insert({ river_id: riverId, species: s.species, season: s.season, notes: s.notes || null })
      }
      await supabase.from('river_hatches').delete().eq('river_id', riverId)
      let ho = 0
      for (const h of (fish.hatches || [])) {
        await supabase.from('river_hatches').insert({ river_id: riverId, name: h.name, timing: h.timing, notes: h.notes || null, sort_order: ho++ })
      }
      await supabase.from('river_runs').delete().eq('river_id', riverId)
      for (const r of (fish.runs || [])) {
        await supabase.from('river_runs').insert({ river_id: riverId, species: r.species, timing: r.timing, peak: r.peak || null, notes: r.notes || null })
      }
      await supabase.from('river_guides').delete().eq('river_id', riverId)
      for (const g of (fish.guides || [])) {
        await supabase.from('river_guides').insert({ river_id: riverId, name: g })
      }
    }
    return NextResponse.json({ ok: true, step: 'fisheries', count })
  }

  // Step: seed rapids only
  if (step === 'rapids') {
    let count = 0
    for (const [riverId, rapids] of Object.entries(RAPIDS)) {
      await supabase.from('river_rapids').delete().eq('river_id', riverId)
      let so = 0
      for (const rapid of rapids) {
        count++
        await supabase.from('river_rapids').insert({
          river_id: riverId, name: rapid.name, class: rapid.class,
          lat: rapid.lat, lng: rapid.lng, description: rapid.description,
          mile: rapid.mile || null, sort_order: so++,
        })
      }
    }
    return NextResponse.json({ ok: true, step: 'rapids', count })
  }

  // Seed a single state's rivers
  if (stateParam) {
    const state = STATES[stateParam]
    if (!state) return NextResponse.json({ error: 'State not found: ' + stateParam }, { status: 404 })

    // Make sure state row exists
    await supabase.from('states').upsert({
      key: stateParam, name: state.name, abbr: state.abbr, label: state.label,
      filters: state.filters, filter_labels: state.fL,
    }, { onConflict: 'key' })

    let riverCount = 0
    for (const r of state.rivers) {
      riverCount++
      const flags: Record<string, boolean> = {}
      for (const [k, v] of Object.entries(r)) { if (typeof v === 'boolean') flags[k] = v }

      const { error } = await supabase.from('rivers').upsert({
        id: r.id, state_key: stateParam, name: r.n, county: r.co, length: r.len,
        class: r.cls, optimal_cfs: r.opt, usgs_gauge: r.g, avg_cfs: r.avg,
        hist_flow: r.histFlow, map_x: r.mx, map_y: r.my, description: r.desc,
        designations: r.desig, sections: r.secs || [], filter_flags: flags,
      }, { onConflict: 'id' })
      if (error) { errors++; continue }

      // History
      await supabase.from('river_history').delete().eq('river_id', r.id)
      if (r.history) {
        let so = 0
        for (const era of r.history) {
          for (const entry of era.entries) {
            await supabase.from('river_history').insert({
              river_id: r.id, era: era.era, year: entry.yr, title: entry.title,
              body: entry.text, source: entry.src, sort_order: so++,
            })
          }
        }
      }

      // Docs
      await supabase.from('river_documents').delete().eq('river_id', r.id)
      for (const doc of (r.docs || [])) {
        await supabase.from('river_documents').insert({
          river_id: r.id, title: doc.t, source: doc.s, year: doc.y,
          doc_type: doc.tp, pages: doc.pg, url: doc.url || null,
        })
      }

      // Reviews
      await supabase.from('river_reviews').delete().eq('river_id', r.id).eq('is_seed', true)
      for (const rev of (r.revs || [])) {
        await supabase.from('river_reviews').insert({
          river_id: r.id, username: rev.u, review_date: rev.d, stars: rev.s, body: rev.t, is_seed: true,
        })
      }

      // Outfitters
      await supabase.from('river_outfitters').delete().eq('river_id', r.id).eq('is_seed', true)
      for (const out of (r.outs || [])) {
        await supabase.from('river_outfitters').insert({
          river_id: r.id, name: out.n, description: out.d, link: out.l || '', is_seed: true,
        })
      }
    }

    return NextResponse.json({ ok: errors === 0, state: stateParam, rivers: riverCount, errors })
  }

  // No params — show instructions
  const stateKeys = Object.keys(STATES)
  return NextResponse.json({
    message: 'Seed endpoint. Run steps in order:',
    steps: [
      { step: 1, url: '/api/seed?userId=YOUR_ID&step=states', description: 'Seed 48 states' },
      ...stateKeys.map((key, i) => ({
        step: i + 2,
        url: `/api/seed?userId=YOUR_ID&state=${key}`,
        description: `Seed ${STATES[key].name} (${STATES[key].rivers.length} rivers)`,
      })),
      { step: stateKeys.length + 2, url: '/api/seed?userId=YOUR_ID&step=fisheries', description: 'Seed fisheries data' },
      { step: stateKeys.length + 3, url: '/api/seed?userId=YOUR_ID&step=rapids', description: 'Seed rapids data' },
    ],
    quickStart: `To seed everything, visit each URL in order. Start with: /api/seed?userId=YOUR_ID&step=states`,
    totalStates: stateKeys.length,
    totalRivers: stateKeys.reduce((sum, k) => sum + STATES[k].rivers.length, 0),
  })
}
