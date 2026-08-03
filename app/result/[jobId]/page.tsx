'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getClientSupabase } from '@/lib/supabase'
import {
  FileText,
  TrendingUp,
  MailOpen,
  Compass,
  Download,
  Mail,
  Loader2,
  ArrowLeft,
  Copy,
  Check,
  Lock,
} from 'lucide-react'
import toast from 'react-hot-toast'

import Header from '@/components/Header'
import ATSScoreCard from '@/components/ATSScoreCard'
import CVPreview from '@/components/CVPreview'
import JobRecommendationsWidget from '@/components/JobRecommendationsWidget'
import { getTemplateColorPalettes } from '@/lib/templatePalettes'

type TabType = 'ats' | 'cv' | 'cover' | 'gap'

export default function ResultPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params.jobId as string
  const supabase = getClientSupabase()

  const [loading, setLoading] = useState(true)
  const [jobData, setJobData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<TabType>('cv')
  const [originalText, setOriginalText] = useState('')
  const [sendingEmail, setSendingEmail] = useState(false)
  const [copiedText, setCopiedText] = useState<Record<string, boolean>>({})

  // CV Preview Control States (for Left Side Control Panel)
  const [activeCVTab, setActiveCVTab] = useState<'after' | 'before'>('after')
  const [activeViewMode, setActiveViewMode] = useState<'visual' | 'text'>('visual')

  // Payment and preview states
  const [hasPaid, setHasPaid] = useState<boolean>(false)
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false)

  // Template and Color Selection states
  const [selectedTemplate, setSelectedTemplate] = useState<string>('min-14-white-blue-minimalist-corporate-ats')
  const [selectedColor, setSelectedColor] = useState<string>('classic')

  // Gemini Layout Formatting states
  const [displayCVText, setDisplayCVText] = useState('')
  const [formatting, setFormatting] = useState(false)
  const [downloadingPDF, setDownloadingPDF] = useState(false)
  const [rotatingTemplate, setRotatingTemplate] = useState(false)

  // Initialize template from job details on mount
  useEffect(() => {
    if (jobData?.template_used) {
      setSelectedTemplate(jobData.template_used)
    }
  }, [jobData?.template_used])

  useEffect(() => {
    async function loadJobDetails() {
      if (!jobId) return

      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          toast.error('Session expired. Please sign in.')
          router.push('/login')
          return
        }

        // Fetch user payment status
        const { data: profile } = await supabase
          .from('profiles')
          .select('has_paid, cv_credits')
          .eq('id', session.user.id)
          .single()

        if (session.user.email === 'syedsaad.mob@gmail.com' || (profile && (profile.has_paid || profile.cv_credits > 0))) {
          setHasPaid(true)
        }

        // Fetch CV transformation details
        const { data: job, error: jobError } = await supabase
          .from('cv_jobs')
          .select('*')
          .eq('id', jobId)
          .single()

        if (jobError || !job) {
          throw new Error('Transformation job could not be found.')
        }

        setJobData(job)
        if (job?.generated_cv) {
          setDisplayCVText(job.generated_cv)
        }
        if (job?.template_used) {
          setSelectedTemplate(job.template_used)
        }

        if (job?.original_cv) {
          setOriginalText(job.original_cv)
        } else if (job?.raw_text) {
          setOriginalText(job.raw_text)
        } else {
          setOriginalText(job?.generated_cv || 'Original CV content parsed successfully.')
        }
      } catch (err: any) {
        toast.error(err.message || 'Error loading job details.')
        router.push('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    loadJobDetails()
  }, [jobId, supabase, router])

  // Synchronize display text
  useEffect(() => {
    if (jobData?.generated_cv) {
      setDisplayCVText(jobData.generated_cv)
    }
  }, [jobData?.generated_cv])

  const handleDownloadPDF = async (templateToDownload?: string | React.MouseEvent) => {
    const targetTemplate = (typeof templateToDownload === 'string' && templateToDownload) ? templateToDownload : selectedTemplate
    setDownloadingPDF(true)
    try {
      const res = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, templateId: targetTemplate, color: selectedColor })
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => null)
        throw new Error(errorData?.error || 'Failed to generate PDF download')
      }
      
      const blob = await res.blob()
      const blobUrl = URL.createObjectURL(blob)

      const pdfUrlHeader = res.headers.get('X-Pdf-Url')
      if (pdfUrlHeader && !templateToDownload) {
        setJobData((prev: any) => ({
          ...prev,
          pdf_output_path: pdfUrlHeader
        }))
      }

      const a = document.createElement('a')
      a.href = blobUrl
      a.download = `ProCV-${targetTemplate}-${selectedColor || 'default'}-${jobId.substring(0, 8)}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()

      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000)
      toast.success('Successfully downloaded your exact active preview PDF!')
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Error generating PDF.')
    } finally {
      setDownloadingPDF(false)
    }
  }

  const handleRegenerateWithDifferentTemplate = async () => {
    setRotatingTemplate(true)
    try {
      const res = await fetch('/api/rotate-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId,
          preferredStyle: 'modern'
        }),
      })

      const data = await res.json().catch(() => null)
      if (!res.ok) {
        if (res.status === 402 || data?.error?.toLowerCase().includes('insufficient credits')) {
          toast.error(data?.error || 'Insufficient credits for template switch (1 Credit required). Redirecting to refill...')
          router.push('/payment')
          return
        }
        throw new Error(data?.error || 'Failed to rotate template')
      }
      
      setJobData((prev: any) => ({
        ...prev,
        template_used: data.templateId,
      }))
      
      setSelectedTemplate(data.templateId)

      if (typeof window !== 'undefined' && typeof data.remainingCredits === 'number') {
        window.dispatchEvent(new CustomEvent('creditsUpdated', { detail: data.remainingCredits }))
      }

      toast.success(`Switched template layout! 1 Credit used. (${data.remainingCredits ?? ''} Credits remaining)`)
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Error rotating template.')
    } finally {
      setRotatingTemplate(false)
    }
  }

  const triggerEmailResend = async () => {
    setSendingEmail(true)
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          jobId,
          template: selectedTemplate,
          color: selectedColor,
          cvText: displayCVText
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        toast.success('Successfully sent optimized PDF to your email!')
      } else {
        throw new Error(data.error || 'Failed to dispatch email.')
      }
    } catch (err: any) {
      toast.error(err.message || 'Error dispatching email.')
    } finally {
      setSendingEmail(false)
    }
  }

  const handleCopySection = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText((prev) => ({ ...prev, [key]: true }))
      toast.success('Copied to clipboard!')
      setTimeout(() => {
        setCopiedText((prev) => ({ ...prev, [key]: false }))
      }, 2000)
    } catch (err) {
      toast.error('Failed to copy text.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex min-h-[400px] flex-col items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-4 text-sm font-medium text-slate-500">Retrieving optimization data...</p>
        </div>
      </div>
    )
  }

  if (!jobData) return null

  // Format Gap Analysis data
  const gap = jobData.gap_analysis || {}
  const missingKeywords = gap.missingKeywords || []
  const certifications = gap.certifications || []
  const quickWins = gap.quickWins || []

  // Structured ATS data
  const ats = jobData.ats_score || {
    overall: 75,
    keywordMatch: 70,
    formatCompliance: 80,
    achievementDensity: 75,
    readability: 80,
    skillsAlignment: 70,
    issues: [],
  }

  const tabItems = [
    { id: 'cv', label: 'Revamped CV', icon: FileText, desc: 'A4 Visual & Raw Text View' },
    { id: 'ats', label: 'ATS Score Report', icon: TrendingUp, desc: 'Parsing & keyword analysis' },
    { id: 'cover', label: 'Cover Letter', icon: MailOpen, desc: 'Tailored application letter' },
    { id: 'gap', label: 'Gap Analysis', icon: Compass, desc: 'Roadmap & skill recommendations' },
  ]

  const activeColors = getTemplateColorPalettes(selectedTemplate)

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header />

      <main className="mx-auto max-w-[1550px] px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-800 mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Dashboard</span>
        </Link>

        {/* Dashboard Title & Meta Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">Transformation Report</h1>
            <p className="text-xs text-slate-500 mt-1">
              Target Industry: <strong className="text-slate-700">{jobData.target_industry}</strong> | 
              Language: <strong className="text-slate-700">{jobData.output_language}</strong>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
              jobData.status === 'completed'
                ? 'bg-gold-50 text-gold-700'
                : 'bg-amber-50 text-amber-700'
            }`}>
              <span className={`h-2 w-2 rounded-full ${
                jobData.status === 'completed' ? 'bg-gold' : 'bg-amber-500 animate-pulse'
              }`} />
              {jobData.status === 'completed' ? 'Transformation Complete' : 'Processing'}
            </span>
          </div>
        </div>

        {/* MAIN WORKSPACE GRID: 3-Column Parallel Layout (Left Tabs + Center CV Preview + Right CV Display Controls) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* COLUMN 1 (LEFT): Report Navigation Tabs */}
          <div className="lg:col-span-3 xl:col-span-2.5 flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-sm sticky top-6">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-2 block mb-2">
                Report Section Tabs
              </span>
              <nav className="flex flex-col gap-1.5" aria-label="Tabs">
                {tabItems.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className={`flex items-center gap-3 w-full p-3 rounded-xl text-left transition-all cursor-pointer ${
                        isActive
                          ? 'bg-primary text-white shadow-md font-bold'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-semibold'
                      }`}
                    >
                      <div className={`p-2 rounded-lg shrink-0 ${isActive ? 'bg-white/20 text-white' : 'bg-white text-slate-500 border border-slate-200'}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="block text-xs leading-tight">{tab.label}</span>
                        <span className={`block text-[10px] ${isActive ? 'text-white/80' : 'text-slate-400'}`}>{tab.desc}</span>
                      </div>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* COLUMN 2 (CENTER): Main Document Workspace / Single A4 Window */}
          <div className={`${activeTab === 'cv' ? 'lg:col-span-6 xl:col-span-7' : 'lg:col-span-9 xl:col-span-9'} min-h-[500px]`}>
            
            {/* Panel 1: ATS Report */}
            {activeTab === 'ats' && (
              <div className="animate-fade-in">
                <ATSScoreCard scoreData={ats} />
              </div>
            )}

            {/* Panel 2: Revamped CV (Single A4 Window View with Book Page Flip) */}
            {activeTab === 'cv' && (
              <div className="animate-fade-in">
                <CVPreview
                  originalText={originalText}
                  revampedText={jobData.generated_cv || ''}
                  selectedTemplate={selectedTemplate}
                  setSelectedTemplate={setSelectedTemplate}
                  selectedColor={selectedColor}
                  setSelectedColor={setSelectedColor}
                  displayCVText={displayCVText}
                  formatting={formatting}
                  isWatermarked={!hasPaid}
                  activeTabState={activeCVTab}
                  setActiveTabState={setActiveCVTab}
                  viewModeState={activeViewMode}
                  setViewModeState={setActiveViewMode}
                />
              </div>
            )}

            {/* Panel 3: Cover Letter */}
            {activeTab === 'cover' && (
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/60 px-6 py-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">Tailored Professional Cover Letter</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">Optimized against your uploaded requirements</p>
                  </div>
                  <button
                    onClick={() => handleCopySection('coverLetter', jobData.cover_letter || '')}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
                  >
                    {copiedText['coverLetter'] ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>Copy Letter</span>
                  </button>
                </div>
                <div className="p-6 md:p-8">
                  <pre className="text-sm leading-relaxed text-slate-850 whitespace-pre-wrap font-sans text-justify">
                    {jobData.cover_letter || 'Cover letter details not generated.'}
                  </pre>
                </div>
              </div>
            )}

            {/* Panel 4: Gap Analysis */}
            {activeTab === 'gap' && (
              <div className="grid gap-6 md:grid-cols-3 animate-fade-in">
                {/* Missing Keywords */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
                    Missing Target Keywords
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    These keywords were found in the job description but are absent or weak in your original CV.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {missingKeywords.length > 0 ? (
                      missingKeywords.map((kw: string, i: number) => (
                        <span
                          key={i}
                          className="rounded-lg bg-red-50 border border-red-100 px-2.5 py-1.5 text-xs font-semibold text-red-700"
                        >
                          {kw}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">No missing keywords found</span>
                    )}
                  </div>
                </div>

                {/* Certifications Check */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
                    Recommended Certifications
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Earn these professional credentials to boost your hiring chances by up to 30%.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {certifications.length > 0 ? (
                      certifications.map((cert: string, i: number) => (
                        <span
                          key={i}
                          className="rounded-lg bg-amber-50 border border-amber-100 px-2.5 py-1.5 text-xs font-semibold text-amber-800"
                        >
                          {cert}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic font-medium">All key certifications present</span>
                    )}
                  </div>
                </div>

                {/* Quick Wins (48-Hour Roadmap) */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
                    Quick Wins (48-Hour Roadmap)
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    High-impact adjustments you can make to your career presentation immediately.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {quickWins.length > 0 ? (
                      quickWins.map((win: string, i: number) => (
                        <span
                          key={i}
                          className="rounded-lg bg-emerald-50 border border-emerald-100 px-2.5 py-1.5 text-xs font-semibold text-emerald-800"
                        >
                          {win}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">Profile analysis complete</span>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* COLUMN 3 (TOP RIGHT): CV Display Controls & Swatches (Parallel to Top of CV Preview) */}
          {activeTab === 'cv' && (
            <div className="lg:col-span-3 xl:col-span-2.5 flex flex-col gap-4 sticky top-6 self-start">
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4 animate-fade-in">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block border-b border-slate-100 pb-2">
                  CV Display Controls
                </span>

                {/* Primary Segmented Switch: Revamped CV vs Original CV */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Version Toggle:</label>
                  <div className="flex rounded-xl border border-slate-200 bg-slate-100 p-1 shadow-inner">
                    <button
                      onClick={() => setActiveCVTab('after')}
                      className={`flex-1 rounded-lg py-2 text-xs font-extrabold transition-all ${
                        activeCVTab === 'after'
                          ? 'bg-primary text-white shadow-md scale-[1.02]'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                      }`}
                    >
                      Revamped (After)
                    </button>
                    <button
                      onClick={() => setActiveCVTab('before')}
                      className={`flex-1 rounded-lg py-2 text-xs font-extrabold transition-all ${
                        activeCVTab === 'before'
                          ? 'bg-slate-800 text-white shadow-md scale-[1.02]'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                      }`}
                    >
                      Original (Before)
                    </button>
                  </div>
                </div>

                {/* Secondary View Mode Toggle (Visual vs Raw Text) */}
                {activeCVTab === 'after' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Format Mode:</label>
                    <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                      <button
                        onClick={() => setActiveViewMode('visual')}
                        className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          activeViewMode === 'visual'
                            ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <span>Visual Preview 🎨</span>
                      </button>
                      <button
                        onClick={() => setActiveViewMode('text')}
                        className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          activeViewMode === 'text'
                            ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <span>Raw Text 📝</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Active Style Name */}
                {activeCVTab === 'after' && activeViewMode === 'visual' && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 space-y-1">
                    <span className="text-slate-400 font-normal block text-[10px] uppercase tracking-wider">Active Design Style</span>
                    <span className="font-mono text-primary font-black uppercase block truncate">
                      {selectedTemplate.replace(/^sophi-|^m-|^min-/, '').replace(/-/g, ' ')}
                    </span>
                  </div>
                )}

                {/* DYNAMIC COLOR PALETTE SELECTOR */}
                {activeCVTab === 'after' && activeViewMode === 'visual' && activeColors && activeColors.length > 0 && (
                  <div className="space-y-2 pt-1 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-700 block">Color Palette (5 Themes):</span>
                    <div className="flex items-center gap-2 flex-wrap bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      {activeColors.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => setSelectedColor(color.id)}
                          className={`h-6 w-6 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                            selectedColor === color.id
                              ? 'ring-2 ring-primary ring-offset-2 border-transparent scale-110'
                              : 'border-slate-300 hover:scale-105'
                          }`}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        >
                          {selectedColor === color.id && (
                            <span className="h-1.5 w-1.5 rounded-full bg-white shadow-sm" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

        </div>

        {/* Smart Job Recommendations Widget */}
        <div className="mt-8">
          <JobRecommendationsWidget
            userId={jobData.user_id}
            cvKeywords={[
              ...(jobData.gap_analysis?.missingKeywords || []),
              ...(jobData.linkedin_optimizer?.skills || []),
              ...(jobData.target_industry ? [jobData.target_industry] : [])
            ]}
          />
        </div>

        {/* Global sticky bottom download bar */}
        <div className="sticky bottom-6 w-full rounded-2xl border border-slate-250 bg-white p-4.5 shadow-xl shadow-slate-200/40 flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 z-40">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary-50 flex items-center justify-center text-primary shrink-0">
              <Download className="h-4.5 w-4.5" />
            </div>
            <div>
              <span className="block text-sm font-bold text-slate-850">Download Export Packages</span>
              <span className="block text-[11px] text-slate-500">Pick layout rendering style</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={() => handleDownloadPDF('min-14-white-blue-minimalist-corporate-ats')}
              disabled={downloadingPDF}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-60 cursor-pointer"
              title="Download standard plain ATS CV"
            >
              <span>ATS-Safe (Standard)</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={downloadingPDF}
              className="flex items-center justify-center gap-1.5 rounded-lg bg-gold px-4 py-2.5 text-xs font-extrabold text-white shadow-md shadow-gold-100 hover:bg-gold-600 hover:shadow-lg hover:shadow-gold-200 transition-all disabled:opacity-60 cursor-pointer"
              title="Download your active PDF layout"
            >
              {downloadingPDF && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Download PDF</span>
            </button>
            <button
              onClick={handleRegenerateWithDifferentTemplate}
              disabled={rotatingTemplate || downloadingPDF}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-350 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-450 transition-all disabled:opacity-60 cursor-pointer"
              title="Rotate to another design layout"
            >
              {rotatingTemplate && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Try Different Template</span>
            </button>
            <button
              onClick={triggerEmailResend}
              disabled={sendingEmail}
              className="flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-primary-850 hover:shadow-md hover:shadow-primary-100 disabled:bg-primary-300 cursor-pointer"
            >
              {sendingEmail ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Mail className="h-3.5 w-3.5 text-gold" />
              )}
              <span>Email PDF</span>
            </button>
          </div>
        </div>

        {/* Payment Required Modal for 6th Preview */}
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl border border-slate-100">
              <div className="h-16 w-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Lock className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900">Full Version Required</h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  You have reached your <strong>5 free template previews</strong>. Upgrade to the full version now to unlock unlimited template switching and download unwatermarked high-resolution PDFs!
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>Free Previews Used:</span>
                  <span className="text-amber-600">5 / 5 Previews</span>
                </div>
                <div className="flex justify-between font-bold text-slate-800">
                  <span>Full Unwatermarked Access:</span>
                  <span className="text-blue-600 font-extrabold">1,500 PKR</span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => router.push('/payment')}
                  className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <span>Pay & Unlock Full Version</span>
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </button>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Keep active layout preview
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
