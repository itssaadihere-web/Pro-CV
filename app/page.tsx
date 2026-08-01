'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  FileText,
  Target,
  Sparkles,
  Award,
  Zap,
  ShieldCheck,
  Download,
  Languages,
  ArrowRight,
  ChevronRight,
  BarChart3,
  FilePlus,
  CheckCircle2,
  Check,
} from 'lucide-react'
import Header from '@/components/Header'
import FAQAccordion from '@/components/FAQAccordion'
import Logo from '@/components/Logo'
import Script from 'next/script'
import { websiteSchema, softwareSchema, faqSchema } from '@/lib/schema'

const CORE_HIGHLIGHTS = [
  {
    icon: Target,
    badge: 'ATS Audit Engine',
    title: 'ATS Score & Compliance Check',
    description: 'Evaluate your CV compliance across 5 dimensions: keyword density, formatting safety, semantic relevance, experience metrics, and section structure.',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    iconBg: 'bg-blue-600 text-white',
  },
  {
    icon: BarChart3,
    badge: 'Gap Intelligence',
    title: 'Career & Skill Gap Analysis',
    description: 'Instantly uncover missing keywords, work experience gaps, and critical qualifications required to outrank rival candidates in recruiter filters.',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    iconBg: 'bg-amber-600 text-white',
  },
  {
    icon: Sparkles,
    badge: 'Targeted Matching',
    title: 'Job-Specific CV Tailoring',
    description: 'Paste any job description to automatically adjust your bullet points, skills, and summary to align with specific role requirements.',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    iconBg: 'bg-indigo-600 text-white',
  },
  {
    icon: FilePlus,
    badge: 'Wizard Assistant',
    title: 'Build CV from Scratch',
    description: 'No existing resume? Easily generate a fresh, professional, ATS-approved CV from scratch using our step-by-step guided builder.',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconBg: 'bg-emerald-600 text-white',
  },
  {
    icon: Zap,
    badge: '30-Sec AI Revamp',
    title: 'Transform CV in 30 Seconds',
    description: 'Upload your current PDF or Word document and let advanced AI restructure and optimize it into an interview-winning CV in 30 seconds.',
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
    iconBg: 'bg-purple-600 text-white',
  },
]

const ADDITIONAL_FEATURES = [
  {
    icon: Zap,
    title: 'STAR-Metric Bullets',
    description: 'Converts descriptors into quantifiable accomplishments: Action (Power Verb) + Context + Metric Result.',
  },
  {
    icon: Award,
    title: '2026 Executive Summary',
    description: 'A 3-line structural hook summarizing total years of experience, top value statements, and key proof figures.',
  },
  {
    icon: ShieldCheck,
    title: 'LinkedIn Profile Optimizer',
    description: 'Build custom headers, hook summaries, and keywords so recruiters discover your profile easily.',
  },
  {
    icon: FileText,
    title: 'AI Cover Letter Generator',
    description: 'Fully personalized, achievement-driven introductory letters customized against target job descriptions.',
  },
  {
    icon: Download,
    title: '49 PDF Templates Export',
    description: 'One-click downloads supporting ATS-Safe formatting, Modern spacing, and clean Minimalist layouts.',
  },
  {
    icon: Languages,
    title: 'Multi-Language Support',
    description: 'Optimize CVs in English (EN), Arabic (AR with RTL format), French (FR), or Spanish (ES).',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 relative">
      <Script
        id="schema-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
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

      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white py-16 lg:py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.blue.50),white)] opacity-70" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            <div className="space-y-8 lg:col-span-7 text-left">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 text-xs font-extrabold text-primary border border-primary-100"
              >
                <Sparkles className="h-4 w-4 text-gold" />
                <span>Next-Gen AI CV Platform v2.5</span>
              </motion.div>

              <div className="space-y-4">
                <motion.h1
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl leading-[1.1]"
                >
                  Build & Transform CVs with AI. <br />
                  <span className="bg-gradient-to-r from-primary via-primary-800 to-gold bg-clip-text text-transparent">
                    ATS-Optimized in 30 Seconds.
                  </span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-sm sm:text-base leading-relaxed text-slate-600 max-w-xl"
                >
                  Check your ATS score, analyze career gaps, tailor your CV for specific job roles, build a new resume from scratch, or transform your existing CV into a recruiter-approved document in 30 seconds.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 items-center"
              >
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-bold text-white transition-all hover:bg-primary-800 hover:shadow-xl hover:shadow-primary-100"
                >
                  <span>Build & Revamp CV Now</span>
                  <ArrowRight className="h-4 w-4 text-gold" />
                </Link>
                <a
                  href="#features"
                  className="flex items-center justify-center rounded-xl border border-slate-205 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 h-[48px]"
                >
                  <span>Explore Features</span>
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.45 }}
                className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs font-bold text-slate-500 uppercase tracking-wider"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                  <span>ATS Score Audit</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                  <span>Gap Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                  <span>Job Description Tailoring</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                  <span>Build from Scratch</span>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative w-full max-w-[420px] rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xl shadow-slate-200/50"
              >
                <div className="absolute -top-4 -left-4 h-12 w-12 rounded-xl bg-blue-100/60 blur-lg" />
                <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-xl bg-indigo-100/60 blur-lg" />
                
                <Image
                  src="/images/cv_hero.png"
                  alt="Sophi AI CV builder dashboard showing ATS score and rewritten resume"
                  width={1200}
                  height={800}
                  priority
                  className="rounded-xl w-full object-cover border border-slate-100 shadow-sm"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              How Sophi Works
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Get an interview-ready professional profile package in 3 quick steps.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 relative">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col items-center text-center space-y-4 hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary font-bold text-base">
                01
              </div>
              <h3 className="text-base font-bold text-slate-850">Upload or Start from Scratch</h3>
              <p className="text-xs leading-relaxed text-slate-550">
                Upload your existing PDF/Word CV for an instant revamp, or build a new ATS-compliant resume from scratch with our step-by-step guide.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col items-center text-center space-y-4 hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary font-bold text-base">
                02
              </div>
              <h3 className="text-base font-bold text-slate-850">AI Audit & Job Tailoring</h3>
              <p className="text-xs leading-relaxed text-slate-550">
                Our AI checks your ATS score, analyzes career gaps, and tailors your profile with high-impact keywords for target job descriptions.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col items-center text-center space-y-4 hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary font-bold text-base">
                03
              </div>
              <h3 className="text-base font-bold text-slate-850">Download in 30 Seconds</h3>
              <p className="text-xs leading-relaxed text-slate-550">
                Instantly retrieve your rewritten CV, detailed ATS score analysis, cover letter, and LinkedIn headline card in professional templates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Platform Highlights Showcase Section */}
      <section id="features" className="py-20 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-100">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Core Capabilities</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Everything You Need to Beat ATS & Land Interviews
            </h2>
            <p className="text-sm text-slate-600">
              Sophi combines AI resume engineering, gap detection, and job-tailored keyword matching into one seamless platform.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {CORE_HIGHLIGHTS.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-xl ${item.iconBg} shadow-sm group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full border ${item.badgeBg}`}>
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    
                    <p className="text-xs leading-relaxed text-slate-600">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-1 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                    <span>Explore Feature</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Complete AI Career Toolkit
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Our AI optimization pipeline leverages industry-standard recruitment benchmarks.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {ADDITIONAL_FEATURES.map((feat, i) => {
              const Icon = feat.icon
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 hover:shadow-md hover:border-slate-300 transition-all group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary group-hover:scale-105 transition-transform">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">{feat.title}</h3>
                  <p className="text-[12px] leading-relaxed text-slate-500">{feat.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Showcase Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-primary-950 to-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,theme(colors.blue.900/30),transparent)]" />
        
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-extrabold text-amber-400 backdrop-blur-md border border-white/10">
            <Sparkles className="h-4 w-4" />
            <span>Ready for Next Step?</span>
          </div>

          <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl leading-tight">
            Elevate Your Job Applications with Sophi AI
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Get real-time ATS scoring, uncover experience gaps, build job-tailored resumes, or start fresh with our AI-guided builder.
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-left py-4">
            <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-200 bg-white/5 p-3 rounded-xl border border-white/10">
              <Check className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>ATS Score Audit</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-200 bg-white/5 p-3 rounded-xl border border-white/10">
              <Check className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Gap Analysis Report</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-200 bg-white/5 p-3 rounded-xl border border-white/10">
              <Check className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Job-Specific Tailoring</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-200 bg-white/5 p-3 rounded-xl border border-white/10">
              <Check className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Build or Revamp in 30s</span>
            </div>
          </div>

          <div className="pt-4 flex justify-center">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 rounded-xl bg-gold px-8 py-4 text-sm font-black text-slate-950 hover:bg-amber-400 transition-all hover:shadow-xl hover:shadow-gold/20"
            >
              <span>Get Started Now</span>
              <ChevronRight className="h-4 w-4 text-slate-950" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Everything you need to know about our AI CV platform.
            </p>
          </div>

          <FAQAccordion />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center">
            <Logo width={64} height={64} showTagline={true} />
          </div>

          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} JoinSophi.com AI CV Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
