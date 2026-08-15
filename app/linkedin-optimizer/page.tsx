import { Metadata } from 'next';
import Script from 'next/script';
import LinkedInOptimizerClient from '@/components/LinkedInOptimizerClient';
import { createBreadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'AI LinkedIn Profile Optimizer — Recruiter Search Generator | Sophi',
  description: 'Generate high-ranking LinkedIn headlines, executive summaries & keyword skill tags automatically. Increase recruiter profile views on LinkedIn.',
  keywords: [
    'LinkedIn profile optimizer', 'LinkedIn headline generator Pakistan',
    'LinkedIn bio optimizer AI', 'recruiter search optimization LinkedIn', 'Sophi LinkedIn tool'
  ],
  alternates: {
    canonical: 'https://joinsophi.com/linkedin-optimizer'
  },
  openGraph: {
    title: 'AI LinkedIn Profile Optimizer & Headline Generator | Sophi',
    description: 'Optimize your LinkedIn profile headline, summary hook & skills for corporate recruiters.',
    url: 'https://joinsophi.com/linkedin-optimizer',
    siteName: 'Sophi',
    type: 'website',
    images: [{ url: 'https://joinsophi.com/og/home.png', width: 1200, height: 630, alt: 'LinkedIn Profile Optimizer' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI LinkedIn Profile Optimizer | Sophi',
    description: 'Optimize your LinkedIn headline & summary for corporate recruiters.',
    images: ['https://joinsophi.com/og/home.png']
  }
};

export default function LinkedInOptimizerPage() {
  const breadcrumb = createBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'LinkedIn Optimizer', url: '/linkedin-optimizer' }
  ]);

  return (
    <>
      <Script
        id="linkedin-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <LinkedInOptimizerClient />
    </>
  );
}
