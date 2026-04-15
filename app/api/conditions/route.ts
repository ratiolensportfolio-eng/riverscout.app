import { NextRequest, NextResponse } from 'next/server'
import { fetchGaugeDataBatch } from '@/lib/usgs'
import { getRiver } from '@/data/rivers'

// POST /api/conditions
//
// Batch flow-condition lookup for the /rivers index page (and any
// other surface that needs many rivers' current conditions at once).
// Body: { riverIds: string[] }
// Returns: { conditions: { [riverId]: { cfs, condition } } }
//
// Uses fetchGaugeDataBatch which collapses N USGS calls into a
// single ?sites=A,B,C... request (chunked at 80 sites). Was 30
// parallel single-site requests per chunk; now one HTTP call per
// 80 rivers.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const riverIds: unknown = body?.riverIds
    if (!Array.isArray(riverIds)) {
      return NextResponse.json({ error: 'riverIds (string[]) required' }, { status: 400 })
    }

    const ids = riverIds.filter((x): x is string => typeof x === 'string').slice(0, 500)
    const inputs: Array<{ id: string; gaugeId: string; optRange: string }> = []
    for (const id of ids) {
      const r = getRiver(id)
      if (r) inputs.push({ id, gaugeId: r.g, optRange: r.opt })
    }

    const batch = await fetchGaugeDataBatch(inputs.map(x => ({ gaugeId: x.gaugeId, optRange: x.optRange })))

    const conditions: Record<string, { cfs: number | null; condition: string }> = {}
    for (const x of inputs) {
      const f = batch.get(x.gaugeId)
      conditions[x.id] = f
        ? { cfs: f.cfs, condition: f.condition }
        : { cfs: null, condition: 'loading' }
    }

    return NextResponse.json({ conditions })
  } catch (err) {
    console.error('[conditions] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
