'use client'

import { useState } from 'react'
import type { River, FlowData } from '@/types'
import { formatCfs, trendArrow, celsiusToFahrenheit, isHypothermiaRisk } from '@/lib/usgs'

const TABS = ['Overview', 'History', 'Trip Reports', 'Trip Planning', 'Documents'] as const
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
}

export default function RiverTabs({ river, flow }: { river: River; flow: FlowData }) {
  const [tab, setTab] = useState<Tab>('Overview')
  const [form, setForm] = useState<ReportForm>({ name: '', stars: 4, text: '', cfs: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function submitReport(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.text.trim()) return
    setSubmitting(true)
    // Stub — wire to Supabase later
    await new Promise(r => setTimeout(r, 600))
    setSubmitted(true)
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
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--rv)', marginTop: '3px' }}>{out.l}</div>
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
            {/* Existing reviews */}
            {river.revs.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                {river.revs.map((rev, i) => (
                  <div key={i} style={{ padding: '11px 0', borderBottom: '.5px solid var(--bd)' }}>
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

            {/* Submit form */}
            <div style={{ background: 'var(--bg2)', borderRadius: 'var(--r)', padding: '14px', border: '.5px solid var(--bd)' }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                Add a trip report
              </div>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>🎉</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', color: 'var(--rv)', marginBottom: '4px' }}>Thanks for the report!</div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx3)' }}>Your trip report helps the community.</div>
                  <button onClick={() => { setSubmitted(false); setForm({ name: '', stars: 4, text: '', cfs: '' }) }}
                    style={{ marginTop: '10px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--rv)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                    Add another
                  </button>
                </div>
              ) : (
                <form onSubmit={submitReport}>
                  <label style={labelStyle}>
                    Your name
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Paddler name"
                      required
                      style={inputStyle}
                    />
                  </label>
                  <label style={labelStyle}>
                    Flow at time of trip (CFS)
                    <input
                      type="number"
                      value={form.cfs}
                      onChange={e => setForm(f => ({ ...f, cfs: e.target.value }))}
                      placeholder={`Current: ${formatCfs(flow.cfs)}`}
                      style={inputStyle}
                    />
                  </label>
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '6px' }}>
                      Rating
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[1, 2, 3, 4, 5].map(n => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setForm(f => ({ ...f, stars: n }))}
                          style={{
                            fontSize: '18px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: n <= form.stars ? 'var(--am)' : 'var(--bd2)',
                            padding: '0 2px',
                            lineHeight: 1,
                          }}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <label style={labelStyle}>
                    Trip notes
                    <textarea
                      value={form.text}
                      onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                      placeholder="Water conditions, hazards, highlights…"
                      required
                      rows={4}
                      style={{ ...inputStyle, resize: 'vertical', fontFamily: 'Georgia, serif', lineHeight: 1.6 }}
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: '10px',
                      background: 'var(--rv)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 'var(--r)',
                      padding: '9px 18px',
                      cursor: submitting ? 'wait' : 'pointer',
                      letterSpacing: '.4px',
                      opacity: submitting ? 0.7 : 1,
                    }}
                  >
                    {submitting ? 'Submitting…' : 'Submit report'}
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
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--rv)' }}>{out.l}</div>
                  </div>
                ))}
              </div>
            )}
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
                {river.docs.map((doc, i) => (
                  <div key={i} style={{ padding: '10px 12px', background: 'var(--bg2)', borderRadius: 'var(--r)', marginBottom: '8px', border: '.5px solid var(--bd)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '13px', fontWeight: 600, color: 'var(--tx)', flex: 1, marginRight: '8px' }}>
                        {doc.t}
                      </div>
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', padding: '2px 6px', borderRadius: '3px', background: 'var(--rvlt)', color: 'var(--rvdk)', flexShrink: 0 }}>
                        {doc.tp}
                      </span>
                    </div>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)' }}>
                      {doc.s} · {doc.y} · {doc.pg} pages
                    </div>
                  </div>
                ))}
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
