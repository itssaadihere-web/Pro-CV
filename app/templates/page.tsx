import { Metadata } from 'next';
import Script from 'next/script';
import TemplatesClient from '@/components/TemplatesClient';
import { createBreadcrumbSchema, atsTemplatesFaqSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Free ATS Friendly Resume Templates & CV Formats 2026 | Sophi',
  description: 'Download recruiter-tested, free ATS friendly resume templates & CV formats. Explore applicant tracking system resume samples, formatting guides, and examples.',
  keywords: [
    'ats cv template',
    'ats friendly cv templates',
    'applicant tracking system resume template',
    'resume ats format',
    'ats friendly resume format',
    'ats cv format',
    'sample ats friendly resume',
    'ats friendly resume template',
    'ats resume template',
    'ats resume sample',
    'ats resume examples',
    'free ats resume template',
    'ats format resume',
    'ats format cv',
    'ATS CV templates Pakistan',
    'single column resume PDF'
  ],
  alternates: {
    canonical: 'https://joinsophi.com/templates'
  },
  openGraph: {
    title: 'Free ATS Friendly Resume Templates & CV Formats | Sophi',
    description: 'Explore 49+ single-column ATS resume templates and applicant tracking system formats designed to pass corporate HR screeners.',
    url: 'https://joinsophi.com/templates',
    siteName: 'Sophi',
    type: 'website',
    images: [{ url: 'https://joinsophi.com/og/home.png', width: 1200, height: 630, alt: 'ATS Friendly Resume Templates' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free ATS Friendly Resume Templates & Formats | Sophi',
    description: 'Recruiter-approved ATS resume templates, formats & sample resumes.',
    images: ['https://joinsophi.com/og/home.png']
  }
};

export default function TemplatesPage() {
  const breadcrumb = createBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'ATS CV Templates', url: '/templates' }
  ]);

  return (
    <>
      <Script
        id="templates-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Script
        id="templates-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(atsTemplatesFaqSchema) }}
      />
      <TemplatesClient />
    </>
  );
}
