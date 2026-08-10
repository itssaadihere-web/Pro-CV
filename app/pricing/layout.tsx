import type { Metadata } from 'next';
import Script from 'next/script';
import { createBreadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Sophi Pricing & Packages | AI CV Builder Pakistan',
  description: 'Get a complete AI-powered CV transformation for just 1,500 PKR. Includes ATS resume, cover letter, LinkedIn optimizer, gap analysis, and PDF export.',
  alternates: {
    canonical: 'https://joinsophi.com/pricing'
  },
  openGraph: {
    title: 'Sophi Pricing & Packages | AI CV Builder Pakistan',
    description: 'Get a complete AI-powered CV transformation for just 1,500 PKR. Includes ATS resume, cover letter, LinkedIn optimizer, gap analysis, and PDF export.',
    url: 'https://joinsophi.com/pricing',
    siteName: 'Sophi'
  }
};

const breadcrumbSchema = createBreadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'Pricing', url: '/pricing' }
]);

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="schema-breadcrumb-pricing"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
