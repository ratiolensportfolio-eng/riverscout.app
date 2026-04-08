'use client'

import { useState, useEffect } from 'react'

const mono = "'IBM Plex Mono', monospace"

interface Props {
  riverId: string
  riverName: string
  gaugeId: string
  stateSlug: string
  riverSlug: string
}

export default function SaveOffline({ riverId, riverName, gaugeId, stateSlug, riverSlug }: Props) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    setSupported('serviceWorker' in navigator)

    // Check if already cached
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data?.type === 'RIVER_SAVED_OFFLINE') {
          setSaving(false)
          setSaved(true)
        }
        if (event.data?.type === 'CACHED_RIVERS') {
          const cached = event.data.rivers as Array<{ state: string; slug: string }>
          if (cached.some(r => r.state === stateSlug && r.slug === riverSlug)) {
            setSaved(true)
          }
        }
      })

      // Ask SW which rivers are cached
      navigator.serviceWorker.controller.postMessage({ type: 'GET_CACHED_RIVERS' })
    }
  }, [stateSlug, riverSlug])

  function saveForOffline() {
    if (!navigator.serviceWorker.controller) return
    setSaving(true)

    const riverPath = `/rivers/${stateSlug}/${riverSlug}`
    const urls = [
      riverPath,
      `/api/stocking?riverId=${riverId}`,
      `/api/pro/historical?gaugeId=${gaugeId}`,
    ]

    navigator.serviceWorker.controller.postMessage({
      type: 'SAVE_RIVER_OFFLINE',
      urls,
    })

    // Timeout fallback
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
    }, 8000)
  }

  function removeOffline() {
    if (!navigator.serviceWorker.controller) return
    navigator.serviceWorker.controller.postMessage({
      type: 'REMOVE_RIVER_OFFLINE',
      pathPrefix: `/rivers/${stateSlug}/${riverSlug}`,
    })
    setSaved(false)
  }

  if (!supported) return null

  if (saved) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{
          fontFamily: mono, fontSize: '9px', color: 'var(--rv)',
          display: 'flex', alignItems: 'center', gap: '4px',
        }}>
          <span style={{ fontSize: '11px' }}>&#10003;</span> Saved offline
        </span>
        <button onClick={removeOffline} style={{
          fontFamily: mono, fontSize: '9px', color: 'var(--tx3)',
          background: 'none', border: 'none', cursor: 'pointer',
          textDecoration: 'underline',
        }}>
          Remove
        </button>
      </div>
    )
  }

  return (
    <button onClick={saveForOffline} disabled={saving} style={{
      fontFamily: mono, fontSize: '9px', color: 'var(--wt)',
      background: 'var(--wtlt)', border: '.5px solid var(--wtmd)',
      borderRadius: '10px', padding: '3px 10px', cursor: saving ? 'wait' : 'pointer',
      display: 'flex', alignItems: 'center', gap: '4px',
      opacity: saving ? 0.6 : 1,
    }}>
      <span style={{ fontSize: '10px' }}>&#128241;</span>
      {saving ? 'Saving...' : 'Save Offline'}
    </button>
  )
}
