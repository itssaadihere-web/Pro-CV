import { getServiceSupabase } from '@/lib/supabase-server'

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
 * Reward referrer with 100 PKR wallet credit when referred user completes payment
 */
export async function rewardReferrer(refereeUserId: string): Promise<{ success: boolean; rewardedAmount?: number }> {
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

    // Fetch current wallet balance of referrer
    const { data: referrerProf } = await supabase
      .from('profiles')
      .select('wallet_balance_pkr')
      .eq('id', referrerId)
      .single()

    const currentWallet = referrerProf?.wallet_balance_pkr || 0
    const updatedWallet = currentWallet + 100

    // Update referrer wallet balance
    await supabase
      .from('profiles')
      .update({ wallet_balance_pkr: updatedWallet })
      .eq('id', referrerId)

    // Mark referee as rewarded so payout is given only once
    await supabase
      .from('profiles')
      .update({ referral_rewarded: true })
      .eq('id', refereeUserId)

    return { success: true, rewardedAmount: 100 }
  } catch (err) {
    console.error('Error rewarding referrer:', err)
    return { success: false }
  }
}
