import { Metadata } from 'next';
import Script from 'next/script';
import CityCvBuilderClient from '@/components/CityCvBuilderClient';
import { createCityCvBuilderSchema, createBreadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'AI CV Builder Lahore — Professional ATS Resume Writer | Sophi',
  description: 'Create an ATS-compliant resume for Lahore jobs. Ideal for tech startups in Gulberg, DHA, Johar Town & FMCG multinationals.',
  keywords: [
    'CV builder Lahore', 'resume writer Lahore', 'ATS CV template Lahore',
    'CV maker Lahore Pakistan', 'Sophi CV Lahore'
  ],
  alternates: {
    canonical: 'https://joinsophi.com/cv-builder-lahore'
  },
  openGraph: {
    title: 'AI CV Builder & ATS Resume Writer Lahore | Sophi',
    description: 'Land tech & corporate interviews in Lahore. AI resume tailoring & ATS score optimization.',
    url: 'https://joinsophi.com/cv-builder-lahore',
    siteName: 'Sophi',
    type: 'website',
    images: [{ url: 'https://joinsophi.com/og/home.png', width: 1200, height: 630, alt: 'CV Builder Lahore' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI CV Builder Lahore | Sophi',
    description: 'Land tech & corporate interviews in Lahore.',
    images: ['https://joinsophi.com/og/home.png']
  }
};

export default function LahorePage() {
  const citySchema = createCityCvBuilderSchema('Lahore', 'Pakistan');
  const breadcrumb = createBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'CV Builder Lahore', url: '/cv-builder-lahore' }
  ]);

  return (
    <>
      <Script
        id="lahore-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(citySchema) }}
      />
      <Script
        id="lahore-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <CityCvBuilderClient
        cityName="Lahore"
        badgeText="🇵🇰 Optimized for Lahore Job Market"
        heading="Professional AI CV Builder in Lahore"
        description="Targeting software houses in IT Park, startups in Gulberg & DHA, or corporate roles in Johar Town? Sophi AI rewrites your resume into single-column ATS formatting with STAR accomplishment metrics."
        landmarks="Gulberg, DHA, Johar Town & Arfa Tech Park"
        sectors="Software Engineering, Marketing, Retail & FMCG"
        imageAlt="Professional CV Builder Lahore"
      />
    </>
  );
}
