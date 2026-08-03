'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ChatRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/new-cv')
  }, [router])

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center text-slate-500 font-semibold text-sm">
        Redirecting to New CV Builder...
      </div>
    </div>
  )
}
