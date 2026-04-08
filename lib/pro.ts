// Pro subscription status helpers
// Used by both server and client components

import { createSupabaseClient } from '@/lib/supabase'
import { ADMIN_EMAILS } from '@/lib/admin'

const FREE_ALERT_LIMIT = 3

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

export async function getUserAlertCount(userId: string, email: string): Promise<number> {
  const supabase = createSupabaseClient()
  const { count } = await supabase
    .from('flow_alerts')
    .select('*', { count: 'exact', head: true })
    .eq('email', email)
    .eq('active', true)

  return count ?? 0
}

export async function canAddFlowAlert(userId: string, email: string): Promise<{ allowed: boolean; isPro: boolean; current: number; limit: number }> {
  const isPro = await getUserPro(userId)
  if (isPro) return { allowed: true, isPro, current: 0, limit: Infinity }

  const current = await getUserAlertCount(userId, email)
  return {
    allowed: current < FREE_ALERT_LIMIT,
    isPro,
    current,
    limit: FREE_ALERT_LIMIT,
  }
}

export { FREE_ALERT_LIMIT }
