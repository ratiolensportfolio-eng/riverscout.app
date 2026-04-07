'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { isAdmin } from '@/lib/admin'

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
  created_at: string
}

const fieldLabels: Record<string, string> = {
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

export default function AdminSuggestions() {
  const [userId, setUserId] = useState<string | null>(null)
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const uid = data.user?.id
      setUserId(uid ?? null)
      setAuthorized(isAdmin(uid))
      setLoading(false)
    })
  }, [])

  const fetchSuggestions = useCallback(async () => {
    if (!userId) return
    const res = await fetch(`/api/suggestions?userId=${userId}&status=${filter}`)
    const data = await res.json()
    if (data.suggestions) setSuggestions(data.suggestions)
  }, [userId, filter])

  useEffect(() => {
    if (authorized) fetchSuggestions()
  }, [authorized, fetchSuggestions])

  async function handleAction(suggestionId: string, action: 'approved' | 'rejected') {
    setProcessing(suggestionId)
    await fetch('/api/suggestions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ suggestionId, userId, action }),
    })
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId))
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
        <h1 style={{ fontFamily: serif, fontSize: '22px', fontWeight: 700, color: 'var(--rvdk)', marginBottom: '4px' }}>
          Correction Suggestions
        </h1>
        <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)', marginBottom: '16px' }}>
          {suggestions.length} {filter} suggestion{suggestions.length !== 1 ? 's' : ''}
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

        {suggestions.map(s => (
          <div key={s.id} style={{
            border: '.5px solid var(--bd)', borderRadius: 'var(--rlg)',
            padding: '16px', marginBottom: '12px', background: 'var(--bg2)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <span style={{ fontFamily: serif, fontSize: '15px', fontWeight: 600, color: 'var(--rvdk)' }}>
                  {s.river_name}
                </span>
                <span style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', marginLeft: '8px' }}>
                  {s.state_key.toUpperCase()}
                </span>
              </div>
              <span style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)' }}>
                {new Date(s.created_at).toLocaleDateString()}
              </span>
            </div>

            <div style={{ fontFamily: mono, fontSize: '10px', padding: '3px 8px', borderRadius: '4px', background: 'var(--bg3)', display: 'inline-block', marginBottom: '8px' }}>
              {fieldLabels[s.field] || s.field}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
              <div>
                <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--dg)', textTransform: 'uppercase', marginBottom: '2px' }}>Current</div>
                <div style={{ fontFamily: mono, fontSize: '11px', padding: '6px 8px', background: 'var(--dglt)', borderRadius: '4px', border: '.5px solid var(--dg)' }}>
                  {s.current_value}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--rv)', textTransform: 'uppercase', marginBottom: '2px' }}>Suggested</div>
                <div style={{ fontFamily: mono, fontSize: '11px', padding: '6px 8px', background: 'var(--rvlt)', borderRadius: '4px', border: '.5px solid var(--rvmd)' }}>
                  {s.suggested_value}
                </div>
              </div>
            </div>

            <div style={{ fontSize: '12px', color: 'var(--tx2)', lineHeight: 1.5, marginBottom: '8px' }}>
              <strong>Reason:</strong> {s.reason}
            </div>

            {s.source_url && (
              <div style={{ fontFamily: mono, fontSize: '10px', marginBottom: '8px' }}>
                <a href={s.source_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--rv)' }}>
                  Source: {s.source_url.slice(0, 60)}...
                </a>
              </div>
            )}

            {s.user_email && (
              <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', marginBottom: '8px' }}>
                Submitted by: {s.user_email}
              </div>
            )}

            {filter === 'pending' && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <button onClick={() => handleAction(s.id, 'approved')}
                  disabled={processing === s.id}
                  style={{
                    fontFamily: mono, fontSize: '11px', padding: '6px 16px', borderRadius: 'var(--r)',
                    background: 'var(--rv)', color: '#fff', border: 'none', cursor: 'pointer',
                    opacity: processing === s.id ? 0.6 : 1,
                  }}>
                  {processing === s.id ? '...' : 'Approve'}
                </button>
                <button onClick={() => handleAction(s.id, 'rejected')}
                  disabled={processing === s.id}
                  style={{
                    fontFamily: mono, fontSize: '11px', padding: '6px 16px', borderRadius: 'var(--r)',
                    background: 'var(--bg)', color: 'var(--dg)', border: '.5px solid var(--dg)', cursor: 'pointer',
                    opacity: processing === s.id ? 0.6 : 1,
                  }}>
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}
