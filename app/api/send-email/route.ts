import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase-server'
import { sendCVEmail } from '@/lib/email'
import { generateAndUploadPdf } from '@/lib/pdfService'

export async function POST(req: NextRequest) {
  try {
    const { jobId, template, color } = await req.json()

    if (!jobId) {
      return NextResponse.json({ error: 'Missing jobId parameter' }, { status: 400 })
    }

    const supabase = getServiceSupabase()

    // 1. Fetch job and user profile
    const { data: job, error: jobError } = await supabase
      .from('cv_jobs')
      .select('generated_cv, user_id, email_sent, template_used')
      .eq('id', jobId)
      .single()

    if (jobError || !job) {
      return NextResponse.json({ error: 'Job not found in database' }, { status: 404 })
    }

    if (!job.generated_cv) {
      return NextResponse.json({ error: 'CV content is empty or not yet generated' }, { status: 400 })
    }

    // Fetch user profile email
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', job.user_id)
      .single()

    if (profileError || !profile || !profile.email) {
      return NextResponse.json({ error: 'Associated user profile or email not found' }, { status: 404 })
    }

    // 2. Render exact Puppeteer PDF (matches Download PDF button 100%)
    const templateId = job.template_used || template || 'min-14-white-blue-minimalist-corporate-ats'
    const host = req.headers.get('host') || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const appUrl = `${protocol}://${host}`

    const { pdfBuffer } = await generateAndUploadPdf(jobId, templateId, color, appUrl)

    // 3. Send email with exact high-performance PDF attachment
    const emailSent = await sendCVEmail({
      userEmail: profile.email,
      userName: profile.full_name || '',
      jobId,
      pdfBuffer: Buffer.from(pdfBuffer),
    })

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send email via SMTP server. Check server logs.' },
        { status: 500 }
      )
    }

    // Update job status to record email dispatch
    await supabase
      .from('cv_jobs')
      .update({ email_sent: true })
      .eq('id', jobId)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error in /api/send-email:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error during email dispatch' },
      { status: 500 }
    )
  }
}
