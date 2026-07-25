import { CVTemplateProps } from '@/types/cv'

const SectionHeader = ({ label, scale, primaryColor = '#1e3a8a', icon = '✦' }: { label: string; scale: number; primaryColor?: string; icon?: string }) => {
  const s = (n: number) => `${n * scale}px`

  return (
    <div style={{ marginBottom: s(12), marginTop: s(16), display: 'flex', alignItems: 'center', gap: s(8), borderBottom: `${s(2)} solid ${primaryColor}`, paddingBottom: s(4) }}>
      <span style={{ color: primaryColor, fontSize: s(12), fontWeight: 'bold' }}>{icon}</span>
      <h2 style={{ fontSize: s(11.5), fontWeight: 850, color: primaryColor, margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</h2>
    </div>
  )
}

export default function M37CreativeSapphireExecutive({ data, scale = 1, colorTheme }: CVTemplateProps) {
  const s = (n: number) => `${n * scale}px`

  let primaryColor = '#1e3a8a' // Navy Sapphire
  let textAccent = '#2563eb'
  let secondaryBg = '#f0f7ff'
  let cardBorder = '#dbeafe'
  let badgeBg = '#dbeafe'
  let badgeText = '#1e40af'
  let headerGradient = 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #3b82f6 100%)'

  if (colorTheme === 'gold') {
    primaryColor = '#78350f'
    textAccent = '#d97706'
    secondaryBg = '#fefdf0'
    cardBorder = '#fef3c7'
    badgeBg = '#fef3c7'
    badgeText = '#92400e'
    headerGradient = 'linear-gradient(135deg, #451a03 0%, #78350f 60%, #d97706 100%)'
  } else if (colorTheme === 'purple') {
    primaryColor = '#4c1d95'
    textAccent = '#7c3aed'
    secondaryBg = '#f5f3ff'
    cardBorder = '#ddd6fe'
    badgeBg = '#ede9fe'
    badgeText = '#5b21b6'
    headerGradient = 'linear-gradient(135deg, #2e1065 0%, #4c1d95 60%, #8b5cf6 100%)'
  } else if (colorTheme === 'teal') {
    primaryColor = '#0f766e'
    textAccent = '#0d9488'
    secondaryBg = '#f0fdfa'
    cardBorder = '#ccfbf1'
    badgeBg = '#ccfbf1'
    badgeText = '#115e59'
    headerGradient = 'linear-gradient(135deg, #042f2e 0%, #0f766e 60%, #14b8a6 100%)'
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
      
      {/* CREATIVE EXECUTIVE HEADER */}
      <div style={{
        background: headerGradient,
        color: '#ffffff',
        borderRadius: s(12),
        padding: `${s(26)} ${s(30)}`,
        marginBottom: s(20),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: s(20),
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.15)', padding: `${s(3)} ${s(10)}`, borderRadius: s(20), fontSize: s(8.5), fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: s(6) }}>
            Professional CV Profile
          </div>
          <h1 style={{ fontSize: s(24), fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{data.fullName}</h1>
          <div style={{ fontSize: s(12), color: '#93c5fd', marginTop: s(4), fontWeight: 600, letterSpacing: '0.04em' }}>
            {data.jobTitle}
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: `${s(6)} ${s(16)}`, fontSize: s(9), color: '#e2e8f0', marginTop: s(14) }}>
            {data.email && <div style={{ display: 'flex', alignItems: 'center', gap: s(4) }}><span>✉</span> <span>{data.email}</span></div>}
            {data.phone && <div style={{ display: 'flex', alignItems: 'center', gap: s(4) }}><span>☎</span> <span>{data.phone}</span></div>}
            {data.location && <div style={{ display: 'flex', alignItems: 'center', gap: s(4) }}><span>📍</span> <span>{data.location}</span></div>}
            {data.linkedin && <div style={{ display: 'flex', alignItems: 'center', gap: s(4) }}><span>🔗</span> <span>{data.linkedin.replace(/https?:\/\/(www\.)?/, '')}</span></div>}
          </div>
        </div>

        {/* Initials Badge */}
        <div style={{
          width: s(72),
          height: s(72),
          borderRadius: s(16),
          backgroundColor: 'rgba(255, 255, 255, 0.12)',
          border: `${s(2)} solid rgba(255, 255, 255, 0.25)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontSize: s(24),
          fontWeight: 900,
          flexShrink: 0,
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.2)'
        }}>
          {data.fullName ? data.fullName.substring(0, 2).toUpperCase() : 'CV'}
        </div>
      </div>

      {/* DUAL COLUMN SECTION */}
      <div style={{ display: 'flex', gap: s(24) }}>
        
        {/* LEFT COLUMN (30% Sidebar) */}
        <div style={{ width: s(230), display: 'flex', flexDirection: 'column', gap: s(16) }}>
          
          {/* Key Skills Section */}
          {Object.keys(data.technicalSkills).length > 0 && (
            <div style={{
              backgroundColor: secondaryBg,
              border: `${s(1)} solid ${cardBorder}`,
              borderRadius: s(10),
              padding: s(14)
            }}>
              <h3 style={{ fontSize: s(10), fontWeight: 850, color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.05em', margin: `0 0 ${s(10)} 0`, borderBottom: `${s(1.5)} solid ${cardBorder}`, paddingBottom: s(4) }}>
                Core Competencies
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(10) }}>
                {Object.entries(data.technicalSkills).slice(0, 5).map(([cat, skills], i) => (
                  <div key={i}>
                    <div style={{ fontSize: s(8.5), fontWeight: 750, color: textAccent, marginBottom: s(4), textTransform: 'uppercase' }}>{cat}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: s(4) }}>
                      {skills.map((skill, idx) => (
                        <span key={idx} style={{
                          padding: `${s(2.5)} ${s(6)}`,
                          backgroundColor: '#ffffff',
                          color: badgeText,
                          borderRadius: s(6),
                          fontSize: s(8),
                          fontWeight: 650,
                          border: `${s(0.5)} solid ${cardBorder}`,
                          boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
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

          {/* Education Card */}
          {data.education && data.education.length > 0 && (
            <div style={{
              backgroundColor: secondaryBg,
              border: `${s(1)} solid ${cardBorder}`,
              borderRadius: s(10),
              padding: s(14)
            }}>
              <h3 style={{ fontSize: s(10), fontWeight: 850, color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.05em', margin: `0 0 ${s(10)} 0`, borderBottom: `${s(1.5)} solid ${cardBorder}`, paddingBottom: s(4) }}>
                Education & Qualifications
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(10) }}>
                {data.education.map((edu, i) => (
                  <div key={i} style={{ fontSize: s(9) }}>
                    <strong style={{ color: primaryColor, fontSize: s(9.5), display: 'block' }}>{edu.degree}</strong>
                    <div style={{ color: '#334155', fontWeight: 600 }}>{edu.institution}</div>
                    <div style={{ color: '#64748b', fontSize: s(8), marginTop: s(1) }}>
                      {edu.startYear} - {edu.endYear} {edu.distinction ? `| ${edu.distinction}` : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications Card */}
          {data.certifications && data.certifications.length > 0 && (
            <div style={{
              backgroundColor: secondaryBg,
              border: `${s(1)} solid ${cardBorder}`,
              borderRadius: s(10),
              padding: s(14)
            }}>
              <h3 style={{ fontSize: s(10), fontWeight: 850, color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.05em', margin: `0 0 ${s(8)} 0`, borderBottom: `${s(1.5)} solid ${cardBorder}`, paddingBottom: s(4) }}>
                Certifications
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(6) }}>
                {data.certifications.map((cert, i) => (
                  <div key={i} style={{ fontSize: s(8.5), color: '#334155' }}>
                    <strong style={{ color: primaryColor }}>• {cert.name}</strong>
                    <div style={{ color: '#64748b', fontSize: s(7.8), paddingLeft: s(8) }}>{cert.issuer} ({cert.year})</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <div style={{
              backgroundColor: secondaryBg,
              border: `${s(1)} solid ${cardBorder}`,
              borderRadius: s(10),
              padding: s(14)
            }}>
              <h3 style={{ fontSize: s(10), fontWeight: 850, color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.05em', margin: `0 0 ${s(8)} 0`, borderBottom: `${s(1.5)} solid ${cardBorder}`, paddingBottom: s(4) }}>
                Languages
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(4), fontSize: s(8.8) }}>
                {data.languages.map((lang, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', color: '#334155' }}>
                    <strong>{lang.language}</strong>
                    <span style={{ color: textAccent, fontWeight: 600 }}>{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN (70% Main Content) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: s(16) }}>
          
          {/* Executive Summary Callout */}
          {data.summary && (
            <section style={{
              backgroundColor: secondaryBg,
              borderLeft: `${s(4)} solid ${primaryColor}`,
              padding: `${s(12)} ${s(16)}`,
              borderRadius: `0 ${s(8)} ${s(8)} 0`,
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}>
              <h3 style={{ fontSize: s(9.5), fontWeight: 850, color: primaryColor, textTransform: 'uppercase', margin: `0 0 ${s(4)} 0`, letterSpacing: '0.05em' }}>
                Executive Profile
              </h3>
              <p style={{ margin: 0, fontSize: s(9.5), color: '#334155', lineHeight: '1.6', textAlign: 'justify' }}>
                {data.summary}
              </p>
            </section>
          )}

          {/* Work Experience */}
          {data.experience && data.experience.length > 0 && (
            <section>
              <SectionHeader label="Professional History" scale={scale} primaryColor={primaryColor} icon="💼" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(14), marginTop: s(8) }}>
                {data.experience.map((job, i) => (
                  <div key={i} style={{
                    position: 'relative',
                    borderLeft: `${s(2)} solid ${badgeBg}`,
                    paddingLeft: s(16),
                    marginLeft: s(6)
                  }}>
                    {/* Timeline Dot */}
                    <div style={{
                      position: 'absolute',
                      left: s(-5),
                      top: s(2),
                      width: s(8),
                      height: s(8),
                      borderRadius: '50%',
                      backgroundColor: primaryColor,
                      border: `${s(2)} solid #ffffff`,
                      boxShadow: '0 0 0 1px ' + cardBorder
                    }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: s(2) }}>
                      <strong style={{ fontSize: s(11), color: primaryColor, fontWeight: 800 }}>{job.title}</strong>
                      <span style={{ fontSize: s(8.5), color: textAccent, fontWeight: 700, backgroundColor: badgeBg, padding: `${s(1.5)} ${s(6)}`, borderRadius: s(4) }}>
                        {job.startDate} – {job.endDate}
                      </span>
                    </div>

                    <div style={{ fontSize: s(9.5), color: '#334155', fontWeight: 700, marginBottom: s(6) }}>
                      {job.company} {job.location ? `| ${job.location}` : ''}
                    </div>

                    <ul style={{ margin: 0, paddingLeft: s(12), fontSize: s(9.2), color: '#475569', listStyleType: 'disc' }}>
                      {job.bullets.map((bullet, idx) => (
                        <li key={idx} style={{ marginBottom: s(3), lineHeight: '1.45' }}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Key Achievements */}
          {data.keyAchievements && data.keyAchievements.length > 0 && (
            <section>
              <SectionHeader label="Key Achievements" scale={scale} primaryColor={primaryColor} icon="🏆" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(6), marginTop: s(8) }}>
                {data.keyAchievements.map((ach, i) => (
                  <div key={i} style={{ display: 'flex', gap: s(8), fontSize: s(9.2), color: '#334155', lineHeight: '1.4', backgroundColor: secondaryBg, padding: s(6), borderRadius: s(6), border: `${s(0.5)} solid ${cardBorder}` }}>
                    <span style={{ color: textAccent, fontWeight: 'bold' }}>✦</span>
                    <span>{ach}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>

      </div>

      {/* FOOTER */}
      <div style={{
        marginTop: s(28),
        paddingTop: s(8),
        borderTop: `${s(1)} solid ${cardBorder}`,
        fontSize: s(8.5),
        color: '#94a3b8',
        textAlign: 'center'
      }}>
        Confidential Profile — Generated via Pro-CV
      </div>
    </div>
  )
}
