import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getRiverBySlug, getStateSlug, getRiverSlug, ALL_RIVERS } from '@/data/rivers'
import { fetchGaugeData, formatCfs, celsiusToFahrenheit, isHypothermiaRisk } from '@/lib/usgs'
import RiverTabs from '@/components/rivers/RiverTabs'
import SuggestCorrection from '@/components/SuggestCorrection'
import SaveOffline from '@/components/SaveOffline'
import SaveRiver from '@/components/SaveRiver'
import DataConfidenceBanner from '@/components/rivers/DataConfidenceBanner'
import HazardBanner from '@/components/rivers/HazardBanner'
import { getDesignationBadges } from '@/lib/designations'
import { RAPIDS } from '@/data/rapids'
import { fetchRiverPageData } from '@/lib/river-page-data'
import type { Metadata } from 'next'

export const revalidate = 900

interface Props {
  params: Promise<{ state: string; slug: string }>
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

  const title = `${river.n} — Live Flow, Conditions & Trip Planning | RiverScout`
  const description = `Live USGS flow data for ${river.n} in ${river.stateName}. Current CFS, optimal range ${river.opt}, Class ${river.cls}, ${river.len}. Trip reports, access points, hatch calendar, and outfitter listings.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://riverscout.app/rivers/${state}/${slug}`,
      siteName: 'RiverScout',
      type: 'website',
    },
  }
}

const COND_LABEL: Record<string, string> = {
  optimal: 'Optimal',
  low:     'Below Optimal',
  high:    'Above Optimal',
  flood:   'Flood',
  loading: 'Loading…',
}

export default async function RiverPage({ params }: Props) {
  const { state, slug } = await params
  const staticRiver = getRiverBySlug(state, slug)
  if (!staticRiver) notFound()

  // Fire flow data and the batched river-page query in parallel.
  // Both go to different upstreams (USGS vs Supabase) so they can race.
  const [flow, prefetched] = await Promise.all([
    fetchGaugeData(staticRiver.g, staticRiver.opt),
    fetchRiverPageData(staticRiver.id, staticRiver.stateKey),
  ])

  // Apply admin-approved field overrides on top of the static river
  // record. The override layer (lib/river-page-data.ts) reads from
  // public.river_field_overrides; without overrides this is a no-op
  // and the page renders the static data unchanged.
  //
  // Field key → static field name map. Mirrors the suggestions
  // PATCH handler's allow-list so the same key vocabulary is used
  // everywhere.
  const FIELD_TO_STATIC: Record<string, keyof typeof staticRiver> = {
    cls: 'cls',
    opt: 'opt',
    len: 'len',
    desc: 'desc',
    desig: 'desig',
    gauge: 'g',
  }
  const river: typeof staticRiver = { ...staticRiver }
  for (const [field, value] of Object.entries(prefetched.fieldOverrides)) {
    const target = FIELD_TO_STATIC[field]
    if (target) {
      // The static columns are all string-typed at the read site
      // (cls, opt, desc, etc.) so the cast is safe.
      ;(river as Record<string, unknown>)[target] = value
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

  const condClass = {
    optimal: 'cond-opt',
    low:     'cond-low',
    high:    'cond-high',
    flood:   'cond-flood',
    loading: 'cond-loading',
  }[flow.condition]

  const backState = river.stateKey

  return (
    <main style={{ height: '100vh', background: 'var(--bg)', color: 'var(--tx)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', height: '44px', borderBottom: '.5px solid var(--bd)',
        background: 'var(--bg)', flexShrink: 0,
      }}>
        <Link href="/" style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: 700, color: 'var(--rvdk)', letterSpacing: '-.3px', textDecoration: 'none' }}>
          River<span style={{ color: 'var(--wt)' }}>Scout</span>
        </Link>
        <Link href={`/state/${backState}`} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', background: 'var(--rvlt)', color: 'var(--rvdk)', padding: '4px 10px', borderRadius: '20px', border: '.5px solid var(--rvmd)', textDecoration: 'none' }}>
          ← {river.stateName}
        </Link>
      </nav>

      {/* River header */}
      <div style={{ padding: '12px 16px', borderBottom: '.5px solid var(--bd)', background: 'var(--wtlt)', flexShrink: 0 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 700, color: '#042C53' }}>
          {river.n}
        </div>
        {/* Designation badges */}
        {(() => {
          const badges = getDesignationBadges(river.desig)
          return badges.length > 0 ? (
            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', margin: '4px 0 6px' }}>
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
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--wt)', margin: '2px 0 8px', letterSpacing: '.3px' }}>
          {river.co} · {river.len} · Class {river.cls}
        </div>

        {/* Live flow row — "340 cfs / 2.3 ft  [OPTIMAL]" */}
        <div className="river-flow-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--rv)' }} className="pulse-dot" />
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: 700, color: '#0C447C', lineHeight: 1 }}>
              {formatCfs(flow.cfs)}
            </span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--wt)' }}>CFS</span>
            {flow.gaugeHeightFt !== null && (
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', color: 'var(--tx2)', marginLeft: '6px' }}>
                / {flow.gaugeHeightFt.toFixed(2)} ft
              </span>
            )}
          </div>

          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', padding: '4px 10px', borderRadius: '20px', fontWeight: 500 }} className={condClass}>
            {COND_LABEL[flow.condition]}
          </span>
        </div>

        {/* Rate-of-change row.
            Color palette per the rate severity:
              Rising fast  (>300 cfs/hr): red    — potential flash flood
              Rising       (100-300):     amber  — heads up
              Rising slowly (<100):       light  — normal rise
              Stable:                     gray   — (hidden, see note)
              Falling slowly (<100):      lt blue — improving
              Falling      (100-300):     blue
              Falling fast (>300):        purple — rapid drainage
            Stable rivers below 25 cfs/hr are hidden entirely so the
            page stays clean — showing "Stable" everywhere is noise. */}
        {flow.cfs !== null && flow.rateLabel && flow.rateLabel !== 'Rate unknown' && flow.rateLabel !== 'Stable' && (() => {
          const rate = flow.changePerHour ?? 0
          const absRate = Math.abs(rate)
          const isRising = rate > 0
          const arrow = isRising ? '\u2191' : '\u2193'

          // Pick color from the spec palette
          let color: string
          if (isRising) {
            if (absRate > 300) color = '#A32D2D'        // red — rising fast
            else if (absRate > 100) color = '#BA7517'   // amber — rising
            else color = '#3CA86E'                       // light green — rising slowly
          } else {
            if (absRate > 300) color = '#6E4BB4'        // purple — falling fast
            else if (absRate > 100) color = '#0C447C'   // blue — falling
            else color = '#5B8DBF'                       // light blue — falling slowly
          }

          // Tooltip shows the calc context. title attribute renders on
          // hover for desktop and is screen-reader accessible. A custom
          // tooltip would be nicer typographically but title is good
          // enough until we have a real reason to upgrade.
          const tooltip =
            `Rate of change calculated from USGS readings over the past hour. ` +
            `Updated every 15 minutes.\n\n` +
            `Current: ${rate > 0 ? '+' : ''}${rate.toLocaleString()} cfs/hr` +
            (flow.changeIn3Hours !== null
              ? `\n3-hour change: ${flow.changeIn3Hours > 0 ? '+' : ''}${flow.changeIn3Hours.toLocaleString()} cfs total`
              : '')

          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
              <span
                title={tooltip}
                style={{
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px',
                  color, fontWeight: 600,
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  cursor: 'help',
                }}>
                <span style={{ fontSize: '13px' }}>{arrow}</span>
                {flow.rateLabel}
                <span aria-hidden="true" style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: '12px', height: '12px', borderRadius: '50%',
                  fontSize: '9px', fontWeight: 700,
                  background: 'var(--bg2)', color: 'var(--tx3)',
                  border: '.5px solid var(--bd2)',
                  marginLeft: '2px',
                }}>i</span>
              </span>
              {flow.changeIn3Hours !== null && Math.abs(flow.changeIn3Hours) >= 25 && (
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx3)' }}>
                  &middot; {flow.changeIn3Hours > 0 ? '+' : ''}{flow.changeIn3Hours.toLocaleString()} cfs in 3h
                </span>
              )}
            </div>
          )
        })()}

        {/* Temp warning */}
        {flow.tempC !== null && (
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: isHypothermiaRisk(flow.tempC) ? 'var(--dg)' : 'var(--wt)', marginTop: '4px' }}>
            Water temp: {celsiusToFahrenheit(flow.tempC)}°F
            {isHypothermiaRisk(flow.tempC) && ' — Hypothermia risk, wear a drysuit'}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)' }}>
            Optimal: {river.opt} CFS · USGS #{river.g}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <SaveRiver riverId={river.id} riverName={river.n} />
            <SaveOffline riverId={river.id} riverName={river.n} gaugeId={river.g} stateSlug={state} riverSlug={slug} />
            <SuggestCorrection riverId={river.id} riverName={river.n} stateKey={river.stateKey} />
          </div>
        </div>
      </div>

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

      {/* Tabbed content — fills remaining height */}
      <RiverTabs river={river} flow={flow} initialData={prefetched} />
    </main>
  )
}
