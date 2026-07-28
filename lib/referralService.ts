import { getServiceSupabase } from '@/lib/supabase-server'
import { addCredits } from '@/lib/creditService'

/**
 * Generate a unique 6-character referral code (e.g. SAAD8X)
 */
export function generateReferralCode(emailOrName?: string): string {
  const prefix = emailOrName ? emailOrName.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, '') : 'REF'
  const cleanPrefix = (prefix.length >= 3 ? prefix : 'SOPH').substring(0, 4)
  const randomSuffix = Math.floor(10 + Math.random() * 90) // 2 digit number
  return `${cleanPrefix}${randomSuffix}`
}

/**
 * Get or create unique referral code for user profile
 */
export async function getOrCreateReferralCode(userId: string, emailOrName?: string): Promise<string> {
  const supabase = getServiceSupabase()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('referral_code, wallet_balance_pkr')
    .eq('id', userId)
    .single()

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
