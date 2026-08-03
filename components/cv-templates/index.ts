// SOPHI AI Master CV Template Registry
import React from 'react'
import { CVTemplateProps } from '@/types/cv'

import SophiTemplate01RoyalBlue from './sophi/SophiTemplate01RoyalBlue'
import SophiTemplate02YellowBlackBlock from './sophi/SophiTemplate02YellowBlackBlock'
import SophiTemplate03GoldCharcoalGeometric from './sophi/SophiTemplate03GoldCharcoalGeometric'
import SophiTemplate04CurvedGoldWave from './sophi/SophiTemplate04CurvedGoldWave'
import SophiTemplate05RibbonGraphicInfographic from './sophi/SophiTemplate05RibbonGraphicInfographic'

import SophiExecutiveSapphire from './sophi/SophiExecutiveSapphire'
import SophiATSMasterCorporate from './sophi/SophiATSMasterCorporate'
import SophiModernEmeraldAcademic from './sophi/SophiModernEmeraldAcademic'
import SophiCreativeCoralModernist from './sophi/SophiCreativeCoralModernist'
import SophiMinimalistMonochromePro from './sophi/SophiMinimalistMonochromePro'

export const SOPHI_TEMPLATES: Record<string, React.ComponentType<CVTemplateProps>> = {
  'sophi-01-royal-blue-executive': SophiTemplate01RoyalBlue,
  'sophi-02-yellow-black-block': SophiTemplate02YellowBlackBlock,
  'sophi-03-gold-charcoal-geometric': SophiTemplate03GoldCharcoalGeometric,
  'sophi-04-curved-gold-wave': SophiTemplate04CurvedGoldWave,
  'sophi-05-ribbon-graphic-infographic': SophiTemplate05RibbonGraphicInfographic,
  'sophi-executive-sapphire': SophiExecutiveSapphire,
  'sophi-ats-master-corporate': SophiATSMasterCorporate,
  'sophi-modern-emerald-academic': SophiModernEmeraldAcademic,
  'sophi-creative-coral-modernist': SophiCreativeCoralModernist,
  'sophi-minimalist-monochrome-pro': SophiMinimalistMonochromePro,
}

export const TEMPLATE_REGISTRY: Record<string, React.ComponentType<CVTemplateProps>> = {
  ...SOPHI_TEMPLATES,
  // Alias mappings to preserve compatibility with existing template IDs
  'm-37-creative-sapphire-executive': SophiTemplate01RoyalBlue,
  'm-36-creative-coral-modernist': SophiTemplate02YellowBlackBlock,
  'm-38-creative-emerald-infographic': SophiTemplate03GoldCharcoalGeometric,
  'm-01-black-modern-professional': SophiTemplate05RibbonGraphicInfographic,
  'min-14-white-blue-minimalist-corporate-ats': SophiATSMasterCorporate,
}

export function getTemplate(templateId: string): React.ComponentType<CVTemplateProps> {
  if (TEMPLATE_REGISTRY[templateId]) {
    return TEMPLATE_REGISTRY[templateId]
  }

  // Smart fallback routing based on ID keywords
  const lower = (templateId || '').toLowerCase()
  if (lower.includes('blue') || lower.includes('robin')) {
    return SophiTemplate01RoyalBlue
  }
  if (lower.includes('yellow') || lower.includes('block')) {
    return SophiTemplate02YellowBlackBlock
  }
  if (lower.includes('gold') || lower.includes('brian') || lower.includes('charcoal')) {
    return SophiTemplate03GoldCharcoalGeometric
  }
  if (lower.includes('wave') || lower.includes('curved')) {
    return SophiTemplate04CurvedGoldWave
  }
  if (lower.includes('ribbon') || lower.includes('infographic')) {
    return SophiTemplate05RibbonGraphicInfographic
  }

  return SophiTemplate01RoyalBlue
}
