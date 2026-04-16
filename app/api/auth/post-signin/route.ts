import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { upsertResendContact } from '@/lib/email'

// POST /api/auth/post-signin
//
// Fired by app/auth/callback/page.tsx after SIGNED_IN, for both
// Google OAuth and magic-link flows. Adds new signups to the Resend
// audience so the mailing list is populated automatically.
//
// "New signup" = the user_profiles row was created within the last
// NEW_SIGNUP_WINDOW_MS. Handle_new_user (mig 010/023 trigger) writes
// created_at on first signup; it never changes afterwards. So a fresh
// row means this is a new account — not a returning user signing in
// on a new device.
//
// Returning users are a no-op to avoid hammering Resend. upsertResendContact
// already silently no-ops when RESEND_API_KEY / RESEND_AUDIENCE_ID
// aren't configured, so this route is safe in all deploy states.
//
// Trusts userId from body (same pattern as /api/journal, /api/trips).

export const dynamic = 'force-dynamic'

// 10-minute window. Wide enough to cover slow flows (user bounces
// to email, confirms 8 min later) without catching returning users.
const NEW_SIGNUP_WINDOW_MS = 10 * 60 * 1000

function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }
    const supabase = client()
    if (!supabase) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('email, created_at')
      .eq('id', userId)
      .maybeSingle()

    console.log('[post-signin]', {
      userId: userId.slice(0, 8),
      hasProfile: !!profile,
      email: profile?.email,
      createdAt: profile?.created_at,
      hasResendKey: !!process.env.RESEND_API_KEY,
      hasAudienceId: !!process.env.RESEND_AUDIENCE_ID,
    })

    if (!profile?.email) {
      // No profile row yet — handle_new_user trigger hasn't run or
      // failed silently. Not worth retrying here; next sign-in will
      // re-trigger this route.
      return NextResponse.json({ ok: true, skipped: 'no-profile' })
    }

    const ageMs = Date.now() - new Date(profile.created_at).getTime()
    console.log('[post-signin] age_min:', Math.round(ageMs / 60000))
    if (ageMs > NEW_SIGNUP_WINDOW_MS) {
      return NextResponse.json({
        ok: true, skipped: 'returning-user',
        age_minutes: Math.round(ageMs / 60000),
      })
    }

    const added = await upsertResendContact(profile.email, { source: 'signup' })
    console.log('[post-signin] upsertResendContact returned:', added)
    return NextResponse.json({ ok: true, added, email: profile.email })
  } catch (err) {
    console.error('[post-signin] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
