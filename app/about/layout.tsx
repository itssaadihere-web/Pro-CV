import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Sophi — Next-Gen AI CV Platform for Pakistan',
  description: 'Empowering Pakistani job seekers with AI-driven resume engineering, ATS optimization, and recruiter-focused career tools.',
  alternates: { canonical: 'https://joinsophi.com/about' },
  openGraph: {
    title: 'About Sophi — Next-Gen AI CV Platform for Pakistan',
    description: 'Empowering Pakistani job seekers with AI-driven resume engineering, ATS optimization, and recruiter-focused career tools.',
    url: 'https://joinsophi.com/about',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
