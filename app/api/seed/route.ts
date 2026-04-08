import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'
import { isAdmin } from '@/lib/admin'
import { STATES } from '@/data/rivers'
import { FISHERIES } from '@/data/fisheries'
import { RAPIDS } from '@/data/rapids'

// GET or POST /api/seed?userId=...&secret=...
// Seeds all river data from static files into Supabase tables
// Admin-only, requires CRON_SECRET or admin userId
export async function GET(req: NextRequest) { return seed(req) }
export async function POST(req: NextRequest) { return seed(req) }

async function seed(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')
  const secret = req.nextUrl.searchParams.get('secret')
  const cronSecret = process.env.CRON_SECRET

  // Auth check
  if (!isAdmin(userId || undefined) && secret !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const supabase = createSupabaseClient()
  const log: string[] = []
  let errors = 0

  function logMsg(msg: string) { log.push(msg); console.log('[SEED]', msg) }
  function logErr(msg: string, err: unknown) { errors++; log.push('ERROR: ' + msg); console.error('[SEED]', msg, err) }

  // ── STATES ──
  logMsg('Seeding states...')
  for (const [key, state] of Object.entries(STATES)) {
    const { error } = await supabase.from('states').upsert({
      key,
      name: state.name,
      abbr: state.abbr,
      label: state.label,
      filters: state.filters,
      filter_labels: state.fL,
    }, { onConflict: 'key' })
    if (error) logErr(`State ${key}: ${error.message}`, error)
  }
  logMsg(`${Object.keys(STATES).length} states done`)

  // ── RIVERS ──
  logMsg('Seeding rivers...')
  let riverCount = 0

  for (const [stateKey, state] of Object.entries(STATES)) {
    for (const r of state.rivers) {
      riverCount++

      // Extract boolean filter flags
      const flags: Record<string, boolean> = {}
      for (const [k, v] of Object.entries(r)) {
        if (typeof v === 'boolean') flags[k] = v
      }

      const { error } = await supabase.from('rivers').upsert({
        id: r.id,
        state_key: stateKey,
        name: r.n,
        county: r.co,
        length: r.len,
        class: r.cls,
        optimal_cfs: r.opt,
        usgs_gauge: r.g,
        avg_cfs: r.avg,
        hist_flow: r.histFlow,
        map_x: r.mx,
        map_y: r.my,
        description: r.desc,
        designations: r.desig,
        sections: r.secs || [],
        filter_flags: flags,
      }, { onConflict: 'id' })
      if (error) logErr(`River ${r.id}: ${error.message}`, error)

      // History
      if (r.history) {
        // Delete existing history for this river first (to avoid duplicates on re-seed)
        await supabase.from('river_history').delete().eq('river_id', r.id)

        let sortOrder = 0
        for (const era of r.history) {
          for (const entry of era.entries) {
            const { error } = await supabase.from('river_history').insert({
              river_id: r.id,
              era: era.era,
              year: entry.yr,
              title: entry.title,
              body: entry.text,
              source: entry.src,
              sort_order: sortOrder++,
            })
            if (error) logErr(`History ${r.id}/${entry.title}: ${error.message}`, error)
          }
        }
      }

      // Documents
      if (r.docs && r.docs.length > 0) {
        await supabase.from('river_documents').delete().eq('river_id', r.id)
        for (const doc of r.docs) {
          const { error } = await supabase.from('river_documents').insert({
            river_id: r.id,
            title: doc.t,
            source: doc.s,
            year: doc.y,
            doc_type: doc.tp,
            pages: doc.pg,
            url: doc.url || null,
          })
          if (error) logErr(`Doc ${r.id}/${doc.t}: ${error.message}`, error)
        }
      }

      // Reviews (seed)
      if (r.revs && r.revs.length > 0) {
        await supabase.from('river_reviews').delete().eq('river_id', r.id).eq('is_seed', true)
        for (const rev of r.revs) {
          const { error } = await supabase.from('river_reviews').insert({
            river_id: r.id,
            username: rev.u,
            review_date: rev.d,
            stars: rev.s,
            body: rev.t,
            is_seed: true,
          })
          if (error) logErr(`Review ${r.id}/${rev.u}: ${error.message}`, error)
        }
      }

      // Outfitters (seed)
      if (r.outs && r.outs.length > 0) {
        await supabase.from('river_outfitters').delete().eq('river_id', r.id).eq('is_seed', true)
        for (const out of r.outs) {
          const { error } = await supabase.from('river_outfitters').insert({
            river_id: r.id,
            name: out.n,
            description: out.d,
            link: out.l || '',
            is_seed: true,
          })
          if (error) logErr(`Outfitter ${r.id}/${out.n}: ${error.message}`, error)
        }
      }
    }
  }
  logMsg(`${riverCount} rivers done`)

  // ── FISHERIES ──
  logMsg('Seeding fisheries...')
  let fishCount = 0

  for (const [riverId, fish] of Object.entries(FISHERIES)) {
    fishCount++

    // Species
    await supabase.from('river_species').delete().eq('river_id', riverId)
    for (const sp of (fish.species || [])) {
      await supabase.from('river_species').insert({
        river_id: riverId,
        name: sp.name,
        species_type: sp.type,
        is_primary: sp.primary,
        notes: sp.notes || null,
      })
    }

    // Designations
    await supabase.from('river_designations_fish').delete().eq('river_id', riverId)
    for (const d of (fish.designations || [])) {
      await supabase.from('river_designations_fish').insert({
        river_id: riverId,
        designation: d,
      })
    }

    // Spawning
    await supabase.from('river_spawning').delete().eq('river_id', riverId)
    for (const s of (fish.spawning || [])) {
      await supabase.from('river_spawning').insert({
        river_id: riverId,
        species: s.species,
        season: s.season,
        notes: s.notes || null,
      })
    }

    // Hatches
    await supabase.from('river_hatches').delete().eq('river_id', riverId)
    let hatchOrder = 0
    for (const h of (fish.hatches || [])) {
      await supabase.from('river_hatches').insert({
        river_id: riverId,
        name: h.name,
        timing: h.timing,
        notes: h.notes || null,
        sort_order: hatchOrder++,
      })
    }

    // Runs
    await supabase.from('river_runs').delete().eq('river_id', riverId)
    for (const r of (fish.runs || [])) {
      await supabase.from('river_runs').insert({
        river_id: riverId,
        species: r.species,
        timing: r.timing,
        peak: r.peak || null,
        notes: r.notes || null,
      })
    }

    // Guides
    await supabase.from('river_guides').delete().eq('river_id', riverId)
    for (const g of (fish.guides || [])) {
      await supabase.from('river_guides').insert({
        river_id: riverId,
        name: g,
      })
    }
  }
  logMsg(`${fishCount} fisheries done`)

  // ── RAPIDS ──
  logMsg('Seeding rapids...')
  let rapidCount = 0

  for (const [riverId, rapids] of Object.entries(RAPIDS)) {
    await supabase.from('river_rapids').delete().eq('river_id', riverId)
    let sortOrder = 0
    for (const rapid of rapids) {
      rapidCount++
      await supabase.from('river_rapids').insert({
        river_id: riverId,
        name: rapid.name,
        class: rapid.class,
        lat: rapid.lat,
        lng: rapid.lng,
        description: rapid.description,
        mile: rapid.mile || null,
        sort_order: sortOrder++,
      })
    }
  }
  logMsg(`${rapidCount} rapids done`)

  logMsg(`Seed complete. ${errors} errors.`)

  return NextResponse.json({
    ok: errors === 0,
    rivers: riverCount,
    states: Object.keys(STATES).length,
    fisheries: fishCount,
    rapids: rapidCount,
    errors,
    log,
  })
}
