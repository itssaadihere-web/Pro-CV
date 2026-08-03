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
  
  // Enforce 'low' reasoning_effort for ultra-fast (5-8s) response times to stay within Vercel Free Tier limits
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
    requestBody.max_completion_tokens = 16000
  } else {
    requestBody.temperature = 0.3
    requestBody.max_tokens = 16000
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 25000) // 25-second client abort guard

  try {
    const response = await fetch(`${apiBase}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Kimi API Error Response (${model}):`, errorText)

      if (isK3 && (response.status === 404 || errorText.includes('model_not_found'))) {
        console.warn('⚠️ Kimi K3 fallback triggered -> switching to moonshot-v1-32k...')
        return generateKimiCompletion(systemPrompt, userPrompt, { model: 'moonshot-v1-32k' })
      }

      throw new Error(`Kimi API failed with status ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    if (!data.choices || data.choices.length === 0) {
      throw new Error('Kimi API returned an empty completion response')
    }

    const message = data.choices[0].message
    if (message.reasoning_content) {
      console.log('🧠 Kimi K3 Reasoning Trace length:', message.reasoning_content.length)
    }

    return message.content || ''
  } catch (err: any) {
    clearTimeout(timeoutId)
    // If K3 times out or aborts, instantly fallback to high-speed moonshot-v1-32k
    if (isK3 && (err.name === 'AbortError' || err.message?.includes('aborted'))) {
      console.warn('⚠️ Kimi K3 25s timeout limit reached. Retrying instantly with high-speed moonshot-v1-32k fallback...')
      return generateKimiCompletion(systemPrompt, userPrompt, { model: 'moonshot-v1-32k' })
    }
    throw err
  }
}
