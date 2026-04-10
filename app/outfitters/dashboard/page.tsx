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
  river_ids?: string[]
}

// Tell Next.js to bust the cached HTML on every river page this
// listing covers. The river page has revalidate=900, so without
// this nudge it would keep serving stale outfitter data for up
// to 15 minutes after every dashboard save.
async function bustRiverCache(riverIds: string[] | undefined) {
  if (!riverIds || riverIds.length === 0) return
  try {
    await fetch('/api/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ riverIds }),
    })
  } catch {
    // Best-effort — a failed revalidation just means the page
    // updates on its own ISR schedule. Don't bubble the error.
  }
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
  // Whether the currently selected listing is publicly visible on
  // its river page(s). Loaded from the outfitters.active column on
  // bootstrap and updated by the publish/unpublish toggle.
  const [isActive, setIsActive] = useState<boolean | null>(null)
  const [togglingActive, setTogglingActive] = useState(false)
  // The river_ids array for the currently selected listing — used
  // to bust ISR cache on those river pages whenever the listing
  // changes (image upload, edit save, publish toggle).
  const [currentRiverIds, setCurrentRiverIds] = useState<string[]>([])
  // Editable text fields — business name, description, website,
  // phone. Loaded alongside the active flag and saved via a single
  // "Save details" button. Form state is held locally so the user
  // can edit freely without writing to the DB on every keystroke.
  const [editForm, setEditForm] = useState({
    business_name: '',
    description: '',
    website: '',
    phone: '',
  })
  const [editDirty, setEditDirty] = useState(false)
  const [savingEdit, setSavingEdit] = useState(false)
  const [editMsg, setEditMsg] = useState('')

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

    // Fetch current images + active state + editable text fields.
    // The browser supabase client carries the auth cookie, so the
    // "Outfitters manage own listing" RLS policy
    // (auth.uid() = user_id) lets us read our own row even when it's
    // inactive (older listings claimed before auto-publish was
    // enabled may still be sitting at active=false).
    try {
      const { data: listing } = await supabase
        .from('outfitters')
        .select('logo_url, cover_photo_url, active, business_name, description, website, phone, river_ids')
        .eq('id', oid)
        .single()
      if (listing) {
        setLogoUrl(listing.logo_url)
        setCoverUrl(listing.cover_photo_url)
        setIsActive(!!listing.active)
        setCurrentRiverIds(Array.isArray(listing.river_ids) ? listing.river_ids : [])
        setEditForm({
          business_name: listing.business_name || '',
          description: listing.description || '',
          website: listing.website || '',
          phone: listing.phone || '',
        })
        setEditDirty(false)
        setEditMsg('')
      }
    } catch {}
  }, [])

  // Save the edited business details. Mirrors the same URL
  // validation rule we use on /outfitters/join (must contain a dot,
  // no whitespace, TLD-shaped suffix) so the saved row always
  // renders cleanly on the river page. Updates via the browser
  // supabase client — same auth pattern as the publish toggle.
  async function saveEdit() {
    if (!outfitterId) return
    const name = editForm.business_name.trim()
    if (!name) {
      setEditMsg('Error: Business name is required.')
      return
    }
    const w = editForm.website.trim()
    if (w && (/\s/.test(w) || !/[a-z0-9-]+\.[a-z]{2,}/i.test(w))) {
      setEditMsg('Error: Website doesn\u2019t look like a valid URL. Use something like thepineriver.com (or leave it blank).')
      return
    }
    setSavingEdit(true)
    setEditMsg('')
    const { error: updErr } = await supabase
      .from('outfitters')
      .update({
        business_name: name,
        description: editForm.description.trim() || null,
        website: w || null,
        phone: editForm.phone.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', outfitterId)
    if (updErr) {
      setEditMsg('Error: ' + updErr.message)
    } else {
      setEditMsg('Saved \u2014 your river page will refresh shortly.')
      setEditDirty(false)
      // Keep the picker in sync if the business name changed.
      setOwnedListings(prev => prev.map(l => l.id === outfitterId ? { ...l, business_name: name } : l))
      // Bust the river-page ISR cache so the new details appear
      // on public pages immediately.
      bustRiverCache(currentRiverIds)
    }
    setSavingEdit(false)
  }

  // Flip the listing's active flag (publish ↔ unpublish). Uses the
  // browser supabase client directly because the
  // "Outfitters manage own listing" RLS policy gates UPDATE on
  // auth.uid() = user_id and the browser client has the auth
  // cookie set. No server route needed.
  async function toggleActive() {
    if (!outfitterId || isActive === null) return
    setTogglingActive(true)
    const next = !isActive
    const { error: updErr } = await supabase
      .from('outfitters')
      .update({ active: next, updated_at: new Date().toISOString() })
      .eq('id', outfitterId)
    if (updErr) {
      setUploadMsg('Error: ' + updErr.message)
    } else {
      setIsActive(next)
      setUploadMsg(next
        ? 'Published \u2014 your listing is now visible on its river page'
        : 'Unpublished \u2014 your listing is now hidden from the public river page')
      // Also update the row in ownedListings so the picker reflects
      // the new state without a full re-bootstrap.
      setOwnedListings(prev => prev.map(l => l.id === outfitterId ? { ...l, active: next } : l))
      // Bust the river-page ISR cache so the listing appears /
      // disappears on public pages immediately.
      bustRiverCache(currentRiverIds)
    }
    setTogglingActive(false)
  }

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
      // Step 1: upload the file. The route just stores it in
      // Supabase Storage and returns the public URL — it does NOT
      // touch the outfitters row anymore (the anon-keyed server
      // client can't pass the auth.uid()=user_id RLS gate, so the
      // old write-from-route silently failed and the river page
      // saw null URLs).
      const res = await fetch('/api/outfitters/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!data.ok) {
        setUploadMsg('Error: ' + (data.error || 'Upload failed'))
        setUploading(null)
        e.target.value = ''
        return
      }

      // Step 2: write the URL to the outfitters row from the
      // browser client. The browser carries the auth cookie, so
      // the existing "Outfitters manage own listing" UPDATE
      // policy lets the owner update their own row.
      const updateField = type === 'logo' ? 'logo_url' : 'cover_photo_url'
      const { error: updErr } = await supabase
        .from('outfitters')
        .update({ [updateField]: data.url, updated_at: new Date().toISOString() })
        .eq('id', outfitterId)

      if (updErr) {
        setUploadMsg('Error: file uploaded but could not link to your listing \u2014 ' + updErr.message)
        setUploading(null)
        e.target.value = ''
        return
      }

      // Step 3: read the row back to verify the URL actually
      // landed in the DB. Supabase RLS update returns no error
      // when zero rows match the policy — it just silently
      // updates nothing — so the only way to be sure the write
      // happened is to re-read. If the verification fails the
      // user gets a clear, actionable error instead of a fake
      // success and a stale dashboard on next visit.
      const { data: verifyRow, error: verifyErr } = await supabase
        .from('outfitters')
        .select(updateField)
        .eq('id', outfitterId)
        .single()

      const savedUrl = (verifyRow as Record<string, string | null> | null)?.[updateField]
      if (verifyErr || savedUrl !== data.url) {
        console.error('[outfitter upload] verification failed', { verifyErr, savedUrl, expected: data.url })
        setUploadMsg(
          'Error: upload reached storage but the listing row didn\u2019t update. ' +
          'This usually means your auth session expired \u2014 sign out and back in, then try again. ' +
          (verifyErr ? `(${verifyErr.message})` : '')
        )
        setUploading(null)
        e.target.value = ''
        return
      }

      if (type === 'logo') setLogoUrl(data.url)
      else setCoverUrl(data.url)
      setUploadMsg(`${type === 'logo' ? 'Logo' : 'Cover photo'} saved \u2014 your river page will refresh shortly.`)

      // Bust the river-page ISR cache so the photo appears on
      // public pages immediately rather than after the 15-minute
      // revalidate window.
      bustRiverCache(currentRiverIds)
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
            {/* Header — title + tier + publish status pill +
                publish/unpublish toggle. The pill makes it clear at
                a glance whether the listing is visible to paddlers
                on the river page; the button lets the owner flip
                that state without involving an admin. */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--rv)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px' }}>
                {analytics.outfitter.tier} tier
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{ fontFamily: serif, fontSize: '22px', fontWeight: 700, color: 'var(--rvdk)' }}>
                  {analytics.outfitter.businessName}
                </div>
                {isActive !== null && (
                  <span
                    title={isActive
                      ? 'Your listing is visible on its river page(s).'
                      : 'Your listing exists but is hidden from public river pages. Click "Publish" to make it visible.'}
                    style={{
                      fontFamily: mono, fontSize: '9px', padding: '3px 9px', borderRadius: '10px',
                      textTransform: 'uppercase', letterSpacing: '.5px', fontWeight: 600,
                      background: isActive ? 'var(--rvlt)' : 'var(--amlt)',
                      color: isActive ? 'var(--rv)' : 'var(--am)',
                      border: `.5px solid ${isActive ? 'var(--rvmd)' : 'var(--am)'}`,
                    }}>
                    {isActive ? 'Live' : 'Hidden'}
                  </span>
                )}
              </div>
              <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)', marginTop: '4px' }}>
                {analytics.period.thisMonth}
              </div>
              {isActive !== null && (
                <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    onClick={toggleActive}
                    disabled={togglingActive}
                    style={{
                      fontFamily: mono, fontSize: '11px', padding: '7px 16px', borderRadius: 'var(--r)',
                      cursor: togglingActive ? 'wait' : 'pointer',
                      background: isActive ? 'var(--bg)' : 'var(--rv)',
                      color: isActive ? 'var(--tx2)' : '#fff',
                      border: isActive ? '.5px solid var(--bd2)' : 'none',
                      opacity: togglingActive ? 0.6 : 1,
                    }}>
                    {togglingActive
                      ? (isActive ? 'Hiding…' : 'Publishing…')
                      : (isActive ? 'Unpublish listing' : 'Publish listing')}
                  </button>
                  {!isActive && (
                    <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--am)', lineHeight: 1.5 }}>
                      Your listing is currently hidden from the public river page. Click Publish to make it visible.
                    </span>
                  )}
                </div>
              )}
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
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Manage Listing
                </div>
                {/* The upload widgets fire as soon as you pick a
                    file — there is no separate save step. Earlier
                    users hit this page expecting a save button and
                    thought their uploads had failed when they
                    couldn't find one. */}
                <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)' }}>
                  Auto-saves on upload — no save button needed
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {/* Logo upload */}
                <div>
                  <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', marginBottom: '6px' }}>Logo</div>
                  {logoUrl ? (
                    <div style={{ position: 'relative', marginBottom: '6px', width: '80px' }}>
                      <img src={logoUrl} alt="Logo" style={{ width: '80px', height: '80px', objectFit: 'contain', borderRadius: '8px', border: '.5px solid var(--bd)' }} />
                      <span title="Saved to your listing" style={{
                        position: 'absolute', top: '-4px', right: '-4px',
                        width: '18px', height: '18px', borderRadius: '50%',
                        background: 'var(--rv)', color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '11px', fontWeight: 700, lineHeight: 1,
                        border: '1.5px solid var(--bg)',
                      }}>&#10003;</span>
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
                  {logoUrl && (
                    <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--rv)', marginTop: '4px', fontWeight: 600 }}>
                      &#10003; Saved &mdash; visible on river page
                    </div>
                  )}
                  <div style={{ fontFamily: mono, fontSize: '8px', color: 'var(--tx3)', marginTop: '4px' }}>Auto-saves on upload &middot; Max 5MB &middot; Square recommended</div>
                </div>

                {/* Cover photo upload */}
                <div>
                  <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', marginBottom: '6px' }}>Cover Photo</div>
                  {coverUrl ? (
                    <div style={{ position: 'relative', marginBottom: '6px' }}>
                      <img src={coverUrl} alt="Cover" style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '.5px solid var(--bd)' }} />
                      <span title="Saved to your listing" style={{
                        position: 'absolute', top: '-4px', right: '-4px',
                        width: '18px', height: '18px', borderRadius: '50%',
                        background: 'var(--rv)', color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '11px', fontWeight: 700, lineHeight: 1,
                        border: '1.5px solid var(--bg)',
                      }}>&#10003;</span>
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
                  {coverUrl && (
                    <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--rv)', marginTop: '4px', fontWeight: 600 }}>
                      &#10003; Saved &mdash; visible on river page
                    </div>
                  )}
                  <div style={{ fontFamily: mono, fontSize: '8px', color: 'var(--tx3)', marginTop: '4px' }}>Auto-saves on upload &middot; Max 10MB &middot; 16:9 landscape recommended</div>
                </div>
              </div>

              {uploadMsg && (
                <div style={{ fontFamily: mono, fontSize: '10px', marginTop: '8px', color: uploadMsg.startsWith('Error') ? 'var(--dg)' : 'var(--rv)' }}>
                  {uploadMsg}
                </div>
              )}
            </div>

            {/* Edit Listing Details — business name, description,
                website, phone. All four fields write directly to the
                outfitters row via the browser supabase client (the
                "Outfitters manage own listing" RLS policy lets the
                owner update their own row). The Save button is the
                explicit commit step — text fields are dirty-tracked
                so the button only enables when there's something to
                save. Website is validated with the same heuristic
                we use on /outfitters/join (must contain a dot, no
                whitespace) so a saved row never produces a 404 link
                on the river page. */}
            <div style={{ background: 'var(--bg2)', border: '.5px solid var(--bd)', borderRadius: 'var(--rlg)', padding: '16px', marginTop: '16px' }}>
              <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                Edit Listing Details
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                <label style={{ display: 'block' }}>
                  <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', marginBottom: '4px' }}>Business name</div>
                  <input
                    type="text"
                    value={editForm.business_name}
                    onChange={e => { setEditForm(f => ({ ...f, business_name: e.target.value })); setEditDirty(true); setEditMsg('') }}
                    placeholder="Pine River Paddlesports Center"
                    style={{ width: '100%', fontFamily: mono, fontSize: '12px', padding: '8px 10px', border: '.5px solid var(--bd2)', borderRadius: 'var(--r)', background: 'var(--bg)', color: 'var(--tx)', boxSizing: 'border-box' }}
                  />
                </label>

                <label style={{ display: 'block' }}>
                  <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', marginBottom: '4px' }}>Description</div>
                  <textarea
                    value={editForm.description}
                    onChange={e => { setEditForm(f => ({ ...f, description: e.target.value })); setEditDirty(true); setEditMsg('') }}
                    placeholder="Full-service outfitter, shuttles, gear, camping. Family-friendly trips daily May–October."
                    rows={3}
                    style={{ width: '100%', fontFamily: mono, fontSize: '12px', padding: '8px 10px', border: '.5px solid var(--bd2)', borderRadius: 'var(--r)', background: 'var(--bg)', color: 'var(--tx)', boxSizing: 'border-box', resize: 'vertical', lineHeight: 1.5 }}
                  />
                  <div style={{ fontFamily: mono, fontSize: '8px', color: 'var(--tx3)', marginTop: '3px' }}>Shown under your business name on the river page.</div>
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <label style={{ display: 'block' }}>
                    <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', marginBottom: '4px' }}>Website</div>
                    <input
                      type="text"
                      value={editForm.website}
                      onChange={e => { setEditForm(f => ({ ...f, website: e.target.value })); setEditDirty(true); setEditMsg('') }}
                      placeholder="thepineriver.com"
                      style={{ width: '100%', fontFamily: mono, fontSize: '12px', padding: '8px 10px', border: '.5px solid var(--bd2)', borderRadius: 'var(--r)', background: 'var(--bg)', color: 'var(--tx)', boxSizing: 'border-box' }}
                    />
                    <div style={{ fontFamily: mono, fontSize: '8px', color: 'var(--tx3)', marginTop: '3px' }}>Domain or full URL. Leave blank if none.</div>
                  </label>

                  <label style={{ display: 'block' }}>
                    <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', marginBottom: '4px' }}>Phone</div>
                    <input
                      type="text"
                      value={editForm.phone}
                      onChange={e => { setEditForm(f => ({ ...f, phone: e.target.value })); setEditDirty(true); setEditMsg('') }}
                      placeholder="(231) 555-0123"
                      style={{ width: '100%', fontFamily: mono, fontSize: '12px', padding: '8px 10px', border: '.5px solid var(--bd2)', borderRadius: 'var(--r)', background: 'var(--bg)', color: 'var(--tx)', boxSizing: 'border-box' }}
                    />
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '14px', flexWrap: 'wrap' }}>
                <button
                  onClick={saveEdit}
                  disabled={savingEdit || !editDirty}
                  style={{
                    fontFamily: mono, fontSize: '11px', padding: '8px 20px', borderRadius: 'var(--r)',
                    border: 'none',
                    background: editDirty && !savingEdit ? 'var(--rv)' : 'var(--bg3)',
                    color: editDirty && !savingEdit ? '#fff' : 'var(--tx3)',
                    cursor: editDirty && !savingEdit ? 'pointer' : 'default',
                    opacity: savingEdit ? 0.6 : 1,
                  }}>
                  {savingEdit ? 'Saving…' : editDirty ? 'Save details' : 'Saved'}
                </button>
                {editMsg && (
                  <span style={{ fontFamily: mono, fontSize: '10px', color: editMsg.startsWith('Error') ? 'var(--dg)' : 'var(--rv)' }}>
                    {editMsg}
                  </span>
                )}
              </div>
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
