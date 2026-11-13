# CLAUDE.md — portfolio-nithin

The reference for working in this repo. Keep it true: when code or config changes a rule here, update this file in the same PR.

## 1. Overview

Portfolio of Nithin Pradeep (AI and full-stack engineer) at https://portfolio-nithin.vercel.app. The visual direction is Editorial Swiss: a visible 12-column grid, ink and paper, one orange accent, large display type, mono labels.

Stack: Next.js 16 (App Router, RSC, Turbopack), React 19, strict TypeScript, SCSS Modules, Contentful (GraphQL via Apollo), Supabase, Motion/React, Lenis, React Hook Form + Yup, EmailJS, reCAPTCHA v3, Sentry, Vercel.

## 2. Architecture and data flow

```
Contentful ──GraphQL (ISR 1h)──▶ helpers/contentful.ts ──▶ server components (app/**/page.tsx) ──props──▶ client islands
     │ publish webhook                (loaders + converters)                                          (palette, chat, forms, motion)
     ▼                                                                                                        │
/api/revalidate ◀─────────────────────────────────────────────────────────────────── /api/* route handlers ◀┘ ──▶ Supabase, OpenAI
```

- **All content is in Contentful**, including site identity (the Site Settings singleton: name, role, socials, contact channels, default SEO). `loadSiteSettings()` feeds the layout and `SiteSettingsContext`.
- **Home sections are found by `key`** (`hero`, `manifesto`, `work`, `about`, `capabilities`, `career`, `certifications`, `collaborations`, `testimonials`), never by position or name. `app/page.tsx` renders them in the order Page "home" lists them.
- The `work` section's items are the source of truth for project routes, the sitemap and search.
- **Loaders return app types.** Components never see raw Contentful shapes (`types/contentful.ts`); converters live in `helpers/contentful.ts` (`toPortfolioItem`, `toBlogPost`, `toLink`, `toSeo`, …). Exception: the case study still receives `RawProject`.
- `runQuery` renders around `UNRESOLVABLE_LINK` errors (unpublished links come back nulled) and throws on any other GraphQL error. `loadWork` deliberately tolerates partial data.
- `GET_HOME` is close to Contentful's 11,000 query-cost cap. Check `X-Contentful-Graphql-Query-Cost: true` before adding linked fields to it.
- **Env**: read variables only through `helpers/env.ts` (`clientEnv`, `serverEnv`). `instrumentation.ts` calls `assertEnv()`: missing Contentful variables stop the server, and missing feature variables are logged.
- **API routes** (`/api/ask`, `/api/comments`, `/api/views`, `/api/revalidate`, `/api/search`) validate bodies with yup schemas through `parseJsonBody`, rate-limit by IP and answer every error as `{ error: string }` (`helpers/apiProtection.ts`).
- **Supabase** goes through the service layer (`services/*`, built on `BaseService`). Never call `supabase.from()` in components or routes. The anon key can't read comment emails or unapproved rows, so inserts skip `RETURNING`.
- **Security headers and a Report-Only CSP** are set in `next.config.js`, and violations report to Sentry. Add new third-party origins there.

## 3. Folder structure

```
contentful/   migrations (NNN_*.cjs + NNN_*.data.ts), cms:check rules, CMA client, seed-assets/
data/         knowledge/*.md → embeddings.json (RAG for /api/ask)
docs/         engineering/ (CI_CD, audits), cms/ (CONVENTIONS, HOW_TO_ADD, LAUNCH, COPY_REVIEW), redesign/ (AWWWARDS, IMAGES, plates), archive/
e2e/          Playwright: fixtures.ts, smoke, a11y (axe), responsive (overflow)
migrations/   Supabase SQL
scripts/      responsive-audit, plates, icons, embed, awwwards
src/app/      routes, route handlers, OG images, sitemap, feed, sw.ts; *.dev.tsx routes exist only under `next dev`
src/clients/  apollo.ts (server-only), supabase.ts, openai.ts
src/components/
  layouts/    Navbar, Menu, Footer, PageTransition, Preloader
  motion/     RevealText, RevealImage, ScrambleText
  pages/      <route>/<Component>/  (homepage, portfolio, blog, contact, stats, resume, notFound)
  utilities/  shared UI: Button, Modal, CommandPalette, FloatingChat, FormField, JsonLd, ThemedImage, …
src/config/   site.ts (technical config), imageCrops.ts (plate crop table)
src/helpers/  loaders/converters, env, apiProtection, animations, format, richText, caseStudy, …
src/hooks/ src/contexts/ src/queries/ src/services/ src/types/
src/styles/   tokens.scss (+ tokens.ts mirror), shared/_mixin.scss, _base.scss, _typography.scss, globals.scss
templates/    Plop templates
```

## 4. Design system rules

- **Tokens**: every colour, font, type step, space, radius, duration and easing is a custom property in `src/styles/tokens.scss` (dark on `:root`, light on `[data-theme='light']`). Raw colour values live only there. `tokens.ts` mirrors the few values JS needs, and `tokens.test.ts` keeps the two in sync.
- **Type**: `--font-display` (Inter Tight), `--font-text`, `--font-serif` (Instrument Serif, italic accents), `--font-mono` (JetBrains Mono, labels). The fluid scale runs `--step--1` … `--step-7`. Set copy in sentence case; the design applies uppercase itself.
- **Grid**: 12 columns (`grid-12`, `col()` mixins, `--grid-gutter`, `--grid-margin`, `--grid-max: 120rem`). Above 1920px the root font size scales (`_base.scss`), so rem-capped values follow and 3840 renders as a 2× 1920 layout. Give wide `next/image` `sizes` a `vw` term from 1920.
- **Responsive**: use the breakpoint variables in `_mixin.scss` (`$xs` … `$xxxxl`, `$lm`). Gate hover with `@include hover` / `$can-hover`. Touch sizing uses `tap-target` / `tap-pad` and `--tap-min`. Everything must work from 320px to 3840px with no horizontal scroll.
- **Shared mixins** (`@use 'styles/shared/mixin' as *;`, never `styles/shared`): `mono-type`, `mono-label`, `focus-ring($offset)`, `pill-button`, `outline-button`, `draw-underline`, `sr-only`, `tap-target`, `tap-pad`, `container*`, `section-padding`. Use them instead of repeating their declarations.
- **z-index order** (low → high): section-local layers 1–20 · chat window 999 · navbar, chat launcher, palette hint 1000 · Modal 1050 · Menu, CommandPalette 1100 · Preloader 3000 · grain overlay (`_base.scss`) · dev GridOverlay. Fit new layers into this order. Don't invent new top values.
- **Motion**: Motion/React only (GSAP was removed; don't re-add it). Shared variants are in `helpers/animations.ts`. Primitives:
  - `RevealText` and `RevealImage`: line mask and clip-path reveals.
  - `ScrambleText`: mono glyph scramble on enter, hover or scroll; used for homepage section headings.
  - `useMagneticHover`: imperative `animate()` on the primary CTAs.
  - Page transitions: React `<ViewTransition>` in `layouts/PageTransition`.
  - Lenis smooth scroll in `app/provider.tsx`.
- **Reduced motion is mandatory**: CSS durations collapse to 0 via the tokens; components use `useReducedMotion`/`usePrefersReducedMotion` and swap to `fadeVariants`. Every new effect needs a reduced-motion path.
- **View-transition invariants**: no `loading.tsx` files, no `opacity: 0` ancestors around morph targets, the scroll reset stays in `useLayoutEffect`, and the transition wrapper stays opaque.
- **Accessibility**: Lighthouse a11y stays at 100 and axe passes on every route in both themes (e2e enforces it). Focus is always visible (`focus-ring`). Overlays trap focus and return it to their opener. Test dark and light for every visual change.

## 5. CMS rules

Read [docs/cms/CONVENTIONS.md](docs/cms/CONVENTIONS.md) (rules) and [docs/cms/HOW_TO_ADD.md](docs/cms/HOW_TO_ADD.md) (recipes) before touching Contentful or its queries.

- **Schema changes are migrations in code**: `contentful/migrations/NNN_*.cjs` (+ optional `.data.ts`), run with `pnpm cms:migrate --env <id> [--apply]`. Never edit content types by hand, through the web app or through MCP. Expand first, contract later. The space caps at 25 content types (17 used).
- **Never run migrations or content writes against `master` directly** without the user's OK. Try them on a cloned environment first.
- Query, raw type and converter changes ship in the same PR as the migration that needs them. Contentful GraphQL rejects queries for fields that don't exist yet.
- **Content writes are drafts.** Publish only with the user's explicit OK: `pnpm cms:check --env <id>` (must exit 0), then `pnpm cms:publish --env <id> --apply`.
- Never delete entries, assets or types; tag them `deprecated` / `retired`. A published slug never changes without a redirect in `next.config.js`.
- Every image in use needs alt text in its asset description. Project covers come from the plate pipeline (`pnpm plates`, `/dev/plates`, `pnpm plates:upload`).
- Public information only: no confidential client names, internal systems or private figures.
- Preview drafts with `rm -rf .next/cache/fetch-cache && CONTENTFUL_PREVIEW=true pnpm build`.

## 6. Code standards

- **Naming**: components are PascalCase (folder, file and export match: `HomeHeader/HomeHeader.tsx`); BEM classes rooted in the component name (`HomeHeader__item--active`); helpers, hooks and constants are camelCase; type files are snake/domain names (`types/blog.ts`).
- **Imports**: path aliases only (`components/…`, `helpers/…`, `hooks/…`, `services/…`, `types/…`, `config/…`, `constants/…`, `contexts/…`, `clients/…`, `queries/…`, `styles/…`, `app/…`, `data/…`); no `../` across directories. **No barrels**: import the file directly (`components/utilities/Button/Button`). Barrel imports from server components ship every `'use client'` module in them, so the barrels were deleted. Import order is enforced by ESLint.
- **Server first**: pages are server components that fetch and convert. Add `'use client'` only for hooks, browser APIs or handlers. Never import `@sentry/nextjs` in client code; use `helpers/monitoring.ts`, which loads it on idle.
- **Strict types**: `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `noFallthroughCasesInSwitch`. No `any` and no non-null assertions in app code (both are lint errors; tests and CLI scripts may assert). Props are an `interface` above the component, and components return `ReactElement`.
- **DRY, but no speculative abstraction**: extract on the second real copy (mixins, `helpers/animations.ts`, shared components); don't build helpers for one caller.
- **Comments**: none by default. Write only WHY (a constraint, workaround or invariant), never WHAT. Every exported helper and hook gets a one-line TSDoc.
- **Logging**: `console.error`/`console.warn` for server logs only. Any other `console` call fails lint in app code.
- **Formatting**: Prettier (tabs, single quotes, 80 cols) for code, SCSS, JSON and Markdown. lint-staged runs ESLint and Prettier on staged files.
- **Dead code**: `pnpm knip` must report nothing. It runs in CI.

## 7. Testing rules

| Suite            | Command                                                                                             | Must cover                                                                                                                                                                           |
| ---------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Unit + component | `pnpm test` (`test:coverage` enforces thresholds)                                                   | Converters and loaders, every helper with logic, schemas, env, API routes (validation, rate limit, reCAPTCHA, error shape), services, any component with keyboard or focus behaviour |
| E2E              | `pnpm build && pnpm start -p 3200 &` then `PLAYWRIGHT_BASE_URL=http://localhost:3200 pnpm test:e2e` | A smoke test per route, user flows, axe on every route in both themes, no overflow at 320/1920/3840                                                                                  |
| Visual baseline  | `AUDIT_STABLE=1 AUDIT_BASE_URL=… AUDIT_ONLY=360,1440,3840 node scripts/responsive-audit.ts`         | Run before and after refactors and diff; any difference must be explained                                                                                                            |

- New logic ships with tests, and `pnpm generate` scaffolds a test with every component.
- Tests use the aliases. Route-handler tests run in `// @vitest-environment node` with `test/api.ts` helpers, and mock services, not Supabase.
- e2e imports `test` from `e2e/fixtures.ts`, which answers `POST /api/views` locally so runs don't inflate the live view counts.
- Coverage thresholds (`vitest.config.ts`) only go up.

## 8. Git workflow

- Branch from `main`: `feat/…`, `fix/…`, `chore/…`. Open a PR into `main`.
- Conventional Commits, enforced by commitlint (lowercase subjects) and the PR-title check. Squash-merge, so the PR title becomes the commit and feeds release-please.
- A PR merges only when CI is green (quality, tests, build, gitleaks, CodeQL) and the Vercel preview passes Playwright, axe and Lighthouse. Review the preview URL yourself for visual changes.
- Releases: merge the release-please PR on `main`.
- Never commit secrets (`.env` holds real credentials; `.env.example` is the template). `next dev`/`build` rewrite `next-env.d.ts`, so revert it before committing.

## 9. Dev commands

```bash
pnpm dev | build | start           # Next.js
pnpm lint | lint:fix               # ESLint
pnpm format | format:fix           # Prettier
pnpm typecheck                     # tsc --noEmit
pnpm knip                          # unused files/exports/deps
pnpm test | test:watch | test:coverage
pnpm test:e2e                      # Playwright (PLAYWRIGHT_BASE_URL to target a running build)
pnpm generate                      # Plop: component or route
pnpm analyze                       # webpack bundle analyzer
pnpm cms:migrate|cms:check|cms:publish --env <id> [--apply]
pnpm plates [slug] | plates:upload --env <id>
pnpm embed | embed:check           # RAG embeddings from data/knowledge
pnpm icons                         # app icons
```

## 10. Do / Don't

**Do**

- Read `helpers/contentful.ts` before touching homepage data, and look sections up by key.
- Use tokens, mixins and `helpers/animations.ts` before writing new styles or variants.
- Give every new effect a reduced-motion path, and check 320px, 1440px and 3840px in both themes.
- Validate API input with a schema, rate-limit it, and answer errors as `{ error }`.
- Add new third-party origins to the CSP in `next.config.js`.
- Update this file and the docs when you change a rule.

**Don't**

- Hard-code colours, sizes or durations, or add tokens outside `tokens.scss`.
- Import barrels, `@sentry/nextjs` in client code, or `helpers/contentful` from client components.
- Call Supabase outside `services/`, or read `process.env` outside `helpers/env.ts` (`NODE_ENV`, `VERCEL` and `NEXT_RUNTIME` excepted).
- Edit Contentful schema outside migrations, publish without the user's OK, or change a published slug without a redirect.
- Disable contact-form fields while sending (EmailJS reads the FormData).
- Add `loading.tsx`, re-add GSAP, or leave dead code for knip to find.

## 11. How to make a typical change

**New homepage section**

1. Write a migration: add the key to `section.key`'s allowed values and any fields → `pnpm cms:migrate --env <clone> --apply`.
2. Extend `GET_HOME` (check the query cost), `types/contentful.ts`, `types/home.ts` and `loadHome`, with a converter test.
3. `pnpm generate` → `pages/homepage/HomeX`; add it to the `sections` map in `app/page.tsx`.
4. Create the Home Section entry (draft) and place it in Page "home" → `cms:check` → publish with an OK.

**New project**

1. Create the Portfolio Project entry per HOW_TO_ADD (slug rules, alt text).
2. Make cover plates: add it to `scripts/plates/projects.config.ts` → `pnpm plates <slug>` → check `/dev/plates` → `pnpm plates:upload --env <id> --apply`.
3. Add it to the `work` section's items (this creates the route, sitemap and search entries) → `cms:check` → publish.

**New blog post**

Create a Blog Post draft (category, tags, published date, featured image with alt text) → preview build → `cms:check` → publish. The webhook revalidates `/blog/[slug]` and the sitemap.

**New component**

`pnpm generate` → component (utilities/layouts/motion/pages) or route. You get `.tsx`, `.module.scss` and `.test.tsx` in the house style. Import it by direct path, style it with tokens and mixins, and fill in the test.
