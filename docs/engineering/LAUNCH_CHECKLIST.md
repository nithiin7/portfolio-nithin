# v5 launch checklist

From `redesign` to production, in order. Tick each box. If a step fails, stop and use the rollback at the end.

## 0. Before you start

- [ ] Every phase PR (0–16) is merged into `redesign`, and the CI run on `redesign` is green.
- [ ] The latest `redesign` preview passes Playwright, axe and Lighthouse (`preview.yml`), and you've clicked through it on a phone and a desktop in both themes.
- [ ] GitHub secrets and branch protection are set per [CI_CD.md](CI_CD.md).
- [ ] Pick a quiet window. Contentful `master` already serves the new model (see LAUNCH.md), so production `/blog` is broken until this ships.

## 1. Merge `redesign` → `main`

- [ ] Open a PR `redesign` → `main` titled `feat: v5 redesign`, with this footer in the description:

  ```
  Release-As: 5.0.0
  ```

  release-please would otherwise call the first release 4.1.0.

- [ ] Wait for all required checks, then **squash-merge**. (Or use a merge commit if you'd rather keep the phase history on `main`; then put `Release-As: 5.0.0` in that merge commit's body.)

## 2. Contentful

Follow [docs/cms/LAUNCH.md](../cms/LAUNCH.md). In short:

- [ ] `pnpm cms:migrate --env master` lists **no pending migrations** (000–013 are applied). If 013 (manifesto) is pending, run `pnpm cms:migrate --env master --apply`. Note that 013's data script creates drafts.
- [ ] Publish the manifesto drafts and anything else pending, with your OK: `pnpm cms:check --env master` (must exit 0) → `pnpm cms:publish --env master --apply`.
- [ ] The webhook "Portfolio - Blog Update" points at `https://portfolio-nithin.vercel.app/api/revalidate` with the `x-revalidate-secret` header.

## 3. Vercel environment variables

Project → Settings → Environment Variables; the full table is in [CI_CD.md](CI_CD.md#vercel-environment-variables).

- [ ] Production: `CONTENTFUL_ENVIRONMENT=master`; `CONTENTFUL_PREVIEW` **unset**; `CONTENTFUL_REVALIDATE_SECRET` matches the webhook.
- [ ] Production has `RECAPTCHA_SECRET_KEY`, `OPENAI_API_KEY`, `WAKATIME_API_KEY` and `HUGGINGFACE_TOKEN` (the last three are optional, but their features stay off without them).
- [ ] `CONTENTFUL_MANAGEMENT_TOKEN` is set nowhere on Vercel.
- [ ] Node.js version in Project Settings is 24.x, matching `.nvmrc` (`vercel.json` already pins pnpm 11.0.5).

## 4. Deploy and smoke-test production

The merge to `main` deploys automatically. When it's live:

- [ ] These return 200: `/`, `/blog`, `/blog/free-local-ai-resume-builder`, `/portfolio/orbit`, `/portfolio/persona`, `/contact`, `/resume`, `/stats`, `/sitemap.xml`, `/feed.xml`, `/robots.txt`, `/manifest.webmanifest`.
- [ ] `/portfolio/1` → 308 → `/portfolio/orbit`. The old long blog slug → 308 → `/blog/free-local-ai-resume-builder`.
- [ ] `/this-page-does-not-exist` → 404 page.
- [ ] `curl -I https://portfolio-nithin.vercel.app/` shows HSTS, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` and `Content-Security-Policy-Report-Only`.
- [ ] By hand: ⌘K palette (search, "Ask AI" answers), chat launcher, contact form (send yourself a message), a comment on a post (held for moderation or posted), the theme toggle, reduced motion (OS setting), and a phone in both themes.
- [ ] Run the e2e suite against production: `PLAYWRIGHT_BASE_URL=https://portfolio-nithin.vercel.app pnpm test:e2e`.
- [ ] Lighthouse (mobile and desktop) on `/`, `/portfolio/orbit`, `/blog`: A11y 100, SEO 100, BP ≥ 95, Perf ≥ 90 desktop. Record the mobile numbers.
- [ ] Contentful webhook: publish a trivial edit, then confirm the delivery succeeded (Settings → Webhooks → Activity log) and the page updates.
- [ ] Sentry: no new errors after 30 minutes. Check CSP reports (Sentry → Issues, filter `csp`).
- [ ] Search Console: resubmit `/sitemap.xml`.

## 5. Release

- [ ] release-please opens "chore(main): release 5.0.0". Check its CHANGELOG, then merge it. That creates the **v5.0.0** tag and GitHub release.
- [ ] If release-please doesn't pick up the footer, tag it manually: `git tag -a v5.0.0 -m "v5.0.0" <merge-sha> && git push origin v5.0.0`, and set `.release-please-manifest.json` to `5.0.0`.

## 6. Clean up

- [ ] Delete the merged phase branches (local and remote):

  ```bash
  git fetch --prune
  git branch --list 'redesign-phase-*' | xargs -n1 git branch -d
  git branch -r --list 'origin/redesign-phase-*' | sed 's|origin/||' | xargs -n1 git push origin --delete
  ```

- [ ] Keep `redesign` for a week as a reference, then delete it. Remove `redesign` from the `ci.yml` and `codeql.yml` triggers and from branch protection.
- [ ] After a clean week of CSP reports, switch `Content-Security-Policy-Report-Only` to `Content-Security-Policy` in `next.config.js`.
- [ ] Follow-up content PR: update the `/api/ask` profile and `data/knowledge/*.md` (they still describe Paytm as the current role), then `pnpm embed`.

## 7. Awwwards

- [ ] Submit with the kit in [docs/redesign/AWWWARDS.md](../redesign/AWWWARDS.md) (cover 1600×1200, screenshots, description, tags). Regenerate the images against production first: `AWWWARDS_BASE_URL=https://portfolio-nithin.vercel.app node scripts/awwwards.ts`.
- [ ] Once submitted, replace the Awwwards placeholder in README.md with the link.

## Rollback

- **Code**: Vercel → Deployments → previous production deployment → Promote (Instant Rollback). Then revert the merge on `main`.
- **Content**: [docs/cms/LAUNCH.md § Rollback](../cms/LAUNCH.md#rollback). Restore the pre-phase-14 backup into an environment and point Production's `CONTENTFUL_ENVIRONMENT` at it.
