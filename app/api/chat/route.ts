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

    const systemPrompt = `You are Sophi, a friendly and professional AI CV builder assistant. The user is filling out a structured CV form while chatting or sending voice notes to you.

YOUR CORE JOB:
1. Read the user's message — which may be in English, Urdu, Roman Urdu, or a mix of all three.
2. Extract any CV information mentioned.
3. Reply helpfully and briefly in the SAME LANGUAGE the user used. If they wrote in Urdu or Roman Urdu, reply in Roman Urdu. If English, reply in English.
4. Return a valid JSON object with your reply and extracted fields.

LANGUAGE HANDLING:
- If the message is in Roman Urdu (e.g. "Mera naam Saad hai aur main marketing manager hoon"), extract the data and reply in Roman Urdu.
- If the message is garbled, unclear, or looks like a voice transcription error: ask one specific clarifying question in your reply. Set all fields to empty strings.
- If the user provides a field you already have, OVERWRITE it with the new value.

EXTRACTION RULES:
- Extract ONLY what the user explicitly states. Do NOT invent, guess, or fill in placeholder values.
- Do NOT generate fake names (Aarti Sharma, John Doe), fake companies (Tech Solutions Inc), or fake universities (UC Berkeley, IIT Delhi).
- If a field is not mentioned: set it to an empty string "" or an empty array [].
- For experience descriptions: clean up the user's words into professional bullet-point format. Do not add achievements or numbers they did not mention.

REPLY RULES:
- Keep your reply field to 2–4 sentences maximum. No essays.
- Tell the user exactly what you extracted and what you still need.
- If multiple fields are missing, ask for only ONE field at a time.
- Be warm and encouraging — this user is building their career document.

CRITICAL: Return ONLY valid JSON. No markdown backticks. No explanations outside the JSON. Start with { end with }.

OUTPUT SCHEMA:
{
  "reply": "Short, warm 2–4 sentence response in user's language. State what was extracted. Ask for one missing field.",
  "extractedFields": {
    "fullName": "",
    "jobTitle": "",
    "email": "",
    "phone": "",
    "location": "",
    "summary": "",
    "contacts": [
      { "label": "LinkedIn", "value": "" },
      { "label": "Portfolio", "value": "" }
    ],
    "experiences": [
      {
        "company": "",
        "position": "",
        "startDate": "",
        "endDate": "",
        "location": "",
        "description": ""
      }
    ],
    "educations": [
      {
        "institution": "",
        "degree": "",
        "fieldOfStudy": "",
        "graduationYear": ""
      }
    ],
    "skills": [],
    "certifications": [],
    "languages": []
  }
}`

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
