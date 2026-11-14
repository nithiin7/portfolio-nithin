# Awwwards submission kit

Everything needed for the Awwwards "Submit your site" form. Images live in
[`awwwards/`](awwwards/) and are regenerated from a production build with:

```bash
pnpm build && pnpm start -p 3200
AWWWARDS_BASE_URL=http://localhost:3200 node scripts/awwwards.ts
```

The script skips the first-visit preloader, waits for entrance animations to
settle, and hides the floating chat bubble and ⌘K pill (app chrome, not design).

## Images

| File                                                                | Size        | What it shows                                             |
| ------------------------------------------------------------------- | ----------- | --------------------------------------------------------- |
| [cover-1600x1200.jpg](awwwards/cover-1600x1200.jpg)                 | 1600 × 1200 | **Cover**: home hero, name set to the fold, live meta row |
| [desktop-1-hero.jpg](awwwards/desktop-1-hero.jpg)                   | 1920 × 1080 | Home hero at full HD                                      |
| [desktop-2-works-preview.jpg](awwwards/desktop-2-works-preview.jpg) | 1920 × 1080 | Works index: cursor-following preview, other rows recede  |
| [desktop-3-case-study.jpg](awwwards/desktop-3-case-study.jpg)       | 1920 × 1080 | Case study `/portfolio/2`: title, meta strip, cover       |
| [mobile-1-hero.jpg](awwwards/mobile-1-hero.jpg)                     | 1170 × 2532 | Home hero on a 390 pt phone (@3x)                         |
| [mobile-2-blog.jpg](awwwards/mobile-2-blog.jpg)                     | 1170 × 2532 | Journal index on a 390 pt phone (@3x)                     |

## Description (60 words)

> Portfolio of Nithin Pradeep, a Senior Technical Consultant at EY building AI
> agents, guardrails and MCP infrastructure. An editorial Swiss system of
> oversized grotesk, mono metadata and a visible twelve-column grid carries
> case studies, a journal and live stats. A cursor-following works
> index, wipe page transitions and a ⌘K palette that answers questions
> about my work keep it fast, accessible.

## Tags

Portfolio · Personal · Technology · Typography · Editorial · Swiss Style · Grid ·
Minimal · Dark · Black & White · Interaction Design · Transitions · Animation ·
Cursor · AI

**Category**: Portfolio · **Colors**: `#0B0B0B` ink, `#F2F1EC` paper, orange accent

## Technologies

| Area      | Stack                                                                       |
| --------- | --------------------------------------------------------------------------- |
| Framework | Next.js 16 (App Router, React Server Components, ISR), React 19, TypeScript |
| Styling   | Sass modules on a design-token system (`tokens.scss`), dark + light themes  |
| Motion    | Motion (Framer Motion), React View Transitions, CSS keyframes, Lenis        |
| Content   | Contentful (GraphQL via Apollo Client)                                      |
| Data      | Supabase (comments, views, newsletter), GitHub, WakaTime, Dev.to APIs       |
| AI        | OpenAI embeddings + chat (RAG over a curated knowledge base), Hugging Face  |
| Forms     | React Hook Form + Yup, EmailJS, reCAPTCHA v3                                |
| Platform  | Vercel (hosting, Analytics, Speed Insights), Serwist PWA, Sentry            |
| Quality   | Playwright + axe-core, Vitest, Storybook, Lighthouse                        |

## Scores (Phase 10, mobile Lighthouse)

Measured on a local production build behind HTTP/2 + Brotli (how Vercel serves
it), median of three runs:

| Page           | Performance | Accessibility | Best Practices | SEO |
| -------------- | ----------- | ------------- | -------------- | --- |
| `/`            | 95          | 100           | 100            | 100 |
| `/portfolio/1` | 96          | 100           | 100            | 100 |
| `/blog`        | 95          | 100           | 100            | 100 |
| `/contact`     | 96          | 100           | 100            | 100 |

Re-run Lighthouse against the production URL once `redesign` ships, and use those
numbers if the form asks.
