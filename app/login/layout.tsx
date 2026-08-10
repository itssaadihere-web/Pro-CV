import type { Metadata } from 'next';
import Script from 'next/script';
import { createBreadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Sign In to Sophi | AI CV Builder Account',
  description: 'Log in to your Sophi AI CV account to manage your resumes, access ATS score reports, optimize for job postings, and export PDF CVs.',
  alternates: {
    canonical: 'https://joinsophi.com/login'
  },
  openGraph: {
    title: 'Sign In to Sophi | AI CV Builder Account',
    description: 'Log in to your Sophi AI CV account to manage your resumes, access ATS score reports, optimize for job postings, and export PDF CVs.',
    url: 'https://joinsophi.com/login',
    siteName: 'Sophi'
  }
};

const breadcrumbSchema = createBreadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'Login', url: '/login' }
]);

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="schema-breadcrumb-login"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
