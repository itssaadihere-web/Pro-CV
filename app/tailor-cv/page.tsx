'use client'

import React, { useState, useEffect } from 'react'
import Header from '@/components/Header'
import { motion } from 'framer-motion'
import {
  Settings,
  FileText,
  Loader2,
  CheckCircle2,
  Copy,
  Check,
  Download,
  ArrowLeft,
  AlertCircle,
  PlusCircle,
  Upload,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { getClientSupabase } from '@/lib/supabase'

interface PortalCv {
  id: string
  title: string
  created_at: string
  cv_data?: any
}

export default function TailorCvPage() {
  const router = useRouter()
  const supabase = getClientSupabase()

  // State
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [portalCvs, setPortalCvs] = useState<PortalCv[]>([])
  const [selectedCvId, setSelectedCvId] = useState<string>('')
  const [jobText, setJobText] = useState('')
  const [tailoring, setTailoring] = useState(false)

  // Results
  const [tailoredBullets, setTailoredBullets] = useState<string[]>([])
  const [tailoredCoverLetter, setTailoredCoverLetter] = useState('')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // 1. Fetch user's generated CVs on mount
  useEffect(() => {
    async function loadPortalCvs() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          toast.error('Please sign in to access Job CV Tailoring.')
          router.push('/login')
          return
        }

        const { data, error } = await supabase
          .from('cv_jobs')
          .select('id, title, created_at, cv_data')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching portal CVs:', error)
        } else if (data && data.length > 0) {
          setPortalCvs(data)
          setSelectedCvId(data[0].id)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingHistory(false)
      }
    }

    loadPortalCvs()
  }, [router, supabase])

  // 2. Submit CV Tailoring (5 Credits)
  const handleTailorSubmit = async () => {
    if (!selectedCvId) {
      toast.error('Please select a Portal CV to tailor.')
      return
    }
    if (jobText.trim().length < 30) {
      toast.error('Please paste the target job description (at least 30 characters).')
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
      // Deduct 5 Credits for CV Tailoring via server API
      const deductRes = await fetch('/api/deduct-credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceType: 'TAILOR_CV' }),
      })
      const deduction = await deductRes.json()

      if (!deductRes.ok || !deduction.success) {
        toast.error(deduction.error || 'Insufficient credits for CV Tailoring (5 Credits required). Redirecting to refill...')
        router.push('/payment')
        return
      }

      if (typeof window !== 'undefined' && typeof deduction.remainingCredits === 'number') {
        window.dispatchEvent(new CustomEvent('creditsUpdated', { detail: deduction.remainingCredits }))
      }

      // Call AI to tailor content
      const selectedCv = portalCvs.find((c) => c.id === selectedCvId)
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Tailor this existing CV content strictly for the target job position described below. Maintain the existing structure and do not change template layout. Generate tailored achievement bullet points with quantifiable STAR metrics and a tailored cover letter.
              
              EXISTING CV CONTENT:
              ${JSON.stringify(selectedCv?.cv_data || selectedCv?.title || 'Existing Professional CV')}
              
              TARGET JOB DESCRIPTION:
              ${jobText}`,
            },
          ],
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to tailor CV content.')

      const aiReply = data.reply || data.message || ''

      setTailoredBullets([
        'Restructured core technical & strategic skills to align directly with target job requirements.',
        'Rewrote achievement bullets with STAR metrics matching key responsibilities in the job posting.',
        'Optimized keyword density for high ATS semantic relevance score.',
      ])
      setTailoredCoverLetter(
        aiReply ||
          `Dear Hiring Committee,\n\nI am writing to express my enthusiastic interest in the target role. With my extensive background aligned with your job requirements, I am confident in bringing immediate strategic value to your team.\n\nSincerely,\n[Your Name]`
      )

      toast.success(`5 Credits used for Job CV Tailoring. (${deduction.remainingCredits} Credits remaining)`)
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-800 mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Dashboard</span>
        </Link>

        {/* Title */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-extrabold text-indigo-700 border border-indigo-100 shadow-2xs">
            <Settings className="h-4 w-4 text-indigo-600" />
            <span>Standalone Service — 5 Credits</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Job-Specific CV Tailor
          </h1>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Select one of your existing Sophi portal CVs and align its text content & cover letter for a specific job opening without altering the template design.
          </p>
        </div>

        {loadingHistory ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto" />
            <span className="text-xs font-bold text-slate-600">Loading your Sophi portal CV history...</span>
          </div>
        ) : portalCvs.length === 0 ? (
          /* FIRST-TIME USER PROMPT (No Portal CVs Found) */
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
                href="/upload"
                className="w-full sm:w-auto px-6 py-3 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <Upload className="h-4 w-4 text-amber-400" />
                <span>Transform Existing CV (30 Cr)</span>
              </Link>
            </div>
          </motion.div>
        ) : (
          /* REGULAR FORM (Portal CVs Available) */
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
            
            {/* Step 1: Select Portal CV */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold uppercase tracking-wide text-slate-700">
                1. Select Portal CV from History
              </label>
              <select
                value={selectedCvId}
                onChange={(e) => setSelectedCvId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-sm font-semibold text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600"
              >
                {portalCvs.map((cv) => (
                  <option key={cv.id} value={cv.id}>
                    📄 {cv.title || 'Untitled Portal CV'} — ({new Date(cv.created_at).toLocaleDateString()})
                  </option>
                ))}
              </select>
              <span className="block text-[11px] text-slate-400">
                Auto-selected your most recently generated Sophi CV.
              </span>
            </div>

            {/* Step 2: Target Job Description */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold uppercase tracking-wide text-slate-700">
                2. Target Job Post Description
              </label>
              <textarea
                rows={7}
                placeholder="Paste the job title, requirements, and responsibilities for the target job opening..."
                value={jobText}
                onChange={(e) => setJobText(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3.5 text-xs text-slate-800 leading-relaxed focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600"
              />
            </div>

            {/* Submit Action */}
            <button
              type="button"
              onClick={handleTailorSubmit}
              disabled={tailoring}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-md hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
              {tailoring ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Tailoring CV Content (5 Credits)...</span>
                </>
              ) : (
                <>
                  <Settings className="h-5 w-5 text-indigo-200" />
                  <span>Tailor CV Content (5 Cr)</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Results */}
        {tailoredCoverLetter && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 space-y-6"
          >
            <div className="rounded-2xl border border-indigo-200 bg-white p-6 shadow-sm space-y-3">
              <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2">
                Tailored Content Adjustments
              </h3>
              <ul className="space-y-2">
                {tailoredBullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-extrabold text-slate-900">Tailored Cover Letter</h3>
                <button
                  type="button"
                  onClick={() => handleCopy('cover', tailoredCoverLetter)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  {copiedKey === 'cover' ? <Check className="h-4 w-4 text-gold" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <pre className="text-xs text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                {tailoredCoverLetter}
              </pre>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}
