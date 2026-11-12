/**
 * Minimal Contentful Management API client for the data half of migrations.
 * Every write saves a draft; nothing here publishes.
 */

export type Fields = Record<string, { 'en-US': unknown } | undefined>;

export interface Entry {
	sys: {
		id: string;
		version: number;
		publishedVersion?: number;
		archivedVersion?: number;
		contentType: { sys: { id: string } };
	};
	fields: Fields;
	metadata?: { tags: { sys: { id: string } }[] };
}

export interface Asset {
	sys: { id: string; version: number; publishedVersion?: number };
	fields: {
		title?: { 'en-US': string };
		description?: { 'en-US': string };
		file?: {
			'en-US': {
				url?: string;
				fileName: string;
				contentType: string;
				details?: { size: number; image?: { width: number; height: number } };
			};
		};
	};
}

const LOCALE = 'en-US';
const API = 'https://api.contentful.com';
const UPLOAD = 'https://upload.contentful.com';

const required = (name: string): string => {
	const value = process.env[name];
	if (!value) throw new Error(`${name} is not set (.env / .env.local)`);
	return value;
};

export const sleep = (ms: number): Promise<void> =>
	new Promise((done) => setTimeout(done, ms));

export const createClient = (environment: string) => {
	const token = required('CONTENTFUL_MANAGEMENT_TOKEN');
	const space = required('CONTENTFUL_SPACE_ID');
	const base = `${API}/spaces/${space}/environments/${environment}`;

	const request = async <T>(
		path: string,
		init: RequestInit & { version?: number; contentType?: string } = {}
	): Promise<T> => {
		const { version, contentType, ...rest } = init;
		const url = path.startsWith('http') ? path : `${base}${path}`;
		for (let attempt = 0; ; attempt++) {
			const res = await fetch(url, {
				...rest,
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/vnd.contentful.management.v1+json',
					...(version !== undefined && {
						'X-Contentful-Version': String(version),
					}),
					...(contentType && { 'X-Contentful-Content-Type': contentType }),
					...rest.headers,
				},
			});
			if (res.status === 429 && attempt < 6) {
				await sleep(
					Number(res.headers.get('X-Contentful-RateLimit-Reset') ?? 1) * 1000
				);
				continue;
			}
			const text = await res.text();
			if (!res.ok) {
				throw new Error(
					`${rest.method ?? 'GET'} ${path} → ${res.status}: ${text}`
				);
			}
			return (text ? JSON.parse(text) : undefined) as T;
		}
	};

	const getEntries = async (
		query: Record<string, string>
	): Promise<Entry[]> => {
		const items: Entry[] = [];
		for (let skip = 0; ; skip += 100) {
			const params = new URLSearchParams({
				...query,
				limit: '100',
				skip: String(skip),
			});
			const page = await request<{ items: Entry[]; total: number }>(
				`/entries?${params}`
			);
			items.push(...page.items);
			if (items.length >= page.total) return items;
		}
	};

	const getEntry = async (id: string): Promise<Entry | undefined> => {
		try {
			return await request<Entry>(`/entries/${id}`);
		} catch (error) {
			if (String(error).includes('→ 404')) return undefined;
			throw error;
		}
	};

	/** Merge `fields` into an entry (or create it with this id) and save a draft. */
	const upsertEntry = async (
		id: string,
		contentType: string,
		fields: Record<string, unknown>,
		tags?: string[]
	): Promise<Entry> => {
		const current = await getEntry(id);
		const merged: Fields = { ...(current?.fields ?? {}) };
		for (const [key, value] of Object.entries(fields)) {
			merged[key] = value === undefined ? undefined : { [LOCALE]: value };
		}
		for (const key of Object.keys(merged)) {
			if (merged[key] === undefined) delete merged[key];
		}
		const metadata = tags
			? { tags: tags.map((tag) => link(tag, 'Tag')) }
			: current?.metadata;
		return request<Entry>(`/entries/${id}`, {
			method: 'PUT',
			version: current?.sys.version,
			contentType: current ? undefined : contentType,
			body: JSON.stringify({ fields: merged, metadata }),
		});
	};

	/** Add tags to an entry without touching its fields. */
	const tagEntry = async (id: string, tags: string[]): Promise<void> => {
		const current = await getEntry(id);
		if (!current) return;
		const existing = current.metadata?.tags.map((tag) => tag.sys.id) ?? [];
		const next = [...new Set([...existing, ...tags])];
		if (next.length === existing.length) return;
		await request(`/entries/${id}`, {
			method: 'PUT',
			version: current.sys.version,
			body: JSON.stringify({
				fields: current.fields,
				metadata: { tags: next.map((tag) => link(tag, 'Tag')) },
			}),
		});
	};

	/** Unpublish (if needed) and permanently delete an entry. */
	const deleteEntry = async (id: string): Promise<void> => {
		const entry = await getEntry(id);
		if (!entry) return;
		if (entry.sys.publishedVersion) {
			await request(`/entries/${id}/published`, { method: 'DELETE' });
		}
		const current = await getEntry(id);
		await request(`/entries/${id}`, {
			method: 'DELETE',
			version: current?.sys.version,
		});
	};

	const getAssets = async (): Promise<Asset[]> => {
		const items: Asset[] = [];
		for (let skip = 0; ; skip += 100) {
			const page = await request<{ items: Asset[]; total: number }>(
				`/assets?limit=100&skip=${skip}`
			);
			items.push(...page.items);
			if (items.length >= page.total) return items;
		}
	};

	/**
	 * Upload a local file as a new asset with this id (or return the existing
	 * one), process it, and leave it as a draft.
	 */
	const ensureAsset = async (
		id: string,
		bytes: Uint8Array,
		file: { fileName: string; contentType: string },
		meta: { title: string; description: string }
	): Promise<Asset> => {
		try {
			return await request<Asset>(`/assets/${id}`);
		} catch (error) {
			if (!String(error).includes('→ 404')) throw error;
		}
		const upload = await request<{ sys: { id: string } }>(
			`${UPLOAD}/spaces/${space}/uploads`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/octet-stream' },
				body: new Uint8Array(bytes),
			}
		);
		const created = await request<Asset>(`/assets/${id}`, {
			method: 'PUT',
			body: JSON.stringify({
				fields: {
					title: { [LOCALE]: meta.title },
					description: { [LOCALE]: meta.description },
					file: {
						[LOCALE]: {
							...file,
							uploadFrom: { sys: link(upload.sys.id, 'Upload').sys },
						},
					},
				},
			}),
		});
		await request(`/assets/${id}/files/${LOCALE}/process`, {
			method: 'PUT',
			version: created.sys.version,
		});
		for (let attempt = 0; attempt < 20; attempt++) {
			await sleep(500);
			const asset = await request<Asset>(`/assets/${id}`);
			if (asset.fields.file?.[LOCALE].url) return asset;
		}
		throw new Error(`Asset ${id} did not finish processing`);
	};

	return {
		environment,
		request,
		getEntries,
		getEntry,
		upsertEntry,
		tagEntry,
		deleteEntry,
		getAssets,
		ensureAsset,
	};
};

export type Client = ReturnType<typeof createClient>;

export const link = (
	id: string,
	linkType: 'Entry' | 'Asset' | 'Tag' | 'Upload'
) => ({ sys: { type: 'Link', linkType, id } });

export const value = <T>(
	entry: Entry | undefined,
	field: string
): T | undefined => entry?.fields[field]?.[LOCALE] as T | undefined;

export const richText = (paragraphs: string[]) => ({
	nodeType: 'document',
	data: {},
	content: paragraphs.map((text) => ({
		nodeType: 'paragraph',
		data: {},
		content: [{ nodeType: 'text', value: text, marks: [], data: {} }],
	})),
});
