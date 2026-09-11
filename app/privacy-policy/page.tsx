import React from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Sophi AI',
  description: 'Understand how Sophi collects, uses, protects your data, and complies with Google AdSense, cookies, and privacy standards.',
  alternates: {
    canonical: 'https://joinsophi.com/privacy-policy'
  }
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-4">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        
        <div className="prose prose-slate max-w-none space-y-8 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm leading-relaxed text-slate-700">
          <p className="text-base">
            At <strong>Sophi</strong> (accessible from <Link href="https://joinsophi.com" className="text-primary font-bold hover:underline">https://joinsophi.com</Link>), one of our main priorities is the privacy of our visitors. This Privacy Policy document outlines the types of information that is collected and recorded by Sophi and how we use it.
          </p>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">1. Information We Collect</h2>
            <p className="mb-2">We collect information directly from you when you use our platform, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Information:</strong> Your name, email address, and authentication credentials when you sign in or register.</li>
              <li><strong>Resume & Professional Data:</strong> Employment history, education, skills, contact details, and career summaries contained in the resumes you upload or create.</li>
              <li><strong>Payment Information:</strong> Transaction identifiers and payment status handled securely via our PCI-compliant payment partners (e.g., DirectPay / PayFast). We do not store full credit card or banking credentials on our servers.</li>
              <li><strong>Log Data & Usage Analytics:</strong> IP addresses, browser types, Internet Service Providers (ISP), referring/exit pages, operating system, date/time stamps, and on-page interaction data.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">2. How We Use Your Information</h2>
            <p className="mb-2">We use the collected information for various business and operational purposes, such as:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Generating, analyzing, and formatting ATS-optimized CVs, cover letters, and LinkedIn summaries.</li>
              <li>Processing credit packages, purchases, and providing customer support.</li>
              <li>Improving, personalizing, and expanding the functionality and performance of our AI engine.</li>
              <li>Preventing fraudulent activities, maintaining platform security, and ensuring compliance with applicable laws.</li>
              <li>Communicating with you regarding service updates, transaction receipts, and essential platform notices.</li>
            </ul>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">3. Google AdSense & DoubleClick DART Cookies</h2>
            <p className="mb-3">
              Google is a third-party vendor on our site. It uses cookies, known as <strong>DART cookies</strong>, to serve ads to our site visitors based upon their visit to <code className="bg-slate-100 px-2 py-0.5 rounded text-sm text-slate-900">joinsophi.com</code> and other sites on the internet.
            </p>
            <p className="mb-3">
              Visitors may choose to decline the use of DART cookies by visiting the Google Ad and Content Network Privacy Policy at the following URL:
            </p>
            <p className="mb-4">
              <a 
                href="https://policies.google.com/technologies/ads" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary font-bold hover:underline break-all"
              >
                https://policies.google.com/technologies/ads
              </a>
            </p>
            <p className="mb-2">
              To learn more about how to manage or opt-out of personalized advertising across third-party networks, you can visit:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Google Ads Settings:</strong>{' '}
                <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  https://adssettings.google.com
                </a>
              </li>
              <li>
                <strong>AboutAds (Digital Advertising Alliance):</strong>{' '}
                <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  https://www.aboutads.info/choices/
                </a>
              </li>
              <li>
                <strong>Network Advertising Initiative (NAI):</strong>{' '}
                <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  https://optout.networkadvertising.org/
                </a>
              </li>
            </ul>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">4. Cookies and Web Beacons</h2>
            <p>
              Like any other website, Sophi uses &apos;cookies&apos;. These cookies are used to store information including visitors&apos; preferences, session authentication, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users&apos; experience by customizing our web page content based on visitors&apos; browser type and/or other information.
            </p>
            <p className="mt-3">
              You can choose to disable cookies through your individual browser options. Detailed information about cookie management with specific web browsers can be found at the browsers&apos; respective websites.
            </p>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">5. Third-Party Advertising Partners</h2>
            <p className="mb-3">
              Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on Sophi, which are sent directly to users&apos; browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
            </p>
            <p>
              Note that Sophi has no access to or control over these cookies that are used by third-party advertisers.
            </p>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">6. GDPR Data Protection Rights</h2>
            <p className="mb-2">We want to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>The right to access:</strong> You have the right to request copies of your personal data.</li>
              <li><strong>The right to rectification:</strong> You have the right to request that we correct any information you believe is inaccurate or incomplete.</li>
              <li><strong>The right to erasure:</strong> You have the right to request that we erase your personal data under certain conditions.</li>
              <li><strong>The right to restrict processing:</strong> You have the right to request that we restrict the processing of your personal data.</li>
              <li><strong>The right to data portability:</strong> You have the right to request that we transfer the data that we have collected to another organization, or directly to you.</li>
            </ul>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">7. CCPA Privacy Rights (Do Not Sell My Personal Information)</h2>
            <p className="mb-2">Under the CCPA, among other rights, California consumers have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Request that a business that collects a consumer&apos;s personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.</li>
              <li>Request that a business delete any personal data about the consumer that a business has collected.</li>
              <li>Request that a business that sells a consumer&apos;s personal data, not sell the consumer&apos;s personal data. <strong>Sophi does not sell personal information.</strong></li>
            </ul>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">8. Children&apos;s Information</h2>
            <p>
              Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity. Sophi does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
            </p>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">9. Contact Us</h2>
            <p className="mb-2">
              If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact our Data Protection and Support team:
            </p>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mt-3 text-sm space-y-1">
              <p><strong>Platform:</strong> Sophi AI (<Link href="/" className="text-primary font-bold hover:underline">joinsophi.com</Link>)</p>
              <p><strong>Email:</strong> <a href="mailto:support@joinsophi.com" className="text-primary font-bold hover:underline">support@joinsophi.com</a></p>
              <p><strong>Contact Page:</strong> <Link href="/contact" className="text-primary font-bold hover:underline">joinsophi.com/contact</Link></p>
              <p><strong>Location:</strong> Karachi, Pakistan</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
