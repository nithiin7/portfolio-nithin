const MAX_CHUNK_CHARS = 1500;

export interface SourceChunk {
	text: string;
	source: string;
}

export interface EmbeddedChunk extends SourceChunk {
	hash: string;
	vector: number[];
}

export interface EmbeddingsFile {
	model: string;
	chunks: EmbeddedChunk[];
}

const splitLongText = (text: string): string[] => {
	if (text.length <= MAX_CHUNK_CHARS) return [text];

	const paragraphs = text.split(/\n{2,}/);
	const parts: string[] = [];
	let current = '';

	for (const paragraph of paragraphs) {
		if (current && current.length + paragraph.length > MAX_CHUNK_CHARS) {
			parts.push(current.trim());
			current = paragraph;
		} else {
			current = current ? `${current}\n\n${paragraph}` : paragraph;
		}
	}

	if (current.trim()) parts.push(current.trim());

	return parts;
};

export const chunkMarkdown = (
	markdown: string,
	source: string
): SourceChunk[] => {
	const sections: { heading: string; body: string[] }[] = [];
	let title = '';
	let currentSection = { heading: '', body: [] as string[] };

	for (const line of markdown.split('\n')) {
		const match = /^(#{1,3})\s+(.*)/.exec(line);
		const [, hashes, text = ''] = match ?? [];

		if (!match) {
			currentSection.body.push(line);
			continue;
		}

		sections.push(currentSection);

		if (hashes === '#' && !title) {
			title = text.trim();
			currentSection = { heading: '', body: [] };
		} else {
			currentSection = { heading: text.trim(), body: [] };
		}
	}
	sections.push(currentSection);

	const chunks: SourceChunk[] = [];

	for (const section of sections) {
		const body = section.body.join('\n').trim();
		if (!body) continue;

		const label = [title, section.heading].filter(Boolean).join(' — ');

		for (const part of splitLongText(body)) {
			chunks.push({
				text: label ? `${label}\n\n${part}` : part,
				source,
			});
		}
	}

	return chunks;
};

export const cosineSimilarity = (a: number[], b: number[]): number => {
	let dot = 0;
	let normA = 0;
	let normB = 0;

	a.forEach((x, i) => {
		const y = b[i] ?? 0;
		dot += x * y;
		normA += x * x;
		normB += y * y;
	});

	const denominator = Math.sqrt(normA) * Math.sqrt(normB);

	return denominator === 0 ? 0 : dot / denominator;
};

export const findRelevantChunks = (
	queryVector: number[],
	chunks: EmbeddedChunk[],
	topK = 4,
	minSimilarity = 0.25
): EmbeddedChunk[] =>
	chunks
		.map((chunk) => ({
			chunk,
			score: cosineSimilarity(queryVector, chunk.vector),
		}))
		.filter(({ score }) => score >= minSimilarity)
		.sort((a, b) => b.score - a.score)
		.slice(0, topK)
		.map(({ chunk }) => chunk);
