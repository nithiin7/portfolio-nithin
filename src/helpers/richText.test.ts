import {
	BLOCKS,
	MARKS,
	type Block,
	type Document,
	type Text,
	type TopLevelBlock,
} from '@contentful/rich-text-types';
import { describe, expect, it } from 'vitest';

import {
	codeBlockSource,
	createSlugger,
	extractHeadings,
	slugify,
} from './richText';

const text = (value: string, code = false): Text => ({
	nodeType: 'text',
	value,
	marks: code ? [{ type: MARKS.CODE }] : [],
	data: {},
});

const p = (...content: Text[]): Block => ({
	nodeType: BLOCKS.PARAGRAPH,
	data: {},
	content,
});

const heading = (
	nodeType: BLOCKS.HEADING_1 | BLOCKS.HEADING_2 | BLOCKS.HEADING_3,
	value: string
): TopLevelBlock => ({ nodeType, data: {}, content: [text(value)] });

const doc = (...content: TopLevelBlock[]): Document => ({
	nodeType: BLOCKS.DOCUMENT,
	data: {},
	content,
});

describe('slugify', () => {
	it('lowercases, strips punctuation and accents, hyphenates', () => {
		expect(slugify('It’s 100% Free — Everything Unlocked')).toBe(
			'its-100-free-everything-unlocked'
		);
		expect(slugify('Café  Déjà vu')).toBe('cafe-deja-vu');
	});
});

describe('createSlugger', () => {
	it('suffixes repeated headings so ids stay unique', () => {
		const slug = createSlugger();
		expect([slug('Setup'), slug('Setup'), slug('Setup')]).toEqual([
			'setup',
			'setup-2',
			'setup-3',
		]);
	});

	it('falls back when a heading has no sluggable characters', () => {
		expect(createSlugger()('🚀')).toBe('section');
	});
});

describe('extractHeadings', () => {
	it('maps CMS H1/H2 to level 2 and H3 to level 3, in document order', () => {
		const items = extractHeadings(
			doc(
				heading(BLOCKS.HEADING_1, 'Intro'),
				p(text('body')) as TopLevelBlock,
				heading(BLOCKS.HEADING_2, 'How it works'),
				heading(BLOCKS.HEADING_3, 'Key benefits')
			)
		);

		expect(items).toEqual([
			{ id: 'intro', text: 'Intro', level: 2 },
			{ id: 'how-it-works', text: 'How it works', level: 2 },
			{ id: 'key-benefits', text: 'Key benefits', level: 3 },
		]);
	});

	it('skips empty headings and tolerates a missing document', () => {
		expect(extractHeadings(doc(heading(BLOCKS.HEADING_2, '  ')))).toEqual([]);
		expect(extractHeadings(undefined)).toEqual([]);
	});
});

describe('codeBlockSource', () => {
	it('treats a paragraph made only of code-marked text as a code block', () => {
		expect(codeBlockSource(p(text('git clone repo\ncd repo\n', true)))).toBe(
			'git clone repo\ncd repo'
		);
	});

	it('leaves prose with inline code alone', () => {
		expect(
			codeBlockSource(p(text('Run '), text('pnpm dev', true), text(' now')))
		).toBeNull();
	});

	it('ignores empty and non-paragraph nodes', () => {
		expect(codeBlockSource(p(text('', true)))).toBeNull();
		expect(
			codeBlockSource(heading(BLOCKS.HEADING_2, 'x') as unknown as Block)
		).toBeNull();
	});
});
