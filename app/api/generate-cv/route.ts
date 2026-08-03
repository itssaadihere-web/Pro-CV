import { NextRequest, NextResponse } from 'next/server'
import { generateKimiCompletion } from '@/lib/kimi'
import { getServiceSupabase } from '@/lib/supabase-server'

const KIMI_SYSTEM_PROMPT = `You are an elite CV Architect and ATS Optimization Specialist with deep expertise in modern recruitment algorithms, HR psychology, and professional branding for 2025–2026.

ROLE & MISSION:
Transform uploaded CVs into high-performance, ATS-optimized career documents. Every output must be ROI-driven, quantified, and tailored to pass both automated screening systems and human review.

GOAL-DRIVEN OPTIMIZATION:
Your absolute objective is to rewrite, restructure, and optimize the user's CV content so profoundly that it achieves an actual target ATS benchmark of 80% or higher across all dimensions. Do not settle for mediocre revisions. Maximize professional impact, quantified metrics, and core keyword density at every section. The scores you return are a strict, genuine reflection of your optimization work — not placeholders.

CRITICAL OUTPUT RULE:
You MUST return your response as a single valid JSON object. No markdown fences. No plain text before or after. Start your response with { and end with }. The JSON must be parseable by JSON.parse() without any cleanup.

CORE FRAMEWORKS YOU APPLY:

1. DYNAMIC ATS EVALUATION — Evaluate the parsed CV text against 2026 recruitment algorithms. Dynamically calculate and return real, computed scores for each ATS metric based on the quality of the raw input AND the quality of your optimized output. The scores must reflect your strict, genuine evaluation of the final optimized document — your engineering work must elevate the output into the 80%+ tier. Do not copy static numbers from examples.

2. STAR-METRIC BULLETS — Every bullet must follow: Strong Power Verb → Specific Task → Quantified Result (use numbers, %, PKR values, team size, time saved, revenue generated, or cost reduced). Never write a bullet without a measurable outcome.

3. KEYWORD INTELLIGENCE — Inject industry-specific keywords from the target industry into every section naturally. Run a gap analysis and populate missing_keywords accordingly.

4. 2026 PROFESSIONAL SUMMARY — Exactly 3 sentences. Format: [Title + Years XP + Industry] | [Top 2 specific value propositions] | [One quantified proof point]. Zero first-person pronouns (no I, my, me).

5. FORMATTING AUDIT — ATS-safe layout. No tables in headers. Standard section headings only. Clean bullet structure throughout. Section order must match the output schema below.

POWER VERB BANK — use exclusively, never repeat same verb twice in same role:
LEADERSHIP: Spearheaded, Orchestrated, Championed, Directed, Mobilized, Galvanized, Steered
GROWTH: Accelerated, Amplified, Expanded, Scaled, Maximized, Propelled, Catapulted, Drove
RESULTS: Delivered, Generated, Achieved, Secured, Attained, Produced, Yielded, Realized
IMPROVEMENT: Transformed, Revamped, Streamlined, Optimized, Elevated, Refined, Overhauled, Modernized
CREATION: Architected, Designed, Built, Launched, Pioneered, Established, Engineered, Developed
COLLABORATION: Partnered, Unified, Aligned, Coordinated, Facilitated, Cultivated
ANALYSIS: Analyzed, Evaluated, Identified, Diagnosed, Mapped, Benchmarked, Forecasted

BANNED WEAK VERBS — never use under any circumstances:
Managed, Helped, Assisted, Worked on, Was responsible for, Handled, Did, Made, Used, Supported,
Contributed to, Involved in, Participated in, Ensured, Provided, Tried, Attempted

MISSING DATA RULES:
- Phone not in CV → set "phone" to ""
- LinkedIn not in CV → set "linkedin" to ""
- Website not in CV → set "website" to ""
- No certifications → set "certifications" to []
- No explicit achievements stated → construct from job descriptions using realistic estimates, mark each with "(est.)"
- CV text under 100 words or clearly garbled → return valid JSON, set ats_score_overall to a realistically low score (under 30), add note in top_issues: ["CV text appears incomplete or too short to fully optimize"]
- NEVER invent employers, universities, job titles, dates, or company names not present in the original CV

ATS SCORING GUIDE — use this rubric to compute each score dynamically:

ats_keyword_match (0–100):
  0–40: Fewer than 5 industry keywords present
  41–65: Some keywords but missing critical role-specific terms
  66–80: Good keyword density, most critical terms present
  81–100: Excellent — all critical role terms + semantic variations present

ats_format_compliance (0–100):
  0–50: Tables in headers, non-standard section names, graphics in text flow
  51–75: Minor formatting issues, mostly standard
  76–100: Fully ATS-safe, standard headings, clean structure

ats_achievement_density (0–100):
  0–40: Fewer than 2 quantified bullets in total
  41–65: Some numbers but many bullets still generic
  66–80: Most bullets quantified
  81–100: Every bullet has a specific, measurable outcome

ats_readability (0–100):
  0–50: Long paragraphs, no clear hierarchy, inconsistent tense
  51–75: Mostly readable but some structural issues
  76–100: Clean hierarchy, consistent tense, scannable in 6 seconds

ats_skills_alignment (0–100):
  0–40: Skills section generic or absent
  41–65: Some relevant skills but missing key role requirements
  66–80: Good alignment with industry expectations
  81–100: Skills perfectly mirror target industry + role requirements

ats_score_overall = weighted average:
  keyword_match × 0.30 + format_compliance × 0.15 + achievement_density × 0.25 + readability × 0.15 + skills_alignment × 0.15

OUTPUT JSON SCHEMA — return exactly this structure. All score fields must be dynamically computed integers, not placeholders:

{
  "ats_score_overall": 85,
  "ats_keyword_match": 85,
  "ats_format_compliance": 90,
  "ats_achievement_density": 80,
  "ats_readability": 85,
  "ats_skills_alignment": 85,
  "top_issues": [
    "Specific issue found in original CV — actionable and precise",
    "Second specific issue found — actionable and precise",
    "Third specific issue found — actionable and precise"
  ],

  "personal": {
    "full_name": "Extracted full name from CV — real name only",
    "job_title": "Target job title — cleaned and professionally formatted",
    "email": "email@domain.com or empty string",
    "phone": "+92-xxx-xxxxxxx or empty string if not found",
    "location": "City, Country or empty string",
    "linkedin": "linkedin.com/in/handle or empty string if not found",
    "website": "portfolio URL or empty string if not found"
  },

  "summary": "Three-sentence professional summary. No first-person pronouns. Sentence 1: [Title] + [X years] experience in [industry]. Sentence 2: Proven ability to [value prop 1] and [value prop 2]. Sentence 3: [Quantified proof point with specific metric].",

  "core_competencies": [
    "Competency 1", "Competency 2", "Competency 3",
    "Competency 4", "Competency 5", "Competency 6",
    "Competency 7", "Competency 8", "Competency 9"
  ],

  "experience": [
    {
      "job_title": "JOB TITLE IN CAPS",
      "company": "Exact company name from CV — do not alter",
      "location": "City, Country or empty string",
      "start_date": "Mon YYYY format e.g. Jan 2022",
      "end_date": "Mon YYYY or Present",
      "bullets": [
        "Power verb + specific task + quantified result with metric.",
        "Power verb + specific task + quantified result with metric.",
        "Power verb + specific task + quantified result with metric.",
        "Power verb + specific task + quantified result with metric."
      ]
    }
  ],

  "key_achievements": [
    "★ Single most impressive career achievement — fully quantified with specific metric",
    "★ Award, promotion, recognition, or major milestone that differentiates this candidate",
    "★ Revenue generated, cost reduced, team built, or project delivered at scale"
  ],

  "education": [
    {
      "degree": "Full degree name e.g. Bachelor of Business Administration",
      "institution": "Exact university name from CV — do not alter",
      "graduation_year": "YYYY",
      "distinction": "GPA or honours if present — empty string if not notable"
    }
  ],

  "certifications": [
    {
      "name": "Certification name",
      "issuer": "Issuing organization",
      "year": "YYYY"
    }
  ],

  "technical_skills": {
    "Software & Platforms": ["Tool A", "Tool B", "Tool C"],
    "Industry Skills": ["Skill A", "Skill B"],
    "Languages": ["English — Native", "Urdu — Professional"]
  },

  "linkedin_headline": "Max 220 characters. Format: [Title] | [Top Value Prop] | [Industry Keyword] | [Result or Differentiator]. Optimized for recruiter search.",
  "linkedin_about": "First 3 lines only — max 60 words total. Hook line first. No first-person pronouns. Ends with what value you deliver to employers or clients.",
  "linkedin_top_skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6", "Skill 7", "Skill 8", "Skill 9", "Skill 10"],

  "cover_letter": "Exactly 3 paragraphs. Total 180–220 words. Paragraph 1 (3 sentences): Specific hook about the role/company + why this candidate fits. Paragraph 2 (4 sentences): Two strongest achievements from CV with exact numbers. Paragraph 3 (2 sentences): Call to action with contact invitation. If no job description was provided: write an achievement-driven template for the candidate's most recent role and industry. Do not exceed 220 words.",

  "gap_analysis": {
    "missing_keywords": ["Keyword A that should be in CV but is absent", "Keyword B", "Keyword C"],
    "recommended_certifications": ["Certification relevant to this industry and level", "Second recommendation"],
    "quick_wins": [
      "Specific action candidate can take in next 48 hours — e.g. add 'project management' to LinkedIn skills section",
      "Second quick win — specific and immediately actionable",
      "Third quick win — specific and immediately actionable"
    ]
  }
}`

export async function POST(req: NextRequest) {
  try {
    const { cvText, industry, jobDescription, language, jobId, stylePreference = 'random' } = await req.json()

    if (!cvText || !industry || !language || !jobId) {
      return NextResponse.json(
        { error: 'Missing required parameters: cvText, industry, language, and jobId are required.' },
        { status: 400 }
      )
    }

    const supabase = getServiceSupabase()

    // 1. Fetch current job to get the user ID
    const { data: job, error: fetchError } = await supabase
      .from('cv_jobs')
      .select('user_id')
      .eq('id', jobId)
      .single()

    if (fetchError || !job) {
      console.error('Error fetching job:', fetchError)
      return NextResponse.json({ error: 'Job not found in database.' }, { status: 404 })
    }

    const userId = job.user_id

    // Verify user has credits (30 Credits required for CREATE_CV / TRANSFORM_CV)
    const { data: profile } = await supabase
      .from('profiles')
      .select('cv_credits, email')
      .eq('id', userId)
      .single()

    const userCredits = profile?.cv_credits ?? 0
    const isExempt = profile?.email === 'syedsaad.mob@gmail.com' || profile?.email?.toLowerCase() === 'test@joinsophi.com'

    if (!profile || (!isExempt && userCredits < 30)) {
      return NextResponse.json({
        error: `Insufficient credits. Requires 30 Credits, but you have ${userCredits} Credits available. Please purchase credits to continue.`
      }, { status: 403 })
    }

    const userPrompt = `I am uploading my current CV for a complete AI-powered transformation.

CURRENT CV CONTENT:
${cvText}

TARGET JOB DESCRIPTION:
${jobDescription || `Not provided — optimize for general ${industry} roles`}

TARGET INDUSTRY: ${industry}
OUTPUT LANGUAGE: ${language}

Please run the full transformation and output all sections as specified in your instructions.`

    // Call Kimi AI completions
    const fullOutput = await generateKimiCompletion(KIMI_SYSTEM_PROMPT, userPrompt)

    // Parse sections
    const sections = parseKimiOutput(fullOutput)

    // Select next template using TemplateRotationEngine
    const { TemplateRotationEngine } = await import('@/lib/templateRotation')
    const rotation = new TemplateRotationEngine()
    const templateId = await rotation.getNextTemplate(userId, stylePreference)

    // 2. Update job details
    let { error: updateError } = await supabase
      .from('cv_jobs')
      .update({
        status: 'completed',
        ats_score: sections.atsScoreJson,
        generated_cv: sections.revampedCV,
        linkedin_optimizer: sections.linkedinJson,
        cover_letter: sections.coverLetter,
        gap_analysis: sections.gapAnalysisJson,
        completed_at: new Date().toISOString(),
        template_used: templateId
      })
      .eq('id', jobId)

    if (updateError) {
      if (updateError.code === '42703' || updateError.message?.includes('template_used')) {
        console.warn('⚠️ Warning: "template_used" column not found in database. Retrying update without it.')
        
        const fallback = await supabase
          .from('cv_jobs')
          .update({
            status: 'completed',
            ats_score: sections.atsScoreJson,
            generated_cv: sections.revampedCV,
            linkedin_optimizer: sections.linkedinJson,
            cover_letter: sections.coverLetter,
            gap_analysis: sections.gapAnalysisJson,
            completed_at: new Date().toISOString(),
          })
          .eq('id', jobId)
          
        updateError = fallback.error
      }
    }

    if (updateError) {
      console.error('Error updating job status:', updateError)
      return NextResponse.json({ error: 'Failed to update job in database.' }, { status: 500 })
    }

    // 3. Decrement user credits (30 Credits for Full CV Creation / Revamp)
    const { deductCredits, logServiceActivity } = await import('@/lib/creditService')
    await deductCredits(userId, 'CREATE_CV')
    await logServiceActivity(userId, 'CREATE_CV', 'CV Transformation & Revamp', `/result/${jobId}`, { jobId }, supabase)

    return NextResponse.json({ success: true, sections, templateId })
  } catch (error: any) {
    console.error('Error in /api/generate-cv:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error during CV generation' },
      { status: 500 }
    )
  }
}

function parseKimiOutput(text: string) {
  let cleaned = text.trim()
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim()
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim()
  }

  let kimiData: any = null
  try {
    kimiData = JSON.parse(cleaned)
  } catch (err) {
    console.warn('⚠️ Kimi output was not direct JSON, attempting regex format parsing...')
  }

  if (kimiData && typeof kimiData === 'object') {
    const overall = kimiData.ats_score_overall ?? 80
    const keywordMatch = kimiData.ats_keyword_match ?? 80
    const formatCompliance = kimiData.ats_format_compliance ?? 80
    const achievementDensity = kimiData.ats_achievement_density ?? 80
    const readability = kimiData.ats_readability ?? 80
    const skillsAlignment = kimiData.ats_skills_alignment ?? 80
    const issues = kimiData.top_issues || []

    const atsScoreJson = {
      overall,
      keywordMatch,
      formatCompliance,
      achievementDensity,
      readability,
      skillsAlignment,
      issues
    }

    const linkedinJson = {
      headline: kimiData.linkedin_headline || '',
      about: kimiData.linkedin_about || '',
      skills: kimiData.linkedin_top_skills || []
    }

    const coverLetter = kimiData.cover_letter || ''

    const gapAnalysisJson = {
      missingKeywords: kimiData.gap_analysis?.missing_keywords || [],
      certifications: kimiData.gap_analysis?.recommended_certifications || [],
      quickWins: kimiData.gap_analysis?.quick_wins || []
    }

    const personal = kimiData.personal || {}
    const expList = (kimiData.experience || []).map((exp: any) => {
      const bulletsStr = (exp.bullets || []).map((b: string) => `✦ ${b}`).join('\n')
      return `┌──────────────────────────────────────────┐\n│ ${exp.job_title || ''} — ${exp.company || ''} │ ${exp.start_date || ''} – ${exp.end_date || ''} │\n└──────────────────────────────────────────┘\n${bulletsStr}`
    }).join('\n\n')

    const eduList = (kimiData.education || []).map((edu: any) =>
      `◈ ${edu.degree || ''}\n${edu.institution || ''} | ${edu.graduation_year || ''}${edu.distinction ? ' | ' + edu.distinction : ''}`
    ).join('\n\n')

    const certList = kimiData.certifications && kimiData.certifications.length > 0
      ? `CERTIFICATIONS\n${kimiData.certifications.map((c: any) => `✔ ${c.name} — ${c.issuer} (${c.year})`).join('\n')}\n\n`
      : ''

    const techSkills = Object.entries(kimiData.technical_skills || {})
      .map(([cat, skills]) => `${cat}: ${Array.isArray(skills) ? skills.join(' | ') : skills}`)
      .join('\n')

    const revampedCV = `${(personal.full_name || '').toUpperCase()}
${personal.job_title || ''}
${personal.email || ''} | ${personal.phone || ''} | ${personal.location || ''} | ${personal.linkedin || ''}

PROFESSIONAL SUMMARY
${kimiData.summary || ''}

CORE COMPETENCIES
${(kimiData.core_competencies || []).map((c: string) => `▸ ${c}`).join('\n')}

PROFESSIONAL EXPERIENCE
${expList}

KEY ACHIEVEMENTS
${(kimiData.key_achievements || []).map((a: string) => `★ ${a}`).join('\n')}

EDUCATION
${eduList}

${certList}TECHNICAL SKILLS
${techSkills}`.trim()

    return {
      atsScoreJson,
      revampedCV,
      linkedinJson,
      coverLetter,
      gapAnalysisJson,
      rawJson: kimiData
    }
  }

  // Regex fallback parsing
  const atsMatch = text.match(/---ATS SCORE REPORT---([\s\S]*?)---REVAMPED CV---/)
  const cvMatch = text.match(/---REVAMPED CV---([\s\S]*?)---LINKEDIN OPTIMIZER---/)
  const linkedinMatch = text.match(/---LINKEDIN OPTIMIZER---([\s\S]*?)---COVER LETTER---/)
  const coverMatch = text.match(/---COVER LETTER---([\s\S]*?)---GAP ANALYSIS---/)
  const gapMatch = text.match(/---GAP ANALYSIS---([\s\S]*)$/)

  const atsScoreRaw = atsMatch ? atsMatch[1].trim() : ''
  const revampedCV = cvMatch ? cvMatch[1].trim() : text
  const linkedinRaw = linkedinMatch ? linkedinMatch[1].trim() : ''
  const coverLetter = coverMatch ? coverMatch[1].trim() : ''
  const gapAnalysisRaw = gapMatch ? gapMatch[1].trim() : ''

  return {
    atsScoreJson: parseAtsScore(atsScoreRaw),
    revampedCV,
    linkedinJson: parseLinkedin(linkedinRaw),
    coverLetter,
    gapAnalysisJson: parseGapAnalysis(gapAnalysisRaw)
  }
}

function parseAtsScore(text: string) {
  const overallMatch = text.match(/Overall:\s*(\d+)/i)
  const keywordMatch = text.match(/Keyword Match:\s*(\d+)/i)
  const formatMatch = text.match(/Format Compliance:\s*(\d+)/i)
  const achievementMatch = text.match(/Achievement Density:\s*(\d+)/i)
  const readabilityMatch = text.match(/Readability:\s*(\d+)/i)
  const skillsMatch = text.match(/Skills Alignment:\s*(\d+)/i)

  const issuesList: string[] = []
  const parts = text.split(/Top 3 Issues Found:/i)
  const issuesBlock = parts.length > 1 ? parts[1] : ''
  if (issuesBlock) {
    const lines = issuesBlock.split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed.startsWith('-') || trimmed.startsWith('*') || /^\d+\./.test(trimmed)) {
        issuesList.push(trimmed.replace(/^[-*\s]|\d+\.\s*/, '').trim())
      }
    }
  }

  return {
    overall: overallMatch ? parseInt(overallMatch[1]) : 70,
    keywordMatch: keywordMatch ? parseInt(keywordMatch[1]) : 70,
    formatCompliance: formatMatch ? parseInt(formatMatch[1]) : 70,
    achievementDensity: achievementMatch ? parseInt(achievementMatch[1]) : 70,
    readability: readabilityMatch ? parseInt(readabilityMatch[1]) : 70,
    skillsAlignment: skillsMatch ? parseInt(skillsMatch[1]) : 70,
    issues: issuesList.slice(0, 3)
  }
}

function parseLinkedin(text: string) {
  const headlineMatch = text.match(/Headline:\s*([^\n]+)/i)
  const aboutMatch = text.match(/About \(first 3 lines\):\s*([\s\S]*?)(?=Top 10 Skills:|$)/i)
  const skillsMatch = text.match(/Top 10 Skills:\s*([^\n]+)/i)

  let skills: string[] = []
  if (skillsMatch) {
    skills = skillsMatch[1].split(',').map(s => s.trim()).filter(Boolean)
  }

  return {
    headline: headlineMatch ? headlineMatch[1].trim() : '',
    about: aboutMatch ? aboutMatch[1].trim() : '',
    skills: skills.slice(0, 10)
  }
}

function parseGapAnalysis(text: string) {
  const missingKeywordsMatch = text.match(/Missing Keywords:\s*([^\n]+)/i)
  const certsMatch = text.match(/Recommended Certifications:\s*([\s\S]*?)(?=Quick Wins|$)/i)
  const winsMatch = text.match(/Quick Wins \(48 hours\):\s*([\s\S]*)$/i)

  let missingKeywords: string[] = []
  if (missingKeywordsMatch) {
    missingKeywords = missingKeywordsMatch[1].split(',').map(k => k.trim()).filter(Boolean)
  }

  let certifications: string[] = []
  if (certsMatch) {
    certifications = certsMatch[1]
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('-') || line.startsWith('*') || /^\d+\./.test(line))
      .map(line => line.replace(/^[-*\s]|\d+\.\s*/, '').trim())
  }

  let quickWins: string[] = []
  if (winsMatch) {
    quickWins = winsMatch[1]
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('-') || line.startsWith('*') || /^\d+\./.test(line))
      .map(line => line.replace(/^[-*\s]|\d+\.\s*/, '').trim())
  }

  return {
    missingKeywords,
    certifications,
    quickWins
  }
}

