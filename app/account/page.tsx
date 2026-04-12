'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getContributorTier, getNextTier, CONTRIBUTOR_TIERS } from '@/lib/contributor-tiers'
import { ALL_RIVERS, getRiverPath } from '@/data/rivers'

const mono = "'IBM Plex Mono', monospace"
const serif = "'Playfair Display', serif"

// Saved river card data — hydrated from the static catalog +
// live USGS flow fetch. The weekly digest email shows the same
// shape; this is the in-app equivalent.
interface SavedRiverCard {
  riverId: string
  name: string
  state: string
  path: string     // /rivers/michigan/pine-river
  cls: string
  opt: string
  cfs: number | null
  condition: string
  loading: boolean
}

const COND_COLORS: Record<string, string> = {
  optimal: '#1D9E75', low: '#533AB7', high: '#BA7517',
  flood: '#A32D2D', loading: '#aaa99a',
}
const COND_LABELS: Record<string, string> = {
  optimal: 'Optimal', low: 'Below Optimal', high: 'Above Optimal',
  flood: 'Flood', loading: 'Loading…',
}

interface ProfileData {
  display_name: string | null
  email: string | null
  home_state: string | null
  is_pro: boolean
  pro_tier: string | null
  pro_expires_at: string | null
  stripe_customer_id: string | null
  digest_subscribed: boolean
}

interface Stats {
  savedRivers: number
  tripReports: number
  improvements: number
}

// Subset of fields we render per alert row. The /api/alerts/list
// route normalizes the three tables to share id/river_id/river_name/
// active, and adds whatever extra config columns each kind needs.
interface FlowAlertRow {
  id: string
  river_id: string | null
  river_name: string | null
  state_key: string | null
  threshold: number | null
  active: boolean | null
}
interface ReleaseAlertRow {
  id: string
  river_id: string | null
  river_name: string | null
  season_label: string | null
  notify_days_before: number | null
  active: boolean | null
}
interface HatchAlertRow {
  id: string
  river_id: string | null
  river_name: string | null
  state_key: string | null
  hatch_name: string | null
  species: string | null
  notify_days_before: number | null
  active: boolean | null
}

interface AlertsState {
  flow: FlowAlertRow[]
  release: ReleaseAlertRow[]
  hatch: HatchAlertRow[]
  loading: boolean
  errors: { flow: string | null; release: string | null; hatch: string | null }
}

type DigestStatus =
  | { state: 'idle' }
  | { state: 'saving' }
  | { state: 'sending-preview' }
  | { state: 'success'; message: string }
  | { state: 'error'; message: string }

export default function AccountPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [stats, setStats] = useState<Stats>({ savedRivers: 0, tripReports: 0, improvements: 0 })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editName, setEditName] = useState('')
  const [editState, setEditState] = useState('')
  const [portalLoading, setPortalLoading] = useState(false)
  const [digestStatus, setDigestStatus] = useState<DigestStatus>({ state: 'idle' })
  const [savedRiverCards, setSavedRiverCards] = useState<SavedRiverCard[]>([])
  const [savedRiversLoading, setSavedRiversLoading] = useState(true)
  const [alerts, setAlerts] = useState<AlertsState>({
    flow: [], release: [], hatch: [],
    loading: true,
    errors: { flow: null, release: null, hatch: null },
  })
  const [unsubscribing, setUnsubscribing] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const uid = data.user?.id
      if (!uid) { setLoading(false); return }
      setUserId(uid)

      // Fetch profile
      const { data: prof } = await supabase
        .from('user_profiles')
        .select('display_name, email, home_state, is_pro, pro_tier, pro_expires_at, stripe_customer_id, digest_subscribed')
        .eq('id', uid)
        .single()

      if (prof) {
        setProfile(prof)
        setEditName(prof.display_name || '')
        setEditState(prof.home_state || '')
      }

      // Fetch stats. Contributor count = approved suggestions +
      // Q&A answers that have earned at least one helpful mark.
      // See app/api/profile/route.ts for the rationale.
      const [saved, trips, improvements, helpfulAnswers] = await Promise.all([
        supabase.from('saved_rivers').select('*', { count: 'exact', head: true }).eq('user_id', uid),
        supabase.from('trip_reports').select('*', { count: 'exact', head: true }).eq('user_id', uid),
        supabase.from('suggestions').select('*', { count: 'exact', head: true }).eq('user_id', uid).eq('status', 'approved'),
        supabase.from('river_answers').select('*', { count: 'exact', head: true }).eq('user_id', uid).eq('status', 'active').gte('helpful_count', 1),
      ])

      setStats({
        savedRivers: saved.count ?? 0,
        tripReports: trips.count ?? 0,
        improvements: (improvements.count ?? 0) + (helpfulAnswers.count ?? 0),
      })

      // Fetch saved rivers — the river_id list from Supabase,
      // hydrated with static catalog data (name, state, path, class,
      // optimal CFS) from ALL_RIVERS, then live flow from USGS via
      // /api/weather or direct gauge endpoint. The cards render like
      // the weekly digest email but in-app.
      try {
        const { data: savedRows } = await supabase
          .from('saved_rivers')
          .select('river_id')
          .eq('user_id', uid)
          .order('created_at', { ascending: false })

        const riverMap = new Map(ALL_RIVERS.map(r => [r.id, r]))
        const cards: SavedRiverCard[] = []
        for (const row of (savedRows ?? [])) {
          const r = riverMap.get(row.river_id)
          if (!r) continue
          cards.push({
            riverId: r.id,
            name: r.n,
            state: r.stateName as string,
            path: getRiverPath(r),
            cls: r.cls ?? '',
            opt: r.opt ?? '',
            cfs: null,
            condition: 'loading',
            loading: true,
          })
        }

        setSavedRiverCards(cards)
        setSavedRiversLoading(false)

        // Fire live CFS fetches in parallel. We hit the USGS
        // waterservices API directly (public, no key, CORS-friendly)
        // rather than going through a server route, because we need
        // CFS for N rivers simultaneously and our server routes
        // don't have a batch-flow endpoint. Each fetch is best-
        // effort — errors leave the card in "loading" state.
        for (const card of cards) {
          const river = riverMap.get(card.riverId)
          if (!river?.g) continue
          const gaugeId = river.g
          const optStr = river.opt ?? ''
          fetch(`https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${gaugeId}&parameterCd=00060&period=PT1H`)
            .then(res => res.ok ? res.json() : null)
            .then(data => {
              if (!data) return
              const ts = data?.value?.timeSeries?.[0]
              const val = ts?.values?.[0]?.value?.[0]?.value
              const cfs = val ? Number(val) : null
              // Derive condition from the river's optimal range.
              // The opt field is a string like "300–1000" or
              // "150–350".
              let condition = 'loading'
              if (cfs !== null) {
                const match = optStr.match(/(\d+)\s*[–-]\s*(\d+)/)
                if (match) {
                  const lo = Number(match[1])
                  const hi = Number(match[2])
                  if (cfs >= lo && cfs <= hi) condition = 'optimal'
                  else if (cfs < lo) condition = 'low'
                  else if (cfs <= hi * 2) condition = 'high'
                  else condition = 'flood'
                } else {
                  condition = 'optimal'
                }
              }
              setSavedRiverCards(prev => prev.map(c =>
                c.riverId === card.riverId
                  ? { ...c, cfs, condition, loading: false }
                  : c
              ))
            })
            .catch(() => {
              setSavedRiverCards(prev => prev.map(c =>
                c.riverId === card.riverId ? { ...c, loading: false } : c
              ))
            })
        }
      } catch {
        setSavedRiversLoading(false)
      }

      // Fetch the user's alert subscriptions across all three tables.
      // We hit a service-role route because RLS on release_alerts and
      // hatch_alerts gates SELECT on auth.uid(), which the anon browser
      // client can't provide reliably from the account page.
      try {
        const params = new URLSearchParams({ userId: uid })
        if (data.user?.email) params.set('email', data.user.email)
        const res = await fetch(`/api/alerts/list?${params.toString()}`)
        const payload = await res.json()
        if (res.ok) {
          setAlerts({
            flow: payload.flow ?? [],
            release: payload.release ?? [],
            hatch: payload.hatch ?? [],
            loading: false,
            errors: payload.errors ?? { flow: null, release: null, hatch: null },
          })
        } else {
          setAlerts(a => ({ ...a, loading: false }))
        }
      } catch {
        setAlerts(a => ({ ...a, loading: false }))
      }

      setLoading(false)
    })
  }, [])

  // Soft-delete a single alert subscription. Optimistic — drop the row
  // from local state immediately, restore on error so the user doesn't
  // see a "click did nothing" moment.
  async function unsubscribe(type: 'flow' | 'release' | 'hatch', id: string) {
    setUnsubscribing(id)
    const snapshot = alerts
    setAlerts(prev => ({
      ...prev,
      [type]: (prev[type] as { id: string }[]).filter(r => r.id !== id),
    }))
    try {
      const res = await fetch('/api/alerts/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id }),
      })
      if (!res.ok) {
        // Roll back so the user can try again.
        setAlerts(snapshot)
      }
    } catch {
      setAlerts(snapshot)
    } finally {
      setUnsubscribing(null)
    }
  }

  async function saveProfile() {
    if (!userId) return
    setSaving(true)
    await supabase
      .from('user_profiles')
      .update({
        display_name: editName || null,
        home_state: editState || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
    setProfile(p => p ? { ...p, display_name: editName, home_state: editState } : p)
    setSaving(false)
  }

  async function openPortal() {
    if (!userId) return
    setPortalLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      setPortalLoading(false)
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  // Toggle digest_subscribed. Optimistic update — flip the local state
  // immediately, roll back on error. Saves the trip across the
  // network from blocking the UI.
  async function toggleDigest(next: boolean) {
    if (!userId || !profile) return
    setDigestStatus({ state: 'saving' })
    const prev = profile.digest_subscribed
    setProfile({ ...profile, digest_subscribed: next })

    const { error } = await supabase
      .from('user_profiles')
      .update({ digest_subscribed: next, updated_at: new Date().toISOString() })
      .eq('id', userId)

    if (error) {
      setProfile({ ...profile, digest_subscribed: prev })
      setDigestStatus({ state: 'error', message: 'Failed to update digest preference.' })
      return
    }
    setDigestStatus({
      state: 'success',
      message: next ? 'You\'re subscribed to the Thursday digest.' : 'Digest unsubscribed.',
    })
  }

  // Trigger a preview send for this user. The /api/digest/preview
  // route rate-limits to one per 5 minutes per user.
  async function sendDigestPreview() {
    if (!userId) return
    setDigestStatus({ state: 'sending-preview' })
    try {
      const res = await fetch('/api/digest/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      const data = await res.json()
      if (!res.ok) {
        setDigestStatus({
          state: 'error',
          message: data.message || data.error || 'Failed to send preview.',
        })
        return
      }
      setDigestStatus({
        state: 'success',
        message: `Preview sent — check your inbox (${data.riversIncluded} river${data.riversIncluded === 1 ? '' : 's'}).`,
      })
    } catch {
      setDigestStatus({ state: 'error', message: 'Network error sending preview.' })
    }
  }

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono, color: 'var(--tx3)' }}>Loading...</div>
  }

  if (!userId) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontFamily: serif, fontSize: '20px', color: 'var(--rvdk)' }}>Sign in required</div>
        <Link href="/login" style={{ fontFamily: mono, fontSize: '11px', color: 'var(--rv)' }}>Sign in</Link>
      </div>
    )
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--tx)' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '28px' }}>
        <h1 style={{ fontFamily: serif, fontSize: '22px', fontWeight: 700, color: 'var(--rvdk)', marginBottom: '20px' }}>
          Account
        </h1>

        {/* Pro status */}
        {profile?.is_pro ? (
          <div style={{
            padding: '16px', background: 'var(--rvlt)', border: '.5px solid var(--rvmd)',
            borderRadius: 'var(--rlg)', marginBottom: '20px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <div style={{ fontFamily: mono, fontSize: '12px', fontWeight: 600, color: 'var(--rvdk)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  RiverScout Pro <span style={{ color: 'var(--rv)' }}>&#10003;</span>
                </div>
                <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--rv)', marginTop: '2px', textTransform: 'capitalize' }}>
                  {profile.pro_tier} plan
                  {profile.pro_expires_at && ` · Renews ${new Date(profile.pro_expires_at).toLocaleDateString()}`}
                </div>
              </div>
              {profile.stripe_customer_id && (
                <button onClick={openPortal} disabled={portalLoading} style={{
                  fontFamily: mono, fontSize: '10px', padding: '6px 14px', borderRadius: 'var(--r)',
                  background: 'var(--bg)', color: 'var(--rvdk)', border: '.5px solid var(--rvmd)',
                  cursor: portalLoading ? 'wait' : 'pointer',
                }}>
                  {portalLoading ? 'Loading...' : 'Manage Subscription'}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div style={{
            padding: '16px', background: 'var(--bg2)', border: '.5px solid var(--bd)',
            borderRadius: 'var(--rlg)', marginBottom: '20px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px',
          }}>
            <div>
              <div style={{ fontFamily: mono, fontSize: '12px', color: 'var(--tx)', marginBottom: '2px' }}>Free account</div>
              <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)', lineHeight: 1.5 }}>
                Full access to every river. Pro adds email alerts, offline mode, and deeper analytics.
              </div>
            </div>
            <Link href="/pro" style={{
              fontFamily: mono, fontSize: '10px', fontWeight: 500, padding: '6px 14px', borderRadius: 'var(--r)',
              background: 'var(--rvdk)', color: '#fff', textDecoration: 'none', flexShrink: 0,
            }}>
              Upgrade to Pro &rarr;
            </Link>
          </div>
        )}

        {/* Weekly digest — free for all users, prominent placement so
            users can find and toggle it easily. */}
        <div style={{
          padding: '18px 20px',
          background: profile?.digest_subscribed ? 'var(--rvlt)' : 'var(--bg2)',
          border: `.5px solid ${profile?.digest_subscribed ? 'var(--rvmd)' : 'var(--bd)'}`,
          borderRadius: 'var(--rlg)', marginBottom: '20px',
        }}>
          <div style={{
            fontFamily: mono, fontSize: '9px',
            color: profile?.digest_subscribed ? 'var(--rv)' : 'var(--tx3)',
            textTransform: 'uppercase', letterSpacing: '1.5px',
            marginBottom: '6px', fontWeight: 700,
          }}>
            Weekly River Digest
          </div>
          <div style={{
            fontFamily: serif, fontSize: '15px', fontWeight: 600,
            color: 'var(--tx)', marginBottom: '6px',
          }}>
            Thursday morning report on your saved rivers
          </div>
          <p style={{
            fontFamily: mono, fontSize: '11px', color: 'var(--tx2)',
            lineHeight: 1.6, marginBottom: '14px',
          }}>
            Get a personalized email every Thursday at 8am showing weekend conditions, weather, hatches, and stocking on the rivers you save. Free for all users.
          </p>

          <label style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            cursor: digestStatus.state === 'saving' ? 'wait' : 'pointer',
            marginBottom: '12px',
          }}>
            <input
              type="checkbox"
              checked={!!profile?.digest_subscribed}
              disabled={digestStatus.state === 'saving'}
              onChange={e => toggleDigest(e.target.checked)}
              style={{
                width: '16px', height: '16px',
                accentColor: 'var(--rvdk)',
                cursor: digestStatus.state === 'saving' ? 'wait' : 'pointer',
              }}
            />
            <span style={{ fontFamily: mono, fontSize: '12px', color: 'var(--tx)' }}>
              Send me the weekly digest
            </span>
          </label>

          {stats.savedRivers === 0 ? (
            // No saved rivers yet — promote the user to go save one
            // instead of showing a disabled button. Less confusing
            // than a greyed-out "Send preview" with a tooltip.
            <div style={{
              padding: '10px 14px', borderRadius: 'var(--r)',
              background: 'var(--bg)', border: '.5px dashed var(--bd2)',
              fontFamily: mono, fontSize: '11px', color: 'var(--tx2)',
              lineHeight: 1.6,
            }}>
              You haven&apos;t saved any rivers yet. Click the <strong style={{ color: 'var(--rvdk)' }}>&#9825; Save</strong> button on any river page to add it to your digest, then come back here to preview.
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={sendDigestPreview}
                disabled={digestStatus.state === 'sending-preview'}
                style={{
                  fontFamily: mono, fontSize: '10px', fontWeight: 500,
                  padding: '6px 14px', borderRadius: 'var(--r)',
                  background: 'var(--bg)', color: 'var(--rvdk)',
                  border: '.5px solid var(--rvmd)',
                  cursor: digestStatus.state === 'sending-preview' ? 'wait' : 'pointer',
                }}>
                {digestStatus.state === 'sending-preview' ? 'Sending\u2026' : 'Send me a preview now \u2192'}
              </button>
              <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)' }}>
                Your digest includes your {stats.savedRivers} saved river{stats.savedRivers === 1 ? '' : 's'}.
              </span>
            </div>
          )}

          {(digestStatus.state === 'success' || digestStatus.state === 'error') && (
            <div style={{
              marginTop: '10px',
              fontFamily: mono, fontSize: '10px',
              color: digestStatus.state === 'success' ? 'var(--rv)' : 'var(--dg)',
            }}>
              {digestStatus.state === 'success' ? '\u2713' : '\u26A0'} {digestStatus.message}
            </div>
          )}
        </div>

        {/* Saved rivers — cards matching the weekly digest style.
            Each card shows river name, state, class, live CFS,
            condition badge, and a link to the river page. */}
        <div id="saved" style={{ marginBottom: '20px', scrollMarginTop: '80px' }}>
          <h2 style={{
            fontFamily: serif, fontSize: '17px', fontWeight: 700,
            color: 'var(--rvdk)', marginBottom: '4px',
          }}>
            Saved Rivers
          </h2>
          <p style={{
            fontFamily: mono, fontSize: '10px', color: 'var(--tx3)',
            marginBottom: '12px', lineHeight: 1.5,
          }}>
            Rivers you&apos;ve bookmarked. Live conditions update every 15 minutes.
          </p>

          {savedRiversLoading ? (
            <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)' }}>Loading…</div>
          ) : savedRiverCards.length === 0 ? (
            <div style={{
              padding: '16px', borderRadius: 'var(--r)',
              border: '.5px dashed var(--bd2)', background: 'var(--bg)',
              fontFamily: mono, fontSize: '11px', color: 'var(--tx2)',
              lineHeight: 1.6,
            }}>
              You haven&apos;t saved any rivers yet. Click the <strong style={{ color: 'var(--rvdk)' }}>&#9825; Save</strong> button on any river page to add it here.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {savedRiverCards.map(card => {
                const condColor = COND_COLORS[card.condition] ?? COND_COLORS.loading
                const condLabel = COND_LABELS[card.condition] ?? 'Loading…'
                return (
                  <Link
                    key={card.riverId}
                    href={card.path}
                    style={{
                      display: 'block', textDecoration: 'none',
                      padding: '12px 14px', borderRadius: 'var(--r)',
                      border: '.5px solid var(--bd)',
                      background: card.condition === 'optimal' ? 'var(--rvlt)' : 'var(--bg)',
                      transition: 'background .15s, border-color .15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--rvmd)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bd)' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px', flexWrap: 'wrap' }}>
                          <span style={{ fontFamily: serif, fontSize: '14px', fontWeight: 600, color: 'var(--tx)' }}>
                            {card.name}
                          </span>
                          <span style={{
                            fontFamily: mono, fontSize: '9px', fontWeight: 600,
                            padding: '2px 7px', borderRadius: '10px',
                            background: 'var(--wtlt)', color: '#0C447C',
                            border: '.5px solid #9DC4EA',
                            textTransform: 'uppercase', letterSpacing: '.5px',
                          }}>
                            {card.state}
                          </span>
                        </div>
                        <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                          {card.cls && <span>Class {card.cls}</span>}
                          {card.opt && <span>Optimal: {card.opt} CFS</span>}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        {card.loading ? (
                          <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)' }}>…</span>
                        ) : card.cfs !== null ? (
                          <>
                            <div style={{ fontFamily: serif, fontSize: '18px', fontWeight: 700, color: '#0C447C', lineHeight: 1 }}>
                              {card.cfs.toLocaleString()}
                            </div>
                            <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)' }}>CFS</div>
                          </>
                        ) : (
                          <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)' }}>—</span>
                        )}
                        <span style={{
                          display: 'inline-block', marginTop: '4px',
                          fontFamily: mono, fontSize: '9px', fontWeight: 500,
                          padding: '2px 8px', borderRadius: '10px',
                          color: condColor, background: `${condColor}18`,
                        }}>
                          {condLabel}
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Profile fields */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '12px' }}>
            <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)', display: 'block', marginBottom: '4px' }}>Display name</span>
            <input type="text" value={editName} onChange={e => setEditName(e.target.value)}
              style={{ width: '100%', padding: '8px 10px', fontFamily: mono, fontSize: '12px', border: '.5px solid var(--bd2)', borderRadius: 'var(--r)', background: 'var(--bg)', color: 'var(--tx)', boxSizing: 'border-box' }} />
          </label>

          <label style={{ display: 'block', marginBottom: '12px' }}>
            <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)', display: 'block', marginBottom: '4px' }}>Email</span>
            <input type="email" value={profile?.email || ''} disabled
              style={{ width: '100%', padding: '8px 10px', fontFamily: mono, fontSize: '12px', border: '.5px solid var(--bd)', borderRadius: 'var(--r)', background: 'var(--bg2)', color: 'var(--tx3)', boxSizing: 'border-box' }} />
          </label>

          <label style={{ display: 'block', marginBottom: '14px' }}>
            <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)', display: 'block', marginBottom: '4px' }}>Home state</span>
            <input type="text" value={editState} onChange={e => setEditState(e.target.value)}
              placeholder="e.g. Michigan"
              style={{ width: '100%', padding: '8px 10px', fontFamily: mono, fontSize: '12px', border: '.5px solid var(--bd2)', borderRadius: 'var(--r)', background: 'var(--bg)', color: 'var(--tx)', boxSizing: 'border-box' }} />
          </label>

          <button onClick={saveProfile} disabled={saving} style={{
            fontFamily: mono, fontSize: '11px', fontWeight: 500, padding: '8px 20px', borderRadius: 'var(--r)',
            background: 'var(--rv)', color: '#fff', border: 'none',
            cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.6 : 1,
          }}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '14px' }}>
          {[
            { n: stats.savedRivers, l: 'Saved Rivers' },
            { n: stats.tripReports, l: 'Trip Reports' },
            { n: stats.improvements, l: 'Improvements' },
          ].map(s => (
            <div key={s.l} style={{ padding: '12px', background: 'var(--bg2)', borderRadius: 'var(--r)', border: '.5px solid var(--bd)', textAlign: 'center' }}>
              <div style={{ fontFamily: serif, fontSize: '20px', fontWeight: 700, color: 'var(--rvdk)' }}>{s.n}</div>
              <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.5px' }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* My Alerts — three sub-blocks (flow, release, hatch). Each
            block fetches from /api/alerts/list and lets the user
            unsubscribe in place. Anchor IDs match the AuthNav dropdown
            links so /account#release-alerts jumps straight to the
            block the user clicked. */}
        <div style={{ marginBottom: '24px' }} id="alerts">
          <h2 style={{
            fontFamily: serif, fontSize: '17px', fontWeight: 700,
            color: 'var(--rvdk)', marginBottom: '4px',
          }}>
            My Alerts
          </h2>
          <p style={{
            fontFamily: mono, fontSize: '10px', color: 'var(--tx3)',
            marginBottom: '14px', lineHeight: 1.5,
          }}>
            Email notifications you&apos;ve subscribed to from river pages.
          </p>

          {/* Flow alerts */}
          <AlertSection
            anchor="flow-alerts"
            title="Flow alerts"
            subtitle="Email me when a river crosses a CFS threshold."
            loading={alerts.loading}
            error={alerts.errors.flow}
            empty="No flow alerts yet. Subscribe from any river page using the bell icon."
          >
            {alerts.flow.map(row => (
              <AlertRow
                key={row.id}
                title={row.river_name || row.river_id || 'Unknown river'}
                detail={row.threshold != null ? `When flow crosses ${row.threshold} CFS` : 'Threshold not set'}
                inactive={row.active === false}
                disabled={unsubscribing === row.id}
                onUnsubscribe={() => unsubscribe('flow', row.id)}
              />
            ))}
          </AlertSection>

          {/* Dam release alerts */}
          <AlertSection
            anchor="release-alerts"
            title="Dam release alerts"
            subtitle="Email me before scheduled dam releases."
            loading={alerts.loading}
            error={alerts.errors.release}
            empty={
              <>No dam release alerts yet. Browse <Link href="/releases" style={{ color: 'var(--rv)' }}>upcoming releases</Link> and subscribe.</>
            }
          >
            {alerts.release.map(row => (
              <AlertRow
                key={row.id}
                title={row.river_name || row.river_id || 'Unknown river'}
                detail={[
                  row.season_label,
                  row.notify_days_before != null ? `${row.notify_days_before} day${row.notify_days_before === 1 ? '' : 's'} before` : null,
                ].filter(Boolean).join(' \u00B7 ')}
                inactive={row.active === false}
                disabled={unsubscribing === row.id}
                onUnsubscribe={() => unsubscribe('release', row.id)}
              />
            ))}
          </AlertSection>

          {/* Hatch alerts */}
          <AlertSection
            anchor="hatch-alerts"
            title="Hatch alerts"
            subtitle="Email me before fly hatches kick off."
            loading={alerts.loading}
            error={alerts.errors.hatch}
            empty={
              <>No hatch alerts yet. Browse <Link href="/hatches" style={{ color: 'var(--rv)' }}>hatch calendars</Link> and subscribe.</>
            }
          >
            {alerts.hatch.map(row => (
              <AlertRow
                key={row.id}
                title={row.river_name || row.river_id || 'Unknown river'}
                detail={[
                  row.hatch_name || row.species,
                  row.notify_days_before != null ? `${row.notify_days_before} day${row.notify_days_before === 1 ? '' : 's'} before` : null,
                ].filter(Boolean).join(' \u00B7 ')}
                inactive={row.active === false}
                disabled={unsubscribing === row.id}
                onUnsubscribe={() => unsubscribe('hatch', row.id)}
              />
            ))}
          </AlertSection>
        </div>

        {/* Contributor tier — derived from approved improvements count.
            Renders the current tier badge plus a progress hint toward
            the next tier. The full ladder is visible to give users a
            sense of what's possible. */}
        {(() => {
          const tier = getContributorTier(stats.improvements)
          const nextTier = getNextTier(stats.improvements)
          const toNext = nextTier ? nextTier.threshold - stats.improvements : 0

          if (tier.key === 'none') {
            // Brand-new user — show the encouragement card so they
            // know the system exists and what the first rung looks like
            return (
              <div style={{
                padding: '14px 16px', borderRadius: 'var(--r)', marginBottom: '24px',
                border: '.5px dashed var(--bd2)', background: 'var(--bg)',
                fontFamily: mono, fontSize: '11px', color: 'var(--tx2)', lineHeight: 1.6,
              }}>
                <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '6px' }}>
                  Contributor Tier
                </div>
                <div>
                  Spot something wrong on a river page? Click <strong style={{ color: 'var(--rvdk)' }}>Improve This River</strong> and submit a correction. Your first approved improvement earns the <strong style={{ color: '#085041' }}>{nextTier?.label}</strong> badge.
                </div>
              </div>
            )
          }

          return (
            <div style={{
              padding: '14px 16px', borderRadius: 'var(--r)', marginBottom: '24px',
              border: `.5px solid ${tier.border}`, background: tier.background,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '24px' }} aria-hidden="true">{tier.icon}</span>
                  <div>
                    <div style={{ fontFamily: mono, fontSize: '9px', color: tier.color, textTransform: 'uppercase', letterSpacing: '.5px', opacity: 0.8 }}>
                      Contributor Tier
                    </div>
                    <div style={{ fontFamily: serif, fontSize: '17px', fontWeight: 700, color: tier.color }}>
                      {tier.label}
                    </div>
                  </div>
                </div>
                {nextTier ? (
                  <div style={{ fontFamily: mono, fontSize: '10px', color: tier.color, textAlign: 'right' }}>
                    <div style={{ opacity: 0.7 }}>Next: {nextTier.label}</div>
                    <div style={{ fontWeight: 600 }}>{toNext} more {toNext === 1 ? 'approval' : 'approvals'}</div>
                  </div>
                ) : (
                  <div style={{ fontFamily: mono, fontSize: '10px', color: tier.color, fontWeight: 600 }}>
                    Top tier reached
                  </div>
                )}
              </div>
              <div style={{ fontFamily: mono, fontSize: '10px', color: tier.color, opacity: 0.85, marginTop: '8px', lineHeight: 1.55 }}>
                {tier.description}
              </div>
              {/* Full ladder so users can see what's next */}
              <div style={{ display: 'flex', gap: '4px', marginTop: '12px', flexWrap: 'wrap' }}>
                {CONTRIBUTOR_TIERS.filter(t => t.key !== 'none').map(t => {
                  const earned = stats.improvements >= t.threshold
                  return (
                    <span
                      key={t.key}
                      title={`${t.label} \u2014 ${t.threshold}+ approvals`}
                      style={{
                        fontFamily: mono, fontSize: '8px', padding: '2px 7px', borderRadius: '8px',
                        background: earned ? t.background : 'var(--bg)',
                        color: earned ? t.color : 'var(--tx3)',
                        border: `.5px solid ${earned ? t.border : 'var(--bd2)'}`,
                        textTransform: 'uppercase', letterSpacing: '.4px',
                        opacity: earned ? 1 : 0.6,
                        cursor: 'help',
                      }}>
                      {t.icon} {t.threshold}
                    </span>
                  )
                })}
              </div>
            </div>
          )
        })()}

        {/* Sign out — kept last so users don't accidentally hit it
            while scrolling through alerts. */}
        <button onClick={signOut} style={{
          fontFamily: mono, fontSize: '11px', padding: '8px 20px', borderRadius: 'var(--r)',
          background: 'var(--bg)', color: 'var(--dg)', border: '.5px solid var(--dg)',
          cursor: 'pointer',
        }}>
          Sign Out
        </button>
      </div>
    </main>
  )
}

// Wrapper for one alert kind. Handles loading/error/empty states so
// the parent doesn't have to repeat them three times. Children are
// the rendered AlertRow elements when there are subscriptions.
function AlertSection({
  anchor, title, subtitle, loading, error, empty, children,
}: {
  anchor: string
  title: string
  subtitle: string
  loading: boolean
  error: string | null
  empty: React.ReactNode
  children: React.ReactNode
}) {
  // Children may be an array of <AlertRow>; we use Array.Children
  // to count rather than relying on length so a single child still
  // works.
  const count = Array.isArray(children) ? children.filter(Boolean).length : (children ? 1 : 0)
  return (
    <div id={anchor} style={{
      padding: '14px 16px', marginBottom: '12px',
      background: 'var(--bg2)', border: '.5px solid var(--bd)',
      borderRadius: 'var(--r)',
      // scroll-margin so anchor jumps don't tuck the heading under
      // the fixed nav (if any). Cheap and harmless either way.
      scrollMarginTop: '80px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px', marginBottom: '2px' }}>
        <div style={{ fontFamily: mono, fontSize: '11px', fontWeight: 600, color: 'var(--tx)' }}>
          {title}
        </div>
        {count > 0 && (
          <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)' }}>
            {count} active
          </div>
        )}
      </div>
      <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)', marginBottom: '10px', lineHeight: 1.5 }}>
        {subtitle}
      </div>
      {loading ? (
        <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)' }}>Loading…</div>
      ) : error ? (
        <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--dg)' }}>
          Couldn&apos;t load: {error}
        </div>
      ) : count === 0 ? (
        <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', lineHeight: 1.6 }}>
          {empty}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {children}
        </div>
      )}
    </div>
  )
}

// Single alert row. Title is the river name; detail is the
// configuration string (threshold, days-before, hatch name…).
// Inactive rows render dimmed but still visible so the user knows
// they exist — they were soft-deleted, not hard-deleted.
function AlertRow({
  title, detail, inactive, disabled, onUnsubscribe,
}: {
  title: string
  detail: string
  inactive: boolean
  disabled: boolean
  onUnsubscribe: () => void
}) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      gap: '10px', padding: '8px 10px',
      background: 'var(--bg)', border: '.5px solid var(--bd2)',
      borderRadius: 'var(--r)',
      opacity: inactive ? 0.55 : 1,
    }}>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {title}{inactive && <span style={{ marginLeft: '6px', fontSize: '9px', color: 'var(--tx3)' }}>(paused)</span>}
        </div>
        {detail && (
          <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {detail}
          </div>
        )}
      </div>
      {!inactive && (
        <button
          onClick={onUnsubscribe}
          disabled={disabled}
          style={{
            fontFamily: mono, fontSize: '9px',
            padding: '5px 10px', borderRadius: 'var(--r)',
            background: 'var(--bg)', color: 'var(--dg)',
            border: '.5px solid var(--bd2)',
            cursor: disabled ? 'wait' : 'pointer',
            flexShrink: 0,
          }}
        >
          {disabled ? '\u2026' : 'Unsubscribe'}
        </button>
      )}
    </div>
  )
}
