'use client'

// /journal — Pro feature. Personal river log + auto-derived stats.
// Two-pane: stats summary at top, chronological log below with
// inline add form. Photo upload deferred (URL paste field for now).

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ALL_RIVERS, getRiverPath } from '@/data/rivers'
import { SHOW_PRO_TIER } from '@/lib/features'

interface Entry {
  id: string
  river_id: string
  river_name: string
  trip_date: string
  miles: number | null
  hours: number | null
  flow_cfs: number | null
  conditions: string | null
  notes: string | null
  photo_url: string | null
  created_at: string
}

export default function JournalPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [authLoaded, setAuthLoaded] = useState(false)
  const [entries, setEntries] = useState<Entry[] | null>(null)
  const [riverId, setRiverId] = useState('')
  const [tripDate, setTripDate] = useState(new Date().toISOString().slice(0, 10))
  const [miles, setMiles] = useState('')
  const [hours, setHours] = useState('')
  const [cfs, setCfs] = useState('')
  const [conditions, setConditions] = useState('')
  const [notes, setNotes] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!SHOW_PRO_TIER) { router.replace('/'); return }
    supabase.auth.getUser().then(({ data }) => {
      const uid = data.user?.id ?? null
      setUserId(uid); setAuthLoaded(true)
      if (!uid) return
      fetch(`/api/journal?userId=${uid}`)
        .then(r => r.json())
        .then(d => setEntries(d.entries ?? []))
        .catch(() => setEntries([]))
    })
  }, [router])

  // Stats derived client-side from the loaded entries.
  const stats = useMemo(() => {
    if (!entries) return null
    const totalTrips = entries.length
    const totalMiles = entries.reduce((s, e) => s + (e.miles || 0), 0)
    const totalHours = entries.reduce((s, e) => s + (e.hours || 0), 0)
    const byRiver = new Map<string, number>()
    for (const e of entries) byRiver.set(e.river_name, (byRiver.get(e.river_name) || 0) + 1)
    const topRivers = [...byRiver.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)
    const byMonth = new Map<string, number>()
    for (const e of entries) {
      const m = e.trip_date.slice(0, 7)  // YYYY-MM
      byMonth.set(m, (byMonth.get(m) || 0) + 1)
    }
    const lastTrip = entries[0]?.trip_date ?? null
    return { totalTrips, totalMiles, totalHours, topRivers, byMonth, lastTrip }
  }, [entries])

  async function add(e: React.FormEvent) {
    e.preventDefault()
    if (!userId || busy) return
    setError(null)
    const river = ALL_RIVERS.find(r => r.id === riverId)
    if (!river) { setError('Pick a river'); return }
    setBusy(true)
    try {
      const res = await fetch('/api/journal', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId, riverId, riverName: river.n, tripDate,
          miles: miles || null, hours: hours || null, flowCfs: cfs || null,
          conditions: conditions || null, notes: notes || null,
        }),
      })
      const d = await res.json()
      if (!d.ok) { setError(d.error || 'Failed to save'); setBusy(false); return }
      setEntries(prev => [d.entry, ...(prev ?? [])])
      // Reset form (keep river selected — user often logs multiple trips on same river)
      setMiles(''); setHours(''); setCfs(''); setConditions(''); setNotes('')
    } catch { setError('Network error') }
    setBusy(false)
  }

  async function remove(id: string) {
    if (!userId) return
    if (!confirm('Delete this entry?')) return
    await fetch('/api/journal', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, id }),
    })
    setEntries(prev => (prev ?? []).filter(x => x.id !== id))
  }

  if (!authLoaded) return <div style={{ padding: 40, fontFamily: "'IBM Plex Mono', monospace", color: 'var(--tx3)' }}>Loading…</div>

  if (!userId) return (
    <main style={{ padding: '40px 24px', maxWidth: 720, margin: '0 auto' }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: '#042C53', margin: '0 0 10px' }}>River journal</h1>
      <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: 'var(--tx2)' }}>
        Sign in to track your paddling history. <Link href="/login?next=/journal" style={{ color: 'var(--rvdk)' }}>Sign in →</Link>
      </p>
    </main>
  )

  const sortedRivers = ALL_RIVERS.slice().sort((a, b) => a.n.localeCompare(b.n))

  return (
    <main style={{ padding: '24px', maxWidth: 920, margin: '0 auto' }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: '#042C53', margin: '0 0 6px' }}>River journal</h1>
      <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: 'var(--tx3)', margin: '0 0 22px' }}>
        Your paddling history in one place. Private — only you can see it.
      </p>

      {/* Stats */}
      {stats && stats.totalTrips > 0 && (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10,
          marginBottom: 24,
        }}>
          <Stat label="Trips logged"  value={stats.totalTrips} />
          <Stat label="Miles paddled" value={stats.totalMiles ? Math.round(stats.totalMiles).toLocaleString() : '—'} />
          <Stat label="Hours on water" value={stats.totalHours ? Math.round(stats.totalHours).toLocaleString() : '—'} />
          <Stat label="Last trip"      value={stats.lastTrip ? new Date(stats.lastTrip).toLocaleDateString() : '—'} />
        </div>
      )}

      {stats && stats.topRivers.length > 0 && (
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: 'var(--tx3)',
          marginBottom: 24, padding: '10px 14px', background: 'var(--bg2)', borderRadius: 'var(--r)',
          border: '.5px solid var(--bd)',
        }}>
          <strong style={{ color: 'var(--tx2)' }}>Most-paddled rivers:</strong>{' '}
          {stats.topRivers.map(([name, n], i) => (
            <span key={name}>{i > 0 && ' · '}{name} ({n})</span>
          ))}
        </div>
      )}

      {/* Add form */}
      <form onSubmit={add} style={{
        padding: 16, border: '.5px solid var(--bd)', borderRadius: 'var(--r)',
        background: 'var(--bg2)', marginBottom: 22,
      }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.3px', marginBottom: 10 }}>
          Log a trip
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8, marginBottom: 8 }}>
          <select required value={riverId} onChange={e => setRiverId(e.target.value)} style={inp}>
            <option value="">Pick a river…</option>
            {sortedRivers.map(r => <option key={r.id} value={r.id}>{r.n} ({r.abbr})</option>)}
          </select>
          <input required type="date" value={tripDate} onChange={e => setTripDate(e.target.value)} style={inp} />
          <input type="number" step="0.1" placeholder="Miles" value={miles} onChange={e => setMiles(e.target.value)} style={inp} />
          <input type="number" step="0.25" placeholder="Hours" value={hours} onChange={e => setHours(e.target.value)} style={inp} />
          <input type="number" placeholder="Flow CFS" value={cfs} onChange={e => setCfs(e.target.value)} style={inp} />
          <input placeholder="Conditions tag" value={conditions} onChange={e => setConditions(e.target.value)} style={inp} />
        </div>
        <textarea placeholder="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} style={{ ...inp, width: '100%', minHeight: 60, resize: 'vertical', marginBottom: 8 }} />
        {error && <div style={{ color: 'var(--dg)', fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, marginBottom: 8 }}>{error}</div>}
        <button type="submit" disabled={busy} style={{
          padding: '8px 16px', borderRadius: 'var(--r)', background: 'var(--rvdk)', color: '#fff',
          border: 'none', fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 600,
          cursor: busy ? 'wait' : 'pointer',
        }}>{busy ? 'Saving…' : 'Save trip'}</button>
      </form>

      {/* Log */}
      {entries === null ? (
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: 'var(--tx3)' }}>Loading…</div>
      ) : entries.length === 0 ? (
        <div style={{
          padding: 30, textAlign: 'center', borderRadius: 'var(--r)',
          border: '.5px dashed var(--bd)', background: 'var(--bg2)',
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: 'var(--tx3)',
        }}>
          No trips yet. Log your first one above.
        </div>
      ) : (
        <div>
          {entries.map(e => (
            <div key={e.id} style={{
              padding: '12px 14px', border: '.5px solid var(--bd)', borderRadius: 'var(--r)',
              marginBottom: 8, background: 'var(--bg)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, color: '#042C53' }}>
                    <Link href={getRiverPath({ id: e.river_id, stateKey: ALL_RIVERS.find(r => r.id === e.river_id)?.stateKey ?? '' } as never)} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {e.river_name}
                    </Link>
                  </div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: 'var(--tx3)', marginTop: 2 }}>
                    {new Date(e.trip_date).toLocaleDateString()}
                    {e.miles != null && ` · ${e.miles} mi`}
                    {e.hours != null && ` · ${e.hours} hr`}
                    {e.flow_cfs != null && ` · ${e.flow_cfs.toLocaleString()} cfs`}
                    {e.conditions && ` · ${e.conditions}`}
                  </div>
                  {e.notes && <div style={{ fontSize: 13, color: 'var(--tx)', marginTop: 6, lineHeight: 1.5 }}>{e.notes}</div>}
                </div>
                <button onClick={() => remove(e.id)} style={{
                  background: 'transparent', border: 'none', color: 'var(--tx3)', cursor: 'pointer',
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
                }}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

const inp: React.CSSProperties = {
  padding: '7px 10px', borderRadius: 'var(--r)', border: '.5px solid var(--bd)',
  background: 'var(--bg)', fontFamily: "'IBM Plex Mono', monospace", fontSize: 12,
  color: 'var(--tx)',
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div style={{
      padding: 12, border: '.5px solid var(--bd)', borderRadius: 'var(--r)', background: 'var(--bg)',
      textAlign: 'center',
    }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: '#042C53', lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.3px', marginTop: 4 }}>{label}</div>
    </div>
  )
}
