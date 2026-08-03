import React from 'react'
import { CVTemplateProps } from '@/types/cv'
import { AcademicSections } from '../AcademicSections'

export default function SophiModernEmeraldAcademic({ data, scale = 1, colorTheme }: CVTemplateProps) {
  const s = (n: number) => `${n * scale}px`

  let primaryColor = '#047857'
  let accentColor = '#059669'
  let badgeBg = '#d1fae5'
  let secondaryBg = '#f0fdf4'
  let cardBorder = '#a7f3d0'

  if (colorTheme === 'blue') {
    primaryColor = '#1d4ed8'
    accentColor = '#2563eb'
    badgeBg = '#dbeafe'
    secondaryBg = '#eff6ff'
    cardBorder = '#bfdbfe'
  } else if (colorTheme === 'purple') {
    primaryColor = '#6d28d9'
    accentColor = '#7c3aed'
    badgeBg = '#ede9fe'
    secondaryBg = '#faf5ff'
    cardBorder = '#ddd6fe'
  }

  return (
    <div style={{
      width: s(794),
      minHeight: s(1123),
      fontFamily: "'Inter', 'Arial', sans-serif",
      backgroundColor: '#ffffff',
      color: '#334155',
      padding: `${s(38)} ${s(42)}`,
      boxSizing: 'border-box',
      fontSize: s(10),
      lineHeight: '1.5',
      position: 'relative'
    }}>
      
      {/* HEADER SECTION */}
      <div style={{
        backgroundColor: secondaryBg,
        borderRadius: s(12),
        border: `${s(1)} solid ${cardBorder}`,
        padding: `${s(20)} ${s(24)}`,
        marginBottom: s(18),
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: s(24), fontWeight: 900, color: primaryColor, margin: 0, letterSpacing: '-0.02em' }}>
            {data.fullName}
          </h1>
          <div style={{ fontSize: s(11), fontWeight: 750, color: '#065f46', marginTop: s(2), textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {data.jobTitle}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: s(12), fontSize: s(8.5), color: '#475569', marginTop: s(8) }}>
            {data.email && <span>✉ {data.email}</span>}
            {data.phone && <span>☎ {data.phone}</span>}
            {data.location && <span>📍 {data.location}</span>}
            {data.linkedin && <span>🔗 {data.linkedin.replace(/https?:\/\/(www\.)?/, '')}</span>}
          </div>
        </div>

        <div style={{
          width: s(60),
          height: s(60),
          borderRadius: s(30),
          backgroundColor: primaryColor,
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: s(18),
          fontWeight: 900,
          flexShrink: 0
        }}>
          {data.fullName ? data.fullName.substring(0, 2).toUpperCase() : 'CV'}
        </div>
      </div>

      {/* BODY CONTENT */}
      <div style={{ display: 'flex', gap: s(22) }}>
        
        {/* MAIN LEFT COLUMN */}
        <div style={{ flex: 1.7, display: 'flex', flexDirection: 'column', gap: s(14) }}>
          
          {/* Summary */}
          {data.summary && (
            <section style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: s(6), marginBottom: s(6) }}>
                <span style={{ fontSize: s(12), color: primaryColor }}>🌿</span>
                <h2 style={{ fontSize: s(11), fontWeight: 850, color: primaryColor, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Professional Overview
                </h2>
              </div>
              <p style={{ margin: 0, fontSize: s(9.4), color: '#334155', lineHeight: '1.6', textAlign: 'justify' }}>
                {data.summary}
              </p>
            </section>
          )}

          {/* Work Experience */}
          {data.experience && data.experience.length > 0 && (
            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: s(6), marginBottom: s(8) }}>
                <span style={{ fontSize: s(12), color: primaryColor }}>💼</span>
                <h2 style={{ fontSize: s(11), fontWeight: 850, color: primaryColor, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Academic & Professional Experience
                </h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(12) }}>
                {data.experience.map((job, i) => (
                  <div key={i} style={{ pageBreakInside: 'avoid', breakInside: 'avoid', borderLeft: `${s(2)} solid ${cardBorder}`, paddingLeft: s(12), marginLeft: s(2) }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: s(2) }}>
                      <strong style={{ fontSize: s(10.5), color: primaryColor }}>{job.title}</strong>
                      <span style={{ fontSize: s(8.5), color: '#065f46', fontWeight: 700, backgroundColor: badgeBg, padding: `${s(1.5)} ${s(6)}`, borderRadius: s(4) }}>
                        {[job.startDate, job.endDate].filter(Boolean).join(' – ')}
                      </span>
                    </div>
                    <div style={{ fontSize: s(9.2), color: '#475569', fontWeight: 700, marginBottom: s(4) }}>
                      {job.company} {job.location ? `• ${job.location}` : ''}
                    </div>
                    <ul style={{ margin: 0, paddingLeft: s(12), fontSize: s(9), color: '#334155', listStyleType: 'disc' }}>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: s(6), marginBottom: s(6) }}>
                <span style={{ fontSize: s(12), color: primaryColor }}>🏆</span>
                <h2 style={{ fontSize: s(11), fontWeight: 850, color: primaryColor, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Key Accomplishments
                </h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(5) }}>
                {data.keyAchievements.map((ach, i) => (
                  <div key={i} style={{ display: 'flex', gap: s(6), fontSize: s(9), color: '#334155', lineHeight: '1.4' }}>
                    <span style={{ color: primaryColor, fontWeight: 'bold' }}>✓</span>
                    <span>{ach}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Academic Sections */}
          <AcademicSections data={data} scale={scale} primaryColor={primaryColor} />
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{
          width: s(215),
          display: 'flex',
          flexDirection: 'column',
          gap: s(14)
        }}>
          {/* Core Competencies */}
          {data.coreCompetencies && data.coreCompetencies.length > 0 && (
            <div style={{ backgroundColor: secondaryBg, border: `${s(1)} solid ${cardBorder}`, borderRadius: s(8), padding: s(12) }}>
              <h3 style={{ fontSize: s(9.5), fontWeight: 850, color: primaryColor, textTransform: 'uppercase', margin: `0 0 ${s(6)} 0`, borderBottom: `${s(1)} solid ${cardBorder}`, paddingBottom: s(3) }}>
                Competencies
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: s(3) }}>
                {data.coreCompetencies.map((comp, i) => (
                  <span key={i} style={{ padding: `${s(2)} ${s(5)}`, backgroundColor: '#ffffff', color: '#065f46', borderRadius: s(4), fontSize: s(8), fontWeight: 600, border: `${s(0.5)} solid ${cardBorder}` }}>
                    {comp}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <div style={{ backgroundColor: secondaryBg, border: `${s(1)} solid ${cardBorder}`, borderRadius: s(8), padding: s(12) }}>
              <h3 style={{ fontSize: s(9.5), fontWeight: 850, color: primaryColor, textTransform: 'uppercase', margin: `0 0 ${s(6)} 0`, borderBottom: `${s(1)} solid ${cardBorder}`, paddingBottom: s(3) }}>
                Education
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(6) }}>
                {data.education.map((edu, i) => (
                  <div key={i} style={{ fontSize: s(8.5) }}>
                    <strong style={{ color: primaryColor }}>{edu.degree}</strong>
                    <div style={{ color: '#475569' }}>{edu.institution}</div>
                    <div style={{ color: '#065f46', fontSize: s(7.8), fontWeight: 650 }}>{edu.endYear} {edu.distinction ? `| ${edu.distinction}` : ''}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {data.certifications && data.certifications.length > 0 && (
            <div style={{ backgroundColor: secondaryBg, border: `${s(1)} solid ${cardBorder}`, borderRadius: s(8), padding: s(12) }}>
              <h3 style={{ fontSize: s(9.5), fontWeight: 850, color: primaryColor, textTransform: 'uppercase', margin: `0 0 ${s(6)} 0`, borderBottom: `${s(1)} solid ${cardBorder}`, paddingBottom: s(3) }}>
                Certifications
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(4) }}>
                {data.certifications.map((cert, i) => (
                  <div key={i} style={{ fontSize: s(8.2), color: '#334155' }}>
                    <strong style={{ color: primaryColor }}>{cert.name}</strong>
                    <div style={{ color: '#64748b', fontSize: s(7.5) }}>{cert.issuer} ({cert.year})</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technical Skills */}
          {Object.keys(data.technicalSkills).length > 0 && (
            <div style={{ backgroundColor: secondaryBg, border: `${s(1)} solid ${cardBorder}`, borderRadius: s(8), padding: s(12) }}>
              <h3 style={{ fontSize: s(9.5), fontWeight: 850, color: primaryColor, textTransform: 'uppercase', margin: `0 0 ${s(6)} 0`, borderBottom: `${s(1)} solid ${cardBorder}`, paddingBottom: s(3) }}>
                Software & Platforms
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(6) }}>
                {Object.entries(data.technicalSkills).map(([cat, skills], i) => (
                  <div key={i}>
                    <div style={{ fontSize: s(8), fontWeight: 750, color: primaryColor, textTransform: 'uppercase', marginBottom: s(2) }}>{cat}</div>
                    <div style={{ fontSize: s(8), color: '#334155' }}>{Array.isArray(skills) ? skills.join(', ') : skills}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* FOOTER */}
      <div style={{
        marginTop: s(24),
        paddingTop: s(8),
        borderTop: `${s(1)} solid ${cardBorder}`,
        fontSize: s(8),
        color: '#94a3b8',
        textAlign: 'center'
      }}>
        Academic Profile — SOPHI AI Pro-CV
      </div>
    </div>
  )
}
