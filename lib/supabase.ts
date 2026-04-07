import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Browser client (for client components)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Simple server client (for API routes without cookie needs)
export function createSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey)
}
