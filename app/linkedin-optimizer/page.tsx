'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Header from '@/components/Header'
import { motion } from 'framer-motion'
import {
  Compass,
  Link as LinkIcon,
  UploadCloud,
  FileText,
  Loader2,
  CheckCircle2,
  Copy,
  Check,
  Download,
  ArrowLeft,
  Sparkles,
  Zap,
  RotateCcw,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { getClientSupabase } from '@/lib/supabase'

function sanitizeReportText(text: string): string {
  if (!text) return ''
  return text
    .replace(/^[#]+\s*/gm, '') // Strip leading #, ##, ###
    .replace(/\*\*(.*?)\*\*/g, '$1') // Strip bold **
    .replace(/\*(.*?)\*/g, '$1') // Strip italic *
    .replace(/`/g, '')
    .trim()
}

function LinkedInOptimizerContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const reportId = searchParams.get('id')
  const supabase = getClientSupabase()

  // Profile Input States
  const [profileInputMode, setProfileInputMode] = useState<'url' | 'upload' | 'text'>('url')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [profileText, setProfileText] = useState('')
  const [profileFileName, setProfileFileName] = useState('')
  const [parsingProfile, setParsingProfile] = useState(false)

  // Target Job Input States
  const [jobInputMode, setJobInputMode] = useState<'url' | 'text'>('text')
  const [jobUrl, setJobUrl] = useState('')
  const [jobText, setJobText] = useState('')

  // Optimization & Result States
  const [optimizing, setOptimizing] = useState(false)
  const [loadingSavedReport, setLoadingSavedReport] = useState(false)
  const [contrastReport, setContrastReport] = useState('')
  const [headline, setHeadline] = useState('')
  const [summary, setSummary] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // Load saved historical report if reportId is present, or check credits (20 Cr)
  useEffect(() => {
    const initLinkedInPage = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Please sign in to access LinkedIn Profile Optimizer.')
        router.push('/login')
        return
      }

      if (reportId) {
        setLoadingSavedReport(true)
        try {
          const { data, error } = await supabase
            .from('service_activities')
            .select('*')
            .eq('id', reportId)
            .maybeSingle()

          if (data && data.metadata && data.metadata.contrastReport) {
            setContrastReport(sanitizeReportText(data.metadata.contrastReport))
            setHeadline(data.metadata.headline || 'Executive Leader | Strategic Growth Specialist')
            setSummary(data.metadata.summary || 'Results-oriented executive professional with proven track record.')
            setSkills(data.metadata.skills || ['Strategic Planning', 'Leadership', 'Data Analytics', 'Cross-Functional Team Management'])
          }
        } catch (err) {
          console.error('Error loading historical LinkedIn report:', err)
        } finally {
          setLoadingSavedReport(false)
        }
      } else {
        // Pre-mount credit check for new LinkedIn Optimization (20 Credits)
        const { data: profile } = await supabase
          .from('profiles')
          .select('cv_credits')
          .eq('id', session.user.id)
          .maybeSingle()

        const userCredits = profile?.cv_credits ?? 0
        if (userCredits < 20) {
          toast.error(`Insufficient credits! LinkedIn Profile Optimizer requires 20 Credits, but you currently have ${userCredits} Credits. Redirecting to payment...`)
          router.push('/payment')
        }
      }
    }
    initLinkedInPage()
  }, [reportId, supabase, router])

  // 1. Handle Profile PDF Upload
  const handleProfilePdfUpload = async (file: File) => {
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds 10MB limit.')
      return
    }

    setParsingProfile(true)
    setProfileFileName(file.name)

    try {
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        const txt = await file.text()
        setProfileText(txt.trim())
        toast.success(`Loaded text from ${file.name}`)
      } else {
        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch('/api/parse-cv', {
          method: 'POST',
          body: formData,
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to parse profile file')

        setProfileText(data.text || '')
        toast.success(`Extracted profile data from ${file.name}`)
      }
    } catch (err: any) {
      toast.error(err.message || 'Error extracting profile file')
      setProfileFileName('')
    } finally {
      setParsingProfile(false)
    }
  }

  // 2. Submit Optimization (20 Credits)
  const handleOptimize = async () => {
    // Validate inputs
    if (profileInputMode === 'url' && !linkedinUrl.trim()) {
      toast.error('Please enter a valid LinkedIn Profile URL.')
      return
    }
    if (profileInputMode === 'text' && !profileText.trim()) {
      toast.error('Please paste your LinkedIn profile text.')
      return
    }
    if (profileInputMode === 'upload' && !profileText.trim()) {
      toast.error('Please upload your LinkedIn profile PDF export.')
      return
    }

    // Check session
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      toast.error('Please sign in to use LinkedIn Profile Optimizer (20 Credits).')
      router.push('/login')
      return
    }

    setOptimizing(true)

    try {
      const res = await fetch('/api/linkedin/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: profileInputMode === 'url' ? linkedinUrl : undefined,
          profileText: profileInputMode !== 'url' ? profileText : undefined,
          jobUrl: jobInputMode === 'url' ? jobUrl : undefined,
          jobText: jobInputMode === 'text' ? jobText : undefined,
          idealProfile: {
            headline: 'Executive Professional | Strategic Growth Specialist',
            about: 'Results-oriented leader driving organizational growth and performance excellence.',
            skills: ['Strategic Planning', 'Leadership', 'Data Analytics', 'Cross-Functional Team Management'],
          },
          userId: session.user.id,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to optimize LinkedIn profile')
      }

      setContrastReport(sanitizeReportText(data.contrastReport || ''))
      setHeadline(data.headline || 'Executive Leader | Strategic Growth Specialist')
      setSummary(data.summary || 'Results-oriented executive professional with proven track record.')
      setSkills(data.skills || ['Strategic Planning', 'Leadership', 'Data Analytics', 'Cross-Functional Team Management'])

      if (typeof window !== 'undefined' && typeof data.remainingCredits === 'number') {
        window.dispatchEvent(new CustomEvent('creditsUpdated', { detail: data.remainingCredits }))
      }

      if (data.activityId) {
        window.history.pushState({}, '', `/linkedin-optimizer?id=${data.activityId}`)
      }

      toast.success(`20 Credits used. LinkedIn Profile Optimization complete! (${data.remainingCredits ?? ''} Credits remaining)`)
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Error optimizing LinkedIn profile.')
    } finally {
      setOptimizing(false)
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

  const exportContrastReport = () => {
    if (!contrastReport) return
    const element = document.createElement('a')
    const file = new Blob([contrastReport], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = 'LinkedIn-Optimization-Report.txt'
    document.body.appendChild(element)
    element.click()
    element.remove()
    toast.success('Exported Contrast Report!')
  }

  const handleReset = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/login')
      return
    }

    const { getUserCredits } = await import('@/lib/creditService')
    const { credits } = await getUserCredits(session.user.id, supabase)

    if (credits >= 20) {
      setContrastReport('')
      setHeadline('')
      setSummary('')
      setSkills([])
      window.history.pushState({}, '', '/linkedin-optimizer')
    } else {
      toast.error(`Insufficient credits for LinkedIn Optimizer (Requires 20 Credits, Available: ${credits} Credits). Redirecting to refill...`)
      router.push('/payment')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-800 mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Dashboard</span>
        </Link>

        {/* Title Banner */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-extrabold text-blue-700 border border-blue-100 shadow-2xs">
            <Compass className="h-4 w-4 text-blue-600" />
            <span>Standalone Service — 20 Credits</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            LinkedIn Profile Optimizer
          </h1>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Audit your profile against target job postings. Generate executive headlines, hook bio summaries, and skill badges.
          </p>
        </div>

        {/* VIEW 1: LOADING STATE */}
        {loadingSavedReport && (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto" />
            <span className="block text-sm font-bold text-slate-700">Loading saved LinkedIn report...</span>
          </div>
        )}

        {/* VIEW 2: OPTIMIZING SPINNER */}
        {optimizing && !loadingSavedReport && (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-blue-100 text-center space-y-6">
            <div className="w-20 h-20 mx-auto border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin flex items-center justify-center">
              <Compass className="h-8 w-8 text-blue-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">Auditing LinkedIn Profile against Target Job</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Comparing search keywords, bio structure, skill badges, and recruiter search visibility...
              </p>
            </div>
          </div>
        )}

        {/* VIEW 3: INPUT FORM (Shown when no report loaded and not optimizing) */}
        {!contrastReport && !optimizing && !loadingSavedReport && (
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-8 mb-10">
            
            {/* Section 1: User Profile Source */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-800">
                  1. Your LinkedIn Profile Source
                </h2>
                <span className="text-xs text-slate-400">URL, PDF Export or Text</span>
              </div>

              <div className="flex border-b border-slate-200">
                <button
                  type="button"
                  onClick={() => setProfileInputMode('url')}
                  className={`flex items-center gap-2 border-b-2 py-2.5 px-4 text-xs font-bold transition-all ${
                    profileInputMode === 'url'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <LinkIcon className="h-3.5 w-3.5" />
                  <span>LinkedIn URL</span>
                </button>
                <button
                  type="button"
                  onClick={() => setProfileInputMode('upload')}
                  className={`flex items-center gap-2 border-b-2 py-2.5 px-4 text-xs font-bold transition-all ${
                    profileInputMode === 'upload'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <UploadCloud className="h-3.5 w-3.5" />
                  <span>Upload PDF Export</span>
                </button>
                <button
                  type="button"
                  onClick={() => setProfileInputMode('text')}
                  className={`flex items-center gap-2 border-b-2 py-2.5 px-4 text-xs font-bold transition-all ${
                    profileInputMode === 'text'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Paste Profile Text</span>
                </button>
              </div>

              {profileInputMode === 'url' && (
                <div className="space-y-2">
                  <input
                    type="url"
                    placeholder="https://www.linkedin.com/in/yourprofile"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-sm focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                  <span className="text-[11px] text-slate-400">Enter full public profile URL.</span>
                </div>
              )}

              {profileInputMode === 'upload' && (
                <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center hover:border-blue-600">
                  <input
                    type="file"
                    accept=".pdf,.txt"
                    onChange={(e) => e.target.files?.[0] && handleProfilePdfUpload(e.target.files[0])}
                    className="absolute inset-0 cursor-pointer opacity-0"
                    disabled={parsingProfile}
                  />
                  {parsingProfile ? (
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                      <span>Extracting profile text...</span>
                    </div>
                  ) : profileFileName ? (
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      <span>{profileFileName} ({profileText.length} chars extracted)</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-1">
                      <UploadCloud className="h-6 w-6 text-blue-600" />
                      <span className="text-xs font-bold text-slate-800">Upload LinkedIn &apos;Save to PDF&apos; Export</span>
                      <span className="text-[10px] text-slate-400">PDF or TXT up to 10MB</span>
                    </div>
                  )}
                </div>
              )}

              {profileInputMode === 'text' && (
                <textarea
                  rows={5}
                  placeholder="Paste current headline, about summary, and work history..."
                  value={profileText}
                  onChange={(e) => setProfileText(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-xs focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono"
                />
              )}
            </div>

            {/* Section 2: Target Job Requirement */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-800">
                  2. Target Job Post (Recommended for Contrast Report)
                </h2>
                <span className="text-xs text-slate-400">Job URL or Description</span>
              </div>

              <div className="flex border-b border-slate-200">
                <button
                  type="button"
                  onClick={() => setJobInputMode('text')}
                  className={`flex items-center gap-2 border-b-2 py-2.5 px-4 text-xs font-bold transition-all ${
                    jobInputMode === 'text'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Paste Job Description</span>
                </button>
                <button
                  type="button"
                  onClick={() => setJobInputMode('url')}
                  className={`flex items-center gap-2 border-b-2 py-2.5 px-4 text-xs font-bold transition-all ${
                    jobInputMode === 'url'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <LinkIcon className="h-3.5 w-3.5" />
                  <span>Job Post URL</span>
                </button>
              </div>

              {jobInputMode === 'url' ? (
                <input
                  type="url"
                  placeholder="https://www.linkedin.com/jobs/view/123456789"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-sm focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              ) : (
                <textarea
                  rows={4}
                  placeholder="Paste key requirements, job title, and required skills for target position..."
                  value={jobText}
                  onChange={(e) => setJobText(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-xs focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono"
                />
              )}
            </div>

            {/* Action Submit Button */}
            <button
              type="button"
              onClick={handleOptimize}
              className="w-full rounded-xl bg-blue-600 py-3.5 px-6 text-sm font-extrabold text-white hover:bg-blue-700 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Compass className="h-4 w-4 text-white" />
              <span>Optimize LinkedIn Profile (20 Cr)</span>
            </button>
          </div>
        )}

        {/* VIEW 4: REPORT & RESULTS VIEW (Shown when contrastReport is populated) */}
        {contrastReport && !optimizing && !loadingSavedReport && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Top Success Banner */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-emerald-50 border border-emerald-200 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold shrink-0 shadow-xs">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-emerald-950">LinkedIn Profile Optimization Complete</h3>
                  <p className="text-xs text-emerald-700">Copy-paste the recommendations below directly into your LinkedIn profile.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-white px-4 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors shadow-2xs cursor-pointer shrink-0"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Optimize Another Profile</span>
              </button>
            </div>

            {/* Optimized Headline Card */}
            {headline && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                    Recommended High-Ranking LinkedIn Headline
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleCopy('headline', headline)}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    {copiedKey === 'headline' ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Headline</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-900 leading-relaxed font-sans">
                  {headline}
                </div>
              </div>
            )}

            {/* Optimized Bio / Summary Card */}
            {summary && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                    Rewritten Executive About / Bio Summary
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleCopy('summary', summary)}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    {copiedKey === 'summary' ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Bio Summary</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="text-xs text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                  {summary}
                </pre>
              </div>
            )}

            {/* Recommended Skills Badges */}
            {skills.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                    Top Recommended Skills to Add to Profile
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleCopy('skills', skills.join(', '))}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    {copiedKey === 'skills' ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied All!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy All Skills</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 border border-blue-100 px-3.5 py-1.5 text-xs font-bold text-blue-800 shadow-2xs"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Target Alignment & Contrast Report Card */}
            <div className="rounded-2xl border border-blue-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between border-b border-blue-100 bg-blue-50/50 px-6 py-4">
                <h3 className="text-sm font-bold text-slate-800">Target Alignment & Contrast Analysis Report</h3>
                <button
                  type="button"
                  onClick={exportContrastReport}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700 shadow-xs cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export Report (.txt)</span>
                </button>
              </div>
              <div className="p-6">
                <pre className="text-xs text-slate-750 leading-relaxed whitespace-pre-wrap font-sans">
                  {contrastReport}
                </pre>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}

export default function LinkedInOptimizerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    }>
      <LinkedInOptimizerContent />
    </Suspense>
  )
}
