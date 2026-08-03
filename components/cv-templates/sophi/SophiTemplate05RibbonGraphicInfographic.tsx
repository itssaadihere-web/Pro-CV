import React from 'react'
import { CVTemplateProps } from '@/types/cv'
import { AcademicSections } from '../AcademicSections'

export default function SophiTemplate05RibbonGraphicInfographic({ data, scale = 1, colorTheme }: CVTemplateProps) {
  const s = (n: number) => `${n * scale}px`

  let yellowBanner = '#f59e0b' // Amber Gold Ribbon
  let blackHeader = '#000000'
  let darkSidebar = '#111827'

  if (colorTheme === 'blue' || colorTheme === 'navy' || colorTheme === 'royal') {
    yellowBanner = '#3b82f6'
    blackHeader = '#0f172a'
    darkSidebar = '#1e293b'
  } else if (colorTheme === 'purple' || colorTheme === 'violet') {
    yellowBanner = '#a855f7'
    blackHeader = '#1e1b4b'
    darkSidebar = '#2e1065'
  } else if (colorTheme === 'emerald' || colorTheme === 'green') {
    yellowBanner = '#10b981'
    blackHeader = '#064e3b'
    darkSidebar = '#022c22'
  } else if (colorTheme === 'coral' || colorTheme === 'red') {
    yellowBanner = '#f43f5e'
    blackHeader = '#881337'
    darkSidebar = '#4c0519'
  } else if (colorTheme === 'charcoal' || colorTheme === 'classic') {
    yellowBanner = '#71717a'
    blackHeader = '#18181b'
    darkSidebar = '#27272a'
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
      flexDirection: 'column',
      position: 'relative'
    }}>
      {/* TOP BLACK RIBBON HEADER WITH CIRCULAR AVATAR BADGE */}
      <div style={{
        backgroundColor: blackHeader,
        color: '#ffffff',
        padding: `${s(20)} ${s(36)}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: `${s(4)} solid ${yellowBanner}`
      }}>
        <div>
          <h1 style={{ fontSize: s(24), fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {data.fullName}
          </h1>
          <div style={{ fontSize: s(11), color: yellowBanner, fontWeight: 700, marginTop: s(3), textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {data.jobTitle}
          </div>
        </div>

        {/* Circular Avatar Circle */}
        <div style={{
          width: s(68),
          height: s(68),
          borderRadius: '50%',
          backgroundColor: yellowBanner,
          color: '#000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: s(22),
          fontWeight: 900,
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
          border: `${s(3)} solid #ffffff`
        }}>
          {data.fullName ? data.fullName.substring(0, 2).toUpperCase() : 'CV'}
        </div>
      </div>

      {/* BODY CONTENT - LEFT MAIN COLUMN + RIGHT DARK SIDEBAR */}
      <div style={{ display: 'flex', flex: 1 }}>
        
        {/* LEFT MAIN WHITE COLUMN (with Yellow Ribbon Headers) */}
        <div style={{
          flex: 1.6,
          padding: `${s(24)} ${s(32)}`,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: s(16)
        }}>
          {/* Contact Details Bar */}
          <div style={{ backgroundColor: '#f8fafc', padding: s(8), borderRadius: s(6), border: `${s(1)} solid #e2e8f0` }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: s(10), fontSize: s(8.5), color: '#475569', fontWeight: 600 }}>
              {data.email && <span>✉ {data.email}</span>}
              {data.phone && <span>☎ {data.phone}</span>}
              {data.location && <span>📍 {data.location}</span>}
              {data.linkedin && <span>🔗 {data.linkedin.replace(/https?:\/\/(www\.)?/, '')}</span>}
            </div>
          </div>

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <section style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
              <div style={{ backgroundColor: yellowBanner, color: '#000000', padding: `${s(4)} ${s(10)}`, fontWeight: 900, fontSize: s(10), textTransform: 'uppercase', letterSpacing: '0.06em', borderRadius: s(4), marginBottom: s(8), width: 'fit-content' }}>
                EDUCATION
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(8) }}>
                {data.education.map((edu, i) => (
                  <div key={i} style={{ fontSize: s(9), borderLeft: `${s(2.5)} solid ${blackHeader}`, paddingLeft: s(8) }}>
                    <strong style={{ color: blackHeader }}>{edu.degree}</strong>
                    <div style={{ color: '#475569' }}>{edu.institution} | {edu.endYear}</div>
                    {edu.distinction && <div style={{ color: '#64748b', fontSize: s(8) }}>{edu.distinction}</div>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Work Experience */}
          {data.experience && data.experience.length > 0 && (
            <section>
              <div style={{ backgroundColor: yellowBanner, color: '#000000', padding: `${s(4)} ${s(10)}`, fontWeight: 900, fontSize: s(10), textTransform: 'uppercase', letterSpacing: '0.06em', borderRadius: s(4), marginBottom: s(8), width: 'fit-content' }}>
                EXPERIENCE
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(12) }}>
                {data.experience.map((job, i) => (
                  <div key={i} style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: s(2) }}>
                      <strong style={{ fontSize: s(10.5), color: blackHeader }}>{job.title} — {job.company}</strong>
                      <span style={{ fontSize: s(8.5), color: yellowBanner, fontWeight: 800 }}>{job.startDate} – {job.endDate}</span>
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
          <AcademicSections data={data} scale={scale} primaryColor={blackHeader} />
        </div>

        {/* RIGHT DARK SIDEBAR */}
        <div style={{
          width: s(230),
          backgroundColor: darkSidebar,
          color: '#ffffff',
          padding: `${s(24)} ${s(18)}`,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: s(18),
          flexShrink: 0
        }}>
          {/* About Me */}
          {data.summary && (
            <div>
              <div style={{ backgroundColor: yellowBanner, color: '#000000', padding: `${s(3)} ${s(8)}`, fontWeight: 900, fontSize: s(9.5), textTransform: 'uppercase', letterSpacing: '0.06em', borderRadius: s(3), marginBottom: s(6), width: 'fit-content' }}>
                ABOUT ME
              </div>
              <p style={{ margin: 0, fontSize: s(8.8), color: '#d1d5db', lineHeight: '1.5', textAlign: 'justify' }}>
                {data.summary}
              </p>
            </div>
          )}

          {/* Skills */}
          {Object.keys(data.technicalSkills).length > 0 && (
            <div>
              <div style={{ backgroundColor: yellowBanner, color: '#000000', padding: `${s(3)} ${s(8)}`, fontWeight: 900, fontSize: s(9.5), textTransform: 'uppercase', letterSpacing: '0.06em', borderRadius: s(3), marginBottom: s(6), width: 'fit-content' }}>
                SKILLS
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(6) }}>
                {Object.entries(data.technicalSkills).map(([cat, skills], i) => (
                  <div key={i}>
                    <div style={{ fontSize: s(8), fontWeight: 750, color: yellowBanner, textTransform: 'uppercase', marginBottom: s(2) }}>{cat}</div>
                    <div style={{ fontSize: s(8), color: '#e5e7eb' }}>{Array.isArray(skills) ? skills.join(', ') : skills}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Core Competencies */}
          {data.coreCompetencies && data.coreCompetencies.length > 0 && (
            <div>
              <div style={{ backgroundColor: yellowBanner, color: '#000000', padding: `${s(3)} ${s(8)}`, fontWeight: 900, fontSize: s(9.5), textTransform: 'uppercase', letterSpacing: '0.06em', borderRadius: s(3), marginBottom: s(6), width: 'fit-content' }}>
                COMPETENCIES
              </div>
              <ul style={{ margin: 0, paddingLeft: s(12), fontSize: s(8.2), color: '#d1d5db' }}>
                {data.coreCompetencies.map((comp, i) => (
                  <li key={i} style={{ marginBottom: s(2) }}>{comp}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Certifications */}
          {data.certifications && data.certifications.length > 0 && (
            <div>
              <div style={{ backgroundColor: yellowBanner, color: '#000000', padding: `${s(3)} ${s(8)}`, fontWeight: 900, fontSize: s(9.5), textTransform: 'uppercase', letterSpacing: '0.06em', borderRadius: s(3), marginBottom: s(6), width: 'fit-content' }}>
                CERTIFICATIONS
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(4), fontSize: s(8), color: '#d1d5db' }}>
                {data.certifications.map((cert, i) => (
                  <div key={i}>
                    <strong>✔ {cert.name}</strong>
                    <div style={{ color: '#9ca3af', fontSize: s(7.5) }}>{cert.issuer} ({cert.year})</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
