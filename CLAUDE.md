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
- Motion/React (Framer Motion v12) + GSAP for animations
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
│   │   ├── api/                # Route handlers (comments, subscribe)
│   │   ├── blog/               # Blog listing + [slug] detail pages
│   │   ├── contact/            # Contact page
│   │   ├── portfolio/[id]/     # Portfolio detail page
│   │   ├── layout.tsx          # Root layout — fonts, providers, persistent UI
│   │   ├── page.tsx            # Homepage (Server Component)
│   │   ├── provider.tsx        # Client providers (Theme, Lenis, analytics)
│   │   └── transition.tsx      # Page transition curve (AnimatePresence)
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
│   ├── constants/index.tsx     # Nav links, social links, contact info, song list
│   ├── contexts/               # ThemeContext (dark/light)
│   ├── helpers/                # Pure utility functions
│   │   ├── analytics.ts        # GTM init
│   │   ├── animations.ts       # Shared Motion/React Variants
│   │   ├── blog.ts             # Related-post scoring logic
│   │   ├── career.ts           # Career data transform
│   │   ├── contentful.ts       # loadData / loadBlogPosts / converters
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
│   │   ├── theme.scss          # CSS custom properties for dark/light themes
│   │   └── shared/             # _variables.scss, _mixin.scss, _fonts.scss, _base.scss
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

All page content lives in Contentful. `loadData('home')` fetches the full page tree via `GET_PAGE`. Sections are indexed positionally (sections[0] = header, sections[1] = services, etc.) — this order must match Contentful.

### Service Layer (Supabase)

`BaseService` in `src/services/index.ts` is the generic Supabase CRUD class. Domain services (e.g. `CommentsService`) extend it, adding transforms between DB snake_case and app camelCase. Always use the singleton exports (`commentsService`, `baseService`), not direct Supabase queries.

### Theme System

CSS custom properties on `:root` (dark, default) and `[data-theme='light']` in `theme.scss`. `ThemeContext` toggles `data-theme` on `<html>`. SCSS uses `$color-*` variables from `_variables.scss`, which are aliases to the CSS vars — never hardcode hex values.

### Animation Strategy

- **Motion/React**: Declarative component animations (page transitions, scroll reveals, stagger children). Reusable variants live in `helpers/animations.ts`.
- **GSAP**: Imperative mouse/scroll effects (MagneticButton hover tracking, HomeCertifications auto-scroll). Use GSAP only when Motion can't do it cleanly.
- **Lenis**: Smooth scroll provider wrapping the whole app via `ReactLenis` in `provider.tsx`.

### Page Transitions

`transition.tsx` (the `Curve` component) wraps all page content in `AnimatePresence`. It renders an SVG curve overlay and a welcome text phrase per route.

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
import { loadData } from 'helpers/contentful'; // ✓
import { Button } from 'components/utilities'; // ✓
import { loadData } from '../../helpers/contentful'; // ✗
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
- **Constants**: All nav links, social links, and contact options live in `constants/index.tsx`. Never inline them in components.
- **Barrel exports**: Every component folder group has an `index.ts`. Add new exports there; import from the barrel, not the file directly.
- **Service layer**: Never call `supabase.from(...)` directly in components or API routes — go through `commentsService` / `subscriptionsService` / `baseService`.
- **Content converters**: Use `convertContentfulBlogPost`, `convertContentfulCategory`, etc. from `helpers/contentful.ts` when mapping API responses to app types.
- **Plop generators**: Use `pnpm generate` to scaffold new components or pages — it creates the `.tsx`, `.module.scss`, `index.ts`, and `.stories.ts` files from templates.

---

## 6. Key Files

| File                                                                    | Purpose                                                                                       |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| [src/app/layout.tsx](src/app/layout.tsx)                                | Root layout — fonts, Sentry, global providers, persistent UI elements                         |
| [src/app/page.tsx](src/app/page.tsx)                                    | Homepage — fetches Contentful data and distributes to section components                      |
| [src/app/provider.tsx](src/app/provider.tsx)                            | Client providers: ThemeProvider, ReactLenis, GTM init                                         |
| [src/app/transition.tsx](src/app/transition.tsx)                        | SVG curve page transition (AnimatePresence wrapper)                                           |
| [src/helpers/contentful.ts](src/helpers/contentful.ts)                  | All Contentful data fetching (`loadData`, `loadBlogPosts`, `loadBlogPostBySlug`) + converters |
| [src/helpers/animations.ts](src/helpers/animations.ts)                  | Shared Motion/React animation variant definitions                                             |
| [src/constants/index.tsx](src/constants/index.tsx)                      | Nav links, social links, footer links, contact options, song list                             |
| [src/styles/theme.scss](src/styles/theme.scss)                          | CSS custom properties for dark + light themes                                                 |
| [src/styles/shared/\_variables.scss](src/styles/shared/_variables.scss) | SCSS `$color-*` variables (aliases to CSS vars)                                               |
| [src/styles/shared/\_mixin.scss](src/styles/shared/_mixin.scss)         | `rem()` function + responsive breakpoints                                                     |
| [lib/apolloClient.ts](lib/apolloClient.ts)                              | Apollo Client singleton (SSR-aware, Contentful GraphQL endpoint)                              |
| [src/services/index.ts](src/services/index.ts)                          | BaseService — generic Supabase CRUD operations                                                |
| [src/queries/index.ts](src/queries/index.ts)                            | All Contentful GraphQL queries (`GET_PAGE`, blog queries)                                     |
| [next.config.js](next.config.js)                                        | SVGR config, Sentry wrapper, allowed image hostnames, env vars                                |
| [plopfile.ts](plopfile.ts)                                              | Plop generators for component and page scaffolding                                            |
| [src/clients/supabase.ts](src/clients/supabase.ts)                      | Supabase client singleton                                                                     |

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
pnpm test             # Vitest unit tests (helpers + services)
pnpm test:watch       # Vitest watch mode
pnpm test:e2e         # Playwright smoke tests (starts dev server automatically)
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
| **GSAP**                  | Imperative animations (magnetic hover, scroll-driven effects)                 |
| **Lenis**                 | Smooth scroll (`@studio-freight/react-lenis`)                                 |
| **React Hook Form + Yup** | Form state management + schema validation                                     |
| **Storybook**             | Component development and documentation                                       |
| **Hugging Face Space**    | AI chatbot embedded via `FloatingChat` (`nithiin7-portfolio-resume.hf.space`) |

---

## 9. Do's and Don'ts

**Do:**

- Use `pnpm generate` (Plop) when creating new components — it scaffolds all required files.
- Import from barrel `index.ts` files: `import { Button } from 'components/utilities'`.
- Use `$color-*` SCSS variables for all colors — never hardcode hex values.
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
- Don't mix Motion and GSAP on the same element. Use Motion for declarative; GSAP for imperative mouse/scroll effects.
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

- Animation: Use Motion/React unless mouse-tracking or GSAP-specific easing is needed.
- Styling: SCSS Modules with `$color-*` vars. No inline styles except for Motion `style` props.
- Data fetching: Server Components with Apollo for Contentful. Service classes for Supabase.
- Forms: React Hook Form + Yup — don't invent alternatives.
- Code generation: Always suggest `pnpm generate` for new components; follow the Plop template structure.

**Before making changes:**

1. Check `helpers/animations.ts` before defining new animation variants.
2. Check `constants/index.tsx` before adding new nav links or social data inline.
3. Check `components/utilities/index.ts` before building a component that might already exist.
4. Verify Contentful section index in `src/app/page.tsx` before touching homepage data flow — section order is positional and must match the CMS.

**Commit messages:** Conventional Commits format required. Husky will reject non-conforming commits.

**When in doubt about a component pattern**, look at `HomeHeader` or `MagneticButton` as reference implementations for complex client components with GSAP/Motion.
