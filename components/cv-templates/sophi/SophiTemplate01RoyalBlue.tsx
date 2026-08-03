import React from 'react'
import { CVTemplateProps } from '@/types/cv'
import { AcademicSections } from '../AcademicSections'

export default function SophiTemplate01RoyalBlue({ data, scale = 1, colorTheme }: CVTemplateProps) {
  const s = (n: number) => `${n * scale}px`

  let sidebarBg = '#1d4ed8' // Royal Blue
  let primaryColor = '#1e3a8a'
  let accentColor = '#2563eb'

  if (colorTheme === 'gold' || colorTheme === 'yellow' || colorTheme === 'warm') {
    sidebarBg = '#eab308'
    primaryColor = '#854d0e'
    accentColor = '#ca8a04'
  } else  if (colorTheme === 'emerald' || colorTheme === 'green') {
    sidebarBg = '#047857'
    primaryColor = '#065f46'
    accentColor = '#059669'
  } else if (colorTheme === 'purple') {
    sidebarBg = '#6d28d9'
    primaryColor = '#581c87'
    accentColor = '#7c3aed'
  } else if (colorTheme === 'burgundy' || colorTheme === 'coral' || colorTheme === 'red') {
    sidebarBg = '#9f1239'
    primaryColor = '#881337'
    accentColor = '#be123c'
  } else if (colorTheme === 'charcoal' || colorTheme === 'classic') {
    sidebarBg = '#1e293b'
    primaryColor = '#0f172a'
    accentColor = '#3b82f6'
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
      {/* LEFT SIDEBAR (Royal Blue / Theme) */}
      <div style={{
        width: s(240),
        backgroundColor: sidebarBg,
        color: '#ffffff',
        padding: `${s(36)} ${s(20)}`,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: s(20),
        flexShrink: 0
      }}>
        {/* White Square Initials Logo Box */}
        <div style={{
          width: s(80),
          height: s(80),
          backgroundColor: '#ffffff',
          color: sidebarBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: s(28),
          fontWeight: 900,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          margin: '0 auto'
        }}>
          {data.fullName ? data.fullName.substring(0, 2).toUpperCase() : 'CV'}
        </div>

        {/* Contact */}
        <div>
          <h3 style={{ fontSize: s(11), fontWeight: 850, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.08em', margin: `0 0 ${s(10)} 0`, borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: s(4) }}>
            Contact
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: s(8), fontSize: s(8.8), color: '#f1f5f9', wordBreak: 'break-all' }}>
            {data.email && <div>✉ {data.email}</div>}
            {data.phone && <div>☎ {data.phone}</div>}
            {data.location && <div>📍 {data.location}</div>}
            {data.linkedin && <div>🔗 {data.linkedin.replace(/https?:\/\/(www\.)?/, '')}</div>}
            {data.website && <div>🌐 {data.website.replace(/https?:\/\/(www\.)?/, '')}</div>}
          </div>
        </div>

        {/* Skills */}
        {Object.keys(data.technicalSkills).length > 0 && (
          <div>
            <h3 style={{ fontSize: s(11), fontWeight: 850, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.08em', margin: `0 0 ${s(10)} 0`, borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: s(4) }}>
              Skills
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: s(8) }}>
              {Object.entries(data.technicalSkills).map(([cat, skills], i) => (
                <div key={i}>
                  <div style={{ fontSize: s(8.2), fontWeight: 750, color: '#e2e8f0', textTransform: 'uppercase', marginBottom: s(2) }}>{cat}</div>
                  <ul style={{ margin: 0, paddingLeft: s(14), fontSize: s(8.5), color: '#ffffff', listStyleType: 'disc' }}>
                    {skills.map((skill, idx) => (
                      <li key={idx} style={{ marginBottom: s(2) }}>{skill}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {data.languages && data.languages.length > 0 && (
          <div>
            <h3 style={{ fontSize: s(11), fontWeight: 850, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.08em', margin: `0 0 ${s(10)} 0`, borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: s(4) }}>
              Languages
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: s(4), fontSize: s(8.8), color: '#ffffff' }}>
              {data.languages.map((lang, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{lang.language}:</strong>
                  <span style={{ color: '#cbd5e1' }}>{lang.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <div>
            <h3 style={{ fontSize: s(11), fontWeight: 850, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.08em', margin: `0 0 ${s(10)} 0`, borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: s(4) }}>
              Certificates
            </h3>
            <ul style={{ margin: 0, paddingLeft: s(14), fontSize: s(8.5), color: '#ffffff', listStyleType: 'disc' }}>
              {data.certifications.map((cert, i) => (
                <li key={i} style={{ marginBottom: s(4) }}>
                  <strong>{cert.name}</strong>
                  <div style={{ fontSize: s(7.8), color: '#cbd5e1' }}>{cert.issuer} ({cert.year})</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* RIGHT MAIN COLUMN */}
      <div style={{
        flex: 1,
        padding: `${s(36)} ${s(32)}`,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: s(16)
      }}>
        {/* Candidate Header */}
        <div style={{ borderBottom: `${s(2)} solid #cbd5e1`, paddingBottom: s(12) }}>
          <h1 style={{ fontSize: s(26), fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            {data.fullName}
          </h1>
          <div style={{ fontSize: s(12), fontWeight: 700, color: accentColor, marginTop: s(3), textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {data.jobTitle}
          </div>
        </div>

        {/* Summary */}
        {data.summary && (
          <section style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            <h2 style={{ fontSize: s(11), fontWeight: 850, color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.06em', margin: `0 0 ${s(6)} 0` }}>
              Summary
            </h2>
            <p style={{ margin: 0, fontSize: s(9.5), color: '#334155', lineHeight: '1.6', textAlign: 'justify' }}>
              {data.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <section>
            <h2 style={{ fontSize: s(11), fontWeight: 850, color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.06em', margin: `0 0 ${s(8)} 0` }}>
              Experience
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: s(12) }}>
              {data.experience.map((job, i) => (
                <div key={i} style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: s(2) }}>
                    <strong style={{ fontSize: s(10.5), color: '#0f172a' }}>{job.company} | {job.title}</strong>
                    {(job.startDate || job.endDate) && <span style={{ fontSize: s(8.5), color: primaryColor, fontWeight: 700 }}>{[job.startDate, job.endDate].filter(Boolean).join(' – ')}</span>}
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

        {/* Key Achievements */}
        {data.keyAchievements && data.keyAchievements.length > 0 && (
          <section style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            <h2 style={{ fontSize: s(11), fontWeight: 850, color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.06em', margin: `0 0 ${s(6)} 0` }}>
              Key Achievements
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: s(4) }}>
              {data.keyAchievements.map((ach, i) => (
                <div key={i} style={{ display: 'flex', gap: s(6), fontSize: s(9), color: '#334155', lineHeight: '1.4' }}>
                  <span style={{ color: sidebarBg, fontWeight: 'bold' }}>•</span>
                  <span>{ach}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Academic Sections */}
        <AcademicSections data={data} scale={scale} primaryColor={sidebarBg} />

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <section style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            <h2 style={{ fontSize: s(11), fontWeight: 850, color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.06em', margin: `0 0 ${s(6)} 0` }}>
              Education
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: s(6) }}>
              {data.education.map((edu, i) => (
                <div key={i} style={{ fontSize: s(9.2) }}>
                  <strong style={{ color: '#0f172a' }}>{edu.degree}</strong>
                  <div style={{ color: '#475569', fontStyle: 'italic' }}>{edu.institution} — {edu.endYear}</div>
                  {edu.distinction && <div style={{ color: sidebarBg, fontSize: s(8.2) }}>{edu.distinction}</div>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
