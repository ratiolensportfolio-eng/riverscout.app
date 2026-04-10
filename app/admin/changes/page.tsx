'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { isAdmin } from '@/lib/admin'

const mono = "'IBM Plex Mono', monospace"
const serif = "'Playfair Display', serif"

interface ChangeEntry {
  id: string
  river_id: string
  river_name: string
  state_key: string
  field: string
  current_value: string
  suggested_value: string
  user_email: string | null
  status: string
  reviewed_at: string | null
  created_at: string
}

const fieldLabels: Record<string, string> = {
  cls: 'Whitewater Class', opt: 'Optimal CFS', len: 'River Length',
  desc: 'Description', desig: 'Designations', species: 'Fish Species',
  hatches: 'Hatch Calendar', runs: 'Run Timing', spawning: 'Spawn Timing',
  access_points: 'Access Points', sections: 'Sections', gauge: 'USGS Gauge',
  outfitters: 'Outfitters', history: 'History', other: 'Other',
}

export default function AdminChanges() {
  const [userId, setUserId] = useState<string | null>(null)
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [changes, setChanges] = useState<ChangeEntry[]>([])
  const [processing, setProcessing] = useState<string | null>(null)
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Filters
  const [filterRiver, setFilterRiver] = useState('')
  const [filterState, setFilterState] = useState('')
  const [filterField, setFilterField] = useState('')
  const [filterDateFrom, setFilterDateFrom] = useState('')
  const [filterDateTo, setFilterDateTo] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const uid = data.user?.id
      setUserId(uid ?? null)
      setAuthorized(isAdmin(uid, data.user?.email))
      setLoading(false)
    })
  }, [])

  const fetchChanges = useCallback(async () => {
    if (!userId) return
    const res = await fetch(`/api/admin/changes?userId=${userId}`)
    const data = await res.json()
    if (data.changes) setChanges(data.changes)
  }, [userId])

  useEffect(() => {
    if (authorized) fetchChanges()
  }, [authorized, fetchChanges])

  useEffect(() => {
    if (banner) {
      const t = setTimeout(() => setBanner(null), 6000)
      return () => clearTimeout(t)
    }
  }, [banner])

  // Apply filters
  const filtered = changes.filter(c => {
    if (filterRiver && !c.river_name.toLowerCase().includes(filterRiver.toLowerCase())) return false
    if (filterState && c.state_key !== filterState) return false
    if (filterField && c.field !== filterField) return false
    if (filterDateFrom && c.reviewed_at && c.reviewed_at < filterDateFrom) return false
    if (filterDateTo && c.reviewed_at && c.reviewed_at > filterDateTo + 'T23:59:59') return false
    return true
  })

  // Unique states and fields from data
  const states = [...new Set(changes.map(c => c.state_key))].sort()
  const fields = [...new Set(changes.map(c => c.field))].sort()

  // Export to CSV
  function exportCSV() {
    const headers = ['River', 'State', 'Field', 'Previous Value', 'New Value', 'Changed By', 'Status', 'Date']
    const rows = filtered.map(c => [
      c.river_name,
      c.state_key.toUpperCase(),
      fieldLabels[c.field] || c.field,
      `"${c.current_value.replace(/"/g, '""')}"`,
      `"${c.suggested_value.replace(/"/g, '""')}"`,
      c.user_email || 'anonymous',
      c.status,
      c.reviewed_at ? new Date(c.reviewed_at).toISOString() : '',
    ])
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `riverscout-changes-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Rollback
  async function handleRollback(change: ChangeEntry) {
    if (!confirm(`Rollback ${fieldLabels[change.field] || change.field} on ${change.river_name} from "${change.suggested_value}" back to "${change.current_value}"?`)) return

    setProcessing(change.id)
    try {
      const res = await fetch('/api/suggestions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suggestionId: change.id, userId, action: 'rollback' }),
      })
      const data = await res.json()
      if (data.ok) {
        setChanges(prev => prev.filter(c => c.id !== change.id))
        setBanner({ type: 'success', message: `Rolled back ${change.river_name} ${fieldLabels[change.field] || change.field}` })
      } else {
        setBanner({ type: 'error', message: data.error || 'Rollback failed' })
      }
    } catch {
      setBanner({ type: 'error', message: 'Network error' })
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
        <Link href="/login" style={{ fontFamily: mono, fontSize: '11px', color: 'var(--rv)', marginTop: '8px' }}>Sign in</Link>
      </div>
    )
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--tx)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px 28px' }}>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', alignItems: 'center' }}>
          <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--dg)', padding: '5px 10px', borderRadius: '20px', border: '.5px solid var(--dg)', background: 'var(--dglt)' }}>
            Admin
          </span>
          <Link href="/admin/suggestions" style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', textDecoration: 'none', padding: '5px 10px', borderRadius: '20px', border: '.5px solid var(--bd2)' }}>
            Suggestions
          </Link>
          <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--dg)', padding: '5px 10px', borderRadius: '20px', border: '.5px solid var(--dg)', background: 'var(--dglt)' }}>
            Change Log
          </span>
        </div>
        {/* Banner */}
        {banner && (
          <div style={{
            padding: '10px 14px', borderRadius: 'var(--r)', marginBottom: '14px',
            background: banner.type === 'success' ? 'var(--rvlt)' : 'var(--dglt)',
            border: `.5px solid ${banner.type === 'success' ? 'var(--rvmd)' : 'var(--dg)'}`,
            fontFamily: mono, fontSize: '11px', color: banner.type === 'success' ? 'var(--rvdk)' : 'var(--dg)',
          }}>
            {banner.message}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontFamily: serif, fontSize: '22px', fontWeight: 700, color: 'var(--rvdk)', marginBottom: '4px' }}>
              Change Log
            </h1>
            <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)' }}>
              {filtered.length} change{filtered.length !== 1 ? 's' : ''} {filterRiver || filterState || filterField ? '(filtered)' : ''}
            </div>
          </div>
          <button onClick={exportCSV} style={{
            fontFamily: mono, fontSize: '10px', padding: '6px 14px', borderRadius: 'var(--r)',
            border: '.5px solid var(--bd2)', background: 'var(--bg)', color: 'var(--tx2)', cursor: 'pointer',
          }}>
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <input type="text" placeholder="Filter by river..." value={filterRiver} onChange={e => setFilterRiver(e.target.value)}
            style={{ fontFamily: mono, fontSize: '11px', padding: '6px 10px', border: '.5px solid var(--bd2)', borderRadius: 'var(--r)', background: 'var(--bg)', color: 'var(--tx)', width: '160px' }} />
          <select value={filterState} onChange={e => setFilterState(e.target.value)}
            style={{ fontFamily: mono, fontSize: '11px', padding: '6px 10px', border: '.5px solid var(--bd2)', borderRadius: 'var(--r)', background: 'var(--bg)', color: 'var(--tx)' }}>
            <option value="">All states</option>
            {states.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
          </select>
          <select value={filterField} onChange={e => setFilterField(e.target.value)}
            style={{ fontFamily: mono, fontSize: '11px', padding: '6px 10px', border: '.5px solid var(--bd2)', borderRadius: 'var(--r)', background: 'var(--bg)', color: 'var(--tx)' }}>
            <option value="">All fields</option>
            {fields.map(f => <option key={f} value={f}>{fieldLabels[f] || f}</option>)}
          </select>
          <input type="date" value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)}
            style={{ fontFamily: mono, fontSize: '11px', padding: '6px 10px', border: '.5px solid var(--bd2)', borderRadius: 'var(--r)', background: 'var(--bg)', color: 'var(--tx)' }} />
          <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)', alignSelf: 'center' }}>to</span>
          <input type="date" value={filterDateTo} onChange={e => setFilterDateTo(e.target.value)}
            style={{ fontFamily: mono, fontSize: '11px', padding: '6px 10px', border: '.5px solid var(--bd2)', borderRadius: 'var(--r)', background: 'var(--bg)', color: 'var(--tx)' }} />
          {(filterRiver || filterState || filterField || filterDateFrom || filterDateTo) && (
            <button onClick={() => { setFilterRiver(''); setFilterState(''); setFilterField(''); setFilterDateFrom(''); setFilterDateTo('') }}
              style={{ fontFamily: mono, fontSize: '10px', color: 'var(--dg)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
              Clear
            </button>
          )}
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: mono, fontSize: '11px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--bd)' }}>
                <th style={{ textAlign: 'left', padding: '8px 6px', color: 'var(--tx3)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '.5px' }}>River</th>
                <th style={{ textAlign: 'left', padding: '8px 6px', color: 'var(--tx3)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '.5px' }}>State</th>
                <th style={{ textAlign: 'left', padding: '8px 6px', color: 'var(--tx3)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '.5px' }}>Field</th>
                <th style={{ textAlign: 'left', padding: '8px 6px', color: 'var(--tx3)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '.5px' }}>Previous</th>
                <th style={{ textAlign: 'left', padding: '8px 6px', color: 'var(--tx3)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '.5px' }}>New Value</th>
                <th style={{ textAlign: 'left', padding: '8px 6px', color: 'var(--tx3)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '.5px' }}>By</th>
                <th style={{ textAlign: 'left', padding: '8px 6px', color: 'var(--tx3)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '.5px' }}>Date</th>
                <th style={{ textAlign: 'right', padding: '8px 6px', color: 'var(--tx3)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '.5px' }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ padding: '30px', textAlign: 'center', color: 'var(--tx3)' }}>No changes found</td></tr>
              )}
              {filtered.map((c, i) => (
                <tr key={c.id} style={{ borderBottom: '.5px solid var(--bd)', background: i % 2 === 0 ? 'var(--bg)' : 'var(--bg2)' }}>
                  <td style={{ padding: '8px 6px', fontWeight: 500 }}>{c.river_name}</td>
                  <td style={{ padding: '8px 6px', color: 'var(--tx3)' }}>{c.state_key.toUpperCase()}</td>
                  <td style={{ padding: '8px 6px' }}>
                    <span style={{ padding: '2px 6px', borderRadius: '3px', background: 'var(--bg3)', fontSize: '9px' }}>
                      {fieldLabels[c.field] || c.field}
                    </span>
                  </td>
                  <td style={{ padding: '8px 6px', color: 'var(--dg)', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: 'line-through' }}>
                    {c.current_value}
                  </td>
                  <td style={{ padding: '8px 6px', color: 'var(--rv)', fontWeight: 500, maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.suggested_value}
                  </td>
                  <td style={{ padding: '8px 6px', color: 'var(--tx3)', fontSize: '9px' }}>
                    {c.user_email ? c.user_email.split('@')[0] : 'anon'}
                  </td>
                  <td style={{ padding: '8px 6px', color: 'var(--tx3)', fontSize: '9px', whiteSpace: 'nowrap' }}>
                    {c.reviewed_at ? new Date(c.reviewed_at).toLocaleDateString() : ''}
                  </td>
                  <td style={{ padding: '8px 6px', textAlign: 'right' }}>
                    {c.status === 'approved' && (
                      <button onClick={() => handleRollback(c)} disabled={processing === c.id}
                        style={{
                          fontFamily: mono, fontSize: '9px', padding: '3px 8px', borderRadius: '4px',
                          border: '.5px solid var(--dg)', background: 'var(--bg)', color: 'var(--dg)',
                          cursor: processing === c.id ? 'wait' : 'pointer', opacity: processing === c.id ? 0.5 : 1,
                        }}>
                        {processing === c.id ? '...' : 'Rollback'}
                      </button>
                    )}
                    {c.status === 'rolled_back' && (
                      <span style={{ fontSize: '9px', color: 'var(--tx3)', fontStyle: 'italic' }}>rolled back</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
