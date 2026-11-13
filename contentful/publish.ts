/**
 * Publishes pending CMS changes, assets first, then entries in link order.
 *
 *   pnpm cms:publish --env <id>           # list what would be published
 *   pnpm cms:publish --env <id> --apply   # publish it
 *
 * Publishes: every asset or entry with unpublished changes, plus never-
 * published entries of the building-block types (SEO, Link, Settings…).
 * Never publishes: entries tagged `retired` or `needsReview`, never-published
 * blog posts and projects (real drafts), or the migration log. Entries that
 * fail validation are reported and skipped.
 */
import { createClient, type Asset, type Entry } from './lib/cma.ts';

const ORDER = [
	'seo',
	'link',
	'media',
	'person',
	'principle',
	'stat',
	'capability',
	'blogCategory',
	'certification',
	'careerExperience',
	'testimonialCard',
	'portfolioDetails',
	'blogPost',
	'siteSettings',
	'section',
	'page',
];
const DRAFT_TYPES = new Set(['blogPost', 'portfolioDetails']);
const SKIP_TAGS = new Set(['retired', 'needsReview']);

const args = process.argv.slice(2);
const environment = args[args.indexOf('--env') + 1];
const apply = args.includes('--apply');
if (!args.includes('--env') || !environment) {
	console.error('Pass --env <environment id>. There is no default.');
	process.exit(1);
}

type Sys = Entry['sys'] | Asset['sys'];
const isChanged = (sys: Sys): boolean =>
	sys.publishedVersion !== undefined && sys.version > sys.publishedVersion + 1;
const isNew = (sys: Sys): boolean => sys.publishedVersion === undefined;

const shouldPublishEntry = (entry: Entry): boolean => {
	const type = entry.sys.contentType.sys.id;
	if (type === 'cmsMigration') return false;
	if (entry.sys.archivedVersion) return false;
	if (entry.metadata?.tags.some((tag) => SKIP_TAGS.has(tag.sys.id))) {
		return false;
	}
	if (isChanged(entry.sys)) return true;
	return isNew(entry.sys) && !DRAFT_TYPES.has(type);
};

const label = (entry: Entry): string => {
	const field = (id: string) =>
		entry.fields[id]?.['en-US'] as string | undefined;
	return (
		field('internalName') ?? field('name') ?? field('title') ?? entry.sys.id
	);
};

const main = async (): Promise<void> => {
	const client = createClient(environment);
	console.log(`\nContentful environment: ${environment}\n`);

	const assets = (await client.getAssets()).filter(
		(asset) => isNew(asset.sys) || isChanged(asset.sys)
	);
	const entries = (await client.getEntries({}))
		.filter(shouldPublishEntry)
		.sort(
			(a, b) =>
				ORDER.indexOf(a.sys.contentType.sys.id) -
				ORDER.indexOf(b.sys.contentType.sys.id)
		);

	console.log(`${assets.length} assets, ${entries.length} entries:\n`);
	for (const asset of assets) {
		console.log(
			`  asset  ${isNew(asset.sys) ? 'new    ' : 'changed'} ${asset.fields.title?.['en-US'] ?? asset.sys.id}`
		);
	}
	for (const entry of entries) {
		console.log(
			`  ${entry.sys.contentType.sys.id.padEnd(16)} ${isNew(entry.sys) ? 'new    ' : 'changed'} ${label(entry)}`
		);
	}
	if (!apply) {
		console.log('\nRe-run with --apply to publish.');
		return;
	}

	const failures: string[] = [];
	for (const asset of assets) {
		try {
			await client.request(`/assets/${asset.sys.id}/published`, {
				method: 'PUT',
				version: asset.sys.version,
			});
		} catch (error) {
			failures.push(`asset ${asset.sys.id}: ${String(error).slice(0, 300)}`);
		}
	}
	for (const entry of entries) {
		try {
			await client.request(`/entries/${entry.sys.id}/published`, {
				method: 'PUT',
				version: entry.sys.version,
			});
		} catch (error) {
			const details =
				String(error).match(/"details":\s*(\{[\s\S]*\})/)?.[1] ?? '';
			failures.push(
				`${entry.sys.contentType.sys.id} ${label(entry)}: ${details.slice(0, 400) || String(error).slice(0, 300)}`
			);
		}
	}

	const published = assets.length + entries.length - failures.length;
	console.log(`\n✓ Published ${published}`);
	if (failures.length) {
		console.log(`\n✗ ${failures.length} failed:\n`);
		for (const failure of failures) console.log(`  ${failure}\n`);
		process.exitCode = 1;
	}
};

main().catch((error: unknown) => {
	console.error(error);
	process.exit(1);
});
