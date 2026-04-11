'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { isAdmin } from '@/lib/admin'
import type { RiverHazard, HazardSeverity } from '@/types'
import { HAZARD_TYPE_LABELS, HAZARD_SEVERITY_LABELS } from '@/types'

const mono = "'IBM Plex Mono', monospace"
const serif = "'Playfair Display', serif"

type HazardFilter = 'active' | 'expired' | 'resolved' | 'hidden' | 'all'

const SEV_COLORS: Record<HazardSeverity, { bg: string; border: string; text: string }> = {
  critical: { bg: '#FCEBEB', border: '#A32D2D', text: '#A32D2D' },
  warning:  { bg: '#FBF3E8', border: '#BA7517', text: '#7A4D0E' },
  info:     { bg: '#E6F1FB', border: '#185FA5', text: '#0C447C' },
}

function timeAgo(iso: string | null): string {
  if (!iso) return '—'
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
  if (ms <= 0) return `expired ${timeAgo(iso)}`
  const hours = Math.floor(ms / (60 * 60 * 1000))
  if (hours < 1) return 'expires <1h'
  return `expires in ${hours}h`
}

export default function AdminHazardsPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<HazardFilter>('active')
  const [hazards, setHazards] = useState<RiverHazard[]>([])
  const [busyId, setBusyId] = useState<string | null>(null)
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const uid = data.user?.id ?? null
      const email = data.user?.email ?? null
      setUserId(uid)
      setUserEmail(email)
      setAuthorized(isAdmin(uid ?? undefined, email))
      setLoading(false)
    })
  }, [])

  // Admin pages skip the public-facing GET /api/hazards endpoint and
  // query Supabase directly so we can see expired/hidden/resolved rows
  // that the public endpoint filters out.
  const fetchHazards = useCallback(async () => {
    if (!authorized) return
    setBanner(null)

    let query = supabase
      .from('river_hazards')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200)

    const nowIso = new Date().toISOString()

    if (filter === 'active') {
      query = query.eq('active', true).eq('admin_hidden', false).gt('expires_at', nowIso)
    } else if (filter === 'expired') {
      query = query.eq('active', true).lte('expires_at', nowIso)
    } else if (filter === 'resolved') {
      query = query.eq('active', false).is('admin_hidden', false)
    } else if (filter === 'hidden') {
      query = query.eq('admin_hidden', true)
    }

    const { data, error } = await query
    if (error) {
      setBanner({ type: 'error', message: `Fetch failed: ${error.message}` })
      return
    }

    // Severity rank — Postgres alphabetical order would be (critical,
    // info, warning); we want (critical, warning, info).
    const SEVERITY_RANK: Record<string, number> = { critical: 0, warning: 1, info: 2 }
    const sorted = (data ?? [])
      .slice()
      .sort((a, b) => (SEVERITY_RANK[a.severity] ?? 9) - (SEVERITY_RANK[b.severity] ?? 9))

    setHazards(sorted as RiverHazard[])
  }, [authorized, filter])

  useEffect(() => {
    if (authorized) fetchHazards()
  }, [authorized, fetchHazards])

  const handleHide = async (h: RiverHazard, hide: boolean) => {
    setBusyId(h.id)
    try {
      const res = await fetch(`/api/hazards/${h.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, userEmail, adminHidden: hide }),
      })
      const data = await res.json()
      if (data.ok) {
        setBanner({ type: 'success', message: hide ? 'Hazard hidden' : 'Hazard unhidden' })
        await fetchHazards()
      } else {
        setBanner({ type: 'error', message: data.error || 'Update failed' })
      }
    } catch {
      setBanner({ type: 'error', message: 'Network error' })
    }
    setBusyId(null)
  }

  const handleResolve = async (h: RiverHazard) => {
    if (!confirm(`Resolve "${h.title}"? It will drop off the public banner.`)) return
    setBusyId(h.id)
    try {
      const res = await fetch(`/api/hazards/${h.id}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, userEmail, note: 'Admin-resolved' }),
      })
      const data = await res.json()
      if (data.ok) {
        setBanner({ type: 'success', message: 'Hazard marked resolved' })
        await fetchHazards()
      } else {
        setBanner({ type: 'error', message: data.error || 'Resolve failed' })
      }
    } catch {
      setBanner({ type: 'error', message: 'Network error' })
    }
    setBusyId(null)
  }

  const handleExtend = async (h: RiverHazard) => {
    setBusyId(h.id)
    const newExpiry = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString()
    try {
      const res = await fetch(`/api/hazards/${h.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, userEmail, expiresAt: newExpiry }),
      })
      const data = await res.json()
      if (data.ok) {
        setBanner({ type: 'success', message: 'Expiry extended +72h' })
        await fetchHazards()
      } else {
        setBanner({ type: 'error', message: data.error || 'Extend failed' })
      }
    } catch {
      setBanner({ type: 'error', message: 'Network error' })
    }
    setBusyId(null)
  }

  const handleDelete = async (h: RiverHazard) => {
    if (!confirm(`Hard delete "${h.title}"? This cannot be undone — use Hide for soft removal.`)) return
    setBusyId(h.id)
    try {
      const res = await fetch(`/api/hazards/${h.id}?userId=${userId}&userEmail=${encodeURIComponent(userEmail ?? '')}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.ok) {
        setBanner({ type: 'success', message: 'Hazard deleted' })
        await fetchHazards()
      } else {
        setBanner({ type: 'error', message: data.error || 'Delete failed' })
      }
    } catch {
      setBanner({ type: 'error', message: 'Network error' })
    }
    setBusyId(null)
  }

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono, color: 'var(--tx3)' }}>Loading...</div>
  }

  if (!authorized) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontFamily: serif, fontSize: '20px', color: 'var(--dg)' }}>Access Denied</div>
        <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx3)' }}>Admin access required</div>
        <Link href="/login" style={{ fontFamily: mono, fontSize: '11px', color: 'var(--rv)', marginTop: '8px' }}>Sign in</Link>
      </div>
    )
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--tx)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px 28px' }}>
        <div style={{ marginBottom: '12px' }}>
          <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--dg)', padding: '5px 10px', borderRadius: '20px', border: '.5px solid var(--dg)', background: 'var(--dglt)' }}>
            Admin
          </span>
        </div>
        {/* Admin sub-nav */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <Link href="/admin/suggestions" style={{
            fontFamily: mono, fontSize: '11px', padding: '7px 16px', borderRadius: 'var(--r)',
            border: '.5px solid var(--bd2)', background: 'var(--bg)', color: 'var(--tx3)',
            textDecoration: 'none',
          }}>
            River Improvements
          </Link>
          <span style={{
            fontFamily: mono, fontSize: '11px', padding: '7px 16px', borderRadius: 'var(--r)',
            border: '.5px solid var(--rvmd)', background: 'var(--rvlt)', color: 'var(--rvdk)',
            fontWeight: 600,
          }}>
            Hazards
          </span>
          <Link href="/admin/permits" style={{
            fontFamily: mono, fontSize: '11px', padding: '7px 16px', borderRadius: 'var(--r)',
            border: '.5px solid var(--bd2)', background: 'var(--bg)', color: 'var(--tx3)',
            textDecoration: 'none',
          }}>
            Permits
          </Link>
          <Link href="/admin/qa" style={{
            fontFamily: mono, fontSize: '11px', padding: '7px 16px', borderRadius: 'var(--r)',
            border: '.5px solid var(--bd2)', background: 'var(--bg)', color: 'var(--tx3)',
            textDecoration: 'none',
          }}>
            Q&amp;A
          </Link>
          <Link href="/admin/access-points" style={{
            fontFamily: mono, fontSize: '11px', padding: '7px 16px', borderRadius: 'var(--r)',
            border: '.5px solid var(--bd2)', background: 'var(--bg)', color: 'var(--tx3)',
            textDecoration: 'none',
          }}>
            Access Points
          </Link>
        </div>

        {banner && (
          <div style={{
            padding: '12px 16px', borderRadius: 'var(--r)', marginBottom: '16px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: banner.type === 'success' ? 'var(--rvlt)' : 'var(--dglt)',
            border: `.5px solid ${banner.type === 'success' ? 'var(--rvmd)' : 'var(--dg)'}`,
            color: banner.type === 'success' ? 'var(--rvdk)' : 'var(--dg)',
          }}>
            <div style={{ fontFamily: mono, fontSize: '12px', fontWeight: 500 }}>
              {banner.type === 'success' ? '\u2713' : '\u26A0'} {banner.message}
            </div>
            <button onClick={() => setBanner(null)} style={{
              background: 'none', border: 'none', fontSize: '14px', cursor: 'pointer', color: 'inherit',
            }}>&times;</button>
          </div>
        )}

        <h1 style={{ fontFamily: serif, fontSize: '22px', fontWeight: 700, color: 'var(--rvdk)', marginBottom: '4px' }}>
          River Hazards
        </h1>
        <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx3)', marginBottom: '16px' }}>
          {hazards.length} {filter}
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {(['active', 'expired', 'resolved', 'hidden', 'all'] as HazardFilter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                fontFamily: mono, fontSize: '10px', padding: '6px 14px', borderRadius: 'var(--r)',
                border: filter === f ? '.5px solid var(--rvmd)' : '.5px solid var(--bd2)',
                background: filter === f ? 'var(--rvlt)' : 'var(--bg)',
                color: filter === f ? 'var(--rvdk)' : 'var(--tx3)',
                cursor: 'pointer', textTransform: 'capitalize',
                fontWeight: filter === f ? 600 : 400,
              }}>
              {f}
            </button>
          ))}
        </div>

        {/* Hazard list */}
        {hazards.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', fontFamily: mono, fontSize: '12px', color: 'var(--tx3)', background: 'var(--bg2)', borderRadius: 'var(--r)' }}>
            No {filter} hazards.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {hazards.map(h => {
              const sev = SEV_COLORS[h.severity]
              const isExpired = new Date(h.expires_at).getTime() < Date.now()
              const busy = busyId === h.id
              return (
                <div key={h.id} style={{
                  border: `1px solid ${sev.border}`,
                  borderLeft: `4px solid ${sev.border}`,
                  borderRadius: 'var(--r)',
                  background: h.admin_hidden ? 'var(--bg2)' : sev.bg,
                  padding: '12px 14px',
                  opacity: h.admin_hidden ? 0.6 : 1,
                }}>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                    <span style={{
                      fontFamily: mono, fontSize: '9px', fontWeight: 700, letterSpacing: '1.2px',
                      textTransform: 'uppercase', padding: '2px 7px', borderRadius: '10px',
                      background: sev.border, color: '#fff',
                    }}>
                      {HAZARD_SEVERITY_LABELS[h.severity]}
                    </span>
                    <span style={{ fontFamily: mono, fontSize: '10px', color: sev.text, fontWeight: 500 }}>
                      {HAZARD_TYPE_LABELS[h.hazard_type]}
                    </span>
                    <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx)' }}>
                      &middot; {h.river_name} {h.state_key && <span style={{ color: 'var(--tx3)' }}>({h.state_key.toUpperCase()})</span>}
                    </span>
                    <span style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', marginLeft: 'auto' }}>
                      {timeAgo(h.created_at)} &middot; {isExpired ? 'EXPIRED' : expiresIn(h.expires_at)}
                    </span>
                  </div>

                  <div style={{ fontFamily: serif, fontSize: '14px', fontWeight: 600, color: sev.text, marginBottom: '4px' }}>
                    {h.title}
                  </div>

                  <div style={{ fontSize: '12px', color: 'var(--tx)', lineHeight: 1.55, marginBottom: '6px' }}>
                    {h.description}
                  </div>

                  {h.location_description && (
                    <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', marginBottom: '4px' }}>
                      &#128205; {h.location_description}
                    </div>
                  )}

                  <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)', marginBottom: '8px', lineHeight: 1.6 }}>
                    Reporter: {h.reporter_name || h.reporter_email || h.reported_by || 'unknown'}
                    {' · '}Confirmations: {h.confirmations}
                    {h.email_sent_at && ` · Emailed ${h.email_recipients_count ?? 0}`}
                    {h.resolved_at && ` · Resolved ${timeAgo(h.resolved_at)}`}
                    {h.admin_hidden && ' · HIDDEN'}
                  </div>

                  {h.admin_notes && (
                    <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', marginBottom: '8px', padding: '6px 8px', background: 'rgba(0,0,0,.04)', borderRadius: '4px' }}>
                      <strong>Admin notes:</strong> {h.admin_notes}
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {h.active && !h.admin_hidden && (
                      <>
                        <button
                          onClick={() => handleResolve(h)}
                          disabled={busy}
                          style={{
                            fontFamily: mono, fontSize: '10px', padding: '5px 12px', borderRadius: 'var(--r)',
                            border: '.5px solid var(--rvmd)', background: 'var(--bg)', color: 'var(--rvdk)',
                            cursor: busy ? 'wait' : 'pointer', opacity: busy ? 0.6 : 1,
                          }}>
                          Mark resolved
                        </button>
                        <button
                          onClick={() => handleExtend(h)}
                          disabled={busy}
                          style={{
                            fontFamily: mono, fontSize: '10px', padding: '5px 12px', borderRadius: 'var(--r)',
                            border: '.5px solid var(--bd2)', background: 'var(--bg)', color: 'var(--tx2)',
                            cursor: busy ? 'wait' : 'pointer', opacity: busy ? 0.6 : 1,
                          }}>
                          Extend +72h
                        </button>
                        <button
                          onClick={() => handleHide(h, true)}
                          disabled={busy}
                          style={{
                            fontFamily: mono, fontSize: '10px', padding: '5px 12px', borderRadius: 'var(--r)',
                            border: '.5px solid var(--bd2)', background: 'var(--bg)', color: 'var(--tx2)',
                            cursor: busy ? 'wait' : 'pointer', opacity: busy ? 0.6 : 1,
                          }}>
                          Hide
                        </button>
                      </>
                    )}
                    {h.admin_hidden && (
                      <button
                        onClick={() => handleHide(h, false)}
                        disabled={busy}
                        style={{
                          fontFamily: mono, fontSize: '10px', padding: '5px 12px', borderRadius: 'var(--r)',
                          border: '.5px solid var(--rvmd)', background: 'var(--bg)', color: 'var(--rvdk)',
                          cursor: busy ? 'wait' : 'pointer', opacity: busy ? 0.6 : 1,
                        }}>
                        Unhide
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(h)}
                      disabled={busy}
                      style={{
                        fontFamily: mono, fontSize: '10px', padding: '5px 12px', borderRadius: 'var(--r)',
                        border: '.5px solid var(--dg)', background: 'var(--bg)', color: 'var(--dg)',
                        cursor: busy ? 'wait' : 'pointer', opacity: busy ? 0.6 : 1,
                      }}>
                      Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
