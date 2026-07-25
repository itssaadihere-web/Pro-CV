'use client'

import React from 'react'
import Link from 'next/link'
import { Lock, CreditCard, ChevronRight } from 'lucide-react'
import { isBetaActive } from '@/lib/beta'

interface PaymentGateProps {
  credits: number | null
  loading: boolean
  children: React.ReactNode
}

export default function PaymentGate({ credits, loading, children }: PaymentGateProps) {
  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
        <p className="mt-4 text-sm font-medium text-slate-500">Checking your account credits...</p>
      </div>
    )
  }

  // Upfront payment gating removed to allow 5 free watermarked previews
  return <>{children}</>
}
