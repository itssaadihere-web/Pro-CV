import type { Metadata } from 'next';
import Script from 'next/script';
import { createBreadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'About Sophi — Next-Gen AI CV Platform for Pakistan',
  description: 'Learn about Sophi AI, empowering job seekers across Pakistan and the Gulf with AI resume engineering, ATS optimization, and career tools.',
  alternates: {
    canonical: 'https://joinsophi.com/about'
  },
  openGraph: {
    title: 'About Sophi — Next-Gen AI CV Platform for Pakistan',
    description: 'Learn about Sophi AI, empowering job seekers across Pakistan and the Gulf with AI resume engineering, ATS optimization, and career tools.',
    url: 'https://joinsophi.com/about',
    siteName: 'Sophi'
  }
};

const breadcrumbSchema = createBreadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'About', url: '/about' }
]);

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="schema-breadcrumb-about"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
