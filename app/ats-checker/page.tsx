import { Metadata } from 'next';
import Script from 'next/script';
import ATSCheckerClient from '@/components/ATSCheckerClient';
import { faqSchema, createBreadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Free ATS Score Checker Online — Audit Your Resume ATS Score | Sophi',
  description: 'Free ATS score checker and resume evaluator. Check your CV ATS score across 5 dimensions, identify missing keywords, and pass corporate recruitment screeners with Sophi AI.',
  keywords: [
    'ats score checker free',
    'ats score checker',
    'ATS score checker Pakistan',
    'free resume checker',
    'ATS CV score evaluator',
    'applicant tracking system test',
    'CV keyword density checker',
    'ats resume maker',
    'Sophi ATS checker'
  ],
  alternates: {
    canonical: 'https://joinsophi.com/ats-checker'
  },
  openGraph: {
    title: 'Free ATS Score Checker Online — Audit Your Resume Score | Sophi',
    description: 'Audit your resume ATS compliance score in 30 seconds for free. Get instant keyword density analysis, risk level, and structural feedback.',
    url: 'https://joinsophi.com/ats-checker',
    siteName: 'Sophi',
    type: 'website',
    images: [{ url: 'https://joinsophi.com/og/home.png', width: 1200, height: 630, alt: 'Free ATS Score Checker' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free ATS Score Checker Online | Sophi',
    description: 'Audit your resume ATS score and pass applicant tracking systems.',
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
