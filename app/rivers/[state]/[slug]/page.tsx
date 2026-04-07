import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getRiverBySlug, getStateSlug, getRiverSlug, ALL_RIVERS } from '@/data/rivers'
import { fetchGaugeData, formatCfs, trendArrow, celsiusToFahrenheit, isHypothermiaRisk } from '@/lib/usgs'
import RiverTabs from '@/components/rivers/RiverTabs'
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

  const flow = await fetchGaugeData(river.g, river.opt)

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
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--wt)', margin: '2px 0 8px', letterSpacing: '.3px' }}>
          {river.co} · {river.len} · Class {river.cls}
        </div>

        {/* Live flow row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--rv)' }} className="pulse-dot" />
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: 700, color: '#0C447C', lineHeight: 1 }}>
              {formatCfs(flow.cfs)}
            </span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--wt)' }}>CFS</span>
          </div>

          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', padding: '4px 10px', borderRadius: '20px', fontWeight: 500 }} className={condClass}>
            {COND_LABEL[flow.condition]}
          </span>

          {flow.trend && (
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#185FA5' }}>
              {trendArrow(flow.trend)} {flow.trendDelta !== null && flow.trendDelta > 0 ? '+' : ''}{flow.trendDelta} cfs (6h)
            </span>
          )}
        </div>

        {/* Temp warning */}
        {flow.tempC !== null && (
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: isHypothermiaRisk(flow.tempC) ? 'var(--dg)' : 'var(--wt)', marginTop: '4px' }}>
            Water temp: {celsiusToFahrenheit(flow.tempC)}°F
            {isHypothermiaRisk(flow.tempC) && ' — Hypothermia risk, wear a drysuit'}
          </div>
        )}

        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', marginTop: '4px' }}>
          Optimal: {river.opt} CFS · USGS #{river.g}
        </div>
      </div>

      {/* Tabbed content — fills remaining height */}
      <RiverTabs river={river} flow={flow} />
    </main>
  )
}
