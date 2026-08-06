import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tailor CV to Job Description | AI Resume Alignment | Sophi',
  description: 'Paste any target job description and let AI tailor your bullet points, skills, and summary for maximum ATS match and recruiter response.',
  alternates: { canonical: 'https://joinsophi.com/tailor-cv' },
  openGraph: {
    title: 'Tailor CV to Job Description | AI Resume Alignment | Sophi',
    description: 'Paste any target job description and let AI tailor your bullet points, skills, and summary for maximum ATS match and recruiter response.',
    url: 'https://joinsophi.com/tailor-cv',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
