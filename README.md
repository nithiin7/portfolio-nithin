<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./.github/assets/logo-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="./.github/assets/logo-light.svg">
    <img src="./.github/assets/logo-light.svg" alt="NP logo" width="84" />
  </picture>

  <h1>Nithin Pradeep — Portfolio</h1>

  <p>A content-driven, animation-rich personal portfolio — blog, project showcase, and contact form — built on Next.js, Contentful, and Supabase.</p>

  <p>
    <a href="https://portfolio-nithin.vercel.app"><img alt="Live site" src="https://img.shields.io/badge/live-portfolio--nithin.vercel.app-393632?style=flat&logo=vercel&logoColor=white" /></a>
  </p>

  <p>
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js%2015-393632?style=flat&logo=nextdotjs&logoColor=white" />
    <img alt="React" src="https://img.shields.io/badge/React%2019-393632?style=flat&logo=react&logoColor=white" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-393632?style=flat&logo=typescript&logoColor=white" />
    <img alt="Sass" src="https://img.shields.io/badge/Sass-393632?style=flat&logo=sass&logoColor=white" />
    <img alt="Contentful" src="https://img.shields.io/badge/Contentful-393632?style=flat&logo=contentful&logoColor=white" />
    <img alt="Apollo GraphQL" src="https://img.shields.io/badge/Apollo%20GraphQL-393632?style=flat&logo=apollographql&logoColor=white" />
    <img alt="Supabase" src="https://img.shields.io/badge/Supabase-393632?style=flat&logo=supabase&logoColor=white" />
    <img alt="Motion" src="https://img.shields.io/badge/Motion-393632?style=flat&logo=framer&logoColor=white" />
    <img alt="GSAP" src="https://img.shields.io/badge/GSAP-393632?style=flat&logo=greensock&logoColor=white" />
    <img alt="Storybook" src="https://img.shields.io/badge/Storybook-393632?style=flat&logo=storybook&logoColor=white" />
  </p>
</div>

---

## ✨ Overview

Source for [portfolio-nithin.vercel.app](https://portfolio-nithin.vercel.app) — a full-stack personal site for **Nithin Pradeep**, Full Stack Developer. Page, blog, and project content is served from **Contentful** via Apollo GraphQL, comments and newsletter signups are backed by **Supabase**, and the UI leans on **Motion** and **GSAP** for scroll-driven animation, page transitions, and micro-interactions.

## 🧩 Features

- **Dynamic content** — pages, blog posts, and portfolio items are managed in Contentful and rendered server-side
- **Blog** — listing and detail pages with related-post scoring and a Supabase-backed comment system
- **Project showcase** — animated portfolio grid with per-project detail pages
- **Contact form** — validated with React Hook Form + Yup, sent via EmailJS, protected by reCAPTCHA v3
- **Newsletter subscriptions** — stored in Supabase
- **Dark / light theme** — CSS custom properties toggled through `ThemeContext`
- **Rich animation** — page-transition curves, scroll reveals, and magnetic buttons via Motion, GSAP, and Lenis smooth scrolling
- **Component documentation** — Storybook for isolated UI development

## 🛠 Tech Stack

| Layer         | Tools                                                    |
| ------------- | -------------------------------------------------------- |
| Framework     | Next.js 15 (App Router, Turbopack), React 19, TypeScript |
| Styling       | SCSS Modules, CSS custom properties (theming)            |
| Content       | Contentful CMS, Apollo Client (GraphQL)                  |
| Data          | Supabase (comments, newsletter)                          |
| Animation     | Motion (Framer Motion), GSAP, Lenis                      |
| Forms         | React Hook Form, Yup, EmailJS, reCAPTCHA v3              |
| Tooling       | Storybook, Plop, Husky, Commitlint, ESLint, Prettier     |
| Observability | Sentry, Google Tag Manager                               |

## 🚀 Getting Started

### Prerequisites

- Node.js v20+
- A [Contentful](https://www.contentful.com/) space with a content model for pages, blog posts, and portfolio items
- A [Supabase](https://supabase.com/) project for comments and newsletter subscriptions

### Setup

```bash
git clone git@github.com:nithiin7/portfolio-nithin.git
cd portfolio-nithin
yarn install
```

Create a `.env` file at the project root (see `.env.example` for the full list):

```bash
CONTENTFUL_SPACE_ID=<your_contentful_space_id>
CONTENTFUL_ACCESS_TOKEN=<your_contentful_access_token>

# Supabase (comments + newsletter)
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_anon_key>
```

Start the dev server:

```bash
yarn dev
```

Then open [http://localhost:3000](http://localhost:3000).

## 📜 Available Scripts

| Command                     | Description                           |
| --------------------------- | ------------------------------------- |
| `yarn dev`                  | Start the dev server with Turbopack   |
| `yarn build`                | Create a production build             |
| `yarn start`                | Serve the production build            |
| `yarn lint` / `yarn eslint` | Lint the codebase                     |
| `yarn prettier:fix`         | Format the codebase                   |
| `yarn storybook`            | Launch Storybook on port 6006         |
| `yarn generate`             | Scaffold a component or page via Plop |
| `yarn release`              | Cut a release with standard-version   |

## 🗂 Project Structure

```
portfolio-nithin/
├── lib/            # Apollo Client setup (Contentful GraphQL)
├── migrations/     # Supabase SQL migrations
├── public/         # Static assets
├── src/
│   ├── app/        # Next.js App Router (pages, layouts, API routes)
│   ├── assets/     # Logos and icon components
│   ├── components/ # Layouts, page sections, shared UI primitives
│   ├── helpers/    # Contentful loaders, animation variants, utilities
│   ├── queries/    # GraphQL queries (Apollo gql)
│   ├── services/   # Supabase service layer
│   └── styles/     # Theme tokens and global SCSS
└── templates/      # Plop generators
```

See [CLAUDE.md](./CLAUDE.md) for the full architectural reference.

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Contentful Documentation](https://www.contentful.com/developers/docs/)
- [Supabase Documentation](https://supabase.com/docs)
- [Motion Documentation](https://motion.dev/docs)

## 🔗 Connect

<p>
  <a href="https://github.com/nithiin7"><img alt="GitHub" src="https://img.shields.io/badge/GitHub-393632?style=flat&logo=github&logoColor=white" /></a>
  <a href="https://www.linkedin.com/in/nithin-p7/"><img alt="LinkedIn" src="https://img.shields.io/badge/LinkedIn-393632?style=flat&logo=linkedin&logoColor=white" /></a>
  <a href="mailto:nithinp150@gmail.com"><img alt="Email" src="https://img.shields.io/badge/Email-393632?style=flat&logo=gmail&logoColor=white" /></a>
</p>
