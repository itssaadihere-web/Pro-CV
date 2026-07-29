import { getMiddlewareSupabase } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = getMiddlewareSupabase(req, res)
  
  // Refresh session if expired - required for Server Components & Route Handlers
  const { data: { user } } = await supabase.auth.getUser()

  const protectedRoutes = ['/upload', '/dashboard', '/result']
  const isProtected = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  )

  // Catch any OAuth code landing outside of /auth/callback (e.g. if Supabase falls back to Site URL)
  if (req.nextUrl.searchParams.has('code') && !req.nextUrl.pathname.startsWith('/auth/callback')) {
    const callbackUrl = new URL('/auth/callback', req.url)
    callbackUrl.search = req.nextUrl.search
    return NextResponse.redirect(callbackUrl)
  }

  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Pre-check user credits before allowing upload route access (30 Credits required)
  if (user && req.nextUrl.pathname.startsWith('/upload')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('has_paid, cv_credits, email')
      .eq('id', user.id)
      .single()

    const isExempt = user.email === 'syedsaad.mob@gmail.com' || user.email?.toLowerCase() === 'test@joinsophi.com'
    if (!isExempt && !profile?.has_paid && (profile?.cv_credits ?? 0) < 30) {
      return NextResponse.redirect(new URL('/payment', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
