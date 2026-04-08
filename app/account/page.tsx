'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const mono = "'IBM Plex Mono', monospace"
const serif = "'Playfair Display', serif"

interface ProfileData {
  display_name: string | null
  email: string | null
  home_state: string | null
  is_pro: boolean
  pro_tier: string | null
  pro_expires_at: string | null
  stripe_customer_id: string | null
}

interface Stats {
  savedRivers: number
  tripReports: number
  improvements: number
}

export default function AccountPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [stats, setStats] = useState<Stats>({ savedRivers: 0, tripReports: 0, improvements: 0 })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editName, setEditName] = useState('')
  const [editState, setEditState] = useState('')
  const [portalLoading, setPortalLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const uid = data.user?.id
      if (!uid) { setLoading(false); return }
      setUserId(uid)

      // Fetch profile
      const { data: prof } = await supabase
        .from('user_profiles')
        .select('display_name, email, home_state, is_pro, pro_tier, pro_expires_at, stripe_customer_id')
        .eq('id', uid)
        .single()

      if (prof) {
        setProfile(prof)
        setEditName(prof.display_name || '')
        setEditState(prof.home_state || '')
      }

      // Fetch stats
      const [saved, trips, improvements] = await Promise.all([
        supabase.from('saved_rivers').select('*', { count: 'exact', head: true }).eq('user_id', uid),
        supabase.from('trip_reports').select('*', { count: 'exact', head: true }).eq('user_id', uid),
        supabase.from('suggestions').select('*', { count: 'exact', head: true }).eq('user_id', uid).eq('status', 'approved'),
      ])

      setStats({
        savedRivers: saved.count ?? 0,
        tripReports: trips.count ?? 0,
        improvements: improvements.count ?? 0,
      })

      setLoading(false)
    })
  }, [])

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
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', height: '44px', borderBottom: '.5px solid var(--bd)',
      }}>
        <Link href="/" style={{ fontFamily: serif, fontSize: '18px', fontWeight: 700, color: 'var(--rvdk)', letterSpacing: '-.3px', textDecoration: 'none' }}>
          River<span style={{ color: 'var(--wt)' }}>Scout</span>
        </Link>
        <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)' }}>Account</span>
      </nav>

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
              <div style={{ fontFamily: mono, fontSize: '12px', color: 'var(--tx2)' }}>Free account</div>
            </div>
            <Link href="/pro" style={{
              fontFamily: mono, fontSize: '10px', fontWeight: 500, padding: '6px 14px', borderRadius: 'var(--r)',
              background: 'var(--rvdk)', color: '#fff', textDecoration: 'none',
            }}>
              Upgrade to Pro &rarr;
            </Link>
          </div>
        )}

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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
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

        {/* Sign out */}
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
