// Pro subscription status helpers
// Used by both server and client components

import { createSupabaseClient } from '@/lib/supabase'
import { ADMIN_EMAILS } from '@/lib/admin'

export async function getUserPro(userId: string): Promise<boolean> {
  const supabase = createSupabaseClient()
  const { data } = await supabase
    .from('user_profiles')
    .select('is_pro, pro_expires_at, email')
    .eq('id', userId)
    .single()

  // Admins always have Pro access
  if (data?.email && ADMIN_EMAILS.includes(data.email.toLowerCase())) {
    return true
  }

  if (!data?.is_pro) return false

  // Check expiration
  if (data.pro_expires_at && new Date(data.pro_expires_at) < new Date()) {
    return false
  }

  return true
}
