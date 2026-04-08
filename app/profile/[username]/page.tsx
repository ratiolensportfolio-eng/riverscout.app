'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { fetchGaugeData, formatCfs } from '@/lib/usgs'
import { getRiverPath } from '@/data/rivers'
import type { FlowCondition } from '@/types'

const mono = "'IBM Plex Mono', monospace"
const serif = "'Playfair Display', serif"

const fieldLabels: Record<string, string> = {
  cls: 'Whitewater Class', opt: 'Optimal CFS', len: 'River Length',
  desc: 'Description', desig: 'Designations', species: 'Fish Species',
  hatches: 'Hatch Calendar', runs: 'Run Timing', spawning: 'Spawn Timing',
  access_points: 'Access Points', sections: 'Sections', gauge: 'USGS Gauge',
  outfitters: 'Outfitters', history: 'History', other: 'Other',
}

const condColors: Record<string, string> = {
  optimal: '#1D9E75', low: '#533AB7', high: '#BA7517', flood: '#A32D2D', loading: '#aaa99a',
}

interface Profile {
  id: string
  username: string
  display_name: string
  avatar_url: string | null
  bio: string | null
  home_state: string | null
  created_at: string
}

interface Report {
  id: string
  river_id: string
  river_name: string
  rating: number
  trip_date: string | null
  created_at: string
}

interface Improvement {
  id: string
  river_id: string
  river_name: string
  field: string
  reviewed_at: string
}

interface SavedRiver {
  river_id: string
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return new Date(dateStr).toLocaleDateString()
}

export default function ProfilePage() {
  const params = useParams()
  const username = params.username as string

  const [profile, setProfile] = useState<Profile | null>(null)
  const [reports, setReports] = useState<Report[]>([])
  const [improvements, setImprovements] = useState<Improvement[]>([])
  const [savedRivers, setSavedRivers] = useState<SavedRiver[]>([])
  const [stats, setStats] = useState({ approvedImprovements: 0, tripReports: 0, isContributor: false })
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [isOwner, setIsOwner] = useState(false)
  const [savedFlows, setSavedFlows] = useState<Record<string, { cfs: number | null; condition: FlowCondition }>>({})

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id ?? null)
    })
  }, [])

  useEffect(() => {
    async function load() {
      setLoading(true)
      const url = `/api/profile?username=${encodeURIComponent(username)}${currentUserId ? `&userId=${currentUserId}` : ''}`
      const res = await fetch(url)
      const data = await res.json()

      if (data.error) {
        setNotFound(true)
      } else {
        setProfile(data.profile)
        setReports(data.reports)
        setImprovements(data.improvements)
        setSavedRivers(data.savedRivers)
        setStats(data.stats)
        setIsOwner(currentUserId === data.profile?.id)
      }
      setLoading(false)
    }
    if (username) load()
  }, [username, currentUserId])

  // Fetch live CFS for saved rivers
  useEffect(() => {
    if (savedRivers.length === 0) return
    // We can't call USGS directly from client — use the rivers data
    // Saved rivers just show the river_id for now, live CFS would need a server endpoint
  }, [savedRivers])

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono, color: 'var(--tx3)' }}>Loading...</div>
  }

  if (notFound || !profile) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontFamily: serif, fontSize: '20px', color: 'var(--tx2)' }}>Paddler not found</div>
        <Link href="/" style={{ fontFamily: mono, fontSize: '11px', color: 'var(--rv)' }}>Back to RiverScout</Link>
      </div>
    )
  }

  const memberSince = new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

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
      </nav>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 28px' }}>
        {/* Profile header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.display_name}
              style={{ width: 64, height: 64, borderRadius: '50%', border: '2px solid var(--rvmd)' }} />
          ) : (
            <div style={{
              width: 64, height: 64, borderRadius: '50%', background: 'var(--rvlt)',
              border: '2px solid var(--rvmd)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: serif, fontSize: '24px', fontWeight: 700, color: 'var(--rvdk)',
            }}>
              {profile.display_name[0].toUpperCase()}
            </div>
          )}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontFamily: serif, fontSize: '22px', fontWeight: 700, color: 'var(--rvdk)', margin: 0 }}>
                {profile.display_name}
              </h1>
              {stats.isContributor && (
                <span style={{
                  fontFamily: mono, fontSize: '8px', padding: '2px 8px', borderRadius: '8px',
                  background: 'var(--rv)', color: '#fff', textTransform: 'uppercase', letterSpacing: '.5px',
                }}>
                  Contributor
                </span>
              )}
            </div>
            <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)', marginTop: '2px' }}>
              @{profile.username} · Member since {memberSince}
            </div>
            {profile.bio && (
              <div style={{ fontSize: '12px', color: 'var(--tx2)', marginTop: '4px', lineHeight: 1.5 }}>
                {profile.bio}
              </div>
            )}
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', padding: '12px', background: 'var(--bg2)', borderRadius: 'var(--r)', border: '.5px solid var(--bd)' }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontFamily: serif, fontSize: '20px', fontWeight: 700, color: 'var(--rvdk)' }}>{stats.tripReports}</div>
            <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase' }}>Trip Reports</div>
          </div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontFamily: serif, fontSize: '20px', fontWeight: 700, color: 'var(--rv)' }}>{stats.approvedImprovements}</div>
            <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase' }}>Improvements</div>
          </div>
          {isOwner && (
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontFamily: serif, fontSize: '20px', fontWeight: 700, color: 'var(--wt)' }}>{savedRivers.length}</div>
              <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase' }}>Saved Rivers</div>
            </div>
          )}
        </div>

        {/* Saved Rivers (owner only) */}
        {isOwner && savedRivers.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--wt)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
              Saved Rivers
            </div>
            {savedRivers.map(sr => (
              <Link key={sr.river_id} href={`/state/mi`}
                style={{
                  display: 'block', padding: '8px 10px', marginBottom: '4px',
                  background: 'var(--bg2)', borderRadius: 'var(--r)', border: '.5px solid var(--bd)',
                  textDecoration: 'none', color: 'var(--tx)',
                  fontFamily: mono, fontSize: '11px',
                }}>
                {sr.river_id}
              </Link>
            ))}
          </div>
        )}

        {/* Trip Reports */}
        {reports.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
              Trip Reports
            </div>
            {reports.map(r => (
              <div key={r.id} style={{
                padding: '10px 0', borderBottom: '.5px solid var(--bd)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              }}>
                <div>
                  <div style={{ fontFamily: serif, fontSize: '14px', fontWeight: 600, color: 'var(--rvdk)' }}>
                    {r.river_name}
                  </div>
                  <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', marginTop: '2px' }}>
                    {r.trip_date || new Date(r.created_at).toLocaleDateString()}
                  </div>
                </div>
                <span style={{ color: 'var(--am)', fontSize: '12px', letterSpacing: '1px' }}>
                  {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Community Improvements */}
        {improvements.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--rv)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
              Community Improvements
            </div>
            {improvements.map(imp => (
              <div key={imp.id} style={{
                padding: '8px 0', borderBottom: '.5px solid var(--bd)',
              }}>
                <div style={{ fontSize: '12px', color: 'var(--tx)', lineHeight: 1.5 }}>
                  Improved <span style={{ fontFamily: mono, fontSize: '11px', fontWeight: 500 }}>{fieldLabels[imp.field] || imp.field}</span>
                  {' '}on{' '}
                  <span style={{ fontFamily: serif, fontWeight: 600, color: 'var(--rvdk)' }}>{imp.river_name}</span>
                </div>
                <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', marginTop: '2px' }}>
                  {imp.reviewed_at ? relativeTime(imp.reviewed_at) : ''}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {reports.length === 0 && improvements.length === 0 && (
          <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--tx3)' }}>
            <div style={{ fontFamily: mono, fontSize: '11px' }}>
              No activity yet. Submit a trip report or improve a river to build your profile.
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
