import type { Metadata } from 'next'
import Link from 'next/link'

const mono = "'IBM Plex Mono', monospace"
const serif = "'Playfair Display', serif"

export const metadata: Metadata = {
  title: 'Outfitter Tier Preview | RiverScout',
  description: 'Preview of how each outfitter listing tier renders on a river page — Destination, Sponsored, Featured, Guide, and Listed.',
  robots: { index: false, follow: false },
}

// Fake data for the mockups. Mirrors the shape of an outfitters
// row from Supabase so the cards render exactly the same as they
// would on a real river page.
const sampleDestination = {
  id: 'preview-destination',
  business_name: 'Pine River Lodge & Outfitters',
  description: 'Full-service Wild & Scenic River destination — riverside lodge, drift boat fleet, certified guides, and overnight float trip packages on the Pine River corridor since 1972.',
  phone: '(231) 555-0100',
  website: 'pineriverlodge.com',
  logo_url: '',
  cover_photo_url: '',
  tier: 'destination' as const,
  specialty_tags: ['Lodging', 'Drift Boat Trips', 'Multi-Day Float', 'Fly Fishing', 'Family Float'],
}

const sampleSponsored = {
  id: 'preview-sponsored',
  business_name: 'Manistee River Outfitters',
  description: 'Manistee\u2019s longest-running outfitter \u2014 daily kayak, canoe, and tube trips from Hodenpyl Dam pond down to High Bridge. Free shuttle, lifejackets included.',
  phone: '(231) 555-0142',
  website: 'manisteeriveroutfitters.com',
  logo_url: '',
  cover_photo_url: '',
  tier: 'sponsored' as const,
  specialty_tags: ['Kayak Rental', 'Canoe Rental', 'Tube Trips', 'Shuttle Service'],
}

const sampleFeatured = {
  id: 'preview-featured',
  business_name: 'Pere Marquette Lodge',
  description: 'Historic 1923 lodge on the famous Flies-Only Water. Wading, drift boat, and Spey casting instruction. Federal Permit Holder.',
  phone: '(231) 555-0188',
  website: 'pmlodge.com',
  logo_url: '',
  cover_photo_url: '',
  tier: 'featured' as const,
  specialty_tags: ['Fly Fishing', 'Lodging', 'Drift Boat'],
}

const sampleGuide = {
  id: 'preview-guide',
  business_name: 'Pine River Fly Fishing — Tom Halsey',
  description: 'Licensed Michigan fly fishing guide specializing in wild brook trout and trophy browns on the Pine River corridor. 20+ years on these waters. Federal use permit, USCG OUPV captain, MI Master Guide.',
  phone: '(231) 555-0177',
  website: 'pineriverflyfishing.com',
  logo_url: '',
  cover_photo_url: '',
  tier: 'guide' as const,
  specialty_tags: ['Brook Trout', 'Brown Trout', 'Hex Hatch', 'Wading', 'Walk-and-Wade'],
}

const sampleListed = {
  id: 'preview-listed',
  business_name: 'Horina Canoe & Kayak Rental',
  description: 'Budget-friendly canoe and kayak rentals at multiple Pine River access points. Self-shuttle and family-friendly trip options.',
  phone: '(231) 555-0120',
  website: 'horinacanoe.com',
  logo_url: '',
  cover_photo_url: '',
  tier: 'listed' as const,
  specialty_tags: [],
}

// Render a single outfitter card matching the live RiverTabs.tsx
// styles for the given tier. Inlined here so the preview is fully
// self-contained and doesn't import RiverTabs (which is a 2,500-line
// client component with hooks and state).
interface PreviewOutfitter {
  id: string
  business_name: string
  description: string
  phone: string
  website: string
  logo_url: string
  cover_photo_url: string
  tier: 'destination' | 'sponsored' | 'featured' | 'guide' | 'listed'
  specialty_tags: string[]
}

function OutfitterCard({ o }: { o: PreviewOutfitter }) {
  // ── Destination + Sponsored: above-the-fold style ──
  if (o.tier === 'destination' || o.tier === 'sponsored') {
    return (
      <div style={{
        marginBottom: '14px', padding: '14px', borderRadius: 'var(--rlg)',
        background: o.tier === 'destination'
          ? 'linear-gradient(135deg, #F3ECFB, #E9F1FB)'
          : 'linear-gradient(135deg, #E6F1FB, #E1F5EE)',
        border: o.tier === 'destination' ? '1px solid #6E4BB4' : '1px solid var(--wt)',
        position: 'relative',
      }}>
        <span style={{
          position: 'absolute', top: '8px', right: '10px',
          fontFamily: mono, fontSize: '8px', padding: '2px 8px',
          borderRadius: '8px',
          background: o.tier === 'destination' ? '#6E4BB4' : 'var(--wt)',
          color: '#fff',
          textTransform: 'uppercase', letterSpacing: '.5px',
        }}>{o.tier === 'destination' ? 'Destination Sponsor' : 'Sponsored'}</span>
        <div style={{ width: '100%', height: '120px', background: 'var(--bg3)', borderRadius: '6px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--tx3)', fontFamily: mono, fontSize: '10px' }}>
          [ Cover photo — 16:9 landscape ]
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: 'var(--bg3)', border: '.5px solid var(--bd)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono, fontSize: '9px', color: 'var(--tx3)' }}>logo</div>
          <div>
            <div style={{ fontFamily: serif, fontSize: '15px', fontWeight: 700, color: '#042C53' }}>{o.business_name}</div>
            {o.phone && <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--wt)' }}>{o.phone}</div>}
          </div>
        </div>
        {o.description && <div style={{ fontSize: '12px', color: 'var(--tx2)', lineHeight: 1.55, marginBottom: '10px' }}>{o.description}</div>}
        {o.specialty_tags.length > 0 && (
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '10px' }}>
            {o.specialty_tags.map((t, i) => (
              <span key={i} style={{ fontFamily: mono, fontSize: '8px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,.6)', color: 'var(--wt)', border: '.5px solid var(--wtmd)' }}>{t}</span>
            ))}
          </div>
        )}
        <span style={{
          display: 'inline-block', fontFamily: mono, fontSize: '11px',
          padding: '8px 18px', borderRadius: 'var(--r)',
          background: 'var(--wt)', color: '#fff', fontWeight: 500,
        }}>Book Now</span>
      </div>
    )
  }

  // ── Featured: Outfitters tab top ──
  if (o.tier === 'featured') {
    return (
      <div style={{
        border: '.5px solid var(--rvmd)', borderRadius: 'var(--r)',
        padding: '12px', background: 'var(--rvlt)', marginBottom: '8px', position: 'relative',
      }}>
        <span style={{
          position: 'absolute', top: '6px', right: '8px',
          fontFamily: mono, fontSize: '8px', padding: '2px 6px',
          borderRadius: '6px', background: 'var(--rv)', color: '#fff',
          textTransform: 'uppercase', letterSpacing: '.5px',
        }}>Featured</span>
        <div style={{ width: '100%', height: '80px', background: 'var(--bg3)', borderRadius: '4px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--tx3)', fontFamily: mono, fontSize: '10px' }}>
          [ Cover photo ]
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '4px', background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono, fontSize: '8px', color: 'var(--tx3)' }}>logo</div>
          <div>
            <div style={{ fontFamily: mono, fontSize: '12px', fontWeight: 600, color: 'var(--rvdk)' }}>{o.business_name}</div>
            {o.phone && <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)' }}>{o.phone}</div>}
          </div>
        </div>
        {o.description && <div style={{ fontSize: '11px', color: 'var(--tx2)', lineHeight: 1.5, marginBottom: '8px' }}>{o.description}</div>}
        {o.specialty_tags.length > 0 && (
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
            {o.specialty_tags.map((t, i) => (
              <span key={i} style={{ fontFamily: mono, fontSize: '8px', padding: '1px 5px', borderRadius: '4px', border: '.5px solid var(--rvmd)', color: 'var(--rv)' }}>{t}</span>
            ))}
          </div>
        )}
        <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--rv)' }}>
          {o.website?.replace(/^https?:\/\//, '')} &rarr;
        </span>
      </div>
    )
  }

  // ── Guide: amber, the focus of this preview ──
  if (o.tier === 'guide') {
    return (
      <div style={{
        border: '.5px solid var(--am)', borderRadius: 'var(--r)',
        padding: '10px 12px', background: 'var(--amlt)', marginBottom: '6px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px', flexWrap: 'wrap' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono, fontSize: '8px', color: 'var(--tx3)' }}>logo</div>
              <span style={{ fontFamily: mono, fontSize: '12px', fontWeight: 600, color: 'var(--am)' }}>{o.business_name}</span>
              <span style={{ fontFamily: mono, fontSize: '8px', padding: '2px 6px', borderRadius: '6px', background: 'var(--am)', color: '#fff', textTransform: 'uppercase' }}>Guide</span>
            </div>
            {o.specialty_tags.length > 0 && (
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '4px' }}>
                {o.specialty_tags.map((tag, i) => (
                  <span key={i} style={{ fontFamily: mono, fontSize: '8px', padding: '1px 5px', borderRadius: '4px', border: '.5px solid var(--am)', color: 'var(--am)' }}>{tag}</span>
                ))}
              </div>
            )}
            {o.description && <div style={{ fontSize: '11px', color: 'var(--tx2)', lineHeight: 1.5 }}>{o.description}</div>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
          {o.phone && <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)' }}>{o.phone}</span>}
          <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--am)' }}>Contact &rarr;</span>
        </div>
      </div>
    )
  }

  // ── Listed: minimal ──
  return (
    <div style={{
      border: '.5px solid var(--bd)', borderRadius: 'var(--r)',
      padding: '12px', background: 'var(--bg2)', marginBottom: '8px',
      position: 'relative',
    }}>
      <span style={{
        position: 'absolute', top: '8px', right: '10px',
        fontFamily: mono, fontSize: '7px',
        padding: '1px 6px', borderRadius: '5px',
        background: 'var(--bg3, #e8e8e8)', color: 'var(--tx3)',
        textTransform: 'uppercase', letterSpacing: '.4px',
      }}>Listed</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', paddingRight: '46px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '4px', background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono, fontSize: '8px', color: 'var(--tx3)' }}>logo</div>
        <div>
          <div style={{ fontFamily: mono, fontSize: '12px', fontWeight: 600, color: 'var(--rvdk)' }}>{o.business_name}</div>
          {o.phone && <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', marginTop: '1px' }}>{o.phone}</div>}
        </div>
      </div>
      {o.description && (
        <div style={{ fontSize: '11px', color: 'var(--tx2)', lineHeight: 1.5, marginTop: '6px', marginBottom: '8px' }}>
          {o.description}
        </div>
      )}
      <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--rv)' }}>
        {o.website?.replace(/^https?:\/\//, '')} &rarr;
      </span>
    </div>
  )
}

export default function OutfitterPreviewPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--tx)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 20px 80px' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--rv)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>
            Internal Preview
          </div>
          <h1 style={{ fontFamily: serif, fontSize: '26px', fontWeight: 700, color: 'var(--rvdk)', margin: '0 0 6px' }}>
            Outfitter Tier Mockups
          </h1>
          <div style={{ fontSize: '13px', color: 'var(--tx2)', lineHeight: 1.5, marginBottom: '8px' }}>
            How each tier renders on a river page. Logos and cover photos here are placeholders &mdash; real listings supply real images. The Guide tier (amber) is the focus of this preview, but all five tiers are shown for context.
          </div>
          <Link href="/outfitters" style={{ fontFamily: mono, fontSize: '11px', color: 'var(--rv)' }}>
            &larr; back to pricing
          </Link>
        </div>

        {/* ── GUIDE PROFILE — featured at the top ── */}
        <section style={{ marginBottom: '32px', padding: '20px', background: 'var(--bg2)', borderRadius: 'var(--rlg)', border: '.5px solid var(--bd)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
            <div>
              <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--am)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '2px' }}>
                Guide Profile &middot; $29/mo
              </div>
              <h2 style={{ fontFamily: serif, fontSize: '20px', fontWeight: 700, color: 'var(--rvdk)', margin: 0 }}>
                Independent guide tier
              </h2>
            </div>
            <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)' }}>
              Renders in &ldquo;Local Guides&rdquo; section of every river you cover
            </div>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--tx2)', lineHeight: 1.6, marginBottom: '14px' }}>
            Designed for independent guides &mdash; flat amber styling instantly distinguishes you from rental shops and outfitter chains. Shows your specialty tags, certifications, and a <strong>Contact</strong> link instead of a Book Now button (most independent guides prefer phone/text contact over an online booking flow).
          </div>

          <OutfitterCard o={sampleGuide} />

          {/* Render an additional second-guide example so the user
              sees what the section looks like when stocked. */}
          <OutfitterCard o={{
            ...sampleGuide,
            id: 'preview-guide-2',
            business_name: 'Manistee Spey Co. \u2014 Sarah Lindstrom',
            description: 'Two-handed Spey casting instruction and guided steelhead trips on the lower Manistee. USCG OUPV captain, 12 years on the water, certified Spey casting instructor.',
            specialty_tags: ['Steelhead', 'Spey Casting', 'Drift Boat', 'Salmon Runs', 'Instruction'],
            phone: '(231) 555-0211',
          }} />
        </section>

        {/* ── Other tiers for comparison ── */}
        <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px' }}>
          For Context: Other Outfitter Tiers
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontFamily: mono, fontSize: '10px', color: '#6E4BB4', marginBottom: '6px' }}>
            <strong>Destination Sponsor &middot; $499/mo</strong> &mdash; above the fold on the Overview tab, full cover photo, multi-state coverage
          </div>
          <OutfitterCard o={sampleDestination} />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--wt)', marginBottom: '6px' }}>
            <strong>Sponsored &middot; $149/mo</strong> &mdash; above the fold on the Overview tab, single-state cover, Book Now CTA
          </div>
          <OutfitterCard o={sampleSponsored} />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--rv)', marginBottom: '6px' }}>
            <strong>Featured &middot; $49/mo</strong> &mdash; top of the Outfitters tab, smaller cover photo, river-page placement
          </div>
          <OutfitterCard o={sampleFeatured} />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)', marginBottom: '6px' }}>
            <strong>Listed &middot; Free</strong> &mdash; bottom of the Outfitters tab, no cover photo
          </div>
          <OutfitterCard o={sampleListed} />
        </div>

        {/* Tier comparison table */}
        <div style={{ marginTop: '32px', padding: '16px', background: 'var(--bg2)', borderRadius: 'var(--r)', border: '.5px solid var(--bd)' }}>
          <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
            Where the Guide Tier sits
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: mono, fontSize: '11px' }}>
            <thead>
              <tr style={{ borderBottom: '.5px solid var(--bd2)', textAlign: 'left' }}>
                <th style={{ padding: '6px 8px', color: 'var(--tx3)', fontWeight: 600 }}>Tier</th>
                <th style={{ padding: '6px 8px', color: 'var(--tx3)', fontWeight: 600 }}>Section</th>
                <th style={{ padding: '6px 8px', color: 'var(--tx3)', fontWeight: 600 }}>CTA</th>
                <th style={{ padding: '6px 8px', color: 'var(--tx3)', fontWeight: 600 }}>Price</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '.5px solid var(--bd)' }}>
                <td style={{ padding: '6px 8px', color: '#6E4BB4', fontWeight: 600 }}>Destination Sponsor</td>
                <td style={{ padding: '6px 8px', color: 'var(--tx2)' }}>Above-the-fold (Overview)</td>
                <td style={{ padding: '6px 8px', color: 'var(--tx2)' }}>Book Now</td>
                <td style={{ padding: '6px 8px', color: 'var(--tx2)' }}>$499/mo</td>
              </tr>
              <tr style={{ borderBottom: '.5px solid var(--bd)' }}>
                <td style={{ padding: '6px 8px', color: 'var(--wt)', fontWeight: 600 }}>Sponsored</td>
                <td style={{ padding: '6px 8px', color: 'var(--tx2)' }}>Above-the-fold (Overview)</td>
                <td style={{ padding: '6px 8px', color: 'var(--tx2)' }}>Book Now</td>
                <td style={{ padding: '6px 8px', color: 'var(--tx2)' }}>$149/mo</td>
              </tr>
              <tr style={{ borderBottom: '.5px solid var(--bd)' }}>
                <td style={{ padding: '6px 8px', color: 'var(--rv)', fontWeight: 600 }}>Featured</td>
                <td style={{ padding: '6px 8px', color: 'var(--tx2)' }}>Outfitters tab top</td>
                <td style={{ padding: '6px 8px', color: 'var(--tx2)' }}>Website link</td>
                <td style={{ padding: '6px 8px', color: 'var(--tx2)' }}>$49/mo</td>
              </tr>
              <tr style={{ borderBottom: '.5px solid var(--bd)', background: 'var(--amlt)' }}>
                <td style={{ padding: '6px 8px', color: 'var(--am)', fontWeight: 600 }}>Guide Profile</td>
                <td style={{ padding: '6px 8px', color: 'var(--tx2)' }}>Local Guides section</td>
                <td style={{ padding: '6px 8px', color: 'var(--tx2)' }}>Contact link</td>
                <td style={{ padding: '6px 8px', color: 'var(--tx2)' }}>$29/mo</td>
              </tr>
              <tr>
                <td style={{ padding: '6px 8px', color: 'var(--tx3)', fontWeight: 600 }}>Listed</td>
                <td style={{ padding: '6px 8px', color: 'var(--tx2)' }}>Outfitters tab bottom</td>
                <td style={{ padding: '6px 8px', color: 'var(--tx2)' }}>Website link</td>
                <td style={{ padding: '6px 8px', color: 'var(--tx2)' }}>Free</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Improvement ideas — direct hooks for the next iteration */}
        <div style={{ marginTop: '24px', padding: '16px', background: 'var(--amlt)', borderRadius: 'var(--r)', border: '.5px solid var(--am)' }}>
          <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--am)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
            Improvement ideas (vote with feedback)
          </div>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: 'var(--tx)', lineHeight: 1.7 }}>
            <li><strong>Years on the river</strong> badge next to the name (e.g. &ldquo;20+ years&rdquo;) &mdash; pulled from a new <code>experience_years</code> column on the listing</li>
            <li><strong>Certification chips</strong> next to specialty tags (USCG OUPV, Wilderness First Responder, AMGA, state guide license) &mdash; new <code>certifications[]</code> array</li>
            <li><strong>Multi-river coverage indicator</strong> &mdash; small &ldquo;+3 more rivers&rdquo; pill that links to the guide&rsquo;s full profile page listing every river they cover</li>
            <li><strong>Per-guide profile page</strong> at <code>/guides/[slug]</code> with a longer bio, gallery, all rivers covered, and a contact form &mdash; turns the river-page card into a teaser, the profile page into the conversion surface</li>
            <li><strong>Trip type badges</strong> on the right side of the card (&ldquo;Half day&rdquo;, &ldquo;Full day&rdquo;, &ldquo;Overnight&rdquo;) for quick scanning</li>
            <li><strong>&ldquo;Available next 7 days&rdquo;</strong> indicator with a green dot &mdash; powered by a simple availability calendar the guide manages from their dashboard</li>
            <li><strong>Contact form modal</strong> instead of phone-only &mdash; opens a small form with name/dates/party size that emails the guide directly, reducing friction for travelers without giving the guide&rsquo;s personal cell to bots</li>
            <li><strong>Star rating + review count</strong> if/when trip reports get linked to specific guides (e.g. &ldquo;★ 4.9 (37)&rdquo;)</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
