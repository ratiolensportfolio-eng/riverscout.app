'use client'

// Auth callback — handles BOTH Supabase magic-link flows:
//
//   1. PKCE (newer default): ?code=abc  → browser-side
//      supabase.auth.exchangeCodeForSession(code). The code_verifier
//      was stored in the browser's storage when signInWithOtp ran,
//      so this must happen in the same browser that initiated the
//      sign-in.
//
//   2. Implicit: #access_token=…&refresh_token=…&type=magiclink  →
//      the browser client's detectSessionInUrl picks this up on
//      mount automatically and fires SIGNED_IN. We just listen for
//      the event and redirect.
//
// The old handler was server-only and only handled PKCE — anyone on
// a Supabase project emitting implicit-flow magic links (common on
// PWA/mobile setups) got silently dropped on /?error=auth_failed.
//
// Because URL fragments (#…) are never sent to the server, this MUST
// be a client component. route.ts and page.tsx can't coexist at the
// same segment, so this file replaces the old route.ts.

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const mono = "'IBM Plex Mono', monospace"
const serif = "'Playfair Display', serif"

function Callback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    const next = searchParams.get('next') || '/dashboard'
    const code = searchParams.get('code')

    // Surface explicit OAuth errors from either the query string or
    // the hash (Supabase puts them in whichever flow is active).
    const queryError = searchParams.get('error_description') || searchParams.get('error')
    const hash = typeof window !== 'undefined' ? window.location.hash.slice(1) : ''
    const hashParams = new URLSearchParams(hash)
    const hashError = hashParams.get('error_description') || hashParams.get('error')
    if (queryError || hashError) {
      setErrorMsg(decodeURIComponent(queryError || hashError || 'Authentication failed.'))
      return
    }

    // Subscribe first — covers both cases:
    //   - PKCE: exchangeCodeForSession fires SIGNED_IN on success
    //   - Implicit: detectSessionInUrl (on by default in createBrowserClient)
    //     auto-parses the hash on mount and fires SIGNED_IN
    const sub = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.replace(next)
      }
    })

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) setErrorMsg(error.message)
      })
    } else {
      // If the user already has a session (e.g. back-button, refresh,
      // or the hash was consumed on a prior mount), skip straight to
      // the destination.
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) router.replace(next)
      })
      // Watchdog: if neither SIGNED_IN nor an existing session shows
      // up within 4s, the link is probably expired / already used.
      const timer = setTimeout(() => {
        supabase.auth.getSession().then(({ data }) => {
          if (!data.session) {
            setErrorMsg('Could not complete sign-in. The link may have expired or been used already.')
          }
        })
      }, 4000)
      return () => {
        sub.data.subscription.unsubscribe()
        clearTimeout(timer)
      }
    }

    return () => sub.data.subscription.unsubscribe()
  }, [router, searchParams])

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--tx)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ maxWidth: '420px', textAlign: 'center' }}>
        {errorMsg ? (
          <>
            <h1 style={{ fontFamily: serif, fontSize: '22px', color: '#A32D2D', margin: '0 0 10px' }}>Sign-in error</h1>
            <p style={{ fontFamily: mono, fontSize: '12px', color: 'var(--tx2)', marginBottom: '18px' }}>{errorMsg}</p>
            <Link
              href="/login"
              style={{
                fontFamily: mono, fontSize: '12px',
                background: 'var(--rvdk)', color: '#fff',
                padding: '9px 18px', borderRadius: 'var(--r)',
                textDecoration: 'none', display: 'inline-block',
              }}
            >Try signing in again</Link>
          </>
        ) : (
          <>
            <div style={{ fontFamily: serif, fontSize: '18px', color: '#042C53', marginBottom: '6px' }}>Signing you in…</div>
            <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--tx3)' }}>Hold on a moment.</div>
          </>
        )}
      </div>
    </main>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <Callback />
    </Suspense>
  )
}
