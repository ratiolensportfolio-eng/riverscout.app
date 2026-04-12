import Link from 'next/link'
import Image from 'next/image'
import { ALL_RIVERS, STATES } from '@/data/rivers'
import { fetchGaugeData } from '@/lib/usgs'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import USMap from '@/components/maps/USMap'
import HomeSearch from '@/components/HomeSearch'
import type { FlowCondition } from '@/types'

export const revalidate = 900

export default async function HomePage() {
  const stateCount = Object.keys(STATES).length
  const riverCount = ALL_RIVERS.length

  // Fetch live conditions for all rivers in parallel
  const rivers = ALL_RIVERS
  const results = await Promise.allSettled(
    rivers.map((r: typeof rivers[number]) => fetchGaugeData(r.g, r.opt).then(flow => ({ id: r.id, stateKey: r.stateKey, name: r.n, flow })))
  )

  // Build per-state condition summary
  type StateCondition = { optimal: number; low: number; high: number; flood: number; total: number; topCfs: { name: string; cfs: number; condition: FlowCondition }[] }
  const stateConditions: Record<string, StateCondition> = {}

  for (const result of results) {
    if (result.status !== 'fulfilled') continue
    const { stateKey, flow, name } = result.value
    if (!stateConditions[stateKey]) stateConditions[stateKey] = { optimal: 0, low: 0, high: 0, flood: 0, total: 0, topCfs: [] }
    const sc = stateConditions[stateKey]
    sc.total++
    if (flow.condition === 'optimal') sc.optimal++
    else if (flow.condition === 'low') sc.low++
    else if (flow.condition === 'high') sc.high++
    else if (flow.condition === 'flood') sc.flood++
    if (flow.cfs !== null) {
      sc.topCfs.push({ name, cfs: flow.cfs, condition: flow.condition })
    }
  }

  // Determine dominant condition per state
  const stateFlowMap: Record<string, FlowCondition> = {}
  for (const [key, sc] of Object.entries(stateConditions)) {
    if (sc.flood > 0) stateFlowMap[key] = 'flood'
    else if (sc.high > sc.optimal) stateFlowMap[key] = 'high'
    else if (sc.optimal > 0) stateFlowMap[key] = 'optimal'
    else stateFlowMap[key] = 'low'
  }

  // Fetch approved improvement count
  let approvedCount = 0
  try {
    const supabase = await createSupabaseServerClient()
    const { count } = await supabase
      .from('suggestions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved')
    approvedCount = count ?? 0
  } catch {
    // Supabase not configured — show zero-state
  }

  // Count conditions across all rivers
  let totalOptimal = 0, totalHigh = 0, totalFlood = 0
  for (const sc of Object.values(stateConditions)) {
    totalOptimal += sc.optimal
    totalHigh += sc.high
    totalFlood += sc.flood
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--tx)', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      {/* ── Hero with background image ─────────────────────────
          The canoe-on-river illustration (riverscout-hero.jpg)
          fills the hero at 1440×600 via object-fit:cover. A 40%
          dark overlay ensures white text reads cleanly on top.
          Content is centered: wordmark → tagline → search bar. */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '600px',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        {/* Background image */}
        <Image
          src="/images/riverscout-hero.jpg"
          alt="A canoe gliding down a winding river at dusk"
          fill
          priority
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          sizes="100vw"
        />
        {/* Dark overlay at 40% opacity */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0, 0, 0, 0.40)',
          zIndex: 1,
        }} />

        {/* Centered content */}
        <div style={{
          position: 'relative', zIndex: 2,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          height: '100%', padding: '0 24px',
          textAlign: 'center',
        }}>
          {/* Wordmark */}
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '48px', fontWeight: 700,
            color: '#fff', margin: '0 0 12px',
            lineHeight: 1.1, letterSpacing: '-0.5px',
            textShadow: '0 2px 12px rgba(0,0,0,.3)',
          }}>
            River<span style={{ color: '#9DC4EA' }}>Scout</span>
          </h1>

          {/* Tagline */}
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '20px', fontWeight: 400,
            color: '#fff', margin: '0 0 28px',
            opacity: 0.92,
            textShadow: '0 1px 6px rgba(0,0,0,.3)',
            letterSpacing: '.5px',
          }}>
            Know before you go.
          </p>

          {/* Search bar */}
          <div style={{ width: '100%', maxWidth: '520px' }}>
            <HomeSearch />
          </div>

          {/* Live stats — small, subtle, below the search bar */}
          <div style={{
            display: 'flex', gap: '16px', marginTop: '20px',
            fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px',
            color: 'rgba(255,255,255,.7)',
          }}>
            <span>{riverCount} rivers</span>
            <span>·</span>
            <span>{stateCount} states</span>
            <span>·</span>
            <span>Live USGS data</span>
            {totalOptimal > 0 && (
              <>
                <span>·</span>
                <span style={{ color: '#9FE1CB' }}>{totalOptimal} at optimal flow</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Map — fills remaining height */}
      <div style={{ flex: 1, minHeight: 0, padding: '0 8px 8px', position: 'relative' }}>
        <USMap stateFlowMap={stateFlowMap} stateConditions={stateConditions} />
      </div>

      {/* Mission band */}
      <section className="mission-band" style={{
        background: 'var(--rvdk)', color: '#fff', width: '100%', flexShrink: 0,
      }}>
        <div className="mission-inner" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {/* Left column */}
          <div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.7, marginBottom: '16px' }}>
              Built by Paddlers &nbsp;·&nbsp; Verified by Paddlers, Outfitters, Guides &amp; Anglers
            </div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: 600, lineHeight: 1.55, marginBottom: '14px', color: '#fff' }}>
              Completely free for every paddler and angler. No ads. No paywalls on conditions data. Just rivers.
            </p>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', lineHeight: 1.7, opacity: 0.85, marginBottom: '14px' }}>
              RiverScout combines live USGS gauge data, historical records, and firsthand knowledge from paddlers, outfitters, guides, and anglers who know these rivers personally.
            </p>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', lineHeight: 1.7, opacity: 0.7, margin: 0 }}>
              Every river in our database is a starting point. The people who know and love them make them accurate.
            </p>
          </div>

          {/* Right column */}
          <div>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', lineHeight: 1.7, opacity: 0.85, marginBottom: '20px' }}>
              We are currently focused on two priorities above all else:
            </p>
            <div style={{ marginBottom: '12px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{ color: '#F5C242', flexShrink: 0, fontSize: '14px', marginTop: '1px' }}>&#9888;</span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', lineHeight: 1.6 }}>Accurate rapid classifications</span>
            </div>
            <div style={{ marginBottom: '24px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{ color: '#F5C242', flexShrink: 0, fontSize: '14px', marginTop: '1px' }}>&#9888;</span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', lineHeight: 1.6 }}>Safe CFS ranges for every skill level</span>
            </div>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', lineHeight: 1.8, opacity: 0.75, marginBottom: '24px' }}>
              These directly affect paddler safety. If you know a river — its real difficulty at different flows, its dangerous water levels, its hidden hazards — your local expertise is exactly what we need.
            </p>
            <Link href="/search" className="mission-cta" style={{
              display: 'inline-block', padding: '11px 28px', borderRadius: 'var(--r)',
              background: '#fff', color: 'var(--rvdk)',
              fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', fontWeight: 500,
              textDecoration: 'none', letterSpacing: '.3px',
              transition: 'transform 0.15s ease',
            }}>
              Improve a River &rarr;
            </Link>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', opacity: 0.5, marginTop: '10px', letterSpacing: '.3px' }}>
              All suggestions reviewed before going live
            </div>
          </div>
        </div>

        {/* Community counter */}
        <div style={{
          marginTop: '36px', paddingTop: '20px',
          borderTop: '1px solid rgba(255,255,255,.12)',
          textAlign: 'center',
          fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px',
          color: 'rgba(255,255,255,.6)', letterSpacing: '.3px',
        }}>
          {approvedCount > 0 ? (
            <>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 700, color: '#fff' }}>
                {approvedCount.toLocaleString()}
              </span>
              {' '}river improvement{approvedCount !== 1 ? 's' : ''} submitted by the RiverScout community
            </>
          ) : (
            'Be the first to improve a river in your area'
          )}
        </div>
      </section>
    </main>
  )
}
