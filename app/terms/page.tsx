import Link from 'next/link'

// Placeholder Terms of Service. Replace with reviewed legal copy
// before publishing in marketing/Stripe checkout footer. Last
// updated date is the only field that should remain stable across
// edits — bump on every substantive change.

export const metadata = {
  title: 'Terms of Service · RiverScout',
  description: 'Terms governing use of RiverScout.',
}

const LAST_UPDATED = 'April 15, 2026'

const ser = "'Playfair Display', serif"
const mono = "'IBM Plex Mono', monospace"

export default function TermsPage() {
  return (
    <main style={{ padding: '40px 24px', maxWidth: 760, margin: '0 auto', color: 'var(--tx)' }}>
      <h1 style={{ fontFamily: ser, fontSize: 32, color: '#042C53', margin: '0 0 6px' }}>Terms of Service</h1>
      <p style={{ fontFamily: mono, fontSize: 11, color: 'var(--tx3)', margin: '0 0 28px' }}>Last updated {LAST_UPDATED}</p>

      <Section title="1. Use of the service">
        RiverScout provides river flow data, conditions, and trip-planning tools for paddlers, anglers, and guides.
        The service is provided as-is, without warranty of any kind. Live data is sourced from the U.S. Geological
        Survey and Environment Canada Water Survey and may be delayed, inaccurate, or unavailable. <strong>Always
        verify conditions on the ground before getting on the water.</strong> RiverScout is a planning aid, not a
        safety system.
      </Section>

      <Section title="2. Accounts">
        You may create a free account to save rivers, set alerts, and contribute community content (trip reports,
        access points, hazards). You are responsible for maintaining the confidentiality of your account credentials
        and for all activity that occurs under your account. We may suspend or terminate accounts that violate these
        terms or that submit false or misleading information.
      </Section>

      <Section title="3. Pro subscription">
        RiverScout Pro is an optional paid subscription billed monthly or annually via Stripe. You may cancel at any
        time from your account settings; cancellations take effect at the end of the current billing period. Refunds
        are issued at our discretion. We reserve the right to change Pro pricing or features with at least 30 days
        notice to active subscribers.
      </Section>

      <Section title="4. User content">
        When you submit trip reports, hazard alerts, access-point coordinates, or improvement suggestions, you grant
        RiverScout a worldwide, royalty-free license to use, display, and distribute that content as part of the
        service. You retain ownership of your content. We may remove submissions that are inaccurate, off-topic, or
        violate the safety of other users.
      </Section>

      <Section title="5. Outfitter listings">
        Outfitters and guide services may purchase Featured, Sponsored, Guide, or Destination tier listings. Listings
        are subject to our review and may be removed for inactive businesses, dead links, or quality concerns. We do
        not endorse or warrant any outfitter; book at your own risk.
      </Section>

      <Section title="6. Limitation of liability">
        To the maximum extent permitted by law, RiverScout, its operators, and its data providers are not liable for
        any direct, indirect, incidental, special, consequential, or punitive damages arising from your use of the
        service, including but not limited to injury, loss of life, property damage, or financial loss resulting
        from reliance on flow data, hazard reports, or any other content presented on the site.
      </Section>

      <Section title="7. Changes to these terms">
        We may update these terms from time to time. Material changes will be announced on the site or by email to
        active accounts. Continued use of RiverScout after the effective date of an update constitutes acceptance.
      </Section>

      <Section title="8. Contact">
        Questions about these terms? Email{' '}
        <a href="mailto:Paddle.rivers.us@gmail.com" style={{ color: 'var(--rvdk)' }}>Paddle.rivers.us@gmail.com</a>{' '}
        or write to: Pine River Paddlesports Center, 9590 M-37, Wellston, MI 49689.
      </Section>

      <p style={{ fontFamily: mono, fontSize: 10, color: 'var(--tx3)', marginTop: 32 }}>
        See also our <Link href="/privacy" style={{ color: 'var(--rvdk)' }}>Privacy Policy</Link>.
      </p>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 28 }}>
      <h2 style={{ fontFamily: ser, fontSize: 18, color: '#042C53', margin: '0 0 8px' }}>{title}</h2>
      <p style={{ fontFamily: 'Georgia, serif', fontSize: 14, color: 'var(--tx)', lineHeight: 1.7 }}>{children}</p>
    </section>
  )
}
