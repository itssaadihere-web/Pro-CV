'use client'

import React, { useState, useEffect } from 'react'
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
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { getClientSupabase } from '@/lib/supabase'

export default function LinkedInOptimizerPage() {
  const router = useRouter()
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
  const [contrastReport, setContrastReport] = useState('')
  const [headline, setHeadline] = useState('')
  const [summary, setSummary] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

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

      if (typeof window !== 'undefined' && typeof data.remainingCredits === 'number') {
        window.dispatchEvent(new CustomEvent('creditsUpdated', { detail: data.remainingCredits }))
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

        {/* Title */}
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

        {/* Input Card */}
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

          {/* Section 2: Target Job Requirement (Optional / Recommended) */}
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
                placeholder="https://www.linkedin.com/jobs/view/123456"
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
                className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-xs focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 font-sans"
              />
            )}
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleOptimize}
              disabled={optimizing}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-md hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              {optimizing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Optimizing Profile (20 Credits)...</span>
                </>
              ) : (
                <>
                  <Compass className="h-5 w-5 text-blue-200" />
                  <span>Optimize LinkedIn Profile (20 Cr)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Optimization Output Card */}
        {headline && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Headline Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-800">Optimized Profile Headline</h3>
                <button
                  type="button"
                  onClick={() => handleCopy('headline', headline)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  {copiedKey === 'headline' ? <Check className="h-4 w-4 text-gold" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-sm font-medium text-slate-900 bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono">
                {headline}
              </p>
              <div className="flex justify-between text-[11px] text-slate-400 font-bold">
                <span>MAX 220 CHARACTERS</span>
                <span className={headline.length > 220 ? 'text-red-500' : 'text-gold'}>
                  {headline.length} / 220
                </span>
              </div>
            </div>

            {/* Top Skills Badges */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
                Top Skill Badges for Endorsements
              </h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {skills.map((sk, i) => (
                  <span key={i} className="rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Hook Bio Summary */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-800">About Section Hook Summary</h3>
                <button
                  type="button"
                  onClick={() => handleCopy('summary', summary)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  {copiedKey === 'summary' ? <Check className="h-4 w-4 text-gold" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <pre className="text-xs text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                {summary}
              </pre>
            </div>

            {/* Contrast Report */}
            {contrastReport && (
              <div className="rounded-2xl border border-blue-200 bg-white shadow-sm overflow-hidden">
                <div className="flex items-center justify-between border-b border-blue-100 bg-blue-50/50 px-6 py-4">
                  <h3 className="text-sm font-bold text-slate-800">Target Alignment & Contrast Report</h3>
                  <button
                    type="button"
                    onClick={exportContrastReport}
                    className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 shadow-xs"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Export Report</span>
                  </button>
                </div>
                <div className="p-6">
                  <pre className="text-xs text-slate-750 leading-relaxed whitespace-pre-wrap font-sans">
                    {contrastReport}
                  </pre>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  )
}
