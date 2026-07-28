import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Manual env loader
const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...vals] = trimmed.split('=')
      const val = vals.join('=').replace(/^["']|["']$/g, '')
      process.env[key.trim()] = val
    }
  })
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const CREDIT_COSTS: Record<string, number> = {
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

const SERVICE_NAMES: Record<string, string> = {
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

async function reconcileDatabase() {
  console.log('Starting Supabase database reconciliation...')

  // 1. Fetch all profiles
  const { data: profiles, error: profError } = await supabase
    .from('profiles')
    .select('*')

  if (profError || !profiles) {
    console.error('Error fetching profiles:', profError)
    return
  }

  console.log(`Found ${profiles.length} total profiles. Processing...`)

  for (const prof of profiles) {
    // Skip test account as requested by user
    if (prof.email?.toLowerCase() === 'test@joinsophi.com') {
      console.log(`\n========================================`)
      console.log(`Skipping test account: ${prof.email} (keeping at current 100 credits)`)
      continue
    }

    console.log(`\n----------------------------------------`)
    console.log(`Processing User: ${prof.email || prof.id}`)

    // Fetch user's existing credit transactions
    const { data: existingTxs } = await supabase
      .from('credit_transactions')
      .select('*')
      .eq('user_id', prof.id)
      .order('created_at', { ascending: true })

    // Fetch user's service activities
    const { data: activities } = await supabase
      .from('service_activities')
      .select('*')
      .eq('user_id', prof.id)
      .order('created_at', { ascending: true })

    // Fetch user's CV jobs
    const { data: cvJobs } = await supabase
      .from('cv_jobs')
      .select('*')
      .eq('user_id', prof.id)
      .order('created_at', { ascending: true })

    let currentBalance = 0
    const reconstructedLedger: any[] = []

    // 1. Welcome Bonus (+50 Cr) - Backdated to signup
    const welcomeTx = existingTxs?.find((t) => t.service_name.includes('Welcome'))
    const createdAt = welcomeTx?.created_at || prof.created_at || new Date().toISOString()
    
    currentBalance += 50
    reconstructedLedger.push({
      user_id: prof.id,
      service_name: SERVICE_NAMES.WELCOME_BONUS,
      credits_changed: 50,
      balance_after: currentBalance,
      created_at: createdAt,
    })

    // Combine activities and CV jobs into a single timeline
    const allEvents: { type: string; created_at: string; title: string; cost: number }[] = []

    if (activities && activities.length > 0) {
      activities.forEach((act) => {
        const cost = CREDIT_COSTS[act.service_type] || 0
        allEvents.push({
          type: act.service_type,
          created_at: act.created_at,
          title: act.service_title || SERVICE_NAMES[act.service_type] || act.service_type,
          cost: cost > 0 ? -cost : 0,
        })
      })
    }

    // Check if there are CV jobs not captured in service_activities
    if (cvJobs && cvJobs.length > 0) {
      cvJobs.forEach((job) => {
        const jobTime = new Date(job.created_at).getTime()
        const isDuplicate = allEvents.some(
          (e) => Math.abs(new Date(e.created_at).getTime() - jobTime) < 60000 && (e.type === 'CREATE_CV' || e.type === 'TRANSFORM_CV')
        )
        if (!isDuplicate) {
          allEvents.push({
            type: 'TRANSFORM_CV',
            created_at: job.created_at,
            title: 'CV Transformation & Revamp',
            cost: -30,
          })
        }
      })
    }

    // Also check for refill payments or referral rewards in existing transactions
    if (existingTxs && existingTxs.length > 0) {
      existingTxs.forEach((tx) => {
        if (tx.credits_changed > 0 && !tx.service_name.includes('Welcome')) {
          allEvents.push({
            type: 'CREDIT_ADDITION',
            created_at: tx.created_at,
            title: tx.service_name,
            cost: tx.credits_changed,
          })
        }
      })
    }

    // Sort all events chronologically
    allEvents.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

    // Process events and calculate true running balance
    for (const evt of allEvents) {
      currentBalance += evt.cost
      if (currentBalance < 0) currentBalance = 0 // Credits cannot drop below 0
      reconstructedLedger.push({
        user_id: prof.id,
        service_name: evt.title,
        credits_changed: evt.cost,
        balance_after: currentBalance,
        created_at: evt.created_at,
      })
    }

    console.log(`- Previous DB cv_credits: ${prof.cv_credits}`)
    console.log(`- Reconciled True Balance: ${currentBalance} Credits`)

    // Clear old transactions for this user and insert reconstructed ledger
    await supabase.from('credit_transactions').delete().eq('user_id', prof.id)
    if (reconstructedLedger.length > 0) {
      const { error: insErr } = await supabase.from('credit_transactions').insert(reconstructedLedger)
      if (insErr) {
        console.error(`Error inserting ledger for ${prof.email}:`, insErr)
      }
    }

    // Update profiles table with true balance
    const { error: updErr } = await supabase
      .from('profiles')
      .update({
        cv_credits: currentBalance,
      })
      .eq('id', prof.id)

    if (updErr) {
      console.error(`Error updating profile for ${prof.email}:`, updErr)
    } else {
      console.log(`✓ Successfully updated Supabase DB for ${prof.email || prof.id}: cv_credits = ${currentBalance}`)
    }
  }

  console.log('\n========================================')
  console.log('Database reconciliation complete!')
}

reconcileDatabase()
