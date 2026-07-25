'use client'

import { useState } from 'react'
import { getClientSupabase } from '@/lib/supabase'
import { Mail, Lock, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Logo from '@/components/Logo'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const supabase = getClientSupabase()

  const handleLinkedinLogin = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (err: any) {
      toast.error(err.message || 'LinkedIn login failed.')
      setLoading(false)
    }
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error('Please enter a valid email address.')
      return
    }
    if (!password) {
      toast.error('Please enter a password.')
      return
    }

    setLoading(true)
    try {
      if (isSignUp) {
        // Sign Up Flow
        if (password !== confirmPassword) {
          toast.error('Passwords do not match.')
          setLoading(false)
          return
        }
        if (password.length < 6) {
          toast.error('Password must be at least 6 characters long.')
          setLoading(false)
          return
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })

        if (error) throw error

        if (data.user && !data.session) {
          toast.success('Account created! Please check your email for the confirmation link.')
        } else {
          toast.success('Account created and logged in successfully!')
          window.location.href = '/dashboard'
        }
      } else {
        // Sign In Flow
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        toast.success('Logged in successfully!')
        window.location.href = '/dashboard'
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        {/* Back Link */}
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-550 transition-colors hover:text-slate-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to landing page</span>
          </Link>
          <Logo width={60} height={60} showTagline={true} />
        </div>

        {/* Title */}
        <div className="text-center">
          <h2 className="text-2xl font-black tracking-tight text-primary">
            {isSignUp ? 'Create your Sophi Account' : 'Sign in to Sophi'}
          </h2>
          <p className="mt-2 text-xs font-medium text-slate-500">
            {isSignUp
              ? 'Start optimizing your CV with advanced AI for free.'
              : 'Enter your credentials below to log in.'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="space-y-4">
            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="block w-full rounded-lg border border-slate-350 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Password
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-lg border border-slate-350 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Confirm Password (only visible on Sign Up) */}
            {isSignUp && (
              <div className="animate-fade-in">
                <label htmlFor="confirmPassword" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Confirm Password
                </label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full rounded-lg border border-slate-350 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center items-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-850 disabled:bg-primary-300 shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{isSignUp ? 'Creating account...' : 'Logging in...'}</span>
                </>
              ) : (
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
              )}
            </button>
          </div>
        </form>

        {/* OAuth Dividers & Social Logins */}
        <div className="space-y-4 pt-2">
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-[11px] font-extrabold text-slate-400 uppercase">OR</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <button
            type="button"
            onClick={handleLinkedinLogin}
            disabled={loading}
            className="flex w-full justify-center items-center gap-2.5 rounded-xl border border-slate-300 bg-white py-2.5 px-4 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
          >
            <svg className="h-4 w-4 fill-[#0A66C2]" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
            </svg>
            <span>Sign in with LinkedIn</span>
          </button>
        </div>

        {/* Switch Auth mode */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setPassword('')
              setConfirmPassword('')
            }}
            className="text-xs font-bold text-primary hover:text-primary-800 underline"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
          </button>
        </div>
      </div>
    </div>
  )
}
