import { Metadata } from 'next';
import Script from 'next/script';
import LinkedInOptimizerClient from '@/components/LinkedInOptimizerClient';
import { createBreadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'AI LinkedIn Profile Optimizer — Optimise LinkedIn Profile for Recruiters | Sophi',
  description: 'Master LinkedIn optimization with Sophi AI. Generate recruiter-magnet headlines, optimise LinkedIn profile summaries, and rank higher in recruiter searches.',
  keywords: [
    'linkedin optimization',
    'optimise linkedin profile',
    'linked in profile optimization',
    'linkedin profile optimizer',
    'LinkedIn headline generator',
    'recruiter search optimization LinkedIn',
    'LinkedIn bio optimizer AI',
    'Sophi LinkedIn tool'
  ],
  alternates: {
    canonical: 'https://joinsophi.com/linkedin-optimizer'
  },
  openGraph: {
    title: 'AI LinkedIn Profile Optimizer — Optimise LinkedIn Profile | Sophi',
    description: 'Optimize your LinkedIn profile headline, summary hook & skills for corporate recruiters with AI-driven keyword matching.',
    url: 'https://joinsophi.com/linkedin-optimizer',
    siteName: 'Sophi',
    type: 'website',
    images: [{ url: 'https://joinsophi.com/og/home.png', width: 1200, height: 630, alt: 'LinkedIn Profile Optimizer' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI LinkedIn Profile Optimizer | Sophi',
    description: 'Master LinkedIn optimization and attract top corporate recruiters.',
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
