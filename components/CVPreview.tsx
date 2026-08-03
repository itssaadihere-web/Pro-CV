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
  activeTabState?: 'after' | 'before'
  setActiveTabState?: (tab: 'after' | 'before') => void
  viewModeState?: 'visual' | 'text'
  setViewModeState?: (mode: 'visual' | 'text') => void
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
  isWatermarked = true,
  activeTabState,
  setActiveTabState,
  viewModeState,
  setViewModeState
}: CVPreviewProps) {
  const [internalActiveTab, setInternalActiveTab] = useState<'after' | 'before'>('after')
  const [internalViewMode, setInternalViewMode] = useState<'visual' | 'text'>('visual')
  const [copied, setCopied] = useState(false)

  // Shared Page Switcher State (Interconnected Top & Bottom Controls)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Automatically reset to Page 1 when changing templates (Do NOT reset when changing color palettes)
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedTemplate])

  const activeTab = activeTabState || internalActiveTab
  const setActiveTab = setActiveTabState || setInternalActiveTab
  const viewMode = viewModeState || internalViewMode
  const setViewMode = setViewModeState || setInternalViewMode

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
      {/* SINGLE VIEW PREVIEW CONTAINER */}
      <div className="w-full flex flex-col rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-md">
        
        {/* Container Header Banner (Includes Interconnected Top Page Switcher Controls) */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-slate-50/90 px-5 py-3 gap-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
              {activeTab === 'after'
                ? (viewMode === 'visual' ? `Visual Preview: ${selectedTemplate.replace(/^sophi-|^m-|^min-/, '').replace(/-/g, ' ')} Layout` : 'Optimized CV (Raw Text View)')
                : 'Original Parsed CV Text (Before Optimization)'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* TOP INTERCONNECTED PAGE SWITCHER */}
            {activeTab === 'after' && viewMode === 'visual' && (
              <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-xl border border-slate-200 shadow-sm">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage <= 1}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 text-[11px] font-bold text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 transition-all cursor-pointer"
                  title="Previous Page"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Prev</span>
                </button>

                <div className="text-[11px] font-black text-slate-800 px-1 font-mono">
                  <span className="text-primary">{currentPage}</span> / <span>{totalPages}</span>
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage >= totalPages}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 text-[11px] font-bold text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 transition-all cursor-pointer"
                  title="Next Page"
                >
                  <span>Next</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>Copy Active Tab</span>
            </button>
          </div>
        </div>

        {/* Canvas Body */}
        {activeTab === 'after' ? (
          viewMode === 'visual' ? (
            <div className="relative w-full">
              {formatting && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] z-40 flex flex-col items-center justify-center gap-2 rounded-2xl animate-fade-in">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  <span className="text-xs font-bold text-slate-600">AI is structuring multi-page layout...</span>
                </div>
              )}
              <VisualCV 
                cvText={displayCVText} 
                template={selectedTemplate} 
                colorTheme={selectedColor} 
                isWatermarked={isWatermarked}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                setTotalPages={setTotalPages}
              />
            </div>
          ) : (
            <div className="overflow-auto max-h-[780px] bg-white">
              <RawCVTextFormatter cvText={revampedText} />
            </div>
          )
        ) : (
          /* Original CV Text View */
          <div className="overflow-auto max-h-[780px] bg-slate-50/30 p-6 md:p-8">
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
  isWatermarked = true,
  currentPage,
  setCurrentPage,
  totalPages,
  setTotalPages
}: { 
  cvText: string; 
  template: string; 
  colorTheme: string;
  isWatermarked?: boolean;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  setTotalPages: React.Dispatch<React.SetStateAction<number>>;
}) {
  const cvData = parseKimiCV(cvText)
  const TemplateComponent = getTemplate(template)
  const contentRef = useRef<HTMLDivElement>(null)

  const A4_HEIGHT = 1123 // Standard A4 height at 794px width

  // Measure content height & calculate total discrete A4 pages
  useEffect(() => {
    if (!contentRef.current) return
    const updatePages = () => {
      if (contentRef.current) {
        const height = contentRef.current.scrollHeight
        const calculatedPages = Math.max(1, Math.ceil(height / (A4_HEIGHT - 20)))
        setTotalPages(calculatedPages)
        if (currentPage > calculatedPages) {
          setCurrentPage(calculatedPages)
        }
      }
    }
    updatePages()
    const observer = new ResizeObserver(updatePages)
    observer.observe(contentRef.current)
    return () => observer.disconnect()
  }, [cvText, template, colorTheme, currentPage, setCurrentPage, setTotalPages])

  return (
    <div className="relative flex flex-col items-center w-full bg-slate-100/90 border-0 rounded-b-2xl overflow-hidden">
      
      {/* Viewport Box (Strictly 1 Single A4 Page Window - No Vertical Scrollbar) */}
      <div className="relative w-full p-4 sm:p-6 flex justify-center items-center overflow-hidden">
        {/* Single Page Frame Container (794px x 1123px) */}
        <div className="relative w-full max-w-[794px] h-[1123px] bg-white shadow-2xl rounded-sm border border-slate-200/80 overflow-hidden transition-all">
          
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

          {/* Shifted Document Canvas (Y-translated by exact page height) */}
          <div 
            ref={contentRef} 
            className="w-full transition-transform duration-300 ease-in-out cv-preview-canvas"
            style={{ transform: `translateY(-${(currentPage - 1) * A4_HEIGHT}px)` }}
          >
            <style>{`
              .cv-preview-canvas section, .cv-preview-canvas article, .cv-preview-canvas .section-block, .cv-preview-canvas .cv-job-block, .cv-preview-canvas .cv-item-block {
                margin-top: 38px;
                break-inside: avoid-page !important;
                page-break-inside: avoid !important;
              }
              .cv-preview-canvas section:first-of-type, .cv-preview-canvas article:first-of-type, .cv-preview-canvas .section-block:first-of-type, .cv-preview-canvas .cv-job-block:first-of-type {
                margin-top: 0px !important;
              }
              .cv-preview-canvas h1, .cv-preview-canvas h2, .cv-preview-canvas h3, .cv-preview-canvas h4, .cv-preview-canvas .section-title, .cv-preview-canvas .job-title-header {
                break-after: avoid !important;
                page-break-after: avoid !important;
              }
              .cv-preview-canvas li, .cv-preview-canvas tr {
                break-inside: avoid !important;
                page-break-inside: avoid !important;
              }
            `}</style>
            <TemplateComponent data={cvData} scale={1} colorTheme={colorTheme} />
          </div>
        </div>
      </div>

      {/* Book-Style Interconnected Discrete Page Switcher Footer */}
      <div className="w-full bg-white border-t border-slate-200 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-sm z-20">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Single A4 Page View Window</span>
          <span className="text-slate-300 font-normal">|</span>
          <span className="text-slate-500 font-mono">Showing Page {currentPage} of {totalPages}</span>
        </div>

        {/* Page Switcher Left/Right Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage <= 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-extrabold text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-all shadow-sm cursor-pointer"
            title="Previous Page"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous Page</span>
          </button>

          <div className="flex items-center gap-1 text-xs font-black text-slate-800 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 shadow-inner">
            <span>Page</span>
            <span className="text-primary font-mono text-sm">{currentPage}</span>
            <span>of</span>
            <span className="font-mono text-sm">{totalPages}</span>
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage >= totalPages}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-extrabold text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-all shadow-sm cursor-pointer"
            title="Next Page"
          >
            <span>Next Page</span>
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
