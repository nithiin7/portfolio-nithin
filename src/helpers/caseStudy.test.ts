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
	buildCaseStudy,
	extractMetrics,
	nextInOrder,
	positionOf,
	splitHighlight,
} from './caseStudy';

const text = (value: string, bold = false): Text => ({
	nodeType: 'text',
	value,
	marks: bold ? [{ type: MARKS.BOLD }] : [],
	data: {},
});

const p = (...content: Text[]): TopLevelBlock => ({
	nodeType: BLOCKS.PARAGRAPH,
	data: {},
	content,
});

const h2 = (value: string): TopLevelBlock => ({
	nodeType: BLOCKS.HEADING_2,
	data: {},
	content: [text(value)],
});

const ul = (...items: Text[][]): TopLevelBlock => ({
	nodeType: BLOCKS.UL_LIST,
	data: {},
	content: items.map((content): Block => ({
		nodeType: BLOCKS.LIST_ITEM,
		data: {},
		content: [p(...content) as Block],
	})),
});

const asset = (id: string): TopLevelBlock => ({
	nodeType: BLOCKS.EMBEDDED_ASSET,
	data: { target: { sys: { id, type: 'Link', linkType: 'Asset' } } },
	content: [],
});

const doc = (...content: TopLevelBlock[]): { json: Document } => ({
	json: { nodeType: BLOCKS.DOCUMENT, data: {}, content },
});

describe('buildCaseStudy', () => {
	it('falls back to Overview + Features for unstructured entries', () => {
		const sections = buildCaseStudy({
			description: doc(p(text('An AI chatbot.'))),
			features: ['Streaming responses', 'Voice input'],
			hasGallery: true,
		});

		expect(sections.map((s) => [s.key, s.label])).toEqual([
			['problem', 'Overview'],
			['approach', 'Features'],
			['gallery', 'Gallery'],
		]);
		expect(sections[1]!.highlights).toEqual([
			{ body: 'Streaming responses' },
			{ body: 'Voice input' },
		]);
	});

	it('splits a structured description into Problem → Approach → Architecture → Outcome', () => {
		const assets = new Map([
			[
				'diagram',
				{ url: '//images.ctfassets.net/d.png', contentType: 'image/png' },
			],
		]);
		const sections = buildCaseStudy({
			description: doc(
				p(text('Intro line.')),
				h2('The Problem'),
				p(text('Repos are hard to read.')),
				h2('Approach'),
				p(text('RAG over an AST index.')),
				h2('Architecture'),
				asset('diagram'),
				p(text('Indexer → Chroma → FastAPI.')),
				h2('Results:'),
				ul([text('3×', true), text(' faster onboarding')]),
				p(text('Used daily by the team.'))
			),
			features: ['Local mode: nothing leaves your machine.'],
			assets,
		});

		expect(sections.map((s) => s.label)).toEqual([
			'Problem',
			'Approach',
			'Architecture',
			'Outcome',
		]);
		expect(sections[0]!.body?.content).toHaveLength(2);
		expect(sections[1]!.highlights).toEqual([
			{ title: 'Local mode', body: 'nothing leaves your machine.' },
		]);
		expect(sections[2]!.diagram?.url).toBe('//images.ctfassets.net/d.png');
		expect(sections[2]!.body?.content).toHaveLength(1);
		expect(sections[3]!.metrics).toEqual([
			{ value: '3×', label: 'faster onboarding' },
		]);
		expect(sections[3]!.body?.content).toHaveLength(1);
	});

	it('omits empty sections and keeps unknown H2s inside the current section', () => {
		const sections = buildCaseStudy({
			description: doc(
				h2('Problem'),
				p(text('Why.')),
				h2('Constraints'),
				p(text('Budget.')),
				h2('Outcome'),
				p(text(' '))
			),
			features: [],
		});

		expect(sections.map((s) => s.key)).toEqual(['problem']);
		expect(sections[0]!.body?.content).toHaveLength(3);
	});
});

describe('extractMetrics', () => {
	it('only treats a list as metrics when every item opens in bold', () => {
		const mixed = ul(
			[text('40%', true), text(' — less toil')],
			[text('plain')]
		);
		const { metrics, rest } = extractMetrics([mixed]);
		expect(metrics).toEqual([]);
		expect(rest).toEqual([mixed]);
	});
});

describe('splitHighlight', () => {
	it('keeps colons that are not a short title prefix', () => {
		expect(splitHighlight('Ratio 3:1 contrast')).toEqual({
			body: 'Ratio 3:1 contrast',
		});
	});
});

describe('nextInOrder / positionOf', () => {
	const order = [{ id: 1 }, { id: 2 }, { id: 3 }];

	it('wraps from the last project to the first', () => {
		expect(nextInOrder(order, 2)).toEqual({
			item: { id: 3 },
			position: 3,
			total: 3,
		});
		expect(nextInOrder(order, 3)).toEqual({
			item: { id: 1 },
			position: 1,
			total: 3,
		});
	});

	it('starts at the first project when the current one is not listed', () => {
		expect(nextInOrder(order, 99)?.item).toEqual({ id: 1 });
	});

	it('has no next project with fewer than two entries', () => {
		expect(nextInOrder([{ id: 1 }], 1)).toBeNull();
	});

	it('reports a 1-based position', () => {
		expect(positionOf(order, 2)).toEqual({ position: 2, total: 3 });
		expect(positionOf(order, 9)).toBeNull();
	});
});
