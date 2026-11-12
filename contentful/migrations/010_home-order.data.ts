/**
 * The site now renders Page "home" sections in their Contentful order, so set
 * that order to the one the site already shows. Adds Page "resume" with SEO.
 * Drafts only.
 */
import { link, type Client } from '../lib/cma.ts';

const HOME = '6kfivsXHotzx7ujsvjZNef';
const ORDER = [
	'3klkuOZOMQ7lSleSc6h321', // hero
	'3lxZtrQlAKMdsyQNOiEIsF', // work
	'3laR4SFbCTEmKxfTBBUIHK', // about
	'1jY6tF3C3bluX7tTocnd7X', // capabilities
	'NZ1DVJ2ywVvgRvT3amwpp', // career
	'5Ujbzk3eKm0jPcPsMY9udM', // certifications
	'1d8ZkwuoVMS47wJLeyEsoT', // collaborations
	'2l25aluiMnwLyDJgTf3iAp', // testimonials
];

export default async function run(client: Client): Promise<void> {
	await client.upsertEntry(HOME, 'page', {
		section: ORDER.map((id) => link(id, 'Entry')),
	});

	await client.upsertEntry('seo-page-resume', 'seo', {
		internalName: 'SEO — Page resume',
		title: 'Résumé',
		description:
			'Senior Technical Consultant at EY: experience, skills and certifications. Read online or download the PDF.',
		noIndex: false,
	});
	await client.upsertEntry('page-resume', 'page', {
		name: 'Page — resume',
		slug: 'resume',
		seo: link('seo-page-resume', 'Entry'),
	});
}
