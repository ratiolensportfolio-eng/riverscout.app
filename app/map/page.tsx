import { ALL_RIVERS, STATES } from '@/data/rivers'
import { fetchGaugeDataBatch } from '@/lib/usgs'
import USMap from '@/components/maps/USMap'
import type { FlowCondition } from '@/types'

// /map — dedicated US map page. Renders the same live-conditions
// map as the homepage hero but without the HomepageGuard redirect
// so logged-in users can always reach it via the nav pill.

export const revalidate = 900

export const metadata = {
  title: 'Live River Map · RiverScout',
  description: 'Live flow conditions across all 50 states — click any state to explore rivers.',
}

export default async function MapPage() {
  const rivers = ALL_RIVERS
  const batch = await fetchGaugeDataBatch(
    rivers.map(r => ({ gaugeId: r.g, optRange: r.opt })),
    { period: 'PT2H' },
  )

  type StateCondition = { optimal: number; low: number; high: number; flood: number; total: number; topCfs: { name: string; cfs: number; condition: FlowCondition }[] }
  const stateConditions: Record<string, StateCondition> = {}
  for (const r of rivers) {
    const flow = batch.get(r.g)
    if (!flow) continue
    const stateKey = r.stateKey
    if (!stateConditions[stateKey]) stateConditions[stateKey] = { optimal: 0, low: 0, high: 0, flood: 0, total: 0, topCfs: [] }
    const sc = stateConditions[stateKey]
    sc.total++
    if (flow.condition === 'optimal') sc.optimal++
    else if (flow.condition === 'low') sc.low++
    else if (flow.condition === 'high') sc.high++
    else if (flow.condition === 'flood') sc.flood++
    if (flow.cfs !== null) sc.topCfs.push({ name: r.n, cfs: flow.cfs, condition: flow.condition })
  }

  const stateFlowMap: Record<string, FlowCondition> = {}
  for (const [key, sc] of Object.entries(stateConditions)) {
    if (sc.flood > 0) stateFlowMap[key] = 'flood'
    else if (sc.high > sc.optimal) stateFlowMap[key] = 'high'
    else if (sc.optimal > 0) stateFlowMap[key] = 'optimal'
    else stateFlowMap[key] = 'low'
  }

  const stateCount = Object.keys(STATES).length
  const riverCount = ALL_RIVERS.length

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--tx)' }}>
      <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: '#042C53', margin: '0 0 4px' }}>
          Live River Conditions
        </h1>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: 'var(--tx3)', margin: '0 0 18px' }}>
          {stateCount} states · {riverCount.toLocaleString()} rivers · Updated every 15 minutes from USGS
        </p>

        <div style={{
          background: 'rgba(10, 53, 96, 0.85)', borderRadius: '12px',
          padding: '8px', overflow: 'hidden',
          border: '1px solid rgba(255,255,255,.1)',
        }}>
          <USMap stateFlowMap={stateFlowMap} stateConditions={stateConditions} />
        </div>

        <div style={{
          textAlign: 'center', marginTop: '14px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '11px', color: 'var(--tx3)',
          letterSpacing: '.3px',
        }}>
          Click any state to explore rivers.
        </div>
      </div>
    </main>
  )
}
