import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI CV Builder Islamabad & Rawalpindi — Executive Resume Writer',
  description: 'Craft high-impact ATS resumes for tech, government, NGO, and corporate hiring managers across Islamabad & Rawalpindi.',
  alternates: { canonical: 'https://joinsophi.com/cv-builder-islamabad' },
  openGraph: {
    title: 'AI CV Builder Islamabad & Rawalpindi — Executive Resume Writer',
    description: 'Craft high-impact ATS resumes for tech, government, NGO, and corporate hiring managers across Islamabad & Rawalpindi.',
    url: 'https://joinsophi.com/cv-builder-islamabad',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
