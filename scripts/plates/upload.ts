/**
 * Uploads composed plates to Contentful and links them to the project's
 * Portfolio Project entry, per each plate's `use`. Writes drafts only; check
 * and publish with `pnpm cms:check` / `pnpm cms:publish` afterwards.
 *
 *   pnpm plates:upload --env <id> [slug…]            # print the plan
 *   pnpm plates:upload --env <id> [slug…] --apply    # upload and link as drafts
 *
 * `card` and `spotlight` both mean the cover: the paper plate goes to
 * `spotlightImage` (light theme), the ink plate to `spotlightImageDark`.
 * `gallery` appends to `gallery` (ink variant only, never twice).
 *
 * Each plate's asset id is its file stem (`project-<slug>--<name>`), so
 * re-running replaces the file in place. A cover with no plate asset yet
 * replaces the file of the asset the field already links, keeping its id.
 */
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import projects from './projects.config.ts';
import {
	OUT_DIR,
	selectProjects,
	type PlateManifestEntry,
	type PlateProject,
} from './shared.ts';
import {
	createClient,
	link,
	value,
	type Entry,
} from '../../contentful/lib/cma.ts';

const args = process.argv.slice(2);
const environment = args[args.indexOf('--env') + 1];
const APPLY = args.includes('--apply');
if (!args.includes('--env') || !environment) {
	console.error('Pass --env <environment id>. There is no default.');
	process.exit(1);
}

const COVER_FIELDS = {
	paper: 'spotlightImage',
	ink: 'spotlightImageDark',
} as const;

type AssetLink = ReturnType<typeof link>;

const client = createClient(environment);

const findProject = async (slug: string): Promise<Entry> => {
	const [entry, ...rest] = await client.getEntries({
		content_type: 'portfolioDetails',
		'fields.slug': slug,
	});
	if (!entry) throw new Error(`No Portfolio Project with slug "${slug}"`);
	if (rest.length) throw new Error(`Several projects with slug "${slug}"`);
	return entry;
};

const assetTitle = (project: Entry, plate: PlateManifestEntry): string => {
	const name = String(value(project, 'name') ?? '').replace(/^Project — /, '');
	const what = plate.file
		.replace(/^.*--/, '')
		.replace(/\.png$/, '')
		.replace(/-(ink|paper)$/, '')
		.replace(/-/g, ' ');
	return `${name} — ${what}${plate.variant ? `, ${plate.surface}` : ''}`;
};

const run = async (selected: PlateProject[]): Promise<void> => {
	console.log(
		`${APPLY ? 'APPLY' : 'DRY RUN'} · Contentful environment: ${environment}\n`
	);

	for (const project of selected) {
		const manifest = JSON.parse(
			await readFile(resolve(OUT_DIR, project.slug, 'plates.json'), 'utf8')
		) as PlateManifestEntry[];
		const entry = await findProject(project.slug);
		console.log(`${project.slug}  →  ${entry.sys.id}`);

		const fields: Record<string, unknown> = {};
		let gallery = value<AssetLink[]>(entry, 'gallery') ?? [];

		for (const plate of manifest.filter((p) => p.use.length)) {
			const id = plate.file.replace(/\.png$/, '').slice(0, 64);
			const isCover = plate.use.some((use) => use !== 'gallery');
			const coverField = COVER_FIELDS[plate.surface];
			const linkedId = value<AssetLink>(entry, coverField)?.sys.id;
			const target =
				(await client.getAsset(id)) || !isCover || !linkedId ? id : linkedId;

			console.log(
				`  ${target === id ? 'put    ' : 'replace'} asset ${target} ← ${plate.file}`
			);
			if (APPLY) {
				const bytes = await readFile(
					resolve(OUT_DIR, project.slug, plate.file)
				);
				await client.putAssetFile(
					target,
					bytes,
					{ fileName: plate.file, contentType: 'image/png' },
					{ title: assetTitle(entry, plate), description: plate.alt }
				);
			}

			if (isCover) {
				console.log(`    ${coverField} = ${target}`);
				fields[coverField] = link(target, 'Asset');
			}
			if (plate.use.includes('gallery')) {
				if (plate.variant && plate.surface !== 'ink') {
					console.log(`    skip gallery (${plate.surface} variant)`);
				} else if (gallery.some((item) => item.sys.id === target)) {
					console.log(`    gallery already has ${target}`);
				} else {
					console.log(`    gallery += ${target}`);
					gallery = [...gallery, link(target, 'Asset')];
					fields.gallery = gallery;
				}
			}
		}

		for (const field of Object.values(COVER_FIELDS)) {
			if (!fields[field] && !value(entry, field)) {
				console.warn(`  ! ${field} is empty and no plate fills it`);
			}
		}
		if (APPLY && Object.keys(fields).length) {
			await client.upsertEntry(entry.sys.id, 'portfolioDetails', fields);
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
	selectProjects(
		projects,
		args.filter((arg, i) => !arg.startsWith('--') && args[i - 1] !== '--env')
	)
);
