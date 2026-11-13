## Active work: v5 redesign

- Plan & audit: `docs/redesign/Redesign plan.md` — read before any change.
- Chosen direction: A — Editorial Swiss (see sections 4 and 4c of the plan).
- Work only on `redesign` or `redesign/phase-*` branches. Never touch `main`.
- Content model & editing: `docs/cms/CONVENTIONS.md` (rules) and `docs/cms/HOW_TO_ADD.md` (recipes) — read before touching Contentful or its queries.
- New design tokens live in src/styles/tokens.scss; do not add new colors elsewhere.
- Every section must: honour prefers-reduced-motion, work at 360px width, keep Lighthouse a11y = 100.
- After each phase: run `pnpm lint && pnpm test && pnpm build`, then summarise changes.

# CLAUDE.md — Portfolio Nithin

Living reference for Claude sessions working in this repo. Read this before making any changes.

---

## 1. Project Overview

Personal portfolio website for **Nithin Pradeep** (Full Stack Developer). A content-driven, animation-heavy site with a blog, portfolio showcase, contact form, and comment system.

**Tech stack:**

- Next.js 16 (App Router, Turbopack in dev)
- React 19 + TypeScript (strict mode)
- SCSS Modules for styling
- Contentful CMS → Apollo Client (GraphQL) for all page/blog/portfolio content
- Supabase for comments and newsletter subscriptions
- Motion/React (Framer Motion v12) for animations
- Lenis for smooth scrolling
- React Hook Form + Yup for form validation
- EmailJS for contact form emails
- Google GTM + Sentry for analytics and error tracking
- Storybook for component documentation
- Plop for code generation, Husky + Commitlint for git hygiene

---

## 2. Folder Structure

```
portfolio-nithin/
├── lib/                        # Apollo Client setup (Contentful GraphQL)
├── migrations/                 # Supabase SQL migration files
├── public/                     # Static assets (SVGs, resume PDF, favicons)
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # Route handlers (comments, subscribe, revalidate)
│   │   ├── blog/               # Blog listing + [slug] detail pages
│   │   ├── contact/            # Contact page
│   │   ├── portfolio/[id]/     # Portfolio detail page
│   │   ├── layout.tsx          # Root layout — fonts, providers, persistent UI
│   │   ├── page.tsx            # Homepage (Server Component)
│   │   ├── provider.tsx        # Client providers (Theme, Lenis, analytics)
│   ├── assets/
│   │   ├── icons/              # SVG icon components
│   │   └── logos/              # Brand logo components and SVG files
│   ├── clients/
│   │   └── supabase.ts         # Supabase client singleton
│   ├── components/
│   │   ├── layouts/            # Navbar, Menu, Footer
│   │   ├── pages/              # Page-specific components grouped by route
│   │   │   ├── blog/
│   │   │   ├── contact/
│   │   │   ├── homepage/
│   │   │   └── portfolio/
│   │   └── utilities/          # Reusable UI primitives (Button, Modal, Tag, etc.)
│   ├── constants/index.tsx     # Nav links, icon maps, song list (socials/contact live in Contentful)
│   ├── contexts/               # ThemeContext (dark/light)
│   ├── helpers/                # Pure utility functions
│   │   ├── analytics.ts        # GTM init
│   │   ├── animations.ts       # Shared Motion/React Variants
│   │   ├── blog.ts             # Related-post scoring logic
│   │   ├── career.ts           # Career data transform
│   │   ├── contentful.ts       # loadHome / loadSiteSettings / loadProject / blog loaders + converters (server-only)
│   │   ├── social.ts
│   │   └── validations.ts
│   ├── hooks/                  # Custom hooks (useScrollDirection, useKeyboardNavigation)
│   ├── models/                 # Data models (subscription)
│   ├── queries/                # GraphQL query definitions (Apollo gql)
│   ├── services/               # Service layer for Supabase CRUD
│   │   ├── index.ts            # BaseService (generic get/post/put/patch/delete)
│   │   ├── comments/           # CommentsService extends BaseService
│   │   └── subscriptions/
│   ├── styles/
│   │   ├── globals.scss        # Global resets and base styles
│   │   ├── tokens.scss         # Design tokens (dark/light), mirrored in tokens.ts
│   │   └── shared/             # _mixin.scss, _fonts.scss, _base.scss
│   └── types/                  # TypeScript interfaces/types per domain
├── templates/                  # Plop Handlebars templates (component, page)
├── next.config.js              # SVGR, Sentry, image domains, env vars
├── tsconfig.json               # Path aliases, strict mode
└── plopfile.ts                 # Plop generators (component, page)
```

---

## 3. Architecture & Patterns

### Data Flow

```
Contentful CMS
    ↓ Apollo GraphQL (SSR, InMemoryCache)
Server Components (app/page.tsx, app/blog/page.tsx, etc.)
    ↓ props
Client Components (components/pages/...)
```

All content lives in Contentful, including site identity (the **Site Settings** singleton: name, role, socials, contact channels, default SEO). `loadSiteSettings()` feeds the layout and client components through `SiteSettingsContext`. `loadHome()` reads Page "home": each **Home Section** is identified by its `key` (`hero`, `work`, `about`, …), never by position, and `page.tsx` renders them in the order the CMS lists them (hero first). The `work` section's items are the source of truth for project routes, sitemap and search (private Contentful tags are invisible to the delivery API).

### Contentful rules

- **Schema changes only through migrations**: `contentful/migrations/NNN_*.cjs` (+ optional `NNN_*.data.ts`), run with `pnpm cms:migrate --env <id> [--apply]`. Never edit content types by hand or through MCP. Expand first, contract later. The plan caps the space at 25 content types (17 used).
- Query, raw type (`types/contentful.ts`) and converter changes ship in the same PR as the migration that needs them.
- **Content writes are drafts.** Never publish without the user's explicit OK. Then `pnpm cms:check --env <id>` (must exit 0) → `pnpm cms:publish --env <id> --apply`.
- Never delete entries, assets or types without asking; tag them `deprecated` / `retired`.
- A published slug never changes without a redirect in `next.config.js` (`cms:check` enforces it).
- Every image in use needs alt text in its asset description. Project covers come from the plate pipeline (`pnpm plates`, `pnpm plates:upload --env <id>`).
- Queries take `$preview`. Verify drafts with `CONTENTFUL_PREVIEW=true pnpm build` after `rm -rf .next/cache/fetch-cache`.
- Public information only: no confidential client names, internal systems or private figures in copy.

### Service Layer (Supabase)

`BaseService` in `src/services/index.ts` is the generic Supabase CRUD class. Domain services (e.g. `CommentsService`) extend it, adding transforms between DB snake_case and app camelCase. Always use the singleton exports (`commentsService`, `baseService`), not direct Supabase queries.

### Theme System

Semantic CSS custom properties (`--bg`, `--fg`, `--muted`, `--line`, `--accent`, `--surface-*`, …) on `:root` (dark, default) and `[data-theme='light']` in `src/styles/tokens.scss`. `ThemeContext` toggles `data-theme` on `<html>`. SCSS uses `var(--token)` directly — never hardcode hex values. `src/styles/tokens.ts` mirrors the few values JS needs (OG images, manifest, icons).

### Animation Strategy

- **Motion/React**: Declarative component animations (page transitions, scroll reveals, stagger children). Reusable variants live in `helpers/animations.ts`.
- **Imperative effects**: Motion's `animate()` on refs (e.g. `useMagneticHover` on the hero and footer CTAs). GSAP was removed in Phase 10 — don't re-add it.
- **Lenis**: Smooth scroll provider wrapping the whole app via `ReactLenis` in `provider.tsx`.

### Page Transitions

`components/layouts/PageTransition` wraps page content in a React `<ViewTransition>` keyed by pathname (old page fades, ink panel wipes, new page reveals), plus named shared-element morphs for blog and portfolio images.

---

## 4. Code Standards

### TypeScript

- Strict mode on. Always type component props with an `interface` declared above the component.
- Return type annotation on components: `: ReactElement` (for function components) or `: FC<Props>`.
- Use `type` for unions/primitives, `interface` for object shapes.

### Naming

- Components: `PascalCase` — file, folder, and export name all match (e.g. `HomeHeader/HomeHeader.tsx`).
- CSS classes: BEM-style with component name as root — `HomeHeader`, `HomeHeader__nav`, `HomeHeader__item--active`.
- Helpers/constants/hooks: `camelCase`.
- Types files: snake_case domain name (e.g. `types/blog.ts`, `types/comment.ts`).

### Imports

Always use path aliases, never relative paths for cross-directory imports:

```ts
import { loadHome } from 'helpers/contentful'; // ✓
import { Button } from 'components/utilities'; // ✓
import { loadHome } from '../../helpers/contentful'; // ✗
```

Active aliases (baseUrl = `./src/`):
`assets/*`, `components/*`, `helpers/*`, `queries/*`, `styles/*`  
Also directly usable: `contexts/`, `types/`, `constants/`, `hooks/`, `clients/`, `services/`

### SCSS

- Use `rem()` mixin from `_mixin.scss` for pixel-to-rem conversion.
- Use breakpoint variables (`$xs`, `$sm`, `$md`, `$lg`, `$xl`, `$xxl`, `$xxxl`) from `_mixin.scss`.
- Import shared utilities via `@use 'styles/shared'` or per-file as needed.

### Comments

Default to **no comments**. Only comment when the _why_ is non-obvious (hidden constraint, workaround, subtle invariant). Never explain what the code does.

---

## 5. DRY & Clean Code Rules

- **Animation variants**: If a Motion variant is used in more than one component, move it to `helpers/animations.ts` and import it.
- **Constants**: Nav links and icon maps live in `constants/index.tsx`. Socials, contact channels and anything an editor might change live in Contentful (Site Settings / Link entries). Never inline either in components.
- **Barrel exports**: Every component folder group has an `index.ts` (kept for Storybook/tests). App code imports the component file directly (`import Button from 'components/utilities/Button/Button'`): importing a barrel from a server component ships every `'use client'` module in it to that page (Phase 10 cut ~100 KB gz this way). Same for `helpers` — import `helpers/format`, `helpers/scroll`, etc., never the `helpers` index (it pulls in `yup`).
- **Service layer**: Never call `supabase.from(...)` directly in components or API routes — go through `commentsService` / `subscriptionsService` / `baseService`.
- **Content converters**: Map raw GraphQL responses (`types/contentful.ts`) to app types inside `helpers/contentful.ts` (`convertContentfulBlogPost`, `toPortfolioItem`, `toLink`, `toSeo`, …). Components never see raw Contentful shapes.
- **Plop generators**: Use `pnpm generate` to scaffold new components or pages — it creates the `.tsx`, `.module.scss`, `index.ts`, and `.stories.ts` files from templates.

---

## 6. Key Files

| File                                                            | Purpose                                                                                                     |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| [src/app/layout.tsx](src/app/layout.tsx)                        | Root layout — fonts, Sentry, global providers, persistent UI elements                                       |
| [src/app/page.tsx](src/app/page.tsx)                            | Homepage — fetches Contentful data and distributes to section components                                    |
| [src/app/provider.tsx](src/app/provider.tsx)                    | Client providers: ThemeProvider, ReactLenis, GTM init                                                       |
| [src/helpers/contentful.ts](src/helpers/contentful.ts)          | All Contentful data fetching (`loadHome`, `loadSiteSettings`, `loadProject`, blog loaders) + converters     |
| [src/helpers/animations.ts](src/helpers/animations.ts)          | Shared Motion/React animation variant definitions                                                           |
| [src/constants/index.tsx](src/constants/index.tsx)              | Nav links, link icon map, menu socials filter, song list                                                    |
| [src/styles/tokens.scss](src/styles/tokens.scss)                | Design tokens: colour, type scale, spacing, grid, motion (dark + light)                                     |
| [src/styles/shared/\_mixin.scss](src/styles/shared/_mixin.scss) | `rem()` function + responsive breakpoints                                                                   |
| [lib/apolloClient.ts](lib/apolloClient.ts)                      | Apollo Client singleton (SSR-aware, Contentful GraphQL endpoint)                                            |
| [src/services/index.ts](src/services/index.ts)                  | BaseService — generic Supabase CRUD operations                                                              |
| [src/queries/index.ts](src/queries/index.ts)                    | Contentful GraphQL queries (`GET_HOME`, `GET_SITE_SETTINGS`, SEO, blog); projects in `queries/portfolio.ts` |
| [contentful/](contentful/)                                      | Migrations, `cms:migrate` / `cms:check` / `cms:publish` scripts, CMA client                                 |
| [next.config.js](next.config.js)                                | SVGR config, Sentry wrapper, allowed image hostnames, env vars                                              |
| [plopfile.ts](plopfile.ts)                                      | Plop generators for component and page scaffolding                                                          |
| [src/clients/supabase.ts](src/clients/supabase.ts)              | Supabase client singleton                                                                                   |

---

## 7. Dev Commands

```bash
pnpm dev              # Start dev server (Next.js + Turbopack)
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # Next.js built-in lint
pnpm eslint           # ESLint check
pnpm eslint:fix       # ESLint auto-fix
pnpm prettier         # Prettier check
pnpm prettier:fix     # Prettier auto-fix
pnpm generate         # Plop — scaffold a new component or page
pnpm test             # Vitest unit tests (helpers, services, components, cms rules)
pnpm test:watch       # Vitest watch mode
pnpm test:e2e         # Playwright smoke tests (starts dev server automatically)
pnpm cms:check --env <id>            # Content lint (alt text, broken/unpublished links, slug redirects, style)
pnpm cms:migrate --env <id> [--apply]  # Contentful schema migrations (contentful/migrations)
pnpm cms:publish --env <id> [--apply]  # Publish pending drafts in link order
pnpm plates [slug]    # Compose project image plates; plates:upload --env <id> links them as drafts
pnpm storybook        # Storybook dev server on :6006
pnpm build-storybook  # Build Storybook static site
pnpm release          # standard-version release (patch)
pnpm release:minor    # minor version bump
pnpm release:major    # major version bump
```

Pre-commit hook runs `prettier:fix` + `eslint:fix` on staged files via lint-staged. Commit messages must follow Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, etc.).

---

## 8. Dependencies & Integrations

| Integration               | Role                                                                          |
| ------------------------- | ----------------------------------------------------------------------------- |
| **Contentful**            | CMS — all page content, blog posts, portfolio items fetched via GraphQL       |
| **Apollo Client**         | GraphQL client for Contentful; SSR-aware with InMemoryCache                   |
| **Supabase**              | Postgres DB for blog comments and newsletter subscriptions                    |
| **EmailJS**               | Sends contact form submissions via email template                             |
| **Google GTM**            | Tag manager for analytics (`GTM-P4D6XZ2C`)                                    |
| **Google reCAPTCHA v3**   | Spam protection on forms                                                      |
| **Sentry**                | Error tracking (server + edge + client configs)                               |
| **Motion/React**          | Declarative animations (page transitions, scroll reveals)                     |
| **Lenis**                 | Smooth scroll (`@studio-freight/react-lenis`)                                 |
| **React Hook Form + Yup** | Form state management + schema validation                                     |
| **Storybook**             | Component development and documentation                                       |
| **Hugging Face Space**    | AI chatbot embedded via `FloatingChat` (`nithiin7-portfolio-resume.hf.space`) |

---

## 9. Do's and Don'ts

**Do:**

- Use `pnpm generate` (Plop) when creating new components — it scaffolds all required files.
- Import component files directly, not via barrels: `import Button from 'components/utilities/Button/Button'`.
- Use semantic `var(--token)` colours from `tokens.scss` — never hardcode hex values.
- Keep reusable animation variants in `helpers/animations.ts`.
- Write Server Components for pages that fetch data; pass data down as props to Client Components.
- Add `'use client'` only when the component uses browser APIs, hooks, or event handlers.
- Follow BEM naming in SCSS modules: `ComponentName`, `ComponentName__element`, `ComponentName--modifier`.
- Use `rem()` for font sizes / spacing in SCSS.
- Test dark and light theme when making visual changes (toggle via `ThemeToggle`).

**Don't:**

- Don't use relative imports for anything reachable via a path alias.
- Don't hardcode colors — everything must go through CSS custom properties.
- Don't call Supabase directly from components or API routes — use the service layer.
- Don't add error handling for impossible scenarios or add fallbacks that mask real bugs.
- Don't create helper files or abstractions speculatively — only when duplication actually exists.
- Don't commit secrets. The `.env` file holds real credentials; `.env.example` is the safe template.
- Don't use `any` in TypeScript unless it's a genuine last resort (and existing `any` usages are not an invitation to add more).
- Don't write comments that explain WHAT the code does — only WHY when it's non-obvious.

---

## 10. Future Claude Instructions

**Tone:** Be direct and terse. No trailing summaries, no narrating your process. State what changed and what's next in one sentence.

**Verbosity:** One sentence per update while working. Short, complete sentences — not bullets of obvious observations.

**Preferred solutions:**

- Animation: Motion/React only (declarative components; `animate()` for imperative pointer effects).
- Styling: SCSS Modules with `var(--token)` colours. No inline styles except for Motion `style` props.
- Data fetching: Server Components with Apollo for Contentful. Service classes for Supabase.
- Forms: React Hook Form + Yup — don't invent alternatives.
- Code generation: Always suggest `pnpm generate` for new components; follow the Plop template structure.

**Before making changes:**

1. Check `helpers/animations.ts` before defining new animation variants.
2. Check `constants/index.tsx` (nav) and Site Settings in Contentful (socials, contact) before adding link data.
3. Check `components/utilities/index.ts` before building a component that might already exist.
4. Before touching homepage data flow, read `loadHome` in `helpers/contentful.ts`: sections are looked up by `key`, and their order comes from Page "home" in Contentful.

**Commit messages:** Conventional Commits format required. Husky will reject non-conforming commits.

**When in doubt about a component pattern**, look at `HomeHeader` or `WorksIndex` as reference implementations for complex client components with Motion.
