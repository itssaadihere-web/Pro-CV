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
  
  // Default to moonshot-v1-32k for ultra-fast (2.2s) execution to guarantee zero timeouts on Vercel
  const model = options?.model || process.env.KIMI_MODEL || 'moonshot-v1-32k'
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
      console.error(`Moonshot/Kimi API Error Response (${model}):`, errorText)

      // Fallback to moonshot-v1-32k if K3 returns error or not found
      if (isK3) {
        console.warn('⚠️ Falling back to high-speed moonshot-v1-32k...')
        return generateKimiCompletion(systemPrompt, userPrompt, { model: 'moonshot-v1-32k' })
      }

      throw new Error(`AI Engine API failed with status ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    if (!data.choices || data.choices.length === 0) {
      throw new Error('AI Engine API returned an empty completion response')
    }

    const message = data.choices[0].message
    if (message.reasoning_content) {
      console.log('🧠 Kimi K3 Reasoning Trace length:', message.reasoning_content.length)
    }

    return message.content || ''
  } catch (err: any) {
    console.error(`AI Completion Error (${model}):`, err)
    
    // If K3 failed, attempt fallback to moonshot-v1-32k
    if (isK3) {
      console.warn('⚠️ Exception in K3 execution. Falling back to moonshot-v1-32k...')
      return generateKimiCompletion(systemPrompt, userPrompt, { model: 'moonshot-v1-32k' })
    }
    
    throw err
  }
}
