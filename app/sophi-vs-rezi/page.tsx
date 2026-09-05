import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import Script from 'next/script';
import Header from '@/components/Header';
import {
  Sparkles, CheckCircle2,
  FileText, ArrowRight,
  ShieldCheck, Check, X, Layers, Cpu, Target, DollarSign
} from 'lucide-react';
import {
  createComparisonSchema,
  createBreadcrumbSchema
} from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Sophi vs Rezi (2026 Comparison) — Best AI Resume Builder for ATS | Sophi',
  description: 'Comparing Sophi vs Rezi AI CV Builder. See how Sophi delivers comprehensive 5-dimension ATS audits, STAR-metric rewriting, job description tailoring, and localized career intelligence at a fraction of the cost.',
  keywords: [
    'Sophi vs Rezi', 'Rezi alternative', 'Best Rezi alternatives',
    'AI CV builder comparison', 'Rezi review', 'ATS resume builder comparison'
  ],
  alternates: {
    canonical: 'https://joinsophi.com/sophi-vs-rezi'
  },
  openGraph: {
    title: 'Sophi vs Rezi — AI Resume Builder Comparison | Sophi',
    description: 'Detailed feature, pricing, and ATS performance comparison between Sophi and Rezi.',
    url: 'https://joinsophi.com/sophi-vs-rezi',
    siteName: 'Sophi',
    type: 'website',
    images: [{ url: 'https://joinsophi.com/og/home.png', width: 1200, height: 630, alt: 'Sophi vs Rezi' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sophi vs Rezi (2026) — Best AI Resume Builder | Sophi',
    description: 'Detailed comparison between Sophi and Rezi for ATS optimization.',
    images: ['https://joinsophi.com/og/home.png']
  }
};

const COMPARISON_POINTS = [
  {
    feature: 'ATS Audit Dimensions',
    sophi: '5 Dimensions (Keyword, Format, Syntax, Depth, Relevance)',
    rezi: 'Keyword density check only'
  },
  {
    feature: 'STAR-Metric Accomplishment Rewriting',
    sophi: 'Yes (Action Verb + Context + Quantifiable Result)',
    rezi: 'Basic AI suggestions'
  },
  {
    feature: '1-Click Job Description Tailoring',
    sophi: 'Instant keyword gap extraction & auto-injection',
    rezi: 'Manual keyword matching'
  },
  {
    feature: 'LinkedIn Profile & Cover Letter Bundle',
    sophi: 'Included automatically',
    rezi: 'Separate paid upgrade'
  },
  {
    feature: 'Recruiter-Approved PDF Templates',
    sophi: '49 Single-Column ATS Verified Templates',
    rezi: 'Limited template styles'
  },
  {
    feature: 'Pricing Model',
    sophi: 'Affordable pay-as-you-go & low monthly rates',
    rezi: 'Expensive recurring USD subscriptions ($29+/mo)'
  },
  {
    feature: 'Emerging & Global Market Support',
    sophi: 'Pakistan, Gulf, UK, US, and Global',
    rezi: 'US/EU focus only'
  }
];

export default function SophiVsReziPage() {
  const comparisonSchema = createComparisonSchema('Rezi', 'https://rezi.ai');
  const breadcrumb = createBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Sophi vs Rezi', url: '/sophi-vs-rezi' }
  ]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Script
        id="schema-comparison"
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
            <span>2026 IN-DEPTH COMPARISON</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 leading-tight">
            Sophi vs Rezi: Which AI CV Builder <br />
            <span className="bg-gradient-to-r from-primary via-primary-800 to-gold bg-clip-text text-transparent">
              Actually Passes Corporate ATS Filters?
            </span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            While Rezi popularized ATS resume builders in North America, Sophi delivers a deeper 5-dimension audit engine, STAR-metric rewriting, and full career document bundles at an accessible price point for global professionals.
          </p>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
              Detailed Feature Breakdown
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              How Sophi compares head-to-head against Rezi across essential hiring capabilities.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950 text-white font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4 sm:p-5">Capability</th>
                  <th className="p-4 sm:p-5 text-[#c5a059] font-black">Sophi AI</th>
                  <th className="p-4 sm:p-5 text-slate-400">Rezi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {COMPARISON_POINTS.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="p-4 sm:p-5 font-semibold text-slate-900">{row.feature}</td>
                    <td className="p-4 sm:p-5 font-bold text-primary">{row.sophi}</td>
                    <td className="p-4 sm:p-5 text-slate-600">{row.rezi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Why Switch to Sophi */}
      <section className="py-16 bg-slate-950 text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Why Job Seekers Switch from Rezi to Sophi
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
              Get all premium ATS intelligence features without expensive US-dollar lock-in contracts.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-primary/20 text-[#c5a059] flex items-center justify-center font-black">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">5-Dimension Audit</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                We don&apos;t just count keywords. Sophi analyzes syntax, formatting traps, section hierarchy, and quantifiable metrics.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-primary/20 text-[#c5a059] flex items-center justify-center font-black">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">STAR-Formula Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Transform passive duties into quantified accomplishments that prove your business impact to hiring managers.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-primary/20 text-[#c5a059] flex items-center justify-center font-black">
                <DollarSign className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Fair, Transparent Pricing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pay per CV transformation or pick flexible credit bundles without expensive recurring subscriptions.
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link
              href="/choice"
              className="inline-flex items-center gap-2 rounded-xl bg-gold px-8 py-4 text-sm font-black text-slate-950 hover:bg-amber-300 transition-all shadow-xl"
            >
              <span>Try Sophi AI CV Builder Now</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
