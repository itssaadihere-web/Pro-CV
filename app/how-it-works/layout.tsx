import type { Metadata } from 'next';
import Script from 'next/script';
import { createBreadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'How Sophi AI Works | Next-Gen CV Platform',
  description: 'Discover how Sophi AI scans your resume, evaluates ATS compliance, rewrites accomplishments using STAR metrics, and delivers recruiter-ready CVs.',
  alternates: {
    canonical: 'https://joinsophi.com/how-it-works'
  },
  openGraph: {
    title: 'How Sophi AI Works | Next-Gen CV Platform',
    description: 'Discover how Sophi AI scans your resume, evaluates ATS compliance, rewrites accomplishments using STAR metrics, and delivers recruiter-ready CVs.',
    url: 'https://joinsophi.com/how-it-works',
    siteName: 'Sophi'
  }
};

const breadcrumbSchema = createBreadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'How It Works', url: '/how-it-works' }
]);

export default function HowItWorksLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="schema-breadcrumb-howitworks"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
