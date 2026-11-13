/**
 * Read-only content check. Run it before `cms:publish`.
 *
 *   pnpm cms:check --env <id>
 *
 * Errors (exit 1) break the site or its accessibility:
 *   - an asset in use has no description (alt text)
 *   - a link points at a missing or archived entry or asset
 *   - a link points at an entry tagged `retired` or `deprecated`
 *   - a published entry links to something that isn't published
 *   - a published slug was changed without a redirect in next.config.js
 * Warnings are style-guide drift (CONVENTIONS §6, §9): tech-name spelling,
 * banned phrases, ALL-CAPS headings, planned features, long alt text, and
 * asset format/weight per slot.
 */
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { createClient, type Asset, type Entry } from './lib/cma.ts';
import {
	ALT_TEXT_SOFT_MAX,
	SLUG_ROUTES,
	assetSlotProblems,
	bannedPhrases,
	hasRedirect,
	isPlannedFeature,
	isShouting,
	linksIn,
	misspelledNames,
	proseIn,
} from './lib/rules.ts';

const LOCALE = 'en-US';
const INACTIVE_TAGS = new Set(['retired', 'deprecated']);

const args = process.argv.slice(2);
const environment = args[args.indexOf('--env') + 1];
if (!args.includes('--env') || !environment) {
	console.error('Pass --env <environment id>. There is no default.');
	process.exit(1);
}

type PublicEntry = Pick<Entry, 'sys' | 'fields'>;

const unwrap = (fields: Entry['fields']): Record<string, unknown> =>
	Object.fromEntries(
		Object.entries(fields).map(([key, value]) => [key, value?.[LOCALE]])
	);

const tags = (entry: Entry): string[] =>
	entry.metadata?.tags.map((tag) => tag.sys.id) ?? [];

const main = async (): Promise<void> => {
	const client = createClient(environment);
	console.log(`\nContentful environment: ${environment}\n`);

	const [entries, assets, published, nextConfig] = await Promise.all([
		client.getEntries({}),
		client.getAssets(),
		(async () => {
			const items: PublicEntry[] = [];
			for (let skip = 0; ; skip += 100) {
				const page = await client.request<{
					items: PublicEntry[];
					total: number;
				}>(`/public/entries?limit=100&skip=${skip}`);
				items.push(...page.items);
				if (items.length >= page.total) return items;
			}
		})(),
		readFile(resolve(import.meta.dirname, '../next.config.js'), 'utf8'),
	]);

	const entryById = new Map(entries.map((entry) => [entry.sys.id, entry]));
	const assetById = new Map(assets.map((asset) => [asset.sys.id, asset]));
	const publishedIds = new Set(published.map((entry) => entry.sys.id));
	const isActive = (entry: Entry): boolean =>
		entry.sys.contentType.sys.id !== 'cmsMigration' &&
		!entry.sys.archivedVersion &&
		!tags(entry).some((tag) => INACTIVE_TAGS.has(tag));
	const active = entries.filter(isActive);

	const label = (entry: Entry | PublicEntry): string => {
		const fields = unwrap(entry.fields);
		return String(
			fields.internalName ?? fields.name ?? fields.title ?? entry.sys.id
		);
	};
	const assetLabel = (asset: Asset): string =>
		asset.fields.title?.[LOCALE] ?? asset.sys.id;

	const errors: string[] = [];
	const warnings: string[] = [];

	// Links from the current (draft) state of every active entry.
	const assetSlots = new Map<string, Set<string>>();
	for (const entry of active) {
		const type = entry.sys.contentType.sys.id;
		for (const ref of linksIn(unwrap(entry.fields))) {
			const where = `${label(entry)} · ${ref.field}`;
			if (ref.linkType === 'Asset') {
				const asset = assetById.get(ref.id);
				if (!asset) {
					errors.push(`${where}: links to missing asset ${ref.id}`);
					continue;
				}
				const slots = assetSlots.get(ref.id) ?? new Set();
				slots.add(`${type}.${ref.field}`);
				assetSlots.set(ref.id, slots);
				continue;
			}
			const target = entryById.get(ref.id);
			if (!target || target.sys.archivedVersion) {
				errors.push(`${where}: links to missing or archived entry ${ref.id}`);
			} else if (!isActive(target)) {
				errors.push(
					`${where}: links to ${tags(target).join('/')} entry "${label(target)}"`
				);
			}
		}

		for (const [field, text] of proseIn(unwrap(entry.fields))) {
			const where = `${label(entry)} · ${field}`;
			for (const fix of misspelledNames(text)) {
				warnings.push(`${where}: spelling ${fix}`);
			}
			for (const phrase of bannedPhrases(text)) {
				warnings.push(`${where}: cut "${phrase}"`);
			}
			if (isShouting(field, text)) {
				warnings.push(`${where}: ALL CAPS "${text}", use sentence case`);
			}
			if (isPlannedFeature(field, text)) {
				warnings.push(`${where}: planned work listed as a feature`);
			}
		}
	}

	// Assets in use: alt text, then format and weight for each slot.
	for (const [id, slots] of assetSlots) {
		const asset = assetById.get(id)!;
		const alt = asset.fields.description?.[LOCALE]?.trim();
		const name = `Asset "${assetLabel(asset)}" (${id})`;
		if (!alt) errors.push(`${name}: no description (alt text)`);
		else if (alt.length > ALT_TEXT_SOFT_MAX) {
			warnings.push(
				`${name}: alt text is ${alt.length} chars, aim for ≤ ${ALT_TEXT_SOFT_MAX}`
			);
		}
		const file = asset.fields.file?.[LOCALE];
		if (!file) {
			errors.push(`${name}: has no file`);
			continue;
		}
		for (const slot of slots) {
			for (const problem of assetSlotProblems(slot, {
				contentType: file.contentType,
				size: file.details?.size,
			})) {
				warnings.push(`${name}: ${problem}`);
			}
		}
	}

	// Published versions: links to unpublished content, and slug changes.
	for (const entry of published) {
		const type = entry.sys.contentType.sys.id;
		const fields = unwrap(entry.fields);
		for (const ref of linksIn(fields)) {
			const isLive =
				ref.linkType === 'Entry'
					? publishedIds.has(ref.id)
					: assetById.get(ref.id)?.sys.publishedVersion !== undefined;
			if (!isLive) {
				errors.push(
					`${label(entry)} · ${ref.field} (published): links to unpublished ${ref.linkType.toLowerCase()} ${ref.id}`
				);
			}
		}

		const route = SLUG_ROUTES[type];
		const draft = entryById.get(entry.sys.id);
		const liveSlug = fields.slug as string | undefined;
		const draftSlug = draft?.fields.slug?.[LOCALE] as string | undefined;
		if (route && liveSlug && draftSlug && liveSlug !== draftSlug) {
			const from = `${route}/${liveSlug}`;
			if (!hasRedirect(nextConfig, from)) {
				errors.push(
					`${label(entry)}: slug changes ${from} → ${route}/${draftSlug} with no redirect in next.config.js`
				);
			}
		}
	}

	const review = active.filter((entry) => tags(entry).includes('needsReview'));
	const pending = active.filter(
		(entry) =>
			entry.sys.publishedVersion === undefined ||
			entry.sys.version > entry.sys.publishedVersion + 1
	);

	const print = (title: string, lines: string[]) => {
		if (!lines.length) return;
		console.log(`${title} (${lines.length})\n`);
		for (const line of [...new Set(lines)].sort()) console.log(`  ${line}`);
		console.log('');
	};
	print('✗ Errors', errors);
	print('! Warnings', warnings);
	print(
		'· Tagged needsReview',
		review.map((entry) => label(entry))
	);
	console.log(
		`${active.length} active entries (${assetSlots.size} assets in use), ${pending.length} with unpublished changes.`
	);
	console.log(
		errors.length
			? `\n✗ ${errors.length} errors. Fix them before publishing.`
			: '\n✓ No errors.'
	);
	if (errors.length) process.exitCode = 1;
};

main().catch((error: unknown) => {
	console.error(error);
	process.exit(1);
});
