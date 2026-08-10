import type { Metadata } from 'next';
import Script from 'next/script';
import { createBreadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: '49 Professional ATS CV Templates | Sophi AI',
  description: 'Explore 49 recruiter-tested, single-column ATS resume templates. Instantly switch between modern, classic, and executive styles.',
  alternates: {
    canonical: 'https://joinsophi.com/templates'
  },
  openGraph: {
    title: '49 Professional ATS CV Templates | Sophi AI',
    description: 'Explore 49 recruiter-tested, single-column ATS resume templates. Instantly switch between modern, classic, and executive styles.',
    url: 'https://joinsophi.com/templates',
    siteName: 'Sophi'
  }
};

const breadcrumbSchema = createBreadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'Templates', url: '/templates' }
]);

export default function TemplatesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="schema-breadcrumb-templates"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
