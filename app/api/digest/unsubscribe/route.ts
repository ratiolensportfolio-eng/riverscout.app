import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'
import { verifyDigestToken } from '@/lib/digest-token'

// GET /api/digest/unsubscribe?token=...
//
// One-click unsubscribe from the weekly digest. Token is HMAC-signed
// with CRON_SECRET — see lib/digest-token.ts. We deliberately do NOT
// require login: the link in every digest email must work even if
// the user is signed out, on a different device, or has long since
// forgotten their password. The signature is sufficient proof.
//
// On success, redirect to /digest/unsubscribed which renders a
// human-readable confirmation page. On bad token, redirect there
// with ?error=invalid so the page can show a helpful message.

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  const baseUrl = new URL('/digest/unsubscribed', req.url)

  if (!token) {
    baseUrl.searchParams.set('error', 'missing_token')
    return NextResponse.redirect(baseUrl)
  }

  const payload = verifyDigestToken(token)
  if (!payload) {
    baseUrl.searchParams.set('error', 'invalid_token')
    return NextResponse.redirect(baseUrl)
  }

  const supabase = createSupabaseClient()
  const { error } = await supabase
    .from('user_profiles')
    .update({ digest_subscribed: false })
    .eq('id', payload.userId)

  if (error) {
    console.error('[digest/unsubscribe] update error:', error)
    baseUrl.searchParams.set('error', 'db_error')
    return NextResponse.redirect(baseUrl)
  }

  return NextResponse.redirect(baseUrl)
}
