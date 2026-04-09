import Link from 'next/link'
import { ALL_RIVERS, STATES } from '@/data/rivers'
import { fetchGaugeData } from '@/lib/usgs'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import USMap from '@/components/maps/USMap'
import AuthNav from '@/components/AuthNav'
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
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', height: '44px', borderBottom: '.5px solid var(--bd)',
        background: 'var(--bg)', flexShrink: 0,
      }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: 700, color: 'var(--rvdk)', letterSpacing: '-.3px' }}>
          River<span style={{ color: 'var(--wt)' }}>Scout</span>
        </span>
        <div className="nav-pills">
          <span style={{ padding: '5px 10px', borderRadius: '20px', border: '.5px solid var(--rvmd)', color: 'var(--rvdk)', background: 'var(--rvlt)' }}>Map</span>
          <Link href="/search" style={{ padding: '5px 10px', borderRadius: '20px', border: '.5px solid var(--bd2)', color: 'var(--tx2)', textDecoration: 'none' }}>Search</Link>
          <Link href="/hatches" style={{ padding: '5px 10px', borderRadius: '20px', border: '.5px solid var(--bd2)', color: 'var(--tx2)', textDecoration: 'none' }}>Hatches</Link>
          <Link href="/alerts" style={{ padding: '5px 10px', borderRadius: '20px', border: '.5px solid var(--bd2)', color: 'var(--tx2)', textDecoration: 'none' }}>Alerts</Link>
          <Link href="/about/improvements" style={{ padding: '5px 10px', borderRadius: '20px', border: '.5px solid var(--bd2)', color: 'var(--tx2)', textDecoration: 'none' }}>Community</Link>
          <Link href="/outfitters" style={{ padding: '5px 10px', borderRadius: '20px', border: '.5px solid var(--bd2)', color: 'var(--tx2)', textDecoration: 'none' }}>Outfitters</Link>
          <Link href="/pro" style={{ padding: '5px 10px', borderRadius: '20px', border: '.5px solid var(--rvmd)', color: 'var(--rvdk)', background: 'var(--rvlt)', textDecoration: 'none', fontWeight: 500 }}>Pro</Link>
          <AuthNav />
        </div>
      </nav>

      {/* Hero row */}
      <div style={{ padding: '14px 20px 10px', flexShrink: 0 }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--rv)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>
          Live River Atlas
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px', flexWrap: 'wrap' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '21px', fontWeight: 700, lineHeight: 1.2, color: 'var(--rvdk)', margin: 0 }}>
            Paddle Every River in America
          </h1>
          <div style={{ display: 'flex', gap: '18px', flexShrink: 0 }}>
            {[
              { n: String(riverCount), l: 'Rivers' },
              { n: String(stateCount), l: 'States' },
              { n: 'Live', l: 'USGS' },
            ].map(s => (
              <div key={s.l} style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', fontWeight: 600, color: 'var(--rvdk)' }}>{s.n}</span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.5px' }}>{s.l}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Live conditions bar */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px' }}>
          {totalOptimal > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--rv)', display: 'inline-block' }} />
              <span style={{ color: 'var(--rv)' }}>{totalOptimal} optimal</span>
            </span>
          )}
          {totalHigh > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--am)', display: 'inline-block' }} />
              <span style={{ color: 'var(--am)' }}>{totalHigh} high</span>
            </span>
          )}
          {totalFlood > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--dg)', display: 'inline-block' }} />
              <span style={{ color: 'var(--dg)' }}>{totalFlood} flood</span>
            </span>
          )}
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
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '17px', fontWeight: 600, lineHeight: 1.6, marginBottom: '16px', color: '#fff' }}>
              RiverScout combines live USGS gauge data, historical records, and firsthand knowledge from paddlers, outfitters, guides, and anglers who know these rivers personally.
            </p>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', lineHeight: 1.7, opacity: 0.7, margin: 0 }}>
              Every river in our database is a starting point. The people who paddle them make them accurate.
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
