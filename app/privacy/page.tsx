import Link from 'next/link'

// Placeholder Privacy Policy. Replace with reviewed legal copy
// before public launch / Stripe verification.

export const metadata = {
  title: 'Privacy Policy · RiverScout',
  description: 'How RiverScout collects and uses your data.',
}

const LAST_UPDATED = 'April 15, 2026'

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

      <Section title="Cookies">
        We use cookies only for authentication (Supabase session cookies). No tracking, advertising, or
        third-party cookies. Plausible Analytics is cookie-free.
      </Section>

      <Section title="Email">
        We send email only for: account verification, alerts you've explicitly subscribed to, the weekly digest if
        you've opted in, payment notifications, and (rarely) service announcements. Every email has a one-click
        unsubscribe footer. You can manage all email preferences from your account page.
      </Section>

      <Section title="Your rights">
        You can: download your data, delete your account, export your river journal, and unsubscribe from any email
        — all from your account settings. For deletion or export requests we can't fulfill in-app, email{' '}
        <a href="mailto:Paddle.rivers.us@gmail.com" style={{ color: 'var(--rvdk)' }}>Paddle.rivers.us@gmail.com</a>{' '}
        and we'll respond within 30 days.
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
