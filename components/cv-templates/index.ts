// SOPHI AI Master CV Template Registry
import React from 'react'
import { CVTemplateProps } from '@/types/cv'

import SophiExecutiveSapphire from './sophi/SophiExecutiveSapphire'
import SophiATSMasterCorporate from './sophi/SophiATSMasterCorporate'
import SophiModernEmeraldAcademic from './sophi/SophiModernEmeraldAcademic'
import SophiCreativeCoralModernist from './sophi/SophiCreativeCoralModernist'
import SophiMinimalistMonochromePro from './sophi/SophiMinimalistMonochromePro'

export const SOPHI_TEMPLATES = {
  'sophi-executive-sapphire': SophiExecutiveSapphire,
  'sophi-ats-master-corporate': SophiATSMasterCorporate,
  'sophi-modern-emerald-academic': SophiModernEmeraldAcademic,
  'sophi-creative-coral-modernist': SophiCreativeCoralModernist,
  'sophi-minimalist-monochrome-pro': SophiMinimalistMonochromePro,
}

export const TEMPLATE_REGISTRY: Record<string, React.ComponentType<CVTemplateProps>> = {
  ...SOPHI_TEMPLATES,
  // Alias mappings to preserve compatibility with existing template IDs
  'm-37-creative-sapphire-executive': SophiExecutiveSapphire,
  'm-36-creative-coral-modernist': SophiCreativeCoralModernist,
  'm-38-creative-emerald-infographic': SophiModernEmeraldAcademic,
  'm-01-black-modern-professional': SophiMinimalistMonochromePro,
  'min-14-white-blue-minimalist-corporate-ats': SophiATSMasterCorporate,
}

export function getTemplate(templateId: string): React.ComponentType<CVTemplateProps> {
  if (TEMPLATE_REGISTRY[templateId]) {
    return TEMPLATE_REGISTRY[templateId]
  }

  // Smart fallback routing based on ID keywords
  const lower = (templateId || '').toLowerCase()
  if (lower.includes('coral') || lower.includes('creative') || lower.includes('amber')) {
    return SophiCreativeCoralModernist
  }
  if (lower.includes('emerald') || lower.includes('green') || lower.includes('academic')) {
    return SophiModernEmeraldAcademic
  }
  if (lower.includes('minimalist') || lower.includes('black') || lower.includes('monochrome')) {
    return SophiMinimalistMonochromePro
  }
  if (lower.includes('ats') || lower.includes('corporate') || lower.includes('admin')) {
    return SophiATSMasterCorporate
  }

  return SophiExecutiveSapphire
}
