import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Build CV from Scratch with AI Wizard | Sophi',
  description: 'No existing CV? Easily generate a fresh, professional, ATS-approved CV from scratch using our step-by-step guided AI wizard.',
  alternates: { canonical: 'https://joinsophi.com/new-cv' },
  openGraph: {
    title: 'Build CV from Scratch with AI Wizard | Sophi',
    description: 'No existing CV? Easily generate a fresh, professional, ATS-approved CV from scratch using our step-by-step guided AI wizard.',
    url: 'https://joinsophi.com/new-cv',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
