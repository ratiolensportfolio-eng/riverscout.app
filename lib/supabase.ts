import { createBrowserClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Browser client (for client components) — uses cookies to stay in
// sync with middleware.
//
// detectSessionInUrl + persistSession are on by default in
// createBrowserClient, but made explicit here because the magic-link
// callback at /auth/callback relies on detectSessionInUrl auto-
// parsing hash tokens (#access_token=…) from implicit-flow links.
// See app/auth/callback/page.tsx.
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    detectSessionInUrl: true,
    persistSession: true,
    autoRefreshToken: true,
    flowType: 'pkce',
  },
})

// Simple server client (for API routes without cookie needs)
export function createSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey)
}
