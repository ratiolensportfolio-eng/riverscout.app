'use client'

// Hero gauge picker. For rivers with one gauge this renders nothing.
// For rivers with 2+ gauges it renders a small "Switch gauge" pill
// next to the existing CFS line. Clicking opens a popover listing
// every gauge with its live cfs; clicking a row navigates to
// ?gauge=<gauge_id>, which the river page server component reads to
// override the displayed gauge. The selection also persists in
// localStorage so a returning user lands on their preferred gauge
// without the URL param.

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface Gauge {
  id: string
  gauge_id: string
  gauge_name: string
  gauge_source: 'usgs' | 'wsc' | 'manual'
  river_section: string | null
  is_primary: boolean
  current_cfs: number | null
}

interface Props {
  riverId: string
  currentGaugeId: string
}

const STORAGE_PREFIX = 'riverscout_gauge_'

export default function GaugeSwitcher({ riverId, currentGaugeId }: Props) {
  const [gauges, setGauges] = useState<Gauge[] | null>(null)
  const [open, setOpen] = useState(false)
  const popRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Fetch the gauge list on mount. If the API returns 0 or 1 gauge
  // we render nothing (single-gauge rivers stay unchanged).
  useEffect(() => {
    let cancel = false
    fetch(`/api/rivers/${riverId}/gauges`)
      .then(r => r.json())
      .then(d => { if (!cancel) setGauges(d.gauges || []) })
      .catch(() => { if (!cancel) setGauges([]) })
    return () => { cancel = true }
  }, [riverId])

  // On first mount, if no ?gauge param is set but we have a saved
  // selection in localStorage (and that gauge still exists for this
  // river), navigate to it so the user lands on their preferred view.
  useEffect(() => {
    if (!gauges?.length) return
    if (searchParams.get('gauge')) return
    let saved: string | null = null
    try { saved = localStorage.getItem(STORAGE_PREFIX + riverId) } catch { /* ignore */ }
    if (saved && saved !== currentGaugeId && gauges.some(g => g.gauge_id === saved)) {
      router.replace(`?gauge=${saved}`, { scroll: false })
    }
  }, [gauges, riverId, currentGaugeId, router, searchParams])

  // Click-outside to close.
  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (popRef.current && !popRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  if (!gauges || gauges.length < 2) return null

  function pick(g: Gauge) {
    try { localStorage.setItem(STORAGE_PREFIX + riverId, g.gauge_id) } catch { /* ignore */ }
    setOpen(false)
    router.push(`?gauge=${g.gauge_id}`, { scroll: false })
  }

  const selected = gauges.find(g => g.gauge_id === currentGaugeId) ?? gauges[0]

  return (
    <span style={{ position: 'relative', display: 'inline-block' }} ref={popRef}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        title={`Switch among ${gauges.length} gauges on this river`}
        style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px',
          background: 'var(--rvlt)', color: 'var(--rvdk)',
          border: '.5px solid var(--rvmd)',
          padding: '3px 8px', borderRadius: '12px',
          cursor: 'pointer',
        }}
      >
        ⇄ {gauges.length} gauges
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, marginTop: '4px',
          minWidth: '320px', maxWidth: '400px',
          background: 'var(--bg)', border: '.5px solid var(--bd)',
          borderRadius: 'var(--r)', boxShadow: '0 4px 16px rgba(0,0,0,.12)',
          padding: '6px', zIndex: 50,
        }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px',
            color: 'var(--tx3)', padding: '4px 8px', textTransform: 'uppercase', letterSpacing: '.3px',
          }}>
            Select gauge
          </div>
          {gauges.map(g => {
            const isSel = g.gauge_id === selected.gauge_id
            return (
              <button
                key={g.gauge_id}
                type="button"
                onClick={() => pick(g)}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  width: '100%', textAlign: 'left',
                  padding: '8px 10px', borderRadius: 'var(--r)',
                  border: 'none', background: isSel ? 'var(--rvlt)' : 'transparent',
                  cursor: 'pointer', fontFamily: 'inherit',
                  marginBottom: '2px',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                  <span style={{
                    width: '10px', height: '10px', borderRadius: '50%',
                    border: '1.5px solid var(--rvdk)',
                    background: isSel ? 'var(--rvdk)' : 'transparent',
                    flexShrink: 0,
                  }} />
                  <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <span style={{
                      fontFamily: "'Playfair Display', serif", fontSize: '13px', fontWeight: 600,
                      color: 'var(--tx)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {g.river_section ?? g.gauge_name}
                    </span>
                    <span style={{
                      fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)',
                    }}>
                      {g.gauge_source.toUpperCase()} #{g.gauge_id}{g.is_primary ? ' · primary' : ''}
                    </span>
                  </span>
                </span>
                <span style={{
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px',
                  color: g.current_cfs === null ? 'var(--tx3)' : 'var(--tx2)',
                  fontWeight: 600, flexShrink: 0, marginLeft: '12px',
                }}>
                  {g.current_cfs === null ? '—' : g.current_cfs.toLocaleString() + ' cfs'}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </span>
  )
}
