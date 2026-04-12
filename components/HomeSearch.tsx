'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ALL_RIVERS, getRiverPath } from '@/data/rivers'

const mono = "'IBM Plex Mono', monospace"

// Lightweight client-side search across river names, state names,
// and (if fisheries data is loaded) species. Renders as a centered
// search bar on the homepage hero with a dropdown of matches.
//
// No server round trips — the static ALL_RIVERS catalog is already
// bundled in the client JS. The search is instant.

interface SearchResult {
  id: string
  name: string
  state: string
  path: string
}

export default function HomeSearch() {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Build results from the static catalog whenever the query changes.
  useEffect(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 2) {
      setResults([])
      setSelectedIndex(-1)
      return
    }

    const matches: SearchResult[] = []
    for (const r of ALL_RIVERS) {
      const nameMatch = r.n.toLowerCase().includes(q)
      const stateMatch = (r.stateName as string).toLowerCase().includes(q)
      const abbr = (r.stateKey as string).toLowerCase() === q
      if (nameMatch || stateMatch || abbr) {
        matches.push({
          id: r.id,
          name: r.n,
          state: r.stateName as string,
          path: getRiverPath(r),
        })
      }
      if (matches.length >= 8) break
    }

    setResults(matches)
    setSelectedIndex(-1)
  }, [query])

  function navigate(path: string) {
    setQuery('')
    setResults([])
    router.push(path)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex >= 0 && results[selectedIndex]) {
        navigate(results[selectedIndex].path)
      } else if (results.length > 0) {
        navigate(results[0].path)
      } else if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      }
    } else if (e.key === 'Escape') {
      setResults([])
      inputRef.current?.blur()
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 200)}
        onKeyDown={onKeyDown}
        placeholder="Search rivers, states, or species..."
        style={{
          width: '100%', boxSizing: 'border-box',
          padding: '14px 20px',
          fontFamily: mono, fontSize: '14px',
          color: '#1a1a1a',
          background: 'rgba(255, 255, 255, 0.95)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '12px',
          outline: 'none',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(8px)',
        }}
      />

      {/* Dropdown results */}
      {focused && results.length > 0 && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)',
          left: 0, right: 0, zIndex: 100,
          background: '#fff', borderRadius: '10px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden',
          maxHeight: '320px', overflowY: 'auto',
        }}>
          {results.map((r, i) => (
            <button
              key={r.id}
              onMouseDown={() => navigate(r.path)}
              style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%', padding: '12px 16px',
                fontFamily: mono, fontSize: '13px',
                color: '#1a1a1a', textAlign: 'left',
                background: i === selectedIndex ? '#f0f7f4' : '#fff',
                border: 'none', borderBottom: '.5px solid #eee',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontWeight: 500 }}>{r.name}</span>
              <span style={{
                fontSize: '10px', color: '#888',
                padding: '2px 8px', borderRadius: '8px',
                background: '#f5f5f5',
              }}>
                {r.state}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
