export interface ColorPaletteOption {
  id: string
  name: string
  hex: string
}

export function getTemplateColorPalettes(templateId: string): ColorPaletteOption[] {
  const tid = (templateId || '').toLowerCase()

  if (tid.includes('sophi-01') || tid.includes('robin') || tid.includes('royal')) {
    return [
      { id: 'blue', name: 'Royal Sapphire', hex: '#1d4ed8' },
      { id: 'emerald', name: 'Emerald Forest', hex: '#047857' },
      { id: 'purple', name: 'Imperial Plum', hex: '#6d28d9' },
      { id: 'burgundy', name: 'Burgundy Crimson', hex: '#9f1239' },
      { id: 'charcoal', name: 'Midnight Slate', hex: '#1e293b' },
    ]
  }

  if (tid.includes('sophi-02') || tid.includes('yellow') || tid.includes('block')) {
    return [
      { id: 'gold', name: 'Mustard Gold & Dark Slate', hex: '#facc15' },
      { id: 'cyan', name: 'Electric Cyan & Navy', hex: '#06b6d4' },
      { id: 'coral', name: 'Vibrant Coral & Obsidian', hex: '#f43f5e' },
      { id: 'emerald', name: 'Mint Emerald & Dark Forest', hex: '#10b981' },
      { id: 'purple', name: 'Deep Violet & Charcoal', hex: '#a855f7' },
    ]
  }

  if (tid.includes('sophi-03') || tid.includes('brian') || tid.includes('gold-charcoal')) {
    return [
      { id: 'gold', name: 'Warm Amber Gold & Charcoal', hex: '#d97706' },
      { id: 'blue', name: 'Cobalt Blue & Slate', hex: '#2563eb' },
      { id: 'emerald', name: 'Jade Emerald & Dark Green', hex: '#059669' },
      { id: 'ruby', name: 'Ruby Crimson & Ebony', hex: '#e11d48' },
      { id: 'bronze', name: 'Copper Bronze & Stone', hex: '#b45309' },
    ]
  }

  if (tid.includes('sophi-04') || tid.includes('wave') || tid.includes('curved')) {
    return [
      { id: 'gold', name: 'Amber Gold Wave', hex: '#d97706' },
      { id: 'teal', name: 'Ocean Teal Wave', hex: '#0d9488' },
      { id: 'indigo', name: 'Ultra Indigo Wave', hex: '#6366f1' },
      { id: 'coral', name: 'Sunset Coral Wave', hex: '#e11d48' },
      { id: 'charcoal', name: 'Graphite Zinc Wave', hex: '#52525b' },
    ]
  }

  if (tid.includes('sophi-05') || tid.includes('ribbon') || tid.includes('infographic')) {
    return [
      { id: 'gold', name: 'Amber Ribbon & Obsidian', hex: '#f59e0b' },
      { id: 'blue', name: 'Azure Ribbon & Midnight', hex: '#3b82f6' },
      { id: 'purple', name: 'Orchid Ribbon & Deep Purple', hex: '#a855f7' },
      { id: 'emerald', name: 'Mint Ribbon & Dark Forest', hex: '#10b981' },
      { id: 'coral', name: 'Rose Crimson Ribbon & Burgundy', hex: '#f43f5e' },
    ]
  }

  if (tid.includes('sapphire') || tid.includes('executive')) {
    return [
      { id: 'blue', name: 'Sapphire Blue', hex: '#1e40af' },
      { id: 'emerald', name: 'Emerald Green', hex: '#047857' },
      { id: 'purple', name: 'Executive Violet', hex: '#6d28d9' },
      { id: 'burgundy', name: 'Deep Burgundy', hex: '#881337' },
      { id: 'charcoal', name: 'Dark Slate', hex: '#334155' },
    ]
  }

  if (tid.includes('ats') || tid.includes('corporate')) {
    return [
      { id: 'classic', name: 'Classic Onyx Black', hex: '#0f172a' },
      { id: 'navy', name: 'Navy Corporate', hex: '#1e3a8a' },
      { id: 'charcoal', name: 'Dark Graphite', hex: '#27272a' },
      { id: 'teal', name: 'Deep Teal', hex: '#0f766e' },
      { id: 'burgundy', name: 'Classic Wine', hex: '#7f1d1d' },
    ]
  }

  // Fallback 5 modern executive options
  return [
    { id: 'blue', name: 'Royal Blue', hex: '#2563eb' },
    { id: 'gold', name: 'Warm Amber Gold', hex: '#d97706' },
    { id: 'purple', name: 'Deep Violet', hex: '#7c3aed' },
    { id: 'emerald', name: 'Emerald Green', hex: '#059669' },
    { id: 'charcoal', name: 'Sleek Charcoal', hex: '#374151' },
  ]
}
