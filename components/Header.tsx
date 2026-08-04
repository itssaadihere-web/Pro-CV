'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { getClientSupabase } from '@/lib/supabase'
import { useEffect, useState, useRef } from 'react'
import {
  FileText, LogOut, PlusCircle, Zap, ChevronDown,
  LayoutDashboard, Sparkles, BarChart3, Scissors,
  Link2, FileSearch, Menu, X, History, CreditCard,
  BookOpen, Info, HelpCircle
} from 'lucide-react'
import toast from 'react-hot-toast'
import Logo from './Logo'

const TOOLS_NAV = [
  { label: 'Transform CV', href: '/transform-cv', icon: Sparkles, desc: 'AI-powered CV revamp', highlight: true },
  { label: 'Create CV', href: '/new-cv', icon: FileText, desc: 'Build from scratch' },
  { label: 'ATS Score Checker', href: '/ats-checker', icon: BarChart3, desc: 'Check ATS compatibility' },
  { label: 'Tailor CV for Job', href: '/tailor-cv', icon: Scissors, desc: 'Job-specific tailoring' },
  { label: 'LinkedIn Optimizer', href: '/linkedin-optimizer', icon: Link2, desc: 'Optimize your profile' },
]

const RESOURCES_NAV = [
  { label: 'How It Works', href: '/how-it-works', icon: HelpCircle, desc: 'See how SOPHI works' },
  { label: 'Pricing', href: '/pricing', icon: CreditCard, desc: 'Plans & credit packages' },
  { label: 'CV Templates', href: '/templates', icon: FileSearch, desc: 'Browse design templates' },
  { label: 'About SOPHI', href: '/about', icon: Info, desc: 'Our mission & story' },
]

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = getClientSupabase()
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState<number | null>(null)
  const [toolsOpen, setToolsOpen] = useState(false)
  const [resourcesOpen, setResourcesOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const toolsRef = useRef<HTMLDivElement>(null)
  const resourcesRef = useRef<HTMLDivElement>(null)

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) setToolsOpen(false)
      if (resourcesRef.current && !resourcesRef.current.contains(e.target as Node)) setResourcesOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  useEffect(() => {
    async function fetchUserCredits(userId: string, email?: string) {
      try {
        const { initializeWelcomeCredits } = await import('@/lib/creditService')
        const activeCredits = await initializeWelcomeCredits(userId, supabase, email)
        setCredits(activeCredits)
      } catch {
        const { data: profile } = await supabase
          .from('profiles')
          .select('cv_credits')
          .eq('id', userId)
          .maybeSingle()
        setCredits(profile?.cv_credits ?? 0)
      }
    }

    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
      if (session?.user) await fetchUserCredits(session.user.id, session.user.email)
    }

    getSession()

    const handleCreditsUpdate = (event: any) => {
      if (typeof event.detail === 'number') {
        setCredits(event.detail)
      } else if (user?.id) {
        fetchUserCredits(user.id, user.email)
      }
    }
    window.addEventListener('creditsUpdated', handleCreditsUpdate)

    let realtimeChannel: any = null
    if (user?.id) {
      realtimeChannel = supabase
        .channel(`public:profiles:id=eq.${user.id}`)
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` },
          (payload: any) => {
            if (payload.new && typeof payload.new.cv_credits === 'number') setCredits(payload.new.cv_credits)
          })
        .subscribe()
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null)
      if (session?.user) await fetchUserCredits(session.user.id, session.user.email)
      else setCredits(null)
    })

    return () => {
      if (realtimeChannel) supabase.removeChannel(realtimeChannel)
      subscription.unsubscribe()
      window.removeEventListener('creditsUpdated', handleCreditsUpdate)
    }
  }, [supabase, pathname, user?.id])

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
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <div className="flex items-center py-1 shrink-0">
          <Link href="/" className="flex items-center hover:scale-105 transition-all bg-white rounded-2xl p-1 shadow-sm border border-slate-200/80">
            <Logo width={52} height={52} showTagline={true} />
          </Link>
        </div>

        {/* Desktop Navigation */}
        {!isAuthPage && (
          <nav className="hidden lg:flex items-center gap-1 text-sm font-bold text-slate-700">

            {/* Browse Jobs (external) */}
            <a
              href="https://career.joinsophi.com/jobs"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-primary transition-all"
            >
              Browse Jobs
            </a>

            {/* AI Tools Dropdown — hover based */}
            <div className="relative group" ref={toolsRef}>
              <button
                className={`px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-primary transition-all group-hover:bg-slate-100 group-hover:text-primary ${toolsOpen ? 'bg-slate-100 text-primary' : ''}`}
              >
                AI Tools
              </button>

              <div className="absolute top-full left-0 mt-1 w-72 rounded-2xl border border-slate-200 bg-white shadow-xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 py-1.5">SOPHI AI Services</p>
                {TOOLS_NAV.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group/item ${
                        isActive(item.href)
                          ? 'bg-primary text-white'
                          : 'hover:bg-slate-50 hover:text-primary'
                      }`}
                    >
                      <div>
                        <span className="block text-xs font-bold leading-tight">
                          {item.label}
                          {item.highlight && <span className="ml-1.5 text-[10px] bg-gold/20 text-amber-700 font-black px-1.5 py-0.5 rounded-full">Popular</span>}
                        </span>
                        <span className={`block text-[11px] ${isActive(item.href) ? 'text-white/70' : 'text-slate-400'}`}>{item.desc}</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Resources Dropdown — hover based */}
            <div className="relative group" ref={resourcesRef}>
              <button
                className={`px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-primary transition-all group-hover:bg-slate-100 group-hover:text-primary ${resourcesOpen ? 'bg-slate-100 text-primary' : ''}`}
              >
                Resources
              </button>

              <div className="absolute top-full left-0 mt-1 w-64 rounded-2xl border border-slate-200 bg-white shadow-xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 py-1.5">Resources & Info</p>
                {RESOURCES_NAV.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                        isActive(item.href)
                          ? 'bg-primary text-white'
                          : 'hover:bg-slate-50 hover:text-primary'
                      }`}
                    >
                      <div>
                        <span className="block text-xs font-bold leading-tight">{item.label}</span>
                        <span className={`block text-[11px] ${isActive(item.href) ? 'text-white/70' : 'text-slate-400'}`}>{item.desc}</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Dashboard (logged in only) */}
            {user && (
              <Link
                href="/dashboard"
                className={`px-3 py-2 rounded-xl transition-all ${
                  isActive('/dashboard') ? 'bg-primary text-white' : 'hover:bg-slate-100 hover:text-primary'
                }`}
              >
                Dashboard
              </Link>
            )}
          </nav>
        )}

        {/* Desktop Right Actions */}
        {!isAuthPage && (
          <div className="hidden lg:flex items-center gap-2.5">
            {user ? (
              <>
                {/* Credits pill */}
                {credits !== null && (
                  <Link
                    href="/credit-history"
                    className="flex items-center gap-1.5 rounded-full bg-primary-50 border border-primary-100 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary-100 transition-colors shadow-sm"
                    title="View Credit History"
                  >
                    <Zap className="h-3.5 w-3.5 text-gold fill-gold" />
                    <span>{credits} Credits</span>
                  </Link>
                )}

                {/* Transform CV CTA */}
                <button
                  type="button"
                  onClick={() => {
                    if (credits !== null && credits >= 30) {
                      router.push('/transform-cv')
                    } else {
                      toast.error(`Insufficient Credits! Transform CV requires 30 Credits, but you have ${credits ?? 0}. Redirecting to payment...`)
                      router.push('/payment')
                    }
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-800 hover:shadow-md transition-all cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 text-gold" />
                  Transform CV
                </button>

                {/* Sign out */}
                <button
                  onClick={handleSignOut}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/login"
                  className="rounded-xl bg-primary px-5 py-2 text-sm font-bold text-white hover:bg-primary-800 hover:shadow-lg transition-all"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        )}

        {/* Mobile Hamburger */}
        {!isAuthPage && (
          <button
            className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        )}
      </div>

      {/* Mobile Dropdown Menu */}
      {!isAuthPage && mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-1 shadow-lg animate-fade-in">
          {/* Credits (mobile) */}
          {user && credits !== null && (
            <Link href="/credit-history" className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-primary-50 border border-primary-100 text-xs font-bold text-primary mb-3">
              <Zap className="h-4 w-4 text-gold fill-gold" />
              {credits} Credits Available
            </Link>
          )}

          <a href="https://career.joinsophi.com/jobs" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50">
            💼 Browse Jobs
          </a>

          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 pt-3 pb-1">AI Tools</p>
          {TOOLS_NAV.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${isActive(item.href) ? 'bg-primary text-white' : 'text-slate-700 hover:bg-slate-50'}`}>
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}

          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 pt-3 pb-1">Resources</p>
          {RESOURCES_NAV.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${isActive(item.href) ? 'bg-primary text-white' : 'text-slate-700 hover:bg-slate-50'}`}>
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}

          {user && (
            <>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 pt-3 pb-1">Account</p>
              <Link href="/dashboard"
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${isActive('/dashboard') ? 'bg-primary text-white' : 'text-slate-700 hover:bg-slate-50'}`}>
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <button onClick={handleSignOut}
                className="flex w-full items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50">
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </>
          )}

          {!user && (
            <div className="pt-3 flex flex-col gap-2">
              <Link href="/login" className="w-full text-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700">Sign In</Link>
              <Link href="/login" className="w-full text-center rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white">Get Started Free</Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
