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
  // Apply middleware to protect dashboard, upload, and results pages
  matcher: ['/upload/:path*', '/dashboard/:path*', '/result/:path*'],
}
