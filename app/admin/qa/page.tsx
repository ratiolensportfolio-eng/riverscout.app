'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { isAdmin } from '@/lib/admin'

const mono = "'IBM Plex Mono', monospace"
const serif = "'Playfair Display', serif"

// Q&A admin panel — surfaces recently asked questions across all
// rivers, with the ability to remove inappropriate content, mark
// best answers, and flag questions that have sat unanswered for
// 7+ days so admins can seed an answer.
//
// Filter tabs:
//   recent     — last 50 questions across all rivers
//   stale      — unanswered for 7+ days (admin should seed an answer)
//   unanswered — answered=false, sorted oldest-first (oldest = worst)
//   removed    — soft-deleted, in case we need to restore one

type QaFilter = 'recent' | 'stale' | 'unanswered' | 'removed'

interface AdminAnswerRow {
  id: string
  display_name: string
  answer: string
  created_at: string
  helpful_count: number
  is_best_answer: boolean
  status: string
}

interface AdminQuestionRow {
  id: string
  river_id: string
  display_name: string
  question: string
  created_at: string
  answered: boolean
  helpful_count: number
  status: string
  answers: AdminAnswerRow[]
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

export default function AdminQAPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<QaFilter>('recent')
  const [questions, setQuestions] = useState<AdminQuestionRow[]>([])
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

  // Admin queries hit Supabase directly so we can see removed
  // rows that the public read-policy filters out. Service-role
  // would also work but anon + the SELECT-status='active' policy
  // bypass via RLS exemption isn't necessary — the admin reads
  // are scoped here.
  const fetchQuestions = useCallback(async () => {
    if (!authorized) return
    setBanner(null)

    // Use the typed client and cast — questions/answers tables aren't
    // in the generated Supabase types yet so the chained fluent API
    // resolves to never.
    const sb = supabase as unknown as {
      from: (table: string) => {
        select: (cols: string) => {
          eq: (col: string, val: unknown) => unknown
          order: (col: string, opts?: unknown) => unknown
          limit: (n: number) => unknown
          lte: (col: string, val: unknown) => unknown
          in: (col: string, vals: unknown[]) => unknown
        }
      }
    }

    let q: any = sb.from('river_questions').select('id, river_id, display_name, question, created_at, answered, helpful_count, status')

    if (filter === 'recent') {
      q = q.eq('status', 'active').order('created_at', { ascending: false }).limit(80)
    } else if (filter === 'stale') {
      const cutoff = new Date(Date.now() - 7 * 86_400_000).toISOString()
      q = q.eq('status', 'active').eq('answered', false).lte('created_at', cutoff).order('created_at', { ascending: true }).limit(80)
    } else if (filter === 'unanswered') {
      q = q.eq('status', 'active').eq('answered', false).order('created_at', { ascending: true }).limit(80)
    } else if (filter === 'removed') {
      q = q.eq('status', 'removed').order('created_at', { ascending: false }).limit(80)
    }

    const { data: qData, error: qErr } = await q
    if (qErr) {
      setBanner({ type: 'error', message: `Fetch failed: ${qErr.message}` })
      return
    }
    const qRows = (qData ?? []) as Array<Omit<AdminQuestionRow, 'answers'>>

    let withAnswers: AdminQuestionRow[] = qRows.map(row => ({ ...row, answers: [] }))

    if (qRows.length > 0) {
      const ids = qRows.map(r => r.id)
      const { data: aData } = await sb
        .from('river_answers')
        .select('id, question_id, display_name, answer, created_at, helpful_count, is_best_answer, status')
        .in('question_id', ids) as unknown as { data: Array<AdminAnswerRow & { question_id: string }> | null }

      const byQ = new Map<string, AdminAnswerRow[]>()
      for (const a of (aData ?? [])) {
        const list = byQ.get(a.question_id) ?? []
        const { question_id: _qid, ...rest } = a
        list.push(rest)
        byQ.set(a.question_id, list)
      }
      withAnswers = qRows.map(row => ({
        ...row,
        answers: (byQ.get(row.id) ?? []).sort((a, b) => {
          if (a.is_best_answer !== b.is_best_answer) return a.is_best_answer ? -1 : 1
          return b.helpful_count - a.helpful_count
        }),
      }))
    }

    setQuestions(withAnswers)
  }, [authorized, filter])

  useEffect(() => {
    if (authorized) fetchQuestions()
  }, [authorized, fetchQuestions])

  async function moderate(action: 'remove' | 'restore' | 'mark-best' | 'unmark-best', kind: 'question' | 'answer', id: string) {
    setBusyId(id)
    try {
      const res = await fetch('/api/admin/qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, userEmail, action, kind, id }),
      })
      const data = await res.json()
      if (!res.ok) {
        setBanner({ type: 'error', message: data.error || 'Action failed' })
      } else {
        setBanner({ type: 'success', message: 'Done.' })
        await fetchQuestions()
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

        {/* Admin sub-nav — matches the pattern in /admin/hazards. */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <Link href="/admin/suggestions" style={navLinkStyle}>River Improvements</Link>
          <Link href="/admin/hazards" style={navLinkStyle}>Hazards</Link>
          <Link href="/admin/permits" style={navLinkStyle}>Permits</Link>
          <span style={navActiveStyle}>Q&amp;A</span>
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
          River Q&amp;A
        </h1>
        <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx3)', marginBottom: '16px' }}>
          {questions.length} {filter}
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {(['recent', 'stale', 'unanswered', 'removed'] as QaFilter[]).map(f => (
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
              {f === 'stale' ? 'stale (7d+)' : f}
            </button>
          ))}
        </div>

        {questions.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', fontFamily: mono, fontSize: '12px', color: 'var(--tx3)', background: 'var(--bg2)', borderRadius: 'var(--r)' }}>
            No {filter} questions.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {questions.map(q => {
              const isStale = !q.answered && (Date.now() - new Date(q.created_at).getTime()) > 7 * 86_400_000
              const busy = busyId === q.id
              return (
                <div key={q.id} style={{
                  border: q.status === 'removed' ? '.5px dashed var(--bd2)' : '.5px solid var(--bd)',
                  borderRadius: 'var(--r)',
                  background: q.status === 'removed' ? 'var(--bg2)' : 'var(--bg)',
                  padding: '14px 16px',
                  opacity: q.status === 'removed' ? 0.55 : 1,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
                    <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <Link href={`/rivers/all/${q.river_id}`} style={{ color: 'var(--rv)', textDecoration: 'none' }}>
                        {q.river_id}
                      </Link>
                      <span>{q.display_name}</span>
                      <span>{timeAgo(q.created_at)}</span>
                      {!q.answered && <span style={{ color: isStale ? 'var(--dg)' : 'var(--am)' }}>
                        {isStale ? '⚠ STALE — unanswered 7+ days' : 'unanswered'}
                      </span>}
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                      {q.status === 'active' ? (
                        <button onClick={() => moderate('remove', 'question', q.id)} disabled={busy} style={dangerBtnStyle}>
                          Remove
                        </button>
                      ) : (
                        <button onClick={() => moderate('restore', 'question', q.id)} disabled={busy} style={smallBtnStyle}>
                          Restore
                        </button>
                      )}
                    </div>
                  </div>
                  <div style={{ fontFamily: serif, fontSize: '14px', fontWeight: 600, color: 'var(--tx)', lineHeight: 1.4, marginBottom: '6px' }}>
                    {q.question}
                  </div>

                  {q.answers.length === 0 ? (
                    <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)', fontStyle: 'italic' }}>
                      No answers yet.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                      {q.answers.map(a => (
                        <div key={a.id} style={{
                          background: 'var(--bg2)',
                          borderLeft: a.is_best_answer ? '3px solid var(--rv)' : '2px solid var(--bd2)',
                          padding: '8px 12px', borderRadius: 'var(--r)',
                          opacity: a.status === 'removed' ? 0.5 : 1,
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                            <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', display: 'flex', gap: '10px' }}>
                              <span>{a.display_name}</span>
                              <span>{timeAgo(a.created_at)}</span>
                              <span>👍 {a.helpful_count}</span>
                              {a.is_best_answer && <span style={{ color: 'var(--rv)', fontWeight: 600 }}>★ best</span>}
                              {a.status === 'removed' && <span style={{ color: 'var(--dg)' }}>removed</span>}
                            </div>
                            <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                              {a.status === 'active' && !a.is_best_answer && (
                                <button onClick={() => moderate('mark-best', 'answer', a.id)} disabled={busyId === a.id} style={smallBtnStyle}>
                                  Mark best
                                </button>
                              )}
                              {a.status === 'active' && a.is_best_answer && (
                                <button onClick={() => moderate('unmark-best', 'answer', a.id)} disabled={busyId === a.id} style={smallBtnStyle}>
                                  Unmark best
                                </button>
                              )}
                              {a.status === 'active' ? (
                                <button onClick={() => moderate('remove', 'answer', a.id)} disabled={busyId === a.id} style={dangerBtnStyle}>
                                  Remove
                                </button>
                              ) : (
                                <button onClick={() => moderate('restore', 'answer', a.id)} disabled={busyId === a.id} style={smallBtnStyle}>
                                  Restore
                                </button>
                              )}
                            </div>
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--tx)', lineHeight: 1.55 }}>
                            {a.answer}
                          </div>
                        </div>
                      ))}
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
  fontFamily: mono, fontSize: '9px', padding: '4px 10px', borderRadius: 'var(--r)',
  background: 'var(--bg)', color: 'var(--tx2)', border: '.5px solid var(--bd2)',
  cursor: 'pointer',
}
const dangerBtnStyle: React.CSSProperties = {
  fontFamily: mono, fontSize: '9px', padding: '4px 10px', borderRadius: 'var(--r)',
  background: 'var(--bg)', color: 'var(--dg)', border: '.5px solid var(--dg)',
  cursor: 'pointer',
}
