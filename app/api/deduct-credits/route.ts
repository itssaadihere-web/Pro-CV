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

    return NextResponse.json({
      success: true,
      remainingCredits: deduction.remainingCredits,
    })
  } catch (error: any) {
    console.error('Error in /api/deduct-credits:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
