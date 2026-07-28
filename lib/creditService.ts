import { getServiceSupabase } from '@/lib/supabase-server'
import { getClientSupabase } from '@/lib/supabase'

function getEffectiveSupabaseClient(customClient?: any) {
  if (customClient) return customClient
  if (typeof window !== 'undefined') return getClientSupabase()
  return getServiceSupabase()
}

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
  REFERRAL_REWARD: 30,
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

export async function getUserCredits(userId: string, customClient?: any): Promise<{ credits: number; hasPaid: boolean }> {
  const supabase = getEffectiveSupabaseClient(customClient)
  const { data: profile } = await supabase
    .from('profiles')
    .select('cv_credits, has_paid, email')
    .eq('id', userId)
    .maybeSingle()

  if (profile && (profile.cv_credits === 0 || profile.cv_credits === null || profile.cv_credits === undefined) && !profile.has_paid) {
    const activeCredits = await initializeWelcomeCredits(userId, customClient, profile.email)
    return { credits: activeCredits, hasPaid: false }
  }

  return {
    credits: profile?.cv_credits ?? 0,
    hasPaid: !!profile?.has_paid,
  }
}

export async function initializeWelcomeCredits(userId: string, customClient?: any, userEmail?: string): Promise<number> {
  const supabase = getEffectiveSupabaseClient(customClient)

  try {
    // 1. Fetch profile from database
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    const isTestUser = (userEmail || profile?.email)?.toLowerCase() === 'test@joinsophi.com'
    const bonusAmount = isTestUser ? 100 : CREDIT_COSTS.WELCOME_BONUS // 50
    const { generateReferralCode } = await import('@/lib/referralService')
    const refCode = generateReferralCode(userEmail || profile?.email)

    // 2. If profile doesn't exist at all, create it in database with welcome credits
    if (!profile) {
      const { error: insertErr } = await supabase.from('profiles').upsert({
        id: userId,
        email: userEmail,
        cv_credits: bonusAmount,
        referral_code: refCode,
        welcome_bonus_granted: true,
      })

      if (insertErr) {
        await supabase.from('profiles').upsert({
          id: userId,
          email: userEmail,
          cv_credits: bonusAmount,
          referral_code: refCode,
        })
      }

      await logCreditTransaction(userId, SERVICE_NAMES.WELCOME_BONUS, bonusAmount, bonusAmount, customClient)
      return bonusAmount
    }

    // 3. If profile exists in database:
    const currentCredits = profile.cv_credits ?? 0

    // If profile has positive credits, return current credits
    if (currentCredits > 0) {
      return currentCredits
    }

    // If user has not paid and has 0 credits (even if welcome_bonus_granted was previously set):
    if (!profile.has_paid && currentCredits === 0) {
      // PERSIST TO DATABASE TABLE!
      await supabase
        .from('profiles')
        .update({
          cv_credits: bonusAmount,
          welcome_bonus_granted: true,
          referral_code: profile.referral_code || refCode,
        })
        .eq('id', userId)

      // Ensure transaction is logged in DB
      const { data: txs } = await supabase
        .from('credit_transactions')
        .select('id')
        .eq('user_id', userId)
        .limit(1)

      if (!txs || txs.length === 0) {
        await logCreditTransaction(userId, SERVICE_NAMES.WELCOME_BONUS, bonusAmount, bonusAmount, customClient)
      }

      return bonusAmount
    }

    return currentCredits
  } catch (err) {
    console.error('Error initializing welcome credits:', err)
    return CREDIT_COSTS.WELCOME_BONUS
  }
}

export async function deductCredits(
  userId: string,
  serviceType: ServiceType,
  customClient?: any
): Promise<{ success: boolean; remainingCredits: number; error?: string }> {
  const supabase = getEffectiveSupabaseClient(customClient)
  const cost = CREDIT_COSTS[serviceType]
  const serviceName = SERVICE_NAMES[serviceType]

  const { credits, hasPaid } = await getUserCredits(userId, customClient)

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
  await logCreditTransaction(userId, serviceName, -cost, newBalance, customClient)

  return { success: true, remainingCredits: newBalance }
}

export async function addCredits(
  userId: string,
  amount: number,
  serviceName: string,
  markPaid: boolean = false,
  customClient?: any
): Promise<number> {
  const supabase = getEffectiveSupabaseClient(customClient)
  const { credits } = await getUserCredits(userId, customClient)

  const newBalance = credits + amount

  const updateData: any = { cv_credits: newBalance }
  if (markPaid) {
    updateData.has_paid = true
  }

  await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', userId)

  await logCreditTransaction(userId, serviceName, amount, newBalance, customClient)

  return newBalance
}

export async function logCreditTransaction(
  userId: string,
  serviceName: string,
  creditsChanged: number,
  balanceAfter: number,
  customClient?: any
) {
  const supabase = customClient || getServiceSupabase()
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

export async function logServiceActivity(
  userId: string,
  serviceType: ServiceType,
  serviceTitle: string,
  targetUrl: string,
  metadata: any = {},
  customClient?: any
) {
  const supabase = customClient || getServiceSupabase()
  try {
    await supabase.from('service_activities').insert({
      user_id: userId,
      service_type: serviceType,
      service_title: serviceTitle,
      status: 'completed',
      target_url: targetUrl,
      metadata,
      created_at: new Date().toISOString(),
    })
  } catch (err) {
    console.warn('Failed to log service activity:', err)
  }
}

export async function getCreditStatement(userId: string, customClient?: any): Promise<any[]> {
  const supabase = customClient || getServiceSupabase()
  try {
    const { data, error } = await supabase
      .from('credit_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error || !data) return []
    return data
  } catch {
    return []
  }
}
