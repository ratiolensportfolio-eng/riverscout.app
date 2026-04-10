'use client'

// Client side of the /rivers alphabetical index. Owns the search,
// state filter, A→Z grouping, and live-condition badge fetching.
//
// Architecture: the server component pre-builds the river list
// (name + state + slug URL) so the page renders instantly. On
// mount we POST every river_id to /api/conditions in chunks of
// 60 and fill in condition badges as the responses come back.
// The user can scroll, search, and click before the badges have
// finished loading — none of that depends on the conditions data.

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

const mono = "'IBM Plex Mono', monospace"
const serif = "'Playfair Display', serif"

export interface IndexedRiver {
  id: string
  name: string
  stateKey: string
  stateName: string
  stateAbbr: string
  url: string
}

interface StateOption {
  key: string
  name: string
  count: number
}

interface Props {
  rivers: IndexedRiver[]
  stateOptions: StateOption[]
  totalRivers: number
  totalStates: number
}

type Condition = 'optimal' | 'high' | 'low' | 'flood' | 'loading'

const CONDITION_STYLES: Record<Condition, { bg: string; color: string; border: string; label: string }> = {
  optimal: { bg: 'var(--rvlt)', color: 'var(--rvdk)', border: 'var(--rvmd)', label: 'Optimal' },
  high:    { bg: 'var(--amlt)', color: 'var(--am)',   border: 'var(--am)',   label: 'High' },
  low:     { bg: 'var(--lolt)', color: 'var(--lo)',   border: 'var(--lo)',   label: 'Low' },
  flood:   { bg: 'var(--dglt)', color: 'var(--dg)',   border: 'var(--dg)',   label: 'Flood' },
  loading: { bg: 'var(--bg2)',  color: 'var(--tx3)',  border: 'var(--bd)',   label: '…' },
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

// Strip a leading article so "The Pine River" sorts/groups under P.
function firstLetter(name: string): string {
  const stripped = name.replace(/^(the|a|an)\s+/i, '').trim()
  const ch = stripped[0]?.toUpperCase()
  return ch && /[A-Z]/.test(ch) ? ch : '#'
}

export default function RiversIndexClient({ rivers, stateOptions, totalRivers, totalStates }: Props) {
  const [query, setQuery] = useState('')
  const [stateFilter, setStateFilter] = useState<string>('')
  const [conditions, setConditions] = useState<Record<string, Condition>>({})
  const [conditionsLoading, setConditionsLoading] = useState(true)

  // Live-condition fetch on mount. We chunk client-side too so the
  // POST body doesn't get unwieldy and so partial results can paint
  // before the whole batch finishes — the badges fill in as each
  // chunk's response arrives.
  useEffect(() => {
    let cancelled = false
    async function loadConditions() {
      const CHUNK = 60
      const chunks: string[][] = []
      for (let i = 0; i < rivers.length; i += CHUNK) {
        chunks.push(rivers.slice(i, i + CHUNK).map(r => r.id))
      }
      try {
        for (const chunk of chunks) {
          if (cancelled) return
          const res = await fetch('/api/conditions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ riverIds: chunk }),
          })
          if (!res.ok) continue
          const data = await res.json()
          if (cancelled) return
          if (data.conditions) {
            setConditions(prev => {
              const next = { ...prev }
              for (const [id, info] of Object.entries(data.conditions)) {
                const cond = (info as { condition?: string }).condition
                if (cond && cond in CONDITION_STYLES) next[id] = cond as Condition
              }
              return next
            })
          }
        }
      } catch {
        // Best-effort. The page is still useful without badges.
      } finally {
        if (!cancelled) setConditionsLoading(false)
      }
    }
    loadConditions()
    return () => { cancelled = true }
  }, [rivers])

  // Apply search + state filters. Filtering happens client-side
  // since the full list is only ~375 entries — well within real-
  // time-typing performance.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rivers.filter(r => {
      if (stateFilter && r.stateKey !== stateFilter) return false
      if (!q) return true
      return (
        r.name.toLowerCase().includes(q) ||
        r.stateName.toLowerCase().includes(q) ||
        r.stateAbbr.toLowerCase().includes(q)
      )
    })
  }, [rivers, query, stateFilter])

  // Group filtered rivers by first letter for the section headings
  // and the A→Z anchor strip. We compute this whenever the filter
  // changes so empty groups disappear from the anchor row.
  const grouped = useMemo(() => {
    const groups: Record<string, IndexedRiver[]> = {}
    for (const r of filtered) {
      const letter = firstLetter(r.name)
      if (!groups[letter]) groups[letter] = []
      groups[letter].push(r)
    }
    return groups
  }, [filtered])

  const presentLetters = useMemo(() => {
    const set = new Set(Object.keys(grouped))
    return ALPHABET.filter(l => set.has(l))
  }, [grouped])

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--tx)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 20px 60px' }}>
        {/* Header */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--rv)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>
            All Rivers
          </div>
          <h1 style={{ fontFamily: serif, fontSize: '26px', fontWeight: 700, color: 'var(--rvdk)', margin: '0 0 6px' }}>
            Live Conditions for {totalRivers} Rivers
          </h1>
          <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx2)', lineHeight: 1.5 }}>
            Real-time USGS flow data across {totalStates} states &middot; updated every 15 minutes
          </div>
        </div>

        {/* Search + state filter */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by river or state…"
            style={{
              flex: '1 1 240px',
              fontFamily: mono, fontSize: '12px',
              padding: '10px 14px',
              border: '.5px solid var(--bd2)',
              borderRadius: 'var(--r)',
              background: 'var(--bg)',
              color: 'var(--tx)',
              outline: 'none',
              minHeight: '40px',
            }}
          />
          <select
            value={stateFilter}
            onChange={e => setStateFilter(e.target.value)}
            style={{
              fontFamily: mono, fontSize: '12px',
              padding: '10px 14px',
              border: '.5px solid var(--bd2)',
              borderRadius: 'var(--r)',
              background: 'var(--bg)',
              color: 'var(--tx)',
              minWidth: '180px',
              minHeight: '40px',
            }}
          >
            <option value="">All states ({totalRivers})</option>
            {stateOptions.map(s => (
              <option key={s.key} value={s.key}>{s.name} ({s.count})</option>
            ))}
          </select>
        </div>

        {/* Result count + condition loading hint */}
        <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <span>{filtered.length} river{filtered.length === 1 ? '' : 's'}{(query || stateFilter) ? ' match your filters' : ''}</span>
          {conditionsLoading && <span style={{ color: 'var(--tx3)' }}>Loading live conditions…</span>}
        </div>

        {/* A→Z anchor strip — only the letters that have results */}
        {presentLetters.length > 0 && (
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '4px',
            padding: '10px 12px', marginBottom: '20px',
            background: 'var(--bg2)', borderRadius: 'var(--r)',
            border: '.5px solid var(--bd)',
            position: 'sticky', top: 0, zIndex: 10,
          }}>
            {ALPHABET.map(letter => {
              const has = presentLetters.includes(letter)
              return (
                <a
                  key={letter}
                  href={has ? `#letter-${letter}` : undefined}
                  aria-disabled={!has}
                  style={{
                    fontFamily: mono, fontSize: '11px', fontWeight: 600,
                    padding: '4px 8px',
                    minWidth: '24px', textAlign: 'center',
                    borderRadius: '4px',
                    color: has ? 'var(--rvdk)' : 'var(--bd2)',
                    background: has ? 'var(--bg)' : 'transparent',
                    border: has ? '.5px solid var(--rvmd)' : '.5px solid transparent',
                    textDecoration: 'none',
                    cursor: has ? 'pointer' : 'default',
                    pointerEvents: has ? 'auto' : 'none',
                  }}
                >
                  {letter}
                </a>
              )
            })}
          </div>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--tx3)', fontFamily: mono, fontSize: '12px' }}>
            No rivers match {query ? `"${query}"` : 'this filter'}. Try a different search.
          </div>
        )}

        {/* Grouped river list */}
        {presentLetters.map(letter => (
          <section
            key={letter}
            id={`letter-${letter}`}
            style={{ marginBottom: '24px', scrollMarginTop: '60px' }}
          >
            <div style={{
              fontFamily: serif, fontSize: '20px', fontWeight: 700,
              color: 'var(--rvdk)', marginBottom: '8px',
              borderBottom: '1px solid var(--rvmd)',
              paddingBottom: '4px',
            }}>
              {letter}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {grouped[letter].map(r => {
                const cond = conditions[r.id] ?? 'loading'
                const style = CONDITION_STYLES[cond]
                return (
                  <li key={r.id}>
                    <Link
                      href={r.url}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '10px 12px',
                        gap: '12px',
                        textDecoration: 'none',
                        color: 'var(--tx)',
                        borderBottom: '.5px solid var(--bd)',
                      }}
                    >
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontFamily: serif, fontSize: '15px', fontWeight: 600, color: 'var(--rvdk)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {r.name}
                        </div>
                        <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)', marginTop: '2px' }}>
                          {r.stateName}
                        </div>
                      </div>
                      <span
                        style={{
                          flexShrink: 0,
                          fontFamily: mono, fontSize: '9px', fontWeight: 600,
                          padding: '4px 10px',
                          borderRadius: '12px',
                          background: style.bg,
                          color: style.color,
                          border: `.5px solid ${style.border}`,
                          textTransform: 'uppercase',
                          letterSpacing: '.4px',
                          minWidth: '54px',
                          textAlign: 'center',
                        }}
                      >
                        {style.label}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>
    </main>
  )
}
