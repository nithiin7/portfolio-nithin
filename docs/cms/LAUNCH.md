# Launch: the phase 14 content model

How the reshaped Contentful model reaches production, and how to undo it. Read [the phase 14 audit](../archive/cms/AUDIT.md) for why and [CONVENTIONS.md](CONVENTIONS.md) for the rules.

## Where things stand (2026-11-13)

- **Contentful `master` is already on the new model.** Migrations 000–012 are applied (each one is recorded as a `cmsMigration-NNN` entry), and the content is published. That includes the contract migrations: the deprecated fields, the 49 deprecated entries and 8 content types are deleted. The space uses 17 of its 25 content types.
- **Only the phase 14 code can read it.** That code is on `redesign-phase-14-cms` until it merges into `redesign`.
- **Production (`main`, https://portfolio-nithin.vercel.app) still runs the old queries:**
  - `/blog` returns **500**, because its query asks for fields that no longer exist.
  - The other pages serve their last good render from the ISR cache, with old copy. When a revalidation fails, Next keeps the stale page.
  - **A redeploy of `main` would fail its build.** Don't redeploy `main` until the launch below.
- The Contentful webhook "Portfolio - Blog Update" sends publish, unpublish and delete events to the production `/api/revalidate`.

This was agreed: there's no production traffic yet, and `master` is the working environment.

## Launch

1. **Merge** `redesign-phase-14-cms` into `redesign` (this PR).
2. **Vercel environment variables** (Production and Preview):
   - `CONTENTFUL_SPACE_ID`, `CONTENTFUL_ENVIRONMENT=master`, `CONTENTFUL_ACCESS_TOKEN` and `CONTENTFUL_REVALIDATE_SECRET`: unchanged.
   - `CONTENTFUL_PREVIEW`: **unset** in Production. To review drafts on preview deployments, set it to `true` there, together with `CONTENTFUL_PREVIEW_ACCESS_TOKEN`.
   - `CONTENTFUL_MANAGEMENT_TOKEN`: **never** on Vercel. It's only for local scripts.
3. **Ship `redesign` to `main`.** The redesign launch merges it. This is also what fixes `/blog`.
4. **After the deploy:**
   - Check that `/`, `/blog`, `/blog/free-local-ai-resume-builder`, `/portfolio/orbit`, `/portfolio/persona`, `/contact`, `/resume`, `/sitemap.xml` and `/feed.xml` return 200.
   - Check that `/portfolio/1` returns 308 to `/portfolio/orbit`.
   - Check that the old blog URL `/blog/i-built-a-free-fully-local-ai-resume-builder-no-subscriptions-no-cloud-no-catch` returns 308 to `/blog/free-local-ai-resume-builder`.
   - Run `pnpm cms:check --env master`. It must exit 0.
   - Publish any small entry, then confirm the webhook delivery succeeded (Contentful → Settings → Webhooks → Activity log).
5. **Search Console:** resubmit `/sitemap.xml`. The project URLs moved from `/portfolio/<id>` to `/portfolio/<slug>`, and two blog slugs changed. All the old URLs redirect permanently.

### If `/blog` must work before the redesign launches

Point production at a copy of the old content (rollback option B below): restore the pre-phase-14 backup into an environment such as `legacy`, then set `CONTENTFUL_ENVIRONMENT=legacy` for Production only and redeploy `main`. Remove the override at launch.

## Replaying the model on another environment

A new environment cloned from `master` (Settings → Environments → Add) already has the new model, along with the migration log. Nothing needs replaying.

To move an environment that is still on the **old** model forward, for example a restored backup:

```bash
pnpm cms:migrate --env <id>            # lists pending migrations
pnpm cms:migrate --env <id> --apply    # runs 000–012 in order
pnpm cms:check --env <id>
pnpm cms:publish --env <id> --apply
```

The data scripts save drafts with deterministic IDs, so re-running one is safe. Migrations 003 and 006 upload logo files from `contentful/seed-assets/`, which was removed once `master` held those assets. Before replaying them, restore the folder with `git checkout 738444b -- contentful/seed-assets` (any commit before its removal works), and delete it again afterwards. Migration 011 deletes the deprecated entries, but stops if it finds more than 55 of them. If a schema half stops part-way (for example on the content type cap), trim the `.cjs` to what ran and finish with `--apply NNN --data-only`.

## Rollback

### Code

- **Vercel:** promote the previous production deployment (Deployments → ⋯ → Promote, or "Instant Rollback"). This serves the old build immediately. Its pages fetch from Contentful again on revalidation, so pair it with content option B.
- **Git:** revert the merge commit on `main`.

### Content

The backups are full CMA exports: content types, entries, assets, editor interfaces, tags and webhooks, plus the asset files. They are **local only**: `backups/` is gitignored, so copy them somewhere safe.

| Backup                                                          | State                                                   |
| --------------------------------------------------------------- | ------------------------------------------------------- |
| `backups/contentful-2026-11-12/cda/`                            | Delivery API snapshot before any change                 |
| `backups/contentful-2026-11-13/master-export.json`              | Full export before the first migration (the old model)  |
| `backups/contentful-2026-11-13-pre-contract/master-export.json` | After migrations 001–010, before the contract (011–012) |

**A. Undo only the contract.** Restore deleted fields, entries or types from the pre-contract export by importing it into a fresh environment, then copy what you need across. The code in this PR doesn't need anything the contract removed.

**B. Full content rollback** (the old model, for the old code):

```bash
# 1. Create an empty environment, e.g. "legacy" (Settings → Environments, or the CLI)
npx contentful-cli space environment create --space-id <space> --environment-id legacy --name legacy

# 2. Import the pre-migration export
npx contentful-cli space import --space-id <space> --environment-id legacy \
  --content-file backups/contentful-2026-11-13/master-export.json \
  --upload-assets --assets-directory backups/contentful-2026-11-13

# 3. Point the old deployment at it
#    Vercel → Production env: CONTENTFUL_ENVIRONMENT=legacy, then redeploy main
```

Don't import over `master`. Restore into a new environment and switch with `CONTENTFUL_ENVIRONMENT` (or an environment alias), so you can roll forward again just by switching back.

### What a rollback loses

Any content edited after the backup. Since 2026-11-13 that is:

- the Orbit case study;
- copy review batches 1 and 2;
- alt text on 35 assets;
- the new project slugs and blog slugs;
- Persona's gallery changes.

[COPY_REVIEW.md](COPY_REVIEW.md) records every one of these, so they can be re-applied.
