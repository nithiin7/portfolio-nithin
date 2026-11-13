/**
 * Company entries for the collaborators (reusing their published logo
 * assets), Career Role employers, and Home — Collaborations pointing at the
 * companies. Old collaborator Links are tagged `deprecated`. Drafts only.
 */
import { link, value, type Client } from '../lib/cma.ts';

interface Company {
	slug: string;
	name: string;
	url: string;
	/** Existing asset and Link ids use the old collaborator file stem. */
	legacy: string;
}

const COMPANIES: Company[] = [
	{ slug: 'ey', name: 'EY', url: 'https://www.ey.com/', legacy: 'ey' },
	{ slug: 'hsbc', name: 'HSBC', url: 'https://www.hsbc.com/', legacy: 'hsbc' },
	{
		slug: 'morgan-stanley',
		name: 'Morgan Stanley',
		url: 'https://www.morganstanley.com/',
		legacy: 'morgan-stanley',
	},
	{
		slug: 'paytm-payments-bank',
		name: 'Paytm Payments Bank',
		url: 'https://www.paytmbank.com/',
		legacy: 'paytm-payments-bank',
	},
	{
		slug: 'spotify',
		name: 'Spotify',
		url: 'https://connect.spotify.com/',
		legacy: 'spotify',
	},
	{
		slug: 'spotify-codes',
		name: 'Spotify Codes',
		url: 'https://www.spotifycodes.com/',
		legacy: 'spotify-codes',
	},
	{
		slug: 'the-game-awards',
		name: 'The Game Awards',
		url: 'https://thegameawards.com/',
		legacy: 'game-awards',
	},
	{
		slug: 'white-rabbit-group',
		name: 'White Rabbit Group',
		url: 'https://whiterabbit.group/',
		legacy: 'white-rabbit',
	},
];

/** Career Role `company` text → Company slug. */
const EMPLOYERS: Record<string, string> = {
	EY: 'ey',
	'Paytm Payments Bank': 'paytm-payments-bank',
	'White Rabbit Group': 'white-rabbit-group',
};

const COLLABORATIONS = 'collaborations';

interface Ref {
	sys: { id: string };
}

const companyId = (slug: string): string => `company-${slug}`;

export default async function run(client: Client): Promise<void> {
	for (const company of COMPANIES) {
		await client.upsertEntry(companyId(company.slug), 'company', {
			internalName: `Company — ${company.name}`,
			name: company.name,
			slug: company.slug,
			logo: link(`collab-${company.legacy}-logo`, 'Asset'),
			websiteUrl: company.url,
			showLogo: true,
		});
	}

	const roles = await client.getEntries({ content_type: 'careerExperience' });
	for (const role of roles) {
		const name = value<string>(role, 'company') ?? '';
		const slug = EMPLOYERS[name];
		if (!slug) throw new Error(`No Company for career role company "${name}"`);
		await client.upsertEntry(role.sys.id, 'careerExperience', {
			employer: link(companyId(slug), 'Entry'),
		});
	}

	const [section] = await client.getEntries({
		content_type: 'section',
		'fields.key': COLLABORATIONS,
	});
	if (!section) throw new Error('No Home — Collaborations section');
	const byLegacyLink = new Map(
		COMPANIES.map((company) => [
			`link-collab-${company.legacy}`,
			companyId(company.slug),
		])
	);
	const items = (value<Ref[]>(section, 'items') ?? []).map(
		(ref) => byLegacyLink.get(ref.sys.id) ?? ref.sys.id
	);
	await client.upsertEntry(section.sys.id, 'section', {
		items: items.map((id) => link(id, 'Entry')),
	});

	for (const id of byLegacyLink.keys()) {
		await client.tagEntry(id, ['deprecated']);
	}
}
