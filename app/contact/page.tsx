import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact — RiverScout',
  description: 'Get in touch with the RiverScout team — corrections, partnerships, or questions.',
}

const mono = "'IBM Plex Mono', monospace"
const serif = "'Playfair Display', serif"

const FAQS: { q: string; a: string }[] = [
  {
    q: 'How do I suggest a correction or add an access point?',
    a: 'Every river page has an "Improve This River" button that opens a form for edits to access points, hazards, rapid classifications, CFS ranges, and more. No account required for most submissions — your edit goes to our review queue and we\u2019ll publish verified changes within a few days.',
  },
  {
    q: 'Where does the flow data come from?',
    a: 'Live CFS readings come directly from USGS stream gauges (waterdata.usgs.gov) and refresh every 15 minutes. Historical averages are USGS-published values. Optimal-flow ranges are community-sourced and need local verification — flag any that look off.',
  },
  {
    q: 'Is RiverScout free?',
    a: 'Yes. All conditions data, river pages, maps, hatch calendars, and alerts are free for every paddler and angler. We offer optional paid tiers for outfitters and guides who want a marketplace listing, and a Pro tier for trip-planning features, but nothing behind a paywall on flow data.',
  },
  {
    q: 'How do I list my outfitter or guide service?',
    a: 'See /outfitters for the five listing tiers — from a free basic profile to full marketplace integration. If you run a fly shop, shuttle service, or guided-trip operation and want to reach anglers and paddlers on specific rivers, we\u2019d like to hear from you.',
  },
]

export default function ContactPage() {
  return (
    <main style={{
      maxWidth: '920px', margin: '0 auto', padding: '40px 20px 80px',
      fontFamily: mono, color: 'var(--tx)',
    }}>
      <h1 style={{
        fontFamily: serif, fontSize: '36px', fontWeight: 700,
        color: 'var(--rvdk)', margin: '0 0 8px',
      }}>
        Contact
      </h1>
      <p style={{ fontSize: '13px', color: 'var(--tx2)', margin: '0 0 32px', maxWidth: '680px', lineHeight: 1.6 }}>
        Corrections, partnerships, outfitter listings, press, or just a question —
        we read every message. Fastest reply is email.
      </p>

      {/* ── Primary contact card ────────────────────────── */}
      <div style={{
        background: 'var(--rvlt)', border: '.5px solid var(--rvmd)',
        borderRadius: '10px', padding: '24px 28px', marginBottom: '32px',
      }}>
        <div style={{
          fontFamily: mono, fontSize: '10px', textTransform: 'uppercase',
          letterSpacing: '.6px', color: 'var(--rvdk)', marginBottom: '6px', fontWeight: 600,
        }}>
          Email
        </div>
        <a
          href="mailto:Paddle.rivers.us@gmail.com"
          style={{
            fontFamily: serif, fontSize: '22px', fontWeight: 600,
            color: 'var(--rvdk)', textDecoration: 'none', lineHeight: 1.2,
          }}
        >
          Paddle.rivers.us@gmail.com
        </a>
        <div style={{ marginTop: '20px', fontSize: '12px', color: 'var(--tx2)', lineHeight: 1.6 }}>
          <div style={{ fontFamily: mono, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '.6px', color: 'var(--rvdk)', marginBottom: '4px', fontWeight: 600 }}>
            Mailing address
          </div>
          Pine River Paddlesports Center<br />
          9590 M-37<br />
          Wellston, MI 49689
        </div>
      </div>

      {/* ── FAQ ─────────────────────────────────────────── */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{
          fontFamily: serif, fontSize: '22px', fontWeight: 600,
          color: 'var(--rvdk)', margin: '0 0 16px',
        }}>
          Frequently asked
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {FAQS.map(item => (
            <div key={item.q} style={{
              border: '.5px solid var(--bd)', borderRadius: '8px',
              padding: '16px 20px', background: 'var(--bg)',
            }}>
              <div style={{
                fontFamily: mono, fontSize: '13px', fontWeight: 600,
                color: 'var(--rvdk)', marginBottom: '6px',
              }}>
                {item.q}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--tx2)', lineHeight: 1.65 }}>
                {item.a}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Improve a river CTA ─────────────────────────── */}
      <div style={{
        background: 'var(--bg)', border: '1px solid var(--rvmd)',
        borderRadius: '10px', padding: '28px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
        gap: '20px', flexWrap: 'wrap',
      }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <div style={{
            fontFamily: serif, fontSize: '20px', fontWeight: 600,
            color: 'var(--rvdk)', margin: '0 0 6px',
          }}>
            Improve a river
          </div>
          <p style={{ fontSize: '12px', color: 'var(--tx2)', lineHeight: 1.6, margin: 0 }}>
            Local knowledge is what keeps these pages accurate for every paddler, angler, outfitter, and guide who uses them. Know a gauge that\u2019s wrong, an access point we missed, or a hazard that changed? Tell us.
          </p>
        </div>
        <Link
          href="/rivers"
          style={{
            flexShrink: 0,
            display: 'inline-block', padding: '10px 18px',
            borderRadius: '20px', background: 'var(--rv)', color: '#fff',
            fontFamily: mono, fontSize: '12px', fontWeight: 500,
            textDecoration: 'none', letterSpacing: '.3px',
          }}
        >
          Browse rivers →
        </Link>
      </div>
    </main>
  )
}
