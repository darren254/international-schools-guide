# Adapting third-party briefings into Intelligence copy

Use this when turning raw school briefings (e.g. from .eml exports, research emails) into published "The Intelligence" sections. The briefings are often very direct; our product is parent-facing, honest but appropriate. Every adapted passage must pass through the **tone rules** and **sensitivity rules** below.

**Canonical writing rules (apply first):**
- `TONE.md` (project root) — voice, banned phrases, attribution, paragraph openers
- `docs/SCHOOL_PROFILE_WRITING_GUIDELINES.md` — verdict format, paragraph structure, self-check
- `.skills/school-profile/SKILL.md` — pipeline and quick reference (note: paragraph 1 should **lead with substance**, not "The word among families..." — see SCHOOL_PROFILE_WRITING_GUIDELINES §7)

---

## 0. How we write for parents (non-negotiable)

- **Helpful.** Every sentence should help a parent decide or know what to ask. Cut anything that doesn't.
- **Direct.** Say the thing. Avoid vague or roundabout phrasing. "Worth asking about X" is fine; long setups are not.
- **Professional.** Calm, factual, no sensationalism. We don't gossip; we inform.
- **Scannable.** Parents skim. Short sentences. Bullets do the work. Paragraphs: 2–4 sentences max. If it takes more than one line to land the point, tighten it.

**Test:** Can a parent get the gist in 30 seconds? If not, cut or shorten.

---

## 1. Pipeline for the entire process

1. **Extract** — Parse briefing content (THE VIBE, THE TRADE-OFFS, PROS, CONS) into structured fields. No editing.
2. **Map** — Match briefing school names to our slugs/listing names. Flag unmatched schools.
3. **Adapt** — Rewrite into our voice:
   - Apply **sensitivity rules** (§2): appropriate for families, still direct and useful.
   - Apply **tone rules** (TONE.md + SCHOOL_PROFILE_WRITING_GUIDELINES): banned phrases, attribution mid-paragraph only, verdict = advice to parent, max 2 hyphens per paragraph, lead with substance.
   - Apply **§0**: helpful, direct, professional, scannable. No wordy prose.
4. **Shape** — Fit to `SchoolProfile.intelligence`: verdict (1–2 sentences), paragraphs (2–3), positives, considerations.
5. **Self-check** — SCHOOL_PROFILE_WRITING_GUIDELINES §9 + TONE.md "For AI Assistants". Then: *Can a parent scan this and understand in under a minute?*

**Quality gate:** No school goes live until adapted copy has passed the self-check and (for at least the first batch per city) human review.

---

## 2. Sensitivity and product appropriateness

Raw briefings can mention alcohol, drugs, bullying, self-harm, legal disputes, and staff morale in very blunt language. We keep the **useful signal** for parents, avoid graphic or sensational wording, and stay **direct and scannable**. Don't obscure the point; say it in a way you'd say it to a parent in person.

**Principle:** Honest and specific enough to be useful. No tabloid tone. Short sentences. If in doubt, use one clear sentence + "Ask the school about X."

### Alcohol and substance use

- **Raw:** "Alcohol mentioned as present among older students."
- **Avoid:** Long, vague phrases like "social dynamics and expectations in the senior years." Parents need to know what to ask about.
- **Adapted:** "Alcohol has come up in parent discussions about the senior years. Ask how the school handles pastoral support and expectations for older students."
- **Or (shorter):** "Some parents mention behaviour and social pressures in the upper years. Ask about pastoral support and expectations."

### Drugs

- **Raw:** "Drug use referenced as a known concern."
- **Adapted:** "Substance use has been raised in some parent and forum discussions. Ask the school about their policy and how they communicate with families."

### Bullying and behaviour

- **Raw:** "Bullying is a daily occurrence." / "Student behaviour in Years 7–11 described as absolutely appalling."
- **Adapt:** Don’t publish unverified blanket claims. Do say it’s a recurring theme and what to ask.
- **Adapted:** "Behaviour and bullying come up in independent reviews. Ask how the school tracks incidents, responds to families, and supports students."
- Keep verifiable facts (e.g. "KHDA rated wellbeing Very Good, not Outstanding") as-is.

### Self-harm and wellbeing

- **Raw:** "Concerns about bullying and self-harm rates."
- **Adapted:** "Wellbeing and student safety have been discussed in forums. Ask what support and monitoring the school has and how they communicate with parents."

### Legal disputes, fraud, governance

- **Raw (example):** "Legal disputes with departing staff." / "Accountant defrauded the school of AED 15.77 million."
- **Historic:** One short factual sentence. "There was a fraud case in 2011; the school has since strengthened financial governance."
- **Ongoing:** "There have been reported disputes with some staff. If stability matters to you, ask about current leadership and recent changes."

### Staff morale and turnover

- **Raw:** "Morale described as rock bottom." / "Sycophantic culture."
- **Adapted:** "Staff turnover has been high; some reviews describe difficult working conditions. Ask about retention and current leadership."

### General rule

If the briefing uses language you wouldn’t say to a parent when recommending a school, **rephrase** but keep the **information**. Prefer:
- One clear sentence + "Ask the school about X."
- "X has come up in parent/forum discussions."
- "If X is a concern, ask how the school handles it."

Never add filler to sound "softer." Short and direct beats wordy and obscure.

---

## 3. Extraction → structure mapping

| Briefing section   | Maps to                         | Notes                                                                 |
|--------------------|----------------------------------|-----------------------------------------------------------------------|
| THE VIBE (para 1)  | `paragraphs[0]` (market positioning) | Lead with substance; no attribution opener.                         |
| THE VIBE (para 2)  | `paragraphs[1]` (daily reality)     | Specifics (streets, times, programmes). Attribution mid-paragraph only. |
| THE TRADE-OFFS     | `paragraphs[2]` and/or `considerations` | One short paragraph and/or bullets. Apply sensitivity rules.        |
| PROS               | `positives`                     | 2–3 sentences max per bullet; lead with claim.                        |
| CONS               | `considerations`                | Same; be specific, don’t soften. Apply sensitivity rules.             |
| (Synthesise)       | `verdict`                       | 1–2 sentences: **advice to a parent** with a qualifier/caveat.         |

---

## 4. Who does what (recommended)

- **Script:** Decode .eml, split into per-school blocks, extract THE VIBE / TRADE-OFFS / PROS / CONS into JSON. Output one JSON file per city (or one per batch) with school identifier and raw text. No rewriting.
- **Human or AI with this doc:** For each school, run adaptation (§2) and tone rules, then shape into verdict + paragraphs + positives + considerations. Human review is strongly recommended for the first batch per city to set the standard.
- **Code:** Once adapted copy is approved, patch the city profile files (e.g. `dubai-schools-profiles.ts`, `kuala-lumpur-schools-profiles.ts`) so that school’s `intelligence` object is replaced with the new content.

This keeps parsing automated and editorial quality (tone + sensitivity) under control.
