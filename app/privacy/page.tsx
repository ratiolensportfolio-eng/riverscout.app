import Link from 'next/link'

// Privacy Policy. Good-faith effort covering Stripe live-mode
// requirements, GDPR Art. 13 lawful-basis disclosure, CCPA/CPRA
// California rights notice, data retention, international transfer,
// and breach notification. Not a substitute for a lawyer review
// before heavy EU traffic or a regulator inquiry.

export const metadata = {
  title: 'Privacy Policy · RiverScout',
  description: 'How RiverScout collects and uses your data.',
}

const LAST_UPDATED = 'April 16, 2026'

const ser = "'Playfair Display', serif"
const mono = "'IBM Plex Mono', monospace"

export default function PrivacyPage() {
  return (
    <main style={{ padding: '40px 24px', maxWidth: 760, margin: '0 auto', color: 'var(--tx)' }}>
      <h1 style={{ fontFamily: ser, fontSize: 32, color: '#042C53', margin: '0 0 6px' }}>Privacy Policy</h1>
      <p style={{ fontFamily: mono, fontSize: 11, color: 'var(--tx3)', margin: '0 0 28px' }}>Last updated {LAST_UPDATED}</p>

      <Section title="What we collect">
        <strong>Account data:</strong> email, display name, optional avatar, home state, the rivers you save, your
        gauge preferences, and the trips you log to your river journal. <strong>Payment data:</strong> handled by
        Stripe — we never see or store your card number. <strong>Usage data:</strong> we use Plausible Analytics
        for aggregate page-view counts; Plausible does not use cookies and does not collect personal data.
      </Section>

      <Section title="How we use it">
        To run the service: send the alerts you opt in to, deliver the weekly digest if you've subscribed, show your
        contributions next to your display name, and authenticate Pro features. We don't sell your data, and we
        don't share it with third parties except as required to run the service (Supabase for database, Stripe for
        billing, Resend for transactional email).
      </Section>

      <Section title="Our legal basis for processing (GDPR)">
        Where GDPR applies, our legal bases are: <strong>Contract</strong> — account creation, authentication, Pro
        subscription delivery, and storing the saved rivers and preferences required to run the service for you.
        {' '}<strong>Consent</strong> — sending the weekly digest and any alerts you've explicitly subscribed to; you
        can withdraw consent at any time from your account settings. <strong>Legitimate interest</strong> — aggregate
        analytics via Plausible (no personal data collected) and operational logging used to detect abuse and keep
        the service secure. <strong>Legal obligation</strong> — retaining payment records for as long as required
        by applicable tax and accounting law.
      </Section>

      <Section title="Cookies">
        We use cookies only for authentication (Supabase session cookies). No tracking, advertising, or
        third-party cookies. Plausible Analytics is cookie-free.
      </Section>

      <Section title="Email">
        We send email only for: account verification, alerts you've explicitly subscribed to, the weekly digest if
        you've opted in, payment notifications, and (rarely) service announcements. Every email has a one-click
        unsubscribe footer. You can manage all email preferences from your account page.
      </Section>

      <Section title="How long we keep your data">
        <strong>Active accounts:</strong> retained while your account exists. <strong>Deleted accounts:</strong>{' '}
        personal data (email, display name, preferences, saved rivers, alerts) is removed within 30 days of your
        deletion request; database backups are purged within 90 days. <strong>Community contributions</strong>{' '}
        (trip reports, access points, hazards) may be retained in anonymized form — your display name is stripped,
        but the underlying observation stays visible because other paddlers rely on it. <strong>Payment records</strong>{' '}
        are retained by us and by Stripe for as long as required by US tax law (currently seven years). <strong>Server
        logs</strong> are retained for approximately 30 days before rotation.
      </Section>

      <Section title="Your rights">
        You can manage email preferences and unsubscribe from any email directly in your account settings. For data
        export or account deletion, email{' '}
        <a href="mailto:Paddle.rivers.us@gmail.com" style={{ color: 'var(--rvdk)' }}>Paddle.rivers.us@gmail.com</a>{' '}
        from the address on your account — we respond within 30 days, typically much sooner. If you're an EU/EEA or
        UK resident, you also have the right to lodge a complaint with your local data protection authority. We're
        actively building a self-serve export/delete flow in the account settings; until it ships, email is the way.
      </Section>

      <Section title="Your California Privacy Rights">
        Under the California Consumer Privacy Act (CCPA/CPRA), California residents have the right to know what
        personal information we collect, to request deletion, to correct inaccuracies, to limit use of sensitive
        personal information, and to not be discriminated against for exercising these rights. <strong>We do not
        sell or share your personal information</strong> as those terms are defined by the CCPA, and we do not use
        or disclose sensitive personal information for purposes that would require a "limit use" link. To exercise
        any California right, email{' '}
        <a href="mailto:Paddle.rivers.us@gmail.com" style={{ color: 'var(--rvdk)' }}>Paddle.rivers.us@gmail.com</a>{' '}
        from the address on your account. We verify requests by confirming account ownership and respond within 45
        days. You may designate an authorized agent to make a request on your behalf.
      </Section>

      <Section title="International data transfers">
        RiverScout is operated from the United States. If you access the service from outside the US, your data will
        be transferred to, stored, and processed in the United States by us and our sub-processors. We rely on
        Standard Contractual Clauses (SCCs) with Supabase, Stripe, and Resend as the legal mechanism for transfers
        from the European Economic Area and the United Kingdom.
      </Section>

      <Section title="Security and breach notification">
        We take reasonable steps to protect your data — TLS in transit, encryption at rest for our database, and
        least-privilege access for operators. In the event of a data breach affecting your personal information, we
        will notify you without undue delay, consistent with GDPR Articles 33-34 and applicable US state breach
        notification laws. For GDPR-governed breaches posing a risk to your rights and freedoms, we aim to notify
        the relevant supervisory authority within 72 hours of discovery.
      </Section>

      <Section title="Children">
        RiverScout is not directed at children under 13. We don't knowingly collect data from children under 13. If
        you believe a child has created an account, contact us and we'll remove it.
      </Section>

      <Section title="Changes">
        We may update this policy. Material changes will be announced on the site or via email. The date at the top
        of this page reflects the last update.
      </Section>

      <Section title="Contact">
        Privacy questions:{' '}
        <a href="mailto:Paddle.rivers.us@gmail.com" style={{ color: 'var(--rvdk)' }}>Paddle.rivers.us@gmail.com</a>{' '}
        or Pine River Paddlesports Center, 9590 M-37, Wellston, MI 49689.
      </Section>

      <p style={{ fontFamily: mono, fontSize: 10, color: 'var(--tx3)', marginTop: 32 }}>
        See also our <Link href="/terms" style={{ color: 'var(--rvdk)' }}>Terms of Service</Link>.
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
