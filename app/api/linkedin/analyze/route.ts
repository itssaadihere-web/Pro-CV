import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

function sanitizeReportText(text: string): string {
  if (!text) return ''
  return text
    .replace(/^[#]+\s*/gm, '') // Strip leading #, ##, ###
    .replace(/\*\*(.*?)\*\*/g, '$1') // Strip bold **
    .replace(/\*(.*?)\*/g, '$1') // Strip italic *
    .replace(/`/g, '')
    .trim()
}

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
    let rawReport = ''

    if (geminiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey: geminiKey })
        const headline = idealProfile?.headline || 'Executive Professional | Strategic Growth Leader'
        const about = idealProfile?.about || 'Results-oriented professional with proven track record of driving operational excellence.'
        const skills = idealProfile?.skills?.join(', ') || 'Leadership, Strategic Planning, Operations, Team Management'

        const prompt = `You are a senior LinkedIn Optimization Expert and personal branding specialist.

YOUR JOB:
Analyze the user's current LinkedIn profile data and generate a clear, actionable optimization report comparing it to an ideal benchmark.

IDEAL BENCHMARK FOR THIS CANDIDATE:
Headline benchmark: ${headline}
About section benchmark: ${about}
Top Skills benchmark: ${skills}

CURRENT PROFILE DATA:
${currentProfileText}

FORMATTING RULES — STRICTLY ENFORCED:
- Do NOT use any markdown formatting: no #, ##, ###, no **, no *, no backticks.
- Use only plain text, numbered sections, and bullet points with the • symbol.
- Section titles are written in PLAIN TEXT like: "1. HEADLINE ANALYSIS:"
- This output renders directly to users — markdown symbols will show as broken characters.

WORD COUNT LIMITS — STRICTLY ENFORCED:
- Rewritten Headline: Maximum 220 characters. Count every character including spaces.
- Rewritten About section (first 3 lines only): Maximum 60 words total. This is LinkedIn's preview limit — anything beyond 3 lines is cut off.
- Skills list: Exactly 10 skills. Not 9, not 11. Exactly 10.
- Total report length: Maximum 450 words. Be concise and actionable — no padding.

OUTPUT STRUCTURE — use this exact plain text format:

1. HEADLINE ANALYSIS:

Current: [paste user's current headline or write "Not provided" if missing]
Problem: [One sentence identifying the specific weakness]
Rewritten Headline (copy-paste ready, max 220 characters):
[Your rewritten headline here]

2. ABOUT SECTION — First 3 Lines (LinkedIn Preview):

Current opening: [paste user's current first 3 lines or write "Not provided" if missing]
Problem: [One sentence identifying the specific weakness]
Rewritten opening (max 60 words — copy-paste ready):
[Your rewritten 3 lines here]

3. TOP 10 SKILLS TO ADD ON LINKEDIN:

• [Skill 1]
• [Skill 2]
• [Skill 3]
• [Skill 4]
• [Skill 5]
• [Skill 6]
• [Skill 7]
• [Skill 8]
• [Skill 9]
• [Skill 10]

4. THREE QUICK WINS (implement today):

• [Specific action — name the exact field to change and what to change it to]
• [Specific action — name the exact field to change and what to change it to]
• [Specific action — name the exact field to change and what to change it to]`

        const result = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        })
        rawReport = result.text || ''
      } catch (aiErr) {
        console.error('Gemini AI error in LinkedIn optimizer:', aiErr)
      }
    }

    if (!rawReport) {
      rawReport = `🎯 LinkedIn Optimization Report

1. Headline Suggestion
Recommended: Executive Leader | Strategic Operations & Growth Specialist
Reasoning: Incorporates high-volume recruiter search keywords.

2. About / Summary Rewrite
Recommended Bio:
Results-driven professional with expertise in leading cross-functional teams, driving operational efficiency, and scaling high-impact initiatives.

3. Top Skills to Feature
• Strategic Planning
• Operations Management
• Team Leadership
• Data Analytics & Reporting
• Client Relationship Management`
    }

    const contrastReport = sanitizeReportText(rawReport)
    const finalHeadline = idealProfile?.headline || 'Executive Leader | Strategic Operations & Growth Specialist'
    const finalSummary = idealProfile?.about || 'Results-driven professional with expertise in leading cross-functional teams, driving operational efficiency, and scaling high-impact initiatives.'
    const finalSkills = idealProfile?.skills || ['Strategic Planning', 'Operations Management', 'Team Leadership', 'Data Analytics', 'Client Relationship Management']

    let activityId: string | null = null
    if (userId) {
      activityId = await logServiceActivity(
        userId,
        'LINKEDIN_OPTIMIZER',
        'LinkedIn Profile Optimizer',
        '/linkedin-optimizer?id=ID_PLACEHOLDER',
        {
          contrastReport,
          headline: finalHeadline,
          summary: finalSummary,
          skills: finalSkills,
          url,
          currentProfileText,
        },
        serviceSupabase
      )
    }

    return NextResponse.json({
      success: true,
      activityId,
      contrastReport,
      headline: finalHeadline,
      summary: finalSummary,
      skills: finalSkills,
      remainingCredits
    })

  } catch (error: any) {
    console.error('LinkedIn analyze error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
