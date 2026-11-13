# Image plates

Portfolio covers and galleries are **editorial plates**: 3840×2160 PNGs that put a screenshot, a detail crop, three phone screens or a block of type on an ink or paper ground. `scripts/plates/` builds them from a config file, so every project gets the same framing and the same safe zone.

```bash
pnpm plates [slug…] [--force]   # capture/import screens, then compose
pnpm plates:capture [slug…]     # screens only (cached; --force re-captures)
pnpm plates:compose [slug…]     # plates only
pnpm plates:upload [slug…]      # Contentful plan (dry run); add --apply to write
pnpm dev  →  /dev/plates        # preview through the real crops
```

## 1. Where the images are cropped

Every slot uses `object-fit: cover`, centred. The table below lives in code in [`src/config/imageCrops.ts`](../../src/config/imageCrops.ts), which the scripts, the tests and `/dev/plates` all read. Update it whenever a component's `aspect-ratio` or `sizes` changes.

| Component · slot        | Contentful field                     | < 768           | 768–1023 | ≥ 1024                 | `sizes`                                                                                                    |
| ----------------------- | ------------------------------------ | --------------- | -------- | ---------------------- | ---------------------------------------------------------------------------------------------------------- |
| WorksFeatured · lead    | PortfolioCard.image                  | 4:3             | 21:9     | 21:9                   | `100vw`                                                                                                    |
| WorksFeatured · card    | PortfolioCard.image                  | 4:3             | 4:3      | 4:3                    | `(min-width: 768px) 50vw, 100vw`                                                                           |
| WorksIndex · thumb      | PortfolioCard.image                  | 16:10           | 16:10    | 16:10                  | `100vw` (touch only)                                                                                       |
| WorksPreview · cursor   | PortfolioCard.image                  | –               | –        | 4:3                    | `(min-width: 1920px) 22vw, (min-width: 1616px) 420px, (min-width: 1000px) 26vw, 260px` (fine pointer only) |
| PortfolioNext · media   | PortfolioCard.image                  | 16:9            | 16:9     | 16:9                   | `100vw` (touch only)                                                                                       |
| PortfolioNext · bleed ¹ | PortfolioCard.image                  | –               | –        | `100vw : 60svh`, ×1.15 | `100vw` (fine pointer only)                                                                                |
| CaseStudy · cover       | PortfolioDetails.spotlightImage      | 4:3             | 16:9     | 21:9                   | `100vw`                                                                                                    |
| Portfolio OG · strip ¹  | PortfolioDetails.spotlightImage      | 400×630 (fixed) |          |                        | Contentful `fit=fill`                                                                                      |
| PortfolioGallery · wide | PortfolioDetails.gallery (1st, 4th…) | 4:3             | 16:9     | 16:9                   | `(min-width: 1280px) 66vw, (min-width: 1024px) 75vw, 100vw`                                                |
| PortfolioGallery · half | PortfolioDetails.gallery             | 4:3             | 4:3      | 4:3                    | `(min-width: 1280px) 33vw, (min-width: 1024px) 37vw, (min-width: 768px) 50vw, 100vw`                       |

Not cropped: the gallery lightbox (`object-fit: contain`, `100vw`) and rich-text figures inside the case study (`height: auto`).

¹ Decorative slots, left out of the safe zone. PortfolioNext's hover bleed measures 2.67:1 at 1440×900 and 2.96:1 at 1920×1080 and 3840×2160, sits behind a 58% ink scrim, and is scaled ×1.15. On a 3840 master it shows roughly the central 3339×1129 at 1920 and 4K. The OG card shows only the centre 36% of the width (1371×2160). Neither is a reading surface. Keep the subject near the centre and both still work.

Hover zooms (×1.03 on WorksFeatured and the gallery) are transient, so they don't count.

### Safe zone

On a 3840×2160 master the binding crops are **21:9**, which keeps 3840×1645, and **4:3**, which keeps 2880×2160. Their intersection is the safe zone:

> **Central 2880 × 1645** (x 480–3360, y 257–1902). Anything that has to be read goes inside it.

16:9 and 16:10 crops sit inside those two limits. The 21:9 height is 1645.7 px, so the zone rounds down to 1645 rather than up to 1646. `imageCrops.test.ts` fails if a crop change moves the safe zone.

The master is 3840 wide because `sizes="100vw"` slots pick the 3840 rendition at 1920 CSS px × DPR 2 and at 4K × DPR 1 (`deviceSizes` tops out at 3840).

## 2. Configure a project

[`scripts/plates/projects.config.ts`](../../scripts/plates/projects.config.ts), one entry per project:

```ts
{
	slug: 'persona-ai-resume-builder',   // = PortfolioDetails.slug
	surface: 'paper',                    // 'ink' | 'paper'; each plate can override it
	grid: true,                          // 12-col hairlines over the safe zone, low opacity
	screens: [
		{ name: 'desktop-1', device: 'desktop' },                        // imported
		{ name: 'home', device: 'desktop', source: 'https://…' },        // captured
		{ name: 'm-1', device: 'mobile', source: './mock/index.html', hide: ['.cookie'] },
	],
	plates: [
		{ template: 'cover', screen: 'desktop-1', use: ['card', 'spotlight'], alt: '…' },
		{ template: 'detail', screen: 'desktop-2', region: { x: 46, y: 150, width: 552, height: 270 }, zoom: 2.5, use: ['gallery'], alt: '…' },
		{ template: 'mobile-trio', screens: ['m-1', 'm-2', 'm-3'], use: ['gallery'], alt: '…' },
		{ template: 'type-plate', variant: 'statement' | 'code' | 'terminal', label: '…', text: '…', alt: '…' },
	],
}
```

### Screens

| Device  | Viewport  | DPR | Raw size  |
| ------- | --------- | --- | --------- |
| desktop | 1920×1080 | 2   | 3840×2160 |
| mobile  | 430×932   | 3   | 1290×2796 |

- **Capture:** set `source` to an `https://` URL or a local `.html` path. Capture runs Chromium with `prefers-reduced-motion: reduce` and light colour scheme (`colorScheme: 'dark'` overrides that), waits for fonts, and applies `waitFor`, `scrollTo`, `hide` and `delay`. Results are cached in `raw/<slug>/<name>.png`; pass `--force` to re-shoot. Capture against a production build (`pnpm build && pnpm start`), not `next dev`.
- **Trim:** `trim: { bottom: 64 }` cuts CSS px off the edges before composing, for example the `next dev` badge in old screenshots.
- **Import:** leave out `source` and put the PNG at `scripts/plates/raw/<slug>/<name>.png`. Set `dpr` if it wasn't taken at the device default (macOS screenshots are 2).

`raw/` and `out/` are gitignored. Reviewed samples are copied into `docs/redesign/plates/`.

### Both themes

Set `surface: ['ink', 'paper']` on a project or a plate to render it twice, as `<name>-ink.png` and `<name>-paper.png`. A cover or detail can take a different screen per surface, `screen: { ink: 'dashboard-dark', paper: 'dashboard-light' }`, when the app has its own dark mode. Covers use both: `plates:upload` links the paper plate to `spotlightImage` and the ink plate to `spotlightImageDark`. Galleries take the ink variant only.

### Templates

| Template      | Layout                                                                                                                                                                                                                                          |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cover`       | One screen, centred, 80% of the safe-zone width (2304 px; 90% of its height is the cap), 1px hairline frame, square corners.                                                                                                                    |
| `detail`      | `region` in **CSS px** of the screen, drawn at `zoom` plate px per CSS px (default = the screen's DPR, i.e. 1:1 source pixels). Shrinks to fit the safe zone. Warns past ×1.3 upscaling.                                                        |
| `mobile-trio` | Three phone screens at 88% of the safe-zone height, 5% gaps, each framed.                                                                                                                                                                       |
| `type-plate`  | For projects without UI. `statement`: Inter Tight with the last word in Instrument Serif italic, accent colour. `code` / `terminal`: JetBrains Mono panel with a label bar; `#`/`//` comments are muted and `$ ` prompts use the accent colour. |

Colours come only from `src/styles/tokens.ts` (`palette`, `lineAlpha`). The frame uses the `--line-strong` alpha and the grid uses half the `--line` alpha. Fonts are fetched from Google Fonts with a text subset when a type plate is rendered, which needs network access.

### Output

```
scripts/plates/out/<slug>/
  project-<slug>--<name>.png         plate (name defaults to the template)
  project-<slug>--<name>.debug.png   + 21:9 / 16:10 / 4:3 / 16:9 guides and the safe zone
  plates.json                file, template, alt, use, surface → /dev/plates + upload
```

## 3. Check the crops

Run `pnpm dev` and open **`/dev/plates`**. Each plate is shown in every slot it is assigned to (`use`), at 360 (touch), 1440 and 3840, with the real ratio and scale. Use **Show crop guides** to switch to the debug variants.

The page is `page.dev.tsx` and `route.dev.ts`. `next.config.js` only adds the `dev.*` page extensions in the dev-server phase, so production builds never compile, route or list it in the sitemap. If dev hangs on "Compiling" after `pageExtensions` changes, delete `.next/dev`.

## 4. Alt text

- Every plate needs `alt` in the config. Compose copies it into `plates.json` and upload writes it to the asset description.
- Describe what the screen shows and why it matters, not the plate itself. Leave out "screenshot of", the background, the frame and the grid.
- Name the product and the state, for example "Persona resume editor: section tabs and profile form on the left, live resume preview on the right."
- Detail plates name the feature being zoomed. Type plates repeat the statement, or summarise the code in a sentence.
- Keep it under about 150 characters. Write it as sentences, not keyword lists.
- Where the image is decorative (the case-study cover sits right under the H1), the site still renders `alt=""`. The description is for gallery and Contentful use.

## 5. Upload to Contentful

1. Put a personal access token (Contentful → Settings → CMA tokens) in `.env.local` as `CONTENTFUL_MANAGEMENT_TOKEN`. That file is gitignored. `CONTENTFUL_SPACE_ID` comes from `.env`.
2. Run `pnpm plates:upload --env <id> <slug>`. This is a **dry run**. It finds the Portfolio Project by `slug` and prints each asset it would write and each field it would set:
   - `card` / `spotlight` → the cover: the paper plate to `spotlightImage` (light theme), the ink plate to `spotlightImageDark`
   - `gallery` → appended to `gallery`, ink variant only, never twice
3. Run `pnpm plates:upload --env <id> <slug> --apply`. It uploads each PNG, processes it, and saves the assets and the project as **drafts**.
4. Run `pnpm cms:check --env <id>`, check the drafts with a preview build (`CONTENTFUL_PREVIEW=true pnpm build`), then `pnpm cms:publish --env <id> --apply`.

Re-running is safe. A plate's asset ID is its file stem (`project-<slug>--<name>`), so a new composition replaces the file in place. A cover whose plate asset doesn't exist yet replaces the file of the asset the field already links, so its ID and links stay put.
