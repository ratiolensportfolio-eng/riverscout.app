'use client'

// Calendar grid view for /releases. Renders 6 rolling months
// (current + next 5) as month-by-month grids with releases
// pinned to their dates. The list view stays in the parent
// server component; this is a sibling that the user toggles
// to via a button. State (selected view) lives in localStorage
// so it persists across visits.

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { DamRelease } from '@/types'

interface RiverInfo {
  name: string
  stateName: string
  url: string
}

interface Props {
  // All upcoming releases (already filtered to today onward).
  releases: DamRelease[]
  // river_id → display info, pre-built server-side.
  riverLookup: Record<string, RiverInfo>
}

const mono = "'IBM Plex Mono', monospace"
const serif = "'Playfair Display', serif"

const STORAGE_KEY = 'riverscout_releases_view'

// Build a month grid: an array of "weeks", where each week is
// an array of 7 day cells. Days outside the target month are
// rendered as empty placeholders so the grid stays a 7-column
// rectangle.
//
// Returns the calendar weeks for the given (year, month).
// `month` is 0-indexed (Jan=0).
function buildMonthGrid(year: number, month: number): Array<Array<{ date: string; inMonth: boolean }>> {
  const firstOfMonth = new Date(year, month, 1)
  const lastOfMonth = new Date(year, month + 1, 0)

  // Find the Sunday on or before the 1st (where week starts).
  const startDay = new Date(firstOfMonth)
  startDay.setDate(startDay.getDate() - startDay.getDay())

  // Find the Saturday on or after the last day.
  const endDay = new Date(lastOfMonth)
  endDay.setDate(endDay.getDate() + (6 - endDay.getDay()))

  const weeks: Array<Array<{ date: string; inMonth: boolean }>> = []
  let cursor = new Date(startDay)
  while (cursor <= endDay) {
    const week: Array<{ date: string; inMonth: boolean }> = []
    for (let i = 0; i < 7; i++) {
      const iso = cursor.toISOString().slice(0, 10)
      week.push({ date: iso, inMonth: cursor.getMonth() === month })
      cursor.setDate(cursor.getDate() + 1)
    }
    weeks.push(week)
  }
  return weeks
}

// Group releases by their ISO date for fast lookup in the grid.
function groupByDate(releases: DamRelease[]): Map<string, DamRelease[]> {
  const m = new Map<string, DamRelease[]>()
  for (const r of releases) {
    const arr = m.get(r.date)
    if (arr) arr.push(r)
    else m.set(r.date, [r])
  }
  return m
}

// Pick the first non-USACE color for an agency, falling back
// through the same taxonomy as the parent page. Inlined here
// because the grid renders agency colors per cell and we need
// a sync function not bundled with the server file.
function agencyDot(agency: string): string {
  if (agency.includes('USACE')) return 'var(--wt)'
  if (agency.includes('TVA')) return 'var(--rv)'
  if (agency.includes('FERC') || agency.includes('Brookfield') || agency.includes('Duke') || agency.includes('Georgia Power')) return 'var(--am)'
  return 'var(--tx3)'
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function ReleasesGrid({ releases, riverLookup }: Props) {
  const [view, setView] = useState<'list' | 'grid'>('list')
  const [selected, setSelected] = useState<string | null>(null)

  // Read persisted view preference once on mount.
  useEffect(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY)
      if (v === 'grid' || v === 'list') setView(v)
    } catch {}
  }, [])

  function pickView(v: 'list' | 'grid') {
    setView(v)
    try { localStorage.setItem(STORAGE_KEY, v) } catch {}
  }

  // Build the rolling 6-month window. Today + 5 future months.
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayIso = today.toISOString().slice(0, 10)
  const months: Array<{ year: number; month: number }> = []
  for (let i = 0; i < 6; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() + i, 1)
    months.push({ year: d.getFullYear(), month: d.getMonth() })
  }

  const releasesByDate = groupByDate(releases)

  return (
    <div>
      {/* View toggle pills */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', justifyContent: 'flex-end' }}>
        <button
          onClick={() => pickView('list')}
          style={{
            fontFamily: mono, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '.5px',
            padding: '6px 14px', borderRadius: '20px',
            cursor: 'pointer',
            border: view === 'list' ? '.5px solid var(--rvmd)' : '.5px solid var(--bd2)',
            background: view === 'list' ? 'var(--rvlt)' : 'var(--bg)',
            color: view === 'list' ? 'var(--rvdk)' : 'var(--tx2)',
            fontWeight: view === 'list' ? 600 : 400,
          }}
        >
          List
        </button>
        <button
          onClick={() => pickView('grid')}
          style={{
            fontFamily: mono, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '.5px',
            padding: '6px 14px', borderRadius: '20px',
            cursor: 'pointer',
            border: view === 'grid' ? '.5px solid var(--rvmd)' : '.5px solid var(--bd2)',
            background: view === 'grid' ? 'var(--rvlt)' : 'var(--bg)',
            color: view === 'grid' ? 'var(--rvdk)' : 'var(--tx2)',
            fontWeight: view === 'grid' ? 600 : 400,
          }}
        >
          Calendar
        </button>
      </div>

      {/* The list view is rendered server-side as the page's
          default content. The grid view renders here when
          the user picks it. We use display:none rather than
          conditional unmount so the server-rendered list
          stays in the DOM and the toggle is instant. */}
      {view === 'list' && (
        <div data-releases-list-marker style={{ display: 'block' }} />
      )}

      {view === 'grid' && (
        <div>
          {months.map(({ year, month }) => {
            const grid = buildMonthGrid(year, month)
            const monthIso = `${year}-${String(month + 1).padStart(2, '0')}`
            // Show a "no releases this month" placeholder rather
            // than rendering an empty grid.
            const monthHasReleases = releases.some(r => r.date.startsWith(monthIso))
            if (!monthHasReleases) {
              return (
                <div key={`${year}-${month}`} style={{ marginBottom: '20px', padding: '14px', background: 'var(--bg2)', border: '.5px solid var(--bd)', borderRadius: 'var(--r)' }}>
                  <div style={{ fontFamily: serif, fontSize: '16px', fontWeight: 700, color: 'var(--tx3)', marginBottom: '4px' }}>
                    {MONTH_NAMES[month]} {year}
                  </div>
                  <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)' }}>
                    No scheduled releases this month
                  </div>
                </div>
              )
            }

            return (
              <div key={`${year}-${month}`} style={{ marginBottom: '24px' }}>
                <h3 style={{ fontFamily: serif, fontSize: '18px', fontWeight: 700, color: 'var(--rvdk)', margin: '0 0 8px' }}>
                  {MONTH_NAMES[month]} {year}
                </h3>

                {/* Day-of-week header */}
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
                  gap: '2px', marginBottom: '4px',
                }}>
                  {DAY_HEADERS.map(d => (
                    <div key={d} style={{
                      fontFamily: mono, fontSize: '8px', color: 'var(--tx3)',
                      textAlign: 'center', textTransform: 'uppercase', letterSpacing: '.5px',
                      padding: '4px 0',
                    }}>
                      {d}
                    </div>
                  ))}
                </div>

                {/* Calendar weeks */}
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
                  gap: '2px',
                }}>
                  {grid.flat().map(cell => {
                    const cellReleases = releasesByDate.get(cell.date) || []
                    const isToday = cell.date === todayIso
                    const isSelected = cell.date === selected
                    const hasReleases = cellReleases.length > 0
                    return (
                      <button
                        key={cell.date}
                        onClick={() => hasReleases && setSelected(isSelected ? null : cell.date)}
                        disabled={!hasReleases}
                        style={{
                          minHeight: '56px',
                          padding: '4px 4px 6px',
                          border: isSelected ? '1px solid var(--rv)' : isToday ? '1px solid var(--rvmd)' : '.5px solid var(--bd)',
                          borderRadius: '4px',
                          background: !cell.inMonth ? 'transparent'
                            : isSelected ? 'var(--rvlt)'
                            : isToday ? 'var(--rvlt)'
                            : hasReleases ? 'var(--bg)' : 'var(--bg2)',
                          cursor: hasReleases ? 'pointer' : 'default',
                          opacity: cell.inMonth ? 1 : 0.3,
                          textAlign: 'left',
                          fontFamily: 'inherit',
                          color: 'inherit',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px',
                          overflow: 'hidden',
                        }}
                      >
                        <span style={{
                          fontFamily: mono, fontSize: '10px', fontWeight: isToday ? 700 : 500,
                          color: isToday ? 'var(--rvdk)' : 'var(--tx2)',
                        }}>
                          {parseInt(cell.date.slice(-2), 10)}
                        </span>
                        {hasReleases && cell.inMonth && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
                            {cellReleases.slice(0, 3).map(r => (
                              <span
                                key={r.id}
                                style={{
                                  width: '6px', height: '6px', borderRadius: '50%',
                                  background: agencyDot(r.agency),
                                }}
                              />
                            ))}
                            {cellReleases.length > 3 && (
                              <span style={{ fontFamily: mono, fontSize: '7px', color: 'var(--tx3)' }}>+{cellReleases.length - 3}</span>
                            )}
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}

          {/* Selected-day detail panel */}
          {selected && (
            <div style={{
              position: 'sticky', bottom: '14px',
              marginTop: '20px', padding: '14px',
              background: 'var(--bg)', border: '1px solid var(--rvmd)',
              borderRadius: 'var(--rlg)', boxShadow: '0 4px 16px rgba(0,0,0,.08)',
              zIndex: 5,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                <h4 style={{ fontFamily: serif, fontSize: '15px', fontWeight: 700, color: 'var(--rvdk)', margin: 0 }}>
                  {new Date(selected + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </h4>
                <button
                  onClick={() => setSelected(null)}
                  style={{
                    fontFamily: mono, fontSize: '9px', color: 'var(--tx3)',
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  }}
                >
                  &times; close
                </button>
              </div>
              {(releasesByDate.get(selected) || []).map(r => {
                const river = riverLookup[r.riverId]
                return (
                  <div key={r.id} style={{
                    padding: '10px 0',
                    borderTop: '.5px solid var(--bd)',
                    display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap',
                  }}>
                    <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                      {river ? (
                        <Link href={river.url} style={{ fontFamily: serif, fontSize: '14px', fontWeight: 600, color: 'var(--rvdk)', textDecoration: 'none' }}>
                          {river.name}
                        </Link>
                      ) : (
                        <span style={{ fontFamily: serif, fontSize: '14px', fontWeight: 600, color: 'var(--tx2)' }}>{r.riverId}</span>
                      )}
                      <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', marginTop: '2px' }}>
                        {r.name}
                      </div>
                      {r.notes && (
                        <div style={{ fontSize: '11px', color: 'var(--tx2)', lineHeight: 1.5, marginTop: '6px' }}>
                          {r.notes}
                        </div>
                      )}
                      <a href={r.sourceUrl} target="_blank" rel="noopener noreferrer"
                        style={{ display: 'inline-block', fontFamily: mono, fontSize: '9px', color: 'var(--rv)', marginTop: '6px', textDecoration: 'none' }}>
                        Verify {r.agency.split(' ')[0]} schedule &rarr;
                      </a>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      {r.expectedCfs && (
                        <div>
                          <div style={{ fontFamily: serif, fontSize: '17px', fontWeight: 700, color: 'var(--rvdk)' }}>
                            {r.expectedCfs.toLocaleString()}
                          </div>
                          <div style={{ fontFamily: mono, fontSize: '8px', color: 'var(--tx3)', textTransform: 'uppercase' }}>cfs</div>
                        </div>
                      )}
                      {(r.startTime || r.endTime) && (
                        <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', marginTop: '4px' }}>
                          {r.startTime}{r.startTime && r.endTime ? '\u2013' : ''}{r.endTime}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Legend */}
          <div style={{
            marginTop: '14px', padding: '10px 14px',
            background: 'var(--bg2)', borderRadius: 'var(--r)', border: '.5px solid var(--bd)',
            display: 'flex', gap: '14px', flexWrap: 'wrap',
            fontFamily: mono, fontSize: '9px', color: 'var(--tx2)',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: 8, height: 8, background: 'var(--wt)', borderRadius: '50%' }} /> USACE
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: 8, height: 8, background: 'var(--rv)', borderRadius: '50%' }} /> TVA
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: 8, height: 8, background: 'var(--am)', borderRadius: '50%' }} /> FERC / Private hydro
            </span>
            <span style={{ marginLeft: 'auto', color: 'var(--tx3)' }}>Click a day to see release details</span>
          </div>
        </div>
      )}

      {/* CSS to hide the parent's list view when grid is active.
          The list view in page.tsx wraps itself in
          [data-releases-list-content], and we apply
          display:none when this child sets the body data
          attribute. */}
      <style>{`
        body[data-releases-view='grid'] [data-releases-list-content] { display: none !important; }
        body[data-releases-view='list'] [data-releases-list-content] { display: block !important; }
      `}</style>
      <SyncBodyAttribute view={view} />
    </div>
  )
}

// Tiny helper that writes the current view to a body data
// attribute on mount and on change. Lets the CSS rules above
// hide the server-rendered list view without React having to
// own its DOM.
function SyncBodyAttribute({ view }: { view: 'list' | 'grid' }) {
  useEffect(() => {
    document.body.setAttribute('data-releases-view', view)
    return () => { document.body.removeAttribute('data-releases-view') }
  }, [view])
  return null
}
