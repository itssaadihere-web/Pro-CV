import { CVTemplateProps } from '@/types/cv'
import { AcademicSections } from '../AcademicSections'

const SectionHeader = ({ label, scale, primaryColor = '#0f766e' }: { label: string; scale: number; primaryColor?: string }) => {
  const s = (n: number) => `${n * scale}px`

  return (
    <div style={{ marginBottom: s(10), marginTop: s(14) }}>
      <h2 style={{ fontSize: s(11), fontWeight: 850, color: primaryColor, margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</h2>
      <div style={{ height: s(2), background: `linear-gradient(90deg, ${primaryColor} 0%, rgba(0, 0, 0, 0.05) 100%)`, marginTop: s(4), borderRadius: s(1) }} />
    </div>
  )
}

export default function M38CreativeEmeraldInfographic({ data, scale = 1, colorTheme }: CVTemplateProps) {
  const s = (n: number) => `${n * scale}px`

  let primaryColor = '#0f766e' // Emerald / Teal
  let textAccent = '#0d9488'
  let secondaryBg = '#f0fdfa'
  let cardBorder = '#ccfbf1'
  let badgeBg = '#ccfbf1'
  let badgeText = '#115e59'
  let headerGradient = 'linear-gradient(135deg, #042f2e 0%, #0f766e 60%, #14b8a6 100%)'

  if (colorTheme === 'blue') {
    primaryColor = '#1d4ed8'
    textAccent = '#2563eb'
    secondaryBg = '#eff6ff'
    cardBorder = '#dbeafe'
    badgeBg = '#dbeafe'
    badgeText = '#1e40af'
    headerGradient = 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 60%, #3b82f6 100%)'
  } else if (colorTheme === 'gold') {
    primaryColor = '#b45309'
    textAccent = '#d97706'
    secondaryBg = '#fefdf0'
    cardBorder = '#fef3c7'
    badgeBg = '#fef3c7'
    badgeText = '#92400e'
    headerGradient = 'linear-gradient(135deg, #451a03 0%, #b45309 60%, #d97706 100%)'
  } else if (colorTheme === 'purple') {
    primaryColor = '#6d28d9'
    textAccent = '#7c3aed'
    secondaryBg = '#faf5ff'
    cardBorder = '#ddd6fe'
    badgeBg = '#ede9fe'
    badgeText = '#5b21b6'
    headerGradient = 'linear-gradient(135deg, #2e1065 0%, #6d28d9 60%, #8b5cf6 100%)'
  }

  return (
    <div style={{
      width: s(794),
      minHeight: s(1123),
      fontFamily: "'Inter', 'Segoe UI', 'Arial', sans-serif",
      backgroundColor: '#ffffff',
      color: '#1e293b',
      padding: `${s(36)} ${s(40)}`,
      boxSizing: 'border-box',
      fontSize: s(10.5),
      lineHeight: '1.5',
      position: 'relative'
    }}>
      
      {/* EMERALD CREATIVE BANNER */}
      <div style={{
        background: headerGradient,
        color: '#ffffff',
        borderRadius: s(10),
        padding: `${s(24)} ${s(28)}`,
        marginBottom: s(18),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: s(20),
        boxShadow: '0 8px 12px -2px rgba(0, 0, 0, 0.08)'
      }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: s(23), fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>{data.fullName}</h1>
          <div style={{ fontSize: s(11.5), color: '#a7f3d0', marginTop: s(4), fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            {data.jobTitle}
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: `${s(5)} ${s(14)}`, fontSize: s(9), color: '#ccfbf1', marginTop: s(12) }}>
            {data.email && <div>✉ {data.email}</div>}
            {data.phone && <div>☎ {data.phone}</div>}
            {data.location && <div>📍 {data.location}</div>}
            {data.linkedin && <div>🔗 {data.linkedin.replace(/https?:\/\/(www\.)?/, '')}</div>}
          </div>
        </div>

        <div style={{
          width: s(68),
          height: s(68),
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          border: `${s(1.5)} solid rgba(255, 255, 255, 0.3)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontSize: s(22),
          fontWeight: 850,
          flexShrink: 0
        }}>
          {data.fullName ? data.fullName.substring(0, 2).toUpperCase() : 'CV'}
        </div>
      </div>

      {/* SUMMARY */}
      {data.summary && (
        <section style={{
          backgroundColor: secondaryBg,
          borderLeft: `${s(3.5)} solid ${primaryColor}`,
          padding: `${s(10)} ${s(14)}`,
          borderRadius: `0 ${s(6)} ${s(6)} 0`,
          marginBottom: s(16)
        }}>
          <p style={{ margin: 0, fontSize: s(9.6), color: '#1e293b', lineHeight: '1.55', textAlign: 'justify', fontWeight: 500 }}>
            {data.summary}
          </p>
        </section>
      )}

      {/* TWO COLUMN GRID */}
      <div style={{ display: 'flex', gap: s(24) }}>
        
        {/* LEFT COLUMN: Experience */}
        <div style={{ flex: 1.8, display: 'flex', flexDirection: 'column', gap: s(14) }}>
          {data.experience && data.experience.length > 0 && (
            <section>
              <SectionHeader label="Work History" scale={scale} primaryColor={primaryColor} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(12), marginTop: s(8) }}>
                {data.experience.map((job, i) => (
                  <div key={i} style={{ position: 'relative', borderLeft: `${s(2)} solid ${cardBorder}`, paddingLeft: s(14), marginLeft: s(4) }}>
                    <div style={{
                      position: 'absolute',
                      left: s(-5),
                      top: s(2),
                      width: s(8),
                      height: s(8),
                      borderRadius: '50%',
                      backgroundColor: primaryColor,
                      border: `${s(1.5)} solid #ffffff`
                    }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: s(2) }}>
                      <strong style={{ fontSize: s(10.5), color: primaryColor, fontWeight: 800 }}>{job.title}</strong>
                      <span style={{ fontSize: s(8.5), color: '#64748b', fontWeight: 600 }}>{job.startDate} – {job.endDate}</span>
                    </div>

                    <div style={{ fontSize: s(9.2), color: textAccent, fontWeight: 700, marginBottom: s(4) }}>
                      {job.company} {job.location ? `| ${job.location}` : ''}
                    </div>

                    <ul style={{ margin: 0, paddingLeft: s(12), fontSize: s(9), color: '#334155', listStyleType: 'disc' }}>
                      {job.bullets.map((bullet, idx) => (
                        <li key={idx} style={{ marginBottom: s(2.5), lineHeight: '1.4' }}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.keyAchievements && data.keyAchievements.length > 0 && (
            <section>
              <SectionHeader label="Key Achievements" scale={scale} primaryColor={primaryColor} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(6), marginTop: s(8) }}>
                {data.keyAchievements.map((ach, i) => (
                  <div key={i} style={{ display: 'flex', gap: s(8), fontSize: s(9), color: '#334155', lineHeight: '1.4' }}>
                    <span style={{ color: primaryColor, fontWeight: 'bold' }}>✦</span>
                    <span>{ach}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Academic Sections */}
          <AcademicSections data={data} scale={scale} primaryColor={primaryColor} />
        </div>

        {/* RIGHT COLUMN: Skills, Education, Certs */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: s(14) }}>
          
          {Object.keys(data.technicalSkills).length > 0 && (
            <section>
              <SectionHeader label="Skills & Expertise" scale={scale} primaryColor={primaryColor} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(8), marginTop: s(8) }}>
                {Object.entries(data.technicalSkills).map(([cat, skills], i) => (
                  <div key={i} style={{ backgroundColor: secondaryBg, padding: s(8), borderRadius: s(6), border: `${s(0.5)} solid ${cardBorder}` }}>
                    <div style={{ fontSize: s(8.5), fontWeight: 750, color: primaryColor, marginBottom: s(4), textTransform: 'uppercase' }}>{cat}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: s(4) }}>
                      {skills.map((skill, idx) => (
                        <span key={idx} style={{
                          padding: `${s(2)} ${s(5)}`,
                          backgroundColor: '#ffffff',
                          color: badgeText,
                          borderRadius: s(4),
                          fontSize: s(8),
                          fontWeight: 650,
                          border: `${s(0.5)} solid ${cardBorder}`
                        }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.education && data.education.length > 0 && (
            <section>
              <SectionHeader label="Education" scale={scale} primaryColor={primaryColor} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(8), marginTop: s(8) }}>
                {data.education.map((edu, i) => (
                  <div key={i} style={{ fontSize: s(9) }}>
                    <strong style={{ color: primaryColor, fontSize: s(9.5) }}>{edu.degree}</strong>
                    <div style={{ color: '#334155', fontWeight: 500 }}>{edu.institution}</div>
                    <div style={{ color: '#64748b', fontSize: s(8) }}>{edu.startYear} - {edu.endYear}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.certifications && data.certifications.length > 0 && (
            <section>
              <SectionHeader label="Certifications" scale={scale} primaryColor={primaryColor} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(4), marginTop: s(8) }}>
                {data.certifications.map((cert, i) => (
                  <div key={i} style={{ fontSize: s(8.5), color: '#334155', paddingBottom: s(3), borderBottom: `${s(0.5)} solid ${cardBorder}` }}>
                    <strong style={{ color: primaryColor }}>{cert.name}</strong>
                    <div style={{ color: '#64748b', fontSize: s(7.8) }}>{cert.issuer} ({cert.year})</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.languages && data.languages.length > 0 && (
            <section>
              <SectionHeader label="Languages" scale={scale} primaryColor={primaryColor} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(3), fontSize: s(8.8), marginTop: s(8) }}>
                {data.languages.map((lang, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', color: '#334155' }}>
                    <strong>{lang.language}</strong>
                    <span style={{ color: textAccent, fontWeight: 600 }}>{lang.level}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>

      </div>

      <div style={{
        marginTop: s(28),
        paddingTop: s(8),
        borderTop: `${s(1)} solid ${cardBorder}`,
        fontSize: s(8.5),
        color: '#94a3b8',
        textAlign: 'center'
      }}>
        Generated via Pro-CV Professional Engine
      </div>
    </div>
  )
}
