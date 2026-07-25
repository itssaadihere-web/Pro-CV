'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getClientSupabase } from '@/lib/supabase'
import Header from '@/components/Header'
import { 
  Send, 
  Mic, 
  Square, 
  Loader2, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  User, 
  Briefcase, 
  GraduationCap, 
  Sparkles, 
  CheckCircle2, 
  Bot, 
  FileText,
  Globe,
  Award,
  Languages as LanguagesIcon
} from 'lucide-react'
import toast from 'react-hot-toast'

interface ExperienceItem {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  location: string
  description: string
}

interface EducationItem {
  id: string
  institution: string
  degree: string
  fieldOfStudy: string
  graduationYear: string
}

interface ContactItem {
  id: string
  label: string
  value: string
}

interface FormState {
  fullName: string
  jobTitle: string
  email: string
  phone: string
  location: string
  summary: string
  contacts: ContactItem[]
  experiences: ExperienceItem[]
  educations: EducationItem[]
  skills: string[]
  certifications: string[]
  languages: string[]
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  isAudio?: boolean
  extractedCount?: number
}

export default function ChatPage() {
  const router = useRouter()
  const supabase = getClientSupabase()
  const [loading, setLoading] = useState(true)
  const [submittingForm, setSubmittingForm] = useState(false)

  // Form State with required defaults
  const [form, setForm] = useState<FormState>({
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    contacts: [
      { id: '1', label: 'LinkedIn', value: '' }
    ],
    experiences: [
      { id: '1', company: '', position: '', startDate: '', endDate: '', location: '', description: '' }
    ],
    educations: [
      { id: '1', institution: '', degree: '', fieldOfStudy: '', graduationYear: '' }
    ],
    skills: [],
    certifications: [],
    languages: ['English']
  })

  // Input states for adding skills/certs/languages
  const [skillInput, setSkillInput] = useState('')
  const [certInput, setCertInput] = useState('')
  const [langInput, setLangInput] = useState('')

  // Chat & Voice states
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: "👋 Hi! I am Sophi, your AI assistant. You can chat with me or send voice notes describing your background. I'll automatically fill out your form on the left in real-time! Once ready, submit the form to generate your CV." 
    }
  ])
  const [input, setInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<any>(null)

  useEffect(() => {
    async function checkAccess() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Please log in to continue.')
        router.push('/login')
        return
      }

      // Pre-fill user email if available
      if (session.user.email) {
        setForm(prev => ({
          ...prev,
          email: prev.email || session.user.email || ''
        }))
      }

      setLoading(false)
    }
    checkAccess()
  }, [supabase, router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0)
      timerRef.current = setInterval(() => {
        setRecordingSeconds(s => s + 1)
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isRecording])

  // --- Dynamic Form Add/Remove Line Helpers ---

  const handleAddContact = () => {
    setForm(prev => ({
      ...prev,
      contacts: [...prev.contacts, { id: Date.now().toString(), label: 'Portfolio', value: '' }]
    }))
  }

  const handleRemoveContact = (id: string) => {
    setForm(prev => ({
      ...prev,
      contacts: prev.contacts.filter(c => c.id !== id)
    }))
  }

  const handleAddExperience = () => {
    setForm(prev => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        { id: Date.now().toString(), company: '', position: '', startDate: '', endDate: '', location: '', description: '' }
      ]
    }))
  }

  const handleRemoveExperience = (id: string) => {
    if (form.experiences.length <= 1) {
      toast.error('At least one experience line is required.')
      return
    }
    setForm(prev => ({
      ...prev,
      experiences: prev.experiences.filter(e => e.id !== id)
    }))
  }

  const handleAddEducation = () => {
    setForm(prev => ({
      ...prev,
      educations: [
        ...prev.educations,
        { id: Date.now().toString(), institution: '', degree: '', fieldOfStudy: '', graduationYear: '' }
      ]
    }))
  }

  const handleRemoveEducation = (id: string) => {
    if (form.educations.length <= 1) {
      toast.error('At least one education line is required.')
      return
    }
    setForm(prev => ({
      ...prev,
      educations: prev.educations.filter(e => e.id !== id)
    }))
  }

  const handleAddSkill = () => {
    if (!skillInput.trim()) return
    if (!form.skills.includes(skillInput.trim())) {
      setForm(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }))
    }
    setSkillInput('')
  }

  const handleRemoveSkill = (skill: string) => {
    setForm(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }))
  }

  const handleAddCert = () => {
    if (!certInput.trim()) return
    if (!form.certifications.includes(certInput.trim())) {
      setForm(prev => ({ ...prev, certifications: [...prev.certifications, certInput.trim()] }))
    }
    setCertInput('')
  }

  const handleRemoveCert = (cert: string) => {
    setForm(prev => ({ ...prev, certifications: prev.certifications.filter(c => c !== cert) }))
  }

  const handleAddLang = () => {
    if (!langInput.trim()) return
    if (!form.languages.includes(langInput.trim())) {
      setForm(prev => ({ ...prev, languages: [...prev.languages, langInput.trim()] }))
    }
    setLangInput('')
  }

  const handleRemoveLang = (lang: string) => {
    setForm(prev => ({ ...prev, languages: prev.languages.filter(l => l !== lang) }))
  }

  // --- LinkedIn Auto-Fetch Handler ---
  const [fetchingLinkedin, setFetchingLinkedin] = useState(false)
  const [showLinkedinModal, setShowLinkedinModal] = useState(false)
  const [linkedinModalInput, setLinkedinModalInput] = useState('')

  const findLinkedinUrlInState = (): string | null => {
    // 1. Check contact fields
    const contactMatch = form.contacts.find(c => c.value.includes('linkedin.com') || (c.label.toLowerCase().includes('linkedin') && c.value.trim()))
    if (contactMatch && contactMatch.value.trim()) return contactMatch.value.trim()

    // 2. Check location field (user might have accidentally pasted in Location)
    if (form.location && form.location.includes('linkedin.com')) return form.location.trim()

    // 3. Check chat message history
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i]
      if (msg.role === 'user' && msg.content.includes('linkedin.com')) {
        const urlMatch = msg.content.match(/https?:\/\/[^\s]*linkedin\.com[^\s]*/i)
        if (urlMatch) return urlMatch[0]
      }
    }

    return null
  }

  const handleFetchLinkedin = async (urlToFetch?: string) => {
    let targetUrl = urlToFetch?.trim() || findLinkedinUrlInState()

    if (!targetUrl) {
      setShowLinkedinModal(true)
      return
    }

    // Clean location field if user accidentally pasted URL in location
    if (form.location && form.location.includes('linkedin.com')) {
      setForm(prev => ({
        ...prev,
        location: '',
        contacts: prev.contacts.some(c => c.value === targetUrl)
          ? prev.contacts
          : [...prev.contacts, { id: Date.now().toString(), label: 'LinkedIn', value: targetUrl }]
      }))
    } else {
      // Ensure LinkedIn contact item has the URL
      setForm(prev => {
        if (!prev.contacts.some(c => c.value.includes('linkedin.com'))) {
          return {
            ...prev,
            contacts: prev.contacts.map(c => (c.label.toLowerCase().includes('linkedin') && !c.value) ? { ...c, value: targetUrl } : c)
          }
        }
        return prev
      })
    }

    setFetchingLinkedin(true)
    try {
      const res = await fetch('/api/linkedin/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl })
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch LinkedIn data')
      }

      const p = data.profileData || {}
      let count = 0
      setForm(prev => {
        const updated = { ...prev }
        if (p.fullName && p.fullName.trim()) { updated.fullName = p.fullName; count++ }
        if (p.jobTitle && p.jobTitle.trim()) { updated.jobTitle = p.jobTitle; count++ }
        if (p.summary && p.summary.trim()) { updated.summary = p.summary; count++ }
        if (Array.isArray(p.experiences) && p.experiences.length > 0) {
          updated.experiences = p.experiences.map((exp: any, i: number) => ({
            id: Date.now().toString() + i,
            company: exp.company || '',
            position: exp.position || '',
            startDate: exp.startDate || '',
            endDate: exp.endDate || '',
            location: exp.location || '',
            description: exp.description || ''
          }))
          count += p.experiences.length
        }
        if (Array.isArray(p.educations) && p.educations.length > 0) {
          updated.educations = p.educations.map((ed: any, i: number) => ({
            id: Date.now().toString() + i,
            institution: ed.institution || '',
            degree: ed.degree || '',
            fieldOfStudy: ed.fieldOfStudy || '',
            graduationYear: ed.graduationYear || ''
          }))
          count += p.educations.length
        }
        if (Array.isArray(p.skills) && p.skills.length > 0) {
          updated.skills = Array.from(new Set([...updated.skills, ...p.skills]))
          count += p.skills.length
        }
        return updated
      })

      setShowLinkedinModal(false)
      toast.success(`Successfully fetched & populated ${count} fields from LinkedIn!`)
    } catch (err: any) {
      toast.error(err.message || 'Could not fetch LinkedIn details.')
    } finally {
      setFetchingLinkedin(false)
    }
  }

  // --- Voice & Chat Auto-population Handlers ---

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      mediaRecorder.current = recorder
      audioChunks.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data)
      }

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' })
        stream.getTracks().forEach(track => track.stop())
        await processMessage('', audioBlob)
      }

      recorder.start()
      setIsRecording(true)
    } catch (err) {
      toast.error('Could not access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop()
      setIsRecording(false)
    }
  }

  const handleSendText = async () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setInput('')
    await processMessage(userMsg, null)
  }

  const processMessage = async (text: string, audioBlob: Blob | null) => {
    const newMsg: Message = { 
      role: 'user', 
      content: audioBlob ? `🎙️ Voice Note (${recordingSeconds}s)` : text,
      isAudio: !!audioBlob
    }
    setMessages(prev => [...prev, newMsg])
    setIsProcessing(true)

    try {
      const formData = new FormData()
      formData.append('history', JSON.stringify(messages))
      
      if (audioBlob) {
        formData.append('audio', audioBlob, 'voicenote.webm')
      } else {
        formData.append('text', text)
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to get response')

      let extractedCount = 0

      // Merge extracted fields into Form state live
      if (data.extractedFields) {
        const fields = data.extractedFields
        setForm(prev => {
          const updated = { ...prev }

          if (fields.fullName && fields.fullName.trim()) { updated.fullName = fields.fullName; extractedCount++ }
          if (fields.jobTitle && fields.jobTitle.trim()) { updated.jobTitle = fields.jobTitle; extractedCount++ }
          if (fields.email && fields.email.trim()) { updated.email = fields.email; extractedCount++ }
          if (fields.phone && fields.phone.trim()) { updated.phone = fields.phone; extractedCount++ }
          if (fields.location && fields.location.trim()) { updated.location = fields.location; extractedCount++ }
          if (fields.summary && fields.summary.trim()) { updated.summary = fields.summary; extractedCount++ }

          // Experiences
          if (Array.isArray(fields.experiences) && fields.experiences.length > 0) {
            const validExps = fields.experiences.filter((e: any) => e.company || e.position)
            if (validExps.length > 0) {
              const newExps = validExps.map((exp: any, i: number) => ({
                id: Date.now().toString() + i,
                company: exp.company || '',
                position: exp.position || '',
                startDate: exp.startDate || '',
                endDate: exp.endDate || '',
                location: exp.location || '',
                description: exp.description || ''
              }))
              // If initial is empty, replace; else append
              if (updated.experiences.length === 1 && !updated.experiences[0].company && !updated.experiences[0].position) {
                updated.experiences = newExps
              } else {
                updated.experiences = [...updated.experiences, ...newExps]
              }
              extractedCount += newExps.length
            }
          }

          // Educations
          if (Array.isArray(fields.educations) && fields.educations.length > 0) {
            const validEds = fields.educations.filter((e: any) => e.institution || e.degree)
            if (validEds.length > 0) {
              const newEds = validEds.map((ed: any, i: number) => ({
                id: Date.now().toString() + i,
                institution: ed.institution || '',
                degree: ed.degree || '',
                fieldOfStudy: ed.fieldOfStudy || '',
                graduationYear: ed.graduationYear || ''
              }))
              if (updated.educations.length === 1 && !updated.educations[0].institution) {
                updated.educations = newEds
              } else {
                updated.educations = [...updated.educations, ...newEds]
              }
              extractedCount += newEds.length
            }
          }

          // Skills
          if (Array.isArray(fields.skills) && fields.skills.length > 0) {
            const uniqueSkills = Array.from(new Set([...updated.skills, ...fields.skills]))
            updated.skills = uniqueSkills
            extractedCount += fields.skills.length
          }

          // Certifications
          if (Array.isArray(fields.certifications) && fields.certifications.length > 0) {
            const uniqueCerts = Array.from(new Set([...updated.certifications, ...fields.certifications]))
            updated.certifications = uniqueCerts
            extractedCount += fields.certifications.length
          }

          // Languages
          if (Array.isArray(fields.languages) && fields.languages.length > 0) {
            const uniqueLangs = Array.from(new Set([...updated.languages, ...fields.languages]))
            updated.languages = uniqueLangs
            extractedCount += fields.languages.length
          }

          return updated
        })
      }

      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: data.reply,
          extractedCount 
        }
      ])

      if (extractedCount > 0) {
        toast.success(`Sophi auto-filled ${extractedCount} details into your form!`)
      }

    } catch (err: any) {
      toast.error(err.message || 'Error processing request')
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I had trouble processing that message. Please try again.' }])
    } finally {
      setIsProcessing(false)
    }
  }

  // --- Form Submission (Mandatory Primary Path) ---

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!form.fullName.trim()) {
      toast.error('Please enter your Full Name.')
      return
    }
    if (!form.jobTitle.trim()) {
      toast.error('Please enter your Job Title / Target Role.')
      return
    }
    if (!form.email.trim()) {
      toast.error('Please enter your Email Address.')
      return
    }

    setSubmittingForm(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Session expired. Please log in.')
        router.push('/login')
        return
      }

      // Format complete form state into structured Markdown payload for CV generation
      let compiledCV = `# ${form.fullName}\n`
      compiledCV += `**Job Title:** ${form.jobTitle}\n`
      compiledCV += `**Email:** ${form.email} | **Phone:** ${form.phone} | **Location:** ${form.location}\n`

      if (form.contacts.length > 0) {
        const contactLine = form.contacts
          .filter(c => c.value.trim())
          .map(c => `${c.label}: ${c.value}`)
          .join(' | ')
        if (contactLine) compiledCV += `**Links:** ${contactLine}\n`
      }

      if (form.summary.trim()) {
        compiledCV += `\n## Professional Summary\n${form.summary}\n`
      }

      if (form.experiences.some(e => e.company.trim() || e.position.trim())) {
        compiledCV += `\n## Work Experience\n`
        form.experiences.forEach(exp => {
          if (exp.company || exp.position) {
            compiledCV += `### ${exp.position || 'Position'} - ${exp.company || 'Company'}\n`
            compiledCV += `*Dates:* ${exp.startDate} - ${exp.endDate || 'Present'} | *Location:* ${exp.location}\n`
            if (exp.description) compiledCV += `${exp.description}\n`
            compiledCV += `\n`
          }
        })
      }

      if (form.educations.some(e => e.institution.trim() || e.degree.trim())) {
        compiledCV += `\n## Education\n`
        form.educations.forEach(ed => {
          if (ed.institution || ed.degree) {
            compiledCV += `### ${ed.degree || 'Degree'} ${ed.fieldOfStudy ? 'in ' + ed.fieldOfStudy : ''}\n`
            compiledCV += `*${ed.institution}* | Graduated: ${ed.graduationYear}\n\n`
          }
        })
      }

      if (form.skills.length > 0) {
        compiledCV += `\n## Skills\n${form.skills.join(', ')}\n`
      }

      if (form.certifications.length > 0) {
        compiledCV += `\n## Certifications\n${form.certifications.join(', ')}\n`
      }

      if (form.languages.length > 0) {
        compiledCV += `\n## Languages\n${form.languages.join(', ')}\n`
      }

      // Save compiled CV text & metadata to sessionStorage for the Transform Configuration screen
      sessionStorage.setItem('scratch_cv_text', compiledCV)
      sessionStorage.setItem('scratch_full_name', form.fullName)
      sessionStorage.setItem('scratch_job_title', form.jobTitle)

      toast.success('Details saved! Now configure your target job preferences.')
      router.push('/upload?source=scratch')

    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Error submitting form.')
    } finally {
      setSubmittingForm(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex min-h-[400px] flex-col items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-sm font-medium text-slate-500">Loading CV Builder...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-6 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/choice"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Option Choice</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-blue-700">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              <span>Parallel Form + Voice Chat Builder</span>
            </span>
          </div>
        </div>

        {/* Parallel Dual Panel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: Mandatory Structured Form (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span>CV Details Form</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Fill out the form below. You can also chat or send voice notes on the right to auto-fill these fields!
                  </p>
                </div>
                <span className="text-[11px] font-bold uppercase text-red-500 bg-red-50 px-2.5 py-1 rounded-md border border-red-100">
                  Required Submission
                </span>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-8">
                
                {/* 1. Basic Required Details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 text-blue-700">
                    <User className="h-4 w-4" />
                    <span>1. Basic Contact Details</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Syed Muhammad Saad"
                        value={form.fullName}
                        onChange={e => setForm({ ...form, fullName: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-sm text-slate-800 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Target Job Title / Role <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Senior Software Engineer"
                        value={form.jobTitle}
                        onChange={e => setForm({ ...form, jobTitle: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-sm text-slate-800 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-sm text-slate-800 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        placeholder="+92 300 1234567"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-sm text-slate-800 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Location (City, Country)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Islamabad, Pakistan"
                        value={form.location}
                        onChange={e => setForm({ ...form, location: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-sm text-slate-800 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  {/* Dynamic Additional Contacts */}
                  <div className="pt-2 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600">Additional Links & Contacts</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleFetchLinkedin()}
                          disabled={fetchingLinkedin}
                          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg hover:bg-emerald-100 transition-colors disabled:opacity-50"
                          title="Auto-fill form using profile details from LinkedIn URL"
                        >
                          {fetchingLinkedin ? <Loader2 className="h-3 w-3 animate-spin" /> : <Globe className="h-3 w-3" />}
                          <span>Fetch LinkedIn Details</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleAddContact}
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Add Line</span>
                        </button>
                      </div>
                    </div>

                    {form.contacts.map((contact, index) => (
                      <div key={contact.id} className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Label (e.g. LinkedIn)"
                          value={contact.label}
                          onChange={e => {
                            const val = e.target.value
                            setForm(prev => ({
                              ...prev,
                              contacts: prev.contacts.map(c => c.id === contact.id ? { ...c, label: val } : c)
                            }))
                          }}
                          className="w-1/3 rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="URL or handle"
                          value={contact.value}
                          onChange={e => {
                            const val = e.target.value
                            setForm(prev => ({
                              ...prev,
                              contacts: prev.contacts.map(c => c.id === contact.id ? { ...c, value: val } : c)
                            }))
                          }}
                          className="flex-1 rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveContact(contact.id)}
                          className="p-2 text-slate-400 hover:text-red-500"
                          title="Remove Line"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Summary */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Professional Summary / Bio
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Brief overview of your experience, skills, and career objective..."
                      value={form.summary}
                      onChange={e => setForm({ ...form, summary: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-800 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* 2. Work Experience Category */}
                <div className="space-y-4 pt-4 border-t border-slate-150">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 text-blue-700">
                      <Briefcase className="h-4 w-4" />
                      <span>2. Work Experience</span>
                    </h3>
                    <button
                      type="button"
                      onClick={handleAddExperience}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Experience Line</span>
                    </button>
                  </div>

                  {form.experiences.map((exp, idx) => (
                    <div key={exp.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 relative">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                        <span className="text-xs font-bold text-slate-700">Experience #{idx + 1}</span>
                        {form.experiences.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveExperience(exp.id)}
                            className="text-xs text-red-500 font-bold hover:underline flex items-center gap-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Company Name (e.g. Systems Ltd)"
                          value={exp.company}
                          onChange={e => {
                            const val = e.target.value
                            setForm(prev => ({
                              ...prev,
                              experiences: prev.experiences.map(item => item.id === exp.id ? { ...item, company: val } : item)
                            }))
                          }}
                          className="rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Job Position (e.g. Full Stack Developer)"
                          value={exp.position}
                          onChange={e => {
                            const val = e.target.value
                            setForm(prev => ({
                              ...prev,
                              experiences: prev.experiences.map(item => item.id === exp.id ? { ...item, position: val } : item)
                            }))
                          }}
                          className="rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Start Date (e.g. Jan 2022)"
                          value={exp.startDate}
                          onChange={e => {
                            const val = e.target.value
                            setForm(prev => ({
                              ...prev,
                              experiences: prev.experiences.map(item => item.id === exp.id ? { ...item, startDate: val } : item)
                            }))
                          }}
                          className="rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="End Date (e.g. Present)"
                          value={exp.endDate}
                          onChange={e => {
                            const val = e.target.value
                            setForm(prev => ({
                              ...prev,
                              experiences: prev.experiences.map(item => item.id === exp.id ? { ...item, endDate: val } : item)
                            }))
                          }}
                          className="rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                        />
                      </div>
                      <textarea
                        rows={2}
                        placeholder="Key responsibilities, technologies used, achievements..."
                        value={exp.description}
                        onChange={e => {
                          const val = e.target.value
                          setForm(prev => ({
                            ...prev,
                            experiences: prev.experiences.map(item => item.id === exp.id ? { ...item, description: val } : item)
                          }))
                        }}
                        className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>

                {/* 3. Education Category */}
                <div className="space-y-4 pt-4 border-t border-slate-150">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 text-blue-700">
                      <GraduationCap className="h-4 w-4" />
                      <span>3. Education</span>
                    </h3>
                    <button
                      type="button"
                      onClick={handleAddEducation}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Education Line</span>
                    </button>
                  </div>

                  {form.educations.map((ed, idx) => (
                    <div key={ed.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                        <span className="text-xs font-bold text-slate-700">Education #{idx + 1}</span>
                        {form.educations.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveEducation(ed.id)}
                            className="text-xs text-red-500 font-bold hover:underline flex items-center gap-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Institution / University (e.g. NUST)"
                          value={ed.institution}
                          onChange={e => {
                            const val = e.target.value
                            setForm(prev => ({
                              ...prev,
                              educations: prev.educations.map(item => item.id === ed.id ? { ...item, institution: val } : item)
                            }))
                          }}
                          className="rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Degree (e.g. Bachelor of Science)"
                          value={ed.degree}
                          onChange={e => {
                            const val = e.target.value
                            setForm(prev => ({
                              ...prev,
                              educations: prev.educations.map(item => item.id === ed.id ? { ...item, degree: val } : item)
                            }))
                          }}
                          className="rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Field of Study (e.g. Computer Science)"
                          value={ed.fieldOfStudy}
                          onChange={e => {
                            const val = e.target.value
                            setForm(prev => ({
                              ...prev,
                              educations: prev.educations.map(item => item.id === ed.id ? { ...item, fieldOfStudy: val } : item)
                            }))
                          }}
                          className="rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Graduation Year (e.g. 2023)"
                          value={ed.graduationYear}
                          onChange={e => {
                            const val = e.target.value
                            setForm(prev => ({
                              ...prev,
                              educations: prev.educations.map(item => item.id === ed.id ? { ...item, graduationYear: val } : item)
                            }))
                          }}
                          className="rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* 4. Skills, Certifications & Languages */}
                <div className="space-y-4 pt-4 border-t border-slate-150">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 text-blue-700">
                    <Sparkles className="h-4 w-4" />
                    <span>4. Skills, Certifications & Languages</span>
                  </h3>

                  {/* Skills */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Skills</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="e.g. React, Node.js, Python, Leadership"
                        value={skillInput}
                        onChange={e => setSkillInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                        className="flex-1 rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddSkill}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg"
                      >
                        Add Skill
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {form.skills.map((sk, i) => (
                        <span key={i} className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                          {sk}
                          <button type="button" onClick={() => handleRemoveSkill(sk)} className="hover:text-red-500">×</button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Certifications</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="e.g. AWS Certified Solutions Architect"
                        value={certInput}
                        onChange={e => setCertInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddCert(); } }}
                        className="flex-1 rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddCert}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg"
                      >
                        Add Cert
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {form.certifications.map((c, i) => (
                        <span key={i} className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                          {c}
                          <button type="button" onClick={() => handleRemoveCert(c)} className="hover:text-red-500">×</button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Languages</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="e.g. English, Urdu, Arabic"
                        value={langInput}
                        onChange={e => setLangInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddLang(); } }}
                        className="flex-1 rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddLang}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg"
                      >
                        Add Language
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {form.languages.map((l, i) => (
                        <span key={i} className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                          {l}
                          <button type="button" onClick={() => handleRemoveLang(l)} className="hover:text-red-500">×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Primary Mandatory Submission Button */}
                <div className="pt-6 border-t border-slate-200">
                  <button
                    type="submit"
                    disabled={submittingForm}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base rounded-2xl shadow-lg hover:shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {submittingForm ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Building Your CV...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-gold" />
                        <span>Submit Form & Build My CV</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-center text-slate-500 mt-2">
                    * Details must be submitted through this form to generate your ATS-optimized CV.
                  </p>
                </div>

              </form>
            </div>
          </div>


          {/* RIGHT PANEL: Sophi AI Chat & Voice Note Helper (5 Cols) */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20">
            <div className="rounded-2xl border border-blue-200 bg-white shadow-sm flex flex-col h-[680px]">
              
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-150 bg-gradient-to-r from-blue-50/80 to-white flex items-center justify-between rounded-t-2xl">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Chat with Sophi</h3>
                    <p className="text-[10px] text-blue-600 font-semibold flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Voice Note AI Auto-Filler Active</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/40">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                    }`}>
                      {m.content.split('\n').map((line, idx) => (
                        <p key={idx} className={idx > 0 ? 'mt-1.5' : ''}>{line}</p>
                      ))}
                      {m.extractedCount !== undefined && m.extractedCount > 0 && (
                        <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Auto-filled {m.extractedCount} fields on the form!</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2 text-xs text-slate-500">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />
                      <span>Sophi is listening & extracting fields...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Recording Status Bar */}
              {isRecording && (
                <div className="px-4 py-2 bg-red-50 border-t border-red-100 flex items-center justify-between text-xs text-red-600 font-bold animate-pulse">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-600" />
                    <span>Recording Voice Note... ({recordingSeconds}s)</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Click stop when finished</span>
                </div>
              )}

              {/* Chat Input Controls */}
              <div className="p-3 border-t border-slate-200 bg-white rounded-b-2xl">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-250 rounded-full p-1.5 pl-4 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                  <input
                    type="text"
                    placeholder="Type or send voice note to auto-fill form..."
                    className="flex-1 bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendText()}
                    disabled={isProcessing || isRecording}
                  />

                  {/* Mic / Voice Note Button */}
                  {isRecording ? (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 animate-pulse transition-colors"
                      title="Stop Recording Voice Note"
                    >
                      <Square className="h-4 w-4 fill-current" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={startRecording}
                      disabled={isProcessing || input.trim().length > 0}
                      className={`p-2 rounded-full transition-colors ${
                        input.trim() 
                          ? 'bg-slate-100 text-slate-300' 
                          : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                      }`}
                      title="Send Voice Note to Sophi"
                    >
                      <Mic className="h-4 w-4" />
                    </button>
                  )}

                  {/* Send Button */}
                  <button
                    type="button"
                    onClick={handleSendText}
                    disabled={!input.trim() || isProcessing || isRecording}
                    className={`p-2 rounded-full transition-colors ${
                      input.trim() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-100 text-slate-300'
                    }`}
                    title="Send Text Message"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* LinkedIn Profile URL Modal Prompt */}
        {showLinkedinModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full text-left space-y-4 shadow-2xl border border-slate-100">
              <div className="flex justify-between items-center border-b border-slate-150 pb-3">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-emerald-600" />
                  <span>Fetch LinkedIn Profile</span>
                </h3>
                <button onClick={() => setShowLinkedinModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">✕</button>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Paste your LinkedIn profile URL below to automatically extract your Name, Job Title, Summary, Work Experience, Education, and Skills directly into your form:
              </p>
              <input
                type="url"
                placeholder="https://www.linkedin.com/in/username/"
                value={linkedinModalInput}
                onChange={e => setLinkedinModalInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && linkedinModalInput.trim()) {
                    handleFetchLinkedin(linkedinModalInput)
                  }
                }}
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:border-emerald-600 focus:outline-none"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLinkedinModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!linkedinModalInput.trim() || fetchingLinkedin}
                  onClick={() => handleFetchLinkedin(linkedinModalInput)}
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md disabled:opacity-50"
                >
                  {fetchingLinkedin ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Globe className="h-3.5 w-3.5" />}
                  <span>Fetch Profile Details</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
