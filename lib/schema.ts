export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Sophi",
  "alternateName": "JoinSophi",
  "url": "https://joinsophi.com",
  "logo": "https://joinsophi.com/images/logo.svg",
  "description": "AI-powered CV builder for Pakistani professionals. ATS-optimized resumes, cover letters, and LinkedIn optimization powered by advanced AI.",
  "foundingDate": "2024",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "email": "support@joinsophi.com",
    "availableLanguage": ["English", "Urdu"]
  },
  "sameAs": [
    "https://twitter.com/JoinSophi",
    "https://linkedin.com/company/joinsophi",
    "https://instagram.com/joinsophi"
  ]
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Sophi",
  "alternateName": ["JoinSophi", "Sophi AI", "joinsophi.com", "Sophi CV"],
  "url": "https://joinsophi.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://joinsophi.com/blog?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

export const siteNavigationSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Sophi Main Navigation",
  "itemListElement": [
    {
      "@type": "SiteNavigationElement",
      "position": 1,
      "name": "Sign In / Login",
      "description": "Log in to your Sophi AI account to manage CVs, ATS reports, and career documents.",
      "url": "https://joinsophi.com/login"
    },
    {
      "@type": "SiteNavigationElement",
      "position": 2,
      "name": "ATS Score Checker",
      "description": "Check your resume ATS compatibility score and get instant AI recommendations.",
      "url": "https://joinsophi.com/ats-checker"
    },
    {
      "@type": "SiteNavigationElement",
      "position": 3,
      "name": "CV Templates",
      "description": "Explore 49 ATS-optimized, recruiter-approved professional CV templates.",
      "url": "https://joinsophi.com/templates"
    },
    {
      "@type": "SiteNavigationElement",
      "position": 4,
      "name": "Pricing & Packages",
      "description": "Affordable AI CV builder pricing and credit packages for job seekers.",
      "url": "https://joinsophi.com/pricing"
    },
    {
      "@type": "SiteNavigationElement",
      "position": 5,
      "name": "Job CV Tailoring",
      "description": "Tailor your CV for specific job descriptions to pass ATS screeners.",
      "url": "https://joinsophi.com/tailor-cv"
    },
    {
      "@type": "SiteNavigationElement",
      "position": 6,
      "name": "LinkedIn Profile Optimizer",
      "description": "Optimize your LinkedIn profile headline, summary, and experience sections.",
      "url": "https://joinsophi.com/linkedin-optimizer"
    },
    {
      "@type": "SiteNavigationElement",
      "position": 7,
      "name": "How Sophi Works",
      "description": "Learn how Sophi AI transforms resumes into ATS-optimized job applications.",
      "url": "https://joinsophi.com/how-it-works"
    },
    {
      "@type": "SiteNavigationElement",
      "position": 8,
      "name": "Sophi Careers",
      "description": "AI-matched jobs for Pakistani and Gulf professionals on Sophi Careers.",
      "url": "https://career.joinsophi.com"
    }
  ]
};

export function createBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url.startsWith("http") ? item.url : `https://joinsophi.com${item.url}`
    }))
  };
}

export const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Sophi AI CV Builder",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web Browser",
  "description": "Upload your existing CV or build from scratch to receive an AI-rewritten, ATS-optimized career document with LinkedIn optimizer, cover letter, and professional PDF export.",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "247",
    "bestRating": "5"
  },
  "featureList": [
    "ATS Score Analysis (5 dimensions)",
    "AI CV Rewriting powered by advanced AI",
    "Keyword Intelligence (12 industries, 500+ keywords)",
    "LinkedIn Profile Optimizer",
    "AI Cover Letter Generator",
    "Gap Analysis with Quick Wins",
    "49 Professional CV Templates",
    "PDF Export (3 template styles)",
    "Multi-language (EN/AR/FR/ES)",
    "Email delivery"
  ]
};

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What are the most common reasons an ATS rejects a resume before a human ever sees it?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "An ATS (Applicant Tracking System) rejects resumes primarily due to missing industry keywords, complex multi-column formatting, graphics/tables that block text parsing, unparseable PDF headers/footers, and non-standard section titles. Sophi AI restructures your resume into single-column ATS-safe formatting and injects required keywords to prevent auto-rejection."
      }
    },
    {
      "@type": "Question",
      "name": "How do I format my resume so that applicant tracking systems can read it correctly?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "To format a resume for ATS compliance, use a clean single-column layout, standard web-safe fonts (Geist, Inter, Arial), standard section headings (Work Experience, Education, Skills), STAR-metric bullet points (Action Verb + Context + Result), and export as a clean text-searchable PDF. Sophi AI automatically formats your CV to pass 100% of corporate ATS screeners."
      }
    },
    {
      "@type": "Question",
      "name": "Which keywords should I include in my resume to pass ATS screening for corporate jobs in Pakistan?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "For corporate jobs in Pakistan (Karachi, Lahore, Islamabad), include role-specific hard skills (e.g. Financial Analysis, React.js, FMCG Supply Chain, Project Management), quantitative metrics (e.g. Increased revenue by 35%), tool proficiencies (SAP, Excel, Python), and exact terms matched from job descriptions. Sophi AI analyzes top employer requirements across Pakistan to auto-inject high-ranking keywords."
      }
    },
    {
      "@type": "Question",
      "name": "How do I check if my resume is ATS-compatible before submitting a job application?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can check ATS compatibility using Sophi's free ATS CV Checker at joinsophi.com/ats-checker. Sophi evaluates your document across 5 dimensions: keyword density, formatting safety, section structure, experience depth, and skills match, providing an instant score and quick-fix recommendations."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between a resume that passes ATS and one that gets filtered out?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A passing resume contains 80%+ keyword alignment with the job posting, uses recruiter-preferred single-column ATS layouts, and quantifies achievements using STAR metrics. Filtered-out resumes use heavy graphics, columns, generic bullet points, or lack target job description keywords."
      }
    },
    {
      "@type": "Question",
      "name": "How do I customize my CV for different job roles advertised on Pakistani job portals like Rozee.pk or Sophi Careers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Use Sophi's Job Tailoring Tool at joinsophi.com/tailor-cv. Paste the job description from Rozee.pk, LinkedIn, or Sophi Careers, and Sophi AI will realign your summary, work experience bullets, and skills section to match the job requirements in under 30 seconds."
      }
    },
    {
      "@type": "Question",
      "name": "What are the most important sections of a LinkedIn profile that recruiters in Pakistan look at first?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Pakistani corporate and tech recruiters focus first on your Headline (must include target job title and core keywords), About Summary (3-line hook with career highlights), Work Experience (STAR accomplishment bullets), and Featured Skills. Sophi LinkedIn Optimizer generates these high-converting profile sections automatically."
      }
    },
    {
      "@type": "Question",
      "name": "How do I explain a gap in my employment history when applying for jobs in Pakistan?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Frame employment gaps positively by highlighting freelance projects, upskilling, certifications, or consulting work during that timeframe. Focus on continuous professional growth in your executive summary. Sophi AI automatically formats gap years using value-oriented framing."
      }
    },
    {
      "@type": "Question",
      "name": "What CV format is most compatible with ATS systems?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The chronological single-column PDF or DOCX format is 100% compatible with ATS systems like Taleo, Workday, Greenhouse, and Lever. Sophi AI uses 49 recruiter-approved, single-column templates designed specifically for ATS parsing safety."
      }
    }
  ]
};

export const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Transform Your CV with Sophi AI",
  "description": "Use Sophi's AI to rewrite or build your CV into an ATS-optimized professional document in 3 steps",
  "totalTime": "PT5M",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Upload CV or Start from Scratch",
      "text": "Upload your existing CV or create a new professional resume using our guided CV builder.",
      "position": 1
    },
    {
      "@type": "HowToStep",
      "name": "Upload your existing CV",
      "text": "Upload your current CV in PDF or DOCX format. Select your target industry, paste an optional job description, and choose your preferred language.",
      "position": 2
    },
    {
      "@type": "HowToStep",
      "name": "Download your AI-rewritten CV",
      "text": "In under 60 seconds, receive your ATS-optimized CV, LinkedIn optimizer, cover letter, and gap analysis. Download as PDF or receive via email.",
      "position": 3
    }
  ]
};

export function blogPostSchema(post: {
  title: string
  description: string
  slug: string
  publishedAt: string
  updatedAt: string
  authorName: string
  imageUrl: string
  wordCount: number
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.description,
    "url": `https://joinsophi.com/blog/${post.slug}`,
    "datePublished": post.publishedAt,
    "dateModified": post.updatedAt,
    "author": {
      "@type": "Person",
      "name": post.authorName,
      "url": "https://joinsophi.com/about"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Sophi",
      "logo": {
        "@type": "ImageObject",
        "url": "https://joinsophi.com/images/logo.svg"
      }
    },
    "image": post.imageUrl,
    "wordCount": post.wordCount,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://joinsophi.com/blog/${post.slug}`
    }
  };
}
