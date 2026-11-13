/**
 * Fills the reshaped Portfolio Project fields and tags what's replaced.
 * Drafts only: published entries show "Changed" until you publish them.
 */
import { link, value, type Client } from '../lib/cma.ts';

/** details id → [internal name, slug, card entry id] */
const PROJECTS: Record<string, [string, string, string]> = {
	'4KeQS8ivcF0O3VBdngD1St': ['Orbit', 'orbit', '7zanvEHfaLx37bfcKtoor1'],
	Q1jbQToloOvcj3F4vr6V4: ['Persona', 'persona', 'X7KELYbuf8wwcummQMyAn'],
	'3cLnEiwGwIBhxIu49TFAw6': [
		'Remote File Server MCP',
		'remote-file-server-mcp',
		'z3S35uVRsW7SOUzfj0Vk1',
	],
	'4GYEu0VgieUOpZceHfS5Ip': ['RepoChat', 'repochat', '3kNJVDlZai579EbHSOFm2Z'],
	'7qkNDp3vck6IbBqawFCBz4': ['PlateAI', 'plateai', '5EWoAXXJZy8OeFmKF3iLXf'],
	jfIe9V2O4IBWVEJHXaog2: ['Lang2Query', 'lang2query', '7n5rpoFy4a5jjDzFPIwsO3'],
	'3uEP4psE98lhcIe9nSSkfD': ['TradeIT', 'tradeit', '6OovfAIuutQf7cyyzpMoWK'],
};

/** Audit P0: TradeIT's dark cover pointed at the Remote File Server MCP plate. */
const DARK_COVER_FIX: Record<string, string> = {
	'3uEP4psE98lhcIe9nSSkfD': '4o3ntj1W3nyqh9r0Xh3BTd',
};

const SPELLING: Record<string, string> = {
	'Fast API': 'FastAPI',
	'Open AI': 'OpenAI',
	'Torch Vision': 'TorchVision',
	'MCP (Model Context Protocol)': 'MCP',
};
const spell = (items: string[] = []): string[] =>
	items.map((item) => SPELLING[item.trim()] ?? item.trim());

export default async function run(client: Client): Promise<void> {
	for (const [id, [name, slug, cardId]] of Object.entries(PROJECTS)) {
		const project = await client.getEntry(id);
		const card = await client.getEntry(cardId);
		const github = value<string>(project, 'github');
		const demo = value<string>(project, 'demo');
		await client.upsertEntry(id, 'portfolioDetails', {
			name: `Project — ${name}`,
			slug,
			tech: spell(value<string[]>(project, 'tech')),
			techHighlights: spell(value<string[]>(card, 'tech')).slice(0, 4),
			demo: demo && demo !== github ? demo : undefined,
			...(DARK_COVER_FIX[id] && {
				spotlightImageDark: link(DARK_COVER_FIX[id], 'Asset'),
			}),
		});
		await client.tagEntry(cardId, ['deprecated']);
	}

	const retiredTypes = ['portfolioDetails', 'portfolioCard'];
	for (const contentType of retiredTypes) {
		const drafts = await client.getEntries({
			content_type: contentType,
			'sys.publishedVersion[exists]': 'false',
		});
		for (const entry of drafts) {
			if (!PROJECTS[entry.sys.id])
				await client.tagEntry(entry.sys.id, ['retired']);
		}
	}
}
