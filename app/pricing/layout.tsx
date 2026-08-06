import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing & Credit Packages — Sophi AI CV Builder',
  description: 'Flexible, affordable credit packages for Pakistani professionals. Unlock ATS audits, CV rewriting, job tailoring, and LinkedIn optimization.',
  alternates: { canonical: 'https://joinsophi.com/pricing' },
  openGraph: {
    title: 'Pricing & Credit Packages — Sophi AI CV Builder',
    description: 'Flexible, affordable credit packages for Pakistani professionals. Unlock ATS audits, CV rewriting, job tailoring, and LinkedIn optimization.',
    url: 'https://joinsophi.com/pricing',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
