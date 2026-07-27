import { getServiceSupabase } from '@/lib/supabase-server'

export type ServiceType =
  | 'CREATE_CV'
  | 'TRANSFORM_CV'
  | 'LINKEDIN_OPTIMIZER'
  | 'ATS_EVALUATION'
  | 'TAILOR_CV'
  | 'DOWNLOAD_PDF'
  | 'ROTATE_TEMPLATE'
  | 'WELCOME_BONUS'
  | 'PURCHASE_REFILL'
  | 'REFERRAL_REWARD'

export const CREDIT_COSTS: Record<ServiceType, number> = {
  CREATE_CV: 30,
  TRANSFORM_CV: 30,
  LINKEDIN_OPTIMIZER: 20,
  ATS_EVALUATION: 10,
  TAILOR_CV: 5,
  DOWNLOAD_PDF: 2,
  ROTATE_TEMPLATE: 1,
  WELCOME_BONUS: 50,
  PURCHASE_REFILL: 150,
  REFERRAL_REWARD: 10,
}

export const SERVICE_NAMES: Record<ServiceType, string> = {
  CREATE_CV: 'Create CV from Scratch',
  TRANSFORM_CV: 'Transform Existing CV',
  LINKEDIN_OPTIMIZER: 'LinkedIn Profile Optimizer',
  ATS_EVALUATION: 'CV Evaluation / ATS Analysis',
  TAILOR_CV: 'Job-Specific CV Tailoring',
  DOWNLOAD_PDF: 'Clean Un-watermarked PDF Download',
  ROTATE_TEMPLATE: 'Try Different Template Switch',
  WELCOME_BONUS: 'Welcome Signup Bonus',
  PURCHASE_REFILL: '1500 PKR Package (150 Credits)',
  REFERRAL_REWARD: 'Referral Reward Payout',
}

export async function getUserCredits(userId: string): Promise<{ credits: number; hasPaid: boolean }> {
  const supabase = getServiceSupabase()
  const { data: profile } = await supabase
    .from('profiles')
    .select('cv_credits, has_paid')
    .eq('id', userId)
    .single()

  return {
    credits: profile?.cv_credits ?? 0,
    hasPaid: !!profile?.has_paid,
  }
}

export async function initializeWelcomeCredits(userId: string): Promise<number> {
  const supabase = getServiceSupabase()

  // Check if profile exists and if welcome bonus has already been granted
  const { data: profile } = await supabase
    .from('profiles')
    .select('cv_credits, welcome_bonus_granted')
    .eq('id', userId)
    .single()

  if (profile?.welcome_bonus_granted) {
    return profile.cv_credits ?? 0
  }

  const newBalance = (profile?.cv_credits ?? 0) + CREDIT_COSTS.WELCOME_BONUS

  await supabase
    .from('profiles')
    .upsert({
      id: userId,
      cv_credits: newBalance,
      welcome_bonus_granted: true,
    })

  // Log transaction
  await logCreditTransaction(userId, SERVICE_NAMES.WELCOME_BONUS, CREDIT_COSTS.WELCOME_BONUS, newBalance)

  return newBalance
}

export async function deductCredits(
  userId: string,
  serviceType: ServiceType
): Promise<{ success: boolean; remainingCredits: number; error?: string }> {
  const supabase = getServiceSupabase()
  const cost = CREDIT_COSTS[serviceType]
  const serviceName = SERVICE_NAMES[serviceType]

  const { credits, hasPaid } = await getUserCredits(userId)

  // Test account bypass check
  const { data: userProf } = await supabase
    .from('profiles')
    .select('email')
    .eq('id', userId)
    .single()

  const isTestUser = userProf?.email?.toLowerCase() === 'test@joinsophi.com'
  if (isTestUser) {
    return { success: true, remainingCredits: credits }
  }

  if (credits < cost) {
    return {
      success: false,
      remainingCredits: credits,
      error: `Insufficient credits. Required: ${cost} Credits, Available: ${credits} Credits.`,
    }
  }

  const newBalance = credits - cost

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ cv_credits: newBalance })
    .eq('id', userId)

  if (updateError) {
    console.error('Error updating credits:', updateError)
    return { success: false, remainingCredits: credits, error: 'Failed to update credit balance.' }
  }

  // Log transaction
  await logCreditTransaction(userId, serviceName, -cost, newBalance)

  return { success: true, remainingCredits: newBalance }
}

export async function addCredits(
  userId: string,
  amount: number,
  serviceName: string,
  markPaid: boolean = false
): Promise<number> {
  const supabase = getServiceSupabase()
  const { credits } = await getUserCredits(userId)

  const newBalance = credits + amount

  const updateData: any = { cv_credits: newBalance }
  if (markPaid) {
    updateData.has_paid = true
  }

  await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', userId)

  await logCreditTransaction(userId, serviceName, amount, newBalance)

  return newBalance
}

export async function logCreditTransaction(
  userId: string,
  serviceName: string,
  creditsChanged: number,
  balanceAfter: number
) {
  const supabase = getServiceSupabase()
  try {
    await supabase.from('credit_transactions').insert({
      user_id: userId,
      service_name: serviceName,
      credits_changed: creditsChanged,
      balance_after: balanceAfter,
      created_at: new Date().toISOString(),
    })
  } catch (err) {
    console.warn('Failed to log credit transaction:', err)
  }
}

export async function getCreditStatement(userId: string): Promise<any[]> {
  const supabase = getServiceSupabase()
  const { data } = await supabase
    .from('credit_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)

  return data ?? []
}
