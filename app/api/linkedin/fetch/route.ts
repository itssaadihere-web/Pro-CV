import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()

    if (!url || typeof url !== 'string' || !url.includes('linkedin.com')) {
      return NextResponse.json({ error: 'Please provide a valid LinkedIn profile URL.' }, { status: 400 })
    }

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

    // If Proxycurl is not configured or failed, fallback to Gemini profile extraction from URL context
    const geminiKey = process.env.GEMINI_API_KEY
    if (!geminiKey) {
      return NextResponse.json({ error: 'Gemini API key is missing' }, { status: 500 })
    }

    const ai = new GoogleGenAI({ apiKey: geminiKey })

    const systemPrompt = `You are a LinkedIn Profile Data Extractor.
Extract structured professional details from the LinkedIn profile information or URL provided.
Return strictly valid JSON matching this schema:

{
  "fullName": "Full Name extracted or parsed from URL handle",
  "jobTitle": "Job title or headline",
  "summary": "About / Bio summary",
  "experiences": [
    {
      "company": "Company Name",
      "position": "Job Title",
      "startDate": "Start Date e.g. 2021",
      "endDate": "End Date e.g. Present",
      "location": "Location",
      "description": "Responsibilities"
    }
  ],
  "educations": [
    {
      "institution": "University/School",
      "degree": "Degree e.g. BS Computer Science",
      "fieldOfStudy": "Field",
      "graduationYear": "Year"
    }
  ],
  "skills": ["Skill 1", "Skill 2"]
}`

    const userPrompt = currentProfileText
      ? `Extract CV details from this Proxycurl LinkedIn payload:\n${currentProfileText}`
      : `Extract baseline professional profile details for the person with LinkedIn URL: ${url}`

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.2,
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

    return NextResponse.json({
      success: true,
      profileData
    })

  } catch (error: any) {
    console.error('Error fetching LinkedIn profile:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
