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
        await initializeWelcomeCredits(session.user.id)

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

        // Fetch user CV optimization jobs
        const { data: cvJobs, error: cvJobsError } = await supabase
          .from('cv_jobs')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })

        if (!cvJobsError && cvJobs) {
          setJobs(cvJobs)
        }

        // Fetch credit statement history
        const { data: txs } = await supabase
          .from('credit_transactions')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(30)

        if (txs) {
          setTransactions(txs)
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

          {/* Credits Summary Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Credits Remaining</span>
              <span className="block text-3xl font-extrabold text-slate-950">{credits}</span>
            </div>
            <Link
              href={credits > 0 ? '/choice' : '/payment'}
              className="flex items-center gap-1 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-primary-800 hover:shadow-md hover:shadow-primary-100"
            >
              <PlusCircle className="h-4 w-4 text-gold" />
              <span>{credits > 0 ? 'Create CV' : 'Buy Slots'}</span>
            </Link>
          </div>
        </div>

        {/* Main Grid: CV History (Left 8 cols) + Referral & Wallet Card (Right 4 cols) */}
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          
          {/* CV Jobs History (Left side) */}
          <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Your CV Revamp History</h2>
              <span className="text-xs text-slate-400 font-semibold">{jobs.length} total requests</span>
            </div>

            {jobs.length === 0 ? (
              /* Empty state placeholder */
              <div className="text-center py-20 px-4 space-y-5">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="max-w-sm mx-auto space-y-2">
                  <h3 className="text-sm font-semibold text-slate-800">No revamp jobs found</h3>
                  <p className="text-xs leading-relaxed text-slate-500">
                    You haven&apos;t optimized any CVs yet. Purchase credits or upload your file to start transforming your career materials.
                  </p>
                </div>
                <div>
                  <Link
                    href={credits > 0 ? '/choice' : '/payment'}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-primary-850 shadow-sm hover:shadow-primary-100"
                  >
                    <span>Create My First CV</span>
                    <PlusCircle className="h-4 w-4 text-gold" />
                  </Link>
                </div>
              </div>
            ) : (
              /* Jobs history table */
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-4 px-6">Created</th>
                      <th className="py-4 px-6">Industry</th>
                      <th className="py-4 px-6">ATS Score</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                    {jobs.map((job) => {
                      const jobDate = new Date(job.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                      const atsScore = job.ats_score?.overall || 'N/A'

                      return (
                        <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4.5 px-6 flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <span>{jobDate}</span>
                          </td>
                          <td className="py-4.5 px-6">{job.target_industry}</td>
                          <td className="py-4.5 px-6 font-bold text-slate-800">
                            {job.status === 'completed' ? (
                              <div className="flex items-center gap-1">
                                <TrendingUp className="h-3.5 w-3.5 text-gold" />
                                <span>{atsScore}/100</span>
                              </div>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="py-4.5 px-6">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              job.status === 'completed'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : job.status === 'processing'
                                ? 'bg-primary-50 text-primary border border-primary-100'
                                : 'bg-red-50 text-red-700 border border-red-100'
                            }`}>
                              {job.status}
                            </span>
                          </td>
                          <td className="py-4.5 px-6 text-right">
                            <Link
                              href={job.status === 'completed' ? `/result/${job.id}` : '#'}
                              className={`inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 ${
                                job.status !== 'completed' ? 'pointer-events-none opacity-50' : ''
                              }`}
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

          {/* LEFT COLUMN: CV Jobs + Credit Statement History Log */}
          <div className="lg:col-span-8 space-y-8">
            {/* CV Jobs History Table */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">Your CV Revamp History</h2>
                <span className="text-xs text-slate-400 font-semibold">{jobs.length} total requests</span>
              </div>

              {jobs.length === 0 ? (
                /* Empty state placeholder */
                <div className="text-center py-16 px-4 space-y-4">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="max-w-sm mx-auto space-y-1">
                    <h3 className="text-sm font-semibold text-slate-800">No revamp jobs found</h3>
                    <p className="text-xs leading-relaxed text-slate-500">
                      You haven&apos;t optimized any CVs yet. Use your credits to create or transform your career materials.
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
                /* Jobs history table */
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        <th className="py-4 px-6">Created</th>
                        <th className="py-4 px-6">Industry</th>
                        <th className="py-4 px-6">ATS Score</th>
                        <th className="py-4 px-6">Status</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                      {jobs.map((job) => {
                        const jobDate = new Date(job.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                        const atsScore = job.ats_score?.overall || 'N/A'

                        return (
                          <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-4 px-6 flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-slate-400" />
                              <span>{jobDate}</span>
                            </td>
                            <td className="py-4 px-6">{job.target_industry}</td>
                            <td className="py-4 px-6 font-bold text-slate-800">
                              {job.status === 'completed' ? (
                                <div className="flex items-center gap-1">
                                  <TrendingUp className="h-3.5 w-3.5 text-gold" />
                                  <span>{atsScore}/100</span>
                                </div>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </td>
                            <td className="py-4 px-6">
                              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                job.status === 'completed'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : job.status === 'processing'
                                  ? 'bg-primary-50 text-primary border border-primary-100'
                                  : 'bg-red-50 text-red-700 border border-red-100'
                              }`}>
                                {job.status}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <Link
                                href={job.status === 'completed' ? `/result/${job.id}` : '#'}
                                className={`inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 ${
                                  job.status !== 'completed' ? 'pointer-events-none opacity-50' : ''
                                }`}
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

            {/* Credit Statement & History Log Table */}
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

          {/* RIGHT COLUMN: Hostinger-Style Multi-Service Referral Component */}
          <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <div>
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60 mb-2">
                Referral Program
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 leading-snug">
                Know what your friend needs? Refer the exact service.
              </h3>
            </div>

            {/* Service Selection Tabs (Hostinger Style) */}
            <div className="flex border-b border-slate-200 text-xs font-bold gap-1 overflow-x-auto pb-1">
              <button
                onClick={() => setActiveReferralTab('cv')}
                className={`px-3 py-2 rounded-lg transition-colors shrink-0 ${
                  activeReferralTab === 'cv'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                CV Creation (30 Cr)
              </button>
              <button
                onClick={() => setActiveReferralTab('linkedin')}
                className={`px-3 py-2 rounded-lg transition-colors shrink-0 ${
                  activeReferralTab === 'linkedin'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                LinkedIn (20 Cr)
              </button>
              <button
                onClick={() => setActiveReferralTab('ats')}
                className={`px-3 py-2 rounded-lg transition-colors shrink-0 ${
                  activeReferralTab === 'ats'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                ATS Scan (10 Cr)
              </button>
              <button
                onClick={() => setActiveReferralTab('tailor')}
                className={`px-3 py-2 rounded-lg transition-colors shrink-0 ${
                  activeReferralTab === 'tailor'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                CV Tailor (5 Cr)
              </button>
            </div>

            {/* Active Tab Service Details Card */}
            {activeReferralTab === 'cv' && (
              <div className="space-y-4 bg-slate-50/80 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <strong className="text-sm text-slate-900 font-extrabold">CV Creation & Revamp (30 Credits)</strong>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ideal for professionals building a new CV or transforming an existing resume into 5 executive ATS designs.
                </p>
                <div className="space-y-1.5 text-[11px] font-bold text-emerald-700">
                  <div>✦ Earn 10 Credits (100 PKR value) per referral</div>
                  <div>✦ Your friend gets 150 Credits on 1500 PKR purchase</div>
                </div>
              </div>
            )}

            {activeReferralTab === 'linkedin' && (
              <div className="space-y-4 bg-slate-50/80 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <Compass className="h-5 w-5 text-primary" />
                  <strong className="text-sm text-slate-900 font-extrabold">LinkedIn Profile Optimizer (20 Credits)</strong>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  In-depth audit, headline hook, bio summary, and skill badge optimization to boost profile views.
                </p>
                <div className="space-y-1.5 text-[11px] font-bold text-emerald-700">
                  <div>✦ Earn 10 Credits (100 PKR value) per referral</div>
                  <div>✦ Your friend gets 150 Credits on 1500 PKR purchase</div>
                </div>
              </div>
            )}

            {activeReferralTab === 'ats' && (
              <div className="space-y-4 bg-slate-50/80 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <strong className="text-sm text-slate-900 font-extrabold">ATS Score Evaluator (10 Credits)</strong>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Scans CV against 5 recruitment dimensions to find missing keywords and formatting flaws.
                </p>
                <div className="space-y-1.5 text-[11px] font-bold text-emerald-700">
                  <div>✦ Earn 10 Credits (100 PKR value) per referral</div>
                  <div>✦ Your friend gets 150 Credits on 1500 PKR purchase</div>
                </div>
              </div>
            )}

            {activeReferralTab === 'tailor' && (
              <div className="space-y-4 bg-slate-50/80 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  <strong className="text-sm text-slate-900 font-extrabold">Job-Specific CV Tailoring (5 Credits)</strong>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Quick AI alignment of an existing portal CV for a specific target job opening.
                </p>
                <div className="space-y-1.5 text-[11px] font-bold text-emerald-700">
                  <div>✦ Earn 10 Credits (100 PKR value) per referral</div>
                  <div>✦ Your friend gets 150 Credits on 1500 PKR purchase</div>
                </div>
              </div>
            )}

            {/* Referral Link & Promo Code */}
            <div className="space-y-2">
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
