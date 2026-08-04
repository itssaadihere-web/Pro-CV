'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getClientSupabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Link from 'next/link'
import { ArrowLeft, Loader2, History, Coins, ArrowUpRight, ArrowDownRight } from 'lucide-react'

export default function CreditHistoryPage() {
  const router = useRouter()
  const supabase = getClientSupabase()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])

  useEffect(() => {
    async function loadCreditHistory() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          router.push('/login')
          return
        }

        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        setProfile(profileData)

        const { data: txData } = await supabase
          .from('credit_transactions')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })

        setTransactions(txData || [])
      } catch (err) {
        console.error('Error loading credit history:', err)
      } finally {
        setLoading(false)
      }
    }

    loadCreditHistory()
  }, [supabase, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex min-h-[400px] flex-col items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-sm font-medium text-slate-500">Loading credit statement & history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Back Navigation */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-900 mb-5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Dashboard</span>
        </Link>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 shrink-0">
              <History className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900">Credit Statement & History Log</h1>
              <p className="text-xs text-slate-500 mt-0.5">Transparent ledger of all credit refills and service usage</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <Coins className="h-5 w-5 text-amber-500 shrink-0" />
            <div>
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Current Balance</span>
              <span className="text-lg font-black text-slate-900">{profile?.cv_credits ?? 0} Credits</span>
            </div>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Transaction Ledger</h2>
            <span className="text-xs font-semibold text-slate-400">
              {transactions.length} total transactions
            </span>
          </div>

          {transactions.length === 0 ? (
            <div className="p-14 text-center">
              <History className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-700">No Credit Transactions Yet</h3>
              <p className="text-xs text-slate-400 mt-1">Your credit usage and refill logs will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-6">Date & Time</th>
                    <th className="py-3.5 px-6">Service / Action</th>
                    <th className="py-3.5 px-6">Type</th>
                    <th className="py-3.5 px-6 text-right">Change</th>
                    <th className="py-3.5 px-6 text-right">Balance After</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map((tx) => {
                    const isPositive = (tx.credits_changed ?? tx.amount ?? 0) > 0
                    const amount = tx.credits_changed ?? tx.amount ?? 0
                    const txDate = new Date(tx.created_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                    return (
                      <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-6 font-mono text-slate-400 text-[11px]">{txDate}</td>
                        <td className="py-4 px-6 font-semibold text-slate-800">
                          {tx.service_name || tx.description || tx.service_type || 'Credit Allocation'}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            isPositive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {isPositive
                              ? <ArrowDownRight className="h-3 w-3" />
                              : <ArrowUpRight className="h-3 w-3" />}
                            {isPositive ? 'Credit Refill' : 'Service Usage'}
                          </span>
                        </td>
                        <td className={`py-4 px-6 text-right font-mono font-bold ${
                          isPositive ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                          {isPositive ? `+${amount}` : `${amount}`} Cr
                        </td>
                        <td className="py-4 px-6 text-right font-mono font-bold text-slate-700">
                          {tx.balance_after !== undefined && tx.balance_after !== null
                            ? `${tx.balance_after} Cr`
                            : '—'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>
    </div>
  )
}
