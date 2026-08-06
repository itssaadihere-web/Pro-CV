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
3. Keep the JSON compact — do not add unnecessary whitespace inside string values.
4. If you are approaching the response length limit: complete the current H2 section cleanly, close with the CTA block and closing paragraph, then close the JSON properly. A complete 1,800-word article is better than a truncated 2,500-word one.

ARTICLE STRUCTURE REQUIREMENTS:

Word count: 800–1,000 words. Concise, crisp, punchy, and to the point — cut length in half. No fluff or filler.

TL;DR box at the very top of the content:
<div class="tldr-box"><p><strong>TL;DR:</strong></p><ul><li>Point 1 — specific takeaway</li><li>Point 2 — specific takeaway</li><li>Point 3 — specific takeaway</li></ul></div>

After each <h2> section heading: add a Quick Answer callout immediately below the heading:
<div class="quick-answer"><strong>Quick Answer:</strong> [40-word direct answer to the section question — the exact answer a reader would want without scrolling further]</div>

Inline image placement: In the middle of the article (between H2 section 3 and H2 section 4), insert exactly this:
<img src="https://picsum.photos/seed/career-growth/800/400" alt="Career growth and resume optimization illustration" class="w-full h-auto rounded-3xl my-10 shadow-sm object-cover" />

Sophi CTA block — must appear in EXACTLY TWO places:
(1) After H2 section 2 closes
(2) As the very last element before the closing </article> or end of content
Use this exact HTML each time:
<div class="cta-block"><p>Ready to transform your CV in 60 seconds? <a href="https://joinsophi.com">Try Sophi AI CV Builder</a> — ATS-optimized in under a minute for just 1500 PKR. No fluff, no waiting.</p></div>

Internal links — include both at least once naturally in the body text:
- joinsophi.com (CV Builder)
- career.joinsophi.com (Career Portal)

Pakistan mentions: Include the word "Pakistan" or "Pakistani" at least 4 times throughout the article. Include at least one Pakistan-specific example or statistic per H2 section.

LSI keywords: Do not list them — weave them contextually throughout the article.

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
<div class="faq-section">
  <div class="faq-item">
    <h3>Question 1?</h3>
    <p>Answer — 40–60 words, direct.</p>
  </div>
  <div class="faq-item">
    <h3>Question 2?</h3>
    <p>Answer — 40–60 words, direct.</p>
  </div>
  <div class="faq-item">
    <h3>Question 3?</h3>
    <p>Answer — 40–60 words, direct.</p>
  </div>
</div>

CRITICAL OUTPUT JSON SCHEMA:
{
  "title": "Article title — specific, includes primary keyword, includes Pakistan where natural",
  "description": "Meta description — exactly 150–155 characters. Must include primary keyword and a clear benefit.",
  "primary_keyword": "The exact keyword phrase being targeted",
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
