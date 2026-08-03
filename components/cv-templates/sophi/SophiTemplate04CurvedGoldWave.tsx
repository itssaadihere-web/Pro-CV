import React from 'react'
import { CVTemplateProps } from '@/types/cv'
import { AcademicSections } from '../AcademicSections'

export default function SophiTemplate04CurvedGoldWave({ data, scale = 1, colorTheme }: CVTemplateProps) {
  const s = (n: number) => `${n * scale}px`

  let goldAccent = '#d97706' // Warm Amber Gold
  let darkSidebar = '#1e293b' // Slate / Charcoal
  let primaryColor = '#0f172a'

  if (colorTheme === 'teal' || colorTheme === 'cyan') {
    goldAccent = '#0d9488'
    darkSidebar = '#0f172a'
    primaryColor = '#0f172a'
  } else if (colorTheme === 'indigo' || colorTheme === 'purple' || colorTheme === 'violet') {
    goldAccent = '#6366f1'
    darkSidebar = '#1e1b4b'
    primaryColor = '#1e1b4b'
  } else if (colorTheme === 'blue' || colorTheme === 'navy' || colorTheme === 'royal') {
    goldAccent = '#2563eb'
    darkSidebar = '#0f172a'
    primaryColor = '#1e293b'
  } else if (colorTheme === 'purple' || colorTheme === 'violet') {
    goldAccent = '#7c3aed'
    darkSidebar = '#1e1b4b'
    primaryColor = '#1e1b4b'
  } else if (colorTheme === 'emerald' || colorTheme === 'green') {
    goldAccent = '#059669'
    darkSidebar = '#064e3b'
    primaryColor = '#064e3b'
  } else if (colorTheme === 'coral' || colorTheme === 'red') {
    goldAccent = '#e11d48'
    darkSidebar = '#881337'
    primaryColor = '#881337'
  } else if (colorTheme === 'charcoal' || colorTheme === 'classic') {
    goldAccent = '#52525b'
    darkSidebar = '#18181b'
    primaryColor = '#18181b'
  }

  return (
    <div style={{
      width: s(794),
      minHeight: s(1123),
      fontFamily: "'Inter', 'Arial', sans-serif",
      backgroundColor: '#ffffff',
      color: '#1e293b',
      boxSizing: 'border-box',
      fontSize: s(10),
      lineHeight: '1.5',
      display: 'flex',
      position: 'relative'
    }}>
      {/* LEFT DARK SIDEBAR WITH WAVE HEADER */}
      <div style={{
        width: s(250),
        backgroundColor: darkSidebar,
        color: '#ffffff',
        padding: `${s(30)} ${s(20)}`,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: s(18),
        flexShrink: 0
      }}>
        {/* Hexagon Initials Badge */}
        <div style={{
          width: s(76),
          height: s(76),
          borderRadius: s(16),
          backgroundColor: goldAccent,
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: s(24),
          fontWeight: 900,
          boxShadow: '0 4px 12px rgba(217, 119, 6, 0.4)',
          margin: '0 auto',
          border: `${s(3)} solid #ffffff`
        }}>
          {data.fullName ? data.fullName.substring(0, 2).toUpperCase() : 'CV'}
        </div>

        {/* Candidate Name & Title on Dark Sidebar */}
        <div style={{ textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: s(12) }}>
          <h1 style={{ fontSize: s(18), fontWeight: 900, color: goldAccent, margin: 0, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            {data.fullName}
          </h1>
          <div style={{ fontSize: s(9.5), color: '#e2e8f0', fontWeight: 600, marginTop: s(2) }}>
            {data.jobTitle}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 style={{ fontSize: s(10), fontWeight: 850, color: goldAccent, textTransform: 'uppercase', letterSpacing: '0.08em', margin: `0 0 ${s(8)} 0`, borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: s(3) }}>
            Contact
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: s(6), fontSize: s(8.5), color: '#cbd5e1', wordBreak: 'break-all' }}>
            {data.email && <div>✉ {data.email}</div>}
            {data.phone && <div>☎ {data.phone}</div>}
            {data.location && <div>📍 {data.location}</div>}
            {data.linkedin && <div>🔗 {data.linkedin.replace(/https?:\/\/(www\.)?/, '')}</div>}
          </div>
        </div>

        {/* Skills */}
        {Object.keys(data.technicalSkills).length > 0 && (
          <div>
            <h3 style={{ fontSize: s(10), fontWeight: 850, color: goldAccent, textTransform: 'uppercase', letterSpacing: '0.08em', margin: `0 0 ${s(8)} 0`, borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: s(3) }}>
              Skills
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: s(6) }}>
              {Object.entries(data.technicalSkills).map(([cat, skills], i) => (
                <div key={i}>
                  <div style={{ fontSize: s(8), fontWeight: 750, color: '#f8fafc', textTransform: 'uppercase', marginBottom: s(2) }}>{cat}</div>
                  <div style={{ fontSize: s(8), color: '#cbd5e1' }}>{Array.isArray(skills) ? skills.join(' • ') : skills}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Core Competencies */}
        {data.coreCompetencies && data.coreCompetencies.length > 0 && (
          <div>
            <h3 style={{ fontSize: s(10), fontWeight: 850, color: goldAccent, textTransform: 'uppercase', letterSpacing: '0.08em', margin: `0 0 ${s(8)} 0`, borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: s(3) }}>
              Competencies
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: s(3) }}>
              {data.coreCompetencies.map((comp, i) => (
                <span key={i} style={{ padding: `${s(2)} ${s(5)}`, backgroundColor: '#334155', color: '#ffffff', borderRadius: s(3), fontSize: s(7.8) }}>
                  {comp}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT WHITE MAIN COLUMN */}
      <div style={{
        flex: 1,
        padding: `${s(30)} ${s(32)}`,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: s(16)
      }}>
        {/* Summary */}
        {data.summary && (
          <section style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            <h2 style={{ fontSize: s(11), fontWeight: 900, color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.06em', margin: `0 0 ${s(6)} 0`, borderBottom: `${s(2)} solid ${goldAccent}`, paddingBottom: s(3) }}>
              About Me
            </h2>
            <p style={{ margin: 0, fontSize: s(9.4), color: '#334155', lineHeight: '1.6', textAlign: 'justify' }}>
              {data.summary}
            </p>
          </section>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <section style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            <h2 style={{ fontSize: s(11), fontWeight: 900, color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.06em', margin: `0 0 ${s(6)} 0`, borderBottom: `${s(2)} solid ${goldAccent}`, paddingBottom: s(3) }}>
              Education
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: s(6) }}>
              {data.education.map((edu, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: s(9.2) }}>
                  <div>
                    <strong style={{ color: primaryColor }}>{edu.degree}</strong> — {edu.institution}
                    {edu.distinction && <div style={{ color: '#64748b', fontSize: s(8) }}>{edu.distinction}</div>}
                  </div>
                  {edu.endYear && <span style={{ fontSize: '9px', color: '#64748b', fontWeight: 600 }}>{edu.endYear}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Work Experience */}
        {data.experience && data.experience.length > 0 && (
          <section>
            <h2 style={{ fontSize: s(11), fontWeight: 900, color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.06em', margin: `0 0 ${s(8)} 0`, borderBottom: `${s(2)} solid ${goldAccent}`, paddingBottom: s(3) }}>
              Work Experience
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: s(12) }}>
              {data.experience.map((job, i) => (
                <div key={i} style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: s(2) }}>
                    <strong style={{ fontSize: s(10.5), color: primaryColor }}>{job.title}</strong>
                    {(job.startDate || job.endDate) && <span style={{ fontSize: s(8.5), color: goldAccent, fontWeight: 700 }}>{[job.startDate, job.endDate].filter(Boolean).join(' – ')}</span>}
                  </div>
                  <div style={{ fontSize: s(9.2), color: '#64748b', fontWeight: 650, marginBottom: s(4) }}>
                    {job.company} {job.location ? `| ${job.location}` : ''}
                  </div>
                  <ul style={{ margin: 0, paddingLeft: s(14), fontSize: s(9), color: '#334155', listStyleType: 'disc' }}>
                    {job.bullets.map((bullet, idx) => (
                      <li key={idx} style={{ marginBottom: s(2.5), lineHeight: '1.45' }}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Academic Sections */}
        <AcademicSections data={data} scale={scale} primaryColor={goldAccent} />

        {/* Languages */}
        {data.languages && data.languages.length > 0 && (
          <section style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            <h2 style={{ fontSize: s(11), fontWeight: 900, color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.06em', margin: `0 0 ${s(6)} 0`, borderBottom: `${s(2)} solid ${goldAccent}`, paddingBottom: s(3) }}>
              Language Proficiency
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: s(12), fontSize: s(9) }}>
              {data.languages.map((lang, i) => (
                <div key={i} style={{ display: 'flex', gap: s(4) }}>
                  <strong style={{ color: primaryColor }}>{lang.language}:</strong>
                  <span style={{ color: '#64748b' }}>{lang.level}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
