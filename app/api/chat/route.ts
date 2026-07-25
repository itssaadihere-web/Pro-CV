import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const historyJson = (formData as any).get('history') as string
    const text = (formData as any).get('text') as string | null
    const audioBlob = (formData as any).get('audio') as Blob | null

    const history = historyJson ? JSON.parse(historyJson) : []
    
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key is not configured.' }, { status: 500 })
    }

    const ai = new GoogleGenAI({ apiKey })

    const systemPrompt = `You are Sophi, an AI CV builder assistant.
The user is filling out a structured CV form on screen while chatting or sending voice notes to you.
Your job is to:
1. Understand the user's text message or voice note recording.
2. Extract any relevant CV information mentioned (full name, job title, contact email, phone, location, professional summary, work experience items with company, position, dates, description, education items with institution, degree, field of study, year, skills, certifications, languages, extra contacts).
3. Provide a helpful, encouraging text reply telling the user what details you extracted and auto-filled into their form, and asking what else they want to add.
4. Output your response strictly as a JSON object matching this schema:

{
  "reply": "Friendly response string explaining what was extracted and auto-filled into the form...",
  "extractedFields": {
    "fullName": "extracted full name or empty string if not mentioned",
    "jobTitle": "extracted job title or empty string if not mentioned",
    "email": "extracted email or empty string",
    "phone": "extracted phone or empty string",
    "location": "extracted location or empty string",
    "summary": "extracted professional summary or empty string",
    "contacts": [
      { "label": "e.g. LinkedIn / Portfolio", "value": "url or handle" }
    ],
    "experiences": [
      {
        "company": "Company Name",
        "position": "Job Title",
        "startDate": "Start Date e.g. 2021",
        "endDate": "End Date e.g. Present",
        "location": "City/Country",
        "description": "Responsibilities and bullet points"
      }
    ],
    "educations": [
      {
        "institution": "University / School Name",
        "degree": "Degree e.g. BS Computer Science",
        "fieldOfStudy": "Field e.g. Software Engineering",
        "graduationYear": "e.g. 2022"
      }
    ],
    "skills": ["Skill 1", "Skill 2"],
    "certifications": ["Cert 1"],
    "languages": ["English", "Urdu"]
  }
}

Return ONLY valid JSON. Do not wrap in backticks or markdown fences if possible.`

    const contents: any[] = []

    for (const msg of history) {
      if (msg.role === 'assistant') {
        contents.push({ role: 'model', parts: [{ text: msg.content }] })
      } else {
        contents.push({ role: 'user', parts: [{ text: msg.content }] })
      }
    }

    const currentParts: any[] = []

    if (text) {
      currentParts.push({ text })
    }

    if (audioBlob) {
      const buffer = await audioBlob.arrayBuffer()
      const base64Data = Buffer.from(buffer).toString('base64')
      currentParts.push({
        inlineData: {
          data: base64Data,
          mimeType: audioBlob.type || 'audio/webm'
        }
      })
      currentParts.push({ text: "Please listen to this voice note, transcribe it, extract any CV details, and respond in the required JSON format." })
    }

    if (currentParts.length > 0) {
      contents.push({ role: 'user', parts: currentParts })
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.3,
        responseMimeType: 'application/json',
      }
    })

    const rawText = response.text || '{}'
    let parsed: any = {}
    try {
      // Clean JSON fences if any
      const cleanJson = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      parsed = JSON.parse(cleanJson)
    } catch (e) {
      parsed = {
        reply: rawText || "I've noted that! You can check the form on the left to verify your details.",
        extractedFields: {}
      }
    }

    return NextResponse.json({
      reply: parsed.reply || "I've updated your form details!",
      extractedFields: parsed.extractedFields || {}
    })

  } catch (error: any) {
    console.error('Error in chat route:', error)
    return NextResponse.json({ error: error.message || 'Failed to process chat request' }, { status: 500 })
  }
}
