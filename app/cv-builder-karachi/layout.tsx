import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI CV Builder Karachi — Tailored for Local & Corporate Jobs',
  description: 'Create an ATS-optimized CV engineered for corporate headquarters, finance, and tech employers in Karachi. Land interviews faster.',
  alternates: { canonical: 'https://joinsophi.com/cv-builder-karachi' },
  openGraph: {
    title: 'AI CV Builder Karachi — Tailored for Local & Corporate Jobs',
    description: 'Create an ATS-optimized CV engineered for corporate headquarters, finance, and tech employers in Karachi. Land interviews faster.',
    url: 'https://joinsophi.com/cv-builder-karachi',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
