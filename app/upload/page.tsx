'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function UploadRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    // Preserve query parameters if present (e.g. ?source=scratch)
    const searchParams = window.location.search
    router.replace(`/transform-cv${searchParams}`)
  }, [router])

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center text-slate-500 font-semibold text-sm">
        Redirecting to CV Transformation Engine...
      </div>
    </div>
  )
}
