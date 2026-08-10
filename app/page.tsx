import React from 'react'
import Link from 'next/link'
import {
  FileText, Target, Sparkles, Award, Zap, ShieldCheck,
  Download, Languages, ArrowRight, ChevronRight, BarChart3,
  FilePlus, CheckCircle2, Check, Upload, ArrowDown, Search,
  Scissors, Link2, Cpu,
} from 'lucide-react'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import Script from 'next/script'
import { websiteSchema, softwareSchema, faqSchema } from '@/lib/schema'
import CareerPortalSearch from '@/components/CareerPortalSearch'
import AnimatedSection from '@/components/AnimatedSection'

import FAQAccordion from '@/components/FAQAccordion'

function S({ children, dark }: { children?: React.ReactNode; dark?: boolean }) {
  return (
    <span className={`font-black tracking-wide ${dark ? 'text-[#c5a059]' : 'text-primary'}`}>
      SOPHI
    </span>
  )
}

const CORE_HIGHLIGHTS = [
  {
    icon: Target,
    badge: 'ATS Audit Engine',
    title: 'ATS Score & Compliance Check',
    description: 'Evaluate your CV compliance across 5 dimensions: keyword density, formatting safety, semantic relevance, experience metrics, and section structure.',
    badgeBg: 'bg-primary-50 text-primary-900 border-primary-200',
    iconBg: 'bg-primary text-white',
    href: '/ats-checker',
  },
  {
    icon: BarChart3,
    badge: 'Gap Intelligence',
    title: 'Career & Skill Gap Analysis',
    description: 'Instantly uncover missing keywords, work experience gaps, and critical qualifications required to outrank rival candidates in recruiter filters.',
    badgeBg: 'bg-amber-50 text-amber-900 border-amber-200',
    iconBg: 'bg-gold text-slate-950',
    href: '/transform-cv',
  },
  {
    icon: Sparkles,
    badge: 'Targeted Matching',
    title: 'Job-Specific CV Tailoring',
    description: 'Paste any job description to automatically adjust your bullet points, skills, and summary to align with specific role requirements.',
    badgeBg: 'bg-primary-50 text-primary-900 border-primary-200',
    iconBg: 'bg-primary-800 text-white',
    href: '/tailor-cv',
  },
  {
    icon: FilePlus,
    badge: 'Wizard Assistant',
    title: 'Build CV from Scratch',
    description: 'No existing resume? Easily generate a fresh, professional, ATS-approved CV from scratch using our step-by-step guided builder.',
    badgeBg: 'bg-amber-50 text-amber-900 border-amber-200',
    iconBg: 'bg-gold text-slate-950',
    href: '/new-cv',
  },
  {
    icon: Zap,
    badge: 'AI Revamp',
    title: 'Transform Existing CV',
    description: 'Upload your current PDF or Word document and let advanced AI restructure and optimize it into an interview-winning CV.',
    badgeBg: 'bg-primary-50 text-primary-900 border-primary-200',
    iconBg: 'bg-primary-950 text-white',
    href: '/transform-cv',
  },
]

const ADDITIONAL_FEATURES = [
  {
    icon: Zap,
    title: 'STAR-Metric Bullets',
    description: 'Converts descriptors into quantifiable accomplishments: Action (Power Verb) + Context + Metric Result.',
    color: 'bg-primary-900/50 text-[#c5a059] border border-primary-800',
  },
  {
    icon: Award,
    title: '2026 Executive Summary',
    description: 'A 3-line structural hook summarizing total years of experience, top value statements, and key proof figures.',
    color: 'bg-primary-900/50 text-[#c5a059] border border-primary-800',
  },
  {
    icon: ShieldCheck,
    title: 'LinkedIn Profile Optimizer',
    description: 'Build custom headers, hook summaries, and keywords so recruiters discover your profile easily.',
    color: 'bg-primary-900/50 text-[#c5a059] border border-primary-800',
  },
  {
    icon: FileText,
    title: 'AI Cover Letter Generator',
    description: 'Fully personalized, achievement-driven introductory letters customized against target job descriptions.',
    color: 'bg-primary-900/50 text-[#c5a059] border border-primary-800',
  },
  {
    icon: Download,
    title: '49 PDF Templates Export',
    description: 'One-click downloads supporting ATS-Safe formatting, Modern spacing, and clean Minimalist layouts.',
    color: 'bg-primary-900/50 text-[#c5a059] border border-primary-800',
  },
  {
    icon: Languages,
    title: 'Multi-Language Support',
    description: 'Optimize CVs in English (EN), Arabic (AR with RTL format), French (FR), or Spanish (ES).',
    color: 'bg-primary-900/50 text-[#c5a059] border border-primary-800',
  },
]

const FLOW_STEPS = [
  {
    num: '01',
    icon: Upload,
    title: 'Upload or Start Fresh',
    desc: 'Upload your existing CV (PDF / DOCX) for an instant AI revamp, or launch our step-by-step wizard to build a brand-new ATS-compliant CV from scratch.',
    color: 'from-primary-900 to-primary-950',
    bg: 'bg-slate-900/90',
    border: 'border-primary-800',
    pill: 'bg-primary-800/80 text-[#c5a059]',
  },
  {
    num: '02',
    icon: Search,
    title: 'ATS Audit & Gap Detection',
    desc: 'Our AI instantly scores your CV across keyword density, formatting safety, semantic match, experience depth, and section structure — revealing every gap in seconds.',
    color: 'from-gold to-amber-600',
    bg: 'bg-slate-900/90',
    border: 'border-amber-500/30',
    pill: 'bg-amber-500/20 text-[#c5a059]',
  },
  {
    num: '03',
    icon: Scissors,
    title: 'Job-Specific Tailoring',
    desc: 'Paste a job description and SOPHI automatically realigns your bullet points, skills, and profile summary to the exact requirements of that role.',
    color: 'from-primary-800 to-primary-900',
    bg: 'bg-slate-900/90',
    border: 'border-primary-800',
    pill: 'bg-primary-800/80 text-[#c5a059]',
  },
  {
    num: '04',
    icon: Cpu,
    title: 'AI Rewrites & Optimizes',
    desc: 'Advanced LLMs rewrite every section using STAR-method bullets, inject ATS keywords, and restructure your document for maximum recruiter visibility.',
    color: 'from-gold to-amber-600',
    bg: 'bg-slate-900/90',
    border: 'border-amber-500/30',
    pill: 'bg-amber-500/20 text-[#c5a059]',
  },
  {
    num: '05',
    icon: Link2,
    title: 'LinkedIn & Cover Letter',
    desc: 'Receive a custom LinkedIn headline, hook summary, and a fully personalized cover letter — all auto-tailored to your target role.',
    color: 'from-primary-800 to-primary-950',
    bg: 'bg-slate-900/90',
    border: 'border-primary-800',
    pill: 'bg-primary-800/80 text-[#c5a059]',
  },
  {
    num: '06',
    icon: Download,
    title: 'Download & Get Hired',
    desc: 'In under 60 seconds, download your ATS-optimized CV in a premium template, plus your cover letter and full ATS score report — ready to apply.',
    color: 'from-gold to-amber-600',
    bg: 'bg-slate-900/90',
    border: 'border-amber-500/30',
    pill: 'bg-amber-500/20 text-[#c5a059]',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 relative">
      <Script id="schema-website" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <Script id="schema-software" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <Script id="schema-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <Header />

      {/* SECTION 1: HERO - LIGHT BACKGROUND OVERALL */}
      <section className="relative overflow-hidden bg-slate-50 py-12 lg:py-20 border-b border-slate-200/80">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.blue.50),white)] opacity-80" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 items-center">

            <div className="lg:col-span-6 space-y-7 text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 text-xs font-black text-primary border border-primary-200">
                <Sparkles className="h-4 w-4 text-gold" />
                <span>NEXT-GEN AI CV PLATFORM v2.5</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl leading-[1.1]">
                  Build & Transform <br />
                  CVs with <S /> AI. <br />
                  <span className="bg-gradient-to-r from-primary via-primary-800 to-gold bg-clip-text text-transparent">
                    ATS-Optimized CVs.
                  </span>
                </h1>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl font-medium">
                  Audit your ATS score, analyze career gaps, tailor your CV for job roles, build a new resume from scratch, or revamp your document — powered by <S />.
                </p>
              </div>

              {/* 4 Primary Action Pills */}
              <div className="grid grid-cols-2 gap-2.5 max-w-md">
                <Link href="/ats-checker" className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-3.5 py-2.5 text-xs font-extrabold text-slate-800 shadow-2xs hover:border-primary hover:text-primary transition-all">
                  <CheckCircle2 className="h-4 w-4 text-gold shrink-0" />
                  <span>ATS Score Audit</span>
                </Link>
                <Link href="/ats-checker" className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-3.5 py-2.5 text-xs font-extrabold text-slate-800 shadow-2xs hover:border-primary hover:text-primary transition-all">
                  <BarChart3 className="h-4 w-4 text-gold shrink-0" />
                  <span>Gap Analysis</span>
                </Link>
                <Link href="/tailor-cv" className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-3.5 py-2.5 text-xs font-extrabold text-slate-800 shadow-2xs hover:border-primary hover:text-primary transition-all">
                  <Target className="h-4 w-4 text-gold shrink-0" />
                  <span>Job Tailoring</span>
                </Link>
                <Link href="/choice" className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-3.5 py-2.5 text-xs font-extrabold text-slate-800 shadow-2xs hover:border-primary hover:text-primary transition-all">
                  <FileText className="h-4 w-4 text-gold shrink-0" />
                  <span>Build from Scratch</span>
                </Link>
              </div>

              {/* Primary Call to Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <Link
                  href="/transform-cv"
                  className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-black text-white hover:bg-primary-800 transition-all shadow-lg hover:scale-105"
                >
                  <Sparkles className="h-4 w-4 text-gold" />
                  <span>Transform CV Now</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                
                <a
                  href="#how-it-works"
                  className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all shadow-2xs"
                >
                  See How It Works
                </a>
              </div>
            </div>

            {/* RIGHT SECTION: Dark-Themed SOPHI Career Portal Search Container */}
            <div className="lg:col-span-6">
              <CareerPortalSearch />
            </div>

          </div>
        </div>
      </section>


      {/* SECTION 2: HOW SOPHI WORKS — DARK BACKGROUND */}
      <section id="how-it-works" className="py-20 bg-slate-950 text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center space-y-3">
            <span className="inline-block text-xs font-black uppercase tracking-widest text-[#c5a059] bg-[#c5a059]/10 border border-[#c5a059]/30 px-3.5 py-1.5 rounded-full">
              Full Process Flowchart
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              How <S dark /> Transforms Your Career
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              From first upload to final download — every step your CV goes through inside <S dark />.
            </p>
          </div>

          {/* Flowchart */}
          <div className="flex flex-col items-center gap-0">
            {FLOW_STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={i} className="flex flex-col items-center w-full max-w-2xl">
                  <AnimatedSection delay={i * 0.05} className="w-full">
                    <div className={`w-full rounded-2xl border ${step.border} ${step.bg} p-5 sm:p-6 flex items-center gap-5`}>
                      {/* Step number + icon */}
                      <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${step.pill}`}>
                            Step {step.num}
                          </span>
                        </div>
                        <h3 className="text-base font-black text-white leading-tight">{step.title}</h3>
                        <p className="text-xs text-slate-300 leading-relaxed mt-1">{step.desc}</p>
                      </div>
                    </div>
                  </AnimatedSection>

                  {/* Connector */}
                  {i < FLOW_STEPS.length - 1 && (
                    <div className="flex flex-col items-center py-2">
                      <div className="w-px h-5 bg-slate-700" />
                      <ArrowDown className="w-4 h-4 text-slate-500" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="text-center pt-2">
            <Link href="/how-it-works"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-slate-950 bg-gold hover:bg-amber-300 rounded-xl transition-all shadow-lg"
            >
              <Sparkles className="h-4 w-4" />
              Explore Full Process
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 3: CORE FEATURES — LIGHT BACKGROUND */}
      <section id="features" className="py-20 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3.5 py-1 text-xs font-bold text-primary border border-primary-200">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              <span>Core Capabilities</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Everything You Need to Beat ATS & Land Interviews
            </h2>
            <p className="text-sm text-slate-600">
              <S /> combines AI resume engineering, gap detection, and job-tailored keyword matching into one seamless platform.
            </p>
          </div>

          {/* 5 cards: top row 3, bottom row 2 centered */}
          <div className="space-y-6">
            {/* Top 3 */}
            <div className="grid gap-6 md:grid-cols-3">
              {CORE_HIGHLIGHTS.slice(0, 3).map((item, index) => {
                const Icon = item.icon
                return (
                  <AnimatedSection key={index} delay={index * 0.06}>
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all flex flex-col justify-between group h-full">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className={`p-3 rounded-xl ${item.iconBg} shadow-sm group-hover:scale-110 transition-transform`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full border ${item.badgeBg}`}>{item.badge}</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">{item.title}</h3>
                        <p className="text-xs leading-relaxed text-slate-600">{item.description}</p>
                      </div>
                      <Link href={item.href} className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-1 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                        <span>Explore {item.title}</span>
                        <ChevronRight className="h-4 w-4 text-gold" />
                      </Link>
                    </div>
                  </AnimatedSection>
                )
              })}
            </div>

            {/* Bottom 2 — centered */}
            <div className="flex justify-center">
              <div className="grid gap-6 md:grid-cols-2 w-full md:max-w-[calc(66.66%+0.75rem)]">
                {CORE_HIGHLIGHTS.slice(3).map((item, index) => {
                  const Icon = item.icon
                  return (
                    <AnimatedSection key={index} delay={(index + 3) * 0.06}>
                      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all flex flex-col justify-between group h-full">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className={`p-3 rounded-xl ${item.iconBg} shadow-sm group-hover:scale-110 transition-transform`}>
                              <Icon className="h-6 w-6" />
                            </div>
                            <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full border ${item.badgeBg}`}>{item.badge}</span>
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">{item.title}</h3>
                          <p className="text-xs leading-relaxed text-slate-600">{item.description}</p>
                        </div>
                        <Link href={item.href} className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-1 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                          <span>Explore {item.title}</span>
                          <ChevronRight className="h-4 w-4 text-gold" />
                        </Link>
                      </div>
                    </AnimatedSection>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: ADDITIONAL FEATURES — DARK BACKGROUND */}
      <section className="py-20 bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-white">
              Complete <S dark /> AI Career Toolkit
            </h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Our AI optimization pipeline leverages industry-standard recruitment benchmarks.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ADDITIONAL_FEATURES.map((feat, i) => {
              const Icon = feat.icon
              return (
                <AnimatedSection key={i} delay={i * 0.05}>
                  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 hover:border-primary-700 hover:bg-slate-900/80 transition-all group h-full">
                    <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${feat.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-bold text-white">{feat.title}</h3>
                    <p className="text-[12px] leading-relaxed text-slate-400">{feat.description}</p>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* SECTION 5: CTA BANNER — BRAND NAVY & GOLD (High Contrast) */}
      <section className="py-20 bg-slate-950 text-white relative overflow-hidden border-y border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.08)_0%,transparent_70%)] pointer-events-none" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1.5 text-xs font-black text-[#c5a059] border border-[#c5a059]/30 shadow-sm">
            <Sparkles className="h-4 w-4 text-[#c5a059]" />
            <span>READY FOR YOUR NEXT STEP?</span>
          </div>

          <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl leading-tight text-white">
            Elevate Your Job Applications with <S dark /> AI
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Get real-time ATS scoring, uncover experience gaps, build job-tailored resumes, or start fresh with our AI-guided builder.
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-left py-2">
            {['ATS Score Audit', 'Gap Analysis Report', 'Job-Specific Tailoring', 'Build or Revamp'].map((t) => (
              <div key={t} className="flex items-center gap-2.5 text-xs font-bold text-slate-200 bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 shadow-sm">
                <Check className="h-4 w-4 text-[#c5a059] shrink-0" />
                <span>{t}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-center">
            <Link href="/login"
              className="flex items-center justify-center gap-2 rounded-xl bg-gold px-8 py-4 text-sm font-black text-slate-950 hover:bg-amber-300 transition-all hover:shadow-xl hover:shadow-gold/20 shadow-md"
            >
              <span>Get Started Now</span>
              <ChevronRight className="h-4 w-4 text-slate-950" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 6: FAQ ACCORDION — LIGHT BACKGROUND */}
      <section className="py-20 bg-white text-slate-900 border-t border-slate-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Everything you need to know about the <S /> AI CV platform.
            </p>
          </div>
          <FAQAccordion />
        </div>
      </section>

      {/* JSON-LD Structured Data for Software Application & FAQs */}
      <Script
        id="schema-software"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <Script
        id="schema-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </div>
  )
}
