import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { parsePdf, parseDocx } from '@/lib/parsers'

async function fetchLinkedinMeta(url: string): Promise<string> {
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

    const title = titleMatch ? titleMatch[1] : ''
    const desc = descMatch ? descMatch[1] : ''

    if (title || desc) {
      return `Scraped Meta Information:\nTitle: ${title}\nDescription: ${desc}`
    }
  } catch (err) {
    console.warn('Public scraping error:', err)
  }
  return ''
}

export async function POST(req: NextRequest) {
  try {
    let url = ''
    let userPastedText = ''
    let fileText = ''

    const contentType = req.headers.get('content-type') || ''
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData()
      const file = formData.get('file') as File | null
      url = (formData.get('url') as string) || ''
      userPastedText = (formData.get('rawText') as string) || ''

      if (file) {
        const buffer = Buffer.from(await file.arrayBuffer())
        if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
          fileText = await parsePdf(buffer)
        } else if (file.type.includes('wordprocessingml') || file.name.toLowerCase().endsWith('.docx')) {
          fileText = await parseDocx(buffer)
        }
      }
    } else {
      const body = await req.json().catch(() => ({}))
      url = body.url || ''
      userPastedText = body.rawText || ''
    }

    if (!url && !userPastedText && !fileText) {
      return NextResponse.json({ error: 'Please provide a valid LinkedIn URL, paste profile text, or upload a LinkedIn PDF/DOCX file.' }, { status: 400 })
    }

    let payloadText = fileText || userPastedText || ''
    let formattedHandleName = ''

    if (url && !payloadText) {
      const handleMatch = url.match(/linkedin\.com\/in\/([^\/\?#]+)/i)
      const rawHandle = handleMatch ? handleMatch[1] : ''
      formattedHandleName = rawHandle
        ? rawHandle.replace(/[-_]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
        : ''

      const proxycurlKey = process.env.PROXYCURL_API_KEY

      if (proxycurlKey) {
        try {
          const response = await fetch(`https://nubela.co/proxycurl/api/v2/linkedin?url=${encodeURIComponent(url)}`, {
            headers: { 'Authorization': `Bearer ${proxycurlKey}` }
          })
          if (response.ok) {
            const data = await response.json()
            payloadText = JSON.stringify(data)
          }
        } catch (err) {
          console.warn('Proxycurl error:', err)
        }
      }

      if (!payloadText) {
        payloadText = await fetchLinkedinMeta(url)
      }
    }

    const geminiKey = process.env.GEMINI_API_KEY
    if (!geminiKey) {
      return NextResponse.json({ error: 'Gemini API key is missing' }, { status: 500 })
    }

    const ai = new GoogleGenAI({ apiKey: geminiKey })

    const systemPrompt = `You are a strict LinkedIn and CV Profile Data Extractor.

YOUR JOB:
Extract structured profile data from the provided text, which may be:
- A LinkedIn profile PDF export (contains sections like Experience, Education, Skills, Certifications)
- A plain text CV paste
- An HTML export from LinkedIn (ignore all HTML tags — extract text content only)

EXTRACTION RULES:
1. Extract ONLY data explicitly present in the provided text. Do NOT invent names, companies, universities, or any details.
2. If experiences or educations are not explicitly provided: return empty arrays [].
3. For the contacts array: only use these allowed labels: "LinkedIn", "Portfolio", "GitHub", "Twitter/X", "Website". Ignore any other social links.
4. If the text appears to be an HTML dump: strip all HTML tags mentally and extract the visible text data only.
5. Phone numbers: extract in whatever format they appear. If none found: return "".
6. Summary/bio: extract verbatim if short enough, or summarize in 3–4 sentences if very long.
7. Skills: extract as individual items, not comma-separated strings.
8. If the input text is fewer than 50 words or appears corrupted: return all fields as empty strings and all arrays as [], but still return valid JSON.

CRITICAL: Return ONLY a single valid JSON object. No markdown. No backticks. Start with { end with }.

OUTPUT SCHEMA:
{
  "fullName": "Real full name or empty string",
  "jobTitle": "Current headline or most recent job title or empty string",
  "email": "email@domain.com or empty string",
  "phone": "Phone number or empty string",
  "location": "City, Country or empty string",
  "summary": "Extracted bio or professional summary or empty string",
  "experiences": [
    {
      "company": "Real company name",
      "position": "Real position title",
      "startDate": "Month Year format e.g. March 2020",
      "endDate": "Month Year or Present",
      "location": "City or Remote or empty string",
      "description": "Extracted responsibilities and achievements as found in the text"
    }
  ],
  "educations": [
    {
      "institution": "Real university or school name",
      "degree": "Full degree name e.g. Bachelor of Business Administration",
      "fieldOfStudy": "Major or field or empty string",
      "graduationYear": "Year e.g. 2022 or empty string"
    }
  ],
  "skills": ["Skill 1", "Skill 2", "Skill 3"],
  "certifications": ["Certification name and issuer if available"],
  "contacts": [
    { "label": "LinkedIn", "value": "URL or handle" }
  ]
}`

    const userPrompt = `Extract full CV details from this LinkedIn PDF export or profile text payload:\n${payloadText}`

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.1,
        responseMimeType: 'application/json',
      }
    })

    const rawText = result.text || '{}'
    let profileData: any = {}
    try {
      const cleanJson = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      profileData = JSON.parse(cleanJson)
    } catch (e) {
      profileData = {}
    }

    if (!profileData.fullName || profileData.fullName.includes('Aarti') || profileData.fullName.includes('John Doe')) {
      if (formattedHandleName) profileData.fullName = formattedHandleName
    }

    return NextResponse.json({
      success: true,
      profileData
    })

  } catch (error: any) {
    console.error('Error fetching LinkedIn profile:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
