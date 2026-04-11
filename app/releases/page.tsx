import type { Metadata } from 'next'
import Link from 'next/link'
import { DAM_RELEASES, getUpcomingReleases, groupBySeason } from '@/data/dam-releases'
import { ALL_RIVERS, getStateSlug, getRiverSlug } from '@/data/rivers'
import type { DamRelease } from '@/types'
import ReleasesGrid from './ReleasesGrid'

export const metadata: Metadata = {
  title: 'Dam Release Calendar | RiverScout',
  description: 'Scheduled whitewater dam releases across America — Gauley fall season, Lehigh recreational releases, Russell Fork, West River, Ocoee, and more. Plan your release-day trip with USACE, TVA, and FERC release schedules in one place.',
  alternates: {
    canonical: 'https://riverscout.app/releases',
  },
  openGraph: {
    title: 'Dam Release Calendar | RiverScout',
    description: 'Scheduled whitewater dam releases across America \u2014 Gauley, Lehigh, Russell Fork, West River, Ocoee, and more.',
    url: 'https://riverscout.app/releases',
    siteName: 'RiverScout',
    type: 'website',
  },
}

const mono = "'IBM Plex Mono', monospace"
const serif = "'Playfair Display', serif"

// Pre-build a river_id → display info lookup so the page can
// render river names + slug-based URLs without walking ALL_RIVERS
// for every release card.
function buildRiverLookup() {
  const byId: Record<string, { name: string; stateName: string; url: string }> = {}
  for (const r of ALL_RIVERS) {
    byId[r.id] = {
      name: r.n,
      stateName: r.stateName as string,
      url: `/rivers/${getStateSlug(r.stateKey as string)}/${getRiverSlug(r)}`,
    }
  }
  return byId
}

// Format an ISO date as "Sat, Sep 12" — the calendar uses these
// short labels everywhere because the year is implicit (2026).
function formatShortDate(iso: string): string {
  const d = new Date(iso + 'T12:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function formatLongDate(iso: string): string {
  const d = new Date(iso + 'T12:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

// Calculate days from today to the release. Negative = past.
function daysFromToday(iso: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(iso + 'T12:00:00')
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

function relativeTime(iso: string): string {
  const days = daysFromToday(iso)
  if (days === 0) return 'today'
  if (days === 1) return 'tomorrow'
  if (days < 7) return `in ${days} days`
  if (days < 14) return 'next week'
  if (days < 60) return `in ${Math.round(days / 7)} weeks`
  return `in ${Math.round(days / 30)} months`
}

// Render the colored agency chip — quick visual taxonomy of who
// runs which release.
function agencyColors(agency: string): { bg: string; color: string; border: string } {
  if (agency.includes('USACE')) return { bg: 'var(--wtlt)', color: 'var(--wt)', border: 'var(--wtmd)' }
  if (agency.includes('TVA')) return { bg: 'var(--rvlt)', color: 'var(--rvdk)', border: 'var(--rvmd)' }
  if (agency.includes('FERC') || agency.includes('Brookfield') || agency.includes('Duke') || agency.includes('Georgia Power')) {
    return { bg: 'var(--amlt)', color: 'var(--am)', border: 'var(--am)' }
  }
  return { bg: 'var(--bg2)', color: 'var(--tx2)', border: 'var(--bd2)' }
}

export default function ReleasesPage() {
  const now = new Date()
  const riverLookup = buildRiverLookup()

  const upcomingAll = getUpcomingReleases(now)
  const upcoming30 = getUpcomingReleases(now, 30)
  const upcoming90 = getUpcomingReleases(now, 90)

  // Group everything beyond the next 30 days by season label so
  // the Gauley fall season folds into a single block instead of
  // 22 individual cards.
  const beyond30 = upcomingAll.filter(r => !upcoming30.includes(r))
  const seasonGroups = groupBySeason(beyond30)

  const totalUpcoming = upcomingAll.length
  const riversWithReleases = new Set(DAM_RELEASES.map(r => r.riverId)).size

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--tx)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 20px 60px' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--rv)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>
            Dam Release Calendar
          </div>
          <h1 style={{ fontFamily: serif, fontSize: '26px', fontWeight: 700, color: 'var(--rvdk)', margin: '0 0 6px' }}>
            Scheduled Whitewater Releases
          </h1>
          <div style={{ fontSize: '13px', color: 'var(--tx2)', lineHeight: 1.6, marginBottom: '8px' }}>
            {totalUpcoming} upcoming release{totalUpcoming === 1 ? '' : 's'} on {riversWithReleases} rivers \u2014 USACE, TVA, FERC, and state agency schedules in one calendar. Plan your trip around the Gauley fall season, Lehigh recreational releases, Russell Fork in October, and the West River weekends.
          </div>
          <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)' }}>
            Each release is hand-curated against the operating agency&rsquo;s 2026 schedule. Verify the source link before driving.
          </div>
        </div>

        {/* List/Grid view toggle. The grid view is owned by the
            ReleasesGrid client component (renders both the toggle
            buttons and, when active, the calendar grid itself).
            The server-rendered list view sits in a wrapper marked
            with data-releases-list-content so the grid component
            can toggle its visibility via a body attribute + CSS
            without remounting. */}
        {upcomingAll.length > 0 && (
          <ReleasesGrid releases={upcomingAll} riverLookup={riverLookup} />
        )}

        <div data-releases-list-content>
        {/* Empty state */}
        {totalUpcoming === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--tx3)', fontFamily: mono, fontSize: '12px' }}>
            No upcoming releases in our calendar. Check back as next year&rsquo;s schedules are published.
          </div>
        )}

        {/* Next 30 days — flat list, day-by-day */}
        {upcoming30.length > 0 && (
          <section style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h2 style={{ fontFamily: serif, fontSize: '20px', fontWeight: 700, color: 'var(--rvdk)', margin: 0 }}>
                Next 30 Days
              </h2>
              <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)' }}>
                {upcoming30.length} release{upcoming30.length === 1 ? '' : 's'}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {upcoming30.map(r => (
                <ReleaseCard key={r.id} release={r} river={riverLookup[r.riverId]} expanded />
              ))}
            </div>
          </section>
        )}

        {/* Beyond 30 days — grouped by season label */}
        {seasonGroups.size > 0 && (
          <section style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h2 style={{ fontFamily: serif, fontSize: '20px', fontWeight: 700, color: 'var(--rvdk)', margin: 0 }}>
                Beyond 30 Days
              </h2>
              <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)' }}>
                {beyond30.length} release{beyond30.length === 1 ? '' : 's'} across {seasonGroups.size} event{seasonGroups.size === 1 ? '' : 's'}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Array.from(seasonGroups.entries()).map(([label, releases]) => (
                <SeasonBlock key={label} label={label} releases={releases} river={riverLookup[releases[0].riverId]} />
              ))}
            </div>
          </section>
        )}
        </div>{/* /data-releases-list-content */}

        {/* Helpful footnote */}
        <div style={{ marginTop: '40px', padding: '14px 16px', background: 'var(--bg2)', borderRadius: 'var(--r)', border: '.5px solid var(--bd)' }}>
          <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
            About this calendar
          </div>
          <div style={{ fontSize: '12px', color: 'var(--tx2)', lineHeight: 1.6 }}>
            Releases are hand-curated from the operating agency&rsquo;s published 2026 schedules (USACE, TVA, Brookfield Renewable, Duke Energy, etc.). Some agencies post the full year by January; others release schedules monthly. We re-curate annually as new schedules are published. <strong>Always verify the official schedule via the source link before traveling</strong> \u2014 release dates and flows can change with reservoir conditions.
            <br /><br />
            Coverage gap: daily summer releases on rivers like the Kennebec Gorge, Cherry Creek, and Upper Yough are not enumerated day-by-day yet. Those will be added via a state agency / USACE scraper similar to our Michigan DNR stocking pipeline.
          </div>
        </div>
      </div>
    </main>
  )
}

// ── Card components ───────────────────────────────────────────

function ReleaseCard({ release, river, expanded }: {
  release: DamRelease
  river: { name: string; stateName: string; url: string } | undefined
  expanded?: boolean
}) {
  const agency = agencyColors(release.agency)
  const days = daysFromToday(release.date)
  const isToday = days === 0
  const isTomorrow = days === 1

  return (
    <div style={{
      border: isToday ? '1px solid var(--rv)' : '.5px solid var(--bd)',
      borderRadius: 'var(--r)',
      padding: '12px 14px',
      background: isToday ? 'var(--rvlt)' : 'var(--bg)',
      display: 'grid',
      gridTemplateColumns: 'auto 1fr auto',
      gap: '14px',
      alignItems: 'flex-start',
    }}>
      {/* Date column */}
      <div style={{
        textAlign: 'center', minWidth: '52px',
        padding: '6px 8px',
        background: isToday ? 'var(--rv)' : 'var(--bg2)',
        color: isToday ? '#fff' : 'var(--rvdk)',
        borderRadius: '6px',
        border: isToday ? 'none' : '.5px solid var(--bd)',
      }}>
        <div style={{ fontFamily: mono, fontSize: '8px', textTransform: 'uppercase', letterSpacing: '.5px', opacity: 0.75 }}>
          {new Date(release.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' })}
        </div>
        <div style={{ fontFamily: serif, fontSize: '20px', fontWeight: 700, lineHeight: 1.1 }}>
          {new Date(release.date + 'T12:00:00').getDate()}
        </div>
        <div style={{ fontFamily: mono, fontSize: '8px', textTransform: 'uppercase', letterSpacing: '.5px', opacity: 0.75 }}>
          {new Date(release.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short' })}
        </div>
      </div>

      {/* Content column */}
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
          {river ? (
            <Link href={river.url} style={{ fontFamily: serif, fontSize: '15px', fontWeight: 600, color: 'var(--rvdk)', textDecoration: 'none' }}>
              {river.name}
            </Link>
          ) : (
            <span style={{ fontFamily: serif, fontSize: '15px', fontWeight: 600, color: 'var(--tx2)' }}>
              {release.riverId}
            </span>
          )}
          {river && (
            <span style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)' }}>
              {river.stateName}
            </span>
          )}
          <span style={{
            fontFamily: mono, fontSize: '8px',
            padding: '2px 6px', borderRadius: '8px',
            background: agency.bg, color: agency.color,
            border: `.5px solid ${agency.border}`,
            textTransform: 'uppercase', letterSpacing: '.4px', fontWeight: 600,
          }}>
            {release.agency.split(' ')[0]}
          </span>
        </div>
        <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx2)', marginBottom: '4px' }}>
          {release.name}
        </div>
        {expanded && release.notes && (
          <div style={{ fontSize: '11px', color: 'var(--tx2)', lineHeight: 1.5, marginTop: '6px' }}>
            {release.notes}
          </div>
        )}
        {expanded && (
          <a href={release.sourceUrl} target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-block', fontFamily: mono, fontSize: '9px', color: 'var(--rv)', marginTop: '6px', textDecoration: 'none' }}>
            Verify schedule &rarr;
          </a>
        )}
      </div>

      {/* Stats column */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        {release.expectedCfs && (
          <div>
            <div style={{ fontFamily: serif, fontSize: '17px', fontWeight: 700, color: 'var(--rvdk)' }}>
              {release.expectedCfs.toLocaleString()}
            </div>
            <div style={{ fontFamily: mono, fontSize: '8px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.4px' }}>
              cfs
            </div>
          </div>
        )}
        {(release.startTime || release.endTime) && (
          <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', marginTop: '4px' }}>
            {release.startTime}{release.startTime && release.endTime ? '–' : ''}{release.endTime}
          </div>
        )}
        <div style={{ fontFamily: mono, fontSize: '9px', color: isToday ? 'var(--rv)' : isTomorrow ? 'var(--am)' : 'var(--tx3)', marginTop: '4px', fontWeight: isToday || isTomorrow ? 600 : 400 }}>
          {relativeTime(release.date)}
        </div>
      </div>
    </div>
  )
}

function SeasonBlock({ label, releases, river }: {
  label: string
  releases: DamRelease[]
  river: { name: string; stateName: string; url: string } | undefined
}) {
  const first = releases[0]
  const last = releases[releases.length - 1]
  const agency = agencyColors(first.agency)
  const cfs = first.expectedCfs

  return (
    <div style={{
      border: '.5px solid var(--bd)',
      borderRadius: 'var(--r)',
      padding: '14px 16px',
      background: 'var(--bg2)',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <h3 style={{ fontFamily: serif, fontSize: '16px', fontWeight: 700, color: 'var(--rvdk)', margin: 0 }}>
            {label}
          </h3>
          <span style={{
            fontFamily: mono, fontSize: '8px',
            padding: '2px 6px', borderRadius: '8px',
            background: agency.bg, color: agency.color,
            border: `.5px solid ${agency.border}`,
            textTransform: 'uppercase', letterSpacing: '.4px', fontWeight: 600,
          }}>
            {first.agency.split(' ')[0]}
          </span>
        </div>
        {cfs && (
          <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)' }}>
            <strong style={{ color: 'var(--rvdk)', fontFamily: serif, fontSize: '14px' }}>{cfs.toLocaleString()}</strong> cfs typical
          </div>
        )}
      </div>

      {river && (
        <Link href={river.url} style={{ fontFamily: mono, fontSize: '11px', color: 'var(--rv)', textDecoration: 'none', display: 'block', marginBottom: '8px' }}>
          {river.name} &middot; {river.stateName} &rarr;
        </Link>
      )}

      <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', marginBottom: '8px' }}>
        {releases.length} release day{releases.length === 1 ? '' : 's'}
        {' \u00b7 '}
        {formatShortDate(first.date)}{first.date !== last.date ? ` to ${formatShortDate(last.date)}` : ''}
      </div>

      {/* Date chips */}
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {releases.map(r => {
          const d = new Date(r.date + 'T12:00:00')
          return (
            <span key={r.id} title={`${formatLongDate(r.date)}${r.notes ? ': ' + r.notes : ''}`}
              style={{
                fontFamily: mono, fontSize: '9px',
                padding: '3px 7px', borderRadius: '4px',
                background: 'var(--bg)', color: 'var(--tx2)',
                border: '.5px solid var(--bd)',
              }}>
              {d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )
        })}
      </div>

      {first.notes && (
        <div style={{ fontSize: '11px', color: 'var(--tx2)', lineHeight: 1.5, marginTop: '10px' }}>
          {first.notes}
        </div>
      )}

      <a href={first.sourceUrl} target="_blank" rel="noopener noreferrer"
        style={{ display: 'inline-block', fontFamily: mono, fontSize: '9px', color: 'var(--rv)', marginTop: '8px', textDecoration: 'none' }}>
        Verify {first.agency.split(' ')[0]} schedule &rarr;
      </a>
    </div>
  )
}
