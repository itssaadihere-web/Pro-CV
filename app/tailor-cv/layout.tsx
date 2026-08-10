import type { Metadata } from 'next';
import Script from 'next/script';
import { createBreadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'AI Resume & CV Tailoring for Job Descriptions | Sophi',
  description: 'Tailor your CV for specific job postings in seconds. Sophi AI injects target industry keywords and formats your experience to outrank rival candidates.',
  alternates: {
    canonical: 'https://joinsophi.com/tailor-cv'
  },
  openGraph: {
    title: 'AI Resume & CV Tailoring for Job Descriptions | Sophi',
    description: 'Tailor your CV for specific job postings in seconds. Sophi AI injects target industry keywords and formats your experience to outrank rival candidates.',
    url: 'https://joinsophi.com/tailor-cv',
    siteName: 'Sophi'
  }
};

const breadcrumbSchema = createBreadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'Tailor CV', url: '/tailor-cv' }
]);

export default function TailorCvLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="schema-breadcrumb-tailor"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
