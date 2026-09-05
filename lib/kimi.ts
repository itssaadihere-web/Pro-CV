export async function generateGeminiFallback(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const geminiKey = process.env.GEMINI_API_KEY
  if (!geminiKey) {
    throw new Error('Neither Moonshot nor GEMINI_API_KEY is available')
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
          maxOutputTokens: 16000,
        },
      }),
    }
  )

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Gemini Fallback API failed with status ${res.status}: ${errText}`)
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
  const apiKey = process.env.MOONSHOT_API_KEY || process.env.KIMI_API_KEY
  const apiBase = process.env.KIMI_API_BASE || 'https://api.moonshot.ai/v1'

  // Default to kimi-k2.6 for high-speed, reliable execution
  const model = options?.model || process.env.KIMI_MODEL || 'kimi-k2.6'
  const reasoningEffort = options?.reasoningEffort || 'low'

  if (!apiKey) {
    console.warn('⚠️ Moonshot API key missing. Falling back to Gemini 2.5 Flash directly...')
    return generateGeminiFallback(systemPrompt, userPrompt)
  }

  const isK3 = model.startsWith('kimi-k3')

  const requestBody: Record<string, any> = {
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  }

  if (isK3) {
    requestBody.reasoning_effort = reasoningEffort
    requestBody.max_completion_tokens = 16000
  } else {
    requestBody.temperature = 1.0
    requestBody.max_tokens = 16000
  }

  try {
    const response = await fetch(`${apiBase}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.warn(`⚠️ Moonshot/Kimi API error (${response.status}): ${errorText}. Falling back to Gemini 2.5 Flash...`)
      return generateGeminiFallback(systemPrompt, userPrompt)
    }

    const data = await response.json()
    if (!data.choices || data.choices.length === 0) {
      console.warn('⚠️ Moonshot returned empty choices. Falling back to Gemini 2.5 Flash...')
      return generateGeminiFallback(systemPrompt, userPrompt)
    }

    const message = data.choices[0].message
    if (message.reasoning_content) {
      console.log('🧠 Kimi K3 Reasoning Trace length:', message.reasoning_content.length)
    }

    return message.content || ''
  } catch (err: any) {
    console.warn('⚠️ Exception in Moonshot AI execution:', err?.message || err, 'Falling back to Gemini 2.5 Flash...')
    return generateGeminiFallback(systemPrompt, userPrompt)
  }
}

