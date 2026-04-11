'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { isAdmin } from '@/lib/admin'

const mono = "'IBM Plex Mono', monospace"
const serif = "'Playfair Display', serif"

// /admin/access-points
//
// Admin queue for user-submitted access points. Filter tabs:
//   pending       — fresh submissions awaiting review
//   needs_review  — verified rows that have an open change report
//   verified      — confirmed (reviewable but rare)
//   rejected      — soft-deleted, restorable

type Filter = 'pending' | 'needs_review' | 'verified' | 'rejected'

interface AccessPointRow {
  id: string
  river_id: string
  name: string
  description: string | null
  access_type: string | null
  ramp_surface: string | null
  trailer_access: boolean
  parking_capacity: string | null
  facilities: string[] | null
  lat: number | null
  lng: number | null
  river_mile: number | null
  submitted_by_name: string | null
  verification_status: string
  ai_confidence: 'high' | 'medium' | 'low' | null
  ai_reasoning: string | null
  helpful_count: number
  created_at: string
}

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime()
  const days = Math.floor(ms / 86_400_000)
  if (days < 1) {
    const hours = Math.floor(ms / 3_600_000)
    return hours < 1 ? 'just now' : `${hours}h ago`
  }
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days}d ago`
  return new Date(iso).toLocaleDateString()
}

export default function AdminAccessPointsPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('pending')
  const [rows, setRows] = useState<AccessPointRow[]>([])
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

  const fetchRows = useCallback(async () => {
    if (!authorized) return
    setBanner(null)

    // Cast to any — river_access_points isn't in the generated
    // Supabase types yet (same workaround used elsewhere for fresh
    // tables).
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any

    const { data, error } = await sb.from('river_access_points')
      .select('id, river_id, name, description, access_type, ramp_surface, trailer_access, parking_capacity, facilities, lat, lng, river_mile, submitted_by_name, verification_status, ai_confidence, ai_reasoning, helpful_count, created_at')
      .eq('verification_status', filter)
      .order('created_at', { ascending: false })
      .limit(100)
    if (error) {
      setBanner({ type: 'error', message: `Fetch failed: ${error.message}` })
      return
    }
    setRows((data ?? []) as AccessPointRow[])
  }, [authorized, filter])

  useEffect(() => { if (authorized) fetchRows() }, [authorized, fetchRows])

  async function moderate(action: 'verify' | 'reject' | 'needs-review', id: string) {
    setBusyId(id)
    try {
      const res = await fetch('/api/admin/access-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, userEmail, action, id }),
      })
      const data = await res.json()
      if (!res.ok) {
        setBanner({ type: 'error', message: data.error || 'Action failed' })
      } else {
        setBanner({ type: 'success', message: 'Done.' })
        await fetchRows()
      }
    } catch {
      setBanner({ type: 'error', message: 'Network error' })
    } finally {
      setBusyId(null)
    }
  }

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono, color: 'var(--tx3)' }}>Loading...</div>
  }
  if (!authorized) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontFamily: serif, fontSize: '20px', color: 'var(--dg)' }}>Access Denied</div>
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

        {/* Sub-nav */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <Link href="/admin/suggestions" style={navLinkStyle}>River Improvements</Link>
          <Link href="/admin/hazards" style={navLinkStyle}>Hazards</Link>
          <Link href="/admin/permits" style={navLinkStyle}>Permits</Link>
          <Link href="/admin/qa" style={navLinkStyle}>Q&amp;A</Link>
          <span style={navActiveStyle}>Access Points</span>
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
            <button onClick={() => setBanner(null)} style={{ background: 'none', border: 'none', fontSize: '14px', cursor: 'pointer', color: 'inherit' }}>&times;</button>
          </div>
        )}

        <h1 style={{ fontFamily: serif, fontSize: '22px', fontWeight: 700, color: 'var(--rvdk)', marginBottom: '4px' }}>
          Access Points
        </h1>
        <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx3)', marginBottom: '16px' }}>
          {rows.length} {filter}
        </div>

        <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {(['pending', 'needs_review', 'verified', 'rejected'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                fontFamily: mono, fontSize: '10px', padding: '6px 14px', borderRadius: 'var(--r)',
                border: filter === f ? '.5px solid var(--rvmd)' : '.5px solid var(--bd2)',
                background: filter === f ? 'var(--rvlt)' : 'var(--bg)',
                color: filter === f ? 'var(--rvdk)' : 'var(--tx3)',
                cursor: 'pointer',
                fontWeight: filter === f ? 600 : 400,
              }}>
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>

        {rows.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', fontFamily: mono, fontSize: '12px', color: 'var(--tx3)', background: 'var(--bg2)', borderRadius: 'var(--r)' }}>
            No {filter} access points.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {rows.map(r => {
              const busy = busyId === r.id
              const mapsUrl = r.lat != null && r.lng != null
                ? `https://www.google.com/maps?q=${r.lat},${r.lng}&z=15`
                : null
              return (
                <div key={r.id} style={{
                  border: '.5px solid var(--bd)', borderRadius: 'var(--r)',
                  background: 'var(--bg)', padding: '14px 16px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <Link href={`/rivers/all/${r.river_id}`} style={{ color: 'var(--rv)', textDecoration: 'none' }}>
                        {r.river_id}
                      </Link>
                      <span>{r.submitted_by_name ?? 'anonymous'}</span>
                      <span>{timeAgo(r.created_at)}</span>
                      {r.ai_confidence && (
                        <span style={{
                          color: r.ai_confidence === 'high' ? 'var(--rv)'
                              : r.ai_confidence === 'low' ? 'var(--dg)' : 'var(--am)',
                          fontWeight: 600,
                        }}>AI: {r.ai_confidence}</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                      {r.verification_status !== 'verified' && (
                        <button onClick={() => moderate('verify', r.id)} disabled={busy} style={primaryBtnStyle}>
                          Verify
                        </button>
                      )}
                      {r.verification_status === 'verified' && (
                        <button onClick={() => moderate('needs-review', r.id)} disabled={busy} style={smallBtnStyle}>
                          Needs review
                        </button>
                      )}
                      {r.verification_status !== 'rejected' ? (
                        <button onClick={() => moderate('reject', r.id)} disabled={busy} style={dangerBtnStyle}>
                          Reject
                        </button>
                      ) : (
                        <button onClick={() => moderate('verify', r.id)} disabled={busy} style={smallBtnStyle}>
                          Restore
                        </button>
                      )}
                    </div>
                  </div>

                  <div style={{ fontFamily: serif, fontSize: '15px', fontWeight: 600, color: 'var(--tx)', marginBottom: '4px' }}>
                    {r.name}
                  </div>

                  <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', marginBottom: '4px' }}>
                    {[r.access_type, r.ramp_surface, r.trailer_access ? 'trailer' : null, r.parking_capacity].filter(Boolean).join(' · ')}
                    {r.facilities && r.facilities.length > 0 && <> · {r.facilities.join(', ')}</>}
                  </div>

                  {r.description && (
                    <div style={{ fontSize: '12px', color: 'var(--tx)', lineHeight: 1.55, marginBottom: '6px', fontStyle: 'italic' }}>
                      &ldquo;{r.description}&rdquo;
                    </div>
                  )}

                  <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {r.lat != null && r.lng != null && (
                      <>
                        <span>{r.lat.toFixed(5)}, {r.lng.toFixed(5)}</span>
                        {mapsUrl && <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--rv)' }}>view on map →</a>}
                      </>
                    )}
                    {r.river_mile != null && <span>mile {r.river_mile}</span>}
                  </div>

                  {r.ai_reasoning && (
                    <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', marginTop: '6px', padding: '6px 10px', background: 'var(--bg2)', borderRadius: 'var(--r)', lineHeight: 1.55 }}>
                      <strong>AI:</strong> {r.ai_reasoning}
                    </div>
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

const navLinkStyle: React.CSSProperties = {
  fontFamily: mono, fontSize: '11px', padding: '7px 16px', borderRadius: 'var(--r)',
  border: '.5px solid var(--bd2)', background: 'var(--bg)', color: 'var(--tx3)',
  textDecoration: 'none',
}
const navActiveStyle: React.CSSProperties = {
  fontFamily: mono, fontSize: '11px', padding: '7px 16px', borderRadius: 'var(--r)',
  border: '.5px solid var(--rvmd)', background: 'var(--rvlt)', color: 'var(--rvdk)',
  fontWeight: 600,
}
const smallBtnStyle: React.CSSProperties = {
  fontFamily: mono, fontSize: '9px', padding: '5px 10px', borderRadius: 'var(--r)',
  background: 'var(--bg)', color: 'var(--tx2)', border: '.5px solid var(--bd2)',
  cursor: 'pointer',
}
const primaryBtnStyle: React.CSSProperties = {
  fontFamily: mono, fontSize: '9px', padding: '5px 10px', borderRadius: 'var(--r)',
  background: 'var(--rv)', color: '#fff', border: 'none',
  cursor: 'pointer',
}
const dangerBtnStyle: React.CSSProperties = {
  fontFamily: mono, fontSize: '9px', padding: '5px 10px', borderRadius: 'var(--r)',
  background: 'var(--bg)', color: 'var(--dg)', border: '.5px solid var(--dg)',
  cursor: 'pointer',
}
