async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3): Promise<Response> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const res = await fetch(url, options)
    if (res.status === 429 && attempt < maxRetries) {
      console.warn(`[Kimi API Attempt ${attempt}] Rate limited (429). Retrying in ${attempt * 3} seconds...`)
      await new Promise((r) => setTimeout(r, attempt * 3000))
      continue
    }
    return res
  }
  return fetch(url, options)
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
  const model = options?.model || process.env.KIMI_MODEL || 'kimi-k3'
  const reasoningEffort = options?.reasoningEffort || 'low'

  if (!apiKey) {
    throw new Error('MOONSHOT_API_KEY or KIMI_API_KEY is not configured in .env.local')
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
    requestBody.max_completion_tokens = 8192
  } else {
    requestBody.temperature = 1.0
    requestBody.max_tokens = 8192
  }

  try {
    const response = await fetchWithRetry(`${apiBase}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Kimi AI Engine failed (${response.status}): ${errorText}`)
    }

    const data = await response.json()
    if (!data.choices || data.choices.length === 0) {
      throw new Error('Kimi AI Engine returned empty choices payload')
    }

    const message = data.choices[0].message
    if (message.reasoning_content) {
      console.log('🧠 Kimi K3 Reasoning Trace length:', message.reasoning_content.length)
    }

    return message.content || ''
  } catch (err: any) {
    console.error('AI Completion Error (Kimi K3):', err)
    throw err
  }
}



