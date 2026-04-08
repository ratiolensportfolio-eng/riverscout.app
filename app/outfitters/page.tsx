import Link from 'next/link'
import { OUTFITTER_TIERS } from '@/types'
import { ALL_RIVERS } from '@/data/rivers'

const mono = "'IBM Plex Mono', monospace"
const serif = "'Playfair Display', serif"

const tierColors: Record<string, { bg: string; border: string; badge: string; accent: string }> = {
  listed:      { bg: 'var(--bg2)', border: 'var(--bd)', badge: 'var(--tx3)', accent: 'var(--tx2)' },
  featured:    { bg: 'var(--rvlt)', border: 'var(--rvmd)', badge: 'var(--rvdk)', accent: 'var(--rv)' },
  sponsored:   { bg: '#EAF0FB', border: 'var(--wt)', badge: 'var(--wt)', accent: 'var(--wt)' },
  guide:       { bg: 'var(--amlt)', border: 'var(--am)', badge: 'var(--am)', accent: 'var(--am)' },
  destination: { bg: '#F5EEFF', border: 'var(--lo)', badge: 'var(--lo)', accent: 'var(--lo)' },
}

export default function OutfitterPortal() {
  const riverCount = ALL_RIVERS.length
  const stateCount = new Set(ALL_RIVERS.map(r => r.stateKey)).size

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--tx)' }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', height: '44px', borderBottom: '.5px solid var(--bd)',
      }}>
        <Link href="/" style={{ fontFamily: serif, fontSize: '18px', fontWeight: 700, color: 'var(--rvdk)', letterSpacing: '-.3px', textDecoration: 'none' }}>
          River<span style={{ color: 'var(--wt)' }}>Scout</span>
        </Link>
        <div style={{ display: 'flex', gap: '6px', fontFamily: mono, fontSize: '10px' }}>
          <Link href="/" style={{ padding: '5px 10px', borderRadius: '20px', border: '.5px solid var(--bd2)', color: 'var(--tx2)', textDecoration: 'none' }}>Map</Link>
          <span style={{ padding: '5px 10px', borderRadius: '20px', border: '.5px solid var(--rvmd)', color: 'var(--rvdk)', background: 'var(--rvlt)' }}>For Outfitters</span>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ padding: '40px 28px 30px', textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
        <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--rv)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>
          Outfitter & Guide Portal
        </div>
        <h1 style={{ fontFamily: serif, fontSize: '28px', fontWeight: 700, color: 'var(--rvdk)', lineHeight: 1.3, marginBottom: '12px' }}>
          Put your business in front of paddlers planning their next trip
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--tx2)', lineHeight: 1.7, marginBottom: '8px' }}>
          RiverScout serves {riverCount} rivers across {stateCount} states with live USGS flow data, interactive maps, and trip planning tools.
          Every paddler checking conditions is a potential customer.
        </p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', fontFamily: mono, fontSize: '10px', color: 'var(--tx3)', marginTop: '16px' }}>
          <span>{riverCount} rivers</span>
          <span>{stateCount} states</span>
          <span>Live USGS data</span>
          <span>Interactive maps</span>
        </div>
      </div>

      {/* Pricing tiers */}
      <div style={{ padding: '0 28px 40px', maxWidth: '1100px', margin: '0 auto' }}>
        <div className="tier-grid">
          {OUTFITTER_TIERS.map((tier) => {
            const colors = tierColors[tier.tier]
            const isPopular = tier.tier === 'featured'

            return (
              <div key={tier.tier} style={{
                background: colors.bg, border: `.5px solid ${colors.border}`,
                borderRadius: 'var(--rlg)', padding: '20px',
                position: 'relative',
                ...(isPopular ? { boxShadow: '0 4px 20px rgba(29,158,117,.15)', transform: 'scale(1.02)' } : {}),
              }}>
                {isPopular && (
                  <div style={{
                    position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)',
                    fontFamily: mono, fontSize: '9px', padding: '3px 12px', borderRadius: '12px',
                    background: 'var(--rv)', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px',
                  }}>
                    Most Popular
                  </div>
                )}

                {/* Tier name + badge */}
                <div style={{ fontFamily: mono, fontSize: '9px', color: colors.badge, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                  {tier.name}
                </div>

                {/* Price */}
                <div style={{ marginBottom: '12px' }}>
                  {tier.monthlyPrice === 0 ? (
                    <div style={{ fontFamily: serif, fontSize: '28px', fontWeight: 700, color: 'var(--rvdk)' }}>Free</div>
                  ) : tier.yearlyPrice === null ? (
                    <>
                      <div style={{ fontFamily: serif, fontSize: '28px', fontWeight: 700, color: colors.accent }}>
                        ${tier.monthlyPrice}<span style={{ fontFamily: mono, fontSize: '12px', color: 'var(--tx3)' }}>/mo</span>
                      </div>
                      <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)' }}>Annual contract — contact sales</div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontFamily: serif, fontSize: '28px', fontWeight: 700, color: colors.accent }}>
                        ${tier.monthlyPrice}<span style={{ fontFamily: mono, fontSize: '12px', color: 'var(--tx3)' }}>/mo</span>
                      </div>
                      <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--rv)' }}>
                        or ${tier.yearlyPrice}/year — save {Math.round((1 - tier.yearlyPrice / (tier.monthlyPrice * 12)) * 100)}%
                      </div>
                    </>
                  )}
                </div>

                {/* River limit */}
                {tier.maxRivers !== null && (
                  <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', marginBottom: '12px' }}>
                    Up to {tier.maxRivers} river{tier.maxRivers !== 1 ? 's' : ''}
                  </div>
                )}
                {tier.maxRivers === null && (
                  <div style={{ fontFamily: mono, fontSize: '10px', color: colors.accent, marginBottom: '12px' }}>
                    Entire state or region
                  </div>
                )}

                {/* Features */}
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px' }}>
                  {tier.features.map((f, i) => (
                    <li key={i} style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', padding: '3px 0', display: 'flex', gap: '6px', lineHeight: 1.4 }}>
                      <span style={{ color: colors.accent, flexShrink: 0 }}>&#10003;</span>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link href={tier.yearlyPrice === null ? 'mailto:outfitters@riverscout.app?subject=Destination Sponsor Inquiry' : '/outfitters/join'}
                  style={{
                    display: 'block', width: '100%', padding: '10px', textAlign: 'center',
                    fontFamily: mono, fontSize: '11px', fontWeight: 500,
                    border: tier.monthlyPrice === 0 ? `.5px solid ${colors.border}` : 'none',
                    borderRadius: 'var(--r)',
                    background: tier.monthlyPrice === 0 ? 'var(--bg)' : colors.accent,
                    color: tier.monthlyPrice === 0 ? colors.accent : '#fff',
                    textDecoration: 'none',
                    letterSpacing: '.3px',
                  }}>
                  {tier.monthlyPrice === 0 ? 'Claim Free Listing' :
                   tier.yearlyPrice === null ? 'Contact Sales' :
                   'Get Started'}
                </Link>
              </div>
            )
          })}
        </div>

        {/* FAQ */}
        <div style={{ marginTop: '40px', maxWidth: '600px', margin: '40px auto 0' }}>
          <h2 style={{ fontFamily: serif, fontSize: '20px', fontWeight: 700, color: 'var(--rvdk)', marginBottom: '16px', textAlign: 'center' }}>
            Questions
          </h2>
          {[
            {
              q: 'What do paddlers see on RiverScout?',
              a: 'Live USGS flow data, interactive river maps with access points, hatch calendars, trip reports with photos, fishing guides, and outfitter listings. Every paddler checking conditions before a trip sees your listing.',
            },
            {
              q: 'Can I list on multiple rivers?',
              a: 'Free listings cover 1 river. Featured covers up to 3, Sponsored up to 6. Destination Sponsors cover every river in a state.',
            },
            {
              q: "What's the difference between Featured and Sponsored?",
              a: "Featured gives you top placement in the Outfitters tab with your logo, cover photo, booking link, and phone number. Sponsored puts you on the Overview tab — the first thing paddlers see — plus you get included in flow alert emails when your rivers hit optimal CFS, and a quarterly traffic report.",
            },
            {
              q: "I'm a solo fishing guide, not a rafting company.",
              a: "The Guide Profile is built for individual guides. $29/month gets you a personal profile page with specialty tags (fly fishing, kayak instruction, family floats), a direct contact form, and placement in the Local Guides section — separate from business listings.",
            },
            {
              q: 'What are flow alert emails?',
              a: "Paddlers subscribe to get notified when specific rivers hit optimal conditions. Sponsored outfitters are included in those emails — your name, logo, and booking link go directly to paddlers who are actively planning a trip on your river at that moment.",
            },
            {
              q: 'How does the Destination Sponsor tier work?',
              a: "Destination Sponsors get branded placement on every river page in their state, featured placement on the state landing page, logo in the state newsletter, and co-branding in all flow alert emails for that state. It's an annual contract — reach out to discuss.",
            },
            {
              q: 'Can I cancel anytime?',
              a: 'Monthly subscriptions cancel anytime, effective at the end of the billing period. Annual subscriptions are non-refundable but you keep your listing through the paid period. Free listings can be removed on request.',
            },
          ].map((faq, i) => (
            <div key={i} style={{ marginBottom: '14px', padding: '12px 14px', background: 'var(--bg2)', borderRadius: 'var(--r)', border: '.5px solid var(--bd)' }}>
              <div style={{ fontFamily: serif, fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>{faq.q}</div>
              <div style={{ fontSize: '12px', color: 'var(--tx2)', lineHeight: 1.6 }}>{faq.a}</div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center', marginTop: '30px', padding: '20px 0' }}>
          <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)', marginBottom: '6px' }}>
            Questions? Reach us at outfitters@riverscout.app
          </div>
        </div>
      </div>
    </main>
  )
}
