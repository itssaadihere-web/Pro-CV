import { Metadata } from 'next';
import Script from 'next/script';
import AboutClient from '@/components/AboutClient';
import { organizationSchema, createBreadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'About Sophi — AI Resume Engineering & Career Intelligence Platform',
  description: 'Learn about Sophi AI, our mission to level the job application playing field for Pakistani and Gulf professionals with ATS-optimized resume tools.',
  keywords: [
    'about Sophi AI', 'AI CV platform Pakistan', 'ATS resume engineering company',
    'career intelligence Pakistan'
  ],
  alternates: {
    canonical: 'https://joinsophi.com/about'
  },
  openGraph: {
    title: 'About Sophi — AI Resume Engineering Platform',
    description: 'Our mission is to help Pakistani & Gulf professionals pass corporate ATS screeners and land top career opportunities.',
    url: 'https://joinsophi.com/about',
    siteName: 'Sophi',
    type: 'website',
    images: [{ url: 'https://joinsophi.com/og/home.png', width: 1200, height: 630, alt: 'About Sophi' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Sophi — AI Resume Engineering Platform',
    description: 'Leveling the job application playing field with AI.',
    images: ['https://joinsophi.com/og/home.png']
  }
};

export default function AboutPage() {
  const breadcrumb = createBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'About', url: '/about' }
  ]);

  return (
    <>
      <Script
        id="about-org-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="about-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <AboutClient />
    </>
  );
}
