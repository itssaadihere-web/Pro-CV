'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Header from '@/components/Header'
import { motion } from 'framer-motion'
import {
  FileText,
  Loader2,
  CheckCircle2,
  Copy,
  Check,
  ArrowLeft,
  AlertCircle,
  PlusCircle,
  Upload,
  Sparkles,
  Zap,
  Target,
  Briefcase,
  ShieldCheck,
  Award,
  History,
  RotateCcw,
  HelpCircle
} from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { getClientSupabase } from '@/lib/supabase'

interface PortalCv {
  id: string
  target_industry?: string
  created_at: string
  generated_cv?: string
  cover_letter?: string
  target_job_description?: string
  status?: string
}

interface TailorResult {
  atsScore: number
  originalScore?: number
  targetJobTitle?: string
  targetIndustry?: string
  matchedKeywords: string[]
  missingKeywordsResolved: string[]
  tailoredSummary: string
  tailoredBullets: string[]
  tailoredCoverLetter: string
  keyAdjustments: string[]
}

function TailorCvContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activityId = searchParams.get('activityId')
  const supabase = getClientSupabase()

  const [loading, setLoading] = useState(true)
  const [portalCvs, setPortalCvs] = useState<PortalCv[]>([])
  const [selectedCvId, setSelectedCvId] = useState<string>('')
  const [jobText, setJobText] = useState('')
  const [tailoring, setTailoring] = useState(false)

  const [savedActivityDate, setSavedActivityDate] = useState<string | null>(null)
  const [tailorResult, setTailorResult] = useState<TailorResult | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  useEffect(() => {
    async function initPage() {
      setLoading(true)
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          toast.error('Please sign in to access Job CV Tailoring.')
          router.push('/login')
          return
        }

        if (activityId) {
          const { data: activity, error: actErr } = await supabase
            .from('service_activities')
            .select('*')
            .eq('id', activityId)
            .maybeSingle()

          if (!actErr && activity && activity.metadata?.result) {
            setTailorResult(activity.metadata.result)
            setSavedActivityDate(activity.created_at)
            setLoading(false)
            return
          }
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('cv_credits')
          .eq('id', session.user.id)
          .maybeSingle()

        const userCredits = profile?.cv_credits ?? 0

        if (userCredits < 5) {
          toast.error(`Insufficient credits! Job CV Tailoring requires 5 Credits, but you currently have ${userCredits} Credits. Redirecting to payment...`)
          router.push('/payment')
          return
        }

        const { data: jobs, error: jobsErr } = await supabase
          .from('cv_jobs')
          .select('id, target_industry, created_at, generated_cv, cover_letter, target_job_description, status')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })

        if (!jobsErr && jobs && jobs.length > 0) {
          setPortalCvs(jobs)
          setSelectedCvId(jobs[0].id)
        }
      } catch (err) {
        console.error('Initialization error:', err)
      } finally {
        setLoading(false)
      }
    }

    initPage()
  }, [router, supabase, activityId])

  const handleTailorNewJob = () => {
    setTailorResult(null)
    setSavedActivityDate(null)
    router.push('/tailor-cv')
  }

  const handleTailorSubmit = async () => {
    if (!selectedCvId) {
      toast.error('Please select an existing Portal CV to tailor.')
      return
    }
    if (jobText.trim().length < 20) {
      toast.error('Please paste the target job description (at least 20 characters).')
      return
    }

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      toast.error('Please sign in to continue.')
      router.push('/login')
      return
    }

    setTailoring(true)

    try {
      const res = await fetch('/api/tailor-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvJobId: selectedCvId,
          jobDescription: jobText,
          userId: session.user.id,
        }),
      })

      const responseData = await res.json()

      if (!res.ok || !responseData.success) {
        if (res.status === 402) {
          toast.error(responseData.error || 'Insufficient credits for CV Tailoring (5 Credits required). Redirecting to refill...')
          router.push('/payment')
          return
        }
        throw new Error(responseData.error || 'Failed to tailor CV content.')
      }

      if (typeof window !== 'undefined' && typeof responseData.remainingCredits === 'number') {
        window.dispatchEvent(new CustomEvent('creditsUpdated', { detail: responseData.remainingCredits }))
      }

      setTailorResult(responseData.data)
      setSavedActivityDate(null)
      toast.success(`CV Tailored to ${responseData.data.atsScore || 94}% ATS Match Score! (5 Credits used)`)
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Error tailoring CV content.')
    } finally {
      setTailoring(false)
    }
  }

  const handleCopy = async (key: string, textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopiedKey(key)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopiedKey(null), 2000)
    } catch {
      toast.error('Failed to copy text.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto" />
          <p className="text-xs font-bold text-slate-600">Verifying credits & loading service data...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-800 mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Dashboard</span>
      </Link>

      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-extrabold text-indigo-700 border border-indigo-100 shadow-2xs">
          <Sparkles className="h-4 w-4 text-indigo-600" />
          <span>Standalone Service — 5 Credits</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Job-Specific CV Tailor
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Align your existing Sophi CV text & cover letter for a target job opening to achieve a high <strong className="text-indigo-600">90%+ ATS Score</strong>.
        </p>
      </div>

      {tailorResult && savedActivityDate ? (
        <div className="space-y-6">
          <div className="rounded-2xl border border-indigo-200 bg-indigo-50/80 p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shrink-0">
                <History className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-xs font-black text-slate-900">Viewing Saved Activity Report</span>
                <span className="block text-[11px] font-semibold text-slate-500">
                  Completed on {new Date(savedActivityDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleTailorNewJob}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Tailor for Another Job Opening (5 Cr)</span>
            </button>
          </div>

          <TailorResultsDisplay tailorResult={tailorResult} copiedKey={copiedKey} handleCopy={handleCopy} />
        </div>
      ) : tailorResult && !savedActivityDate ? (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleTailorNewJob}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="h-4 w-4 text-gold" />
              <span>Tailor Another Job Opening (5 Cr)</span>
            </button>
          </div>

          <TailorResultsDisplay tailorResult={tailorResult} copiedKey={copiedKey} handleCopy={handleCopy} />
        </div>
      ) : portalCvs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-indigo-100 text-center space-y-6"
        >
          <div className="h-16 w-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="h-8 w-8" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-xl font-black text-slate-900">No Portal CV Found</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              To use <strong className="text-slate-800">Job CV Tailoring (5 Cr)</strong>, you must first have an active CV created or transformed on the Sophi portal.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/choice"
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl text-xs hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <PlusCircle className="h-4 w-4 text-indigo-200" />
              <span>Create CV from Scratch (30 Cr)</span>
            </Link>
            <Link
              href="/transform-cv"
              className="w-full sm:w-auto px-6 py-3 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Upload className="h-4 w-4 text-amber-400" />
              <span>Transform Existing CV (30 Cr)</span>
            </Link>
          </div>
        </motion.div>
      ) : (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-extrabold uppercase tracking-wide text-slate-700 flex items-center justify-between">
              <span>1. Select Existing Portal CV</span>
              <span className="text-indigo-600 text-[11px] normal-case font-bold">Auto-selected latest</span>
            </label>
            <select
              value={selectedCvId}
              onChange={(e) => setSelectedCvId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3.5 text-sm font-semibold text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600"
            >
              {portalCvs.map((cv, idx) => (
                <option key={cv.id} value={cv.id}>
                  📄 {cv.target_industry ? `CV (${cv.target_industry})` : `Transformed CV #${portalCvs.length - idx}`} — ({new Date(cv.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-extrabold uppercase tracking-wide text-slate-700">
              2. Target Job Post Description
            </label>
            <textarea
              rows={7}
              placeholder="Paste the target job title, key requirements, and responsibilities for the job opening..."
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3.5 text-xs text-slate-800 leading-relaxed focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600"
            />
          </div>

          <button
            type="button"
            onClick={handleTailorSubmit}
            disabled={tailoring}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-4 text-sm font-bold text-white shadow-md hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            {tailoring ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>AI Optimizing & Tailoring for 90%+ ATS Score (5 Credits)...</span>
              </>
            ) : (
              <>
                <Zap className="h-5 w-5 text-indigo-200 fill-indigo-200" />
                <span>Tailor CV Content & Achieve 90%+ ATS Score (5 Cr)</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* AEO Section */}
      <section className="mt-16 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <HelpCircle className="h-6 w-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-slate-900">Why Should You Tailor Your CV for Every Job Opening?</h2>
        </div>
        <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 text-slate-800 text-sm leading-relaxed">
          <strong>Direct Answer:</strong> Applicant Tracking Systems (ATS) scan submitted resumes against specific job description keywords. Generic resumes typically score below 50% on ATS screening tests. Tailoring realigns your skills, executive summary, and bullet points to match the exact terms in target postings, boosting your match score to 90%+ and significantly increasing interview call rates.
        </div>
      </section>
    </main>
  )
}

function TailorResultsDisplay({
  tailorResult,
  copiedKey,
  handleCopy,
}: {
  tailorResult: TailorResult
  copiedKey: string | null
  handleCopy: (key: string, text: string) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-lg border border-indigo-900 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-extrabold uppercase tracking-wide">
            <ShieldCheck className="h-4 w-4" />
            <span>ATS Tailoring Complete</span>
          </div>
          <h3 className="text-xl font-black text-white">
            {tailorResult.targetJobTitle || 'Tailored Position'}
          </h3>
          <p className="text-xs text-slate-300">
            Target Industry: <span className="font-bold text-indigo-200">{tailorResult.targetIndustry || 'Professional Services'}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20">
          <Target className="h-8 w-8 text-emerald-400 shrink-0" />
          <div className="text-right">
            <span className="block text-2xl font-black text-white">{tailorResult.atsScore}%</span>
            <span className="block text-[10px] font-bold text-emerald-300 uppercase tracking-wider">ATS Match Score</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Award className="h-4 w-4 text-indigo-600" />
          <span>High-Impact ATS Keywords Integrated</span>
        </h3>
        
        <div className="space-y-3">
          <div>
            <span className="text-[11px] font-bold text-slate-500 block mb-1.5">Matched Keywords:</span>
            <div className="flex flex-wrap gap-2">
              {tailorResult.matchedKeywords?.map((kw, i) => (
                <span key={i} className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-indigo-100">
                  <Check className="h-3 w-3 text-indigo-600" />
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {tailorResult.missingKeywordsResolved?.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-emerald-600 block mb-1.5">Resolved Missing Job Keywords:</span>
              <div className="flex flex-wrap gap-2">
                {tailorResult.missingKeywordsResolved.map((kw, i) => (
                  <span key={i} className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-emerald-100">
                    <PlusCircle className="h-3 w-3 text-emerald-600" />
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <FileText className="h-4 w-4 text-indigo-600" />
            <span>Tailored Professional Summary</span>
          </h3>
          <button
            type="button"
            onClick={() => handleCopy('summary', tailorResult.tailoredSummary)}
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-lg transition-colors"
          >
            {copiedKey === 'summary' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey === 'summary' ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50 p-4 rounded-xl border border-slate-200">
          {tailorResult.tailoredSummary}
        </p>
      </div>

      <div className="rounded-2xl border border-indigo-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-indigo-600" />
            <span>Tailored STAR-Metric Achievement Bullets</span>
          </h3>
          <button
            type="button"
            onClick={() => handleCopy('bullets', tailorResult.tailoredBullets?.join('\n\n'))}
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-lg transition-colors"
          >
            {copiedKey === 'bullets' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey === 'bullets' ? 'Copied All' : 'Copy All'}</span>
          </button>
        </div>
        <ul className="space-y-3">
          {tailorResult.tailoredBullets?.map((b, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs text-slate-800 bg-slate-50 p-3.5 rounded-xl border border-slate-200 leading-relaxed">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <FileText className="h-4 w-4 text-indigo-600" />
            <span>Tailored Cover Letter</span>
          </h3>
          <button
            type="button"
            onClick={() => handleCopy('cover', tailorResult.tailoredCoverLetter)}
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-lg transition-colors"
          >
            {copiedKey === 'cover' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey === 'cover' ? 'Copied' : 'Copy Letter'}</span>
          </button>
        </div>
        <pre className="text-xs text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
          {tailorResult.tailoredCoverLetter}
        </pre>
      </div>
    </motion.div>
  )
}

export default function TailorCvClient() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      <Header />
      <Suspense
        fallback={
          <div className="flex min-h-[400px] flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <p className="mt-4 text-xs font-bold text-slate-600">Loading Job-Specific CV Tailor...</p>
          </div>
        }
      >
        <TailorCvContent />
      </Suspense>
    </div>
  )
}
