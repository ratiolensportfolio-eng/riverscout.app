'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ALL_RIVERS, getRiverPath } from '@/data/rivers'
import { getContributorTier, getNextTier } from '@/lib/contributor-tiers'

const mono = "'IBM Plex Mono', monospace"
const serif = "'Playfair Display', serif"

const fieldLabels: Record<string, string> = {
  cls: 'Whitewater Class', opt: 'Optimal CFS', len: 'River Length',
  desc: 'Description', desig: 'Designations', species: 'Fish Species',
  hatches: 'Hatch Calendar', runs: 'Run Timing', spawning: 'Spawn Timing',
  access_points: 'Access Points', sections: 'Sections', gauge: 'USGS Gauge',
  outfitters: 'Outfitters', history: 'History', other: 'Other',
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

// Matches the trip_reports columns returned by /api/profile. The
// rating→conditions_rating rename came with mig 041; the old schema
// is gone so we only support the new shape.
interface Report {
  id: string
  river_id: string
  trip_date: string
  cfs_at_time: number | null
  conditions_rating: number | null
  created_at: string
}

interface Catch {
  id: string
  river_id: string
  catch_date: string
  species: string
  weight_lbs: number | null
  length_inches: number | null
  photo_url: string | null
}

interface TripsByRiverEntry {
  river_id: string
  count: number
}

interface Badges {
  hazardReporter: boolean
  accessPointVerifier: boolean
  qaContributor: boolean
  topAngler: boolean
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
  const [catches, setCatches] = useState<Catch[]>([])
  const [tripsByRiver, setTripsByRiver] = useState<TripsByRiverEntry[]>([])
  const [improvements, setImprovements] = useState<Improvement[]>([])
  const [savedRivers, setSavedRivers] = useState<SavedRiver[]>([])
  const [stats, setStats] = useState({
    approvedImprovements: 0,
    tripReports: 0,
    verifiedCatches: 0,
    contributionScore: 0,
    isContributor: false,
  })
  const [badges, setBadges] = useState<Badges>({
    hazardReporter: false, accessPointVerifier: false, qaContributor: false, topAngler: false,
  })
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [isOwner, setIsOwner] = useState(false)

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
        setReports(data.reports ?? [])
        setCatches(data.catches ?? [])
        setTripsByRiver(data.tripsByRiver ?? [])
        setImprovements(data.improvements ?? [])
        setSavedRivers(data.savedRivers ?? [])
        setStats(data.stats)
        setBadges(data.badges ?? { hazardReporter: false, accessPointVerifier: false, qaContributor: false, topAngler: false })
        setIsOwner(currentUserId === data.profile?.id)
      }
      setLoading(false)
    }
    if (username) load()
  }, [username, currentUserId])

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
  const tier = getContributorTier(stats.approvedImprovements)
  const nextTier = getNextTier(stats.approvedImprovements)
  const toNext = nextTier ? nextTier.threshold - stats.approvedImprovements : 0

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--tx)' }}>
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
              {tier.key !== 'none' && (
                <span
                  title={tier.description + (nextTier ? ` ${toNext} more to ${nextTier.label}.` : '')}
                  style={{
                    fontFamily: mono, fontSize: '9px', padding: '3px 9px', borderRadius: '10px',
                    background: tier.background, color: tier.color, border: `.5px solid ${tier.border}`,
                    textTransform: 'uppercase', letterSpacing: '.5px', fontWeight: 600,
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    cursor: 'help',
                  }}>
                  <span aria-hidden="true">{tier.icon}</span> {tier.label}
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '12px', marginBottom: '20px', padding: '14px', background: 'var(--bg2)', borderRadius: 'var(--r)', border: '.5px solid var(--bd)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: serif, fontSize: '20px', fontWeight: 700, color: 'var(--rvdk)' }}>{stats.tripReports}</div>
            <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase' }}>Verified trips</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: serif, fontSize: '20px', fontWeight: 700, color: '#1D9E75' }}>{stats.verifiedCatches}</div>
            <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase' }}>Verified catches</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: serif, fontSize: '20px', fontWeight: 700, color: 'var(--rv)' }}>{stats.contributionScore}</div>
            <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase' }}>Contribution pts</div>
          </div>
          {isOwner && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: serif, fontSize: '20px', fontWeight: 700, color: 'var(--wt)' }}>{savedRivers.length}</div>
              <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase' }}>Saved rivers</div>
            </div>
          )}
        </div>

        {/* Contribution badges — shown only when the user has earned
            at least one. The labels are intentionally concise; the
            tier/Q&A badge stays next to the display name at the top. */}
        {(badges.hazardReporter || badges.accessPointVerifier || badges.qaContributor || badges.topAngler) && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '22px' }}>
            {badges.topAngler && <Badge icon="🎣" label="Top angler" tone="teal" tip="Holds a top-10 catch for at least one species" />}
            {badges.hazardReporter && <Badge icon="⚠" label="Hazard reporter" tone="red" tip="Reported one or more river hazards" />}
            {badges.accessPointVerifier && <Badge icon="📍" label="Access point verifier" tone="blue" tip="Submitted one or more access points" />}
            {badges.qaContributor && <Badge icon="💬" label="Q&A contributor" tone="purple" tip="Answered a question that was marked helpful" />}
          </div>
        )}

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

        {/* Personal bests by species — heaviest verified catch per
            species, with photo. Derived server-side (one row per
            species already). */}
        {catches.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
              Personal bests
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '10px' }}>
              {catches.map(c => {
                const river = ALL_RIVERS.find(r => r.id === c.river_id)
                return (
                  <div key={c.id} style={{ border: '.5px solid var(--bd)', borderRadius: 'var(--r)', overflow: 'hidden', background: 'var(--bg)' }}>
                    {c.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.photo_url} alt={c.species} style={{ width: '100%', height: '120px', objectFit: 'cover', display: 'block' }} />
                    ) : (
                      <div style={{ width: '100%', height: '120px', background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono, fontSize: '10px', color: 'var(--tx3)' }}>No photo</div>
                    )}
                    <div style={{ padding: '8px 10px' }}>
                      <div style={{ fontFamily: serif, fontSize: '13px', fontWeight: 600, color: '#042C53' }}>{c.species}</div>
                      <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', marginTop: '2px' }}>
                        {c.weight_lbs != null ? `${c.weight_lbs} lb` : 'weight —'}
                        {c.length_inches != null && ` · ${c.length_inches}"`}
                      </div>
                      <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', marginTop: '2px' }}>
                        {river ? (
                          <Link href={getRiverPath(river)} style={{ color: 'var(--tx3)' }}>{river.n}</Link>
                        ) : c.river_id}
                        {' · '}{new Date(c.catch_date + 'T00:00:00').toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Verified trips — recent list with CFS + rating. */}
        {reports.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
              Verified trips
            </div>
            {reports.slice(0, 20).map(r => {
              const river = ALL_RIVERS.find(x => x.id === r.river_id)
              return (
                <div key={r.id} style={{
                  padding: '10px 0', borderBottom: '.5px solid var(--bd)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px',
                }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: serif, fontSize: '14px', fontWeight: 600, color: 'var(--rvdk)' }}>
                      {river ? (
                        <Link href={getRiverPath(river)} style={{ color: 'inherit', textDecoration: 'none' }}>{river.n}</Link>
                      ) : r.river_id}
                    </div>
                    <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', marginTop: '2px' }}>
                      {new Date(r.trip_date + 'T00:00:00').toLocaleDateString()}
                      {r.cfs_at_time != null && ` · ${r.cfs_at_time.toLocaleString()} cfs`}
                    </div>
                  </div>
                  {r.conditions_rating != null && (
                    <span style={{ color: 'var(--am)', fontSize: '12px', letterSpacing: '1px', flexShrink: 0 }} title={`${r.conditions_rating}/5 conditions`}>
                      {'★'.repeat(r.conditions_rating)}{'☆'.repeat(5 - r.conditions_rating)}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Trips by river — breakdown showing which rivers this
            paddler frequents most. */}
        {tripsByRiver.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
              Trips by river
            </div>
            <div style={{ border: '.5px solid var(--bd)', borderRadius: 'var(--r)', overflow: 'hidden', background: 'var(--bg)' }}>
              {tripsByRiver.slice(0, 15).map(entry => {
                const river = ALL_RIVERS.find(r => r.id === entry.river_id)
                return (
                  <div key={entry.river_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderBottom: '.5px solid var(--bd)', fontFamily: mono, fontSize: '11px' }}>
                    <span>
                      {river ? (
                        <Link href={getRiverPath(river)} style={{ color: 'var(--rvdk)', textDecoration: 'none', fontWeight: 600 }}>{river.n}</Link>
                      ) : entry.river_id}
                    </span>
                    <span style={{ color: 'var(--tx3)' }}>{entry.count} trip{entry.count === 1 ? '' : 's'}</span>
                  </div>
                )
              })}
            </div>
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
        {reports.length === 0 && catches.length === 0 && improvements.length === 0 && (
          <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--tx3)' }}>
            <div style={{ fontFamily: mono, fontSize: '11px' }}>
              No activity yet. Submit a trip report or log a catch to build your profile.
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

// Small contribution-badge chip. Tones map to the same palette used
// across the app for hazards / verified / Q&A highlights.
function Badge({ icon, label, tone, tip }: {
  icon: string; label: string;
  tone: 'teal' | 'red' | 'blue' | 'purple';
  tip: string;
}) {
  const palette: Record<string, { fg: string; bg: string; bd: string }> = {
    teal:   { fg: '#085041', bg: '#E1F5EE', bd: '#9FE1CB' },
    red:    { fg: '#A32D2D', bg: '#FBE8E8', bd: '#E8B5B5' },
    blue:   { fg: '#0C447C', bg: '#E6EFF9', bd: '#B5CEE8' },
    purple: { fg: '#533AB7', bg: '#EEE9FB', bd: '#C4B5E8' },
  }
  const p = palette[tone]
  return (
    <span
      title={tip}
      style={{
        fontFamily: mono, fontSize: '10px',
        padding: '4px 10px', borderRadius: '12px',
        background: p.bg, color: p.fg, border: `.5px solid ${p.bd}`,
        display: 'inline-flex', alignItems: 'center', gap: '5px',
        cursor: 'help',
      }}
    >
      <span aria-hidden="true">{icon}</span> {label}
    </span>
  )
}
