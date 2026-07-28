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

async function refillUserCredits() {
  const targetEmail = 'binmusharrafsyedsaad@gmail.com'
  console.log(`Searching for user: ${targetEmail}...`)

  const { data: profile, error: profErr } = await supabase
    .from('profiles')
    .select('id, cv_credits, email')
    .eq('email', targetEmail)
    .single()

  if (profErr || !profile) {
    console.error('Profile not found:', profErr)
    return
  }

  const currentCredits = profile.cv_credits ?? 0
  const refillAmount = 50
  const newBalance = currentCredits + refillAmount

  console.log(`Current Balance: ${currentCredits} Credits`)
  console.log(`Refilling: +${refillAmount} Credits`)
  console.log(`New Balance: ${newBalance} Credits`)

  // 1. Update profiles table
  const { error: updErr } = await supabase
    .from('profiles')
    .update({ cv_credits: newBalance })
    .eq('id', profile.id)

  if (updErr) {
    console.error('Error updating profiles cv_credits:', updErr)
    return
  }

  // 2. Insert transaction entry into credit_transactions table
  const { error: txErr } = await supabase.from('credit_transactions').insert({
    user_id: profile.id,
    service_name: 'System Credit Refill (+50 Credits)',
    credits_changed: refillAmount,
    balance_after: newBalance,
    created_at: new Date().toISOString(),
  })

  if (txErr) {
    console.error('Error inserting transaction log:', txErr)
    return
  }

  console.log(`✓ Successfully refilled ${targetEmail}: New Balance = ${newBalance} Credits!`)
}

refillUserCredits()
