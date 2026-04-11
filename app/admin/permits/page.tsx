'use client'

// Admin permit management.
//
// Lists every row in public.river_permits sorted by state then river
// name. Each row can be expanded to an inline edit form covering
// every editable column. The "Mark needs re-verification" action
// just clears last_verified_year so the row reappears in next
// January's reminder cron.
//
// Read paths use direct supabase queries (read-only, RLS enforces
// public read so admin context isn't needed); writes go through
// /api/permits PATCH which validates admin via isAdmin().

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { isAdmin } from '@/lib/admin'
import type { RiverPermit, PermitType, PermitRequiredFor } from '@/types'
import { PERMIT_TYPE_LABELS, PERMIT_REQUIRED_FOR_LABELS } from '@/types'

const mono = "'IBM Plex Mono', monospace"
const serif = "'Playfair Display', serif"

type FilterMode = 'all' | 'stale' | 'current'

export default function AdminPermitsPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [permits, setPermits] = useState<RiverPermit[]>([])
  const [filter, setFilter] = useState<FilterMode>('all')
  const [editingId, setEditingId] = useState<string | null>(null)
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

  const fetchPermits = useCallback(async () => {
    if (!authorized || !userId) return
    setBanner(null)
    const url = `/api/permits?userId=${encodeURIComponent(userId)}&userEmail=${encodeURIComponent(userEmail ?? '')}`
    const res = await fetch(url)
    const data = await res.json()
    if (data.permits) setPermits(data.permits as RiverPermit[])
    else if (data.error) setBanner({ type: 'error', message: `Fetch failed: ${data.error}` })
  }, [authorized, userId, userEmail])

  useEffect(() => {
    if (authorized) fetchPermits()
  }, [authorized, fetchPermits])

  const currentYear = new Date().getFullYear()
  const filtered = permits.filter(p => {
    if (filter === 'stale') return p.last_verified_year === null || p.last_verified_year < currentYear
    if (filter === 'current') return p.last_verified_year === currentYear
    return true
  })

  const handleSave = async (id: string, updates: Partial<RiverPermit>) => {
    setBusyId(id)
    setBanner(null)
    try {
      const res = await fetch('/api/permits', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, userId, userEmail, updates }),
      })
      const data = await res.json()
      if (data.ok) {
        setBanner({ type: 'success', message: 'Permit updated' })
        setEditingId(null)
        await fetchPermits()
      } else {
        setBanner({ type: 'error', message: data.error || 'Update failed' })
      }
    } catch {
      setBanner({ type: 'error', message: 'Network error' })
    }
    setBusyId(null)
  }

  const handleMarkStale = async (id: string) => {
    if (!confirm('Mark this permit as needing re-verification? It will appear in the next January reminder.')) return
    await handleSave(id, { last_verified_year: null })
  }

  const handleMarkVerified = async (id: string) => {
    await handleSave(id, { last_verified_year: currentYear })
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

  const staleCount = permits.filter(p => p.last_verified_year === null || p.last_verified_year < currentYear).length

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--tx)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px 28px' }}>
        <div style={{ marginBottom: '12px' }}>
          <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--dg)', padding: '5px 10px', borderRadius: '20px', border: '.5px solid var(--dg)', background: 'var(--dglt)' }}>
            Admin
          </span>
        </div>
        {/* Sub-nav across admin pages */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <Link href="/admin/suggestions" style={{
            fontFamily: mono, fontSize: '11px', padding: '7px 16px', borderRadius: 'var(--r)',
            border: '.5px solid var(--bd2)', background: 'var(--bg)', color: 'var(--tx3)',
            textDecoration: 'none',
          }}>
            River Improvements
          </Link>
          <Link href="/admin/hazards" style={{
            fontFamily: mono, fontSize: '11px', padding: '7px 16px', borderRadius: 'var(--r)',
            border: '.5px solid var(--bd2)', background: 'var(--bg)', color: 'var(--tx3)',
            textDecoration: 'none',
          }}>
            Hazards
          </Link>
          <span style={{
            fontFamily: mono, fontSize: '11px', padding: '7px 16px', borderRadius: 'var(--r)',
            border: '.5px solid var(--rvmd)', background: 'var(--rvlt)', color: 'var(--rvdk)',
            fontWeight: 600,
          }}>
            Permits
          </span>
          <Link href="/admin/qa" style={{
            fontFamily: mono, fontSize: '11px', padding: '7px 16px', borderRadius: 'var(--r)',
            border: '.5px solid var(--bd2)', background: 'var(--bg)', color: 'var(--tx3)',
            textDecoration: 'none',
          }}>
            Q&amp;A
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
          River Permits
        </h1>
        <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx3)', marginBottom: '14px' }}>
          {permits.length} total &middot; {staleCount} need verification for {currentYear}
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {(['all', 'stale', 'current'] as FilterMode[]).map(f => (
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
              {f === 'stale' ? `Needs verification (${staleCount})` : f === 'current' ? `Verified ${currentYear}` : 'All'}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', fontFamily: mono, fontSize: '12px', color: 'var(--tx3)', background: 'var(--bg2)', borderRadius: 'var(--r)' }}>
            No permits in this filter.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filtered.map(p => {
              const isStale = p.last_verified_year === null || p.last_verified_year < currentYear
              const isExpanded = editingId === p.id
              return (
                <div key={p.id} style={{
                  border: `1px solid ${isStale ? 'var(--am)' : 'var(--bd)'}`,
                  borderLeft: `4px solid ${isStale ? 'var(--am)' : 'var(--rvmd)'}`,
                  borderRadius: 'var(--r)',
                  background: 'var(--bg)',
                  padding: '12px 14px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '260px' }}>
                      <div style={{ fontFamily: serif, fontSize: '15px', fontWeight: 700, color: 'var(--rvdk)', marginBottom: '4px' }}>
                        {p.river_name} <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)', fontWeight: 400 }}>{(p.state_key || '').toUpperCase()}</span>
                      </div>
                      <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx2)', marginBottom: '4px' }}>
                        {p.permit_name}
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                        <span style={{ fontFamily: mono, fontSize: '9px', padding: '2px 6px', borderRadius: '3px', background: 'var(--bg2)', color: 'var(--tx2)', border: '.5px solid var(--bd2)' }}>
                          {PERMIT_TYPE_LABELS[p.permit_type] ?? p.permit_type}
                        </span>
                        <span style={{ fontFamily: mono, fontSize: '9px', padding: '2px 6px', borderRadius: '3px', background: 'var(--bg2)', color: 'var(--tx2)', border: '.5px solid var(--bd2)' }}>
                          {PERMIT_REQUIRED_FOR_LABELS[p.required_for] ?? p.required_for}
                        </span>
                        <span style={{
                          fontFamily: mono, fontSize: '9px', padding: '2px 6px', borderRadius: '3px',
                          background: isStale ? 'var(--amlt)' : 'var(--rvlt)',
                          color: isStale ? '#7A4D0E' : 'var(--rvdk)',
                          border: `.5px solid ${isStale ? 'var(--am)' : 'var(--rvmd)'}`,
                          fontWeight: 600,
                        }}>
                          {p.last_verified_year ? `Verified ${p.last_verified_year}` : 'Never verified'}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {!isExpanded ? (
                        <button
                          onClick={() => setEditingId(p.id)}
                          disabled={busyId === p.id}
                          style={{
                            fontFamily: mono, fontSize: '10px', padding: '6px 12px', borderRadius: 'var(--r)',
                            border: '.5px solid var(--rvmd)', background: 'var(--bg)', color: 'var(--rvdk)',
                            cursor: 'pointer',
                          }}>
                          Edit
                        </button>
                      ) : (
                        <button
                          onClick={() => setEditingId(null)}
                          style={{
                            fontFamily: mono, fontSize: '10px', padding: '6px 12px', borderRadius: 'var(--r)',
                            border: '.5px solid var(--bd2)', background: 'var(--bg)', color: 'var(--tx2)',
                            cursor: 'pointer',
                          }}>
                          Close
                        </button>
                      )}
                      {!isStale && (
                        <button
                          onClick={() => handleMarkStale(p.id)}
                          disabled={busyId === p.id}
                          style={{
                            fontFamily: mono, fontSize: '10px', padding: '6px 12px', borderRadius: 'var(--r)',
                            border: '.5px solid var(--am)', background: 'var(--bg)', color: '#7A4D0E',
                            cursor: busyId === p.id ? 'wait' : 'pointer',
                          }}>
                          Mark stale
                        </button>
                      )}
                      {isStale && (
                        <button
                          onClick={() => handleMarkVerified(p.id)}
                          disabled={busyId === p.id}
                          style={{
                            fontFamily: mono, fontSize: '10px', padding: '6px 12px', borderRadius: 'var(--r)',
                            border: '.5px solid var(--rv)', background: 'var(--bg)', color: 'var(--rv)',
                            cursor: busyId === p.id ? 'wait' : 'pointer',
                            fontWeight: 600,
                          }}>
                          Mark verified {currentYear}
                        </button>
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <PermitEditForm
                      permit={p}
                      onSave={(updates) => handleSave(p.id, updates)}
                      busy={busyId === p.id}
                    />
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

// ── Inline edit form ──────────────────────────────────────────────

interface FormProps {
  permit: RiverPermit
  onSave: (updates: Partial<RiverPermit>) => void
  busy: boolean
}

function PermitEditForm({ permit, onSave, busy }: FormProps) {
  // Local state mirror — only sent fields go to the PATCH route, but
  // we initialize from the row so partial edits feel like edits
  // rather than fresh inserts.
  const [form, setForm] = useState<Record<string, unknown>>({
    permit_name: permit.permit_name,
    managing_agency: permit.managing_agency,
    permit_type: permit.permit_type,
    required_for: permit.required_for,
    application_opens: permit.application_opens ?? '',
    application_closes: permit.application_closes ?? '',
    results_date: permit.results_date ?? '',
    permit_season_start: permit.permit_season_start ?? '',
    permit_season_end: permit.permit_season_end ?? '',
    group_size_min: permit.group_size_min ?? '',
    group_size_max: permit.group_size_max ?? '',
    cost_per_person: permit.cost_per_person ?? '',
    cost_per_group: permit.cost_per_group ?? '',
    apply_url: permit.apply_url ?? '',
    info_url: permit.info_url ?? '',
    phone: permit.phone ?? '',
    notes: permit.notes ?? '',
    commercial_available: permit.commercial_available,
    commercial_notes: permit.commercial_notes ?? '',
    last_verified_year: permit.last_verified_year ?? '',
  })

  const set = (k: string, v: unknown) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Coerce numeric string inputs back to numbers, leave blanks as ''
    // (the PATCH route turns '' into null).
    const numeric = ['group_size_min', 'group_size_max', 'cost_per_person', 'cost_per_group', 'last_verified_year']
    const updates: Record<string, unknown> = { ...form }
    for (const k of numeric) {
      if (updates[k] === '') continue
      const n = Number(updates[k])
      if (!isNaN(n)) updates[k] = n
    }
    onSave(updates as Partial<RiverPermit>)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '6px 8px',
    fontFamily: mono, fontSize: '11px',
    border: '.5px solid var(--bd2)', borderRadius: 'var(--r)',
    background: 'var(--bg)', color: 'var(--tx)', boxSizing: 'border-box',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontFamily: mono, fontSize: '9px',
    color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.5px',
    marginBottom: '3px', marginTop: '8px',
  }

  return (
    <form onSubmit={handleSubmit} style={{
      marginTop: '12px', paddingTop: '12px',
      borderTop: '.5px solid var(--bd)',
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label style={labelStyle}>Permit name</label>
          <input style={inputStyle} value={form.permit_name as string} onChange={e => set('permit_name', e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Managing agency</label>
          <input style={inputStyle} value={form.managing_agency as string} onChange={e => set('managing_agency', e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Permit type</label>
          <select style={inputStyle} value={form.permit_type as string} onChange={e => set('permit_type', e.target.value as PermitType)}>
            {(Object.keys(PERMIT_TYPE_LABELS) as PermitType[]).map(t => (
              <option key={t} value={t}>{PERMIT_TYPE_LABELS[t]}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Required for</label>
          <select style={inputStyle} value={form.required_for as string} onChange={e => set('required_for', e.target.value as PermitRequiredFor)}>
            {(Object.keys(PERMIT_REQUIRED_FOR_LABELS) as PermitRequiredFor[]).map(r => (
              <option key={r} value={r}>{PERMIT_REQUIRED_FOR_LABELS[r]}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Application opens</label>
          <input style={inputStyle} value={form.application_opens as string} onChange={e => set('application_opens', e.target.value)} placeholder="e.g. December 1" />
        </div>
        <div>
          <label style={labelStyle}>Application closes</label>
          <input style={inputStyle} value={form.application_closes as string} onChange={e => set('application_closes', e.target.value)} placeholder="e.g. January 31" />
        </div>
        <div>
          <label style={labelStyle}>Results date</label>
          <input style={inputStyle} value={form.results_date as string} onChange={e => set('results_date', e.target.value)} placeholder="e.g. Mid-February" />
        </div>
        <div>
          <label style={labelStyle}>Last verified year</label>
          <input type="number" style={inputStyle} value={form.last_verified_year as string | number} onChange={e => set('last_verified_year', e.target.value)} placeholder={String(new Date().getFullYear())} />
        </div>
        <div>
          <label style={labelStyle}>Season start</label>
          <input style={inputStyle} value={form.permit_season_start as string} onChange={e => set('permit_season_start', e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Season end</label>
          <input style={inputStyle} value={form.permit_season_end as string} onChange={e => set('permit_season_end', e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Group size min</label>
          <input type="number" style={inputStyle} value={form.group_size_min as string | number} onChange={e => set('group_size_min', e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Group size max</label>
          <input type="number" style={inputStyle} value={form.group_size_max as string | number} onChange={e => set('group_size_max', e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Cost per person</label>
          <input type="number" step="0.01" style={inputStyle} value={form.cost_per_person as string | number} onChange={e => set('cost_per_person', e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Cost per group</label>
          <input type="number" step="0.01" style={inputStyle} value={form.cost_per_group as string | number} onChange={e => set('cost_per_group', e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Apply URL</label>
          <input type="url" style={inputStyle} value={form.apply_url as string} onChange={e => set('apply_url', e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Info URL</label>
          <input type="url" style={inputStyle} value={form.info_url as string} onChange={e => set('info_url', e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Phone</label>
          <input style={inputStyle} value={form.phone as string} onChange={e => set('phone', e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Commercial available</label>
          <select style={inputStyle} value={String(form.commercial_available)} onChange={e => set('commercial_available', e.target.value === 'true')}>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      </div>

      <label style={labelStyle}>Notes</label>
      <textarea
        style={{ ...inputStyle, minHeight: '80px', resize: 'vertical', lineHeight: 1.5 }}
        value={form.notes as string}
        onChange={e => set('notes', e.target.value)}
      />

      <label style={labelStyle}>Commercial notes</label>
      <textarea
        style={{ ...inputStyle, minHeight: '60px', resize: 'vertical', lineHeight: 1.5 }}
        value={form.commercial_notes as string}
        onChange={e => set('commercial_notes', e.target.value)}
      />

      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <button
          type="submit"
          disabled={busy}
          style={{
            fontFamily: mono, fontSize: '11px', fontWeight: 500,
            padding: '8px 18px', borderRadius: 'var(--r)',
            background: 'var(--rvdk)', color: '#fff', border: 'none',
            cursor: busy ? 'wait' : 'pointer',
            opacity: busy ? 0.6 : 1,
          }}>
          {busy ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  )
}
