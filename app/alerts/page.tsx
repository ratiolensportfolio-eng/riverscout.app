import Link from 'next/link'
import { ALL_RIVERS, STATES, getRiverPath } from '@/data/rivers'
import { fetchGaugeDataBatch, formatCfs } from '@/lib/usgs'
import type { FlowData } from '@/types'
import { RAPIDS } from '@/data/rapids'
import { hasReleases } from '@/data/dam-releases'
import SetAnAlert from '@/components/alerts/SetAnAlert'

// Revalidate every 15 minutes
export const revalidate = 900

export default async function AlertsPage() {
  // Fetch flow data for every river in batched USGS calls (chunks of
  // 80 sites). Was 1100+ parallel single-site requests — slow and
  // hitting USGS rate limits.
  // PT2H — alerts list only needs current cfs + condition per row.
  const batch = await fetchGaugeDataBatch(
    ALL_RIVERS.map(r => ({ gaugeId: r.g, optRange: r.opt })),
    { period: 'PT2H' },
  )
  const flowMap: Record<string, FlowData> = {}
  for (const r of ALL_RIVERS) {
    const f = batch.get(r.g)
    if (f) flowMap[r.id] = f
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

  // Build river options for the new SetAnAlert component. Only id/
  // name/state are needed there; condition/cfs are not displayed in
  // the dropdowns so we omit them to keep the payload slim.
  const riverOptions = ALL_RIVERS.map(r => ({
    id: r.id,
    name: r.n,
    stateKey: r.stateKey,
    stateName: stateNames[r.stateKey] ?? r.stateKey,
  }))

  // Dammed rivers with scheduled releases. Used to constrain the
  // river selector in the Dam Release Alert form so users can't
  // subscribe to a river with no scheduled releases.
  const dammedRiverIds = ALL_RIVERS.map(r => r.id).filter(hasReleases)

  // Count conditions
  const counts = { optimal: 0, low: 0, high: 0, flood: 0 }
  for (const r of ALL_RIVERS) {
    const cond = flowMap[r.id]?.condition
    if (cond && cond !== 'loading') counts[cond as keyof typeof counts]++
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--tx)', display: 'flex', flexDirection: 'column' }}>
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

      {/* Set an alert — 3 cards (Flow, Hatch, Release) + inline
          expanding form. Replaces the old email-box subscriber and
          the green Pro upsell banner. Pro gating is inline per form. */}
      <SetAnAlert rivers={riverOptions} dammedRiverIds={dammedRiverIds} />

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
                    {/* Rate of change — only when meaningful (>= 25 cfs/hr).
                        Stable rivers stay quiet so the grid doesn't shout. */}
                    {flow && flow.changePerHour !== null && Math.abs(flow.changePerHour) >= 25 && (
                      <div style={{
                        fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px',
                        color: flow.trend === 'up' ? 'var(--am)' : '#185FA5',
                        marginTop: '2px', fontWeight: 500,
                      }}>
                        {flow.rateLabel}
                      </div>
                    )}
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
