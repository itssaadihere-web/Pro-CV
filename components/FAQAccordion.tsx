'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    id: 'ats-rejection-reasons',
    question: 'What are the most common reasons an ATS rejects a resume before a human sees it?',
    answer: 'Applicant Tracking Systems (ATS) automatically filter out resumes due to missing role-specific keywords, multi-column graphic layouts, tables/text boxes that scramble text extraction, unparseable PDF headers/footers, and non-standard section titles. SOPHI AI restructures your resume into single-column ATS-safe formatting with 100% parseable text.'
  },
  {
    id: 'ats-formatting-rules',
    question: 'How do I format my resume so that applicant tracking systems can read it correctly?',
    answer: 'To ensure 100% ATS readability, use a clean single-column layout, standard web-safe fonts (Geist, Inter, Arial), standard headings ("Work Experience", "Education", "Skills"), and STAR-metric bullet points (Action Verb + Context + Result). SOPHI AI automatically formats your document to pass 100% of corporate ATS screeners.'
  },
  {
    id: 'pakistan-keywords',
    question: 'Which keywords should I include to pass ATS screening for corporate jobs in Pakistan?',
    answer: 'Include role-specific hard skills (Financial Modeling, React.js, FMCG Supply Chain, Digital Strategy), quantitative achievement metrics, tool proficiencies (SAP ERP, Excel, Python, CRM), and terms matched from job descriptions. SOPHI AI analyzes top employer requirements across Karachi, Lahore, and Islamabad to auto-inject high-ranking keywords.'
  },
  {
    id: 'check-ats-compatibility',
    question: 'How do I check if my resume is ATS-compatible before submitting an application?',
    answer: 'Use SOPHI\'s free ATS CV Checker at joinsophi.com/ats-checker. SOPHI evaluates your resume across 5 dimensions: keyword density, formatting compliance, semantic match, experience depth, and section structure, generating an instant score and quick fixes in 30 seconds.'
  },
  {
    id: 'job-tailoring-customization',
    question: 'How do I customize my CV for job roles on Pakistani portals like Rozee.pk or Sophi Careers?',
    answer: 'Paste any target job description into SOPHI Job Tailor at joinsophi.com/tailor-cv. SOPHI AI automatically realigns your summary, experience bullet points, and skills section to match target role requirements in under 30 seconds.'
  },
  {
    id: 'linkedin-sections-importance',
    question: 'What are the most important sections of a LinkedIn profile that recruiters look at first?',
    answer: 'Recruiters focus first on your Headline (target title + core keywords), About Summary (3-line achievement hook with career proof figures), Work Experience (STAR accomplishment bullets), and Top Skills. SOPHI LinkedIn Optimizer generates these high-converting profile sections automatically.'
  },
  {
    id: 'explaining-employment-gaps',
    question: 'How do I explain a gap in my employment history when applying for jobs in Pakistan?',
    answer: 'Frame employment gaps around freelance projects, consulting, upskilling, certifications, or personal development. Focus on continuous professional growth in your executive summary. SOPHI AI automatically formats gap years using value-oriented framing.'
  },
  {
    id: 'ats-format-compatibility',
    question: 'What CV format is most compatible with ATS systems?',
    answer: 'The single-column chronological PDF or DOCX format is 100% compatible with ATS systems like Taleo, Workday, Greenhouse, and Lever. SOPHI provides 49 recruiter-approved single-column templates designed for maximum ATS parsing accuracy.'
  }
];

export default function FAQAccordion() {
  const [openId, setOpenId] = useState<string | null>('ats-rejection-reasons');

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="space-y-3 max-w-3xl mx-auto">
      {faqs.map((faq) => {
        const isOpen = openId === faq.id;
        return (
          <div
            key={faq.id}
            className={`border rounded-2xl transition-all overflow-hidden ${
              isOpen
                ? 'bg-primary-950 text-white border-primary-800 shadow-lg shadow-primary-950/20'
                : 'bg-white text-slate-900 border-slate-200 hover:border-primary-200 hover:shadow-sm shadow-sm'
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(faq.id)}
              className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className={`text-base font-bold pr-4 leading-snug ${isOpen ? 'text-white' : 'text-slate-900'}`}>
                {faq.question}
              </span>
              <div className={`p-2 rounded-full transition-transform duration-300 flex-shrink-0 ${
                isOpen
                  ? 'bg-primary-800 text-gold rotate-180'
                  : 'bg-primary-50 text-primary border border-primary-100'
              }`}>
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>

            {isOpen && (
              <div className="px-6 pb-6 pt-1 text-primary-100 text-sm leading-relaxed border-t border-primary-800/40">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
