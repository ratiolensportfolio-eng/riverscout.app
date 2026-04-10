'use client'

// River Vision — accessibility font-size toggle.
//
// Renders a small glasses button fixed to the bottom-right of every
// page. Click → a giant pair of glasses zooms toward the camera, the
// page text bumps up, then the glasses fade away. Click again to
// reverse. State persists in localStorage and is re-applied before
// hydration via an inline <script> in app/layout.tsx (so the user
// never sees a flash of the smaller text on subsequent loads).
//
// The actual font-size bumping is done entirely in CSS — see the
// `html.large-text-mode [style*="font-size: ..."]` rules in
// globals.css. Those use attribute substring selectors with
// !important to override the codebase's pervasive inline styles
// (every page in this project sets fontSize via the `style` prop,
// not via classes).

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'riverscout_large_text'
// 400ms grow + 300ms fadeout = 700ms total — matches the keyframe
// duration in globals.css. We flip the html class at the 400ms mark
// (peak of the bounce) so the text bump is visually tied to the
// glasses landing on the user's face.
const ANIM_TOTAL_MS = 700
const ANIM_FLIP_MS = 400

export default function LargeTextToggle() {
  const [active, setActive] = useState(false)
  const [animating, setAnimating] = useState<'in' | 'out' | null>(null)

  // Sync state from the DOM on mount. The pre-render script in
  // layout.tsx may have already added the class — we read it here
  // rather than from localStorage so we stay in sync if the user
  // somehow ends up with a divergent class/storage state (e.g. an
  // SSR/CSR mismatch fallback).
  useEffect(() => {
    setActive(document.documentElement.classList.contains('large-text-mode'))
  }, [])

  function toggle() {
    if (animating) return

    if (active) {
      // Deactivating — glasses zoom away from the user.
      setAnimating('out')
      window.setTimeout(() => {
        document.documentElement.classList.remove('large-text-mode')
        setActive(false)
        try { localStorage.setItem(STORAGE_KEY, '0') } catch {}
      }, ANIM_FLIP_MS)
      window.setTimeout(() => setAnimating(null), ANIM_TOTAL_MS)
    } else {
      // Activating — glasses zoom toward the user.
      setAnimating('in')
      window.setTimeout(() => {
        document.documentElement.classList.add('large-text-mode')
        setActive(true)
        try { localStorage.setItem(STORAGE_KEY, '1') } catch {}
      }, ANIM_FLIP_MS)
      window.setTimeout(() => setAnimating(null), ANIM_TOTAL_MS)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        aria-label="Toggle larger text"
        aria-pressed={active}
        title="Toggle larger text"
        className={`river-vision-toggle${active ? ' active' : ''}`}
      >
        <Glasses width={24} />
      </button>

      {animating && (
        <div className={`river-vision-overlay river-vision-${animating}`} aria-hidden="true">
          <Glasses width={180} />
        </div>
      )}
    </>
  )
}

function Glasses({ width }: { width: number }) {
  // 64×26 viewBox — two lens circles, a bridge, and short temple
  // tips on each side. Stroke-only so it inherits currentColor and
  // looks crisp at any size.
  return (
    <svg
      width={width}
      height={width * (26 / 64)}
      viewBox="0 0 64 26"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="14" cy="14" r="9" />
      <circle cx="50" cy="14" r="9" />
      <path d="M23 14 L41 14" />
      <path d="M5 11 L1 7" />
      <path d="M59 11 L63 7" />
    </svg>
  )
}
