## What and why

<!-- One or two sentences. Link the issue if there is one. -->

## Screenshots

<!-- Before / after for any visual change: 360px and 1440px, dark and light. Delete if no UI changed. -->

## Checklist

- [ ] PR title is a Conventional Commit (`feat: …`, `fix: …`)
- [ ] `pnpm lint && pnpm typecheck && pnpm test && pnpm build` pass locally
- [ ] Tests added or updated for new logic and keyboard behaviour
- [ ] Works at 320px and 3840px with no horizontal scroll
- [ ] Honours `prefers-reduced-motion`
- [ ] Keyboard and screen reader: focus order, visible focus, labels (axe passes in both themes)
- [ ] Colours, spacing and type use tokens only
- [ ] Contentful: schema changes are a migration, and queries, types and converters ship in this PR
- [ ] Docs updated (README, CLAUDE.md, docs/) if behaviour or workflow changed
