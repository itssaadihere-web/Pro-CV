import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How Sophi Works — 3-Step AI CV Transformation',
  description: 'Learn how Sophi AI audits ATS scores, identifies career gaps, restructures bullets with STAR-method metrics, and delivers interview-ready CVs.',
  alternates: { canonical: 'https://joinsophi.com/how-it-works' },
  openGraph: {
    title: 'How Sophi Works — 3-Step AI CV Transformation',
    description: 'Learn how Sophi AI audits ATS scores, identifies career gaps, restructures bullets with STAR-method metrics, and delivers interview-ready CVs.',
    url: 'https://joinsophi.com/how-it-works',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
