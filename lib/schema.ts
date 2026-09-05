export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Sophi",
  "legalName": "Sophi AI",
  "alternateName": ["Sophi", "Sophi AI", "JoinSophi", "Sophi CV Builder", "Sophi ATS", "Sophi Pakistan"],
  "url": "https://joinsophi.com",
  "logo": "https://joinsophi.com/images/logo.svg",
  "description": "Sophi is the leading AI-powered CV builder, ATS resume optimizer, and career intelligence platform.",
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
  "alternateName": ["Sophi AI", "JoinSophi", "Sophi CV", "Sophi ATS", "joinsophi.com"],
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

export function createCityCvBuilderSchema(cityName: string, region: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `AI CV Builder & ATS Optimizer for ${cityName} Professionals`,
    "provider": {
      "@type": "Organization",
      "name": "Sophi",
      "url": "https://joinsophi.com"
    },
    "areaServed": {
      "@type": "City",
      "name": cityName,
      "containedInPlace": {
        "@type": "Country",
        "name": region
      }
    },
    "description": `Professional ATS CV creation, resume optimization, and job description tailoring tailored for top corporate employers, tech firms, and multinationals in ${cityName}.`,
    "serviceType": "Resume Engineering & ATS Optimization",
    "offers": {
      "@type": "Offer",
      "price": "1500",
      "priceCurrency": "PKR",
      "availability": "https://schema.org/InStock",
      "url": `https://joinsophi.com/cv-builder-${cityName.toLowerCase()}`
    }
  };
}

export const pricingOfferSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Sophi AI CV Transformation Package",
  "image": "https://joinsophi.com/og/home.png",
  "description": "Complete AI CV optimization package including ATS score audit, STAR metric bullet rewriting, 49 templates, LinkedIn profile optimizer, and cover letter.",
  "brand": {
    "@type": "Brand",
    "name": "Sophi"
  },
  "offers": {
    "@type": "Offer",
    "price": "1500",
    "priceCurrency": "PKR",
    "priceValidUntil": "2027-12-31",
    "itemCondition": "https://schema.org/NewCondition",
    "availability": "https://schema.org/InStock",
    "url": "https://joinsophi.com/pricing"
  }
};

export const aiCvBuilderAppSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Sophi AI CV Builder App",
  "operatingSystem": "All Web Browsers, iOS, Android, Windows, macOS",
  "applicationCategory": "BusinessApplication",
  "applicationSubCategory": "Career & Resume Builder",
  "url": "https://joinsophi.com/ai-cv-builder-app",
  "image": "https://joinsophi.com/og/home.png",
  "description": "Sophi is an AI CV builder and ATS resume optimizer app that creates interview-winning, ATS-compliant resumes with STAR-metric bullet points, LinkedIn optimization, and 49 recruiter-approved templates.",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "512",
    "bestRating": "5",
    "worstRating": "1"
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": "https://joinsophi.com/ai-cv-builder-app"
  },
  "featureList": [
    "5-Dimension ATS Compliance Score Checker",
    "STAR-Formula AI Accomplishment Bullet Rewriter",
    "Job Description Keyword Tailoring (1-Click)",
    "49 Single-Column Recruiter-Approved CV Templates",
    "LinkedIn Profile Optimizer (Headline & Summary)",
    "AI Cover Letter Generator tailored to job postings",
    "Multi-Language CV Generation (EN, AR, FR, ES)",
    "Instant PDF & DOCX Export"
  ]
};

export const aiCvBuilderHowToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Create an ATS-Optimized Resume with Sophi AI CV Builder App",
  "description": "Follow these 4 simple steps to build or revamp a job-winning, ATS-compliant CV using Sophi AI.",
  "totalTime": "PT3M",
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Upload or Start Fresh",
      "text": "Upload your existing CV in PDF/Word format for an instant AI audit, or launch the step-by-step wizard to build a new CV from scratch.",
      "url": "https://joinsophi.com/choice"
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "Add Target Job Description",
      "text": "Paste your target job posting so the Sophi AI engine can extract missing high-impact keywords, hard skills, and certification requirements.",
      "url": "https://joinsophi.com/tailor-cv"
    },
    {
      "@type": "HowToStep",
      "position": 3,
      "name": "AI Refinement & STAR-Metric Rewriting",
      "text": "Let Sophi rewrite your work experience bullets using the STAR formula (Action Verb + Context + Measurable Result) to maximize ATS scores.",
      "url": "https://joinsophi.com/ai-cv-builder-app"
    },
    {
      "@type": "HowToStep",
      "position": 4,
      "name": "Download ATS-Friendly PDF & Cover Letter",
      "text": "Select from 49 recruiter-approved single-column ATS templates and download your finished resume, cover letter, and LinkedIn summary in 1 click.",
      "url": "https://joinsophi.com/templates"
    }
  ]
};

export const aiCvBuilderFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the best AI CV builder app for passing ATS screening?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sophi AI is the top-rated AI CV builder app designed specifically for ATS (Applicant Tracking System) compliance. It evaluates your CV across 5 dimensions, rewrites bullet points into measurable STAR metrics, and guarantees clean single-column PDF templates that parse 100% cleanly in systems like Workday, Taleo, Greenhouse, and Lever."
      }
    },
    {
      "@type": "Question",
      "name": "How does an AI CV builder app improve my resume?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "An AI CV builder analyzes your career history against millions of recruiter benchmarks. It replaces passive phrasing with strong action verbs, injects critical missing industry keywords, quantifies accomplishments with metrics, fixes layout and formatting flaws, and tailors your resume directly to specific job descriptions."
      }
    },
    {
      "@type": "Question",
      "name": "Is Sophi AI CV builder free to try?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, you can run a free ATS score audit on your existing CV, explore 49 ATS templates, and view AI recommendations without entering payment details at joinsophi.com/ats-checker."
      }
    },
    {
      "@type": "Question",
      "name": "What makes Sophi better than Rezi, Kickresume, or Canva?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Unlike Canva (whose graphic templates often fail ATS text parsing) and basic builders, Sophi combines real-time ATS score auditing, STAR-metric bullet rewriting, 1-click job description tailoring, and LinkedIn profile optimization at a fraction of the cost, with deep optimization for global, Gulf, and Pakistani job markets."
      }
    },
    {
      "@type": "Question",
      "name": "Can an AI CV Builder help me write a tailored cover letter and LinkedIn profile?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. When Sophi generates your ATS-optimized resume, it also produces a matching custom cover letter tailored to your target job description and an optimized LinkedIn headline and summary."
      }
    }
  ]
};

export function createComparisonSchema(competitorName: string, competitorUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `Sophi vs ${competitorName}: Best AI CV & Resume Builder Comparison`,
    "description": `Detailed comparison between Sophi AI and ${competitorName}. Compare ATS scoring, pricing, AI rewriting, job tailoring, and templates.`,
    "url": `https://joinsophi.com/sophi-vs-${competitorName.toLowerCase()}`,
    "mainEntity": {
      "@type": "ItemList",
      "name": `Sophi vs ${competitorName} Feature Comparison`,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "ATS Compatibility & 5-Dimension Scoring",
          "description": `Sophi provides real-time 5-dimension ATS scoring, whereas ${competitorName} provides standard checks.`
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "STAR-Metric Bullet Rewriting",
          "description": "Sophi structures all work experience using Action Verb + Context + Metric Result formulas."
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Affordability & Regional Value",
          "description": "Sophi offers flexible, accessible pricing starting at PKR 1500 / $5, compared to expensive monthly subscriptions."
        }
      ]
    }
  };
}

