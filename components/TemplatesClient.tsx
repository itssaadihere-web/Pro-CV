'use client'

import React, { useState } from 'react'
import Header from '@/components/Header'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRight, Eye, CheckCircle2, ShieldCheck, X, HelpCircle, Copy, Check, FileText, ChevronDown, Award, Layers, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import { CVData } from '@/lib/cvParser'

import SophiTemplate01RoyalBlue from '@/components/cv-templates/sophi/SophiTemplate01RoyalBlue'
import SophiTemplate02YellowBlackBlock from '@/components/cv-templates/sophi/SophiTemplate02YellowBlackBlock'
import SophiTemplate03GoldCharcoalGeometric from '@/components/cv-templates/sophi/SophiTemplate03GoldCharcoalGeometric'
import SophiTemplate04CurvedGoldWave from '@/components/cv-templates/sophi/SophiTemplate04CurvedGoldWave'
import SophiTemplate05RibbonGraphicInfographic from '@/components/cv-templates/sophi/SophiTemplate05RibbonGraphicInfographic'
import SophiExecutiveSapphire from '@/components/cv-templates/sophi/SophiExecutiveSapphire'
import SophiATSMasterCorporate from '@/components/cv-templates/sophi/SophiATSMasterCorporate'
import SophiModernEmeraldAcademic from '@/components/cv-templates/sophi/SophiModernEmeraldAcademic'
import SophiCreativeCoralModernist from '@/components/cv-templates/sophi/SophiCreativeCoralModernist'
import SophiMinimalistMonochromePro from '@/components/cv-templates/sophi/SophiMinimalistMonochromePro'

function S({ children }: { children?: React.ReactNode }) {
  return (
    <span className="font-black text-primary tracking-wide">
      SOPHI
    </span>
  )
}

const SAMPLE_CV_DATA: CVData = {
  fullName: 'Syed Hamza Ali',
  jobTitle: 'Senior Software Engineer & Team Lead',
  email: 'hamza.ali@example.com',
  phone: '+92 300 1234567',
  location: 'Karachi, Pakistan',
  linkedin: 'linkedin.com/in/hamza-ali-tech',
  summary: 'Results-driven Senior Software Engineer with 7+ years of experience engineering scalable web applications, microservices, and AI platforms. Proven track record leading agile engineering teams and optimizing system latency by 45%.',
  coreCompetencies: ['Full-Stack Engineering', 'System Architecture', 'ATS Optimization', 'Team Leadership', 'Cloud Services (AWS/GCP)'],
  experience: [
    {
      title: 'Senior Software Engineer & Team Lead',
      company: 'TechLogix Global',
      location: 'Karachi, Pakistan',
      startDate: '2022',
      endDate: 'Present',
      bullets: [
        'Architected high-throughput microservices handling 2.5M daily active requests with 99.99% uptime.',
        'Led a cross-functional team of 8 engineers delivering enterprise cloud solutions 3 weeks ahead of deadline.',
        'Reduced API response times by 42% through query optimization and Redis caching layer implementation.',
      ],
    },
    {
      title: 'Full-Stack Developer',
      company: 'Systems Limited',
      location: 'Lahore, Pakistan',
      startDate: '2019',
      endDate: '2022',
      bullets: [
        'Developed customer portal using Next.js and TypeScript, increasing user retention by 28%.',
        'Implemented automated CI/CD pipelines reducing deployment failure rate from 12% to under 1%.',
      ],
    },
  ],
  keyAchievements: [
    'Recipient of Best Tech Innovator Award 2024 out of 350+ engineers',
    'Scaled backend infrastructure supporting 10x user growth',
  ],
  education: [
    {
      degree: 'B.S. Computer Science',
      institution: 'FAST-NUCES',
      startYear: '2015',
      endYear: '2019',
      distinction: 'First Class Honors (CGPA 3.8/4.0)',
    },
  ],
  certifications: [
    { name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', year: '2023' },
    { name: 'Certified ScrumMaster (CSM)', issuer: 'Scrum Alliance', year: '2022' },
  ],
  technicalSkills: {
    'Languages & Frameworks': ['TypeScript', 'React / Next.js', 'Node.js', 'Python', 'Go'],
    'Database & Cloud': ['PostgreSQL', 'MongoDB', 'Redis', 'AWS', 'Docker'],
  },
  languages: [
    { language: 'English', level: 'Full Professional Proficiency' },
    { language: 'Urdu', level: 'Native / Bilingual' },
  ],
}

const SOPHI_OFFICIAL_TEMPLATES = [
  {
    id: 'sophi-01-royal-blue-executive',
    name: 'Royal Blue Executive',
    category: 'Executive',
    tag: 'Executive ATS',
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-200',
    description: 'Double-column layout with a rich sapphire sidebar, executive header, and structured metrics.',
    component: SophiTemplate01RoyalBlue,
    theme: 'sapphire',
  },
  {
    id: 'sophi-02-yellow-black-block',
    name: 'Modern Contrast Block',
    category: 'Modern',
    tag: 'High Contrast',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
    description: 'Bold gold header block with crisp charcoal typography and high visual hierarchy.',
    component: SophiTemplate02YellowBlackBlock,
    theme: 'gold',
  },
  {
    id: 'sophi-03-gold-charcoal-geometric',
    name: 'Gold Charcoal Geometric',
    category: 'Executive',
    tag: 'Premium Geometric',
    badgeBg: 'bg-slate-900 text-amber-300 border-slate-700',
    description: 'Sleek geometric accenting with gold highlights and recruiter-optimized section spacing.',
    component: SophiTemplate03GoldCharcoalGeometric,
    theme: 'gold',
  },
  {
    id: 'sophi-04-curved-gold-wave',
    name: 'Curved Gold Wave',
    category: 'Creative',
    tag: 'Visual Header',
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    description: 'Dynamic header wave styling combined with clean multi-section body layout.',
    component: SophiTemplate04CurvedGoldWave,
    theme: 'amber',
  },
  {
    id: 'sophi-05-ribbon-graphic-infographic',
    name: 'Ribbon Graphic Infographic',
    category: 'Creative',
    tag: 'Infographic Style',
    badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    description: 'Structured visual ribbon accents, skills rating bars, and modern typography.',
    component: SophiTemplate05RibbonGraphicInfographic,
    theme: 'indigo',
  },
  {
    id: 'sophi-executive-sapphire',
    name: 'Executive Sapphire Pro',
    category: 'Executive',
    tag: 'C-Level & Director',
    badgeBg: 'bg-primary-100 text-primary-900 border-primary-300',
    description: 'Tailored for senior managers, directors, and executives requiring extensive experience depth.',
    component: SophiExecutiveSapphire,
    theme: 'sapphire',
  },
  {
    id: 'sophi-ats-master-corporate',
    name: 'ATS Master Corporate',
    category: 'ATS Corporate',
    tag: '100% ATS Safe',
    badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    description: 'Single-column universal format strictly engineered to score 95+ across all digital HR software.',
    component: SophiATSMasterCorporate,
    theme: 'classic',
  },
  {
    id: 'sophi-modern-emerald-academic',
    name: 'Modern Emerald Academic',
    category: 'Academic',
    tag: 'Research & Faculty',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    description: 'Includes research publications, distinctions, supervision, and structured academic sections.',
    component: SophiModernEmeraldAcademic,
    theme: 'emerald',
  },
  {
    id: 'sophi-creative-coral-modernist',
    name: 'Creative Coral Modernist',
    category: 'Creative',
    tag: 'Design & Tech',
    badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
    description: 'Vibrant accent colors with clean grid separation, ideal for tech leads and creative directors.',
    component: SophiCreativeCoralModernist,
    theme: 'coral',
  },
  {
    id: 'sophi-minimalist-monochrome-pro',
    name: 'Minimalist Monochrome Pro',
    category: 'Minimalist',
    tag: 'Clean Minimal',
    badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
    description: 'Timeless black-and-white minimalist template emphasizing clean whitespace and readability.',
    component: SophiMinimalistMonochromePro,
    theme: 'monochrome',
  },
]

const CATEGORIES = ['All', 'Executive', 'Modern', 'ATS Corporate', 'Minimalist', 'Creative', 'Academic']

export default function TemplatesClient() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [activeModalTemplate, setActiveModalTemplate] = useState<typeof SOPHI_OFFICIAL_TEMPLATES[0] | null>(null)
  const [copiedSample, setCopiedSample] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const copySampleText = () => {
    const sample = `SYED HAMZA ALI
Karachi, Pakistan | +92 300 1234567 | hamza.ali@example.com | linkedin.com/in/hamza-ali-tech

PROFESSIONAL SUMMARY
Results-driven Senior Software Engineer with 7+ years of experience engineering high-scale distributed systems, microservices, and AI-driven platforms. Proven track record leading agile engineering squads, reducing API response latency by 42%, and delivering enterprise solutions with 99.99% uptime.

CORE COMPETENCIES
Full-Stack Engineering | Distributed Systems | Cloud Infrastructure (AWS, GCP) | Next.js & React | Node.js & TypeScript | PostgreSQL, Redis | RESTful APIs & GraphQL | CI/CD Pipelines & Docker | Agile Leadership

PROFESSIONAL EXPERIENCE
SENIOR SOFTWARE ENGINEER & TEAM LEAD
TechLogix Global — Karachi, Pakistan | 2022 – Present
• Architected high-throughput microservices handling 2.5M daily active requests with 99.99% uptime.
• Led cross-functional team of 8 engineers delivering enterprise cloud solutions 3 weeks ahead of deadline.
• Reduced API response times by 42% through query optimization and Redis caching layer implementation.
• Spearheaded automated testing coverage from 45% to 88%, reducing post-release defect rate by 60%.

FULL-STACK DEVELOPER
Systems Limited — Lahore, Pakistan | 2019 – 2022
• Developed high-converting customer portals using Next.js, TypeScript, and Tailwind CSS, increasing user engagement by 28%.
• Implemented automated CI/CD deployment pipelines on AWS ECS, shrinking deployment failure rates to under 1%.
• Collaborated with product and UI/UX designers to redesign the checkout flow, accelerating transaction completion by 35%.

EDUCATION
FAST-NUCES, Karachi, Pakistan
Bachelor of Science in Computer Science (CGPA: 3.8 / 4.0) | 2015 – 2019

CERTIFICATIONS
• AWS Certified Solutions Architect – Associate (2023)
• Certified ScrumMaster (CSM) – Scrum Alliance (2022)`

    navigator.clipboard.writeText(sample)
    setCopiedSample(true)
    toast.success('Sample ATS Friendly Resume copied to clipboard!')
    setTimeout(() => setCopiedSample(false), 2500)
  }

  const filteredTemplates = selectedCategory === 'All'
    ? SOPHI_OFFICIAL_TEMPLATES
    : SOPHI_OFFICIAL_TEMPLATES.filter(t => t.category === selectedCategory)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 relative">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 text-xs font-black text-primary border border-primary-200">
            <Sparkles className="h-4 w-4 text-gold" />
            <span>OFFICIAL ATS CV TEMPLATES & FORMATS GALLERY</span>
          </div>

          <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl leading-tight">
            Free ATS Friendly CV Templates & Resume Formats
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Explore 49+ recruiter-tested applicant tracking system resume templates built to score 95%+ on HR screening filters. Pick an ATS format resume, customize in our ATS cv maker, and download job-ready PDFs.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-black rounded-xl transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-md shadow-primary-950/20 scale-105'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((tmpl, index) => {
            const TemplateComp = tmpl.component
            return (
              <motion.div
                key={tmpl.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden group hover:shadow-2xl hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-[1/1.3] bg-slate-100/80 border-b border-slate-200/80 overflow-hidden flex items-center justify-center p-3">
                  <div className="w-[300px] h-[424px] bg-white shadow-md rounded border border-slate-200 overflow-hidden relative flex justify-center items-start pt-1 pointer-events-none transform scale-[0.38] sm:scale-[0.40] origin-center">
                    <TemplateComp data={SAMPLE_CV_DATA} scale={0.4} />
                  </div>

                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px] flex flex-col items-center justify-center gap-3 p-4">
                    <button
                      type="button"
                      onClick={() => setActiveModalTemplate(tmpl)}
                      className="flex items-center gap-2 bg-white text-slate-950 font-black px-5 py-2.5 rounded-xl shadow-xl hover:bg-amber-300 transition-all transform translate-y-3 group-hover:translate-y-0 text-xs"
                    >
                      <Eye className="h-4 w-4" />
                      Preview Full Size
                    </button>
                    <Link
                      href="/new-cv"
                      className="flex items-center gap-2 bg-gold text-slate-950 font-black px-5 py-2.5 rounded-xl shadow-xl hover:bg-amber-300 transition-all transform translate-y-3 group-hover:translate-y-0 text-xs"
                    >
                      <Sparkles className="h-4 w-4" />
                      Use This Template
                    </Link>
                  </div>
                </div>

                <div className="p-6 space-y-3 bg-white flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="text-base font-black text-slate-950 leading-tight group-hover:text-primary transition-colors">
                        {tmpl.name}
                      </h3>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border shrink-0 ${tmpl.badgeBg}`}>
                        {tmpl.tag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {tmpl.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      ATS Optimized
                    </span>
                    <Link
                      href="/new-cv"
                      className="text-primary hover:text-primary-800 font-extrabold flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                    >
                      <span>Create CV</span>
                      <ArrowRight className="h-3.5 w-3.5 text-gold" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* AEO Section */}
        <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <HelpCircle className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-slate-900">What Makes a CV Template ATS-Compliant?</h2>
          </div>
          <div className="p-4 bg-primary-50/60 rounded-xl border border-primary-100 text-slate-800 text-sm leading-relaxed">
            <strong>Direct Answer:</strong> An ATS-compliant CV template uses single-column layout hierarchy, standard section titles (&quot;Work Experience&quot;, &quot;Education&quot;, &quot;Skills&quot;), standard web-safe fonts, and clean text markup without embedded graphics or hidden tables. Sophi&apos;s templates preserve 100% text-searchability across systems like Workday, Taleo, and Lever.
          </div>
        </section>

        <div className="rounded-3xl bg-gradient-to-br from-primary-950 via-primary-900 to-slate-950 p-8 sm:p-12 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gold/10 blur-3xl" />

          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-black text-amber-300 border border-white/20">
            <ShieldCheck className="h-4 w-4" />
            <span>ALL TEMPLATES INCLUDED IN EVERY CREDIT PACKAGE</span>
          </div>

          <h2 className="text-3xl font-black sm:text-4xl leading-tight">
            Ready to Build Your Winning CV in <S>SOPHI</S>?
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
            Create your CV once with <S>SOPHI</S> AI, and instantly switch between any of these premium templates in 1 click.
          </p>

          <div className="flex justify-center pt-2">
            <Link
              href="/new-cv"
              className="inline-flex items-center gap-2 px-8 py-4 text-sm font-black text-slate-950 bg-gold hover:bg-amber-300 rounded-xl transition-all shadow-xl hover:scale-105"
            >
              <Sparkles className="h-4 w-4" />
              Build & Revamp CV Now
            </Link>
          </div>
        </div>

        {/* --- SECTION 1: SAMPLE ATS FRIENDLY RESUME (COPYABLE) --- */}
        <section className="bg-white rounded-3xl border border-slate-200 p-8 lg:p-12 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-primary bg-primary-50 px-3 py-1 rounded-full border border-primary-200">
                Sample ATS Friendly Resume & Template Example
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
                Recruiter-Tested Sample ATS Friendly Resume Format
              </h2>
              <p className="text-sm text-slate-600 max-w-2xl">
                Need a proven text layout? Below is a recruiter-approved, 100% parseable ATS resume sample. Copy the plain text structure or customize it in our automated ATS resume maker.
              </p>
            </div>
            <button
              type="button"
              onClick={copySampleText}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-all shadow-sm self-start md:self-auto"
            >
              {copiedSample ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-amber-300" />
                  <span>Copy Sample ATS Resume</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-slate-950 rounded-2xl p-6 sm:p-8 text-slate-200 font-mono text-xs leading-relaxed overflow-x-auto border border-slate-800">
            <pre className="whitespace-pre-wrap font-mono">
{`SYED HAMZA ALI
Karachi, Pakistan | +92 300 1234567 | hamza.ali@example.com | linkedin.com/in/hamza-ali-tech

PROFESSIONAL SUMMARY
Results-driven Senior Software Engineer with 7+ years of experience engineering high-scale distributed systems, microservices, and AI-driven platforms. Proven track record leading agile engineering squads, reducing API response latency by 42%, and delivering enterprise solutions with 99.99% uptime.

CORE COMPETENCIES
Full-Stack Engineering | Distributed Systems | Cloud Infrastructure (AWS, GCP) | Next.js & React | Node.js & TypeScript | PostgreSQL, Redis | RESTful APIs & GraphQL | CI/CD Pipelines & Docker | Agile Leadership

PROFESSIONAL EXPERIENCE
SENIOR SOFTWARE ENGINEER & TEAM LEAD
TechLogix Global — Karachi, Pakistan | 2022 – Present
• Architected high-throughput microservices handling 2.5M daily active requests with 99.99% uptime.
• Led cross-functional team of 8 engineers delivering enterprise cloud solutions 3 weeks ahead of deadline.
• Reduced API response times by 42% through query optimization and Redis caching layer implementation.
• Spearheaded automated testing coverage from 45% to 88%, reducing post-release defect rate by 60%.

FULL-STACK DEVELOPER
Systems Limited — Lahore, Pakistan | 2019 – 2022
• Developed high-converting customer portals using Next.js, TypeScript, and Tailwind CSS, increasing user engagement by 28%.
• Implemented automated CI/CD deployment pipelines on AWS ECS, shrinking deployment failure rates to under 1%.
• Collaborated with product and UI/UX designers to redesign the checkout flow, accelerating transaction completion by 35%.

EDUCATION
FAST-NUCES, Karachi, Pakistan
Bachelor of Science in Computer Science (CGPA: 3.8 / 4.0) | 2015 – 2019

CERTIFICATIONS
• AWS Certified Solutions Architect – Associate (2023)
• Certified ScrumMaster (CSM) – Scrum Alliance (2022)`}
            </pre>
          </div>
        </section>

        {/* --- SECTION 2: THE ANATOMY OF AN ATS FRIENDLY RESUME FORMAT --- */}
        <section className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary flex items-center justify-center">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              1. Single-Column Hierarchy
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every applicant tracking system resume template must maintain a single-column linear layout. Two-column sidebars, floating text blocks, and graphic skill bars scramble parser text engines like Workday and Taleo.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              2. Standard ATS CV Formats
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Stick to universally recognized section titles: <em>Work Experience</em>, <em>Core Skills</em>, and <em>Education</em>. Creative labels like "My Journey" or "What I Do" confuse ATS indexing algorithms.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              3. STAR-Formula Metrics
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              An effective ATS format resume uses the STAR formula (Situation, Task, Action, Result). Start every bullet with strong action verbs and back up your achievements with tangible percentages and revenue numbers.
            </p>
          </div>
        </section>

        {/* --- SECTION 3: ATS RESUME FORMAT VS GRAPHIC FORMAT TABLE --- */}
        <section className="bg-white rounded-3xl border border-slate-200 p-8 lg:p-12 shadow-sm space-y-8">
          <div className="space-y-2 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
              ATS Format Resume vs. Graphic Multi-Column Resume
            </h2>
            <p className="text-sm text-slate-600">
              Why 75% of stylish Canva resumes get auto-rejected by corporate applicant tracking systems.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <th className="py-3 px-4 font-black">Evaluation Criteria</th>
                  <th className="py-3 px-4 font-black text-emerald-700">Sophi ATS Friendly Resume Template</th>
                  <th className="py-3 px-4 font-black text-rose-700">Graphic / Canva Template</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">ATS Parsing Compatibility</td>
                  <td className="py-3 px-4 text-emerald-700 font-semibold">98%+ Parse Accuracy (Workday, Taleo, Greenhouse)</td>
                  <td className="py-3 px-4 text-rose-700">Under 40% (Parsed out of order)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Layout Structure</td>
                  <td className="py-3 px-4">Single-column or linear flow with clear hierarchical headings</td>
                  <td className="py-3 px-4">Complex 2-to-3 column tables & textboxes</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Font & Typography</td>
                  <td className="py-3 px-4">System fonts (Inter, Arial, Calibri, Georgia)</td>
                  <td className="py-3 px-4">Custom web fonts, script lettering, icon fonts</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Keyword Density & Extraction</td>
                  <td className="py-3 px-4 text-emerald-700 font-semibold">100% searchable text tags & hard skill matches</td>
                  <td className="py-3 px-4 text-rose-700">Text embedded in images or unreadable tables</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Export Compatibility</td>
                  <td className="py-3 px-4">Vector-encoded ATS PDF & Word DOCX</td>
                  <td className="py-3 px-4">Rasterized image PDF or flattened graphic</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* --- SECTION 4: FREQUENTLY ASKED QUESTIONS (ATS TEMPLATES & FORMATS) --- */}
        <section className="bg-slate-100 rounded-3xl p-8 lg:p-12 border border-slate-200/80 space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
              Frequently Asked Questions About ATS Templates & Formats
            </h2>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {[
              {
                q: 'What is an ATS friendly resume format?',
                a: 'An ATS friendly resume format is an organized layout designed specifically to be scanned by Applicant Tracking System software (like Workday, Taleo, Greenhouse, and Lever). It uses a clean reverse-chronological structure, standardized section headers (Work Experience, Skills, Education), clean web-safe fonts, and avoids tables, icons, or floating text boxes.'
              },
              {
                q: 'What makes an applicant tracking system resume template different from a regular CV?',
                a: 'Standard graphic CVs focus on visual flair, using multi-column bars and graphics that confuse software parsers. An applicant tracking system resume template organizes data linearly so the algorithm can instantly identify your name, job title, years of experience, and hard skills.'
              },
              {
                q: 'Can I download a free ATS resume template in PDF format?',
                a: 'Yes! Sophi offers free ATS friendly resume templates you can export as vector-encoded PDFs. Unlike scanned image PDFs, our PDFs retain live selectable text, guaranteeing high readability across all screening software.'
              },
              {
                q: 'How does an ATS resume maker help format my bullet points?',
                a: 'An automated ATS resume builder and CV maker takes your raw experience and rewrites it into the STAR format (Action Verb + Context + Metric). It also suggests industry-specific keywords that match job descriptions in your field.'
              },
              {
                q: 'What are the best fonts for an ATS format resume?',
                a: 'The most reliable ATS-friendly fonts are clean sans-serif and serif fonts: Arial, Calibri, Helvetica, Georgia, Times New Roman, and Inter. Avoid decorative, handwriting, or novelty fonts that ATS character-recognition engines cannot decipher.'
              },
              {
                q: 'Can ATS software read two-column resumes?',
                a: 'Most ATS software reads left-to-right across the page. With two-column designs, the system often merges text from column 1 into column 2 horizontally, turning your sentences into gibberish. That is why recruiters strongly advise sticking to single-column or carefully structured ATS friendly templates.'
              }
            ].map((faq, idx) => {
              const isOpen = openFaq === idx
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base hover:text-primary transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-slate-400 shrink-0 transition-transform ${
                        isOpen ? 'rotate-180 text-primary' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      </main>

      <AnimatePresence>
        {activeModalTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-slate-200 p-6 sm:p-8 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black text-slate-950">{activeModalTemplate.name}</h2>
                    <span className={`text-xs font-black uppercase px-2.5 py-1 rounded-full border ${activeModalTemplate.badgeBg}`}>
                      {activeModalTemplate.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{activeModalTemplate.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModalTemplate(null)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex justify-center bg-slate-100 p-6 rounded-2xl border border-slate-200 overflow-x-auto">
                <div className="bg-white shadow-2xl rounded p-2">
                  {React.createElement(activeModalTemplate.component, {
                    data: SAMPLE_CV_DATA,
                    scale: 0.85,
                  })}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
                <div className="text-xs text-slate-500 font-semibold">
                  100% ATS Compliant • Instant PDF Download • Custom Color Support
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setActiveModalTemplate(null)}
                    className="flex-1 sm:flex-none px-5 py-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Close Preview
                  </button>
                  <Link
                    href="/new-cv"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-xs font-black text-white hover:bg-primary-800 shadow-md"
                  >
                    <Sparkles className="h-4 w-4 text-gold" />
                    Use This Template
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
