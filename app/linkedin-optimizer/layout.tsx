import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI LinkedIn Profile Optimizer & Headline Generator | Sophi',
  description: 'Generate high-ranking LinkedIn headlines, profile summaries, and key skills to attract recruiters and land high-paying job offers.',
  alternates: { canonical: 'https://joinsophi.com/linkedin-optimizer' },
  openGraph: {
    title: 'AI LinkedIn Profile Optimizer & Headline Generator | Sophi',
    description: 'Generate high-ranking LinkedIn headlines, profile summaries, and key skills to attract recruiters and land high-paying job offers.',
    url: 'https://joinsophi.com/linkedin-optimizer',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
