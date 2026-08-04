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
    id: 'what-is-sophi',
    question: 'What is SOPHI and how does it work?',
    answer: 'SOPHI is an AI-powered CV builder tailored for Pakistani and Gulf job markets. Simply upload your existing resume, and our specialized AI rewrites it into a high-scoring, ATS-optimized CV, complete with an executive summary, achievement metrics, cover letter, and LinkedIn profile tips — delivered in under 60 seconds.'
  },
  {
    id: 'ats-importance',
    question: 'What is an ATS score and why does it matter?',
    answer: 'An Applicant Tracking System (ATS) is automated software used by over 90% of employers to filter job applications before recruiters read them. If your CV lacks correct keywords or uses incompatible formatting, it gets auto-rejected. SOPHI scores your CV against real ATS criteria and restructures it to ensure it reaches human recruiters.'
  },
  {
    id: 'sophi-features',
    question: 'What features are included in SOPHI?',
    answer: 'SOPHI includes complete ATS score auditing, experience gap analysis, job-tailored resume generation, AI cover letter writing, LinkedIn profile optimization, and step-by-step CV creation from scratch or 30-second transformation of existing resumes.'
  },
  {
    id: 'delivery-time',
    question: 'How fast does SOPHI generate my CV?',
    answer: 'Generation is instant! As soon as you upload your resume or enter your details, our AI generates your optimized resume, cover letter, and ATS score report directly on screen in under 30 seconds. You can download your polished documents immediately as PDF files.'
  },
  {
    id: 'formatting-guarantee',
    question: 'Will my CV formatting work for corporate and tech companies?',
    answer: 'Yes! SOPHI uses clean, ATS-compliant single-column and multi-section layouts recommended by top HR professionals across Karachi, Lahore, Islamabad, and UAE tech hubs.'
  }
];

export default function FAQAccordion() {
  const [openId, setOpenId] = useState<string | null>('what-is-sophi');

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
