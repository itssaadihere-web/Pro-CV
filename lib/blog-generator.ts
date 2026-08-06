export async function generateBlogPostWithGemini(): Promise<{ title: string; content: string; description: string; primary_keyword: string; featured_image_keyword?: string } | null> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_key_here' || apiKey.includes('placeholder')) {
    console.warn('⚠️ GEMINI API KEY not set. Cannot generate blog post.');
    return null;
  }

  const prompt = `You are an expert SEO content writer and career coach specializing in Pakistani and Gulf job markets. You write for "Sophi — AI CV Builder" (JoinSophi.com).

YOUR TASK:
Write a comprehensive, SEO-optimized blog post. The article must be genuinely useful to Pakistani professionals — not generic filler. Include Pakistan-specific examples, statistics, and context throughout.

OUTPUT RULES:
1. Return ONLY a single valid JSON object. No markdown fences. No text before or after. Start directly with {
2. The "content" field must be valid HTML — all headings as proper <h2> and <h3> tags. Never use plain text headings or <strong> as headings.
3. CRITICAL — JSON validity: the "content" field is a JSON string. Use SINGLE quotes for every HTML attribute inside it (e.g. <div class='tldr-box'>, <a href='https://joinsophi.com'>) so you never need to escape a double quote. If you must render a literal apostrophe or quotation mark in visible text, use the HTML entities &rsquo; / &ldquo; / &rdquo; rather than a raw ' or " character. Before finalizing, mentally re-check that the content string contains no unescaped double quotes and no raw newlines (use \\n).
4. Keep the JSON compact — do not add unnecessary whitespace inside string values.
5. Hard truncation rule: if you are approaching the response length limit, stop expanding — complete the current H2 section cleanly, close with CTA block 2 and the closing paragraph, then close the JSON properly. A complete, slightly shorter article that is valid JSON is always better than a longer one that gets cut off mid-string.

ARTICLE STRUCTURE REQUIREMENTS:

Word count: 1,500–1,800 words total. This budget already accounts for the TL;DR box, six Quick Answer callouts, and the FAQ section below — don't try to compress the whole article down further than this, and don't pad individual paragraphs to hit a higher number. Rough allocation: ~120 words for the TL;DR + intro, ~180–220 words per H2 section (including its Quick Answer callout), ~250 words for the FAQ section.

Keyword density: use "Pakistan" or "Pakistani" naturally — aim for 4–8 mentions across the whole article, not clustered in one section. Weave LSI/secondary keywords into sentences contextually; never list them, never repeat the exact primary keyword phrase more than once per section. If a sentence only exists to insert a keyword, cut it — natural readability always wins over keyword count.

TL;DR box at the very top of the content:
<div class='tldr-box'><p><strong>TL;DR:</strong></p><ul><li>Point 1 — specific takeaway</li><li>Point 2 — specific takeaway</li><li>Point 3 — specific takeaway</li></ul></div>

After each <h2> section heading: add a Quick Answer callout immediately below the heading:
<div class='quick-answer'><strong>Quick Answer:</strong> [35-40 word direct answer to the section question — the exact answer a reader would want without scrolling further]</div>

Inline image placement: in the middle of the article (between H2 section 3 and H2 section 4), insert exactly this (note: alt text should reference the primary keyword, not be generic):
<img src='https://picsum.photos/seed/career-growth/800/400' alt='[primary keyword]-focused resume tips for Pakistani job seekers' class='w-full h-auto rounded-3xl my-10 shadow-sm object-cover' />

Sophi CTA block — must appear in EXACTLY TWO places, worded slightly differently each time so it doesn't read as duplicated boilerplate:
(1) After H2 section 2 closes — use this exact HTML:
<div class='cta-block'><p>Ready to transform your CV in 60 seconds? <a href='https://joinsophi.com'>Try Sophi AI CV Builder</a> — ATS-optimized in under a minute for just 1500 PKR. No fluff, no waiting.</p></div>
(2) As the very last element before the closing content — use this exact HTML:
<div class='cta-block'><p>Don't let a weak CV cost you the interview. <a href='https://joinsophi.com'>Build your ATS-ready resume with Sophi</a> in 60 seconds — starting at 1500 PKR.</p></div>

Internal links — include both at least once naturally in the body text (not just inside CTA blocks):
- joinsophi.com (CV Builder)
- career.joinsophi.com (Career Portal)

Pakistan-specific content: include at least one concrete Pakistan-specific example, statistic, or named context (e.g. a Pakistani job board, salary range in PKR, a specific industry hiring trend) per H2 section — not just the word "Pakistan" itself.

H2 SECTIONS REQUIRED IN THIS EXACT ORDER:
<h2>1. What Is ATS Optimization and Why Does It Matter for Pakistani Job Seekers?</h2>
<h2>2. The Most Common Mistakes Pakistani Professionals Make with CV Writing</h2>
[CTA BLOCK 1 goes here]
<h2>3. Step-by-Step: How to Write an ATS-Proof Resume in 2026</h2>
[INLINE IMAGE goes here]
<h2>4. Resume Writing: Pakistan vs Gulf Job Market — Key Differences</h2>
<h2>5. How Sophi AI Handles ATS CV Optimization Automatically</h2>
<h2>6. Frequently Asked Questions</h2>
[CTA BLOCK 2 goes here]

FAQ SECTION FORMAT — use schema markup:
<div class='faq-section'>
  <div class='faq-item'>
    <h3>Question 1?</h3>
    <p>Answer — 40–60 words, direct.</p>
  </div>
  <div class='faq-item'>
    <h3>Question 2?</h3>
    <p>Answer — 40–60 words, direct.</p>
  </div>
  <div class='faq-item'>
    <h3>Question 3?</h3>
    <p>Answer — 40–60 words, direct.</p>
  </div>
</div>

CRITICAL OUTPUT JSON SCHEMA:
{
  "title": "Article title — 50-60 characters, specific, includes primary keyword near the start, includes Pakistan where natural",
  "url_slug": "lowercase-hyphenated-slug-under-60-chars-with-primary-keyword",
  "description": "Meta description — exactly 150–155 characters. Must include primary keyword and a clear benefit.",
  "primary_keyword": "The exact keyword phrase being targeted",
  "secondary_keywords": ["3-5 related keyword phrases actually used in the body copy"],
  "featured_image_keyword": "resume,office",
  "inline_image_keyword": "career,laptop",
  "content": "<full HTML article content — includes all sections, both CTAs, inline image, FAQ>"
}`;

  try {
  const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-flash-latest'];

  for (const model of modelsToTry) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7 },
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
