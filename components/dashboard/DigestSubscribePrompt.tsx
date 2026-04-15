'use client'

// Subtle dashboard banner for users who explicitly declined the
// weekly digest during onboarding. One-tap opt-in that hides the
// banner immediately and persists weekly_digest_opted_in: true.

import { useState } from 'react'

interface Props { userId: string }

export default function DigestSubscribePrompt({ userId }: Props) {
  const [hidden, setHidden] = useState(false)
  const [busy, setBusy] = useState(false)

  if (hidden) return null

  async function subscribe() {
    if (busy) return
    setBusy(true)
    try {
      await fetch('/api/profile/onboarding', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'set-digest', value: true }),
      })
      setHidden(true)
    } catch {
      setBusy(false)
    }
  }

  return (
    <div style={{
      fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px',
      background: 'var(--bg2)', border: '.5px dashed var(--bd)',
      borderRadius: 'var(--r)', padding: '8px 12px',
      marginBottom: '10px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px',
    }}>
      <span style={{ color: 'var(--tx2)' }}>
        Add weekly river updates to your email →
      </span>
      <span style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
        <button type="button" onClick={subscribe} disabled={busy} style={{
          background: 'var(--rvdk)', color: '#fff', border: 'none',
          padding: '4px 12px', borderRadius: '12px',
          fontFamily: 'inherit', fontSize: '10px', cursor: busy ? 'wait' : 'pointer',
        }}>{busy ? 'Subscribing…' : 'Subscribe'}</button>
        <button type="button" onClick={() => setHidden(true)} style={{
          background: 'transparent', color: 'var(--tx3)', border: 'none',
          padding: '4px 8px', cursor: 'pointer',
          fontFamily: 'inherit', fontSize: '10px',
        }}>×</button>
      </span>
    </div>
  )
}
