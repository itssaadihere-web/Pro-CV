import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us — Sophi AI Customer & Technical Support',
  description: 'Get in touch with the Sophi team for customer support, enterprise inquiries, billing assistance, or career platform questions.',
  keywords: [
    'contact Sophi', 'Sophi AI support', 'Sophi CV builder help',
    'contact resume engineer', 'Sophi customer service Pakistan'
  ],
  alternates: {
    canonical: 'https://joinsophi.com/contact'
  },
  openGraph: {
    title: 'Contact Sophi AI Support & Inquiries',
    description: 'We are here to help. Reach out for technical support, billing inquiries, or feedback.',
    url: 'https://joinsophi.com/contact',
    siteName: 'Sophi',
    type: 'website',
    images: [{ url: 'https://joinsophi.com/og/home.png', width: 1200, height: 630, alt: 'Contact Sophi AI' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Sophi AI Support',
    description: 'Reach out to the Sophi team for assistance and inquiries.',
    images: ['https://joinsophi.com/og/home.png']
  }
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
