/**
 * Categories, the author, SEO entries from the old SEO fields, and two
 * lossless body fixes (H1 → H2, zero-width spaces). Wording is untouched;
 * rewrites to fit the new limits are in COPY_REVIEW.md. Drafts only.
 */
import { link, value, type Client } from '../lib/cma.ts';

const CATEGORIES = [
	{
		id: '3dQVwk0aGWQovoE7pMUMOk',
		name: 'AI Engineering',
		slug: 'ai-engineering',
		description: 'Agents, RAG, MCP and shipping LLM features.',
	},
	{
		id: 'category-fullstack',
		name: 'Full-stack Development',
		slug: 'fullstack-development',
		description: 'Building and shipping complete products.',
	},
	{
		id: 'category-frontend',
		name: 'Frontend Development',
		slug: 'frontend-development',
		description: 'Performance, UI engineering and the web platform.',
	},
];

const CATEGORY_FOR: Record<string, string> = {
	'Artificial Intelligence': '3dQVwk0aGWQovoE7pMUMOk',
	'Fullstack Development': 'category-fullstack',
	'Frontend Development': 'category-frontend',
};

/** post id → short name for the internal name */
const POSTS: Record<string, string> = {
	'7z5vb52toDFg5RwSRfiAnb': 'What is agentic AI',
	'6e9mHb6Bm4zzpxxwzzx7ER': 'What is MCP',
	'5VlyQrYsM68LnF9xpvlWg3': 'Frontend performance',
	'29wwefKd4Wkrk91zqwJGJ1': 'Local AI resume builder',
	'6A1OC2szjsjeAsurlOo96V': 'Meet Orbit',
};

const AUTHOR_AVATAR = '1SItQRgPAMPfK5T4jBJ66C';

interface Node {
	nodeType: string;
	value?: string;
	content?: Node[];
}

const cleanBody = (node: Node): Node => ({
	...node,
	nodeType: node.nodeType === 'heading-1' ? 'heading-2' : node.nodeType,
	...(node.value !== undefined && { value: node.value.replace(/\u200b/g, '') }),
	...(node.content && { content: node.content.map(cleanBody) }),
});

export default async function run(client: Client): Promise<void> {
	await client.upsertEntry('person-nithin-pradeep', 'person', {
		internalName: 'Person — Nithin Pradeep',
		name: 'Nithin Pradeep',
		role: 'Senior Technical Consultant, EY',
		avatar: link(AUTHOR_AVATAR, 'Asset'),
	});

	for (const category of CATEGORIES) {
		await client.upsertEntry(category.id, 'blogCategory', {
			internalName: `Category — ${category.name}`,
			name: category.name,
			slug: category.slug,
			description: category.description,
		});
	}
	await client.upsertEntry('4595Tnh4rLwMc67O3xSyPj', 'blogCategory', {
		internalName: 'Category — Development (deprecated)',
	});
	await client.tagEntry('4595Tnh4rLwMc67O3xSyPj', ['deprecated']);
	for (const tag of await client.getEntries({ content_type: 'blogTag' })) {
		await client.tagEntry(tag.sys.id, ['deprecated']);
	}

	for (const [id, short] of Object.entries(POSTS)) {
		const post = await client.getEntry(id);
		if (!post) continue;
		const seoTitle = value<string>(post, 'seoTitle');
		const seoDescription = value<string>(post, 'seoDescription');
		if (seoTitle || seoDescription) {
			await client.upsertEntry(`seo-post-${id}`, 'seo', {
				internalName: `SEO — Post ${short}`,
				title: seoTitle,
				description: seoDescription,
				noIndex: false,
			});
		}
		const category = CATEGORY_FOR[value<string>(post, 'category') ?? ''];
		const body = value<Node>(post, 'content');
		await client.upsertEntry(id, 'blogPost', {
			internalName: `Post — ${short}`,
			author: link('person-nithin-pradeep', 'Entry'),
			...(category && { blogCategory: link(category, 'Entry') }),
			...((seoTitle || seoDescription) && {
				seo: link(`seo-post-${id}`, 'Entry'),
			}),
			...(body && { content: cleanBody(body) }),
			tags: value<string[]>(post, 'tags')?.map((tag) => tag.trim()),
		});
	}
}
