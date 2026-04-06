'use client'

import { useState, useEffect, useCallback } from 'react'

interface FlowAlert {
  id: string
  email: string
  river_id: string
  river_name: string
  threshold: string
  active: boolean
  last_notified_at: string | null
  created_at: string
}

interface RiverOption {
  id: string
  name: string
  stateKey: string
  stateName: string
  condition: string
  cfs: number | null
}

interface Props {
  rivers: RiverOption[]
}

const THRESHOLD_LABELS: Record<string, string> = {
  optimal: 'Optimal flow',
  high: 'High water',
  flood: 'Flood warning',
  any: 'Any change',
}

export default function AlertSubscriber({ rivers }: Props) {
  const [email, setEmail] = useState('')
  const [savedEmail, setSavedEmail] = useState('')
  const [alerts, setAlerts] = useState<FlowAlert[]>([])
  const [loading, setLoading] = useState(false)
  const [subRiver, setSubRiver] = useState('')
  const [subThreshold, setSubThreshold] = useState<string>('optimal')
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null)
  const [search, setSearch] = useState('')

  // Load saved email from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('riverscout_alert_email')
    if (stored) {
      setEmail(stored)
      setSavedEmail(stored)
    }
  }, [])

  // Fetch existing alerts when email is set
  const fetchAlerts = useCallback(async (e: string) => {
    if (!e) return
    try {
      const res = await fetch(`/api/alerts?email=${encodeURIComponent(e)}`)
      const data = await res.json()
      if (data.alerts) setAlerts(data.alerts)
    } catch {
      // silently fail
    }
  }, [])

  useEffect(() => {
    if (savedEmail) fetchAlerts(savedEmail)
  }, [savedEmail, fetchAlerts])

  const handleSetEmail = () => {
    if (!email.includes('@')) return
    localStorage.setItem('riverscout_alert_email', email)
    setSavedEmail(email)
    setMessage(null)
  }

  const handleSubscribe = async () => {
    if (!savedEmail || !subRiver) return
    setLoading(true)
    setMessage(null)

    const river = rivers.find(r => r.id === subRiver)
    if (!river) { setLoading(false); return }

    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: savedEmail,
          riverId: river.id,
          riverName: river.name,
          stateKey: river.stateKey,
          threshold: subThreshold,
        }),
      })
      const data = await res.json()
      if (data.ok) {
        setMessage({ text: `Alert set for ${river.name}`, ok: true })
        setSubRiver('')
        fetchAlerts(savedEmail)
      } else {
        setMessage({ text: data.error || 'Failed to create alert', ok: false })
      }
    } catch {
      setMessage({ text: 'Network error', ok: false })
    }
    setLoading(false)
  }

  const handleDelete = async (riverId: string) => {
    if (!savedEmail) return
    try {
      await fetch('/api/alerts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: savedEmail, riverId }),
      })
      setAlerts(prev => prev.filter(a => a.river_id !== riverId))
    } catch {
      // silently fail
    }
  }

  const mono = "'IBM Plex Mono', monospace"
  const serif = "'Playfair Display', serif"

  const filteredRivers = search
    ? rivers.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.stateName.toLowerCase().includes(search.toLowerCase())
      )
    : rivers

  return (
    <div style={{ padding: '20px 28px' }}>
      {/* Email setup */}
      <div style={{
        background: 'var(--bg2)', border: '.5px solid var(--bd)',
        borderRadius: 'var(--rlg)', padding: '16px 20px', marginBottom: '20px',
      }}>
        <div style={{ fontFamily: serif, fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>
          Flow Alert Notifications
        </div>
        <p style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx2)', marginBottom: '12px', lineHeight: 1.5 }}>
          Get notified when your favorite rivers hit optimal paddling conditions. Alerts check every 15 minutes via live USGS gauge data.
        </p>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSetEmail()}
            style={{
              fontFamily: mono, fontSize: '12px', padding: '7px 12px',
              border: '.5px solid var(--bd2)', borderRadius: 'var(--r)',
              background: 'var(--bg)', color: 'var(--tx)', outline: 'none',
              width: '240px',
            }}
          />
          <button
            onClick={handleSetEmail}
            style={{
              fontFamily: mono, fontSize: '11px', padding: '7px 16px',
              borderRadius: 'var(--r)', border: '.5px solid var(--rvmd)',
              background: 'var(--rvlt)', color: 'var(--rvdk)', cursor: 'pointer',
            }}
          >
            {savedEmail ? 'Update' : 'Set Email'}
          </button>
          {savedEmail && (
            <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--rv)' }}>
              ● Alerts active for {savedEmail}
            </span>
          )}
        </div>
      </div>

      {savedEmail && (
        <>
          {/* Subscribe to a river */}
          <div style={{
            background: 'var(--bg2)', border: '.5px solid var(--bd)',
            borderRadius: 'var(--rlg)', padding: '16px 20px', marginBottom: '20px',
          }}>
            <div style={{ fontFamily: serif, fontSize: '14px', fontWeight: 600, marginBottom: '10px' }}>
              Add Alert
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* River search/select */}
              <div style={{ position: 'relative', flex: '1 1 200px' }}>
                <input
                  type="text"
                  placeholder="Search rivers..."
                  value={search || (subRiver ? rivers.find(r => r.id === subRiver)?.name ?? '' : '')}
                  onChange={e => { setSearch(e.target.value); setSubRiver('') }}
                  style={{
                    fontFamily: mono, fontSize: '12px', padding: '7px 12px',
                    border: '.5px solid var(--bd2)', borderRadius: 'var(--r)',
                    background: 'var(--bg)', color: 'var(--tx)', outline: 'none',
                    width: '100%',
                  }}
                />
                {search && !subRiver && filteredRivers.length > 0 && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 20,
                    background: 'var(--bg)', border: '.5px solid var(--bd2)',
                    borderRadius: 'var(--r)', maxHeight: '200px', overflowY: 'auto',
                    boxShadow: '0 4px 16px rgba(0,0,0,.12)',
                  }}>
                    {filteredRivers.slice(0, 10).map(r => (
                      <div
                        key={r.id}
                        onClick={() => { setSubRiver(r.id); setSearch('') }}
                        style={{
                          padding: '6px 12px', cursor: 'pointer', fontSize: '12px', fontFamily: mono,
                          borderBottom: '.5px solid var(--bd)',
                        }}
                      >
                        <span style={{ fontWeight: 500 }}>{r.name}</span>
                        <span style={{ color: 'var(--tx3)', marginLeft: '6px' }}>{r.stateName}</span>
                        {r.cfs !== null && (
                          <span style={{
                            marginLeft: '8px', fontSize: '10px', padding: '1px 5px', borderRadius: '3px',
                            background: r.condition === 'optimal' ? 'var(--rvlt)' : r.condition === 'high' ? 'var(--amlt)' : r.condition === 'flood' ? 'var(--dglt)' : 'var(--bg3)',
                            color: r.condition === 'optimal' ? 'var(--rvdk)' : r.condition === 'high' ? 'var(--am)' : r.condition === 'flood' ? 'var(--dg)' : 'var(--tx3)',
                          }}>
                            {r.cfs.toLocaleString()} cfs
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Threshold select */}
              <select
                value={subThreshold}
                onChange={e => setSubThreshold(e.target.value)}
                style={{
                  fontFamily: mono, fontSize: '12px', padding: '7px 12px',
                  border: '.5px solid var(--bd2)', borderRadius: 'var(--r)',
                  background: 'var(--bg)', color: 'var(--tx)', outline: 'none',
                }}
              >
                <option value="optimal">When optimal</option>
                <option value="high">When high</option>
                <option value="flood">When flood</option>
                <option value="any">Any condition change</option>
              </select>

              <button
                onClick={handleSubscribe}
                disabled={!subRiver || loading}
                style={{
                  fontFamily: mono, fontSize: '11px', padding: '7px 16px',
                  borderRadius: 'var(--r)', border: '.5px solid var(--rvmd)',
                  background: subRiver ? 'var(--rvlt)' : 'var(--bg3)',
                  color: subRiver ? 'var(--rvdk)' : 'var(--tx3)',
                  cursor: subRiver ? 'pointer' : 'default',
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? 'Saving...' : 'Subscribe'}
              </button>
            </div>

            {message && (
              <div style={{
                fontFamily: mono, fontSize: '11px', marginTop: '8px',
                color: message.ok ? 'var(--rv)' : 'var(--dg)',
              }}>
                {message.ok ? '●' : '⚠'} {message.text}
              </div>
            )}
          </div>

          {/* Active alerts */}
          {alerts.length > 0 && (
            <div style={{
              background: 'var(--bg2)', border: '.5px solid var(--bd)',
              borderRadius: 'var(--rlg)', padding: '16px 20px', marginBottom: '20px',
            }}>
              <div style={{ fontFamily: serif, fontSize: '14px', fontWeight: 600, marginBottom: '10px' }}>
                My Alerts ({alerts.length})
              </div>
              {alerts.map(alert => {
                const river = rivers.find(r => r.id === alert.river_id)
                return (
                  <div key={alert.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 0', borderBottom: '.5px solid var(--bd)',
                  }}>
                    <div>
                      <div style={{ fontFamily: serif, fontSize: '13px', fontWeight: 600 }}>
                        {alert.river_name}
                      </div>
                      <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', display: 'flex', gap: '8px', marginTop: '2px' }}>
                        <span>Trigger: {THRESHOLD_LABELS[alert.threshold] ?? alert.threshold}</span>
                        {river && river.cfs !== null && (
                          <span>Now: {river.cfs.toLocaleString()} cfs</span>
                        )}
                        {alert.last_notified_at && (
                          <span>Last alert: {new Date(alert.last_notified_at).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(alert.river_id)}
                      style={{
                        fontFamily: mono, fontSize: '9px', padding: '4px 10px',
                        borderRadius: 'var(--r)', border: '.5px solid var(--bd2)',
                        background: 'var(--bg)', color: 'var(--tx2)', cursor: 'pointer',
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
