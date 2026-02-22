# School profile writing & content guidelines

**Use this when briefing AI or writers** so school profile copy stays consistent with the International Schools Guide.  
Canonical sources in this repo: `TONE.md` (project root), `.skills/school-profile/`, `src/data/schools.ts`.

---

## 1. Voice & audience

- We write like an **experienced expat parent** who has lived in the city for a few years, done the school tours, spoken to families, and is telling a friend what they actually need to know.
- We are **informed, direct, occasionally dry**. We never sell. We are not a school brochure or an AI summary of a school website.
- **Test:** If a sentence could appear in a school prospectus, rewrite it.

---

## 2. Research pipeline (do this before writing)

1. **Gather real parent voices**  
   Search Reddit (r/jakarta, r/expats, r/internationalschools), Facebook groups (e.g. Jakarta Expat Forum), Quora, and school review sites for actual comments. Look for: specific complaints (traffic, fees, turnover, class size), specific praise (named programmes, outcomes), comparisons (“we moved from X to Y because…”), insider knowledge (waitlists, admissions).

2. **Synthesise into editorial intelligence**  
   Distil comments into our voice. **Never** attribute to “Reddit” or “Facebook”. Attribute to: “parents”, “families who’ve been here a few years”, “expat families”, “the word among…”, “the general consensus”.

3. **Apply the tone filter**  
   Run every paragraph through the banned phrases list and style rules. Cut anything that sounds like generic AI.

4. **Verify facts**  
   Cross-check fees, exam results, and dates against official school (and accreditation) sources. Opinion is ours; facts must be accurate.

---

## 3. Banned phrases (do not use)

**AI / corporate slop:**  
genuine differentiator, occupies a curious/unique position, noteworthy, notable (standalone), leveraging, comprehensive (for a programme), robust, holistic, innovative, cutting-edge, state-of-the-art, world-class (unless quoting), at the forefront, a testament to, it’s worth noting that, it bears mentioning, in terms of, when it comes to, the fact that, needless to say, it goes without saying, a wide/diverse range of, a plethora of, myriad, multifaceted, paradigm, synergy, ecosystem (unless ecology), landscape (for “market”/“sector”), navigate (for “deal with”), cater to, boasts, prides itself, is committed to, strives to, is dedicated to, fosters, nurtures, cultivates, empowers, delve into, explore (for “look at”).

**Hedging / corporate:**  
that’s a feature not a limitation, the trade-off is (use sparingly; prefer showing the trade-off), occupies a space between, sits at the intersection of, in the broader context, it remains to be seen.

**Overused clichés:**  
punches above its weight (max once per ~20 profiles), bang for your buck, hidden gem, best-kept secret, gold standard, a cut above, raises the bar.

---

## 4. Style rules

- **Dashes:** Hyphens (-) only, not em-dashes. **Max 2 hyphens per paragraph.** No hyphen chains in one sentence; break into two sentences.
- **Attribution:** Use “Parents say…”, “Families who’ve been here a few years say…”, “The word among expat families is…”, “The general consensus…”, “One thing families mention…”. Never “Parents note that…”, “It should be noted…”, “Parents report…”.
- **Sentences:** Lead with human experience, not the raw fact.  
  Bad: “Class sizes average 12–14. This means teachers know students individually.”  
  Good: “At 12–14 per class, teachers know your child — not just their name, but their personality.”
- **Specificity:** Name streets, times, traffic, neighbourhoods.  
  Bad: “The location may involve a commute for some families.”  
  Good: “If you’re in Menteng or Central Jakarta, you’re looking at 40–50 minutes each way at rush hour.”
- **Contractions:** Use them. “It’s”, “don’t”, “you’re”, “that’s”.
- **Numbers:** Use “US$17K” in running text; full figures in fee tables. IDR + USD where useful.
- **Paragraphs:** No more than 4 sentences. First sentence should carry the insight.
- **Positives & considerations:** Each bullet 2–3 sentences max. Lead with the specific claim, then context. Be specific (streets, fees, comparisons); don’t soften.

---

## 5. The Verdict (Intelligence summary)

- **One sentence, or two at most.**
- **Direct advice to a parent**, not a description of the school.
- **Always include a qualifier or caveat** — never unconditional praise.

Good: “If your company is paying and your child is reasonably outgoing, JIS is a safe, solid choice. If you’re self-funding, it’s worth comparing.”  
Bad: “BSJ is the strongest British-curriculum option in Jakarta with genuine community spirit and strong pastoral care.”

---

## 6. Intelligence paragraphs (structure)

- **Paragraph 1 — Market positioning:** How the school sits relative to others; what kind of family chooses it. Open with a grounding phrase: “The word among expat families is…”, “If you ask around…”, “The general consensus…”.
- **Paragraph 2 — Daily reality:** What parents actually experience — strengths, texture, daily life. Use specific details from research (streets, traffic, class dynamics, named programmes). Should feel like someone describing their child’s school to a friend.
- **Paragraph 3 — Honest trade-offs:** What’s the catch? Be direct. Name the trade-off; don’t hedge.

---

## 7. Paragraph openers

**Use:**  
The word among expat families is… / Families who’ve been here a few years tend to say… / The general consensus… / What comes up again and again is… / One thing parents mention… / If you ask around… / The reality on the ground… / Parents who’ve done the school tour circuit say…

**Avoid:**  
What parents notice first is… / It’s worth highlighting that… / The school has… / Founded in [year], [school] is… / With [number] students, [school]… / The campus itself…

---

## 8. Data & structure rules

- **Inspection body:** Use the body that **conducts the review/visit**: e.g. **CIS, WASC, BSO, COBIS, ISI, ACSI**. Do **not** use curriculum/authorisation bodies as the inspection body: **IBO** (IB authorisation), **IGCSEs**, **CAIE** (Cambridge), Korean Ministry, etc. are not inspectorates. When in doubt, use the actual accrediting/inspecting body or leave blank.
- **Head of school:** Use a named head when known (name, since year, short bio). No “School Leadership Team” or “Interim” as the default if a named head is available.
- **Profiles live in** `src/data/schools.ts`. Each profile has: head, intelligence (verdict, paragraphs, positives, considerations), academics, studentBody (optional inspection), schoolLife, fees, contact, sidebar (quickFacts, otherSchools, relatedInsights), campuses, jsonLd. See the `SchoolProfile` interface and an existing full profile (e.g. JIS or ISJ) for the exact shape.

---

## 9. Self-check (before delivering)

1. Count hyphens per paragraph. Any over 2? Restructure.
2. Search for every banned phrase. Remove or replace.
3. Read each paragraph aloud. Does it sound like a person talking or a document?
4. Does every opinion have a grounding phrase (“parents say”, “families mention”)?
5. Is the verdict **advice to a parent**, not a statement about the school?
6. Are there specific details (streets, times, fees, comparisons)?
7. Would this sound at home in a school prospectus? If yes, rewrite.

---

## 10. Considerations with links (optional)

If a consideration needs a single linked phrase (e.g. “GL Assessment” → URL), the data shape is:

```ts
{
  text: "Full sentence with the phrase that becomes a link in the middle.",
  link: { url: "https://...", label: "Exact phrase to link" }
}
```

Only one linked phrase per consideration; the rest of the profile uses plain strings.
