'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const mono = "'IBM Plex Mono', monospace"
const serif = "'Playfair Display', serif"

const FIELDS = [
  { value: 'cls', label: 'Whitewater Class' },
  { value: 'opt', label: 'Optimal CFS Range' },
  { value: 'len', label: 'River Length' },
  { value: 'desc', label: 'Description' },
  { value: 'desig', label: 'Designations' },
  { value: 'species', label: 'Fish Species' },
  { value: 'hatches', label: 'Hatch Calendar' },
  { value: 'runs', label: 'Salmon/Steelhead Run Timing' },
  { value: 'spawning', label: 'Spawn Timing' },
  { value: 'access_points', label: 'Access Points / Put-ins' },
  { value: 'sections', label: 'River Sections / Distances' },
  { value: 'gauge', label: 'USGS Gauge ID' },
  { value: 'outfitters', label: 'Outfitter Information' },
  { value: 'history', label: 'Historical Information' },
  { value: 'other', label: 'Other' },
]

interface Props {
  riverId: string
  riverName: string
  stateKey: string
}

export default function SuggestCorrection({ riverId, riverName, stateKey }: Props) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    field: '',
    currentValue: '',
    suggestedValue: '',
    reason: '',
    sourceUrl: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
      setUserEmail(data.user?.email ?? null)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.field || !form.currentValue || !form.suggestedValue || !form.reason) {
      setError('Please fill in all required fields')
      return
    }
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          riverId,
          riverName,
          stateKey,
          userId,
          userEmail,
          field: form.field,
          currentValue: form.currentValue,
          suggestedValue: form.suggestedValue,
          reason: form.reason,
          sourceUrl: form.sourceUrl || null,
        }),
      })
      const data = await res.json()
      if (data.ok) {
        setSubmitted(true)
      } else {
        setError(data.error || 'Failed to submit')
      }
    } catch {
      setError('Network error')
    }
    setSubmitting(false)
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} style={{
        fontFamily: mono, fontSize: '10px', color: 'var(--rv)',
        background: 'var(--rvlt)', border: '.5px solid var(--rvmd)',
        borderRadius: '12px', cursor: 'pointer',
        padding: '4px 12px', letterSpacing: '.3px',
        transition: 'background .15s',
      }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--rvmd)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'var(--rvlt)')}
      >
        Improve This River
      </button>
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div onClick={() => setOpen(false)} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)',
        zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Modal */}
        <div onClick={e => e.stopPropagation()} style={{
          background: 'var(--bg)', borderRadius: 'var(--rlg)',
          padding: '24px', maxWidth: '480px', width: '90%',
          maxHeight: '85vh', overflowY: 'auto',
          boxShadow: '0 8px 40px rgba(0,0,0,.2)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontFamily: serif, fontSize: '18px', fontWeight: 700, color: 'var(--rvdk)', margin: 0 }}>
              Improve This River
            </h2>
            <button onClick={() => setOpen(false)} style={{
              background: 'none', border: 'none', fontSize: '18px', color: 'var(--tx3)', cursor: 'pointer',
            }}>&#10005;</button>
          </div>

          <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)', marginBottom: '16px' }}>
            {riverName} · {stateKey.toUpperCase()}
          </div>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>&#10003;</div>
              <div style={{ fontFamily: serif, fontSize: '16px', fontWeight: 600, color: 'var(--rv)', marginBottom: '4px' }}>
                Thank you!
              </div>
              <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx2)', marginBottom: '12px' }}>
                Your improvement has been submitted for review. Thank you for being a river steward.
              </div>
              <button onClick={() => { setOpen(false); setSubmitted(false); setForm({ field: '', currentValue: '', suggestedValue: '', reason: '', sourceUrl: '' }) }}
                style={{ fontFamily: mono, fontSize: '10px', color: 'var(--rv)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <label style={{ display: 'block', marginBottom: '12px' }}>
                <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', display: 'block', marginBottom: '4px' }}>
                  What can be improved? *
                </span>
                <select value={form.field} onChange={e => setForm(f => ({ ...f, field: e.target.value }))}
                  style={{ width: '100%', padding: '8px 10px', fontFamily: mono, fontSize: '12px', border: '.5px solid var(--bd2)', borderRadius: 'var(--r)', background: 'var(--bg)', color: 'var(--tx)' }}>
                  <option value="">Select a field...</option>
                  {FIELDS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
              </label>

              <label style={{ display: 'block', marginBottom: '12px' }}>
                <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', display: 'block', marginBottom: '4px' }}>
                  What does it say now? *
                </span>
                <input type="text" value={form.currentValue} onChange={e => setForm(f => ({ ...f, currentValue: e.target.value }))}
                  placeholder="e.g. Class III-IV"
                  style={{ width: '100%', padding: '8px 10px', fontFamily: mono, fontSize: '12px', border: '.5px solid var(--bd2)', borderRadius: 'var(--r)', background: 'var(--bg)', color: 'var(--tx)' }} />
              </label>

              <label style={{ display: 'block', marginBottom: '12px' }}>
                <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', display: 'block', marginBottom: '4px' }}>
                  What should it say? *
                </span>
                <input type="text" value={form.suggestedValue} onChange={e => setForm(f => ({ ...f, suggestedValue: e.target.value }))}
                  placeholder="e.g. Class II-III"
                  style={{ width: '100%', padding: '8px 10px', fontFamily: mono, fontSize: '12px', border: '.5px solid var(--bd2)', borderRadius: 'var(--r)', background: 'var(--bg)', color: 'var(--tx)' }} />
              </label>

              <label style={{ display: 'block', marginBottom: '12px' }}>
                <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', display: 'block', marginBottom: '4px' }}>
                  How do you know? *
                </span>
                <textarea value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                  placeholder="I paddle this river regularly and..."
                  rows={3}
                  style={{ width: '100%', padding: '8px 10px', fontFamily: mono, fontSize: '12px', border: '.5px solid var(--bd2)', borderRadius: 'var(--r)', background: 'var(--bg)', color: 'var(--tx)', resize: 'vertical' }} />
              </label>

              <label style={{ display: 'block', marginBottom: '16px' }}>
                <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)', display: 'block', marginBottom: '4px' }}>
                  Source URL (optional)
                </span>
                <input type="url" value={form.sourceUrl} onChange={e => setForm(f => ({ ...f, sourceUrl: e.target.value }))}
                  placeholder="https://americanwhitewater.org/..."
                  style={{ width: '100%', padding: '8px 10px', fontFamily: mono, fontSize: '12px', border: '.5px solid var(--bd2)', borderRadius: 'var(--r)', background: 'var(--bg)', color: 'var(--tx)' }} />
              </label>

              {error && <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--dg)', marginBottom: '8px' }}>{error}</div>}

              <button type="submit" disabled={submitting}
                style={{
                  width: '100%', padding: '10px', fontFamily: mono, fontSize: '12px', fontWeight: 500,
                  background: 'var(--rv)', color: '#fff', border: 'none', borderRadius: 'var(--r)',
                  cursor: submitting ? 'wait' : 'pointer', opacity: submitting ? 0.6 : 1,
                }}>
                {submitting ? 'Submitting...' : 'Submit Improvement'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
