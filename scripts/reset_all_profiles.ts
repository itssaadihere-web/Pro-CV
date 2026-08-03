import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Manual env loader for .env.local
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

if (!supabaseUrl || !serviceKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

async function resetAllUserProfiles() {
  console.log('🔄 STARTING COMPLETE USER PROFILE & ACTIVITY REFRESH...\n')

  // 1. Wipe all rows from cv_jobs
  const { error: errJobs } = await supabase.from('cv_jobs').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (errJobs) {
    console.warn('⚠️ Warning wiping cv_jobs:', errJobs.message)
  } else {
    console.log('✓ Cleared all records from `cv_jobs` table.')
  }

  // 2. Wipe all rows from service_activities
  const { error: errAct } = await supabase.from('service_activities').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (errAct) {
    console.warn('⚠️ Warning wiping service_activities:', errAct.message)
  } else {
    console.log('✓ Cleared all records from `service_activities` table.')
  }

  // 3. Wipe all rows from credit_transactions
  const { error: errTx } = await supabase.from('credit_transactions').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (errTx) {
    console.warn('⚠️ Warning wiping credit_transactions:', errTx.message)
  } else {
    console.log('✓ Cleared all records from `credit_transactions` table.')
  }

  // 4. Wipe all rows from template_history
  const { error: errTpl } = await supabase.from('template_history').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (errTpl) {
    console.warn('⚠️ Warning wiping template_history:', errTpl.message)
  } else {
    console.log('✓ Cleared all records from `template_history` table.')
  }

  // 5. Reset all user profiles to 50 Welcome Credits
  const { data: profiles, error: errProfFetch } = await supabase
    .from('profiles')
    .select('id, email, cv_credits')

  if (errProfFetch) {
    console.error('Error fetching user profiles:', errProfFetch)
    return
  }

  console.log(`\nResetting ${profiles?.length || 0} user profiles to 50 Welcome Credits...`)

  const { error: errProfUpdate } = await supabase
    .from('profiles')
    .update({ cv_credits: 50, has_paid: false })
    .neq('id', '00000000-0000-0000-0000-000000000000')

  if (errProfUpdate) {
    console.error('Error updating profiles:', errProfUpdate)
  } else {
    console.log('✓ Successfully reset all profiles to 50 Welcome Credits!')
  }

  // 6. Log initial Welcome Credit transaction for every user profile
  if (profiles && profiles.length > 0) {
    const welcomeTransactions = profiles.map(p => ({
      user_id: p.id,
      service_name: 'Welcome Bonus (+50 Credits)',
      credits_changed: 50,
      balance_after: 50,
      created_at: new Date().toISOString()
    }))

    const { error: errWelcomeTx } = await supabase.from('credit_transactions').insert(welcomeTransactions)
    if (errWelcomeTx) {
      console.warn('⚠️ Warning logging initial welcome credit transactions:', errWelcomeTx.message)
    } else {
      console.log('✓ Initialized +50 Welcome Bonus logs for all active user profiles.')
    }
  }

  console.log('\n🎉 ALL USER PROFILES AND ACTIVITIES HAVE BEEN FULLY REFRESHED!')
}

resetAllUserProfiles()
