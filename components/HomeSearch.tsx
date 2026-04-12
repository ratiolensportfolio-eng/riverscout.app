'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ALL_RIVERS, STATES, getStateSlug, getRiverPath } from '@/data/rivers'

const mono = "'IBM Plex Mono', monospace"

// Search result types — states, rivers, and species each render
// differently in the dropdown and navigate to different destinations.
interface SearchResult {
  type: 'state' | 'river' | 'species'
  id: string
  label: string
  sublabel: string
  path: string
}

// Build the state list once at module scope so we don't recompute
// on every keystroke.
const STATE_LIST = Object.entries(STATES).map(([key, state]) => ({
  key,
  name: state.name as string,
  abbr: state.abbr as string,
  slug: getStateSlug(key),
  riverCount: (state.rivers as unknown[]).length,
}))

// Species names that appear across fisheries data. We search
// against a static list of the common species names since the
// full fisheries module is lazy-loaded. These cover the species
// the fish icons support + the most commonly searched terms.
const SEARCHABLE_SPECIES = [
  'Brown Trout', 'Rainbow Trout', 'Brook Trout', 'Cutthroat Trout',
  'Lake Trout', 'Steelhead', 'Chinook Salmon', 'Coho Salmon',
  'Atlantic Salmon', 'Walleye', 'Muskie', 'Smallmouth Bass',
  'Largemouth Bass', 'Channel Catfish', 'Northern Pike',
  'Striped Bass', 'Bluegill', 'Crappie',
]

export default function HomeSearch() {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 2) {
      setResults([])
      setSelectedIndex(-1)
      return
    }

    const matches: SearchResult[] = []

    // 1. State matches — show at the top so "Michigan" → state page
    for (const s of STATE_LIST) {
      if (s.name.toLowerCase().includes(q) || s.abbr.toLowerCase() === q) {
        matches.push({
          type: 'state',
          id: `state-${s.key}`,
          label: s.name,
          sublabel: `${s.riverCount} rivers`,
          path: `/rivers?state=${s.slug}`,
        })
      }
      if (matches.length >= 3) break // cap state results at 3
    }

    // 2. River name matches — prioritize name hits over state-only hits
    let riverCount = 0
    for (const r of ALL_RIVERS) {
      if (riverCount >= 6) break
      const nameMatch = r.n.toLowerCase().includes(q)
      if (nameMatch) {
        matches.push({
          type: 'river',
          id: r.id,
          label: r.n,
          sublabel: r.stateName as string,
          path: getRiverPath(r),
        })
        riverCount++
      }
    }

    // 3. Species matches — link to the hatches page (which shows
    //    rivers where each species is present)
    if (riverCount < 4) {
      for (const sp of SEARCHABLE_SPECIES) {
        if (sp.toLowerCase().includes(q)) {
          matches.push({
            type: 'species',
            id: `species-${sp}`,
            label: sp,
            sublabel: 'Fish species',
            path: '/hatches',
          })
          if (matches.length >= 10) break
        }
      }
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

  const TYPE_BADGE: Record<string, { bg: string; color: string; label: string }> = {
    state: { bg: '#E6F1FB', color: '#0C447C', label: 'State' },
    river: { bg: '#f5f5f5', color: '#888', label: '' },
    species: { bg: '#E1F5EE', color: '#085041', label: 'Species' },
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

      {focused && results.length > 0 && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)',
          left: 0, right: 0, zIndex: 100,
          background: '#fff', borderRadius: '10px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden',
          maxHeight: '380px', overflowY: 'auto',
        }}>
          {results.map((r, i) => {
            const badge = TYPE_BADGE[r.type]
            return (
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
                  gap: '8px',
                }}
              >
                <span style={{ fontWeight: 500, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.label}
                </span>
                <span style={{
                  fontSize: '10px', color: badge.color,
                  padding: '2px 8px', borderRadius: '8px',
                  background: badge.bg, flexShrink: 0,
                  whiteSpace: 'nowrap',
                }}>
                  {badge.label || r.sublabel}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
