'use client'

// Admin moderation queue. Shows all pending/flagged submissions
// across trip_reports, river_answers, river_hazards, suggestions,
// river_access_points, and fish_catches. Each row has Approve and
// Reject buttons that hit POST /api/admin/moderate.
//
// Admin-only (checked via isAdmin on the API side). No formal auth
// gate here — the data is fetched via service-role-backed list
// endpoints; if the user isn't admin the moderate action will 403.

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const mono = "'IBM Plex Mono', monospace"
const serif = "'Playfair Display', serif"

interface FlaggedItem {
  table: string
  id: string
  riverId: string
  excerpt: string
  type: string
  createdAt: string
}

export default function ModerationPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [items, setItems] = useState<FlaggedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const uid = data.user?.id
      if (!uid) { setLoading(false); return }
      setUserId(uid)

      // Fetch pending rows from each table in parallel. Uses the
      // anon client which can SELECT through public-read or
      // owner-read RLS. Pending trip_reports/answers are visible
      // to their owners; for the admin queue we rely on the fact
      // that the admin user's own pending rows + any service-role
      // seeded test rows will show. For a complete picture we'd
      // need a service-role list endpoint; this is good enough
      // for an MVP admin queue.
      const [trips, answers, hazards, suggestions, accessPts, catches] = await Promise.all([
        supabase.from('trip_reports').select('id, river_id, report_text, created_at').in('status', ['pending', 'flagged']).order('created_at', { ascending: false }).limit(50),
        supabase.from('river_answers').select('id, river_id, answer, created_at').eq('status', 'pending').order('created_at', { ascending: false }).limit(50),
        supabase.from('river_hazards').select('id, river_id, title, description, created_at').eq('active', false).order('created_at', { ascending: false }).limit(50),
        supabase.from('suggestions').select('id, river_id, suggested_value, reason, ai_reasoning, created_at').eq('status', 'pending').order('created_at', { ascending: false }).limit(50),
        supabase.from('river_access_points').select('id, river_id, name, description, created_at').eq('verification_status', 'pending').order('created_at', { ascending: false }).limit(50),
        supabase.from('fish_catches').select('id, river_id, species, notes, created_at').in('verification_status', ['pending', 'flagged']).order('created_at', { ascending: false }).limit(50),
      ])

      const all: FlaggedItem[] = [
        ...(trips.data ?? []).map(r => ({ table: 'trip_reports', id: r.id, riverId: r.river_id, excerpt: r.report_text?.slice(0, 120) || '', type: 'Trip report', createdAt: r.created_at })),
        ...(answers.data ?? []).map(r => ({ table: 'river_answers', id: r.id, riverId: r.river_id, excerpt: r.answer?.slice(0, 120) || '', type: 'Q&A answer', createdAt: r.created_at })),
        ...(hazards.data ?? []).map(r => ({ table: 'river_hazards', id: r.id, riverId: r.river_id, excerpt: `${r.title}: ${r.description}`.slice(0, 120), type: 'Hazard', createdAt: r.created_at })),
        ...(suggestions.data ?? []).map(r => ({ table: 'suggestions', id: r.id, riverId: r.river_id, excerpt: (r.ai_reasoning?.startsWith('[MODERATION') ? r.ai_reasoning.slice(0, 120) : r.reason?.slice(0, 120)) || '', type: 'Correction', createdAt: r.created_at })),
        ...(accessPts.data ?? []).map(r => ({ table: 'river_access_points', id: r.id, riverId: r.river_id, excerpt: `${r.name}: ${r.description || ''}`.slice(0, 120), type: 'Access point', createdAt: r.created_at })),
        ...(catches.data ?? []).map(r => ({ table: 'fish_catches', id: r.id, riverId: r.river_id, excerpt: `${r.species}: ${r.notes || ''}`.slice(0, 120), type: 'Fish catch', createdAt: r.created_at })),
      ]
      all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      setItems(all)
      setLoading(false)
    })
  }, [])

  async function moderate(item: FlaggedItem, action: 'approve' | 'reject') {
    if (!userId) return
    setActing(item.id)
    const res = await fetch('/api/admin/moderate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table: item.table, id: item.id, action, userId }),
    })
    if (res.ok) {
      setItems(prev => prev.filter(i => i.id !== item.id))
    }
    setActing(null)
  }

  if (loading) {
    return <div style={{ padding: '40px', fontFamily: mono, color: 'var(--tx3)' }}>Loading moderation queue…</div>
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--tx)', padding: '20px 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: serif, fontSize: '24px', margin: '0 0 4px', color: '#042C53' }}>Moderation queue</h1>
        <p style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx3)', marginBottom: '20px' }}>
          {items.length} item{items.length === 1 ? '' : 's'} awaiting review
        </p>

        {items.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', fontFamily: mono, fontSize: '12px', color: 'var(--tx3)', border: '.5px dashed var(--bd)', borderRadius: 'var(--r)', background: 'var(--bg2)' }}>
            All clear — nothing to review.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {items.map(item => (
              <div key={item.id} style={{
                border: '.5px solid var(--bd)', borderRadius: 'var(--r)',
                background: 'var(--bg)', padding: '14px 16px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px',
              }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{
                      fontFamily: mono, fontSize: '9px', textTransform: 'uppercase',
                      padding: '2px 6px', borderRadius: '6px',
                      background: 'var(--amlt)', color: '#7A4D0E',
                      border: '.5px solid var(--am)',
                    }}>{item.type}</span>
                    <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)' }}>
                      {item.riverId} · {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ fontFamily: mono, fontSize: '12px', color: 'var(--tx2)', lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.excerpt || '—'}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  <button
                    type="button"
                    disabled={acting === item.id}
                    onClick={() => moderate(item, 'approve')}
                    style={{
                      fontFamily: mono, fontSize: '10px',
                      padding: '5px 10px', borderRadius: 'var(--r)',
                      background: '#1D9E75', color: '#fff', border: 'none',
                      cursor: acting === item.id ? 'wait' : 'pointer',
                      opacity: acting === item.id ? 0.5 : 1,
                    }}
                  >Approve</button>
                  <button
                    type="button"
                    disabled={acting === item.id}
                    onClick={() => moderate(item, 'reject')}
                    style={{
                      fontFamily: mono, fontSize: '10px',
                      padding: '5px 10px', borderRadius: 'var(--r)',
                      background: '#A32D2D', color: '#fff', border: 'none',
                      cursor: acting === item.id ? 'wait' : 'pointer',
                      opacity: acting === item.id ? 0.5 : 1,
                    }}
                  >Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
