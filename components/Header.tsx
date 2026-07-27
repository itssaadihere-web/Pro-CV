'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { getClientSupabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { FileText, LogOut, User as UserIcon, CreditCard, PlusCircle, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import { isBetaActive } from '@/lib/beta'
import Logo from './Logo'

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = getClientSupabase()
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState<number | null>(null)

  useEffect(() => {
    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
      
      if (session?.user) {
        try {
          const { initializeWelcomeCredits } = await import('@/lib/creditService')
          const currentCredits = await initializeWelcomeCredits(session.user.id, supabase, session.user.email)
          setCredits(currentCredits)
        } catch {
          const { data: profile } = await supabase
            .from('profiles')
            .select('cv_credits')
            .eq('id', session.user.id)
            .maybeSingle()
          setCredits(profile?.cv_credits ?? 50)
        }
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null)
      if (session?.user) {
        try {
          const { initializeWelcomeCredits } = await import('@/lib/creditService')
          const currentCredits = await initializeWelcomeCredits(session.user.id, supabase, session.user.email)
          setCredits(currentCredits)
        } catch {
          const { data: profile } = await supabase
            .from('profiles')
            .select('cv_credits')
            .eq('id', session.user.id)
            .maybeSingle()
          setCredits(profile?.cv_credits ?? 50)
        }
      } else {
        setCredits(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, pathname])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      toast.success('Logged out successfully')
      router.push('/')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Logout failed')
    }
  }

  const isAuthPage = pathname === '/login'

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-205 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center py-1">
          <Link href="/" className="flex items-center hover:scale-105 transition-all bg-white rounded-2xl p-1 shadow-sm border border-slate-200/80">
            <Logo width={52} height={52} showTagline={true} />
          </Link>
        </div>

        {/* Navigation / Actions */}
        {!isAuthPage && (
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <a
                  href="https://career.joinsophi.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden text-sm font-bold text-slate-650 hover:text-blue-600 transition-colors md:flex items-center gap-1"
                >
                  💼 Browse Jobs
                </a>

                <Link
                  href="/dashboard"
                  className={`hidden text-sm font-bold transition-colors md:block ${
                    pathname === '/dashboard' ? 'text-primary' : 'text-slate-650 hover:text-primary-800'
                  }`}
                >
                  Dashboard
                </Link>

                {credits !== null && (
                  <Link
                    href="/payment"
                    className="flex items-center gap-1.5 rounded-full bg-primary-50 border border-primary-100 px-3 py-1 text-xs font-bold text-primary hover:bg-primary-100 transition-colors shadow-2xs"
                    title="Available Credits - Click to Refill"
                  >
                    <Zap className="h-3.5 w-3.5 text-gold fill-gold" />
                    <span>{credits} Credits</span>
                  </Link>
                )}

                <Link
                  href={isBetaActive() || (credits && credits > 0) ? '/upload' : '/payment'}
                  className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white transition-all hover:bg-primary-800 hover:shadow-md hover:shadow-primary-100"
                >
                  <PlusCircle className="h-4 w-4 text-gold" />
                  <span className="hidden sm:inline">Transform CV</span>
                </Link>

                <button
                  onClick={handleSignOut}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-primary-800 hover:shadow-lg hover:shadow-primary-100"
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
