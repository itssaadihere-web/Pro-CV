import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

export async function POST(req: NextRequest) {
  try {
    const { url, profileText, idealProfile, userId } = await req.json()

    if (!url && !profileText) {
      return NextResponse.json({ error: 'Please provide a LinkedIn URL, profile text, or PDF export.' }, { status: 400 })
    }

    const { getServiceSupabase } = await import('@/lib/supabase-server')
    const serviceSupabase = getServiceSupabase()
    const { deductCredits, logServiceActivity } = await import('@/lib/creditService')

    let remainingCredits: number | undefined
    if (userId) {
      const deduction = await deductCredits(userId, 'LINKEDIN_OPTIMIZER', serviceSupabase)
      if (!deduction.success) {
        return NextResponse.json(
          { error: deduction.error || 'Insufficient credits for LinkedIn Optimizer (20 Credits required).' },
          { status: 402 }
        )
      }
      remainingCredits = deduction.remainingCredits
    }

    let currentProfileText = profileText || ''

    if (url && !currentProfileText) {
      const proxycurlKey = process.env.PROXYCURL_API_KEY
      if (proxycurlKey) {
        try {
          const response = await fetch(`https://nubela.co/proxycurl/api/v2/linkedin?url=${encodeURIComponent(url)}`, {
            headers: { 'Authorization': `Bearer ${proxycurlKey}` }
          })
          if (response.ok) {
            const data = await response.json()
            currentProfileText = `Name: ${data.full_name || ''}\nHeadline: ${data.headline || ''}\nSummary: ${data.summary || ''}\nExperiences: ${JSON.stringify(data.experiences || [])}`
          }
        } catch (err) {
          console.warn('Proxycurl fetch error:', err)
        }
      }
      if (!currentProfileText) {
        currentProfileText = `LinkedIn Profile URL: ${url}\n(Headline: Professional | Summary: Experienced leader seeking strategic roles)`
      }
    }

    const geminiKey = process.env.GEMINI_API_KEY
    let contrastReport = ''

    if (geminiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey: geminiKey })
        const headline = idealProfile?.headline || 'Executive Professional | Strategic Growth Leader'
        const about = idealProfile?.about || 'Results-oriented professional with proven track record of driving operational excellence.'
        const skills = idealProfile?.skills?.join(', ') || 'Leadership, Strategic Planning, Operations, Team Management'

        const prompt = `You are a LinkedIn Optimization Expert.
Compare the user's CURRENT profile data against an IDEAL benchmark layout:

IDEAL BENCHMARK:
Headline: ${headline}
Summary/About: ${about}
Top Skills: ${skills}

CURRENT PROFILE DATA:
${currentProfileText}

Please generate a high-impact LinkedIn Contrast & Optimization Report.
Include:
1. 🎯 HEADLINE CONTRAST & COPY-PASTE SUGGESTIONS
2. 📝 ABOUT SECTION CONTRAST & REWRITTEN BIO
3. ⚡ TOP 10 SKILLS TO FEATURE ON LINKEDIN
4. 🚀 PROFILE VISIBILITY & RECRUITER SEARCH OPTIMIZATION TIPS

Format clearly with headings and bullet points.`

        const result = await ai.models.generateContent({
          model: 'gemini-1.5-flash',
          contents: prompt,
        })
        contrastReport = result.text || ''
      } catch (aiErr) {
        console.error('Gemini AI error in LinkedIn optimizer:', aiErr)
      }
    }

    if (!contrastReport) {
      contrastReport = `## 🎯 LinkedIn Optimization Report

### 1. Headline Suggestion
**Recommended:** Executive Leader | Strategic Operations & Growth Specialist
*Reasoning:* Incorporates high-volume recruiter search keywords.

### 2. About / Summary Rewrite
**Recommended Bio:**
Results-driven professional with expertise in leading cross-functional teams, driving operational efficiency, and scaling high-impact initiatives.

### 3. Top Skills to Feature
- Strategic Planning
- Operations Management
- Team Leadership
- Data Analytics & Reporting
- Client Relationship Management`
    }

    let activityId: string | null = null
    if (userId) {
      activityId = await logServiceActivity(
        userId,
        'LINKEDIN_OPTIMIZER',
        'LinkedIn Profile Optimizer',
        '/linkedin-optimizer?id=ID_PLACEHOLDER',
        { contrastReport, url, currentProfileText },
        serviceSupabase
      )
    }

    return NextResponse.json({
      success: true,
      activityId,
      contrastReport,
      remainingCredits
    })

  } catch (error: any) {
    console.error('LinkedIn analyze error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
