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

async function fetchUrlMeta(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      next: { revalidate: 3600 }
    })

    if (!res.ok) return ''
    const html = await res.text()

    const titleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["'](.*?)["']/i) || html.match(/<title>(.*?)<\/title>/i)
    const descMatch = html.match(/<meta\s+property=["']og:description["']\s+content=["'](.*?)["']/i) || html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i)

    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
    let bodyText = ''
    if (bodyMatch) {
      bodyText = bodyMatch[1]
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 3000)
    }

    const title = titleMatch ? titleMatch[1] : ''
    const desc = descMatch ? descMatch[1] : ''

    if (title || desc || bodyText) {
      return `Page Title: ${title}\nPage Description: ${desc}\nExtracted Web Content:\n${bodyText}`
    }
  } catch (err) {
    console.warn('URL fetch error:', err)
  }
  return ''
}

export async function POST(req: NextRequest) {
  try {
    const { url, profileText, jobUrl, jobText, userId } = await req.json()

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

    // 1. Resolve Profile Content
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
            currentProfileText = `Name: ${data.full_name || ''}\nHeadline: ${data.headline || ''}\nSummary: ${data.summary || ''}\nExperiences: ${JSON.stringify(data.experiences || [])}\nSkills: ${JSON.stringify(data.skills || [])}`
          }
        } catch (err) {
          console.warn('Proxycurl fetch error:', err)
        }
      }
      if (!currentProfileText) {
        const metaInfo = await fetchUrlMeta(url)
        if (metaInfo) {
          currentProfileText = `LinkedIn URL: ${url}\n${metaInfo}`
        } else {
          currentProfileText = `LinkedIn Profile URL: ${url}`
        }
      }
    }

    // 2. Resolve Target Job Content
    let targetJobText = jobText || ''
    if (jobUrl && !targetJobText) {
      const metaInfo = await fetchUrlMeta(jobUrl)
      if (metaInfo) {
        targetJobText = `Target Job URL: ${jobUrl}\n${metaInfo}`
      } else {
        targetJobText = `Target Job URL: ${jobUrl}`
      }
    }

    // 3. Generate Tailored Analysis & Recommendations via Gemini AI
    const geminiKey = process.env.GEMINI_API_KEY
    let headline = ''
    let summary = ''
    let skills: string[] = []
    let rawReport = ''

    if (geminiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey: geminiKey })

        const prompt = `You are a senior LinkedIn Optimization Expert and personal branding specialist.

YOUR JOB:
Analyze the candidate's current LinkedIn profile data alongside their target job posting (if provided) and produce a fully tailored, high-converting LinkedIn optimization analysis and recommendations.

CANDIDATE'S CURRENT LINKEDIN PROFILE DATA:
${currentProfileText}

TARGET JOB POST / POSITION DETAILS:
${targetJobText || 'General High-Impact Career Target (Optimize for leadership, industry visibility, ATS searchability, and recruiter keyword reach)'}

CRITICAL DIRECTIVES:
1. All recommendations MUST be specifically tailored to match the candidate's actual background and target job description/role. Do NOT return generic fallback text.
2. The "headline" must be a keyword-rich, high-impact headline tailored specifically to the target job position and candidate strengths (maximum 220 characters).
3. The "summary" must be a compelling, rewritten 3-line executive About/Bio summary (maximum 60 words total) tailored to the target role.
4. The "skills" array must contain exactly 10 high-value skills to add/feature on LinkedIn, directly bridging any skill/keyword gaps between the candidate's profile and the target job post.
5. The "contrastReport" must be a comprehensive plain-text analysis report (no markdown like #, ##, **, *) comparing the candidate's profile against the target job post requirements.

FORMATTING RULES FOR contrastReport (STRICT PLAIN TEXT ONLY - NO MARKDOWN #, **, *):
Use exactly this section structure:

1. HEADLINE ANALYSIS:
Current: [paste candidate's current headline or write "Not provided" if missing]
Problem: [One sentence identifying specific weakness relative to target job post]
Rewritten Headline (copy-paste ready, max 220 characters):
[Your tailored rewritten headline]

2. ABOUT SECTION — First 3 Lines (LinkedIn Preview):
Current opening: [paste candidate's current opening or write "Not provided" if missing]
Problem: [One sentence identifying specific weakness relative to target job post]
Rewritten opening (max 60 words — copy-paste ready):
[Your tailored rewritten opening]

3. TOP 10 SKILLS & KEYWORD GAPS TO FEATURE ON LINKEDIN:
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

4. THREE QUICK WINS (implement today for target job alignment):
• [Specific action — name the exact field to change and what to change it to based on target job]
• [Specific action — name the exact field to change and what to change it to based on target job]
• [Specific action — name the exact field to change and what to change it to based on target job]

OUTPUT JSON SCHEMA:
Return ONLY a single valid JSON object. Do not include markdown formatting or backticks around the JSON.
{
  "headline": "Tailored Headline text (max 220 chars)",
  "summary": "Tailored 3-line About summary (max 60 words)",
  "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6", "Skill 7", "Skill 8", "Skill 9", "Skill 10"],
  "contrastReport": "Full plain text optimization report formatted as described above"
}`

        const result = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            temperature: 0.2,
            responseMimeType: 'application/json',
          }
        })

        const responseText = result.text || '{}'
        try {
          const cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
          const parsed = JSON.parse(cleanJson)
          headline = parsed.headline || ''
          summary = parsed.summary || ''
          if (Array.isArray(parsed.skills)) skills = parsed.skills
          rawReport = parsed.contrastReport || ''
        } catch (e) {
          console.error('Failed to parse Gemini JSON output:', e)
          rawReport = responseText
        }
      } catch (aiErr) {
        console.error('Gemini AI error in LinkedIn optimizer:', aiErr)
      }
    }

    if (!headline) {
      headline = 'Executive Leader | Strategic Operations & Growth Specialist'
    }
    if (!summary) {
      summary = 'Results-driven professional with expertise in leading cross-functional teams, driving operational efficiency, and scaling high-impact initiatives.'
    }
    if (!skills || skills.length === 0) {
      skills = ['Strategic Planning', 'Operations Management', 'Team Leadership', 'Data Analytics', 'Client Relationship Management']
    }
    if (!rawReport) {
      rawReport = `🎯 LinkedIn Optimization Report\n\n1. Headline Suggestion\nRecommended: ${headline}\n\n2. About / Summary Rewrite\nRecommended Bio:\n${summary}\n\n3. Top Skills to Feature\n${skills.map(s => `• ${s}`).join('\n')}`
    }

    const contrastReport = sanitizeReportText(rawReport)
    const finalHeadline = headline
    const finalSummary = summary
    const finalSkills = skills

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
          jobUrl,
          targetJobText,
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

