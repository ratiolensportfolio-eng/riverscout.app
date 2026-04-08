import Link from 'next/link'
import { ALL_RIVERS, STATES } from '@/data/rivers'
import { fetchGaugeData } from '@/lib/usgs'
import USMap from '@/components/maps/USMap'
import AuthNav from '@/components/AuthNav'
import type { FlowCondition } from '@/types'

export const revalidate = 900

export default async function HomePage() {
  const stateCount = Object.keys(STATES).length
  const riverCount = ALL_RIVERS.length

  // Fetch live conditions for all rivers in parallel
  const rivers = ALL_RIVERS
  const results = await Promise.allSettled(
    rivers.map((r: typeof rivers[number]) => fetchGaugeData(r.g, r.opt).then(flow => ({ id: r.id, stateKey: r.stateKey, name: r.n, flow })))
  )

  // Build per-state condition summary
  type StateCondition = { optimal: number; low: number; high: number; flood: number; total: number; topCfs: { name: string; cfs: number; condition: FlowCondition }[] }
  const stateConditions: Record<string, StateCondition> = {}

  for (const result of results) {
    if (result.status !== 'fulfilled') continue
    const { stateKey, flow, name } = result.value
    if (!stateConditions[stateKey]) stateConditions[stateKey] = { optimal: 0, low: 0, high: 0, flood: 0, total: 0, topCfs: [] }
    const sc = stateConditions[stateKey]
    sc.total++
    if (flow.condition === 'optimal') sc.optimal++
    else if (flow.condition === 'low') sc.low++
    else if (flow.condition === 'high') sc.high++
    else if (flow.condition === 'flood') sc.flood++
    if (flow.cfs !== null) {
      sc.topCfs.push({ name, cfs: flow.cfs, condition: flow.condition })
    }
  }

  // Determine dominant condition per state
  const stateFlowMap: Record<string, FlowCondition> = {}
  for (const [key, sc] of Object.entries(stateConditions)) {
    if (sc.flood > 0) stateFlowMap[key] = 'flood'
    else if (sc.high > sc.optimal) stateFlowMap[key] = 'high'
    else if (sc.optimal > 0) stateFlowMap[key] = 'optimal'
    else stateFlowMap[key] = 'low'
  }

  // Count conditions across all rivers
  let totalOptimal = 0, totalHigh = 0, totalFlood = 0
  for (const sc of Object.values(stateConditions)) {
    totalOptimal += sc.optimal
    totalHigh += sc.high
    totalFlood += sc.flood
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--tx)', display: 'flex', flexDirection: 'column' }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', height: '44px', borderBottom: '.5px solid var(--bd)',
        background: 'var(--bg)', flexShrink: 0,
      }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: 700, color: 'var(--rvdk)', letterSpacing: '-.3px' }}>
          River<span style={{ color: 'var(--wt)' }}>Scout</span>
        </span>
        <div style={{ display: 'flex', gap: '6px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px' }}>
          <span style={{ padding: '5px 10px', borderRadius: '20px', border: '.5px solid var(--rvmd)', color: 'var(--rvdk)', background: 'var(--rvlt)' }}>Map</span>
          <Link href="/search" style={{ padding: '5px 10px', borderRadius: '20px', border: '.5px solid var(--bd2)', color: 'var(--tx2)', textDecoration: 'none' }}>Search</Link>
          <Link href="/alerts" style={{ padding: '5px 10px', borderRadius: '20px', border: '.5px solid var(--bd2)', color: 'var(--tx2)', textDecoration: 'none' }}>Flow Alerts</Link>
          <Link href="/about/improvements" style={{ padding: '5px 10px', borderRadius: '20px', border: '.5px solid var(--bd2)', color: 'var(--tx2)', textDecoration: 'none' }}>Community</Link>
          <Link href="/outfitters" style={{ padding: '5px 10px', borderRadius: '20px', border: '.5px solid var(--bd2)', color: 'var(--tx2)', textDecoration: 'none' }}>For Outfitters</Link>
          <AuthNav />
        </div>
      </nav>

      {/* Hero row */}
      <div style={{ padding: '14px 20px 10px', flexShrink: 0 }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--rv)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>
          Live River Atlas
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px', flexWrap: 'wrap' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '21px', fontWeight: 700, lineHeight: 1.2, color: 'var(--rvdk)', margin: 0 }}>
            Paddle Every River in America
          </h1>
          <div style={{ display: 'flex', gap: '18px', flexShrink: 0 }}>
            {[
              { n: String(riverCount), l: 'Rivers' },
              { n: String(stateCount), l: 'States' },
              { n: 'Live', l: 'USGS' },
            ].map(s => (
              <div key={s.l} style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', fontWeight: 600, color: 'var(--rvdk)' }}>{s.n}</span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.5px' }}>{s.l}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Live conditions bar */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px' }}>
          {totalOptimal > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--rv)', display: 'inline-block' }} />
              <span style={{ color: 'var(--rv)' }}>{totalOptimal} optimal</span>
            </span>
          )}
          {totalHigh > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--am)', display: 'inline-block' }} />
              <span style={{ color: 'var(--am)' }}>{totalHigh} high</span>
            </span>
          )}
          {totalFlood > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--dg)', display: 'inline-block' }} />
              <span style={{ color: 'var(--dg)' }}>{totalFlood} flood</span>
            </span>
          )}
        </div>
      </div>

      {/* Map — fills remaining height */}
      <div style={{ flex: 1, minHeight: 0, padding: '0 8px 8px', position: 'relative' }}>
        <USMap stateFlowMap={stateFlowMap} stateConditions={stateConditions} />
      </div>
    </main>
  )
}
