# Contentful conventions

The standard every content type, entry and asset in space `3tceq0itz5kj` follows from phase 14 on. Step 3's migrations implement it, and `pnpm cms:check` (step 5) enforces whatever the Contentful UI can't.

**Status: agreed 2026-11-13** (decisions in §11).

---

## 1. Ground rules

1. **Schema changes only through migrations.** Each change is a numbered script in `contentful/migrations/` (`001_shared-blocks.cjs`, `002_portfolio-project.cjs`, …) run with `contentful-migration`. Migrations expand only (§4); the contract migration runs at launch. No hand edits in the web app or through MCP, so the same scripts can be replayed on any environment.
2. **Content edits are drafts first.** Editing happens in the web app or through MCP. Run `pnpm cms:check` before publishing.
3. **Never delete.** A replaced entry, asset or content type gets the `deprecated` tag (§7) and is left unpublished. Content types are only removed once nothing links to them, and only on your say-so.
4. **One locale:** `en-US`. Every field has `localized: false` until you decide otherwise.
5. **Public information only.** Describe the domain ("banking clients", "a regulated bank"), not client names, internal system names, or figures that aren't already public.

---

## 2. Naming

| Thing                    | Rule                                                                                                                                              | Example                                                       |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Content type ID          | camelCase, singular, names the content rather than the UI component ("Card", "Section" are out). Applies to new types; existing IDs are kept (§4) | `siteSettings`, `capability`, `collaborator`                  |
| Content type name        | Title Case, singular                                                                                                                              | Portfolio Project                                             |
| Content type description | One sentence: what it is and where it appears                                                                                                     | "A project shown in Selected Works and at /portfolio/[slug]." |
| Field ID                 | camelCase. No type prefix, no abbreviations other than `url`/`seo`. Booleans start with `is`/`has`/`show`                                         | `repoUrl`, `startDate`, `isFeatured`                          |
| Field name               | Sentence case                                                                                                                                     | Repository URL                                                |
| Reference fields         | Named after what they point to, plural for arrays                                                                                                 | `category`, `items`, `gallery`                                |
| Dates                    | `…Date` (Date type, date-only format) for days. `…At` for timestamps                                                                              | `issuedDate`, `publishedDate`                                 |

### Display field: `internalName`

Every type gets an internal name as its display field (Symbol, required, unique), formatted **`<Type label> — <Name>`** with a spaced em dash. Types whose existing `name` field is never rendered (Portfolio Project, Testimonial, Page, Home Section) reuse `name` for it; the others get a new `internalName` field:

| Type                             | Pattern                                       | Example                                   |
| -------------------------------- | --------------------------------------------- | ----------------------------------------- |
| portfolioDetails                 | Project — `<short name>`                      | Project — Orbit                           |
| blogPost                         | Post — `<short title>`                        | Post — What is MCP                        |
| careerExperience                 | Role — `<company>`, `<title>`                 | Role — EY, Senior Technical Consultant    |
| certification                    | Cert — `<provider>`, `<name>`                 | Cert — Databricks, Generative AI Engineer |
| testimonialCard                  | Testimonial — `<author>`                      | Testimonial — Gokul Krishnan              |
| homeSection                      | Home — `<key>`                                | Home — Career                             |
| page                             | Page — `<slug>`                               | Page — contact                            |
| seo                              | SEO — `<owner>`                               | SEO — Project Orbit                       |
| link / media                     | Link — `<label>` / Media — `<subject>`        | Media — Orbit agent workflow              |
| person, blogCategory, capability | Person — / Category — / Capability — `<name>` | Category — AI Engineering                 |

Validation: `^(Project|Post|Role|Cert|Testimonial|Home|Page|SEO|Link|Media|Person|Category|Capability) — .{2,80}$`. It's never rendered. Its only job is to make reference pickers and list views readable.

---

## 3. Fields

Every field has **help text** that says what it's for, where it appears, and its limit ("Shown under the card title on the homepage. 160 characters max.").

### Validation defaults

| Field kind       | Validation                                                                                                  | Editor control                                                                        |
| ---------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Slug             | Required, unique, `^[a-z0-9]+(?:-[a-z0-9]+)*$`, 3–60 chars                                                  | Slug editor, tracking the title field                                                 |
| Title / heading  | Required, size limit from §9                                                                                | Single line                                                                           |
| Short plain text | Size limit from §9                                                                                          | Single line, or multiple line (**never markdown**: the site renders it as plain text) |
| Long body        | Rich text with the restricted node set below                                                                | Rich text                                                                             |
| URL              | `^https://[^\s]+$` (external) or `^/[a-z0-9/#?=&-]*$` (internal)                                            | URL editor                                                                            |
| Enum             | `in: [...]`                                                                                                 | Dropdown                                                                              |
| Year / number    | Integer, range (e.g. 2015–2100)                                                                             | Number editor                                                                         |
| Date             | Date                                                                                                        | Date picker, format "date only"                                                       |
| List of strings  | Array<Symbol>, item size ≤ 200, array size limit                                                            | Tag editor                                                                            |
| Asset link       | Required where the layout needs it. `linkMimetypeGroup: ['image']`; dimensions where the slot is fixed (§6) | Asset link editor                                                                     |
| Entry link       | `linkContentType` always set, so no "any entry" links                                                       | Entry link / links editor                                                             |
| Boolean          | Default set explicitly                                                                                      | Radio ("Yes"/"No" labels)                                                             |

### Rich text node set

Every rich-text field allows: paragraph, H2, H3, H4, ordered/unordered list, quote, hr, hyperlink, embedded asset, and marks bold, italic and code.

Not allowed: **H1** (the page title is the only H1), H5/H6, tables, inline entries, entry hyperlinks, underline, super/subscript and strikethrough. This matches what `RichText` actually renders today. Allowing more needs a renderer change first.

---

## 4. Content model

**Reshaped in place (D2).** Every existing content type keeps its ID, and field IDs stay wherever the type is already right. A field gets a new ID only when its type or meaning has to change, because Contentful can't change a field's type. Old type IDs that don't match §2 are listed below. Their display names follow the convention.

**Expand, then contract.** Each migration only adds: new types, new fields, and copied data. Old fields stay, renamed "[Deprecated] …" and disabled in the editor, until a contract migration removes them. Phase 14 contracted early (011–012) because nothing in production depended on the old fields.

### Existing types

| Type ID (kept)     | Display name      | Kept fields (display name if renamed)                                                                                                                                                                                                                                                                           | Added                                                                                                   | Deprecated (removed at contract)                                                      |
| ------------------ | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `portfolioDetails` | Portfolio Project | `name` (Internal name) · `slug` · `id` (Legacy ID, for redirects) · `title` · `shortDescription` (Summary, ≤ 160) · `description` (Body) · `demo` (Live demo URL) · `github` (Repository URL) · `year` · `spotlightImage` (Cover, light) · `spotlightImageDark` (Cover, dark) · `gallery` · `tech` · `features` | `role` · `techHighlights` (≤ 4, shown on the card; falls back to the first 4 of `tech`) · `seo`         | `keywords`                                                                            |
| `careerExperience` | Career Role       | `title` · `company` · `location` · `type` (Employment type, dropdown) · `description` (Summary, ≤ 320)                                                                                                                                                                                                          | `internalName` · `startDate` · `endDate` (empty = current) · `techStack` (Array)                        | `year`, `duration`, `technologies` (Text), `order`                                    |
| `certification`    | Certification     | `name` · `id` (Slug) · `provider` · `certificateUrl` · `credentialId` · `highlight`                                                                                                                                                                                                                             | `internalName` · `issuedOn` · `expiresOn` (Date) · `providerLogo` (SVG asset)                           | `issuedDate`, `expiryDate` (Symbol), `logo` (path)                                    |
| `testimonialCard`  | Testimonial       | `name` (Internal name) · `reviewer` (Author name) · `review` (Quote, ≤ 400) · `avatar`                                                                                                                                                                                                                          | `authorRole` · `organisation`                                                                           | `institution`                                                                         |
| `blogPost`         | Blog Post         | `title` · `slug` · `excerpt` · `content` (Body) · `featuredImage` · `tags` · `publishedDate` · `updatedDate` · `readTime`                                                                                                                                                                                       | `internalName` · `blogCategory` (→ blogCategory) · `author` (→ person) · `seo`                          | `category`, `authorName`, `authorAvatar`, `seoTitle`, `seoDescription`, `seoKeywords` |
| `blogCategory`     | Blog Category     | `name` · `slug` · `description`                                                                                                                                                                                                                                                                                 | `internalName`                                                                                          | —                                                                                     |
| `page`             | Page              | `name` (Internal name) · `slug` · `section` (Sections, home only, links limited to Home Section)                                                                                                                                                                                                                | `seo`                                                                                                   | `title`, `description`, `ogtitle`, `ogurl`                                            |
| `section`          | Home Section      | `name` (Internal name)                                                                                                                                                                                                                                                                                          | **`key`** (dropdown, unique) · `heading` · `lede` · `body` · `image` · `items` · `stats` · `ctas` (≤ 2) | `contents`                                                                            |

`section.key` is one of `hero`, `work`, `about`, `capabilities`, `career`, `certifications`, `collaborations`, `testimonials`. The code finds sections by `key`, never by position or `name`. `page.section` only sets the order. `items` keeps the editor's order, except career, which sorts by `startDate`. `items` accepts Portfolio Project, Capability, Career Role, Certification, Testimonial, Principle and Collaborator.

Only the 8 top-level home sections stay in use. The nested sections (the ones that held a title plus a list) are deprecated once their content has moved.

### New types

| Type           | Fields                                                                                                                                                                                                                                                           | Used by                                                                      |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `seo`          | internalName · `title` (≤ 60) · `description` (50–160) · `ogImage` (1200×630) · `noIndex`                                                                                                                                                                        | page, project, blog post, site settings                                      |
| `link`         | internalName · `label` (≤ 40) · `url` · `detail` (≤ 60, e.g. the address shown under "Email") · `icon` (dropdown: github, linkedin, instagram, x, bitbucket, credly, devto, email, whatsapp, messenger) · `openInNewTab`                                         | socials, contact channels, section CTAs                                      |
| `media`        | internalName · `image` · `video` (mp4/webm) · `caption` (≤ 200) · `isDecorative`                                                                                                                                                                                 | rich-text embeds, future pages                                               |
| `person`       | internalName · `name` · `role` · `avatar`                                                                                                                                                                                                                        | blog post author                                                             |
| `siteSettings` | Singleton. internalName · `name` · `role` · `company` · `city` · `region` · `countryCode` · `timeZone` · `isAvailable` · `availabilityLabel` · `email` · `socials` (→ link) · `contactChannels` (→ link) · `knowsAbout` · `seo` (site default) · `twitterHandle` | layout, hero, menu, footer, JSON-LD, OG images, manifest                     |
| `capability`   | internalName · `title` · `summary` (≤ 200) · `items` (≤ 6 × 60)                                                                                                                                                                                                  | Home Section `capabilities`                                                  |
| `principle`    | internalName · `title` (≤ 40) · `body` (≤ 120)                                                                                                                                                                                                                   | Home Section `about` ("How I work")                                          |
| `stat`         | internalName · `value` (Integer) · `suffix` · `label` · `isCompact`                                                                                                                                                                                              | Home Section `about` (manual stats; years, projects and certs stay computed) |
| `collaborator` | internalName · `name` · `url` · `logo` (monochrome SVG asset) · `isTall`                                                                                                                                                                                         | Home Section `collaborations`                                                |

Alt text lives on the **asset description**, so one image has one alt wherever it's used. Gallery images stay plain assets. Use `media` only when an image needs a caption or video.

### What stays in code (technical config, not content)

The site URL, title template, Google site verification, GTM and Sentry IDs, the GitHub / dev.to / Hugging Face usernames the stats page calls APIs with, and the nav links (they mirror the route tree). Everything a visitor reads comes from Contentful.

### Removed types

Contracted on 2026-11-13 (migrations 011–012, with the user's OK, before launch): `portfolioCard`, `title`, `description`, `list`, `url`, `imageCard`, `experienceCard`, `blogTag` and every deprecated field. Backup: `backups/contentful-2026-11-13-pre-contract/`. The space uses 17 of the plan's 25 content types.

---

## 5. Slugs and routes

- Required, unique per type, kebab-case (regex above), 3–60 characters, **no type prefix** (`orbit-assistant`, not `portfolio-orbit-assistant`).
- A slug is the project's or post's name, never its full title. Keep it under ~6 words (the current 81-character blog slug is too long).
- **Once published, a slug doesn't change.** If it has to, add a redirect in `next.config.js` in the same PR.
- Projects move to `/portfolio/[slug]`. `/portfolio/[id]` returns a 301 to the slug via `legacyId`.
- The plate pipeline's slug matches the Contentful slug (`scripts/plates/projects.config.ts`).

---

## 6. Assets

### File names

**`<type>-<slug>--<variant>[-<surface>].<ext>`**, all lower case. The double dash separates the slug, which contains hyphens, from the variant.

| Asset               | Example                                                                       |
| ------------------- | ----------------------------------------------------------------------------- |
| Project cover       | `project-orbit-assistant--cover-ink.png`                                      |
| Project gallery     | `project-orbit-assistant--calendar.webp`                                      |
| Blog featured image | `post-what-is-mcp--featured.webp`                                             |
| Blog inline image   | `post-what-is-mcp--protocol-diagram.webp`                                     |
| Avatar / portrait   | `person-nithin-pradeep--avatar.jpg`, `testimonial-gokul-krishnan--avatar.jpg` |
| Certification logo  | `cert-databricks--logo.svg`                                                   |
| OG image            | `seo-orbit-assistant--og.png`                                                 |

The plate pipeline already writes `<slug>--<name>-<surface>.png`. It gains the `project-` prefix and switches `plates:upload` from matching on asset **title** to matching on **file name**, so titles can be plain English.

### Title and description

- **Title:** plain English, sentence case, `<Subject> — <what>`: "Orbit — dashboard cover, dark", "Gokul Krishnan — avatar". It's what an editor searches for.
- **Description = alt text, required on every asset that's used anywhere.** Contentful can't require asset fields, so `cms:check` blocks it instead. The rules are in IMAGES.md §4: say what the image shows and why it matters, under ~150 characters, never "screenshot of" or "image of". A purely decorative asset gets the description `Decorative`, and the code renders `alt=""` for it.

### Sizes and formats

| Slot                                 | Size                                                                                | Format, max weight    | Source                    |
| ------------------------------------ | ----------------------------------------------------------------------------------- | --------------------- | ------------------------- |
| Project cover (`cover`, `coverDark`) | **3840×2160** exactly; text inside the 2880×1645 safe zone                          | PNG ≤ 1.5 MB (plates) | Plate pipeline, IMAGES.md |
| Project gallery                      | 3840×2160                                                                           | PNG/WebP ≤ 1.5 MB     | Plate pipeline            |
| Blog featured image                  | 2400×1260 (1.91:1). Crops to 16:10 and 4:3 in the list, so keep the subject central | WebP ≤ 400 KB         | —                         |
| Blog inline image                    | ≥ 1600 wide                                                                         | WebP ≤ 400 KB         | —                         |
| About portrait                       | 1500×2000 (3:4)                                                                     | JPEG/WebP ≤ 500 KB    | —                         |
| Avatars                              | Square, 800×800                                                                     | JPEG/WebP ≤ 200 KB    | —                         |
| Certification logo                   | Monochrome SVG (rendered as a CSS mask)                                             | SVG ≤ 20 KB           | —                         |
| OG image (`seo.ogImage`)             | 1200×630 exactly                                                                    | PNG/JPEG ≤ 300 KB     | —                         |

Fixed sizes become `assetImageDimensions` validations on the link fields. `cms:check` covers weight and format. `images.ctfassets.net` sends `Access-Control-Allow-Origin: *`, so SVG logos served from Contentful work as CSS masks.

---

## 7. Tags and organisation

Contentful has no asset folders, so **tags** do the grouping. All tags are private, which means they aren't exposed in the delivery API.

| Tag           | Meaning                                                                  |
| ------------- | ------------------------------------------------------------------------ |
| `deprecated`  | Replaced. Kept for rollback, don't link to it. Listed in DEPRECATED.md   |
| `retired`     | A real project or post that's no longer shown (the 7 old project drafts) |
| `needsReview` | Content drafted by Claude or a script, waiting for your read             |
| `plate`       | Asset produced by the plate pipeline. Re-make, don't hand-edit           |

Find assets by file-name prefix (`project-orbit-assistant--`), which the naming scheme makes reliable.

---

## 8. Editor experience

- Every type's field order follows the page: identity (internalName, title, slug) → summary → body → media → links → relations → SEO.
- Dropdowns for every enum, slug editors tracking the title, URL editors for links, date-only pickers, and radio buttons for booleans.
- Help text on every field. Content type descriptions say where the content appears.
- Preview: a content preview URL per type (`/portfolio/{slug}`, `/blog/{slug}`) once the site supports draft mode (step 5).

---

## 9. Copy style guide

### Voice

- **Confident, concrete, first person.** "I built…", "I lead…". Say what the thing does and for whom, with a number or a named mechanism where possible ("indexes the repo with tree-sitter", not "leverages advanced AI").
- Products are the subject of their own descriptions ("Orbit runs on your own server"). The first person is for what _I_ did.
- **Cut:** seamless, cutting-edge, leverage, unlock, empower, revolutionise, "in today's fast-paced world", "unfair advantage", "whether you're X or Y". No emoji in titles, headings or slugs.
- Don't list planned features as features. Mark them "Planned" in the body or leave them out.

### Tense

- **Present** for what products do and for the current role. **Past** for finished roles and shipped work ("Led…", "Built…").
- Career summaries open with a verb and drop the "I" ("Build agentic AI systems for banking clients…").

### Capitalisation and punctuation

- **Sentence case** for every title, heading, label and asset title. The design applies its own uppercase where it wants it, so never type ALL CAPS. Home section headings end with a period ("Selected works."), a deliberate device of the redesign; other headings and titles take none.
- Product and tech names use their official spelling (canonical list enforced by `cms:check`): Next.js, React, TypeScript, Node.js, Python, FastAPI, LangGraph, LangChain, LlamaIndex, OpenAI, Anthropic, Claude, Ollama, Hugging Face, PostgreSQL, Supabase, Docker, Tailwind CSS, TorchVision, WordPress, Laravel, .NET, MCP, RAG.
- Oxford comma. A spaced em dash ( — ) for asides. Curly quotes and apostrophes in prose. Straight quotes only in code.
- Lists: each feature is one sentence. Optionally start with a short label and a colon ("Audit logging: every tool call is logged…"). Pick one style per list.

### Numbers, dates, places

- Numerals for 10 and above, and always for metrics and versions ("3 tools", "1M+ concurrent users", "Next.js 16"). Words for one to nine in prose.
- **Dates live in Date fields, never in text.** The site formats them: "Aug 2026" for roles, "13 Nov 2026" for posts, "Present" for an empty end date.
- Place names: "Bangalore, India", "Kochi, India", "Noida, India" (city and country).
- Years in titles only when the piece is about that year. Evergreen posts drop "in 2025".

### Length limits (enforced as validations)

| Field                          | Max                           |
| ------------------------------ | ----------------------------- |
| Project title                  | 60                            |
| Project summary / blog excerpt | 160 / 200                     |
| Project feature (each)         | 200                           |
| Blog title                     | 90                            |
| SEO title / description        | 60 / 50–160                   |
| Section heading / lede         | 60 / 240                      |
| Career summary                 | 320                           |
| Testimonial quote              | 400                           |
| Capability item                | 60                            |
| Alt text (asset description)   | 150 (soft; `cms:check` warns) |
| Link label                     | 40                            |

---

## 10. Workflow

1. **Schema:** write `contentful/migrations/NNN_<what>.cjs` → dry run with `pnpm cms:migrate NNN --dry-run` → run on the working environment → update queries, converters and types in the same PR → `pnpm build`.
2. **Content:** draft → `pnpm cms:check` → preview → publish. Copy rewrites go through `COPY_REVIEW.md` first.
3. **Images:** plate pipeline → `/dev/plates` crop check → `plates:upload` (drafts) → alt text check → publish.

---

## 11. Decisions

| #   | Decision                                                                                                                                                                 | Status                 |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------- |
| D1  | Projects move to `/portfolio/[slug]`. `/portfolio/[id]` returns a 301 through the legacy ID.                                                                             | Agreed 2026-11-13      |
| D2  | Reshape existing types in place; create new types only where needed (§4). Expand now, contract on launch day.                                                            | Agreed 2026-11-13      |
| D3  | `blogPost.blogCategory` references Blog Category (AI Engineering, Full-stack Development, Frontend Development). `tags` stay free text, and `blogTag` is deprecated.     | Recommendation adopted |
| D4  | Maximum content in Contentful: site identity, hero, About bio, principles, stats, collaborators, socials and contact channels. Only technical config stays in code (§4). | Agreed 2026-11-13      |
| D5  | The 7 retired project drafts are tagged `retired` and left alone. The "Meet Orbit" draft is reshaped like the other posts.                                               | Recommendation adopted |
| D6  | Asset file names `<type>-<slug>--<variant>`. The plate pipeline matches on file name. Existing files are renamed when they're re-made.                                   | Recommendation adopted |
| D7  | "Bangalore" everywhere.                                                                                                                                                  | Recommendation adopted |

### Planned project slugs (they become the URLs)

| Project                | Current slug                     | New slug                 |
| ---------------------- | -------------------------------- | ------------------------ |
| Orbit                  | `portfolio-orbit-assistant`      | `orbit`                  |
| Persona                | `persona-ai-resume-builder`      | `persona`                |
| Remote File Server MCP | `remote-file-server-mcp`         | `remote-file-server-mcp` |
| RepoChat               | `repochat-codebase-intelligence` | `repochat`               |
| PlateAI                | `portfolio-plate-ai`             | `plateai`                |
| Lang2Query             | `lang2query-agent`               | `lang2query`             |
| TradeIT                | `stock-market-trader`            | `tradeit`                |

Edit this table if you want different URLs. The plate pipeline config follows whatever is here.
