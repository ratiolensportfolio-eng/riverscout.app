import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client (for use in Server Components and API routes)
// Import createServerClient from @supabase/ssr when adding auth cookie handling
export function createSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey)
}
