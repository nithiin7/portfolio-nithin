# Contributing

This is a personal portfolio, so outside pull requests are rare. Bug reports and accessibility issues are very welcome.

## Workflow

1. Branch from `main`: `feat/<topic>`, `fix/<topic>`, `chore/<topic>`.
2. Commit with [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `refactor:`, …). commitlint enforces it on commit, and the PR title is checked too, because squash merges use it.
3. Before pushing: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`.
4. Open a PR into `main` and fill in the template. CI must pass, and the Vercel preview gets Playwright, axe and Lighthouse runs.

## Ground rules

- Colours, type, spacing and motion come from `src/styles/tokens.scss`. No hard-coded values.
- Every section works at 320px, honours `prefers-reduced-motion`, and keeps Lighthouse accessibility at 100.
- New components: `pnpm generate` (component + SCSS module + test).
- Contentful schema changes are migrations in `contentful/migrations`. See [docs/cms/CONVENTIONS.md](docs/cms/CONVENTIONS.md).
- Logic gets a test. UI with keyboard behaviour gets a component test.

[CLAUDE.md](CLAUDE.md) is the full reference for conventions and architecture.
