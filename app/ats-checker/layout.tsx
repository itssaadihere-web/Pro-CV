import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free ATS CV Checker & Resume Scanner | Sophi AI',
  description: 'Audit your CV against 5 ATS dimensions: keyword density, formatting, section structure, & skills match. Get instant score & fixes.',
  alternates: { canonical: 'https://joinsophi.com/ats-checker' },
  openGraph: {
    title: 'Free ATS CV Checker & Resume Scanner | Sophi AI',
    description: 'Audit your CV against 5 ATS dimensions: keyword density, formatting, section structure, & skills match. Get instant score & fixes.',
    url: 'https://joinsophi.com/ats-checker',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
