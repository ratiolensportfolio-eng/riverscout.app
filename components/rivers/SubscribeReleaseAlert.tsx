'use client'

// Inline "Get release alerts" button on the river-detail-page
// release callout. Click to expand a small email + days-ahead
// form. POSTs to /api/releases/subscribe and shows the result
// inline. Auto-fills the email if the user is signed in.

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const mono = "'IBM Plex Mono', monospace"

interface Props {
  riverId: string
  riverName: string
  // Optional season label — when set, the subscription is
  // scoped to releases in that season only. The river page
  // passes the next release's seasonLabel so a click subscribes
  // to e.g. "Gauley Fall Season 2026" instead of all gauley
  // releases.
  seasonLabel?: string
}

type State =
  | { kind: 'idle' }
  | { kind: 'open' }
  | { kind: 'submitting' }
  | { kind: 'success'; message: string }
  | { kind: 'error'; message: string }

export default function SubscribeReleaseAlert({ riverId, riverName, seasonLabel }: Props) {
  const [state, setState] = useState<State>({ kind: 'idle' })
  const [email, setEmail] = useState('')
  const [daysBefore, setDaysBefore] = useState(3)
  const [userId, setUserId] = useState<string | null>(null)

  // Auto-fill email from the auth session if available.
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setEmail(data.user.email)
      if (data.user?.id) setUserId(data.user.id)
    })
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setState({ kind: 'submitting' })
    try {
      const res = await fetch('/api/releases/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          riverId,
          seasonLabel,
          notifyDaysBefore: daysBefore,
          userId,
        }),
      })
      const data = await res.json()
      if (data.ok) {
        setState({ kind: 'success', message: data.message || 'Subscribed!' })
      } else {
        setState({ kind: 'error', message: data.error || 'Subscribe failed' })
      }
    } catch {
      setState({ kind: 'error', message: 'Network error' })
    }
  }

  if (state.kind === 'success') {
    return (
      <div style={{
        fontFamily: mono, fontSize: '10px', color: 'var(--rv)',
        padding: '6px 12px', borderRadius: 'var(--r)',
        background: 'var(--rvlt)', border: '.5px solid var(--rvmd)',
        display: 'inline-flex', alignItems: 'center', gap: '6px',
      }}>
        <span>\u2713</span> {state.message}
      </div>
    )
  }

  if (state.kind === 'idle') {
    return (
      <button
        type="button"
        onClick={() => setState({ kind: 'open' })}
        style={{
          fontFamily: mono, fontSize: '10px',
          color: 'var(--rvdk)',
          padding: '5px 12px', borderRadius: 'var(--r)',
          border: '.5px solid var(--rvmd)', background: 'var(--bg)',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        \uD83D\uDD14 Get release alerts
      </button>
    )
  }

  // open / submitting / error — render the form
  return (
    <form onSubmit={submit} style={{
      display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center',
      padding: '6px 8px', borderRadius: 'var(--r)',
      background: 'var(--bg)', border: '.5px solid var(--rvmd)',
    }}>
      <input
        type="email"
        required
        placeholder="you@example.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{
          fontFamily: mono, fontSize: '11px',
          padding: '5px 8px', borderRadius: '4px',
          border: '.5px solid var(--bd2)', background: 'var(--bg)', color: 'var(--tx)',
          minWidth: '160px', flex: '1 1 160px',
        }}
      />
      <select
        value={daysBefore}
        onChange={e => setDaysBefore(parseInt(e.target.value, 10))}
        style={{
          fontFamily: mono, fontSize: '11px',
          padding: '5px 8px', borderRadius: '4px',
          border: '.5px solid var(--bd2)', background: 'var(--bg)', color: 'var(--tx)',
        }}
      >
        <option value={1}>1 day before</option>
        <option value={3}>3 days before</option>
        <option value={7}>1 week before</option>
        <option value={14}>2 weeks before</option>
      </select>
      <button
        type="submit"
        disabled={state.kind === 'submitting'}
        style={{
          fontFamily: mono, fontSize: '10px',
          color: '#fff', background: 'var(--rv)', border: 'none',
          padding: '6px 14px', borderRadius: '4px',
          cursor: state.kind === 'submitting' ? 'wait' : 'pointer',
          opacity: state.kind === 'submitting' ? 0.6 : 1,
        }}
      >
        {state.kind === 'submitting' ? 'Subscribing\u2026' : 'Subscribe'}
      </button>
      {state.kind === 'error' && (
        <span style={{ fontFamily: mono, fontSize: '9px', color: 'var(--dg)', flex: '1 1 100%' }}>
          {state.message}
        </span>
      )}
    </form>
  )
}
