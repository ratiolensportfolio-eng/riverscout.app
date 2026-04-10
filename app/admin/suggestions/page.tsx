'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { isAdmin } from '@/lib/admin'
import FishIcon from '@/components/icons/FishIcons'

const mono = "'IBM Plex Mono', monospace"
const serif = "'Playfair Display', serif"

interface Suggestion {
  id: string
  river_id: string
  river_name: string
  state_key: string
  user_email: string | null
  field: string
  current_value: string
  suggested_value: string
  reason: string
  source_url: string | null
  status: string
  admin_notes: string | null
  ai_confidence: 'high' | 'medium' | 'low' | null
  ai_reasoning: string | null
  ai_category: string | null
  created_at: string
  reviewed_at: string | null
}

interface Banner {
  type: 'success' | 'error'
  message: string
  suggestionId: string
}

const fieldLabels: Record<string, string> = {
  safe_cfs: '\u26A0 Safe CFS Limit (Safety Critical)',
  permit_update: '\u26A0 Permit Update (High Priority)',
  cls: 'Whitewater Class',
  opt: 'Optimal CFS',
  len: 'River Length',
  desc: 'Description',
  desig: 'Designations',
  species: 'Fish Species',
  hatches: 'Hatch Calendar',
  runs: 'Run Timing',
  spawning: 'Spawn Timing',
  access_points: 'Access Points',
  sections: 'Sections',
  gauge: 'USGS Gauge',
  outfitters: 'Outfitters',
  history: 'History',
  other: 'Other',
}

interface StockingReport {
  id: string
  river_id: string
  state_key: string
  stocking_date: string
  is_scheduled: boolean
  species: string
  quantity: number | null
  size_category: string | null
  size_inches: number | null
  location_description: string | null
  stocking_authority: string | null
  source_url: string | null
  verified: boolean
  created_at: string
}

export default function AdminSuggestions() {
  const [userId, setUserId] = useState<string | null>(null)
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [adminTab, setAdminTab] = useState<'suggestions' | 'stocking'>('suggestions')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const [processing, setProcessing] = useState<string | null>(null)
  const [banner, setBanner] = useState<Banner | null>(null)
  const [failedIds, setFailedIds] = useState<Set<string>>(new Set())
  const [rollbackConfirm, setRollbackConfirm] = useState<Suggestion | null>(null)

  // Stocking review state
  const [stockingReports, setStockingReports] = useState<StockingReport[]>([])
  const [stockingFilter, setStockingFilter] = useState<'unverified' | 'verified'>('unverified')
  const [stockingProcessing, setStockingProcessing] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const uid = data.user?.id
      setUserId(uid ?? null)
      setAuthorized(isAdmin(uid, data.user?.email))
      setLoading(false)
    })
  }, [])

  const fetchSuggestions = useCallback(async () => {
    if (!userId) return
    const res = await fetch(`/api/suggestions?userId=${userId}&status=${filter}`)
    const data = await res.json()
    if (data.suggestions) {
      // Three-tier sort: safety_critical first, permit_update second,
      // everything else third. Within each tier, newest first.
      const rank = (s: Suggestion): number => {
        if (s.ai_category === 'safety_critical') return 0
        if (s.ai_category === 'permit_update') return 1
        return 2
      }
      const sorted = [...data.suggestions].sort((a: Suggestion, b: Suggestion) => {
        const r = rank(a) - rank(b)
        if (r !== 0) return r
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })
      setSuggestions(sorted)
    }
  }, [userId, filter])

  useEffect(() => {
    if (authorized) fetchSuggestions()
  }, [authorized, fetchSuggestions])

  const fetchStocking = useCallback(async () => {
    if (!userId) return
    const res = await fetch(`/api/admin/stocking?userId=${userId}&status=${stockingFilter}`)
    const data = await res.json()
    if (data.reports) setStockingReports(data.reports)
  }, [userId, stockingFilter])

  useEffect(() => {
    if (authorized && adminTab === 'stocking') fetchStocking()
  }, [authorized, adminTab, fetchStocking])

  async function handleStockingAction(reportId: string, action: 'verify' | 'reject') {
    setStockingProcessing(reportId)
    setBanner(null)
    try {
      const res = await fetch('/api/admin/stocking', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, userId, action }),
      })
      const data = await res.json()
      if (data.ok) {
        setStockingReports(prev => prev.filter(r => r.id !== reportId))
        setBanner({
          type: 'success',
          message: action === 'verify' ? 'Stocking report verified and published' : 'Stocking report rejected',
          suggestionId: reportId,
        })
      } else {
        setBanner({ type: 'error', message: data.error || 'Action failed', suggestionId: reportId })
      }
    } catch {
      setBanner({ type: 'error', message: 'Network error', suggestionId: reportId })
    }
    setStockingProcessing(null)
  }

  // Clear banner after 8 seconds
  useEffect(() => {
    if (banner) {
      const t = setTimeout(() => setBanner(null), 8000)
      return () => clearTimeout(t)
    }
  }, [banner])

  async function handleAction(suggestionId: string, action: 'approved' | 'rejected') {
    const suggestion = suggestions.find(s => s.id === suggestionId)
    if (!suggestion) return

    setProcessing(suggestionId)
    setBanner(null)

    try {
      const res = await fetch('/api/suggestions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suggestionId, userId, action }),
      })
      const data = await res.json()

      if (data.ok) {
        // Success
        setSuggestions(prev => prev.filter(s => s.id !== suggestionId))
        setFailedIds(prev => { const next = new Set(prev); next.delete(suggestionId); return next })

        if (action === 'approved') {
          setBanner({
            type: 'success',
            message: `Change deployed — ${suggestion.river_name} ${fieldLabels[suggestion.field] || suggestion.field} updated`,
            suggestionId,
          })
        }
      } else {
        // Failure
        setFailedIds(prev => new Set(prev).add(suggestionId))
        setBanner({
          type: 'error',
          message: data.error || `Failed to ${action} suggestion`,
          suggestionId,
        })
      }
    } catch (err) {
      setFailedIds(prev => new Set(prev).add(suggestionId))
      setBanner({
        type: 'error',
        message: `Network error — could not ${action} suggestion`,
        suggestionId,
      })
    }

    setProcessing(null)
  }

  async function handleRollback(suggestion: Suggestion) {
    setRollbackConfirm(null)
    setProcessing(suggestion.id)
    setBanner(null)

    try {
      const res = await fetch('/api/suggestions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suggestionId: suggestion.id, userId, action: 'rollback' }),
      })
      const data = await res.json()

      if (data.ok) {
        setSuggestions(prev => prev.filter(s => s.id !== suggestion.id))
        setBanner({
          type: 'success',
          message: `Rolled back — ${suggestion.river_name} ${fieldLabels[suggestion.field] || suggestion.field} reverted to previous value`,
          suggestionId: suggestion.id,
        })
      } else {
        setBanner({
          type: 'error',
          message: data.error || 'Rollback failed',
          suggestionId: suggestion.id,
        })
      }
    } catch {
      setBanner({
        type: 'error',
        message: 'Network error — rollback failed',
        suggestionId: suggestion.id,
      })
    }

    setProcessing(null)
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
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', height: '44px', borderBottom: '.5px solid var(--bd)',
      }}>
        <Link href="/" style={{ fontFamily: serif, fontSize: '18px', fontWeight: 700, color: 'var(--rvdk)', letterSpacing: '-.3px', textDecoration: 'none' }}>
          River<span style={{ color: 'var(--wt)' }}>Scout</span>
        </Link>
        <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--dg)', padding: '5px 10px', borderRadius: '20px', border: '.5px solid var(--dg)', background: 'var(--dglt)' }}>
          Admin
        </span>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px 28px' }}>
        {/* Banner */}
        {banner && (
          <div style={{
            padding: '12px 16px', borderRadius: 'var(--r)', marginBottom: '16px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: banner.type === 'success' ? 'var(--rvlt)' : 'var(--dglt)',
            border: `.5px solid ${banner.type === 'success' ? 'var(--rvmd)' : 'var(--dg)'}`,
            color: banner.type === 'success' ? 'var(--rvdk)' : 'var(--dg)',
          }}>
            <div style={{ fontFamily: mono, fontSize: '12px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>{banner.type === 'success' ? '\u2713' : '\u26A0'}</span>
              {banner.message}
            </div>
            <button onClick={() => setBanner(null)} style={{
              background: 'none', border: 'none', fontSize: '14px', cursor: 'pointer',
              color: banner.type === 'success' ? 'var(--rv)' : 'var(--dg)',
            }}>&times;</button>
          </div>
        )}

        {/* Top-level admin tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {(['suggestions', 'stocking'] as const).map(t => (
            <button key={t} onClick={() => setAdminTab(t)} style={{
              fontFamily: mono, fontSize: '11px', padding: '7px 16px', borderRadius: 'var(--r)', cursor: 'pointer',
              border: adminTab === t ? '.5px solid var(--rvmd)' : '.5px solid var(--bd2)',
              background: adminTab === t ? 'var(--rvlt)' : 'var(--bg)',
              color: adminTab === t ? 'var(--rvdk)' : 'var(--tx3)',
              fontWeight: adminTab === t ? 600 : 400,
            }}>
              {t === 'suggestions' ? 'River Improvements' : 'Stocking Reports'}
            </button>
          ))}
          {/* Hazards and Permits live on their own pages, not as tabs
              here, because the data models and actions don't overlap
              with suggestions/stocking. */}
          <Link href="/admin/hazards" style={{
            fontFamily: mono, fontSize: '11px', padding: '7px 16px', borderRadius: 'var(--r)',
            border: '.5px solid var(--bd2)', background: 'var(--bg)', color: 'var(--tx3)',
            textDecoration: 'none',
          }}>
            Hazards
          </Link>
          <Link href="/admin/permits" style={{
            fontFamily: mono, fontSize: '11px', padding: '7px 16px', borderRadius: 'var(--r)',
            border: '.5px solid var(--bd2)', background: 'var(--bg)', color: 'var(--tx3)',
            textDecoration: 'none',
          }}>
            Permits
          </Link>
        </div>

        {adminTab === 'suggestions' && (<>
        <h1 style={{ fontFamily: serif, fontSize: '22px', fontWeight: 700, color: 'var(--rvdk)', marginBottom: '4px' }}>
          River Improvements
        </h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)' }}>
            {suggestions.length} {filter} suggestion{suggestions.length !== 1 ? 's' : ''}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href="/admin/changes" style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', textDecoration: 'none' }}>
              Change Log
            </Link>
            <Link href="/about/improvements" style={{ fontFamily: mono, fontSize: '10px', color: 'var(--rv)', textDecoration: 'none' }}>
              Public log &rarr;
            </Link>
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
          {(['pending', 'approved', 'rejected'] as const).map(s => (
            <button key={s} onClick={() => setFilter(s)}
              style={{
                fontFamily: mono, fontSize: '10px', padding: '5px 12px', borderRadius: '12px', cursor: 'pointer',
                border: filter === s ? '.5px solid var(--rvmd)' : '.5px solid var(--bd2)',
                background: filter === s ? 'var(--rvlt)' : 'var(--bg)',
                color: filter === s ? 'var(--rvdk)' : 'var(--tx3)',
                textTransform: 'capitalize',
              }}>
              {s}
            </button>
          ))}
        </div>

        {/* Suggestions list */}
        {suggestions.length === 0 && (
          <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx3)', padding: '40px 0', textAlign: 'center' }}>
            No {filter} suggestions
          </div>
        )}

        {suggestions.map(s => {
          const isProcessing = processing === s.id
          const hasFailed = failedIds.has(s.id)
          const isSafety = s.ai_category === 'safety_critical'
          const isPermitUpdate = s.ai_category === 'permit_update'

          return (
            <div key={s.id} style={{
              border: isSafety
                ? '2px solid var(--dg)'
                : isPermitUpdate
                  ? '2px solid var(--am)'
                  : hasFailed ? '1px solid var(--dg)' : '.5px solid var(--bd)',
              borderRadius: 'var(--rlg)',
              padding: '16px', marginBottom: '12px',
              background: isSafety && filter === 'pending'
                ? 'var(--dglt)'
                : isPermitUpdate && filter === 'pending'
                  ? 'var(--amlt)'
                  : filter === 'approved' ? 'var(--rvlt)' : filter === 'rejected' ? 'var(--bg3)' : 'var(--bg2)',
            }}>
              {/* Safety-critical banner */}
              {isSafety && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontFamily: mono, fontSize: '10px', fontWeight: 500, color: 'var(--dg)',
                  padding: '6px 10px', marginBottom: '10px', borderRadius: 'var(--r)',
                  background: 'rgba(163,45,45,.1)', border: '.5px solid var(--dg)',
                  letterSpacing: '.3px', textTransform: 'uppercase',
                }}>
                  <span style={{ fontSize: '13px' }}>&#9888;</span>
                  Safety Critical — Review Immediately
                </div>
              )}
              {/* Permit-update banner */}
              {isPermitUpdate && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontFamily: mono, fontSize: '10px', fontWeight: 500, color: '#7A4D0E',
                  padding: '6px 10px', marginBottom: '10px', borderRadius: 'var(--r)',
                  background: 'rgba(186,117,23,.1)', border: '.5px solid var(--am)',
                  letterSpacing: '.3px', textTransform: 'uppercase',
                }}>
                  <span style={{ fontSize: '13px' }}>&#9888;</span>
                  Permit Update — Verify Quickly &middot; <a href="/admin/permits" style={{ color: '#7A4D0E', textDecoration: 'underline' }}>Open /admin/permits</a>
                </div>
              )}
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <span style={{ fontFamily: serif, fontSize: '15px', fontWeight: 600, color: isSafety ? 'var(--dg)' : 'var(--rvdk)' }}>
                    {s.river_name}
                  </span>
                  <span style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', marginLeft: '8px' }}>
                    {s.state_key.toUpperCase()}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {filter !== 'pending' && (
                    <span style={{
                      fontFamily: mono, fontSize: '9px', padding: '2px 8px', borderRadius: '8px',
                      background: filter === 'approved' ? 'var(--rv)' : 'var(--dg)',
                      color: '#fff', textTransform: 'uppercase',
                    }}>
                      {filter}
                    </span>
                  )}
                  <span style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)' }}>
                    {new Date(s.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Field badge */}
              <div style={{ fontFamily: mono, fontSize: '10px', padding: '3px 8px', borderRadius: '4px', background: 'var(--bg3)', display: 'inline-block', marginBottom: '8px' }}>
                {fieldLabels[s.field] || s.field}
              </div>

              {/* Values side by side */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontFamily: mono, fontSize: '9px', color: filter === 'approved' ? 'var(--tx3)' : 'var(--dg)', textTransform: 'uppercase', marginBottom: '2px' }}>
                    {filter === 'approved' ? 'Previous' : 'Current'}
                  </div>
                  <div style={{
                    fontFamily: mono, fontSize: '11px', padding: '6px 8px', borderRadius: '4px',
                    background: filter === 'approved' ? 'var(--bg2)' : 'var(--dglt)',
                    border: `.5px solid ${filter === 'approved' ? 'var(--bd)' : 'var(--dg)'}`,
                    textDecoration: filter === 'approved' ? 'line-through' : 'none',
                    color: filter === 'approved' ? 'var(--tx3)' : 'var(--tx)',
                  }}>
                    {s.current_value}
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--rv)', textTransform: 'uppercase', marginBottom: '2px' }}>
                    {filter === 'approved' ? 'Updated To' : 'Suggested'}
                  </div>
                  <div style={{
                    fontFamily: mono, fontSize: '11px', padding: '6px 8px', borderRadius: '4px',
                    background: 'var(--rvlt)', border: '.5px solid var(--rvmd)',
                    fontWeight: filter === 'approved' ? 600 : 400,
                  }}>
                    {s.suggested_value}
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div style={{ fontSize: '12px', color: 'var(--tx2)', lineHeight: 1.5, marginBottom: '8px' }}>
                <strong>Reason:</strong> {s.reason}
              </div>

              {/* Source URL */}
              {s.source_url && (
                <div style={{ fontFamily: mono, fontSize: '10px', marginBottom: '8px' }}>
                  <a href={s.source_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--rv)' }}>
                    Source: {s.source_url.length > 60 ? s.source_url.slice(0, 60) + '...' : s.source_url}
                  </a>
                </div>
              )}

              {/* Submitter */}
              {s.user_email && (
                <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', marginBottom: '8px' }}>
                  Submitted by: {s.user_email}
                </div>
              )}

              {/* AI Assessment */}
              {s.ai_confidence && (
                <div style={{
                  marginBottom: '12px', padding: '10px 12px', borderRadius: 'var(--r)',
                  background: s.ai_confidence === 'high' ? 'var(--rvlt)' : s.ai_confidence === 'low' ? 'var(--dglt)' : 'var(--amlt)',
                  border: `.5px solid ${s.ai_confidence === 'high' ? 'var(--rvmd)' : s.ai_confidence === 'low' ? 'var(--dg)' : 'var(--am)'}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span style={{
                      fontFamily: mono, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '.5px',
                      color: s.ai_confidence === 'high' ? 'var(--rv)' : s.ai_confidence === 'low' ? 'var(--dg)' : 'var(--am)',
                    }}>
                      AI Assessment &middot; {s.ai_confidence} confidence
                    </span>
                  </div>
                  <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx)', lineHeight: 1.5 }}>
                    {s.ai_reasoning}
                  </div>
                </div>
              )}

              {/* Error flag for failed deployments */}
              {hasFailed && filter === 'pending' && (
                <div style={{
                  fontFamily: mono, fontSize: '10px', color: 'var(--dg)', padding: '8px 10px',
                  background: 'var(--dglt)', border: '.5px solid var(--dg)', borderRadius: 'var(--r)',
                  marginBottom: '8px',
                }}>
                  Deployment failed — see error above
                </div>
              )}

              {/* Action buttons */}
              {filter === 'pending' && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button onClick={() => handleAction(s.id, 'approved')}
                    disabled={isProcessing}
                    style={{
                      fontFamily: mono, fontSize: '11px', padding: '8px 20px', borderRadius: 'var(--r)',
                      background: 'var(--rv)', color: '#fff', border: 'none', cursor: isProcessing ? 'wait' : 'pointer',
                      opacity: isProcessing ? 0.6 : 1,
                      display: 'flex', alignItems: 'center', gap: '6px',
                    }}>
                    {isProcessing ? (
                      <>
                        <span style={{ display: 'inline-block', width: 12, height: 12, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                        Deploying...
                      </>
                    ) : hasFailed ? 'Retry Deployment' : 'Approve & Deploy'}
                  </button>
                  <button onClick={() => handleAction(s.id, 'rejected')}
                    disabled={isProcessing}
                    style={{
                      fontFamily: mono, fontSize: '11px', padding: '8px 20px', borderRadius: 'var(--r)',
                      background: 'var(--bg)', color: 'var(--dg)', border: '.5px solid var(--dg)', cursor: isProcessing ? 'wait' : 'pointer',
                      opacity: isProcessing ? 0.6 : 1,
                    }}>
                    Reject
                  </button>
                </div>
              )}

              {/* Approved metadata + rollback */}
              {filter === 'approved' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                  {s.reviewed_at && (
                    <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--rv)' }}>
                      Deployed {new Date(s.reviewed_at).toLocaleDateString()} {new Date(s.reviewed_at).toLocaleTimeString()}
                    </div>
                  )}
                  <button onClick={() => setRollbackConfirm(s)}
                    disabled={processing === s.id}
                    style={{
                      fontFamily: mono, fontSize: '10px', padding: '5px 14px', borderRadius: 'var(--r)',
                      background: 'var(--bg)', color: 'var(--dg)', border: '.5px solid var(--dg)',
                      cursor: processing === s.id ? 'wait' : 'pointer',
                      opacity: processing === s.id ? 0.6 : 1,
                    }}>
                    {processing === s.id ? 'Rolling back...' : 'Rollback'}
                  </button>
                </div>
              )}
            </div>
          )
        })}
        </>
        )}

        {/* ── Stocking Reports Tab ─────────────────────── */}
        {adminTab === 'stocking' && (
          <div>
          <h1 style={{ fontFamily: serif, fontSize: '22px', fontWeight: 700, color: 'var(--rvdk)', marginBottom: '4px' }}>
            Stocking Reports
          </h1>
          <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)', marginBottom: '16px' }}>
            {stockingReports.length} {stockingFilter} report{stockingReports.length !== 1 ? 's' : ''}
          </div>

          <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
            {(['unverified', 'verified'] as const).map(s => (
              <button key={s} onClick={() => setStockingFilter(s)} style={{
                fontFamily: mono, fontSize: '10px', padding: '5px 12px', borderRadius: '12px', cursor: 'pointer',
                border: stockingFilter === s ? '.5px solid var(--rvmd)' : '.5px solid var(--bd2)',
                background: stockingFilter === s ? 'var(--rvlt)' : 'var(--bg)',
                color: stockingFilter === s ? 'var(--rvdk)' : 'var(--tx3)',
                textTransform: 'capitalize',
              }}>
                {s}
              </button>
            ))}
          </div>

          {stockingReports.length === 0 && (
            <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx3)', padding: '40px 0', textAlign: 'center' }}>
              No {stockingFilter} stocking reports
            </div>
          )}

          {stockingReports.map(r => {
            const isProcessing = stockingProcessing === r.id
            const d = new Date(r.stocking_date + 'T00:00:00')
            const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            const isGov = r.source_url && (/\.gov(\/|$)/.test(r.source_url) || /\.state\.\w+\.us/.test(r.source_url))

            return (
              <div key={r.id} style={{
                border: isGov ? '.5px solid var(--rvmd)' : '.5px solid var(--bd)',
                borderRadius: 'var(--rlg)', padding: '16px', marginBottom: '12px',
                background: isGov ? 'var(--rvlt)' : 'var(--bg2)',
              }}>
                {isGov && (
                  <div style={{
                    fontFamily: mono, fontSize: '9px', color: 'var(--rv)', marginBottom: '8px',
                    padding: '3px 8px', background: 'var(--rvlt)', border: '.5px solid var(--rvmd)',
                    borderRadius: '4px', display: 'inline-block', letterSpacing: '.3px',
                  }}>
                    &#10003; Official .gov source — auto-verify recommended
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <span style={{ fontFamily: serif, fontSize: '15px', fontWeight: 600, color: 'var(--rvdk)' }}>
                      {r.river_id}
                    </span>
                    <span style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', marginLeft: '8px' }}>
                      {r.state_key.toUpperCase()}
                    </span>
                  </div>
                  <span style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)' }}>
                    {new Date(r.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', marginBottom: '2px' }}>Species</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: serif, fontSize: '14px', fontWeight: 600 }}>
                      <FishIcon species={r.species} size={18} color="var(--wt)" />
                      {r.species}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', marginBottom: '2px' }}>Date</div>
                    <div style={{ fontFamily: mono, fontSize: '12px' }}>
                      {dateStr}
                      {r.is_scheduled && <span style={{ color: 'var(--am)', marginLeft: '6px' }}>(Scheduled)</span>}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', marginBottom: '2px' }}>Quantity</div>
                    <div style={{ fontFamily: mono, fontSize: '12px' }}>
                      {r.quantity ? r.quantity.toLocaleString() : 'Unknown'}
                      {r.size_category && <span style={{ color: 'var(--wt)', marginLeft: '6px' }}>({r.size_category})</span>}
                    </div>
                  </div>
                  {r.stocking_authority && (
                    <div>
                      <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', marginBottom: '2px' }}>Authority</div>
                      <div style={{ fontFamily: mono, fontSize: '12px' }}>{r.stocking_authority}</div>
                    </div>
                  )}
                </div>

                {r.location_description && (
                  <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx2)', marginBottom: '8px' }}>
                    Location: {r.location_description}
                  </div>
                )}

                {r.source_url && (
                  <div style={{ fontFamily: mono, fontSize: '10px', marginBottom: '10px' }}>
                    <a href={r.source_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--rv)' }}>
                      Source: {r.source_url.length > 60 ? r.source_url.slice(0, 60) + '...' : r.source_url}
                    </a>
                  </div>
                )}

                {stockingFilter === 'unverified' && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <button onClick={() => handleStockingAction(r.id, 'verify')}
                      disabled={isProcessing}
                      style={{
                        fontFamily: mono, fontSize: '11px', padding: '8px 20px', borderRadius: 'var(--r)',
                        background: 'var(--rv)', color: '#fff', border: 'none',
                        cursor: isProcessing ? 'wait' : 'pointer', opacity: isProcessing ? 0.6 : 1,
                      }}>
                      {isProcessing ? 'Processing...' : 'Verify & Publish'}
                    </button>
                    <button onClick={() => handleStockingAction(r.id, 'reject')}
                      disabled={isProcessing}
                      style={{
                        fontFamily: mono, fontSize: '11px', padding: '8px 20px', borderRadius: 'var(--r)',
                        background: 'var(--bg)', color: 'var(--dg)', border: '.5px solid var(--dg)',
                        cursor: isProcessing ? 'wait' : 'pointer', opacity: isProcessing ? 0.6 : 1,
                      }}>
                      Reject
                    </button>
                  </div>
                )}

                {stockingFilter === 'verified' && (
                  <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--rv)', marginTop: '8px' }}>
                    &#10003; Verified and published
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Rollback confirmation dialog */}
      {rollbackConfirm && (
        <div onClick={() => setRollbackConfirm(null)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)',
          zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: 'var(--bg)', borderRadius: 'var(--rlg)', padding: '24px',
            maxWidth: '440px', width: '90%', boxShadow: '0 8px 40px rgba(0,0,0,.25)',
          }}>
            <div style={{ fontFamily: serif, fontSize: '18px', fontWeight: 700, color: 'var(--dg)', marginBottom: '12px' }}>
              Confirm Rollback
            </div>
            <div style={{ fontSize: '13px', color: 'var(--tx)', lineHeight: 1.6, marginBottom: '16px' }}>
              This will revert <strong>{fieldLabels[rollbackConfirm.field] || rollbackConfirm.field}</strong> on <strong>{rollbackConfirm.river_name}</strong> from
              &ldquo;{rollbackConfirm.suggested_value}&rdquo; back to &ldquo;{rollbackConfirm.current_value}&rdquo;.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
              <div>
                <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--rv)', textTransform: 'uppercase', marginBottom: '2px' }}>Will revert from</div>
                <div style={{ fontFamily: mono, fontSize: '11px', padding: '6px 8px', background: 'var(--dglt)', borderRadius: '4px', border: '.5px solid var(--dg)', textDecoration: 'line-through' }}>
                  {rollbackConfirm.suggested_value}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--rv)', textTransform: 'uppercase', marginBottom: '2px' }}>Will restore to</div>
                <div style={{ fontFamily: mono, fontSize: '11px', padding: '6px 8px', background: 'var(--rvlt)', borderRadius: '4px', border: '.5px solid var(--rvmd)', fontWeight: 600 }}>
                  {rollbackConfirm.current_value}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setRollbackConfirm(null)}
                style={{
                  flex: 1, padding: '10px', fontFamily: mono, fontSize: '12px',
                  background: 'var(--bg)', color: 'var(--tx2)', border: '.5px solid var(--bd2)',
                  borderRadius: 'var(--r)', cursor: 'pointer',
                }}>
                Cancel
              </button>
              <button onClick={() => handleRollback(rollbackConfirm)}
                style={{
                  flex: 1, padding: '10px', fontFamily: mono, fontSize: '12px', fontWeight: 500,
                  background: 'var(--dg)', color: '#fff', border: 'none',
                  borderRadius: 'var(--r)', cursor: 'pointer',
                }}>
                Yes, Rollback
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Spinner animation */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </main>
  )
}
