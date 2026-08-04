import React from 'react';
import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center justify-center rounded-full bg-white p-2.5 shadow-md border-2 border-slate-700 hover:scale-105 transition-all">
              <Logo width={72} height={72} showTagline={false} />
            </Link>
            <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
              AI-powered CV builder for professionals in Pakistan. Optimize your resume for ATS and get hired faster.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy-policy" className="hover:text-[#c5a059] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-[#c5a059] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-[#c5a059] transition-colors">
                  Return & Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Us</h3>
            <address className="not-italic text-sm space-y-2 text-slate-400">
              <p>
                <a href="tel:+923362500595" className="hover:text-[#c5a059] transition-colors">+92 336 2500 595</a>
              </p>
              <p>
                <a href="mailto:support@joinsophi.com" className="hover:text-[#c5a059] transition-colors">support@joinsophi.com</a>
              </p>
            </address>
          </div>

        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-800 text-sm text-center">
          <p className="text-white font-medium">&copy; 2025 All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
