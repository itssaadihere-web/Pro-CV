export async function generateBlogPostWithGemini(existingTitles: string[] = []): Promise<{
  title: string;
  content: string;
  description: string;
  primary_keyword: string;
  featured_image_keyword?: string
} | null> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_key_here' || apiKey.includes('placeholder')) {
    console.warn('⚠️ GEMINI API KEY not set. Cannot generate blog post.');
    return null;
  }

  const existingTitlesFormatted = existingTitles.length > 0
    ? existingTitles.map((t, idx) => `  ${idx + 1}. "${t}"`).join('\n')
    : '  (No previous blog titles recorded yet)';

  const prompt = `You are an expert SEO content strategist and elite career coach for "Sophi — AI CV Builder" (JoinSophi.com), specializing in Pakistani, Gulf (UAE, KSA, Qatar), and global remote job markets.

YOUR CRITICAL MANDATE: TOPIC DIVERSITY & UNIQUENESS
You must generate a 100% UNIQUE, highly engaging, actionable blog article. 
DO NOT write another generic "ATS Resume Optimization in Pakistan" overview! We already have enough general ATS articles.

ALREADY PUBLISHED TITLES (DO NOT WRITE ABOUT THESE TOPICS OR REPEAT SIMILAR TITLES):
${existingTitlesFormatted}

CHOOSE ONE SPECIFIC TOPIC FROM THE FOLLOWING CONTENT PILLARS (Pick a niche topic that is NOT covered above):

PILLAR 1: RESUME & ATS TACTICAL DEEP DIVE
- How to Write STAR-Method CV Bullet Points that Pass Applicant Tracking Systems
- Single-Column vs Multi-Column Resume Templates: What ATS Engines Actually Parse
- Decoding ATS Filters: How Workday, Taleo, Greenhouse & Lever Score Your Resumes
- The 25 Most High-Yield Technical & Soft Skill Keywords for Pakistani Corporate CVs
- How to Structure a High-Impact Executive Summary for Fresh Graduates (0-2 Yrs Experience)
- Formatting Education, Certifications & Licenses for International Credential Verification

PILLAR 2: INDUSTRY-SPECIFIC CAREER & RESUME GUIDES
- Software Engineer & Tech CV Guide: Formatting GitHub, Tech Stacks & System Design Achievements
- FMCG & Supply Chain Resume Writing: Highlighting Logistics, Distribution & KPI Metrics
- Banking, Audit & Finance CV Guide: Quantifying Financial Analysis & Portfolio Management
- Customer Support & BPO Career Guide: Converting Communication Skills into ATS Scores
- Civil, Electrical & Mechanical Engineering CV Guide for Pakistan & Gulf Employers
- Marketing & Digital Growth Resume Guide: Listing Conversion Metrics, ROAS & Campaigns

PILLAR 3: CROSS-BORDER & REGIONAL MARKET STRATEGIES
- Transitioning from Pakistan to the Gulf (UAE, KSA, Qatar): Formatting Your CV for Arab Recruiters
- Landing US/UK/EU Remote Jobs from Pakistan: Resume, LinkedIn & Tax/Payment Setup
- Rozee.pk vs LinkedIn vs Sophi Careers: Where Pakistani Employers Actually Recruit
- Handling Currency, PKR/USD Salary Expectations & Relocation Preferences on CVs

PILLAR 4: SPECIAL CAREER SITUATIONS & CAREER GAPS
- How to Explain Employment Gaps (Sabbatical, Upskilling, Family) Positively on Your Resume
- Transitioning Careers: How to Format Transferable Skills when Switching Industries
- Freelance & Contract Work to Corporate Full-Time: How to Present Gig Experience on a Resume
- Overcoming Career Demotions or Layoffs: Framing Career Pivot Achievements

PILLAR 5: LINKEDIN OPTIMIZATION & RECRUITER INBOUND
- LinkedIn Headline Formulas That Trigger Recruiter Inbound Direct Messages in Pakistan
- Writing an Executive LinkedIn 'About' Summary That Converts Views into Interviews
- Aligning Your ATS CV with Your LinkedIn Profile for 10x Profile Views
- How Recruiters Use 'LinkedIn Recruiter' Boolean Search Filters in Pakistan & Dubai

PILLAR 6: INTERVIEW STRATEGY & SALARY NEGOTIATION
- How to Answer 'Tell Me About Yourself' by Leveraging Your ATS Resume Bullet Points
- Salary Negotiation Strategies in Pakistan: How to Negotiate Performance Bonuses & Allowance
- Post-Application Etiquette: How to Follow Up with HR after Submitting Your CV Online

OUTPUT RULES:
1. Return ONLY a single valid JSON object. No markdown fences. No text before or after. Start directly with {
2. The "content" field must be valid HTML — use <h2> and <h3> for headings.
3. Use SINGLE QUOTES for HTML attributes (e.g. <div class='tldr-box'>, <a href='https://joinsophi.com'>) so you never need to escape double quotes. Use HTML entities (&rsquo;, &ldquo;, &rdquo;) for quotes/apostrophes in text.
4. Keep JSON compact without unescaped newlines (use \\n).

ARTICLE STRUCTURE & REQUIREMENTS:
- Word count: 1,500–1,800 words total.
- TL;DR Box at top: <div class='tldr-box'><p><strong>TL;DR:</strong></p><ul><li>Point 1</li><li>Point 2</li><li>Point 3</li></ul></div>
- DYNAMIC H2 SECTION HEADINGS: Create 5-6 logical, topic-specific H2 headings tailored to your chosen topic. (Do NOT use static generic headings!)
- Quick Answer Callout immediately under EACH <h2> heading:
  <div class='quick-answer'><strong>Quick Answer:</strong> [35-40 word direct answer to the section question]</div>
- Sophi CTA Block 1 (after H2 section 2):
  <div class='cta-block'><p>Ready to transform your CV in 60 seconds? <a href='https://joinsophi.com'>Try Sophi AI CV Builder</a> — ATS-optimized in under a minute for just 1500 PKR. No fluff, no waiting.</p></div>
- Inline Image (between H2 section 3 and H2 section 4):
  <img src='https://picsum.photos/seed/career-growth/800/400' alt='[primary keyword] guide for Pakistani job seekers' class='w-full h-auto rounded-3xl my-10 shadow-sm object-cover' />
- Sophi CTA Block 2 (at the very end before closing paragraph):
  <div class='cta-block'><p>Don't let a weak CV cost you the interview. <a href='https://joinsophi.com'>Build your ATS-ready resume with Sophi</a> in 60 seconds — starting at 1500 PKR.</p></div>
- Include natural internal links: joinsophi.com and career.joinsophi.com.
- FAQ Section with schema markup (under H2 section 6):
  <div class='faq-section'>
    <div class='faq-item'><h3>Question 1?</h3><p>Answer (40-60 words)</p></div>
    <div class='faq-item'><h3>Question 2?</h3><p>Answer (40-60 words)</p></div>
    <div class='faq-item'><h3>Question 3?</h3><p>Answer (40-60 words)</p></div>
  </div>

OUTPUT JSON SCHEMA:
{
  "title": "Topic-specific title — 50-60 chars, enticing, includes primary keyword near start",
  "url_slug": "lowercase-hyphenated-slug-under-60-chars",
  "description": "Meta description — 150–155 chars with primary keyword and clear benefit",
  "primary_keyword": "Primary targeted keyword phrase",
  "secondary_keywords": ["3-5 related secondary keyword phrases"],
  "featured_image_keyword": "career,office",
  "inline_image_keyword": "resume,interview",
  "content": "<full HTML article content>"
}`;

  try {
    const modelsToTry = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-2.5-flash', 'gemini-flash-latest'];

    for (const model of modelsToTry) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.8 },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          let textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (textOutput) {
            textOutput = textOutput.replace(/```json/gi, '').replace(/```/g, '').trim();
            return JSON.parse(textOutput);
          }
        } else {
          console.warn(`⚠️ Model ${model} returned status ${response.status}`);
        }
      } catch (err) {
        console.warn(`⚠️ Error calling model ${model}:`, err);
      }
    }

    return null;
  } catch (error) {
    console.error('❌ Error communicating with Gemini API for blog generation:', error);
    return null;
  }
}
