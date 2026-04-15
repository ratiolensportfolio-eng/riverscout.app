'use client'

import Link from 'next/link'

const mono = "'IBM Plex Mono', monospace"
const serif = "'Playfair Display', serif"

export default function ProSuccess() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--tx)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '480px', textAlign: 'center', padding: '40px 28px' }}>
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>&#10003;</div>
        <h1 style={{ fontFamily: serif, fontSize: '28px', fontWeight: 700, color: 'var(--rvdk)', marginBottom: '8px' }}>
          Welcome to RiverScout Pro
        </h1>
        <p style={{ fontFamily: mono, fontSize: '12px', color: 'var(--tx2)', lineHeight: 1.7, marginBottom: '20px' }}>
          Your subscription is active. Here's what you now have access to:
        </p>

        <div style={{
          textAlign: 'left', background: 'var(--rvlt)', border: '.5px solid var(--rvmd)',
          borderRadius: 'var(--r)', padding: '16px 20px', marginBottom: '24px',
        }}>
          {[
            'Flow alert emails',
            'Stocking and hatch alert emails',
            'Offline river pages',
            '10-year historical flow analysis',
            'Custom CFS ranges',
            'River journal and trip statistics',
          ].map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 0', fontFamily: mono, fontSize: '12px', color: 'var(--rvdk)' }}>
              <span style={{ color: 'var(--rv)', fontWeight: 700 }}>&#10003;</span>
              {f}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/alerts" style={{
            fontFamily: mono, fontSize: '12px', fontWeight: 500,
            padding: '10px 24px', borderRadius: 'var(--r)',
            background: 'var(--rvdk)', color: '#fff', textDecoration: 'none',
          }}>
            Set up your first flow alert &rarr;
          </Link>
          <Link href="/" style={{
            fontFamily: mono, fontSize: '12px',
            padding: '10px 24px', borderRadius: 'var(--r)',
            background: 'var(--bg)', color: 'var(--rvdk)', textDecoration: 'none',
            border: '.5px solid var(--rvmd)',
          }}>
            Browse rivers
          </Link>
        </div>
      </div>
    </main>
  )
}
