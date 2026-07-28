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
    .select('cv_credits, has_paid')
    .eq('id', userId)
    .maybeSingle()

  return {
    credits: profile?.cv_credits ?? 0,
    hasPaid: !!profile?.has_paid,
  }
}

export async function initializeWelcomeCredits(userId: string, customClient?: any, userEmail?: string): Promise<number> {
  const supabase = getEffectiveSupabaseClient(customClient)

  try {
    // 1. Check if profile exists
    const { data: profile, error: selectErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    // 2. If profile doesn't exist at all, create it with 50 credits
    if (!profile) {
      const isTestUser = userEmail?.toLowerCase() === 'test@joinsophi.com'
      const initialCredits = isTestUser ? 100 : CREDIT_COSTS.WELCOME_BONUS // 50

      const { error: insertErr } = await supabase.from('profiles').upsert({
        id: userId,
        email: userEmail,
        cv_credits: initialCredits,
        welcome_bonus_granted: true,
      })

      if (insertErr) {
        // Fallback if welcome_bonus_granted column is missing in DB schema
        await supabase.from('profiles').upsert({
          id: userId,
          email: userEmail,
          cv_credits: initialCredits,
        })
      }

      await logCreditTransaction(userId, SERVICE_NAMES.WELCOME_BONUS, initialCredits, initialCredits, customClient)
      return initialCredits
    }

    // 3. If profile exists, check if welcome bonus was already granted
    const isGranted = Boolean(profile.welcome_bonus_granted)
    const currentCredits = profile.cv_credits ?? 0

    // If welcome bonus has already been granted, respect the existing balance (even if 0)
    if (isGranted) {
      return currentCredits
    }

    // If welcome_bonus_granted flag is false/null, but cv_credits is already defined (not null/undefined),
    // mark welcome_bonus_granted as true without altering the current credits balance.
    if (profile.cv_credits !== null && profile.cv_credits !== undefined) {
      await supabase
        .from('profiles')
        .update({ welcome_bonus_granted: true })
        .eq('id', userId)
      return currentCredits
    }

    // Otherwise, this is a brand new account needing initial welcome credits
    const isTestUser = profile.email?.toLowerCase() === 'test@joinsophi.com'
    const newBalance = isTestUser ? 100 : CREDIT_COSTS.WELCOME_BONUS // 50

    await supabase
      .from('profiles')
      .update({
        cv_credits: newBalance,
        welcome_bonus_granted: true,
      })
      .eq('id', userId)

    await logCreditTransaction(userId, SERVICE_NAMES.WELCOME_BONUS, newBalance, newBalance, customClient)
    return newBalance
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
