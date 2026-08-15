import { Metadata } from 'next';
import Script from 'next/script';
import TailorCvClient from '@/components/TailorCvClient';
import { createBreadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Job-Specific CV Tailoring & Description Match | Sophi AI',
  description: 'Tailor your resume for specific job descriptions in 30 seconds. Realign bullet points, summary & keywords to achieve 90%+ ATS match score.',
  keywords: [
    'job CV tailor', 'resume job description matcher', 'ATS keyword alignment',
    'tailored cover letter generator', 'Sophi CV tailor'
  ],
  alternates: {
    canonical: 'https://joinsophi.com/tailor-cv'
  },
  openGraph: {
    title: 'Job-Specific CV Tailoring & Description Matcher | Sophi',
    description: 'Tailor your resume for specific job openings to score 90%+ on ATS screening tests.',
    url: 'https://joinsophi.com/tailor-cv',
    siteName: 'Sophi',
    type: 'website',
    images: [{ url: 'https://joinsophi.com/og/home.png', width: 1200, height: 630, alt: 'Job CV Tailoring' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Job-Specific CV Tailoring | Sophi',
    description: 'Tailor your resume for specific job openings to score 90%+ on ATS screening tests.',
    images: ['https://joinsophi.com/og/home.png']
  }
};

export default function TailorCvPage() {
  const breadcrumb = createBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Tailor CV', url: '/tailor-cv' }
  ]);

  return (
    <>
      <Script
        id="tailor-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <TailorCvClient />
    </>
  );
}
