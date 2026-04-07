'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const mono = "'IBM Plex Mono', monospace"
const serif = "'Playfair Display', serif"

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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [outfitterId, setOutfitterId] = useState('')
  const [userId, setUserId] = useState('')

  // In production, these would come from auth session
  // For now, manual input for demo
  useEffect(() => {
    const storedOid = localStorage.getItem('riverscout_outfitter_id')
    const storedUid = localStorage.getItem('riverscout_user_id')
    if (storedOid) setOutfitterId(storedOid)
    if (storedUid) setUserId(storedUid)
  }, [])

  const fetchAnalytics = async () => {
    if (!outfitterId || !userId) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/outfitters/analytics?outfitterId=${outfitterId}&userId=${userId}`)
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setAnalytics(data)
        localStorage.setItem('riverscout_outfitter_id', outfitterId)
        localStorage.setItem('riverscout_user_id', userId)
      }
    } catch {
      setError('Failed to load analytics')
    }
    setLoading(false)
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
        {/* Auth / ID input (temp until real auth) */}
        {!analytics && (
          <div style={{ background: 'var(--bg2)', border: '.5px solid var(--bd)', borderRadius: 'var(--rlg)', padding: '20px', marginBottom: '20px' }}>
            <div style={{ fontFamily: serif, fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>
              Outfitter Analytics Dashboard
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <input type="text" placeholder="Outfitter ID" value={outfitterId}
                onChange={e => setOutfitterId(e.target.value)}
                style={{ fontFamily: mono, fontSize: '12px', padding: '8px 12px', border: '.5px solid var(--bd2)', borderRadius: 'var(--r)', background: 'var(--bg)', color: 'var(--tx)', flex: '1 1 200px' }} />
              <input type="text" placeholder="User ID" value={userId}
                onChange={e => setUserId(e.target.value)}
                style={{ fontFamily: mono, fontSize: '12px', padding: '8px 12px', border: '.5px solid var(--bd2)', borderRadius: 'var(--r)', background: 'var(--bg)', color: 'var(--tx)', flex: '1 1 200px' }} />
              <button onClick={fetchAnalytics} disabled={loading || !outfitterId || !userId}
                style={{ fontFamily: mono, fontSize: '11px', padding: '8px 20px', borderRadius: 'var(--r)', border: 'none', background: 'var(--rv)', color: '#fff', cursor: 'pointer' }}>
                {loading ? 'Loading...' : 'Load Dashboard'}
              </button>
            </div>
            {error && <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--dg)', marginTop: '8px' }}>{error}</div>}
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

            {/* Refresh */}
            <div style={{ textAlign: 'center' }}>
              <button onClick={fetchAnalytics}
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
