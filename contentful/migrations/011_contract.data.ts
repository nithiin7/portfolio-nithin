/**
 * Renames Home Sections and permanently deletes the deprecated entries (and
 * every Portfolio Card, so 012 can delete that type). Backup taken first:
 * backups/contentful-2026-11-13-pre-contract/.
 */
import { value, type Client } from '../lib/cma.ts';

const DEPRECATED_TYPES = [
	'portfolioCard',
	'title',
	'description',
	'list',
	'url',
	'imageCard',
	'experienceCard',
	'blogTag',
];

const LABEL: Record<string, string> = {
	hero: 'Hero',
	work: 'Work',
	about: 'About',
	capabilities: 'Capabilities',
	career: 'Career',
	certifications: 'Certifications',
	collaborations: 'Collaborations',
	testimonials: 'Testimonials',
};

export default async function run(client: Client): Promise<void> {
	const doomed = new Set<string>();
	for (const type of DEPRECATED_TYPES) {
		for (const entry of await client.getEntries({ content_type: type })) {
			doomed.add(entry.sys.id);
		}
	}
	for (const entry of await client.getEntries({
		'metadata.tags.sys.id[in]': 'deprecated',
	})) {
		doomed.add(entry.sys.id);
	}
	// 49 at the time of writing (42 tagged + 7 retired cards); refuse surprises
	if (doomed.size > 55) {
		throw new Error(`Refusing to delete ${doomed.size} entries (expected ~49)`);
	}
	for (const id of doomed) await client.deleteEntry(id);
	console.log(`Deleted ${doomed.size} deprecated entries`);

	for (const section of await client.getEntries({ content_type: 'section' })) {
		const key = value<string>(section, 'key');
		if (key) {
			await client.upsertEntry(section.sys.id, 'section', {
				name: `Home — ${LABEL[key]}`,
			});
		}
	}
}
