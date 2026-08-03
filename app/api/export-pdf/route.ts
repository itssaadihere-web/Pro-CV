import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase-server'
import { generateAndUploadPdf, getBrowserInstance } from '@/lib/pdfService'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { jobId, templateId, color } = await req.json()

    if (!jobId || !templateId) {
      return NextResponse.json({ error: 'Missing jobId or templateId' }, { status: 400 })
    }

    const supabase = getServiceSupabase()
    const { data: job } = await supabase
      .from('cv_jobs')
      .select('user_id, pdf_output_path, completed_at, created_at')
      .eq('id', jobId)
      .single()

    if (job?.user_id) {
      const jobTime = new Date(job.completed_at || job.created_at || Date.now()).getTime()
      const isInitialExport = !job.pdf_output_path || (Date.now() - jobTime < 15 * 60 * 1000)

      // Only deduct 2 credits if this is a separate download of an older existing CV (not the initial export of a 30-credit CV creation)
      if (!isInitialExport) {
        const { deductCredits } = await import('@/lib/creditService')
        const deduction = await deductCredits(job.user_id, 'DOWNLOAD_PDF')
        if (!deduction.success) {
          return NextResponse.json(
            { error: deduction.error || 'Insufficient credits for clean PDF export (2 Credits required).' },
            { status: 402 }
          )
        }
      }
    }

    const host = req.headers.get('host') || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const appUrl = `${protocol}://${host}`

    const { publicUrl, pdfBuffer } = await generateAndUploadPdf(jobId, templateId, color, appUrl)

    // Stream PDF binary array directly for instant, 1-step download with zero CDN caching delay
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="ProCV-${templateId}-${color || 'custom'}.pdf"`,
        'X-Pdf-Url': publicUrl || '',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch (error: any) {
    console.error('Error in export-pdf POST:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error during PDF generation' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const jobId = searchParams.get('jobId')
    let templateId = searchParams.get('template')
    const color = searchParams.get('color')

    if (!jobId) {
      return NextResponse.json({ error: 'Missing jobId parameter' }, { status: 400 })
    }

    const supabase = getServiceSupabase()
    
    // Fetch the job details
    const { data: job, error: dbError } = await supabase
      .from('cv_jobs')
      .select('pdf_output_path, template_used, user_id')
      .eq('id', jobId)
      .single()

    if (dbError || !job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    // Resolve template ID
    if (!templateId) {
      templateId = job.template_used
    }

    if (!templateId) {
      const { TemplateRotationEngine } = await import('@/lib/templateRotation')
      const rotation = new TemplateRotationEngine()
      templateId = await rotation.getNextTemplate(job.user_id, 'random')
    }

    const host = req.headers.get('host') || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const appUrl = `${protocol}://${host}`

    const { pdfBuffer } = await generateAndUploadPdf(jobId, templateId, color, appUrl)

    // Return the PDF buffer directly for download
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="ProCV-${templateId}-${color || 'custom'}.pdf"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch (error: any) {
    console.error('Error in export-pdf GET:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error during PDF generation' },
      { status: 500 }
    )
  }
}
