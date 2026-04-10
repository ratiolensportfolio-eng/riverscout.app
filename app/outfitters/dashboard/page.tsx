'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const mono = "'IBM Plex Mono', monospace"
const serif = "'Playfair Display', serif"

interface OwnedListing {
  id: string
  business_name: string
  tier: string
  active: boolean
}

interface Analytics {
  outfitter: { id: string; businessName: string; tier: string }
  period: { thisMonth: string; lastMonth: string }
  clicksThisMonth: number
  clicksLastMonth: number
  monthOverMonth: number
  byRiver: Array<{ riverId: string; count: number }>
  bySource: Array<{ source: string; count: number }>
  daily: Array<{ date: string; count: number }>
  estimatedBookings: { low: number; high: number; rate: string }
}

const sourceLabels: Record<string, string> = {
  overview: 'Overview Tab',
  outfitters_tab: 'Outfitters Tab',
  flow_alert: 'Flow Alert Email',
  search: 'Search Results',
  guide_tab: 'Fishing / Guides Tab',
  direct: 'Direct / Other',
}

const sourceColors: Record<string, string> = {
  overview: 'var(--rv)',
  outfitters_tab: 'var(--wt)',
  flow_alert: 'var(--am)',
  search: 'var(--lo)',
  guide_tab: '#BA7517',
  direct: 'var(--tx3)',
}

export default function OutfitterDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [outfitterId, setOutfitterId] = useState('')
  const [userId, setUserId] = useState('')
  const [authState, setAuthState] = useState<'loading' | 'signed-out' | 'no-listing' | 'has-listing' | 'pick-listing'>('loading')
  const [ownedListings, setOwnedListings] = useState<OwnedListing[]>([])
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [coverUrl, setCoverUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState<'logo' | 'cover' | null>(null)
  const [uploadMsg, setUploadMsg] = useState('')

  const fetchAnalytics = useCallback(async (oid: string, uid: string) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/outfitters/analytics?outfitterId=${oid}&userId=${uid}`)
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setAnalytics(data)
      }
    } catch {
      setError('Failed to load analytics')
    }
    setLoading(false)

    // Fetch current images. The browser supabase client carries the
    // auth cookie, so the "Outfitters manage own listing" RLS policy
    // (auth.uid() = user_id) lets us read our own row even when it's
    // inactive (newly claimed listings start active=false).
    try {
      const { data: listing } = await supabase
        .from('outfitters')
        .select('logo_url, cover_photo_url')
        .eq('id', oid)
        .single()
      if (listing) {
        setLogoUrl(listing.logo_url)
        setCoverUrl(listing.cover_photo_url)
      }
    } catch {}
  }, [])

  // Auth-aware bootstrap. On mount we resolve the current user from
  // the supabase session, look up their owned outfitter rows, and
  // auto-load the dashboard for the first one. The old version asked
  // for an Outfitter ID and User ID via free-text inputs — that was a
  // pre-auth demo affordance and is gone now.
  useEffect(() => {
    let cancelled = false
    async function bootstrap() {
      const { data: userRes } = await supabase.auth.getUser()
      const user = userRes.user
      if (cancelled) return

      if (!user) {
        setAuthState('signed-out')
        setLoading(false)
        return
      }

      setUserId(user.id)

      // Look up every outfitter row this user owns. The browser
      // client has auth.uid() set via cookies, so the
      // "Outfitters manage own listing" SELECT policy returns the
      // user's own rows even when they're still inactive.
      const { data: rows, error: listErr } = await supabase
        .from('outfitters')
        .select('id, business_name, tier, active')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (cancelled) return

      if (listErr) {
        setError(`Couldn't load your listings: ${listErr.message}`)
        setAuthState('no-listing')
        setLoading(false)
        return
      }

      const listings = (rows || []) as OwnedListing[]
      setOwnedListings(listings)

      if (listings.length === 0) {
        setAuthState('no-listing')
        setLoading(false)
        return
      }

      if (listings.length === 1) {
        setAuthState('has-listing')
        setOutfitterId(listings[0].id)
        await fetchAnalytics(listings[0].id, user.id)
        return
      }

      // Multiple listings — show a picker. Default to the first
      // until the user chooses; user can switch with the picker UI.
      setAuthState('pick-listing')
      setOutfitterId(listings[0].id)
      await fetchAnalytics(listings[0].id, user.id)
    }
    bootstrap()
    return () => { cancelled = true }
  }, [fetchAnalytics])

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'cover') {
    const file = e.target.files?.[0]
    if (!file || !outfitterId) return
    setUploading(type)
    setUploadMsg('')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('outfitterId', outfitterId)
    formData.append('type', type)

    try {
      const res = await fetch('/api/outfitters/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.ok) {
        if (type === 'logo') setLogoUrl(data.url)
        else setCoverUrl(data.url)
        setUploadMsg(`${type === 'logo' ? 'Logo' : 'Cover photo'} updated!`)
      } else {
        setUploadMsg('Error: ' + (data.error || 'Upload failed'))
      }
    } catch {
      setUploadMsg('Error: Network error')
    }
    setUploading(null)
    e.target.value = ''
  }

  const maxDaily = analytics ? Math.max(...analytics.daily.map(d => d.count), 1) : 1

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--tx)' }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', height: '44px', borderBottom: '.5px solid var(--bd)',
      }}>
        <Link href="/" style={{ fontFamily: serif, fontSize: '18px', fontWeight: 700, color: 'var(--rvdk)', letterSpacing: '-.3px', textDecoration: 'none' }}>
          River<span style={{ color: 'var(--wt)' }}>Scout</span>
        </Link>
        <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--rv)', padding: '5px 10px', borderRadius: '20px', border: '.5px solid var(--rvmd)', background: 'var(--rvlt)' }}>
          Outfitter Dashboard
        </div>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px 28px' }}>
        {/* Bootstrap states — replace the old manual ID input form
            with auth-aware empty / picker / signed-out branches. */}
        {authState === 'loading' && (
          <div style={{ fontFamily: mono, fontSize: '12px', color: 'var(--tx3)', textAlign: 'center', padding: '60px 0' }}>
            Loading your listings…
          </div>
        )}

        {authState === 'signed-out' && (
          <div style={{ background: 'var(--bg2)', border: '.5px solid var(--bd)', borderRadius: 'var(--rlg)', padding: '32px', textAlign: 'center' }}>
            <div style={{ fontFamily: serif, fontSize: '20px', fontWeight: 700, color: 'var(--rvdk)', marginBottom: '8px' }}>
              Sign in to view your dashboard
            </div>
            <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx2)', marginBottom: '20px' }}>
              You need to be signed in to manage your outfitter listing.
            </div>
            <Link href="/login?redirect=%2Foutfitters%2Fdashboard" style={{
              display: 'inline-block', padding: '10px 24px', fontFamily: mono, fontSize: '12px', fontWeight: 500,
              background: 'var(--rv)', color: '#fff', borderRadius: 'var(--r)', textDecoration: 'none',
            }}>
              Sign in
            </Link>
          </div>
        )}

        {authState === 'no-listing' && (
          <div style={{ background: 'var(--bg2)', border: '.5px solid var(--bd)', borderRadius: 'var(--rlg)', padding: '32px', textAlign: 'center' }}>
            <div style={{ fontFamily: serif, fontSize: '20px', fontWeight: 700, color: 'var(--rvdk)', marginBottom: '8px' }}>
              No listings yet
            </div>
            <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx2)', marginBottom: '20px', lineHeight: 1.6 }}>
              You don&rsquo;t have any outfitter listings on this account yet.
              {error && <><br /><span style={{ color: 'var(--dg)' }}>{error}</span></>}
            </div>
            <Link href="/outfitters/join" style={{
              display: 'inline-block', padding: '10px 24px', fontFamily: mono, fontSize: '12px', fontWeight: 500,
              background: 'var(--rv)', color: '#fff', borderRadius: 'var(--r)', textDecoration: 'none',
            }}>
              Claim your listing
            </Link>
          </div>
        )}

        {/* Listing picker — only shown when the user owns more than
            one outfitter. Lets them switch which one the dashboard
            is showing without leaving the page. */}
        {authState === 'pick-listing' && ownedListings.length > 1 && (
          <div style={{ background: 'var(--bg2)', border: '.5px solid var(--bd)', borderRadius: 'var(--r)', padding: '12px 14px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.5px' }}>
              Listing
            </span>
            <select
              value={outfitterId}
              onChange={e => {
                const newOid = e.target.value
                setOutfitterId(newOid)
                if (userId) fetchAnalytics(newOid, userId)
              }}
              style={{ fontFamily: mono, fontSize: '12px', padding: '6px 10px', border: '.5px solid var(--bd2)', borderRadius: 'var(--r)', background: 'var(--bg)', color: 'var(--tx)', flex: '1 1 240px' }}
            >
              {ownedListings.map(l => (
                <option key={l.id} value={l.id}>
                  {l.business_name} {l.active ? '' : '(pending review)'}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Inline error banner for analytics-fetch failures while in
            a signed-in / has-listing state. */}
        {(authState === 'has-listing' || authState === 'pick-listing') && error && (
          <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--dg)', background: 'var(--dglt)', border: '.5px solid var(--dg)', borderRadius: 'var(--r)', padding: '10px 12px', marginBottom: '14px' }}>
            {error}
          </div>
        )}

        {analytics && (
          <>
            {/* Header */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--rv)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px' }}>
                {analytics.outfitter.tier} tier
              </div>
              <div style={{ fontFamily: serif, fontSize: '22px', fontWeight: 700, color: 'var(--rvdk)' }}>
                {analytics.outfitter.businessName}
              </div>
              <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)', marginTop: '4px' }}>
                {analytics.period.thisMonth}
              </div>
            </div>

            {/* Top-line stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '20px' }}>
              {/* Clicks this month */}
              <div style={{ background: 'var(--bg2)', border: '.5px solid var(--bd)', borderRadius: 'var(--r)', padding: '14px' }}>
                <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '4px' }}>
                  Clicks This Month
                </div>
                <div style={{ fontFamily: serif, fontSize: '28px', fontWeight: 700, color: 'var(--rvdk)' }}>
                  {analytics.clicksThisMonth}
                </div>
              </div>

              {/* Month over month */}
              <div style={{ background: 'var(--bg2)', border: '.5px solid var(--bd)', borderRadius: 'var(--r)', padding: '14px' }}>
                <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '4px' }}>
                  vs {analytics.period.lastMonth}
                </div>
                <div style={{
                  fontFamily: serif, fontSize: '28px', fontWeight: 700,
                  color: analytics.monthOverMonth >= 0 ? 'var(--rv)' : 'var(--dg)',
                }}>
                  {analytics.monthOverMonth >= 0 ? '+' : ''}{analytics.monthOverMonth}%
                </div>
                <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)' }}>
                  {analytics.clicksLastMonth} clicks last month
                </div>
              </div>

              {/* Estimated bookings */}
              <div style={{ background: 'var(--rvlt)', border: '.5px solid var(--rvmd)', borderRadius: 'var(--r)', padding: '14px' }}>
                <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--rv)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '4px' }}>
                  Est. Bookings
                </div>
                <div style={{ fontFamily: serif, fontSize: '28px', fontWeight: 700, color: 'var(--rvdk)' }}>
                  {analytics.estimatedBookings.low}–{analytics.estimatedBookings.high}
                </div>
                <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--rv)' }}>
                  at {analytics.estimatedBookings.rate} conversion
                </div>
              </div>
            </div>

            {/* Daily clicks chart */}
            {analytics.daily.length > 0 && (
              <div style={{ background: 'var(--bg2)', border: '.5px solid var(--bd)', borderRadius: 'var(--rlg)', padding: '16px', marginBottom: '16px' }}>
                <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                  Daily Clicks
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '80px' }}>
                  {analytics.daily.map((d, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                      <div style={{
                        width: '100%', maxWidth: '20px',
                        height: `${Math.max(4, (d.count / maxDaily) * 70)}px`,
                        background: 'var(--rv)', borderRadius: '2px 2px 0 0',
                      }} />
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: mono, fontSize: '8px', color: 'var(--tx3)', marginTop: '4px' }}>
                  <span>{analytics.daily[0]?.date.slice(5)}</span>
                  <span>{analytics.daily[analytics.daily.length - 1]?.date.slice(5)}</span>
                </div>
              </div>
            )}

            {/* Clicks by source + by river */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              {/* By source */}
              <div style={{ background: 'var(--bg2)', border: '.5px solid var(--bd)', borderRadius: 'var(--rlg)', padding: '16px' }}>
                <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
                  Clicks by Source
                </div>
                {analytics.bySource.length === 0 && (
                  <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)' }}>No data yet</div>
                )}
                {analytics.bySource.map((s, i) => (
                  <div key={i} style={{ marginBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span style={{ fontFamily: mono, fontSize: '10px' }}>{sourceLabels[s.source] || s.source}</span>
                      <span style={{ fontFamily: mono, fontSize: '10px', fontWeight: 600 }}>{s.count}</span>
                    </div>
                    <div style={{ height: '4px', background: 'var(--bg3)', borderRadius: '2px' }}>
                      <div style={{
                        height: '100%', borderRadius: '2px',
                        width: `${(s.count / analytics.clicksThisMonth) * 100}%`,
                        background: sourceColors[s.source] || 'var(--tx3)',
                      }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* By river */}
              <div style={{ background: 'var(--bg2)', border: '.5px solid var(--bd)', borderRadius: 'var(--rlg)', padding: '16px' }}>
                <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
                  Clicks by River
                </div>
                {analytics.byRiver.length === 0 && (
                  <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)' }}>No data yet</div>
                )}
                {analytics.byRiver.map((r, i) => (
                  <div key={i} style={{ marginBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span style={{ fontFamily: mono, fontSize: '10px' }}>{r.riverId}</span>
                      <span style={{ fontFamily: mono, fontSize: '10px', fontWeight: 600 }}>{r.count}</span>
                    </div>
                    <div style={{ height: '4px', background: 'var(--bg3)', borderRadius: '2px' }}>
                      <div style={{
                        height: '100%', borderRadius: '2px',
                        width: `${(r.count / analytics.clicksThisMonth) * 100}%`,
                        background: 'var(--wt)',
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Manage Listing — Logo & Cover Photo */}
            <div style={{ background: 'var(--bg2)', border: '.5px solid var(--bd)', borderRadius: 'var(--rlg)', padding: '16px', marginTop: '20px' }}>
              <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                Manage Listing
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {/* Logo upload */}
                <div>
                  <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', marginBottom: '6px' }}>Logo</div>
                  {logoUrl ? (
                    <div style={{ position: 'relative', marginBottom: '6px' }}>
                      <img src={logoUrl} alt="Logo" style={{ width: '80px', height: '80px', objectFit: 'contain', borderRadius: '8px', border: '.5px solid var(--bd)' }} />
                    </div>
                  ) : (
                    <div style={{ width: '80px', height: '80px', borderRadius: '8px', background: 'var(--bg3)', border: '.5px dashed var(--bd2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '6px' }}>
                      <span style={{ fontFamily: mono, fontSize: '20px', color: 'var(--tx3)' }}>R</span>
                    </div>
                  )}
                  <label style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: uploading === 'logo' ? 'wait' : 'pointer',
                    fontFamily: mono, fontSize: '9px', color: 'var(--rv)',
                    padding: '4px 10px', border: '.5px solid var(--rvmd)', borderRadius: 'var(--r)',
                    background: 'var(--bg)', opacity: uploading === 'logo' ? 0.6 : 1,
                  }}>
                    {uploading === 'logo' ? 'Uploading...' : logoUrl ? 'Change' : 'Upload Logo'}
                    <input type="file" accept="image/*" disabled={uploading !== null}
                      onChange={e => handleImageUpload(e, 'logo')}
                      style={{ display: 'none' }} />
                  </label>
                  <div style={{ fontFamily: mono, fontSize: '8px', color: 'var(--tx3)', marginTop: '4px' }}>Max 5MB · Square recommended</div>
                </div>

                {/* Cover photo upload */}
                <div>
                  <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', marginBottom: '6px' }}>Cover Photo</div>
                  {coverUrl ? (
                    <div style={{ position: 'relative', marginBottom: '6px' }}>
                      <img src={coverUrl} alt="Cover" style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '.5px solid var(--bd)' }} />
                    </div>
                  ) : (
                    <div style={{ width: '100%', height: '80px', borderRadius: '8px', background: 'var(--bg3)', border: '.5px dashed var(--bd2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '6px' }}>
                      <span style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)' }}>No cover photo</span>
                    </div>
                  )}
                  <label style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: uploading === 'cover' ? 'wait' : 'pointer',
                    fontFamily: mono, fontSize: '9px', color: 'var(--rv)',
                    padding: '4px 10px', border: '.5px solid var(--rvmd)', borderRadius: 'var(--r)',
                    background: 'var(--bg)', opacity: uploading === 'cover' ? 0.6 : 1,
                  }}>
                    {uploading === 'cover' ? 'Uploading...' : coverUrl ? 'Change' : 'Upload Cover'}
                    <input type="file" accept="image/*" disabled={uploading !== null}
                      onChange={e => handleImageUpload(e, 'cover')}
                      style={{ display: 'none' }} />
                  </label>
                  <div style={{ fontFamily: mono, fontSize: '8px', color: 'var(--tx3)', marginTop: '4px' }}>Max 10MB · 16:9 landscape recommended</div>
                </div>
              </div>

              {uploadMsg && (
                <div style={{ fontFamily: mono, fontSize: '10px', marginTop: '8px', color: uploadMsg.startsWith('Error') ? 'var(--dg)' : 'var(--rv)' }}>
                  {uploadMsg}
                </div>
              )}
            </div>

            {/* Refresh */}
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button onClick={() => { if (outfitterId && userId) fetchAnalytics(outfitterId, userId) }}
                style={{ fontFamily: mono, fontSize: '10px', color: 'var(--rv)', background: 'none', border: '.5px solid var(--rvmd)', borderRadius: 'var(--r)', padding: '6px 14px', cursor: 'pointer' }}>
                Refresh Data
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
