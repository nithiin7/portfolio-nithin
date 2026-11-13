/** Dates, tech lists and names for the five roles. Drafts only. */
import type { Client } from '../lib/cma.ts';
import { value } from '../lib/cma.ts';

/** id → [start, end | undefined, location] (from the old free-text durations) */
const ROLES: Record<string, [string, string | undefined, string]> = {
	'7DJ36T9MzlOLnoiK0V1Rcf': ['2026-08-01', undefined, 'Bangalore, India'],
	v7FzPHQ0POfNPqYwJ7KDS: ['2025-07-01', '2026-08-01', 'Noida, India'],
	'4hxTxdQcZC34sMObvUhe3n': ['2025-02-01', '2025-07-01', 'Kochi, India'],
	'4HyRWNaFbSpUaauETB8TIA': ['2023-10-01', '2025-02-01', 'Kochi, India'],
	LBcMjBOzV2IXkDByBP2t4: ['2022-07-01', '2023-10-01', 'Kochi, India'],
};

const SPELLING: Record<string, string> = {
	Wordpress: 'WordPress',
	VectorDB: 'Vector DB',
};

/** "'LangGraph','Python', 'React'," → ["LangGraph", "Python", "React"] */
const parseList = (text = ''): string[] =>
	text
		.split(',')
		.map((item) =>
			item
				.trim()
				.replace(/^['"]|['"]$/g, '')
				.trim()
		)
		.filter(Boolean)
		.map((item) => SPELLING[item] ?? item);

export default async function run(client: Client): Promise<void> {
	for (const [id, [startDate, endDate, location]] of Object.entries(ROLES)) {
		const role = await client.getEntry(id);
		const title = value<string>(role, 'title');
		const company = value<string>(role, 'company');
		await client.upsertEntry(id, 'careerExperience', {
			internalName: `Role — ${company}, ${title}`,
			startDate,
			endDate,
			location,
			techStack: parseList(value<string>(role, 'technologies')),
		});
	}
}
