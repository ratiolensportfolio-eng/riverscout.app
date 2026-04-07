import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getState, STATES, getRiverPath } from '@/data/rivers'
import { fetchGaugeData, formatCfs } from '@/lib/usgs'
import type { FlowData } from '@/types'

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

      <div style={{ display: 'flex', height: 'calc(100vh - 44px)' }}>
        {/* Sidebar */}
        <div style={{ width: '315px', flexShrink: 0, borderRight: '.5px solid var(--bd)', overflowY: 'auto' }}>
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
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>
                    {river.n}
                  </div>
                  {/* Live CFS badge */}
                  {flow && flow.cfs !== null && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0, marginLeft: '6px' }}>
                      <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: condColor, flexShrink: 0 }} />
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', fontWeight: 500, color: condColor }}>
                        {formatCfs(flow.cfs)}
                      </span>
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)' }}>
                        cfs
                      </span>
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
              </Link>
            )
          })}
        </div>

        {/* Main panel */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px', color: 'var(--tx2)' }}>
          <div style={{ fontSize: '36px', opacity: 0.15 }}>⛵</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '17px' }}>
            Select a river
          </div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx3)', textAlign: 'center', lineHeight: 1.6 }}>
            {state.rivers.length} rivers in {state.name}<br />
            with live USGS flow data
          </div>
        </div>
      </div>
    </main>
  )
}
