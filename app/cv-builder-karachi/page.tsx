import { Metadata } from 'next';
import Script from 'next/script';
import CityCvBuilderClient from '@/components/CityCvBuilderClient';
import { createCityCvBuilderSchema, createBreadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'AI CV Builder Karachi — ATS Resume Maker for Karachi Jobs | Sophi',
  description: 'Build an ATS-optimized CV in Karachi. Designed for finance, tech & corporate jobs in I.I. Chundrigar, Clifton & Shahrah-e-Faisal.',
  keywords: [
    'CV builder Karachi', 'resume maker Karachi', 'ATS CV writer Karachi',
    'CV format Pakistan Karachi', 'Sophi CV builder'
  ],
  alternates: {
    canonical: 'https://joinsophi.com/cv-builder-karachi'
  },
  openGraph: {
    title: 'AI CV Builder & ATS Resume Writer Karachi | Sophi',
    description: 'Bypass corporate ATS filters in Karachi. AI resume rewriting & ATS score optimization for Karachi professionals.',
    url: 'https://joinsophi.com/cv-builder-karachi',
    siteName: 'Sophi',
    type: 'website',
    images: [{ url: 'https://joinsophi.com/og/home.png', width: 1200, height: 630, alt: 'CV Builder Karachi' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI CV Builder Karachi | Sophi',
    description: 'Bypass corporate ATS filters in Karachi.',
    images: ['https://joinsophi.com/og/home.png']
  }
};

export default function KarachiPage() {
  const citySchema = createCityCvBuilderSchema('Karachi', 'Pakistan');
  const breadcrumb = createBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'CV Builder Karachi', url: '/cv-builder-karachi' }
  ]);

  return (
    <>
      <Script
        id="karachi-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(citySchema) }}
      />
      <Script
        id="karachi-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <CityCvBuilderClient
        cityName="Karachi"
        badgeText="🇵🇰 Optimized for Karachi Job Market"
        heading="Professional AI CV Builder in Karachi"
        description="Applying for jobs at corporate headquarters in I.I. Chundrigar Road, Clifton, or tech firms in Shahrah-e-Faisal? Make sure your CV gets past their digital HR filters. Sophi uses AI to rewrite your CV specifically for Karachi's highly competitive job market."
        landmarks="I.I. Chundrigar, Clifton & Shahrah-e-Faisal"
        sectors="Finance, Banking, Tech, FMCG & Logistics"
        imageAlt="Professional CV Builder Karachi"
      />
    </>
  );
}
