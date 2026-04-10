// Confirmation page for /api/digest/unsubscribe.
//
// Server component, no auth required. Reads ?error=... if the
// unsubscribe failed and shows the appropriate message. Otherwise
// shows a friendly "you're unsubscribed" + "you can re-subscribe in
// account settings" message.

import Link from 'next/link'

const mono = "'IBM Plex Mono', monospace"
const serif = "'Playfair Display', serif"

interface Props {
  searchParams: Promise<{ error?: string }>
}

const ERROR_MESSAGES: Record<string, { title: string; body: string }> = {
  missing_token: {
    title: 'Missing token',
    body: 'This unsubscribe link is missing its token. If you reached this page from an email, the link may have been truncated by your mail client — open the original email and click the unsubscribe link again.',
  },
  invalid_token: {
    title: 'Invalid token',
    body: 'This unsubscribe link is invalid or has been tampered with. If you reached this page from an email, the link may have been altered. You can manage your digest subscription directly from your account settings.',
  },
  db_error: {
    title: 'Something went wrong',
    body: "We couldn't process your unsubscribe request. Please try again, or sign in and manage your digest preferences directly from your account settings.",
  },
}

export default async function DigestUnsubscribedPage({ searchParams }: Props) {
  const { error } = await searchParams

  const isError = !!error && error in ERROR_MESSAGES
  const errorInfo = isError ? ERROR_MESSAGES[error!] : null

  return (
    <main style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      color: 'var(--tx)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        maxWidth: '440px', width: '100%',
        background: 'var(--bg2)', border: '.5px solid var(--bd)',
        borderRadius: 'var(--rlg)', padding: '32px 28px',
        textAlign: 'center',
      }}>
        <Link href="/" style={{
          display: 'inline-block',
          fontFamily: serif, fontSize: '20px', fontWeight: 700,
          color: 'var(--rvdk)', letterSpacing: '-.3px',
          textDecoration: 'none', marginBottom: '24px',
        }}>
          River<span style={{ color: 'var(--wt)' }}>Scout</span>
        </Link>

        {errorInfo ? (
          <>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>&#9888;</div>
            <h1 style={{
              fontFamily: serif, fontSize: '20px', fontWeight: 700,
              color: 'var(--dg)', marginBottom: '12px',
            }}>
              {errorInfo.title}
            </h1>
            <p style={{
              fontFamily: mono, fontSize: '12px', color: 'var(--tx2)',
              lineHeight: 1.7, marginBottom: '20px',
            }}>
              {errorInfo.body}
            </p>
          </>
        ) : (
          <>
            <div style={{ fontSize: '32px', marginBottom: '12px', color: 'var(--rv)' }}>&#10003;</div>
            <h1 style={{
              fontFamily: serif, fontSize: '20px', fontWeight: 700,
              color: 'var(--rvdk)', marginBottom: '12px',
            }}>
              You&apos;ve been unsubscribed
            </h1>
            <p style={{
              fontFamily: mono, fontSize: '12px', color: 'var(--tx2)',
              lineHeight: 1.7, marginBottom: '20px',
            }}>
              You will no longer receive the weekly river digest. You can re-subscribe at any time from your account settings.
            </p>
          </>
        )}

        <Link href="/account" style={{
          display: 'inline-block',
          fontFamily: mono, fontSize: '11px', fontWeight: 500,
          padding: '10px 24px', borderRadius: 'var(--r)',
          background: 'var(--rvdk)', color: '#fff',
          textDecoration: 'none', letterSpacing: '.3px',
        }}>
          Account settings &rarr;
        </Link>
      </div>
    </main>
  )
}
