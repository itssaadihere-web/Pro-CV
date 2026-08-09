'use client'

import React, { useState, useEffect } from 'react'
import { Search, MapPin, Briefcase, ArrowRight } from 'lucide-react'

function S({ children, dark }: { children?: React.ReactNode; dark?: boolean }) {
  return (
    <span className={`font-black tracking-wide ${dark ? 'text-[#c5a059]' : 'text-primary'}`}>
      SOPHI
    </span>
  )
}

export default function CareerPortalSearch() {
  const [portalStats, setPortalStats] = useState<{ jobs: number; companies: number } | null>(null)

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/portal-stats')
        if (res.ok) {
          const data = await res.json()
          setPortalStats(data)
        }
      } catch (err) {
        console.error('Failed to fetch portal stats:', err)
      }
    }
    loadStats()
  }, [])

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 sm:p-8 text-white shadow-2xl space-y-6 relative overflow-hidden animate-fade-in">
      {/* Decorative background glow inside box */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-amber-500/10 blur-3xl" />

      {/* Box Header Badge */}
      <div className="flex items-center justify-between border-b border-slate-800/90 pb-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-400/10 border border-amber-400/30 px-2.5 py-1 text-[11px] font-black text-amber-300 tracking-wider">
            <Briefcase className="h-3 w-3 text-amber-300" />
            CAREER PORTAL — SOPHI JOBS
          </span>
        </div>
        <a
          href="https://career.joinsophi.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-extrabold text-slate-400 hover:text-white transition-colors"
        >
          career.joinsophi.com ↗
        </a>
      </div>

      {/* Main Heading inside dark box */}
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
          Find Your Next<br />
          <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-200 bg-clip-text text-transparent">
            Dream Opportunity
          </span>
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
          Search {portalStats !== null ? `${portalStats.jobs}+` : '0+'} verified jobs across Pakistan & Gulf — matched to your <S dark /> CV profile.
        </p>
      </div>

      {/* Dark-Themed Job Search Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const fd = new FormData(e.currentTarget)
          const q = fd.get('q') as string
          const loc = fd.get('location') as string
          const type = fd.get('type') as string
          const params = new URLSearchParams()
          if (q) params.set('q', q)
          if (loc && loc !== 'all') params.set('location', loc)
          if (type && type !== 'all') params.set('type', type)
          window.open(
            `https://career.joinsophi.com/jobs${params.toString() ? '?' + params.toString() : ''}`,
            '_blank'
          )
        }}
        className="space-y-3 pt-1"
      >
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            name="q"
            placeholder="Job title, skill, or keyword..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-900 text-sm font-medium text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            <select
              name="location"
              aria-label="Filter by Location"
              className="w-full appearance-none pl-8 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-900 text-xs font-semibold text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 cursor-pointer transition"
            >
              <option value="all">All Cities / Remote</option>
              <option value="Karachi">Karachi</option>
              <option value="Lahore">Lahore</option>
              <option value="Islamabad">Islamabad</option>
              <option value="Rawalpindi">Rawalpindi</option>
              <option value="Peshawar">Peshawar</option>
              <option value="Remote">Remote</option>
              <option value="Dubai">Dubai, UAE</option>
              <option value="Riyadh">Riyadh, KSA</option>
            </select>
          </div>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            <select
              name="type"
              aria-label="Filter by Job Type"
              className="w-full appearance-none pl-8 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-900 text-xs font-semibold text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 cursor-pointer transition"
            >
              <option value="all">All Job Types</option>
              <option value="full-time">Full-Time</option>
              <option value="part-time">Part-Time</option>
              <option value="contract">Contract</option>
              <option value="remote">Remote Only</option>
              <option value="internship">Internship</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gold py-3.5 text-sm font-black text-slate-950 hover:bg-amber-300 transition-all shadow-lg hover:scale-[1.01]"
        >
          <Search className="h-4 w-4" />
          Search Jobs on Career Portal
          <ArrowRight className="h-4 w-4 text-slate-950" />
        </button>
      </form>

      {/* Quick Trending Tags inside dark box */}
      <div className="space-y-2 pt-1 border-t border-slate-800/80">
        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Trending Searches</p>
        <div className="flex flex-wrap gap-1.5">
          {['Software Engineer', 'Marketing Manager', 'Finance Analyst', 'Customer Support', 'React Developer', 'HR Manager'].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => {
                const params = new URLSearchParams({ q: tag })
                window.open(`https://career.joinsophi.com/jobs?${params.toString()}`, '_blank')
              }}
              className="px-2.5 py-1 text-[11px] font-bold text-slate-300 bg-slate-900 border border-slate-800 rounded-full hover:border-amber-400 hover:text-amber-300 transition-all"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Dark Box Footer Stats */}
      <div className="flex items-center gap-4 pt-1 text-xs font-semibold text-slate-300">
        <span>🏢 <strong className="text-white">{portalStats !== null ? `${portalStats.companies}+` : '0+'}</strong> Companies</span>
        <span>📄 <strong className="text-white">{portalStats !== null ? `${portalStats.jobs}+` : '0+'}</strong> Active Jobs</span>
        <a href="https://career.joinsophi.com/recruiter" target="_blank" rel="noopener noreferrer"
          className="ml-auto text-[#c5a059] hover:underline font-bold"
        >
          Post a Job →
        </a>
      </div>
    </div>
  )
}
