'use client'

import React from 'react';
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, CheckCircle, HelpCircle } from 'lucide-react';

interface CityProps {
  cityName: string;
  badgeText: string;
  heading: string;
  description: string;
  landmarks: string;
  sectors: string;
  imageAlt: string;
}

export default function CityCvBuilderClient({
  cityName,
  badgeText,
  heading,
  description,
  landmarks,
  sectors,
  imageAlt
}: CityProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3.5 py-1.5 text-xs font-extrabold text-primary"
            >
              <span>{badgeText}</span>
            </motion.div>
            
            <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl leading-[1.1]">
              {heading}
            </h1>
            
            <p className="text-lg text-slate-600 leading-relaxed">
              {description}
            </p>

            <ul className="space-y-3">
              <li className="flex items-center gap-3 font-medium text-slate-700">
                <CheckCircle className="w-5 h-5 text-emerald-500" /> Bypass corporate recruitment ATS screeners
              </li>
              <li className="flex items-center gap-3 font-medium text-slate-700">
                <CheckCircle className="w-5 h-5 text-emerald-500" /> Optimized for top employers in {landmarks}
              </li>
              <li className="flex items-center gap-3 font-medium text-slate-700">
                <CheckCircle className="w-5 h-5 text-emerald-500" /> Tailored keywords for {sectors}
              </li>
            </ul>

            <div className="pt-4">
              <Link href="/login" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-800 transition-all shadow-lg">
                Build My {cityName} CV Now <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-100 to-gold-100 rounded-3xl transform rotate-3" />
            <img 
              src="/images/cv_hero.png" 
              alt={imageAlt}
              className="relative rounded-3xl border border-white shadow-xl w-full object-cover"
            />
          </div>
        </div>

        {/* AEO Q&A Direct Answer Callout */}
        <section className="mt-20 max-w-4xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <HelpCircle className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-slate-900">Why Use an AI CV Builder for Jobs in {cityName}?</h2>
          </div>
          <div className="p-4 bg-primary-50/60 rounded-xl border border-primary-100 text-slate-800 text-sm leading-relaxed">
            <strong>Direct Answer:</strong> Top employers and multinationals in {cityName} (located near {landmarks}) use automated Applicant Tracking Systems (ATS) to filter job applications. Sophi AI restructures your resume with industry-specific keywords and STAR metrics tailored to {cityName}&apos;s job market, boosting your ATS score above 85% to secure recruiter interviews.
          </div>
        </section>
      </main>
    </div>
  );
}
