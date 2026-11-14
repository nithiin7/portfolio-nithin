/**
 * Uploads the covers from `pnpm plates:blog` and links them to each Blog Post:
 * the paper WebP to `featuredImage` (light theme, OG, RSS), the ink WebP to
 * `featuredImageDark`. Writes drafts only; check and publish with
 * `pnpm cms:check` / `pnpm cms:publish` afterwards. Needs migration 015.
 *
 *   pnpm plates:blog:upload --env <id> [slug…]            # print the plan
 *   pnpm plates:blog:upload --env <id> [slug…] --apply    # upload and link
 *
 * Each cover gets its own asset (`post-<slug>--featured-<surface>`), so re-running
 * replaces the file in place. The previously linked images are left untouched.
 */
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import {
	BLOG_OUT_DIR,
	blogCoverName,
	selectCovers,
	type BlogCover,
} from './blog.ts';
import type { Surface } from './shared.ts';
import { createClient, link, value } from '../../contentful/lib/cma.ts';

const args = process.argv.slice(2);
const environment = args[args.indexOf('--env') + 1];
const APPLY = args.includes('--apply');
if (!args.includes('--env') || !environment) {
	console.error('Pass --env <environment id>. There is no default.');
	process.exit(1);
}

const FIELDS: Record<Surface, string> = {
	paper: 'featuredImage',
	ink: 'featuredImageDark',
};

const client = createClient(environment);

const run = async (covers: BlogCover[]): Promise<void> => {
	console.log(
		`${APPLY ? 'APPLY' : 'DRY RUN'} · Contentful environment: ${environment}\n`
	);

	for (const cover of covers) {
		const [entry, ...rest] = await client.getEntries({
			content_type: 'blogPost',
			'fields.slug': cover.slug,
		});
		if (!entry) throw new Error(`No Blog Post with slug "${cover.slug}"`);
		if (rest.length) throw new Error(`Several posts with slug "${cover.slug}"`);
		console.log(`${cover.slug}  →  ${entry.sys.id}`);

		const title = String(value(entry, 'title') ?? cover.slug);
		const fields: Record<string, unknown> = {};

		for (const [surface, field] of Object.entries(FIELDS) as [
			Surface,
			string,
		][]) {
			const id = blogCoverName(cover.slug, surface);
			const file = `${id}.webp`;
			const before = value<{ sys: { id: string } }>(entry, field)?.sys.id;
			console.log(
				`  ${(await client.getAsset(id)) ? 'replace' : 'put    '} asset ${id} ← ${file}`
			);
			console.log(`    ${field}: ${before ?? '(empty)'} → ${id}`);
			if (APPLY) {
				await client.putAssetFile(
					id,
					await readFile(resolve(BLOG_OUT_DIR, cover.slug, file)),
					{ fileName: file, contentType: 'image/webp' },
					{ title: `${title} — featured, ${surface}`, description: cover.alt }
				);
			}
			fields[field] = link(id, 'Asset');
		}

		if (APPLY) {
			await client.upsertEntry(entry.sys.id, 'blogPost', fields);
			console.log(`  saved draft ${entry.sys.id}`);
		}
	}
	console.log(
		APPLY
			? '\nDrafts saved. Next: pnpm cms:check, then pnpm cms:publish.'
			: '\nNothing written. Re-run with --apply to upload.'
	);
};

await run(
	selectCovers(
		args.filter((arg, i) => !arg.startsWith('--') && args[i - 1] !== '--env')
	)
);
