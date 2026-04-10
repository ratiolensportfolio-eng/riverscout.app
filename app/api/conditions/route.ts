import { NextRequest, NextResponse } from 'next/server'
import { fetchGaugeData } from '@/lib/usgs'
import { getRiver } from '@/data/rivers'

// POST /api/conditions
//
// Batch flow-condition lookup for the /rivers index page (and any
// other surface that needs many rivers' current conditions at once).
// Body: { riverIds: string[] }
// Returns: { conditions: { [riverId]: { cfs, condition } } }
//
// We chunk the lookups to avoid blasting USGS with 375 simultaneous
// requests on a cold cache. Each chunk runs in parallel via
// Promise.allSettled, so a slow gauge can't block the whole batch.
// fetchGaugeData has its own underlying 15-min cache, so subsequent
// requests within the cache window cost nothing.

const CHUNK_SIZE = 30

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const riverIds: unknown = body?.riverIds
    if (!Array.isArray(riverIds)) {
      return NextResponse.json({ error: 'riverIds (string[]) required' }, { status: 400 })
    }

    const ids = riverIds.filter((x): x is string => typeof x === 'string').slice(0, 500)
    const conditions: Record<string, { cfs: number | null; condition: string }> = {}

    for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
      const chunk = ids.slice(i, i + CHUNK_SIZE)
      const results = await Promise.allSettled(
        chunk.map(async id => {
          const river = getRiver(id)
          if (!river) return { id, cfs: null, condition: 'loading' as const }
          try {
            const flow = await fetchGaugeData(river.g, river.opt)
            return { id, cfs: flow.cfs, condition: flow.condition }
          } catch {
            return { id, cfs: null, condition: 'loading' as const }
          }
        })
      )
      for (const r of results) {
        if (r.status === 'fulfilled') {
          conditions[r.value.id] = { cfs: r.value.cfs, condition: r.value.condition }
        }
      }
    }

    return NextResponse.json({ conditions })
  } catch (err) {
    console.error('[conditions] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
