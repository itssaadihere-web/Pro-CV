import { getServiceSupabase } from '@/lib/supabase-server'
import { getClientSupabase } from '@/lib/supabase'
import { addCredits } from '@/lib/creditService'

function getEffectiveSupabaseClient(customClient?: any) {
  if (customClient) return customClient
  if (typeof window !== 'undefined') return getClientSupabase()
  return getServiceSupabase()
}

/**
 * Generate a unique referral code based on email username (e.g. TEST30, SAAD30)
 */
export function generateReferralCode(emailOrName?: string): string {
  if (emailOrName) {
    const cleanName = emailOrName.split('@')[0].toUpperCase().replace(/[^A-Z0-9]/g, '')
    if (cleanName.length >= 2) {
      return `${cleanName}30`
    }
  }
  return 'SOPH30'
}

/**
 * Get or create unique referral code for user profile
 */
export async function getOrCreateReferralCode(userId: string, emailOrName?: string, customClient?: any): Promise<string> {
  const supabase = getEffectiveSupabaseClient(customClient)
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('referral_code')
    .eq('id', userId)
    .maybeSingle()

  if (profile?.referral_code) {
    return profile.referral_code
  }

  const newCode = generateReferralCode(emailOrName)
  await supabase
    .from('profiles')
    .update({ referral_code: newCode })
    .eq('id', userId)

  return newCode
}

/**
 * Find referrer user_id by referral code or username prefix (case-insensitive)
 */
export async function findReferrerByCode(code: string, customClient?: any): Promise<string | null> {
  if (!code || !code.trim()) return null
  const cleanCode = code.trim().toUpperCase()
  const supabase = getEffectiveSupabaseClient(customClient)

  try {
    // 1. Direct match on referral_code column
    const { data: directMatch } = await supabase
      .from('profiles')
      .select('id')
      .ilike('referral_code', cleanCode)
      .maybeSingle()

    if (directMatch?.id) return directMatch.id

    // 2. Extract username prefix if code ends with '30' or '100' (e.g. 'TEST' from 'TEST30' or 'TEST100')
    const prefix = cleanCode.replace(/(30|100)$/i, '').toLowerCase()
    if (prefix && prefix.length >= 2) {
      const { data: emailMatch } = await supabase
        .from('profiles')
        .select('id')
        .ilike('email', `${prefix}@%`)
        .maybeSingle()

      if (emailMatch?.id) return emailMatch.id
    }

    return null
  } catch (err) {
    console.error('Error finding referrer by code:', err)
    return null
  }
}

/**
 * Link a new user to their referrer if a valid referral code is provided
 */
export async function linkReferralCode(refereeUserId: string, code: string, customClient?: any): Promise<boolean> {
  if (!code || !code.trim()) return false
  const referrerId = await findReferrerByCode(code, customClient)
  if (!referrerId || referrerId === refereeUserId) return false

  const supabase = getEffectiveSupabaseClient(customClient)
  try {
    await supabase
      .from('profiles')
      .update({ referred_by: referrerId })
      .eq('id', refereeUserId)
    return true
  } catch (err) {
    console.error('Error linking referral code:', err)
    return false
  }
}

/**
 * Reward referrer with 30 Credits (300 PKR value / 1 Free CV Transformation) when referred user completes payment
 */
export async function rewardReferrer(refereeUserId: string): Promise<{ success: boolean; rewardedCredits?: number }> {
  const supabase = getServiceSupabase()
  
  try {
    const { data: refereeProf } = await supabase
      .from('profiles')
      .select('referred_by, referral_rewarded')
      .eq('id', refereeUserId)
      .single()

    if (!refereeProf || !refereeProf.referred_by || refereeProf.referral_rewarded) {
      return { success: false }
    }

    const referrerId = refereeProf.referred_by

    // Add 30 Credits to referrer (300 PKR value / 1 Free CV Transformation)
    await addCredits(referrerId, 30, 'Referral Reward Payout (+30 Credits)')

    // Mark referee as rewarded so payout is given only once
    await supabase
      .from('profiles')
      .update({ referral_rewarded: true })
      .eq('id', refereeUserId)

    return { success: true, rewardedCredits: 30 }
  } catch (err) {
    console.error('Error rewarding referrer:', err)
    return { success: false }
  }
}
