import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getState, STATES, getRiverPath } from '@/data/rivers'
import { fetchGaugeData, formatCfs } from '@/lib/usgs'
import { STATE_MAP_CONFIG } from '@/data/state-centers'
import { RIVER_COORDS } from '@/data/river-coordinates'
import StateRiverMap from '@/components/maps/StateRiverMap'
import { getDesignationBadges } from '@/lib/designations'
import { RAPIDS } from '@/data/rapids'
import type { FlowData, FlowCondition } from '@/types'

export const revalidate = 900

interface Props {
  params: Promise<{ state: string }>
}

export async function generateStaticParams() {
  return Object.keys(STATES).map(state => ({ state }))
}

const COND_COLOR: Record<string, string> = {
  optimal: 'var(--rv)',
  low:     '#b08050',
  high:    '#1873cc',
  flood:   '#c0392b',
  loading: 'var(--tx3)',
}

export default async function StatePage({ params }: Props) {
  const { state: stateKey } = await params
  const state = getState(stateKey)
  if (!state) notFound()

  // Fetch live CFS for all rivers in this state in parallel
  const results = await Promise.allSettled(
    state.rivers.map(r => fetchGaugeData(r.g, r.opt))
  )
  const flowMap = new Map<string, FlowData | null>(
    state.rivers.map((r, i) => {
      const res = results[i]
      return [r.id, res.status === 'fulfilled' ? res.value : null]
    })
  )

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--tx)' }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', height: '44px', borderBottom: '.5px solid var(--bd)',
        background: 'var(--bg)',
      }}>
        <Link href="/" style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: 700, color: 'var(--rvdk)', letterSpacing: '-.3px', textDecoration: 'none' }}>
          River<span style={{ color: 'var(--wt)' }}>Scout</span>
        </Link>
        <Link href="/" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', background: 'var(--rvlt)', color: 'var(--rvdk)', padding: '4px 10px', borderRadius: '20px', border: '.5px solid var(--rvmd)', textDecoration: 'none' }}>
          ← Map
        </Link>
      </nav>

      <div className="state-layout">
        {/* Sidebar */}
        <div className="state-sidebar">
          <div style={{ padding: '10px 12px', borderBottom: '.5px solid var(--bd)' }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '14px', fontWeight: 700, marginBottom: '3px' }}>
              {state.name}
            </div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)' }}>
              {state.rivers.length} rivers · Live USGS data
            </div>
          </div>

          {state.rivers.map(river => {
            const flow = flowMap.get(river.id)
            const condColor = COND_COLOR[flow?.condition ?? 'loading']

            return (
              <Link
                key={river.id}
                href={getRiverPath(river)}
                style={{
                  display: 'block', padding: '9px 12px',
                  borderBottom: '.5px solid var(--bd)',
                  textDecoration: 'none', color: 'var(--tx)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: "'Playfair Display', serif", fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>
                    {river.n}
                    {RAPIDS[river.id]?.length > 0 && (
                      <span className="verified-badge" title="Rapids verified by local paddlers">&#10003;</span>
                    )}
                  </div>
                  {/* Live CFS badge — compact rate-of-change indicator
                      sits next to it. Only shown when |rate| >= 25 cfs/hr
                      so we don't clutter the sidebar with stable rivers. */}
                  {flow && flow.cfs !== null && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0, marginLeft: '6px' }}>
                      <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: condColor, flexShrink: 0 }} />
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', fontWeight: 500, color: condColor }}>
                        {formatCfs(flow.cfs)}
                      </span>
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)' }}>
                        cfs
                      </span>
                      {flow.changePerHour !== null && Math.abs(flow.changePerHour) >= 25 && (
                        <span
                          title={flow.rateLabel}
                          style={{
                            fontFamily: "'IBM Plex Mono', monospace",
                            fontSize: '9px',
                            color: flow.trend === 'up' ? 'var(--am)' : 'var(--wt)',
                            fontWeight: 500,
                          }}>
                          {flow.trend === 'up' ? '\u2191' : '\u2193'}{Math.abs(flow.changePerHour) > 100 ? Math.abs(flow.changePerHour) > 300 ? '!!' : '!' : ''}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx2)', marginBottom: '4px' }}>
                  {river.co}
                </div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '9px', fontFamily: "'IBM Plex Mono', monospace", padding: '2px 5px', borderRadius: '3px', background: 'var(--wtlt)', color: 'var(--wt)' }}>
                    Class {river.cls}
                  </span>
                  <span style={{ fontSize: '9px', fontFamily: "'IBM Plex Mono', monospace", color: 'var(--tx3)' }}>
                    {river.len}
                  </span>
                  {flow && flow.condition !== 'loading' && (
                    <span style={{ fontSize: '9px', fontFamily: "'IBM Plex Mono', monospace", padding: '2px 5px', borderRadius: '3px', color: condColor, background: 'var(--bg2)', border: `.5px solid ${condColor}`, opacity: 0.85 }}>
                      {flow.condition === 'optimal' ? 'Optimal' : flow.condition === 'low' ? 'Low' : flow.condition === 'high' ? 'High' : 'Flood'}
                    </span>
                  )}
                </div>
                {/* Designation badges */}
                {(() => {
                  const badges = getDesignationBadges(river.desig)
                  return badges.length > 0 ? (
                    <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', marginTop: '3px' }}>
                      {badges.slice(0, 2).map((b, i) => (
                        <span key={i} style={{
                          fontFamily: "'IBM Plex Mono', monospace", fontSize: '8px',
                          padding: '1px 5px', borderRadius: '6px',
                          color: b.color, background: b.bg, border: `.5px solid ${b.border}`,
                          display: 'inline-flex', alignItems: 'center', gap: '2px',
                        }}>
                          <span style={{ fontSize: '8px' }}>{b.icon}</span> {b.label}
                        </span>
                      ))}
                    </div>
                  ) : null
                })()}
              </Link>
            )
          })}
        </div>

        {/* Main panel — interactive state map */}
        <div className="state-map">
          {(() => {
            const mapConfig = STATE_MAP_CONFIG[stateKey]
            const riverDots = state.rivers.map(river => {
              const flow = flowMap.get(river.id)
              const coords = RIVER_COORDS[river.id]
              return coords ? {
                id: river.id,
                name: river.n,
                lat: coords[0],
                lng: coords[1],
                condition: (flow?.condition ?? 'loading') as FlowCondition,
                cfs: flow?.cfs ?? null,
                cls: river.cls,
                stateKey,
              } : null
            }).filter((r): r is NonNullable<typeof r> => r !== null)

            if (!mapConfig) {
              return (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px', color: 'var(--tx2)' }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '17px' }}>
                    {state.rivers.length} rivers in {state.name}
                  </div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx3)' }}>
                    Select a river from the list
                  </div>
                </div>
              )
            }

            return (
              <StateRiverMap
                rivers={riverDots}
                stateName={state.name}
                stateCenter={mapConfig.center}
                stateZoom={mapConfig.zoom}
              />
            )
          })()}
        </div>
      </div>
    </main>
  )
}
