import { BLOCKS, type Document } from '@contentful/rich-text-types';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getApolloClient } from 'clients/apollo';
import {
	loadBlogPost,
	loadBlogPosts,
	loadHome,
	loadSiteSettings,
	toBlogPost,
	toPortfolioItem,
} from 'helpers/contentful';
import type {
	BlogPostItem,
	RawHomeSection,
	RawProjectCard,
	RawSiteSettings,
} from 'types/contentful';

vi.mock('server-only', () => ({}));
vi.mock('clients/apollo', () => ({ getApolloClient: vi.fn() }));

const query = vi.fn();

beforeEach(() => {
	query.mockReset();
	vi.mocked(getApolloClient).mockReturnValue({
		query,
	} as unknown as ReturnType<typeof getApolloClient>);
});

const respond = (data: unknown, error?: unknown): void => {
	query.mockResolvedValueOnce({ data, error });
};

const unresolvable = {
	errors: [{ extensions: { contentful: { code: 'UNRESOLVABLE_LINK' } } }],
};

const paragraph = (text: string): Document['content'][number] => ({
	nodeType: BLOCKS.PARAGRAPH,
	data: {},
	content: [{ nodeType: 'text', value: text, marks: [], data: {} }],
});

const card = (overrides: Partial<RawProjectCard> = {}): RawProjectCard => ({
	sys: { id: 'p1' },
	id: 1,
	slug: 'orbit',
	title: 'Orbit',
	...overrides,
});

const siteSettings = (
	overrides: Partial<RawSiteSettings> = {}
): RawSiteSettings => ({
	name: 'Nithin Pradeep',
	role: 'Engineer',
	company: 'EY',
	city: 'Bangalore',
	countryCode: 'IN',
	timeZone: 'Asia/Kolkata',
	availabilityLabel: 'Available',
	email: 'hi@example.com',
	...overrides,
});

describe('toPortfolioItem', () => {
	it('prefers tech highlights and maps optional fields to undefined', () => {
		const item = toPortfolioItem(
			card({
				techHighlights: ['Next.js'],
				tech: ['a', 'b', 'c', 'd', 'e'],
				spotlightImage: {
					url: '//images.ctfassets.net/l.png',
					description: 'Light',
				},
			})
		);

		expect(item).toMatchObject({
			id: 1,
			slug: 'orbit',
			tech: ['Next.js'],
			image: { url: '//images.ctfassets.net/l.png', description: 'Light' },
			imageDark: null,
			summary: undefined,
			demo: undefined,
		});
	});

	it('falls back to the first four tech tags', () => {
		expect(
			toPortfolioItem(card({ tech: ['a', 'b', 'c', 'd', 'e'] })).tech
		).toEqual(['a', 'b', 'c', 'd']);
	});
});

describe('loadSiteSettings', () => {
	it('converts links and builds default SEO when none is set', async () => {
		respond({
			siteSettingsCollection: {
				items: [
					siteSettings({
						socialsCollection: {
							items: [
								{
									label: 'GitHub',
									url: 'https://github.com/x',
									icon: 'github',
								},
								null,
							],
						},
					}),
				],
			},
		});

		const site = await loadSiteSettings();

		expect(site.socials).toEqual([
			{
				label: 'GitHub',
				url: 'https://github.com/x',
				icon: 'github',
				detail: undefined,
				openInNewTab: true,
			},
		]);
		expect(site.availability).toEqual({ open: false, label: 'Available' });
		expect(site.seo).toEqual({
			title: 'Nithin Pradeep — Engineer @ EY',
			description: 'Engineer at EY.',
		});
	});
});

describe('runQuery error policy', () => {
	it('renders around unresolvable links', async () => {
		respond(
			{ siteSettingsCollection: { items: [siteSettings()] } },
			unresolvable
		);

		await expect(loadSiteSettings()).resolves.toMatchObject({
			name: 'Nithin Pradeep',
		});
	});

	it('throws on any other GraphQL error', async () => {
		const error = { errors: [{ message: 'TOO_COMPLEX_QUERY' }] };
		respond({ siteSettingsCollection: { items: [siteSettings()] } }, error);

		await expect(loadBlogPosts()).rejects.toBe(error);
	});

	it('throws when Contentful returns no data', async () => {
		respond(undefined);

		await expect(loadBlogPosts()).rejects.toThrow(
			'Contentful returned no data'
		);
	});
});

describe('loadHome', () => {
	const sections: (RawHomeSection | null)[] = [
		{ key: 'hero', ctasCollection: { items: [] } },
		null,
		{
			key: 'manifesto',
			heading: 'I build {word} products.',
			words: ['useful', ' ', 'fast'],
		},
		{ heading: 'No key, so it is ignored' },
		{
			key: 'about',
			heading: 'About.',
			body: {
				json: {
					nodeType: BLOCKS.DOCUMENT,
					data: {},
					content: [paragraph('First.'), paragraph('  '), paragraph('Second.')],
				},
			},
			statsCollection: {
				items: [{ value: 4, label: 'Years', suffix: '+' }],
			},
		},
		{
			key: 'work',
			itemsCollection: {
				items: [
					{ __typename: 'PortfolioDetails', ...card() },
					{ __typename: 'Principle', title: 'x', body: 'y' },
				],
			},
		},
		{
			key: 'collaborations',
			itemsCollection: {
				items: [
					{
						__typename: 'Link',
						label: 'EY',
						url: 'https://ey.com',
						logo: {
							url: '//images.ctfassets.net/ey.svg',
							width: 40,
							height: 80,
						},
					},
					{ __typename: 'Link', label: 'No logo', url: 'https://x.com' },
					{
						__typename: 'Company',
						name: 'HSBC',
						slug: 'hsbc',
						websiteUrl: 'https://www.hsbc.com/',
						showLogo: false,
						logo: {
							url: '//images.ctfassets.net/hsbc.svg',
							width: 316,
							height: 85,
						},
					},
				],
			},
		},
		{
			key: 'career',
			itemsCollection: {
				items: [
					{
						__typename: 'CareerExperience',
						sys: { id: 'role' },
						title: 'Engineer',
						companyName: 'Old text',
						employer: {
							name: 'White Rabbit Group',
							slug: 'white-rabbit-group',
						},
						startDate: '2022-07-01',
					},
				],
			},
		},
		{
			key: 'testimonials',
			itemsCollection: {
				items: [
					{
						__typename: 'TestimonialCard',
						sys: { id: 'with' },
						review: 'Great.',
						reviewer: 'Ada',
						organisation: 'Pixielanes',
						company: {
							name: 'Pixielanes',
							slug: 'pixielanes',
							logo: {
								url: '//images.ctfassets.net/p.svg',
								width: 2,
								height: 1,
							},
						},
					},
					{
						__typename: 'TestimonialCard',
						sys: { id: 'without' },
						review: 'Kind.',
						reviewer: 'Grace',
						company: null,
					},
				],
			},
		},
	] as (RawHomeSection | null)[];

	it('keeps CMS order, finds sections by key and converts each one', async () => {
		respond({
			pageCollection: { items: [{ sectionCollection: { items: sections } }] },
		});

		const home = await loadHome();

		expect(home.order).toEqual([
			'hero',
			'manifesto',
			'about',
			'work',
			'collaborations',
			'career',
			'testimonials',
		]);
		expect(home.manifesto).toEqual({
			before: 'I build ',
			after: ' products.',
			words: ['useful', 'fast'],
		});
		expect(home.about.bio).toEqual(['First.', 'Second.']);
		expect(home.about.stats).toEqual([
			{ value: 4, suffix: '+', label: 'Years', compact: false },
		]);
		expect(home.work.projects.map((project) => project.slug)).toEqual([
			'orbit',
		]);
		expect(home.collaborations.items).toEqual([
			{
				name: 'EY',
				slug: 'ey',
				url: 'https://ey.com',
				logoUrl: 'https://images.ctfassets.net/ey.svg',
				ratio: 0.5,
				showLogo: true,
			},
			{
				name: 'HSBC',
				slug: 'hsbc',
				url: 'https://www.hsbc.com/',
				logoUrl: 'https://images.ctfassets.net/hsbc.svg',
				ratio: 316 / 85,
				showLogo: false,
			},
		]);
		expect(home.career.experiences).toMatchObject([
			{
				company: 'White Rabbit Group',
				employer: {
					name: 'White Rabbit Group',
					slug: 'white-rabbit-group',
					logoUrl: undefined,
					showLogo: true,
				},
			},
		]);
		expect(home.testimonials.items.map((item) => item.company)).toEqual([
			{
				name: 'Pixielanes',
				slug: 'pixielanes',
				logoUrl: 'https://images.ctfassets.net/p.svg',
				ratio: 2,
				showLogo: true,
				url: undefined,
			},
			undefined,
		]);
	});

	it('drops the manifesto without a {word} slot or two words', async () => {
		respond({
			pageCollection: {
				items: [
					{
						sectionCollection: {
							items: [
								{ key: 'manifesto', heading: 'Static', words: ['a', 'b'] },
							],
						},
					},
				],
			},
		});

		expect((await loadHome()).manifesto).toBeUndefined();
	});
});

describe('blog loaders', () => {
	const post = (overrides: Partial<BlogPostItem> = {}): BlogPostItem =>
		({
			sys: { id: 'b1' },
			title: 'What is MCP',
			slug: 'what-is-mcp',
			excerpt: 'Excerpt',
			publishedDate: '2026-01-10',
			readTime: 4,
			...overrides,
		}) as BlogPostItem;

	it('converts posts and skips undated drafts', async () => {
		respond({
			blogPostCollection: {
				items: [post(), post({ slug: 'draft', publishedDate: '' })],
			},
		});

		const posts = await loadBlogPosts();

		expect(posts.map((item) => item.slug)).toEqual(['what-is-mcp']);
		expect(posts[0]).toMatchObject({
			id: 'b1',
			category: '',
			tags: [],
			updatedDate: '2026-01-10',
			featuredImage: { url: '' },
		});
		expect(query).toHaveBeenCalledWith(
			expect.objectContaining({
				variables: expect.objectContaining({ limit: 100, skip: 0 }),
			})
		);
	});

	it('returns undefined for a missing slug', async () => {
		respond({ blogPostCollection: { items: [] } });

		await expect(loadBlogPost('nope')).resolves.toBeUndefined();
	});

	it('toBlogPost uses the updated date when present', () => {
		expect(toBlogPost(post({ updatedDate: '2026-02-01' })).updatedAt).toBe(
			'2026-02-01'
		);
	});
});
