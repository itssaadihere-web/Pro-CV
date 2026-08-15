import { Metadata } from 'next';
import Script from 'next/script';
import TemplatesClient from '@/components/TemplatesClient';
import { createBreadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: '49+ Recruiter-Approved ATS CV Templates | Sophi AI',
  description: 'Explore 49 ATS-optimized, single-column & executive resume templates. Built to pass digital HR screening software in Pakistan & globally.',
  keywords: [
    'ATS CV templates Pakistan', 'professional resume designs', 'ATS compliant templates',
    'single column resume PDF', 'Sophi CV templates'
  ],
  alternates: {
    canonical: 'https://joinsophi.com/templates'
  },
  openGraph: {
    title: 'Recruiter-Approved ATS CV Templates | Sophi',
    description: 'Explore 49 single-column & executive ATS templates designed to pass corporate HR screeners.',
    url: 'https://joinsophi.com/templates',
    siteName: 'Sophi',
    type: 'website',
    images: [{ url: 'https://joinsophi.com/og/home.png', width: 1200, height: 630, alt: 'Sophi CV Templates' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Recruiter-Approved ATS CV Templates | Sophi',
    description: 'Explore 49 single-column & executive ATS templates.',
    images: ['https://joinsophi.com/og/home.png']
  }
};

export default function TemplatesPage() {
  const breadcrumb = createBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'CV Templates', url: '/templates' }
  ]);

  return (
    <>
      <Script
        id="templates-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <TemplatesClient />
    </>
  );
}
