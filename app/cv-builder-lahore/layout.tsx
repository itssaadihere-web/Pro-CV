import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI CV Builder Lahore — ATS Resumes for Tech & FMCG Roles',
  description: 'Build ATS-compliant resumes tailored for Lahore tech hubs, startups, and FMCG companies. Instant AI rewriting and STAR bullets.',
  alternates: { canonical: 'https://joinsophi.com/cv-builder-lahore' },
  openGraph: {
    title: 'AI CV Builder Lahore — ATS Resumes for Tech & FMCG Roles',
    description: 'Build ATS-compliant resumes tailored for Lahore tech hubs, startups, and FMCG companies. Instant AI rewriting and STAR bullets.',
    url: 'https://joinsophi.com/cv-builder-lahore',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
