import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

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
    const { url } = await req.json()

    if (!url || typeof url !== 'string' || !url.includes('linkedin.com')) {
      return NextResponse.json({ error: 'Please provide a valid LinkedIn profile URL.' }, { status: 400 })
    }

    // Extract handle from URL (e.g., https://www.linkedin.com/in/itsaadihere/ -> itsaadihere)
    const handleMatch = url.match(/linkedin\.com\/in\/([^\/\?#]+)/i)
    const rawHandle = handleMatch ? handleMatch[1] : ''
    const formattedHandleName = rawHandle
      ? rawHandle.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      : ''

    const proxycurlKey = process.env.PROXYCURL_API_KEY
    let currentProfileText = ''

    if (proxycurlKey) {
      try {
        const response = await fetch(`https://nubela.co/proxycurl/api/v2/linkedin?url=${encodeURIComponent(url)}`, {
          headers: { 'Authorization': `Bearer ${proxycurlKey}` }
        })
        if (response.ok) {
          const data = await response.json()
          currentProfileText = JSON.stringify(data)
        } else {
          console.warn('Proxycurl fetch failed:', await response.text())
        }
      } catch (err) {
        console.warn('Proxycurl error:', err)
      }
    }

    // Attempt public HTML meta scraping if Proxycurl text is empty
    if (!currentProfileText) {
      currentProfileText = await fetchLinkedinMeta(url)
    }

    const geminiKey = process.env.GEMINI_API_KEY
    if (!geminiKey) {
      return NextResponse.json({ error: 'Gemini API key is missing' }, { status: 500 })
    }

    const ai = new GoogleGenAI({ apiKey: geminiKey })

    const systemPrompt = `You are a strict LinkedIn Profile Data Extractor.
CRITICAL RULES:
1. Do NOT invent fake random people, fake names (like Aarti Sharma or John Doe), fake companies, or fake universities (like UC Berkeley or IIT Delhi).
2. If real name is present in the scraped title or text, extract it. If not, use the URL handle derived name: "${formattedHandleName}".
3. If specific experiences or educations are not explicitly provided in the payload text, leave "experiences" and "educations" as EMPTY ARRAYS []. Do NOT generate dummy placeholder experiences.
4. Output strictly valid JSON matching this schema:

{
  "fullName": "Real name from text or ${formattedHandleName}",
  "jobTitle": "Extracted headline / job title or empty string if unknown",
  "summary": "Extracted summary / description or empty string if unknown",
  "experiences": [
    {
      "company": "Real Company Name",
      "position": "Real Position Title",
      "startDate": "Start Date",
      "endDate": "End Date",
      "location": "Location",
      "description": "Details"
    }
  ],
  "educations": [
    {
      "institution": "Real University Name",
      "degree": "Degree",
      "fieldOfStudy": "Field",
      "graduationYear": "Year"
    }
  ],
  "skills": ["Real Skill 1", "Real Skill 2"]
}`

    const userPrompt = currentProfileText
      ? `Extract profile details from this fetched payload:\n${currentProfileText}`
      : `Extract real profile details for LinkedIn profile URL handle "${formattedHandleName}" (${url}). Do not invent fake names or placeholder experiences.`

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

    // Enforce name fix if empty or hallucinated
    if (!profileData.fullName || profileData.fullName.includes('Aarti') || profileData.fullName.includes('John Doe')) {
      profileData.fullName = formattedHandleName || 'LinkedIn User'
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
