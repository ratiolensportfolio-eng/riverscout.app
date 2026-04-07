import Link from 'next/link'

const mono = "'IBM Plex Mono', monospace"
const serif = "'Playfair Display', serif"

export default function CancelPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--tx)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '480px', textAlign: 'center', padding: '40px 28px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>&#x2190;</div>
        <h1 style={{ fontFamily: serif, fontSize: '24px', fontWeight: 700, color: 'var(--rvdk)', marginBottom: '8px' }}>
          No worries
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--tx2)', lineHeight: 1.7, marginBottom: '24px' }}>
          Your checkout was cancelled. No charge was made. You can restart anytime — your information was not saved.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '280px', margin: '0 auto' }}>
          <Link href="/outfitters/join" style={{
            display: 'block', padding: '12px', fontFamily: mono, fontSize: '12px', fontWeight: 500,
            background: 'var(--rv)', color: '#fff', borderRadius: 'var(--r)',
            textDecoration: 'none', textAlign: 'center',
          }}>
            Try Again
          </Link>
          <Link href="/outfitters" style={{
            display: 'block', padding: '12px', fontFamily: mono, fontSize: '12px',
            background: 'var(--bg)', color: 'var(--tx2)', border: '.5px solid var(--bd2)', borderRadius: 'var(--r)',
            textDecoration: 'none', textAlign: 'center',
          }}>
            View Plans
          </Link>
        </div>
        <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', marginTop: '20px' }}>
          Questions? outfitters@riverscout.app
        </div>
      </div>
    </main>
  )
}
