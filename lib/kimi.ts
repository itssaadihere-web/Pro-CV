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
  // Use 'low' reasoning effort by default for fast, low-latency structured CV generation
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
    console.error(`Kimi API Error Response (${model}):`, errorText)

    // Fallback to legacy model if kimi-k3 returns model not found or authorization issue
    if (isK3 && (response.status === 404 || errorText.includes('model_not_found'))) {
      console.warn('⚠️ Kimi K3 not active on current endpoint key. Falling back to moonshot-v1-32k...')
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
}
