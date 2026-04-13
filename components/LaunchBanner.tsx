'use client'

// Site-wide launch banner. Green background, teal border.
// Dismissible via close button (persists to localStorage so it doesn't
// reappear on that device). Auto-hides after 30 days from launch even
// for users who never dismissed it, so we don't run a "launch banner"
// forever.

import { useEffect, useState } from 'react'

const mono = "'IBM Plex Mono', monospace"

// Launch date: 2026-04-12. Banner stops rendering after this + 30 days.
const LAUNCH_END_ISO = '2026-05-12'
const STORAGE_KEY = 'riverscout_launch_banner_dismissed'

export default function LaunchBanner() {
  // Start closed. We flip to open in useEffect so the server HTML
  // doesn't flash the banner before we've checked localStorage.
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    if (new Date() > new Date(LAUNCH_END_ISO)) return
    try {
      if (localStorage.getItem(STORAGE_KEY) === '1') return
    } catch { /* Safari private mode etc. */ }
    setOpen(true)
  }, [])

  function dismiss() {
    setClosing(true)
    try { localStorage.setItem(STORAGE_KEY, '1') } catch { /* ignore */ }
    // Wait for the CSS height transition to complete before unmounting
    // so the collapse animation actually plays.
    setTimeout(() => setOpen(false), 300)
  }

  if (!open) return null

  return (
    <div
      style={{
        maxHeight: closing ? 0 : 200,
        overflow: 'hidden',
        transition: 'max-height 300ms ease-in-out',
        background: '#E1F5EE',
        borderBottom: '1px solid #9FE1CB',
      }}
    >
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '10px 16px', maxWidth: '1200px', margin: '0 auto',
        fontFamily: mono, fontSize: '12px', color: '#085041', lineHeight: 1.5,
      }}>
        <span style={{ flex: 1 }}>
          <strong style={{ fontWeight: 600 }}>Welcome to launch.</strong>{' '}
          We are currently expanding our databases quickly — user input and corrections are needed and appreciated. The content and functions on this site are deep. If you find something that is out of order, please{' '}
          <a
            href="mailto:Paddle.rivers.us@gmail.com"
            style={{ color: '#085041', textDecoration: 'underline', fontWeight: 500 }}
          >
            let us know
          </a>
          .
        </span>
        <button
          onClick={dismiss}
          aria-label="Dismiss launch banner"
          style={{
            flexShrink: 0,
            background: 'transparent', border: '.5px solid #9FE1CB',
            color: '#085041', fontFamily: mono, fontSize: '11px',
            padding: '4px 10px', borderRadius: '12px', cursor: 'pointer',
          }}
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}
