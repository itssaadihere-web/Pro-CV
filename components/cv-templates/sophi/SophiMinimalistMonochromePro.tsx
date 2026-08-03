import React from 'react'
import { CVTemplateProps } from '@/types/cv'
import { AcademicSections } from '../AcademicSections'

export default function SophiMinimalistMonochromePro({ data, scale = 1 }: CVTemplateProps) {
  const s = (n: number) => `${n * scale}px`

  const primaryColor = '#000000'
  const accentColor = '#3f3f46'
  const lineBorder = '#d4d4d8'

  return (
    <div style={{
      width: s(794),
      minHeight: s(1123),
      fontFamily: "'Georgia', 'Inter', 'Times New Roman', serif",
      backgroundColor: '#ffffff',
      color: '#18181b',
      padding: `${s(42)} ${s(50)}`,
      boxSizing: 'border-box',
      fontSize: s(10),
      lineHeight: '1.5',
      position: 'relative'
    }}>
      
      {/* HEADER SECTION (Classic Executive Serif) */}
      <div style={{ borderBottom: `${s(2)} solid ${primaryColor}`, paddingBottom: s(14), marginBottom: s(20) }}>
        <h1 style={{ fontSize: s(26), fontWeight: 700, color: primaryColor, margin: 0, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
          {data.fullName}
        </h1>
        <div style={{ fontSize: s(12), fontFamily: "'Inter', sans-serif", fontWeight: 700, color: accentColor, marginTop: s(3), textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {data.jobTitle}
        </div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: s(14), fontSize: s(8.8), fontFamily: "'Inter', sans-serif", color: '#52525b', marginTop: s(10), fontWeight: 500 }}>
          {data.email && <span>✉ {data.email}</span>}
          {data.phone && <span>☎ {data.phone}</span>}
          {data.location && <span>📍 {data.location}</span>}
          {data.linkedin && <span>🔗 {data.linkedin.replace(/https?:\/\/(www\.)?/, '')}</span>}
          {data.website && <span>🌐 {data.website.replace(/https?:\/\/(www\.)?/, '')}</span>}
        </div>
      </div>

      {/* BODY CONTENT */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: s(16) }}>
        
        {/* Summary */}
        {data.summary && (
          <section style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            <h2 style={{ fontSize: s(11), fontFamily: "'Inter', sans-serif", fontWeight: 800, color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.08em', margin: `0 0 ${s(6)} 0`, borderBottom: `${s(1)} solid ${lineBorder}`, paddingBottom: s(3) }}>
              Professional Profile
            </h2>
            <p style={{ margin: 0, fontSize: s(9.6), color: '#27272a', lineHeight: '1.65', textAlign: 'justify' }}>
              {data.summary}
            </p>
          </section>
        )}

        {/* Core Competencies */}
        {data.coreCompetencies && data.coreCompetencies.length > 0 && (
          <section style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            <h2 style={{ fontSize: s(11), fontFamily: "'Inter', sans-serif", fontWeight: 800, color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.08em', margin: `0 0 ${s(6)} 0`, borderBottom: `${s(1)} solid ${lineBorder}`, paddingBottom: s(3) }}>
              Core Competencies
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: s(6), fontFamily: "'Inter', sans-serif" }}>
              {data.coreCompetencies.map((comp, i) => (
                <span key={i} style={{ fontSize: s(9), color: '#18181b', fontWeight: 600 }}>
                  ▪ {comp} {i < data.coreCompetencies.length - 1 ? '  ' : ''}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <section>
            <h2 style={{ fontSize: s(11), fontFamily: "'Inter', sans-serif", fontWeight: 800, color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.08em', margin: `0 0 ${s(10)} 0`, borderBottom: `${s(1)} solid ${lineBorder}`, paddingBottom: s(3) }}>
              Professional Experience
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: s(14) }}>
              {data.experience.map((job, i) => (
                <div key={i} style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: s(2) }}>
                    <strong style={{ fontSize: s(11), color: primaryColor, fontFamily: "'Inter', sans-serif" }}>{job.title}</strong>
                    <span style={{ fontSize: s(9), fontFamily: "'Inter', sans-serif", color: '#52525b', fontWeight: 700 }}>{job.startDate} – {job.endDate}</span>
                  </div>
                  <div style={{ fontSize: s(9.8), color: '#27272a', fontWeight: 600, fontStyle: 'italic', marginBottom: s(4) }}>
                    {job.company} {job.location ? `| ${job.location}` : ''}
                  </div>
                  <ul style={{ margin: 0, paddingLeft: s(16), fontSize: s(9.2), color: '#27272a', listStyleType: 'square' }}>
                    {job.bullets.map((bullet, idx) => (
                      <li key={idx} style={{ marginBottom: s(2.5), lineHeight: '1.5' }}>{bullet}</li>
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
            <h2 style={{ fontSize: s(11), fontFamily: "'Inter', sans-serif", fontWeight: 800, color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.08em', margin: `0 0 ${s(6)} 0`, borderBottom: `${s(1)} solid ${lineBorder}`, paddingBottom: s(3) }}>
              Key Achievements
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: s(4), marginTop: s(4) }}>
              {data.keyAchievements.map((ach, i) => (
                <div key={i} style={{ display: 'flex', gap: s(8), fontSize: s(9.2), color: '#27272a', lineHeight: '1.45' }}>
                  <span style={{ color: primaryColor, fontWeight: 'bold' }}>◆</span>
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
            <h2 style={{ fontSize: s(11), fontFamily: "'Inter', sans-serif", fontWeight: 800, color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.08em', margin: `0 0 ${s(6)} 0`, borderBottom: `${s(1)} solid ${lineBorder}`, paddingBottom: s(3) }}>
              Education
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: s(6) }}>
              {data.education.map((edu, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: s(9.2) }}>
                  <div>
                    <strong style={{ color: primaryColor, fontFamily: "'Inter', sans-serif" }}>{edu.degree}</strong> — {edu.institution}
                    {edu.distinction && <span style={{ display: 'block', color: '#52525b', fontSize: s(8.2), fontStyle: 'italic' }}>{edu.distinction}</span>}
                  </div>
                  <span style={{ color: '#52525b', fontWeight: 650, fontFamily: "'Inter', sans-serif" }}>{edu.endYear}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <section style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            <h2 style={{ fontSize: s(11), fontFamily: "'Inter', sans-serif", fontWeight: 800, color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.08em', margin: `0 0 ${s(6)} 0`, borderBottom: `${s(1)} solid ${lineBorder}`, paddingBottom: s(3) }}>
              Certifications & Training
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: s(4) }}>
              {data.certifications.map((cert, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: s(9.2), color: '#27272a' }}>
                  <span>✔ <strong>{cert.name}</strong> — {cert.issuer}</span>
                  <span style={{ color: '#52525b', fontWeight: 650, fontFamily: "'Inter', sans-serif" }}>{cert.year}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Technical Skills */}
        {Object.keys(data.technicalSkills).length > 0 && (
          <section style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            <h2 style={{ fontSize: s(11), fontFamily: "'Inter', sans-serif", fontWeight: 800, color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.08em', margin: `0 0 ${s(6)} 0`, borderBottom: `${s(1)} solid ${lineBorder}`, paddingBottom: s(3) }}>
              Skills & Technical Expertise
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: s(4), fontSize: s(9), fontFamily: "'Inter', sans-serif" }}>
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
        fontFamily: "'Inter', sans-serif",
        color: '#a1a1aa',
        textAlign: 'center'
      }}>
        Executive Monochrome — Generated via SOPHI AI Pro-CV
      </div>
    </div>
  )
}
