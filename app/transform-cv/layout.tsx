import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '30-Second AI CV Revamp & Restructure | Sophi',
  description: 'Upload your current PDF or Word CV and let advanced AI rewrite it into an ATS-optimized professional resume in under 30 seconds.',
  alternates: { canonical: 'https://joinsophi.com/transform-cv' },
  openGraph: {
    title: '30-Second AI CV Revamp & Restructure | Sophi',
    description: 'Upload your current PDF or Word CV and let advanced AI rewrite it into an ATS-optimized professional resume in under 30 seconds.',
    url: 'https://joinsophi.com/transform-cv',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
