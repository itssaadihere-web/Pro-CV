'use client'

import React, { useState } from 'react'
import Header from '@/components/Header'
import Link from 'next/link'
import Script from 'next/script'
import { motion } from 'framer-motion'
import {
  Mail, MessageSquare, MapPin, Clock, Send,
  CheckCircle2, HelpCircle, ShieldCheck, Sparkles,
  PhoneCall, ExternalLink
} from 'lucide-react'
import { LinkedinIcon, InstagramIcon, FacebookIcon } from '@/components/SocialIcons'

const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  'name': 'Contact Sophi AI Support',
  'description': 'Customer support, business inquiries, and technical help for Sophi AI CV platform.',
  'url': 'https://joinsophi.com/contact',
  'mainEntity': {
    '@type': 'Organization',
    'name': 'Sophi',
    'email': 'support@joinsophi.com',
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': 'Karachi',
      'addressCountry': 'PK'
    },
    'contactPoint': {
      '@type': 'ContactPoint',
      'contactType': 'Customer Support',
      'email': 'support@joinsophi.com',
      'availableLanguage': ['English', 'Urdu']
    }
  }
}

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('general')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) return

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <Script
        id="contact-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <Header />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 text-white py-20 px-4 sm:px-6">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(ellipse at 20% 60%, rgba(99,102,241,0.25) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(245,158,11,0.15) 0%, transparent 50%)'
        }} />

        <div className="relative max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-xs font-extrabold text-amber-300 tracking-wider">
            <Mail className="h-3.5 w-3.5 fill-amber-300" />
            WE ARE HERE TO HELP
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            Get in Touch with <span className="text-[#c5a059]">Sophi</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-medium">
            Have questions about ATS CV optimization, billing, or enterprise partnerships? Our dedicated support team is ready to assist you.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Info & Channels */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Contact Channels</h2>
              <p className="text-slate-600 text-sm mt-1">
                Reach out directly via email or our official social channels. We respond to all inquiries within 24 business hours.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Customer & Technical Support</h3>
                  <p className="text-slate-500 text-xs mt-0.5">For account issues, credit packages, or resume queries</p>
                  <a href="mailto:support@joinsophi.com" className="text-primary font-bold text-sm mt-1.5 inline-block hover:underline">
                    support@joinsophi.com
                  </a>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Response Time</h3>
                  <p className="text-slate-500 text-xs mt-0.5">Monday through Saturday</p>
                  <p className="text-slate-800 font-semibold text-xs mt-1">Average response time: &lt; 24 Hours</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Headquarters</h3>
                  <p className="text-slate-600 text-xs mt-0.5">Sophi AI Engineering Hub</p>
                  <p className="text-slate-800 font-semibold text-xs mt-1">Karachi, Sindh, Pakistan</p>
                </div>
              </div>
            </div>

            {/* Social Channels */}
            <div className="pt-4 border-t border-slate-200">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">Connect on Social</h3>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.linkedin.com/company/joinsophi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                >
                  <LinkedinIcon className="h-4 w-4" />
                  LinkedIn
                </a>
                <a
                  href="https://www.instagram.com/joinsophi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                >
                  <InstagramIcon className="h-4 w-4" />
                  Instagram
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61591961077475"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                >
                  <FacebookIcon className="h-4 w-4" />
                  Facebook
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary-50 to-amber-50 border border-primary-100 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Frequently Requested Resources
              </h4>
              <ul className="space-y-2 text-xs font-semibold text-slate-600">
                <li>
                  <Link href="/ats-checker" className="hover:text-primary transition-colors flex items-center justify-between">
                    <span>Free ATS Compatibility Audit</span>
                    <ExternalLink className="h-3 w-3 text-slate-400" />
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-primary transition-colors flex items-center justify-between">
                    <span>Package Rates & Credit Information</span>
                    <ExternalLink className="h-3 w-3 text-slate-400" />
                  </Link>
                </li>
                <li>
                  <Link href="/refund-policy" className="hover:text-primary transition-colors flex items-center justify-between">
                    <span>Return & Refund Policy</span>
                    <ExternalLink className="h-3 w-3 text-slate-400" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
              <div className="mb-6">
                <h2 className="text-2xl font-black text-slate-900">Send Us a Message</h2>
                <p className="text-slate-500 text-sm mt-1">
                  Fill out the form below and our support team will get back to you shortly.
                </p>
              </div>

              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">Message Received!</h3>
                  <p className="text-slate-600 text-sm max-w-md mx-auto">
                    Thank you for contacting Sophi. Our team has received your message and will respond to <strong className="text-slate-900">{email}</strong> within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false)
                      setName('')
                      setEmail('')
                      setMessage('')
                    }}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-800 transition-all mt-4"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Your Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Ali Khan"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. ali@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Inquiry Category
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white"
                    >
                      <option value="general">General Inquiry & Feedback</option>
                      <option value="billing">Billing & Payment Support</option>
                      <option value="ats">ATS Score & CV Generation Help</option>
                      <option value="enterprise">Corporate & University Partnerships</option>
                      <option value="privacy">Privacy & Data Requests</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Your Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please describe how we can assist you..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-primary text-white text-sm font-black hover:bg-primary-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                    >
                      {loading ? (
                        <span>Sending message...</span>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>Submit Inquiry</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                    By submitting this form, you agree to our{' '}
                    <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link> and{' '}
                    <Link href="/terms-and-conditions" className="text-primary hover:underline">Terms of Service</Link>.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
