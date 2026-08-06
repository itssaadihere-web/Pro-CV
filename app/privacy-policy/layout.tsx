import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Sophi AI CV Builder',
  description: 'Read Sophi’s privacy policy and data security commitments regarding your CV data and account protection.',
  alternates: { canonical: 'https://joinsophi.com/privacy-policy' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
