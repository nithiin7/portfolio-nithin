# How to add content

Recipes for everyday changes to the Contentful space. The rules behind them are in [CONVENTIONS.md](CONVENTIONS.md). Run every command from the repo root.

## The loop

Every change follows the same five steps.

1. **Edit as a draft** in the Contentful web app (space `3tceq0itz5kj`, environment `master`). Don't press Publish yet.
2. **Check:** `pnpm cms:check --env master`. Errors (exit 1) break the site or its accessibility, so fix them. Warnings are style-guide drift, so fix them when you can.
3. **Preview:** `CONTENTFUL_PREVIEW=true pnpm build && pnpm start`, then open the page. The build reads drafts through the Preview API. Before checking copy, run `rm -rf .next/cache/fetch-cache` so an earlier build's cached response doesn't hide your change.
4. **Publish:** `pnpm cms:publish --env master` lists what will go out. Add `--apply` to publish it. It publishes assets first, then entries in link order, and reports anything Contentful rejects. Publishing in the web app works too.
5. **Live:** the `/api/revalidate` webhook refreshes the affected pages. Without it, pages refresh within an hour (ISR).

`.env.local` needs `CONTENTFUL_MANAGEMENT_TOKEN` (for check, publish and migrate) and `CONTENTFUL_PREVIEW_ACCESS_TOKEN` (for preview builds).

## Where things appear

The homepage is built from **Home Section** entries, found by their `key`. **Page — home** sets their order, and the hero always comes first. A section's `items` choose and order what it shows. Creating an entry doesn't put it anywhere until a section links it.

| To show…                 | Create a…          | Then add it to…                                                |
| ------------------------ | ------------------ | -------------------------------------------------------------- |
| A project                | Portfolio Project  | **Home — Work** · items (also sets routes, sitemap and search) |
| A job                    | Career Role        | **Home — Career** · items                                      |
| A certification          | Certification      | **Home — Certifications** · items (order = display order)      |
| A testimonial            | Testimonial        | **Home — Testimonials** · items                                |
| A collaborator logo      | Company            | **Home — Collaborations** · items                              |
| A "What I do" column     | Capability         | **Home — Capabilities** · items                                |
| A "How I work" principle | Principle          | **Home — About** · items                                       |
| A hand-entered number    | Stat               | **Home — About** · stats (max 4)                               |
| A social profile         | Link (with `icon`) | **Site Settings** · socials                                    |
| A contact channel        | Link (with `icon`) | **Site Settings** · contactChannels                            |
| A blog post              | Blog Post          | Nothing. Every dated post is listed on /blog                   |

Years of experience and the certification count are calculated, so don't add Stats for them. Projects shipped is a hand-entered Stat (it counts client work that has no page on the site).

## Recipes

### A project

1. **Content → Add entry → Portfolio Project.**
   - `name`: `Project — <short name>`.
   - `title`: up to 60 characters, for example "Orbit: Self-Hosted Personal Assistant".
   - `slug`: the product name in kebab-case, 3–60 characters, for example `orbit`. **It becomes the URL and must never change once published.**
   - `shortDescription` (the summary): up to 160 characters. Say what it does and for whom.
   - `year`, and optionally `role`.
   - `tech` (up to 20). `techHighlights` (up to 4) are shown on the card; if empty, the card shows the first 4 of `tech`.
   - `features`: up to 8, one sentence each, shipped work only. Nothing planned.
   - `description`: rich text, H2–H4 for structure.
   - `github` / `demo`: https URLs. Leave `demo` empty rather than repeating the repo URL.
   - `id`: the next integer. The highest today is **13**. It only exists for the old `/portfolio/<id>` URLs.
2. **Covers** (`spotlightImage` for the light theme, `spotlightImageDark` for the dark theme). Both are required and must be exactly 3840×2160.
   - Make them with the plate pipeline: add a recipe with the new slug to `scripts/plates/projects.config.ts`, run `pnpm plates <slug>`, and check the crops at `/dev/plates` (see [IMAGES.md](../redesign/IMAGES.md)).
   - Then run `pnpm plates:upload --env master <slug>`, check the plan, and run it again with `--apply`. It uploads the plates with their alt text and links them as drafts.
3. **Gallery** (optional, up to 12): more plates with `use: ['gallery']`, uploaded the same way. Screenshots must use dummy data: no phone numbers, real applications or client names.
4. **SEO** (optional): link an SEO entry named `SEO — Project <name>`. Without one, the page uses the title and the summary.
5. Add the project to **Home — Work · items** in the position it should take.
6. Check, preview (`/portfolio/<slug>`), publish.

To **retire** a project, remove it from Home — Work, unpublish it, and add the `retired` tag. Don't delete it.

### A blog post

1. **Blog Post.**
   - `internalName`: `Post — <short title>`.
   - `title`: up to 90 characters, sentence case.
   - `slug`: up to 60 characters, about 6 words, no year. **It never changes once published.** If it must change, add a redirect to `next.config.js` in the same PR; `cms:check` fails otherwise.
   - `excerpt`: up to 200 characters.
   - `blogCategory`, and `author` = **Person — Nithin Pradeep**.
   - `content`, `readTime` (minutes), `tags` (up to 8, no near-duplicates).
2. **`publishedDate` decides whether the post is shown.** Undated drafts are skipped even in preview builds. `updatedDate` is optional.
3. `featuredImage` (light) and `featuredImageDark`: add the post to `scripts/plates/blog.ts`, run `pnpm plates:blog <slug>`, then `pnpm plates:blog:upload --env <id> <slug> --apply` (see [IMAGES.md §6](../redesign/IMAGES.md#6-blog-covers)). Inline images are at least 1600 wide, WebP, with alt text.
4. SEO (optional): `SEO — Post <short title>`. The title is up to 60 characters and the description 50–160. Without one, the post's title and excerpt are used.
5. Check, preview (`/blog/<slug>`), publish.

A new category needs a **Blog Category** entry (`Category — <name>`, name up to 40 characters, slug) and nothing else.

### A job (Career Role)

- `internalName`: `Role — <company>, <title>`.
- `title`, `employer` (the **Company** entry; its name and logo show on the row), `location` ("Bangalore, India").
- `startDate`; leave `endDate` empty for the current role, which shows "Present".
- `type`: full-time, contract, freelance or internship.
- `description`: up to 320 characters. Start with a verb, describe the domain rather than the client, and don't name confidential clients or projects.
- `techStack`: up to 12.

Roles sort themselves newest first. When you start a new job, set the `endDate` on the previous one.

### A certification

- `internalName`: `Cert — <provider>, <name>`.
- `name`.
- `id`: kebab-case, unique.
- `provider` and `providerLogo`: a monochrome SVG under 20 KB, used as a CSS mask. Reuse the provider's existing `cert-*-logo` asset if there is one.
- `issuedOn`, and `expiresOn` if it expires.
- `certificateUrl` and/or `credentialId`.
- `highlight` pins it.

### A testimonial

- `name`: `Testimonial — <author>`.
- `review`: up to 400 characters, quoted as given. Fix only typos.
- `reviewer`, `authorRole`, `organisation`.
- `company` (optional): the **Company** entry. Its logo appears beside the quote. Cards without one keep the plain layout.
- `avatar`: square, at least 400×400, JPEG or WebP under 200 KB. Its alt text is just the person's name.

### A link: social, contact channel, call to action or collaborator

- `internalName`: `Link — <label>`.
- `label`: up to 40 characters.
- `url`: https, `mailto:` or a site path.
- `icon`: one of github, linkedin, instagram, x, bitbucket, credly, devto, email, whatsapp, messenger. Required for socials and contact channels.
- `detail`: optional secondary text, such as the handle.
- `logo` is deprecated. Collaborators are Company entries now.

### A company / logo

One **Company** entry per organisation. Career roles, testimonials and Home — Collaborations all link the same entry, so a logo is fixed once.

1. **Prepare the SVG.**
   - Single colour (any colour: the site paints it with the theme colour through a CSS mask, so only the shape counts). Transparent background, no white boxes behind the mark.
   - Trimmed to the mark: the `viewBox` hugs the artwork with no padding. The site sizes logos by their aspect ratio, so padding makes a logo look small.
   - Has a `viewBox`, under 20 KB. Run it through SVGO and remove embedded bitmaps, fonts and `<text>` (outline the text).
   - File name `company-<slug>--logo.svg`, for example `company-paytm-payments-bank--logo.svg`.
2. **Upload it** (Media → Add asset). Title "<Name> — logo". Description (alt text): "<Name> logo".
3. **Content → Add entry → Company.**
   - `internalName`: `Company — <name>`.
   - `name`: the official name. Screen readers hear it, and it's printed in mono type when there is no logo.
   - `slug`: kebab-case, matches the file name.
   - `logo`: the asset from step 2.
   - `websiteUrl` (optional): https. Collaborations link to it.
   - `showLogo`: **No** prints the name in mono type instead of the logo, for marks that don't read at small sizes.
4. Link it from a Career Role (`employer`), a Testimonial (`company`) or **Home — Collaborations** · items.
5. Check, preview, publish (the asset and the Company entry go out with the entries that link them).

The menu shows only the LinkedIn, Instagram and GitHub socials (`MENU_SOCIALS` in `src/constants`). The footer and contact page show all of them.

### Page SEO

Pages `home`, `blog`, `contact` and `resume` each link an SEO entry (`SEO — Page <slug>`). **Site Settings · seo** is the site-wide default (the home title and description). Other page titles render as "<title> | <name>". SEO titles are up to 60 characters and descriptions 50–160. `ogImage` (optional) is exactly 1200×630.

### Reordering or editing the homepage

- **Section order:** drag the sections in **Page — home · section**. The hero always stays first.
- **Heading and intro:** edit `heading` (up to 60 characters, sentence case, ends with a period: "Selected works.") and `lede` (up to 240) on the Home Section.
- **Manifesto:** `heading` is the pinned statement, with `{word}` where the rotating word goes ("I build {word} that people actually trust."). `words` lists them in order; the last one is what stays. Screen readers hear the sentence once with every word listed.
- **Hero:** the pitch is the hero's `body`. Italic text renders in the serif face. The buttons are its `ctas` (up to 2 Links).
- **About:** the bio is About · `body` and the portrait is About · `image` (3:4, JPEG or WebP under 500 KB).

A new kind of section (a new `key`) needs code and a migration, so it isn't an editor change.

## Images and alt text

- Every asset that is linked anywhere needs a **description**, which is its alt text. `cms:check` fails without one.
  - Say what the image shows and why it matters, in under 150 characters. Never start with "screenshot of".
  - Write `Decorative` for a purely decorative image.
- File names follow `<type>-<slug>--<variant>.<ext>`, for example `post-what-is-mcp--featured.webp`. Titles are plain English: "Orbit — cover, ink".
- `cms:check` warns when a file is the wrong format or too heavy for its slot. The limits are in CONVENTIONS §6.

## Changing the model (developers)

Schema changes are never made by hand.

1. Write `contentful/migrations/NNN_<what>.cjs`, using the helpers in `contentful/lib/schema.cjs`. If existing entries need data moved, add `NNN_<what>.data.ts`. Data scripts save drafts only and use deterministic IDs, so re-runs are safe.
2. `pnpm cms:migrate --env <id>` lists applied and pending migrations. `--apply` runs the pending ones, and `--apply NNN` runs one.
3. Update the queries (`src/queries`), raw types (`src/types/contentful.ts`), converters (`src/helpers/contentful.ts`) and tests in the same PR.
4. Run `pnpm lint && pnpm test && pnpm build`.

Things to keep in mind:

- **Expand, then contract.** Add the new field and deprecate the old one, which stays disabled and optional. Delete it in a later migration once nothing reads it.
- **The plan allows 25 content types.** 18 are in use.
- **Rehearse risky changes in a cloned environment first.** Clone `master` in Settings → Environments, run the migration there with `--env <clone>`, and build against it with `CONTENTFUL_ENVIRONMENT=<clone>`.

## Don't

- Delete entries, assets or types. Tag them `deprecated` or `retired` instead.
- Change a published slug without a redirect.
- Type headings in ALL CAPS. The design sets the case itself.
- Put dates in text fields. Use the Date fields.
- Name confidential clients, internal systems or private figures.
