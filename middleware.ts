import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh the auth session (important for SSR)
  await supabase.auth.getUser()

  // Legacy /rivers/[id] → /rivers/[state]/[slug] redirect
  const path = request.nextUrl.pathname
  const legacyMatch = path.match(/^\/rivers\/([a-z_]+)$/)
  if (legacyMatch) {
    const id = legacyMatch[1]
    // Dynamic import won't work in middleware — use a simple fetch to check
    // Redirect to search with the ID as a hint, which is better than a 404
    const { getRiver, getRiverPath } = await import('@/data/rivers')
    const river = getRiver(id)
    if (river) {
      const newPath = getRiverPath(river)
      return NextResponse.redirect(new URL(newPath, request.url), 301)
    }
  }

  // Protected routes — redirect to login if not authenticated
  const protectedPaths = ['/outfitters/dashboard', '/admin']

  if (protectedPaths.some(p => path.startsWith(p))) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', path)
      return NextResponse.redirect(loginUrl)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    // Run middleware on all routes except static files and API
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
