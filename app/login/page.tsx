'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Suspense } from 'react'

const mono = "'IBM Plex Mono', monospace"
const serif = "'Playfair Display', serif"

function LoginForm() {
  const params = useSearchParams()
  // Default post-auth destination is /dashboard. Callers that want a
  // different landing page pass ?redirect=... (e.g. protected routes
  // in middleware set ?redirect=/admin so users come back to what
  // they were trying to reach).
  const redirect = params.get('redirect') || '/dashboard'
  const error = params.get('error')

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [authError, setAuthError] = useState(error === 'auth_failed' ? 'Authentication failed. Please try again.' : '')

  async function signInWithGoogle() {
    setLoading(true)
    setAuthError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirect)}`,
      },
    })
    if (error) {
      setAuthError(error.message)
      setLoading(false)
    }
  }

  async function signInWithEmail() {
    if (!email.includes('@')) return
    setLoading(true)
    setAuthError('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirect)}`,
      },
    })
    if (error) {
      setAuthError(error.message)
    } else {
      setEmailSent(true)
    }
    setLoading(false)
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--tx)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '380px', width: '100%', padding: '40px 28px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Link href="/" style={{ fontFamily: serif, fontSize: '24px', fontWeight: 700, color: 'var(--rvdk)', letterSpacing: '-.5px', textDecoration: 'none' }}>
            River<span style={{ color: 'var(--wt)' }}>Scout</span>
          </Link>
        </div>

        <h1 style={{ fontFamily: serif, fontSize: '20px', fontWeight: 700, color: 'var(--rvdk)', textAlign: 'center', marginBottom: '4px' }}>
          Sign in
        </h1>
        <p style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)', textAlign: 'center', marginBottom: '24px' }}>
          Submit trip reports, manage flow alerts, and claim your outfitter listing
        </p>

        {emailSent ? (
          <div style={{ textAlign: 'center', padding: '20px', background: 'var(--rvlt)', border: '.5px solid var(--rvmd)', borderRadius: 'var(--rlg)' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>&#9993;</div>
            <div style={{ fontFamily: serif, fontSize: '16px', fontWeight: 600, color: 'var(--rvdk)', marginBottom: '4px' }}>
              Check your email
            </div>
            <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx2)' }}>
              We sent a magic link to <strong>{email}</strong>
            </div>
          </div>
        ) : (
          <>
            {/* Google OAuth */}
            <button onClick={signInWithGoogle} disabled={loading}
              style={{
                width: '100%', padding: '12px', marginBottom: '12px',
                fontFamily: mono, fontSize: '12px', fontWeight: 500,
                background: '#fff', color: '#333', border: '1px solid #ddd',
                borderRadius: 'var(--r)', cursor: loading ? 'wait' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                opacity: loading ? 0.7 : 1,
              }}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '16px 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--bd)' }} />
              <span style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--bd)' }} />
            </div>

            {/* Email magic link */}
            <div style={{ marginBottom: '12px' }}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && signInWithEmail()}
                style={{
                  width: '100%', padding: '12px 14px',
                  fontFamily: mono, fontSize: '12px',
                  border: '.5px solid var(--bd2)', borderRadius: 'var(--r)',
                  background: 'var(--bg)', color: 'var(--tx)',
                }}
              />
            </div>
            <button onClick={signInWithEmail} disabled={loading || !email.includes('@')}
              style={{
                width: '100%', padding: '12px',
                fontFamily: mono, fontSize: '12px', fontWeight: 500,
                background: email.includes('@') ? 'var(--rv)' : 'var(--bg3)',
                color: email.includes('@') ? '#fff' : 'var(--tx3)',
                border: 'none', borderRadius: 'var(--r)',
                cursor: email.includes('@') ? 'pointer' : 'default',
                opacity: loading ? 0.7 : 1,
              }}>
              {loading ? 'Sending...' : 'Send magic link'}
            </button>
          </>
        )}

        {authError && (
          <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--dg)', marginTop: '12px', textAlign: 'center' }}>
            {authError}
          </div>
        )}

        <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textAlign: 'center', marginTop: '20px', lineHeight: 1.6 }}>
          No password needed. Sign in with Google or a magic link sent to your email.
        </div>
        <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textAlign: 'center', marginTop: '10px', lineHeight: 1.6 }}>
          By continuing, you agree to our{' '}
          <Link href="/terms" style={{ color: 'var(--rvdk)', textDecoration: 'underline' }}>Terms</Link>{' '}
          and{' '}
          <Link href="/privacy" style={{ color: 'var(--rvdk)', textDecoration: 'underline' }}>Privacy Policy</Link>.
        </div>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}
