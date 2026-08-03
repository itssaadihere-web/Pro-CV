import fs from 'fs'
import path from 'path'

/**
 * Helper to pick a random template from the specified category folder
 * while ensuring no repetitions until all templates have been used.
 */
function getRandomTemplate(templateType: 'modern' | 'minimalist'): { filePath: string; fileName: string } | null {
  try {
    const templatesDir = path.join(process.cwd(), 'CV Templates')
    const folderName = templateType === 'modern' ? 'Modern' : 'Minimalist'
    const folderPath = path.join(templatesDir, folderName)

    if (!fs.existsSync(folderPath)) {
      console.warn(`⚠️ Template folder not found: ${folderPath}`)
      return null
    }

    // Read all PDF files in the category directory
    const files = fs.readdirSync(folderPath).filter(file => file.toLowerCase().endsWith('.pdf'))
    if (files.length === 0) {
      console.warn(`⚠️ No PDF files found in: ${folderPath}`)
      return null
    }

    // Load history of used templates
    const historyPath = path.join(templatesDir, 'template_history.json')
    let history: Record<string, string[]> = { modern: [], minimalist: [] }

    if (fs.existsSync(historyPath)) {
      try {
        const fileContent = fs.readFileSync(historyPath, 'utf-8')
        history = JSON.parse(fileContent)
        if (!history.modern) history.modern = []
        if (!history.minimalist) history.minimalist = []
      } catch (e) {
        console.error('⚠️ Error reading template history file:', e)
      }
    }

    const usedList = templateType === 'modern' ? history.modern : history.minimalist

    // Filter out templates that have already been used
    let unusedFiles = files.filter(f => !usedList.includes(f))

    // If all templates in the folder have been used, reset the history for this folder
    if (unusedFiles.length === 0) {
      unusedFiles = files
      if (templateType === 'modern') {
        history.modern = []
      } else {
        history.minimalist = []
      }
    }

    // Pick a random unused file
    const chosenFile = unusedFiles[Math.floor(Math.random() * unusedFiles.length)]

    // Record it as used in history
    if (templateType === 'modern') {
      history.modern.push(chosenFile)
    } else {
      history.minimalist.push(chosenFile)
    }

    // Write back updated history
    try {
      fs.writeFileSync(historyPath, JSON.stringify(history, null, 2), 'utf-8')
    } catch (e) {
      console.error('⚠️ Error saving template history file:', e)
    }

    return {
      filePath: path.join(folderPath, chosenFile),
      fileName: chosenFile
    }
  } catch (error) {
    console.error(`❌ Error picking random template for ${templateType}:`, error)
    return null
  }
}

export function getTemplateCategory(fileName: string): string {
  const name = fileName.toLowerCase()
  if (
    name.includes('black modern') || name.includes('dark') ||
    name.includes('sidebar') || name.includes('blue light') ||
    name.includes('deep purple') || name.includes('green elegant') ||
    name.includes('red black') || name.includes('white black elegant') ||
    name.includes('blue and gray') || name.includes('blue and white modern')
  ) return 'SIDEBAR_LEFT'

  if (
    name.includes('minimalist accountant') || name.includes('simple minimalist') ||
    name.includes('simple clean') || name.includes('science') ||
    name.includes('elegant clean classic') || name.includes('simple infographic')
  ) return 'SINGLE_COLUMN_CENTERED'

  if (
    name.includes('two column') || name.includes('reversed') ||
    name.includes('professional modern cv resume') || name.includes('gray and white simple professional')
  ) return 'TWO_COLUMN_REVERSED'

  return 'SINGLE_COLUMN_LEFT'
}

/**
 * Uses Gemini API to format and structure raw CV text specifically for a target layout template.
 * For modern and minimalist, uploads a template PDF to copy its formatting.
 * Returns the optimized text, or null if the key is not set or the request fails.
 */
export async function formatCVWithGemini(
  cvText: string,
  template: 'ats' | 'modern' | 'minimalist'
): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey || apiKey === 'your_gemini_key_here' || apiKey.includes('placeholder')) {
    console.warn('⚠️ GEMINI API KEY not set. Bypassing template formatting.')
    return null
  }

  let pdfBase64: string | null = null
  let selectedFileDetails: { filePath: string; fileName: string } | null = null

  // 1. Select and load PDF template for Modern or Minimalist layouts
  if (template === 'modern' || template === 'minimalist') {
    selectedFileDetails = getRandomTemplate(template)
    if (selectedFileDetails) {
      try {
        const fileBuffer = fs.readFileSync(selectedFileDetails.filePath)
        pdfBase64 = fileBuffer.toString('base64')
        console.log(`📄 Gemini uploaded template: "${selectedFileDetails.fileName}"`)
      } catch (err) {
        console.error(`⚠️ Failed to read PDF template file:`, err)
      }
    }
  }

  // 2. Prepare structured candidateData from cvText
  let candidateData = cvText
  try {
    const kimiData = JSON.parse(cvText)
    if (kimiData && kimiData.personal) {
      candidateData = `
CANDIDATE NAME: ${kimiData.personal.full_name || ''}
JOB TITLE: ${kimiData.personal.job_title || ''}
EMAIL: ${kimiData.personal.email || ''}
PHONE: ${kimiData.personal.phone || ''}
LOCATION: ${kimiData.personal.location || ''}
LINKEDIN: ${kimiData.personal.linkedin || ''}
WEBSITE: ${kimiData.personal.website || ''}

PROFESSIONAL SUMMARY:
${kimiData.summary || ''}

CORE COMPETENCIES:
${(kimiData.core_competencies || []).join(' | ')}

WORK EXPERIENCE:
${(kimiData.experience || []).map((exp: any) => `
ROLE: ${exp.job_title}
COMPANY: ${exp.company}
LOCATION: ${exp.location || ''}
DATES: ${exp.start_date} to ${exp.end_date}
ACHIEVEMENTS:
${(exp.bullets || []).map((b: string) => `- ${b}`).join('\n')}
`).join('\n---\n')}

KEY ACHIEVEMENTS:
${(kimiData.key_achievements || []).join('\n')}

EDUCATION:
${(kimiData.education || []).map((edu: any) =>
  `${edu.degree} | ${edu.institution} | ${edu.graduation_year}${edu.distinction ? ' | ' + edu.distinction : ''}`
).join('\n')}

CERTIFICATIONS:
${kimiData.certifications && kimiData.certifications.length > 0
  ? kimiData.certifications.map((c: any) => `${c.name} — ${c.issuer} (${c.year})`).join('\n')
  : 'None'
}

TECHNICAL SKILLS:
${Object.entries(kimiData.technical_skills || {}).map(([cat, skills]) =>
  `${cat}: ${Array.isArray(skills) ? skills.join(', ') : skills}`
).join('\n')}

LANGUAGES:
${Array.isArray(kimiData.technical_skills?.Languages)
  ? kimiData.technical_skills.Languages.join(', ')
  : 'English'
}
`.trim()
    }
  } catch (e) {
    // cvText is already plain text
  }

  const fileName = selectedFileDetails?.fileName || `${template.toUpperCase()} Template`
  const templateCategory = getTemplateCategory(fileName)

  // 3. Build the query payload structure
  const contentsParts: any[] = []

  const prompt = `You are a professional CV formatting specialist for Sophi AI.

YOUR ONLY JOB:
Take the candidate data provided below and format it into a complete, professional CV that exactly matches the structural layout rules for the selected template. Return only the formatted CV — no conversation, no explanation, no preamble, no notes.

SELECTED TEMPLATE: "${fileName}"
TEMPLATE LAYOUT TYPE: "${templateCategory}"

LAYOUT RULES BY TEMPLATE TYPE:

IF templateCategory is "SIDEBAR_LEFT":
Structure: Two columns. Left sidebar (dark or colored, ~30% width) + Right main content (~70% width).
LEFT SIDEBAR contains in this order:
  - Candidate name (large, white or light text)
  - Job title (smaller, below name)
  - Contact details (email, phone, location, LinkedIn — each on its own line with icon label)
  - Core Competencies (listed vertically, one per line, white text)
  - Languages (if present)
  - Certifications (if present, abbreviated)
RIGHT MAIN CONTENT contains in this order:
  - Professional Summary (full text)
  - Work Experience (all roles — most recent first)
  - Key Achievements (as ★ bullets)
  - Education
  - Technical Skills (category: skill | skill | skill format)
Section headers in sidebar: SHORT ALL CAPS labels (CONTACT, SKILLS, LANGUAGES)
Section headers in main: Title Case with thin underline separator line

IF templateCategory is "SINGLE_COLUMN_CENTERED":
Structure: Full-width single column, centered alignment.
Order: Name (centered large) → thin separator line → Job Title (centered) → Contact line (centered, fields separated by | ) → Summary → Core Competencies (3-column grid) → Work Experience → Key Achievements → Education → Certifications → Technical Skills
Section headers: ALL CAPS BOLD with full-width thin underline

IF templateCategory is "SINGLE_COLUMN_LEFT":
Structure: Full-width single column, all left-aligned.
Order: Name (large, left) → Job Title → Contact row (icons + details, left-aligned) → Summary → Core Competencies → Work Experience → Key Achievements → Education → Certifications → Technical Skills
Experience entry format: Company name bold on left, dates right-aligned on same line. Job title below company in slightly smaller text. Bullets indented below.
Section headers: Bold left-aligned with colored left border or underline

IF templateCategory is "TWO_COLUMN_REVERSED":
Structure: Left main content (~65%) + Right sidebar (~35%).
Full-width colored header banner spanning both columns at top: Candidate name and title in banner.
LEFT MAIN: Summary → Work Experience → Key Achievements
RIGHT SIDEBAR (light background): Contact → Core Competencies → Education → Languages → Certifications
Section headers: Consistent style matching template description

UNIVERSAL RULES — apply regardless of template type:

1. NEVER output placeholder text: no "Lorem ipsum", no "[Your Name]", no "Company Name Here", no "123 Anywhere St", no "[Date]"
2. NEVER leave empty section headers — if a section has no data (e.g. certifications is empty), omit that section entirely
3. NEVER add any content not present in the candidate data provided below
4. Experience bullets: present tense for current role (end_date = "Present"), past tense for all previous roles
5. Dates: consistent format throughout — "Jan 2022 – Present" or "2022 – Present" — pick one and apply to all
6. Contact line: only include fields with actual values — skip empty phone, skip empty LinkedIn, skip empty website
7. Key Achievements: preserve the ★ symbol as the bullet marker
8. Professional Summary: output exactly as provided — do not shorten or rephrase
9. Certifications: if empty array was provided, omit the certifications section entirely
10. The output MUST start with the candidate's full name as the very first text — no preamble, no "Here is your CV:", no blank lines before the name
11. Maintain consistent formatting throughout — do not mix heading styles between sections

CANDIDATE DATA:
${candidateData}

Return the complete formatted CV starting with the candidate name on line 1. Nothing before it. Nothing after the last line of the CV content.`

  if (pdfBase64 && selectedFileDetails) {
    contentsParts.push({
      inlineData: {
        mimeType: 'application/pdf',
        data: pdfBase64
      }
    })
  }

  contentsParts.push({ text: prompt })

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 12000) // 12s timeout for PDF upload response

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: contentsParts }],
          generationConfig: {
            temperature: 0.1, // low temperature for high layout precision
          }
        }),
        signal: controller.signal,
      }
    )

    clearTimeout(timeoutId)

    if (!response.ok) {
      console.error(`❌ Gemini API error: ${response.status} ${response.statusText}`)
      return null
    }

    const data = await response.json()
    const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text
    return textOutput ? textOutput.trim() : null
  } catch (error) {
    console.error('❌ Error communicating with Gemini API:', error)
    return null
  }
}
