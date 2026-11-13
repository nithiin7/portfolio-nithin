/**
 * Content rules `pnpm cms:check` enforces on top of Contentful's own
 * validations (docs/cms/CONVENTIONS.md §6 and §9). Pure functions, so they
 * can be unit-tested without a space.
 */

export interface LinkRef {
	linkType: 'Entry' | 'Asset';
	id: string;
	field: string;
}

/** Fields holding identifiers, URLs or codes rather than prose. */
const NOT_PROSE = new Set([
	'internalName',
	'name',
	'id',
	'key',
	'slug',
	'url',
	'icon',
	'type',
	'github',
	'demo',
	'certificateUrl',
	'credentialId',
	'email',
	'timeZone',
	'countryCode',
	'twitterHandle',
]);

/** Fields shown as headings or labels, where ALL CAPS is never typed. */
const HEADING_FIELDS = new Set(['title', 'heading', 'label']);

const CANONICAL_NAMES: [RegExp, string][] = [
	[/next[\s.-]?js/gi, 'Next.js'],
	[/node[\s.-]?js/gi, 'Node.js'],
	[/type[\s-]?script/gi, 'TypeScript'],
	[/java[\s-]?script/gi, 'JavaScript'],
	[/fast[\s-]?api/gi, 'FastAPI'],
	[/lang?[\s-]?graph/gi, 'LangGraph'],
	[/lang[\s-]?chain/gi, 'LangChain'],
	[/llama[\s-]?index/gi, 'LlamaIndex'],
	[/open[\s-]?ai/gi, 'OpenAI'],
	[/hugging[\s-]?face/gi, 'Hugging Face'],
	[/postgre[\s-]?sql/gi, 'PostgreSQL'],
	[/supa[\s-]?base/gi, 'Supabase'],
	[/tailwind[\s-]?css/gi, 'Tailwind CSS'],
	[/torch[\s-]?vision/gi, 'TorchVision'],
	[/word[\s-]?press/gi, 'WordPress'],
	[/git[\s-]?hub/gi, 'GitHub'],
	[/ollama/gi, 'Ollama'],
	[/anthropic/gi, 'Anthropic'],
	[/laravel/gi, 'Laravel'],
];

const BANNED_PHRASES: RegExp[] = [
	/\bseamless(?:ly)?\b/i,
	/\bcutting[\s-]edge\b/i,
	/\bleverag(?:e|es|ed|ing)\b/i,
	/\bunlock(?:s|ed|ing)?\b/i,
	/\bempower(?:s|ed|ing)?\b/i,
	/\brevolutioni[sz](?:e|es|ed|ing)\b/i,
	/\bfast-paced world\b/i,
	/\bunfair advantage\b/i,
	/\bwhether you['’]re\b/i,
];

/** Format and weight per asset slot (`<contentType>.<field>`). */
export const ASSET_SLOTS: Record<
	string,
	{ formats: string[]; maxBytes: number; label: string }
> = {
	'portfolioDetails.spotlightImage': {
		formats: ['png', 'webp'],
		maxBytes: 1.5e6,
		label: 'project cover',
	},
	'portfolioDetails.spotlightImageDark': {
		formats: ['png', 'webp'],
		maxBytes: 1.5e6,
		label: 'project cover',
	},
	'portfolioDetails.gallery': {
		formats: ['png', 'webp'],
		maxBytes: 1.5e6,
		label: 'project gallery',
	},
	'blogPost.featuredImage': {
		formats: ['webp'],
		maxBytes: 400e3,
		label: 'blog featured image',
	},
	'blogPost.content': {
		formats: ['webp'],
		maxBytes: 400e3,
		label: 'blog inline image',
	},
	'section.image': {
		formats: ['jpeg', 'webp'],
		maxBytes: 500e3,
		label: 'portrait',
	},
	'testimonialCard.avatar': {
		formats: ['jpeg', 'webp'],
		maxBytes: 200e3,
		label: 'avatar',
	},
	'person.avatar': {
		formats: ['jpeg', 'webp'],
		maxBytes: 200e3,
		label: 'avatar',
	},
	'certification.providerLogo': {
		formats: ['svg+xml'],
		maxBytes: 20e3,
		label: 'logo',
	},
	'link.logo': { formats: ['svg+xml'], maxBytes: 20e3, label: 'logo' },
	'company.logo': { formats: ['svg+xml'], maxBytes: 20e3, label: 'logo' },
	'seo.ogImage': {
		formats: ['png', 'jpeg'],
		maxBytes: 300e3,
		label: 'OG image',
	},
};

export const ALT_TEXT_SOFT_MAX = 150;

interface Node {
	nodeType?: string;
	value?: string;
	marks?: { type: string }[];
	content?: Node[];
	data?: { target?: { sys?: { linkType?: string; id?: string } } };
}

const isRichText = (value: unknown): value is Node =>
	typeof value === 'object' &&
	value !== null &&
	(value as Node).nodeType === 'document';

const isLink = (
	value: unknown
): value is { sys: { type: 'Link'; linkType: string; id: string } } =>
	typeof value === 'object' &&
	value !== null &&
	(value as { sys?: { type?: string } }).sys?.type === 'Link';

const walk = (node: Node, visit: (node: Node) => void): void => {
	visit(node);
	node.content?.forEach((child) => walk(child, visit));
};

/** Every entry/asset link in a set of field values, rich text included. */
export const linksIn = (fields: Record<string, unknown>): LinkRef[] => {
	const links: LinkRef[] = [];
	const add = (field: string, linkType?: string, id?: string) => {
		if ((linkType === 'Entry' || linkType === 'Asset') && id) {
			links.push({ field, linkType, id });
		}
	};
	for (const [field, value] of Object.entries(fields)) {
		for (const item of Array.isArray(value) ? value : [value]) {
			if (isLink(item)) add(field, item.sys.linkType, item.sys.id);
			else if (isRichText(item)) {
				walk(item, (node) =>
					add(
						field,
						node.data?.target?.sys?.linkType,
						node.data?.target?.sys?.id
					)
				);
			}
		}
	}
	return links;
};

/**
 * Prose in a set of field values: [field, text] pairs, rich text flattened
 * (inline code skipped, since commands are lower case on purpose).
 */
export const proseIn = (
	fields: Record<string, unknown>
): [string, string][] => {
	const prose: [string, string][] = [];
	for (const [field, value] of Object.entries(fields)) {
		if (NOT_PROSE.has(field)) continue;
		for (const item of Array.isArray(value) ? value : [value]) {
			if (typeof item === 'string') prose.push([field, item]);
			else if (isRichText(item)) {
				walk(item, (node) => {
					const isCode = node.marks?.some((mark) => mark.type === 'code');
					if (node.nodeType === 'text' && node.value && !isCode) {
						prose.push([field, node.value]);
					}
				});
			}
		}
	}
	return prose;
};

/** Tech names spelt differently from the canonical list, as "found → canonical". */
export const misspelledNames = (text: string): string[] => {
	const found = new Set<string>();
	for (const [pattern, canonical] of CANONICAL_NAMES) {
		// Ignore URLs, domains, handles and file names (github.com, @openai…).
		const bounded = new RegExp(
			`(?<![\\w./@-])(?:${pattern.source})(?![\\w-]|\\.\\w)`,
			pattern.flags
		);
		for (const [match] of text.matchAll(bounded)) {
			if (match !== canonical) found.add(`${match} → ${canonical}`);
		}
	}
	return [...found];
};

export const bannedPhrases = (text: string): string[] =>
	BANNED_PHRASES.flatMap((pattern) => text.match(pattern)?.[0] ?? []);

/** Two or more words typed in capitals ("SELECTED WORKS."). */
export const isShouting = (field: string, text: string): boolean => {
	if (!HEADING_FIELDS.has(field)) return false;
	const words = text.match(/[A-Za-z]{2,}/g) ?? [];
	return (
		words.length >= 2 && words.every((word) => word === word.toUpperCase())
	);
};

export const isPlannedFeature = (field: string, text: string): boolean =>
	field === 'features' && /\bplanned\b|\bcoming soon\b/i.test(text);

/** Problems with an asset's file for the slot that uses it. */
export const assetSlotProblems = (
	slot: string,
	file: { contentType: string; size?: number }
): string[] => {
	const rule = ASSET_SLOTS[slot];
	if (!rule) return [];
	const problems: string[] = [];
	const format = file.contentType.replace(/^image\//, '');
	if (!rule.formats.includes(format)) {
		problems.push(
			`${rule.label} is ${format}, expected ${rule.formats.join(' or ').replace('svg+xml', 'svg')}`
		);
	}
	if (file.size !== undefined && file.size > rule.maxBytes) {
		problems.push(
			`${rule.label} is ${kb(file.size)}, limit ${kb(rule.maxBytes)}`
		);
	}
	return problems;
};

const kb = (bytes: number): string =>
	bytes >= 1e6
		? `${(bytes / 1e6).toFixed(1)} MB`
		: `${Math.round(bytes / 1e3)} KB`;

/** Route prefix per type whose slug is a public URL. */
export const SLUG_ROUTES: Record<string, string> = {
	blogPost: '/blog',
	portfolioDetails: '/portfolio',
};

/** True when next.config.js redirects `from` (matched as a quoted path). */
export const hasRedirect = (nextConfig: string, from: string): boolean =>
	new RegExp(`['"\`]${from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"\`]`).test(
		nextConfig
	);
