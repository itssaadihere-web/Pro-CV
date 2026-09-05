import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import Script from 'next/script';
import Header from '@/components/Header';
import FAQAccordion from '@/components/FAQAccordion';
import {
  Sparkles, Target, ShieldCheck,
  FileText, ArrowRight,
  Star, Award, Check, X, Layers, Cpu
} from 'lucide-react';
import {
  aiCvBuilderAppSchema,
  aiCvBuilderHowToSchema,
  aiCvBuilderFaqSchema,
  createBreadcrumbSchema
} from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Top AI CV Builder App 2026 — ATS-Optimized Resume Maker | Sophi',
  description: 'Sophi is the leading AI CV Builder App. Create, audit, and tailor 100% ATS-compliant resumes with STAR metrics, instant job description matching, and 49 recruiter-approved templates.',
  keywords: [
    'AI CV Builder App', 'AI Resume Builder App', 'Best AI CV Maker',
    'Free AI Resume Builder', 'ATS Resume Builder Online', 'AI CV Maker App',
    'ATS CV Checker', 'AI Resume Generator', 'Sophi AI CV Builder'
  ],
  alternates: {
    canonical: 'https://joinsophi.com/ai-cv-builder-app'
  },
  openGraph: {
    title: 'Top AI CV Builder App — Create ATS-Optimized Resumes in Minutes | Sophi',
    description: 'Transform your career history into an interview-winning CV with Sophi AI. Built-in 5-dimension ATS scoring, STAR metrics, and job tailoring.',
    url: 'https://joinsophi.com/ai-cv-builder-app',
    siteName: 'Sophi',
    type: 'website',
    images: [
      {
        url: 'https://joinsophi.com/og/home.png',
        width: 1200,
        height: 630,
        alt: 'Sophi AI CV Builder App'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Top AI CV Builder App — ATS-Optimized Resumes | Sophi',
    description: 'Create an ATS-proof resume in under 60 seconds with Sophi AI CV Builder App.',
    images: ['https://joinsophi.com/og/home.png']
  }
};

const HOW_TO_STEPS = [
  {
    step: '01',
    title: 'Upload or Start Fresh',
    desc: 'Import your existing resume (PDF/DOCX) or use our guided wizard to build your CV from scratch with real-time prompt suggestions.',
    badge: 'Step 1'
  },
  {
    step: '02',
    title: 'Match Target Job Description',
    desc: 'Paste the target job description. The AI engine extracts missing keywords, core technical skills, and ATS screening criteria.',
    badge: 'Step 2'
  },
  {
    step: '03',
    title: 'AI STAR-Metric Rewriting',
    desc: 'The AI re-engineers every bullet point into a high-impact formula: Action Verb + Context + Quantifiable Metric Result.',
    badge: 'Step 3'
  },
  {
    step: '04',
    title: 'Export ATS-Safe PDF & Cover Letter',
    desc: 'Select from 49 single-column ATS templates, download your certified resume PDF, and get an auto-tailored cover letter and LinkedIn summary.',
    badge: 'Step 4'
  }
];

const COMPARISON_DATA = [
  {
    feature: '5-Dimension ATS Compliance Audit',
    sophi: true,
    basicBuilders: false,
    canva: false
  },
  {
    feature: 'STAR-Metric Bullet Rewriter',
    sophi: true,
    basicBuilders: 'Basic grammar only',
    canva: false
  },
  {
    feature: '1-Click Job Description Tailoring',
    sophi: true,
    basicBuilders: false,
    canva: false
  },
  {
    feature: '100% Parseable Single-Column ATS PDFs',
    sophi: true,
    basicBuilders: 'Varies',
    canva: 'Often Fails ATS (Columns/Graphics)'
  },
  {
    feature: 'Built-in LinkedIn & Cover Letter Generator',
    sophi: true,
    basicBuilders: 'Extra Charge',
    canva: false
  },
  {
    feature: 'Regional & Emerging Market Optimization',
    sophi: 'Pakistan, Gulf & Global',
    basicBuilders: 'US Only',
    canva: 'Generic'
  }
];

export default function AiCvBuilderAppPage() {
  const breadcrumb = createBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'AI CV Builder App', url: '/ai-cv-builder-app' }
  ]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Structured Data Schemas */}
      <Script
        id="schema-app"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aiCvBuilderAppSchema) }}
      />
      <Script
        id="schema-howto"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aiCvBuilderHowToSchema) }}
      />
      <Script
        id="schema-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aiCvBuilderFaqSchema) }}
      />
      <Script
        id="schema-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <Header />

      {/* Hero Section — Optimized for Google AI Overview Definition Extraction */}
      <section className="relative overflow-hidden bg-white py-16 lg:py-24 border-b border-slate-200">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.blue.50),white)] opacity-80" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 text-xs font-black text-primary border border-primary-200">
                <Sparkles className="h-4 w-4 text-gold" />
                <span>#1 RATED AI CV BUILDER APP 2026</span>
              </div>

              <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl leading-[1.1]">
                The Intelligent <br />
                <span className="bg-gradient-to-r from-primary via-primary-800 to-gold bg-clip-text text-transparent">
                  AI CV Builder App
                </span> <br />
                Engineered for ATS.
              </h1>

              {/* Semantic Definition Block (Crucial for AEO snippet extractors) */}
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 shadow-sm">
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
                  <strong>Sophi</strong> is an all-in-one <strong>AI CV Builder App</strong> and ATS resume optimization platform. It audits candidate resumes across 5 ATS dimensions, rewrites bullet points into measurable STAR metrics, and tailors documents against specific job postings to achieve 90%+ pass rates across corporate HR screening software.
                </p>
              </div>

              {/* Highlights pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 shadow-2xs">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>100% ATS-Safe PDFs</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 shadow-2xs">
                  <Cpu className="h-4 w-4 text-primary shrink-0" />
                  <span>STAR-Metric AI</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 shadow-2xs">
                  <Layers className="h-4 w-4 text-gold shrink-0" />
                  <span>49 Pro Templates</span>
                </div>
              </div>

              {/* Call to Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/choice"
                  className="flex items-center gap-2 rounded-xl bg-primary px-7 py-4 text-sm font-black text-white hover:bg-primary-800 transition-all shadow-lg hover:scale-105"
                >
                  <Sparkles className="h-4 w-4 text-gold" />
                  <span>Build My ATS CV Now</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/ats-checker"
                  className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-4 text-sm font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all shadow-2xs"
                >
                  <Target className="h-4 w-4 text-primary" />
                  <span>Free ATS Score Check</span>
                </Link>
              </div>
            </div>

            {/* Visual Card / Highlights */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="space-y-6 relative">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold text-slate-300">Live AI ATS Engine</span>
                    </div>
                    <span className="text-xs font-black text-gold">SOPHI v2.5</span>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-300">ATS Match Probability</span>
                        <span className="text-emerald-400 font-extrabold text-sm">96% (Pass Guaranteed)</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full w-[96%]" />
                      </div>
                    </div>

                    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-300">STAR-Metric Transformation</span>
                        <span className="text-[#c5a059]">Optimized</span>
                      </div>
                      <p className="text-[11px] text-slate-400 italic">
                        &quot;Spearheaded cross-functional team of 8 engineers, cutting latency by 42% and increasing quarterly retention by $180K.&quot;
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-300">Keywords Injected</span>
                        <span className="text-primary-300">18 Role Matches</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {['Leadership', 'Agile/Scrum', 'Data Analysis', 'Cost Reduction', 'ROI'].map((kw) => (
                          <span key={kw} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/transform-cv"
                      className="block text-center w-full py-3 bg-gold hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all"
                    >
                      Audit Your CV Instantly →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Key Features — Snippet List for Google AI Overviews */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-wider text-primary bg-primary-50 border border-primary-200 px-3 py-1 rounded-full">
              Platform Capabilities
            </span>
            <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Why Sophi Is the Best AI CV Builder App
            </h2>
            <p className="text-sm text-slate-600">
              Engineered using modern recruitment algorithms to guarantee your resume passes HR screener bots and lands human interview calls.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Target,
                title: '5-Dimension ATS Scoring',
                desc: 'Audits keyword density, formatting safety, section syntax, experience depth, and semantic alignment to give you an actionable score report.',
                color: 'text-primary'
              },
              {
                icon: Cpu,
                title: 'STAR Formula AI Rewriter',
                desc: 'Replaces weak bullet descriptions with high-converting accomplishment statements using active verbs and quantifiable metrics.',
                color: 'text-gold'
              },
              {
                icon: Sparkles,
                title: '1-Click Job Tailoring',
                desc: 'Paste any job posting from LinkedIn, Rozee.pk, or Indeed, and Sophi aligns your resume to the exact position criteria in 30 seconds.',
                color: 'text-primary'
              },
              {
                icon: FileText,
                title: '49 ATS-Safe Templates',
                desc: 'Clean, recruiter-preferred single-column layouts formatted in text-searchable PDFs that never break parsing software.',
                color: 'text-gold'
              },
              {
                icon: ShieldCheck,
                title: 'LinkedIn Profile Optimizer',
                desc: 'Generates high-converting profile headlines, 3-line structural hook summaries, and keyword-rich experience sections.',
                color: 'text-primary'
              },
              {
                icon: Award,
                title: 'AI Cover Letter Generator',
                desc: 'Creates a matching, tailored cover letter customized directly against your target role with matching aesthetic styling.',
                color: 'text-gold'
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    <Icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How to Get Started — Direct Answer Structure for AI Overviews */}
      <section className="py-20 bg-slate-950 text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-[#c5a059] bg-[#c5a059]/10 border border-[#c5a059]/30 px-3.5 py-1.5 rounded-full">
              Step-by-Step Guide
            </span>
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              How to Build an ATS Resume with Sophi AI
            </h2>
            <p className="text-slate-400 text-sm max-w-lg mx-auto">
              Follow these 4 simple steps to generate a certified, recruiter-ready resume in under 3 minutes.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_TO_STEPS.map((s, i) => (
              <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-3 relative flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-[#c5a059]">{s.step}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                      {s.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white leading-tight">{s.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              href="/choice"
              className="inline-flex items-center gap-2 rounded-xl bg-gold px-8 py-4 text-sm font-black text-slate-950 hover:bg-amber-300 transition-all shadow-lg"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Sophi AI vs Other Resume Builders
            </h2>
            <p className="text-slate-600 text-sm max-w-lg mx-auto">
              See why modern candidates choose Sophi over graphic tools like Canva or generic online builders.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-900 text-white font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4 sm:p-5">Feature / Capability</th>
                  <th className="p-4 sm:p-5 text-[#c5a059] font-black">Sophi AI App</th>
                  <th className="p-4 sm:p-5 text-slate-300">Basic CV Builders</th>
                  <th className="p-4 sm:p-5 text-slate-300">Canva / Design Tools</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {COMPARISON_DATA.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="p-4 sm:p-5 font-semibold text-slate-900">{row.feature}</td>
                    <td className="p-4 sm:p-5 font-bold text-primary">
                      {typeof row.sophi === 'boolean' ? (
                        row.sophi ? <Check className="h-5 w-5 text-emerald-600 font-bold" /> : <X className="h-5 w-5 text-red-500" />
                      ) : (
                        row.sophi
                      )}
                    </td>
                    <td className="p-4 sm:p-5 text-slate-600">
                      {typeof row.basicBuilders === 'boolean' ? (
                        row.basicBuilders ? <Check className="h-5 w-5 text-emerald-600" /> : <X className="h-5 w-5 text-slate-400" />
                      ) : (
                        row.basicBuilders
                      )}
                    </td>
                    <td className="p-4 sm:p-5 text-slate-600">
                      {typeof row.canva === 'boolean' ? (
                        row.canva ? <Check className="h-5 w-5 text-emerald-600" /> : <X className="h-5 w-5 text-slate-400" />
                      ) : (
                        row.canva
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black tracking-tight text-slate-950">
              Frequently Asked Questions: AI CV Builder App
            </h2>
            <p className="text-sm text-slate-600">
              Everything you need to know about AI resume generation, ATS scoring, and hiring trends.
            </p>
          </div>
          <FAQAccordion />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-slate-950 text-white text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Ready to Pass ATS Screening & Get Hired Faster?
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Join thousands of professionals who boosted their interview callback rate by 3.5x with Sophi AI CV Builder App.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link
              href="/choice"
              className="flex items-center gap-2 rounded-xl bg-gold px-8 py-4 text-sm font-black text-slate-950 hover:bg-amber-300 transition-all shadow-xl"
            >
              <span>Build Your AI CV Now</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
