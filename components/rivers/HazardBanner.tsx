'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { HazardType, HazardSeverity } from '@/types'
import { HAZARD_TYPE_LABELS, HAZARD_SEVERITY_LABELS } from '@/types'
import type { PrefetchedHazard } from '@/lib/river-page-data'

const mono = "'IBM Plex Mono', monospace"
const serif = "'Playfair Display', serif"

interface Props {
  riverId: string
  riverName: string
  stateKey: string
  initialHazards: PrefetchedHazard[]
}

// Severity → color tokens used by the banner cards.
const SEV_STYLES: Record<HazardSeverity, {
  bg: string; border: string; text: string; chip: string
}> = {
  critical: { bg: '#FCEBEB', border: '#A32D2D', text: '#A32D2D', chip: '#A32D2D' },
  warning:  { bg: '#FBF3E8', border: '#BA7517', text: '#7A4D0E', chip: '#BA7517' },
  info:     { bg: '#E6F1FB', border: '#185FA5', text: '#0C447C', chip: '#185FA5' },
}

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(ms / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function expiresIn(iso: string): string {
  const ms = new Date(iso).getTime() - Date.now()
  if (ms <= 0) return 'expired'
  const hours = Math.floor(ms / (60 * 60 * 1000))
  if (hours < 1) return 'expires soon'
  return `expires in ${hours}h`
}

export default function HazardBanner({ riverId, riverName, stateKey, initialHazards }: Props) {
  const [hazards, setHazards] = useState<PrefetchedHazard[]>(initialHazards)
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [reportOpen, setReportOpen] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)

  // Fetch the current user once on mount so we know whether to show
  // confirm/resolve buttons + the "report a hazard" CTA.
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user
      setUserId(u?.id ?? null)
      setUserEmail(u?.email ?? null)
      const meta = u?.user_metadata as { full_name?: string; name?: string } | undefined
      setUserName(meta?.full_name || meta?.name || (u?.email?.split('@')[0] ?? null))
    })
  }, [])

  // Re-fetch from /api/hazards after any state-changing action so the
  // banner reflects fresh server state without a full page reload.
  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`/api/hazards?riverId=${encodeURIComponent(riverId)}`)
      const data = await res.json()
      if (data.hazards) setHazards(data.hazards)
    } catch { /* ignore — stale state is acceptable */ }
  }, [riverId])

  const handleConfirm = async (hazardId: string) => {
    if (!userId) return
    setBusyId(hazardId)
    try {
      await fetch(`/api/hazards/${hazardId}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      await refresh()
    } finally {
      setBusyId(null)
    }
  }

  const handleResolve = async (hazardId: string) => {
    if (!userId) return
    if (!confirm('Mark this hazard as resolved? It will drop off the banner.')) return
    setBusyId(hazardId)
    try {
      await fetch(`/api/hazards/${hazardId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, userEmail, note: null }),
      })
      await refresh()
    } finally {
      setBusyId(null)
    }
  }

  // Hide the banner row entirely when there are no active hazards AND
  // the user can't submit one — that keeps the river page clean for
  // anonymous visitors on safe rivers. Logged-in users always see at
  // least the "Report a hazard" CTA so they can flag something new.
  if (hazards.length === 0 && !userId) return null

  return (
    <>
      <div style={{
        flexShrink: 0,
        background: hazards.length > 0 ? 'var(--bg)' : 'var(--bg2)',
        borderBottom: '.5px solid var(--bd)',
      }}>
        {hazards.length > 0 && (
          <div style={{ padding: '10px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {hazards.map(h => {
              const sev = SEV_STYLES[h.severity as HazardSeverity] ?? SEV_STYLES.warning
              const isReporter = userId && h.reported_by === userId
              return (
                <div key={h.id} style={{
                  border: `1px solid ${sev.border}`,
                  borderLeft: `4px solid ${sev.border}`,
                  borderRadius: 'var(--r)',
                  background: sev.bg,
                  padding: '10px 12px',
                }}>
                  {/* Header row */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                    <span style={{
                      fontFamily: mono, fontSize: '9px', fontWeight: 700,
                      letterSpacing: '1.2px', textTransform: 'uppercase',
                      padding: '2px 7px', borderRadius: '10px',
                      background: sev.chip, color: '#fff',
                    }}>
                      &#9888; {h.severity}
                    </span>
                    <span style={{ fontFamily: mono, fontSize: '10px', color: sev.text, fontWeight: 500 }}>
                      {HAZARD_TYPE_LABELS[h.hazard_type as HazardType] ?? h.hazard_type}
                    </span>
                    <span style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', marginLeft: 'auto' }}>
                      {timeAgo(h.created_at)} &middot; {expiresIn(h.expires_at)}
                    </span>
                  </div>

                  {/* Title */}
                  <div style={{ fontFamily: serif, fontSize: '14px', fontWeight: 600, color: sev.text, marginBottom: '4px', lineHeight: 1.3 }}>
                    {h.title}
                  </div>

                  {/* Description */}
                  <div style={{ fontSize: '12px', color: 'var(--tx)', lineHeight: 1.55, marginBottom: '6px' }}>
                    {h.description}
                  </div>

                  {/* Location + reporter line */}
                  {(h.location_description || h.reporter_name) && (
                    <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', lineHeight: 1.5, marginBottom: '8px' }}>
                      {h.location_description && (
                        <span>&#128205; {h.location_description}</span>
                      )}
                      {h.location_description && h.reporter_name && <span> &middot; </span>}
                      {h.reporter_name && (
                        <span>Reported by {h.reporter_name}</span>
                      )}
                    </div>
                  )}

                  {/* Confirmation count */}
                  {h.confirmations > 0 && (
                    <div style={{ fontFamily: mono, fontSize: '10px', color: sev.text, marginBottom: '8px' }}>
                      &#10003; Confirmed by {h.confirmations} paddler{h.confirmations !== 1 ? 's' : ''}
                      {h.last_confirmed_at && ` (last ${timeAgo(h.last_confirmed_at)})`}
                    </div>
                  )}

                  {/* Action row */}
                  {userId && (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => handleConfirm(h.id)}
                        disabled={busyId === h.id}
                        style={{
                          fontFamily: mono, fontSize: '10px', fontWeight: 500,
                          padding: '5px 12px', borderRadius: 'var(--r)',
                          border: `.5px solid ${sev.border}`,
                          background: '#fff', color: sev.text,
                          cursor: busyId === h.id ? 'wait' : 'pointer',
                          opacity: busyId === h.id ? 0.6 : 1,
                        }}>
                        Still present &rarr;
                      </button>
                      {isReporter && (
                        <button
                          onClick={() => handleResolve(h.id)}
                          disabled={busyId === h.id}
                          style={{
                            fontFamily: mono, fontSize: '10px',
                            padding: '5px 12px', borderRadius: 'var(--r)',
                            border: '.5px solid var(--bd2)',
                            background: '#fff', color: 'var(--tx2)',
                            cursor: busyId === h.id ? 'wait' : 'pointer',
                            opacity: busyId === h.id ? 0.6 : 1,
                          }}>
                          Mark resolved
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Report CTA — always shown to logged-in users.
            Anonymous users only see this row if there are also active
            hazards above (so the page isn't crowded with empty CTAs). */}
        {userId && (
          <div style={{
            padding: hazards.length > 0 ? '6px 16px 10px' : '8px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: '10px', flexWrap: 'wrap',
          }}>
            <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)', lineHeight: 1.5 }}>
              Spotted a strainer, hydraulic, or access closure? Report it so other paddlers know.
            </div>
            <button
              onClick={() => setReportOpen(true)}
              style={{
                fontFamily: mono, fontSize: '10px', fontWeight: 500,
                padding: '6px 14px', borderRadius: 'var(--r)',
                background: 'var(--rvdk)', color: '#fff', border: 'none',
                cursor: 'pointer', flexShrink: 0,
              }}>
              &#9888; Report a hazard
            </button>
          </div>
        )}
      </div>

      {reportOpen && userId && (
        <ReportHazardModal
          riverId={riverId}
          riverName={riverName}
          userId={userId}
          userEmail={userEmail}
          userName={userName}
          onClose={() => setReportOpen(false)}
          onSuccess={async () => {
            setReportOpen(false)
            await refresh()
          }}
        />
      )}
    </>
  )
}

// ── Report submission modal ───────────────────────────────────────

interface ModalProps {
  riverId: string
  riverName: string
  userId: string
  userEmail: string | null
  userName: string | null
  onClose: () => void
  onSuccess: () => void
}

function ReportHazardModal({ riverId, riverName, userId, userEmail, userName, onClose, onSuccess }: ModalProps) {
  const [hazardType, setHazardType] = useState<HazardType>('strainer')
  const [severity, setSeverity] = useState<HazardSeverity>('warning')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [locationDescription, setLocationDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/hazards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          userEmail,
          reporterName: userName,
          riverId,
          hazardType,
          severity,
          title: title.trim(),
          description: description.trim(),
          locationDescription: locationDescription.trim() || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to submit')
        setSubmitting(false)
        return
      }
      onSuccess()
    } catch {
      setError('Network error')
      setSubmitting(false)
    }
  }

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)',
      zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg)', borderRadius: 'var(--rlg)',
        padding: '22px 24px', maxWidth: '460px', width: '100%',
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 12px 48px rgba(0,0,0,.25)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
          <div>
            <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--dg)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px' }}>
              &#9888; Report a hazard
            </div>
            <div style={{ fontFamily: serif, fontSize: '17px', fontWeight: 700, color: 'var(--tx)', lineHeight: 1.3 }}>
              {riverName}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', fontSize: '18px',
            color: 'var(--tx3)', cursor: 'pointer', padding: '4px 8px',
          }}>&#10005;</button>
        </div>

        <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)', marginBottom: '14px', lineHeight: 1.55 }}>
          Hazards expire after 72 hours unless someone confirms they&apos;re still there. Critical hazards email everyone subscribed to flow alerts for this river.
        </div>

        {/* Type */}
        <label style={{ display: 'block', marginBottom: '12px' }}>
          <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', display: 'block', marginBottom: '4px' }}>
            Hazard type
          </span>
          <select
            value={hazardType}
            onChange={e => setHazardType(e.target.value as HazardType)}
            style={{
              width: '100%', padding: '8px 10px', fontFamily: mono, fontSize: '12px',
              border: '.5px solid var(--bd2)', borderRadius: 'var(--r)',
              background: 'var(--bg)', color: 'var(--tx)', boxSizing: 'border-box',
            }}>
            {(Object.keys(HAZARD_TYPE_LABELS) as HazardType[]).map(t => (
              <option key={t} value={t}>{HAZARD_TYPE_LABELS[t]}</option>
            ))}
          </select>
        </label>

        {/* Severity */}
        <div style={{ marginBottom: '12px' }}>
          <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', display: 'block', marginBottom: '6px' }}>
            Severity
          </span>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {(Object.keys(HAZARD_SEVERITY_LABELS) as HazardSeverity[]).map(s => {
              const sev = SEV_STYLES[s]
              const selected = severity === s
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSeverity(s)}
                  style={{
                    fontFamily: mono, fontSize: '10px', fontWeight: 500,
                    padding: '6px 12px', borderRadius: 'var(--r)',
                    border: `.5px solid ${selected ? sev.border : 'var(--bd2)'}`,
                    background: selected ? sev.bg : 'var(--bg)',
                    color: selected ? sev.text : 'var(--tx2)',
                    cursor: 'pointer', textTransform: 'capitalize',
                  }}>
                  {s}
                </button>
              )
            })}
          </div>
          {severity === 'critical' && (
            <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--dg)', marginTop: '6px', lineHeight: 1.5 }}>
              Critical hazards email every flow-alert subscriber for this river. Use only for life-threatening conditions.
            </div>
          )}
        </div>

        {/* Title */}
        <label style={{ display: 'block', marginBottom: '12px' }}>
          <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', display: 'block', marginBottom: '4px' }}>
            Short title
          </span>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={140}
            placeholder="e.g. Strainer across river above Tippy Dam"
            style={{
              width: '100%', padding: '8px 10px', fontFamily: mono, fontSize: '12px',
              border: '.5px solid var(--bd2)', borderRadius: 'var(--r)',
              background: 'var(--bg)', color: 'var(--tx)', boxSizing: 'border-box',
            }} />
        </label>

        {/* Description */}
        <label style={{ display: 'block', marginBottom: '12px' }}>
          <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', display: 'block', marginBottom: '4px' }}>
            Description
          </span>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            maxLength={2000}
            placeholder="What is it, why is it dangerous, what should paddlers do?"
            style={{
              width: '100%', padding: '8px 10px', fontFamily: mono, fontSize: '12px',
              border: '.5px solid var(--bd2)', borderRadius: 'var(--r)',
              background: 'var(--bg)', color: 'var(--tx)', boxSizing: 'border-box',
              resize: 'vertical', lineHeight: 1.5,
            }} />
        </label>

        {/* Location */}
        <label style={{ display: 'block', marginBottom: '14px' }}>
          <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', display: 'block', marginBottom: '4px' }}>
            Location <span style={{ color: 'var(--tx3)' }}>(optional)</span>
          </span>
          <input
            type="text"
            value={locationDescription}
            onChange={e => setLocationDescription(e.target.value)}
            maxLength={200}
            placeholder="e.g. River left, half a mile below Dorrance Bridge"
            style={{
              width: '100%', padding: '8px 10px', fontFamily: mono, fontSize: '12px',
              border: '.5px solid var(--bd2)', borderRadius: 'var(--r)',
              background: 'var(--bg)', color: 'var(--tx)', boxSizing: 'border-box',
            }} />
        </label>

        {error && (
          <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--dg)', marginBottom: '10px' }}>
            &#9888; {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleSubmit}
            disabled={submitting || !title.trim() || !description.trim()}
            style={{
              flex: 1, padding: '11px',
              fontFamily: mono, fontSize: '11px', fontWeight: 500,
              background: severity === 'critical' ? '#A32D2D' : 'var(--rvdk)',
              color: '#fff', border: 'none', borderRadius: 'var(--r)',
              cursor: submitting ? 'wait' : 'pointer',
              opacity: (submitting || !title.trim() || !description.trim()) ? 0.5 : 1,
              letterSpacing: '.3px',
            }}>
            {submitting
              ? 'Posting...'
              : severity === 'critical'
                ? 'Post critical hazard + email subscribers'
                : 'Post hazard'}
          </button>
        </div>
      </div>
    </div>
  )
}
