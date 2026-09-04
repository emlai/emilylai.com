# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML, CSS, and vanilla JavaScript. No framework, no build step (Emily, 2026-09-03). Deploys on Vercel to emilylai.com, a domain she owns. Fonts self-hosted with verified licenses. JavaScript is for the one interactive object and the post feed's filtering; the page must read fully with JavaScript off.

## Users

Primary: the founder or hiring manager deciding whether to bring Emily onto a growth or marketing team, most often at a frontier AI or developer company. They arrive from a CV link, an intro, or her X profile, usually on a phone between meetings or on a laptop while reviewing a shortlist. They give the page about ninety seconds and judge taste, polish, the experience, who the person is, and whether they would enjoy working with her.

Secondary (confirmed): recruiters and executive search; founders and operators who arrive from X; marketers learning from her posts.

Explicitly not designed for: keyword-scanning recruiters (the CV does that job), hype-driven or crypto-bro audiences, anyone looking for a one-path guru.

## Product Purpose

emilylai.com is Emily Lai's personal website. It shows the work, the way she thinks, and the person, to someone deciding whether to bring her onto their team. Success is a hiring conversation: the right person reads it and reaches out.

The site carries no open-to-work signal, ever (Emily, 2026-09-03: "I won't ever advertise that"). No "looking for my next role" line in any state. The story does the work; contact is a line written like a person.

## Positioning

The only growth leader who does all three herself: the strategy, the team, and the shipping. Proven from pre-product-market-fit startups to post-revenue B2B enterprise, across ecom, fintech, onchain finance, and now AI. Not "just crypto." Not a single bucket. Not BD or partnerships.

What no template can copy: her real record, linked. Growth experiments with receipts, a lab of health and life experiments, talks on stage, learning in public, and side projects, all real posts and videos from CONTENT-LINKS.md.

## Operating Context

- Read once, quickly, often on mobile. No account, no forms, no analytics gates.
- Arrives alongside a CV. The CV is personalized per role; the site is the constant.
- Emily was head of marketing at Ostium from March to September 2026 (dates set by her on 2026-09-04) and is an advisor at Hype.
- Contact: X @emilylai, LinkedIn laiemily, email hi@emilylai.com. No calendar link.
- Updates are rare: a new role, new posts into the feed, a new lab note.

## Capabilities and Constraints

Content source: CONTENT-LINKS.md is the only content list. Five buckets (work, growth experiments, lab, learning in public, speaking) plus side projects. APPROVED lines may be used; FOUND lines need Emily's yes; FLAG lines carry a publish rule.

Content rules (Emily, 2026-09-03, carried from the earlier decision round):
- Client names only in the three lines Emily wrote herself (Hype roster, MoreHuman select clients, Jump 450 select clients). Quoted posts keep clients anonymous.
- Approved numbers: Jump 450 paid social of $800K to $2M a month; Hype 4.5 years and 212+ crypto companies; first client $1,500 in 2017. Feed cards quote the real post and its own numbers.
- Lab: employer-eyes framing on the page ("a year of logged health experiments"), experiments may be named by category, no compound names or doses in site copy. Linked posts say what they say.
- No em dashes anywhere. Real content only. Never invent a metric, quote, or client name.

Tagline (fixed wording, revised by Emily 2026-09-04, line breaks free): "Growth leader, marketer, experimenter." / "10+ years across agencies, startups, and tech. Driving user growth for ecommerce, onchain finance, consumer apps. Always learning."

Technical: no horizontal scroll on mobile at any width. Respects prefers-reduced-motion. Semantic HTML, one h1, skip link, Person JSON-LD. WCAG 2.2 AA contrast.

OPEN, to be decided in new-work, not here: the number of sections, their names and order, whether a timeline or year index exists at all, whether there is a metaphor at all, what the single interactive object is, whether a dark theme exists, page length (one page or several routes), copy for everything except the tagline, exact palette values, typeface.

## Brand Commitments

BRAND.md in this repo is binding. In short: quiet software minimalism; light, near-monochrome, small confident type, generous air; polish lives in spacing, alignment, hover states, and how fast you find things; exactly one thing the visitor interacts with that could only be hers; easy to navigate. Rejected on sight: editorial and art-directed pages, oversized display type, scroll choreography, grain, fashion-world coldness, illustration, mascots, gimmick-first sites, dark developer one-pagers, dense text, color as decoration, anything that reads as a tech or SaaS template. References for register: rauno.me, mikes.cv, dustinbrett.com (the owned-object idea only), nerdy.dev light mode (the post feed), tonsky.me (plain nav; not the yellow, and not the next-role link), sive.rs and patrickcollison.com for content architecture. Screenshots in references/.

Litmus test: if it does not show who Emily is beyond her work and career path, it is wrong.

Copy voice: ~/vault/70-skills/write-like-emily/SKILL.md.

## Evidence on Hand

- CONTENT-LINKS.md: every approved post, video, and talk with real URLs, grouped by bucket, with FOUND and FLAG markers.
- BRAND.md > Governance > Claims: approved and draft claims.
- references/: six screenshots Emily chose on 2026-09-03.
- Her X archive (2026-08-26 export) in ~/Downloads for post IDs and dates when a card needs one.

Absences future work must not fabricate: no photography of Emily or her artifacts is cleared; no logo or mark; no testimonials; talk counts and venues beyond CONTENT-LINKS are not approved. Three growth posts have no IDs yet (2022 CTR benchmarks, 2022 spend 7.5x, 2025 neobank CACs); fetch or skip per Emily.

## Product Principles

1. Who she is beyond the career path, first. Work is one bucket of five, not the frame.
2. Receipts over adjectives. Real posts, real numbers, real dates, linked to source.
3. Findable in one or two moves. A visitor with ninety seconds gets what they came for.
4. Craft in the details, not in the display. Nothing asks to be admired.
5. Publish-safe by default. When a fact, name, or number is not approved, leave it off rather than soften it.

## Accessibility & Inclusion

WCAG 2.2 AA contrast. Full keyboard operation including the interactive object and any filter. Reduced-motion users get the page with no decorative motion. Readable at 200% zoom with no horizontal scroll. Works with JavaScript disabled.
