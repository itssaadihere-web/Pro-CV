import type { Metadata } from 'next';
import Script from 'next/script';
import { createBreadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'LinkedIn Profile Optimizer | Sophi AI',
  description: 'Optimize your LinkedIn profile headline, about summary, and key achievements using Sophi AI. Attract top recruiters in Pakistan and the Gulf.',
  alternates: {
    canonical: 'https://joinsophi.com/linkedin-optimizer'
  },
  openGraph: {
    title: 'LinkedIn Profile Optimizer | Sophi AI',
    description: 'Optimize your LinkedIn profile headline, about summary, and key achievements using Sophi AI. Attract top recruiters in Pakistan and the Gulf.',
    url: 'https://joinsophi.com/linkedin-optimizer',
    siteName: 'Sophi'
  }
};

const breadcrumbSchema = createBreadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'LinkedIn Optimizer', url: '/linkedin-optimizer' }
]);

export default function LinkedinOptimizerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="schema-breadcrumb-linkedin"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
