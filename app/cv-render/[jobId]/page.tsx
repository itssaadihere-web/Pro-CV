import { getTemplate } from '@/components/cv-templates'
import { parseKimiCV } from '@/lib/cvParser'
import { getServiceSupabase } from '@/lib/supabase-server'

export default async function CVRenderPage({
  params,
  searchParams
}: {
  params: { jobId: string }
  searchParams: { template: string; color?: string }
}) {
  const supabase = getServiceSupabase()
  const { data: job } = await supabase
    .from('cv_jobs')
    .select('generated_cv, user_id')
    .eq('id', params.jobId)
    .single()

  if (!job || !job.generated_cv) {
    return (
      <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center', color: '#ef4444' }}>
        <h3>Error: Job not found or CV content is empty.</h3>
      </div>
    )
  }

  let isPaid = false
  if (job.user_id) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('has_paid, cv_credits')
      .eq('id', job.user_id)
      .single()
    if (profile && (profile.has_paid || (profile.cv_credits && profile.cv_credits > 0))) {
      isPaid = true
    }
  }

  const cvData = parseKimiCV(job.generated_cv)
  const templateId = searchParams.template || 'min-14-white-blue-minimalist-corporate-ats'
  const TemplateComponent = getTemplate(templateId)

  return (
    <html>
      <head>
        <title>{cvData.fullName || 'CV'} - ProCV</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Georgia:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body {
            background: white;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            width: 100%;
            height: auto !important;
          }
          @page {
            size: A4 portrait;
            margin: 10mm 0mm 12mm 0mm;
          }
          footer, .footer, footer * {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            max-height: 0 !important;
            overflow: hidden !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          @media print {
            footer, .footer, footer * {
              display: none !important;
            }
            body {
              padding-top: 4mm;
              padding-bottom: 6mm;
            }
            section, article, div[style*="borderLeft"], .section-block {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              margin-top: 5mm;
            }
            h1, h2, h3, h4, .section-title {
              page-break-after: avoid !important;
              break-after: avoid !important;
              margin-top: 6mm;
              padding-top: 3mm;
            }
            ul, ol, li {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
          }
          .watermark-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            opacity: 0.18;
          }
          .watermark-box {
            transform: rotate(-25deg);
            text-align: center;
            font-family: sans-serif;
          }
          .watermark-title {
            font-size: 42px;
            font-weight: 900;
            letter-spacing: 4px;
            color: #0f172a;
          }
        `}</style>
      </head>
      <body>
        {!isPaid && (
          <div className="watermark-overlay">
            <div className="watermark-box">
              <div className="watermark-title">SOPHI WATERMARK PREVIEW</div>
            </div>
            <div className="watermark-box">
              <div className="watermark-title">SOPHI WATERMARK PREVIEW</div>
            </div>
            <div className="watermark-box">
              <div className="watermark-title">SOPHI WATERMARK PREVIEW</div>
            </div>
          </div>
        )}
        <TemplateComponent data={cvData} scale={1} colorTheme={searchParams.color} />
      </body>
    </html>
  )
}
export const dynamic = 'force-dynamic'
