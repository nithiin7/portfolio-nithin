import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import {
	EMBEDDING_MODEL,
	chunkMarkdown,
	embedTexts,
	type EmbeddingsFile,
	type SourceChunk,
} from '../src/helpers/rag.ts';

const KNOWLEDGE_DIR = path.join(import.meta.dirname, '../data/knowledge');
const OUTPUT_FILE = path.join(import.meta.dirname, '../data/embeddings.json');
const BATCH_SIZE = 100;

const hashText = (text: string): string =>
	createHash('sha256').update(text).digest('hex').slice(0, 16);

const loadSourceChunks = async (): Promise<SourceChunk[]> => {
	let files: string[];

	try {
		files = await readdir(KNOWLEDGE_DIR);
	} catch {
		return [];
	}

	const chunks: SourceChunk[] = [];

	for (const file of files.filter((f) => f.endsWith('.md')).sort()) {
		const markdown = await readFile(path.join(KNOWLEDGE_DIR, file), 'utf8');
		chunks.push(...chunkMarkdown(markdown, file));
	}

	return chunks;
};

const loadExisting = async (): Promise<EmbeddingsFile> => {
	try {
		return JSON.parse(await readFile(OUTPUT_FILE, 'utf8')) as EmbeddingsFile;
	} catch {
		return { model: EMBEDDING_MODEL, chunks: [] };
	}
};

const main = async (): Promise<void> => {
	const checkOnly = process.argv.includes('--check');
	const sourceChunks = await loadSourceChunks();
	const existing = await loadExisting();

	const cache = new Map<string, number[]>();
	if (existing.model === EMBEDDING_MODEL) {
		for (const chunk of existing.chunks) {
			cache.set(chunk.hash, chunk.vector);
		}
	}

	const hashed = sourceChunks.map((chunk) => ({
		...chunk,
		hash: hashText(chunk.text),
	}));

	const upToDate =
		existing.model === EMBEDDING_MODEL &&
		existing.chunks.length === hashed.length &&
		existing.chunks.every((chunk, index) => chunk.hash === hashed[index].hash);

	if (checkOnly) {
		if (!upToDate) {
			console.error(
				'data/embeddings.json is out of date with data/knowledge — run `pnpm embed` and commit the result.'
			);
			process.exit(1);
		}
		console.log('Embeddings are up to date.');
		return;
	}

	if (upToDate) {
		console.log('Embeddings already up to date.');
		return;
	}

	const pending = hashed.filter((chunk) => !cache.has(chunk.hash));

	if (pending.length > 0) {
		const apiKey = process.env.OPENAI_API_KEY;

		if (!apiKey) {
			console.error('OPENAI_API_KEY is required to embed new chunks.');
			process.exit(1);
		}

		for (let i = 0; i < pending.length; i += BATCH_SIZE) {
			const batch = pending.slice(i, i + BATCH_SIZE);
			const vectors = await embedTexts(
				batch.map((chunk) => chunk.text),
				apiKey
			);
			batch.forEach((chunk, index) => cache.set(chunk.hash, vectors[index]));
		}
	}

	const output: EmbeddingsFile = {
		model: EMBEDDING_MODEL,
		chunks: hashed.map((chunk) => {
			const vector = cache.get(chunk.hash);
			if (!vector) throw new Error(`Missing vector for chunk ${chunk.hash}`);
			return { ...chunk, vector };
		}),
	};

	await mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
	await writeFile(OUTPUT_FILE, JSON.stringify(output));

	console.log(
		`Embedded ${pending.length} new chunk(s); wrote ${output.chunks.length} total to data/embeddings.json.`
	);
};

await main();
