export const TARGET_SEO_KEYWORDS = [
  'ats cv template',
  'linkedin optimization',
  'ats friendly cv templates',
  'applicant tracking system resume template',
  'ats score checker free',
  'resume ats format',
  'ats cv maker',
  'ats resume maker',
  'ats resume sample',
  'ats friendly resume format',
  'ats cv format',
  'optimise linkedin profile',
  'free ats resume builder',
  'ats resume builder',
  'sample ats friendly resume',
  'ats friendly resume template',
  'ats resume template',
  'ats resume examples',
  'linked in profile optimization',
  'free ats resume template',
  'linkedin profile optimizer',
  'ats format resume',
  'cv for teaching job in pakistan',
  'ats score checker',
  'ats format cv'
];

export async function generateBlogPostWithGemini(
  existingTitles: string[] = [],
  specificTargetKeyword?: string
): Promise<{
  title: string;
  content: string;
  description: string;
  primary_keyword: string;
  url_slug?: string;
  featured_image_keyword?: string;
} | null> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_key_here' || apiKey.includes('placeholder')) {
    console.warn('⚠️ GEMINI API KEY not set. Cannot generate blog post.');
    return null;
  }

  const existingTitlesFormatted = existingTitles.length > 0
    ? existingTitles.map((t, idx) => `  ${idx + 1}. "${t}"`).join('\n')
    : '  (No previous blog titles recorded yet)';

  const keywordMandate = specificTargetKeyword
    ? `
MANDATORY PRIMARY TARGET KEYWORD FOR THIS ARTICLE:
"${specificTargetKeyword}"
You MUST heavily optimize the entire article for this exact keyword phrase: "${specificTargetKeyword}".
- Title: Must include "${specificTargetKeyword}" naturally (preferably in the first half).
- URL Slug: Must be derived from the title and include "${specificTargetKeyword}".
- First 100 words: Must naturally feature "${specificTargetKeyword}".
- H2 Headings: At least one <h2> or <h3> MUST contain "${specificTargetKeyword}".
- Body Frequency: Naturally incorporate "${specificTargetKeyword}" 4 to 6 times across the article without artificial keyword stuffing.
- Meta Description: Must start or prominently include "${specificTargetKeyword}".
- Primary Keyword field in output JSON: MUST be "${specificTargetKeyword}".
`
    : `
CHOOSE ONE PRIMARY KEYWORD FROM OUR MASTER TARGET LIST:
${TARGET_SEO_KEYWORDS.map(k => `• "${k}"`).join('\n')}
Select whichever keyword from this list is least covered in the published titles below.
`;

  const prompt = `You are an expert SEO content strategist and elite career coach for "Sophi — AI CV Builder" (JoinSophi.com), specializing in Pakistani, Gulf (UAE, KSA, Qatar), and global remote job markets.

YOUR CRITICAL MANDATE: HIGH-RANKING KEYWORD TARGETING & TOPIC UNIQUENESS
${keywordMandate}

ALREADY PUBLISHED TITLES (DO NOT WRITE ABOUT THESE TOPICS OR REPEAT SIMILAR TITLES):
${existingTitlesFormatted}

TARGET TOPIC PILLARS & CONTEXT:
1. ATS RESUME & CV TEMPLATES & FORMATS:
   - ats cv template, ats friendly cv templates, applicant tracking system resume template
   - resume ats format, ats friendly resume format, ats cv format, sample ats friendly resume
   - ats friendly resume template, ats resume template, ats resume sample, ats resume examples
   - free ats resume template, ats format resume, ats format cv
2. ATS SCORE CHECKER & EVALUATOR:
   - ats score checker, ats score checker free, applicant tracking system score evaluation
3. ATS RESUME BUILDERS & CV MAKERS:
   - ats cv maker, ats resume maker, free ats resume builder, ats resume builder
4. LINKEDIN PROFILE OPTIMIZATION:
   - linkedin optimization, optimise linkedin profile, linked in profile optimization, linkedin profile optimizer
5. NICHE & REGIONAL JOB CVs:
   - cv for teaching job in pakistan (Cambridge O/A Levels, Beaconhouse, City School, Roots, HEC lecturer)

CONTEXTUAL INTERNAL LINKING RULES (MUST INCLUDE AT LEAST 2 RELEVANT LINKS):
- If writing about templates, formatting, or samples: Include a link to <a href='https://joinsophi.com/templates'>ATS friendly resume templates and formats</a>.
- If writing about checking scores or ATS compliance: Include a link to <a href='https://joinsophi.com/ats-checker'>free ATS score checker</a>.
- If writing about LinkedIn optimization or headline formulas: Include a link to <a href='https://joinsophi.com/linkedin-optimizer'>AI LinkedIn profile optimizer</a>.
- If writing about teaching jobs in Pakistan: Include a link to <a href='https://joinsophi.com/cv-for-teaching-job-in-pakistan'>CV format for teaching jobs in Pakistan</a>.
- If writing about resume builders, makers, or revamping: Include a link to <a href='https://joinsophi.com'>Sophi AI resume builder</a> and <a href='https://joinsophi.com/ai-cv-builder-app'>AI CV maker app</a>.

OUTPUT RULES:
1. Return ONLY a single valid JSON object. No markdown fences. No text before or after. Start directly with {
2. The "content" field must be valid HTML — use <h2> and 3-4 <h3> headings.
3. Use SINGLE QUOTES for HTML attributes (e.g. <div class='tldr-box'>, <a href='https://joinsophi.com'>) so you never need to escape double quotes. Use HTML entities (&rsquo;, &ldquo;, &rdquo;) for quotes/apostrophes in text.
4. Keep JSON compact without unescaped raw newlines (use \\n).

ARTICLE STRUCTURE & REQUIREMENTS:
- Word count: 1,500–1,800 words total of deep, actionable, expert career advice.
- TL;DR Box at top: <div class='tldr-box'><p><strong>TL;DR:</strong></p><ul><li>Point 1</li><li>Point 2</li><li>Point 3</li></ul></div>
- DYNAMIC H2 SECTION HEADINGS: Create 5-6 logical, topic-specific H2 headings tailored to your chosen topic.
- Quick Answer Callout immediately under EACH <h2> heading:
  <div class='quick-answer'><strong>Quick Answer:</strong> [35-40 word direct answer to the section question]</div>
- Sophi CTA Block 1 (after H2 section 2):
  <div class='cta-block'><p>Ready to transform your CV in 60 seconds? <a href='https://joinsophi.com'>Try Sophi AI CV Builder</a> — ATS-optimized in under a minute for just 1500 PKR. No fluff, no waiting.</p></div>
- Inline Image (between H2 section 3 and H2 section 4):
  <img src='https://picsum.photos/seed/career-growth/800/400' alt='[primary keyword] guide for job seekers' class='w-full h-auto rounded-3xl my-10 shadow-sm object-cover' />
- Sophi CTA Block 2 (at the very end before closing paragraph):
  <div class='cta-block'><p>Don't let a weak CV cost you the interview. <a href='https://joinsophi.com'>Build your ATS-ready resume with Sophi</a> in 60 seconds — starting at 1500 PKR.</p></div>
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
  "primary_keyword": "${specificTargetKeyword || 'Primary targeted keyword phrase'}",
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
