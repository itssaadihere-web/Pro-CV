'use client'

import React from 'react'
import Header from '@/components/Header'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Sparkles, Target, Users, ShieldCheck, TrendingUp,
  Globe, Heart, ArrowRight, Star, Zap, Award
} from 'lucide-react'

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
}

const values = [
  {
    icon: Target,
    title: 'Precision-First',
    desc: 'Every line of your CV is crafted with ATS algorithms in mind — keyword-dense, semantically relevant, and recruiter-ready.',
    color: 'bg-violet-100 text-violet-700',
  },
  {
    icon: Zap,
    title: 'Speed Without Sacrifice',
    desc: 'Traditional CV writers take days. We deliver a fully optimized career document in under 60 seconds — without compromising quality.',
    color: 'bg-amber-100 text-amber-700',
  },
  {
    icon: Globe,
    title: 'Built for Pakistan & Gulf',
    desc: 'Our AI is fine-tuned for Pakistani, UAE, and Saudi job markets — understanding the industries, roles, and expectations of regional employers.',
    color: 'bg-emerald-100 text-emerald-700',
  },
  {
    icon: Heart,
    title: 'Accessibility Matters',
    desc: 'Top-tier career tools should not cost a fortune. We\'ve made world-class AI accessible to every professional, regardless of their budget.',
    color: 'bg-rose-100 text-rose-700',
  },
  {
    icon: ShieldCheck,
    title: 'Private & Secure',
    desc: 'Your documents and personal data are never shared or stored longer than needed. Your privacy is built into every step of our platform.',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    icon: Award,
    title: 'Outcome-Driven',
    desc: 'We measure success by interview callbacks, not by pageviews. Every feature we build is designed to get you in front of a recruiter.',
    color: 'bg-primary-100 text-primary',
  },
]

const stats = [
  { value: '4,800+', label: 'CVs Optimized', icon: '📄' },
  { value: '98%', label: 'ATS Pass Rate', icon: '✅' },
  { value: '50+', label: 'Premium Templates', icon: '🎨' },
  { value: '< 60s', label: 'Avg. Delivery Time', icon: '⚡' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 text-white py-24 px-4 sm:px-6">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(ellipse at 20% 60%, rgba(99,102,241,0.3) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(245,158,11,0.2) 0%, transparent 50%)'
        }} />

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <motion.div
            variants={fadeUp} initial="initial" animate="animate"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-xs font-extrabold text-amber-300 tracking-wider"
          >
            <Star className="h-3.5 w-3.5 fill-amber-300" />
            OUR STORY
          </motion.div>

          <motion.h1
            variants={fadeUp} initial="initial" animate="animate" transition={{ delay: 0.06 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight"
          >
            We Built <span className="text-[#c5a059] font-black">SOPHI</span> Because<br />
            <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent">
              Great Talent Deserves to Be Seen
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp} initial="initial" animate="animate" transition={{ delay: 0.1 }}
            className="text-slate-300 text-lg font-medium max-w-2xl mx-auto leading-relaxed"
          >
            We saw brilliant Pakistani professionals getting filtered out by ATS software that never even read their CVs. So we built the tool that fights back.
          </motion.p>
        </div>
      </section>

      {/* Stats Row */}
      <section className="bg-white border-b border-slate-100 py-10 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              variants={fadeUp} initial="initial" whileInView="animate"
              viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="text-center p-4 rounded-2xl bg-slate-50 border border-slate-100"
            >
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-3xl font-black text-slate-900">{s.value}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* The Problem & Solution */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            variants={fadeUp} initial="initial" whileInView="animate"
            viewport={{ once: true }}
            className="space-y-5"
          >
            <span className="inline-block text-xs font-black uppercase tracking-widest text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-full">The Problem</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
              98% of CVs Are Rejected<br />Before a Human Reads Them
            </h2>
            <p className="text-slate-600 leading-relaxed">
              In 2026, virtually every large employer uses Applicant Tracking Systems (ATS) to filter applications before a human ever sees them. These algorithms scan for keyword matches, formatting standards, and semantic relevance. Most professionals — no matter how qualified — are rejected instantly because their CVs weren't built for machines.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Pakistani professionals applying to local, Gulf, or international roles face this problem acutely. The gap between talent and opportunity isn't ability — it's presentation.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp} initial="initial" whileInView="animate"
            viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="relative"
          >
            <div className="rounded-3xl bg-gradient-to-br from-primary-950 to-slate-900 p-8 text-white space-y-5 shadow-2xl">
              <span className="inline-block text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1.5 rounded-full">Our Solution</span>
              <h3 className="text-2xl font-black leading-tight"><span className="text-[#c5a059] font-black">SOPHI</span> Reverse-Engineers the ATS</h3>
              <p className="text-slate-300 leading-relaxed text-sm">
                <span className="text-[#c5a059] font-black">SOPHI</span> uses advanced LLMs to analyze your CV, inject precise keyword density, rewrite achievement bullets using the STAR method, and restructure your document to match ATS scoring criteria for your exact target industry.
              </p>
              <ul className="space-y-3 pt-2">
                {[
                  'Semantic keyword optimization',
                  'STAR-method achievement rewriting',
                  'Industry-specific formatting',
                  'ATS compatibility scoring',
                  'Cover letter & LinkedIn optimization',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-semibold text-slate-200">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary-50 via-white to-primary-50 border-y border-primary-100">
        <motion.div
          variants={fadeUp} initial="initial" whileInView="animate"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center space-y-4"
        >
          <Sparkles className="h-8 w-8 text-primary mx-auto" />
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Our Mission</h2>
          <p className="text-lg text-slate-700 font-medium leading-relaxed max-w-2xl mx-auto">
            To level the playing field for Pakistani professionals by providing world-class, AI-driven career tools that guarantee their applications get seen by human recruiters.
          </p>
        </motion.div>
      </section>

      {/* Why We're Different */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp} initial="initial" whileInView="animate"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Why Professionals Choose Sophi</h2>
            <p className="text-slate-500 mt-3 text-base">Our core values shape every feature we build.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon
              return (
                <motion.div
                  key={i}
                  variants={fadeUp} initial="initial" whileInView="animate"
                  viewport={{ once: true, margin: '-40px' }} transition={{ delay: i * 0.06 }}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group"
                >
                  <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${v.color} mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-black text-slate-900 mb-2">{v.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{v.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Affordable */}
      <section className="py-16 px-4 bg-slate-900 text-white">
        <motion.div
          variants={fadeUp} initial="initial" whileInView="animate"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center space-y-5"
        >
          <TrendingUp className="h-10 w-10 text-amber-400 mx-auto" />
          <h2 className="text-2xl sm:text-3xl font-black">Premium Quality, Accessible Price</h2>
          <p className="text-slate-300 leading-relaxed text-base">
            Traditional CV writing services charge between <strong className="text-white">10,000 to 25,000 PKR</strong> and take weeks to deliver. By leveraging advanced AI, we deliver superior quality, data-driven optimization in under 60 seconds — making top-tier career advancement accessible to everyone.
          </p>
          <p className="text-slate-400 text-sm">We believe your next opportunity shouldn't be gated behind an expensive service.</p>
        </motion.div>
      </section>

      {/* Team Footer */}
      <section className="py-16 px-4">
        <motion.div
          variants={fadeUp} initial="initial" whileInView="animate"
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center space-y-6"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-800 flex items-center justify-center text-2xl font-black text-white mx-auto shadow-lg shadow-primary-200">
            S
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">The Sophi Team</h3>
            <p className="text-sm text-slate-500 mt-1">Karachi, Pakistan</p>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed max-w-lg mx-auto">
            We're a team of engineers, designers, and career specialists who believe AI should solve real problems for real people. Sophi is our answer to the career barrier millions of professionals face every day.
          </p>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold text-white bg-primary rounded-xl hover:bg-primary-800 transition-all shadow-lg"
          >
            <Sparkles className="h-4 w-4 text-gold" />
            Start Your Transformation
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
