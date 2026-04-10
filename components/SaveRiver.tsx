'use client'

// Save/unsave a river to the user's saved_rivers list, and show the
// inline digest opt-in prompt at the moment of first save.
//
// Lives next to SaveOffline in the river page header. Auth-gated:
// signed-out users see a "Sign in to save" link instead of the
// button. Signed-in users see a heart that fills when saved and
// empties when unsaved.
//
// The opt-in prompt is the entire reason this component exists in
// this form. The first time a user takes their saved-river count
// from 0 → 1, /api/profile returns `firstSave: true` and we show
// the prompt right next to the button. Per the digest feature spec,
// this is the moment of highest intent — convert here, not via a
// homepage banner.

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const mono = "'IBM Plex Mono', monospace"
const serif = "'Playfair Display', serif"

interface Props {
  riverId: string
  riverName: string
}

export default function SaveRiver({ riverId, riverName }: Props) {
  const [userId, setUserId] = useState<string | null>(null)
  const [authLoaded, setAuthLoaded] = useState(false)
  const [saved, setSaved] = useState(false)
  const [busy, setBusy] = useState(false)
  // Inline opt-in prompt state. Shown only after the user just took
  // their saved-river count from 0 to 1. Dismissed on any click.
  const [showPrompt, setShowPrompt] = useState(false)
  const [promptBusy, setPromptBusy] = useState(false)
  const [promptDone, setPromptDone] = useState<'subscribed' | 'declined' | null>(null)

  // Load auth + check if already saved
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const uid = data.user?.id ?? null
      setUserId(uid)
      setAuthLoaded(true)
      if (!uid) return

      const { data: row } = await supabase
        .from('saved_rivers')
        .select('id')
        .eq('user_id', uid)
        .eq('river_id', riverId)
        .maybeSingle()
      if (row) setSaved(true)
    })
  }, [riverId])

  async function handleToggle() {
    if (!userId || busy) return
    setBusy(true)
    const action = saved ? 'unsave' : 'save'

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, riverId, action }),
      })
      const data = await res.json()
      if (data.ok) {
        setSaved(action === 'save')
        // Only fire the prompt on the very first save in the user's
        // entire account history. /api/profile returns firstSave: true
        // exactly once.
        if (data.firstSave) {
          setShowPrompt(true)
          setPromptDone(null)
        }
      }
    } catch {
      /* network error — leave UI in previous state */
    }
    setBusy(false)
  }

  async function handleDigestSubscribe() {
    if (!userId || promptBusy) return
    setPromptBusy(true)
    const { error } = await supabase
      .from('user_profiles')
      .update({ digest_subscribed: true, updated_at: new Date().toISOString() })
      .eq('id', userId)
    setPromptBusy(false)
    if (!error) {
      setPromptDone('subscribed')
    }
  }

  function handleDigestDecline() {
    setPromptDone('declined')
  }

  function dismissPrompt() {
    setShowPrompt(false)
    setPromptDone(null)
  }

  if (!authLoaded) return null

  if (!userId) {
    return (
      <a
        href={`/login?redirect=${encodeURIComponent(typeof window === 'undefined' ? '/' : window.location.pathname)}`}
        title="Sign in to save this river"
        style={{
          fontFamily: mono, fontSize: '9px', color: 'var(--tx3)',
          background: 'var(--bg2)', border: '.5px solid var(--bd2)',
          borderRadius: '10px', padding: '3px 10px',
          textDecoration: 'none',
          display: 'flex', alignItems: 'center', gap: '4px',
        }}>
        <span style={{ fontSize: '11px' }}>&#9825;</span> Save
      </a>
    )
  }

  return (
    <>
      <button
        onClick={handleToggle}
        disabled={busy}
        title={saved ? `Unsave ${riverName}` : `Save ${riverName} to your rivers`}
        style={{
          fontFamily: mono, fontSize: '9px',
          color: saved ? 'var(--rvdk)' : 'var(--rvmd)',
          background: saved ? 'var(--rvlt)' : 'var(--bg2)',
          border: `.5px solid ${saved ? 'var(--rvmd)' : 'var(--bd2)'}`,
          borderRadius: '10px', padding: '3px 10px',
          cursor: busy ? 'wait' : 'pointer',
          display: 'flex', alignItems: 'center', gap: '4px',
          opacity: busy ? 0.6 : 1,
        }}>
        <span style={{ fontSize: '11px' }}>{saved ? '\u2665' : '\u2661'}</span>
        {saved ? 'Saved' : 'Save'}
      </button>

      {showPrompt && (
        <DigestOptInPrompt
          riverName={riverName}
          done={promptDone}
          busy={promptBusy}
          onSubscribe={handleDigestSubscribe}
          onDecline={handleDigestDecline}
          onDismiss={dismissPrompt}
        />
      )}
    </>
  )
}

// ── Inline opt-in prompt ──────────────────────────────────────────
//
// Modal-style overlay (centered, backdrop) that appears the moment
// after a user saves their first river. Per the digest feature spec
// this is the highest-converting moment — the offer is directly
// relevant to what the user just did. Dismisses on either button or
// the backdrop click; once closed, never shown again for this user
// because the firstSave flag only fires once per account.

interface PromptProps {
  riverName: string
  done: 'subscribed' | 'declined' | null
  busy: boolean
  onSubscribe: () => void
  onDecline: () => void
  onDismiss: () => void
}

function DigestOptInPrompt({ riverName, done, busy, onSubscribe, onDecline, onDismiss }: PromptProps) {
  return (
    <div
      onClick={onDismiss}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)',
        zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg)', borderRadius: 'var(--rlg)',
          padding: '26px 26px 22px', maxWidth: '420px', width: '100%',
          boxShadow: '0 12px 48px rgba(0,0,0,.25)',
          textAlign: 'center',
        }}>
        {done === 'subscribed' ? (
          <>
            <div style={{ fontSize: '32px', marginBottom: '10px', color: 'var(--rv)' }}>&#10003;</div>
            <div style={{ fontFamily: serif, fontSize: '17px', fontWeight: 700, color: 'var(--rvdk)', marginBottom: '8px' }}>
              You&apos;re subscribed
            </div>
            <p style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx2)', lineHeight: 1.6, marginBottom: '18px' }}>
              Your first digest will arrive next Thursday morning at 8am Eastern. Save more rivers anytime &mdash; they&apos;ll all show up in the email.
            </p>
            <button
              onClick={onDismiss}
              style={{
                fontFamily: mono, fontSize: '11px', fontWeight: 500,
                padding: '9px 22px', borderRadius: 'var(--r)',
                background: 'var(--rvdk)', color: '#fff', border: 'none',
                cursor: 'pointer', letterSpacing: '.3px',
              }}>
              Got it
            </button>
          </>
        ) : done === 'declined' ? (
          <>
            <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx2)', marginBottom: '14px' }}>
              No problem &mdash; you can turn it on later in your account settings.
            </div>
            <button
              onClick={onDismiss}
              style={{
                fontFamily: mono, fontSize: '11px',
                padding: '8px 18px', borderRadius: 'var(--r)',
                background: 'var(--bg2)', color: 'var(--tx2)',
                border: '.5px solid var(--bd2)', cursor: 'pointer',
              }}>
              Close
            </button>
          </>
        ) : (
          <>
            <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--rv)', marginBottom: '10px' }}>
              <span style={{ fontSize: '14px' }}>&#10003;</span> {riverName} saved
            </div>
            <div style={{ fontSize: '32px', marginBottom: '6px' }}>&#128236;</div>
            <div style={{ fontFamily: serif, fontSize: '18px', fontWeight: 700, color: 'var(--rvdk)', marginBottom: '8px', lineHeight: 1.3 }}>
              Want a Thursday morning report on this river?
            </div>
            <p style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx2)', lineHeight: 1.65, marginBottom: '18px' }}>
              Get weekly conditions, weekend weather, and fishing updates on your saved rivers &mdash; every Thursday at 8am.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={onSubscribe}
                disabled={busy}
                style={{
                  fontFamily: mono, fontSize: '11px', fontWeight: 500,
                  padding: '11px 18px', borderRadius: 'var(--r)',
                  background: 'var(--rvdk)', color: '#fff', border: 'none',
                  cursor: busy ? 'wait' : 'pointer',
                  letterSpacing: '.3px',
                  opacity: busy ? 0.6 : 1,
                }}>
                {busy ? 'Subscribing\u2026' : 'Yes, send me the weekly digest \u2192'}
              </button>
              <button
                onClick={onDecline}
                disabled={busy}
                style={{
                  fontFamily: mono, fontSize: '10px',
                  padding: '8px 18px', borderRadius: 'var(--r)',
                  background: 'transparent', color: 'var(--tx3)',
                  border: 'none', cursor: 'pointer',
                }}>
                Maybe later
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
