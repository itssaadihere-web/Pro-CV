import { NextRequest, NextResponse } from 'next/server'
import { getRouteSupabase, getServiceSupabase } from '@/lib/supabase-server'
import { ServiceType, deductCredits } from '@/lib/creditService'

export async function POST(req: NextRequest) {
  try {
    const supabase = getRouteSupabase()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 })
    }

    const { serviceType } = await req.json()
    if (!serviceType) {
      return NextResponse.json({ error: 'Missing serviceType parameter.' }, { status: 400 })
    }

    const serviceSupabase = getServiceSupabase()
    const deduction = await deductCredits(session.user.id, serviceType as ServiceType, serviceSupabase)

    if (!deduction.success) {
      return NextResponse.json(
        { error: deduction.error || 'Insufficient credits.' },
        { status: 402 }
      )
    }

    // Log activity in service_activities table
    const { logServiceActivity, SERVICE_NAMES } = await import('@/lib/creditService')
    const serviceTitle = SERVICE_NAMES[serviceType as ServiceType] || serviceType
    const urlMap: Record<string, string> = {
      ATS_EVALUATION: '/ats-checker',
      TAILOR_CV: '/tailor-cv',
      LINKEDIN_OPTIMIZER: '/linkedin-optimizer',
      CREATE_CV: '/choice',
      TRANSFORM_CV: '/upload',
    }
    const targetUrl = urlMap[serviceType] || '/dashboard'

    await logServiceActivity(
      session.user.id,
      serviceType as ServiceType,
      serviceTitle,
      targetUrl,
      { creditsUsed: deduction.remainingCredits },
      serviceSupabase
    )

    return NextResponse.json({
      success: true,
      remainingCredits: deduction.remainingCredits,
    })
  } catch (error: any) {
    console.error('Error in /api/deduct-credits:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
