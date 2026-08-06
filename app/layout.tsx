import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ConditionalFooter from "@/components/ConditionalFooter";
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';
import { organizationSchema } from '@/lib/schema';
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://joinsophi.com'),
  title: {
    default: 'Sophi — AI CV Builder Pakistan | ATS-Optimized Resume in Minutes',
    template: '%s | Sophi — AI CV Builder'
  },
  description: 'Upload or build your CV with AI to get an ATS-optimized resume. Gap analysis, job tailoring & LinkedIn optimizer for career success.',
  keywords: [
    'AI CV builder Pakistan', 'ATS resume builder', 'CV maker online Pakistan',
    'professional CV writer', 'ATS optimized resume', 'AI resume writer',
    'CV optimization', 'AI resume', 'JoinSophi', 'Sophi CV'
  ],
  authors: [{ name: 'Sophi', url: 'https://joinsophi.com' }],
  creator: 'Sophi',
  publisher: 'Sophi',
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
      'msvalidate.01': 'A26A4092BA4395B941A91E71E6180738' // CRITICAL for ChatGPT indexing
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-slate-800 bg-slate-50`}
      >
        <Script
          id="schema-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Toaster position="top-center" reverseOrder={false} />
        {children}
        <ConditionalFooter />
        <Script id="google-analytics-lazy" strategy="afterInteractive">
          {`
            (function() {
              var loaded = false;
              function loadGtag() {
                if (loaded) return;
                loaded = true;
                var script = document.createElement('script');
                script.async = true;
                script.src = 'https://www.googletagmanager.com/gtag/js?id=G-8YEPSJ9MP3';
                document.head.appendChild(script);
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', 'G-8YEPSJ9MP3', { page_path: window.location.pathname });
              }
              if (typeof window !== 'undefined') {
                ['scroll', 'mousemove', 'touchstart', 'keydown', 'click'].forEach(function(evt) {
                  window.addEventListener(evt, loadGtag, { once: true, passive: true });
                });
                setTimeout(loadGtag, 4500);
              }
            })();
          `}
        </Script>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
