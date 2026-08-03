import React from 'react'
import { CVTemplateProps } from '@/types/cv'
import { AcademicSections } from '../AcademicSections'

export default function SophiTemplate03GoldCharcoalGeometric({ data, scale = 1, colorTheme }: CVTemplateProps) {
  const s = (n: number) => `${n * scale}px`

  let goldAccent = '#d97706' // Warm Amber Gold
  let darkSidebar = '#111827' // Dark Charcoal
  let primaryColor = '#1f2937'

  if (colorTheme === 'blue' || colorTheme === 'navy' || colorTheme === 'royal') {
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
    goldAccent = '#3f3f46'
    darkSidebar = '#18181b'
    primaryColor = '#18181b'
  }

  return (
    <div style={{
      width: s(794),
      minHeight: s(1123),
      fontFamily: "'Inter', 'Arial', sans-serif",
      backgroundColor: '#ffffff',
      color: '#1f2937',
      boxSizing: 'border-box',
      fontSize: s(10),
      lineHeight: '1.5',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}>
      {/* TOP GEOMETRIC HEADER */}
      <div style={{ display: 'flex', width: '100%', height: s(110) }}>
        {/* Top Left Diagonal Gold Corner */}
        <div style={{
          width: s(260),
          backgroundColor: darkSidebar,
          padding: `${s(16)} ${s(20)}`,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          gap: s(14),
          borderRight: `${s(4)} solid ${goldAccent}`,
          flexShrink: 0
        }}>
          <div style={{
            width: s(64),
            height: s(64),
            borderRadius: s(16),
            backgroundColor: goldAccent,
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: s(22),
            fontWeight: 900,
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
          }}>
            {data.fullName ? data.fullName.substring(0, 2).toUpperCase() : 'CV'}
          </div>
        </div>

        {/* Top Right Header Banner */}
        <div style={{
          flex: 1,
          backgroundColor: '#f3f4f6',
          padding: `${s(20)} ${s(30)}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          borderBottom: `${s(3)} solid ${goldAccent}`
        }}>
          <h1 style={{ fontSize: s(22), fontWeight: 900, color: goldAccent, margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {data.fullName}
          </h1>
          <div style={{ fontSize: s(11), color: primaryColor, fontWeight: 700, marginTop: s(2), textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {data.jobTitle}
          </div>
        </div>
      </div>

      {/* BODY CONTENT */}
      <div style={{ display: 'flex', flex: 1 }}>
        
        {/* LEFT CHARCOAL SIDEBAR */}
        <div style={{
          width: s(260),
          backgroundColor: darkSidebar,
          color: '#ffffff',
          padding: `${s(24)} ${s(20)}`,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: s(18),
          flexShrink: 0
        }}>
          {/* Contact */}
          <div>
            <h3 style={{ fontSize: s(10.5), fontWeight: 850, color: goldAccent, textTransform: 'uppercase', letterSpacing: '0.08em', margin: `0 0 ${s(8)} 0`, borderBottom: '1px dashed #374151', paddingBottom: s(3) }}>
              Contact Me
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: s(8), fontSize: s(8.5), color: '#d1d5db', wordBreak: 'break-all' }}>
              {data.email && <div>✉ {data.email}</div>}
              {data.phone && <div>☎ {data.phone}</div>}
              {data.location && <div>📍 {data.location}</div>}
              {data.linkedin && <div>🔗 {data.linkedin.replace(/https?:\/\/(www\.)?/, '')}</div>}
            </div>
          </div>

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <div>
              <h3 style={{ fontSize: s(10.5), fontWeight: 850, color: goldAccent, textTransform: 'uppercase', letterSpacing: '0.08em', margin: `0 0 ${s(8)} 0`, borderBottom: '1px dashed #374151', paddingBottom: s(3) }}>
                Education
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(8) }}>
                {data.education.map((edu, i) => (
                  <div key={i} style={{ fontSize: s(8.5) }}>
                    <strong style={{ color: '#ffffff' }}>{edu.degree}</strong>
                    <div style={{ color: '#9ca3af' }}>{edu.institution}</div>
                    <div style={{ color: goldAccent, fontSize: s(7.8), fontWeight: 600 }}>{edu.endYear}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {data.certifications && data.certifications.length > 0 && (
            <div>
              <h3 style={{ fontSize: s(10.5), fontWeight: 850, color: goldAccent, textTransform: 'uppercase', letterSpacing: '0.08em', margin: `0 0 ${s(8)} 0`, borderBottom: '1px dashed #374151', paddingBottom: s(3) }}>
                Certifications
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(4), fontSize: s(8.2), color: '#d1d5db' }}>
                {data.certifications.map((cert, i) => (
                  <div key={i}>
                    <strong>✔ {cert.name}</strong>
                    <div style={{ color: '#9ca3af', fontSize: s(7.5) }}>{cert.issuer} ({cert.year})</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <div>
              <h3 style={{ fontSize: s(10.5), fontWeight: 850, color: goldAccent, textTransform: 'uppercase', letterSpacing: '0.08em', margin: `0 0 ${s(8)} 0`, borderBottom: '1px dashed #374151', paddingBottom: s(3) }}>
                Languages
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(4), fontSize: s(8.5), color: '#d1d5db' }}>
                {data.languages.map((lang, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{lang.language}</span>
                    <span style={{ color: goldAccent, fontWeight: 650 }}>{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT MAIN WHITE COLUMN */}
        <div style={{
          flex: 1,
          padding: `${s(24)} ${s(32)}`,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: s(16)
        }}>
          {/* Summary */}
          {data.summary && (
            <section style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: s(6), marginBottom: s(6) }}>
                <div style={{ width: s(8), height: s(8), backgroundColor: goldAccent, borderRadius: '50%' }} />
                <h2 style={{ fontSize: s(11), fontWeight: 850, color: primaryColor, margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  About Me
                </h2>
              </div>
              <p style={{ margin: 0, fontSize: s(9.4), color: '#374151', lineHeight: '1.6', textAlign: 'justify' }}>
                {data.summary}
              </p>
            </section>
          )}

          {/* Work Experience */}
          {data.experience && data.experience.length > 0 && (
            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: s(6), marginBottom: s(8) }}>
                <div style={{ width: s(8), height: s(8), backgroundColor: goldAccent, borderRadius: '50%' }} />
                <h2 style={{ fontSize: s(11), fontWeight: 850, color: primaryColor, margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Job Experience
                </h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(12) }}>
                {data.experience.map((job, i) => (
                  <div key={i} style={{ pageBreakInside: 'avoid', breakInside: 'avoid', borderLeft: `${s(2)} solid ${goldAccent}`, paddingLeft: s(12), marginLeft: s(3) }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: s(2) }}>
                      <strong style={{ fontSize: s(10.5), color: primaryColor }}>{job.title}</strong>
                      <span style={{ fontSize: s(8.5), color: goldAccent, fontWeight: 700 }}>{job.startDate} – {job.endDate}</span>
                    </div>
                    <div style={{ fontSize: s(9.2), color: '#6b7280', fontStyle: 'italic', marginBottom: s(4) }}>
                      {job.company} {job.location ? `| ${job.location}` : ''}
                    </div>
                    <ul style={{ margin: 0, paddingLeft: s(12), fontSize: s(9), color: '#374151', listStyleType: 'disc' }}>
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

          {/* Skills Bars */}
          {Object.keys(data.technicalSkills).length > 0 && (
            <section style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: s(6), marginBottom: s(6) }}>
                <div style={{ width: s(8), height: s(8), backgroundColor: goldAccent, borderRadius: '50%' }} />
                <h2 style={{ fontSize: s(11), fontWeight: 850, color: primaryColor, margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Skills & Technical Tools
                </h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(6) }}>
                {Object.entries(data.technicalSkills).map(([cat, skills], i) => (
                  <div key={i}>
                    <div style={{ fontSize: s(8.5), fontWeight: 750, color: primaryColor, textTransform: 'uppercase', marginBottom: s(2) }}>{cat}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: s(4) }}>
                      {skills.map((skill, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: s(4), backgroundColor: '#f3f4f6', padding: `${s(3)} ${s(8)}`, borderRadius: s(4) }}>
                          <span style={{ fontSize: s(8), fontWeight: 600, color: '#1f2937' }}>{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

      </div>
    </div>
  )
}
