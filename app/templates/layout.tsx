import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '49 Professional ATS CV Templates | Sophi',
  description: 'Browse recruiter-tested, ATS-compliant CV templates. Export high-impact PDF resumes styled for executive, corporate, and tech roles.',
  alternates: { canonical: 'https://joinsophi.com/templates' },
  openGraph: {
    title: '49 Professional ATS CV Templates | Sophi',
    description: 'Browse recruiter-tested, ATS-compliant CV templates. Export high-impact PDF resumes styled for executive, corporate, and tech roles.',
    url: 'https://joinsophi.com/templates',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
