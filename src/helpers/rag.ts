export const EMBEDDING_MODEL = 'text-embedding-3-small';

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

interface OpenAIEmbeddingResponse {
	data: { embedding: number[]; index: number }[];
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

/**
 * Split a markdown document into retrieval chunks, one per heading section.
 * Each chunk is prefixed with "document title — section heading" so it stays
 * meaningful when read in isolation by the model.
 */
export const chunkMarkdown = (
	markdown: string,
	source: string
): SourceChunk[] => {
	const sections: { heading: string; body: string[] }[] = [];
	let title = '';
	let currentSection = { heading: '', body: [] as string[] };

	for (const line of markdown.split('\n')) {
		const match = /^(#{1,3})\s+(.*)/.exec(line);

		if (!match) {
			currentSection.body.push(line);
			continue;
		}

		sections.push(currentSection);

		if (match[1] === '#' && !title) {
			title = match[2].trim();
			currentSection = { heading: '', body: [] };
		} else {
			currentSection = { heading: match[2].trim(), body: [] };
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

export const embedTexts = async (
	texts: string[],
	apiKey: string
): Promise<number[][]> => {
	const response = await fetch('https://api.openai.com/v1/embeddings', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
		body: JSON.stringify({ model: EMBEDDING_MODEL, input: texts }),
	});

	if (!response.ok) {
		throw new Error(
			`OpenAI embeddings request failed: ${response.status} ${await response.text()}`
		);
	}

	const data = (await response.json()) as OpenAIEmbeddingResponse;

	return data.data
		.sort((a, b) => a.index - b.index)
		.map((item) => item.embedding);
};

export const cosineSimilarity = (a: number[], b: number[]): number => {
	let dot = 0;
	let normA = 0;
	let normB = 0;

	for (let i = 0; i < a.length; i++) {
		dot += a[i] * b[i];
		normA += a[i] * a[i];
		normB += b[i] * b[i];
	}

	const denominator = Math.sqrt(normA) * Math.sqrt(normB);

	return denominator === 0 ? 0 : dot / denominator;
};

/**
 * Return the topK chunks most similar to the query vector, dropping anything
 * below minSimilarity so unrelated questions get no padding context.
 */
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
