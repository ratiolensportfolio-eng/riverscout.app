import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'
import { ADMIN_EMAILS } from '@/lib/admin'

// GET /api/pro/status?userId=... — check Pro subscription status
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')
  if (!userId) {
    return NextResponse.json({ isPro: false })
  }

  const supabase = createSupabaseClient()
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('is_pro, pro_tier, pro_expires_at, email')
    .eq('id', userId)
    .single()

  if (!profile) {
    // Check auth.users directly for admin email
    const { data: authUser } = await supabase.auth.admin.getUserById(userId).catch(() => ({ data: null })) as { data: { user?: { email?: string } } | null }
    const email = authUser?.user?.email
    if (email && ADMIN_EMAILS.includes(email.toLowerCase())) {
      return NextResponse.json({ isPro: true, tier: 'admin', expiresAt: null })
    }
    return NextResponse.json({ isPro: false })
  }

  // Admins always get Pro access
  if (profile.email && ADMIN_EMAILS.includes(profile.email.toLowerCase())) {
    return NextResponse.json({ isPro: true, tier: profile.pro_tier || 'admin', expiresAt: null })
  }

  // Check if Pro is still active (not expired)
  const isPro = profile.is_pro && (
    !profile.pro_expires_at || new Date(profile.pro_expires_at) > new Date()
  )

  return NextResponse.json({
    isPro,
    tier: isPro ? profile.pro_tier : null,
    expiresAt: isPro ? profile.pro_expires_at : null,
  })
}
