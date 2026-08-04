'use client'

import React from 'react'
import Header from '@/components/Header'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Upload, Sparkles, Download, CheckCircle2, ArrowDown,
  FileText, Target, Zap, Mail, ShieldCheck
} from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Zap,
    title: 'Get Your Credits',
    subtitle: 'Unlock full access instantly',
    description: 'Purchase a credit package to unlock the full power of SOPHI AI. Credits are reusable across all tools — CV transformation, ATS checker, LinkedIn optimizer, and more.',
    color: 'from-primary-900 to-primary-950',
    bg: 'bg-slate-900/90 text-white',
    border: 'border-primary-800',
    iconColor: 'text-amber-400',
    checks: ['Instant account activation', 'Credits valid across all tools', 'No subscription required'],
  },
  {
    number: '02',
    icon: Upload,
    title: 'Upload Your CV',
    subtitle: 'PDF or DOCX — any format works',
    description: 'Upload your existing CV in PDF or DOCX format. Tell SOPHI your target industry, paste an optional job description, and choose your preferred output language.',
    color: 'from-gold to-amber-600',
    bg: 'bg-white',
    border: 'border-slate-200',
    iconColor: 'text-primary',
    checks: ['PDF & DOCX supported', 'Multi-language output', 'Target industry selection'],
  },
  {
    number: '03',
    icon: Sparkles,
    title: 'AI Transforms Your CV',
    subtitle: 'Advanced LLM rewriting in under 60 seconds',
    description: 'SOPHI\'s AI engine analyzes your CV, identifies gaps, injects ATS-optimized keywords, rewrites achievement bullets using the STAR method, and structures your document for maximum recruiter impact.',
    color: 'from-primary-900 to-primary-950',
    bg: 'bg-slate-900/90 text-white',
    border: 'border-primary-800',
    iconColor: 'text-amber-400',
    checks: ['ATS keyword optimization', 'STAR-method bullet rewriting', 'Semantic relevance scoring'],
  },
  {
    number: '04',
    icon: Download,
    title: 'Download & Get Hired',
    subtitle: 'Beautiful PDF + full career toolkit',
    description: 'Receive your professionally redesigned CV in a premium template, along with a tailored cover letter, LinkedIn optimizer suggestions, ATS score report, and gap analysis — all delivered in seconds.',
    color: 'from-gold to-amber-600',
    bg: 'bg-white',
    border: 'border-slate-200',
    iconColor: 'text-primary',
    checks: ['50+ premium templates', 'Cover letter included', 'Emailed to your inbox'],
  },
]

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
}

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Header />

      <main>
        {/* Hero Banner */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 text-white py-20 px-4">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'radial-gradient(circle at 30% 50%, #4f46e5 0%, transparent 60%), radial-gradient(circle at 70% 20%, #f59e0b 0%, transparent 50%)'
          }} />
          <div className="relative max-w-3xl mx-auto text-center space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-xs font-extrabold text-amber-300"
            >
              <Sparkles className="h-3.5 w-3.5" />
              AI-POWERED CV TRANSFORMATION
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="text-4xl sm:text-5xl font-black tracking-tight leading-tight"
            >
              From Upload to<br />
              <span className="bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
                Job-Ready in 4 Steps
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-slate-300 text-lg font-medium max-w-xl mx-auto"
            >
              See exactly how <span className="text-[#c5a059] font-black">SOPHI</span> transforms your old CV into an ATS-optimized career document using advanced AI.
            </motion.p>
          </div>
        </section>

        {/* Flowchart Steps */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-0">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={i}>
                {/* Step Card */}
                <motion.div
                  variants={fadeUp}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className={`relative rounded-2xl border ${step.border} ${step.bg} p-7 sm:p-8 shadow-sm`}
                >
                  {/* Step number badge */}
                  <div className="flex items-start gap-5">
                    <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Step {step.number}</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">{step.title}</h2>
                      <p className="text-sm font-semibold text-slate-500 mt-0.5 mb-3">{step.subtitle}</p>
                      <p className="text-slate-600 text-sm leading-relaxed mb-4">{step.description}</p>
                      <ul className="space-y-1.5">
                        {step.checks.map((c, ci) => (
                          <li key={ci} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <CheckCircle2 className={`w-4 h-4 ${step.iconColor} shrink-0`} />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>

                {/* Connector Arrow between steps */}
                {i < steps.length - 1 && (
                  <div className="flex justify-center py-3">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-0.5 h-6 bg-slate-300 rounded-full" />
                      <ArrowDown className="w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </section>

        {/* Stats Strip */}
        <section className="bg-white border-y border-slate-200 py-10 px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '< 60s', label: 'Transformation Time' },
              { value: '50+', label: 'Premium Templates' },
              { value: '10+', label: 'Output Languages' },
              { value: '4,800+', label: 'CVs Optimized' },
            ].map((stat, i) => (
              <motion.div key={i}
                variants={fadeUp} initial="initial" whileInView="animate"
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              >
                <div className="text-3xl font-black text-primary-950">{stat.value}</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 text-center">
          <motion.div variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4">Ready to get started?</h2>
            <p className="text-slate-500 text-sm mb-7 max-w-sm mx-auto">Join thousands of professionals who've already landed their next role with SOPHI.</p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-primary rounded-xl hover:bg-primary-800 transition-all shadow-lg hover:shadow-primary-200"
            >
              <Sparkles className="h-5 w-5 text-gold" />
              Start Your CV Transformation
            </Link>
          </motion.div>
        </section>
      </main>
    </div>
  )
}
