/**
 * Creates Home — Manifesto and lists it right after the hero in Page "home".
 * Drafts only.
 */
import { link, value, type Client } from '../lib/cma.ts';

const HOME = '6kfivsXHotzx7ujsvjZNef';
const HERO = '3klkuOZOMQ7lSleSc6h321';
const MANIFESTO = 'home-manifesto';

interface Ref {
	sys: { id: string };
}

export default async function run(client: Client): Promise<void> {
	await client.upsertEntry(MANIFESTO, 'section', {
		name: 'Home — Manifesto',
		key: 'manifesto',
		heading: 'I build {word} that people actually trust.',
		words: [
			'AI agents',
			'guardrails',
			'MCP servers',
			'RAG pipelines',
			'Text-to-Query systems',
		],
	});

	const home = await client.getEntry(HOME);
	const ids = (value<Ref[]>(home, 'section') ?? [])
		.map((ref) => ref.sys.id)
		.filter((id) => id !== MANIFESTO);
	const at = ids.indexOf(HERO) + 1;
	ids.splice(at, 0, MANIFESTO);

	await client.upsertEntry(HOME, 'page', {
		section: ids.map((id) => link(id, 'Entry')),
	});
}
