import React from 'react'
import { CVTemplateProps } from '@/types/cv'
import { AcademicSections } from '../AcademicSections'

export default function SophiExecutiveSapphire({ data, scale = 1, colorTheme }: CVTemplateProps) {
  const s = (n: number) => `${n * scale}px`

  let primaryColor = '#1e3a8a'
  let accentColor = '#2563eb'
  let badgeBg = '#eff6ff'
  const secondaryBg = '#f8fafc'
  const cardBorder = '#e2e8f0'

  if (colorTheme === 'emerald' || colorTheme === 'green') {
    primaryColor = '#065f46'
    accentColor = '#059669'
    badgeBg = '#ecfdf5'
  } else if (colorTheme === 'purple') {
    primaryColor = '#581c87'
    accentColor = '#7c3aed'
    badgeBg = '#faf5ff'
  } else if (colorTheme === 'coral' || colorTheme === 'red') {
    primaryColor = '#9f1239'
    accentColor = '#e11d48'
    badgeBg = '#fff1f2'
  }

  return (
    <div style={{
      width: s(794),
      minHeight: s(1123),
      fontFamily: "'Inter', 'Arial', sans-serif",
      backgroundColor: '#ffffff',
      color: '#334155',
      padding: `${s(36)} ${s(40)}`,
      boxSizing: 'border-box',
      fontSize: s(10),
      lineHeight: '1.5',
      position: 'relative'
    }}>
      
      {/* HEADER BANNER */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: s(18),
        borderBottom: `${s(2.5)} solid ${primaryColor}`,
        marginBottom: s(18)
      }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: s(24), fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
            {data.fullName}
          </h1>
          <div style={{ fontSize: s(11.5), color: primaryColor, fontWeight: 800, marginTop: s(3), textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {data.jobTitle}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: s(12), fontSize: s(8.8), color: '#475569', marginTop: s(6) }}>
            {data.email && <span>✉ {data.email}</span>}
            {data.phone && <span>☎ {data.phone}</span>}
            {data.location && <span>📍 {data.location}</span>}
            {data.linkedin && <span>🔗 {data.linkedin.replace(/https?:\/\/(www\.)?/, '')}</span>}
            {data.website && <span>🌐 {data.website.replace(/https?:\/\/(www\.)?/, '')}</span>}
          </div>
        </div>

        {/* Initials Badge */}
        <div style={{
          width: s(64),
          height: s(64),
          borderRadius: s(12),
          backgroundColor: primaryColor,
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: s(20),
          fontWeight: 900,
          boxShadow: `0 4px 10px rgba(30, 58, 138, 0.2)`,
          flexShrink: 0,
          marginLeft: s(16)
        }}>
          {data.fullName ? data.fullName.substring(0, 2).toUpperCase() : 'CV'}
        </div>
      </div>

      {/* DUAL COLUMN SECTION */}
      <div style={{ display: 'flex', gap: s(22) }}>
        
        {/* LEFT COLUMN (Main Experience & Academic Work) */}
        <div style={{ flex: 1.7, display: 'flex', flexDirection: 'column', gap: s(14) }}>
          
          {/* Summary */}
          {data.summary && (
            <section style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: s(6) }}>
                <div style={{ width: s(4), height: s(14), backgroundColor: primaryColor, marginRight: s(8), borderRadius: s(2) }} />
                <h2 style={{ fontSize: s(11), fontWeight: 850, color: primaryColor, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Professional Profile
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
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: s(8) }}>
                <div style={{ width: s(4), height: s(14), backgroundColor: primaryColor, marginRight: s(8), borderRadius: s(2) }} />
                <h2 style={{ fontSize: s(11), fontWeight: 850, color: primaryColor, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Employment History
                </h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(12) }}>
                {data.experience.map((job, i) => (
                  <div key={i} style={{
                    position: 'relative',
                    borderLeft: `${s(2)} solid ${badgeBg}`,
                    paddingLeft: s(14),
                    marginLeft: s(4),
                    pageBreakInside: 'avoid',
                    breakInside: 'avoid'
                  }}>
                    <div style={{
                      position: 'absolute',
                      left: s(-5),
                      top: s(3),
                      width: s(8),
                      height: s(8),
                      borderRadius: '50%',
                      backgroundColor: primaryColor
                    }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: s(2) }}>
                      <strong style={{ fontSize: s(10.5), color: '#0f172a', fontWeight: 800 }}>{job.title}</strong>
                      <span style={{ fontSize: s(8.5), color: primaryColor, fontWeight: 700, backgroundColor: badgeBg, padding: `${s(1.5)} ${s(6)}`, borderRadius: s(4) }}>
                        {[job.startDate, job.endDate].filter(Boolean).join(' – ')}
                      </span>
                    </div>

                    <div style={{ fontSize: s(9.2), color: '#475569', fontWeight: 700, marginBottom: s(4) }}>
                      {job.company} {job.location ? `• ${job.location}` : ''}
                    </div>

                    <ul style={{ margin: 0, paddingLeft: s(12), fontSize: s(9), color: '#334155', listStyleType: 'square' }}>
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
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: s(6) }}>
                <div style={{ width: s(4), height: s(14), backgroundColor: primaryColor, marginRight: s(8), borderRadius: s(2) }} />
                <h2 style={{ fontSize: s(11), fontWeight: 850, color: primaryColor, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Key Achievements
                </h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(5), marginTop: s(4) }}>
                {data.keyAchievements.map((ach, i) => (
                  <div key={i} style={{ display: 'flex', gap: s(6), fontSize: s(9), color: '#334155', lineHeight: '1.4' }}>
                    <span style={{ color: primaryColor, fontWeight: 'bold' }}>✦</span>
                    <span>{ach}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Academic Sections (Publications, Presentations, Supervision, Workshops) */}
          <AcademicSections data={data} scale={scale} primaryColor={primaryColor} />
        </div>

        {/* RIGHT COLUMN (Sidebar: Competencies, Education, Certs, Languages) */}
        <div style={{
          width: s(220),
          backgroundColor: secondaryBg,
          borderRadius: s(10),
          border: `${s(1)} solid ${cardBorder}`,
          padding: `${s(16)} ${s(14)}`,
          display: 'flex',
          flexDirection: 'column',
          gap: s(14),
          boxSizing: 'border-box'
        }}>
          
          {/* Core Competencies */}
          {data.coreCompetencies && data.coreCompetencies.length > 0 && (
            <div>
              <h3 style={{ fontSize: s(9.5), fontWeight: 850, color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.05em', margin: `0 0 ${s(8)} 0`, borderBottom: `${s(1.5)} solid ${cardBorder}`, paddingBottom: s(3) }}>
                Core Competencies
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: s(4) }}>
                {data.coreCompetencies.map((comp, i) => (
                  <span key={i} style={{
                    padding: `${s(2.5)} ${s(6)}`,
                    backgroundColor: '#ffffff',
                    color: '#1e293b',
                    borderRadius: s(4),
                    fontSize: s(8),
                    fontWeight: 600,
                    border: `${s(0.5)} solid ${cardBorder}`
                  }}>
                    {comp}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Skills Breakdown */}
          {Object.keys(data.technicalSkills).length > 0 && (
            <div>
              <h3 style={{ fontSize: s(9.5), fontWeight: 850, color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.05em', margin: `0 0 ${s(8)} 0`, borderBottom: `${s(1.5)} solid ${cardBorder}`, paddingBottom: s(3) }}>
                Technical Expertise
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(8) }}>
                {Object.entries(data.technicalSkills).map(([cat, skills], i) => (
                  <div key={i}>
                    <div style={{ fontSize: s(8.2), fontWeight: 750, color: '#0f172a', marginBottom: s(3), textTransform: 'uppercase' }}>{cat}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: s(3) }}>
                      {skills.map((skill, idx) => (
                        <span key={idx} style={{
                          padding: `${s(2)} ${s(5)}`,
                          backgroundColor: '#ffffff',
                          color: '#475569',
                          borderRadius: s(4),
                          fontSize: s(7.8),
                          fontWeight: 500,
                          border: `${s(0.5)} solid ${cardBorder}`
                        }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <div>
              <h3 style={{ fontSize: s(9.5), fontWeight: 850, color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.05em', margin: `0 0 ${s(8)} 0`, borderBottom: `${s(1.5)} solid ${cardBorder}`, paddingBottom: s(3) }}>
                Education
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(8) }}>
                {data.education.map((edu, i) => (
                  <div key={i} style={{ fontSize: s(8.5) }}>
                    <strong style={{ color: '#0f172a' }}>{edu.degree}</strong>
                    <div style={{ color: '#475569' }}>{edu.institution}</div>
                    <div style={{ color: primaryColor, fontSize: s(7.8), fontWeight: 650 }}>{edu.endYear} {edu.distinction ? `| ${edu.distinction}` : ''}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {data.certifications && data.certifications.length > 0 && (
            <div>
              <h3 style={{ fontSize: s(9.5), fontWeight: 850, color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.05em', margin: `0 0 ${s(8)} 0`, borderBottom: `${s(1.5)} solid ${cardBorder}`, paddingBottom: s(3) }}>
                Certifications
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(5) }}>
                {data.certifications.map((cert, i) => (
                  <div key={i} style={{ fontSize: s(8.2), color: '#475569' }}>
                    <strong style={{ color: '#0f172a' }}>✔ {cert.name}</strong>
                    <div style={{ color: '#64748b', fontSize: s(7.5) }}>{cert.issuer} ({cert.year})</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <div>
              <h3 style={{ fontSize: s(9.5), fontWeight: 850, color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.05em', margin: `0 0 ${s(8)} 0`, borderBottom: `${s(1.5)} solid ${cardBorder}`, paddingBottom: s(3) }}>
                Languages
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(3), fontSize: s(8.5) }}>
                {data.languages.map((lang, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                    <strong>{lang.language}</strong>
                    <span style={{ color: primaryColor, fontWeight: 650 }}>{lang.level}</span>
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
        Executive Profile — Generated via SOPHI AI Pro-CV
      </div>
    </div>
  )
}
