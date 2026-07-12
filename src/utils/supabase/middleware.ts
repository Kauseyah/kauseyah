import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // This will refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const { data: { user }, error } = await supabase.auth.getUser()

  // Protect admin routes
  if (
    request.nextUrl.pathname.startsWith('/admin') && 
    !request.nextUrl.pathname.startsWith('/admin/login') &&
    !request.nextUrl.pathname.startsWith('/admin/forgot-password') &&
    !request.nextUrl.pathname.startsWith('/admin/reset-password')
  ) {
    if (!user) {
      // no user, redirect to login
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }

    // --- STRICT JWT CHECKING ---
    // Enforce a strict 4-hour session limit from the time the JWT was issued
    if (user.last_sign_in_at) {
      const lastSignIn = new Date(user.last_sign_in_at).getTime()
      const now = Date.now()
      const STRICT_TIMEOUT_MS = 4 * 60 * 60 * 1000 // 4 hours in milliseconds

      if (now - lastSignIn > STRICT_TIMEOUT_MS) {
        // Token is older than strict timeout, forcefully invalidate it
        await supabase.auth.signOut()

        const url = request.nextUrl.clone()
        url.pathname = '/admin/login'
        url.searchParams.set('timeout', 'true') // Let the frontend know the session expired
        const redirectResponse = NextResponse.redirect(url)

        // Ensure we preserve the Set-Cookie headers that wipe the session
        supabaseResponse.headers.forEach((value, key) => {
          if (key.toLowerCase() === 'set-cookie') {
            redirectResponse.headers.append(key, value)
          }
        })
        return redirectResponse
      }
    }
    // ---------------------------

    // Checking if user has admin role from user_roles table
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (roleData?.role !== 'admin') {
      // not an admin, redirect to home or somewhere safe
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  // If user is already logged in as admin and tries to access /admin/login, redirect to /admin
  if (request.nextUrl.pathname === '/admin/login') {
    if (user) {
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single()
        
      if (roleData?.role === 'admin') {
        const url = request.nextUrl.clone()
        url.pathname = '/admin'
        return NextResponse.redirect(url)
      }
    }
  }

  return supabaseResponse
}
