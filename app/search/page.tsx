'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ALL_RIVERS, getRiverPath } from '@/data/rivers'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'ww' | 'wild'>('all')

  const results = useMemo(() => {
    const q = query.toLowerCase().trim()
    return ALL_RIVERS.filter(r => {
      const matchesQuery = !q ||
        r.n.toLowerCase().includes(q) ||
        r.co.toLowerCase().includes(q) ||
        (r.desig as string).toLowerCase().includes(q) ||
        (r.desc as string).toLowerCase().includes(q)

      const matchesFilter =
        filter === 'all' ||
        (filter === 'ww' && (r as Record<string, unknown>)['ww']) ||
        (filter === 'wild' && (r as Record<string, unknown>)['wild'])

      return matchesQuery && matchesFilter
    })
  }, [query, filter])

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--tx)', display: 'flex', flexDirection: 'column' }}>
      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', height: '44px', borderBottom: '.5px solid var(--bd)', background: 'var(--bg)', flexShrink: 0 }}>
        <Link href="/" style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: 700, color: 'var(--rvdk)', letterSpacing: '-.3px', textDecoration: 'none' }}>
          River<span style={{ color: 'var(--wt)' }}>Scout</span>
        </Link>
      </nav>

      {/* Search header */}
      <div style={{ padding: '16px 24px', borderBottom: '.5px solid var(--bd)', flexShrink: 0 }}>
        <input
          type="text"
          placeholder="Search rivers, states, designations…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoFocus
          style={{ width: '100%', padding: '8px 12px', border: '.5px solid var(--bd2)', borderRadius: 'var(--r)', fontSize: '14px', fontFamily: "'IBM Plex Mono', monospace", background: 'var(--bg)', color: 'var(--tx)', outline: 'none' }}
        />
        <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
          {(['all', 'ww', 'wild'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                fontSize: '9px', fontFamily: "'IBM Plex Mono', monospace", padding: '3px 8px',
                border: '.5px solid var(--bd2)', borderRadius: '12px', cursor: 'pointer',
                background: filter === f ? 'var(--rvlt)' : 'var(--bg2)',
                color: filter === f ? 'var(--rvdk)' : 'var(--tx2)',
                borderColor: filter === f ? 'var(--rvmd)' : 'var(--bd2)',
              }}
            >
              {f === 'all' ? 'All Rivers' : f === 'ww' ? 'Whitewater' : 'Wild & Scenic'}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', padding: '8px 24px', textTransform: 'uppercase', letterSpacing: '.5px' }}>
          {results.length} rivers
        </div>
        {results.map(river => (
          <Link
            key={river.id}
            href={getRiverPath(river)}
            style={{ display: 'block', padding: '9px 24px', borderBottom: '.5px solid var(--bd)', textDecoration: 'none', color: 'var(--tx)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '14px', fontWeight: 600 }}>{river.n}</div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx2)', margin: '1px 0' }}>
                  {river.stateName} · {river.co}
                </div>
                <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                  <span style={{ fontSize: '9px', fontFamily: "'IBM Plex Mono', monospace", padding: '2px 5px', borderRadius: '3px', background: 'var(--wtlt)', color: 'var(--wt)' }}>
                    Class {river.cls}
                  </span>
                  <span style={{ fontSize: '9px', fontFamily: "'IBM Plex Mono', monospace", color: 'var(--tx3)' }}>{river.len}</span>
                  {!!(river as Record<string, unknown>)['wild'] && <span style={{ fontSize: '9px', fontFamily: "'IBM Plex Mono', monospace", padding: '2px 5px', borderRadius: '3px', background: '#EAF3DE', color: '#3B6D11' }}>Wild & Scenic</span>}
                </div>
              </div>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--tx2)', marginTop: '4px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {river.desc as string}
            </p>
          </Link>
        ))}
      </div>
    </main>
  )
}
