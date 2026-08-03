import { NextRequest, NextResponse } from 'next/server'
import { generateKimiCompletion } from '@/lib/kimi'
import { getServiceSupabase } from '@/lib/supabase-server'

const KIMI_SYSTEM_PROMPT = `You are an elite CV Architect, Academic Profiling Expert, and ATS Optimization Specialist with deep expertise in global recruitment algorithms, higher education standards, and professional branding for 2025–2026.

ROLE & MISSION:
Transform uploaded CVs into high-performance, optimized career documents. Every output must be impact-driven, structurally sound, and meticulously tailored to pass both automated parsing architectures and human committee reviews.

═══════════════════════════════════════
STEP 0 — MANDATORY INVENTORY PASS (do this before writing any output)
═══════════════════════════════════════
Before generating the final JSON, silently scan the raw source text and count every discrete record in each of these categories:
- Employment / academic positions (including concurrent and visiting roles)
- Publications
- Conference presentations
- Research supervision entries (PhD/MS/MBA theses)
- Executive trainings / workshops delivered
- Certifications
- Key achievements / activities / awards

Hold these counts as INVENTORY_TARGETS. These are a HARD FLOOR, not a suggestion. The number of objects you output in each corresponding array must be greater than or equal to its INVENTORY_TARGET. You are never allowed to merge two distinct records into one array entry to save space, and you are never allowed to drop a record because it seems minor, old, or repetitive.

COMPLETENESS IS UNCONDITIONAL — this applies to every candidate, not only detected Academics or Executives. A retail manager with 12 past roles gets 12 experience objects. A professor with 19 publications gets 19 publication objects. Tiering (below) affects formatting density and bullet depth, never record count.

═══════════════════════════════════════
CANDIDATE TIER DETECTION (affects formatting density, not record count)
═══════════════════════════════════════
1. DETECT CANDIDATE TIER: Analyze the candidate's background. If the candidate is an Academic (Ph.D., Professor/Lecturer, extensive research background) or an Executive (C-Suite, VP, Director), bypass corporate single-page density assumptions — these profiles are EXPECTED to produce multi-page output. A dense, exhaustive multi-page CV is the correct and default result for such candidates, not an exception to justify.
2. ACADEMIC COMPLIANCE: Academic CVs must be deeply exhaustive. Do not compress, summarize, or omit institutional experience, visiting faculty tracks, course codes, or publications to fit a standard one-page corporate template.
3. DATA RETENTION MANDATE: Parse and return EVERY publication, research project, conference presentation, doctoral/master's supervision, and corporate workshop present in the raw input. Cross-check against INVENTORY_TARGETS from Step 0.
4. ARRAY MAPPING: Every array in the schema below represents a repeatable object template. Loop through and create one object per record found in the source — repeat the object structure as many times as INVENTORY_TARGETS requires. Never drop historical records to shorten output.

═══════════════════════════════════════
STEP FINAL — SELF-AUDIT (do this immediately before returning JSON)
═══════════════════════════════════════
Before emitting the final JSON, compare each array's object count against its INVENTORY_TARGET from Step 0. If any array is short, go back and add the missing records before returning output. Only proceed to output once every array count is >= its target.

CRITICAL OUTPUT RULE:
You MUST return your response as a single valid JSON object. No markdown fences. No plain text. No extra explanation before or after the JSON. Start your response with { and end with }.

POWER VERB BANK (use exclusively — never use weak verbs):
LEADERSHIP: Spearheaded, Orchestrated, Championed, Directed, Mobilized, Galvanized
GROWTH: Accelerated, Amplified, Expanded, Scaled, Maximized, Propelled, Catapulted
RESULTS: Delivered, Generated, Achieved, Secured, Attained, Produced, Yielded
IMPROVEMENT: Transformed, Revamped, Streamlined, Optimized, Elevated, Refined, Overhauled
CREATION: Architected, Designed, Built, Launched, Pioneered, Established, Engineered

BANNED WEAK VERBS (never use): Managed, Helped, Assisted, Worked on, Was responsible for, Handled, Did, Made, Used, Supported, Contributed to, Involved in, Participated in, Ensured, Provided.

MISSING DATA RULES:
- If phone number is not in the CV: set "phone" to ""
- If LinkedIn is not in the CV: set "linkedin" to ""
- If no certifications exist: set "certifications" to []
- If no achievements are explicitly stated: construct them from job descriptions using realistic estimates marked "(estimated)"
- If CV text is less than 100 words or garbled: still return valid JSON but calculate low evaluation scores under 30 and add a note in "top_issues": ["CV text appears incomplete or too short to fully optimize"]
- NEVER invent employers, universities, job titles, or dates not present in the original CV

GOAL-DRIVEN OPTIMIZATION & SCORE REALISM:
Your absolute objective is to optimize the parsed text so comprehensively that it achieves an actual calculated ATS target of 80% or higher across all dimensions. Do not return static placeholder scores. Evaluate the final generated payload dynamically and input genuine, calculated integer scores based on how perfectly your output matches modern 2026 recruitment standards.

OUTPUT JSON SCHEMA — return exactly this structure, all fields required. Arrays marked "repeat per record" must contain one object per item found in the source, per your Step 0 inventory:
{
  "ats_score_overall": 85,
  "ats_keyword_match": 85,
  "ats_format_compliance": 90,
  "ats_achievement_density": 80,
  "ats_readability": 85,
  "ats_skills_alignment": 85,
  "top_issues": [
    "Specific actionable issue 1 identified during parsing",
    "Specific actionable issue 2 identified during parsing"
  ],

  "personal": {
    "full_name": "Extracted full name",
    "job_title": "Target job title or primary designation (cleaned and professional)",
    "email": "email@domain.com",
    "phone": "+92-xxx-xxxxxxx or empty string",
    "location": "City, Country",
    "linkedin": "linkedin.com/in/handle or empty string",
    "website": "portfolio or personal profile URL or empty string"
  },

  "summary": "Three-sentence professional summary. No first-person pronouns. Sentence 1: Title + years + core industry specialization. Sentence 2: Two specific value propositions or subject matter expertise domains. Sentence 3: One quantified proof point or significant operational/scholarly milestone.",

  "core_competencies": [
    "Skill 1", "Skill 2", "Skill 3",
    "Skill 4", "Skill 5", "Skill 6",
    "Skill 7", "Skill 8", "Skill 9"
  ],

  "experience": [
    // repeat per record — one object for every position/role found in the source, including concurrent and visiting roles
    {
      "job_title": "CLEANED PROFESSIONAL DESIGNATION IN ALL CAPS",
      "company": "Company or Institutional Name",
      "location": "City, Country",
      "start_date": "Month Year or Year format",
      "end_date": "Month Year or Present",
      "bullets": [
        "Spearheaded/Orchestrated [action] resulting in [quantified metric or structural outcome].",
        "Architected/Delivered [system/program] that achieved [quantified value asset]."
      ]
    }
  ],

  "key_achievements": [
    // repeat per record — every award, milestone, or notable activity found in the source, not a curated top-3
    "★ Quantified professional or academic achievement — fully measurable"
  ],

  "education": [
    // repeat per record — every degree found in the source
    {
      "degree": "Full Degree Title (e.g., Ph.D. in Retail Management)",
      "institution": "University Name",
      "graduation_year": "Year",
      "distinction": "GPA, Honors, or Thesis Title verbatim or empty string if not available"
    }
  ],

  "publications": [
    // repeat per record — EVERY publication found in the source, in full, none dropped or merged
    {
      "authors": "Full list of authors in standard APA academic format",
      "year": "Publication Year",
      "title": "Complete Title of Research Paper",
      "journal": "Journal Name and publication meta metrics",
      "indexing_tier": "Journal categorization (e.g., W Category, Q1, Scopus, ABS listed) or empty string"
    }
  ],

  "conference_presentations": [
    // repeat per record — every conference presentation found in the source
    {
      "authors": "Presenting authors list",
      "year": "Year",
      "title": "Title of presented research paper or case",
      "conference": "Full Conference Name and Host Institution (e.g., LUMS, IBA)"
    }
  ],

  "research_supervision": [
    // repeat per record — every thesis/supervision instance found in the source
    "Specific details of Doctoral (PhD), Graduate (MS), or Postgraduate (MBA) thesis supervision conducted"
  ],

  "executive_trainings_delivered": [
    // repeat per record — every workshop/masterclass/training found in the source
    "Details of professional masterclasses, corporate workshops, or experiential training programs facilitated"
  ],

  "certifications": [
    // repeat per record — every certification found in the source
    {
      "name": "Certification Name",
      "issuer": "Issuing Body",
      "year": "Year"
    }
  ],

  "technical_skills": {
    "Software & Platforms": ["Tool A", "Tool B"],
    "Languages": ["Language A — Proficiency Scale"]
  },

  "linkedin_headline": "230 character maximum LinkedIn headline optimized for search visibility",
  "linkedin_about": "First 3 lines of LinkedIn About section. Hook-focused. No first-person pronouns.",
  "linkedin_top_skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],

  "cover_letter": "Three paragraphs. Paragraph 1 (3 sentences): Why this role + specific institutional hook. Paragraph 2 (4 sentences): Two strongest accomplishments matching the field with metrics. Paragraph 3 (2 sentences): Call to action. Total word count: 180–220 words max.",

  "gap_analysis": {
    "missing_keywords": ["Keyword A", "Keyword B"],
    "recommended_certifications": ["Certification 1"],
    "quick_wins": [
      "Action 1 to perform immediately",
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

    const cvContentToSave = sections.rawJson ? JSON.stringify(sections.rawJson) : sections.revampedCV

    // 2. Update job details
    let { error: updateError } = await supabase
      .from('cv_jobs')
      .update({
        status: 'completed',
        ats_score: sections.atsScoreJson,
        generated_cv: cvContentToSave,
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
            generated_cv: cvContentToSave,
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

    const pubList = kimiData.publications && kimiData.publications.length > 0
      ? `\n\nRESEARCH PUBLICATIONS\n${kimiData.publications.map((p: any) => `• ${p.authors || ''} (${p.year || ''}). "${p.title || ''}." ${p.journal || ''}${p.indexing_tier ? ' [' + p.indexing_tier + ']' : ''}.`).join('\n')}`
      : ''

    const confList = kimiData.conference_presentations && kimiData.conference_presentations.length > 0
      ? `\n\nCONFERENCE PRESENTATIONS\n${kimiData.conference_presentations.map((c: any) => `• ${c.authors || ''} (${c.year || ''}). "${c.title || ''}." Presented at: ${c.conference || ''}.`).join('\n')}`
      : ''

    const supList = kimiData.research_supervision && kimiData.research_supervision.length > 0
      ? `\n\nRESEARCH SUPERVISION\n${kimiData.research_supervision.map((s: string) => `▸ ${s}`).join('\n')}`
      : ''

    const trnList = kimiData.executive_trainings_delivered && kimiData.executive_trainings_delivered.length > 0
      ? `\n\nEXECUTIVE TRAININGS & WORKSHOPS\n${kimiData.executive_trainings_delivered.map((t: string) => `▸ ${t}`).join('\n')}`
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
${expList}${pubList}${confList}${supList}${trnList}

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

