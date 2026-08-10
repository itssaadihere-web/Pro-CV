import type { Metadata } from 'next';
import Script from 'next/script';
import { createBreadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Free ATS CV Checker & Resume Scanner | Sophi AI',
  description: 'Evaluate your CV against applicant tracking system (ATS) filters for free. Sophi evaluates keyword alignment, formatting safety, and metrics.',
  alternates: {
    canonical: 'https://joinsophi.com/ats-checker'
  },
  openGraph: {
    title: 'Free ATS CV Checker & Resume Scanner | Sophi AI',
    description: 'Evaluate your CV against applicant tracking system (ATS) filters for free. Sophi evaluates keyword alignment, formatting safety, and metrics.',
    url: 'https://joinsophi.com/ats-checker',
    siteName: 'Sophi'
  }
};

const breadcrumbSchema = createBreadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'ATS Checker', url: '/ats-checker' }
]);

export default function ATSCheckerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="schema-breadcrumb-ats"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
