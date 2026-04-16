'use client'

// Trip-report submission modal. Opens from the "Log a trip" button
// on the river page's Trip Reports tab. Pre-fills trip_date (today)
// and cfs_at_time (passed in from the river page's current flow).
//
// Submits to POST /api/trips, which runs the AI verifier inline.
// The modal stays open after submit to show the outcome — verified
// rows appear in the public feed immediately, flagged rows wait on
// manual review, rejected rows are hidden.

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { VerificationStatus } from '@/types'

const mono = "'IBM Plex Mono', monospace"
const serif = "'Playfair Display', serif"

interface Props {
  riverId: string
  riverName: string
  currentCfs: number | null
  open: boolean
  onClose: () => void
  onSubmitted?: () => void
}

interface SubmissionResult {
  status: VerificationStatus
  score: number
  notes: string
}

const WATERCRAFT = ['Kayak', 'Canoe', 'Raft', 'SUP', 'Tube', 'Drift boat', 'Jetboat', 'Other']

export default function LogTripForm({ riverId, riverName, currentCfs, open, onClose, onSubmitted }: Props) {
  const [userId, setUserId] = useState<string | null>(null)
  const [authChecked, setAuthChecked] = useState(false)

  const [tripDate, setTripDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [cfsAtTime, setCfsAtTime] = useState(currentCfs != null ? String(currentCfs) : '')
  const [waterTemp, setWaterTemp] = useState('')
  const [durationHours, setDurationHours] = useState('')
  const [partySize, setPartySize] = useState('')
  const [watercraft, setWatercraft] = useState('')
  const [conditionsRating, setConditionsRating] = useState<number>(0)
  const [reportText, setReportText] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<SubmissionResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
      setAuthChecked(true)
    })
  }, [open])

  // Reset CFS default when currentCfs changes (e.g. user opens modal
  // on a different river).
  useEffect(() => {
    if (currentCfs != null) setCfsAtTime(String(currentCfs))
  }, [currentCfs])

  if (!open) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!userId) {
      setError('Please sign in to submit a trip report.')
      return
    }
    if (reportText.trim().length < 20) {
      setError('Report text must be at least 20 characters — tell us about your trip!')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId, riverId, tripDate, reportText,
          cfsAtTime: cfsAtTime || null,
          waterTemp: waterTemp || null,
          durationHours: durationHours || null,
          partySize: partySize || null,
          watercraft: watercraft || null,
          conditionsRating: conditionsRating || null,
        }),
      })
      const payload = await res.json()
      if (!res.ok) throw new Error(payload.error || 'Submit failed')
      setResult({
        status: payload.verification.status,
        score: payload.verification.score,
        notes: payload.verification.notes,
      })
      onSubmitted?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submit failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      role="dialog" aria-modal="true"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg)', borderRadius: 'var(--r)',
          maxWidth: '560px', width: '100%', maxHeight: '90vh', overflow: 'auto',
          padding: '24px', border: '.5px solid var(--bd)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
          <div>
            <h2 style={{ fontFamily: serif, fontSize: '20px', margin: '0 0 4px', color: '#042C53' }}>Log a trip</h2>
            <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx3)' }}>{riverName}</div>
          </div>
          <button
            type="button" onClick={onClose} aria-label="Close"
            style={{ background: 'transparent', border: 'none', fontSize: '24px', color: 'var(--tx3)', cursor: 'pointer', lineHeight: 1 }}
          >×</button>
        </div>

        {authChecked && !userId && (
          <div style={{ padding: '14px', background: 'var(--amlt)', borderRadius: 'var(--r)', marginBottom: '14px', fontFamily: mono, fontSize: '12px', color: '#7A4D0E' }}>
            Sign in required to submit a trip report.{' '}
            <a href="/login?next=/" style={{ color: 'var(--rvdk)' }}>Sign in →</a>
          </div>
        )}

        {result ? (
          <ResultPanel result={result} onClose={onClose} />
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <Field label="Trip date">
                <input type="date" value={tripDate} onChange={e => setTripDate(e.target.value)} required style={inputStyle} />
              </Field>
              <Field label="CFS at time">
                <input type="number" value={cfsAtTime} onChange={e => setCfsAtTime(e.target.value)} min="0" style={inputStyle} />
              </Field>
              <Field label="Water temp (°F)">
                <input type="number" value={waterTemp} onChange={e => setWaterTemp(e.target.value)} step="0.1" style={inputStyle} />
              </Field>
              <Field label="Duration (hrs)">
                <input type="number" value={durationHours} onChange={e => setDurationHours(e.target.value)} step="0.5" min="0" style={inputStyle} />
              </Field>
              <Field label="Party size">
                <input type="number" value={partySize} onChange={e => setPartySize(e.target.value)} min="1" style={inputStyle} />
              </Field>
              <Field label="Watercraft">
                <select value={watercraft} onChange={e => setWatercraft(e.target.value)} style={inputStyle}>
                  <option value="">—</option>
                  {WATERCRAFT.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Conditions rating">
              <div style={{ display: 'flex', gap: '6px' }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n} type="button" onClick={() => setConditionsRating(n)}
                    style={{
                      fontFamily: mono, fontSize: '14px',
                      background: conditionsRating >= n ? 'var(--rvlt)' : 'transparent',
                      color: conditionsRating >= n ? 'var(--rvdk)' : 'var(--tx3)',
                      border: '.5px solid var(--bd)', borderRadius: 'var(--r)',
                      padding: '4px 10px', cursor: 'pointer', minWidth: '32px',
                    }}
                  >{n}</button>
                ))}
              </div>
            </Field>

            <Field label="Trip report">
              <textarea
                value={reportText} onChange={e => setReportText(e.target.value)}
                required minLength={20} maxLength={4000} rows={6}
                placeholder="Describe your trip — water conditions, landmarks, wildlife, anything specific you noticed. Reports with specific observations score higher on AI verification."
                style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
              />
              <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)', marginTop: '2px' }}>
                {reportText.length} / 4000 · Min 20 characters
              </div>
            </Field>

            {error && (
              <div style={{ padding: '10px', background: 'rgba(163,45,45,0.08)', color: '#A32D2D', borderRadius: 'var(--r)', fontFamily: mono, fontSize: '11px' }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
              <button type="button" onClick={onClose} style={btnSecondary}>Cancel</button>
              <button type="submit" disabled={submitting || !userId} style={{ ...btnPrimary, opacity: submitting || !userId ? 0.6 : 1 }}>
                {submitting ? 'Submitting…' : 'Submit trip report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

function ResultPanel({ result, onClose }: { result: SubmissionResult; onClose: () => void }) {
  const config = {
    verified: { color: '#1D9E75', bg: 'rgba(29,158,117,0.08)', title: 'Verified', blurb: 'Your trip report is live on the river page.' },
    flagged:  { color: '#BA7517', bg: 'rgba(186,117,23,0.08)', title: 'Submitted for review', blurb: 'A human will review shortly — it will appear publicly once approved.' },
    rejected: { color: '#A32D2D', bg: 'rgba(163,45,45,0.08)', title: 'Not verified', blurb: 'The report didn\'t pass authenticity checks. You can try submitting again with more specific detail.' },
    pending:  { color: '#7A8074', bg: 'rgba(122,128,116,0.08)', title: 'Queued', blurb: 'AI verification unavailable right now. A human will review shortly.' },
  }[result.status]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ padding: '14px', background: config.bg, color: config.color, borderRadius: 'var(--r)', border: `.5px solid ${config.color}44` }}>
        <div style={{ fontFamily: serif, fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>{config.title}</div>
        <div style={{ fontFamily: mono, fontSize: '11px', lineHeight: 1.5 }}>{config.blurb}</div>
        {result.notes && (
          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: `.5px solid ${config.color}44`, fontFamily: mono, fontSize: '10px', opacity: 0.85 }}>
            AI notes (score {result.score}/100): {result.notes}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button type="button" onClick={onClose} style={btnPrimary}>Close</button>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
      <label style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.3px' }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  fontFamily: mono, fontSize: '12px',
  background: 'var(--bg)', color: 'var(--tx)',
  border: '.5px solid var(--bd)', borderRadius: 'var(--r)',
  padding: '7px 10px', width: '100%',
}

const btnPrimary: React.CSSProperties = {
  fontFamily: mono, fontSize: '11px',
  background: 'var(--rvdk)', color: '#fff',
  border: 'none', borderRadius: 'var(--r)',
  padding: '8px 16px', cursor: 'pointer',
}
const btnSecondary: React.CSSProperties = {
  fontFamily: mono, fontSize: '11px',
  background: 'transparent', color: 'var(--tx2)',
  border: '.5px solid var(--bd)', borderRadius: 'var(--r)',
  padding: '8px 16px', cursor: 'pointer',
}
