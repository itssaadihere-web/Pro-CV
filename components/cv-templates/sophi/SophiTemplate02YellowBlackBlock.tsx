import React from 'react'
import { CVTemplateProps } from '@/types/cv'
import { AcademicSections } from '../AcademicSections'

export default function SophiTemplate02YellowBlackBlock({ data, scale = 1, colorTheme }: CVTemplateProps) {
  const s = (n: number) => `${n * scale}px`

  let yellowBg = '#facc15' // Default Vibrant Yellow/Gold
  let darkHeaderBg = '#18181b'
  let primaryColor = '#18181b'
  let sidebarTextColor = '#18181b'
  let skillBadgeBg = '#18181b'
  let skillBadgeText = '#ffffff'

  if (colorTheme === 'cyan' || colorTheme === 'teal') {
    yellowBg = '#06b6d4'
    darkHeaderBg = '#0f172a'
    primaryColor = '#0f172a'
    sidebarTextColor = '#ffffff'
    skillBadgeBg = '#ffffff'
    skillBadgeText = '#0f172a'
  } else if (colorTheme === 'blue' || colorTheme === 'navy' || colorTheme === 'royal') {
    yellowBg = '#2563eb'
    darkHeaderBg = '#0f172a'
    primaryColor = '#0f172a'
    sidebarTextColor = '#ffffff'
    skillBadgeBg = '#ffffff'
    skillBadgeText = '#1e293b'
  } else if (colorTheme === 'purple' || colorTheme === 'violet') {
    yellowBg = '#7c3aed'
    darkHeaderBg = '#1e1b4b'
    primaryColor = '#1e1b4b'
    sidebarTextColor = '#ffffff'
    skillBadgeBg = '#ffffff'
    skillBadgeText = '#1e293b'
  } else if (colorTheme === 'emerald' || colorTheme === 'green') {
    yellowBg = '#059669'
    darkHeaderBg = '#064e3b'
    primaryColor = '#064e3b'
    sidebarTextColor = '#ffffff'
    skillBadgeBg = '#ffffff'
    skillBadgeText = '#064e3b'
  } else if (colorTheme === 'coral' || colorTheme === 'red') {
    yellowBg = '#f43f5e'
    darkHeaderBg = '#881337'
    primaryColor = '#881337'
    sidebarTextColor = '#ffffff'
    skillBadgeBg = '#ffffff'
    skillBadgeText = '#881337'
  } else if (colorTheme === 'charcoal' || colorTheme === 'classic') {
    yellowBg = '#52525b'
    darkHeaderBg = '#18181b'
    primaryColor = '#18181b'
    sidebarTextColor = '#ffffff'
    skillBadgeBg = '#ffffff'
    skillBadgeText = '#18181b'
  }

  return (
    <div style={{
      width: s(794),
      minHeight: s(1123),
      fontFamily: "'Inter', 'Arial', sans-serif",
      backgroundColor: '#ffffff',
      color: '#18181b',
      boxSizing: 'border-box',
      fontSize: s(10),
      lineHeight: '1.5',
      position: 'relative'
    }}>
      {/* TOP HEADER BLOCK */}
      <div style={{ display: 'flex', width: '100%' }}>
        {/* Left Yellow Corner with Circular Avatar Box */}
        <div style={{
          width: s(220),
          backgroundColor: yellowBg,
          padding: `${s(20)} ${s(16)}`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexShrink: 0
        }}>
          <div style={{
            width: s(72),
            height: s(72),
            borderRadius: '50%',
            backgroundColor: '#18181b',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: s(24),
            fontWeight: 900,
            border: `${s(3)} solid #ffffff`,
            boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
          }}>
            {data.fullName ? data.fullName.substring(0, 2).toUpperCase() : 'CV'}
          </div>
        </div>

        {/* Right Dark Banner Header */}
        <div style={{
          flex: 1,
          backgroundColor: darkHeaderBg,
          color: '#ffffff',
          padding: `${s(20)} ${s(30)}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <h1 style={{ fontSize: s(24), fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            {data.fullName}
          </h1>
          <div style={{ fontSize: s(11), color: yellowBg, fontWeight: 700, marginTop: s(4), textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {data.jobTitle}
          </div>
        </div>
      </div>

      {/* BODY SECTION (Left Yellow Sidebar + Right White Column) */}
      <div style={{ display: 'flex', minHeight: s(980) }}>
        
        {/* LEFT SIDEBAR */}
        <div style={{
          width: s(220),
          backgroundColor: yellowBg,
          color: sidebarTextColor,
          padding: `${s(20)} ${s(16)}`,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: s(18),
          flexShrink: 0
        }}>
          {/* Profile Summary */}
          {data.summary && (
            <div>
              <h3 style={{ fontSize: s(10.5), fontWeight: 900, color: sidebarTextColor, textTransform: 'uppercase', letterSpacing: '0.08em', margin: `0 0 ${s(6)} 0`, borderBottom: `${s(2)} solid ${sidebarTextColor}`, paddingBottom: s(3) }}>
                Profile
              </h3>
              <p style={{ margin: 0, fontSize: s(8.8), color: sidebarTextColor, lineHeight: '1.5', textAlign: 'justify', opacity: 0.9 }}>
                {data.summary}
              </p>
            </div>
          )}

          {/* Contact */}
          <div>
            <h3 style={{ fontSize: s(10.5), fontWeight: 900, color: sidebarTextColor, textTransform: 'uppercase', letterSpacing: '0.08em', margin: `0 0 ${s(6)} 0`, borderBottom: `${s(2)} solid ${sidebarTextColor}`, paddingBottom: s(3) }}>
              Contact
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: s(6), fontSize: s(8.5), color: sidebarTextColor, wordBreak: 'break-all', fontWeight: 600 }}>
              {data.email && <div>✉ {data.email}</div>}
              {data.phone && <div>☎ {data.phone}</div>}
              {data.location && <div>📍 {data.location}</div>}
              {data.linkedin && <div>🔗 {data.linkedin.replace(/https?:\/\/(www\.)?/, '')}</div>}
            </div>
          </div>

          {/* Skills */}
          {Object.keys(data.technicalSkills).length > 0 && (
            <div>
              <h3 style={{ fontSize: s(10.5), fontWeight: 900, color: sidebarTextColor, textTransform: 'uppercase', letterSpacing: '0.08em', margin: `0 0 ${s(6)} 0`, borderBottom: `${s(2)} solid ${sidebarTextColor}`, paddingBottom: s(3) }}>
                Skills
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(8) }}>
                {Object.entries(data.technicalSkills).map(([cat, skills], i) => (
                  <div key={i}>
                    <div style={{ fontSize: s(8), fontWeight: 800, color: sidebarTextColor, textTransform: 'uppercase', marginBottom: s(2) }}>{cat}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: s(3) }}>
                      {skills.map((skill, idx) => (
                        <span key={idx} style={{
                          padding: `${s(2)} ${s(5)}`,
                          backgroundColor: skillBadgeBg,
                          color: skillBadgeText,
                          borderRadius: s(3),
                          fontSize: s(7.8),
                          fontWeight: 600
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

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <div>
              <h3 style={{ fontSize: s(10.5), fontWeight: 900, color: '#18181b', textTransform: 'uppercase', letterSpacing: '0.08em', margin: `0 0 ${s(6)} 0`, borderBottom: `${s(2)} solid #18181b`, paddingBottom: s(3) }}>
                Languages
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(4), fontSize: s(8.5), color: '#18181b', fontWeight: 650 }}>
                {data.languages.map((lang, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{lang.language}</span>
                    <span style={{ opacity: 0.8 }}>{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT WHITE MAIN COLUMN */}
        <div style={{
          flex: 1,
          padding: `${s(24)} ${s(32)}`,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: s(16)
        }}>
          {/* Professional Experience */}
          {data.experience && data.experience.length > 0 && (
            <section>
              <h2 style={{ fontSize: s(11), fontWeight: 900, color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.06em', margin: `0 0 ${s(8)} 0`, borderBottom: `${s(2)} solid ${primaryColor}`, paddingBottom: s(3) }}>
                Professional Experience
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(12) }}>
                {data.experience.map((job, i) => (
                  <div key={i} style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: s(2) }}>
                      <strong style={{ fontSize: s(10.5), color: primaryColor, textTransform: 'uppercase' }}>{job.title} | {job.company}</strong>
                      {(job.startDate || job.endDate) && <span style={{ fontSize: s(8.5), color: '#52525b', fontWeight: 700 }}>{[job.startDate, job.endDate].filter(Boolean).join(' – ')}</span>}
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
          <AcademicSections data={data} scale={scale} primaryColor={primaryColor} />

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <section style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
              <h2 style={{ fontSize: s(11), fontWeight: 900, color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.06em', margin: `0 0 ${s(8)} 0`, borderBottom: `${s(2)} solid ${primaryColor}`, paddingBottom: s(3) }}>
                Education
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(8) }}>
                {data.education.map((edu, i) => (
                  <div key={i} style={{ fontSize: s(9.2), borderLeft: `${s(3)} solid ${yellowBg}`, paddingLeft: s(8) }}>
                    <strong style={{ color: primaryColor, textTransform: 'uppercase' }}>{edu.degree} | {edu.endYear}</strong>
                    <div style={{ color: '#52525b' }}>{edu.institution}</div>
                    {edu.distinction && <div style={{ color: '#71717a', fontSize: s(8) }}>{edu.distinction}</div>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Key Achievements */}
          {data.keyAchievements && data.keyAchievements.length > 0 && (
            <section style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
              <h2 style={{ fontSize: s(11), fontWeight: 900, color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.06em', margin: `0 0 ${s(6)} 0`, borderBottom: `${s(2)} solid ${primaryColor}`, paddingBottom: s(3) }}>
                Key Achievements
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(4) }}>
                {data.keyAchievements.map((ach, i) => (
                  <div key={i} style={{ display: 'flex', gap: s(6), fontSize: s(9), color: '#334155', lineHeight: '1.4' }}>
                    <span style={{ color: primaryColor, fontWeight: 'bold' }}>✦</span>
                    <span>{ach}</span>
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
