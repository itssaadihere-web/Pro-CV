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
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

import Header from '@/components/Header'
import { isBetaActive } from '@/lib/beta'

export default function DashboardPage() {
  const router = useRouter()
  const supabase = getClientSupabase()

  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [jobs, setJobs] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [activeReferralTab, setActiveReferralTab] = useState<'cv' | 'linkedin' | 'ats' | 'tailor'>('cv')

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
        await initializeWelcomeCredits(session.user.id, supabase, session.user.email)

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
              cv_credits: isTestUser ? 100 : 50,
            })
            .select('*')
            .single()

          finalProf = newProf
        }

        setProfile(finalProf)

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

  return (
    <div className="min-h-screen bg-slate-50 pb-20 relative">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Welcome Section */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary">
              <Settings className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Welcome back, {profile?.full_name || 'Professional'}!
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Account ID: <span className="font-mono text-slate-700">{profile?.id.substring(0, 8)}...</span> | email: {profile?.email}
              </p>
            </div>
          </div>

          {/* Single Unified Credit Summary Header */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider">Account Balance</span>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-black text-slate-950">{credits}</span>
                <span className="text-xs font-bold text-slate-500">Credits Available</span>
              </div>
            </div>
            <Link
              href="/payment"
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-3 text-xs font-bold text-white transition-all hover:bg-slate-800 shadow-sm border border-slate-800"
            >
              <PlusCircle className="h-4 w-4 text-gold" />
              <span>Buy Credits (1500 PKR)</span>
            </Link>
          </div>
        </div>

        {/* Main Grid: Left Column (8 cols) + Right Column (4 cols) */}
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          
          {/* LEFT COLUMN: Services Rate List + CV History + Credit Statement Log */}
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
                  <Link
                    href="/choice"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2.5 px-3.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-2xs border border-slate-800"
                  >
                    <PlusCircle className="h-3.5 w-3.5 text-gold" />
                    <span>Create CV (30 Cr)</span>
                  </Link>
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
                  <Link
                    href="/upload"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2.5 px-3.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-2xs border border-slate-800"
                  >
                    <FileText className="h-3.5 w-3.5 text-gold" />
                    <span>Transform CV (30 Cr)</span>
                  </Link>
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
                      Headline hook, bio summary, & 10 skill badge suggestions.
                    </p>
                  </div>
                  <Link
                    href="/linkedin-optimizer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2.5 px-3.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-2xs border border-slate-800"
                  >
                    <Compass className="h-3.5 w-3.5 text-gold" />
                    <span>Optimize LinkedIn (20 Cr)</span>
                  </Link>
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
                  <Link
                    href="/ats-checker"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2.5 px-3.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-2xs border border-slate-800"
                  >
                    <TrendingUp className="h-3.5 w-3.5 text-gold" />
                    <span>Scan ATS (10 Cr)</span>
                  </Link>
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
                  <Link
                    href="/tailor-cv"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2.5 px-3.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-2xs border border-slate-800"
                  >
                    <Settings className="h-3.5 w-3.5 text-gold" />
                    <span>Tailor CV (5 Cr)</span>
                  </Link>
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

            {/* CARD 3: Credit Statement & History Log Table */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Credit Statement & History Log</h2>
                  <p className="text-[11px] text-slate-500">Transparent statement of all earned and used credits</p>
                </div>
                <span className="text-xs font-bold text-primary bg-primary-50 px-2.5 py-1 rounded-full border border-primary-100">
                  ⚡ {profile?.cv_credits ?? 0} Credits Remaining
                </span>
              </div>

              {transactions.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 italic">
                  No credit transactions recorded yet. Welcome credits and service usage will appear here.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        <th className="py-3 px-6">Date</th>
                        <th className="py-3 px-6">Service / Action</th>
                        <th className="py-3 px-6">Change</th>
                        <th className="py-3 px-6 text-right">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                      {transactions.map((tx) => {
                        const txDate = new Date(tx.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                        const isPositive = tx.credits_changed > 0

                        return (
                          <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-3 px-6 text-slate-400 font-mono text-[11px]">{txDate}</td>
                            <td className="py-3 px-6 font-bold text-slate-800">{tx.service_name}</td>
                            <td className="py-3 px-6">
                              <span className={`inline-block font-mono font-bold px-2 py-0.5 rounded-md ${
                                isPositive
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}>
                                {isPositive ? `+${tx.credits_changed}` : tx.credits_changed} Cr
                              </span>
                            </td>
                            <td className="py-3 px-6 text-right font-mono font-extrabold text-slate-900">
                              {tx.balance_after} Cr
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
                Know what your friend needs? Refer Sophi & Earn.
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Share your referral link with friends. When they sign up & buy a 1500 PKR credit package, <strong>you earn 10 Credits (100 PKR value)</strong> instantly!
            </p>

            {/* Hostinger Style Service Tabs */}
            <div className="space-y-3">
              <div className="flex border-b border-slate-200 text-xs font-bold gap-1 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => setActiveReferralTab('cv')}
                  className={`px-2.5 py-1.5 rounded-lg transition-colors shrink-0 ${
                    activeReferralTab === 'cv'
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  CV (30 Cr)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveReferralTab('linkedin')}
                  className={`px-2.5 py-1.5 rounded-lg transition-colors shrink-0 ${
                    activeReferralTab === 'linkedin'
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  LinkedIn (20 Cr)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveReferralTab('ats')}
                  className={`px-2.5 py-1.5 rounded-lg transition-colors shrink-0 ${
                    activeReferralTab === 'ats'
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  ATS (10 Cr)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveReferralTab('tailor')}
                  className={`px-2.5 py-1.5 rounded-lg transition-colors shrink-0 ${
                    activeReferralTab === 'tailor'
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Tailor (5 Cr)
                </button>
              </div>

              {/* Active Referral Tab Info */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-800">
                  {activeReferralTab === 'cv' && 'CV Creation & Transformation (30 Credits)'}
                  {activeReferralTab === 'linkedin' && 'LinkedIn Profile Optimizer (20 Credits)'}
                  {activeReferralTab === 'ats' && 'ATS Score Evaluator (10 Credits)'}
                  {activeReferralTab === 'tailor' && 'Job-Specific CV Tailoring (5 Credits)'}
                </div>
                <div className="text-[11px] font-semibold text-emerald-700 space-y-1">
                  <div>✦ You earn: 10 Credits (100 PKR value)</div>
                  <div>✦ Friend gets: 150 Credits on 1500 PKR refill</div>
                </div>
              </div>
            </div>

            {/* Referral Link & Promo Code */}
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-bold text-slate-700">
                Your Referral Link ({profile?.referral_code || (profile?.email ? profile.email.substring(0, 4).toUpperCase() + '100' : 'SOPH100')})
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={typeof window !== 'undefined' ? `${window.location.origin}/login?ref=${profile?.referral_code || (profile?.email ? profile.email.substring(0, 4).toUpperCase() + '100' : 'SOPH100')}` : `https://joinsophi.com/login?ref=${profile?.referral_code || 'SOPH100'}`}
                  className="flex-1 rounded-xl border border-slate-300 bg-slate-50 py-2 px-3 text-xs text-slate-800 font-mono focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    const refLink = `${window.location.origin}/login?ref=${profile?.referral_code || 'SOPH100'}`
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
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Get 150 Sophi AI Credits to optimize your CV & LinkedIn profile! Sign up using my link: ${typeof window !== 'undefined' ? window.location.origin : 'https://joinsophi.com'}/login?ref=${profile?.referral_code || 'SOPH100'}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm text-center"
              >
                <span>WhatsApp Share</span>
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${typeof window !== 'undefined' ? window.location.origin : 'https://joinsophi.com'}/login?ref=${profile?.referral_code || 'SOPH100'}`)}`}
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
