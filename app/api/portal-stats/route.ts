import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = getServiceSupabase()

    // 1. Count active jobs in database
    const { count: activeJobsCount } = await supabase
      .from('jobs')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active')

    // 2. Count active unique companies from jobs table
    const { data: jobCompanies } = await supabase
      .from('jobs')
      .select('company_name')
      .eq('status', 'active')

    // 3. Count recruiter profiles registered
    const { count: recruiterCount } = await supabase
      .from('recruiter_profiles')
      .select('id', { count: 'exact', head: true })

    const uniqueJobCompanies = new Set(
      (jobCompanies || [])
        .map((j: any) => j.company_name?.toLowerCase().trim())
        .filter(Boolean)
    ).size

    const totalCompanies = Math.max(uniqueJobCompanies, recruiterCount || 0)

    return NextResponse.json({
      jobs: activeJobsCount ?? 0,
      companies: totalCompanies ?? 0,
    })
  } catch (error) {
    console.error('Error fetching portal stats:', error)
    return NextResponse.json({ jobs: 0, companies: 0 })
  }
}
