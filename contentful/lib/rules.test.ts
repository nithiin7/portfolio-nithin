import { describe, expect, it } from 'vitest';

import {
	assetSlotProblems,
	bannedPhrases,
	hasRedirect,
	isPlannedFeature,
	isShouting,
	linksIn,
	misspelledNames,
	proseIn,
} from './rules.ts';

const link = (linkType: string, id: string) => ({
	sys: { type: 'Link', linkType, id },
});

const doc = (...content: unknown[]) => ({
	nodeType: 'document',
	data: {},
	content,
});

describe('linksIn', () => {
	it('finds single, array and rich-text links', () => {
		const fields = {
			image: link('Asset', 'a1'),
			items: [link('Entry', 'e1'), link('Entry', 'e2')],
			body: doc({
				nodeType: 'embedded-asset-block',
				data: { target: link('Asset', 'a2') },
				content: [],
			}),
			title: 'not a link',
		};
		expect(linksIn(fields)).toEqual([
			{ field: 'image', linkType: 'Asset', id: 'a1' },
			{ field: 'items', linkType: 'Entry', id: 'e1' },
			{ field: 'items', linkType: 'Entry', id: 'e2' },
			{ field: 'body', linkType: 'Asset', id: 'a2' },
		]);
	});

	it('ignores tag links', () => {
		expect(linksIn({ tag: link('Tag', 't1') })).toEqual([]);
	});
});

describe('proseIn', () => {
	it('skips identifier fields and inline code', () => {
		const fields = {
			slug: 'orbit',
			url: 'https://example.com',
			features: ['One', 'Two'],
			body: doc({
				nodeType: 'paragraph',
				content: [
					{ nodeType: 'text', value: 'Run ', marks: [] },
					{ nodeType: 'text', value: 'ollama pull', marks: [{ type: 'code' }] },
				],
			}),
		};
		expect(proseIn(fields)).toEqual([
			['features', 'One'],
			['features', 'Two'],
			['body', 'Run '],
		]);
	});
});

describe('misspelledNames', () => {
	it('flags non-canonical tech names', () => {
		expect(misspelledNames('Built with Langraph and NextJS on Nodejs')).toEqual(
			['NextJS → Next.js', 'Nodejs → Node.js', 'Langraph → LangGraph']
		);
	});

	it('accepts canonical names', () => {
		expect(
			misspelledNames('Next.js, Node.js, LangGraph, OpenAI Agents SDK, GitHub')
		).toEqual([]);
	});

	it('ignores URLs, domains and handles', () => {
		expect(
			misspelledNames('See github.com/nithiin7 or @openai and next.config.js')
		).toEqual([]);
	});
});

describe('bannedPhrases', () => {
	it('finds cliché wording', () => {
		expect(
			bannedPhrases('A seamless way to leverage AI for an unfair advantage')
		).toEqual(['seamless', 'leverage', 'unfair advantage']);
	});

	it('leaves plain copy alone', () => {
		expect(bannedPhrases('Orbit runs on your own server.')).toEqual([]);
	});
});

describe('isShouting', () => {
	it('flags multi-word ALL CAPS headings', () => {
		expect(isShouting('heading', 'SELECTED WORKS.')).toBe(true);
		expect(isShouting('heading', 'Selected works.')).toBe(false);
	});

	it('allows acronyms and non-heading fields', () => {
		expect(isShouting('title', 'MCP')).toBe(false);
		expect(isShouting('techStack', 'RAG MCP')).toBe(false);
	});
});

describe('isPlannedFeature', () => {
	it('flags planned work in features only', () => {
		expect(isPlannedFeature('features', 'Nutrition (planned)')).toBe(true);
		expect(isPlannedFeature('description', 'planned')).toBe(false);
	});
});

describe('assetSlotProblems', () => {
	it('reports wrong format and weight', () => {
		expect(
			assetSlotProblems('blogPost.featuredImage', {
				contentType: 'image/png',
				size: 2_000_000,
			})
		).toEqual([
			'blog featured image is png, expected webp',
			'blog featured image is 2.0 MB, limit 400 KB',
		]);
	});

	it('accepts a file within the slot rules', () => {
		expect(
			assetSlotProblems('link.logo', {
				contentType: 'image/svg+xml',
				size: 4_000,
			})
		).toEqual([]);
	});

	it('ignores unknown slots', () => {
		expect(
			assetSlotProblems('media.image', { contentType: 'image/gif' })
		).toEqual([]);
	});
});

describe('hasRedirect', () => {
	const config = `[['/blog/old-slug', '/blog/new'], ['/portfolio/a.b', '/x']]`;

	it('matches a quoted source path exactly', () => {
		expect(hasRedirect(config, '/blog/old-slug')).toBe(true);
		expect(hasRedirect(config, '/blog/old')).toBe(false);
	});

	it('escapes regex characters in the path', () => {
		expect(hasRedirect(config, '/portfolio/a.b')).toBe(true);
		expect(hasRedirect(config, '/portfolio/aXb')).toBe(false);
	});
});
