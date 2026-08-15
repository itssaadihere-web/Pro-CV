import { Metadata } from 'next';
import Script from 'next/script';
import PricingClient from '@/components/PricingClient';
import { pricingOfferSchema, createBreadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Pricing & Packages — Affordable AI CV Builder Pakistan | Sophi',
  description: 'Affordable AI CV builder pricing in Pakistan. Get an ATS-optimized resume, cover letter, LinkedIn profile optimizer & PDF export for 1500 PKR.',
  keywords: [
    'AI CV builder pricing Pakistan', 'resume maker cost Pakistan', 'Sophi CV packages',
    'cheap ATS resume builder', 'CV writing service price Karachi Lahore Islamabad'
  ],
  alternates: {
    canonical: 'https://joinsophi.com/pricing'
  },
  openGraph: {
    title: 'Sophi AI CV Builder Pricing & Credit Packages',
    description: 'Complete AI CV transformation for 1500 PKR. Includes ATS audit, STAR bullets, LinkedIn optimizer & 49 PDF exports.',
    url: 'https://joinsophi.com/pricing',
    siteName: 'Sophi',
    type: 'website',
    images: [{ url: 'https://joinsophi.com/og/home.png', width: 1200, height: 630, alt: 'Sophi Pricing' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sophi AI CV Builder Pricing & Credit Packages',
    description: 'Complete AI CV transformation for 1500 PKR.',
    images: ['https://joinsophi.com/og/home.png']
  }
};

export default function PricingPage() {
  const breadcrumb = createBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Pricing', url: '/pricing' }
  ]);

  return (
    <>
      <Script
        id="pricing-offer-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingOfferSchema) }}
      />
      <Script
        id="pricing-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <PricingClient />
    </>
  );
}
