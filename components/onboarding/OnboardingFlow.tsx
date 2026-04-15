'use client'

// Onboarding flow — full-screen overlay shown to authed users who
// haven't completed onboarding. Three steps in one fluid flow:
//   1. Pick home state
//   2. Save at least 3 rivers in that state
//   3. Opt in (or out) of the Thursday weekly digest
//
// On any "Skip" choice we still mark onboarding_completed_at so we
// don't keep showing the modal. Skipping the digest sets
// weekly_digest_opted_in: false (explicit opt-out — the dashboard
// can still show a "subscribe to weekly updates" prompt later).

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { STATES, getRiverPath } from '@/data/rivers'

interface PopularRiver {
  id: string
  name: string
  cls: string
  cfs: number | null
  condition: string
}

interface Props {
  userId: string
}

const STEP_LABEL = ['Home state', 'Save 3 rivers', 'Weekly digest']

export default function OnboardingFlow({ userId }: Props) {
  const router = useRouter()
  const [step, setStep] = useState<0 | 1 | 2>(0)
  const [homeState, setHomeState] = useState<string | null>(null)
  const [savedSet, setSavedSet] = useState<Set<string>>(new Set())
  const [popular, setPopular] = useState<PopularRiver[] | null>(null)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState<'subscribed' | 'declined' | null>(null)

  // Sorted state list for the picker
  const stateChoices = useMemo(
    () => Object.entries(STATES)
      .map(([k, s]) => ({ k, name: s.name }))
      .sort((a, b) => a.name.localeCompare(b.name)),
    [],
  )

  // After step 1, fetch top rivers for the chosen state with their
  // current cfs. Limited to 10. /api/conditions does the batched USGS
  // pull behind the scenes.
  useEffect(() => {
    if (step !== 1 || !homeState) return
    const stateRivers = STATES[homeState]?.rivers ?? []
    const top = stateRivers
      .filter(r => r.g)
      .slice(0, 10)
      .map(r => ({ id: r.id, name: r.n, cls: r.cls, cfs: null as number | null, condition: 'loading' }))
    setPopular(top)
    if (!top.length) return
    fetch('/api/conditions', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ riverIds: top.map(t => t.id) }),
    })
      .then(r => r.json())
      .then(d => {
        if (!d.conditions) return
        setPopular(top.map(t => ({
          ...t,
          cfs: d.conditions[t.id]?.cfs ?? null,
          condition: d.conditions[t.id]?.condition ?? 'loading',
        })))
      })
      .catch(() => { /* keep loading state */ })
  }, [step, homeState])

  async function pickState(k: string) {
    if (busy) return
    setBusy(true)
    setHomeState(k)
    await fetch('/api/profile/onboarding', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, action: 'set-home-state', value: k }),
    })
    setBusy(false)
    setStep(1)
  }

  async function toggleSave(id: string) {
    const isSaved = savedSet.has(id)
    const next = new Set(savedSet)
    if (isSaved) next.delete(id); else next.add(id)
    setSavedSet(next)
    fetch('/api/profile', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, riverId: id, action: isSaved ? 'unsave' : 'save' }),
    }).catch(() => { /* revert nothing — best effort */ })
  }

  async function setDigest(opted: boolean) {
    setBusy(true)
    await fetch('/api/profile/onboarding', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, action: 'set-digest', value: opted }),
    })
    await fetch('/api/profile/onboarding', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, action: 'complete' }),
    })
    setBusy(false)
    setDone(opted ? 'subscribed' : 'declined')
    // Brief confirmation, then dashboard.
    setTimeout(() => router.push('/dashboard'), opted ? 1800 : 600)
  }

  async function skipAll() {
    if (busy) return
    setBusy(true)
    await fetch('/api/profile/onboarding', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, action: 'complete' }),
    })
    setBusy(false)
    router.push('/dashboard')
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(8, 44, 75, 0.94)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', overflowY: 'auto',
    }}>
      <div style={{
        background: 'var(--bg)', color: 'var(--tx)',
        borderRadius: 'var(--rlg)', maxWidth: '720px', width: '100%',
        padding: '28px', boxShadow: '0 12px 40px rgba(0,0,0,.3)',
      }}>
        {/* Step indicator */}
        <div style={{
          display: 'flex', gap: '6px', justifyContent: 'center',
          marginBottom: '20px',
          fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px',
          letterSpacing: '.3px', color: 'var(--tx3)',
        }}>
          {STEP_LABEL.map((l, i) => (
            <span key={i} style={{
              padding: '3px 10px', borderRadius: '12px',
              background: step === i ? 'var(--rvdk)' : 'var(--bg2)',
              color: step === i ? '#fff' : 'var(--tx3)',
              border: '.5px solid ' + (step === i ? 'var(--rvdk)' : 'var(--bd)'),
            }}>{i + 1}. {l}</span>
          ))}
        </div>

        {/* Step 0 — state picker */}
        {step === 0 && (
          <>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', margin: '0 0 6px', color: '#042C53' }}>
              Pick your home state
            </h2>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: 'var(--tx3)', margin: '0 0 18px' }}>
              We'll show your home water on the dashboard map.
            </p>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '6px',
              maxHeight: '50vh', overflowY: 'auto', padding: '4px',
            }}>
              {stateChoices.map(s => (
                <button
                  key={s.k}
                  type="button"
                  onClick={() => pickState(s.k)}
                  disabled={busy}
                  style={{
                    padding: '10px 8px', borderRadius: 'var(--r)',
                    background: 'var(--bg2)', border: '.5px solid var(--bd)',
                    cursor: busy ? 'wait' : 'pointer',
                    fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px',
                    color: 'var(--tx)', textAlign: 'center',
                  }}
                >{s.name}</button>
              ))}
            </div>
            <div style={{ marginTop: '18px', textAlign: 'center' }}>
              <button onClick={skipAll} type="button" style={{
                background: 'transparent', border: 'none', color: 'var(--tx3)',
                fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px',
                textDecoration: 'underline', cursor: 'pointer',
              }}>Skip for now</button>
            </div>
          </>
        )}

        {/* Step 1 — save 3 rivers */}
        {step === 1 && (
          <>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', margin: '0 0 6px', color: '#042C53' }}>
              Save at least 3 rivers you care about
            </h2>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: 'var(--tx3)', margin: '0 0 14px' }}>
              {savedSet.size} of 3 saved {homeState && '· ' + STATES[homeState]?.name}
            </p>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '8px',
              maxHeight: '50vh', overflowY: 'auto',
            }}>
              {(popular ?? []).map(r => {
                const isSaved = savedSet.has(r.id)
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => toggleSave(r.id)}
                    style={{
                      padding: '10px 12px', borderRadius: 'var(--r)',
                      background: isSaved ? 'var(--rvlt)' : 'var(--bg2)',
                      border: '.5px solid ' + (isSaved ? 'var(--rvdk)' : 'var(--bd)'),
                      cursor: 'pointer', textAlign: 'left',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px',
                    }}
                  >
                    <span>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '13px', fontWeight: 600, color: 'var(--tx)' }}>
                        {r.name}
                      </div>
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)' }}>
                        {r.cls && 'Class ' + r.cls}
                      </div>
                    </span>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: 'var(--tx2)', whiteSpace: 'nowrap' }}>
                      {r.cfs == null ? '—' : r.cfs.toLocaleString() + ' cfs'}
                    </span>
                  </button>
                )
              })}
              {!popular?.length && (
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: 'var(--tx3)', padding: '20px' }}>
                  No rivers found for this state.
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '18px', alignItems: 'center', justifyContent: 'space-between' }}>
              <button onClick={skipAll} type="button" style={{
                background: 'transparent', border: 'none', color: 'var(--tx3)',
                fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px',
                textDecoration: 'underline', cursor: 'pointer',
              }}>Skip for now</button>
              <button
                type="button"
                disabled={savedSet.size < 3 || busy}
                onClick={() => setStep(2)}
                style={{
                  padding: '10px 18px', borderRadius: 'var(--r)',
                  background: savedSet.size >= 3 ? 'var(--rvdk)' : 'var(--bg3)',
                  color: savedSet.size >= 3 ? '#fff' : 'var(--tx3)',
                  border: 'none',
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px',
                  cursor: savedSet.size >= 3 ? 'pointer' : 'not-allowed', fontWeight: 600,
                }}
              >Take me to my rivers →</button>
            </div>
          </>
        )}

        {/* Step 2 — weekly digest opt-in */}
        {step === 2 && !done && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '36px', marginBottom: '10px' }} aria-hidden>🌊</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', margin: '0 0 8px', color: '#042C53' }}>
              Want a weekly conditions update?
            </h2>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: 'var(--tx2)', margin: '0 0 22px', lineHeight: 1.6 }}>
              Every Thursday morning we'll send you current conditions, flow trends, and any hazard alerts on your saved rivers.<br />
              Free, one email a week, unsubscribe anytime.
            </p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                type="button" onClick={() => setDigest(true)} disabled={busy}
                style={{
                  padding: '12px 22px', borderRadius: 'var(--r)',
                  background: '#1D9E75', color: '#fff', border: 'none',
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px',
                  cursor: busy ? 'wait' : 'pointer', fontWeight: 600,
                }}
              >Yes, send me updates</button>
              <button
                type="button" onClick={() => setDigest(false)} disabled={busy}
                style={{
                  background: 'transparent', border: 'none', color: 'var(--tx3)',
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px',
                  textDecoration: 'underline', cursor: busy ? 'wait' : 'pointer',
                }}
              >No thanks</button>
            </div>
          </div>
        )}

        {/* Step 2 — confirmation */}
        {step === 2 && done === 'subscribed' && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }} aria-hidden>✓</div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '17px', color: '#042C53' }}>
              You're in. Check your inbox Thursday morning.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
