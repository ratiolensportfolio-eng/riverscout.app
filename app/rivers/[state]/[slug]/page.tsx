import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getRiverBySlug, getStateSlug, getRiverSlug, ALL_RIVERS } from '@/data/rivers'
import { fetchGaugeData, formatCfs, celsiusToFahrenheit, isHypothermiaRisk } from '@/lib/usgs'
import RiverTabs from '@/components/rivers/RiverTabs'
import SuggestCorrection from '@/components/SuggestCorrection'
import SaveOffline from '@/components/SaveOffline'
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
  const river = getRiverBySlug(state, slug)
  if (!river) notFound()

  // Fire flow data and the batched river-page query in parallel.
  // Both go to different upstreams (USGS vs Supabase) so they can race.
  const [flow, prefetched] = await Promise.all([
    fetchGaugeData(river.g, river.opt),
    fetchRiverPageData(river.id, river.stateKey),
  ])

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

        {/* Live flow row */}
        <div className="river-flow-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--rv)' }} className="pulse-dot" />
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: 700, color: '#0C447C', lineHeight: 1 }}>
              {formatCfs(flow.cfs)}
            </span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--wt)' }}>CFS</span>
            {flow.gaugeHeightFt !== null && (
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx3)', marginLeft: '4px' }}>
                · {flow.gaugeHeightFt.toFixed(2)} ft
              </span>
            )}
          </div>

          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', padding: '4px 10px', borderRadius: '20px', fontWeight: 500 }} className={condClass}>
            {COND_LABEL[flow.condition]}
          </span>
        </div>

        {/* Rate-of-change row — separate line so the rateLabel and 3h
            delta have room without crowding the headline CFS readout. */}
        {flow.cfs !== null && flow.rateLabel && flow.rateLabel !== 'Rate unknown' && (() => {
          // Color the rate label by direction. Rising fast / falling fast
          // (>300 cfs/hr) get a stronger color since those usually mean a
          // flood pulse is on the way or a release is winding down.
          const isRising = flow.trend === 'up'
          const isFalling = flow.trend === 'down'
          const isFast = flow.changePerHour !== null && Math.abs(flow.changePerHour) > 300
          const color = isFast
            ? (isRising ? 'var(--dg)' : 'var(--am)')
            : isRising
              ? 'var(--am)'
              : isFalling
                ? '#185FA5'
                : 'var(--tx3)'
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color, fontWeight: 500 }}>
                {flow.rateLabel}
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
            <SaveOffline riverId={river.id} riverName={river.n} gaugeId={river.g} stateSlug={state} riverSlug={slug} />
            <SuggestCorrection riverId={river.id} riverName={river.n} stateKey={river.stateKey} />
          </div>
        </div>
      </div>

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
        needsVerification={river.needsVerification as string[] | undefined}
      />

      {/* Tabbed content — fills remaining height */}
      <RiverTabs river={river} flow={flow} initialData={prefetched} />
    </main>
  )
}
