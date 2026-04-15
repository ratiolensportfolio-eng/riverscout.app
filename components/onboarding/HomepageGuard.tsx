'use client'

// Mounted on the homepage. On load:
//   1. Read auth state from Supabase
//   2. If signed in, GET /api/profile/onboarding to check completion
//   3. Completed → router.push('/dashboard') (signed-in homepage = dashboard)
//   4. Not completed → render the OnboardingFlow modal over the homepage
//   5. Signed out → render nothing; homepage stays as-is
//
// Renders nothing during the initial check so the homepage doesn't
// flash before the redirect kicks in.

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import OnboardingFlow from './OnboardingFlow'

export default function HomepageGuard() {
  const router = useRouter()
  const [state, setState] = useState<'checking' | 'anon' | 'onboarding' | 'redirecting'>('checking')
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    let cancel = false
    supabase.auth.getUser().then(async ({ data }) => {
      if (cancel) return
      const uid = data.user?.id ?? null
      if (!uid) { setState('anon'); return }
      setUserId(uid)

      try {
        const r = await fetch(`/api/profile/onboarding?userId=${uid}`)
        const d = await r.json()
        if (cancel) return
        if (d.onboarding_completed_at) {
          setState('redirecting')
          router.replace('/dashboard')
        } else {
          setState('onboarding')
        }
      } catch {
        // If the check fails, fall through to anon — don't trap the
        // user in a broken modal.
        setState('anon')
      }
    })
    return () => { cancel = true }
  }, [router])

  if (state === 'onboarding' && userId) return <OnboardingFlow userId={userId} />
  // For 'checking', 'anon', and 'redirecting' we render nothing —
  // the underlying homepage handles its own UI.
  return null
}
