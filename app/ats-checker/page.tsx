import { Metadata } from 'next';
import Script from 'next/script';
import ATSCheckerClient from '@/components/ATSCheckerClient';
import { faqSchema, createBreadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Free ATS CV Checker & Resume Score Evaluator Pakistan | Sophi',
  description: 'Check your resume score across 5 ATS dimensions for free. Find missing keywords, formatting errors & pass corporate recruitment screeners with Sophi AI.',
  keywords: [
    'ATS score checker Pakistan', 'free resume checker', 'ATS CV score evaluator',
    'applicant tracking system test', 'CV keyword density checker', 'Sophi ATS checker'
  ],
  alternates: {
    canonical: 'https://joinsophi.com/ats-checker'
  },
  openGraph: {
    title: 'Free ATS CV Checker & Resume Score Evaluator | Sophi',
    description: 'Audit your resume ATS compliance score in 30 seconds. Get instant keyword density analysis and structural feedback.',
    url: 'https://joinsophi.com/ats-checker',
    siteName: 'Sophi',
    type: 'website',
    images: [{ url: 'https://joinsophi.com/og/home.png', width: 1200, height: 630, alt: 'Sophi ATS CV Checker' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free ATS CV Checker & Resume Score Evaluator | Sophi',
    description: 'Audit your resume ATS compliance score in 30 seconds.',
    images: ['https://joinsophi.com/og/home.png']
  }
};

export default function ATSCheckerPage() {
  const breadcrumb = createBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'ATS Checker', url: '/ats-checker' }
  ]);

  return (
    <>
      <Script
        id="ats-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Script
        id="ats-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ATSCheckerClient />
    </>
  );
}
