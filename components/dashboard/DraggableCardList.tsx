'use client'

// Wraps the saved-river cards on the dashboard with HTML5 drag and
// drop. Persists the new order via /api/saved-rivers/reorder on
// drop. Falls back gracefully when the API call fails — the local
// state stays updated, the next page render will re-fetch from the
// server.
//
// We use HTML5 dnd directly to avoid pulling in a dnd library — the
// dashboard is server-rendered and we want to keep client JS lean.

import { useEffect, useState } from 'react'

interface Props {
  userId: string
  riverIds: string[]      // initial server-rendered order
  children: React.ReactNode[]  // one card per riverId, same order
}

export default function DraggableCardList({ userId, riverIds, children }: Props) {
  // Mirror server order locally. Reordering only mutates this; the
  // children prop stays the same — we render in `order` index order.
  const [order, setOrder] = useState<string[]>(riverIds)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)

  // Map id → index into the `children` array so we can re-render in
  // the new order without rebuilding the children themselves.
  const idIndex = new Map(riverIds.map((id, i) => [id, i]))

  // Sync if server order changes after mount (e.g. user saved a new
  // river in another tab).
  useEffect(() => { setOrder(riverIds) }, [riverIds.join('|')])  // eslint-disable-line react-hooks/exhaustive-deps

  function onDragStart(id: string) {
    setDraggingId(id)
  }
  function onDragOver(e: React.DragEvent, id: string) {
    e.preventDefault()
    if (draggingId && id !== draggingId) setOverId(id)
  }
  function onDrop(e: React.DragEvent, targetId: string) {
    e.preventDefault()
    if (!draggingId || draggingId === targetId) {
      setDraggingId(null); setOverId(null); return
    }
    const next = order.filter(x => x !== draggingId)
    const insertAt = next.indexOf(targetId)
    next.splice(insertAt, 0, draggingId)
    setOrder(next)
    setDraggingId(null); setOverId(null)
    // Persist (best effort)
    fetch('/api/saved-rivers/reorder', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, riverIds: next }),
    }).catch(() => { /* keep local order anyway */ })
  }

  return (
    <>
      {order.map(id => {
        const childIdx = idIndex.get(id)
        if (childIdx == null) return null
        const isDragging = draggingId === id
        const isOver = overId === id
        return (
          <div
            key={id}
            draggable
            onDragStart={() => onDragStart(id)}
            onDragOver={e => onDragOver(e, id)}
            onDragLeave={() => setOverId(null)}
            onDrop={e => onDrop(e, id)}
            onDragEnd={() => { setDraggingId(null); setOverId(null) }}
            style={{
              opacity: isDragging ? 0.4 : 1,
              transform: isOver ? 'translateY(-2px)' : 'none',
              transition: 'transform 80ms ease-out, opacity 80ms',
              cursor: 'grab',
            }}
          >
            {children[childIdx]}
          </div>
        )
      })}
    </>
  )
}
