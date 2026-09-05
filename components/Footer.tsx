import React from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { LinkedinIcon, InstagramIcon, FacebookIcon } from './SocialIcons';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 items-start">
          
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center justify-center rounded-full bg-white p-2.5 shadow-md border-2 border-slate-700 hover:scale-105 transition-all">
              <Logo width={72} height={72} showTagline={false} />
            </Link>
            <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
              AI-powered CV builder for professionals in Pakistan. Optimize your resume for ATS and get hired faster.
            </p>

            {/* Official Social Media Handles */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://www.linkedin.com/company/joinsophi/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sophi LinkedIn"
                title="Follow Sophi on LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-slate-300 hover:bg-[#c5a059] hover:text-slate-950 transition-all border border-slate-700 shadow-xs"
              >
                <LinkedinIcon className="h-4 w-4" />
              </a>
              <a
                href="https://www.instagram.com/joinsophi/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sophi Instagram"
                title="Follow Sophi on Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-slate-300 hover:bg-[#c5a059] hover:text-slate-950 transition-all border border-slate-700 shadow-xs"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61591961077475"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sophi Facebook"
                title="Follow Sophi on Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-slate-300 hover:bg-[#c5a059] hover:text-slate-950 transition-all border border-slate-700 shadow-xs"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Sophi Platform</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/ai-cv-builder-app" className="hover:text-[#c5a059] transition-colors font-medium text-white">AI CV Builder App</Link></li>
              <li><Link href="/ats-checker" className="hover:text-[#c5a059] transition-colors">ATS CV Checker</Link></li>
              <li><Link href="/templates" className="hover:text-[#c5a059] transition-colors">CV Templates</Link></li>
              <li><Link href="/pricing" className="hover:text-[#c5a059] transition-colors">Pricing & Plans</Link></li>
              <li><Link href="/tailor-cv" className="hover:text-[#c5a059] transition-colors">Job CV Tailoring</Link></li>
              <li><Link href="/linkedin-optimizer" className="hover:text-[#c5a059] transition-colors">LinkedIn Optimizer</Link></li>
              <li><Link href="/sophi-vs-rezi" className="hover:text-[#c5a059] transition-colors text-slate-400">Sophi vs Rezi</Link></li>
              <li><Link href="/sophi-vs-kickresume" className="hover:text-[#c5a059] transition-colors text-slate-400">Sophi vs Kickresume</Link></li>
              <li><Link href="/how-it-works" className="hover:text-[#c5a059] transition-colors">How It Works</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Legal & Info</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-[#c5a059] transition-colors">About Sophi</Link></li>
              <li><Link href="/blog" className="hover:text-[#c5a059] transition-colors">Career Advice & Blog</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-[#c5a059] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-and-conditions" className="hover:text-[#c5a059] transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/refund-policy" className="hover:text-[#c5a059] transition-colors">Return & Refund Policy</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact & Connect</h3>
            <address className="not-italic text-sm space-y-2 text-slate-400">
              <p>
                <a href="mailto:support@joinsophi.com" className="hover:text-[#c5a059] transition-colors">support@joinsophi.com</a>
              </p>
            </address>

            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <p className="font-bold text-slate-300">Follow Our Official Pages:</p>
              <div className="flex flex-wrap gap-2 text-xs">
                <a href="https://www.linkedin.com/company/joinsophi/" target="_blank" rel="noopener noreferrer" className="text-[#c5a059] hover:underline">LinkedIn</a>
                <span>•</span>
                <a href="https://www.instagram.com/joinsophi/" target="_blank" rel="noopener noreferrer" className="text-[#c5a059] hover:underline">Instagram</a>
                <span>•</span>
                <a href="https://www.facebook.com/profile.php?id=61591961077475" target="_blank" rel="noopener noreferrer" className="text-[#c5a059] hover:underline">Facebook</a>
              </div>
            </div>
          </div>

        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-800 text-sm text-center">
          <p className="text-white font-medium">&copy; 2025 All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
