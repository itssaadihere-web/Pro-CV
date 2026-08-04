'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getClientSupabase } from '@/lib/supabase'
import {
  FileText,
  CreditCard,
  PlusCircle,
  TrendingUp,
  Eye,
  Calendar,
  MessageSquare,
  Loader2,
  AlertCircle,
  Settings,
  Gift,
  Copy,
  Compass,
  Zap,
  History,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

import Header from '@/components/Header'

export default function DashboardPage() {
  const router = useRouter()
  const supabase = getClientSupabase()

  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [jobs, setJobs] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          toast.error('Session expired. Please log in.')
          router.push('/login')
          return
        }

        // Initialize welcome credits for new users (+50 Credits)
        const { initializeWelcomeCredits } = await import('@/lib/creditService')
        const activeCredits = await initializeWelcomeCredits(session.user.id, supabase, session.user.email)

        // Fetch User Profile
        const { data: prof, error: profError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        let finalProf = prof
        if (profError) {
          console.warn('Profile not found in profiles table. Attempting to create profile record.')
          const isTestUser = session.user.email?.toLowerCase() === 'test@joinsophi.com'
          const { data: newProf } = await supabase
            .from('profiles')
            .upsert({
              id: session.user.id,
              email: session.user.email,
              full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
              has_paid: isTestUser,
              cv_credits: activeCredits || (isTestUser ? 100 : 50),
            })
            .select('*')
            .single()

          finalProf = newProf
        }

        if (finalProf && (!finalProf.cv_credits || finalProf.cv_credits === 0) && activeCredits > 0) {
          await supabase
            .from('profiles')
            .update({ cv_credits: activeCredits })
            .eq('id', session.user.id)

          finalProf = { ...finalProf, cv_credits: activeCredits }
        }

        setProfile(finalProf)

        if (typeof window !== 'undefined' && finalProf?.cv_credits !== undefined) {
          window.dispatchEvent(new CustomEvent('creditsUpdated', { detail: finalProf.cv_credits }))
        }

        // 1. Fetch user CV optimization jobs
        const { data: cvJobs } = await supabase
          .from('cv_jobs')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })

        if (cvJobs) {
          setJobs(cvJobs)
        }

        // 2. Fetch service_activities table (if created)
        const { data: directActivities } = await supabase
          .from('service_activities')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })

        // Combine cv_jobs and service_activities into a unified activity feed
        const combinedFeed: any[] = []

        if (cvJobs && cvJobs.length > 0) {
          cvJobs.forEach((job: any) => {
            combinedFeed.push({
              id: job.id,
              created_at: job.created_at,
              service_type: 'CREATE_CV',
              service_title: 'CV Transformation & Revamp',
              status: job.status || 'completed',
              target_url: `/result/${job.id}`,
            })
          })
        }

        if (directActivities && directActivities.length > 0) {
          directActivities.forEach((act: any) => {
            // Avoid duplicate entry if job ID matches
            if (!combinedFeed.some((f) => f.id === act.id || (f.target_url && f.target_url.includes(act.metadata?.jobId)))) {
              combinedFeed.push({
                id: act.id,
                created_at: act.created_at,
                service_type: act.service_type,
                service_title: act.service_title,
                status: act.status || 'completed',
                target_url: act.target_url || '/dashboard',
              })
            }
          })
        }

        combinedFeed.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        setActivities(combinedFeed)

        // 3. Fetch credit statement transactions
        const { data: txs } = await supabase
          .from('credit_transactions')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(50)

        if (txs && txs.length > 0) {
          setTransactions(txs)
        } else {
          // Synthetic fallback credit statement if credit_transactions table was created recently
          const syntheticLog: any[] = []
          let runningBalance = finalProf?.cv_credits ?? 0

          if (cvJobs && cvJobs.length > 0) {
            cvJobs.forEach((job: any) => {
              const balanceBefore = runningBalance + 30
              syntheticLog.push({
                id: `synth-job-${job.id}`,
                created_at: job.created_at,
                service_name: 'Create CV from Scratch / Transform CV',
                credits_changed: -30,
                balance_after: runningBalance,
              })
              runningBalance = balanceBefore
            })
          }

          syntheticLog.push({
            id: 'synth-welcome',
            created_at: session.user.created_at || new Date().toISOString(),
            service_name: 'Welcome Signup Bonus',
            credits_changed: 50,
            balance_after: 50,
          })

          syntheticLog.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          setTransactions(syntheticLog)
        }

      } catch (err: any) {
        toast.error(err.message || 'Error loading dashboard.')
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [supabase, router])

  const credits = profile?.cv_credits ?? 0

  const handleServiceLaunch = (serviceCost: number, targetUrl: string, serviceTitle: string) => {
    if (credits >= serviceCost) {
      router.push(targetUrl)
    } else {
      toast.error(`Insufficient Credits! ${serviceTitle} requires ${serviceCost} Credits, but you currently have ${credits} Credits. Redirecting to payment...`)
      router.push('/payment')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex min-h-[400px] flex-col items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-sm font-medium text-slate-500">Loading your profile...</p>
        </div>
      </div>
    )
  }

  const emailUsername = profile?.email ? profile.email.split('@')[0] : 'Professional'
  const displayName = (profile?.full_name && profile.full_name.trim()) ? profile.full_name.trim() : emailUsername

  return (
    <div className="min-h-screen bg-slate-50 pb-20 relative">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Welcome Hero Banner (Unified Luxury Card) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-primary-950 to-slate-900 border border-slate-800 shadow-xl p-6 sm:p-8 text-white mb-8">
          {/* Ambient glowing background accents */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#c5a059]/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-primary-800/20 blur-3xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* User Greeting Info */}
            <div className="flex items-center gap-5">
              {/* Avatar Badge */}
              <div className="flex-shrink-0 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gold via-amber-400 to-amber-600 text-slate-950 font-black text-xl shadow-lg border-2 border-amber-300/30">
                {displayName.charAt(0).toUpperCase()}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    Welcome back, {displayName}! 👋
                  </h1>
                  {Boolean(profile?.has_paid || profile?.account_paid || profile?.paid_at || profile?.payment_ref) ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#c5a059]/15 border border-[#c5a059]/30 px-3 py-0.5 text-[11px] font-extrabold text-[#c5a059] shadow-sm">
                      <Sparkles className="h-3 w-3 text-[#c5a059]" />
                      PRO ACCOUNT
                    </span>
                  ) : (
                    <Link
                      href="/payment"
                      className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/90 border border-slate-700 hover:border-amber-400/50 px-3 py-0.5 text-[11px] font-extrabold text-slate-300 hover:text-amber-300 transition-all shadow-sm group cursor-pointer"
                      title="Click to upgrade to Pro Account"
                    >
                      <Zap className="h-3 w-3 text-slate-400 group-hover:text-amber-300" />
                      <span>FREE ACCOUNT</span>
                      <span className="text-[10px] text-amber-400 bg-amber-400/10 px-1.5 py-0.2 rounded font-black ml-0.5">UPGRADE →</span>
                    </Link>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-300 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 px-3 py-1 rounded-lg">
                    <span className="text-slate-400 font-medium">ID:</span>
                    <code className="font-mono text-amber-300 font-bold">{profile?.id ? `${profile.id.substring(0, 12)}...` : 'N/A'}</code>
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 px-3 py-1 rounded-lg">
                    <span className="text-slate-400 font-medium">Email:</span>
                    <span className="text-white font-semibold">{profile?.email}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Account Balance Widget */}
            <div className="flex items-center gap-5 bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 sm:px-6 shadow-inner shrink-0 justify-between lg:justify-start">
              <div className="space-y-0.5">
                <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Available Balance</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">{credits ?? 0}</span>
                  <span className="text-xs font-bold text-[#c5a059] flex items-center gap-1">
                    <Zap className="h-3.5 w-3.5 fill-[#c5a059]" /> Credits
                  </span>
                </div>
              </div>

              <div className="w-px h-10 bg-slate-800 hidden sm:block" />

              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href="/credit-history"
                  className="flex items-center gap-2 rounded-xl bg-gold px-3.5 py-2.5 text-xs font-black text-slate-950 hover:bg-amber-300 transition-all shadow-md hover:scale-105"
                >
                  <History className="h-4 w-4 text-slate-950" />
                  <span>Credit History</span>
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2.5 text-xs font-bold text-white hover:bg-slate-700 transition-all shadow-md hover:scale-105"
                  title="Account Settings"
                >
                  <Settings className="h-4 w-4 text-[#c5a059]" />
                  <span>Settings</span>
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* Main Grid: Left Column (8 cols) + Right Column (4 cols) */}
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          
          {/* LEFT COLUMN: Services Rate List + CV History */}
          <div className="lg:col-span-8 space-y-8">

            {/* CARD 1: Sophi Services & Credit Rate List (Front & Center Quick Action Grid) */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <span>Sophi AI Services & Direct Launch</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select any service below to launch directly with your available credit balance.
                </p>
              </div>

              {/* Grid of All 5 Primary Services */}
              <div className="grid gap-4 sm:grid-cols-2">
                
                {/* 1. Create CV from Scratch */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 flex flex-col justify-between space-y-4 hover:border-slate-300 hover:bg-white transition-all">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-gold font-bold shadow-2xs shrink-0">
                          <PlusCircle className="h-4 w-4 text-gold" />
                        </div>
                        <span className="text-xs font-extrabold text-slate-900">Create CV from Scratch</span>
                      </div>
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-black text-slate-800 border border-slate-200">
                        30 Credits
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Build a brand new ATS-formatted executive CV step-by-step.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleServiceLaunch(30, '/new-cv', 'Create CV from Scratch')}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2.5 px-3.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-2xs border border-slate-800 cursor-pointer"
                  >
                    <PlusCircle className="h-3.5 w-3.5 text-gold" />
                    <span>Create CV (30 Cr)</span>
                  </button>
                </div>

                {/* 2. Transform Current CV */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 flex flex-col justify-between space-y-4 hover:border-slate-300 hover:bg-white transition-all">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-gold font-bold shadow-2xs shrink-0">
                          <FileText className="h-4 w-4 text-gold" />
                        </div>
                        <span className="text-xs font-extrabold text-slate-900">Transform Current CV</span>
                      </div>
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-black text-slate-800 border border-slate-200">
                        30 Credits
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Upload your PDF/DOCX resume for complete AI redesign.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleServiceLaunch(30, '/transform-cv', 'Transform Current CV')}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2.5 px-3.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-2xs border border-slate-800 cursor-pointer"
                  >
                    <FileText className="h-3.5 w-3.5 text-gold" />
                    <span>Transform CV (30 Cr)</span>
                  </button>
                </div>

                {/* 3. LinkedIn Profile Optimizer */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 flex flex-col justify-between space-y-4 hover:border-slate-300 hover:bg-white transition-all">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-gold font-bold shadow-2xs shrink-0">
                          <Compass className="h-4 w-4 text-gold" />
                        </div>
                        <span className="text-xs font-extrabold text-slate-900">LinkedIn Optimizer</span>
                      </div>
                      <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-black text-blue-700 border border-blue-100">
                        20 Credits
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Never lose another opportunity because your achievements were invisible.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleServiceLaunch(20, '/linkedin-optimizer', 'LinkedIn Profile Optimizer')}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2.5 px-3.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-2xs border border-slate-800 cursor-pointer"
                  >
                    <Compass className="h-3.5 w-3.5 text-gold" />
                    <span>Optimize LinkedIn (20 Cr)</span>
                  </button>
                </div>

                {/* 4. ATS Compatibility Scan */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 flex flex-col justify-between space-y-4 hover:border-slate-300 hover:bg-white transition-all">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-gold font-bold shadow-2xs shrink-0">
                          <TrendingUp className="h-4 w-4 text-gold" />
                        </div>
                        <span className="text-xs font-extrabold text-slate-900">ATS Score Evaluator</span>
                      </div>
                      <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-black text-amber-700 border border-amber-100">
                        10 Credits
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      5-dimension compatibility score, keyword gap & flaw report.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleServiceLaunch(10, '/ats-checker', 'ATS Score Evaluator')}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2.5 px-3.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-2xs border border-slate-800 cursor-pointer"
                  >
                    <TrendingUp className="h-3.5 w-3.5 text-gold" />
                    <span>Scan ATS (10 Cr)</span>
                  </button>
                </div>

                {/* 5. Job-Specific CV Tailoring */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 flex flex-col justify-between space-y-4 hover:border-slate-300 hover:bg-white transition-all sm:col-span-2 md:col-span-1">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-gold font-bold shadow-2xs shrink-0">
                          <Settings className="h-4 w-4 text-gold" />
                        </div>
                        <span className="text-xs font-extrabold text-slate-900">Job-Specific CV Tailor</span>
                      </div>
                      <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-black text-indigo-700 border border-indigo-100">
                        5 Credits
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Align existing portal CV for a specific target job opening.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleServiceLaunch(5, '/tailor-cv', 'Job-Specific CV Tailoring')}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2.5 px-3.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-2xs border border-slate-800 cursor-pointer"
                  >
                    <Settings className="h-3.5 w-3.5 text-gold" />
                    <span>Tailor CV (5 Cr)</span>
                  </button>
                </div>

              </div>
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold text-slate-500">
                <span>✦ Clean PDF Download: <strong className="text-slate-700">2 Credits</strong></span>
                <span>✦ Try Different Template: <strong className="text-slate-700">1 Credit</strong> (Applied on preview page)</span>
              </div>
            </div>

            {/* CARD 2: Service Activity History (Tracks All 5 Sophi Services) */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Service Activity History</h2>
                  <p className="text-[11px] text-slate-500">History log of all availed Sophi AI services</p>
                </div>
                <span className="text-xs text-slate-400 font-semibold">{activities.length} total activities</span>
              </div>

              {activities.length === 0 ? (
                /* Empty state placeholder */
                <div className="text-center py-16 px-4 space-y-4">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="max-w-sm mx-auto space-y-1">
                    <h3 className="text-sm font-semibold text-slate-800">No service activity found</h3>
                    <p className="text-xs leading-relaxed text-slate-500">
                      You haven&apos;t used any Sophi AI services yet. Select a service above to get started.
                    </p>
                  </div>
                  <div>
                    <Link
                      href={credits >= 30 ? '/choice' : '/payment'}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-white transition-all hover:bg-primary-850 shadow-sm"
                    >
                      <span>Create My First CV (30 Cr)</span>
                      <PlusCircle className="h-4 w-4 text-gold" />
                    </Link>
                  </div>
                </div>
              ) : (
                /* Multi-service activity table */
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        <th className="py-4 px-6">Date</th>
                        <th className="py-4 px-6">Service Type</th>
                        <th className="py-4 px-6">Status</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                      {activities.map((act) => {
                        const actDate = new Date(act.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })

                        const isCv = act.service_type === 'CREATE_CV' || act.service_type === 'TRANSFORM_CV'
                        const isLinkedin = act.service_type === 'LINKEDIN_OPTIMIZER'
                        const isAts = act.service_type === 'ATS_EVALUATION'
                        const isTailor = act.service_type === 'TAILOR_CV'

                        return (
                          <tr key={act.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-4 px-6 flex items-center gap-2 text-slate-500">
                              <Calendar className="h-4 w-4 text-slate-400" />
                              <span>{actDate}</span>
                            </td>
                            <td className="py-4 px-6 font-bold">
                              <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold ${
                                isCv
                                  ? 'bg-slate-900 text-white shadow-2xs'
                                  : isLinkedin
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : isAts
                                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                  : isTailor
                                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}>
                                {isCv && '📄 CV Transformation & Revamp'}
                                {isLinkedin && '💼 LinkedIn Profile Optimizer'}
                                {isAts && '🎯 ATS Score Evaluator'}
                                {isTailor && '✂️ Job-Specific CV Tailor'}
                                {!isCv && !isLinkedin && !isAts && !isTailor && (act.service_title || 'Sophi AI Service')}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                act.status === 'completed'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : act.status === 'processing'
                                  ? 'bg-primary-50 text-primary border border-primary-100'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}>
                                {act.status}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <Link
                                href={act.target_url || '/dashboard'}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                <span>View Report</span>
                              </Link>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>


          </div>

          {/* RIGHT COLUMN: Referral Program Box (Clean standalone card) */}
          <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <div>
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60 mb-2">
                Referral Program
              </span>
              <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                Refer Friends & Earn 30 Free Credits
              </h3>
            </div>

            {/* Clear explanation of reward & payment condition */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs text-slate-700">
              <div className="flex items-start gap-2">
                <span className="text-amber-600 font-bold text-sm">🎁</span>
                <p className="leading-relaxed">
                  <strong>What You Earn:</strong> You receive <strong className="text-amber-700 font-extrabold">30 Credits</strong> per referral — enough to transform <strong>1 Full CV</strong> for free!
                </p>
              </div>
              <div className="flex items-start gap-2 pt-2 border-t border-slate-200/80">
                <span className="text-emerald-600 font-bold text-sm">💳</span>
                <p className="leading-relaxed text-slate-600">
                  <strong>How It Works:</strong> Credits are awarded to you <strong className="text-emerald-700 font-semibold">once your friend signs up & makes a payment</strong> on this portal.
                </p>
              </div>
            </div>

            {/* Referral Link & Promo Code */}
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-bold text-slate-700">
                Your Referral Code: <span className="font-mono text-primary font-extrabold">{profile?.referral_code || (profile?.email ? profile.email.split('@')[0].toUpperCase() + '30' : 'SOPH30')}</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={typeof window !== 'undefined' ? `${window.location.origin}/login?ref=${profile?.referral_code || (profile?.email ? profile.email.split('@')[0].toUpperCase() + '30' : 'SOPH30')}` : `https://joinsophi.com/login?ref=${profile?.referral_code || 'SOPH30'}`}
                  className="flex-1 rounded-xl border border-slate-300 bg-slate-50 py-2 px-3 text-xs text-slate-800 font-mono focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    const refCode = profile?.referral_code || (profile?.email ? profile.email.split('@')[0].toUpperCase() + '30' : 'SOPH30')
                    const refLink = `${window.location.origin}/login?ref=${refCode}`
                    navigator.clipboard.writeText(refLink)
                    toast.success('Referral link copied to clipboard!')
                  }}
                  className="px-3.5 py-2 bg-primary hover:bg-primary-850 text-white rounded-xl text-xs font-bold transition-all shadow-sm shrink-0"
                >
                  Copy Link
                </button>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Get Sophi AI Credits to optimize your CV & LinkedIn profile! Sign up using my link: ${typeof window !== 'undefined' ? window.location.origin : 'https://joinsophi.com'}/login?ref=${profile?.referral_code || (profile?.email ? profile.email.split('@')[0].toUpperCase() + '30' : 'SOPH30')}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm text-center"
              >
                <span>WhatsApp Share</span>
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${typeof window !== 'undefined' ? window.location.origin : 'https://joinsophi.com'}/login?ref=${profile?.referral_code || (profile?.email ? profile.email.split('@')[0].toUpperCase() + '30' : 'SOPH30')}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm text-center"
              >
                <span>LinkedIn Share</span>
              </a>
            </div>
          </div>

        </div>
      </main>

      {/* Floating WhatsApp Support Action Button */}
      <a
        href="https://wa.me/923000000000?text=I%20need%20help%20with%20my%20Sophi%20transformation"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gold text-white shadow-lg transition-transform hover:scale-105 hover:bg-gold-600 hover:shadow-gold-200 animate-bounce"
        title="WhatsApp Support"
      >
        <MessageSquare className="h-6 w-6" />
      </a>
    </div>
  )
}
