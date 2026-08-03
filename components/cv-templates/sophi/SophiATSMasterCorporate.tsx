import React from 'react'
import { CVTemplateProps } from '@/types/cv'
import { AcademicSections } from '../AcademicSections'

export default function SophiATSMasterCorporate({ data, scale = 1, colorTheme }: CVTemplateProps) {
  const s = (n: number) => `${n * scale}px`

  let primaryColor = '#0f172a'
  let accentColor = '#2563eb'
  const lineBorder = '#cbd5e1'

  if (colorTheme === 'navy' || colorTheme === 'blue') {
    primaryColor = '#1e3a8a'
    accentColor = '#1d4ed8'
  } else if (colorTheme === 'emerald' || colorTheme === 'green') {
    primaryColor = '#064e3b'
    accentColor = '#047857'
  }

  return (
    <div style={{
      width: s(794),
      minHeight: s(1123),
      fontFamily: "'Inter', 'Georgia', 'Arial', sans-serif",
      backgroundColor: '#ffffff',
      color: '#1e293b',
      padding: `${s(40)} ${s(48)}`,
      boxSizing: 'border-box',
      fontSize: s(10),
      lineHeight: '1.5',
      position: 'relative'
    }}>
      
      {/* HEADER SECTION (Centered ATS Classic) */}
      <div style={{ textAlign: 'center', marginBottom: s(18), borderBottom: `${s(2)} solid ${primaryColor}`, paddingBottom: s(14) }}>
        <h1 style={{ fontSize: s(24), fontWeight: 900, color: primaryColor, margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {data.fullName}
        </h1>
        <div style={{ fontSize: s(11.5), fontWeight: 700, color: accentColor, marginTop: s(3), textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {data.jobTitle}
        </div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: s(12), fontSize: s(8.8), color: '#475569', marginTop: s(8), fontWeight: 500 }}>
          {data.email && <span>✉ {data.email}</span>}
          {data.phone && <span>☎ {data.phone}</span>}
          {data.location && <span>📍 {data.location}</span>}
          {data.linkedin && <span>🔗 {data.linkedin.replace(/https?:\/\/(www\.)?/, '')}</span>}
          {data.website && <span>🌐 {data.website.replace(/https?:\/\/(www\.)?/, '')}</span>}
        </div>
      </div>

      {/* BODY CONTENT - SINGLE COLUMN CLEAN ATS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: s(14) }}>
        
        {/* Summary */}
        {data.summary && (
          <section style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            <h2 style={{ fontSize: s(11), fontWeight: 850, color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.06em', margin: `0 0 ${s(6)} 0`, borderBottom: `${s(1)} solid ${lineBorder}`, paddingBottom: s(3) }}>
              Professional Summary
            </h2>
            <p style={{ margin: 0, fontSize: s(9.5), color: '#334155', lineHeight: '1.6', textAlign: 'justify' }}>
              {data.summary}
            </p>
          </section>
        )}

        {/* Core Competencies */}
        {data.coreCompetencies && data.coreCompetencies.length > 0 && (
          <section style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            <h2 style={{ fontSize: s(11), fontWeight: 850, color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.06em', margin: `0 0 ${s(6)} 0`, borderBottom: `${s(1)} solid ${lineBorder}`, paddingBottom: s(3) }}>
              Core Competencies
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: s(6) }}>
              {data.coreCompetencies.map((comp, i) => (
                <span key={i} style={{ fontSize: s(9), color: '#1e293b', fontWeight: 600 }}>
                  ▸ {comp} {i < data.coreCompetencies.length - 1 ? '  ' : ''}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Work Experience */}
        {data.experience && data.experience.length > 0 && (
          <section>
            <h2 style={{ fontSize: s(11), fontWeight: 850, color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.06em', margin: `0 0 ${s(10)} 0`, borderBottom: `${s(1)} solid ${lineBorder}`, paddingBottom: s(3) }}>
              Professional Experience
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: s(12) }}>
              {data.experience.map((job, i) => (
                <div key={i} style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: s(2) }}>
                    <strong style={{ fontSize: s(10.5), color: primaryColor }}>{job.title}</strong>
                    {(job.startDate || job.endDate) && <span style={{ fontSize: s(9), color: '#475569', fontWeight: 700 }}>{[job.startDate, job.endDate].filter(Boolean).join(' – ')}</span>}
                  </div>
                  <div style={{ fontSize: s(9.5), color: accentColor, fontWeight: 700, marginBottom: s(4) }}>
                    {job.company} {job.location ? `| ${job.location}` : ''}
                  </div>
                  <ul style={{ margin: 0, paddingLeft: s(16), fontSize: s(9.2), color: '#334155', listStyleType: 'disc' }}>
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
            <h2 style={{ fontSize: s(11), fontWeight: 850, color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.06em', margin: `0 0 ${s(6)} 0`, borderBottom: `${s(1)} solid ${lineBorder}`, paddingBottom: s(3) }}>
              Key Achievements
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: s(4), marginTop: s(4) }}>
              {data.keyAchievements.map((ach, i) => (
                <div key={i} style={{ display: 'flex', gap: s(6), fontSize: s(9.2), color: '#334155', lineHeight: '1.4' }}>
                  <span style={{ color: accentColor, fontWeight: 'bold' }}>★</span>
                  <span>{ach}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Academic Sections */}
        <AcademicSections data={data} scale={scale} primaryColor={primaryColor} />

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <section style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            <h2 style={{ fontSize: s(11), fontWeight: 850, color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.06em', margin: `0 0 ${s(6)} 0`, borderBottom: `${s(1)} solid ${lineBorder}`, paddingBottom: s(3) }}>
              Education
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: s(6) }}>
              {data.education.map((edu, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: s(9.2) }}>
                  <div>
                    <strong style={{ color: primaryColor }}>{edu.degree}</strong> — {edu.institution}
                    {edu.distinction && <span style={{ display: 'block', color: '#64748b', fontSize: s(8), fontStyle: 'italic' }}>{edu.distinction}</span>}
                  </div>
                  {edu.endYear && <span style={{ fontSize: '9px', color: '#64748b', fontWeight: 600 }}>{edu.endYear}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <section style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            <h2 style={{ fontSize: s(11), fontWeight: 850, color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.06em', margin: `0 0 ${s(6)} 0`, borderBottom: `${s(1)} solid ${lineBorder}`, paddingBottom: s(3) }}>
              Certifications & Training
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: s(4) }}>
              {data.certifications.map((cert, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: s(9.2), color: '#334155' }}>
                  <span>✔ <strong>{cert.name}</strong> — {cert.issuer}</span>
                  {cert.year && <span style={{ fontSize: '9px', color: '#64748b', fontWeight: 600 }}>{cert.year}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Technical Skills */}
        {Object.keys(data.technicalSkills).length > 0 && (
          <section style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            <h2 style={{ fontSize: s(11), fontWeight: 850, color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.06em', margin: `0 0 ${s(6)} 0`, borderBottom: `${s(1)} solid ${lineBorder}`, paddingBottom: s(3) }}>
              Technical Skills & Competencies
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: s(4), fontSize: s(9) }}>
              {Object.entries(data.technicalSkills).map(([cat, skills], i) => (
                <div key={i}>
                  <strong style={{ color: primaryColor }}>{cat}:</strong> {Array.isArray(skills) ? skills.join(', ') : skills}
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* FOOTER */}
      <div style={{
        marginTop: s(28),
        paddingTop: s(8),
        borderTop: `${s(1)} solid ${lineBorder}`,
        fontSize: s(8),
        color: '#94a3b8',
        textAlign: 'center'
      }}>
        ATS Optimized Format — Generated via SOPHI AI Pro-CV
      </div>
    </div>
  )
}
