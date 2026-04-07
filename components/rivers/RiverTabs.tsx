'use client'

import { useState, lazy, Suspense } from 'react'
import type { River, FlowData } from '@/types'
import { formatCfs, trendArrow, celsiusToFahrenheit, isHypothermiaRisk } from '@/lib/usgs'

const RiverMap = lazy(() => import('@/components/maps/RiverMap'))
import { hasRiverMap, loadRiverMap } from '@/data/river-maps'
import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

const TABS = ['Overview', 'History', 'Trip Reports', 'Trip Planning', 'Maps & Guides', 'Documents'] as const
type Tab = typeof TABS[number]

const ERA_LABELS: Record<string, string> = {
  native:  'Indigenous Era',
  logging: 'Logging & Industry',
  survey:  'Survey & Exploration',
  modern:  'Modern Era',
}

const ERA_COLORS: Record<string, string> = {
  native:  'var(--am)',
  logging: '#8b6914',
  survey:  'var(--rv)',
  modern:  'var(--rvdk)',
}

// Gear checklist based on river class
function gearList(cls: string, tempC: number | null): string[] {
  const base = [
    'PFD (personal flotation device)',
    'Paddle + spare',
    'Helmet',
    '2+ liters water',
    'First aid kit + SAM splint',
    'Whistle + signaling mirror',
    'Dry bag for essentials',
    'Sun protection + insect repellent',
    'Snacks / high-energy food',
    'Float plan left with someone',
  ]
  const cold = (tempC !== null && celsiusToFahrenheit(tempC) < 60) || tempC === null
  if (cold) base.splice(3, 0, 'Wetsuit or drysuit (cold water risk)')

  const clsNum = parseInt(cls.replace(/\D.*/, ''))
  if (clsNum >= 3) {
    base.push('Throw bag (50+ ft)')
    base.push('Carabiner + prussik loops')
    base.push('Swiftwater rescue course (recommended)')
  }
  if (clsNum >= 4) {
    base.push('Knife accessible on PFD')
    base.push('Paddling with experienced group')
    base.push('Scouting skills — never assume a rapid is clear')
  }
  return base
}

interface ReportForm {
  name: string
  stars: number
  text: string
  cfs: string
  tripDate: string
}

interface UserReport {
  id: string
  author_name: string
  rating: number
  flow_cfs: number | null
  trip_date: string | null
  body: string
  photos: string[]
  created_at: string
}

export default function RiverTabs({ river, flow }: { river: River; flow: FlowData }) {
  const [tab, setTab] = useState<Tab>('Overview')
  const [form, setForm] = useState<ReportForm>({ name: '', stars: 4, text: '', cfs: '', tripDate: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [photos, setPhotos] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [userReports, setUserReports] = useState<UserReport[]>([])
  const [loadingReports, setLoadingReports] = useState(false)
  const [riverMapData, setRiverMapData] = useState<{ accessPoints: AccessPoint[]; sections: RiverSection[]; riverPath: [number, number][] } | null>(null)
  const [riverMapLoading, setRiverMapLoading] = useState(false)
  const riverHasMap = hasRiverMap(river.id)

  // Fetch user-submitted reports when Trip Reports tab is selected
  const fetchReports = async () => {
    setLoadingReports(true)
    try {
      const res = await fetch(`/api/trips?riverId=${river.id}`)
      const data = await res.json()
      if (data.reports) setUserReports(data.reports)
    } catch { /* silently fail */ }
    setLoadingReports(false)
  }

  // Upload a photo
  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('riverId', river.id)
      try {
        const res = await fetch('/api/trips/upload', { method: 'POST', body: formData })
        const data = await res.json()
        if (data.ok && data.url) {
          setPhotos(prev => [...prev, data.url])
        }
      } catch { /* silently fail */ }
    }
    setUploading(false)
    e.target.value = ''
  }

  async function submitReport(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.text.trim()) return
    setSubmitting(true)
    setSubmitError('')
    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          riverId: river.id,
          riverName: river.n,
          authorName: form.name,
          rating: form.stars,
          flowCfs: form.cfs || null,
          tripDate: form.tripDate || null,
          text: form.text,
          photos,
        }),
      })
      const data = await res.json()
      if (data.ok) {
        setSubmitted(true)
        setPhotos([])
        fetchReports()
      } else {
        setSubmitError(data.error || 'Failed to submit report')
      }
    } catch {
      setSubmitError('Network error — please try again')
    }
    setSubmitting(false)
  }

  const gear = gearList(river.cls, flow.tempC)
  const hasHistory = river.history.length > 0
  const hasDocs = river.docs.length > 0

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* Tab bar */}
      <div style={{
        display: 'flex', borderBottom: '.5px solid var(--bd)',
        overflowX: 'auto', flexShrink: 0,
      }} className="no-scrollbar">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '10px',
              padding: '10px 14px',
              border: 'none',
              borderBottom: tab === t ? '2px solid var(--rv)' : '2px solid transparent',
              background: 'none',
              color: tab === t ? 'var(--rv)' : 'var(--tx2)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              letterSpacing: '.4px',
              flexShrink: 0,
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}>

        {/* ── OVERVIEW ─────────────────────────────────────── */}
        {tab === 'Overview' && (
          <div>
            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '12px' }}>
              {[
                { n: river.len, l: 'Length' },
                { n: `Class ${river.cls}`, l: 'Difficulty' },
                { n: `${river.opt} cfs`, l: 'Optimal' },
                { n: river.avg ? `${river.avg.toLocaleString()} cfs` : '—', l: 'Avg Flow' },
                { n: river.histFlow ? `${river.histFlow.toLocaleString()} cfs` : '—', l: 'Hist. Median' },
                { n: `#${river.g}`, l: 'USGS Gauge' },
              ].map(s => (
                <div key={s.l} style={{ background: 'var(--bg2)', borderRadius: 'var(--r)', padding: '8px 10px' }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '13px', fontWeight: 600, color: 'var(--tx)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.n}</div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '8px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.4px', marginTop: '2px' }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Designation */}
            {river.desig && (
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--rvdk)', background: 'var(--rvlt)', padding: '7px 10px', borderRadius: 'var(--r)', marginBottom: '10px', lineHeight: 1.5, border: '.5px solid var(--rvmd)' }}>
                {river.desig}
              </div>
            )}

            {/* Description */}
            <p style={{ fontSize: '13px', color: 'var(--tx)', lineHeight: 1.78, marginBottom: '12px' }}>
              {river.desc}
            </p>

            {/* Sections */}
            {river.secs.length > 0 && (
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '7px' }}>
                  Trip sections
                </div>
                {river.secs.map((sec, i) => (
                  <div key={i} style={{ fontSize: '12px', color: 'var(--tx)', marginBottom: '5px', paddingLeft: '10px', borderLeft: '2px solid var(--rvmd)', lineHeight: 1.55 }}>
                    {sec}
                  </div>
                ))}
              </div>
            )}

            {/* Outfitters */}
            {river.outs.length > 0 && (
              <div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '7px' }}>
                  Outfitters on this river
                </div>
                {river.outs.map((out, i) => (
                  <div key={i} style={{ border: '.5px dashed var(--bd2)', borderRadius: 'var(--r)', padding: '9px 11px', background: 'var(--bg2)', marginBottom: '8px' }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.7px', marginBottom: '4px' }}>
                      Outfitter
                    </div>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', fontWeight: 500, color: 'var(--rvdk)' }}>{out.n}</div>
                    <div style={{ fontSize: '11px', color: 'var(--tx2)', marginTop: '2px' }}>{out.d}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── HISTORY ──────────────────────────────────────── */}
        {tab === 'History' && (
          <div>
            {hasHistory ? (
              river.history.map((era, ei) => (
                <div key={ei} style={{ marginBottom: '24px' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px',
                    paddingBottom: '6px', borderBottom: `.5px solid var(--bd)`,
                  }}>
                    <div style={{ width: '3px', height: '16px', borderRadius: '2px', background: ERA_COLORS[era.era] ?? 'var(--tx3)', flexShrink: 0 }} />
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: ERA_COLORS[era.era] ?? 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {ERA_LABELS[era.era] ?? era.era}
                    </div>
                  </div>
                  {era.entries.map((entry, i) => (
                    <div key={i} style={{ paddingBottom: '14px', marginBottom: '14px', borderBottom: i < era.entries.length - 1 ? '.5px solid var(--bd)' : 'none' }}>
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', fontWeight: 500, color: ERA_COLORS[era.era] ?? 'var(--rv)', marginBottom: '3px' }}>
                        {entry.yr}
                      </div>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', fontWeight: 600, color: 'var(--tx)', marginBottom: '5px' }}>
                        {entry.title}
                      </div>
                      <p style={{ fontSize: '12.5px', color: 'var(--tx)', lineHeight: 1.75, marginBottom: '6px' }}>
                        {entry.text}
                      </p>
                      {entry.src && (
                        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', fontStyle: 'italic' }}>
                          Source: {entry.src}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <EmptyState icon="📜" label="No history on file yet" sub="Historical records for this river are being researched." />
            )}
          </div>
        )}

        {/* ── TRIP REPORTS ─────────────────────────────────── */}
        {tab === 'Trip Reports' && (
          <div>
            {/* Hardcoded reviews from data */}
            {river.revs.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                {river.revs.map((rev, i) => (
                  <div key={`hc-${i}`} style={{ padding: '11px 0', borderBottom: '.5px solid var(--bd)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2px' }}>
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', fontWeight: 500 }}>{rev.u}</span>
                      <span style={{ color: 'var(--am)', fontSize: '12px', letterSpacing: '2px' }}>{'★'.repeat(rev.s)}{'☆'.repeat(5 - rev.s)}</span>
                    </div>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', marginBottom: '4px' }}>{rev.d}</div>
                    <p style={{ fontSize: '12.5px', color: 'var(--tx)', lineHeight: 1.68, fontStyle: 'italic' }}>{rev.t}</p>
                  </div>
                ))}
              </div>
            )}

            {/* User-submitted reports from Supabase */}
            {userReports.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--rv)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                  Community Reports
                </div>
                {userReports.map(report => (
                  <div key={report.id} style={{ padding: '11px 0', borderBottom: '.5px solid var(--bd)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2px' }}>
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', fontWeight: 500 }}>{report.author_name}</span>
                      <span style={{ color: 'var(--am)', fontSize: '12px', letterSpacing: '2px' }}>{'★'.repeat(report.rating)}{'☆'.repeat(5 - report.rating)}</span>
                    </div>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', marginBottom: '4px', display: 'flex', gap: '8px' }}>
                      {report.trip_date && <span>{new Date(report.trip_date).toLocaleDateString()}</span>}
                      {report.flow_cfs && <span>{report.flow_cfs.toLocaleString()} cfs</span>}
                    </div>
                    <p style={{ fontSize: '12.5px', color: 'var(--tx)', lineHeight: 1.68 }}>{report.body}</p>
                    {report.photos.length > 0 && (
                      <div style={{ display: 'flex', gap: '6px', marginTop: '8px', overflowX: 'auto' }}>
                        {report.photos.map((url, pi) => (
                          <a key={pi} href={url} target="_blank" rel="noopener noreferrer">
                            <img src={url} alt="Trip photo" style={{ width: '100px', height: '75px', objectFit: 'cover', borderRadius: '4px', border: '.5px solid var(--bd)' }} />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Load reports button */}
            {userReports.length === 0 && !loadingReports && (
              <button onClick={fetchReports} style={{
                fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--rv)',
                background: 'none', border: '.5px solid var(--rvmd)', borderRadius: 'var(--r)',
                padding: '6px 14px', cursor: 'pointer', marginBottom: '14px',
              }}>
                Load community reports
              </button>
            )}
            {loadingReports && (
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx3)', marginBottom: '14px' }}>
                Loading reports...
              </div>
            )}

            {/* Submit form */}
            <div style={{ background: 'var(--bg2)', borderRadius: 'var(--r)', padding: '14px', border: '.5px solid var(--bd)' }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                Add a trip report
              </div>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>&#127881;</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', color: 'var(--rv)', marginBottom: '4px' }}>Thanks for the report!</div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx3)' }}>Your trip report helps the paddling community.</div>
                  <button onClick={() => { setSubmitted(false); setForm({ name: '', stars: 4, text: '', cfs: '', tripDate: '' }); setPhotos([]) }}
                    style={{ marginTop: '10px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--rv)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                    Add another
                  </button>
                </div>
              ) : (
                <form onSubmit={submitReport}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <label style={labelStyle}>
                      Your name
                      <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Paddler name" required style={inputStyle} />
                    </label>
                    <label style={labelStyle}>
                      Trip date
                      <input type="date" value={form.tripDate} onChange={e => setForm(f => ({ ...f, tripDate: e.target.value }))}
                        style={inputStyle} />
                    </label>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <label style={labelStyle}>
                      Flow at time of trip (CFS)
                      <input type="number" value={form.cfs} onChange={e => setForm(f => ({ ...f, cfs: e.target.value }))}
                        placeholder={`Current: ${formatCfs(flow.cfs)}`} style={inputStyle} />
                    </label>
                    <div style={{ marginBottom: '10px' }}>
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '6px' }}>
                        Rating
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {[1, 2, 3, 4, 5].map(n => (
                          <button key={n} type="button" onClick={() => setForm(f => ({ ...f, stars: n }))}
                            style={{ fontSize: '18px', background: 'none', border: 'none', cursor: 'pointer',
                              color: n <= form.stars ? 'var(--am)' : 'var(--bd2)', padding: '0 2px', lineHeight: 1 }}>
                            &#9733;
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <label style={labelStyle}>
                    Trip notes
                    <textarea value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                      placeholder="Water conditions, hazards, highlights, put-in/take-out notes..."
                      required rows={4}
                      style={{ ...inputStyle, resize: 'vertical', fontFamily: 'Georgia, serif', lineHeight: 1.6 }} />
                  </label>

                  {/* Photo upload */}
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '6px' }}>
                      Photos (optional)
                    </div>
                    {photos.length > 0 && (
                      <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        {photos.map((url, i) => (
                          <div key={i} style={{ position: 'relative' }}>
                            <img src={url} alt={`Upload ${i + 1}`} style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '.5px solid var(--bd)' }} />
                            <button type="button" onClick={() => setPhotos(prev => prev.filter((_, j) => j !== i))}
                              style={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: '50%',
                                background: 'var(--dg)', color: '#fff', border: 'none', fontSize: '9px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>
                              x
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <label style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: uploading ? 'wait' : 'pointer',
                      fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--rv)',
                      padding: '6px 12px', border: '.5px solid var(--rvmd)', borderRadius: 'var(--r)',
                      background: 'var(--bg)', opacity: uploading ? 0.6 : 1,
                    }}>
                      {uploading ? 'Uploading...' : photos.length > 0 ? '+ Add more photos' : 'Upload photos'}
                      <input type="file" accept="image/*" multiple onChange={handlePhotoUpload}
                        disabled={uploading} style={{ display: 'none' }} />
                    </label>
                    {photos.length > 0 && (
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', marginLeft: '8px' }}>
                        {photos.length} photo{photos.length !== 1 ? 's' : ''} attached
                      </span>
                    )}
                  </div>

                  {submitError && (
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--dg)', marginBottom: '8px' }}>
                      {submitError}
                    </div>
                  )}

                  <button type="submit" disabled={submitting}
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px',
                      background: 'var(--rv)', color: '#fff', border: 'none',
                      borderRadius: 'var(--r)', padding: '9px 18px',
                      cursor: submitting ? 'wait' : 'pointer',
                      letterSpacing: '.4px', opacity: submitting ? 0.7 : 1,
                    }}>
                    {submitting ? 'Submitting...' : 'Submit report'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ── TRIP PLANNING ─────────────────────────────────── */}
        {tab === 'Trip Planning' && (
          <div>
            {/* Safety snapshot */}
            <div style={{ background: 'var(--bg2)', borderRadius: 'var(--r)', padding: '12px 14px', marginBottom: '14px', border: '.5px solid var(--bd)' }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                Current conditions
              </div>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <CondItem label="Flow" value={flow.cfs !== null ? `${formatCfs(flow.cfs)} CFS` : '—'} />
                <CondItem label="Condition" value={
                  flow.condition === 'optimal' ? '✓ Optimal' :
                  flow.condition === 'low' ? '↓ Below optimal' :
                  flow.condition === 'high' ? '↑ Above optimal' :
                  flow.condition === 'flood' ? '⚠ Flood' : '—'
                } />
                {flow.tempC !== null && (
                  <CondItem
                    label="Water temp"
                    value={`${celsiusToFahrenheit(flow.tempC)}°F${isHypothermiaRisk(flow.tempC) ? ' ⚠ Cold' : ''}`}
                  />
                )}
                <CondItem label="Optimal range" value={`${river.opt} CFS`} />
              </div>
            </div>

            {/* Safety note if temp is cold */}
            {flow.tempC !== null && isHypothermiaRisk(flow.tempC) && (
              <div style={{ background: '#fff3f0', border: '.5px solid #f4a', borderRadius: 'var(--r)', padding: '10px 13px', marginBottom: '14px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#c02', lineHeight: 1.6 }}>
                ⚠️ Water temp {celsiusToFahrenheit(flow.tempC)}°F — hypothermia risk is real. Wear a wetsuit or drysuit and paddle with experienced partners.
              </div>
            )}

            {/* Gear checklist */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                Gear checklist — Class {river.cls}
              </div>
              {gear.map((item, i) => (
                <GearItem key={i} label={item} />
              ))}
            </div>

            {/* Sections for planning */}
            {river.secs.length > 0 && (
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                  Sections to plan
                </div>
                {river.secs.map((sec, i) => (
                  <div key={i} style={{ fontSize: '12px', color: 'var(--tx)', marginBottom: '5px', paddingLeft: '10px', borderLeft: '2px solid var(--rvmd)', lineHeight: 1.55 }}>
                    {sec}
                  </div>
                ))}
              </div>
            )}

            {/* Outfitters */}
            {river.outs.length > 0 && (
              <div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                  Hire a guide
                </div>
                {river.outs.map((out, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '.5px solid var(--bd)' }}>
                    <div>
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', fontWeight: 500, color: 'var(--rvdk)' }}>{out.n}</div>
                      <div style={{ fontSize: '11px', color: 'var(--tx2)', marginTop: '1px' }}>{out.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── MAPS & GUIDES ──────────────────────────────────── */}
        {tab === 'Maps & Guides' && (
          <div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
              Maps & Guides for {river.n}
            </div>

            {/* Interactive River Map */}
            {riverHasMap && (
              <div style={{ marginBottom: '16px' }}>
                {!riverMapData && !riverMapLoading && (
                  <button onClick={async () => {
                    setRiverMapLoading(true)
                    const data = await loadRiverMap(river.id)
                    if (data) setRiverMapData(data)
                    setRiverMapLoading(false)
                  }} style={{
                    width: '100%', padding: '14px', border: '.5px solid var(--rvmd)',
                    borderRadius: 'var(--rlg)', background: 'var(--rvlt)', cursor: 'pointer',
                    fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: 'var(--rvdk)',
                    textAlign: 'center',
                  }}>
                    Load Interactive River Map — Access Points, Distances & Paddle Times
                  </button>
                )}
                {riverMapLoading && (
                  <div style={{ padding: '20px', textAlign: 'center', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx3)' }}>
                    Loading map data...
                  </div>
                )}
                {riverMapData && (
                  <Suspense fallback={<div style={{ height: '350px', background: 'var(--bg2)', borderRadius: 'var(--rlg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx3)' }}>Loading map...</div>}>
                    <RiverMap
                      riverName={river.n}
                      accessPoints={riverMapData.accessPoints}
                      sections={riverMapData.sections}
                      riverPath={riverMapData.riverPath}
                    />
                  </Suspense>
                )}
              </div>
            )}

            {/* Featured map placeholder */}
            <div style={{ border: '.5px solid var(--rvmd)', borderRadius: 'var(--rlg)', padding: '16px 18px', background: 'var(--rvlt)', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--rv)', textTransform: 'uppercase', letterSpacing: '.7px', marginBottom: '4px' }}>
                    Featured Map
                  </div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', fontWeight: 600, color: 'var(--rvdk)', marginBottom: '4px' }}>
                    {river.n} — River Map & Guide
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--tx2)', lineHeight: 1.5, marginBottom: '8px' }}>
                    Detailed put-in/take-out locations, rapid ratings, mile markers, camping, and access points.
                  </div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx3)' }}>
                    Waterproof · Double-sided · Updated {new Date().getFullYear()}
                  </div>
                </div>
              </div>
              <div style={{
                marginTop: '12px', display: 'inline-block',
                fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px',
                padding: '8px 18px', borderRadius: 'var(--r)',
                background: 'var(--rvdk)', color: '#fff', cursor: 'default',
                opacity: 0.7,
              }}>
                Coming Soon
              </div>
            </div>

            {/* Additional map slots */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ border: '.5px solid var(--bd)', borderRadius: 'var(--r)', padding: '12px 14px', background: 'var(--bg2)' }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '4px' }}>
                  Topographic Map
                </div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '13px', fontWeight: 600, color: 'var(--tx)', marginBottom: '3px' }}>
                  {river.co.split('/')[0].trim()} County Topo
                </div>
                <div style={{ fontSize: '11px', color: 'var(--tx2)', marginBottom: '8px' }}>
                  USGS 7.5-minute quadrangle covering the river corridor
                </div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx3)' }}>
                  Coming Soon
                </div>
              </div>

              <div style={{ border: '.5px solid var(--bd)', borderRadius: 'var(--r)', padding: '12px 14px', background: 'var(--bg2)' }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '4px' }}>
                  Guidebook
                </div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '13px', fontWeight: 600, color: 'var(--tx)', marginBottom: '3px' }}>
                  {river.abbr} Paddling Guide
                </div>
                <div style={{ fontSize: '11px', color: 'var(--tx2)', marginBottom: '8px' }}>
                  Comprehensive guidebook covering rivers in {river.abbr}
                </div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx3)' }}>
                  Coming Soon
                </div>
              </div>
            </div>

            {/* Affiliate notice */}
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', marginTop: '16px', lineHeight: 1.5, fontStyle: 'italic' }}>
              Maps and guides are selected by RiverScout editors. Some links may earn a small commission that supports this site.
            </div>
          </div>
        )}

        {/* ── DOCUMENTS ─────────────────────────────────────── */}
        {tab === 'Documents' && (
          <div>
            {hasDocs ? (
              <div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
                  {river.docs.length} document{river.docs.length !== 1 ? 's' : ''}
                </div>
                {river.docs.map((doc, i) => {
                  const inner = (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '13px', fontWeight: 600, color: doc.url ? 'var(--rvdk)' : 'var(--tx)', flex: 1, marginRight: '8px' }}>
                          {doc.t}
                          {doc.url && <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--rv)', marginLeft: '6px' }}>↗</span>}
                        </div>
                        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', padding: '2px 6px', borderRadius: '3px', background: 'var(--rvlt)', color: 'var(--rvdk)', flexShrink: 0 }}>
                          {doc.tp}
                        </span>
                      </div>
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)' }}>
                        {doc.s} · {doc.y} · {doc.pg} pages
                      </div>
                    </>
                  )
                  return doc.url ? (
                    <a key={i} href={doc.url.startsWith('http') ? doc.url : `https://${doc.url}`} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'block', padding: '10px 12px', background: 'var(--bg2)', borderRadius: 'var(--r)', marginBottom: '8px', border: '.5px solid var(--bd)', textDecoration: 'none', color: 'inherit', transition: 'border-color .15s', }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--rvmd)')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--bd)')}
                    >{inner}</a>
                  ) : (
                    <div key={i} style={{ padding: '10px 12px', background: 'var(--bg2)', borderRadius: 'var(--r)', marginBottom: '8px', border: '.5px solid var(--bd)' }}>
                      {inner}
                    </div>
                  )
                })}
              </div>
            ) : (
              <EmptyState icon="📄" label="No documents on file" sub="Permit forms, maps, and guides for this river will appear here." />
            )}
          </div>
        )}

      </div>
    </div>
  )
}

// ── Small helpers ─────────────────────────────────────────────────

function EmptyState({ icon, label, sub }: { icon: string; label: string; sub: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--tx2)' }}>
      <div style={{ fontSize: '32px', marginBottom: '8px', opacity: 0.4 }}>{icon}</div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx3)', lineHeight: 1.6 }}>{sub}</div>
    </div>
  )
}

function CondItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '8px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '2px' }}>{label}</div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: 'var(--tx)' }}>{value}</div>
    </div>
  )
}

function GearItem({ label }: { label: string }) {
  const [checked, setChecked] = useState(false)
  return (
    <div
      onClick={() => setChecked(c => !c)}
      style={{
        display: 'flex', alignItems: 'center', gap: '9px',
        padding: '6px 0', borderBottom: '.5px solid var(--bd)',
        cursor: 'pointer',
      }}
    >
      <div style={{
        width: '14px', height: '14px', borderRadius: '3px',
        border: `.5px solid ${checked ? 'var(--rv)' : 'var(--bd2)'}`,
        background: checked ? 'var(--rv)' : 'var(--bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, transition: 'all .12s',
      }}>
        {checked && <span style={{ color: '#fff', fontSize: '9px', lineHeight: 1 }}>✓</span>}
      </div>
      <span style={{
        fontSize: '12px', color: checked ? 'var(--tx3)' : 'var(--tx)',
        textDecoration: checked ? 'line-through' : 'none',
        transition: 'color .12s',
      }}>{label}</span>
    </div>
  )
}

// Shared input styles
const labelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
  marginBottom: '10px',
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: '9px',
  color: 'var(--tx3)',
  textTransform: 'uppercase',
  letterSpacing: '.5px',
}

const inputStyle: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: '11px',
  color: 'var(--tx)',
  background: 'var(--bg)',
  border: '.5px solid var(--bd2)',
  borderRadius: 'var(--r)',
  padding: '7px 9px',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
}
