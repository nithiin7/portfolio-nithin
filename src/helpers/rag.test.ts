import { describe, expect, it } from 'vitest';

import {
	chunkMarkdown,
	cosineSimilarity,
	findRelevantChunks,
	type EmbeddedChunk,
} from 'helpers/rag';

describe('chunkMarkdown', () => {
	it('creates one chunk per heading section, labelled with title and heading', () => {
		const markdown = [
			'# Projects',
			'',
			'## Spotify Migration',
			'Migrated the site to Next.js.',
			'',
			'## Game Awards',
			'Handled 1M concurrent users.',
		].join('\n');

		const chunks = chunkMarkdown(markdown, 'projects.md');

		expect(chunks).toHaveLength(2);
		expect(chunks[0].text).toBe(
			'Projects — Spotify Migration\n\nMigrated the site to Next.js.'
		);
		expect(chunks[1].text).toContain('Projects — Game Awards');
		expect(chunks[0].source).toBe('projects.md');
	});

	it('captures intro text before the first section heading', () => {
		const markdown = '# About\n\nIntro paragraph.\n\n## Details\nMore.';

		const chunks = chunkMarkdown(markdown, 'about.md');

		expect(chunks.map((c) => c.text)).toEqual([
			'About\n\nIntro paragraph.',
			'About — Details\n\nMore.',
		]);
	});

	it('splits oversized sections by paragraph', () => {
		const paragraph = 'word '.repeat(200).trim();
		const markdown = `# Doc\n\n## Long\n${paragraph}\n\n${paragraph}\n\n${paragraph}`;

		const chunks = chunkMarkdown(markdown, 'doc.md');

		expect(chunks.length).toBeGreaterThan(1);
		chunks.forEach((chunk) => {
			expect(chunk.text).toContain('Doc — Long');
		});
	});

	it('ignores empty sections and returns nothing for empty input', () => {
		expect(
			chunkMarkdown('# Title\n\n## Empty\n\n## Also Empty', 'a.md')
		).toEqual([]);
		expect(chunkMarkdown('', 'a.md')).toEqual([]);
	});
});

describe('cosineSimilarity', () => {
	it('returns 1 for identical vectors and 0 for orthogonal ones', () => {
		expect(cosineSimilarity([1, 2, 3], [1, 2, 3])).toBeCloseTo(1);
		expect(cosineSimilarity([1, 0], [0, 1])).toBeCloseTo(0);
	});

	it('returns 0 for zero vectors instead of NaN', () => {
		expect(cosineSimilarity([0, 0], [1, 1])).toBe(0);
	});
});

describe('findRelevantChunks', () => {
	const makeChunk = (id: string, vector: number[]): EmbeddedChunk => ({
		text: id,
		source: 'test.md',
		hash: id,
		vector,
	});

	const chunks = [
		makeChunk('exact', [1, 0]),
		makeChunk('close', [0.9, 0.1]),
		makeChunk('unrelated', [0, 1]),
	];

	it('ranks by similarity and drops chunks below the threshold', () => {
		const result = findRelevantChunks([1, 0], chunks);

		expect(result.map((c) => c.text)).toEqual(['exact', 'close']);
	});

	it('respects topK', () => {
		const result = findRelevantChunks([1, 0], chunks, 1);

		expect(result.map((c) => c.text)).toEqual(['exact']);
	});
});
