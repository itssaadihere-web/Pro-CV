import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy | Sophi AI CV Builder',
  description: 'Read Sophi’s refund policy and terms for credit purchases and AI CV services.',
  alternates: { canonical: 'https://joinsophi.com/refund-policy' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
