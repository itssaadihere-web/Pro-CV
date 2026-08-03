export interface CVData {
  // Personal
  fullName: string
  jobTitle: string
  email: string
  phone: string
  location: string
  linkedin: string
  website?: string

  // Sections
  summary: string
  coreCompetencies: string[]

  experience: Array<{
    title: string
    company: string
    location?: string
    startDate: string
    endDate: string
    bullets: string[]
  }>

  keyAchievements: string[]

  education: Array<{
    degree: string
    institution: string
    startYear: string
    endYear: string
    distinction?: string
  }>

  certifications: Array<{
    name: string
    issuer: string
    year: string
  }>

  technicalSkills: Record<string, string[]> // { "Software": ["Excel", "SAP"], ... }
  languages: Array<{ language: string; level: string }>
  publications?: Array<{
    authors: string
    year: string
    title: string
    journal: string
    indexing_tier?: string
  }>
  conferencePresentations?: Array<{
    authors: string
    year: string
    title: string
    conference: string
  }>
  researchSupervision?: string[]
  executiveTrainings?: string[]
  interests?: string[]
  volunteerWork?: Array<{ role: string; org: string; period: string; description: string }>
  references?: Array<{ name: string; title: string; contact: string }>
}

export function parseKimiCV(kimiOutput: string): CVData {
  let jsonObj: any = null
  try {
    const cleaned = kimiOutput.trim().replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim()
    jsonObj = JSON.parse(cleaned)
  } catch (e) {
    // Not raw JSON, proceed with text regex parsing
  }

  if (jsonObj && jsonObj.personal) {
    return {
      fullName: jsonObj.personal.full_name || '',
      jobTitle: jsonObj.personal.job_title || '',
      email: jsonObj.personal.email || '',
      phone: jsonObj.personal.phone || '',
      location: jsonObj.personal.location || '',
      linkedin: jsonObj.personal.linkedin || '',
      website: jsonObj.personal.website || '',
      summary: jsonObj.summary || '',
      coreCompetencies: jsonObj.core_competencies || [],
      experience: (jsonObj.experience || []).map((exp: any) => ({
        title: exp.job_title || '',
        company: exp.company || '',
        location: exp.location || '',
        startDate: exp.start_date || '',
        endDate: exp.end_date || '',
        bullets: exp.bullets || []
      })),
      keyAchievements: jsonObj.key_achievements || [],
      education: (jsonObj.education || []).map((edu: any) => ({
        degree: edu.degree || '',
        institution: edu.institution || '',
        startYear: '',
        endYear: edu.graduation_year || '',
        distinction: edu.distinction || ''
      })),
      certifications: (jsonObj.certifications || []).map((c: any) => ({
        name: c.name || '',
        issuer: c.issuer || '',
        year: c.year || ''
      })),
      publications: jsonObj.publications || [],
      conferencePresentations: jsonObj.conference_presentations || [],
      researchSupervision: jsonObj.research_supervision || [],
      executiveTrainings: jsonObj.executive_trainings_delivered || [],
      technicalSkills: jsonObj.technical_skills || {},
      languages: Array.isArray(jsonObj.technical_skills?.Languages)
        ? jsonObj.technical_skills.Languages.map((l: string) => ({ language: l, level: 'Native/Professional' }))
        : []
    }
  }

  // Extract the REVAMPED CV section
  const cvSection = kimiOutput
    .match(/---REVAMPED CV---([\s\S]*?)---LINKEDIN OPTIMIZER---/)?.[1]?.trim() ?? kimiOutput

  const lines = cvSection.split('\n').filter(l => l.trim())

  // Name & Job Title
  const fullName = lines[0]?.replace(/^[█\s#─═┌└┐┘│*]+|[█\s#─═┌└┐┘│*]+$/g, '').trim() ?? ''
  const jobTitle = lines[1]?.replace(/^[#\s\-*]+|[#\s\-*]+$/g, '').trim() ?? ''

  // Contact line
  const contactLine = lines.find(l => l.includes('@')) ?? ''
  const email = contactLine.match(/[\w.+-]+@[\w-]+\.[a-z]{2,}/i)?.[0] ?? ''
  const phone = contactLine.match(/[\+\d][\d\s\-\(\)]{7,}/)?.[0]?.trim() ?? ''
  const linkedin = contactLine.match(/linkedin\.com\/in\/[\w-]+/i)?.[0] ?? ''
  const location = contactLine.match(/📍\s*([^|]+)/)?.[1]?.trim()
    ?? contactLine.split('|').find(p => p.includes(','))?.trim() ?? ''

  // Summary: Match until next uppercase header block
  const summaryMatch = cvSection.match(
    /(?:PROFESSIONAL SUMMARY|SUMMARY)[═\s\n\-#_*]+([\s\S]+?)(?=\n\s*(?:CORE COMPETENCIES|KEY COMPETENCIES|PROFESSIONAL EXPERIENCE|WORK EXPERIENCE|EXPERIENCE|RESEARCH PUBLICATIONS|CONFERENCE PRESENTATIONS|RESEARCH SUPERVISION|EXECUTIVE TRAININGS|KEY ACHIEVEMENTS|EDUCATION|CERTIFICATIONS|TECHNICAL SKILLS|════))/i
  )
  const summary = summaryMatch?.[1]?.replace(/[▸✦★◈✔•*\-]/g, '').trim() ?? ''

  // Core Competencies
  const competenciesBlock = cvSection.match(
    /(?:CORE COMPETENCIES|KEY COMPETENCIES|COMPETENCIES)[═\s\n\-#_*]+([\s\S]+?)(?=\n\s*(?:PROFESSIONAL EXPERIENCE|WORK EXPERIENCE|EXPERIENCE|RESEARCH PUBLICATIONS|CONFERENCE PRESENTATIONS|RESEARCH SUPERVISION|EXECUTIVE TRAININGS|KEY ACHIEVEMENTS|EDUCATION|CERTIFICATIONS|TECHNICAL SKILLS|════))/i
  )?.[1] ?? ''
  
  const coreCompetencies = competenciesBlock
    .split(/[\n▸✦★◈✔•*\-]/)
    .map(s => s.trim())
    .filter(s => s.length > 2 && s.length < 80)

  // Experience: Parse job blocks between ┌─ and next ┌─ or section header
  const experienceBlocks = cvSection.match(
    /┌─+┐[\s\S]+?└─+┘[\s\S]*?(?=┌─+┐|════|RESEARCH PUBLICATIONS|CONFERENCE PRESENTATIONS|RESEARCH SUPERVISION|EXECUTIVE TRAININGS|KEY ACHIEVEMENTS|EDUCATION|CERTIFICATIONS|TECHNICAL SKILLS|$)/g
  ) ?? []

  let experience = experienceBlocks.map(block => {
    const headerLine = block.match(/│\s*(.+?)\s*│/)?.[1]?.trim() ?? ''
    const [titlePart, companyPart] = headerLine.split('—').map(s => s.trim())
    const dateLine = block.match(/│[^│]*?([A-Za-z]+\s+\d{4}|\d{4})\s*[–-]\s*([A-Za-z]+\s+\d{4}|\d{4}|Present)[^│]*?│/i)
      || block.match(/(\b[A-Z][a-z]+\s+\d{4}|\b\d{4})\s*[–-]\s*(\b[A-Z][a-z]+\s+\d{4}|\b\d{4}|Present)/i)
    const bullets = block.match(/✦\s*(.+)/g)?.map(b => b.replace('✦', '').trim()) ?? []

    return {
      title: titlePart ?? '',
      company: companyPart ?? '',
      startDate: dateLine?.[1] ?? '',
      endDate: dateLine?.[2] ?? '',
      bullets
    }
  })

  // Experience fallback parsing
  if (experience.length === 0) {
    const expSectionMatch = cvSection.match(
      /(?:PROFESSIONAL EXPERIENCE|WORK EXPERIENCE)[═\s\n\-#_*]+([\s\S]+?)(?=\n\s*(?:RESEARCH PUBLICATIONS|CONFERENCE PRESENTATIONS|RESEARCH SUPERVISION|EXECUTIVE TRAININGS|KEY ACHIEVEMENTS|EDUCATION|CERTIFICATIONS|TECHNICAL SKILLS|════|$))/i
    )
    if (expSectionMatch) {
      const expText = expSectionMatch[1]
      const jobs = expText.split(/(?=\n[A-Za-z0-9\s,&]+—[A-Za-z0-9\s,&]+)/)
      experience = jobs.map(jobBlock => {
        const lines = jobBlock.split('\n').map(l => l.trim()).filter(Boolean)
        if (lines.length === 0) return null
        
        const header = lines[0]
        const [titlePart, companyPart] = header.split('—').map(s => s.trim())
        const dateMatch = jobBlock.match(/([A-Za-z]+\s+\d{4}|\d{4})\s*[–-]\s*([A-Za-z]+\s+\d{4}|\d{4}|Present)/i)
        const bullets = lines.filter(l => /^[✦*•\-▸]/.test(l)).map(l => l.replace(/^[✦*•\-▸]\s*/, '').trim())
        
        return {
          title: titlePart ?? '',
          company: companyPart ?? '',
          startDate: dateMatch?.[1] ?? '',
          endDate: dateMatch?.[2] ?? '',
          bullets
        }
      }).filter(Boolean) as any[]
    }
  }

  // Research Publications
  const pubBlockMatch = cvSection.match(
    /(?:RESEARCH PUBLICATIONS|PUBLICATIONS)[═\s\n\-#_*]+([\s\S]+?)(?=\n\s*(?:CONFERENCE PRESENTATIONS|RESEARCH SUPERVISION|EXECUTIVE TRAININGS|KEY ACHIEVEMENTS|EDUCATION|CERTIFICATIONS|TECHNICAL SKILLS|════|$))/i
  )
  const publications: Array<{ authors: string; year: string; title: string; journal: string; indexing_tier?: string }> = []
  if (pubBlockMatch) {
    const pubLines = pubBlockMatch[1].split(/(?=\n[•\*])|\n(?=\w+)/).map(l => l.trim()).filter(Boolean)
    pubLines.forEach(line => {
      const clean = line.replace(/^[•\*]\s*/, '').trim()
      if (clean.length > 5) {
        const yearMatch = clean.match(/\((\d{4})\)/)
        const titleMatch = clean.match(/"([^"]+)"/) || clean.match(/“([^”]+)”/)
        publications.push({
          authors: clean.split('(')[0]?.trim() || clean,
          year: yearMatch?.[1] || '',
          title: titleMatch?.[1] || clean,
          journal: clean.split('.').slice(-2).join('.').trim() || ''
        })
      }
    })
  }

  // Conference Presentations
  const confBlockMatch = cvSection.match(
    /(?:CONFERENCE PRESENTATIONS|PRESENTATIONS)[═\s\n\-#_*]+([\s\S]+?)(?=\n\s*(?:RESEARCH SUPERVISION|EXECUTIVE TRAININGS|KEY ACHIEVEMENTS|EDUCATION|CERTIFICATIONS|TECHNICAL SKILLS|════|$))/i
  )
  const conferencePresentations: Array<{ authors: string; year: string; title: string; conference: string }> = []
  if (confBlockMatch) {
    const confLines = confBlockMatch[1].split(/(?=\n[•\*])|\n(?=\w+)/).map(l => l.trim()).filter(Boolean)
    confLines.forEach(line => {
      const clean = line.replace(/^[•\*]\s*/, '').trim()
      if (clean.length > 5) {
        const yearMatch = clean.match(/\((\d{4})\)/)
        const titleMatch = clean.match(/"([^"]+)"/) || clean.match(/“([^”]+)”/)
        const confMatch = clean.match(/Presented at:\s*(.+)/i)
        conferencePresentations.push({
          authors: clean.split('(')[0]?.trim() || clean,
          year: yearMatch?.[1] || '',
          title: titleMatch?.[1] || clean,
          conference: confMatch?.[1]?.trim() || clean
        })
      }
    })
  }

  // Research Supervision
  const supBlockMatch = cvSection.match(
    /(?:RESEARCH SUPERVISION)[═\s\n\-#_*]+([\s\S]+?)(?=\n\s*(?:EXECUTIVE TRAININGS|KEY ACHIEVEMENTS|EDUCATION|CERTIFICATIONS|TECHNICAL SKILLS|════|$))/i
  )
  const researchSupervision: string[] = []
  if (supBlockMatch) {
    supBlockMatch[1].split('\n').forEach(line => {
      const clean = line.replace(/^[▸✦★◈✔•*\-]\s*/, '').trim()
      if (clean.length > 3) researchSupervision.push(clean)
    })
  }

  // Executive Trainings & Workshops
  const trnBlockMatch = cvSection.match(
    /(?:EXECUTIVE TRAININGS & WORKSHOPS|EXECUTIVE TRAININGS|WORKSHOPS FACILITATED)[═\s\n\-#_*]+([\s\S]+?)(?=\n\s*(?:KEY ACHIEVEMENTS|EDUCATION|CERTIFICATIONS|TECHNICAL SKILLS|════|$))/i
  )
  const executiveTrainings: string[] = []
  if (trnBlockMatch) {
    trnBlockMatch[1].split('\n').forEach(line => {
      const clean = line.replace(/^[▸✦★◈✔•*\-]\s*/, '').trim()
      if (clean.length > 3) executiveTrainings.push(clean)
    })
  }

  // Key Achievements: ★ bullet lines
  const keyAchievements = cvSection.match(/★\s*(.+)/g)
    ?.map(a => a.replace(/^[★\s]+/, '').trim()) ?? []

  // Education: ◈ bullet blocks
  const educationBlocks = cvSection.match(/◈\s*([\s\S]+?)(?=◈|════|CERTIFICATIONS|TECHNICAL SKILLS|Languages|$)/g) ?? []
  const education = educationBlocks.map(block => {
    const eduLines = block.split('\n').map(l => l.trim()).filter(Boolean)
    const degree = eduLines[0]?.replace('◈', '').trim() ?? ''
    const institution = eduLines[1] ?? ''
    const years = block.match(/(\d{4})\s*[–-]\s*(\d{4})/)
    return {
      degree,
      institution,
      startYear: years?.[1] ?? '',
      endYear: years?.[2] ?? '',
    }
  })

  if (education.length === 0) {
    const eduSectionMatch = cvSection.match(
      /(?:EDUCATION)[═\s\n\-#_*]+([\s\S]+?)(?=\n\s*(?:CERTIFICATIONS|TECHNICAL SKILLS|LANGUAGES|════|$))/i
    )
    if (eduSectionMatch) {
      const eduText = eduSectionMatch[1]
      const eduLines = eduText.split('\n').map(l => l.trim()).filter(Boolean)
      let currentDegree = ''
      let currentInst = ''
      let startY = ''
      let endY = ''
      for (const l of eduLines) {
        if (/^[A-Za-z]/.test(l)) {
          if (l.includes(',') || l.includes('—')) {
            const parts = l.split(/[,—]/).map(s => s.trim())
            currentDegree = parts[0]
            currentInst = parts[1] || ''
          } else {
            currentDegree = l
          }
          const years = l.match(/(\d{4})\s*[–-]\s*(\d{4})/)
          if (years) {
            startY = years[1]
            endY = years[2]
          }
          education.push({ degree: currentDegree, institution: currentInst, startYear: startY, endYear: endY })
        }
      }
    }
  }

  // Certifications: ✔ bullet lines
  const certLines = cvSection.match(/✔\s*(.+)/g) ?? []
  let certifications = certLines.map(line => {
    const clean = line.replace('✔', '').trim()
    const parts = clean.split('—')
    const yearMatch = clean.match(/\d{4}/)
    return {
      name: parts[0]?.trim() ?? clean,
      issuer: parts[1]?.replace(/\d{4}/, '').trim() ?? '',
      year: yearMatch?.[0] ?? ''
    }
  })

  if (certifications.length === 0) {
    const certSectionMatch = cvSection.match(
      /(?:CERTIFICATIONS)[═\s\n\-#_*]+([\s\S]+?)(?=\n\s*(?:TECHNICAL SKILLS|LANGUAGES|════|$))/i
    )
    if (certSectionMatch) {
      const certText = certSectionMatch[1]
      const lines = certText.split('\n').map(l => l.trim()).filter(Boolean)
      certifications = lines.map(l => {
        const parts = l.split(/[—,]/).map(s => s.trim())
        const yearMatch = l.match(/\d{4}/)
        return {
          name: parts[0] || l,
          issuer: parts[1] || '',
          year: yearMatch?.[0] || ''
        }
      })
    }
  }

  // Technical Skills: Category: skill | skill format
  const skillsBlock = cvSection.match(
    /\n\s*(?:TECHNICAL SKILLS)[═\s\n\-#_*]+([\s\S]+?)(?=\n\s*(?:VOLUNTEER|INTERESTS|REFERENCES|LANGUAGES|────|$))/i
  )?.[1] ?? ''
  const technicalSkills: Record<string, string[]> = {}
  skillsBlock.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('•') && !trimmed.startsWith('★') && !trimmed.startsWith('◈') && !trimmed.startsWith('✔')) {
      const match = trimmed.match(/^([^:]+):\s*(.+)/)
      if (match) {
        const category = match[1].trim()
        const skills = match[2].split('|').map(s => s.trim()).filter(Boolean)
        technicalSkills[category] = skills
      }
    }
  })

  // Languages
  const langBlock = cvSection.match(/Languages\s*:\s*(.+)/i)?.[1] ?? ''
  const languages = langBlock.split('|').map(l => {
    const parts = l.trim().split(':')
    return { language: parts[0]?.trim() ?? l.trim(), level: parts[1]?.trim() ?? 'Professional' }
  }).filter(l => l.language.length > 0)

  return {
    fullName, jobTitle, email, phone, location, linkedin,
    summary, coreCompetencies, experience, keyAchievements,
    education, certifications, publications, conferencePresentations,
    researchSupervision, executiveTrainings, technicalSkills, languages
  }
}
