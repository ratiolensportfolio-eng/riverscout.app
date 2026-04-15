// Inline badge surfacing a multi-river paddling system on the river
// page hero. Renders the route name + clickable river chips so a
// user landing on one river can jump up- or downstream through the
// connected system.
//
// Driven by River.connectedRoute = { name, riverIds: [...] }. The
// order in riverIds is the upstream → downstream traversal order,
// rendered with arrows between chips. The current river is shown
// as bold non-interactive text; the others are links.

import Link from 'next/link'
import { ALL_RIVERS, getRiverPath } from '@/data/rivers'

interface Props {
  currentRiverId: string
  route: { name: string; riverIds: string[] }
}

export default function ConnectedRouteBadge({ currentRiverId, route }: Props) {
  // Build a name+path lookup for the rivers in the route. Skip any
  // ID that isn't in our catalog (defensive — bad IDs in the route
  // shouldn't break the page).
  const lookup = new Map<string, { name: string; path: string }>()
  for (const r of ALL_RIVERS) {
    lookup.set(r.id, { name: r.n, path: getRiverPath(r) })
  }

  return (
    <div style={{
      fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px',
      color: '#085041', background: '#E1F5EE',
      padding: '7px 12px', borderRadius: 'var(--r)',
      marginBottom: '8px', lineHeight: 1.5,
      border: '.5px solid #9FE1CB',
      display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap',
    }}>
      <span style={{ fontSize: '13px' }} aria-hidden>🛶</span>
      <span style={{ fontWeight: 600 }}>Connected route:</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
        {route.riverIds.map((id, i) => {
          const r = lookup.get(id)
          const label = r?.name ?? id
          const isCurrent = id === currentRiverId
          return (
            <span key={id} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              {i > 0 && <span style={{ color: 'rgba(8,80,65,0.5)' }}>→</span>}
              {isCurrent || !r ? (
                <span style={{ fontWeight: 700, color: '#063b2f' }}>{label}</span>
              ) : (
                <Link href={r.path} style={{ color: '#085041', textDecoration: 'underline', textDecorationStyle: 'dotted' }}>
                  {label}
                </Link>
              )}
            </span>
          )
        })}
      </span>
    </div>
  )
}
