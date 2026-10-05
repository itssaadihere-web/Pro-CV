'use client';

import React, { useState } from 'react';
import { Copy, Check, School, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TeacherCvSampleBox() {
  const [copied, setCopied] = useState(false);

  const sampleTeacherCv = `FATIMA ZAHRA, M.Phil, B.Ed
Lahore, Pakistan | +92 301 9876543 | fatima.zahra.edu@example.com | linkedin.com/in/fatima-zahra-teaching

PROFESSIONAL SUMMARY
Passionate and results-driven Senior O/A Level Chemistry & General Science Teacher with 6+ years of classroom experience at premier Cambridge institutions in Lahore. Proven track record achieving a 92% A*-B CAIE result rate across 140+ students. Skilled in differentiated instruction, Cambridge CAIE curriculum planning, digital STEM laboratories, and interactive classroom engagement.

CORE COMPETENCIES & TEACHING SKILLS
• Curriculum Design: Cambridge CAIE (O-Level, IGCSE & A-Level Chemistry), Federal Board / Punjab BISE
• Instructional Techniques: Inquiry-Based Learning, Differentiated Instruction, STEM Labs, Formative Assessment
• Educational Technology: Google Classroom, Microsoft Teams for Education, Kahoot, PhET Interactive Simulations
• Student Development: Career & Academic Counseling, Science Olympiad Mentorship, Parent-Teacher Communication

PROFESSIONAL TEACHING EXPERIENCE
SENIOR CAMBRIDGE O-LEVEL CHEMISTRY TEACHER
Beaconhouse School System (Canal Side Campus) — Lahore, Pakistan | Aug 2021 – Present
• Delivered comprehensive CAIE O-Level Chemistry curriculum (Syllabus 5070) to 120+ students annually.
• Raised cohort CAIE A*-B grade yield from 78% to 92% over 3 consecutive academic cycles.
• Designed 25+ hands-on laboratory practical modules integrating safety standards and interactive virtual simulations.
• Mentored 4 student teams competing in the National Science Bowl, securing 1st and 2nd runner-up positions.
• Conducted weekly remedial sessions for underperforming students, lifting average test scores by 26%.

SECONDARY SCIENCE & CHEMISTRY TEACHER
The City School (Gulberg Campus) — Lahore, Pakistan | Aug 2018 – Jul 2021
• Taught General Science (Grades 7–8) and introductory O-Level Chemistry to diverse cohorts of 150+ learners.
• Pioneered the school's digital homework & quiz portal via Google Classroom, boosting assignment submission rates to 98%.
• Organized annual inter-campus Science Fair with over 35 interactive student projects attended by 600+ parents.
• Received "Educator of the Term" distinction (Spring 2020) for excellence in online teaching during hybrid instruction.

EDUCATION
UNIVERSITY OF THE PUNJAB, Lahore, Pakistan
M.Phil in Chemistry | 2016 – 2018
• First Division (CGPA: 3.72 / 4.0) | Research in Analytical Chemistry

UNIVERSITY OF EDUCATION, Lahore, Pakistan
Bachelor of Education (B.Ed — 1.5 Years) | 2018 – 2019
• Specialized in Secondary Science Pedagogy & Assessment

LAHORE COLLEGE FOR WOMEN UNIVERSITY (LCWU), Lahore, Pakistan
Bachelor of Science (BS Hons) in Chemistry | 2012 – 2016
• First Division Honors

CERTIFICATIONS & WORKSHOPS
• Cambridge CAIE Extension Training: O-Level Chemistry (5070) — Cambridge Assessment International Education (2023)
• Certificate in Differentiated Instruction & Inclusive Classrooms — British Council Pakistan (2022)
• Google Certified Educator (Level 1) — Google for Education (2021)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleTeacherCv);
    setCopied(true);
    toast.success('Teaching CV sample copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="bg-white rounded-3xl border border-slate-200 p-8 lg:p-12 shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Copyable Resume Template
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
            Sample CV for Teaching Job in Pakistan (Cambridge / Senior School)
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl">
            This recruiter-tested sample demonstrates standard section ordering, quantified CAIE results, HEC academic degrees, and Cambridge workshops. Click below to copy and personalize.
          </p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-all shadow-sm shrink-0 self-start md:self-auto"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-emerald-400" />
              <span>Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 text-amber-300" />
              <span>Copy Teaching CV Sample</span>
            </>
          )}
        </button>
      </div>

      <div className="bg-slate-950 rounded-2xl p-6 sm:p-8 text-slate-200 font-mono text-xs leading-relaxed overflow-x-auto border border-slate-800">
        <pre className="whitespace-pre-wrap font-mono">{sampleTeacherCv}</pre>
      </div>
    </section>
  );
}
