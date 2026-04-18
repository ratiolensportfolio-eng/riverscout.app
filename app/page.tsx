import Link from 'next/link'
import { ALL_RIVERS, STATES } from '@/data/rivers'
import { fetchGaugeDataBatch } from '@/lib/usgs'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import USMap from '@/components/maps/USMap'
import HomeSearch from '@/components/HomeSearch'
import HomepageGuard from '@/components/onboarding/HomepageGuard'
import type { FlowCondition } from '@/types'

export const revalidate = 900

export default async function HomePage() {
  const stateCount = Object.keys(STATES).filter(k => k !== 'canada').length
  const riverCount = ALL_RIVERS.length

  // Fetch live conditions for every river via batched USGS calls
  // (chunks of 80 sites). Was 1100+ parallel single-site requests
  // — slow and prone to USGS rate-limiting on the homepage SSR.
  const rivers = ALL_RIVERS
  // PT2H — homepage only needs current cfs + condition per state.
  // 7-day readings would be ~30x larger payload for no UI benefit.
  const batch = await fetchGaugeDataBatch(
    rivers.map(r => ({ gaugeId: r.g, optRange: r.opt })),
    { period: 'PT2H' },
  )

  // Build per-state condition summary
  type StateCondition = { optimal: number; low: number; high: number; flood: number; total: number; topCfs: { name: string; cfs: number; condition: FlowCondition }[] }
  const stateConditions: Record<string, StateCondition> = {}

  for (const r of rivers) {
    const flow = batch.get(r.g)
    if (!flow) continue
    const stateKey = r.stateKey
    if (!stateConditions[stateKey]) stateConditions[stateKey] = { optimal: 0, low: 0, high: 0, flood: 0, total: 0, topCfs: [] }
    const sc = stateConditions[stateKey]
    sc.total++
    if (flow.condition === 'optimal') sc.optimal++
    else if (flow.condition === 'low') sc.low++
    else if (flow.condition === 'high') sc.high++
    else if (flow.condition === 'flood') sc.flood++
    if (flow.cfs !== null) {
      sc.topCfs.push({ name: r.n, cfs: flow.cfs, condition: flow.condition })
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
      <HomepageGuard />
      {/* ── Hero + Map — one unified section ────────────────────
          Navy background. Wordmark, tagline, and search bar sit
          above the interactive US conditions map. No separate
          image — the map IS the visual. */}
      {/* Braided-stream CSS background. Layered SVG data-URI curves
          on a deep navy base to mimic the flowing water illustration
          without requiring an image load. The streams use the same
          teal/navy palette as the hero art. */}
      <style>{`
        .hero-braided {
          position: relative;
          overflow: hidden;
          background: #031E3A;
        }
        .hero-braided::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1440' height='900' viewBox='0 0 1440 900'%3E%3Cdefs%3E%3ClinearGradient id='s1' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23094a7a' stop-opacity='0.6'/%3E%3Cstop offset='1' stop-color='%230a3560' stop-opacity='0'/%3E%3C/linearGradient%3E%3ClinearGradient id='s2' x1='0' y1='1' x2='1' y2='0'%3E%3Cstop offset='0' stop-color='%231a6b8a' stop-opacity='0.4'/%3E%3Cstop offset='1' stop-color='%23042c53' stop-opacity='0'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d='M-50 200 C 200 150, 400 350, 700 280 S 1100 180, 1500 300' stroke='url(%23s1)' stroke-width='120' fill='none' stroke-linecap='round'/%3E%3Cpath d='M-100 450 C 150 380, 350 550, 650 480 S 1050 380, 1550 500' stroke='url(%23s1)' stroke-width='90' fill='none' stroke-linecap='round'/%3E%3Cpath d='M-80 650 C 200 600, 500 750, 800 680 S 1200 580, 1500 700' stroke='url(%23s2)' stroke-width='70' fill='none' stroke-linecap='round'/%3E%3Cpath d='M100 100 C 300 180, 500 80, 750 160 S 1100 60, 1400 150' stroke='url(%23s2)' stroke-width='50' fill='none' stroke-linecap='round'/%3E%3Cpath d='M-200 350 C 0 300, 300 420, 600 350 S 950 250, 1300 380' stroke='url(%23s1)' stroke-width='60' fill='none' stroke-linecap='round'/%3E%3Cpath d='M200 800 C 450 750, 700 850, 1000 780 S 1300 700, 1500 800' stroke='url(%23s2)' stroke-width='80' fill='none' stroke-linecap='round'/%3E%3C/svg%3E") center/cover no-repeat,
            radial-gradient(ellipse at 20% 30%, rgba(10, 75, 120, 0.5) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 70%, rgba(15, 90, 140, 0.4) 0%, transparent 55%),
            radial-gradient(ellipse at 50% 50%, rgba(8, 60, 100, 0.3) 0%, transparent 70%);
          z-index: 0;
          pointer-events: none;
        }
        .hero-braided > * {
          position: relative;
          z-index: 1;
        }
      `}</style>
      <section className="hero-braided" style={{
        width: '100%', flexShrink: 0,
        padding: '40px 20px 24px',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Wordmark + tagline + search — centered */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '48px', fontWeight: 700,
              color: '#fff', margin: '0 0 10px',
              lineHeight: 1.1, letterSpacing: '-0.5px',
            }}>
              River<span style={{ color: '#9DC4EA' }}>Scout</span>
            </h1>
            <p style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '20px', fontWeight: 400,
              color: '#fff', margin: '0 0 22px',
              opacity: 0.9, letterSpacing: '.5px',
            }}>
              Know before you go.
            </p>
            <div style={{ maxWidth: '520px', margin: '0 auto' }}>
              <HomeSearch />
            </div>
            <div style={{
              display: 'flex', gap: '14px', justifyContent: 'center',
              marginTop: '16px',
              fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px',
              color: 'rgba(255,255,255,.55)',
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

          {/* Conditions label */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            marginBottom: '12px',
          }}>
            <span className="pulse-dot" style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: '#1D9E75', display: 'inline-block',
            }} />
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '11px', fontWeight: 600,
              color: 'rgba(255,255,255,.8)',
              textTransform: 'uppercase', letterSpacing: '1.5px',
            }}>
              Conditions right now
            </span>
          </div>

          {/* Map */}
          <div style={{
            background: 'rgba(10, 53, 96, 0.85)', borderRadius: '12px',
            padding: '8px', overflow: 'hidden',
            border: '1px solid rgba(255,255,255,.1)',
            backdropFilter: 'blur(4px)',
          }}>
            <USMap stateFlowMap={stateFlowMap} stateConditions={stateConditions} />
          </div>

          {/* Hint + country switch */}
          <div style={{
            textAlign: 'center', marginTop: '14px',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '11px', color: 'rgba(255,255,255,.4)',
            letterSpacing: '.3px',
          }}>
            Click any state to explore rivers.
          </div>
          <div style={{
            textAlign: 'center', marginTop: '8px',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
          }}>
            <a
              href="/state/canada"
              style={{
                color: 'rgba(255,255,255,.7)',
                textDecoration: 'none',
                background: 'rgba(255,255,255,.06)',
                border: '.5px solid rgba(255,255,255,.18)',
                padding: '5px 12px', borderRadius: '14px',
                letterSpacing: '.3px',
              }}
            >
              🇨🇦 Canadian rivers (beta)
            </a>
          </div>
        </div>
      </section>

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
