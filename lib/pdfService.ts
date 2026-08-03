import { getServiceSupabase } from '@/lib/supabase-server'

export async function getBrowserInstance() {
  const isProd = process.env.NODE_ENV === 'production'
  
  if (isProd) {
    const puppeteerCore = await import('puppeteer-core')
    const chromium = (await import('@sparticuz/chromium')).default as any
    
    let executablePath: string
    try {
      executablePath = await chromium.executablePath()
    } catch (e: any) {
      console.warn('⚠️ Local chromium executable path failed. Falling back to remote tarball pack...', e)
      executablePath = await chromium.executablePath(
        'https://github.com/Sparticuz/chromium/releases/download/v133.0.0/chromium-v133.0.0-pack.tar'
      )
    }

    return await puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: executablePath,
      headless: chromium.headless,
    })
  } else {
    const puppeteer = await import('puppeteer')
    return await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    })
  }
}

export async function generateAndUploadPdf(jobId: string, templateId: string, color: string | null | undefined, appUrl: string) {
  const browser = await getBrowserInstance()
  const page = await browser.newPage()

  const renderUrl = `${appUrl}/cv-render/${jobId}?template=${templateId}${color ? `&color=${color}` : ''}`
  console.log('Puppeteer navigating to render URL:', renderUrl)
  
  await page.goto(renderUrl, { waitUntil: 'domcontentloaded', timeout: 20000 })

  // Export A4 PDF with clean page break margins
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '10mm', right: '0mm', bottom: '12mm', left: '0mm' }
  })

  await browser.close()

  // Upload PDF to Supabase Storage
  const supabase = getServiceSupabase()
  const filePath = `cv-outputs/${jobId}/${templateId}.pdf`
  
  let uploadRes = await supabase.storage
    .from('cv-outputs')
    .upload(filePath, pdfBuffer, {
      contentType: 'application/pdf',
      upsert: true
    })

  if (uploadRes.error) {
    const isBucketError = uploadRes.error.message?.includes('bucket') || 
                        uploadRes.error.message?.includes('does not exist') ||
                        uploadRes.error.message?.includes('not found')
                        
    if (isBucketError) {
      console.warn('cv-outputs storage bucket not found. Attempting to create it...')
      const { error: createError } = await supabase.storage.createBucket('cv-outputs', {
        public: true,
        allowedMimeTypes: ['application/pdf'],
      })
      
      if (!createError) {
        console.log('Successfully created cv-outputs bucket. Retrying upload...')
        uploadRes = await supabase.storage
          .from('cv-outputs')
          .upload(filePath, pdfBuffer, {
            contentType: 'application/pdf',
            upsert: true
          })
      } else {
        console.error('Failed to create bucket cv-outputs:', createError)
      }
    }
  }

  if (uploadRes.error) {
    console.error('Supabase upload error:', uploadRes.error)
    throw new Error('Failed to upload PDF to storage: ' + uploadRes.error.message)
  }

  const { data: { publicUrl } } = supabase.storage
    .from('cv-outputs')
    .getPublicUrl(filePath)

  // Update job details in Supabase
  const { error: updateError } = await supabase
    .from('cv_jobs')
    .update({
      pdf_output_path: publicUrl,
      template_used: templateId
    })
    .eq('id', jobId)

  if (updateError) {
    console.error('Supabase update job error:', updateError)
    throw new Error('Failed to update job record: ' + updateError.message)
  }

  return { publicUrl, pdfBuffer }
}
