import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getRiverBySlug, getStateSlug, getRiverSlug, ALL_RIVERS } from '@/data/rivers'
import { fetchGaugeData, formatCfs, celsiusToFahrenheit, coldWaterMessage, coldWaterSeverity } from '@/lib/usgs'
import HeroSparkline from '@/components/rivers/HeroSparkline'
import ConnectedRouteBadge from '@/components/rivers/ConnectedRouteBadge'
import { createSupabaseServerClient } from '@/lib/supabase-server'

// Lazy lookup of the active gauge's cached avg + section name from
// the river_gauges table. Returns null when no row exists for that
// (river_id, gauge_id) pair — the caller falls back to the river's
// static avg in that case. We don't trigger the USGS-stats refill
// here; that happens in the GaugeSwitcher's API call.
async function fetchActiveGaugeMeta(riverId: string, gaugeId: string): Promise<{ avg_flow_cfs: number | null; river_section: string | null } | null> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data } = await supabase
      .from('river_gauges')
      .select('avg_flow_cfs, river_section')
      .eq('river_id', riverId)
      .eq('gauge_id', gaugeId)
      .maybeSingle()
    return data ?? null
  } catch {
    return null
  }
}
import RiverTabs from '@/components/rivers/RiverTabs'
import SuggestCorrection from '@/components/SuggestCorrection'
import SaveOffline from '@/components/SaveOffline'
import SaveRiver from '@/components/SaveRiver'
import DataConfidenceBanner from '@/components/rivers/DataConfidenceBanner'
import HazardBanner from '@/components/rivers/HazardBanner'
import { getDesignationBadges } from '@/lib/designations'
import { RAPIDS } from '@/data/rapids'
import { fetchRiverPageData } from '@/lib/river-page-data'
import { hasFisheries } from '@/data/fisheries-keys'
import { VERIFICATION_TAGS } from '@/lib/needs-verification'
import { FISHERIES } from '@/data/fisheries'
import { getNextReleaseForRiver } from '@/data/dam-releases'
import SubscribeReleaseAlert from '@/components/rivers/SubscribeReleaseAlert'
import type { Metadata } from 'next'

export const revalidate = 900

interface Props {
  params: Promise<{ state: string; slug: string }>
  searchParams: Promise<{ gauge?: string }>
}

export async function generateStaticParams() {
  return ALL_RIVERS.map(r => ({
    state: getStateSlug(r.stateKey),
    slug: getRiverSlug(r),
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, slug } = await params
  const river = getRiverBySlug(state, slug)
  if (!river) return { title: 'River Not Found — RiverScout' }

  // Title format: "[River Name] Conditions & Flow Data | RiverScout"
  const title = `${river.n} Conditions & Flow Data | RiverScout`

  // Description: 150-160 chars, river-specific, includes state and
  // a fishing or paddling hook. Detect whether the river has
  // fisheries data so we can lean into trout/steelhead/fishing
  // language for known fishing destinations and into class/whitewater
  // language for paddling-first rivers. Keep the live-CFS hook.
  const description = buildRiverDescription(river)

  const canonicalUrl = `https://riverscout.app/rivers/${state}/${slug}`

  return {
    title,
    description,
    // Canonical URL — explicit so Google doesn't try to canonicalize
    // to a different variant (trailing slash, query string, etc.)
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'RiverScout',
      type: 'website',
      // Per-page OG image route generates a branded card with the
      // river name and live conditions — see opengraph-image.tsx in
      // this segment. Falls back to the static /icon.svg if the
      // image route fails to render.
      images: [
        {
          url: '/icon.svg',
          width: 512,
          height: 512,
          alt: `${river.n} — RiverScout`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/icon.svg'],
    },
  }
}

// Build a 150-160 character meta description tailored to the river.
// Lean into fishing language when the river has fisheries data,
// paddling/class language otherwise. Always include the state and
// the live-CFS hook. Output is hard-clamped to 160 chars.
function buildRiverDescription(river: ReturnType<typeof getRiverBySlug> & object): string {
  const name = river.n
  const stateName = river.stateName
  const fish = hasFisheries(river.id) ? FISHERIES[river.id] : null

  // Build a fishing-oriented hook for known fisheries
  if (fish) {
    const primary = fish.species?.find(s => s.primary)
    const hasSteelhead = fish.species?.some(s => /steelhead/i.test(s.name))
    const hasTrout = fish.species?.some(s => /trout/i.test(s.name))
    const hasSalmon = fish.species?.some(s => /salmon/i.test(s.name))
    const hook =
      hasSteelhead && hasSalmon ? 'steelhead and salmon runs'
        : hasSteelhead ? 'steelhead runs'
        : hasTrout ? 'trout fishing and hatch calendar'
        : primary ? `${primary.name.toLowerCase()} fishing`
        : 'fishing reports'
    return clamp160(
      `Live ${name} conditions in ${stateName} — current CFS, 7-day forecast, ${hook}, stocking reports, and trip planning. Updated every 15 minutes from USGS.`
    )
  }

  // Paddling-oriented hook
  const classNote = river.cls && river.cls !== 'I' ? `Class ${river.cls} whitewater, ` : ''
  return clamp160(
    `Live ${name} conditions in ${stateName} — current CFS, optimal flows ${river.opt}, ${classNote}7-day forecast, access points, and trip reports. Updated every 15 minutes.`
  )
}

// Hard-clamp to 160 characters at a word boundary.
function clamp160(s: string): string {
  if (s.length <= 160) return s
  const cut = s.slice(0, 159)
  const lastSpace = cut.lastIndexOf(' ')
  return (lastSpace > 120 ? cut.slice(0, lastSpace) : cut) + '…'
}

const COND_LABEL: Record<string, string> = {
  optimal: 'Optimal',
  low:     'Below Optimal',
  high:    'Above Optimal',
  flood:   'Flood',
  loading: 'Loading…',
}

export default async function RiverPage({ params, searchParams }: Props) {
  const { state, slug } = await params
  const sp = await searchParams
  const staticRiver = getRiverBySlug(state, slug)
  if (!staticRiver) notFound()

  // Multi-gauge support: when the URL has ?gauge=<id> AND that id is
  // a known gauge for this river, fetch flow from that gauge instead
  // of the river's primary. The GaugeSwitcher component sets this
  // param when the user picks a non-primary gauge from the popover.
  // Validation is handled by the API route — for performance we
  // trust the param here and just feed it to fetchGaugeData.
  const activeGaugeId = sp.gauge && /^[A-Za-z0-9]+$/.test(sp.gauge) ? sp.gauge : staticRiver.g
  const isNonPrimary = activeGaugeId !== staticRiver.g

  // Fire flow data, page batch, and (if a gauge was switched) the
  // active gauge's cached avg + section name in parallel.
  const [flow, prefetched, activeGaugeMeta] = await Promise.all([
    fetchGaugeData(activeGaugeId, staticRiver.opt),
    fetchRiverPageData(staticRiver.id, staticRiver.stateKey),
    isNonPrimary ? fetchActiveGaugeMeta(staticRiver.id, activeGaugeId) : Promise.resolve(null),
  ])

  // Active gauge avg + section: if the user picked a non-primary
  // gauge AND we have a cached avg in river_gauges, override the
  // static river.avg + show the section name below the CFS number.
  // Falls back gracefully when the gauge isn't in the DB or the
  // avg hasn't been populated yet (the /api/rivers/[id]/gauges
  // route lazy-fills it on first call).
  const activeAvg = activeGaugeMeta?.avg_flow_cfs ?? staticRiver.avg
  const activeSection = activeGaugeMeta?.river_section ?? null

  // Apply admin-approved field overrides on top of the static river
  // record. The override layer (lib/river-page-data.ts) reads from
  // public.river_field_overrides; without overrides this is a no-op
  // and the page renders the static data unchanged.
  //
  // **MUST stay in sync** with the OVERRIDEABLE_SCALAR_FIELDS +
  // OVERRIDEABLE_ARRAY_FIELDS allow-lists in
  // app/api/suggestions/route.ts. Any field the approve handler
  // accepts but this merge doesn't handle will be silently
  // dropped at render time — that's the bug class that hid the
  // Pine River sections fix until we found it.
  //
  // SCALAR_FIELD_TO_STATIC: scalar string fields go straight in.
  const SCALAR_FIELD_TO_STATIC: Record<string, keyof typeof staticRiver> = {
    cls: 'cls',
    opt: 'opt',
    len: 'len',
    desc: 'desc',
    desig: 'desig',
    gauge: 'g',
    safe_cfs: 'safe_cfs',
  }

  // Array fields (the override `value` is a JSON-encoded array).
  // For sections, we parse the JSON and assign to River.secs.
  // The species field is also an array but it lives in
  // data/fisheries.ts and gets applied inside RiverTabs at the
  // Fishing-tab render — see fieldOverrides passed through
  // initialData.
  const ARRAY_FIELD_TO_STATIC: Record<string, keyof typeof staticRiver> = {
    sections: 'secs',
  }

  const river: typeof staticRiver = { ...staticRiver }
  for (const [field, value] of Object.entries(prefetched.fieldOverrides)) {
    const scalarTarget = SCALAR_FIELD_TO_STATIC[field]
    if (scalarTarget) {
      ;(river as Record<string, unknown>)[scalarTarget] = value
      continue
    }

    const arrayTarget = ARRAY_FIELD_TO_STATIC[field]
    if (arrayTarget) {
      try {
        const parsed = JSON.parse(value)
        if (Array.isArray(parsed)) {
          ;(river as Record<string, unknown>)[arrayTarget] = parsed
        }
      } catch {
        // Malformed override JSON — fall through to the static
        // value rather than crashing the page render.
      }
    }
  }

  // Subtract cleared verification tags from the static
  // needsVerification array. The DataConfidenceBanner sees only
  // the still-pending tags.
  const staticTags = (staticRiver.needsVerification as string[] | undefined) ?? []
  const clearedSet = new Set(prefetched.clearedVerificationTags)
  const mergedNeedsVerification = staticTags.filter(t => !clearedSet.has(t))

  // Verified-rapids check: static data first, then Supabase fallback (already
  // included in the prefetched batch — no extra round trip).
  const isVerified =
    !!(RAPIDS[river.id] && RAPIDS[river.id].length > 0) || prefetched.hasSupabaseRapids

  // Build the currentValues map for the SuggestCorrection modal so
  // it can pre-fill its "what does it say now?" field. Critical for
  // array fields like sections — without a pre-fill, a user editing
  // one section types just one line, which wipes the other entries
  // when the override layer replaces the whole array. With pre-fill,
  // they edit the existing list naturally.
  const currentValuesForSuggest: Record<string, string> = {
    cls: river.cls ?? '',
    opt: river.opt ?? '',
    len: river.len ?? '',
    desc: river.desc ?? '',
    desig: river.desig ?? '',
    gauge: river.g ?? '',
    safe_cfs: river.safe_cfs ?? '',
    sections: (river.secs ?? []).join('\n'),
  }
  // Species lives in fisheries data; merge any approved species
  // override on top before pre-filling. We render as one species
  // name per line because the modal accepts newline-separated
  // input for array fields.
  if (hasFisheries(river.id)) {
    const fishStatic = FISHERIES[river.id]
    let speciesArr = fishStatic?.species ?? []
    const speciesOverride = prefetched.fieldOverrides.species
    if (speciesOverride) {
      try {
        const parsed = JSON.parse(speciesOverride)
        if (Array.isArray(parsed)) speciesArr = parsed
      } catch { /* fall through to static */ }
    }
    currentValuesForSuggest.species = speciesArr.map(s => s.name).join('\n')
  }

  const condClass = {
    optimal: 'cond-opt',
    low:     'cond-low',
    high:    'cond-high',
    flood:   'cond-flood',
    loading: 'cond-loading',
  }[flow.condition]

  const backState = river.stateKey

  return (
    // NOTE: this used to be height:100vh + overflow:hidden with the
    // tab content scrolling inside its own little box. That produced
    // a tiny scroll window when there was a hazard banner + a
    // confidence banner + lots of header content (visible as "the
    // page is in a small window"). Switched to natural document
    // scroll: <main> grows to fit, the tab content panel grows with
    // it, and the browser handles the page scrollbar.
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--tx)', display: 'flex', flexDirection: 'column' }}>
      {/* ── River header — two-column layout ───────────────────
          Left: river name, badges, metadata
          Right: big CFS number, condition badge, rate, temp
          Uses the full header width instead of stacking
          everything in a single left-aligned column. */}
      <div style={{
        padding: '16px 20px', borderBottom: '.5px solid var(--bd)',
        background: 'var(--wtlt)', flexShrink: 0,
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap',
        }}>
          {/* ── Left column: identity ── */}
          <div style={{ flex: '1 1 300px', minWidth: 0 }}>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '26px', fontWeight: 700,
              color: '#042C53', margin: '0 0 6px', lineHeight: 1.2,
            }}>
              {river.n}
            </h1>

            {/* Designation badges */}
            {(() => {
              const badges = getDesignationBadges(river.desig)
              return badges.length > 0 ? (
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  {badges.map((b, i) => (
                    <span key={i} style={{
                      fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px',
                      padding: '2px 8px', borderRadius: '10px',
                      color: b.color, background: b.bg, border: `.5px solid ${b.border}`,
                      display: 'inline-flex', alignItems: 'center', gap: '3px',
                      letterSpacing: '.3px',
                    }}>
                      <span style={{ fontSize: '10px' }}>{b.icon}</span> {b.label}
                    </span>
                  ))}
                </div>
              ) : null
            })()}

            {/* Multi-river paddling system (e.g. Black Fork → Mohican
                → Walhonding → Muskingum → Ohio). Surfaces only when
                the river opted into a connectedRoute group. */}
            {river.connectedRoute && (
              <ConnectedRouteBadge
                currentRiverId={river.id}
                route={river.connectedRoute}
              />
            )}

            <div style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px',
              color: 'var(--wt)', marginBottom: '6px', letterSpacing: '.3px',
            }}>
              {river.co} · {river.len} · Class {river.cls}
            </div>

            <div style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px',
              color: 'var(--tx2)', marginBottom: '6px',
            }}>
              Optimal: <strong style={{ color: 'var(--rvdk)' }}>{river.opt}</strong> CFS · USGS #{river.g}
            </div>

            {/* Temp + cold-water safety on the left. Tier-based copy
                from coldWaterMessage(): ≤60 caution, ≤50 warning,
                ≤40 critical. Color tracks severity. */}
            {flow.tempC !== null && (() => {
              const sev = coldWaterSeverity(flow.tempC)
              const msg = coldWaterMessage(flow.tempC)
              const color = sev === 'critical' ? 'var(--dg)'
                          : sev === 'warning'  ? '#A32D2D'
                          : sev === 'caution'  ? '#7A4D0E'
                          :                       'var(--wt)'
              return (
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px',
                  color, marginBottom: '4px', fontWeight: sev ? 600 : 400,
                }}>
                  Water temp: {celsiusToFahrenheit(flow.tempC)}°F
                  {msg && ` — ${msg}`}
                </div>
              )
            })()}

            {river.safe_cfs && (
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px',
                color: '#7A4D0E', background: 'var(--amlt)',
                border: '.5px solid var(--am)', borderRadius: 'var(--r)',
                padding: '5px 10px', marginTop: '4px',
                display: 'inline-flex', alignItems: 'center', gap: '6px',
              }}>
                <span style={{ fontSize: '11px' }}>&#9888;</span>
                <span><strong>Safety limit:</strong> {river.safe_cfs}</span>
              </div>
            )}

            {/* Actions row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px' }}>
              <SaveRiver riverId={river.id} riverName={river.n} />
              <SaveOffline riverId={river.id} riverName={river.n} gaugeId={river.g} stateSlug={state} riverSlug={slug} />
            </div>
          </div>

          {/* ── Middle column: 10-day CFS sparkline ── */}
          {/* Renders skeleton until the forecast portion arrives;
              historical (past 7 days) appears immediately from the
              already-fetched flow.readings. On mobile the sparkline
              wraps below the CFS column rather than between. */}
          <HeroSparkline
            readings={flow.readings}
            optRange={river.opt}
            condition={flow.condition}
            gaugeId={activeGaugeId}
            currentCfs={flow.cfs}
            avgFlow={activeAvg}
          />

          {/* ── Right column: live flow data ── */}
          <div style={{
            flexShrink: 0, textAlign: 'right',
            minWidth: '180px',
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: '6px', marginBottom: '4px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--rv)', flexShrink: 0 }} className="pulse-dot" />
              <span style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '42px', fontWeight: 700,
                color: '#0C447C', lineHeight: 1,
              }}>
                {formatCfs(flow.cfs)}
              </span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '14px', color: 'var(--wt)' }}>CFS</span>
            </div>

            {/* Section label — only shown when a non-primary gauge is
                selected, so the user always knows which section the
                CFS reading represents. */}
            {activeSection && (
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx3)', marginBottom: '4px', letterSpacing: '.3px' }}>
                {activeSection}
              </div>
            )}

            {flow.gaugeHeightFt !== null && (
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', color: 'var(--tx2)', marginBottom: '6px' }}>
                {flow.gaugeHeightFt.toFixed(2)} ft gauge height
              </div>
            )}

            <span style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px',
              padding: '4px 14px', borderRadius: '20px', fontWeight: 600,
              display: 'inline-block', marginBottom: '8px',
            }} className={condClass}>
              {COND_LABEL[flow.condition]}
            </span>

            {/* Rate of change */}
            {flow.cfs !== null && (() => {
              const rate = flow.changePerHour
              const isStable = flow.rateLabel === 'Stable'
              const isUnknown = flow.rateLabel === 'Rate unknown' || rate === null

              let color: string
              let arrow = ''
              if (isUnknown) {
                color = 'var(--tx3)'
              } else if (isStable) {
                color = 'var(--tx3)'
                arrow = '\u2192'
              } else {
                const absRate = Math.abs(rate ?? 0)
                const isRising = (rate ?? 0) > 0
                arrow = isRising ? '\u2191' : '\u2193'
                if (isRising) {
                  if (absRate > 300) color = '#A32D2D'
                  else if (absRate > 100) color = '#BA7517'
                  else color = '#3CA86E'
                } else {
                  if (absRate > 300) color = '#6E4BB4'
                  else if (absRate > 100) color = '#0C447C'
                  else color = '#5B8DBF'
                }
              }

              return (
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px',
                  color, fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                  gap: '6px',
                }}>
                  {arrow && <span style={{ fontSize: '13px' }}>{arrow}</span>}
                  <span>{flow.rateLabel}</span>
                  {flow.changeIn3Hours !== null && Math.abs(flow.changeIn3Hours) >= 25 && (
                    <span style={{ fontWeight: 400, color: 'var(--tx3)' }}>
                      ({flow.changeIn3Hours > 0 ? '+' : ''}{flow.changeIn3Hours.toLocaleString()} in 3h)
                    </span>
                  )}
                </div>
              )
            })()}
          </div>
        </div>
      </div>

      {/* ── Contextual contribution prompt ───────────────────
          Replaces the old generic "Improve This River" button
          with a specific ask that references something actually
          unverified on this river. Uses the needsVerification
          tags, or a fallback generic invite if the river has
          no open verification items. */}
      {(() => {
        // Pick the first unverified item to generate a specific ask.
        // If everything is verified, show a softer generic prompt.
        const firstTag = mergedNeedsVerification[0]
        const tagMeta = firstTag ? (VERIFICATION_TAGS as Record<string, { label: string; description: string; suggestField: string }>)[firstTag] : null

        const prompt = tagMeta
          ? tagMeta.description
          : prefetched.accessPoints.length === 0
            ? `Know any put-in or take-out locations on the ${river.n}? Help fellow paddlers find the water.`
            : `Know the ${river.n}? Your local knowledge keeps this page accurate for every paddler, angler, and guide who uses it.`

        const ctaField = tagMeta?.suggestField ?? ''

        return (
          <div style={{
            flexShrink: 0, padding: '10px 16px',
            background: 'var(--rvlt)', borderBottom: '.5px solid var(--rvmd)',
            display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
          }}>
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px',
              color: 'var(--rvdk)', opacity: 0.7,
              textTransform: 'uppercase', letterSpacing: '.5px', fontWeight: 600,
              flexShrink: 0,
            }}>
              {tagMeta ? 'Help needed' : 'Know this river?'}
            </span>
            <div style={{ flex: '1 1 200px', minWidth: 0 }}>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px',
                color: 'var(--rvdk)', lineHeight: 1.55,
              }}>
                {prompt}
              </div>
            </div>
            <SuggestCorrection
              riverId={river.id}
              riverName={river.n}
              stateKey={river.stateKey}
              currentValues={currentValuesForSuggest}
              initialField={ctaField || undefined}
            />
          </div>
        )
      })()}

      {/* Rapid Rise warning — fires when the river is rising at more
          than 500 cfs/hr. This is a hard safety threshold (think
          spring freshet, dam release, or thunderstorm runoff) and the
          banner is intentionally impossible to miss: full-width red,
          pulsing background, white text. Renders above every other
          banner. The pulse animation is suppressed for users with
          prefers-reduced-motion via globals.css. */}
      {flow.changePerHour !== null && flow.changePerHour > 500 && (
        <div
          role="alert"
          className="rapid-rise-banner"
          style={{
            flexShrink: 0,
            color: '#fff',
            padding: '12px 16px',
            borderTop: '2px solid #6B1A1A',
            borderBottom: '2px solid #6B1A1A',
          }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '900px', margin: '0 auto' }}>
            <span style={{ fontSize: '24px', flexShrink: 0 }}>&#9888;</span>
            <div>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '11px', fontWeight: 700,
                letterSpacing: '2px', textTransform: 'uppercase',
                marginBottom: '2px',
              }}>
                Rapid Rise Warning
              </div>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '14px', fontWeight: 600, lineHeight: 1.45,
              }}>
                {river.n} is rising at {flow.changePerHour.toLocaleString()} cfs/hour. Conditions can become dangerous quickly. Do not paddle or wade. Water levels may continue to rise significantly.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hazard banner — active safety warnings, time-sensitive.
          Rendered above the data confidence banner so it can't be missed. */}
      <HazardBanner
        riverId={river.id}
        riverName={river.n}
        stateKey={river.stateKey}
        initialHazards={prefetched.hazards}
      />

      {/* Data confidence banner */}
      <DataConfidenceBanner
        riverId={river.id}
        riverName={river.n}
        stateKey={river.stateKey}
        isVerified={isVerified}
        needsVerification={mergedNeedsVerification}
      />

      {/* Next dam release callout — only renders for rivers with
          a scheduled release on the books. Computed at request
          time from data/dam-releases.ts. */}
      {(() => {
        const next = getNextReleaseForRiver(river.id)
        if (!next) return null
        const releaseDate = new Date(next.date + 'T12:00:00')
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const days = Math.round((releaseDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        const relTime = days === 0 ? 'today' : days === 1 ? 'tomorrow' : days < 7 ? `in ${days} days` : days < 14 ? 'next week' : days < 60 ? `in ${Math.round(days / 7)} weeks` : `in ${Math.round(days / 30)} months`
        const prettyDate = releaseDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
        const isImminent = days <= 7
        return (
          <div style={{
            flexShrink: 0,
            padding: '10px 16px',
            background: isImminent ? 'var(--rvlt)' : 'var(--bg2)',
            borderBottom: isImminent ? '.5px solid var(--rvmd)' : '.5px solid var(--bd)',
            display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
          }}>
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px',
              padding: '3px 8px', borderRadius: '10px',
              background: isImminent ? 'var(--rv)' : 'var(--rvdk)',
              color: '#fff', textTransform: 'uppercase', letterSpacing: '.5px', fontWeight: 600,
              flexShrink: 0,
            }}>
              {isImminent ? '\u26A1 Release ' + relTime : 'Next release'}
            </span>
            <div style={{ flex: '1 1 200px', minWidth: 0 }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '14px', fontWeight: 600, color: isImminent ? 'var(--rvdk)' : 'var(--tx)' }}>
                {next.name}
              </div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx2)', marginTop: '2px' }}>
                {prettyDate}
                {next.startTime && ` \u00b7 ${next.startTime}${next.endTime ? '\u2013' + next.endTime : ''}`}
                {next.expectedCfs && ` \u00b7 ${next.expectedCfs.toLocaleString()} cfs`}
                {' \u00b7 '}{next.agency.split(' ')[0]}
              </div>
            </div>
            <SubscribeReleaseAlert
              riverId={river.id}
              riverName={river.n}
              seasonLabel={next.seasonLabel}
            />
            <Link href="/releases" style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px',
              color: 'var(--rv)', textDecoration: 'none',
              padding: '5px 12px', borderRadius: 'var(--r)',
              border: '.5px solid var(--rvmd)', background: 'var(--bg)',
              flexShrink: 0,
            }}>
              Full calendar &rarr;
            </Link>
          </div>
        )
      })()}

      {/* Tabbed content — fills remaining height */}
      {/* When a non-primary gauge is selected, override river.avg so
          the "Avg flow: X cfs" stat below the hero matches the
          currently displayed gauge. */}
      <RiverTabs
        river={isNonPrimary && activeAvg !== staticRiver.avg ? { ...river, avg: activeAvg } : river}
        flow={flow}
        initialData={prefetched}
      />
    </main>
  )
}
