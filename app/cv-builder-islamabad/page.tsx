import { Metadata } from 'next';
import Script from 'next/script';
import CityCvBuilderClient from '@/components/CityCvBuilderClient';
import { createCityCvBuilderSchema, createBreadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'AI CV Builder Islamabad — ATS Resume Writer & Executive CVs | Sophi',
  description: 'ATS resume builder for Islamabad & Rawalpindi. Designed for NGOs, government development projects, IT firms & corporate roles in Blue Area & I-8.',
  keywords: [
    'CV builder Islamabad', 'resume maker Islamabad', 'NGO resume writer Islamabad',
    'Blue Area CV maker', 'Sophi CV Islamabad'
  ],
  alternates: {
    canonical: 'https://joinsophi.com/cv-builder-islamabad'
  },
  openGraph: {
    title: 'AI CV Builder & ATS Resume Writer Islamabad | Sophi',
    description: 'Land NGO, tech & corporate interviews in Islamabad. AI resume tailoring & ATS score optimization.',
    url: 'https://joinsophi.com/cv-builder-islamabad',
    siteName: 'Sophi',
    type: 'website',
    images: [{ url: 'https://joinsophi.com/og/home.png', width: 1200, height: 630, alt: 'CV Builder Islamabad' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI CV Builder Islamabad | Sophi',
    description: 'Land NGO, tech & corporate interviews in Islamabad.',
    images: ['https://joinsophi.com/og/home.png']
  }
};

export default function IslamabadPage() {
  const citySchema = createCityCvBuilderSchema('Islamabad', 'Pakistan');
  const breadcrumb = createBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'CV Builder Islamabad', url: '/cv-builder-islamabad' }
  ]);

  return (
    <>
      <Script
        id="islamabad-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(citySchema) }}
      />
      <Script
        id="islamabad-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <CityCvBuilderClient
        cityName="Islamabad"
        badgeText="🇵🇰 Optimized for Islamabad & Rawalpindi"
        heading="Professional AI CV Builder in Islamabad"
        description="Applying for international NGOs, telecommunications in Blue Area, tech startups in I-8 & National Incubation Center, or development sector roles? Sophi AI formats your document to meet international executive recruitment standards."
        landmarks="Blue Area, I-8, NIC & Diplomatic Enclave"
        sectors="NGOs, Development Sector, Telecom, Tech & Government Contracting"
        imageAlt="Professional CV Builder Islamabad"
      />
    </>
  );
}
