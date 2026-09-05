export async function generateGeminiCompletion(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const geminiKey = process.env.GEMINI_API_KEY
  if (!geminiKey) {
    throw new Error('GEMINI_API_KEY is not configured in .env.local')
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 8192,
          responseMimeType: 'application/json',
        },
      }),
    }
  )

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Gemini API failed with status ${res.status}: ${errText}`)
  }

  const data = await res.json()
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
  return content
}

export async function generateKimiCompletion(
  systemPrompt: string,
  userPrompt: string,
  options?: {
    model?: string
    reasoningEffort?: 'low' | 'high' | 'max'
  }
): Promise<string> {
  // If GEMINI_API_KEY is available, use Gemini 2.5 Flash for guaranteed fast (<15s) and 100% valid JSON responses
  if (process.env.GEMINI_API_KEY) {
    try {
      return await generateGeminiCompletion(systemPrompt, userPrompt)
    } catch (geminiErr) {
      console.warn('⚠️ Gemini completion error, attempting Moonshot fallback:', geminiErr)
    }
  }

  const apiKey = process.env.MOONSHOT_API_KEY || process.env.KIMI_API_KEY
  const apiBase = process.env.KIMI_API_BASE || 'https://api.moonshot.ai/v1'
  const model = options?.model || process.env.KIMI_MODEL || 'kimi-k2.6'

  if (!apiKey) {
    throw new Error('Neither GEMINI_API_KEY nor KIMI_API_KEY is available')
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 20000)

  try {
    const response = await fetch(`${apiBase}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        temperature: 1.0,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 8192,
      }),
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Moonshot API failed with status ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    const message = data.choices?.[0]?.message?.content || ''
    return message
  } catch (err: any) {
    clearTimeout(timeoutId)
    console.error('AI Completion Error:', err)
    throw err
  }
}


