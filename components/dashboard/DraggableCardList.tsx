'use client'

// Wraps the saved-river cards on the dashboard with up/down arrow
// buttons for reordering. Replaces the old HTML5 drag-and-drop
// which caused rage-clicking (cards were draggable but also
// clickable, with no visual affordance for the drag).
//
// Persists the new order via /api/saved-rivers/reorder on every
// move. Falls back gracefully when the API call fails — the local
// state stays updated.

import { useEffect, useState } from 'react'

const mono = "'IBM Plex Mono', monospace"

interface Props {
  userId: string
  riverIds: string[]
  children: React.ReactNode[]
}

export default function DraggableCardList({ userId, riverIds, children }: Props) {
  const [order, setOrder] = useState<string[]>(riverIds)

  const idIndex = new Map(riverIds.map((id, i) => [id, i]))

  useEffect(() => { setOrder(riverIds) }, [riverIds.join('|')])  // eslint-disable-line react-hooks/exhaustive-deps

  function move(id: string, direction: 'up' | 'down') {
    const idx = order.indexOf(id)
    if (idx === -1) return
    if (direction === 'up' && idx === 0) return
    if (direction === 'down' && idx === order.length - 1) return

    const next = [...order]
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    ;[next[idx], next[swapIdx]] = [next[swapIdx], next[idx]]
    setOrder(next)

    fetch('/api/saved-rivers/reorder', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, riverIds: next }),
    }).catch(() => {})
  }

  return (
    <>
      {order.map((id, i) => {
        const childIdx = idIndex.get(id)
        if (childIdx == null) return null
        return (
          <div key={id} style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', right: '8px', top: '8px',
              display: 'flex', gap: '2px', zIndex: 2,
            }}>
              <ArrowButton
                direction="up"
                disabled={i === 0}
                onClick={() => move(id, 'up')}
              />
              <ArrowButton
                direction="down"
                disabled={i === order.length - 1}
                onClick={() => move(id, 'down')}
              />
            </div>
            {children[childIdx]}
          </div>
        )
      })}
    </>
  )
}

function ArrowButton({ direction, disabled, onClick }: {
  direction: 'up' | 'down'; disabled: boolean; onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={`Move ${direction}`}
      style={{
        fontFamily: mono, fontSize: '11px',
        width: '24px', height: '24px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg)', color: disabled ? 'var(--bd)' : 'var(--tx3)',
        border: '.5px solid var(--bd)', borderRadius: '4px',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'opacity 100ms',
        padding: 0,
      }}
    >
      {direction === 'up' ? '▲' : '▼'}
    </button>
  )
}
