'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getClientSupabase } from '@/lib/supabase'
import {
  Users,
  FileText,
  TrendingUp,
  ArrowLeft,
  Loader2,
  Lock,
  Award,
} from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'

export default function AdminDashboardPage() {
  const router = useRouter()
  const supabase = getClientSupabase()

  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCVs: 0,
    avgAtsScore: 0,
  })

  useEffect(() => {
    async function loadAdminData() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          router.push('/login')
          return
        }

        // Fetch User Profile to confirm admin access
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .eq('id', session.user.id)
          .single()

        if (profileError || !profile || profile.email !== 'syedsaad.mob@gmail.com') {
          setIsAdmin(false)
          setLoading(false)
          return
        }

        setIsAdmin(true)

        // 1. Get total users
        const { count: userCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })

        // 2. Get total jobs and average ATS score
        const { data: jobs } = await supabase
          .from('cv_jobs')
          .select('ats_score')

        let totalScore = 0
        let jobsWithScore = 0
        if (jobs) {
          jobs.forEach(j => {
            const score = j.ats_score?.overall
            if (typeof score === 'number') {
              totalScore += score
              jobsWithScore++
            }
          })
        }

        const avgScore = jobsWithScore > 0 ? Math.round(totalScore / jobsWithScore) : 85

        setStats({
          totalUsers: userCount || 0,
          totalCVs: jobs?.length || 0,
          avgAtsScore: avgScore,
        })
      } catch (err) {
        console.error('Error loading admin analytics:', err)
      } finally {
        setLoading(false)
      }
    }

    loadAdminData()
  }, [supabase, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex min-h-[400px] flex-col items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-sm font-medium text-slate-500">Loading admin analytics...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="mx-auto max-w-md px-4 py-24 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 mb-6">
            <Lock className="h-8 w-8" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Access Restricted</h1>
          <p className="mt-2 text-xs text-slate-500">
            You do not have administrative privileges to view this page.
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Return to User Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Navigation & Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-2 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Sophi Platform Analytics</h1>
            <p className="text-xs text-slate-500 mt-1">Real-time overview of users, CV transformations, and ATS scoring statistics.</p>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid gap-5 sm:grid-cols-3 mb-10">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-between">
            <div>
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Registered Users</span>
              <span className="block text-3xl font-extrabold text-slate-950 mt-1">{stats.totalUsers}</span>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Users className="h-6 w-6" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-between">
            <div>
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">CV Transformations</span>
              <span className="block text-3xl font-extrabold text-slate-950 mt-1">{stats.totalCVs}</span>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <FileText className="h-6 w-6" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-between">
            <div>
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Avg ATS Score</span>
              <span className="block text-3xl font-extrabold text-slate-950 mt-1">{stats.avgAtsScore}%</span>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
