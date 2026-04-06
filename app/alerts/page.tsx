import Link from 'next/link'
import { ALL_RIVERS, STATES } from '@/data/rivers'
import { fetchGaugeData, formatCfs } from '@/lib/usgs'

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

  const condLabel = { optimal: 'Optimal', low: 'Low', high: 'High', flood: 'FLOOD', loading: '—' }
  const condClass = {
    optimal: { background: 'var(--rvlt)', color: 'var(--rvdk)' },
    low: { background: 'var(--lolt)', color: 'var(--lo)' },
    high: { background: 'var(--amlt)', color: 'var(--am)' },
    flood: { background: 'var(--dglt)', color: 'var(--dg)' },
    loading: { background: 'var(--bg3)', color: 'var(--tx3)' },
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--tx)', display: 'flex', flexDirection: 'column' }}>
      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', height: '44px', borderBottom: '.5px solid var(--bd)', background: 'var(--bg)', flexShrink: 0 }}>
        <Link href="/" style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: 700, color: 'var(--rvdk)', letterSpacing: '-.3px', textDecoration: 'none' }}>
          River<span style={{ color: 'var(--wt)' }}>Scout</span>
        </Link>
      </nav>

      {/* Header */}
      <div style={{ padding: '20px 28px 12px', borderBottom: '.5px solid var(--bd)', flexShrink: 0 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 700, marginBottom: '3px' }}>
          Flow Alerts
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--tx2)', fontStyle: 'italic' }}>
          Live USGS discharge data across all {ALL_RIVERS.length} monitored rivers
        </p>
      </div>

      {/* Grid */}
      <div style={{ padding: '16px 28px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px', overflowY: 'auto', flex: 1 }}>
        {ALL_RIVERS.map(river => {
          const flow = flowMap[river.id]
          const cond = flow?.condition ?? 'loading'
          const style = condClass[cond]

          return (
            <Link
              key={river.id}
              href={`/rivers/${river.id}`}
              style={{
                display: 'block', textDecoration: 'none', color: 'var(--tx)',
                background: 'var(--bg)', border: '.5px solid var(--bd)',
                borderRadius: 'var(--rlg)', padding: '13px',
                ...(cond === 'high' ? { borderColor: 'var(--am)', background: 'var(--amlt)' } : {}),
                ...(cond === 'low' ? { borderColor: 'var(--lo)', background: 'var(--lolt)' } : {}),
                ...(cond === 'flood' ? { borderColor: 'var(--dg)', background: 'var(--dglt)' } : {}),
              }}
            >
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '14px', fontWeight: 600, marginBottom: '1px' }}>
                {river.n}
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
    </main>
  )
}
