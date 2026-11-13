/**
 * Moves each homepage section's content out of its nested title/list/section
 * entries into the typed Home Section fields, then tags the leftovers
 * deprecated. Headings are copied as they are; casing fixes are in
 * COPY_REVIEW.md. Drafts only.
 */
import { link, richText, value, type Client } from '../lib/cma.ts';

interface Ref {
	sys: { id: string };
}

/** Home section entry id → key */
const SECTIONS: Record<string, string> = {
	'3klkuOZOMQ7lSleSc6h321': 'hero',
	'3lxZtrQlAKMdsyQNOiEIsF': 'work',
	'3laR4SFbCTEmKxfTBBUIHK': 'about',
	'1jY6tF3C3bluX7tTocnd7X': 'capabilities',
	NZ1DVJ2ywVvgRvT3amwpp: 'career',
	'5Ujbzk3eKm0jPcPsMY9udM': 'certifications',
	'1d8ZkwuoVMS47wJLeyEsoT': 'collaborations',
	'2l25aluiMnwLyDJgTf3iAp': 'testimonials',
};

/** Portfolio Card → Portfolio Project, so Work keeps the card order. */
const CARD_TO_PROJECT: Record<string, string> = {
	'7zanvEHfaLx37bfcKtoor1': '4KeQS8ivcF0O3VBdngD1St',
	X7KELYbuf8wwcummQMyAn: 'Q1jbQToloOvcj3F4vr6V4',
	z3S35uVRsW7SOUzfj0Vk1: '3cLnEiwGwIBhxIu49TFAw6',
	'3kNJVDlZai579EbHSOFm2Z': '4GYEu0VgieUOpZceHfS5Ip',
	'5EWoAXXJZy8OeFmKF3iLXf': '7qkNDp3vck6IbBqawFCBz4',
	'7n5rpoFy4a5jjDzFPIwsO3': 'jfIe9V2O4IBWVEJHXaog2',
	'6OovfAIuutQf7cyyzpMoWK': '3uEP4psE98lhcIe9nSSkfD',
};

const ABOUT_BIO = [
	"I'm Nithin, a Senior Technical Consultant at EY in Bangalore. I build AI agents, guardrails and MCP infrastructure for enterprise teams — and the full-stack products that put them in people's hands.",
	'Before EY I spent four years shipping at Paytm Payments Bank and White Rabbit Group: RAG pipelines and LLM query agents for compliance and finance teams, and web platforms for Spotify and The Game Awards that held up under a million concurrent users.',
];

const HERO_PITCH = {
	nodeType: 'document',
	data: {},
	content: [
		{
			nodeType: 'paragraph',
			data: {},
			content: [
				{ nodeType: 'text', value: 'I build AI agents, ', marks: [], data: {} },
				{
					nodeType: 'text',
					value: 'guardrails',
					marks: [{ type: 'italic' }],
					data: {},
				},
				{
					nodeType: 'text',
					value:
						' & MCP infrastructure — and the full-stack products around them.',
					marks: [],
					data: {},
				},
			],
		},
	],
};

const COLLABORATORS = [
	'ey',
	'hsbc',
	'morgan-stanley',
	'paytm-payments-bank',
	'spotify',
	'spotify-codes',
	'game-awards',
	'white-rabbit',
];
const PRINCIPLES = [
	'thin-slice-first',
	'guardrails-ship-with-the-feature',
	'measure-then-optimise',
	'write-it-down',
];
const CAPABILITIES = ['fullstack', 'ai-systems', 'other'];

const refs = (ids: string[]) => ids.map((id) => link(id, 'Entry'));

export default async function run(client: Client): Promise<void> {
	await client.upsertEntry('link-cta-start-project', 'link', {
		internalName: 'Link — CTA Start a project',
		label: 'Start a project',
		url: '/contact',
		openInNewTab: false,
	});
	await client.upsertEntry('link-cta-see-work', 'link', {
		internalName: 'Link — CTA See selected work',
		label: 'See selected work',
		url: '/#portfolio',
		openInNewTab: false,
	});

	const leftovers = new Set<string>();

	for (const [id, key] of Object.entries(SECTIONS)) {
		const section = await client.getEntry(id);
		const contents = value<Ref[]>(section, 'contents') ?? [];
		const heading = contents[0]
			? await client.getEntry(contents[0].sys.id)
			: undefined;
		const inner = contents[1]
			? await client.getEntry(contents[1].sys.id)
			: undefined;
		const innerItems = value<Ref[]>(inner, 'contents') ?? [];
		const isTitle = heading?.sys.contentType.sys.id === 'title';
		for (const ref of contents) leftovers.add(ref.sys.id);

		const fields: Record<string, unknown> = {
			key,
			heading: isTitle ? value<string>(heading, 'title') : undefined,
			lede:
				isTitle && key !== 'work'
					? value<string>(heading, 'subTitle')
					: undefined,
		};

		switch (key) {
			case 'hero':
				Object.assign(fields, {
					heading: undefined,
					lede: undefined,
					body: HERO_PITCH,
					ctas: refs(['link-cta-start-project', 'link-cta-see-work']),
				});
				break;
			case 'work':
				fields.items = refs(
					innerItems.map((ref) => CARD_TO_PROJECT[ref.sys.id]).filter(Boolean)
				);
				break;
			case 'about': {
				const portrait = await client.getEntry(contents[1].sys.id);
				Object.assign(fields, {
					body: richText(ABOUT_BIO),
					image: value(portrait, 'image'),
					items: refs(PRINCIPLES.map((slug) => `principle-${slug}`)),
					stats: refs(['stat-concurrent-users']),
				});
				for (const ref of contents) leftovers.add(ref.sys.id);
				break;
			}
			case 'capabilities':
				fields.items = refs(CAPABILITIES.map((slug) => `capability-${slug}`));
				for (const ref of contents.slice(1)) {
					const sub = await client.getEntry(ref.sys.id);
					for (const child of value<Ref[]>(sub, 'contents') ?? [])
						leftovers.add(child.sys.id);
				}
				break;
			case 'collaborations':
				fields.items = refs(COLLABORATORS.map((slug) => `link-collab-${slug}`));
				break;
			default:
				fields.items = innerItems.map((ref) => link(ref.sys.id, 'Entry'));
		}
		await client.upsertEntry(id, 'section', fields);
	}

	const pages: Record<string, [string, string | undefined]> = {
		'6kfivsXHotzx7ujsvjZNef': ['home', undefined],
		'2iFFj3zBLVlPiHOzmg0q5F': ['blog', 'seo-page-blog'],
		'51vmMNmhwqkT7Q9uSTwXNN': ['contact', 'seo-page-contact'],
	};
	for (const [id, [slug, seoId]] of Object.entries(pages)) {
		const page = await client.getEntry(id);
		if (seoId) {
			// The layout's title template appends " | Nithin Pradeep"; keep only the page part.
			const title = (value<string>(page, 'title') ?? slug).split(' | ')[0];
			await client.upsertEntry(seoId, 'seo', {
				internalName: `SEO — Page ${slug}`,
				title,
				description: value<string>(page, 'description'),
				noIndex: false,
			});
		}
		await client.upsertEntry(id, 'page', {
			name: `Page — ${slug}`,
			seo: link(seoId ?? 'seo-site', 'Entry'),
		});
	}

	const homeSectionIds = new Set(Object.keys(SECTIONS));
	for (const id of leftovers) {
		if (!homeSectionIds.has(id)) await client.tagEntry(id, ['deprecated']);
	}
	const orphans = [
		'7rVUs8bQzSQ3CBcgHExGQx',
		'4NZVHncl6OUOyPnFTpAsq3',
		'5ofcYY7CJkVc5edyochRmE',
		'2mWB5HSzwRh5JZdjYINxr1',
		'6vAnd1DpGEgV7eaIlji5iR',
		'5ZRlUVQuQkQjdTecxFiztD',
		'5grYb9vvoKZ8xxnLDBOMiD',
	];
	for (const id of orphans) await client.tagEntry(id, ['deprecated']);
}
