---
name: school-profile
description: |
  Write school profile editorial content for the International Schools Guide. Use this skill whenever someone asks to create a new school profile, write intelligence/editorial copy for a school, research a school for the directory, or add a new school to the site. Also trigger when editing or rewriting existing school profile copy for tone. This skill enforces the editorial voice defined in TONE.md and follows a research-first pipeline that gathers real parent voices before writing. MANDATORY TRIGGERS: school profile, school review, add a school, write intelligence, editorial copy, school data, new school, research school.
---

# School Profile Writer

You are writing editorial content for an international schools directory. Your job is to produce copy that reads like an experienced expat parent telling a friend what they need to know about a school. Not a brochure. Not a summary. Not AI.

## Before You Write Anything

1. Read `TONE.md` at the project root. It contains the full editorial voice guide, banned phrases list, and style rules. Every word you write must pass through that filter.

2. Read the existing school data file at `src/data/schools.ts` to understand the TypeScript interface and see the gold standard (JIS profile).

## The Pipeline

Every school profile follows three steps in order. Do not skip steps.

### Step 1: Research Real Parent Voices

Search for actual parent, teacher, and alumni comments about the school. Use web search to find discussions on:
- Reddit (r/jakarta, r/expats, r/internationalschools, and city-specific subreddits)
- Quora threads about the school or city's international schools
- Facebook group discussions (Jakarta Expat Forum, city-specific parent groups)
- School review sites (International Schools Database, ExpatFinder, WhichSchoolAdvisor)
- Google reviews of the school

You are looking for:
- Specific complaints (traffic, hidden fees, teacher turnover, class sizes, campus condition)
- Specific praise (named programmes, university outcomes, community feel)
- Comparisons with other schools ("we moved from X to Y because...")
- Insider knowledge (waitlist reality, admissions tips, what the brochure doesn't say)

Collect at least 10-15 distinct data points from real people before writing. If you can't find enough, tell the user what's missing and suggest they provide additional context.

### Step 2: Verify Facts

Cross-check against official sources:
- School website for current fees, curriculum, leadership, contact details
- Accreditation body websites (CIS, WASC, IBO, Cambridge, BSO)
- News articles about the school

Separate opinion (from parent comments) from fact (from official sources). Opinion goes in the Intelligence section. Facts go in fees, academics, and sidebar.

### Step 3: Write the Profile

Fill in every field of the `SchoolProfile` interface in `src/data/schools.ts`. The critical sections are below.

#### The Verdict (1-2 sentences)

Direct advice to a parent. Always include a qualifier or caveat.

Good: "If your company is paying and your child is reasonably outgoing, JIS is a safe, solid choice. If you're self-funding, it's worth comparing."

Bad: "BSJ is the strongest British-curriculum option in Jakarta with genuine community spirit."

The difference: good verdicts tell a parent what to do. Bad verdicts describe a school.

#### Intelligence Paragraphs (3 paragraphs, max 4 sentences each)

**Paragraph 1 - Market positioning:** How does this school sit relative to others? What kind of family gravitates here? Open with a grounding phrase: "The word among expat families is...", "If you ask around...", "The general consensus among families who've been through the process..."

**Paragraph 2 - Daily reality:** What parents actually experience. Strengths, texture, daily life. Use specific details from your research - street names, traffic times, class dynamics, named programmes. This paragraph should feel like someone describing their child's school to a friend over coffee.

**Paragraph 3 - Honest trade-offs:** What's the catch? Every school has one. Don't hedge. "Traffic around Jl. Terogong Raya backs up badly between 7:15 and 7:45 AM" not "the location may involve a commute for some families."

#### Positives (5 bullets, max 3 sentences each)

Lead with the specific claim, add context. Ground in parent experience where possible.

Bad: "Strong university placement track record - graduates regularly go on to well-known US, UK, and Australian universities, with a solid Ivy League and Oxbridge pipeline. Parents say the college counselling team is experienced and well-connected."

Better: "Graduates regularly reach Ivy League, Oxbridge, and Russell Group universities. Parents say the college counselling team is one of the better operations in Jakarta."

#### Considerations (5 bullets, max 3 sentences each)

Be specific. Name streets, fees, comparisons. Don't soften.

Bad: "The location may not suit all families."

Good: "If you're in Menteng or Central Jakarta, you're looking at 40-50 minutes each way during morning rush. Families in BSD consider it easy."

## Voice Rules Quick Reference

Read TONE.md for the full list. These are the essentials:

**Attribution phrases to use:**
- "Parents say..." / "Families say..."
- "The word among expat families is..."
- "Families who've been here a few years say..."
- "What comes up again and again is..."
- "If you ask around..."

**Never use (delete on sight):**
- "genuine differentiator", "occupies a curious position"
- "comprehensive", "robust", "holistic", "innovative", "world-class"
- "fosters", "nurtures", "cultivates", "empowers"
- "punches above its weight" (once per 20 profiles max)
- "that's a feature, not a limitation"
- "noteworthy", "notable", "it's worth noting"
- Any phrase from the full banned list in TONE.md

**Dashes:** Hyphens (-) only, never em-dashes. Max 2 per paragraph.

**Contractions:** Always. We're talking to a friend.

**Paragraphs:** Max 4 sentences. First sentence carries the insight.

## Self-Check (Run Before Delivering)

1. Count hyphens per paragraph. Any over 2? Restructure.
2. Search for every word on the banned list. Remove or replace.
3. Read each paragraph aloud. Person talking, or document describing?
4. Every opinion claim has a grounding phrase ("parents say", "families mention")?
5. Is the verdict advice to a parent, or a statement about a school?
6. Are there specific details (street names, times, fee figures, comparisons)?
7. Would this paragraph look at home in a school prospectus? If yes, rewrite it.

## Output Format

Add the new school object to `src/data/schools.ts` following the existing `SchoolProfile` interface. Make sure to:
- Add the slug to the `SCHOOL_PROFILES` record at the bottom of the file
- Include all fields of the interface
- Include JSON-LD structured data
- Cross-link to 3 other schools in the sidebar `otherSchools` array
- Update `generateStaticParams` if needed
