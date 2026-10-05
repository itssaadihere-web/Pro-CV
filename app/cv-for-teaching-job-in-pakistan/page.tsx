import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import Script from 'next/script';
import Header from '@/components/Header';
import {
  Sparkles, GraduationCap, BookOpen, Award, CheckCircle2,
  Copy, ArrowRight, ShieldCheck, Check, FileText, School,
  Layers, HelpCircle, ChevronRight
} from 'lucide-react';
import { teachingCvPakistanSchema, createBreadcrumbSchema } from '@/lib/schema';
import TeacherCvSampleBox from './TeacherCvSampleBox';

export const metadata: Metadata = {
  title: 'CV for Teaching Job in Pakistan — Free ATS Teacher Resume Format & Sample | Sophi',
  description: 'Download recruiter-approved CV formats and samples for teaching jobs in Pakistan. Tailored for Beaconhouse, City School, Roots, LGS, APS, and HEC university lecturer roles.',
  keywords: [
    'cv for teaching job in pakistan',
    'teacher cv format pakistan',
    'teaching resume sample pakistan',
    'beaconhouse teacher cv format',
    'the city school teacher cv sample',
    'lecturer cv format pakistan',
    'ats cv for teachers pakistan',
    'school teacher resume pakistan',
    'free ats resume builder'
  ],
  alternates: {
    canonical: 'https://joinsophi.com/cv-for-teaching-job-in-pakistan'
  },
  openGraph: {
    title: 'CV for Teaching Job in Pakistan — Free ATS Teacher Resume Format & Sample | Sophi',
    description: 'Get the recruiter-approved CV format for teaching jobs in Pakistan. Built for O/A Level, Matric, and university lecturer applications.',
    url: 'https://joinsophi.com/cv-for-teaching-job-in-pakistan',
    siteName: 'Sophi',
    type: 'website',
    images: [{ url: 'https://joinsophi.com/og/home.png', width: 1200, height: 630, alt: 'CV for Teaching Job in Pakistan' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CV for Teaching Job in Pakistan — ATS Teacher Resume Format | Sophi',
    description: 'Recruiter-approved teacher CV templates and formatting guidelines for Pakistan schools and colleges.',
    images: ['https://joinsophi.com/og/home.png']
  }
};

export default function TeachingJobCvPakistanPage() {
  const breadcrumb = createBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'CV Templates', url: '/templates' },
    { name: 'CV for Teaching Job in Pakistan', url: '/cv-for-teaching-job-in-pakistan' }
  ]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Script
        id="teaching-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Script
        id="teaching-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(teachingCvPakistanSchema) }}
      />

      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
        {/* HERO SECTION */}
        <section className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-black text-emerald-800 border border-emerald-200">
            <GraduationCap className="h-4 w-4 text-emerald-600" />
            <span>PAKISTAN EDUCATION CAREER GUIDE & ATS TEMPLATE</span>
          </div>

          <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl leading-tight">
            CV for Teaching Job in Pakistan: <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-700 via-primary to-slate-900 bg-clip-text text-transparent">
              ATS-Friendly Formats & Samples
            </span>
          </h1>

          <p className="text-base text-slate-600 leading-relaxed font-medium">
            Whether applying to elite private school systems like Beaconhouse, The City School, Roots, and LGS, or applying for HEC college and university lecturer roles — your CV must pass digital screening and impress academic coordinators.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/new-cv"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-white text-xs font-black hover:bg-primary-800 shadow-md transition-all hover:scale-105"
            >
              <Sparkles className="h-4 w-4 text-gold" />
              <span>Create My Teacher CV Now</span>
            </Link>
            <Link
              href="/ats-checker"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-all"
            >
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Check Existing CV ATS Score</span>
            </Link>
          </div>
        </section>

        {/* COPYABLE SAMPLE BOX (CLIENT COMPONENT) */}
        <TeacherCvSampleBox />

        {/* SECTION: WHAT PAKISTANI SCHOOLS & COLLEGES LOOK FOR */}
        <section className="bg-white rounded-3xl border border-slate-200 p-8 lg:p-12 shadow-sm space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Recruiter Criteria
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
              What Academic Recruiters in Pakistan Look For in a Teacher CV
            </h2>
            <p className="text-sm text-slate-600">
              Principals and HR heads at top institutions evaluate candidate CVs on 4 vital anchors:
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Curriculum Mastery</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                State clearly whether your experience lies in Cambridge (CAIE O/A Levels, IGCSE), International Baccalaureate (IB), or Federal / Punjab Matric & FSc boards.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary flex items-center justify-center">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Quantified Exam Results</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Avoid generic duties like "taught biology". Highlight concrete metrics: "Maintained 94% A*-B grades across 85 O-Level Biology students in 2024".
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <School className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Pedagogical Credentials</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Include your B.Ed, M.Ed, or Cambridge Professional Development Qualifications (PDQs), TEFL/CELTA, and subject-specific certifications.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">EdTech Integration</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Demonstrate proficiency with digital learning tools: Google Classroom, Microsoft Teams for Education, Kahoot, smart boards, and digital LMS.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION: TARGET INSTITUTIONS IN PAKISTAN */}
        <section className="bg-slate-900 text-white rounded-3xl p-8 lg:p-12 space-y-8">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-black uppercase tracking-wider text-amber-300">
              Institutional Alignment
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">
              Tailoring Your CV by Educational Sector in Pakistan
            </h2>
            <p className="text-sm text-slate-300">
              Adapt your CV tone and keywords based on where you are submitting your job application:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-3">
              <h3 className="text-lg font-bold text-amber-300">
                1. Private School Systems
              </h3>
              <p className="text-xs text-slate-400">
                Beaconhouse, The City School, Roots Millennium, LGS, Froebel&apos;s, Army Public Schools (APS).
              </p>
              <ul className="text-xs text-slate-300 space-y-2 pt-2">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Emphasize English fluency and interactive learning methods</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Highlight parent counseling and extracurricular coaching</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-3">
              <h3 className="text-lg font-bold text-amber-300">
                2. Colleges & Cadet Colleges
              </h3>
              <p className="text-xs text-slate-400">
                Forman Christian College, Punjab Group of Colleges, KIPS, Cadet College Hasan Abdal / Kohat.
              </p>
              <ul className="text-xs text-slate-300 space-y-2 pt-2">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Highlight Board exam preparation track record (BISE positions)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Discipline, lab supervision, and entrance test guidance (MDCAT/ECAT)</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-3">
              <h3 className="text-lg font-bold text-amber-300">
                3. Higher Education & HEC Universities
              </h3>
              <p className="text-xs text-slate-400">
                NUST, FAST-NUCES, LUMS, Quaid-i-Azam University, COMSATS, Karachi University.
              </p>
              <ul className="text-xs text-slate-300 space-y-2 pt-2">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>List HEC-recognized research journals (W, X, Y category publications)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Postgraduate thesis supervision and grant awards</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION: FAQS */}
        <section className="bg-white rounded-3xl p-8 lg:p-12 border border-slate-200 space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Teacher Career FAQs
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
              Frequently Asked Questions: Teaching Jobs in Pakistan
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">
                What is the best CV format for a teaching job in Pakistan?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                A single-column reverse-chronological academic CV format is ideal. It prominently features your Teaching Summary, Subjects & Grade Levels, Quantified Exam Results, HEC degrees, and Pedagogical Certifications.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">
                Do schools like Beaconhouse and City School use ATS resume screening?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Yes. Due to high applicant volumes during hiring seasons, leading private chains use digital HR portals that scan applicant resumes for subject keywords, qualifications, and years of classroom experience.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">
                Is a B.Ed mandatory for teaching jobs in private schools in Pakistan?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                While government school jobs mandate B.Ed/M.Ed degrees, elite Cambridge private schools often prioritize subject mastery (Master&apos;s/BS in the relevant subject), English fluency, and Cambridge teaching workshops over traditional B.Ed degrees.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">
                How should I format research papers on a university lecturer CV?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Follow APA or IEEE citation format under a dedicated "Research & Publications" section, specifying journal name, volume, impact factor, and whether it is HEC recognized (W/X/Y category).
              </p>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA BANNER */}
        <section className="bg-gradient-to-r from-emerald-900 via-primary-950 to-slate-900 rounded-3xl p-8 lg:p-12 text-center text-white space-y-6 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-black max-w-xl mx-auto">
            Ready to Build Your Teacher CV and Land Your Next Role?
          </h2>
          <p className="text-slate-300 text-sm max-w-md mx-auto">
            Create an ATS-proof teaching resume in 60 seconds with Sophi AI CV Builder.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/new-cv"
              className="inline-flex items-center gap-2 px-8 py-4 text-xs font-black text-slate-950 bg-gold hover:bg-amber-300 rounded-xl transition-all shadow-xl hover:scale-105"
            >
              <Sparkles className="h-4 w-4" />
              <span>Create My Teacher CV Free</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
