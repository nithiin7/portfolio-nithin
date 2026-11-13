# Claude Code Prompt Pack — Portfolio Redesign

How to use: open the repo in VS Code, start Claude Code (`claude` in the terminal or the extension panel),
make sure you're on the right branch, then paste one prompt per session. Start each session fresh.
Review the Vercel preview before moving to the next phase.

---

## 0. One-time setup (run yourself in the terminal)

```bash
git checkout main && git pull
git checkout -b redesign
mkdir -p docs/redesign            # copy REDESIGN_PLAN.md + PROMPTS.md in here
git add docs/redesign && git commit -m "docs: add redesign plan and prompt pack"
git push -u origin redesign
```

In Vercel → Project → Settings → Git, previews are on by default for every branch; nothing else to do.
Create `.env.local` with your Contentful vars (copy from Vercel → Settings → Environment Variables) so `pnpm dev` works.

Add this block to the top of `CLAUDE.md` (Claude Code reads it every session):

```md
## Active work: v5 redesign

- Plan & audit: docs/redesign/REDESIGN_PLAN.md — read before any change.
- Chosen direction: A — Editorial Swiss (see sections 4 and 4c of the plan).
- Work only on `redesign` or `redesign/phase-*` branches. Never touch `main`.
- New design tokens live in src/styles/tokens.scss; do not add new colors elsewhere.
- Every section must: honour prefers-reduced-motion, work at 360px width, keep Lighthouse a11y = 100.
- After each phase: run `pnpm lint && pnpm test && pnpm build`, then summarise changes.
```

---

## Phase 0 — Foundations

```
Read CLAUDE.md and docs/redesign/REDESIGN_PLAN.md (sections 3, 4, 4b).
Create branch redesign/phase-0-foundations from redesign.

Goal: lay the design foundation for direction A (Editorial Swiss) without redesigning any section yet.

1. Create src/styles/tokens.scss with semantic tokens (--bg, --fg, --muted, --line, --accent,
   --accent-fg, surface levels), fluid type scale (--step--1 … --step-7 via clamp()),
   spacing scale, radii, one easing curve and duration scale. Dark + light variants with
   honest names. Keep old theme.scss vars as aliases mapped to the new tokens so nothing breaks.
2. Fonts: remove the Google @import lines in styles/shared/_fonts.scss and globals.scss (P1).
   Load the direction's fonts with next/font (variable, display: swap, subsets latin), expose
   as CSS vars.
3. Add a 12-col grid utility + optional debug grid overlay toggled by pressing "g" in dev only.
4. Create src/config/site.ts (siteConfig: name, role "Senior Technical Consultant @ EY",
   location Bangalore, socials, url). Replace duplicated metadata + JSON-LD in layout.tsx and
   page.tsx with it. Fix theme-color/TileColor (P7, P8).
5. Replace positional Contentful section access in app/page.tsx with a typed
   getSection(sections, key) helper keyed by a Contentful field (slug or internal name).
   Show me the field you chose and the fallback (P3).
6. Remove ClickSpark from the layout and unused image hosts in next.config.js (P10, P11).
7. Build motion primitives in src/components/motion/: <RevealText> (line-by-line mask),
   <RevealImage> (clip-path), <Pin> (scroll-scrubbed). One shared easing. All no-op under
   prefers-reduced-motion. Add Storybook stories for each.

Do not restyle sections yet. Run lint, tests, build. Commit in logical commits
(conventional commits). Push and open a PR into `redesign`.
```

## Phase 1 — Nav, Hero, Preloader

```
Read CLAUDE.md and the plan (V4, V5, P9). Branch redesign/phase-1-hero.

Redesign the navigation and hero for direction A (Editorial Swiss).
- Hero must communicate in 3 seconds: name, role, what I build (AI agents, guardrails,
  MCP, full-stack), location + local time, availability status, and one primary CTA.
- Build the direction's signature hero moment (see plan section 4). Keep LCP element
  as text, not canvas. Lazy-load any WebGL after first paint; static fallback on mobile
  and reduced motion.
- Replace the every-route "Welcome." curve with a first-visit-only preloader (sessionStorage)
  under 1.2s, and use the View Transitions API for route changes.
- Nav: minimal, sticky, hides on scroll down / shows on scroll up, menu overlay on mobile.
- Split HomeHeader into a server component shell + small client islands (P5).

Before coding, propose 2 layout options for the hero as ASCII wireframes and wait for me
to choose. Then implement, run lint/test/build, screenshot desktop + 375px with Playwright,
commit, push, open PR into `redesign`.
```

## Phase 2 — Selected Works (most important)

```
Branch redesign/phase-2-works. Read plan V7.
Redesign HomePortfolio as the centrepiece:
- Index list (number · title · type · year · stack) on a 12-col grid.
- On hover (desktop): a cursor-following image/video preview with smooth lerp, clip-path
  reveal between items; title shifts and accent underline draws.
- On touch: inline image cards instead of hover.
- Top 3 projects get a large featured card with cover media above the index.
- Images via next/image with blur placeholders from Contentful; preload only the first.
- Keyboard: arrow-navigable, focus shows the same preview.
Tell me which Contentful fields you need (cover image, cover video, role, short summary);
if they don't exist, list the exact content-model changes for me to make.
Lint/test/build, Playwright screenshots, commit, PR into redesign.
```

## Phase 3 — Case study page `/portfolio/[id]`

```
Branch redesign/phase-3-case-study. Redesign PortfolioDetails:
hero with title + meta row (role, year, stack, links) + full-bleed cover;
sections Problem → Approach → Architecture (optional diagram) → Outcome/metrics → Gallery;
sticky in-page progress; "Next project" footer with a large hover-reveal transition.
Reuse motion primitives only. Update the dynamic OG image to the new style.
```

## Phase 4 — Capabilities (Services + About)

```
Branch redesign/phase-4-capabilities. Read plan V6, V8.
Replace the 3-viewport sticky services stack with a dense, single-viewport capabilities
section (3 columns or an accordion), and rebuild About: portrait with RevealImage,
updated bio (EY, Bangalore), a short "how I work" list, and 3–4 stat counters
(years, projects shipped, certs). Merge or reorder sections as you see fit; justify it.
```

## Phase 5 — Career + Certifications

```
Branch redesign/phase-5-career. Read plan V9, V10.
Career: show all roles at once — either a pinned horizontal timeline or an editorial
table (year · company · role · location · stack); expanding row for details.
Certifications: compact logo strip + count, link to Credly; modal kept for details.
Remove GSAP from these components if Motion can do it (P4).
```

## Phase 6 — Collaborations + Testimonials

```
Branch redesign/phase-6-social-proof. Read plan V11, V12.
Collaborations: monochrome logo marquee (currentColor SVGs), pauses on hover, respects
reduced motion. Testimonials: one large quote at a time with author, draggable / arrow
controls, auto-advance off by default.
```

## Phase 7 — Footer + Contact

```
Branch redesign/phase-7-contact. Keep the "GET IN TOUCH" giant-type idea (V13) but
rebuild it in the new system: magnetic CTA, email copy-to-clipboard with toast,
local time, socials, back-to-top. Redesign /contact form with inline validation,
success state, and reCAPTCHA unchanged.
```

## Phase 8 — Blog

```
Branch redesign/phase-8-blog. Blog index: featured post + filterable list (categories as
mono tags), reading time. Post template: 65–75ch measure, new type scale, code blocks
themed to tokens, TOC sticky on desktop, comments restyled. Check RSS + OG still work.
```

## Phase 9 — Stats, 404, misc

```
Branch redesign/phase-9-misc. Restyle /stats cards to the new tokens, design a playful
404 that matches the signature moment, refresh all OG images, favicon + manifest colours.
Remove all now-unused components, styles and old theme aliases.
```

## Phase 10 — Performance, a11y, submission

```
Branch redesign/phase-10-polish.
1. Fix P2 (command palette data on demand), remaining P4/P5.
2. Run Lighthouse (mobile) on /, /portfolio/1, /blog, /contact; get Perf ≥ 95, A11y/SEO/BP 100.
   Report before/after numbers.
3. Run the Playwright + axe suite; fix every violation.
4. Test at 360, 768, 1280, 1920 widths; fix layout issues.
5. Generate the Awwwards kit: 1600×1200 cover, 3 desktop + 2 mobile screenshots (Playwright),
   a 60-word description, tags and technologies list in docs/redesign/AWWWARDS.md.
Then open the final PR: redesign → main.
```

---

## Tips for working with Claude Code on this

- Use plan mode (Shift+Tab) for Phase 1 and 2 so it proposes before editing.
- Paste a screenshot of a reference site into the chat when you want a specific feel.
- If a phase gets big, ask it to stop after each sub-step and show you the diff.
- Keep sessions to one phase; start a new session for the next to keep context clean.
