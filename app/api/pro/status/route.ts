import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'

// GET /api/pro/status?userId=... — check Pro subscription status
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')
  if (!userId) {
    return NextResponse.json({ isPro: false })
  }

  const supabase = createSupabaseClient()
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('is_pro, pro_tier, pro_expires_at')
    .eq('id', userId)
    .single()

  if (!profile) {
    return NextResponse.json({ isPro: false })
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
