'use client'

import { useState, useEffect, useRef } from 'react'
import { Copy, Check, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { getTemplate } from '@/components/cv-templates'
import { parseKimiCV } from '@/lib/cvParser'
import { getTemplateColorPalettes } from '@/lib/templatePalettes'
import Logo from './Logo'

interface CVPreviewProps {
  originalText: string
  revampedText: string
  selectedTemplate: string
  setSelectedTemplate: (template: string) => void
  selectedColor: string
  setSelectedColor: (color: string) => void
  displayCVText: string
  formatting: boolean
  isWatermarked?: boolean
}

export default function CVPreview({ 
  originalText, 
  revampedText,
  selectedTemplate,
  setSelectedTemplate,
  selectedColor,
  setSelectedColor,
  displayCVText,
  formatting,
  isWatermarked = true
}: CVPreviewProps) {
  const [activeTab, setActiveTab] = useState<'after' | 'before'>('after')
  const [copied, setCopied] = useState(false)
  const [viewMode, setViewMode] = useState<'visual' | 'text'>('visual')

  const handleCopy = async () => {
    try {
      const textToCopy = activeTab === 'after' ? revampedText : originalText
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      toast.success('CV text copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Failed to copy text.')
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Streamlined Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Primary Segmented Toggle: Original CV vs Revamped CV */}
          <div className="flex rounded-lg border border-slate-200 bg-slate-100 p-1 shadow-inner">
            <button
              onClick={() => setActiveTab('after')}
              className={`rounded-md px-4 py-2 text-xs font-extrabold transition-all ${
                activeTab === 'after'
                  ? 'bg-primary text-white shadow-md scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              Revamped CV (After)
            </button>
            <button
              onClick={() => setActiveTab('before')}
              className={`rounded-md px-4 py-2 text-xs font-extrabold transition-all ${
                activeTab === 'before'
                  ? 'bg-slate-800 text-white shadow-md scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              Original CV (Before)
            </button>
          </div>

          {/* Secondary View Mode Toggle (Visual vs Raw Text) - Enabled when viewing Revamped CV */}
          {activeTab === 'after' && (
            <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1">
              <button
                onClick={() => setViewMode('visual')}
                className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'visual'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Visual Preview 🎨</span>
              </button>
              <button
                onClick={() => setViewMode('text')}
                className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'text'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Raw Text 📝</span>
              </button>
            </div>
          )}

          {/* Active Style Label (Visual Preview Mode Only) */}
          {activeTab === 'after' && viewMode === 'visual' && (
            <div className="hidden lg:flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700">
              <span className="text-slate-500 font-normal">Active Style:</span>
              <strong className="font-mono text-primary uppercase">
                {selectedTemplate.replace(/^sophi-|^m-|^min-/, '').replace(/-/g, ' ')}
              </strong>
            </div>
          )}

          {/* CONDITIONAL COLOR PALETTE SELECTOR — Shown ONLY when viewing Visual Preview of Revamped CV */}
          {activeTab === 'after' && viewMode === 'visual' && (
            (() => {
              const activeColors = getTemplateColorPalettes(selectedTemplate)
              if (!activeColors || activeColors.length === 0) return null
              return (
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm">
                  <span className="text-slate-500 font-normal">Color Palette:</span>
                  <div className="flex items-center gap-1.5">
                    {activeColors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setSelectedColor(color.id)}
                        className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center transition-all ${
                          selectedColor === color.id
                            ? 'ring-2 ring-primary ring-offset-1 border-transparent scale-110'
                            : 'border-slate-300 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.hex, width: '18px', height: '18px' }}
                        title={color.name}
                      >
                        {selectedColor === color.id && (
                          <span className="h-1 w-1 rounded-full bg-white shadow-sm" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })()
          )}

        </div>

        {/* Copy Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>Copy Text</span>
          </button>
        </div>
      </div>

      {/* SINGLE VIEW PREVIEW CONTAINER */}
      <div className="w-full flex flex-col rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-md">
        
        {/* Container Header Banner */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
              {activeTab === 'after'
                ? (viewMode === 'visual' ? `Visual Preview: ${selectedTemplate.replace(/^sophi-|^m-|^min-/, '').replace(/-/g, ' ')} Layout` : 'Optimized CV (Raw Text View)')
                : 'Original Parsed CV Text (Before Optimization)'}
            </span>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-400">
            {activeTab === 'after' ? (viewMode === 'visual' ? 'A4 Document Canvas' : 'Formatted Text') : 'Source Text'}
          </span>
        </div>

        {/* Canvas Body */}
        {activeTab === 'after' ? (
          viewMode === 'visual' ? (
            <div className="relative w-full min-h-[600px]">
              {formatting && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] z-40 flex flex-col items-center justify-center gap-2 rounded-2xl animate-fade-in">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  <span className="text-xs font-bold text-slate-600">AI is structuring multi-page layout...</span>
                </div>
              )}
              <VisualCV cvText={displayCVText} template={selectedTemplate} colorTheme={selectedColor} isWatermarked={isWatermarked} />
            </div>
          ) : (
            <div className="overflow-auto max-h-[750px] bg-white">
              <RawCVTextFormatter cvText={revampedText} />
            </div>
          )
        ) : (
          /* Original CV Text View */
          <div className="overflow-auto max-h-[750px] bg-slate-50/30 p-6 md:p-8">
            <pre className="font-mono text-xs leading-relaxed text-slate-600 whitespace-pre-wrap select-all font-jetbrains">
              {originalText || 'Original CV text could not be loaded.'}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

function VisualCV({ 
  cvText, 
  template, 
  colorTheme,
  isWatermarked = true
}: { 
  cvText: string; 
  template: string; 
  colorTheme: string;
  isWatermarked?: boolean;
}) {
  const cvData = parseKimiCV(cvText)
  const TemplateComponent = getTemplate(template)
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Measure content height & calculate total A4 pages (1 A4 page = 1123px at 794px width)
  useEffect(() => {
    if (!contentRef.current) return
    const updatePages = () => {
      if (contentRef.current) {
        const height = contentRef.current.scrollHeight
        const calculatedPages = Math.max(1, Math.ceil(height / 1100))
        setTotalPages(calculatedPages)
      }
    }
    updatePages()
    const observer = new ResizeObserver(updatePages)
    observer.observe(contentRef.current)
    return () => observer.disconnect()
  }, [cvText, template, colorTheme])

  const scrollToPage = (pageNum: number) => {
    if (!containerRef.current) return
    const targetPage = Math.max(1, Math.min(totalPages, pageNum))
    const targetScroll = (targetPage - 1) * 1123
    containerRef.current.scrollTo({ top: targetScroll, behavior: 'smooth' })
    setCurrentPage(targetPage)
  }

  const handleScroll = () => {
    if (!containerRef.current) return
    const scrollTop = containerRef.current.scrollTop
    const page = Math.min(totalPages, Math.max(1, Math.floor(scrollTop / 1050) + 1))
    setCurrentPage(page)
  }

  return (
    <div className="relative flex flex-col items-center w-full bg-slate-100/70 border-0 rounded-b-2xl overflow-hidden">
      
      {/* Document Viewport Canvas (Centered & Scaled at 100% / 794px width) */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full overflow-y-auto max-h-[780px] p-4 sm:p-8 flex justify-center custom-scrollbar scroll-smooth"
      >
        {/* A4 Paper Card Canvas */}
        <div className="relative w-full max-w-[794px] bg-white shadow-2xl rounded-sm border border-slate-200/80 transition-all">
          
          {/* SOPHI 5% Centered Tilted Watermark Overlay (Visual Preview Only) */}
          {isWatermarked && (
            <div 
              className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center overflow-hidden select-none"
              style={{ opacity: 0.05 }}
            >
              <div className="flex flex-col items-center justify-center gap-3 transform -rotate-45">
                <Logo width={220} height={220} showTagline={false} />
                <span className="text-5xl font-black tracking-widest text-slate-900 uppercase">SOPHI AI CV</span>
              </div>
            </div>
          )}

          {/* Template Content */}
          <div ref={contentRef} className="w-full min-h-[1123px]">
            <TemplateComponent data={cvData} scale={1} colorTheme={colorTheme} />
          </div>
        </div>
      </div>

      {/* Multi-Page Pagination Control Bar */}
      <div className="w-full bg-white border-t border-slate-200 px-5 py-3 flex items-center justify-between shadow-sm z-20">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Multi-Page A4 Canvas</span>
          <span className="text-slate-300 font-normal">|</span>
          <span className="text-slate-500 font-mono">794px × 1123px</span>
        </div>

        {/* Pagination Left / Right Controls & Counter */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => scrollToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors shadow-sm"
            title="Previous Page"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-1 text-xs font-black text-slate-800 bg-slate-100 px-3.5 py-1.5 rounded-lg border border-slate-200 shadow-inner">
            <span>Page</span>
            <span className="text-primary font-mono text-sm">{currentPage}</span>
            <span>of</span>
            <span className="font-mono text-sm">{totalPages}</span>
          </div>

          <button
            onClick={() => scrollToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors shadow-sm"
            title="Next Page"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

function RawCVTextFormatter({ cvText }: { cvText: string }) {
  const cvData = parseKimiCV(cvText)

  return (
    <div className="p-6 md:p-8 space-y-6 text-slate-800 font-sans leading-relaxed text-sm select-all">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-900 uppercase tracking-wide">{cvData.fullName}</h1>
        <p className="text-sm font-semibold text-blue-600 mt-0.5">{cvData.jobTitle}</p>
        <p className="text-xs text-slate-500 mt-1 flex flex-wrap gap-3 font-mono">
          {cvData.email && <span>✉ {cvData.email}</span>}
          {cvData.phone && <span>☎ {cvData.phone}</span>}
          {cvData.location && <span>📍 {cvData.location}</span>}
          {cvData.linkedin && <span>🔗 {cvData.linkedin}</span>}
        </p>
      </div>

      {/* Professional Summary */}
      {cvData.summary && (
        <div className="space-y-1.5">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-blue-600 border-b border-slate-200 pb-1">
            Professional Summary
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed text-justify">{cvData.summary}</p>
        </div>
      )}

      {/* Core Competencies */}
      {cvData.coreCompetencies && cvData.coreCompetencies.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-blue-600 border-b border-slate-200 pb-1">
            Core Competencies
          </h2>
          <div className="flex flex-wrap gap-2">
            {cvData.coreCompetencies.map((comp, i) => (
              <span key={i} className="bg-slate-100 border border-slate-200 text-slate-800 text-xs px-2.5 py-1 rounded-md font-medium">
                ▸ {comp}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {cvData.experience && cvData.experience.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-blue-600 border-b border-slate-200 pb-1">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {cvData.experience.map((exp, i) => (
              <div key={i} className="space-y-1.5 border-l-2 border-blue-100 pl-3">
                <div className="flex justify-between items-baseline flex-wrap gap-1">
                  <h3 className="font-bold text-slate-900 text-sm">{exp.title} — <span className="text-blue-600 font-semibold">{exp.company}</span></h3>
                  <span className="text-xs text-slate-500 font-semibold">{exp.startDate} – {exp.endDate}</span>
                </div>
                <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1">
                  {exp.bullets.map((bullet, idx) => (
                    <li key={idx} className="leading-relaxed">{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Research Publications */}
      {cvData.publications && cvData.publications.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-blue-600 border-b border-slate-200 pb-1">
            Research Publications
          </h2>
          <ul className="space-y-2 text-xs text-slate-700">
            {cvData.publications.map((pub, i) => (
              <li key={i} className="leading-relaxed border-l-2 border-amber-200 pl-3">
                • <strong>{pub.authors}</strong> ({pub.year}). "{pub.title}." <em>{pub.journal}</em>
                {pub.indexing_tier && <span className="text-blue-600 font-semibold"> [{pub.indexing_tier}]</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Conference Presentations */}
      {cvData.conferencePresentations && cvData.conferencePresentations.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-blue-600 border-b border-slate-200 pb-1">
            Conference Presentations
          </h2>
          <ul className="space-y-2 text-xs text-slate-700">
            {cvData.conferencePresentations.map((conf, i) => (
              <li key={i} className="leading-relaxed border-l-2 border-emerald-200 pl-3">
                • <strong>{conf.authors}</strong> ({conf.year}). "{conf.title}." Presented at: <em>{conf.conference}</em>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Research Supervision */}
      {cvData.researchSupervision && cvData.researchSupervision.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-blue-600 border-b border-slate-200 pb-1">
            Research Supervision
          </h2>
          <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1">
            {cvData.researchSupervision.map((sup, i) => (
              <li key={i} className="leading-relaxed">{sup}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Executive Trainings */}
      {cvData.executiveTrainings && cvData.executiveTrainings.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-blue-600 border-b border-slate-200 pb-1">
            Executive Trainings & Workshops
          </h2>
          <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1">
            {cvData.executiveTrainings.map((trn, i) => (
              <li key={i} className="leading-relaxed">{trn}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Key Achievements */}
      {cvData.keyAchievements && cvData.keyAchievements.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-blue-600 border-b border-slate-200 pb-1">
            Key Achievements
          </h2>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {cvData.keyAchievements.map((ach, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-amber-500 font-bold">★</span>
                <span>{ach}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Education */}
      {cvData.education && cvData.education.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-blue-600 border-b border-slate-200 pb-1">
            Education
          </h2>
          <div className="space-y-2 text-xs text-slate-700">
            {cvData.education.map((edu, i) => (
              <div key={i} className="flex justify-between items-baseline flex-wrap gap-1">
                <div>
                  <strong className="text-slate-900 font-bold">{edu.degree}</strong> — {edu.institution}
                  {edu.distinction && <span className="block text-slate-500 italic mt-0.5">{edu.distinction}</span>}
                </div>
                <span className="text-slate-500 font-semibold">{edu.endYear}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {cvData.certifications && cvData.certifications.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-blue-600 border-b border-slate-200 pb-1">
            Certifications
          </h2>
          <div className="space-y-1.5 text-xs text-slate-700">
            {cvData.certifications.map((cert, i) => (
              <div key={i} className="flex justify-between items-baseline flex-wrap gap-1">
                <span>✔ <strong>{cert.name}</strong> — {cert.issuer}</span>
                <span className="text-slate-500 font-semibold">{cert.year}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technical Skills */}
      {Object.keys(cvData.technicalSkills).length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-blue-600 border-b border-slate-200 pb-1">
            Technical Skills
          </h2>
          <div className="space-y-1.5 text-xs text-slate-700">
            {Object.entries(cvData.technicalSkills).map(([cat, skills], i) => (
              <div key={i}>
                <strong className="text-slate-900">{cat}:</strong> {Array.isArray(skills) ? skills.join(', ') : skills}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
