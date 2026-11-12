/**
 * Uploads composed plates to Contentful and links them to the project's
 * PortfolioCard.image / PortfolioDetails.spotlightImage / gallery, per each
 * plate's `use`. Dry-run by default; nothing is written without --apply.
 *   pnpm plates:upload [slug…]            # print the plan
 *   pnpm plates:upload [slug…] --apply    # upload + publish assets, update entries as drafts
 *   pnpm plates:upload [slug…] --apply --publish   # …and publish the entries
 * Needs CONTENTFUL_MANAGEMENT_TOKEN in .env.local (never committed).
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

const APPLY = process.argv.includes('--apply');
const PUBLISH = process.argv.includes('--publish');

const CONTENT_TYPES = { card: 'portfolioCard', details: 'portfolioDetails' };
const FIELDS = {
	card: 'image',
	spotlight: 'spotlightImage',
	gallery: 'gallery',
};

const { CONTENTFUL_MANAGEMENT_TOKEN: TOKEN, CONTENTFUL_SPACE_ID: SPACE } =
	process.env;
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT ?? 'master';
const API = `https://api.contentful.com/spaces/${SPACE}/environments/${ENVIRONMENT}`;

interface Sys {
	id: string;
	version: number;
}
interface Entry {
	sys: Sys;
	fields: Record<string, Record<string, unknown>>;
}
interface Link {
	sys: { type: 'Link'; linkType: 'Asset'; id: string };
}

const cma = async <T>(
	url: string,
	init: RequestInit & { version?: number } = {}
): Promise<T> => {
	const { version, ...rest } = init;
	const res = await fetch(url.startsWith('http') ? url : `${API}${url}`, {
		...rest,
		headers: {
			Authorization: `Bearer ${TOKEN}`,
			'Content-Type': 'application/vnd.contentful.management.v1+json',
			...(version !== undefined && { 'X-Contentful-Version': String(version) }),
			...rest.headers,
		},
	});
	if (!res.ok) {
		throw new Error(
			`${rest.method ?? 'GET'} ${url}: ${res.status} ${await res.text()}`
		);
	}
	return (res.status === 204 ? undefined : await res.json()) as T;
};

const findEntry = async (
	contentType: string,
	field: string,
	value: string
): Promise<Entry | undefined> => {
	const query = new URLSearchParams({
		content_type: contentType,
		[`fields.${field}`]: value,
		limit: '2',
	});
	const { items } = await cma<{ items: Entry[] }>(`/entries?${query}`);
	if (items.length > 1) {
		throw new Error(
			`${contentType} ${field}="${value}" matches several entries`
		);
	}
	return items[0];
};

const findAsset = async (title: string, locale: string) => {
	const query = new URLSearchParams({ 'fields.title': title, limit: '1' });
	const { items } = await cma<{ items: Entry[] }>(`/assets?${query}`);
	return items.find((a) => a.fields.title?.[locale] === title);
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Creates (or replaces the file of) the asset titled after the plate, then publishes it. */
const upsertAsset = async (
	slug: string,
	plate: PlateManifestEntry,
	locale: string,
	existing?: Entry
): Promise<string> => {
	const bytes = await readFile(resolve(OUT_DIR, slug, plate.file));
	const upload = await cma<{ sys: Sys }>(
		`https://upload.contentful.com/spaces/${SPACE}/uploads`,
		{
			method: 'POST',
			body: bytes,
			headers: { 'Content-Type': 'application/octet-stream' },
		}
	);
	const title = plate.file.replace(/\.png$/, '');
	const fields = {
		title: { [locale]: title },
		description: { [locale]: plate.alt },
		file: {
			[locale]: {
				contentType: 'image/png',
				fileName: plate.file,
				uploadFrom: {
					sys: { type: 'Link', linkType: 'Upload', id: upload.sys.id },
				},
			},
		},
	};
	let asset = existing
		? await cma<Entry>(`/assets/${existing.sys.id}`, {
				method: 'PUT',
				version: existing.sys.version,
				body: JSON.stringify({ fields }),
			})
		: await cma<Entry>('/assets', {
				method: 'POST',
				body: JSON.stringify({ fields }),
			});

	await cma(`/assets/${asset.sys.id}/files/${locale}/process`, {
		method: 'PUT',
		version: asset.sys.version,
	});
	for (let i = 0; i < 30; i++) {
		await sleep(1000);
		asset = await cma<Entry>(`/assets/${asset.sys.id}`);
		if ((asset.fields.file?.[locale] as { url?: string })?.url) break;
	}
	await cma(`/assets/${asset.sys.id}/published`, {
		method: 'PUT',
		version: asset.sys.version,
	});
	return asset.sys.id;
};

const link = (id: string): Link => ({
	sys: { type: 'Link', linkType: 'Asset', id },
});

const run = async (selected: PlateProject[]): Promise<void> => {
	if (!TOKEN || !SPACE) {
		throw new Error(
			'CONTENTFUL_MANAGEMENT_TOKEN and CONTENTFUL_SPACE_ID are required (put the token in .env.local)'
		);
	}
	const { items: locales } = await cma<{
		items: { code: string; default: boolean }[];
	}>('/locales');
	const locale = locales.find((l) => l.default)?.code ?? 'en-US';

	console.log(
		`${APPLY ? 'APPLY' : 'DRY RUN'} · ${SPACE}/${ENVIRONMENT} · locale ${locale}${PUBLISH ? ' · publish entries' : ''}\n`
	);

	for (const project of selected) {
		const manifest = JSON.parse(
			await readFile(resolve(OUT_DIR, project.slug, 'plates.json'), 'utf8')
		) as PlateManifestEntry[];
		const details = await findEntry(
			CONTENT_TYPES.details,
			'slug',
			project.slug
		);
		if (!details)
			throw new Error(`No PortfolioDetails with slug "${project.slug}"`);
		const title = details.fields.title?.[locale] as string;
		// Cards have no slug; they share the case study's title
		const card = await findEntry(CONTENT_TYPES.card, 'title', title);
		console.log(
			`${project.slug}  →  details ${details.sys.id}, card ${card?.sys.id ?? 'NOT FOUND'}`
		);

		const changes = new Map<Entry, Record<string, unknown>>();
		const setField = (entry: Entry, field: string, value: unknown) =>
			changes.set(entry, { ...changes.get(entry), [field]: value });

		for (const plate of manifest.filter((p) => p.use.length)) {
			// The models have one image per slot, so only the default (ink) variant is linked
			if (plate.variant && plate.surface !== 'ink') {
				console.log(
					`  skip    ${plate.file} (${plate.surface} variant: add it by hand)`
				);
				continue;
			}
			const assetTitle = plate.file.replace(/\.png$/, '');
			const existing = await findAsset(assetTitle, locale);
			console.log(
				`  ${existing ? 'replace' : 'create '} asset "${assetTitle}" → ${plate.use.join(', ')}`
			);
			const id = APPLY
				? await upsertAsset(project.slug, plate, locale, existing)
				: (existing?.sys.id ?? `<new:${assetTitle}>`);

			for (const use of plate.use) {
				if (use === 'card') {
					if (!card) {
						console.warn(
							`    ! no PortfolioCard titled "${title}"; skipping card image`
						);
						continue;
					}
					console.log(`    card.${FIELDS.card} = ${id}`);
					setField(card, FIELDS.card, link(id));
				} else if (use === 'spotlight') {
					console.log(`    details.${FIELDS.spotlight} = ${id}`);
					setField(details, FIELDS.spotlight, link(id));
				} else {
					const pending = changes.get(details)?.[FIELDS.gallery] as
						Link[] | undefined;
					const gallery =
						pending ??
						(details.fields[FIELDS.gallery]?.[locale] as Link[]) ??
						[];
					if (gallery.some((l) => l.sys.id === id)) {
						console.log(`    details.${FIELDS.gallery} already has ${id}`);
						continue;
					}
					console.log(`    details.${FIELDS.gallery} += ${id}`);
					setField(details, FIELDS.gallery, [...gallery, link(id)]);
				}
			}
		}

		if (!APPLY) continue;
		for (const [entry, fields] of changes) {
			const fresh = await cma<Entry>(`/entries/${entry.sys.id}`);
			for (const [field, value] of Object.entries(fields)) {
				fresh.fields[field] = { ...fresh.fields[field], [locale]: value };
			}
			const saved = await cma<Entry>(`/entries/${entry.sys.id}`, {
				method: 'PUT',
				version: fresh.sys.version,
				body: JSON.stringify({ fields: fresh.fields }),
			});
			if (PUBLISH) {
				await cma(`/entries/${entry.sys.id}/published`, {
					method: 'PUT',
					version: saved.sys.version,
				});
			}
			console.log(`  ${PUBLISH ? 'published' : 'saved draft'} ${entry.sys.id}`);
		}
	}
	if (!APPLY) console.log('\nNothing written. Re-run with --apply to upload.');
};

await run(selectProjects(projects));
