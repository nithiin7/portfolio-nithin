# Portfolio Redesign — Audit & Roadmap (v5)

Goal: rebuild portfolio-nithin.vercel.app section by section into an Awwwards-submittable site
(target: Honorable Mention → Site of the Day), keeping Next.js 16 + Contentful.

Audited: 2026-11-11 against `main@701b71d` and the live site (desktop, 1512px).

---

## 1. What's already strong (keep)

- Solid engineering base: Next 16 App Router, RSC data fetching, ISR (`revalidate = 3600`), Sentry, Vercel Analytics/Speed Insights, PWA (Serwist), Storybook, Vitest + Playwright + axe.
- Motion system exists: Motion, GSAP, Lenis, page-transition curve, magnetic hover, cursor, mask text.
- Good extras that Awwwards juries like: ⌘K command palette, AI chat (RAG), live `/stats` page, RSS, blog with comments.
- Content is real and differentiated (AI/MCP/RAG work + enterprise logos).

## 2. Visual / UX audit (why it feels "slightly outdated")

| #   | Section      | Issue                                                                                                                                                                                   | Severity     |
| --- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| V1  | Global       | Palette is warm-grey + near-black with no signature accent; ~2020 "agency template" feel. Orange `#ff5722` exists but is barely used.                                                   | High         |
| V2  | Global       | Typography: one grotesk (Familjen) in ALL-CAPS for every heading + Roboto body. No contrast pairing (serif/mono/display), no type scale rhythm. Headings all read the same weight/size. | High         |
| V3  | Global       | Massive dead space between sections; vertical rhythm feels accidental, not composed. No grid lines/structure visible.                                                                   | High         |
| V4  | Intro        | "Welcome." curve loader appears on every route; long, generic, and delays LCP.                                                                                                          | Med          |
| V5  | Hero         | Centered "HI THERE, I'M NITHIN." + blurred blob is a very common template pattern. No proof (role, location, now-at-EY, availability) above the fold; no visual hook.                   | High         |
| V6  | Services     | Sticky stack takes ~3 viewports for 3 rows of text; huge ghost numbers "01/02/03" on empty black. Low information density.                                                              | High         |
| V7  | Works        | Text-only list with tag pills — no imagery, no hover previews visible on desktop scroll. This is the most important section and it's the least visual.                                  | **Critical** |
| V8  | About        | Portrait floating between two grey ovals; bio is stale ("Software Engineer at Paytm Payments Bank").                                                                                    | High         |
| V9  | Career       | Wavy SVG timeline + paginated card (01/05) hides 4 of 5 roles; card is a flat grey box.                                                                                                 | Med          |
| V10 | Certs        | 14 badges in auto-scroll; reads as filler.                                                                                                                                              | Low          |
| V11 | Collabs      | Logos in original brand colors (blue Paytm, red HSBC, green Spotify) clash with the monochrome system.                                                                                  | Med          |
| V12 | Testimonials | 3 academic/peer quotes in big grey boxes with empty right half.                                                                                                                         | Med          |
| V13 | Footer       | "GET IN TOUCH" with a blob in the O is nice — closest to Awwwards quality. Keep the idea, refine.                                                                                       | Low          |
| V14 | Chrome       | Floating chat button + floating search pill + click sparks + custom cursor all compete.                                                                                                 | Med          |
| V15 | Mobile       | Not yet reviewed in detail — Awwwards scores mobile separately. Audit per-section during rebuild.                                                                                       | —            |

## 3. Code / performance audit

| #   | Issue                                                                                                                           | Where                                          | Fix                                                                                                                            |
| --- | ------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| P1  | Fonts loaded twice: `next/font` (Roboto, Familjen) **plus** render-blocking Google `@import` for Roboto + Host Grotesk in SCSS. | `styles/shared/_fonts.scss`, `globals.scss:56` | Delete `@import`s; load all fonts via `next/font` (or self-host variable fonts).                                               |
| P2  | Root layout fetches 100 blog posts + portfolio items on **every** route for the command palette.                                | `app/layout.tsx`                               | Move to a cached server action / route handler fetched when palette opens, or `unstable_cache` with tags.                      |
| P3  | Homepage sections read Contentful by **array index** (`sections[6]` = career). Reordering in CMS silently breaks the page.      | `app/page.tsx`                                 | Resolve sections by `slug`/`type` field; add a typed `getSection(type)` helper.                                                |
| P4  | Two animation engines (GSAP in 5 files + Motion everywhere) + Lenis.                                                            | hooks, Career, Certs, Cursor, PortfolioModal   | Standardise: GSAP + ScrollTrigger for scroll choreography, Motion only for React mount/exit. Or drop GSAP if Motion covers it. |
| P5  | 59 `'use client'` files; hero is 577 lines with ~12 scroll transforms.                                                          | `HomeHeader`                                   | Split into server shell + small client islands.                                                                                |
| P6  | Theme: light theme swaps `--color-white` ↔ black. Semantic names lie, makes new design hard.                                    | `styles/theme.scss`                            | New token system: `--bg`, `--fg`, `--muted`, `--line`, `--accent`…                                                             |
| P7  | Stale SEO data: JSON-LD says "Full Stack Developer @ Paytm Payments Bank"; metadata duplicated in layout + page.                | `layout.tsx`, `page.tsx`, `api/ask/route.ts`   | Single `siteConfig` constant; update to EY / Senior Technical Consultant.                                                      |
| P8  | `theme-color #ffffff` and `TileColor #da532c` don't match the site.                                                             | `layout.tsx`                                   | Derive from tokens.                                                                                                            |
| P9  | Full-screen intro curve on every navigation hurts LCP/INP.                                                                      | `app/transition.tsx`                           | First-visit-only preloader; lightweight route transition via View Transitions API (already enabled in config).                 |
| P10 | `ClickSpark` wraps the entire app tree (extra listeners + re-render surface).                                                   | `layout.tsx`                                   | Remove or scope.                                                                                                               |
| P11 | Unused image hosts (`picsum`, `unsplash`).                                                                                      | `next.config.js`                               | Remove.                                                                                                                        |

Targets for submission: Lighthouse ≥ 95 Perf / 100 A11y / 100 SEO / 100 BP on mobile, LCP < 2.0s, CLS < 0.05, INP < 150ms, `prefers-reduced-motion` fully honoured.

## 4. Design directions (pick one before Phase 0)

|                  | A. Editorial Swiss                                                   | B. Dark AI Lab                                                                  | C. Bold Experimental                                                        | D. Evolve current                               |
| ---------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------- |
| Feel             | Printed magazine, calm, premium                                      | Research lab / terminal, glowing                                                | Kinetic poster, loud                                                        | Current site, tightened                         |
| Base             | Paper `#F2F1EC` / ink `#0B0B0B`                                      | `#07080A` / `#E6E8EB`                                                           | Off-white + 2 block colours                                                 | Existing warm greys                             |
| Accent           | One: signal orange `#FF4D00`                                         | Acid green `#C6FF3D`                                                            | Cobalt `#2B3BFF` + pink                                                     | Existing `#FF5722`, used properly               |
| Display font     | Inter Tight / PP Neue Montreal                                       | Geist                                                                           | Bricolage Grotesque (variable)                                              | Familjen Grotesk                                |
| Accent font      | Instrument Serif (italic)                                            | Geist Mono                                                                      | —                                                                           | Instrument Serif (italic)                       |
| Mono             | JetBrains Mono                                                       | Geist Mono                                                                      | JetBrains Mono                                                              | JetBrains Mono                                  |
| Signature moment | Works index with cursor-following image previews + grid-line reveals | R3F/GLSL particle or noise-field hero reacting to cursor; "agent console" About | WebGL image distortion on Works hover; giant variable-weight type on scroll | Refined blob hero, image previews in Works      |
| Risk             | Low                                                                  | Medium (perf on mobile)                                                         | High (usability score)                                                      | Low, but least distinctive                      |
| References       | Ravi Klaassens, Corentin Bernadou, Mouthwash Studio                  | Lusion, Robert Borghesi, Patrick Heng                                           | Abhishek Jha Folio '25, Obys                                                | Dennis Snellenberg (the current site's lineage) |

## 4b. Shared design system rules (apply to any direction)

- **Grid:** 12-col, 24px gutters, visible hairline grid lines as a motif; consistent section padding scale (`clamp(96px, 14vw, 200px)`).
- **Type:** one expressive display face (variable, wide range) + one clean text face + one mono for metadata (dates, tags, indices). Fluid type scale via `clamp()` tokens.
- **Color:** near-black / off-white base + **one** signature accent used deliberately (links, cursor, active states, availability dot).
- **Motion language:** 3 primitives only — (1) line-by-line text reveal, (2) clip-path image reveal, (3) scroll-scrubbed pin. One easing curve (`cubic-bezier(.7,0,.2,1)`), one duration scale.
- **Signature moment:** one WebGL/shader or canvas piece (hero or Works hover) — Awwwards juries reward one memorable interaction, not ten small ones.

## 4c. Motion spec — Direction A (Editorial Swiss) ✅ chosen

Principle: motion is precise and purposeful, like a magazine being typeset in front of you. No bouncing, no blobs, no sparkles.

**Global**

- Easing: `cubic-bezier(0.7, 0, 0.2, 1)` (in-out) and `cubic-bezier(0.2, 0, 0, 1)` (out). Durations: 0.4s / 0.8s / 1.2s only.
- Lenis smooth scroll (keep), lerp 0.1.
- Everything collapses to instant fades under `prefers-reduced-motion`.

**Preloader (first visit only, ≤1.2s)**: a counter 000→100 in mono, with grid hairlines drawing in from the top-left. The name then slides up line by line and the loader clip-wipes away to the hero.

**Page transitions**: View Transitions API. The outgoing page fades out, a solid ink panel wipes across, and the new page title reveals line by line.

**Text**

- Headings: line-by-line mask reveal (each line slides up from behind a clip) on enter.
- Mono labels (`01 — Works`, dates): typed/scrambled character reveal (~0.4s).
- Big display words can scrub weight or letter-spacing slightly with scroll.

**Grid**: 1px hairlines draw in (scaleX/Y 0→1) as sections enter, which makes the grid itself an animated motif.

**Images**: clip-path inset reveal (bottom→top) plus a subtle 1.15→1 scale; parallax of ±8% inside the frame.

**Selected Works (signature moment)**: a cursor-following preview (image/video) that lerps behind the cursor and swaps with a clip transition between rows. The title shifts right and an accent underline draws. Other rows dim to 40%. On touch, inline cards replace this.

**Hero**: name in huge type revealing line by line; live local-time clock (Bangalore) in mono; availability dot pulsing in accent; the grid stays visible. Scrolling slightly compresses the hero type (scale 1→0.92) as the next section slides over.

**Micro-interactions**

- Links: underline draws left→right on hover and exits right.
- Buttons: text rolls vertically to a duplicate on hover; subtle magnetic pull on the primary CTA only.
- Cursor: small dot plus a label ("View", "Open", "Drag") over interactive areas; hidden on touch.
- Marquee (collabs): speed reacts to scroll velocity; pauses on hover.
- Footer: "GET IN TOUCH" scales up as it pins at the bottom; the email copies to clipboard with a toast.

**Tooling**: Motion for component enter/exit and hover; GSAP + ScrollTrigger only for scroll-scrubbed pins and the Works preview lerp. No WebGL needed for v1. An optional WebGL distortion on Works previews can come in Phase 10 if perf budget allows.

## 5. Section-by-section roadmap

Branching: all work lives on the long-lived `redesign` branch. Each phase gets a short branch `redesign/phase-N-<name>` → PR into `redesign` (Vercel builds a preview for every push). `main` stays untouched and live until every phase is done; then `redesign` → `main` in one final PR.

| Phase | Scope                                                                                                                                  | Output                                     |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| 0     | Foundations: tokens, fonts (P1, P6, P8), grid, motion primitives, `siteConfig` (P7), section resolver (P3), remove clutter (P10, P11). | No visual regressions beyond fonts/colors. |
| 1     | Nav + Hero + first-visit preloader (V4, V5, P9).                                                                                       | New first impression.                      |
| 2     | **Selected Works** list → image-rich hover previews + featured case-study cards (V7).                                                  | Biggest visual lift.                       |
| 3     | Case-study page `/portfolio/[id]` redesign (hero media, problem → approach → stack → outcome, next-project transition).                |                                            |
| 4     | Services (V6) + About (V8) merged into a tighter "capabilities" story.                                                                 |                                            |
| 5     | Career as full horizontal or table timeline, all roles visible (V9); certs as compact strip (V10).                                     |                                            |
| 6     | Collabs monochrome marquee (V11) + Testimonials redesign (V12).                                                                        |                                            |
| 7     | Footer / Contact page (V13).                                                                                                           |                                            |
| 8     | Blog index + post template.                                                                                                            |                                            |
| 9     | Stats page polish, 404, OG images.                                                                                                     |                                            |
| 10    | Performance pass (P2, P4, P5), a11y pass, mobile QA, Awwwards submission kit (cover 1600×1200, screenshots, description, tags).        |                                            |

## 6. Content to refresh in Contentful

- About bio (now EY, Bangalore).
- Hero subtitle — sharper positioning line (e.g. "Building AI agents, guardrails & MCP infrastructure for enterprise").
- Project cover images / short videos for each Selected Work (needed for Phase 2).
- Fix "Banglore" typo on the EY career entry.
- Consider replacing academic testimonials with colleague/client ones.
