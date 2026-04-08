import Link from 'next/link'
import { ALL_RIVERS, STATES, getRiverPath } from '@/data/rivers'
import { fetchGaugeData, formatCfs } from '@/lib/usgs'
import { RAPIDS } from '@/data/rapids'
import AlertSubscriber from '@/components/alerts/AlertSubscriber'

// Revalidate every 15 minutes
export const revalidate = 900

export default async function AlertsPage() {
  // Fetch flow data for all rivers in parallel
  const flowResults = await Promise.allSettled(
    ALL_RIVERS.map(r => fetchGaugeData(r.g, r.opt).then(flow => ({ id: r.id, flow })))
  )

  const flowMap: Record<string, Awaited<ReturnType<typeof fetchGaugeData>>> = {}
  for (const result of flowResults) {
    if (result.status === 'fulfilled') {
      flowMap[result.value.id] = result.value.flow
    }
  }

  const stateNames = Object.fromEntries(Object.entries(STATES).map(([k, s]) => [k, s.name]))

  const condLabel: Record<string, string> = { optimal: 'Optimal', low: 'Low', high: 'High', flood: 'FLOOD', loading: '—' }
  const condClass: Record<string, Record<string, string>> = {
    optimal: { background: 'var(--rvlt)', color: 'var(--rvdk)' },
    low: { background: 'var(--lolt)', color: 'var(--lo)' },
    high: { background: 'var(--amlt)', color: 'var(--am)' },
    flood: { background: 'var(--dglt)', color: 'var(--dg)' },
    loading: { background: 'var(--bg3)', color: 'var(--tx3)' },
  }

  // Build river options for the subscriber component
  const riverOptions = ALL_RIVERS.map(r => ({
    id: r.id,
    name: r.n,
    stateKey: r.stateKey,
    stateName: stateNames[r.stateKey] ?? r.stateKey,
    condition: flowMap[r.id]?.condition ?? 'loading',
    cfs: flowMap[r.id]?.cfs ?? null,
  }))

  // Count conditions
  const counts = { optimal: 0, low: 0, high: 0, flood: 0 }
  for (const r of ALL_RIVERS) {
    const cond = flowMap[r.id]?.condition
    if (cond && cond !== 'loading') counts[cond as keyof typeof counts]++
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--tx)', display: 'flex', flexDirection: 'column' }}>
      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', height: '44px', borderBottom: '.5px solid var(--bd)', background: 'var(--bg)', flexShrink: 0 }}>
        <Link href="/" style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: 700, color: 'var(--rvdk)', letterSpacing: '-.3px', textDecoration: 'none' }}>
          River<span style={{ color: 'var(--wt)' }}>Scout</span>
        </Link>
        <div style={{ display: 'flex', gap: '6px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px' }}>
          <Link href="/" style={{ padding: '5px 10px', borderRadius: '20px', border: '.5px solid var(--bd2)', color: 'var(--tx2)', textDecoration: 'none' }}>Map</Link>
          <Link href="/search" style={{ padding: '5px 10px', borderRadius: '20px', border: '.5px solid var(--bd2)', color: 'var(--tx2)', textDecoration: 'none' }}>Search</Link>
          <span style={{ padding: '5px 10px', borderRadius: '20px', border: '.5px solid var(--rvmd)', color: 'var(--rvdk)', background: 'var(--rvlt)' }}>Flow Alerts</span>
        </div>
      </nav>

      {/* Header */}
      <div style={{ padding: '20px 28px 12px', borderBottom: '.5px solid var(--bd)', flexShrink: 0 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 700, marginBottom: '3px' }}>
          Flow Alerts
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--tx2)', fontStyle: 'italic', marginBottom: '8px' }}>
          Live USGS discharge data across all {ALL_RIVERS.length} monitored rivers
        </p>
        <div style={{ display: 'flex', gap: '12px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px' }}>
          {counts.optimal > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--rv)', display: 'inline-block' }} />
              <span style={{ color: 'var(--rv)' }}>{counts.optimal} optimal</span>
            </span>
          )}
          {counts.high > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--am)', display: 'inline-block' }} />
              <span style={{ color: 'var(--am)' }}>{counts.high} high</span>
            </span>
          )}
          {counts.low > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--lo)', display: 'inline-block' }} />
              <span style={{ color: 'var(--lo)' }}>{counts.low} low</span>
            </span>
          )}
          {counts.flood > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--dg)', display: 'inline-block' }} />
              <span style={{ color: 'var(--dg)' }}>{counts.flood} flood</span>
            </span>
          )}
        </div>
      </div>

      {/* Alert subscription section */}
      <AlertSubscriber rivers={riverOptions} />

      {/* Live flow grid */}
      <div style={{ padding: '0 28px 16px' }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '14px', fontWeight: 600, marginBottom: '10px' }}>
          All Rivers — Live Conditions
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
          {ALL_RIVERS.map(river => {
            const flow = flowMap[river.id]
            const cond = flow?.condition ?? 'loading'
            const style = condClass[cond]

            return (
              <Link
                key={river.id}
                href={getRiverPath(river)}
                style={{
                  display: 'block', textDecoration: 'none', color: 'var(--tx)',
                  background: 'var(--bg)', border: '.5px solid var(--bd)',
                  borderRadius: 'var(--rlg)', padding: '13px',
                  ...(cond === 'high' ? { borderColor: 'var(--am)', background: 'var(--amlt)' } : {}),
                  ...(cond === 'low' ? { borderColor: 'var(--lo)', background: 'var(--lolt)' } : {}),
                  ...(cond === 'flood' ? { borderColor: 'var(--dg)', background: 'var(--dglt)' } : {}),
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: "'Playfair Display', serif", fontSize: '14px', fontWeight: 600, marginBottom: '1px' }}>
                  {river.n}
                  {RAPIDS[river.id]?.length > 0 && (
                    <span className="verified-badge" title="Rapids verified by local paddlers">&#10003;</span>
                  )}
                </div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', marginBottom: '8px' }}>
                  {river.abbr} · Gauge {river.g}
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 700, lineHeight: 1 }}>
                      {flow ? formatCfs(flow.cfs) : '—'}
                    </span>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx2)', marginLeft: '4px' }}>cfs</span>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', marginTop: '2px' }}>
                      optimal {river.opt} cfs
                    </div>
                  </div>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', padding: '3px 8px', borderRadius: '12px', fontWeight: 500, ...style }}>
                    {condLabel[cond]}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}
