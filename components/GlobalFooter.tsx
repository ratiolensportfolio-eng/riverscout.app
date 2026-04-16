import Link from 'next/link'

// Global footer rendered on every page via app/layout.tsx. Minimal
// by design — users should rarely look at it, but it has to exist
// so Terms + Privacy are reachable from every surface (Stripe +
// GDPR/CCPA expectation, and covers the "where do I read your
// terms?" question without surprising new users).

const mono = "'IBM Plex Mono', monospace"

export default function GlobalFooter() {
  const year = new Date().getFullYear()
  return (
    <footer
      style={{
        borderTop: '.5px solid var(--bd)',
        padding: '18px 24px 28px',
        fontFamily: mono,
        fontSize: '10px',
        color: 'var(--tx3)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px 20px',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div>© {year} RiverScout · Built in Michigan</div>
      <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        <Link href="/about" style={{ color: 'var(--tx3)', textDecoration: 'none' }}>About</Link>
        <Link href="/contact" style={{ color: 'var(--tx3)', textDecoration: 'none' }}>Contact</Link>
        <Link href="/terms" style={{ color: 'var(--tx3)', textDecoration: 'none' }}>Terms</Link>
        <Link href="/privacy" style={{ color: 'var(--tx3)', textDecoration: 'none' }}>Privacy</Link>
      </nav>
    </footer>
  )
}
