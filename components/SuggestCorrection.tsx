'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const mono = "'IBM Plex Mono', monospace"
const serif = "'Playfair Display', serif"

// Fields users can suggest improvements to. Two categories:
//
//   - "Auto-applies" group: scalar fields that go through the
//     override layer cleanly. Approval flows from the admin
//     queue → river_field_overrides → next page render. Marked
//     with no badge.
//   - "Needs admin edit" group: fields that the admin queue
//     accepts but require a manual edit to data/rivers.ts or
//     data/fisheries.ts because the data is structured (arrays,
//     nested objects). Suggestion still goes through, admin
//     handles the data file commit. Marked with the [ADMIN] tag.
//
// Outfitter information is intentionally omitted — outfitters
// have their own dashboard at /outfitters/dashboard, so a
// "suggest a correction" path here would be a dead end.
const FIELDS = [
  { value: 'safe_cfs', label: '\u26A0 Safe CFS Limit (Safety Critical)' },
  { value: 'cls', label: 'Whitewater Class' },
  { value: 'opt', label: 'Optimal CFS Range' },
  { value: 'len', label: 'River Length' },
  { value: 'desc', label: 'Description' },
  { value: 'desig', label: 'Designations' },
  { value: 'gauge', label: 'USGS Gauge ID' },
  { value: 'sections', label: 'River Sections / Distances [admin edit]' },
  { value: 'access_points', label: 'Access Points / Put-ins [admin edit]' },
  { value: 'species', label: 'Fish Species [admin edit]' },
  { value: 'hatches', label: 'Hatch Calendar [admin edit]' },
  { value: 'runs', label: 'Salmon/Steelhead Run Timing [admin edit]' },
  { value: 'spawning', label: 'Spawn Timing [admin edit]' },
  { value: 'history', label: 'Historical Information [admin edit]' },
  { value: 'other', label: 'Other' },
]

const HAZARD_OPTIONS = [
  'Strainers become dangerous',
  'Hydraulics become retentive',
  'Water too pushy for self-rescue',
  'Specific rapid becomes Class V+',
]

const EXPERIENCE_OPTIONS = [
  { value: '1-5', label: '1\u20135 times' },
  { value: '6-20', label: '6\u201320 times' },
  { value: '20+', label: '20+ times' },
  { value: 'guide', label: 'I guide here' },
]

interface Props {
  riverId: string
  riverName: string
  stateKey: string
  initialField?: string
  externalOpen?: boolean
  onClose?: () => void
}

export default function SuggestCorrection({ riverId, riverName, stateKey, initialField, externalOpen, onClose }: Props) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    field: initialField || '',
    currentValue: '',
    suggestedValue: '',
    reason: '',
    sourceUrl: '',
  })
  const [safetyData, setSafetyData] = useState({
    upperLimit: '',
    hazard: '',
    hazardOther: '',
    experience: '',
  })

  // Allow external open control
  useEffect(() => {
    if (externalOpen) {
      setOpen(true)
      if (initialField) setForm(f => ({ ...f, field: initialField }))
    }
  }, [externalOpen, initialField])

  function handleClose() {
    setOpen(false)
    onClose?.()
  }
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submittedAsSafety, setSubmittedAsSafety] = useState(false)
  const [error, setError] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
      setUserEmail(data.user?.email ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null)
      setUserEmail(session?.user?.email ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const isSafetyCritical = form.field === 'safe_cfs'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (isSafetyCritical) {
      if (!safetyData.upperLimit || !safetyData.hazard || !safetyData.experience) {
        setError('Please fill in all safety fields')
        return
      }
      if (safetyData.hazard === 'other' && !safetyData.hazardOther.trim()) {
        setError('Please describe the hazard')
        return
      }
      // Auto-fill the standard fields from safety data
      const hazardText = safetyData.hazard === 'other' ? safetyData.hazardOther : safetyData.hazard
      const suggestedVal = `Upper safe limit: ${safetyData.upperLimit} CFS`
      const reasonText = `Hazard: ${hazardText}. Experience: ${safetyData.experience} trips. ${form.reason}`.trim()

      setForm(f => ({
        ...f,
        currentValue: form.currentValue || 'Not specified',
        suggestedValue: suggestedVal,
        reason: reasonText,
      }))

      // Submit with enriched data
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
            field: 'safe_cfs',
            currentValue: form.currentValue || 'Not specified',
            suggestedValue: suggestedVal,
            reason: reasonText,
            sourceUrl: form.sourceUrl || null,
            safetyData: {
              upperLimit: safetyData.upperLimit,
              hazard: hazardText,
              experience: safetyData.experience,
            },
          }),
        })
        const data = await res.json()
        if (data.ok) {
          setSubmittedAsSafety(true)
          setSubmitted(true)
        } else {
          setError(data.error || 'Failed to submit')
        }
      } catch {
        setError('Network error')
      }
      setSubmitting(false)
      return
    }

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
      <div onClick={() => handleClose()} style={{
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
            <button onClick={() => handleClose()} style={{
              background: 'none', border: 'none', fontSize: '18px', color: 'var(--tx3)', cursor: 'pointer',
            }}>&#10005;</button>
          </div>

          <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)', marginBottom: '16px' }}>
            {riverName} · {stateKey.toUpperCase()}
          </div>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>{submittedAsSafety ? '\u26A0' : '\u2713'}</div>

              {submittedAsSafety ? (
                <>
                  <div style={{ fontFamily: serif, fontSize: '16px', fontWeight: 600, color: 'var(--am)', marginBottom: '8px' }}>
                    Thank you.
                  </div>
                  <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx2)', lineHeight: 1.6, marginBottom: '6px' }}>
                    Safety information is our highest priority — your submission will be reviewed within 24 hours.
                  </div>
                  {userEmail && (
                    <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)', marginBottom: '12px' }}>
                      We'll email you at <strong style={{ color: 'var(--tx2)' }}>{userEmail}</strong> when it goes live.
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div style={{ fontFamily: serif, fontSize: '16px', fontWeight: 600, color: 'var(--rv)', marginBottom: '8px' }}>
                    Thank you for improving RiverScout.
                  </div>
                  <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx2)', lineHeight: 1.6, marginBottom: '12px' }}>
                    Your local knowledge is what makes this atlas accurate for every paddler who uses it. We'll notify you when your suggestion goes live.
                  </div>
                </>
              )}

              {!userId && (
                <div style={{
                  background: 'var(--bg2)', border: '.5px solid var(--bd)',
                  borderRadius: 'var(--r)', padding: '14px', marginBottom: '14px',
                }}>
                  <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx2)', lineHeight: 1.6, marginBottom: '10px' }}>
                    Create a free account to be notified when your improvement goes live and to track your contributions.
                  </div>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <a href="/login" style={{
                      fontFamily: mono, fontSize: '11px', fontWeight: 500,
                      padding: '8px 16px', borderRadius: 'var(--r)',
                      background: 'var(--rv)', color: '#fff',
                      textDecoration: 'none',
                    }}>
                      Create Account
                    </a>
                    <button onClick={() => { handleClose(); setSubmitted(false); setSubmittedAsSafety(false); setForm({ field: initialField || '', currentValue: '', suggestedValue: '', reason: '', sourceUrl: '' }) }}
                      style={{
                        fontFamily: mono, fontSize: '11px',
                        padding: '8px 16px', borderRadius: 'var(--r)',
                        background: 'var(--bg)', color: 'var(--tx3)',
                        border: '.5px solid var(--bd2)', cursor: 'pointer',
                      }}>
                      Maybe Later
                    </button>
                  </div>
                </div>
              )}

              <button onClick={() => { handleClose(); setSubmitted(false); setSubmittedAsSafety(false); setForm({ field: initialField || '', currentValue: '', suggestedValue: '', reason: '', sourceUrl: '' }) }}
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

              {!isSafetyCritical && (
                <>
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
                </>
              )}

              {/* Safety-critical section */}
              {isSafetyCritical && (
                <div style={{
                  background: 'var(--amlt)', border: '.5px solid #E8C54A', borderRadius: 'var(--r)',
                  padding: '16px', marginBottom: '16px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
                    <span style={{ fontSize: '14px' }}>&#9888;</span>
                    <span style={{ fontFamily: mono, fontSize: '12px', fontWeight: 500, color: '#6B4F0A', letterSpacing: '.3px' }}>
                      SAFETY CRITICAL INFORMATION
                    </span>
                  </div>

                  <label style={{ display: 'block', marginBottom: '14px' }}>
                    <span style={{ fontFamily: mono, fontSize: '11px', color: '#6B4F0A', display: 'block', marginBottom: '4px' }}>
                      At what CFS does this river become dangerous for intermediate paddlers? *
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontFamily: mono, fontSize: '11px', color: '#6B4F0A' }}>Upper safe limit:</span>
                      <input type="number" value={safetyData.upperLimit}
                        onChange={e => setSafetyData(d => ({ ...d, upperLimit: e.target.value }))}
                        placeholder="e.g. 800"
                        style={{ width: '100px', padding: '8px 10px', fontFamily: mono, fontSize: '13px', border: '.5px solid #E8C54A', borderRadius: 'var(--r)', background: '#fff', color: 'var(--tx)' }} />
                      <span style={{ fontFamily: mono, fontSize: '11px', color: '#6B4F0A' }}>CFS</span>
                    </div>
                  </label>

                  <div style={{ marginBottom: '14px' }}>
                    <span style={{ fontFamily: mono, fontSize: '11px', color: '#6B4F0A', display: 'block', marginBottom: '6px' }}>
                      At this level, what hazard develops? *
                    </span>
                    {HAZARD_OPTIONS.map(h => (
                      <label key={h} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0', cursor: 'pointer' }}>
                        <input type="radio" name="hazard" value={h} checked={safetyData.hazard === h}
                          onChange={() => setSafetyData(d => ({ ...d, hazard: h, hazardOther: '' }))}
                          style={{ accentColor: '#BA7517' }} />
                        <span style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx)' }}>{h}</span>
                      </label>
                    ))}
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0', cursor: 'pointer' }}>
                      <input type="radio" name="hazard" value="other" checked={safetyData.hazard === 'other'}
                        onChange={() => setSafetyData(d => ({ ...d, hazard: 'other' }))}
                        style={{ accentColor: '#BA7517' }} />
                      <span style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx)' }}>Other:</span>
                      {safetyData.hazard === 'other' && (
                        <input type="text" value={safetyData.hazardOther}
                          onChange={e => setSafetyData(d => ({ ...d, hazardOther: e.target.value }))}
                          placeholder="Describe the hazard..."
                          style={{ flex: 1, padding: '6px 8px', fontFamily: mono, fontSize: '11px', border: '.5px solid #E8C54A', borderRadius: 'var(--r)', background: '#fff', color: 'var(--tx)' }} />
                      )}
                    </label>
                  </div>

                  <label style={{ display: 'block' }}>
                    <span style={{ fontFamily: mono, fontSize: '11px', color: '#6B4F0A', display: 'block', marginBottom: '4px' }}>
                      Your experience on this river: *
                    </span>
                    <select value={safetyData.experience}
                      onChange={e => setSafetyData(d => ({ ...d, experience: e.target.value }))}
                      style={{ width: '100%', padding: '8px 10px', fontFamily: mono, fontSize: '12px', border: '.5px solid #E8C54A', borderRadius: 'var(--r)', background: '#fff', color: 'var(--tx)' }}>
                      <option value="">How many times have you paddled it?</option>
                      {EXPERIENCE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </label>
                </div>
              )}

              {!isSafetyCritical && (
                <label style={{ display: 'block', marginBottom: '16px' }}>
                  <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)', display: 'block', marginBottom: '4px' }}>
                    Source URL (optional)
                  </span>
                  <input type="url" value={form.sourceUrl} onChange={e => setForm(f => ({ ...f, sourceUrl: e.target.value }))}
                    placeholder="https://americanwhitewater.org/..."
                    style={{ width: '100%', padding: '8px 10px', fontFamily: mono, fontSize: '12px', border: '.5px solid var(--bd2)', borderRadius: 'var(--r)', background: 'var(--bg)', color: 'var(--tx)' }} />
                </label>
              )}

              {isSafetyCritical && (
                <label style={{ display: 'block', marginBottom: '12px' }}>
                  <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', display: 'block', marginBottom: '4px' }}>
                    Additional context (optional)
                  </span>
                  <textarea value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                    placeholder="Any additional details about the hazard at high water..."
                    rows={2}
                    style={{ width: '100%', padding: '8px 10px', fontFamily: mono, fontSize: '12px', border: '.5px solid var(--bd2)', borderRadius: 'var(--r)', background: 'var(--bg)', color: 'var(--tx)', resize: 'vertical' }} />
                </label>
              )}

              {error && <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--dg)', marginBottom: '8px' }}>{error}</div>}

              <button type="submit" disabled={submitting}
                style={{
                  width: '100%', padding: '10px', fontFamily: mono, fontSize: '12px', fontWeight: 500,
                  background: isSafetyCritical ? '#BA7517' : 'var(--rv)', color: '#fff', border: 'none', borderRadius: 'var(--r)',
                  cursor: submitting ? 'wait' : 'pointer', opacity: submitting ? 0.6 : 1,
                }}>
                {submitting ? 'Submitting...' : isSafetyCritical ? '\u26A0 Submit Safety Report' : 'Submit Improvement'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
