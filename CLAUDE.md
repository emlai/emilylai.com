# emilylai.com

Emily Lai's personal website. A new concept, designed from identity, not from prior mockups.

## What inherits and what does not

Two kinds of prior material exist. Treat them differently.

**Inherits (read these):**
- `BRAND.md` (this repo, version 2). Identity: strategy, audience, positioning, personality, references, voice, tonal rules, approved visual primitives. Its litmus test applies to every screen and every line: if it does not show who Emily is beyond her work and career path, it is wrong.
- `CONTENT-LINKS.md` (this repo). The content source: every post, video, talk, and project Emily approved for the site, with real URLs, grouped in her five buckets (work, growth experiments, lab, learning in public, speaking) plus side projects. Lines marked FOUND need her yes before use. Lines marked FLAG carry a publish rule. Do not use any other content list.
- `references/` (this repo). Screenshots of the six sites Emily chose on 2026-09-03. Look at them for register and polish bar. Do not copy their structure.
- `~/vault/70-skills/write-like-emily/SKILL.md` for all copy.
- The content-safety flags in the next section.

**Does not inherit (quarantined, do not open unless Emily asks):**
- `~/Developer/site-project/` and `~/Developer/emilylai-site.tar.gz`: the 2026-08-26 static mockups. Superseded.
- `~/Downloads/copy-deck.md` and `copy-deck-filled.md`: copy written for that mockup's structure. Superseded.
- `~/vault/60-sources/2026-08-26-x-timeline-curation.md`: a post selection made for that mockup's years strip. Only relevant if the new concept independently decides it wants a feed of her posts; even then, re-select for the new form.
- `~/vault/20-projects/q4-2026-career-arc/personal-site.md` and `personal-site-brand.md`: the 08-26 session record. Their "confirmed" structure, section order, years strip, lamp cord, stitched label, and type pairing are design attempts from one prior session, not brand truth. Do not write them into PRODUCT.md or DESIGN.md as settled.
- Any claude.ai artifact links found in those notes.

If any of the quarantined ideas comes back, it must come back because the new concept independently arrived at it and Emily chose it against alternatives, not because it was on file.

## Content-safety flags (these inherit regardless of form)

- Hold anything about Ostium internal process or Ostium hiring until after her exit announcements.
- Keep Hype client names anonymized exactly as her original posts did.
- Health experiments are written for employer eyes: "a year of logged health experiments," not compound names or doses.
- Never restate third-party numbers (for example Jambo, Corgi) as fact.
- Claims in `BRAND.md > Governance > Claims` marked DRAFT are not approved for the page.

## Non-negotiable ship rules

- Real content only. Never invent a metric, quote, or client name.
- No em dashes anywhere.
- Nothing from vault notes marked PERSONAL PRIVATE or CONFIDENTIAL reaches the page.
- No horizontal scroll on mobile.
- Show Emily before publishing. Never deploy without her look.

## Process

Use Emily's design method (`~/vault/70-skills/emily-design/SKILL.md`) and Impeccable. Mode: Experience-leaning Persuade; the conversion is a hiring conversation.

For this project specifically:

1. `/impeccable init` writes PRODUCT.md from BRAND.md and this file. Record structure, sections, and length as OPEN, not confirmed.
2. `/impeccable new-work` with these four layers explicitly open: structure (how many sections, which, in what order, whether a timeline exists), copy (written for the chosen form; only the tagline and second line in BRAND.md are fixed), palette within the near-monochrome constraint, and the single interactive object. Propose concepts that differ in kind, not in skin. At least one concept should have no timeline and no metaphor; at least one should be a single continuous piece rather than sections.
3. Present concepts as what the visitor does in the first thirty seconds, not as section lists.
4. `shape` before code. `audit` in one batched round (desktop and mobile), fix in one batch, one confirm round, stop.
