import Link from 'next/link'
import { ALL_RIVERS, STATES } from '@/data/rivers'
import USMap from '@/components/maps/USMap'

export default function HomePage() {
  const stateCount = Object.keys(STATES).length
  const riverCount = ALL_RIVERS.length

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--tx)', display: 'flex', flexDirection: 'column' }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', height: '44px', borderBottom: '.5px solid var(--bd)',
        background: 'var(--bg)', flexShrink: 0,
      }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: 700, color: 'var(--rvdk)', letterSpacing: '-.3px' }}>
          River<span style={{ color: 'var(--wt)' }}>Scout</span>
        </span>
        <div style={{ display: 'flex', gap: '6px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px' }}>
          <span style={{ padding: '5px 10px', borderRadius: '20px', border: '.5px solid var(--rvmd)', color: 'var(--rvdk)', background: 'var(--rvlt)' }}>Map</span>
          <Link href="/search" style={{ padding: '5px 10px', borderRadius: '20px', border: '.5px solid var(--bd2)', color: 'var(--tx2)', textDecoration: 'none' }}>Search</Link>
          <Link href="/alerts" style={{ padding: '5px 10px', borderRadius: '20px', border: '.5px solid var(--bd2)', color: 'var(--tx2)', textDecoration: 'none' }}>Flow Alerts</Link>
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
      </div>

      {/* Map — fills remaining height */}
      <div style={{ flex: 1, minHeight: 0, padding: '0 8px 8px', position: 'relative' }}>
        <USMap />
      </div>
    </main>
  )
}
