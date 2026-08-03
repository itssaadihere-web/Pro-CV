import React from 'react'
import { CVData } from '@/lib/cvParser'

export function AcademicSections({ data, scale = 1, primaryColor = '#2563eb' }: { data: CVData; scale?: number; primaryColor?: string }) {
  const s = (n: number) => `${n * scale}px`

  const hasPubs = data.publications && data.publications.length > 0
  const hasConfs = data.conferencePresentations && data.conferencePresentations.length > 0
  const hasSup = data.researchSupervision && data.researchSupervision.length > 0
  const hasTrn = data.executiveTrainings && data.executiveTrainings.length > 0

  if (!hasPubs && !hasConfs && !hasSup && !hasTrn) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: s(12), marginTop: s(12) }}>
      {hasPubs && (
        <section>
          <div style={{ marginBottom: s(6), display: 'flex', alignItems: 'center' }}>
            <div style={{ width: s(4), height: s(14), backgroundColor: primaryColor, marginRight: s(8), borderRadius: s(2) }} />
            <h2 style={{ fontSize: s(11), fontWeight: 800, color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Research Publications
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: s(8) }}>
            {data.publications!.map((pub, i) => (
              <div key={i} style={{ fontSize: s(9.2), color: '#334155', lineHeight: '1.45' }}>
                • <strong>{pub.authors}</strong> ({pub.year}). "{pub.title}." <em>{pub.journal}</em>
                {pub.indexing_tier && <span style={{ color: primaryColor, fontWeight: 600 }}> [{pub.indexing_tier}]</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {hasConfs && (
        <section>
          <div style={{ marginBottom: s(6), display: 'flex', alignItems: 'center' }}>
            <div style={{ width: s(4), height: s(14), backgroundColor: primaryColor, marginRight: s(8), borderRadius: s(2) }} />
            <h2 style={{ fontSize: s(11), fontWeight: 800, color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Conference Presentations
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: s(8) }}>
            {data.conferencePresentations!.map((conf, i) => (
              <div key={i} style={{ fontSize: s(9.2), color: '#334155', lineHeight: '1.45' }}>
                • <strong>{conf.authors}</strong> ({conf.year}). "{conf.title}." Presented at: <em>{conf.conference}</em>
              </div>
            ))}
          </div>
        </section>
      )}

      {hasSup && (
        <section>
          <div style={{ marginBottom: s(6), display: 'flex', alignItems: 'center' }}>
            <div style={{ width: s(4), height: s(14), backgroundColor: primaryColor, marginRight: s(8), borderRadius: s(2) }} />
            <h2 style={{ fontSize: s(11), fontWeight: 800, color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Research Supervision
            </h2>
          </div>
          <ul style={{ margin: 0, paddingLeft: s(14), fontSize: s(9), color: '#334155', listStyleType: 'disc' }}>
            {data.researchSupervision!.map((sup, i) => (
              <li key={i} style={{ marginBottom: s(2.5), lineHeight: '1.4' }}>{sup}</li>
            ))}
          </ul>
        </section>
      )}

      {hasTrn && (
        <section>
          <div style={{ marginBottom: s(6), display: 'flex', alignItems: 'center' }}>
            <div style={{ width: s(4), height: s(14), backgroundColor: primaryColor, marginRight: s(8), borderRadius: s(2) }} />
            <h2 style={{ fontSize: s(11), fontWeight: 800, color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Executive Trainings & Workshops
            </h2>
          </div>
          <ul style={{ margin: 0, paddingLeft: s(14), fontSize: s(9), color: '#334155', listStyleType: 'disc' }}>
            {data.executiveTrainings!.map((trn, i) => (
              <li key={i} style={{ marginBottom: s(2.5), lineHeight: '1.4' }}>{trn}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
