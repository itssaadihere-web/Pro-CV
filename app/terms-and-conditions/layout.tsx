import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Sophi AI CV Builder',
  description: 'Read the terms of service and usage conditions for using Sophi AI CV Builder platform.',
  alternates: { canonical: 'https://joinsophi.com/terms-and-conditions' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
