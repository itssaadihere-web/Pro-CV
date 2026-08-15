import { Metadata } from 'next';
import Script from 'next/script';
import HowItWorksClient from '@/components/HowItWorksClient';
import { howToSchema, createBreadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'How It Works — 4-Step AI CV Transformation | Sophi',
  description: 'See how Sophi AI rewrites old resumes into ATS-optimized career documents in 4 steps. STAR bullets, 500+ keywords & professional PDF export.',
  keywords: [
    'how Sophi AI works', 'AI CV writing process', 'ATS resume optimization steps',
    'STAR method CV rewriting', 'how to pass ATS screening'
  ],
  alternates: {
    canonical: 'https://joinsophi.com/how-it-works'
  },
  openGraph: {
    title: 'How Sophi AI Works — 4-Step Resume Engineering',
    description: 'From upload to job-ready in 60 seconds. Audit ATS score, inject keywords & download recruiter-approved PDFs.',
    url: 'https://joinsophi.com/how-it-works',
    siteName: 'Sophi',
    type: 'website',
    images: [{ url: 'https://joinsophi.com/og/home.png', width: 1200, height: 630, alt: 'How Sophi Works' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How Sophi AI Works — 4-Step Resume Engineering',
    description: 'From upload to job-ready in 60 seconds.',
    images: ['https://joinsophi.com/og/home.png']
  }
};

export default function HowItWorksPage() {
  const breadcrumb = createBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'How It Works', url: '/how-it-works' }
  ]);

  return (
    <>
      <Script
        id="howto-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <Script
        id="howto-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <HowItWorksClient />
    </>
  );
}
