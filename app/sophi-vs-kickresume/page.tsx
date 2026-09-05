import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import Script from 'next/script';
import Header from '@/components/Header';
import {
  Sparkles, CheckCircle2,
  FileText, ArrowRight,
  ShieldCheck, Check, X, Layers, Cpu, Target, Palette
} from 'lucide-react';
import {
  createComparisonSchema,
  createBreadcrumbSchema
} from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Sophi vs Kickresume (2026 Comparison) — Which AI Resume Builder is Best? | Sophi',
  description: 'Comparing Sophi AI vs Kickresume. Discover why Sophi is the preferred ATS-optimized CV builder for professionals seeking real-time ATS scoring, STAR metrics, and single-column parseable PDFs.',
  keywords: [
    'Sophi vs Kickresume', 'Kickresume alternative', 'Best Kickresume alternatives',
    'AI CV builder comparison', 'Kickresume review', 'ATS resume builder'
  ],
  alternates: {
    canonical: 'https://joinsophi.com/sophi-vs-kickresume'
  },
  openGraph: {
    title: 'Sophi vs Kickresume — AI CV Builder Comparison | Sophi',
    description: 'Compare Sophi AI and Kickresume on ATS compatibility, AI rewriting quality, and pricing.',
    url: 'https://joinsophi.com/sophi-vs-kickresume',
    siteName: 'Sophi',
    type: 'website',
    images: [{ url: 'https://joinsophi.com/og/home.png', width: 1200, height: 630, alt: 'Sophi vs Kickresume' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sophi vs Kickresume — AI Resume Builder Comparison | Sophi',
    description: 'Detailed feature and ATS scoring comparison between Sophi and Kickresume.',
    images: ['https://joinsophi.com/og/home.png']
  }
};

const COMPARISON_POINTS = [
  {
    feature: 'Core Focus',
    sophi: '100% ATS Compliance & Recruiter Optimization',
    kickresume: 'Visual graphic layouts & templates'
  },
  {
    feature: 'ATS Parsing Reliability',
    sophi: 'Guaranteed single-column text-searchable PDFs',
    kickresume: 'Some graphic templates fail ATS text parsers'
  },
  {
    feature: 'STAR-Metric Rewriting Formula',
    sophi: 'Standardized Action + Context + Quantifiable Metric',
    kickresume: 'Generic AI text phrases'
  },
  {
    feature: 'Job Description Keyword Tailoring',
    sophi: 'Automated 1-Click Gap Extraction',
    kickresume: 'Manual editing required'
  },
  {
    feature: 'All-in-One Career Suite',
    sophi: 'CV + ATS Audit + Cover Letter + LinkedIn Optimizer',
    kickresume: 'Separate modules'
  },
  {
    feature: 'Pricing & Accessibility',
    sophi: 'Low-cost pay-as-you-go packages',
    kickresume: 'Subscription-based ($19–$29/mo USD)'
  }
];

export default function SophiVsKickresumePage() {
  const comparisonSchema = createComparisonSchema('Kickresume', 'https://kickresume.com');
  const breadcrumb = createBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Sophi vs Kickresume', url: '/sophi-vs-kickresume' }
  ]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Script
        id="schema-kickresume-comp"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(comparisonSchema) }}
      />
      <Script
        id="schema-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <Header />

      {/* Hero */}
      <section className="bg-white py-16 lg:py-20 border-b border-slate-200">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 text-xs font-black text-primary border border-primary-200">
            <Sparkles className="h-4 w-4 text-gold" />
            <span>2026 BENCHMARK REVIEW</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 leading-tight">
            Sophi vs Kickresume: <br />
            <span className="bg-gradient-to-r from-primary via-primary-800 to-gold bg-clip-text text-transparent">
              Visual Design vs ATS Engineering
            </span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Kickresume offers stylized visual designs, but corporate Applicant Tracking Systems (ATS) often choke on multi-column layouts. Discover why Sophi is engineered from the ground up for 100% ATS readability and human recruiter impact.
          </p>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
              Direct Comparison Matrix
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              See the key differences between Sophi and Kickresume.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950 text-white font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4 sm:p-5">Feature / Dimension</th>
                  <th className="p-4 sm:p-5 text-[#c5a059] font-black">Sophi AI</th>
                  <th className="p-4 sm:p-5 text-slate-400">Kickresume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {COMPARISON_POINTS.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="p-4 sm:p-5 font-semibold text-slate-900">{row.feature}</td>
                    <td className="p-4 sm:p-5 font-bold text-primary">{row.sophi}</td>
                    <td className="p-4 sm:p-5 text-slate-600">{row.kickresume}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-16 bg-slate-950 text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Why Choose Sophi Over Kickresume?
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
              Focus on getting real interviews instead of pretty designs that get rejected by automated HR screening bots.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-primary/20 text-[#c5a059] flex items-center justify-center font-black">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">No Parsing Errors</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Kickresume&apos;s graphical sidebars frequently corrupt text order in Taleo and Workday. Sophi templates are guaranteed 100% single-column safe.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-primary/20 text-[#c5a059] flex items-center justify-center font-black">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Targeted Keyword Matching</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sophi cross-references your resume against the exact requirements in the job description to eliminate qualification gaps.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-primary/20 text-[#c5a059] flex items-center justify-center font-black">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">LinkedIn & Cover Letter Included</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generate an end-to-end career application package without paying separate subscription addons.
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link
              href="/choice"
              className="inline-flex items-center gap-2 rounded-xl bg-gold px-8 py-4 text-sm font-black text-slate-950 hover:bg-amber-300 transition-all shadow-xl"
            >
              <span>Build an ATS-Certified CV with Sophi</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
