import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ConditionalFooter from "@/components/ConditionalFooter";
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';
import { organizationSchema, websiteSchema, siteNavigationSchema } from '@/lib/schema';
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
  preload: true,
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://joinsophi.com'),
  title: {
    default: 'Sophi — #1 AI CV Builder Pakistan | ATS-Optimized Resumes',
    template: '%s | Sophi AI'
  },
  description: 'Sophi is Pakistan\'s leading AI CV Builder. Upload or create your ATS-optimized resume, gap analysis, job tailoring & LinkedIn profile optimizer with Sophi.',
  keywords: [
    'Sophi', 'Sophi AI', 'Sophi CV', 'Sophi ATS', 'Sophi Resume', 'Sophi Pakistan',
    'JoinSophi', 'Sophi CV builder', 'AI CV builder Pakistan', 'ATS resume builder',
    'CV maker online Pakistan', 'professional CV writer', 'ATS optimized resume'
  ],
  authors: [{ name: 'Sophi', url: 'https://joinsophi.com' }],
  creator: 'Sophi',
  publisher: 'Sophi',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    shortcut: ['/favicon.ico'],
    apple: [
      { url: '/icon.svg', type: 'image/svg+xml' }
    ]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['ur_PK'],
    url: 'https://joinsophi.com',
    siteName: 'Sophi',
    title: 'Sophi — AI CV Builder Pakistan | ATS-Optimized Resume in Minutes',
    description: 'Upload or build your CV with AI to get an ATS-optimized resume. Gap analysis, job tailoring & LinkedIn optimizer for career success.',
    images: [
      {
        url: 'https://joinsophi.com/og/home.png',
        secureUrl: 'https://joinsophi.com/og/home.png',
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: 'Sophi AI CV Builder — ATS-Optimized Resumes for Pakistani Professionals'
      },
      {
        url: 'https://joinsophi.com/og-image.png',
        secureUrl: 'https://joinsophi.com/og-image.png',
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: 'Sophi AI CV Builder'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sophi — AI CV Builder Pakistan | ATS-Optimized Resume in Minutes',
    description: 'Upload or build your CV with AI to get an ATS-optimized resume. Gap analysis, job tailoring & LinkedIn optimizer for career success.',
    site: '@JoinSophi',
    creator: '@JoinSophi',
    images: ['https://joinsophi.com/og/home.png']
  },
  alternates: {
    canonical: 'https://joinsophi.com'
  },
  verification: {
    google: 'GOOGLE_SEARCH_CONSOLE_TOKEN',
    other: {
      'msvalidate.01': 'A26A4092BA4395B941A91E71E6180738', // CRITICAL for ChatGPT indexing
      'google-adsense-account': 'ca-pub-7315986629947930'
    }
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="google-adsense-account" content="ca-pub-7315986629947930" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7315986629947930"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-slate-800 bg-slate-50`}
      >
        <Script
          id="trustpilot-widget"
          strategy="beforeInteractive"
        >
          {`(function(w,d,s,r,n){w.TrustpilotObject=n;w[n]=w[n]||function(){(w[n].q=w[n].q||[]).push(arguments)};a=d.createElement(s);a.async=1;a.src=r;a.type='text/java'+s;f=d.getElementsByTagName(s)[0];f.parentNode.insertBefore(a,f)})(window,document,'script','https://invitejs.trustpilot.com/tp.min.js','tp');tp('register','jFzskdRd84eBsZA3');`}
        </Script>
        <Script
          id="schema-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Script
          id="schema-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <Script
          id="schema-sitenavigation"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigationSchema) }}
        />
        <Toaster position="top-center" reverseOrder={false} />
        {children}
        <ConditionalFooter />
        
        <Script id="meta-pixel" strategy="lazyOnload">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '2230341081076587');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=2230341081076587&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        <GoogleAnalytics gaId="G-8YEPSJ9MP3" />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
