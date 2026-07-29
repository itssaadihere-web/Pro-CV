import { getRouteSupabase } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { initializeWelcomeCredits } from '@/lib/creditService'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const error = requestUrl.searchParams.get('error')
    const errorDescription = requestUrl.searchParams.get('error_description')

    if (error) {
      console.error('OAuth Callback Error:', error, errorDescription)
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(errorDescription || error)}`, request.url)
      )
    }

    if (code) {
      const supabase = getRouteSupabase()
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Error exchanging code for session:', exchangeError.message)
        return NextResponse.redirect(
          new URL(`/login?error=${encodeURIComponent(exchangeError.message)}`, request.url)
        )
      }

      if (data?.session?.user?.id) {
        await initializeWelcomeCredits(data.session.user.id, supabase, data.session.user.email)
      }
    }

    // Redirect to dashboard after successful exchange
    return NextResponse.redirect(new URL('/dashboard', request.url))
  } catch (error: any) {
    console.error('Error in auth callback code exchange:', error)
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error.message || 'Authentication failed')}`, request.url)
    )
  }
}
